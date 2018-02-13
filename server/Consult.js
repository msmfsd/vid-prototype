import mongoose from 'mongoose';

const ConsultSchema = new mongoose.Schema({
  uID: { type: String, unique: true, required: true },
  status: { type: String, required: true },
});

const Consult = mongoose.model('Consult', ConsultSchema);

export default Consult;
