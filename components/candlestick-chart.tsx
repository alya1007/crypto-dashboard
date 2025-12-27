"use client";

import { useState } from "react";
import { OHLCData } from "./home/coin-overview";
import { PERIOD_BUTTONS } from "@/constants";

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
	coinId?: string;
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
	const [loading, setLoading] = useState(false);
	const [period, setPeriod] = useState(initialPeriod);

	const handlePeriodChange = (newPeriod: Period) => {
		if (newPeriod === period) return;

		// TODO: update period
		setPeriod(newPeriod);
	};
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
								disabled={loading}
							>
								{label}
							</button>
						))}
					</span>
				</div>
			</div>
		</div>
	);
};

export default CandlestickChart;
