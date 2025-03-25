const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory users array
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
];

// Root endpoint
app.get('/', (req, res) => {
  res.send('Hello World');
});

// GET /users - Return all users
app.get('/users', (req, res) => {
  res.json(users);
});

// GET /user/:id - Return a specific user
app.get('/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

// POST /user/:id - Create or update a user
app.post('/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const existingUserIndex = users.findIndex(user => user.id === id);
  
  if (existingUserIndex !== -1) {
    // Update existing user
    users[existingUserIndex] = { id, name, email };
    return res.json(users[existingUserIndex]);
  } else {
    // Create new user
    const newUser = { id, name, email };
    users.push(newUser);
    return res.status(201).json(newUser);
  }
});

// DELETE /user/:id - Delete a user
app.delete('/user/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = users.length;
  
  users = users.filter(user => user.id !== id);
  
  if (users.length === initialLength) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});