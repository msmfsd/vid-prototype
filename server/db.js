import mongoose from 'mongoose';
import User from './User'
import Consult from './Consult'

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
    // if no users found create default user w dummy data
    if (!user) {
      var defaultUser1 = new User({
        username: 'drblah@email.com.au',
        name: 'Doctor Blah',
      });
      defaultUser1.save((err) => {
        // send response
        if (err) { console.log(`Error: ${err}`); }
        else { next(); }
      });
    }
    else { next(); }
  });
}
