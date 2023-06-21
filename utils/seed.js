const mongoose = require('mongoose');
const { User } = require('./models');

mongoose.connect('mongodb://localhost/socialMediaBackend', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const userData = [
  {
    username: 'user1',
    email: 'user1@example.com'
  },
  {
    username: 'user2',
    email: 'user2@example.com'
  },
  {
    username: 'user3',
    email: 'user3@example.com'
  },
  {
    username: 'user4',
    email: 'user4@example.com'
  },
  {
    username: 'user5',
    email: 'user5@example.com'
  }
  
];

const seedDatabase = async () => {
  try {
    await User.deleteMany(); // Clear existing users
    await User.insertMany(userData); // Insert new users
    console.log('Seed data inserted successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.disconnect(); // Close the connection
  }
};

seedDatabase();