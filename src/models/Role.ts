import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission", required: false }],
});

export const Role = mongoose.model("Role", roleSchema);
