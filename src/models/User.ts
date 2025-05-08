import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, required: true, default: true },
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: "Family", required: false },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission", required: true, default: [] }],
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true, default: [] }],
    otp: { type: String, required: false },
    profileImage: { type: String, required: false },
});

export const User = mongoose.model('User', userSchema);
