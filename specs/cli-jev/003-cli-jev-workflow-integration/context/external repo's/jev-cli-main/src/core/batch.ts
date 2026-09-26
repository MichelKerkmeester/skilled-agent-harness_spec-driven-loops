// Run one judgment per input row with bounded concurrency. Command modules
// supply a `BatchItemRunner`; this file only knows about rows and pooling.

export interface BatchRow {
  index: number;
  id: string;
  /** Primary text input, or structured state for `ask --state-json`. */
  text: string;
  state?: unknown;
  /** Extra per-row fields from JSONL, passed through to the output. */
  meta?: Record<string, unknown>;
}

export interface BatchItemResult {
  output: unknown;
  failed: boolean;
}

export type BatchItemRunner = (row: BatchRow) => Promise<BatchItemResult>;

export interface BatchRecord {
  index: number;
  id: string;
  ok: boolean;
  failed: boolean;
  result?: unknown;
  error?: string;
  meta?: Record<string, unknown>;
}

export interface BatchSummary {
  total: number;
  ok: number;
  errors: number;
  failed: number;
  input_tokens: number;
  output_tokens: number;
}

/** Parse rows from JSONL (objects with text/state and optional id) or plain lines. */
export function parseRows(raw: string): BatchRow[] {
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const rows: BatchRow[] = [];
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("{")) {
      let obj: Record<string, unknown>;
      try {
        obj = JSON.parse(trimmed);
      } catch (err) {
        throw new Error(`Row ${i + 1} is not valid JSON: ${(err as Error).message}`);
      }
      const { id, text, state, ...meta } = obj;
      if (typeof text !== "string" && state === undefined) {
        throw new Error(`Row ${i + 1} needs a "text" string or a "state" value.`);
      }
      rows.push({
        index: i,
        id: id === undefined ? String(i + 1) : String(id),
        text: typeof text === "string" ? text : JSON.stringify(state),
        state: state === undefined ? text : state,
        meta: Object.keys(meta).length ? meta : undefined,
      });
    } else if (trimmed.startsWith("[")) {
      throw new Error("Batch input must be JSONL (one object per line) or plain lines, not a JSON array.");
    } else {
      rows.push({ index: i, id: String(i + 1), text: trimmed, state: trimmed });
    }
  });
  if (rows.length === 0) throw new Error("Batch input is empty.");
  return rows;
}

export interface RunBatchOptions {
  concurrency: number;
  onRecord?: (record: BatchRecord) => void;
}

/** Run all rows through `item` with a fixed-size worker pool. Records (and `onRecord` calls) follow input order. */
export async function runBatch(
  rows: BatchRow[],
  item: BatchItemRunner,
  opts: RunBatchOptions,
): Promise<{ records: BatchRecord[]; summary: BatchSummary }> {
  const records: BatchRecord[] = new Array(rows.length);
  const summary: BatchSummary = {
    total: rows.length,
    ok: 0,
    errors: 0,
    failed: 0,
    input_tokens: 0,
    output_tokens: 0,
  };
  let next = 0;
  // Emit records in input order even though rows finish out of order.
  let flushed = 0;
  const flush = () => {
    while (flushed < rows.length && records[flushed] !== undefined) {
      opts.onRecord?.(records[flushed]!);
      flushed++;
    }
  };
  const worker = async () => {
    while (next < rows.length) {
      const row = rows[next++]!;
      let record: BatchRecord;
      try {
        const { output, failed } = await item(row);
        record = { index: row.index, id: row.id, ok: true, failed, result: output, meta: row.meta };
        summary.ok++;
        if (failed) summary.failed++;
        const usage = (output as { usage?: { input_tokens?: number; output_tokens?: number } })?.usage;
        summary.input_tokens += usage?.input_tokens ?? 0;
        summary.output_tokens += usage?.output_tokens ?? 0;
      } catch (err) {
        record = {
          index: row.index,
          id: row.id,
          ok: false,
          failed: false,
          error: (err as Error).message,
          meta: row.meta,
        };
        summary.errors++;
      }
      records[row.index] = record;
      flush();
    }
  };
  const n = Math.max(1, Math.min(opts.concurrency, rows.length));
  await Promise.all(Array.from({ length: n }, worker));
  return { records, summary };
}
