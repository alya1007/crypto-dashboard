import { fetcher } from "@/lib/coingecko.actions";
import DataTable, { DataTableColumn } from "../data-table";
import Image from "next/image";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

type Category = {
	name: string;
	top_3_coins: string[];
	market_cap_change_24h: number;
	market_cap: number;
	volume_24h: number;
};
const Categories = async () => {
	const categories = await fetcher<Category[]>("coins/categories");
	const columns: DataTableColumn<Category>[] = [
		{
			header: "Category",
			cellClassname: "category-cell",
			cell: (category) => category.name,
		},
		{
			header: "Top Gainers",
			cellClassname: "top-gainers-cell",
			cell: (category) => {
				const { top_3_coins } = category;
				return top_3_coins.map((coin) => (
					<Image src={coin} alt={coin} key={coin} width={28} height={28} />
				));
			},
		},
		{
			header: "Market Cap",
			cellClassname: "market-cap-cell",
			cell: (category) => formatCurrency(category.market_cap),
		},
		{
			header: "24h Volume",
			cellClassname: "volume-cell",
			cell: (category) => formatCurrency(category.volume_24h),
		},
		{
			header: "24h Change",
			cellClassname: "change-header-cell",
			cell: (category) => {
				const { market_cap_change_24h } = category;
				const isTrendingUp = market_cap_change_24h >= 0;

				return (
					<div
						className={cn(
							"change-cell000",
							isTrendingUp ? "text-green-500" : "text-red-500"
						)}
					>
						<p className="flex items-center gap-1">
							{formatPercentage(market_cap_change_24h)}
							{isTrendingUp ? (
								<TrendingUp width={16} height={16} />
							) : (
								<TrendingDown width={16} height={16} />
							)}
						</p>
					</div>
				);
			},
		},
	];
	return (
		<div id="categories">
			<h4>Top Categories</h4>
			<DataTable
				columns={columns}
				data={categories?.slice(0, 10)}
				rowKey={(_, i) => i}
				tableClassname="mt-3 w-full"
			/>
		</div>
	);
};

export default Categories;
