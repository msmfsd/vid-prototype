import mongoose from 'mongoose';
import User from './models/User'

export const startDatabase = () => {
  mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
  mongoose.connection.on('error', function(err) {
    console.log('MongoDB Connection Error. Ensure MongoDB is running.');
    console.log(err);
    process.exit(1);
  });
}


export const initDatabase = (req, res, next) => {
  User.findOne({ username: 'drblah@email.com.au' }, (err, user) => {
    if (err) throw err;
    // if no users found create default users w dummy data
    if (!user) {
      const defaultUsers = [
        { username: 'drblah@email.com.au', name: 'Doctor Blah', role: 'Doctor' },
        { username: 'patient1@email.com.au', name: 'Patient One', role: 'Patient' },
        { username: 'patient2@email.com.au', name: 'Patient Two', role: 'Patient' },
      ];
      User.insertMany(defaultUsers, (err, docs) => {
        if (err) throw err;
        else { next(); }
      });
    }
    else { next(); }
  });
}
