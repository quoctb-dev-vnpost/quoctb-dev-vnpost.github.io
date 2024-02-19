const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
    })
    .catch(function(err) {
        console.error('Error accessing the camera.', err);
    });

video.addEventListener('play', function() {
    const qrCanvas = document.createElement('canvas');
    const qrContext = qrCanvas.getContext('2d');
    setInterval(function() {
        qrCanvas.width = video.videoWidth;
        qrCanvas.height = video.videoHeight;
        qrContext.drawImage(video, 0, 0, qrCanvas.width, qrCanvas.height);
        const imageData = qrContext.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
        });
        if (code) {
            console.log('QR code detected:', code.data);
            // Xử lý dữ liệu QR code tại đây
        }
    }, 1000);
});
