# Pemodelan Ancaman STRIDE (Threat Model) - AnonPulse

**Versi:** 0.1 (Milestone sec-0.1)  
**Mata Kuliah:** Keamanan Komputasi dan Siber (KKS)  
**Metodologi:** Microsoft STRIDE Threat Modeling

---

## 1. Metodologi Analisis Ancaman

Analisis ini membedah permukaan serangan (_attack surface_) AnonPulse menggunakan taksonomi STRIDE. Setiap ancaman dikaitkan secara spesifik ke elemen Data Flow Diagram (DFD) dan inventaris aset untuk mengeliminasi analisis spekulatif.

---

## 2. Tabel 10 Ancaman Spesifik STRIDE

| ID Ancaman | Kategori STRIDE                   | Elemen DFD Terdampak                       | Aset Terdampak                         | Skenario Vektor Serangan & Dampak Teknis                                                                                                                                                                               |
| :--------- | :-------------------------------- | :----------------------------------------- | :------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TH-01**  | **Spoofing (S-01)**               | `E-01` (Pelapor) / `P-03` (API Controller) | `AST-DAT-01` (AnonToken)               | **Brute-Forcing Token Pelapor:** Penyerang menebak string token tiket aduan secara masif untuk mengakses perkembangan kasus korban lain melalui endpoint pelacakan tiket (`DF-09`).                                    |
| **TH-02**  | **Spoofing (S-02)**               | `P-05` (Portal Investigasi)                | `AST-LOG-05` (Sesi Investigator)       | **Credential Stuffing / Session Hijacking Admin:** Penyerang menggunakan kredensial staf yang bocor untuk memalsukan identitas sebagai anggota Satgas pada portal triase (`DF-11`).                                    |
| **TH-03**  | **Tampering (T-01)**              | `DS-02` (File Vault)                       | `AST-DAT-05` (Berkas Bukti Digital)    | **Manipulasi Berkas Barang Bukti di Disk:** Aktor internal jahat atau penyerang dengan akses storage mengubah/mengganti berkas lampiran kasus untuk merusak validitas pembuktian hukum.                                |
| **TH-04**  | **Tampering (T-02)**              | `DF-02` / `P-03` (API Controller)          | `AST-DAT-06` (Status Tiket Kasus)      | **Parameter Tampering / IDOR:** Penyerang memanipulasi parameter status pada request API (`DF-13`) untuk mengubah status investigasi secara ilegal tanpa otorisasi Satgas.                                             |
| **TH-05**  | **Repudiation (R-01)**            | `P-05` (Portal Investigasi) / `DS-03`      | `AST-DAT-08` (Audit Log System)        | **Penyangkalan Aksi Investigasi:** Investigator menyangkal telah membaca narasi aduan sensitif atau menghapus berkas kasus karena ketiadaan pencatatan jejak audit yang terproteksi integritas.                        |
| **TH-06**  | **Information Disclosure (I-01)** | `P-02` (Reverse Proxy & Ingress)           | `AST-DAT-02` (IP Address & Jaringan)   | **Eksposur Identitas via Server Access Log:** Web server mencatat IP publik, header User-Agent, dan timestamp pelapor secara mentah pada access log, sehingga merusak prinsip _unlinkability_.                         |
| **TH-07**  | **Information Disclosure (I-02)** | `DF-01` / `P-01` (Sanitasi Klien)          | `AST-DAT-03` (Metadata EXIF Foto)      | **Kebocoran Geolokasi Pelapor:** Berkas foto bukti yang diunggah masih memuat metadata EXIF (koordinat GPS dan model perangkat), mengekspos lokasi fisik pelapor saat insiden terjadi.                                 |
| **TH-08**  | **Information Disclosure (I-03)** | `DS-01` (Database Kasus)                   | `AST-DAT-04` (Narasi Kasus Sensitif)   | **Database Dump at-Rest Exposure:** Basis data bocor atau dicadangkan (_backup leak_) tanpa enkripsi, memungkinkan pihak luar membaca seluruh narasi aduan kekerasan seksual dalam bentuk _plaintext_.                 |
| **TH-09**  | **Denial of Service (D-01)**      | `P-02` / `P-03` (API Gateway)              | `AST-PHY-02` (Kapasitas Server & Disk) | **Spamming Tiket & Volume Exhaustion:** Bot melakukan _automated mass-submission_ laporan sampah dengan payload file maksimal (5MB) tanpa batas laju (_rate limiting_), melumpuhkan kapasitas disk dan I/O server.     |
| **TH-10**  | **Elevation of Privilege (E-01)** | `P-05` (Kontrol Akses RBAC)                | `AST-LOG-05` (Hak Akses Staf Biasa)    | **Eskalasi Hak Akses Horizontal/Vertikal:** Akun staf kampus berkategori _read-only_ memanipulasi token sesi atau _claim_ JWT untuk memperoleh hak istimewa _Lead Investigator_ guna mengakses kasus rahasia pimpinan. |
