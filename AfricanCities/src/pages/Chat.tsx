import { LayoutShell } from "../component/layout-shell";
import { ChatInterface } from "../component/chat-interface";

export default function Chat() {
  return (
    <LayoutShell>
      <div className="max-w-5xl mx-auto h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-primary">Assistant Urbain</h1>
          <p className="text-muted-foreground">
            Posez vos questions sur la planification, les infrastructures ou la démographie.
          </p>
        </div>
        <ChatInterface />
      </div>
    </LayoutShell>
  );
}
