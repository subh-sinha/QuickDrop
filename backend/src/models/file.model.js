import mongoose, { Schema } from "mongoose";

const FileSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        originalName: {
            type: String,
            required: true
        },

        publicId: {
            type: String,
            required: true
        },

        resourceType: {
            type: String,
            required: true,
            default: "raw"
        },

        fileUrl: {
            type: String,
            required: true
        },

        mimeType: {
            type: String,
            required: true
        },

        size: {
            type: Number,
            required: true
        },

        expiresAt: {
            type: Date,
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

const File = mongoose.model("File", FileSchema);

export default File;
