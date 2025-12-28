import Categories from "@/components/home/categories";
import CoinOverview from "@/components/home/coin-overview";
import Trending from "@/components/home/trending";
import { Suspense } from "react";

export type CoinDetailsData = {
	id: string;
	name: string;
	symbol: string;
	asset_platform_id?: string | null;
	detail_platforms?: Record<
		string,
		{
			geckoterminal_url: string;
			contract_address: string;
		}
	>;
	image: {
		large: string;
		small: string;
	};
	market_data: {
		current_price: {
			usd: number;
			[key: string]: number;
		};
		price_change_24h_in_currency: {
			usd: number;
		};
		price_change_percentage_24h_in_currency: {
			usd: number;
		};
		price_change_percentage_30d_in_currency: {
			usd: number;
		};
		market_cap: {
			usd: number;
		};
		total_volume: {
			usd: number;
		};
	};
	market_cap_rank: number;
	description: {
		en: string;
	};
	links: {
		homepage: string[];
		blockchain_site: string[];
		subreddit_url: string;
	};
	tickers: Ticker[];
};

type Ticker = {
	market: {
		name: string;
	};
	base: string;
	target: string;
	converted_last: {
		usd: number;
	};
	timestamp: string;
	trade_url: string;
};

const Page = async () => {
	return (
		<main className="main-container">
			<section className="home-grid">
				{
					// TODO: add skeletons as fallbacks
				}
				<Suspense fallback={<div>Loading...</div>}>
					<CoinOverview />
				</Suspense>
				{
					// TODO: add skeletons as fallbacks
				}
				<Suspense fallback={<div>Loading...</div>}>
					<Trending />
				</Suspense>
				{
					// TODO: add skeletons as fallbacks
				}
				<Suspense fallback={<div>Loading...</div>}>
					<Categories />
				</Suspense>
			</section>
		</main>
	);
};

export default Page;
