const Customer = require('../models/Customer');

// 3rd api hit
const dbSearchController = async (req, res) => {
    try {
        // starting time
        const start = process.hrtime();

        const now_date = new Date();
        const minAgeDate = new Date(now_date.getFullYear() - 25, now_date.getMonth(), now_date.getDate());
        const maxAgeDate = new Date(now_date.getFullYear() - 10, now_date.getMonth(), now_date.getDate());

        const customers = await Customer.find({
            dob: { $gte: minAgeDate, $lte: maxAgeDate }
        }).select('customer_name -_id');

        //ending time - starting time
        const end = process.hrtime(start);
        // converting to seconds
        const executionTime = end[0] + end[1] / 1e9;

        res.status(200).json({ customers, executionTime }); // customer name & total time
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message }); //error if something went wrong
    }
};

module.exports = dbSearchController;
