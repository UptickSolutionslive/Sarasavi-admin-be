const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wastedJobSchema = new Schema({
  job_id: {
    type: Schema.Types.ObjectId,
    ref: "job",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("wastedJob", wastedJobSchema);
