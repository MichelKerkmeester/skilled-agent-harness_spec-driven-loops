// Run from the repository root: node <this file> [<run log> ...]
// Planning probe for the shell-read rule of the transcript scorer. Part one classifies
// hand-built shell events through the scorer's own workflowPath and prints one line
// each. Part two walks the stored runs of the given logs (default: both stored arms)
// and counts, per runtime, the loads that rest on a search verb alone and the shell
// shapes the rule misses. It prints counts only: no prompt text, no command text and
// no row id. Row labels come from `jq -c 'del(.prompt)'`. It starts no model session
// and writes nothing.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { loadSession } from '../../../../../../../.skilled/hooks/shared/session-readers/index.mjs';
import {
  normalize,
  workflowPath,
} from '../../../../../../../.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs';

const ev = (seq, kind, fields) => ({ seq, kind, path: null, command: null, text: null, ...fields });
const facts = { command: '/create:agent', owner: 'sk-doc', wrote: false };
const UNITS = [
  ['rg over the owner entry document', 'rg -n "mode" .skilled/skills/sk-doc/SKILL.md'],
  ['grep over the owner entry document', 'grep -n workflow .skilled/skills/sk-doc/SKILL.md'],
  ['rg whose pattern is the document name', 'rg -l "sk-doc/SKILL.md" docs'],
  ['heredoc body line that starts with a reader', "cat > /tmp/notes.txt <<'EOF'\nmore detail in .skilled/skills/sk-doc/SKILL.md\nEOF"],
  ['heredoc body line that starts with head', "python3 - <<'EOF'\nhead .skilled/skills/sk-doc/SKILL.md\nEOF"],
  ['cd into the skill folder, then cat', 'cd .skilled/skills/sk-doc && cat SKILL.md'],
  ['cd into the mode folder, then sed', 'cd .skilled/skills/sk-doc/sk-create-agent && sed -n 1,80p SKILL.md'],
  ['cd elsewhere, then cat a bare name', 'cd docs && cat SKILL.md'],
  ['cat with the full path, the control', 'cat .skilled/skills/sk-doc/SKILL.md'],
];
for (const [name, command] of UNITS) {
  console.log(`${name}: ${workflowPath([ev(0, 'shell', { command })], facts)}`);
}

const RAD = '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy';
const RL = 'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch';
const logs = process.argv.slice(2).length > 0
  ? process.argv.slice(2)
  : [`${RL}/runs-pre.jsonl`, `${RL}/runs-pre-dsh-rerun.jsonl`, `${RL}/runs-final.jsonl`];

const labels = new Map();
for (const text of execFileSync('jq', ['-c', 'del(.prompt)', `${RAD}/command-prompts.jsonl`], { encoding: 'utf8' }).split('\n')) {
  if (text.trim() === '') continue;
  const row = JSON.parse(text);
  if (row.split !== 'holdout') labels.set(row.id, row);
}
const bridges = JSON.parse(readFileSync('.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json', 'utf8'));
const ownerByCommand = new Map();
const skills = new Set();
for (const entry of bridges.entries) {
  if (typeof entry.skillId !== 'string') continue;
  skills.add(entry.skillId);
  if (typeof entry.command === 'string') ownerByCommand.set(entry.command.split(' ')[0], entry.skillId);
}
const ownerOf = (label) => ownerByCommand.get(String(label.expected_command ?? '').split(' ')[0])
  ?? (skills.has(label.expected_top) ? label.expected_top : null);

// A shell command with every part that starts with a search verb removed.
const SEARCH_PART = /^\s*(?:[A-Za-z_][A-Za-z0-9_]*=\S*\s+)*(?:rg|grep)\b/;
const withoutSearch = (command) => String(command ?? '')
  .split(/(;|&&|\|\||\||\r?\n)/)
  .filter((part) => !SEARCH_PART.test(part))
  .join('');
const CD_THEN_BARE = /\bcd\s+\S*skills\/[\w-]+(?:\/[\w-]+)?\/?\s*(?:&&|;)\s*(?:cat|head|tail|sed|less|more|bat|nl|awk)\b[^|;&\n]*(?<![\w/.-])(?:SKILL|ROUTER)\.md\b/;
const HEREDOC_READER_LINE = /<<-?\s*['"]?\w+['"]?[^\n]*\n(?:[^\n]*\n)*?\s*(?:more|less|head|tail|cat|sed|nl|awk|bat)\b[^\n]*\.(?:md|ya?ml)\b/;

const tally = new Map();
const bump = (runtime, key) => {
  if (!tally.has(runtime)) tally.set(runtime, { owned: 0, 'loads resting on rg or grep alone': 0, 'cd then a bare document name': 0, 'heredoc body line with a reader verb': 0 });
  tally.get(runtime)[key] += 1;
};

const seen = new Set();
for (const log of logs) {
  for (const text of readFileSync(log, 'utf8').split('\n')) {
    if (text.trim() === '') continue;
    const line = JSON.parse(text);
    const label = labels.get(line.rowId);
    if (!label) continue;
    const owner = ownerOf(label);
    if (owner === null) continue;
    const key = `${line.runtime} ${line.arm} ${line.rowId}`;
    const loaded = await loadSession({ ...(line.locator ?? {}), runtime: line.runtime });
    if (!loaded.ok) continue;
    let events;
    try { events = normalize(loaded.records, line.runtime); } catch { continue; }
    if (seen.has(key)) continue;
    seen.add(key);
    bump(line.runtime, 'owned');
    const wrote = (Array.isArray(line.changedPaths) && line.changedPaths.length > 0) || events.some((event) => event.kind === 'write');
    const rowFacts = { command: label.expected_command, owner, wrote, policy: label.expected_policy };
    const now = workflowPath(events, rowFacts);
    const stripped = events.map((event) => (event.kind === 'shell' ? { ...event, command: withoutSearch(event.command) } : event));
    const then = workflowPath(stripped, rowFacts);
    if ((now === 'command' || now === 'skill') && then !== now) bump(line.runtime, 'loads resting on rg or grep alone');
    const shell = events.filter((event) => event.kind === 'shell' || event.kind === 'write').map((event) => event.command ?? '');
    if (shell.some((command) => CD_THEN_BARE.test(command))) bump(line.runtime, 'cd then a bare document name');
    if (shell.some((command) => HEREDOC_READER_LINE.test(command))) bump(line.runtime, 'heredoc body line with a reader verb');
  }
}
for (const [runtime, row] of [...tally.entries()].sort()) {
  console.log(`${runtime}: ${Object.keys(row).map((key) => `${key}=${row[key]}`).join(', ')}`);
}
