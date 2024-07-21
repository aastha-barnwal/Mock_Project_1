const Customer = require('../models/Customer');

// 2rd Api hit
const timeBasedController = async (req, res) => {
    try {
        const { customer_name, dob, monthly_income } = req.body;
        // current time
        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours();

        // check if day is monday
        if (day === 1) {
            return res.status(400).json({ message: 'Please don’t use this API on Monday' });
        }

        // check if hour lies between 8 & 15
        if (hour >= 8 && hour < 15) {
            return res.status(400).json({ message: 'Please try after 3pm' });
        }

        // If everything is okay
        const customer = new Customer({ customer_name, dob, monthly_income });
        await customer.save(); // save data to db
        res.status(200).json({ message: 'Customer saved successfully' }); // return successful message with status
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message }); // if anything goes wrong then error message
    }
};

module.exports = timeBasedController;
