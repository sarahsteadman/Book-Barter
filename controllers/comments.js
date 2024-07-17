const express = require('express');
const mongoose = require('mongoose');
const comment = require('../models/commentModel');

function convertToObject(id){

    return new mongoose.Types.ObjectId(id);
}

//Gets all comments
const getAllComments = async function (req, res) {
    try {
        const comments = await comment.comment.find();
        
        if (!comments[0]) {
            return res.status(404).json({ message: 'No Comments found.' });
        }

        res.status(200).json(comments);
    } catch (error) {
        console.error('Error in getAllComments:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Gets comment by comment id
const getComment = async (req, res) => {

    try {
        const commentId = req.params.commentId
        const comments = await comment.comment.findOne(convertToObject(commentId));

        if (!comments) {
            return res.status(404).json({ message: 'No matching comment found.' });
        }
        res.status(200).json(comments);
    } catch (error) {
        console.error('getComment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


//Create new comment
const createComment = async (req, res) => {

    const { user, swap, Comment, Date } = req.body;

    try{
        const newComment = new comment.comment({ user, swap, Comment, Date});
        await newComment.save();

        res.status(201).json({ message: 'Comment created!' });
    } catch (error) {
        console.error('createComment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Update a comment
const updateComment = async (req, res) => {
 
    try{
        const commentId = req.params.commentId;
        const { user, swap, Comment, Date } = req.body;

        const updatedInfo = { user, swap, Comment, Date };

        let updatedComment = await comment.comment.findOneAndUpdate({ _id: commentId }, updatedInfo, {new: true});

        if (!updatedComment) {
            return res.status(404).json({ message: 'No matching comment found.' });
        }

        res.status(201).json({ message: 'Comment updated'});
    }catch (error) {
        console.error('updateComment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

//Delete comment
const deleteComment = async (req, res) => {
    try{
        const commentId = req.params.commentId;
        const deletedComment = await comment.comment.findByIdAndDelete(convertToObject(commentId));
        if (!deletedComment) {
            return res.status(404).json({ message: 'No matching comment found.' });
        }

        res.status(200).json({ message: 'Comment deleted' });

    }catch (error) {
        console.error('deleteComment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllComments,
    getComment,
    createComment,
    updateComment,
    deleteComment
}