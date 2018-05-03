new Vue({
    el: '#app',
    data: {},
    created: function () {
      fetch("data/data.yaml")
        .then(r => r.json())
        .then(data => {
        	console.log(data)
          this.data = data
        });
    }
});