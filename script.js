function generateQRCode() {
    var link = document.getElementById("linkInput").value;
    var errorMessage = document.getElementById("error-message");

    if (!link) {
        // แสดงข้อความเตือน
        errorMessage.style.display = "block";
        errorMessage.style.opacity = "1";

        // หลังจาก 1 วินาที ทำให้ข้อความจางหายไป
        setTimeout(function() {
            errorMessage.style.opacity = "0";
        }, 1000);

        // ซ่อนข้อความหลังจากที่จางหายไป (หลังจาก 2 วินาที)
        setTimeout(function() {
            errorMessage.style.display = "none";
        }, 2000);

        return;
    }

    // ซ่อนข้อความเตือนหากใส่ลิงค์ถูกต้อง
    errorMessage.style.display = "none";

    // ล้างคิวอาร์โค้ดเก่าออกก่อน
    document.getElementById("qrcode").innerHTML = "";

    // สร้างคิวอาร์โค้ดใน canvas ด้วยขนาดที่ต้องการ
    var qrcode = new QRCode(document.getElementById("qrcode"), {
        text: link,
        width: 556,
        height: 556,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // รอให้คิวอาร์โค้ดถูกสร้างเสร็จ
    setTimeout(function() {
        // ดึง canvas ของคิวอาร์โค้ด
        var qrCodeCanvas = document.querySelector("#qrcode canvas");
        if (qrCodeCanvas) {
            // สร้าง canvas ใหม่ที่ใหญ่กว่าเพื่อเพิ่มขอบขาว
            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");
            var padding = 20;

            canvas.width = qrCodeCanvas.width + padding * 2;
            canvas.height = qrCodeCanvas.height + padding * 2;

            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.drawImage(qrCodeCanvas, padding, padding);

            var qrCodeImg = canvas.toDataURL("image/png");

            var downloadLink = document.getElementById("downloadLink");
            downloadLink.href = qrCodeImg;
            downloadLink.style.display = "block";
        }
    }, 500);
}

function clearInput() {
    document.getElementById("linkInput").value = "";
    document.getElementById("qrcode").innerHTML = "";
    document.getElementById("downloadLink").style.display = "none";
    document.getElementById("error-message").style.display = "none";
}



function resizeImage() {
    var imageInput = document.getElementById('imageInput').files[0];
    var canvas = document.getElementById('resizeCanvas');
    var ctx = canvas.getContext('2d');
    var selectedFileSizeMB = document.getElementById('fileSize').value;
    var statusMessage = document.getElementById('statusMessage');
    var resizeButton = document.getElementById('resizeButton');

    if (!imageInput) {
        statusMessage.textContent = "กรุณาเลือกไฟล์ภาพก่อน.";
        statusMessage.style.color = "red";
        statusMessage.style.display = "block";
        return;
    }

    // ซ่อนปุ่มลดขนาดภาพ
    resizeButton.style.display = "none";

    // แสดงสถานะกำลังประมวลผล
    statusMessage.textContent = "กำลังประมวลผล...";
    statusMessage.style.color = "#333";
    statusMessage.style.display = "block";

    var img = new Image();
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;

        // วาดภาพลงใน canvas
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // บีบอัดภาพจนกว่าจะได้ขนาดไฟล์ที่ต้องการ
        var quality = 1.0;
        var targetFileSize = selectedFileSizeMB * 1024 * 1024; // ขนาดไฟล์เป้าหมาย (เป็น byte)
        var resizedImageURL = canvas.toDataURL("image/jpeg", quality);

        while (resizedImageURL.length > targetFileSize && quality > 0.1) {
            quality -= 0.05;
            resizedImageURL = canvas.toDataURL("image/jpeg", quality);
        }

        // แสดงสถานะดาวน์โหลดพร้อมแล้ว
        statusMessage.textContent = "ดาวน์โหลดพร้อมแล้ว";
        statusMessage.style.color = "green";

        // แสดงลิงก์ดาวน์โหลดภาพที่ถูกบีบอัด
        var downloadLink = document.getElementById('downloadResizedImage');
        downloadLink.href = resizedImageURL;
        downloadLink.style.display = 'block';
    }
    img.src = URL.createObjectURL(imageInput);
}

function refreshPage() {
    // รีเฟรชหน้าเว็บหลังจากการดาวน์โหลดเสร็จสิ้น
    setTimeout(function() {
        location.reload();
    }, 500);  // หน่วงเวลา 0.5 วินาทีเพื่อให้การดาวน์โหลดเสร็จสิ้น
}



function convertImage() {
    var imageInput = document.getElementById('imageInputConvert').files[0];
    var canvas = document.getElementById('convertCanvas');
    var ctx = canvas.getContext('2d');
    var fileType = document.getElementById('fileType').value; // รับค่าประเภทไฟล์ที่ต้องการ
    var statusMessage = document.getElementById('statusMessage');
    var convertButton = document.getElementById('convertButton');

    if (!imageInput) {
        statusMessage.textContent = "กรุณาเลือกไฟล์ภาพก่อน.";
        statusMessage.style.color = "red";
        statusMessage.style.display = "block";
        return;
    }

    // ซ่อนปุ่มเปลี่ยนนามสกุลรูป
    convertButton.style.display = "none";

    // แสดงสถานะกำลังประมวลผล
    statusMessage.textContent = "กำลังประมวลผล...";
    statusMessage.style.color = "#333";
    statusMessage.style.display = "block";

    var img = new Image();
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;

        // วาดภาพลงใน canvas
        ctx.drawImage(img, 0, 0);

        // แปลงภาพเป็นประเภทที่เลือก
        var convertedImageURL;
        var downloadFilename;

        if (fileType === 'jpeg') {
            convertedImageURL = canvas.toDataURL("image/jpeg");
            downloadFilename = "converted-image.jpg";
        } else if (fileType === 'png') {
            convertedImageURL = canvas.toDataURL("image/png");
            downloadFilename = "converted-image.png";
        }

        // แสดงสถานะดาวน์โหลดพร้อมแล้ว
        statusMessage.textContent = "ดาวน์โหลดพร้อมแล้ว";
        statusMessage.style.color = "green";

        // แสดงลิงก์ดาวน์โหลดภาพที่ถูกเปลี่ยนนามสกุล
        var downloadLink = document.getElementById('downloadConvertedImage');
        downloadLink.href = convertedImageURL;
        downloadLink.download = downloadFilename;
        downloadLink.style.display = 'block';
    }
    img.src = URL.createObjectURL(imageInput);
}

function refreshPage() {
    // รีเฟรชหน้าเว็บหลังจากการดาวน์โหลดเสร็จสิ้น
    setTimeout(function() {
        location.reload();
    }, 500);  // หน่วงเวลา 0.5 วินาทีเพื่อให้การดาวน์โหลดเสร็จสิ้น
}

function convertVideo() {
    var videoInput = document.getElementById('imageInputConvert').files[0];
    var fileType = document.getElementById('videoType').value;
    var statusMessage = document.getElementById('statusMessage');
    var convertButton = document.getElementById('convertVideoButton');

    if (!videoInput) {
        statusMessage.textContent = "กรุณาเลือกไฟล์วีดีโอก่อน.";
        statusMessage.style.color = "red";
        statusMessage.style.display = "block";
        return;
    }

    convertButton.style.display = "none";
    statusMessage.textContent = "กำลังประมวลผล...";
    statusMessage.style.color = "#333";
    statusMessage.style.display = "block";

    // จำลองการแปลงนามสกุลไฟล์
    var convertedVideoURL = URL.createObjectURL(videoInput);
    var downloadFilename;

    if (fileType === 'mp4') {
        downloadFilename = videoInput.name.split('.').slice(0, -1).join('.') + ".mp4";
    } else if (fileType === 'avi') {
        downloadFilename = videoInput.name.split('.').slice(0, -1).join('.') + ".avi";
    } else if (fileType === 'mkv') {
        downloadFilename = videoInput.name.split('.').slice(0, -1).join('.') + ".mkv";
    }

    statusMessage.textContent = "ดาวน์โหลดพร้อมแล้ว";
    statusMessage.style.color = "green";

    var downloadLink = document.getElementById('downloadConvertedVideo');
    downloadLink.href = convertedVideoURL;
    downloadLink.download = downloadFilename;
    downloadLink.style.display = 'block';
}

function convertAudio() {
    var audioInput = document.getElementById('imageInputConvert').files[0];
    var fileType = document.getElementById('videoType').value;
    var statusMessage = document.getElementById('statusMessage');
    var convertButton = document.getElementById('convertAudioButton');

    if (!audioInput) {
        statusMessage.textContent = "กรุณาเลือกไฟล์เสียงก่อน.";
        statusMessage.style.color = "red";
        statusMessage.style.display = "block";
        return;
    }

    convertButton.style.display = "none";
    statusMessage.textContent = "กำลังประมวลผล...";
    statusMessage.style.color = "#333";
    statusMessage.style.display = "block";

    // จำลองการแปลงนามสกุลไฟล์
    var convertedAudioURL = URL.createObjectURL(audioInput);
    var downloadFilename;

    if (fileType === 'mp3') {
        downloadFilename = audioInput.name.split('.').slice(0, -1).join('.') + ".mp3";
    } else if (fileType === 'wav') {
        downloadFilename = audioInput.name.split('.').slice(0, -1).join('.') + ".wav";
    } else if (fileType === 'aac') {
        downloadFilename = audioInput.name.split('.').slice(0, -1).join('.') + ".aac";
    }

    statusMessage.textContent = "ดาวน์โหลดพร้อมแล้ว";
    statusMessage.style.color = "green";

    var downloadLink = document.getElementById('downloadConvertedAudio');
    downloadLink.href = convertedAudioURL;
    downloadLink.download = downloadFilename;
    downloadLink.style.display = 'block';
}


function updateFileName(inputElement) {
    var fileNameSpan = inputElement.nextElementSibling.nextElementSibling;  // เข้าถึง <span> ที่อยู่ถัดจาก <label>
    
    if (inputElement.files.length > 0) {
        fileNameSpan.textContent = inputElement.files[0].name;
    } else {
        fileNameSpan.textContent = "ยังไม่ได้เลือกไฟล์";
    }
}

function uploadAndExtractAudio() {
    var videoInput = document.getElementById('videoInput').files[0];
    var statusMessage = document.getElementById('statusMessage');
    var extractButton = document.getElementById('extractAudioButton');

    if (!videoInput) {
        statusMessage.textContent = "กรุณาเลือกไฟล์วีดีโอก่อน.";
        statusMessage.style.color = "red";
        statusMessage.style.display = "block";
        return;
    }

    extractButton.style.display = "none";
    statusMessage.textContent = "กำลังอัปโหลดและประมวลผล...";
    statusMessage.style.color = "#333";
    statusMessage.style.display = "block";

    var formData = new FormData();
    formData.append('file', videoInput);

    fetch('/extract_audio', {
        method: 'POST',
        body: formData
    })
    .then(response => response.blob())
    .then(blob => {
        var downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = 'extracted_audio.mp3';
        downloadLink.click();

        statusMessage.textContent = "การดึงเสียงเสร็จสิ้น ดาวน์โหลดเรียบร้อย";
        statusMessage.style.color = "green";
    })
    .catch(error => {
        console.error('Error:', error);
        statusMessage.textContent = "เกิดข้อผิดพลาดในการดึงเสียง";
        statusMessage.style.color = "red";
    });
}
