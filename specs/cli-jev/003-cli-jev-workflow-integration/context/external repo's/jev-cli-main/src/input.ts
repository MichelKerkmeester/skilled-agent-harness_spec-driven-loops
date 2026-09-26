import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { CliError } from "./errors.js";

/**
 * Resolve a CLI value that may be a literal, `@path` (file contents), or `-` (stdin).
 * `@@literal` escapes a leading `@`.
 */
export function readInput(value: string, label = "input"): string {
  if (value === "-") return readStdin(label);
  if (value.startsWith("@@")) return value.slice(1);
  if (value.startsWith("@")) return readFile(value.slice(1), label);
  return value;
}

export function readFile(path: string, label = "file"): string {
  try {
    return readFileSync(path, "utf8");
  } catch (err) {
    throw new CliError(`Cannot read ${label} ${path}: ${(err as NodeJS.ErrnoException).message}`);
  }
}

let stdinCache: string | null = null;

/** Read all of stdin once. Later calls return the cached value. */
export function readStdin(label = "stdin"): string {
  if (stdinCache !== null) return stdinCache;
  if (process.stdin.isTTY) {
    throw new CliError(`Expected ${label} on stdin but stdin is a terminal. Pipe data in or pass a value.`);
  }
  try {
    stdinCache = readFileSync(0, "utf8");
  } catch (err) {
    throw new CliError(`Cannot read stdin: ${(err as Error).message}`);
  }
  return stdinCache;
}

/** Test hook. */
export function _resetStdinCache(): void {
  stdinCache = null;
}

/** Whether a value refers to a file or stdin rather than a literal. */
export function isReference(value: string): boolean {
  return value === "-" || (value.startsWith("@") && !value.startsWith("@@"));
}

/** Human-friendly id for a reference: file basename, `stdin`, or undefined for literals. */
export function referenceId(value: string): string | undefined {
  if (value === "-") return "stdin";
  if (isReference(value)) return basename(value.slice(1));
  return undefined;
}

/** Parse JSON, with a helpful error naming the source. */
export function parseJson<T = unknown>(text: string, label = "input"): T {
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    throw new CliError(`${label} is not valid JSON: ${(err as Error).message}`);
  }
}

/** Split text into non-empty trimmed lines. */
export function nonEmptyLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

/**
 * Parse a list input: a JSON array of strings if the text starts with `[`,
 * otherwise one item per non-empty line.
 */
export function parseList(text: string, label = "list"): string[] {
  const trimmed = text.trim();
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    const parsed = parseJson<unknown>(trimmed, label);
    if (!Array.isArray(parsed) || !parsed.every((x) => typeof x === "string")) {
      throw new CliError(`${label} must be a JSON array of strings.`);
    }
    return parsed;
  }
  return nonEmptyLines(trimmed);
}

export interface TextItem {
  id?: string;
  text: string;
}

/**
 * Parse candidate/evidence items from JSON. Accepts:
 * - array of strings
 * - array of {id?, text}
 * - object map of id -> text
 */
export function parseItems(text: string, label = "items"): TextItem[] {
  const parsed = parseJson<unknown>(text, label);
  if (Array.isArray(parsed)) {
    return parsed.map((entry, i) => {
      if (typeof entry === "string") return { text: entry };
      if (entry && typeof entry === "object" && typeof (entry as TextItem).text === "string") {
        const { id, text } = entry as TextItem;
        return id === undefined ? { text } : { id: String(id), text };
      }
      throw new CliError(`${label}[${i}] must be a string or an object with a "text" field.`);
    });
  }
  if (parsed && typeof parsed === "object") {
    return Object.entries(parsed as Record<string, unknown>).map(([id, value]) => {
      if (typeof value !== "string") throw new CliError(`${label}.${id} must be a string.`);
      return { id, text: value };
    });
  }
  throw new CliError(`${label} must be a JSON array or object.`);
}
