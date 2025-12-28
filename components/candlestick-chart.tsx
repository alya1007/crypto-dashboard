"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { OHLCData } from "./home/coin-overview";
import {
	getCandlestickConfig,
	getChartConfig,
	PERIOD_BUTTONS,
	PERIOD_CONFIG,
} from "@/constants";
import {
	CandlestickSeries,
	createChart,
	IChartApi,
	ISeriesApi,
} from "lightweight-charts";
import { fetcher } from "@/lib/coingecko.actions";
import { get } from "http";
import { convertOHLCData } from "@/lib/utils";

export type Period =
	| "daily"
	| "weekly"
	| "monthly"
	| "3months"
	| "6months"
	| "yearly"
	| "max";

type CandlestickChartProps = {
	children: React.ReactNode;
	data?: OHLCData[];
	liveOhlcv?: OHLCData | null;
	coinId: string;
	height?: number;
	mode?: "historical" | "live";
	initialPeriod?: Period;
	liveInterval?: "1s" | "1m";
	setLiveInterval?: (interval: "1s" | "1m") => void;
};

const CandlestickChart = ({
	children,
	data,
	liveOhlcv = null,
	coinId,
	height = 360,
	mode = "historical",
	initialPeriod = "daily",
	liveInterval = "1m",
	setLiveInterval,
}: CandlestickChartProps) => {
	const [period, setPeriod] = useState(initialPeriod);

	const chartContainerRef = useRef<HTMLDivElement>(null);
	const chartRef = useRef<IChartApi>(null);
	const candleSeriesRef = useRef<ISeriesApi<"Candlestick">>(null);

	const [ohlcData, setOhlcData] = useState<OHLCData[]>(data ?? []);
	const [isPending, startTransition] = useTransition();

	const fetchOHLCData = async (selectedPeriod: Period) => {
		const { days } = PERIOD_CONFIG[selectedPeriod];
		try {
			const newData = await fetcher<OHLCData[]>(`coins/${coinId}/ohlc`, {
				vs_currency: "usd",
				days,
				precision: "full",
			});

			setOhlcData(newData ?? []);
		} catch (err) {
			console.log("Error fetching OHLC data:", err);
			return;
		}
	};

	const handlePeriodChange = (newPeriod: Period) => {
		if (newPeriod === period) return;

		startTransition(async () => {
			setPeriod(newPeriod);
			await fetchOHLCData(newPeriod);
		});
	};

	useEffect(() => {
		const container = chartContainerRef.current;
		if (!container) return;

		const showTime = ["daily", "weekly", "monthly"].includes(period);

		const chart = createChart(container, {
			...getChartConfig(height, showTime),
			width: container.clientWidth,
		});

		const series = chart.addSeries(CandlestickSeries, getCandlestickConfig());
		const convertedToSeconds = ohlcData.map(
			(item) =>
				[
					Math.floor(item[0] / 1000),
					item[1],
					item[2],
					item[3],
					item[4],
				] as OHLCData
		);
		series.setData(convertOHLCData(convertedToSeconds));
		chart.timeScale().fitContent();

		chartRef.current = chart;
		candleSeriesRef.current = series;

		const observer = new ResizeObserver((entries) => {
			if (!entries.length) return;
			chart.applyOptions({ width: entries[0].contentRect.width });
		});

		observer.observe(container);

		return () => {
			observer.disconnect();
			chart.remove();
			chartRef.current = null;
			candleSeriesRef.current = null;
		};
	}, [height, period]);

	useEffect(() => {
		if (!candleSeriesRef.current) return;
		const convertedToSeconds = ohlcData.map(
			(item) =>
				[
					Math.floor(item[0] / 1000),
					item[1],
					item[2],
					item[3],
					item[4],
				] as OHLCData
		);
		const converted = convertOHLCData(convertedToSeconds);
		candleSeriesRef.current.setData(converted);
		chartRef.current?.timeScale().fitContent();
	}, [ohlcData, period]);
	return (
		<div id="candlestick-chart">
			<div className="chart-header">
				<div className="flex-1">{children}</div>

				<div className="button-group">
					<span className="text-sm mx-2 font-medium text-purple-100/50">
						Period:
						{PERIOD_BUTTONS.map(({ value, label }) => (
							<button
								key={value}
								className={
									period === value ? "config-button-active" : "config-button"
								}
								onClick={() => handlePeriodChange(value)}
								disabled={isPending}
							>
								{label}
							</button>
						))}
					</span>
				</div>
			</div>

			<div ref={chartContainerRef} className="chart" style={{ height }} />
		</div>
	);
};

export default CandlestickChart;
