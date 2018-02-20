import React, { Component } from 'react';
import styled from 'styled-components';
import TwilioVideo from 'twilio-video';
import {
  attachTracks,
  attachParticipantTracks,
  detachTracks,
  detachParticipantTracks
} from './twilio-tracks';
import Consults from './Consults';

const Main = styled.div`
  display: flex;
  position: relative;
  width: 80%;
  height: auto;
  margin: 20px auto;
  padding: 20px;
  background-color: #444;
  color: #dfdfdf;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Videos = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  height: auto;
  margin-bottom: 20px;
`;

const Video = styled.div`
  min-height: 200px;
  width: 50%;
  & video {
    width: 100%;
  }
`;

const InComingVideo = styled(Video)`
  background-color: #242424;
`;

const OutGoingVideo = styled(Video)`
  background-color: #131313;
`;

class App extends Component {
  state = {
    previewTracks: null,
    activeRoom: null,
    identity: null,
    token: null,
    roomName: null,
    userDetails: null,
    userConsults: null,
    liveConsultId: null,
    loadingConsult: false,
  };

  componentDidMount() {
    ///////////////////////////
    //this.updateConsultStatus('5a83a48393c9f0bf062df9da', 'SCHEDULED').then(result => { console.log('update consult result'); })
    //this.updateConsultStatus('5a83a5177b2ebabf2f217579', 'SCHEDULED').then(result => { console.log('update consult result'); })
    //////////////////////////

    // get logged in user
    const currentUserId = this.getCurrentUser();
    // get user details
    this.getUserById(currentUserId)
      .then(user => {
        const id = user._id;
        this.setState({ userDetails: user });
        setInterval(() => {
          this.apiGetConsults()
            .then(consults => {
              const userConsults = consults.filter(
                obj => user.role === 'Doctor'
                ? obj.doctorId === id
                : obj.patientId === id
              );
              if (JSON.stringify(this.state.userConsults) !== JSON.stringify(userConsults)) {
                this.setState({userConsults: userConsults});
              }
            })
            .catch(err => console.log(err));
        }, 800);
      })
      .catch(err => console.log(err));
    // twilio token
    this.apiGetToken(currentUserId)
      .then(res => {
        this.setState({
          identity: res.identity,
          token: res.token
        })
      })
      .catch(err => console.log(err));
  }

  componentWillUnMount = () => {
    if (this.state.activeRoom) this.state.activeRoom.disconnect();
  }

  getCurrentUser = () => {
    const url = new URL(window.location.href);
    return url.searchParams.get("user");
  }

  getUserById = async (id) => {
    const opts = { method: 'get' };
    const response = await fetch(`/api/user/${id}`, opts);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  apiGetConsults = async () => {
    const opts = { method: 'get' };
    const response = await fetch('/api/consults', opts);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  updateConsultStatus = async (id, status) => {
    const opts = {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({status: status})
    };
    const response = await fetch(`/api/consult/${id}`, opts);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  apiGetToken = async (id) => {
    const opts = { method: 'get' };
    const response = await fetch(`/api/token/${id}`, opts);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  // Successfully connected!
  roomJoined = (room) => {
    const {userDetails, previewTracks, liveConsultId} = this.state

    this.setState({
      activeRoom: room,
      loadingConsult: false,
    });
    console.log("Joined as '" + this.state.identity + "'");

    // update consult
    this.updateConsultStatus(liveConsultId, 'ACTIVE')
      .then(result => { console.log('update consult result', result); })
      .catch(err => console.log(err))

    // Attach LocalParticipant's Tracks, if not already attached.
    let outgoingPreviewContainer = document.getElementById('outgoing-video');
    if (!outgoingPreviewContainer.querySelector('video')) {
      attachParticipantTracks(room.localParticipant, outgoingPreviewContainer);
    }

    // Attach the Tracks of the Room's Participants.
    room.participants.forEach((participant) => {
      console.log("Already in Room: '" + participant.identity + "'");
      let incomingPreviewContainer = document.getElementById('incoming-video');
      attachParticipantTracks(participant, incomingPreviewContainer);
    });

    // When a Participant joins the Room, log the event.
    room.on('participantConnected', (participant) => {
      console.log("Joining: '" + participant.identity + "'");
    });

    // When a Participant adds a Track, attach it to the DOM.
    room.on('trackAdded', (track, participant) => {
      console.log(participant.identity + " added track: " + track.kind);
      let incomingPreviewContainer = document.getElementById('incoming-video');
      attachTracks([track], incomingPreviewContainer);
    });

    // When a Participant removes a Track, detach it from the DOM.
    room.on('trackRemoved', (track, participant) => {
      console.log(participant.identity + " removed track: " + track.kind);
      detachTracks([track]);
    });

    // When a Participant leaves the Room, detach its Tracks.
    room.on('participantDisconnected', (participant) => {
      console.log("Participant '" + participant.identity + "' left the room");
      detachParticipantTracks(participant);
      // if patient then dr has disconnected
      if (userDetails.role === 'Patient') {
        this.endConsult();
      }
    });

    // Once the LocalParticipant leaves the room, detach the Tracks
    // of all Participants, including that of the LocalParticipant.
    var that = this;
    room.on('disconnected', () => {
      console.log('Left');
      if (previewTracks) {
        previewTracks.forEach((track) => { track.stop(); });
      }
      detachParticipantTracks(room.localParticipant);
      room.participants.forEach(detachParticipantTracks);
      that.setState({
        activeRoom: null,
        liveConsultId: null,
        loadingConsult: false,
      });
      // update consult
      this.updateConsultStatus(liveConsultId, 'COMPLETED')
        .then(result => { console.log('update consult result', result); })
        .catch(err => console.log(err))
    });
  }

  beginConsult = (consultId) => {
    //event.preventDefault();
    const {previewTracks, token} = this.state;
    const roomName = `room-${consultId}`;
    this.setState({
      roomName: roomName,
      liveConsultId: consultId,
      loadingConsult: true,
    });
    console.log("Joining room '" + roomName + "'...");

    const connectOptions = {
      name: roomName,
      /*logLevel: 'debug'*/
    };

    if (previewTracks) {
      connectOptions.tracks = previewTracks;
    }

    // VideoCodecs=H264
    // Join the Room with the token from the server and the
    // LocalParticipant's Tracks.
    TwilioVideo.connect(token, connectOptions).then(this.roomJoined, (error) => {
      console.log('Could not connect to Twilio: ' + error.message);
    });
  }

  endConsult = () => {
    //event.preventDefault();
    console.log('Leaving room...');
    this.setState({
      loadingConsult: true,
    });
    this.state.activeRoom.disconnect();
  }

  render() {
    //console.log(this.state);
    const {userDetails, userConsults, liveConsultId, loadingConsult} = this.state;
    return (
      <Main>
        {userDetails && (<h3>{userDetails.role === 'Doctor' ? `Dr ${userDetails.name}` : userDetails.name}</h3>)}
        <Videos>
          <InComingVideo id="incoming-video" />
          <OutGoingVideo id="outgoing-video" />
        </Videos>
        {
          userDetails ?
            (<Consults
              role={userDetails.role}
              liveConsult={!!liveConsultId}
              consults={userConsults}
              beginConsult={this.beginConsult}
              endConsult={this.endConsult}
              loading={loadingConsult}
            />)
          : 'Loading user..'
        }
      </Main>
    );
  }
}

export default App;
