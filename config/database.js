import mongoose from 'mongoose';

const { MONGO_URL } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

const setupDatabase = () => {
  if (
    mongoose.connection.readyState !== 1
    || mongoose.connection.readyState !== 2
  ) {
    mongoose
      .connect(MONGO_URL, options)
      .then(() => {
        console.info('INFO - MongoDB Database connected.');
      })
      .catch(err => console.log('ERROR - Unable to connect to the database:', err));
  }
};

export default setupDatabase;
