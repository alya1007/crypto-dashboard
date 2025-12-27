import { fetcher } from "@/lib/coingecko.actions";
import DataTable, { DataTableColumn } from "../data-table";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

export type TrendingCoin = {
	item: {
		id: string;
		name: string;
		symbol: string;
		market_cap_rank: number;
		thumb: string;
		large: string;
		data: {
			price: number;
			price_change_percentage_24h: {
				usd: number;
			};
		};
	};
};

const columns: DataTableColumn<TrendingCoin>[] = [
	{
		header: "Coin",
		cellClassname: "name-cell",
		cell: (coin) => {
			const { item } = coin;
			return (
				<Link href={`/coins/${item.id}`}>
					<Image src={item.large} alt={item.name} width={36} height={36} />
					<p>{item.name}</p>
				</Link>
			);
		},
	},
	{
		header: "24 hour change",
		cell: (coin) => {
			const { item } = coin;
			const isTrendingUp = item.data.price_change_percentage_24h.usd >= 0;

			return (
				<div
					className={cn(
						"price-change",
						isTrendingUp ? "text-green-500" : "text-red-500"
					)}
				>
					<p>
						{isTrendingUp ? (
							<TrendingUp width={16} height={16} />
						) : (
							<TrendingDown width={16} height={16} />
						)}
						{Math.abs(item.data.price_change_percentage_24h.usd).toFixed(2)}%
					</p>
				</div>
			);
		},
	},
	{
		header: "Price",
		cellClassname: "price-cell",
		cell: (coin) => coin.item.data.price.toFixed(2),
	},
];
const Trending = async () => {
	const trendingCoins = await fetcher<{ coins: TrendingCoin[] }>(
		"search/trending",
		undefined,
		300
	);
	return (
		<div id="trending-coins">
			<p>Trending Coins</p>
			<DataTable
				data={trendingCoins.coins.slice(0, 7) || []}
				columns={columns}
				rowKey={(coin) => coin.item.id}
				tableClassname="trending-coins-table"
				headerCellClassname="py-3!"
				bodyCellClassname="py-2!"
			></DataTable>
		</div>
	);
};

export default Trending;
