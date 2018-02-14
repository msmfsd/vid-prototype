import Consult from '../models/Consult'

export const getConsults = (req, res) => {
 Consult.find({}).sort({ dateScheduled: -1 }).exec(function(err, consults) {
   if (err) throw err;
   // at least 1 project?
   if (!consults || consults.length === 0) { return res.status(500).send('No consults found'); }
   // response
   res.status(200).json(consults);
 });
}
