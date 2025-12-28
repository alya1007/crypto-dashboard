import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type DataTableProps<T> = {
	columns: DataTableColumn<T>[];
	data: T[];
	rowKey: (row: T, index: number) => React.Key;
	tableClassname?: string;
	headerClassname?: string;
	headerRowClassname?: string;
	headerCellClassname?: string;
	bodyRowClassname?: string;
	bodyCellClassname?: string;
};

export type DataTableColumn<T> = {
	header: React.ReactNode;
	cell: (row: T, index: number) => React.ReactNode;
	headClassname?: string;
	cellClassname?: string;
};

const DataTable = <T,>({
	columns,
	data,
	rowKey,
	tableClassname,
	headerClassname,
	headerRowClassname,
	headerCellClassname,
	bodyRowClassname,
	bodyCellClassname,
}: DataTableProps<T>) => {
	return (
		<Table className={cn("custom-scrollbar", tableClassname)}>
			<TableHeader className={headerClassname}>
				<TableRow className={cn("hover:bg-transparent!", headerRowClassname)}>
					{columns.map((column, colIndex) => (
						<TableHead
							key={colIndex}
							className={cn(
								"bg-purple-100 py-4 first:pl:5 last:pr-5",
								headerCellClassname,
								column.headClassname
							)}
						>
							{column.header}
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data.map((row, rowIndex) => (
					<TableRow
						key={rowKey(row, rowIndex)}
						className={cn(
							"overflow-hidden rounded-lg border-b border-purple-100/5 hover:bg-dark-400/30! relative",
							bodyRowClassname
						)}
					>
						{columns.map((column, colIndex) => (
							<TableCell
								key={colIndex}
								className={cn(
									"py-4 first:pl-5 last:pr-5",
									column.cellClassname,
									bodyCellClassname
								)}
							>
								{column.cell(row, rowIndex)}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

export default DataTable;
