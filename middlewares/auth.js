
/**
 * Middleware function to check if user is logged on (authenticated).
 */
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

/**
 * Middleware function to check if the user is the creator of a swap or comment.
 */
const isCreator = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { type, id } = req.params; // Assuming you have the type (swap or comment) and id in the request params
        
        let item;
        if (type === 'swap') {
            item = await Swap.findById(id);
        } else if (type === 'comment') {
            item = await Comment.findById(id);
        } else {
            return res.status(400).json({ message: 'Invalid type' });
        }

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.creator.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Forbidden: You are not the creator of this item' });
        }

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
