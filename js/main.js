const apiKey = "41f6b5a26693fd92184ddd76aaeef8ef"

function buildArtistList(res) {
  // do stuff
}

// Here comes the Vue
var songapp = new Vue({
  el: '.header-area',
  data: {
    artistName: "",
  },
  methods: {
    populateArtist: function() {
      console.log(this.artistName);
      let request = `https://api.soundcloud.com/users/?client_id=${apiKey}&q=${this.artistName}`;
      console.log('api request: ', request);
      fetch(request).then(buildArtistList(resp));
      this.artistName = "";

    }
  }
});
