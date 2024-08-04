export const calculatePasswordStrength = (password) => {
    let strengthScore = 0;

    const passwordCriteria = [
        { regex: /.{8,}/, points: 10 },
        { regex: /.{12,}/, points: 10 },
        { regex: /.{16,}/, points: 10 },
        { regex: /.{24,}/, points: 10 },
        { regex: /[a-z]/, points: 10 }, 
        { regex: /[A-Z]/, points: 10 },
        { regex: /\d/, points: 10 }, 
        { regex: /[!@#$%^&*(),.?":{}|<>]/, points: 10 },
        { regex: /(\d)\1{2,}/, points: -20 }, 
        { regex: /([a-zA-Z])\1{2,}/, points: -20 }
    ];

    passwordCriteria.forEach(({ regex, points }) => {
        strengthScore += regex.test(password) ? points : 0;
    });

    return Math.min(Math.max((strengthScore / 70) * 100, 0), 100);
};


export default {
    user: {
        username: /^[a-zA-Z0-9]{3,24}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,24}$/,
        phoneNumber: /^\+?[0-9]{1,3}-?[0-9]{1,3}-?[0-9]{4}$/,
    },
    zipCode: /^[0-9]{5}$/,
    url: /^(https?:\/\/)?([a-z0-9.-]+\.[a-z]{2,4})(\/[^\/]*)?$/
}