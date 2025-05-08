import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
});

export const Permission = mongoose.model("Permission", permissionSchema);
