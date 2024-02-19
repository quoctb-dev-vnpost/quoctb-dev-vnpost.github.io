async function sendMessageToTelegram() {
    const BOT_TOKEN = '6812388740:AAGViia9pEFVdAATHI-rqpRZV6wfWyVFrOw'; // Thay thế 'YOUR_BOT_TOKEN' bằng mã token của bot Telegram của bạn
    const CHAT_ID = '-4131498545'; // Thay thế 'YOUR_CHAT_ID' bằng chat_id của người dùng hoặc nhóm bạn muốn gửi tin nhắn

    const madonhang = document.getElementById('ordercode').value;
    const sdt = document.getElementById('phonenumber').value;
    const email = document.getElementById('emailcustomer').value;
    const sanpham = document.getElementById('products').value;
    const ghichu = document.getElementById('ordernote').value;
    // Tạo một đối tượng Date mới, đại diện cho thời điểm hiện tại
    const currentDate = new Date();

    // Lấy ngày, tháng và năm hiện tại
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1; // Lưu ý rằng tháng bắt đầu từ 0
    const currentYear = currentDate.getFullYear();

    // Lấy giờ, phút và giây hiện tại
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentSecond = currentDate.getSeconds();
    const messageText = `NEW ORDER | ${currentDay}/${currentMonth}/${currentYear} | ${currentHour}:${currentMinute}:${currentSecond}\nMã đơn hàng: ${madonhang}\nSĐT: ${sdt}\nEmail: ${email}\nSản phẩm: ${sanpham}\nGhi chú: ${ghichu}`; // Nội dung tin nhắn bạn muốn gửi

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





function camviewer() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Thêm sự kiện 'loadedmetadata' để đảm bảo rằng video đã sẵn sàng
    video.addEventListener('loadedmetadata', function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    });

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
        })
        .catch(function (err) {
            console.error('Error accessing the camera.', err);
        });

    video.addEventListener('play', function () {
        const qrCanvas = document.createElement('canvas');
        const qrContext = qrCanvas.getContext('2d');
        setInterval(function () {
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
};

// Biến boolean để theo dõi trạng thái của camera
let isCameraOn = false;

// Lấy tham chiếu đến nút bật/tắt camera bằng ID
const toggleCameraButton = document.getElementById('toggleCameraButton');

// Gán sự kiện 'click' cho nút và thực hiện hành động tương ứng
toggleCameraButton.addEventListener('click', function () {
    if (isCameraOn) {
        stopCamera(); // Tắt camera nếu đang bật
    } else {
        startCamera(); // Bật camera nếu đang tắt
    }
});

// Hàm bật camera
function startCamera() {
    document.getElementById('cam-scan').style.display = 'block';
    camviewer()
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
            isCameraOn = true;
            toggleCameraButton.textContent = 'Tắt Camera';
        })
        .catch(function (err) {
            console.error('Error accessing the camera.', err);
        });
}

// Hàm tắt camera
function stopCamera() {
    document.getElementById('cam-scan').style.display = 'none';
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(function (track) {
        track.stop();
    });

    video.srcObject = null;
    isCameraOn = false;
    toggleCameraButton.textContent = 'Bật Camera';
}
