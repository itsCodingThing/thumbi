import "./App.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThumbnailForm from "@/components/thumbnail-form";
import FormatForm from "@/components/format-form";
import SelectSourceFileProvier from "@/components/select-source-file/proiver";
import SourceFile from "@/components/source-file";
import { Toaster } from "@/components/ui/sonner";
import logo from "@/assets/thumbi_logo.png";

const tabs = {
  thumbnail: { title: "Thumbnail" },
  format: { title: "Format" },
} as const;

function App() {
  return (
    <SelectSourceFileProvier>
      <header className="flex justify-center">
        <img src={logo} className="w-50 h-50" />
      </header>
      <main className="container min-h-svh px-4 py-2 bg-black flex flex-col gap-2">
        <SourceFile />
        <Tabs defaultValue={tabs.thumbnail.title}>
          <TabsList>
            {Object.values(tabs).map((t) => (
              <TabsTrigger
                className="cursor-pointer"
                key={t.title}
                value={t.title}
              >
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
      <Toaster />
    </SelectSourceFileProvier>
  );
}

export default App;
