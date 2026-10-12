# Registrasi Risiko Keamanan (Risk Register) & Rencana Kontrol - AnonPulse

**Versi:** 0.1 (Milestone sec-0.1)  
**Mata Kuliah:** Keamanan Komputasi dan Siber (KKS)  
**Institusi:** Universitas Pertamina

---

## 1. Standar Evaluasi Risiko (Konteks Riil Produk)

Tingkat risiko dihitung berdasarkan formula standar:  
$$\text{Risk Level} = \text{Likelihood (Kemungkinan: 1-5)} \times \text{Impact (Dampak: 1-5)}$$

- **Skala Kemungkinan (Likelihood):**
  - **1 (Sangat Rendah):** Membutuhkan kompromi kriptografi tingkat lanjut atau akses fisik internal.
  - **2 (Rendah):** Membutuhkan keterampilan teknis tinggi dan kondisi pra-syarat spesifik.
  - **3 (Sedang):** Vektor eksploitasi umum tanpa perlindungan otomatis tingkat aplikasi.
  - **4 (Tinggi):** Dapat dieksekusi secara otomatis oleh skrip publik melalui internet terbuka.
  - **5 (Sangat Tinggi):** Konfigurasi default sistem web langsung terekspos tanpa mekanisme filter.

- **Skala Dampak (Impact):**
  - **1-2 (Rendah - Sedang):** Gangguan operasional minor atau anomali UI yang dapat dipulihkan cepat.
  - **3 (Tinggi):** Gangguan integritas data atau kegagalan kepatuhan prosedural internal.
  - **4 (Sangat Tinggi):** Modifikasi barang bukti atau penghentian layanan aduan kampus.
  - **5 (Katastropik / Kritis):** Dek-anonimisasi korban/pelapor, ancaman fisik bagi pelapor, atau kebocoran massal kasus asusila.

---

## 2. Pemilihan dan Evaluasi 5 Risiko Prioritas Produk

Berdasarkan analisis 10 ancaman STRIDE, berikut adalah 5 risiko prioritas teratas yang mengancam langsung _core value_ kerahasiaan dan integritas AnonPulse:

| ID Risiko  | Korelasi Ancaman                | Skenario Risiko Spesifik                                               | Likelihood (1-5) & Alasan Riil Kondisi Produk                                                                                                                  | Impact (1-5) & Alasan Riil Kondisi Produk                                                                                                       | Tingkat Risiko Total |
| :--------- | :------------------------------ | :--------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- | :------------------- |
| **RSK-01** | **TH-06 (I-01) & TH-07 (I-02)** | **Kebocoran jejak IP & metadata EXIF pelapor pada log/berkas.**        | **Likelihood: 4** (Web server Nginx/Proxy secara _default_ mencatat IP klien; kamera ponsel modern otomatis menyematkan koordinat GPS ke metadata foto).       | **Impact: 5** (Prinsip kerahasiaan absolut gugur total; identitas dan lokasi korban terekspos, berpotensi memicu intimidasi atau bahaya fisik). | **20 (Kritis)**      |
| **RSK-02** | **TH-08 (I-03)**                | **Pembacaan narasi aduan sensitif akibat kebocoran database at-rest.** | **Likelihood: 3** (Database berada di balik TB-02, tetapi kebocoran file cadangan (_backup snapshot_) atau injeksi SQL umum terjadi pada aplikasi web).        | **Impact: 5** (Isi kronologi kasus asusila/perundungan terbaca publik; reputasi korban dan institusi hancur).                                   | **15 (Tinggi)**      |
| **RSK-03** | **TH-09 (D-01)**                | **Spamming pengiriman laporan massal & DoS penyimpanan.**              | **Likelihood: 4** (Endpoint pelaporan dibuka untuk publik tanpa autentikasi login pelapor, sangat rentan di-spam oleh bot).                                    | **Impact: 3** (Server down, storage penuh, investigator kelelahan memfilter laporan sampah (_alert fatigue_)).                                  | **12 (Tinggi)**      |
| **RSK-04** | **TH-01 (S-01)**                | **Pemalsuan / penebakan AnonToken tiket status aduan.**                | **Likelihood: 2** (Telah dicegah oleh entropi 128-bit CSPRNG, namun endpoint kueri publik tetap rentan serangan _online brute force_ jika tanpa _rate limit_). | **Impact: 5** (Penyerang dapat membaca riwayat interaksi dan kesimpulan investigasi korban lain).                                               | **10 (Tinggi)**      |
| **RSK-05** | **TH-05 (R-01)**                | **Penyangkalan pembacaan/penghapusan laporan oleh investigator.**      | **Likelihood: 3** (Akses internal kampus kerap mengandalkan kepercayaan kolegial tanpa sistem _tamper-evident audit trail_ formal).                            | **Impact: 3** (Integritas hukum gugur; satgas dapat berdalih laporan tidak pernah diterima atau hilang secara administratif).                   | **9 (Sedang)**       |

---

## 3. Rencana Kontrol Keamanan & Pemetaan Milestone (Tugas 2 & Tugas 3)

| ID Risiko  | Rencana Kontrol Keamanan Defensif                          | Mekanisme Teknis Implementasi                                                                                                                                                                | Target Milestone Eksekusi             | Alasan Penurunan Risiko                                                                                                                          |
| :--------- | :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| **RSK-01** | **Pembersihan EXIF Sisi Klien & IP Masking Reverse Proxy** | 1. Modul TypeScript di klien menghapus EXIF data via `canvas/blob re-encoding` sebelum unggah.<br/>2. Reverse proxy disetel dengan `log_format` anonim (IP di-hash/di-masking ke `0.0.0.0`). | **Tugas 3 (KKS & Deployment)**        | Menurunkan Likelihood dari 4 ke 1 karena metadata dihapus sebelum menyentuh disk server, dan IP tidak pernah tersimpan di log.                   |
| **RSK-02** | **Enkripsi At-Rest Payload Aduan (Skema AEAD)**            | Narasi aduan dienkripsi menggunakan AES-256-GCM sebelum disimpan di basis data. Kunci enkripsi dikelola secara terisolasi.                                                                   | **Tugas 2 (Kriptografi & Backend)**   | Menurunkan Impact dari 5 ke 2; bila database bocor, penyerang hanya mendapatkan _ciphertext_ tak terbaca tanpa kunci privat.                     |
| **RSK-03** | **Penegakan Rate Limiting & Pembatasan Payload**           | 1. Implementasi Token Bucket / Leaky Bucket rate limiter pada endpoint API (maks 5 request/menit per IP subnet).<br/>2. Validasi ketat ukuran berkas maks 5MB & kuota harian.                | **Tugas 3 (KKS & PAW)**               | Menurunkan Likelihood dari 4 ke 2; skrip otomatis penyerang akan terblokir oleh HTTP 429 _Too Many Requests_.                                    |
| **RSK-04** | **Penggunaan CSPRNG 128-bit & Hashing Token Lookup**       | 1. Implementasi token via `secrets.token_hex(16)` (Tugas 1 Kriptografi).<br/>2. Token disimpan dalam bentuk SHA-256 digest di DB (`DS-01`) untuk pencocokan.                                 | **Tugas 1 (Telah Selesai) & Tugas 2** | Menurunkan Likelihood ke 1; ruang pencarian $2^{128}$ secara komputasi mustahil ditebak acak via brute force.                                    |
| **RSK-05** | **Penerapan Tamper-Evident Append-Only Audit Logging**     | Setiap aksi investigasi dicatat pada log append-only dengan _cryptographic signature_ (HMAC-SHA256) berurutan.                                                                               | **Tugas 3 (KKS)**                     | Menurunkan Likelihood penyangkalan dari 3 ke 1; investigator tidak dapat memanipulasi atau menghapus jejak aksi tanpa merusak hash rantai audit. |
