const express = require('express');
const User = require('../models/userModel');
const swap = require('../models/swapsModel');

//get all swaps so user can search through them. Doesn't have to be logged in.
const getAllSwaps = async (req, res) => {

    try {
        const swaps = await swap.find();

        res.status(200).json(swaps);
    } catch (error) {
        console.error('getAllSwaps error:', error);
        res.status(500).json({ message: 'Server error: try later.' });
    }
    
};

//get the information of a specific swap based on swapid. Doesn't have to be logged in.
const getSwap = async (req, res) => {

    try {
        const swapId = req.params.swapId
        const swaps = await swap.findOne(swapId);

        res.status(200).json(swaps);
    } catch (error) {
        console.error('getSwap error:', error);
        res.status(500).json({ message: 'Server error: try later.' });
    }
};

//get a swap based on a specific book (bookId). Doesn't have to be logged in.
// const getSwapByBook = async (req, res) => {

//     try {
//         const bookId = req.params.bookId
//         const swaps = await swap.findOne(bookId);

//         res.status(200).json(swaps);
//     } catch (error) {
//         console.error('getSwapByBook error:', error);
//         res.status(500).json({ message: 'Server error: try later.' });
//     }
// };


//get a swap based on a specific user (userId). Doesn't have to be logged in.
// const getSwapByUser = async (req, res) => {

//     try {
//         const userId = req.params.bookId
//         const swaps = await swap.findOne(userId);

//         res.status(200).json(swaps);
//     } catch (error) {
//         console.error('getSwapByUser error:', error);
//         res.status(500).json({ message: 'Server error: try later.' });
//     }
// };


//a user can create a new swap. User must be loggedin. 
const createSwap = async (req, res) => {

    const { user, book, Description, Location } = req.body;

    try{

        const newSwap = new swap({ user, book, Description, Location});
        
        await newSwap.save();

        res.status(201).json({ message: 'Swap created!' });
    } catch (error) {
        console.error('createSwap error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//a user can update their personal swap. User must be loggedin and their id must match the id of that in the swap document.
const updateSwap = async (req, res) => {

    
    try{
        const swapId = req.params.swapId;

        //should I use the User variable or require that they send the user's id?
        const userId = req.params.userId;

        //add functionality to verify user is the owner of the swap



        const { user, book, Description, Location } = req.body;

        const updatedInfo = new swap({ user, book, Description, Location});

        let updatedSwap = await swap.findOneAndUpdate({ _id: swapId }, updatedInfo, { new: true });

        if (!updatedSwap) {
            return res.status(404).json({ message: 'No matching Swap found.' });
        }

        res.status(201).json({ message: 'Swap updated'});

    }catch (error) {
        console.error('updateSwap error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//a user can delete their personal swap. User must be loggedin and their id must match the id of that in the swap document.
const deleteSwap = async (req, res) => {

    try{

        const swapId = req.params.swapId;
        
        //should I use the User variable or require that they send the user's id?
        const userId = req.params.userId;

        //add functionality to verify user is the owner of the swap

        const removedSwap = await model.findByIdAndDelete(swapId);

        if (!removedSwap) {
            return res.status(404).json({ message: 'No matching swap found.' });
        }

        res.status(200).json({ message: 'Swap removed' });

    }catch (error) {
        console.error('deleteSwap error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllSwaps,
    getSwap,
    createSwap,
    updateSwap,
    deleteSwap
}