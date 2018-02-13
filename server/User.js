import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  name: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);

export default User
