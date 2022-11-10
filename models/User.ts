import { model, Schema } from "mongoose";

const User = new Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  diskSpace: {type: Number, default: 1024**3*10},
  usedSpace: {type: Number, default: 0},
  avatar: {type: String},
  files: [{type: Schema.Types.ObjectId, ref: 'file'}],
})

export default model('User', User)