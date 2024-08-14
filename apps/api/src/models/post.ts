import mongoose, { Document, Schema } from 'mongoose';

interface IPost extends Document {
  id: string;
  title: string;
  image: string;
  description: string;
  category: string;
  comments: string[];
}

export const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Property is required']
    },
    image: {
      type: String,
      required: [true, 'Property is required']
    },
    description: {
      type: String,
      required: [true, 'Property is required']
    },
    category: {
      type: String,
      required: [true, 'Property is required']
    },
    comments: {
      type: [String]
    },
  },
  {
    timestamps: true
  }
);

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
