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

/**
 * Middleware function to check if the user is the creator of a swap or comment.
 */
const isCreator = async (req, res, next) => {
  try {
    console.log('Checking creator status...');
    const userId = req.user ? req.user._id : 'No user';
    const { type, id } = req.params; // Assuming you have the type (swap or comment) and id in the request params

    console.log('Request parameters:', { type, id });
    console.log('User ID from session:', userId);

    let item;
    if (type === 'swap') {
      console.log('Fetching swap with ID:', id);
      item = await Swap.findById(id);
    } else if (type === 'comment') {
      console.log('Fetching comment with ID:', id);
      item = await Comment.findById(id);
    } else {
      console.log('Invalid type:', type);
      return res.status(400).json({ message: 'Invalid type' });
    }

    if (!item) {
      console.log('Item not found with ID:', id);
      return res.status(404).json({ message: 'Item not found' });
    }

    console.log('Fetched item:', item);
    if (item.creator.toString() !== userId.toString()) {
      console.log('User is not the creator. Sending 403 Forbidden response.');
      return res.status(403).json({ message: 'Forbidden: You are not the creator of this item' });
    }

    console.log('User is the creator. Proceeding to next middleware.');
    next();
  } catch (error) {
    console.error('Error in isCreator middleware:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  isLoggedOn,
  isCreator
};