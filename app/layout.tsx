import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const interFont = Poppins({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: "500",
});

export const metadata: Metadata = {
	title: "Work Breakdown Structure",
	description: "Work Breakdown Structure by KWSP",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${interFont.className} antialiased`}>
				<Toaster richColors />
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
