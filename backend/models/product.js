import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter Product name"],
        maxLength: [200, "Product name cannot exceed 200 characters"]
    },
    price: {
        type: Number,
        required: [true, "Please enter Product price"],
        maxLength: [5, "Product price cannot exceed 5 digits"]
    },
    description: {
        type: String,
        required: [true, "Please enter Product description"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        },
    ],
    category: {
        type: String,
        required: [true, "Please enter product category"],
        enum: {
            values: [
                "Burger",
                "Pizza",
                "Cake's",
                "Drink",
                "Paratha",
                "Roti",
                "Rice",
                "South Indian",
                "Tea",
                "Coffe",
                "Sandwich",
                "Nonveg",
                "veg",
                "Home",
            ],
            message: "Please select correct category",
        },
    },
    seller: {
        type: String,
        required: [true, "Please enter Product seller"],
    },
    stock: {
        type: Number,
        required: [true, "Please enter Product stock"],
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
