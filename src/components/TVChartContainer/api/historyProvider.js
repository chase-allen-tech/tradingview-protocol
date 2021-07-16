var rp = require("request-promise").defaults({ json: true });

//backend API url
const api_root = "https://backtradingview.tradeasy.tech";
const history = {};

export default {
    history: history,

    getBars: function (symbolInfo, resolution, from, to, first, limit) {
        var split_symbol = symbolInfo.name.split(/[:/]/);
        const url = "/api/trading";
        const qs = {
            fsym: split_symbol[0],
            tsym: split_symbol[1],
            fromTs: from ? from : "",
            toTs: to ? to : "",
            limit: limit ? limit : 2000,
            resolution,
        };
        //request to the backend
        return rp({
            url: `${api_root}${url}`,
            qs,
        }).then((data) => {
            // console.log({data})
            if (data.Response && data.Response === "Error") {
                console.log("API error:", data.Message);
                return [];
            }
            if (data.Data.length) {
                console.log(
                    `Actually returned: ${new Date(
                        data.TimeFrom * 1000
                    ).toISOString()} - ${new Date(
                        data.TimeTo * 1000
                    ).toISOString()}`
                );
                var bars = data.Data.map((el) => {
                    return {
                        time: el.time * 1000, //TradingView requires bar time in ms
                        low: el.low,
                        high: el.high,
                        open: el.open,
                        close: el.close,
                        volume: el.volumefrom,
                    };
                });
                if (first) {
                    var lastBar = bars[bars.length - 1];
                    history[symbolInfo.name] = { lastBar: lastBar };
                }
                return bars;
            } else {
                return [];
            }
        });
    },
};
