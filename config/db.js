const mongoose = require("mongoose");

const connectDB = async () => {
    try {
      console.log(process.env.MONGO_URL);
      await mongoose.connect(`${process.env.MONGO_URL}`, {
        useNewUrlParser: true,
        
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
    } catch (error) {
      console.log(error.message);
      process.exit(1);
    }
  };

module.exports = connectDB;
