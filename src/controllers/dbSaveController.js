const Customer = require('../models/Customer');

// middleware
const { rateLimit } = require('../utils/rateLimiter');

// first api
const dbSaveController = async (req, res) => {
    try {
        const { customer_name, dob, monthly_income } = req.body; //store requested data
        //calculating age
        const age = new Date().getFullYear() - new Date(dob).getFullYear();

        // check for required data
        if (!customer_name || !dob || !monthly_income) {
            return res.status(400).json({ message: 'All parameters are required' });
        }

        // check age requirement
        if (age <= 15) {
            return res.status(400).json({ message: 'Age must be above 15' });
        }

        // calling method for 2min and 5 min api hit
        const { allowed, message } = rateLimit(customer_name);

        if (!allowed) {
            return res.status(429).json({ message });
        }

        //if customer is new or 2min or 5min case is not there
        const customer = new Customer({ customer_name, dob, monthly_income });
        await customer.save(); // save data to db
        res.status(200).json({ message: 'Customer saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message }); //error if anything went wrong
    }
};

module.exports = dbSaveController;
