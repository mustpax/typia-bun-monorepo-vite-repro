import express from "express";
import { validateEquals } from "typia";
import { WebSocketServer, WebSocket } from "ws";
import type { AppState } from "common";

const app = express();
const port = process.env.PORT || 3000;

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello via Bun!" });
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

let data: any;
try {
  data = JSON.parse(await Bun.file("data.json").text());
} catch {
  data = {};
  await Bun.write("data.json", JSON.stringify(data));
}

async function updateState(newData: any) {
  data = newData;
  await Bun.write("data.json", JSON.stringify(data));
  notifyDataChange();
}

const wss = new WebSocketServer({ server });

// Event bus for data changes
const dataChangeSubscribers = new Set<WebSocket>();

function notifyDataChange() {
  const message = JSON.stringify({ type: "update", data });
  for (const client of dataChangeSubscribers) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

wss.on("connection", (ws) => {
  console.log("New WebSocket connection");
  ws.send(JSON.stringify({ type: "update", data }));
  dataChangeSubscribers.add(ws);

  ws.on("message", (message) => {
    const { type, data } = JSON.parse(message.toString());
    console.log("Received:", { type, data });
    if (type === "update") {
      const validation = validateEquals<AppState>(data);
      if (!validation.success) {
        console.error(
          "Invalid app state:",
          data,
          "Validation error:",
          validation.errors
        );
        return;
      }
      updateState(data);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    dataChangeSubscribers.delete(ws);
  });
});
