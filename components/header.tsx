"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type HeaderProps = Readonly<{
	children?: React.ReactNode;
}>;

const Header = ({ children }: HeaderProps) => {
	const pathname = usePathname();
	return (
		<>
			<header>
				<div className="main-container inner">
					<Link href="" className="flex items-center gap-2">
						<Image src="/logo.svg" alt="Logo" width={40} height={40} />
						<Image
							src="/logo-text.svg"
							alt="Logo Text"
							width={132}
							height={40}
						/>
					</Link>

					<nav>
						<Link
							href="/"
							className={cn("nav-link", {
								"is-active": pathname === "/",
								"is-home": true,
							})}
						>
							Home
						</Link>
						<p>Search Modal</p>
						<Link
							href="/coins"
							className={cn("nav-link", {
								"is-active": pathname === "/coins",
							})}
						>
							Coins
						</Link>
					</nav>
				</div>
			</header>
			{children}
		</>
	);
};

export default Header;
