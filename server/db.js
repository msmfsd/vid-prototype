import mongoose from 'mongoose';
import User from './models/User'
import Consult from './models/Consult'

export const startDatabase = () => {
  mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
  mongoose.connection.on('error', function(err) {
    console.log('MongoDB Connection Error. Ensure MongoDB is running.');
    console.log(err);
    process.exit(1);
  });
}


export const initDatabase = (req, res, next) => {
  next();
  /*User.findOne({ username: 'drblah@email.com.au' }, (err, user) => {
    if (err) throw err;
    // if no users found create default users w dummy data
    if (!user) {
      var user1 = {
        _id: mongoose.Types.ObjectId('5a83a3d9bd78b8bee97fee47'),
        username: 'drblah@email.com.au',
        name: 'Julius Hibbert',
        role: 'Doctor',
      }
      var user2 = {
        _id: mongoose.Types.ObjectId('5a83a3d9bd78b8bee97fee48'),
        username: 'patient1@email.com.au',
        name: 'Barney Gumble',
        role: 'Patient',
      }
      var user3 = {
        _id: mongoose.Types.ObjectId('5a83a3d9bd78b8bee97fee49'),
        username: 'patient2@email.com.au',
        name: 'Marge Simpson',
        role: 'Patient',
      }

      User.save(user1, (err, user) => {
        if (err) throw err;
      });
      User.save(user2, (err, user) => {
        if (err) throw err;
      });
      User.save(user3, (err, user) => {
        if (err) throw err;
      });
    }
    else { next(); }
  });
  //
  Consult.findOne({status: 'SCHEDULED'}, (err, consult) => {
    if (err) throw err;
    // if no users found create default users w dummy data
    if (!consult) {
      var c = new Consult();
      c.dateScheduled = new Date();
      c.status = 'SCHEDULED';
      c.doctorId = mongoose.Types.ObjectId('5a83a3d9bd78b8bee97fee47');
      c.patientId = mongoose.Types.ObjectId('5a83a3d9bd78b8bee97fee48');
      var c2 = new Consult();
      c2.dateScheduled = new Date();
      c2.status = 'SCHEDULED';
      c2.doctorId = mongoose.Types.ObjectId('5a83a3d9bd78b8bee97fee47');
      c2.patientId = mongoose.Types.ObjectId('5a83a3d9bd78b8bee97fee48');
      var c3 = new Consult();
      c3.dateScheduled = new Date();
      c3.status = 'SCHEDULED';
      c3.doctorId = mongoose.Types.ObjectId('5a83a3d9bd78b8bee97fee47');
      c3.patientId = mongoose.Types.ObjectId('5a83a3d9bd78b8bee97fee48');

      c.save().then((err, result) => {
        console.log('c Created');
      });
      c2.save().then((err, result) => {
        console.log('c2 Created');
      });
      c3.save().then((err, result) => {
        console.log('c3 Created');
      });

    }
    else {
      next();
    }
  });*/
}
