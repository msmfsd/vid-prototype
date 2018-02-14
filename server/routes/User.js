import User from '../models/User'

export const getUsers = (req, res) => {
 User.find({}).sort({ role: -1 }).exec(function(err, users) {
   if (err) throw err;
   // at least 1 project?
   if (!users || users.length === 0) { return res.status(500).send('No users found'); }
   // response
   res.status(200).json(users);
 });
}

export const getUserById = (req, res) => {
  var id = req.params.id.toString();
  User.findById(id, (err, user) => {
    if (err) throw err;
    if (!user) { return res.status(500).send('No user found'); }
    // response
    res.status(200).json(user);
  });
}
