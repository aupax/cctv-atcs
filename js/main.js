// Toggle menu untuk mobile dengan animasi
function toggleMenu(btn) {
    btn.classList.toggle('active');
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('show'); 
}

// Set total CCTV
document.getElementById('totalCCTV').textContent = cctvData.length;

// Leaflet Map
const map = L.map('map').setView([-7.816, 112.018], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Tambahkan marker dari cctvData
cctvData.forEach(cctv => {
    const marker = L.marker(cctv.coords).addTo(map);
    marker.bindPopup(`
        <b>${cctv.name}</b><br>
        <button class="btn btn-sm btn-primary mt-2" style="font-family: Poppins, sans-serif; font-weight: 400;" onclick="openStream('${cctv.url}', '${cctv.name}')">Lihat Streaming</button>
    `);
});

// Generate list CCTV dengan icon kamera
const listContainer = document.getElementById('cctvList');
cctvData.forEach(cctv => {
    const item = document.createElement('div');
    item.className = 'cctv-item list-group-item list-group-item-action';
    item.innerHTML = `<i class="fas fa-video cctv-icon"></i><div class="cctv-name">${cctv.name}</div>`;
    item.onclick = () => openStream(cctv.url, cctv.name);
    listContainer.appendChild(item);
});

// FLV Player & Modal
let flvPlayer;
const streamModalElement = document.getElementById('streamModal');
const bootstrapModal = new bootstrap.Modal(streamModalElement, {
    keyboard: true
});

function logMessage(message, isError = false) {
    const logDiv = document.getElementById('log');
    const newMsg = document.createElement('div');
    newMsg.style.color = isError ? 'red' : '#0f0';
    newMsg.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logDiv.appendChild(newMsg);
    logDiv.scrollTop = logDiv.scrollHeight;
}

function openStream(url, name) {
    document.getElementById('log').innerHTML = `[FLV] Opening stream for ${name}...`;

    if (flvjs.isSupported()) {
        const videoElement = document.getElementById('videoElement');

        if (flvPlayer) {
            flvPlayer.destroy();
        }

        flvPlayer = flvjs.createPlayer({ type: 'flv', url });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play()
            .then(() => logMessage("Streaming started successfully."))
            .catch(err => logMessage("Error starting stream: " + err, true));

        flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
            logMessage(`FLV.js error: ${errType} - ${errDetail}`, true);
        });

        flvPlayer.on(flvjs.Events.LOADING_COMPLETE, () => {
            logMessage("Stream loading complete.");
        });
    } else {
        logMessage("FLV.js not supported in this browser.", true);
    }

    bootstrapModal.show();
}

streamModalElement.addEventListener('hidden.bs.modal', () => {
    if (flvPlayer) {
        flvPlayer.destroy();
        flvPlayer = null;
    }
});

document.getElementById('fullscreenBtn').addEventListener('click', () => {
    const video = document.getElementById('videoElement'); // video element langsung
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
    else if (video.msRequestFullscreen) video.msRequestFullscreen(); // untuk IE/Edge lama
});