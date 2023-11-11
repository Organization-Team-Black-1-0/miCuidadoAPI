import { sign } from "jsonwebtoken";
import User, { findOne, updateOne, findById } from "../Models/user.model.js";
import Token, { findOne as _findOne } from "../Models/token.model.js";
import sendEmail from "../Utils/Emails/sendEmail.js";
import { randomBytes } from "crypto";
import { hash as _hash, compare } from "bcrypt";

const JWTSecret = process.env.JWT_SECRET;
const bcryptSalt = process.env.BCRYPT_SALT;
const clientURL = process.env.CLIENT_URL;

const signup = async (data) => {
  let user = await findOne({ email: data.email });
  if (user) {
    throw new Error("Email already exist", 422);
  }
  user = new User(data);
  const token = sign({ id: user._id }, JWTSecret);
  await user.save();

  return (data = {
    userId: user._id,
    email: user.email,
    name: user.name,
    token: token,
  });
};

const requestPasswordReset = async (email) => {
  const user = await findOne({ email });
  if (!user) throw new Error("Email does not exist");

  let token = await _findOne({ userId: user._id });
  if (token) await token.deleteOne();

  let resetToken = randomBytes(32).toString("hex");
  const hash = await _hash(resetToken, Number(bcryptSalt));

  await new Token({
    userId: user._id,
    token: hash,
    createdAt: Date.now(),
  }).save();

  const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

  sendEmail(
    user.email,
    "Password Reset Request",
    {
      name: user.name,
      link: link,
    },
    "./template/requestResetPassword.handlebars"
  );
  return { link };
};

const resetPassword = async (userId, token, password) => {
  let passwordResetToken = await _findOne({ userId });

  if (!passwordResetToken) {
    throw new Error("Invalid or expired password reset token");
  }

  console.log(passwordResetToken.token, token);

  const isValid = await compare(token, passwordResetToken.token);

  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }

  const hash = await _hash(password, Number(bcryptSalt));

  await updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
  );

  const user = await findById({ _id: userId });

  sendEmail(
    user.email,
    "Password Reset Successfully",
    {
      name: user.name,
    },
    "./template/resetPassword.handlebars"
  );

  await passwordResetToken.deleteOne();

  return { message: "Password reset was successful" };
};

export default {
  signup,
  requestPasswordReset,
  resetPassword,
};
