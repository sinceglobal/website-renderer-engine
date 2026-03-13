import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://mongo:k3nmrjcbovdnoqlz@178.156.241.236:27017/interactify?authSource=admin";

async function testConn() {
    console.log('Testing connection to MongoDB...');
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Successfully connected!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

testConn();
