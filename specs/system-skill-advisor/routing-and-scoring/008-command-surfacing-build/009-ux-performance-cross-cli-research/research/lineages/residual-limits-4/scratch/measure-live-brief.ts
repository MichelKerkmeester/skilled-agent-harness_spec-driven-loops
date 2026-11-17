// Measures what the Claude hook actually sends for every corpus row the
// committed cost script measures (typed rows on the measured split), using the
// TypeScript source handler in one process. Writes a JSON summary beside itself.
//
// The hook's own diagnostic writer is replaced with a no-op so this run leaves
// no health record: the measurement is read-only, and the only output is the
// summary file inside this lineage.

import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const root = process.cwd();
const corpusPath = join(
  root,
  '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl',
);
const hookPath = join(root, '.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts');
const outPath = join(
  root,
  'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/residual-limits-4/scratch/live-brief-ts.json',
);

const rows = readFileSync(corpusPath, 'utf8')
  .split('\n')
  .filter((line) => line.trim() !== '')
  .map((line) => JSON.parse(line))
  .filter((row) => row.row_type === 'typed' && row.split === 'none');

const { handleClaudeUserPromptSubmit } = await import(pathToFileURL(hookPath).href);

function median(values) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(0.5 * sorted.length) - 1)];
}

function nearestRank(values, ratio) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(ratio * sorted.length) - 1)];
}

const measured = [];
for (const row of rows) {
  const started = performance.now();
  const output = await handleClaudeUserPromptSubmit(
    {
      prompt: row.prompt,
      cwd: root,
      hook_event_name: 'UserPromptSubmit',
      session_id: `brief-cost-${row.id}`,
    },
    { writeDiagnostic: () => {} },
  );
  const durationMs = Number((performance.now() - started).toFixed(1));
  const context = output?.hookSpecificOutput?.additionalContext ?? '';
  const head = context.split('\n')[0] ?? '';
  measured.push({
    id: row.id,
    bytes: Buffer.byteLength(context, 'utf8'),
    headBytes: Buffer.byteLength(head, 'utf8'),
    live: head.startsWith('Advisor: live'),
    durationMs,
  });
}

const live = measured.filter((row) => row.live);
const bytes = live.map((row) => row.bytes);
const headBytes = live.map((row) => row.headBytes);
const durations = measured.map((row) => row.durationMs);
const liveDurations = live.map((row) => row.durationMs);

const summary = {
  rows: measured.length,
  liveRows: live.length,
  totalBytes: bytes.reduce((sum, value) => sum + value, 0),
  medianBytes: median(bytes),
  p95Bytes: nearestRank(bytes, 0.95),
  maxBytes: bytes.length === 0 ? 0 : Math.max(...bytes),
  medianHeadBytes: median(headBytes),
  p95HeadBytes: nearestRank(headBytes, 0.95),
  maxHeadBytes: headBytes.length === 0 ? 0 : Math.max(...headBytes),
  firstCallDurationMs: measured[0]?.durationMs ?? 0,
  medianDurationMs: median(durations),
  p95DurationMs: nearestRank(durations, 0.95),
  maxDurationMs: durations.length === 0 ? 0 : Math.max(...durations),
  medianLiveDurationMs: median(liveDurations),
  p95LiveDurationMs: nearestRank(liveDurations, 0.95),
  maxLiveDurationMs: liveDurations.length === 0 ? 0 : Math.max(...liveDurations),
  nonLiveRows: measured.filter((row) => !row.live).map((row) => row.id),
};

writeFileSync(outPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(summary)}\n`);
