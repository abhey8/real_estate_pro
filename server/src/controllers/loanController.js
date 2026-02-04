const prisma = require('../config/db');

const applyForLoan = async (req, res) => {
    try {
        const {
            listingId,
            loanAmount,
            tenure,
            purpose,
            employment,
            annualIncome,
            name,
            email,
            phone,
            address
        } = req.body;

        const loanApplication = await prisma.loanApplication.create({
            data: {
                userId: req.user.id,
                listingId: listingId ? parseInt(listingId) : null,
                loanAmount: parseFloat(loanAmount),
                tenure: parseInt(tenure),
                purpose,
                employment,
                annualIncome: parseFloat(annualIncome),
                name,
                email,
                phone,
                address,
                status: 'PENDING'
            }
        });

        res.status(201).json({ loanApplication });
    } catch (error) {
        console.error('Error creating loan application:', error);
        res.status(500).json({ error: 'Failed to apply for loan' });
    }
};

const getLoans = async (req, res) => {
    try {
        const loans = await prisma.loanApplication.findMany({
            where: { userId: req.user.id },
            include: {
                listing: {
                    include: {
                        images: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ loans });
    } catch (error) {
        console.error('Error fetching loans:', error);
        res.status(500).json({ error: 'Failed to fetch loans' });
    }
};

module.exports = {
    applyForLoan,
    getLoans
};
