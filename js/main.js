const apiKey = "41f6b5a26693fd92184ddd76aaeef8ef"

// Vue.component('artist', {
//   props: ['artwork', 'name'],
//   template: '<div class="artist"><img src="{{artwork}}"><h6>{{name}}</h6></div>'
// })

// Here comes the Vue
var songapp = new Vue({
  el: '.body',
  data: {
    artistName: "",
    artists: []
  },
  methods: {
    populateArtist: function() {
      console.log(this.artistName);
      let request = `https://api.soundcloud.com/users/?client_id=${apiKey}&q=${this.artistName}`;
      console.log('api request: ', request);
      fetch(request).then(function(resp) {
        if (resp.status !== 200) {
          console.log('Error encountered fetching from soundcloud. ', res.status);
          return;
        }
        console.log(resp.status);
        // console.log(resp);
        resp.json().then(function(data) {
          // keep working asshole
          for (let i = 0; i < 4; i++) {
            let newObj = {
              artwork: data[i].avatar_url,
              name: data[i].username
            };
            console.log(newObj);
            songapp.artists.push(newObj);
          }
        });
      });
      this.artistName = "";
    }
  }
});

// var artistList = new Vue({
//   el: '.artist-lib',
//   data: {
//     artists: []
//   }
// })
