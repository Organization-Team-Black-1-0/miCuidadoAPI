import mongoose from "mongoose";
import bcrypt from 'bcrypt';
// Con esto definimos el esquema de usuario
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
    }, 
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        index: { unique: true },
    },
})
userSchema.pre("save", async function(next) {
    const user = this;

    if (!user.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        console.log(error);
        throw new Error("Error al codificar la contraseña");
    }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const match = await bcrypt.compare(candidatePassword, this.password);
        return match;
    } catch (error) {
        throw new Error(error);
    }
};

export const User = mongoose.model("User", userSchema);

export default User;
