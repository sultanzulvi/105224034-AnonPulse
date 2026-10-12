# AnonPulse - Komponen Kriptografi

**AnonPulse** adalah platform aduan anonim (whistleblowing system) berbasis web yang dirancang khusus untuk sivitas akademika kampus. Platform ini bertujuan memberikan ruang yang aman bagi korban atau saksi untuk melaporkan pelanggaran sensitif (kekerasan seksual, perundungan, dll.) tanpa meninggalkan jejak identitas.

### Tabel Kebutuhan Keamanan Data

| Aset Data Produk            | Tujuan Keamanan                | Prioritas   | Kebutuhan Komponen Teknis                                    |
| :-------------------------- | :----------------------------- | :---------- | :----------------------------------------------------------- |
| **AnonToken / Ticket Code** | Kerahasiaan & Unpredictability | Kritis (P1) | CSPRNG token generator (entropi 128-bit).                    |
| **Narasi Kronologi Kasus**  | Kerahasiaan (Confidentiality)  | Kritis (P1) | Skema AEAD / AES-GCM (Persiapan).                            |
| **File Lampiran Bukti**     | Integritas (Integrity)         | Tinggi (P2) | SHA-256 Digest generator untuk deteksi modifikasi/tampering. |

### Rancangan Komponen (Masukan-Proses-Keluaran)

**1. Komponen A: Pembangkit AnonToken (CSPRNG)**

- **Masukan:** Panjang entropi dalam _byte_ (standar 16 _bytes_ / 128 bit) dan format awalan _string_ ("AP-").
- **Proses:** Menggunakan modul `secrets` bawaan Python (`secrets.token_hex(16)`) sebagai sumber keacakan kriptografis yang aman. Modul ini mengambil entropi (sumber acak) langsung dari sistem operasi (seperti `/dev/urandom` di Linux) yang sulit ditebak.
- **Keluaran:** Sebuah _string_ heksadesimal unik (contoh: `AP-8F92K10AB7F3...`) yang berfungsi sebagai token rahasia pelapor.

**2. Komponen B: Penghasil Hash Lampiran (Integritas)**

- **Masukan:** Data mentah (_raw bytes_) dari _file_ bukti (gambar atau dokumen).
- **Proses:** Menggunakan algoritma _hash_ SHA-256 dari modul `hashlib` bawaan Python. Proses ini memetakan data _file_ berukuran apa pun menjadi _string_ dengan panjang tetap (64 karakter).
- **Keluaran:** _String digest_ heksadesimal 64 karakter. Jika _file_ asli dimodifikasi satu bit saja, _digest_ keluaran ini akan berubah drastis (efek _avalanche_).
