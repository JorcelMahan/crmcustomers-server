import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (user, secret, expiresIn) => {
    const { id, email, name, lastName } = user;

    return jwt.sign({ id, email, name, lastName }, secret, { expiresIn });
}


const getUser = async (ctx) => {
    return ctx.user
}

const newUser = async (input) => {
    const { email, password } = input;

    const userFind = await User.findOne({ email });

    if (userFind) {
        throw new Error("The user already exists");
    }

    const salt = await bcryptjs.genSalt(10);
    input.password = await bcryptjs.hash(password, salt);

    try {
        const user = new User(input);
        user.save();
        return user;
    } catch (error) {
        console.log(error);
    }
}

const authUser = async (input) => {
    const { email, password } = input;

    const userFind = await User.findOne({ email });

    if (!userFind) {
        throw new Error("The user does not exist");
    }

    const passwordCorrect = await bcryptjs.compare(password, userFind.password);

    if (!passwordCorrect) {
        throw new Error("The password is incorrect");
    }

    return {
        token: createToken(userFind, process.env.SECRET_WORD, "24h")
    }

}


export default {
    getUser,
    newUser,
    authUser
}