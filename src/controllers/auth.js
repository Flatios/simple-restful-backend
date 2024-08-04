import helper from '../config/helper.config.js';

const register = async (req, res) => {
    const { username, email, password, full_name, date_of_birth } = req.body;

    // Check required fields
    if (!username || !email || !password) {
        return res.status(400).send({ message: 'Username, email, and password are required.' });
    }

    // Check date of birth validity
    if (date_of_birth && new Date(date_of_birth) >= new Date()) {
        return res.status(400).send({ message: 'Date of birth must be in the past.' });
    }

    // Validate user data
    if (!helper.validate.user.username.test(username)) {
        return res.status(400).send({ message: 'Invalid username format.' });
    }
    if (!helper.validate.user.email.test(email)) {
        return res.status(400).send({ message: 'Invalid email format.' });
    }
    if (!helper.validate.user.password.test(password)) {
        return res.status(400).send({ message: 'Invalid password format.' });
    }

    const user_data = {
        id: helper.encryption.randomUUID(),
        username: String(username).toLowerCase(),
        email: String(email).toLowerCase(),
        password: encryption.hashPassword(password),
        full_name: full_name || null,
        date_of_birth: date_of_birth || null
    };

    try {
        const exist_user = await helper.database.findOne('users', { username: user_data.username, email: user_data.email });
        if (exist_user) {
            return res.status(409).send({ message: 'User already exists.' });
        }

        const save_user = await helper.database.insertOne('users', user_data);
        if (!save_user) {
            return res.status(500).send({ message: 'Failed to create user.' });
        }

        const user_token = helper.encryption.createToken({ id: user_data.id });
        if (!user_token) {
            return res.status(500).send({ message: 'Failed to create token.' });
        }

        user_data.token = user_token;

        res.status(201).send({ message: 'User created successfully.', payload: user_data });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error.' });
    }
};

const login = async (req, res) => {
    const { username, email, password } = req.body;

    const user_data = {
        username: username || null,
        email: email || null,
        password: password || null
    }

    if ( !( username || email ) || !password ) {
        return res.status(400).send({ message: 'Username or email is required.' });
    }

    try {
        const exist_user = await helper.database.findOne('users', {username: user_data.username, email: user_data.email});
        if (!exist_user) {
            return res.status(401).send({ message: 'No account matching your information was found' });
        }

        const is_valid_password = helper.encryption.comparePassword(password, exist_user.password);
        if (!is_valid_password) {
            return res.status(401).send({ message: 'Invalid email/username or password.' });
        }

        const user_token = helper.encryption.createToken({ id: exist_user.id });
        if (!user_token) {
            return res.status(500).send({ message: 'Failed to create token.' });
        }

        exist_user.token = user_token;

        res.status(200).send({ message: 'User authenticated successfully.', payload: exist_user });


    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Internal server error.' });
    }
}

export default { register, login };