import historyProvider from "./historyProvider";
//real time view
// import stream from './stream'

const supportedResolutions = ["1", "5", "15", "30", "60", "240", "1440"];
const config = {
    supported_resolutions: supportedResolutions,
    supported_names: [
        { key: 101, val: "EUR/USD" },
        "USD/CHF",
        "GBP/USD",
        "USD/JPY",
        "AUD/USD",
        "USD/CAD",
        "ES35",
        "UK100",
        "US30",
        "US500",
        "USTEC",
        "JP225",
        "DE30",
        "BTC/USD",
        "ETH/USD",
        "LTC/USD",
        "XAU/USD",
        "XAG/USD",
        "XBR/USD",
        "XTI/USD",
        "PPC/USD",
        "NMC/USD",
        "EMC/USD",
    ],
};

export default {
    onReady: (cb) => {
        // console.log('=====onReady running')
        setTimeout(() => cb(config), 0);
    },
    searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
        // console.log('====Search Symbols running')
    },
    resolveSymbol: (
        symbolName,
        onSymbolResolvedCallback,
        onResolveErrorCallback
    ) => {
        // expects a symbolInfo object in response
        // console.log('======resolveSymbol running')
        // console.log('resolveSymbol:',{symbolName})
        var split_data = symbolName.split(/[:/]/);
        split_data[1] = split_data[1] ? split_data[1] : "invalido";
        var symbol_stub = {
            name: symbolName,
            description: "",
            type: "currency",
            session: "24x7",
            timezone: "Etc/UTC",
            ticker: symbolName,
            exchange: split_data[0],
            minmov: 1,
            pricescale: 100,
            has_intraday: true,
            intraday_multipliers: ["1", "5", "15", "30", "60", "240", "1440"],
            // intraday_multipliers: ["1", "15"],
            supported_resolution: supportedResolutions,
            supported_name: ["GBP/USD", "CAD/USD"],
            volume_precision: 8,
            data_status: "streaming",
        };

        if (split_data[1].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
            symbol_stub.pricescale = 100000;
        }
        setTimeout(function () {
            onSymbolResolvedCallback(symbol_stub);
            // console.log('Resolving that symbol....', symbol_stub)
        }, 0);

        // onResolveErrorCallback('Not feeling it today')
    },
    getBars: function (
        symbolInfo,
        resolution,
        from,
        to,
        onHistoryCallback,
        onErrorCallback,
        firstDataRequest
    ) {
        // console.log('=====getBars running')
        // console.log('function args',arguments)
        // console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
        historyProvider
            .getBars(symbolInfo, resolution, from, to, firstDataRequest)
            .then((bars) => {
                if (bars.length) {
                    onHistoryCallback(bars, { noData: false });
                } else {
                    onHistoryCallback(bars, { noData: true });
                }
            })
            .catch((err) => {
                console.log({ err });
                onErrorCallback(err);
            });
    },
    subscribeBars: (
        symbolInfo,
        resolution,
        onRealtimeCallback,
        subscribeUID,
        onResetCacheNeededCallback
    ) => {
        // console.log('=====subscribeBars runnning')
        // stream.subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback)
    },
    unsubscribeBars: (subscriberUID) => {
        // console.log('=====unsubscribeBars running')
        // stream.unsubscribeBars(subscriberUID)
    },
    calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
        //optional
        // console.log('=====calculateHistoryDepth running')
        // while optional, this makes sure we request 24 hours of minute data at a time
        // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
        // return resolution < 60 ? {resolutionBack: 'D', intervalBack: '1'} : undefined
        return undefined;
    },
    getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
        //optional
        // console.log('=====getMarks running')
    },
    getTimeScaleMarks: (
        symbolInfo,
        startDate,
        endDate,
        onDataCallback,
        resolution
    ) => {
        //optional
        // console.log('=====getTimeScaleMarks running')
    },
    getServerTime: (cb) => {
        // console.log('=====getServerTime running')
    },
};
