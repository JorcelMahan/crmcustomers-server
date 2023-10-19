import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
}, {
    timestamps: true
});

ProductSchema.index({ name: "text" });

export default mongoose.model("Product", ProductSchema);