import { useState, useCallback } from "react";
import ChatPanel from "./components/ChatPanel";
import GraphView from "./components/GraphView";

export default function App() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const bumpRefresh = useCallback(() => setRefreshSignal((n) => n + 1), []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌳 Family Tree Builder</h1>
      </header>
      <main className="app-main">
        <ChatPanel onGraphMightHaveChanged={bumpRefresh} />
        <GraphView refreshSignal={refreshSignal} />
      </main>
    </div>
  );
}
