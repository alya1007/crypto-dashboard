import { CoinDetailsData } from "@/app/page";
import { fetcher } from "@/lib/coingecko.actions";
import Image from "next/image";
import CandlestickChart from "../candlestick-chart";

export type OHLCData = [number, number, number, number, number];

const CoinOverview = async () => {
	let coin: CoinDetailsData;
	let coinOHLCData: OHLCData[] = [];
	try {
		[coin, coinOHLCData] = await Promise.all([
			fetcher<CoinDetailsData>("coins/bitcoin", {
				dex_pair_format: "symbol",
			}),
			fetcher<OHLCData[]>("coins/bitcoin/ohlc", {
				vs_currency: "usd",
				days: 1,
				precision: "full",
			}),
		]);
	} catch (err) {
		console.log("Error fetching coin details:", err);
		return <div id="coin-overview">Failed to load coin overview.</div>;
	}
	return (
		<div id="coin-overview">
			<CandlestickChart coinId="bitcoin" data={coinOHLCData} height={400}>
				<div className="header pt-2">
					<Image
						src={coin.image.large}
						alt={coin.name}
						width={40}
						height={40}
					/>
					<div className="info">
						<p>
							{coin.name} / {coin.symbol.toUpperCase()}
						</p>
						<h1>${coin.market_data.current_price.usd.toFixed(2)}</h1>
					</div>
				</div>
			</CandlestickChart>
		</div>
	);
};

export default CoinOverview;
