# Inventaris Aset Sistem (Asset Inventory) - AnonPulse

**Versi:** 0.1 (Milestone sec-0.1)  
**Klasifikasi:** Internal Security Documentation  
**Mata Kuliah:** Keamanan Komputasi dan Siber (KKS)  
**Institusi:** Universitas Pertamina

---

## 1. Taksonomi dan Kriteria Klasifikasi

Inventaris ini mencakup seluruh aset kritis sistem AnonPulse yang dipetakan berdasarkan fungsi operasional dan postur keamanannya:

- **Confidentiality (C):** Tingkat kerahasiaan terhadap akses tidak sah.
- **Integrity (I):** Tingkat keutuhan terhadap modifikasi tanpa izin.
- **Availability (A):** Tingkat ketersediaan layanan saat dibutuhkan.
- **Kategori Perlindungan Kriptografi:** Komponen algoritma atau protokol pengamanan yang diterapkan secara aktif pada aset terkait.

---

## 2. Aset Fisik dan Infrastruktur Komputasi

| ID Aset        | Nama Aset                | Deskripsi & Lokasi                                                           | Pemilik / Pengelola       | Dampak Kehilangan (CIA)                                                                         |
| :------------- | :----------------------- | :--------------------------------------------------------------------------- | :------------------------ | :---------------------------------------------------------------------------------------------- |
| **AST-PHY-01** | _Client Endpoint Device_ | Perangkat peramban pengguna (laptop/ponsel pelapor dan investigator).        | Pengguna Akhir            | **C: Tinggi, I: Sedang, A: Rendah** (Kompromi perangkat lokal mengekspos tiket/sesi aktif).     |
| **AST-PHY-02** | _Host Server Node_       | Server fisik/virtual komputasi yang mengeksekusi container aplikasi dan API. | Tim DevOps / Admin Kampus | **C: Kritis, I: Kritis, A: Kritis** (Akses _root_ memungkinkan pengambilalihan seluruh sistem). |
| **AST-PHY-03** | _Network Perimeter Node_ | Titik temu ingress jaringan publik kampus menuju subnet internal AnonPulse.  | Tim Jaringan Kampus       | **C: Sedang, I: Tinggi, A: Kritis** (Titik rawan serangan DoS jaringan dan inspeksi paket).     |

---

## 3. Aset Logis dan Komponen Perangkat Lunak

| ID Aset        | Nama Aset                       | Tumpukan Teknologi (_Tech Stack_)                 | Fungsi Utama                                                            | Ketergantungan Kriptografi                                                   |
| :------------- | :------------------------------ | :------------------------------------------------ | :---------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| **AST-LOG-01** | Frontend Web Client             | React 18, TypeScript, Tailwind CSS                | Antarmuka interaksi pelapor (_Report Form_, _Tracker_, _Panic Button_). | Validasi klien, pembersihan state memori, sanitasi EXIF.                     |
| **AST-LOG-02** | Backend API Gateway             | Python / ASGI Framework                           | Titik validasi _request_, orkestrasi triase laporan, dan terminasi API. | Penegakan HTTPS/TLS 1.3, proteksi header keamanan.                           |
| **AST-LOG-03** | Modul CSPRNG Token Generator    | Python `secrets` (`crypto-core/src/token_gen.py`) | Pembangkitan token tiket aduan anonim berentropi 128-bit (`AP-[HEX]`).  | **Kriptografis P1:** `secrets.token_hex(16)` menjamin sifat _unpredictable_. |
| **AST-LOG-04** | Modul Evidence Integrity Hasher | Python `hashlib` (`crypto-core/src/hasher.py`)    | Perhitungan _digest_ bukti digital berkas laporan.                      | **Kriptografis P2:** Algoritma SHA-256 (64-char hex) anti-tampering.         |
| **AST-LOG-05** | Identity & Access Controller    | Middleware RBAC + TOTP Engine                     | Autentikasi sesi multi-faktor untuk investigator Satgas.                | _Password hashing_ (Argon2id/PBKDF2) dan JWT _signing_.                      |

---

## 4. Aset Data Sensitif

| ID Aset        | Nama Aset                          | Bentuk & Format Data                            | Klasifikasi Sensitivitas | Status Proteksi Kriptografi                                                                             |
| :------------- | :--------------------------------- | :---------------------------------------------- | :----------------------- | :------------------------------------------------------------------------------------------------------ |
| **AST-DAT-01** | **AnonToken (Kode Tiket)**         | String alfanumerik (`AP-XXXX-XXXX-XXXX`)        | **Kritis (P1)**          | Dihasilkan via CSPRNG 128-bit; disimpan dalam bentuk _hash digest_ di database untuk pencocokan status. |
| **AST-DAT-02** | **Identitas Jaringan Pelapor**     | IP Address, User-Agent, TCP Fingerprint         | **Kritis (P1)**          | _Zero Retention Policy:_ Log disanitasi/dimask di Reverse Proxy; tidak disimpan dalam basis data.       |
| **AST-DAT-03** | **Metadata Lampiran (EXIF)**       | Koordinat GPS, Device Model, Waktu Jepretan     | **Kritis (P1)**          | Dihapus di sisi klien sebelum pengunggahan; verifikasi pembersihan sekunder di sisi server.             |
| **AST-DAT-04** | **Narasi Kronologi Kasus**         | Teks terstruktur (deskripsi aduan sensitif)     | **Kritis (P1)**          | Rencana enkripsi simetris terautentikasi (skema AEAD AES-256-GCM) at-rest.                              |
| **AST-DAT-05** | **Berkas Lampiran Bukti**          | File biner (PNG, JPG, PDF maks 5MB)             | **Tinggi (P2)**          | Integritas diverifikasi via SHA-256 digest; berkas terenkripsi pada storage vault.                      |
| **AST-DAT-06** | **Status Penanganan Tiket**        | Enumerasi status (`SUBMITTED`, `TRIAGED`, dll.) | **Sedang**               | Dilindungi integritas database; pembacaan hanya melalui otorisasi AnonToken yang valid.                 |
| **AST-DAT-07** | **Kunci Kriptografi & Kredensial** | Server Master Key, Kunci Privat Satgas, Salt    | **Kritis (P1)**          | Dikelola via _Environment Variable_ terisolasi / KMS; dilarang keras di-commit ke Git repo.             |
| **AST-DAT-08** | **Audit Trail Logging**            | Log aktivitas investigasi (waktu akses, aksi)   | **Tinggi (P2)**          | _Append-only log_ dengan HMAC signature untuk menjamin _non-repudiation_.                               |

---

## 5. Aset Penyimpanan Data (_Data Stores_)

| ID Aset        | Nama Penyimpanan              | Tipe & Lokasi                        | Data yang Ditampung                                             | Kontrol Akses & Proteksi                                              |
| :------------- | :---------------------------- | :----------------------------------- | :-------------------------------------------------------------- | :-------------------------------------------------------------------- |
| **AST-STR-01** | Database Kasus (`DS-01`)      | RDBMS (PostgreSQL/SQLite terisolasi) | Metadata tiket, narasi terenkripsi, hash token, riwayat status. | RBAC ketat, enkripsi kolom sensitif, isolasi jaringan privat (TB-02). |
| **AST-STR-02** | Evidence File Vault (`DS-02`) | Encrypted Object/Volume Storage      | Berkas fisik lampiran bukti digital dan metadata hash SHA-256.  | Akses privat tanpa tautan publik langsung, _time-locked auto-delete_. |
| **AST-STR-03** | Audit Log Store (`DS-03`)     | Volume Log Append-Only               | Catatan audit interaksi dan triase oleh investigator.           | Akses _read-only_ bagi investigator, proteksi integritas berkala.     |
| **AST-STR-04** | Client Memory / Cache         | RAM Peramban Klien & SessionStorage  | Token aduan sementara, form draft state.                        | Pembersihan otomatis via _Panic Button_ dan _unmount_ komponen.       |

---

## 6. Pemetaan Batas Kepercayaan Awal (_Trust Boundaries Mapping_)

Aset-aset di atas terdistribusi melintasi dua batas keamanan utama:

1. **TB-01 (Batas Peramban Klien - Internet Publik):** Memisahkan lingkungan tidak tepercaya (_untrusted browser/public network_) dengan server ingress AnonPulse. Mengatur transit `AST-DAT-01`, `AST-DAT-02`, `AST-DAT-03`, `AST-DAT-04`, dan `AST-DAT-05`.
2. **TB-02 (Batas Jaringan Server - Database Internal):** Memisahkan lapisan pemroses aplikasi (_DMZ/App tier_) dengan penyimpanan data persistensi `AST-STR-01`, `AST-STR-02`, dan `AST-STR-03`.
