const express = require('express');
const app = express();
const server = app.listen(5000);
var io = require('socket.io')(server);

app.use('/', express.static(__dirname + '/app')); // html
app.use('/data', express.static(__dirname + '/app/data')); // data

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/app/index.html');
});

io.on('connection', function(socket) {
  socket.on('chat message', (text, profile) => {
  	if(text.split(' ').indexOf('hello') != -1 || text.split(' ').indexOf('hi') != -1){
  		socket.emit('bot reply', 'Hello! Wecome to my resumé. '+profile.about);
  	}
  	else if(text.split(' ').indexOf('name') != -1){
  		socket.emit('bot reply', 'My name is'+profile.name.first);
  	}
  	else if(text.split(' ').indexOf('skill') != -1){
  		socket.emit('bot reply', 'I am good at '+profile.skills.length+' different skills. They are:'+profile.skills.reduce((a,b)=>a+b.name+' ','')+'. '+profile.knowledge);
  	}
  	else if(text.split(' ').indexOf('experience') != -1){
  		socket.emit('bot reply', 'I have worked at '+profile.experience.reduce((a,b)=>a+b.company+' as '+b.position+'. During that time, I worked on'+b.description+'. ',''),'');
  	}
  	else if(text.split(' ').indexOf('study') != -1 || text.split(' ').indexOf('school') != -1 || text.split(' ').indexOf('education') != -1) {
  		socket.emit('bot reply', 'I have studied ' + profile.education.reduce((a,b)=>a+b.degree+'. '+b.description+'. ',''));
  	}
  	else if(text.split(' ').indexOf('bye') != -1 || text.split(' ').indexOf('goodbye') != -1){
  		socket.emit('bot reply', 'It was nice talking with you! Click the bottom right chatbubble to talk to me again.');
  	}
  	else {
  		socket.emit('bot reply', 'Pardon me. I do not understand. Can you try again?');
  	}
    socket.emit('bot reply', 'Click the bottom right chatbubble to talk to me again.'); // Send the result back to the browser!
  });
});