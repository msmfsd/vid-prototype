import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['Doctor', 'Specialist', 'Patient'] },
});

const User = mongoose.model('User', UserSchema);

export default User
