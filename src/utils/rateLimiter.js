const rateLimitMap = new Map();

const rateLimit = (customer_name) => {
    // current date
    const current = Date.now();
    // minute to milisecond conversion

    const twoMinutes = 2 * 60 * 1000; // for 2 min
    const fiveMinutes = 5 * 60 * 1000; // for 5 minutes

    // user is present or not, if not empty array
    const customerRequests = rateLimitMap.get(customer_name) || [];

    // for 5 minute time window api hit
    const allTimeStampArray = Array.from(rateLimitMap.values()) || [];//[[t1,t2],[t1,t2]]
    allTimeStamp = [];
    allTimeStampArray.forEach(element => {
        allTimeStamp.push(...element);  // spreading the 2D array
    });

    // Filter older request within time frame
    const recentRequests2Min = customerRequests.filter(old => current - old < twoMinutes);
    const recentRequests5Min = allTimeStamp.filter(old => current - old < fiveMinutes);

    // Check the requests exceed limit
    if (recentRequests2Min.length >= 1) {
        return { allowed: false, message: 'Maximum limit of 1 request per 2 minutes exceeded' };
    }

    if (recentRequests5Min.length >= 2) {
        return { allowed: false, message: 'Maximum limit of 2 requests per 5 minutes exceeded' };
    }

    // Push the current time
    customerRequests.push(current);
    rateLimitMap.set(customer_name, customerRequests);

    return { allowed: true };
};

module.exports = { rateLimit };