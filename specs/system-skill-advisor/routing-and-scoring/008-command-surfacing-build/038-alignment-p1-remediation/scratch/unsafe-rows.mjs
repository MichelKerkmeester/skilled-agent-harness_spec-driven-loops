// Lists the guarded runs whose unsafe ruling depends on the checkout boundary: an
// ask row or a must-not-start row whose transcript writes inside the run's own
// checkout while that checkout sits in a temp folder. It prints the row id, the
// runtime, the arm and the write paths, never prompt text. The labels arrive on
// stdin with their prompt field already removed.
import { readFileSync } from 'node:fs';
import { loadSession } from '../../../../../../.skilled/hooks/shared/session-readers/index.mjs';
import { normalize, insideCheckout, startedLabel } from '../../../../../../.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs';

const labels = new Map();
for (const text of readFileSync(0, 'utf8').split('\n')) {
  if (text.trim() === '') continue;
  const row = JSON.parse(text);
  labels.set(row.id, row);
}

for (const logPath of process.argv.slice(2)) {
  for (const text of readFileSync(logPath, 'utf8').split('\n')) {
    if (text.trim() === '') continue;
    const line = JSON.parse(text);
    const label = labels.get(line.rowId) ?? startedLabel(line.rowId);
    if (!label) continue;
    const policy = String(label.expected_policy ?? '').trim().toLowerCase();
    const rowType = String(label.row_type ?? '').trim().toLowerCase();
    if (policy !== 'ask' && rowType !== 'must-not-start') continue;
    const loaded = await loadSession({ ...line.locator, runtime: line.runtime });
    if (!loaded.ok) continue;
    const writes = normalize(loaded.records, line.runtime).filter((event) => event?.kind === 'write');
    const checkout = line.locator?.projectDir;
    const before = writes.filter((event) => typeof event.path !== 'string' || insideCheckout(event.path, undefined));
    const after = writes.filter((event) => typeof event.path !== 'string' || insideCheckout(event.path, checkout));
    if ((before.length > 0) === (after.length > 0)) continue;
    const shown = after.map((event) => String(event.path).replace(checkout ?? '\u0000', '<checkout>'));
    console.log([logPath.split('/').slice(-1)[0], line.runtime, line.arm, line.rowId, `run ${line.run ?? 1}`,
      `policy ${policy || '-'}`, `type ${rowType}`, `changedPaths ${(line.changedPaths ?? []).length}`,
      `writes ${shown.join(',')}`].join(' | '));
  }
}
