import hashlib

def generate_evidence_hash(file_bytes: bytes) -> str:
    """
    Membuat digest SHA-256 dari data mentah (raw bytes) file bukti aduan.
    
    Args:
        file_bytes (bytes): Data file yang akan dihash.
    
    Returns:
        str: String heksadesimal 64 karakter hasil hash.
        
    Raises:
        ValueError: Jika file kosong (0 byte).
    """
    if not file_bytes:
        raise ValueError("File bukti tidak boleh kosong (0 byte).")
    
    # Inisialisasi objek hash SHA-256
    hasher = hashlib.sha256()
    # Memasukkan data byte ke dalam objek hash
    hasher.update(file_bytes)
    # Mengembalikan hasil hash dalam bentuk string heksadesimal
    return hasher.hexdigest()


# Blok init acanda untuk testing manual di terminal
if __name__ == "__main__":
    contoh_data = b"ini adalah file bukti palsu"
    print("Hash dari contoh data :", generate_evidence_hash(contoh_data))