// Email validation
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
    return emailRegex.test(email)
}

// Password validation (at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character )
export const isValidPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,}$/
    return passwordRegex.test(password)
}

// Credit card validation (Luhn Algorithm)
export const isValidCreditCard = (cardNumber: string): boolean => {
    if (!/^\d{13,19}$/.test(cardNumber)) return false;

    let sum = 0;
    for (let i = 0; i < cardNumber.length; i++) {
        let digit = parseInt(cardNumber[cardNumber.length - 1 - i]);
        if (i % 2 !== 0) digit *= 2;
        if (digit > 9) digit -= 9;
        sum += digit;
    }

    return sum % 10 === 0;
}

