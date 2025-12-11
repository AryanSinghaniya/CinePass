import 'dotenv/config';
import mongoose from 'mongoose';
import Booking from './models/Booking.js';
import User from './models/User.js';
import { clerkClient } from '@clerk/express';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}/cinepass`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

const fixData = async () => {
    await connectDB();

    // 1. Sync User from Clerk
    // Replace this with your actual User ID if different
    const userId = process.argv[2]; 
    if (!userId) {
        console.log("Please provide a user ID as an argument.");
        process.exit(1);
    }

    try {
        const clerkUser = await clerkClient.users.getUser(userId);
        
        const userData = {
            _id: clerkUser.id,
            email: clerkUser.emailAddresses[0].emailAddress,
            name: clerkUser.firstName + ' ' + clerkUser.lastName,
            image: clerkUser.imageUrl
        };

        // Upsert user (create if not exists, update if exists)
        await User.findByIdAndUpdate(userId, userData, { upsert: true, new: true });
        console.log(`User ${userId} synced to MongoDB.`);

    } catch (error) {
        console.error("Error syncing user:", error.message);
    }

    // 2. Mark latest booking as paid
    try {
        const latestBooking = await Booking.findOne({ user: userId }).sort({ createdAt: -1 });
        
        if (latestBooking) {
            latestBooking.isPaid = true;
            await latestBooking.save();
            console.log(`Booking ${latestBooking._id} marked as PAID.`);
        } else {
            console.log("No bookings found for this user.");
        }

    } catch (error) {
        console.error("Error updating booking:", error.message);
    }

    process.exit();
};

fixData();
