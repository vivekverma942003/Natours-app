const crypto = require('crypto'); //built-in module for generating token
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please entered the name'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'please entered the email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'pls entered valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'pls entered the password '],
    minlength: 8,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide'],
    default: 'user',
  },
  confirmPassword: {
    type: String,
    required: [true, 'pls entered the same password as the password'],
    minlength: 8,
    validate: {
      //// this only work on create and save
      validator: function (val) {
        return this.password === val;
      },
      message: 'Passwords are not the same',
    },
  },
  changedPasswordAt: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// / creating the encryption of the password
userSchema.pre('save', async function (next) {
  // only run in the case when the password was actully modified
  if (!this.isModified('password')) return next();
  // hashing the password with the cpy cost 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete the password confirm field
  this.confirmPassword = undefined;
  next();
});

// creating password changed at
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) return next();
  this.changedPasswordAt = Date.now() - 1000;
  next();
});

// creating a method that non active user donot show in the total user
userSchema.pre(/^find/, function (next) {
  //this is query middleware so this is point current this
  this.find({ active: { $ne: false } });
  next();
});

/// creating the decryption of the password
// this method is instance method its mean its available in whole file
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.changedPasswordAt) {
    const changedTimeStamp = parseInt(
      this.changedPasswordAt.getTime() / 1000,
      10,
    );
    console.log(changedTimeStamp, JWTTimeStamp);
    return JWTTimeStamp < changedTimeStamp;
  }
  // false mean password is not used
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
