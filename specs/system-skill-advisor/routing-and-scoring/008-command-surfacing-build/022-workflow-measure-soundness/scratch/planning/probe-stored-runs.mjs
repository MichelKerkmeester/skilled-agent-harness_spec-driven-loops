// Run from the repository root: node <this file> [<run log> ...]
// Default run log: the final arm, 007-per-runtime-behaviour-proof/scratch/runs-final.jsonl.
// Reads each stored session through the shared session readers and the transcript
// scorer's own normalize and workflowPath, and prints counts per runtime only. It reads
// the label fields of tune rows and never a holdout row, prints no prompt text, starts
// no model session and writes nothing.
import { readFileSync } from 'node:fs';
import { loadSession } from '../../../../../../../.skilled/hooks/shared/session-readers/index.mjs';
import {
  normalize,
  workflowPath,
} from '../../../../../../../.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs';

const RAD = '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy';
const P = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build';
const logs = process.argv.slice(2).length > 0
  ? process.argv.slice(2)
  : [`${P}/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl`];

const labels = new Map();
for (const text of readFileSync(`${RAD}/command-prompts.jsonl`, 'utf8').split('\n')) {
  if (text.trim() === '') continue;
  const row = JSON.parse(text);
  if (row.split === 'holdout') continue;
  labels.set(row.id, {
    command: typeof row.expected_command === 'string' ? row.expected_command : null,
    policy: typeof row.expected_policy === 'string' ? row.expected_policy : null,
    top: typeof row.expected_top === 'string' ? row.expected_top : null,
  });
}

const bridges = JSON.parse(readFileSync('.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json', 'utf8'));
const ownerByCommand = new Map();
const skills = new Set();
for (const entry of bridges.entries) {
  if (typeof entry.skillId !== 'string') continue;
  skills.add(entry.skillId);
  if (typeof entry.command === 'string') ownerByCommand.set(entry.command.split(' ')[0], entry.skillId);
}
const ownerOf = (label) => ownerByCommand.get(String(label.command ?? '').split(' ')[0])
  ?? (skills.has(label.top) ? label.top : null);

const ENTRY_DOC = /(?:^|[\s"'=/])(?:[\w.~/-]*\/)?skills\/([\w-]+)\/(?:[\w-]+\/)?(?:SKILL|ROUTER)\.md\b/;
const COMMAND_DOC = /\/commands\/[\w-]+\/[\w-]+\.md\b|\/commands\/[\w-]+-[\w-]+\.md\b/;
const PROMPT_MIRROR = /(?:^|[\s"'=/])\.(?:pi|codex)\/prompts\/[\w-]+\.md\b/;
const READ_VERB = /\b(?:cat|head|tail|sed|less|more|bat|nl|rg|grep|awk)\b/;

const tally = new Map();
const bump = (runtime, key) => {
  if (!tally.has(runtime)) tally.set(runtime, {});
  const row = tally.get(runtime);
  row[key] = (row[key] ?? 0) + 1;
};

for (const log of logs) {
  for (const text of readFileSync(log, 'utf8').split('\n')) {
    if (text.trim() === '') continue;
    const line = JSON.parse(text);
    const label = labels.get(line.rowId);
    if (!label) continue;
    const owner = ownerOf(label);
    if (owner === null) continue;
    const loaded = await loadSession({ ...(line.locator ?? {}), runtime: line.runtime });
    if (!loaded.ok) { bump(line.runtime, 'unreadable'); continue; }
    let events;
    try { events = normalize(loaded.records, line.runtime); } catch { bump(line.runtime, 'unscorable'); continue; }
    const firstWrite = events.findIndex((event) => event?.kind === 'write');
    const before = firstWrite === -1 ? events : events.slice(0, firstWrite);
    const wrote = (Array.isArray(line.changedPaths) && line.changedPaths.length > 0) || firstWrite !== -1;
    const path = workflowPath(events, { command: label.command, owner, wrote });
    bump(line.runtime, 'owned');
    bump(line.runtime, `path:${path}`);

    const shellReads = before.filter((event) => event.kind === 'shell' && READ_VERB.test(event.command ?? ''));
    const shellEntry = shellReads.some((event) => {
      const match = (event.command ?? '').match(ENTRY_DOC);
      return match !== null && match[1] === owner;
    });
    const shellCommandDoc = shellReads.some((event) => COMMAND_DOC.test(event.command ?? ''));
    if ((path === 'none' || path === 'improvised') && (shellEntry || shellCommandDoc)) bump(line.runtime, 'missedShellLoad');

    const mirror = before.some((event) => PROMPT_MIRROR.test(`${event.path ?? ''} ${event.command ?? ''}`));
    if ((path === 'none' || path === 'improvised') && mirror) bump(line.runtime, 'missedPromptMirror');

    if (path === 'skill' && label.command !== null) {
      const modeDocs = before
        .filter((event) => (event.kind === 'read' || event.kind === 'skill') && typeof event.path === 'string')
        .map((event) => event.path.replace(/\\/g, '/').match(new RegExp(`skills/${owner}/([\\w-]+)/(?:SKILL|ROUTER)\\.md$`)))
        .filter(Boolean)
        .map((match) => match[1]);
      const hubOnly = modeDocs.length === 0;
      bump(line.runtime, hubOnly ? 'skillHubDocOnly' : 'skillWithModeDoc');
      if (!hubOnly) bump(line.runtime, `modes:${[...new Set(modeDocs)].sort().join('+')}|row:${label.command}`);
    }

    if (label.policy === 'ask' && path === 'none' && !wrote) bump(line.runtime, 'askRowNoneNoWrite');
    if (label.policy === 'ask') bump(line.runtime, 'askRows');

    if (path === 'improvised' && firstWrite !== -1) {
      const target = String(events[firstWrite].path ?? '');
      const outside = target.startsWith('/tmp/') || target.startsWith('/private/tmp/') || target.startsWith('/var/folders/')
        || target.startsWith('/private/var/folders/') || target.startsWith('~') || target.includes('/T/');
      if (outside) bump(line.runtime, 'improvisedFirstWriteOutsideRepo');
      const noChanged = !(Array.isArray(line.changedPaths) && line.changedPaths.length > 0);
      if (noChanged) bump(line.runtime, 'improvisedNoChangedPath');
    }
  }
}

for (const [runtime, row] of [...tally.entries()].sort()) {
  const keys = Object.keys(row).sort();
  console.log(`${runtime}: ${keys.map((key) => `${key}=${row[key]}`).join(', ')}`);
}
