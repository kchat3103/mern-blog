import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true, //title must be unique
    },
    image: {
      type: String,
      default:
        'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png',
    },
    category: {
      type: String,
      default: 'uncategorized',
    },
    slug: {
      type: String,
      required: true,
      unique: true, //associated slug must be unique
    },
  },
  { timestamps: true } //include the timestamp too
);

const Post = mongoose.model('Post', postSchema);

export default Post;