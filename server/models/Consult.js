import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ConsultSchema = new Schema({
  dateScheduled: { type: Date, required: true },
  status: { type: String, required: true, enum: ['SCHEDULED', 'ACTIVE', 'CANCELLED', 'COMPLETED'] },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Consult = mongoose.model('Consult', ConsultSchema);

export default Consult;
