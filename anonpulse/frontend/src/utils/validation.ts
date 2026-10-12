export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Validasi minimal 50 karakter untuk narasi kronologi
export function validateNarrative(narrative: string): ValidationResult {
  const trimmed = narrative.trim();
  if (!trimmed) {
    return { isValid: false, message: 'Kronologi kejadian wajib diisi.' };
  }
  if (trimmed.length < 50) {
    return {
      isValid: false,
      message: `Kronologi terlalu singkat. Minimal 50 karakter (saat ini: ${trimmed.length} karakter).`,
    };
  }
  return { isValid: true };
}

// Validasi berkas lampiran (Format PNG, JPG, PDF dan ukuran maksimal 5MB)
export function validateAttachment(file: File | null): ValidationResult {
  if (!file) return { isValid: true }; // Berkas opsional

  const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
  const maxSizeBytes = 5 * 1024 * 1024; // 5 Megabyte

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: 'Format berkas tidak didukung. Harap unggah berkas berekstensi PNG, JPG, atau PDF.',
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      message: 'Ukuran berkas melebihi batas maksimal 5 MB.',
    };
  }

  return { isValid: true };
}