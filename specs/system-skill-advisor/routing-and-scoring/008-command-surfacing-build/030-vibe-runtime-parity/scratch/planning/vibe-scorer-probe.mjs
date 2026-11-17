// Planning probe: reads the committed Vibe reader fixture the way the transcript
// scorer does and prints what the scorer can see. The records the shared loader
// returns, the tool effects only the Vibe reader's entries hold, and whether the
// scorer's normalize step accepts the runtime.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2];
const fixture = join(root, '.skilled/hooks/shared/tests/session-readers/fixtures/vibe/scratch-cwd');
const { loadSession } = await import(join(root, '.skilled/hooks/shared/session-readers/index.mjs'));
const { loadVibeSession } = await import(join(root, '.skilled/hooks/shared/session-readers/vibe.mjs'));
const { normalize } = await import(join(root, '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs'));

const sessionId = JSON.parse(readFileSync(join(fixture, 'meta.json'), 'utf8')).session_id;
const loaded = await loadSession({ runtime: 'vibe', sessionId, transcriptPath: fixture });
console.log(`loadSession ok=${loaded.ok} records=${loaded.records.length} blocks=${JSON.stringify(loaded.records.map((record) => [record.role, record.content.map((block) => block.type)]))} entriesReturned=${'entries' in loaded}`);
const session = loadVibeSession({ transcriptPath: fixture, sessionId });
const effects = session.entries.filter((entry) => entry.type === 'effect' && entry.detail?.kind === 'tool');
console.log(`loadVibeSession entries=${session.entries.length} toolEffects=${JSON.stringify(effects.map((entry) => [entry.detail.toolName, Object.keys(entry.detail.input ?? {}).sort()]))}`);
try {
  normalize(loaded.records, 'vibe');
  console.log('normalize vibe: accepted');
} catch (error) {
  console.log(`normalize vibe: ${error.message}`);
}
