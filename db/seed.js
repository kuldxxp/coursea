import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import { UserModel } from './schema.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS ?? '12', 10);

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('connected to mongodb');

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
        const adminUsername = process.env.ADMIN_USERNAME || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
        
        const exisitingAdmin = await UserModel.findOne({ emailId: adminEmail });

        if (exisitingAdmin) {
            console.log(`Admin already exists: ${exisitingAdmin.username}`);
            await mongoose.disconnect();
            return;
        }

        const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

        const admin = new UserModel({
                name: 'Super Admin',
                username: adminUsername,
                emailId: adminEmail,
                password: hashedPassword,
                isActive: true,
        });

        await admin.save();
        console.log('admin account created');
        console.log(`email: ${adminEmail}`);
        console.log(`username: ${adminUsername}`);
        console.log(`password: ${adminPassword}`);

        await mongoose.disconnect();
        console.log('disconnected from mongodb');
    } catch (err) {
        console.error(`Error seeding admin: ${err}`);
        process.exit(1);
    }
};

seedAdmin();
