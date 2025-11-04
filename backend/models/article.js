import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  // Content
  title: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },

  content: {
    type: String,
    required: [true, 'Article content is required'],
    // minlength: [50, 'Content must be at least 50 characters']
  },

  //ref to 
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  summary:{
    type: Schema.Types.ObjectId,
    ref: 'Summary',
    required: [true, 'Summary is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});


export default mongoose.model('Article', articleSchema);

