import mongoose from "mongoose";

const performanceSchema = new mongoose.Schema({}, { strict: false });

const Performance = mongoose.model("Performance", performanceSchema, "product_performance_with_matches");

export default Performance;
