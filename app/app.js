new Vue({
	el: '#app',
	data: {
		toggle: false,
		data: {}
	},
	methods: {
		load_data: async function() {
			fetch("/data/data.yaml")
			.then(r => r.text())
			.then(data => {
				this.data = YAML.parse(data);
			});
		},
		start: function() {
			this.recognition.start();
		}
	},
	mounted: function () {
		this.load_data();
		const socket = io();
		socket.on('bot reply', function(replyText) {
			const synth = window.speechSynthesis;
			const utterance = new SpeechSynthesisUtterance();
			utterance.text = replyText;
			synth.speak(utterance);
		});

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		let recognition = new SpeechRecognition();

		recognition.lang = 'en-US';
		recognition.interimResults = false;

		recognition.addEventListener('result', (e) => {
		  let last = e.results.length - 1;
		  let text = e.results[last][0].transcript;

		  // console.log('Confidence: ' + e.results[0][0].confidence);
		  // console.log('Captured: ' + text);
		  socket.emit('chat message', text, this.data);
		  this.toggle = false
		});
		this.recognition = recognition;
	}
});