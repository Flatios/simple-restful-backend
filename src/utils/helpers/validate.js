// Email Doğrulama
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Şifre Doğrulama (En az 8 karakter, en fazla 24 karakter, 1 büyük harf, 1 küçük harf, 1 rakam, 1 özel karakter)
export const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,24}$/;
    return passwordRegex.test(password);
};

// Kullanıcı Adı Doğrulama (En az 3 karakter, en fazla 24 karakter, sadece alfabetik ve rakam içermeli)
export const isValidUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]{3,24}$/;
    return usernameRegex.test(username);
};

export const calculatePasswordStrength = (password) => {
    let strength = 0;

    // Check password length
    if (password.length >= 8) strength += 10;
    if (password.length >= 12) strength += 10;
    if (password.length >= 16) strength += 10;
    if (password.length >= 24) strength += 10;

    // Check for lowercase letters
    if (/[a-z]/.test(password)) strength += 10;

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) strength += 10;

    // Check for digits
    if (/\d/.test(password)) strength += 10;

    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;

    // Penalty for consecutive repeating characters
    if (/(\d)\1{2,}/.test(password) || /([a-zA-Z])\1{2,}/.test(password)) {
        strength -= 20;
    }
}