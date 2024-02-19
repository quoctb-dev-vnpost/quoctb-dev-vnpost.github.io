document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Thêm sự kiện 'loadedmetadata' để đảm bảo rằng video đã sẵn sàng
    video.addEventListener('loadedmetadata', function() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    });

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
});



async function sendMessageToTelegram() {
    const BOT_TOKEN = '6812388740:AAGViia9pEFVdAATHI-rqpRZV6wfWyVFrOw'; // Thay thế 'YOUR_BOT_TOKEN' bằng mã token của bot Telegram của bạn
    const CHAT_ID = '-4131498545'; // Thay thế 'YOUR_CHAT_ID' bằng chat_id của người dùng hoặc nhóm bạn muốn gửi tin nhắn

    const messageText = 'Có đơn hàng mới!'; // Nội dung tin nhắn bạn muốn gửi

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: messageText
            })
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        const responseData = await response.json();
        console.log('Message sent successfully:', responseData);
        alert('Thông tin đơn hàng đã được lưu!');
    } catch (error) {
        console.error('Error sending message:', error.message);
        alert('Failed to send message. Please try again later.');
    }
}

// Lấy tham chiếu đến nút gửi tin nhắn bằng ID
const sendButton = document.getElementById('sendButton');

// Gán sự kiện 'click' cho nút và truyền vào hàm gửi tin nhắn khi nút được nhấn
sendButton.addEventListener('click', sendMessageToTelegram);