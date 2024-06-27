const isLoggedOn = function(req, res, next) {
    console.log('Checking authentication status...');
    console.log('Session:', req.session);
    console.log('User:', req.user);
    console.log('isAuthenticated:', req.isAuthenticated());
    
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

module.exports = isLoggedOn;
