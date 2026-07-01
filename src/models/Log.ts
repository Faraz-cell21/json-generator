import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
  ip_address: string;
  schema_submitted: object;
  field_count: number;
  nesting_depth: number;
  records_requested: number;
  timestamp: Date;
}

const LogSchema = new Schema<ILog>(
  {
    ip_address: { type: String, required: true },
    schema_submitted: { type: Object, required: true },
    field_count: { type: Number, required: true },
    nesting_depth: { type: Number, required: true },
    records_requested: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Log ||
  mongoose.model<ILog>("Log", LogSchema);