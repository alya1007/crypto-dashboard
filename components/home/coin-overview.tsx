import { CoinDetailsData } from "@/app/page";
import { fetcher } from "@/lib/coingecko.actions";
import Image from "next/image";

const CoinOverview = async () => {
	const coin = await fetcher<CoinDetailsData>("coins/bitcoin", {
		dex_pair_format: "symbol",
	});
	return (
		<div id="coin-overview">
			<div className="header pt-2">
				<Image src={coin.image.large} alt={coin.name} width={40} height={40} />
				<div className="info">
					<p>
						{coin.name} / {coin.symbol.toUpperCase()}
					</p>
					<h1>${coin.market_data.current_price.usd.toFixed(2)}</h1>
				</div>
			</div>
		</div>
	);
};

export default CoinOverview;
