import Consult from '../models/Consult'

export const getConsults = (req, res) => {
 Consult.find({}).sort({ dateScheduled: -1 }).exec(function(err, consults) {
   if (err) throw err;
   if (!consults || consults.length === 0) { return res.status(500).send('No consults found'); }
   // response
   res.status(200).json(consults);
 });
}

export const getConsultById = (req, res) => {
  const id = req.params.id.toString();
  Consult.findById(id, (err, consult) => {
    if (err) throw err;
    if (!consult) { return res.status(500).send('No consult found'); }
    // response
    res.status(200).json(consult);
  });
}

export const updateConsultStatusById = (req, res) => {
  const id = req.params.id.toString();
  const status = req.body.status;
  Consult.findOneAndUpdate({ _id: id }, { status: status }, (err, consult) => {
    if (err) throw err;
    if (!consult) { return res.status(500).send('No consult found'); }
    // response
    res.status(200).json({ success: true, message: `Consult status updated to ${status}` });
  });
};
