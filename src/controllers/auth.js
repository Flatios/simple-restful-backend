import validate from '../utils/helpers/validate.js';
import database from '../utils/helpers/database.js';

const createUser = async (req, res) => {
    const user_data = { email: req.body.email, username: req.body.username, password: req.body.password };

    if (!username || !email || !password) { }

    if (!validate.email.test(user_data.email)) { }
    if (!validate.user.password.test(user_data.password)) { }
    if (!validate.user.username.test(user_data.username)) { }

    // Save user to database
    const save_user = await database.insertOne('users', user_data)
    if (save_user) { }

    res
}


export default {
    createUser
}