// Attach the Tracks to the DOM.
export const attachTracks = (tracks, container) => {
  tracks.forEach((track) => {
    container.appendChild(track.attach());
  });
}

// Attach the Participant's Tracks to the DOM.
export const attachParticipantTracks = (participant, container) => {
  let tracks = Array.from(participant.tracks.values());
  attachTracks(tracks, container);
}

// Detach the Tracks from the DOM.
export const detachTracks = (tracks) => {
  tracks.forEach(function(track) {
    track.detach().forEach(function(detachedElement) {
      detachedElement.remove();
    });
  });
}

// Detach the Participant's Tracks from the DOM.
export const detachParticipantTracks = (participant) => {
  var tracks = Array.from(participant.tracks.values());
  detachTracks(tracks);
}
