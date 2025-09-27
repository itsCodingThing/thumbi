import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThumbnailForm from "@/components/thumbnail-form";
import FormatForm from "@/components/format-form";
import SelectSourceFileProvier from "./components/select-source-file/proiver";
import SourceFile from "@/components/source-file";

const tabs = {
	thumbnail: { title: "Thumbnail" },
	format: { title: "Foramt" },
} as const;

function App() {
	return (
		<SelectSourceFileProvier>
			<header className="mt-2 mb-8 text-center bg-white">
				<h1 className="text-pretty text-3xl font-semibold tracking-tight">
					Thumbs
				</h1>
				<p className="mt-2 text-muted-foreground">
					Select a video, choose where to save, generate thumbnails, and preview
					them here.
				</p>
			</header>
			<main className="container min-h-svh px-4 py-2 bg-black flex flex-col gap-2">
				<SourceFile />
				<Tabs defaultValue={tabs.thumbnail.title}>
					<TabsList>
						{Object.values(tabs).map((t) => (
							<TabsTrigger key={t.title} value={t.title}>
								{t.title}
							</TabsTrigger>
						))}
					</TabsList>
					<TabsContent value={tabs.thumbnail.title}>
						<ThumbnailForm />
					</TabsContent>
					<TabsContent value={tabs.format.title}>
						<FormatForm />
					</TabsContent>
				</Tabs>
			</main>
		</SelectSourceFileProvier>
	);
}

export default App;
