import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { WebSocketServer } from "ws";

const root = resolve("dist");
const port = 4397;
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? "/", `http://localhost:${port}`).pathname;
  if (pathname === "/coverage-headers") {
    const cookie = cookies(request);
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({
      scope: request.headers["x-supercov-scope"] ?? cookie.__supercov_scope ?? null,
      phase: request.headers["x-supercov-phase"] ?? cookie.__supercov_phase ?? null,
    }));
    return;
  }
  const path = resolve(root, pathname === "/" ? "index.html" : `.${pathname}`);
  try {
    const body = await readFile(path);
    response.writeHead(200, { "content-type": types[extname(path)] ?? "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("not found");
  }
});

function cookies(request) {
  return Object.fromEntries(
    String(request.headers.cookie ?? "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separator = part.indexOf("=");
        const name = separator < 0 ? part : part.slice(0, separator);
        const value = separator < 0 ? "" : part.slice(separator + 1);
        try {
          return [name, decodeURIComponent(value)];
        } catch {
          return [name, value];
        }
      }),
  );
}

const webSockets = new WebSocketServer({ noServer: true });
server.on("upgrade", (request, socket, head) => {
  webSockets.handleUpgrade(request, socket, head, (webSocket) => {
    webSockets.emit("connection", webSocket, request);
  });
});
webSockets.on("connection", (webSocket, request) => {
  const cookie = cookies(request);
  webSocket.send(JSON.stringify({
    scope: request.headers["x-supercov-scope"] ?? cookie.__supercov_scope ?? null,
    phase: request.headers["x-supercov-phase"] ?? cookie.__supercov_phase ?? null,
  }));
});

server.listen(port);
