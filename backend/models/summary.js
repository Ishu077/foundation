import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const summarySchema = new Schema({
  
  title: {
    type: String,
    required: [true, 'Summary title is required'],
    trim: true
  },

  summaryText: {
    type: String,
    required: [true, 'Summary text is required'],
    minlength: [20, 'Summary must be at least 20 characters']
  },

  //ref
  // article: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Article',
  //   required: [true, 'Article reference is required']
  // },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },

  summaryLength: {  //mover to in presave coz, when the summary result is being generated the summaryText is not available at the time of creation so saving it just before the save !
    type: Number,
    default: function() {
      return this.summaryText.split(' ').length;
    }
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



// Indexes for performance
// summarySchema.index({ user: 1, createdAt: -1 });
// summarySchema.index({ article: 1 });

export default mongoose.model('Summary', summarySchema);

