import secrets


def generate_anon_token(prefix: str = "AP-", entropy_bytes: int = 16) -> str:
    """
    Membangkitkan token acak berentropi tinggi sebagai identitas laporan anonim.
    
    Args:
        prefix (str): Awalan untuk token (default: "AP-").
        entropy_bytes (int): Panjang byte entropi (default: 16 bytes / 128-bit).
    
    Returns:
        str: Token heksadesimal yang aman dari brute-force.
    """
    # secrets.token_hex menghasilkan string heksadesimal.
    # 16 bytes akan menghasilkan 32 karakter heksadesimal.
    random_part = secrets.token_hex(entropy_bytes)
    return f"{prefix}{random_part}"


# Blok init acanda untuk testing manual di terminal
if __name__ == "__main__":
    print("Contoh Token :", generate_anon_token())