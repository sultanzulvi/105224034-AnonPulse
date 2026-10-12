import pytest
from token_gen import generate_anon_token
from hasher import generate_evidence_hash

def test_token_format_dan_panjang():
    """Skenario 1: Memastikan format dan panjang token tepat."""
    token = generate_anon_token()
    # Token harus diawali dengan "AP-"
    assert token.startswith("AP-")
    # Panjang harus 35 karakter: 3 (AP-) + 32 (16 bytes hex)
    assert len(token) == 35

def test_token_keunikan():
    """Skenario 2: Uji kolisi 10.000 token acak."""
    # Membuat 10.000 token dan memasukkannya ke dalam Set (himpunan yang hanya menyimpan data unik)
    tokens = {generate_anon_token() for _ in range(10000)}
    # Jika tidak ada yang ganda (kolisi), jumlah isi Set harus tetap 10.000
    assert len(tokens) == 10000

def test_integritas_file():
    """Skenario 3: Perhitungan digest sesuai hash deterministik acuan."""
    data_uji = b"test"
    # Hash SHA-256 dari kata "test" sudah pasti di bawah ini:
    hash_acuan = "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
    hash_hasil = generate_evidence_hash(data_uji)
    assert hash_hasil == hash_acuan

def test_uji_negatif_file_kosong():
    """Skenario 4: Verifikasi penanganan eror terhadap masukan berkas kosong (0 byte)."""
    # Pastikan fungsi melemparkan ValueError jika diberikan data kosong (b"")
    with pytest.raises(ValueError) as info_eror:
        generate_evidence_hash(b"")
    # Pastikan pesan erornya sesuai dengan yang kita tulis di hasher.py
    assert str(info_eror.value) == "File bukti tidak boleh kosong (0 byte)."