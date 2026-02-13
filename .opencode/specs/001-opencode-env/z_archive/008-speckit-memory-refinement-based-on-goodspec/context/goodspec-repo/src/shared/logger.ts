/**
 * Simple logging utility for GoopSpec
 * @module shared/logger
 */

import { appendFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

let DEBUG = process.env.GOOPSPEC_DEBUG === "true";
const DEBUG_LOG_FILE = join(homedir(), ".goopspec-debug.log");

/**
 * Enable or disable debug logging at runtime
 */
export function setDebug(enabled: boolean): void {
  DEBUG = enabled;
}

/**
 * Serialize data for logging, handling Error objects specially
 */
function serializeData(data: unknown): string {
  if (data === undefined) return "";
  if (data === null) return " null";
  
  if (data instanceof Error) {
    return ` ${JSON.stringify({
      name: data.name,
      message: data.message,
      stack: data.stack,
    })}`;
  }
  
  return ` ${JSON.stringify(data)}`;
}

/**
 * Write to debug log file (always, when DEBUG mode)
 */
function writeDebugLog(level: string, message: string, data?: unknown): void {
  if (!DEBUG) return;
  
  const timestamp = new Date().toISOString();
  const dataStr = serializeData(data);
  const line = `[${timestamp}] [${level}] ${message}${dataStr}\n`;
  
  try {
    appendFileSync(DEBUG_LOG_FILE, line);
  } catch {
    // Ignore file write errors
  }
}

/**
 * Log a debug message (only when GOOPSPEC_DEBUG=true or setDebug(true))
 * Writes to file only - no console output to keep TUI clean
 */
export function log(message: string, data?: Record<string, unknown>): void {
  if (DEBUG) {
    writeDebugLog("DEBUG", message, data);
  }
}

/**
 * Log an error - writes to file only to keep TUI clean
 */
export function logError(message: string, error?: unknown): void {
  writeDebugLog("ERROR", message, error);
}

/**
 * Debug log for event tracking - writes to file for easy reading
 */
export function logEvent(event: string, data?: Record<string, unknown>): void {
  writeDebugLog("EVENT", event, data);
}
