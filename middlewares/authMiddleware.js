const isLoggedOn = (req, res, next) => {
    // Check if user is authenticated (example using Passport.js)
    if (req.isAuthenticated()) {
        return next(); // User is logged in, proceed to next middleware or route handler
    } else {
        return res.status(401).json({ message: 'Unauthorized access' }); // User is not authenticated
    }
};

module.exports = {
    isLoggedOn,
};