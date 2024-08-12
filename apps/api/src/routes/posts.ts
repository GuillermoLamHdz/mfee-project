import express from 'express';

export const getPost = (id: string) => {
  return posts.find((p) => p.id === id);
};

const router = express.Router();
// Initialize posts array to save data in memory
const posts = [];

// GET /posts Return an array of all the posts with status code 200
router.get('/', (req, res) => {
  // Return all the posts with a 200 status code
  res.status(200).json(posts);
});

// GET /posts/category/:category Return an array of all the posts by category with status code 200
router.get('/category/:category', (req, res) => {
  // Retrieve the id from the route params
  const { category } = req.params;
  // Check if we have a post with that category
  const filteredPosts = posts.filter((p) => p.category === category);

  // Return the post with a 200 status code
  res.status(200).json(filteredPosts);
});

// GET /posts/:id Return a post by id with category object and each comment object in the array with status code 200
router.get('/:id', (req, res) => {
  // Retrieve the id from the route params
  const { id } = req.params;
  // Check if we have a post with that id
  const post = getPost(id);

  if (!post) {
    // If we don't find the post return a 404 status code with a message
    return res.status(404).json({ message: 'Post not found' });
  }

  // Return the post with a 200 status code
  res.status(200).json(post);
});

// POST /posts Create a new post and return the created post with status code 201
router.post('/', (req, res) => {
  // Retrieve the name from the request body
  const { title, image, description, category, comments} = req.body;

  if (!title || !image || !description || !category || !comments) {
    // If a required field is empty or undefined return a 400 status code with a message
    return res.status(400).json({ message: 'Missing field.' });
  }

  const newPost = {
    id: Date.now().toString(), // Convert id to string to match the value in get by id endpoint
    title,
    image,
    description,
    category,
    comments
  };

  // Add the new post to our array
  posts.push(newPost);

  // Return the created post with a 201 status code
  res.status(201).json(newPost);
});

// POST /posts/:id/comments Create a comment inside the post and return the comment with status code 201
router.post('/:id/comments', (req, res) => {
  // Retrieve the name from the request body
  const { id } = req.params;
  const { author, content} = req.body;

  if (!author || !content) {
    // If a required field is empty or undefined return a 400 status code with a message
    return res.status(400).json({ message: 'Missing field.' });
  }

  const newComment = {
    author,
    content
  };

  const currentPost = getPost(id);
  if (!currentPost) {
    return res.status(404).json({ message: 'Post not found' });
  }

  // Add the new comment to comments array
  currentPost.comments.push(newComment);

  // Return the created post with a 201 status code
  res.status(201).json(newComment);
});

// PATCH /posts/:id Update post information and return the updated post with status code 200
router.patch('/:id', (req, res) => {
  // Retrieve the id from the route params
  const { id } = req.params;
  // Retrieve the index of the category in the array
  const postIndex = posts.findIndex((p) => p.id === id);

  // "findIndex" will return -1 if there is no match
  if (postIndex === -1) {
    // If we don't find the category return a 404 status code with a message
    return res.status(404).json({ message: 'Post not found' });
  }

  // Generate a copy of our post
  const updatedPost = { ...posts[postIndex] };
  // Retrieve the attributes from the request body
  const {
    title,
    image,
    description,
    category,
    comments
  } = req.body;

  if (title) {
    updatedPost.title = title;
  }

  if (image) {
    updatedPost.image = image;
  }

  if (description) {
    updatedPost.description = description;
  }

  if (category) {
    updatedPost.category = category;
  }

  if (comments) {
    updatedPost.comments = comments;
  }

  // Update the category in our array
  posts[postIndex] = updatedPost;

  // Return the updated category with a 200 status code
  res.status(200).json(updatedPost);
});

// DELETE /posts/:id Delete the post and return the deleted post with status code 200 or 204 if you decide to not return anything
router.delete('/:id', (req, res) => {
  // Retrieve the id from the route params
  const { id } = req.params;
  // Retrieve the index of the post in the array
  const postIndex = posts.findIndex((p) => p.id === id);

  // "findIndex" will return -1 if there is no match
  if (postIndex === -1) {
    // If we don't find the post return a 404 status code with a message
    return res.status(404).json({ message: 'Post not found' });
  }

  // Remove the post from the array
  posts.splice(postIndex, 1);

  // Return a 204 status code
  res.status(204).send();
});


export default router;