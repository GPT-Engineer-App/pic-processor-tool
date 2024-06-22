let uploadedFilePath = '';

function uploadImage() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            uploadedFilePath = data.file_path;
            document.getElementById('actions').style.display = 'block';
            document.getElementById('message').innerText = 'File uploaded successfully.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function editImage(action) {
    fetch('http://localhost:5000/edit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file_path: uploadedFilePath, action: action })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            uploadedFilePath = data.edited_path;
            document.getElementById('download').style.display = 'block';
            document.getElementById('message').innerText = 'Image edited successfully.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function downloadImage() {
    const filename = uploadedFilePath.split('/').pop();
    window.location.href = `http://localhost:5000/download/${filename}`;
}