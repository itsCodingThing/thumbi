import "./App.css";
import logo from "@/assets/thumbi_logo.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThumbnailForm from "@/components/thumbnail-form";
import ReencodeForm from "@/components/reencode-form";
import SourceFile from "@/components/source-file";
import { Toaster } from "@/components/ui/sonner";
import FullScreenLoader from "@/components/full-screen-loader";

const tabs = {
	thumbnail: { title: "Thumbnail" },
	format: { title: "Format" },
} as const;

export default function App() {
	return (
		<>
			<header className="flex justify-center">
				<img alt="app logo" src={logo} className="w-25 h-25" />
			</header>
			<main className="container min-h-svh px-4 py-2 bg-black flex flex-col gap-2">
				<SourceFile />
				<Tabs defaultValue={tabs.thumbnail.title}>
					<TabsList>
						{Object.values(tabs).map((tab) => (
							<TabsTrigger
								className="cursor-pointer"
								key={tab.title}
								value={tab.title}
							>
								{tab.title}
							</TabsTrigger>
						))}
					</TabsList>
					<TabsContent value={tabs.thumbnail.title}>
						<ThumbnailForm />
					</TabsContent>
					<TabsContent value={tabs.format.title}>
						<ReencodeForm />
					</TabsContent>
				</Tabs>
			</main>
			<Toaster />
			<FullScreenLoader />
		</>
	);
}
