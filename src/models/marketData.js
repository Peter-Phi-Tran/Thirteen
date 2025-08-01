import mongoose from 'mongoose';

const marketDataSchema = new mongoose.Schema({
    symbol: {
        type: String, 
        required: true,
        uppercase: true
    },
    timestamp: { 
        type: Date, 
        required: true 
    },
    open: { 
        type: mongoose.Schema.Types.Decimal128, 
        required: true 
    },
    high: { 
        type: mongoose.Schema.Types.Decimal128, 
        required: true 
    },
    low: { 
        type: mongoose.Schema.Types.Decimal128, 
        required: true 
    },
    close: { 
        type: mongoose.Schema.Types.Decimal128, 
        required: true 
    },
    volume: { 
        type: Number, 
        required: true 
    }
},
{
    timestamps: true
});

marketDataSchema.index({ symbol: 1, timestamp: -1 });

const MarketData = mongoose.model('MarketData', marketDataSchema);

export default MarketData;