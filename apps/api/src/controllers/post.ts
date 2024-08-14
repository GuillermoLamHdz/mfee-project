import Post from '../models/post';
import Comment from '../models/comment';

export const getPost = (id: string) => {
  return posts.find((p) => p.id === id);
};

// Initialize posts array to save data in memory
const posts = [];

// GET /posts Return an array of all the posts with status code 200
const getPosts = async (req, res) => {
  // Return all the posts with a 200 status code
  try {
    const posts = await Post.find();
    // Return all the posts with a 200 status code
    res.status(200).json(posts);
  } catch (error) {
    const { message } = error;
    res.status(500).json({ message });
  }
};

// GET /posts/category/:category Return an array of all the posts by category with status code 200
const getPostsByCategory = async (req, res) => {
  try {
    // Retrieve the id from the route params
    const { category } = req.params;
    const post = await Post.find({category});

    if (!post) {
      // If we don't find the post return a 404 status code with a message
      return res.status(404).json({ message: 'Post not found' });
    }
    // Return the post with a 200 status code
    res.status(200).json(post);
  } catch (error) {
    const { message } = error;
    res.status(500).json({ message });
  }
};

// GET /posts/:id Return a post by id with category object and each comment object in the array with status code 200
const getPostById = async (req, res) => {
  try {
    // Retrieve the id from the route params
    const { id } = req.params;
    const post = await Post.findById(id);

    if (!post) {
      // If we don't find the post return a 404 status code with a message
      return res.status(404).json({ message: 'Post not found' });
    }
    // Return the post with a 200 status code
    res.status(200).json(post);
  } catch (error) {
    const { message } = error;
    res.status(500).json({ message });
  }
};

// POST /posts Create a new post and return the created post with status code 201
const createPost = async (req, res) => {
  try {
    // Retrieve the name from the request body
    const { title, image, description, category, comments} = req.body;

    if (!title || !image || !description || !category) {
      // If a required field is empty or undefined return a 400 status code with a message
      return res.status(400).json({ message: 'Missing field.' });
    }
    const newPost = {
      title,
      image,
      description,
      category,
      comments
    };
    const post = await Post.create(newPost);
    // Return the created post with a 201 status code
    res.status(201).json(post);
  } catch (error) {
    const { message } = error;
    res.status(500).json({ message });
  }
};

// POST /posts/:id/comments Create a comment inside the post and return the comment with status code 201
const createCommentForPost = async (req, res) => {
  try {
    // Retrieve the name from the request body
    const { id } = req.params;
    const { author, content} = req.body;

    // find post first before creating comment
    const post = await Post.findById(id);
    if (!post) {
      // If we don't find the post return a 404 status code with a message
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!author || !content) {
      // If a required field is empty or undefined return a 400 status code with a message
      return res.status(400).json({ message: 'Missing field.' });
    }

    const newComment = {
      author,
      content
    };
    // Create comment and save it in post
    const comment = await Comment.create(newComment);
    post.comments.push(comment._id);
    await post.save();

    // Return the created comment with a 201 status code
    res.status(201).json(comment);

  } catch (error) {
    const { message } = error;
    res.status(500).json({ message });
  }
};

// PATCH /posts/:id Update post information and return the updated post with status code 200
const updatePost = async (req, res) => {
  try {
    // Retrieve the id from the route params
    const { id } = req.params;
    // Check and update if we have a post with that id
    const post = await Post.findByIdAndUpdate(id, req.body, { new: true });

    if (!post) {
      // If we don't find the post return a 404 status code with a message
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    const { message } = error;
    res.status(500).json({ message });
  }
};

// DELETE /posts/:id Delete the post and return the deleted post with status code 200 or 204 if you decide to not return anything
const deletePost = async (req, res) => {
  try {
    // Retrieve the id from the route params
    const { id } = req.params;

    // Check and delete if we have a post with that id
    const post = await Post.findByIdAndDelete(id, {});

    // If we don't find the post return a 404 status code with a message
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await Comment.deleteMany({ _id: { $in: post.comments } });
    // Return a 200 status code
    res.status(200).json(post);
  } catch (error) {
    const { message } = error;
    res.status(500).json({ message });
  }
};

export default {
  getPosts,
  getPostsByCategory,
  getPostById,
  createPost,
  createCommentForPost,
  updatePost,
  deletePost
};
  