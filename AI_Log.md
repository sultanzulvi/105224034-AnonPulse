# Catatan Penggunaan AI (AI_LOG.md)

- **Alat AI yang Digunakan:** Gemini (Google)
- **Tujuan Penggunaan:** Membantu memahami instruksi tugas, membuat draft Komponen kriptografi (secrets & hashlib), menyusun skenario uji pytest, dan menghindari error saat eksekusi di terminal.

## Ringkasan Prompt & Bagian yang Dihasilkan AI

1. **Prompt:** "Tolong jelaskan instruksi tugas ini (dari gambar) dengan bahasa yang mudah dipahami."
   - **Bagian yang Dihasilkan:** Penjelasan alur kerja dari Langkah 1 (README), Langkah 2 (Kode), hingga Langkah 3 (Testing).
2. **Prompt:** "Bantu saya membuat README.md sesuai blueprint 3 matkul."
   - **Bagian yang Dihasilkan:** Data tabel kebutuhan, jenis aset yang diamankan, dan penjelasan alur masukan-proses-keluaran, khususnya penggunaan cara kerja `/dev/urandom`.
3. **Prompt:** "Buatkan kode token_gen.py dan hasher.py beserta penjelasannya."
   - **Bagian yang Dihasilkan:** Fungsi `generate_anon_token` menggunakan modul `secrets` dan `generate_evidence_hash` menggunakan modul `hashlib` SHA-256. Kode ini saya pelajari dan saya uji sendiri di vscode.
4. **Prompt:** "Buatkan 4 skenario uji otomatis pytest sesuai instruksi."
   - **Bagian yang Dihasilkan:** File `test_crypto.py` yang berisi empat fungsi uji, termasuk uji kolisi 10.000 token dan uji batas (file 0 byte).
5. **Prompt:** "Error 'The term 'pytest' is not recognized'."
   - **Bagian yang Dihasilkan:** Solusi untuk menggunakan perintah `python -m pytest` untuk membypass issue PATH di Windows.

## Cara Memeriksa

- Saya membaca setiap baris kode yang dihasilkan, dan memastikan modul yang dipakai hanya modul bawaan Python (secrets & hashlib).
- Saya membuktikan kebenaran kode dengan menjalankannya secara manual di terminal VS Code.
- Saya memastikan hasil `pytest` lulus validasi (4 passed).
