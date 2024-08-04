
function getCurrentDate() {
    return new Date().toISOString().split('T')[0];
}

function getCurrentTime() {
    return new Date().toISOString().split('T')[1].split('.')[0];
}

function getDayOfWeek(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
}

function getMonthName(date) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[new Date(date).getMonth()];
}

function formatDate(date, format) {
    const d = new Date(date);
    const map = {
        'dd': ('0' + d.getDate()).slice(-2),
        'mm': ('0' + (d.getMonth() + 1)).slice(-2),
        'yyyy': d.getFullYear(),
        'hh': ('0' + d.getHours()).slice(-2),
        'MM': ('0' + d.getMinutes()).slice(-2),
        'ss': ('0' + d.getSeconds()).slice(-2)
    };

    return format.replace(/dd|mm|yyyy|hh|MM|ss/gi, matched => map[matched]);
}

export default {
    getCurrentDate,
    getCurrentTime,
    getDayOfWeek,
    getMonthName,
    formatDate
};