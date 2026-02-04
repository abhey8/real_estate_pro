const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.listing.count();
    console.log(`Total listings: ${count}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
