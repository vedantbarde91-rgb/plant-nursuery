const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace this URL with your MongoDB connection string
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/forest-nursery';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
