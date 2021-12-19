const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({

    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        require: true,
    },
    employeeType: {
        type: String,
        require: true,
    },
    DOB: {
        type: String,
        require: true,
    },
    taxNumber: {
        type: String,
        require: true,
    },
    contact: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    hotelId: {
        type: String,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
});

const Employee = mongoose.model("employees", employeeSchema);
module.exports = Employee;