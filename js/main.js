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

const markers = {};

cctvData.forEach(cctv => {
    const marker = L.marker(cctv.coords).addTo(map);
    marker.bindPopup(`
        <b>${cctv.name}</b><br>
        <button class="btn btn-sm btn-primary mt-2 btn-lihatstream" onclick="openStream('${cctv.url}', '${cctv.name}')">Lihat Streaming</button>
    `);
    markers[cctv.name] = marker;
});

function focusMarker(cctv) {
    setTimeout(() => {
        map.invalidateSize();
        map.flyTo(cctv.coords, 17, { animate: true, duration: 0.8 });
        markers[cctv.name].openPopup();
    }, 100);
}

const listContainer = document.getElementById('cctvList');
cctvData.forEach(cctv => {
    const item = document.createElement('div');
    item.className = 'cctv-item';
    item.innerHTML = `<i class="fas fa-video cctv-icon"></i><div class="cctv-name">${cctv.name}</div>`;
    item.onclick = (e) => {
        e.preventDefault();
        document.getElementById("map").scrollIntoView({ behavior: "smooth", block: "center" });
        focusMarker(cctv);
    };
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
    document.getElementById('log').innerHTML = `[Player] Opening stream for ${name}...`;
    const videoElement = document.getElementById('videoElement');

    // Hentikan player lama
    if (flvPlayer) {
        flvPlayer.destroy();
        flvPlayer = null;
    }
    if (videoElement) {
        videoElement.pause();
        videoElement.src = "";
    }

    // Deteksi format
    if (url.endsWith(".flv")) {
        if (flvjs.isSupported()) {
            flvPlayer = flvjs.createPlayer({ type: 'flv', url });
            flvPlayer.attachMediaElement(videoElement);
            flvPlayer.load();
            flvPlayer.play()
                .then(() => logMessage("FLV streaming started successfully."))
                .catch(err => logMessage("Error starting FLV stream: " + err, true));

            flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
                logMessage(`FLV.js error: ${errType} - ${errDetail}`, true);
            });
        } else {
            logMessage("FLV.js not supported in this browser.", true);
        }
    } 
    else if (url.endsWith(".m3u8")) {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(videoElement);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                videoElement.play()
                    .then(() => logMessage("HLS streaming started successfully."))
                    .catch(err => logMessage("Error starting HLS stream: " + err, true));
            });
        } 
        // Browser dengan native HLS (Safari, iOS)
        else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            videoElement.src = url;
            videoElement.addEventListener('loadedmetadata', () => {
                videoElement.play()
                    .then(() => logMessage("Native HLS streaming started successfully."))
                    .catch(err => logMessage("Error starting native HLS stream: " + err, true));
            });
        } else {
            logMessage("HLS not supported in this browser.", true);
        }
    } 
    else {
        logMessage("Unsupported video format.", true);
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