import { Schema, model } from 'mongoose';

const employeeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email'],
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true,
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
  },
  salary: {
    type: Number,
    required: [true, 'Salary is required'],
    min: [0, 'Salary cannot be negative'],
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: {
      values: ['Male', 'Female', 'Other'],
      message: 'Gender must be Male, Female, or Other',
    },
    trim: true,
  },
  age: {
    type: Number,
    min: [16, 'Age must be at least 16'],
    max: [100, 'Age must be at most 100'],
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of Birth is required'],
    validate: {
      validator: function (value) {
        return value <= new Date(); // Ensure date is in the past or today
      },
      message: 'Date of Birth must be in the past or today',
    },
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^0[0-9]{9}$/, 'Phone number must be 10 digits and start with 0'],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Pre-save hook to calculate age from dateOfBirth
employeeSchema.pre('save', function (next) {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.age = age;
  }
  next();
});

export default model('Employee', employeeSchema);