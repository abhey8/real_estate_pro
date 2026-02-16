const LoanApplication = require('../models/LoanApplication');

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

        const loanApplication = await LoanApplication.create({
            user: req.user._id,
            listing: listingId || null,
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
        });

        res.status(201).json({ loanApplication });
    } catch (error) {
        console.error('Error creating loan application:', error);
        res.status(500).json({ error: 'Failed to apply for loan' });
    }
};

const getLoans = async (req, res) => {
    try {
        const loans = await LoanApplication.find({ user: req.user._id })
            .populate('listing')
            .sort({ createdAt: -1 });

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
