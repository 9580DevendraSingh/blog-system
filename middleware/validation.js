const validateUserRegistration = (req, res, next) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    next();
};

const validatePost = (req, res, next) => {
    const { title, body } = req.body;
    
    if (!title || !body) {
        return res.status(400).json({ message: 'Title and body are required' });
    }
    
    next();
};

module.exports = { validateUserRegistration, validatePost };