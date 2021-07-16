import * as React from "react";
import "./App.css";
import { TVChartContainer } from "./components/TVChartContainer/index";

export default function App(props) {
    const intervals = [1, 5, 15, 30, 60, 240, 1440];
    const tickers = [
        { key: 101, val: "EUR/USD" },
        { key: 102, val: "USD/CHF" },
        { key: 103, val: "GBP/USD" },
        { key: 104, val: "USD/JPY" },
        { key: 105, val: "AUD/USD" },
        { key: 106, val: "USD/CAD" },
        { key: 107, val: "ES35" },
        { key: 108, val: "UK100" },
        { key: 114, val: "US30" },
        { key: 116, val: "US500" },
        { key: 117, val: "USTEC" },
        { key: 118, val: "JP225" },
        { key: 119, val: "DE30" },
        { key: 120, val: "BTC/USD" },
        { key: 121, val: "ETH/USD" },
        { key: 122, val: "LTC/USD" },
        { key: 124, val: "XAU/USD" },
        { key: 125, val: "XAG/USD" },
        { key: 126, val: "XBR/USD" },
        { key: 127, val: "XTI/USD" },
        { key: 130, val: "PPC/USD" },
        { key: 131, val: "NMC/USD" },
        { key: 133, val: "EMC/USD" },
    ];
    return (
        <TVChartContainer
            interval={
                intervals[Number(props.match.params.time_frame) - 1]
                    ? intervals[Number(props.match.params.time_frame) - 1]
                    : 15
            }
            symbol={
                tickers.find((ele) => ele.key == props.match.params.ticker)
                    ? tickers.find(
                          (ele) => ele.key == props.match.params.ticker
                      ).val
                    : "GBP/USD"
            }
            fullscreen
            start_date={props.match.params.start_date}
            end_date={props.match.params.end_date}
            disabled_features={[
                "header_symbol_search",
                "header_compare",
                "header_saveload",
            ]}
            enabled_features={["header_widget"]}
            // timeOut={
            //   props.match.params.timeOut
            // }
            // validateId={
            //   props.match.params.validateId
            // }
            // currency={
            //   props.match.params.currency
            // }
            // type={
            //   props.match.params.type
            // }
            // lang={
            //   props.match.params.lang
            // }
        />
    );
}
