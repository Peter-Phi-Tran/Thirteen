import MarketData from '../models/marketData.js';
import Instrument from '../models/instrument.js';
import socketService from '../services/socketService.js'; 

export const getMarketData = async (req, res, next) => {
    try{
        const { symbol, timeframe = '1h', limit = 100 } = req.query;

        const query = {};
        if (symbol){
            query.symbol = symbol.toUpperCase();
        }
        if (timeframe){
            query.timeframe = timeframe;
        }

        const marketData = await MarketData.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));
        
        res.json({
            success: true,
            data: { marketData}
        });
    } catch (error) {
        console.error('Error fetching market data:', error);
        next(error);
    }
};

export const getLatestPrice = async (req, res, next) =>{
    try{
        const { symbol } = req.params;

        const latestPrice = await MarketData.findOne({
            symbol: symbol.toUpperCase()
        })
        .sort({ timestamp: -1 })
        .limit(1);

        if( !latestPrice ){
            return res.status(404).json({
                success: false,
                message: 'Latest price not found for the given symbol.'
            });
        }
        res.json({
            success: true,
            data: { price: latestPrice }
        });
    } catch (error) {
        console.error('Error fetching latest price:', error);
        next(error);
    }
};

export const addMarketData = async (req, res, next) => {
    try{
        const{ symbol, open, high, low, close, volume, timeframe } = req.body;

        const marketData = new MarketData({
            symbol: symbol.toUpperCase(),
            timestamp: new Date(),
            open,
            high,
            low,
            close,
            volume,
            timeframe
        });

        await marketData.save();

        socketService.emitMarketData({
            symbol: marketData.symbol,
            close: marketData.close,
            timestamp: marketData.timestamp
        });

        res.status(201).json({
            success: true,
            message: 'Market data added successfully.',
            data: { marketData }
        });
    } catch (error) {
        next(error);
    }
};