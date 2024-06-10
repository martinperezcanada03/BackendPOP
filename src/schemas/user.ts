import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Product' }], 
  conversations: [{ 
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  }] 
},
{
  versionKey: false, 
  toJSON: {
    transform: function (doc, ret) {
      return ret;
    }
  }
});

export interface User extends Document {
  id?: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  favorites: string[]; 
  conversations: { productId: string, userId: string }[]; 
}
