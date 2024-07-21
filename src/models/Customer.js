const mongoose = require('mongoose');

// initializing the schemas
const customerSchema = new mongoose.Schema({
    customer_name: { type: String, required: true },
    dob: { type: Date, required: true },
    monthly_income: { type: Number, required: true }
});

// make table
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
