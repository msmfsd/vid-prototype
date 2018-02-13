import React, { Component } from 'react';
import styled from 'styled-components';
import TwilioVideo from 'twilio-video';
import {
  attachTracks,
  attachParticipantTracks,
  detachTracks,
  detachParticipantTracks
} from './twilio-tracks';

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

const Button = styled.button`
  background-color: #fff;
  color: #444;
  font-size: 18px;
  margin-right: 5px;
  cursor: pointer;
  &:disabled {
    cursor: default;
    opacity: 0.4;
  }
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
  };

  componentDidMount() {
    this.callApi()
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

  callApi = async () => {
    const response = await fetch('/api/token');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  setActiveRoom = (state) => {
    this.setState({ activeRoom: state });
  }

  // Successfully connected!
  roomJoined = (room) => {
    const {previewTracks} = this.state

    this.setActiveRoom(room)
    console.log("Joined as '" + this.state.identity + "'");

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
    });

    // Once the LocalParticipant leaves the room, detach the Tracks
    // of all Participants, including that of the LocalParticipant.
    var that = this;
    room.on('disconnected', () => {
      console.log('Left');
      if (previewTracks) {
        previewTracks.forEach((track) => {
          track.stop();
        });
      }
      detachParticipantTracks(room.localParticipant);
      room.participants.forEach(detachParticipantTracks);
      that.setActiveRoom(null)
    });
  }

  beginConsult = (event) => {
    event.preventDefault();
    const {previewTracks, token} = this.state
    const roomName = 'consultation1'

    this.setState({ roomName: roomName })
    console.log("Joining room '" + roomName + "'...");

    const connectOptions = {
      name: roomName,
      /*logLevel: 'debug'*/
    };

    if (previewTracks) {
      connectOptions.tracks = previewTracks;
    }

    // VideoCodecs=H264
    console.log('TwilioVideo',TwilioVideo);
    // Join the Room with the token from the server and the
    // LocalParticipant's Tracks.
    TwilioVideo.connect(token, connectOptions).then(this.roomJoined, (error) => {
      console.log('Could not connect to Twilio: ' + error.message);
    });
  }

  endConsult = (event) => {
    event.preventDefault();
    console.log('Leaving room...');
    this.state.activeRoom.disconnect();
  }

  render() {
    return (
      <Main>
        <Videos>
          <InComingVideo id="incoming-video" />
          <OutGoingVideo id="outgoing-video" />
        </Videos>
        <div>
          <Button disabled={this.state.activeRoom !== null} onClick={this.beginConsult}>Begin consult</Button>
          <Button disabled={this.state.activeRoom === null} onClick={this.endConsult}>End consult</Button>
        </div>
      </Main>
    );
  }
}

export default App;
