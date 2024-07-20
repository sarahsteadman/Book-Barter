/**
 * Middleware function to check if user is logged on (authenticated).
 */
const isLoggedOn = (req, res, next) => {
  console.log('Checking authentication status...');
  console.log('Session:', req.session);
  console.log('User:', req.user);
  console.log('Is Authenticated:', req.isAuthenticated());

  if (req.isAuthenticated()) {
    return next();
  } else {
    console.log('User is not authenticated. Session ID:', req.sessionID);
    console.log('Session data:', req.session);
    console.log('User data:', req.user);
    return res.status(401).json({ error: 'User not authenticated' });
  }
};



module.exports = {
  isLoggedOn,

};