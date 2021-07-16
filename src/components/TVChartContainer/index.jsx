import * as React from "react";
import Datafeed from "./api/";

function getLanguageFromURL() {
    const regex = new RegExp("[\\?&]lang=([^&#]*)");
    const results = regex.exec(window.location.search);
    return results === null
        ? null
        : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function pintarLinea(widget, a1, b1, price1, price2) {
    widget.activeChart().createMultipointShape(
        [
            { time: a1, price: price1, channel: "open" },
            { time: b1, price: price2, channel: "open" },
        ],
        {
            shape: "trend_line",
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
            bringToFrontEnabled: true,
        }
    );
}
function pintarFlecha(widget, a1, shape, text, price) {
    let id = widget.activeChart().createShape(
        { time: a1, price, channel: "open" },
        {
            shape: shape,
            text: text,
            lock: true,
            disableSelection: true,
            disableSave: true,
            disableUndo: true,
        }
    );
    widget.activeChart().bringToFront([id]);
}
export class TVChartContainer extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    static defaultProps = {
        symbol: "GBP/USD",
        interval: "1",
        containerId: "tv_chart_container",
        libraryPath: "/charting_library/",
        chartsStorageUrl: "https://saveload.tradingview.com",
        chartsStorageApiVersion: "1.1",
        clientId: "tradingview.com",
        userId: "public_user_id",
        fullscreen: false,
        autosize: false,
        studiesOverrides: {},
        disabled_features: [],
        enabled_features: [],
    };
    componentDidMount() {
        const widgetOptions = {
            debug: false,
            symbol: this.props.symbol,
            datafeed: Datafeed,
            interval: this.props.interval,
            container_id: this.props.containerId,
            library_path: this.props.libraryPath,
            locale: getLanguageFromURL() || "en",
            disabled_features: this.props.disabled_features,
            enabled_features: this.props.enabled_features,
            charts_storage_url: this.props.chartsStorageUrl,
            charts_storage_api_version: this.props.chartsStorageApiVersion,
            client_id: this.props.clientId,
            user_id: this.props.userId,
            time_frames: [],
            fullscreen: this.props.fullscreen,
            autosize: false,
            overrides: {
                "mainSeriesProperties.showCountdown": true,
                "paneProperties.background": "#ecf9ff",
                "paneProperties.vertGridProperties.color": "#363c4e",
                "paneProperties.horzGridProperties.color": "#363c4e",
                "symbolWatermarkProperties.transparency": 90,
                "scalesProperties.textColor": "#AAA",
                "mainSeriesProperties.candleStyle.wickUpColor": "#336854",
                "mainSeriesProperties.candleStyle.wickDownColor": "#7f323f",
            },

            // timeframe: "0.5M"
        };

        const widget = (window.tvWidget = new window.TradingView.widget(
            widgetOptions
        ));
        const props = this.props;
        widget.onChartReady(() => {
            widget
                .activeChart()
                .onVisibleRangeChanged()
                .subscribe(null, ({ from, to }) => {
                    let dataLength = 0;
                    let chart_data = window.chart_data;
                    while (dataLength < chart_data.length) {
                        if (chart_data[dataLength].end === true) {
                            console.log("No voy a dibujar flechas.");
                            break;
                        }
                        try {
                            console.log("Si voy a dibujar flechas.");
                            let y_axix = chart_data[dataLength].y_axix;
                            let n = 0;
                            if (chart_data[dataLength].status == "P") {
                                if (y_axix.length > 0) {
                                    n = 0;
                                    let { operationsDetail } = chart_data[
                                        dataLength
                                    ];
                                    for (var i = 0; i < y_axix.length; i++) {
                                        if (operationsDetail[i].tipoOP != -1) {
                                            const profit = parseFloat(
                                                operationsDetail[i].OrderProf
                                            );
                                            let dateTime = operationsDetail[
                                                i
                                            ].fechaFin.split(" ");
                                            let date = dateTime[0].split("/");
                                            let time = dateTime[1].split(":");
                                            const fechaFin =
                                                new Date(
                                                    Date.UTC(
                                                        date[2],
                                                        parseInt(date[1]) - 1,
                                                        date[0],
                                                        time[0],
                                                        time[1],
                                                        time[2]
                                                    )
                                                ) / 1000;
                                            dateTime = operationsDetail[
                                                i
                                            ].fechaIni.split(" ");
                                            date = dateTime[0].split("/");
                                            time = dateTime[1].split(":");
                                            const fechaIni =
                                                new Date(
                                                    Date.UTC(
                                                        date[2],
                                                        parseInt(date[1]) - 1,
                                                        date[0],
                                                        time[0],
                                                        time[1],
                                                        time[2]
                                                    )
                                                ) / 1000;
                                            const precioFin = parseFloat(
                                                operationsDetail[i].precioFin
                                            );
                                            const precioIni = parseFloat(
                                                operationsDetail[i].precioIni
                                            );
                                            const balance = parseFloat(
                                                y_axix[i]
                                            );
                                            if (
                                                operationsDetail[
                                                    i
                                                ].tipoOP.indexOf("Buy") == 0 ||
                                                operationsDetail[
                                                    i
                                                ].tipoOP.indexOf("Compra") == 0
                                            ) {
                                                //buy
                                                if (
                                                    fechaFin > from &&
                                                    fechaFin < to &&
                                                    fechaIni > from &&
                                                    fechaIni < to
                                                )
                                                    pintarLinea(
                                                        widget,
                                                        fechaIni,
                                                        fechaFin,
                                                        precioIni,
                                                        precioFin
                                                    );
                                                if (
                                                    fechaIni > from &&
                                                    fechaIni < to
                                                )
                                                    pintarFlecha(
                                                        widget,
                                                        fechaIni,
                                                        "arrow_up",
                                                        "Buy",
                                                        precioIni
                                                    );
                                                if (
                                                    fechaFin > from &&
                                                    fechaFin < to
                                                )
                                                    pintarFlecha(
                                                        widget,
                                                        fechaFin,
                                                        "arrow_down",
                                                        profit,
                                                        precioFin
                                                    );
                                            } else {
                                                //sell
                                                if (
                                                    fechaFin > from &&
                                                    fechaFin < to &&
                                                    fechaIni > from &&
                                                    fechaIni < to
                                                )
                                                    pintarLinea(
                                                        widget,
                                                        fechaIni,
                                                        fechaFin,
                                                        precioIni,
                                                        precioFin
                                                    );
                                                if (
                                                    fechaIni > from &&
                                                    fechaIni < to
                                                )
                                                    pintarFlecha(
                                                        widget,
                                                        fechaIni,
                                                        "arrow_down",
                                                        "Sell" + "\n\n",
                                                        precioIni
                                                    );
                                                if (
                                                    fechaFin > from &&
                                                    fechaFin < to
                                                )
                                                    pintarFlecha(
                                                        widget,
                                                        fechaFin,
                                                        "arrow_up",
                                                        "\n" + profit,
                                                        precioFin
                                                    );
                                            }
                                        }
                                    }
                                }
                            } else if (chart_data[dataLength].status == "F") {
                                if (y_axix != "") {
                                    // JFS - 01/07/2020 - bug no se muestra la ultima operacion
                                    //if (y_axis_points.length < data.validation_points && y_axix.length > 0) {
                                    if (y_axix.length > 0) {
                                        let { operationsDetail } = chart_data[
                                            dataLength
                                        ];
                                        for (
                                            var i = 0;
                                            i < y_axix.length;
                                            i++
                                        ) {
                                            if (
                                                operationsDetail[i].tipoOP != -1
                                            ) {
                                                const profit = parseFloat(
                                                    operationsDetail[i]
                                                        .OrderProf
                                                );
                                                let dateTime = operationsDetail[
                                                    i
                                                ].fechaFin.split(" ");
                                                let date = dateTime[0].split(
                                                    "/"
                                                );
                                                let time = dateTime[1].split(
                                                    ":"
                                                );
                                                const fechaFin =
                                                    new Date(
                                                        Date.UTC(
                                                            date[2],
                                                            parseInt(date[1]) -
                                                                1,
                                                            date[0],
                                                            time[0],
                                                            time[1],
                                                            time[2]
                                                        )
                                                    ) / 1000;
                                                dateTime = operationsDetail[
                                                    i
                                                ].fechaIni.split(" ");
                                                date = dateTime[0].split("/");
                                                time = dateTime[1].split(":");
                                                const fechaIni =
                                                    new Date(
                                                        Date.UTC(
                                                            date[2],
                                                            parseInt(date[1]) -
                                                                1,
                                                            date[0],
                                                            time[0],
                                                            time[1],
                                                            time[2]
                                                        )
                                                    ) / 1000;

                                                const precioFin = parseFloat(
                                                    operationsDetail[i]
                                                        .precioFin
                                                );
                                                const precioIni = parseFloat(
                                                    operationsDetail[i]
                                                        .precioIni
                                                );
                                                const balance = parseFloat(
                                                    y_axix[i]
                                                );
                                                if (
                                                    operationsDetail[
                                                        i
                                                    ].tipoOP.indexOf("Buy") ==
                                                        0 ||
                                                    operationsDetail[
                                                        i
                                                    ].tipoOP.indexOf(
                                                        "Compra"
                                                    ) == 0
                                                ) {
                                                    //buy
                                                    if (
                                                        fechaFin > from &&
                                                        fechaFin < to &&
                                                        fechaIni > from &&
                                                        fechaIni < to
                                                    )
                                                        pintarLinea(
                                                            widget,
                                                            fechaIni,
                                                            fechaFin,
                                                            precioIni,
                                                            precioFin
                                                        );
                                                    if (
                                                        fechaIni > from &&
                                                        fechaIni < to
                                                    )
                                                        pintarFlecha(
                                                            widget,
                                                            fechaIni,
                                                            "arrow_up",
                                                            "Buy",
                                                            precioIni
                                                        );
                                                    if (
                                                        fechaFin > from &&
                                                        fechaFin < to
                                                    )
                                                        pintarFlecha(
                                                            widget,
                                                            fechaFin,
                                                            "arrow_down",
                                                            profit,
                                                            precioFin
                                                        );
                                                } else {
                                                    //sell
                                                    if (
                                                        fechaFin > from &&
                                                        fechaFin < to &&
                                                        fechaIni > from &&
                                                        fechaIni < to
                                                    )
                                                        pintarLinea(
                                                            widget,
                                                            fechaIni,
                                                            fechaFin,
                                                            precioIni,
                                                            precioFin
                                                        );
                                                    if (
                                                        fechaIni > from &&
                                                        fechaIni < to
                                                    )
                                                        pintarFlecha(
                                                            widget,
                                                            fechaIni,
                                                            "arrow_down",
                                                            "Sell" + "\n\n",
                                                            precioIni
                                                        );
                                                    if (
                                                        fechaFin > from &&
                                                        fechaFin < to
                                                    )
                                                        pintarFlecha(
                                                            widget,
                                                            fechaFin,
                                                            "arrow_up",
                                                            "\n" + profit,
                                                            precioFin
                                                        );
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } catch (err) {
                            console.log(err);
                        }
                        dataLength++;
                    }
                });

            // setTimeout(() => {
            //   let updateInterval = 3000;
            //   let countt = 0;
            //   var updateChart = async function (validateId, currency) {
            //     //modification needed

            //   updateChart(props.validateId, props.currency);

            //   let intervalFunction = setInterval(function () {
            //     updateChart(props.validateId, props.currency);
            //   }, updateInterval);
            // }, 2000);
        });
    }

    render() {
        return (
            <div id={this.props.containerId} className={"TVChartContainer"} />
        );
    }
}
