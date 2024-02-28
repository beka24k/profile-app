const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    lastName: {
        type: String,
        required: [true, 'A user must have a last name'],
      },
      firstName: {
        type: String,
        required: [true, 'A user must have a first name'],
      },
    email: {
        type: String,
        required: [true, 'A user must have email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'A user must have a valid email'],
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
          // This only works on CREATE or SAVE!
        validator: function (el) {
            return el === this.password; // abs === abs
        },
        message: 'Passwords are not the same!',
        },
    },
    age: {
        type: Number,
        required: [true, 'A user must have a age'],
    },
    country: {
        type: String,
        required: [true, 'A user must have a country'],
    },
    role: {
        type: String,
        required: [true, 'role aadmin or basic'],
    },
    img: {
        type: String,
        default:"https://cdn-icons-png.flaticon.com/512/149/149452.png  ",
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
