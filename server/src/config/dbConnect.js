const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const dbConnect = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log(`✅ DB Connected Successfully`);
    } catch (err) {
        console.error(`❌ Database Connection Error: ${err.message}`);
        process.exit(1); 
    }
};

module.exports = dbConnect;
