/**
 * Memory Worker Entry Point
 * Standalone background service for memory operations
 * @module features/memory/worker
 */

import { createApp, initializeStorage } from "./server.js";
import * as fs from "fs";
import * as path from "path";

// Configuration from environment
const PORT = parseInt(process.env.MEMORY_PORT ?? "37777");
const PROJECT_ROOT = process.env.PROJECT_ROOT ?? process.cwd();
const MEMORY_DIR = path.join(PROJECT_ROOT, ".goopspec", "memory");
const DB_PATH = path.join(MEMORY_DIR, "memory.db");
const PID_FILE = path.join(MEMORY_DIR, "worker.pid");
const LOG_FILE = path.join(MEMORY_DIR, "worker.log");

/**
 * Ensure memory directory exists
 */
function ensureDirectory(): void {
  if (!fs.existsSync(MEMORY_DIR)) {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
    console.log(`[Memory Worker] Created directory: ${MEMORY_DIR}`);
  }
}

/**
 * Write PID file
 */
function writePidFile(): void {
  fs.writeFileSync(PID_FILE, process.pid.toString());
  console.log(`[Memory Worker] PID file written: ${PID_FILE}`);
}

/**
 * Remove PID file on exit
 */
function cleanupPidFile(): void {
  try {
    if (fs.existsSync(PID_FILE)) {
      fs.unlinkSync(PID_FILE);
    }
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Setup logging to file
 */
function setupLogging(): void {
  // Create a write stream for the log file
  const logStream = fs.createWriteStream(LOG_FILE, { flags: "a" });

  // Redirect console to both stdout and log file
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  const timestamp = () => new Date().toISOString();

  console.log = (...args: unknown[]) => {
    const msg = `[${timestamp()}] ${args.map(String).join(" ")}\n`;
    logStream.write(msg);
    originalLog.apply(console, args);
  };

  console.error = (...args: unknown[]) => {
    const msg = `[${timestamp()}] ERROR: ${args.map(String).join(" ")}\n`;
    logStream.write(msg);
    originalError.apply(console, args);
  };

  console.warn = (...args: unknown[]) => {
    const msg = `[${timestamp()}] WARN: ${args.map(String).join(" ")}\n`;
    logStream.write(msg);
    originalWarn.apply(console, args);
  };
}

/**
 * Main worker startup
 */
async function main(): Promise<void> {
  console.log("============================================");
  console.log("[Memory Worker] Starting...");
  console.log(`[Memory Worker] Port: ${PORT}`);
  console.log(`[Memory Worker] Project: ${PROJECT_ROOT}`);
  console.log(`[Memory Worker] Database: ${DB_PATH}`);
  console.log("============================================");

  // Setup
  ensureDirectory();
  setupLogging();
  writePidFile();

  // Pre-initialize storage
  await initializeStorage({ dbPath: DB_PATH });

  // Create and start server
  const app = createApp({ dbPath: DB_PATH });

  const server = Bun.serve({
    port: PORT,
    fetch: app.fetch,
  });

  console.log(`[Memory Worker] Server listening on http://localhost:${PORT}`);

  // Handle shutdown signals
  process.on("SIGINT", () => {
    console.log("[Memory Worker] Received SIGINT, shutting down...");
    cleanupPidFile();
    server.stop();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log("[Memory Worker] Received SIGTERM, shutting down...");
    cleanupPidFile();
    server.stop();
    process.exit(0);
  });

  // Handle uncaught errors
  process.on("uncaughtException", (error) => {
    console.error("[Memory Worker] Uncaught exception:", error);
    cleanupPidFile();
    process.exit(1);
  });

  process.on("unhandledRejection", (reason) => {
    console.error("[Memory Worker] Unhandled rejection:", reason);
  });
}

// Start the worker
main().catch((error) => {
  console.error("[Memory Worker] Fatal error:", error);
  cleanupPidFile();
  process.exit(1);
});
