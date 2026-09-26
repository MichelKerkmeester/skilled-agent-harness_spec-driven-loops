import { stripVTControlCharacters, styleText } from "node:util";
import { CliError } from "./errors.js";

export const FORMATS = ["text", "json", "jsonl", "csv", "tsv", "md"] as const;
export type Format = (typeof FORMATS)[number];

export interface OutputOptions {
  format: Format;
  color: boolean;
  quiet: boolean;
  /** Path into the JSON payload; when set, only that value is printed. */
  pluck?: string;
  stream?: NodeJS.WritableStream;
}

/**
 * What a command wants to show. Text mode prints head, table, tail, usage;
 * Markdown does the same in GFM; CSV/TSV print the table (or the key/value
 * pairs when there is no table). Cells may carry ANSI color; non-text formats strip it.
 */
export interface View {
  head?: string[];
  table?: { columns: string[]; rows: string[][] };
  tail?: string[];
  /** Key/value pairs describing a single-answer result, for csv/tsv/md when there is no table. */
  kv?: Array<[string, string]>;
  usage?: { usage: { input_tokens: number; output_tokens: number }; model: string; provider: string };
}

/** Decide whether to colorize, honoring NO_COLOR, FORCE_COLOR, and TTY. */
export function shouldColor(env: NodeJS.ProcessEnv = process.env, isTTY = process.stdout.isTTY): boolean {
  if (env.NO_COLOR !== undefined && env.NO_COLOR !== "") return false;
  if (env.FORCE_COLOR !== undefined && env.FORCE_COLOR !== "0") return true;
  return Boolean(isTTY);
}

type Style = Parameters<typeof styleText>[0];

export function paint(enabled: boolean, style: Style, text: string): string {
  return enabled ? styleText(style, text) : text;
}

export function formatProbability(p: number | null | undefined): string {
  if (p === null || p === undefined || Number.isNaN(p)) return "-";
  return p.toFixed(2);
}

/** Render rows as a padded table. First row is the header. */
export function table(rows: string[][], opts: { color?: boolean } = {}): string {
  if (rows.length === 0) return "";
  const widths: number[] = [];
  for (const row of rows) {
    row.forEach((cell, i) => {
      widths[i] = Math.max(widths[i] ?? 0, visibleLength(cell));
    });
  }
  const render = (row: string[]) =>
    row
      .map((cell, i) => cell + " ".repeat((widths[i] ?? 0) - visibleLength(cell)))
      .join("  ")
      .trimEnd();
  const [header, ...body] = rows;
  const lines = [paint(opts.color ?? false, "bold", render(header!))];
  lines.push(widths.map((w) => "-".repeat(w)).join("  "));
  for (const row of body) lines.push(render(row));
  return lines.join("\n");
}

function visibleLength(s: string): number {
  return stripVTControlCharacters(s).length;
}

export function plain(s: string): string {
  return stripVTControlCharacters(s);
}

/** Clip a string for table display. */
export function clip(text: string, max = 60): string {
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length <= max ? oneLine : `${oneLine.slice(0, max - 1)}…`;
}

export function usageLine(
  usage: { input_tokens: number; output_tokens: number },
  model: string,
  provider: string,
) {
  if (!model && !provider) return "no API call made";
  return `${usage.input_tokens} in / ${usage.output_tokens} out tokens · ${model} via ${provider}`;
}

// ── renderers ───────────────────────────────────────────────────────────────

export function renderText(view: View, opts: Pick<OutputOptions, "color" | "quiet">): string {
  const parts: string[] = [];
  if (view.head?.length) parts.push(view.head.join("\n"));
  if (view.table) parts.push(table([view.table.columns, ...view.table.rows], { color: opts.color }));
  if (view.tail?.length) parts.push(view.tail.join("\n"));
  const body = parts.join("\n\n");
  if (view.usage && !opts.quiet) {
    const footer = paint(
      opts.color,
      "dim",
      usageLine(view.usage.usage, view.usage.model, view.usage.provider),
    );
    return body ? `${body}\n${footer}` : footer;
  }
  return body;
}

function mdCell(s: string): string {
  return plain(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
}

export function renderMarkdown(view: View, opts: Pick<OutputOptions, "quiet">): string {
  const parts: string[] = [];
  if (view.head?.length) parts.push(view.head.map(plain).join("  \n"));
  const tbl = view.table ?? (view.kv ? { columns: ["Field", "Value"], rows: view.kv } : undefined);
  if (tbl) {
    const header = `| ${tbl.columns.map(mdCell).join(" | ")} |`;
    const sep = `| ${tbl.columns.map(() => "---").join(" | ")} |`;
    const rows = tbl.rows.map((r) => `| ${tbl.columns.map((_, i) => mdCell(r[i] ?? "")).join(" | ")} |`);
    parts.push([header, sep, ...rows].join("\n"));
  }
  if (view.tail?.length) parts.push(view.tail.map(plain).join("  \n"));
  if (view.usage && !opts.quiet) {
    parts.push(`_${usageLine(view.usage.usage, view.usage.model, view.usage.provider)}_`);
  }
  return parts.join("\n\n");
}

function csvCell(s: string, sep: string): string {
  const v = plain(s);
  return /[",\n\r]/.test(v) || v.includes(sep) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function renderDelimited(view: View, sep: "," | "\t"): string {
  const tbl = view.table ?? (view.kv ? { columns: ["field", "value"], rows: view.kv } : undefined);
  if (!tbl) throw new CliError("This result has no tabular form; use --json, --md, or --pluck.");
  const line = (cells: string[]) =>
    cells.map((c) => (sep === "\t" ? plain(c).replace(/\t|\n/g, " ") : csvCell(c, sep))).join(sep);
  return [line(tbl.columns), ...tbl.rows.map((r) => line(tbl.columns.map((_, i) => r[i] ?? "")))].join("\n");
}

// ── pluck ───────────────────────────────────────────────────────────────────

/**
 * Resolve a dotted path with `[n]` indexes and `[]` wildcards, e.g.
 * `label`, `results[0].verdict`, `results[].verdict`, `fields.email.value`.
 * A wildcard maps over the array and flattens one level.
 */
export function pluck(value: unknown, path: string): unknown {
  const tokens = path.match(/[^.[\]]+|\[\d*\]/g);
  if (!tokens || tokens.length === 0) throw new CliError(`Invalid --pluck path "${path}".`);
  let current: unknown[] = [value];
  for (const token of tokens) {
    const next: unknown[] = [];
    for (const v of current) {
      if (token === "[]") {
        if (Array.isArray(v)) next.push(...v);
        else if (v && typeof v === "object") next.push(...Object.values(v as object));
        else next.push(undefined);
      } else if (/^\[\d+\]$/.test(token)) {
        next.push(Array.isArray(v) ? v[Number(token.slice(1, -1))] : undefined);
      } else {
        next.push(v && typeof v === "object" ? (v as Record<string, unknown>)[token] : undefined);
      }
    }
    current = next;
  }
  return path.includes("[]") ? current : current[0];
}

function scalarText(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return JSON.stringify(v);
}

/** Print a plucked value: one line per array element, raw scalars, compact JSON for objects. */
export function renderPluck(value: unknown, format: Format): string {
  if (format === "json") return JSON.stringify(value ?? null, null, 2);
  if (format === "jsonl") return JSON.stringify(value ?? null);
  if (Array.isArray(value)) return value.map(scalarText).join("\n");
  return scalarText(value);
}

// ── emit ────────────────────────────────────────────────────────────────────

/** Write a result in the requested format. `view` is only evaluated for text, md, csv, tsv. */
export function emit(opts: OutputOptions, payload: unknown, view: () => View): void {
  const stream = opts.stream ?? process.stdout;
  const write = (s: string) => stream.write(`${s}\n`);
  if (opts.pluck) {
    const value = pluck(payload, opts.pluck);
    const empty = value === undefined || (Array.isArray(value) && value.every((v) => v === undefined));
    if (empty) throw new CliError(`--pluck path "${opts.pluck}" matched nothing in this result.`);
    return void write(renderPluck(value, opts.format));
  }
  switch (opts.format) {
    case "json":
      return void write(JSON.stringify(payload, null, 2));
    case "jsonl":
      return void write(JSON.stringify(payload));
    case "md":
      return void write(renderMarkdown(view(), opts));
    case "csv":
      return void write(renderDelimited(view(), ","));
    case "tsv":
      return void write(renderDelimited(view(), "\t"));
    default:
      return void write(renderText(view(), opts));
  }
}
