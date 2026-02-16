const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
    loanAmount: {
        type: Number,
        required: true
    },
    tenure: {
        type: Number,
        required: true
    },
    purpose: String,
    employment: String,
    annualIncome: {
        type: Number,
        required: true
    },
    name: String,
    email: String,
    phone: String,
    address: String,
    status: {
        type: String,
        default: 'PENDING'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

loanApplicationSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);
