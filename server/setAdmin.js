import 'dotenv/config';
import { clerkClient } from '@clerk/express';

const userId = process.argv[2];

if (!userId) {
  console.error('Please provide a User ID (e.g., user_2p...)');
  process.exit(1);
}

async function setAdmin() {
  try {
    await clerkClient.users.updateUser(userId, {
      privateMetadata: {
        role: 'admin',
      },
    });
    console.log(`Success! User ${userId} is now an admin.`);
  } catch (error) {
    console.error('Error updating user:', error.errors ? error.errors[0].message : error);
  }
}

setAdmin();
