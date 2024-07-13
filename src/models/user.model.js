import mongoose, { Schema } from "mongoose";
import argon2 from "argon2";
import jwt from "jsonwebtoken"

// Define the User schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    company: 
        {
            type: Schema.Types.ObjectId,
            ref: "Company"
        }
    ,
    working: [
        {
            type: Schema.Types.ObjectId,
            ref: "Company"
        }
    ],
    refreshToken: {
        type: String
    }
}, { timestamps: true });

// Pre-save middleware to hash the password
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await argon2.hash(this.password, {
            type: argon2.argon2id
        });
        next();
    } catch (err) {
        next(err);
    }
});

// Instance method to verify password
userSchema.methods.isPasswordCorrect = async function(password) {
    return await argon2.verify(this.password, password);
};

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this.id,
            email:this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
     {
       _id: this.id,
     },
     process.env.REFRESH_TOKEN_SECRET,
     {
       expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
     }
   );
 };



// Create and export the User model
export const User = mongoose.model("User", userSchema);


