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