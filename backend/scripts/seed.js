require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected.');

    // Check if an admin already exists
    const adminExists = await Admin.findOne({ username: 'admin' });

    if (adminExists) {
      console.log('Admin account already exists. Re-seeding password...');
      await Admin.deleteOne({ username: 'admin' });
    }

    const defaultAdmin = new Admin({
      username: 'admin',
      password: 'admin123', // Will be hashed by pre-save hook
    });

    await defaultAdmin.save();
    console.log('-------------------------------------------');
    console.log('Admin seeded successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('-------------------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
