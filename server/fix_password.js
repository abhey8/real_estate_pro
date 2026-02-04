const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    const email = 'test@example.com';
    const password = 'password';

    console.log(`Resetting password for ${email}...`);

    // Generate a valid hash using the installed bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });
        console.log(`Success! Updated password for user: ${user.name}`);
        console.log(`New Hash: ${hashedPassword}`);
    } catch (error) {
        console.error('Error updating user:', error);
        // If user doesn't exist, create it
        if (error.code === 'P2025') {
            console.log('User not found, creating new test user...');
            await prisma.user.create({
                data: {
                    name: 'Test User',
                    email: email,
                    password: hashedPassword,
                    phone: '1234567890'
                }
            });
            console.log('Created new test user.');
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
