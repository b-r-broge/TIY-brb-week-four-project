const apiKey = "41f6b5a26693fd92184ddd76aaeef8ef"

function buildTrack(trackObj) {
  // console.log(trackObj);
  let outObj = {
    title: trackObj.title,
    duration: millisToTime(trackObj.duration),
    fulldescription: trackObj.description,
    stream: trackObj.stream_url,
    format: trackObj.original_format,
    active: ''
  }
  if (trackObj.artwork_url === null) {
    outObj.art = "./assets/track-placeholder.png"
  } else {
    outObj.art = trackObj.artwork_url
  }
  if (outObj.fulldescription !== null && outObj.fulldescription.length > 60) {
    outObj.description = trackObj.description.slice(0, 60) + "...";
  } else {
    outObj.description = trackObj.description;
  }
  return outObj;
}
// stolen from stack overflow:
// https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
function millisToTime (millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
}

// Here comes the Vue
var songapp = new Vue({
  el: '#body',
  data: {
    artistName: "",
    artists: [],
    trackList: [],
    currentTrack: "",
    currentFormat: "",
    active: "hidden"
  },
  methods: {
    populateArtist: function() {
      // console.log(this.artistName);
      this.artists = [];
      let userRequest = `https://api.soundcloud.com/users/?client_id=${apiKey}&q=${this.artistName}`;
      let songRequest = `https://api.soundcloud.com/tracks/?client_id=${apiKey}&q=${this.artistName}`;
      // console.log('api request: ', userRequest);
      fetch(userRequest).then(function(resp) {
        if (resp.status !== 200) {
          console.log('Error encountered fetching artists from soundcloud. ', resp.status);
          return;
        }
        // console.log(resp.status);
        // console.log(resp);
        resp.json().then(function(data) {
          for (let i = 0; i < 4 && i < data.length; i++) {
            let newObj = {
              artwork: data[i].avatar_url,
              name: data[i].username
            };
            // console.log(newObj);
            songapp.artists.push(newObj);
          }
        });
      });
      fetch(songRequest).then(function(resp) {
        if (resp.status !== 200) {
          console.log('Error encountered fetching songs from soundcloud', resp.status);
          return;
        }
        resp.json().then(function(data) {
          songapp.trackList = [];
          for (let tr of data) {
            let track = buildTrack(tr);
            // console.log(track);
            songapp.trackList.push(track);
          }
        })
      })
      this.artistName = "";
    },
    populateTracks: function(e) {
      // console.log(e);
      let artist = e.target.parentElement.className.split(' ').splice(1, 10).join('%20');
      // console.log(artist);
      let request = `https://api.soundcloud.com/tracks/?client_id=${apiKey}&q=${artist}`;
      console.log(request);
      fetch(request).then(function(resp) {
        if (resp.status !== 200) {
          console.log('Error getting tracks', resp.status);
          return;
        }
        // console.log(resp);
        resp.json().then(function(data) {
          // console.log(data);
          songapp.trackList = [];
          for (let tr of data) {
            let track = buildTrack(tr);
            // console.log(track);
            songapp.trackList.push(track);
          }
          // console.log(songapp.trackList);
        });
      })
    },
    addToPlayer: function(e) {
      let streamUrl = e.target.parentElement.id + '/?client_id=' + apiKey;
      let streamFormat = 'audio/' + e.target.parentElement.className.split(' ')[1];
      console.log(streamUrl, streamFormat);
      this.currentTrack = streamUrl;
      this.currentFormat = streamFormat;
      this.active = '';
      songapp.$forceUpdate();
      // Vue.set('audio source', 'src', streamUrl);
      // Vue.set('audio source', 'type', streamFormat);
    }
  }
});
