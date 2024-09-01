import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  name: string;
  email: string;
  password: string,
  phoneNo: string, 
  profession: string
  token?: string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    profession: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      default: null,
    },
  },
);

// Hash the password before saving the user
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.set("password", await bcrypt.hash(this.get("password"), salt));
  }
  next();
});

// UserSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   delete obj.token;
//   return obj;
// };

const User = mongoose.model<IUser>("User", UserSchema);
export { IUser, User };
