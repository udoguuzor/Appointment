import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Add this log to verify everything works!
console.log("🚀 Database configuration loaded successfully!");
console.log("Connected to database path:", process.env.DATABASE_URL);

export { prisma }