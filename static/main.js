const videoElement = document.getElementById('videoElement');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

let mediaRecorder;
let recordedChunks = [];

startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);

async function startRecording() {
  recordedChunks = [];
  const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true });
  videoElement.srcObject = stream;
  videoElement.muted = true;
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.addEventListener('dataavailable', (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  });

  mediaRecorder.start();
  startButton.disabled = true;
  stopButton.disabled = false;
  mediaRecorder.addEventListener('stop', () => {
    const blob = new Blob(recordedChunks);
    const formData = new FormData();
    formData.append('video', blob, 'recorded-video.webm');
  
    fetch('/save', { method: 'POST', body: formData })
      .then(() => {
        
        location.reload();
        alert('Video saved on the server');
      })
      .catch((error) => {
        console.error('Error saving video on the server:', error);
      });
  });
}

function stopRecording() {
  mediaRecorder.stop();
  startButton.disabled = false;
  stopButton.disabled = true;
}


