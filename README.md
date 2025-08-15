# CCTV ATCS FLV & HLS Streaming

A **real-time CCTV monitoring** application for **Kediri City’s ATCS** (Area Traffic Control System), supporting both **FLV** and **HLS (m3u8)** streaming formats.  
Features automatic format detection and optimized playback for low-latency performance.

🔗 **Live Demo:** [https://aupax.github.io/cctv-atcs](https://aupax.github.io/cctv-atcs)

---

## 📜 Changelog

### Friday, 15 August 2025

**Added**
- **HLS stream support** for broader compatibility.
- Automatic stream format detection.
- Clicking a CCTV in the list now:
  - Scrolls to the map.
  - Centers the corresponding CCTV marker.

**Fixed**
- Changed some streams from FLV to HLS to fix playback issues:
  - `bandar_ngalim`
  - `alun_alun`
  - `tamanan`
  - `mrican`
  - `jetis`
  - `a_yani_utara`
  - `dandangan`

---

## ⚙️ Technologies Used
- **HTML, CSS, JavaScript**
- **Leaflet.js** for interactive mapping
- **flv.js** & **hls.js** for video playback
- **Bootstrap** for responsive UI styling

---

## 📌 Key Features
- Real-time CCTV ATCS monitoring.
- Dual streaming support: **FLV** & **HLS**.
- Interactive map with CCTV locations.
- Automatic scroll and marker centering on CCTV selection.

---

## 📄 License
This project is licensed under the [GPL-3.0 license](LICENSE).
