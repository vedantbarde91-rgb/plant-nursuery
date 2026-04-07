// Run this file to insert demo data into MongoDB
// Command: node seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Plant = require('./models/Plant');
const Site = require('./models/Site');
const Employee = require('./models/Employee');
const User = require('./models/User');
const Inward = require('./models/Inward');

const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  // Clear existing data
  await Plant.deleteMany();
  await Site.deleteMany();
  await Employee.deleteMany();
  await User.deleteMany();
  await Inward.deleteMany();

  // Demo Plants (only 3 as requested)
  const plants = await Plant.insertMany([
    { name: 'Neem', species: 'Azadirachta indica', category: 'Tree', quantity: 3, nurseryLocation: 'Block A', costPerUnit: 25 },
    { name: 'Tulsi', species: 'Ocimum sanctum', category: 'Medicinal', quantity: 2, nurseryLocation: 'Block B', costPerUnit: 15 },
    { name: 'Rose', species: 'Rosa indica', category: 'Flower', quantity: 2, nurseryLocation: 'Block C', costPerUnit: 30 },
  ]);

  // Demo Sites (2)
  await Site.insertMany([
    { name: 'City School', type: 'School', location: 'Main Road, Pune', contactPerson: 'Mr. Sharma', phone: '9876543210' },
    { name: 'Green Park Project', type: 'Project', location: 'Ring Road, Pune', contactPerson: 'Ms. Patil', phone: '9988776655' },
  ]);

  // Demo Employees (3)
  await Employee.insertMany([
    { name: 'Ramesh Kumar', role: 'Manager', phone: '9000000001', email: 'ramesh@nursery.com' },
    { name: 'Suresh Driver', role: 'Driver', phone: '9000000002', email: 'suresh@nursery.com' },
    { name: 'Priya Supervisor', role: 'Supervisor', phone: '9000000003', email: 'priya@nursery.com' },
  ]);

  // Demo Users (Admin + Staff)
  await User.create({ name: 'Admin User', email: 'admin@nursery.com', password: 'admin123', role: 'Admin' });
  await User.create({ name: 'Staff User', email: 'staff@nursery.com', password: 'staff123', role: 'Staff' });

  console.log('✅ Demo data seeded successfully!');
  console.log('-----------------------------------');
  console.log('🔑 Admin Login: admin@nursery.com / admin123');
  console.log('🔑 Staff Login: staff@nursery.com / staff123');
  console.log('-----------------------------------');
  process.exit();
};

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
