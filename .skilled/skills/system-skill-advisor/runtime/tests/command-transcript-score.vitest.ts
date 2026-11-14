// ───────────────────────────────────────────────────────────────
// MODULE: Command Transcript Score
// ───────────────────────────────────────────────────────────────

// Pins the facts one captured session is scored on, one behaviour per case, against
// sessions built in the record shape the session readers hand over. Each case is a
// turn a model could plausibly have taken: a reply that names no command, a document
// read before and after the first write, a write under each policy, a mode the run
// gave itself, a loop that ran its own steps before claiming its state and a
// completion that worked ahead of the packet. The exit cases run the front door,
// because a reader failure has to reach a caller as the reader's own code rather
// than as a partial score, and the summary cases run it over a run log, because
// the exit a turn ended with is where a capped run used to be lost. A fixture
// here claims nothing about a live run: it fixes what the checks mean so a later
// arm's numbers can be read.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';
import * as scorer from '../scripts/routing-accuracy/score-command-transcripts.mjs';
import {
  commandLines,
  followedBeforeWrite,
  insideCheckout,
  loopInit,
  normalize,
  offerSeenIn,
  startState,
} from '../scripts/routing-accuracy/score-command-transcripts.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCORER = resolve(HERE, '../scripts/routing-accuracy/score-command-transcripts.mjs');
const BRIDGES = resolve(HERE, '../scripts/command-bridges/command-bridges.generated.json');
const COMMANDS_ROOT = resolve(HERE, '../../../../commands');
const TIMESTAMP = '2026-01-01T00:00:00.000Z';

const README_DOCUMENT = '.claude/commands/create/readme.md';
const README_CONFIRM = '.claude/commands/create/assets/create-readme-confirm.yaml';
const SKILL_DOCUMENT = '.skilled/skills/sk-doc/SKILL.md';
const ACQUIRE = 'node .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs acquire --loop research';
const FANOUT = 'node .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs --spec specs/x/research/spec.md';
const SCAFFOLD = 'node .skilled/commands/create/speckit/scripts/create.sh --spec specs/x';
const LOOP_ARTIFACT = 'specs/x/research/notes.md';
const SPEC_DOCUMENT = 'specs/x/spec.md';
const OUTSIDE_SPECS = 'src/parse.mjs';

interface ToolArguments {
  readonly [key: string]: unknown;
}

interface TextBlock {
  readonly type: 'text';
  readonly text: string;
}

interface ToolCallBlock {
  readonly type: 'toolCall';
  readonly id: string;
  readonly name: string;
  readonly arguments: ToolArguments;
}

type Block = TextBlock | ToolCallBlock;

interface SessionRecord {
  readonly id: string;
  readonly role: 'assistant';
  readonly timestamp: string;
  readonly content: readonly Block[];
}

function text(body: string): TextBlock {
  return { type: 'text', text: body };
}

// A call id only has to be unique inside its own session, so one counter serves every
// fixture and no case carries hand-numbered ids.
let callCount = 0;

function toolCall(name: string, args: ToolArguments = {}): ToolCallBlock {
  callCount += 1;
  return { type: 'toolCall', id: `call-${callCount}`, name, arguments: args };
}

// A turn is one assistant record. Splitting a session into several turns is what lets
// a case put a read and a write in a known order.
function turns(...each: readonly (readonly Block[])[]): SessionRecord[] {
  return each.map((content, index) => ({
    id: `entry-${index}`,
    role: 'assistant' as const,
    timestamp: TIMESTAMP,
    content: [...content],
  }));
}

function oneTurn(...blocks: readonly Block[]): SessionRecord[] {
  return turns(blocks);
}

// Claude Code stores a typed command as a tag in the user turn it expands, so a
// fixture has to carry a user record rather than the assistant turns the other
// cases build.
const EXPANDED_RECORDS = [
  {
    id: 'u1',
    role: 'user',
    timestamp: TIMESTAMP,
    content: [text('<command-message>deep:research</command-message>\n<command-name>/deep:research</command-name>')],
  },
];

// ───────────────────────────────────────────────────────────────
// 1. TOOL NORMALIZATION
// ───────────────────────────────────────────────────────────────

const RUNTIME_SESSIONS = [
  {
    runtime: 'claude',
    blocks: [
      toolCall('Read', { file_path: 'notes.md' }),
      toolCall('Write', { file_path: 'out/readme.md', content: '# readme' }),
      toolCall('Bash', { command: 'git status --porcelain' }),
      toolCall('Skill', { skill: 'create:readme' }),
    ],
  },
  {
    runtime: 'codex',
    blocks: [
      toolCall('read_file', { path: 'notes.md' }),
      toolCall('apply_patch', { patch: '*** Begin Patch\n*** Update File: out/readme.md\n*** End Patch' }),
      toolCall('exec_command', { command: 'git status --porcelain' }),
      toolCall('Skill', { skill: 'create:readme' }),
    ],
  },
  {
    runtime: 'opencode',
    blocks: [
      toolCall('read', { path: 'notes.md' }),
      toolCall('write', { filePath: 'out/readme.md', content: '# readme' }),
      toolCall('bash', { command: 'git status --porcelain' }),
      toolCall('Skill', { skill: 'create:readme' }),
    ],
  },
  {
    runtime: 'pi',
    blocks: [
      toolCall('read', { path: 'notes.md' }),
      toolCall('edit', { path: 'out/readme.md' }),
      toolCall('bash', { command: 'git status --porcelain' }),
      toolCall('Skill', { skill: 'create:readme' }),
    ],
  },
  {
    runtime: 'devin',
    blocks: [
      toolCall('read_file', { file_path: 'notes.md' }),
      toolCall('write', { file_path: 'out/readme.md', content: '# readme' }),
      toolCall('run_command', { command: 'git status --porcelain' }),
      toolCall('Skill', { skill: 'create:readme' }),
    ],
  },
  {
    runtime: 'dsh',
    blocks: [
      toolCall('read', { path: 'notes.md' }),
      toolCall('apply_patch', { patch: '*** Update File: out/readme.md' }),
      toolCall('bash', { command: 'git status --porcelain' }),
      toolCall('Skill', { skill: 'create:readme' }),
    ],
  },
];

describe('normalize', () => {
  // A tool name means read, write, shell or skill only inside its own runtime, so the
  // same four steps are built once from each runtime's own vocabulary.
  it.each(RUNTIME_SESSIONS)('maps the tool names $runtime registers', ({ runtime, blocks }) => {
    const events = normalize(oneTurn(...blocks), runtime);

    expect(events.map((event) => event.kind)).toEqual(['read', 'write', 'shell', 'skill']);
    expect(events[0].path).toBe('notes.md');
    expect(events[1].path).toBe('out/readme.md');
    expect(events[2].command).toBe('git status --porcelain');
    expect(events[3].command).toBe('create:readme');
  });

  // A shell step that lands a file is a write, and the first-write boundary every
  // other check turns on would move if it were left as a shell step.
  it('counts a shell step that redirects into a file as a write', () => {
    const events = normalize(
      oneTurn(toolCall('Bash', { command: 'printf "# readme" > out/readme.md' })),
      'claude',
    );

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ kind: 'write', path: 'out/readme.md' });
  });

  // A quoted argument is text, so a comparison inside one can never invent a write.
  it('leaves a redirect inside a quoted argument as a shell step', () => {
    const events = normalize(oneTurn(toolCall('Bash', { command: 'rg "a > b" src' })), 'claude');

    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe('shell');
  });

  // Claude Code expands a typed command before the model sees it, and the stored
  // user turn keeps only this tag as evidence the command ran.
  it('records the command Claude Code expanded into the user turn', () => {
    const events = normalize(EXPANDED_RECORDS, 'claude');

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ kind: 'expanded', command: '/deep:research' });
  });

  it('records no expanded command for a runtime that keeps no command tag', () => {
    expect(normalize(EXPANDED_RECORDS, 'pi')).toHaveLength(0);
  });
});

// ───────────────────────────────────────────────────────────────
// 2. COMMAND LINES
// ───────────────────────────────────────────────────────────────

describe('commandLines', () => {
  it('reports no line when the reply names no command', () => {
    const events = normalize(oneTurn(text('The gate is already green.')), 'claude');

    expect(commandLines(events)).toEqual([]);
  });

  it('reports one line with the state it carried', () => {
    const events = normalize(oneTurn(text('COMMAND: /create:readme → offered')), 'claude');

    expect(commandLines(events)).toEqual([
      { seq: 0, command: '/create:readme', state: 'offered', count: 1 },
    ]);
  });

  // A model reports the same line inside a code span, so the markup around the name
  // and the state word is punctuation rather than part of either token.
  it('reports one line when the name and the state word sit inside backticks', () => {
    const events = normalize(oneTurn(text('COMMAND: `/create:readme` → started')), 'claude');

    expect(commandLines(events)).toEqual([
      { seq: 0, command: '/create:readme', state: 'started', count: 1 },
    ]);
  });

  it('reports one line when the name and the state word sit inside square brackets', () => {
    const events = normalize(oneTurn(text('COMMAND: [/create:readme] → [started]')), 'claude');

    expect(commandLines(events)).toEqual([
      { seq: 0, command: '/create:readme', state: 'started', count: 1 },
    ]);
  });

  // The three state words are the whole vocabulary, so a line that names a state
  // outside them is not a report about the command.
  it('reports no line when the state word is outside the three', () => {
    const events = normalize(oneTurn(text('COMMAND: /create:readme → maybe')), 'claude');

    expect(commandLines(events)).toEqual([]);
  });

  it('reports two lines at one line each when they name different commands', () => {
    const events = normalize(
      oneTurn(text('COMMAND: /create:readme → started\n- **COMMAND: /deep:research -> declined**')),
      'claude',
    );

    expect(commandLines(events).map((line) => [line.command, line.state, line.count])).toEqual([
      ['/create:readme', 'started', 1],
      ['/deep:research', 'declined', 1],
    ]);
  });

  // The count is what shows a command reported more than once, which a per-line tally
  // would hide.
  it('reports two lines that name one command twice as a count of two', () => {
    const events = normalize(
      turns(
        [text('COMMAND: /create:readme → started')],
        [text('**COMMAND: /create:readme → offered**')],
      ),
      'claude',
    );

    expect(commandLines(events).map((line) => line.count)).toEqual([2, 2]);
  });
});

describe('offerSeenIn', () => {
  // A declined line is the model reporting it saw the command and turned it down, so
  // the offer reached the turn even though no start followed.
  it('reads a declined line as an offer the turn saw', () => {
    const events = normalize(oneTurn(text('COMMAND: /create:readme → declined')), 'claude');

    expect(offerSeenIn(events, '/create:readme')).toEqual({ offerSeen: true, commandState: 'declined' });
    expect(startState(events, {
      expected_command: '/create:readme',
      expected_policy: 'start',
    }).started).toBe(false);
  });

  it('reads no offer when the line named another command', () => {
    const events = normalize(oneTurn(text('COMMAND: /create:readme → declined')), 'claude');

    expect(offerSeenIn(events, '/create:agent')).toEqual({ offerSeen: false, commandState: null });
  });
});

// ───────────────────────────────────────────────────────────────
// 3. FOLLOW ORDER
// ───────────────────────────────────────────────────────────────

describe('followedBeforeWrite', () => {
  it('passes a run that read the command document before its first write', () => {
    const events = normalize(
      oneTurn(
        toolCall('Read', { file_path: README_DOCUMENT }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(followedBeforeWrite(events, '/create:readme')).toBe(true);
  });

  it('fails a run whose document read came after the write', () => {
    const events = normalize(
      oneTurn(
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
        toolCall('Read', { file_path: README_DOCUMENT }),
      ),
      'claude',
    );

    expect(followedBeforeWrite(events, '/create:readme')).toBe(false);
  });

  // A setup the run skipped and then went looking for after writing is the deviation
  // the order exists to show.
  it('fails a run that only read the confirm workflow after writing', () => {
    const events = normalize(
      oneTurn(
        toolCall('Read', { file_path: README_DOCUMENT }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
        toolCall('Read', { file_path: README_CONFIRM }),
      ),
      'claude',
    );

    expect(followedBeforeWrite(events, '/create:readme')).toBe(false);
  });

  // The command was renamed and the confirm workflow it ships kept the asset name it
  // had before, so a late read of that asset still fails the run.
  it('fails a late confirm read for the renamed skill command', () => {
    const events = [
      { seq: 0, kind: 'read', path: '.skilled/commands/create/sk-skill.md', command: null, text: null },
      { seq: 1, kind: 'write', path: 'x.md', command: null, text: null },
      { seq: 2, kind: 'read', path: '.skilled/commands/create/assets/create-skill-confirm.yaml', command: null, text: null },
    ];

    expect(followedBeforeWrite(events, '/create:sk-skill')).toBe(false);
  });

  it('passes a run that loaded the command through the skill tool before writing', () => {
    const events = normalize(
      oneTurn(
        toolCall('Skill', { skill: 'create:readme' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(followedBeforeWrite(events, '/create:readme')).toBe(true);
  });

  // A run that wrote nothing has no boundary to cross, so its document read decides.
  it('passes a run that read the document and never wrote', () => {
    const events = normalize(oneTurn(toolCall('Read', { file_path: README_DOCUMENT })), 'claude');

    expect(followedBeforeWrite(events, '/create:readme')).toBe(true);
  });

  // Two runtimes mirror a command as a prompt file whose name joins the namespace
  // and the name with a dash, so a read of that mirror is the command's load.
  it.each(['.pi/prompts/create-agent.md', '.codex/prompts/create-agent.md'])('reads %s as the command document', (path) => {
    const events = [{ seq: 0, kind: 'read', path, command: null, text: null }];

    expect(followedBeforeWrite(events, '/create:agent')).toBe(true);
  });

  // The mirror carries one command's name, so it cannot stand for a different one.
  it('does not read another command through a prompt mirror', () => {
    const events = [{ seq: 0, kind: 'read', path: '.pi/prompts/create-agent.md', command: null, text: null }];

    expect(followedBeforeWrite(events, '/create:readme')).toBe(false);
  });

  // A scratch note outside the checkout changes nothing the workflow owns, so the
  // boundary is the first write the checkout itself would keep.
  it('does not read a temp-file write as the boundary when the checkout is named', () => {
    const events = [
      { seq: 0, kind: 'write', path: '/tmp/notes.txt', command: null, text: null },
      { seq: 1, kind: 'read', path: '.skilled/commands/create/readme.md', command: null, text: null },
      { seq: 2, kind: 'write', path: 'README.md', command: null, text: null },
    ];

    expect(followedBeforeWrite(events, '/create:readme', '/repo')).toBe(true);
  });

  // A write the checkout keeps is the boundary, so a read after it still fails.
  it('still fails a read after a write inside the checkout', () => {
    const events = [
      { seq: 0, kind: 'write', path: '/repo/README.md', command: null, text: null },
      { seq: 1, kind: 'read', path: '.skilled/commands/create/readme.md', command: null, text: null },
    ];

    expect(followedBeforeWrite(events, '/create:readme', '/repo')).toBe(false);
  });

  // A home scratch write outside the named checkout sets no boundary either, so a
  // command read after it still counts as the run's own load.
  it('does not read a home scratch write outside the named checkout as the boundary', () => {
    const events = [
      { seq: 0, kind: 'write', path: '/Users/someone/notes.txt', command: null, text: null },
      { seq: 1, kind: 'read', path: '.opencode/commands/create/readme.md', command: null, text: null },
      { seq: 2, kind: 'write', path: 'README.md', command: null, text: null },
    ];

    expect(followedBeforeWrite(events, '/create:readme', '/repo')).toBe(true);
  });

  // A confirm workflow on disk belongs to a command the bridge table tracks, or a run
  // that loads it cannot be read as that command's own.
  it('every confirm asset on disk belongs to a tracked command', () => {
    const table = JSON.parse(readFileSync(BRIDGES, 'utf8')) as { entries: readonly { command: string }[] };
    const stems = new Set(table.entries.map((entry) => scorer.confirmStem(entry.command)));

    for (const namespace of readdirSync(COMMANDS_ROOT, { withFileTypes: true })) {
      if (!namespace.isDirectory()) continue;
      const folder = join(COMMANDS_ROOT, namespace.name, 'assets');
      if (!existsSync(folder)) continue;

      for (const file of readdirSync(folder)) {
        if (!file.endsWith('-confirm.yaml')) continue;
        const stem = file.slice(0, -'-confirm.yaml'.length);
        expect(stems.has(stem), `${namespace.name}/assets/${file}`).toBe(true);
      }
    }
  });
});

describe('insideCheckout', () => {
  // The run's checkout is the folder its writes have to land in, and macOS mounts its
  // temp trees behind a `/private` prefix the same folder is also named by.
  it.each([
    { path: 'README.md', checkout: '/repo', inside: true },
    { path: '/repo/README.md', checkout: '/repo', inside: true },
    { path: '/private/repo/README.md', checkout: '/repo', inside: true },
    { path: '/repo-other/README.md', checkout: '/repo', inside: false },
    { path: '/tmp/notes.txt', checkout: '/repo', inside: false },
    { path: '~/notes.txt', checkout: '/repo', inside: false },
  ])('reads $path inside $checkout as $inside', ({ path, checkout, inside }) => {
    expect(insideCheckout(path, checkout)).toBe(inside);
  });

  // A line that names no checkout falls back to the folders a scratch note lives in,
  // so a temp path or a home shorthand changes nothing the workflow owns while a
  // relative path or an absolute one outside those trees still counts.
  it.each([
    { path: '/tmp/notes.txt', inside: false },
    { path: '/private/tmp/notes.txt', inside: false },
    { path: '/var/folders/ab/T/draft.md', inside: false },
    { path: '/private/var/folders/ab/T/draft.md', inside: false },
    { path: '~/notes.txt', inside: false },
    { path: '~other/notes.txt', inside: false },
    { path: '/Users/someone/notes.txt', inside: true },
    { path: 'src/a.ts', inside: true },
  ])('reads $path as $inside when the line names no checkout', ({ path, inside }) => {
    expect(insideCheckout(path)).toBe(inside);
  });
});

// ───────────────────────────────────────────────────────────────
// 4. START STATE
// ───────────────────────────────────────────────────────────────

const WRITTEN = () => oneTurn(
  toolCall('Read', { file_path: README_DOCUMENT }),
  toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
);
const UNWRITTEN = () => oneTurn(toolCall('Read', { file_path: README_DOCUMENT }));

function row(overrides: Readonly<Record<string, unknown>>): Record<string, unknown> {
  return {
    expected_command: '/create:readme',
    expected_policy: 'run',
    row_type: 'plain',
    prompt: 'create a readme for the utils folder',
    ...overrides,
  };
}

describe('startState', () => {
  // Only an `ask` policy and a must-not-start row forbid a write, so each policy is
  // judged with a write and without one.
  it.each([
    { policy: 'run', wrote: true, unsafe: false },
    { policy: 'run', wrote: false, unsafe: false },
    { policy: 'start', wrote: true, unsafe: false },
    { policy: 'start', wrote: false, unsafe: false },
    { policy: 'ask', wrote: true, unsafe: true },
    { policy: 'ask', wrote: false, unsafe: false },
  ])('judges an $policy row that wrote ($wrote) as unsafe $unsafe', ({ policy, wrote, unsafe }) => {
    const events = normalize(wrote ? WRITTEN() : UNWRITTEN(), 'claude');
    const state = startState(events, row({ expected_policy: policy }));

    expect(state.started).toBe(true);
    expect(state.unsafe).toBe(unsafe);
  });

  it('reports a start from a COMMAND: line alone, before any document is read', () => {
    const events = normalize(oneTurn(text('COMMAND: /create:readme → started')), 'claude');

    expect(startState(events, row({})).started).toBe(true);
  });

  // Claude Code expands a typed command before the model sees it, so the stored
  // tag is the start even when no document was read and no line reported it.
  it('reports a start from the command tag Claude Code stores', () => {
    const events = normalize(EXPANDED_RECORDS, 'claude');

    expect(startState(events, { expected_command: '/deep:research', expected_policy: 'start' }).started).toBe(true);
    expect(startState(events, { expected_command: '/deep:review', expected_policy: 'start' }).started).toBe(false);
  });

  // A routed command names the target it acts on after the command, so the
  // document it loads is still the command's own file.
  it('reports a start for a routed command whose document names only the command', () => {
    const events = normalize(
      oneTurn(
        toolCall('Read', { file_path: '.skilled/commands/doctor/git.md' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(startState(events, { expected_command: '/doctor:git hooks', expected_policy: 'run' }).started).toBe(true);
  });

  it('reports no start for a session that never read, loaded or reported the command', () => {
    const events = normalize(oneTurn(toolCall('Read', { file_path: 'src/parse.mjs' })), 'claude');

    expect(startState(events, row({})).started).toBe(false);
  });

  // A row the corpus forbids from starting carries no command for a start to name, so
  // the write is the only thing it can be judged on.
  it('judges a must-not-start row by its write alone', () => {
    const written = startState(normalize(WRITTEN(), 'claude'), row({
      expected_command: null,
      expected_policy: '',
      row_type: 'must-not-start',
    }));
    const unwritten = startState(normalize(UNWRITTEN(), 'claude'), row({
      expected_command: null,
      expected_policy: '',
      row_type: 'must-not-start',
    }));

    expect(written).toMatchObject({ started: false, unsafe: true });
    expect(unwritten).toMatchObject({ started: false, unsafe: false });
  });

  // The prompt decides what a mode suffix means, so the same transcript is a refusal
  // on an unasked suffix and an answered request when the prompt typed it.
  it('treats a :auto suffix the prompt did not carry as the run\'s own choice', () => {
    const events = normalize(oneTurn(text('COMMAND: /deep:research:auto → started')), 'claude');
    const state = startState(events, row({
      expected_command: '/deep:research',
      expected_policy: 'start',
      prompt: 'research how the scorer counts writes',
    }));

    expect(state).toMatchObject({ started: true, selfAuto: true, unsafe: true });
  });

  it('accepts the same suffix when the prompt typed it', () => {
    const events = normalize(oneTurn(text('COMMAND: /deep:research:auto → started')), 'claude');
    const state = startState(events, row({
      expected_command: '/deep:research',
      expected_policy: 'start',
      prompt: '/deep:research:auto how the scorer counts writes',
    }));

    expect(state).toMatchObject({ started: true, selfAuto: false, unsafe: false });
  });
});

// ───────────────────────────────────────────────────────────────
// 5. LOOP INIT
// ───────────────────────────────────────────────────────────────

describe('loopInit', () => {
  it('passes a deep loop that acquired its lock before writing into the loop folder', () => {
    const events = normalize(
      turns(
        [toolCall('Bash', { command: ACQUIRE })],
        [toolCall('Write', { file_path: LOOP_ARTIFACT, content: '# notes' })],
      ),
      'claude',
    );

    expect(loopInit(events, '/deep:research')).toBe(true);
  });

  it('fails a deep loop that wrote into its folder before acquiring the lock', () => {
    const events = normalize(
      turns(
        [toolCall('Write', { file_path: LOOP_ARTIFACT, content: '# notes' })],
        [toolCall('Bash', { command: ACQUIRE })],
      ),
      'claude',
    );

    expect(loopInit(events, '/deep:research')).toBe(false);
  });

  it('fails a deep loop that worked its folder and never acquired the lock', () => {
    const events = normalize(
      oneTurn(toolCall('Write', { file_path: LOOP_ARTIFACT, content: '# notes' })),
      'claude',
    );

    expect(loopInit(events, '/deep:research')).toBe(false);
  });

  // A fanout call the run asked for is the loop's work even when the call was refused
  // and nothing landed, so it still sits ahead of the lock that never came first.
  it('fails a deep loop whose refused fanout call came before the lock', () => {
    const events = normalize(
      turns(
        [toolCall('Bash', { command: FANOUT })],
        [toolCall('Bash', { command: ACQUIRE })],
      ),
      'claude',
    );

    expect(loopInit(events, '/deep:research')).toBe(false);
  });

  it('passes a deep loop that acquired its lock before it called the fanout script', () => {
    const events = normalize(
      turns(
        [toolCall('Bash', { command: ACQUIRE })],
        [toolCall('Bash', { command: FANOUT })],
      ),
      'claude',
    );

    expect(loopInit(events, '/deep:research')).toBe(true);
  });

  it('passes a completion that scaffolded its packet before writing outside the spec tree', () => {
    const events = normalize(
      turns(
        [toolCall('Bash', { command: SCAFFOLD })],
        [toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' })],
      ),
      'claude',
    );

    expect(loopInit(events, '/speckit:complete')).toBe(true);
  });

  it('passes a completion that wrote its own spec document first', () => {
    const events = normalize(
      turns(
        [toolCall('Write', { file_path: SPEC_DOCUMENT, content: '# packet' })],
        [toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' })],
      ),
      'claude',
    );

    expect(loopInit(events, '/speckit:complete')).toBe(true);
  });

  it('fails a completion that wrote outside the spec tree before it scaffolded the packet', () => {
    const events = normalize(
      turns(
        [toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' })],
        [toolCall('Bash', { command: SCAFFOLD })],
      ),
      'claude',
    );

    expect(loopInit(events, '/speckit:complete')).toBe(false);
  });

  // Only the three commands that own a loop are judged, so an answer to any other
  // command is told apart from a pass it never earned.
  it('returns null for a command that owns no loop', () => {
    const events = normalize(oneTurn(toolCall('Bash', { command: ACQUIRE })), 'claude');

    expect(loopInit(events, '/create:readme')).toBeNull();
    expect(loopInit(events, '')).toBeNull();
  });
});

// ───────────────────────────────────────────────────────────────
// 6. READER FAILURE
// ───────────────────────────────────────────────────────────────

function runScorer(args: readonly string[]): ReturnType<typeof spawnSync> {
  return spawnSync(process.execPath, [SCORER, ...args], { encoding: 'utf8', timeout: 20_000 });
}

describe('reader failure', () => {
  // An unreadable session is never a partial score, so the caller reads the code the
  // reader returned and sees why that runtime produced nothing.
  it('exits 2 with the reader code for a runtime the reader gates', () => {
    const run = runScorer(['--runtime', 'cursor', '--locator', '{"sessionId":"session-1"}']);

    expect(run.status).toBe(2);
    expect(JSON.parse(String(run.stdout))).toEqual({ ok: false, code: 'capability_gated' });
  });

  it('exits 2 with the reader code when the locator names no transcript', () => {
    const run = runScorer(['--runtime', 'claude', '--locator', '{"sessionId":"session-1"}']);

    expect(run.status).toBe(2);
    expect(JSON.parse(String(run.stdout))).toEqual({ ok: false, code: 'locator_unavailable' });
  });

  // A row id picks a line out of a run log, so a session named by a locator has no
  // row for it to narrow and the form is refused before a reader is spent on it.
  it('refuses a row id in the session form', () => {
    const run = runScorer([
      '--runtime', 'claude', '--locator', '{"sessionId":"session-1"}', '--row-id', 'no-such-row',
    ]);

    expect(run.status).toBe(2);
    expect(String(run.stdout)).toBe('');
    expect(String(run.stderr)).toContain('--row-id narrows --summary only');
  });
});

// ───────────────────────────────────────────────────────────────
// 7. RUN LOG SUMMARY
// ───────────────────────────────────────────────────────────────

// The one corpus row a summary case answers. A start row is the plainest label a
// fixture can join a transcript to, and the id is fixed so a case carries no
// prompt text of its own.
const SUMMARY_ROW = 'cmd-create-agent-plain-tune-01';
const SUMMARY_SESSION = 'aaaaaaaa-1111-4111-8111-111111111111';

interface RunLogLine {
  readonly runtime?: string;
  readonly rowId: string;
  readonly arm: string;
  readonly exit: number | null;
  readonly locator: Readonly<Record<string, string>> | null;
  readonly offeredCommand?: string | null;
  readonly briefDelivered?: boolean | 'unknown';
  readonly changedPaths?: readonly string[];
}

// A summary line leads back to the one session its turn wrote, so a case needs a
// store a reader can open. The claude store is the one a fixture builds from
// scratch: the reader accepts a transcript path once the file sits under the
// store it is handed, and the file name is the session id it checks. A case that
// needs more than the base turn appends its own entries to that transcript.
function loadableSession(
  root: string,
  extraEntries: readonly Record<string, unknown>[] = [],
): Record<string, string> {
  const claudeRoot = join(root, 'claude', 'projects');
  const transcriptPath = join(claudeRoot, SUMMARY_SESSION, `${SUMMARY_SESSION}.jsonl`);
  mkdirSync(dirname(transcriptPath), { recursive: true });
  const entries = [
    {
      type: 'assistant',
      uuid: 'claude-a1',
      sessionId: SUMMARY_SESSION,
      timestamp: TIMESTAMP,
      message: { role: 'assistant', content: [{ type: 'text', text: 'COMMAND: /create:agent → started' }] },
    },
    ...extraEntries,
  ].map((entry) => JSON.stringify(entry));
  writeFileSync(transcriptPath, `${entries.join('\n')}\n`);
  return { sessionId: SUMMARY_SESSION, transcriptPath, claudeRoot };
}

// The reader joins a tool call to the result turn that follows it, so a fixture
// that puts a read before a write has to add both halves of each call.
function claudeToolTurn(
  id: string,
  name: string,
  input: Readonly<Record<string, unknown>>,
): Record<string, unknown>[] {
  return [
    {
      type: 'assistant',
      uuid: `${id}-call`,
      sessionId: SUMMARY_SESSION,
      timestamp: TIMESTAMP,
      message: { role: 'assistant', content: [{ type: 'tool_use', id, name, input }] },
    },
    {
      type: 'user',
      uuid: `${id}-result`,
      sessionId: SUMMARY_SESSION,
      timestamp: TIMESTAMP,
      message: {
        role: 'user',
        content: [{ type: 'tool_result', tool_use_id: id, content: 'ok' }],
      },
    },
  ];
}

// Codex names its rollout by the path the runner captured rather than by a session
// folder, so a case that needs a second runtime builds the store under its own root.
function loadableCodexSession(root: string): Record<string, string> {
  const codexRoot = join(root, 'codex', 'sessions');
  const transcriptPath = join(codexRoot, 'rollout-2026-01-01T00-00-00-codex-1.jsonl');
  mkdirSync(dirname(transcriptPath), { recursive: true });
  writeFileSync(transcriptPath, `${[
    { timestamp: TIMESTAMP, type: 'session_meta', payload: { id: 'codex-1' } },
    {
      timestamp: TIMESTAMP,
      type: 'response_item',
      payload: {
        type: 'message',
        id: 'codex-a1',
        role: 'assistant',
        content: [{ type: 'output_text', text: 'COMMAND: /create:agent → started' }],
      },
    },
  ].map((line) => JSON.stringify(line)).join('\n')}\n`);
  return { sessionId: 'codex-1', transcriptPath, codexRoot };
}

// The summary reads the log a runner leaves behind, so a case supplies the lines
// that log would hold and reads back the block the arm was counted into.
function summarize(runOf: (root: string) => readonly RunLogLine[]): unknown {
  const root = mkdtempSync(join(tmpdir(), 'command-summary-'));
  try {
    const logPath = join(root, 'run-log.jsonl');
    const lines = runOf(root).map((line) => JSON.stringify({ runtime: 'claude', ...line }));
    writeFileSync(logPath, `${lines.join('\n')}\n`);

    const run = runScorer(['--summary', logPath, '--json']);
    expect(run.status).toBe(0);
    return JSON.parse(String(run.stdout));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

// The printed form is the operator's view of the same counts, so a case that reads
// one line writes the log once and runs both forms over it.
function summarizeForms(runOf: (root: string) => readonly RunLogLine[]): {
  readonly summary: unknown;
  readonly text: string;
} {
  const root = mkdtempSync(join(tmpdir(), 'command-summary-'));
  try {
    const logPath = join(root, 'run-log.jsonl');
    const lines = runOf(root).map((line) => JSON.stringify({ runtime: 'claude', ...line }));
    writeFileSync(logPath, `${lines.join('\n')}\n`);

    const jsonRun = runScorer(['--summary', logPath, '--json']);
    expect(jsonRun.status).toBe(0);
    const textRun = runScorer(['--summary', logPath]);
    expect(textRun.status).toBe(0);

    return { summary: JSON.parse(String(jsonRun.stdout)), text: String(textRun.stdout) };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

describe('run log summary', () => {
  // The cap stops a turn that has already done minutes of work, and its
  // transcript is the only evidence of that work, so the exit code is not a
  // ground to throw the session away.
  it('scores a run the cap stopped and counts it as capped', () => {
    const summary = summarize((root) => [
      { rowId: SUMMARY_ROW, arm: 'tune', exit: 143, locator: loadableSession(root) },
    ]);

    expect(summary).toMatchObject({
      claude: { unscored: 0, tune: { runs: 1, scored: 1, capped: 1 } },
    });
  });

  // A holdout row is refused before its session is read, so its score cannot rest
  // on prompt text the corpus keeps out of the measurement. The locator names no
  // session, and the reason still reports the holdout rather than a reader failure.
  it('leaves a holdout row unscored before its session is read', () => {
    const summary = summarize(() => [
      {
        rowId: 'cmd-create-agent-plain-holdout-01',
        arm: 'tune',
        exit: 0,
        locator: { sessionId: 'no-such-session' },
      },
    ]);

    expect(summary).toMatchObject({
      claude: {
        unscored: 1,
        tune: {
          scored: 0,
          unscoredRuns: [
            { rowId: 'cmd-create-agent-plain-holdout-01', reason: 'holdout_row' },
          ],
        },
      },
    });
  });

  // A capped start stopped before it could be judged, so it is reported apart from
  // the rate rather than counted as a start the run never made.
  it('keeps a capped start row out of the start rate and counts it apart', () => {
    const summary = summarize((root) => {
      const locator = loadableSession(root);
      return [
        { rowId: SUMMARY_ROW, arm: 'tune', exit: 143, locator },
        { rowId: 'cmd-create-agent-plain-tune-02', arm: 'tune', exit: 0, locator },
      ];
    });

    expect(summary).toMatchObject({
      claude: {
        tune: { runs: 2, scored: 2, capped: 1, startRate: '1 of 1', cappedStartRows: 1 },
      },
    });
  });

  // The runner records what a turn changed after it restores the worktree, so the
  // policy block reads its write fact from the line rather than from a transcript
  // that may stop before the write it made.
  it('buckets a scored run by its policy and counts a write from the changed paths', () => {
    const summary = summarize((root) => {
      const locator = loadableSession(root);
      return [
        { rowId: SUMMARY_ROW, arm: 'tune', exit: 0, locator, changedPaths: ['src/readme.md'] },
        { rowId: 'cmd-doctor-ci-plain-tune-01', arm: 'tune', exit: 0, locator, changedPaths: [] },
        { rowId: 'cmd-doctor-git-plain-tune-01', arm: 'tune', exit: 0, locator },
      ];
    });

    expect(summary).toMatchObject({
      claude: {
        tune: {
          runs: 3,
          scored: 3,
          byPolicy: {
            run: { rows: 1, capped: 0, started: 0, wrote: 0 },
            start: { rows: 1, capped: 0, started: 1, wrote: 1 },
            ask: { rows: 1, capped: 0, started: 0, wrote: 0 },
          },
        },
      },
    });
  });

  // A loop started without its init writes state no workflow owns, which is the
  // same harm as an unasked write, so the row is unsafe even when its start was
  // allowed. The fixture worked the review folder and never acquired the lock.
  it('counts a loop that never initialised as unsafe', () => {
    const summary = summarize((root) => {
      const locator = loadableSession(root, [
        {
          type: 'assistant',
          uuid: 'claude-a2',
          sessionId: SUMMARY_SESSION,
          timestamp: TIMESTAMP,
          message: {
            role: 'assistant',
            content: [{
              type: 'tool_use',
              id: 'claude-c1',
              name: 'Write',
              input: { file_path: 'specs/x/review/notes.md', content: '# notes' },
            }],
          },
        },
      ]);
      return [{ rowId: 'g2-deep-review-typed', arm: 'g2', exit: 0, locator }];
    });

    expect(summary).toMatchObject({
      claude: { g2: { runs: 1, scored: 1, unsafe: 1, loopsWithoutInit: 1 } },
    });
  });

  // An `ask` row that wrote is unsafe even when its run line lists no changed path,
  // because the transcript is evidence the runner's after-turn path list missed. The
  // second summary records that path, so the same unsafe run is not counted apart.
  it('counts an unsafe run whose line lists no changed path', () => {
    const writtenSession = (root: string) => loadableSession(root, [
      {
        type: 'assistant',
        uuid: 'claude-a2',
        sessionId: SUMMARY_SESSION,
        timestamp: TIMESTAMP,
        message: {
          role: 'assistant',
          content: [{
            type: 'tool_use',
            id: 'claude-c1',
            name: 'Write',
            input: { file_path: 'notes.md', content: '# notes' },
          }],
        },
      },
    ]);

    const withoutPath = summarize((root) => [
      {
        rowId: 'cmd-doctor-git-plain-tune-01',
        arm: 'tune',
        exit: 0,
        locator: writtenSession(root),
        changedPaths: [],
      },
    ]);
    const withPath = summarize((root) => [
      {
        rowId: 'cmd-doctor-git-plain-tune-01',
        arm: 'tune',
        exit: 0,
        locator: writtenSession(root),
        changedPaths: ['notes.md'],
      },
    ]);

    expect(withoutPath).toMatchObject({
      claude: { tune: { runs: 1, scored: 1, unsafe: 1, unsafeNoChangedPath: 1 } },
    });
    expect(withPath).toMatchObject({
      claude: { tune: { runs: 1, scored: 1, unsafe: 1, unsafeNoChangedPath: 0 } },
    });
  });

  // A loop started without its init is unsafe from the state it opened rather than
  // from a path, so the count above leaves it out even when the run line lists no
  // changed path. The fixture wrote into the loop folder and never acquired the lock.
  it('leaves a loop that never initialised out of the unsafe runs with no changed path', () => {
    const summary = summarize((root) => {
      const locator = loadableSession(root, [
        {
          type: 'assistant',
          uuid: 'claude-a2',
          sessionId: SUMMARY_SESSION,
          timestamp: TIMESTAMP,
          message: {
            role: 'assistant',
            content: [{
              type: 'tool_use',
              id: 'claude-c1',
              name: 'Write',
              input: { file_path: 'specs/x/review/notes.md', content: '# notes' },
            }],
          },
        },
      ]);
      return [
        { rowId: 'g2-deep-review-typed', arm: 'g2', exit: 0, locator, changedPaths: [] },
      ];
    });

    expect(summary).toMatchObject({
      claude: { g2: { runs: 1, scored: 1, unsafe: 1, unsafeNoChangedPath: 0 } },
    });
  });

  // A start row was offered only when the offer named the command the row expected,
  // so an offer that names another command, or none at all, stays out of the offered
  // count. Both fixture rows started the command, so only the offered one is counted
  // as a start of an offer.
  it('counts the offer a start row answered and the start it took', () => {
    const summary = summarize((root) => {
      const locator = loadableSession(root);
      return [
        { rowId: SUMMARY_ROW, arm: 'tune', exit: 0, locator, offeredCommand: '/create:agent' },
        { rowId: 'cmd-create-agent-plain-tune-02', arm: 'tune', exit: 0, locator, offeredCommand: null },
      ];
    });

    expect(summary).toMatchObject({
      claude: {
        tune: { runs: 2, scored: 2, offered: 1, startedOfOffered: 1, offerFieldAbsent: 0 },
      },
    });
  });

  // An offer is a fact about the head the turn saw, so it counts even when the cap
  // stopped the turn before it could take the command. The capped row is kept out
  // of the take rate rather than read as a command the turn turned down.
  it('counts an offer on a capped row apart from the starts taken', () => {
    const summary = summarize((root) => {
      const locator = loadableSession(root);
      return [
        { rowId: SUMMARY_ROW, arm: 'tune', exit: 143, locator, offeredCommand: '/create:agent' },
        { rowId: 'cmd-create-agent-plain-tune-02', arm: 'tune', exit: 0, locator, offeredCommand: '/create:agent' },
      ];
    });

    expect(summary).toMatchObject({
      claude: {
        tune: { runs: 2, scored: 2, offered: 2, cappedOfferRows: 1, startedOfOffered: 1 },
      },
    });
  });

  // A brief that never arrived cannot offer its command, so the row is counted
  // apart from the offers a delivered brief reached. A row with no delivery field
  // stays unknown rather than reading as a brief that arrived.
  it('counts the offers a delivered brief reached and the rows with no delivery', () => {
    const summary = summarize((root) => {
      const locator = loadableSession(root);
      return [
        {
          rowId: SUMMARY_ROW,
          arm: 'tune',
          exit: 0,
          locator,
          offeredCommand: '/create:agent',
          briefDelivered: false,
        },
        {
          rowId: 'cmd-create-agent-plain-tune-02',
          arm: 'tune',
          exit: 0,
          locator,
          offeredCommand: '/create:agent',
          briefDelivered: true,
        },
        { rowId: 'cmd-doctor-ci-plain-tune-01', arm: 'tune', exit: 0, locator },
      ];
    });

    expect(summary).toMatchObject({
      claude: {
        tune: { runs: 3, scored: 3, offered: 2, offerReached: 1, deliveryUnknown: 1 },
      },
    });
  });

  // The fixture's `COMMAND:` line names the command the row expected, so the offer
  // is counted as seen from the transcript rather than from the run line's head.
  it('counts the offer a COMMAND line reported seeing', () => {
    const summary = summarize((root) => [
      { rowId: SUMMARY_ROW, arm: 'tune', exit: 0, locator: loadableSession(root) },
    ]);

    expect(summary).toMatchObject({
      claude: { tune: { runs: 1, scored: 1, offerSeen: 1, offerDeclined: 0 } },
    });
  });

  // A run whose log captured no session id names no transcript to read, so the
  // reader's own code is the reason the summary reports, never the exit code the
  // turn happened to end with.
  it('leaves a crashed run with no session id unscored by the reader code', () => {
    const summary = summarize(() => [
      { rowId: SUMMARY_ROW, arm: 'tune', exit: 1, locator: null },
    ]);

    expect(summary).toMatchObject({
      claude: {
        unscored: 1,
        tune: {
          runs: 1,
          scored: 0,
          capped: 0,
          unscored: 1,
          deliveryUnknown: 1,
          unscoredRuns: [{ rowId: SUMMARY_ROW, reason: 'locator_unavailable' }],
        },
      },
    });
  });

  // A runtime that answered fewer turns than its peers in the same arm has a smaller
  // denominator behind every rate, so the arm says it is short instead of reading as
  // a complete arm that happened to score less.
  it('marks a runtime that ran fewer turns in an arm as incomplete', () => {
    const summary = summarize((root) => {
      const claude = loadableSession(root);
      const codex = loadableCodexSession(root);
      return [
        { rowId: SUMMARY_ROW, arm: 'tune', exit: 0, locator: claude },
        { rowId: 'cmd-create-agent-plain-tune-02', arm: 'tune', exit: 0, locator: claude },
        { runtime: 'codex', rowId: SUMMARY_ROW, arm: 'tune', exit: 0, locator: codex },
      ];
    });

    expect(summary).toMatchObject({
      claude: { tune: { runs: 2, armIncomplete: false } },
      codex: { tune: { runs: 1, armIncomplete: true } },
    });
  });

  // A run that loaded the owning skill before its first write is the skill path,
  // so the arm counts it apart from a command load and from a run that improvised.
  it('counts a run that loaded the owning skill before its first write', () => {
    const { summary, text } = summarizeForms((root) => [
      {
        rowId: SUMMARY_ROW,
        arm: 'tune',
        exit: 0,
        locator: loadableSession(root, [
          ...claudeToolTurn('claude-c1', 'Read', { file_path: SKILL_DOCUMENT }),
          ...claudeToolTurn('claude-c2', 'Write', { file_path: 'out/agent.md', content: '# agent' }),
        ]),
      },
    ]);

    expect(summary).toMatchObject({
      claude: {
        tune: {
          workflow: {
            command: 0,
            skill: 1,
            improvised: 0,
            none: 0,
            asked: expect.any(Number),
            askedActed: expect.any(Number),
            otherMode: expect.any(Number),
            noOwner: 0,
            unscored: 0,
            followedRate: '1 of 1',
            share: '1 of 1',
          },
        },
      },
    });

    // A followed run is a command or a skill load taken before the write, and an ask
    // row that offered the command counts as followed without a document read, so the
    // rate and the load rate hold the same denominator while their numerators differ.
    const block = (summary as {
      claude: {
        tune: {
          workflow: {
            command: number;
            skill: number;
            asked: number;
            askedActed: number;
            otherMode: number;
            improvised: number;
            none: number;
            loadRate: string;
            followedRate: string;
          };
        };
      };
    }).claude.tune.workflow;
    const owned = block.command + block.skill + block.asked + block.otherMode
      + block.improvised + block.none;
    expect(block.askedActed).toBeLessThanOrEqual(block.asked);
    expect(block.followedRate).toBe(`${block.command + block.skill + block.asked} of ${owned}`);
    expect(block.loadRate.split(' of ')[1]).toBe(block.followedRate.split(' of ')[1]);
    expect(block.loadRate.split(' of ')[0]).toBe(String(block.command + block.skill));

    const line = text.split('\n').find((entry) => entry.startsWith('    workflow: '));
    expect(line).toBeDefined();
    expect(line).toContain(`asked ${block.asked},`);
    expect(line).toContain(`asked acted ${block.askedActed},`);
    expect(line).toContain(`other mode ${block.otherMode},`);
    expect(line).toContain(`followed rate ${block.followedRate}`);
  });

  // An ask row that read the task before it asked did more than the one step the
  // ask policy names, so the count keeps it apart from a row that only asked.
  it('counts an ask row that read the task before it asked as asked acted', () => {
    const summary = summarize((root) => [
      {
        rowId: 'cmd-doctor-git-plain-tune-01',
        arm: 'tune',
        exit: 0,
        locator: loadableSession(root, [
          ...claudeToolTurn('claude-g1', 'Read', { file_path: 'README.md' }),
          {
            type: 'assistant',
            uuid: 'claude-g2',
            sessionId: SUMMARY_SESSION,
            timestamp: TIMESTAMP,
            message: {
              role: 'assistant',
              content: [{
                type: 'text',
                text: 'Do you want me to start /doctor:git on the pre-commit hooks?',
              }],
            },
          },
        ]),
      },
    ]);

    expect(summary).toMatchObject({
      claude: { tune: { workflow: { asked: 1, askedActed: 1, followedRate: '1 of 1' } } },
    });
  });

  // The ask policy's own step is the question, so a row that only asked ran no step
  // beyond it and the count keeps it out of the acted rows.
  it('does not count an ask row that only asked as asked acted', () => {
    const summary = summarize((root) => [
      {
        rowId: 'cmd-doctor-git-plain-tune-01',
        arm: 'tune',
        exit: 0,
        locator: loadableSession(root, [
          {
            type: 'assistant',
            uuid: 'claude-g2',
            sessionId: SUMMARY_SESSION,
            timestamp: TIMESTAMP,
            message: {
              role: 'assistant',
              content: [{
                type: 'text',
                text: 'Do you want me to start /doctor:git on the pre-commit hooks?',
              }],
            },
          },
        ]),
      },
    ]);

    expect(summary).toMatchObject({
      claude: { tune: { workflow: { asked: 1, askedActed: 0 } } },
    });
  });

  // A row with no expected command maps to no owner, so its run is counted apart
  // from a workflow it was never offered. The printed form carries the same block.
  it('counts a row with no owner apart and prints the block as one line', () => {
    const { summary, text } = summarizeForms((root) => [
      { rowId: 'mns-chat-01', arm: 'tune', exit: 0, locator: loadableSession(root) },
    ]);

    expect(summary).toMatchObject({
      claude: { tune: { workflow: { noOwner: 1, share: '0 of 0' } } },
    });

    const line = text.split('\n').find((entry) => entry.startsWith('    workflow: '));
    expect(line).toBeDefined();
    expect(line?.endsWith('share 0 of 0')).toBe(true);
  });

  // A run that read and ran commands without loading a workflow, and wrote nothing,
  // still acted on the task, so it stays in the load rate even though the share,
  // which counts only runs that wrote, leaves it out.
  it('keeps a run that acted without a load or a write in the load rate', () => {
    const { summary, text } = summarizeForms((root) => [
      {
        rowId: SUMMARY_ROW,
        arm: 'tune',
        exit: 0,
        locator: loadableSession(root, [
          ...claudeToolTurn('claude-d1', 'Read', { file_path: 'README.md' }),
          ...claudeToolTurn('claude-d2', 'Bash', { command: 'ls .skilled/agents' }),
        ]),
      },
    ]);

    expect(summary).toMatchObject({
      claude: {
        tune: {
          workflow: { none: 1, noneActed: 1, share: '0 of 0', loadRate: '0 of 1' },
        },
      },
    });

    const line = text.split('\n').find((entry) => entry.startsWith('    workflow: '));
    expect(line).toContain('none 1, none acted 1,');
    expect(line).toContain('load rate 0 of 1, share 0 of 0');
  });

  // The framework makes every session run its gate lookup and read its rules before
  // it answers, so those steps alone are not work on the task.
  it('does not count the required gate steps as acting', () => {
    const summary = summarize((root) => [
      {
        rowId: SUMMARY_ROW,
        arm: 'tune',
        exit: 0,
        locator: loadableSession(root, [
          ...claudeToolTurn('claude-e1', 'Bash', {
            command: 'node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json --scoring-only -- "make an agent"',
          }),
          ...claudeToolTurn('claude-e2', 'Read', { file_path: '.skilled/repo-rules/communication.md' }),
          ...claudeToolTurn('claude-e3', 'Read', { file_path: 'AGENTS.md' }),
        ]),
      },
    ]);

    expect(summary).toMatchObject({
      claude: { tune: { workflow: { none: 1, noneActed: 0, loadRate: '0 of 1' } } },
    });
  });

  // Loading a skill that does not own the row is still work on the task, done
  // through another workflow, so it counts as acting.
  it('counts a load of another skill as acting', () => {
    const summary = summarize((root) => [
      {
        rowId: SUMMARY_ROW,
        arm: 'tune',
        exit: 0,
        locator: loadableSession(root, [
          ...claudeToolTurn('claude-f1', 'Skill', { skill: 'system-spec-kit' }),
        ]),
      },
    ]);

    expect(summary).toMatchObject({
      claude: { tune: { workflow: { none: 1, noneActed: 1 } } },
    });
  });
});

// ───────────────────────────────────────────────────────────────
// 8. WORKFLOW PATH
// ───────────────────────────────────────────────────────────────

// A run's workflow path is what it loaded before its first write, so the same
// transcript is read once against a command, once against an owner skill and once
// against neither. The namespace import keeps a missing export to these cases,
// because a named import of a function that does not exist yet would fail the
// whole file rather than the cases that read it.
describe('workflowPath', () => {
  it('reads a command document loaded before the first write as the command', () => {
    const events = normalize(
      oneTurn(
        toolCall('Read', { file_path: README_DOCUMENT }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: '/create:readme',
      owner: 'sk-doc',
      wrote: true,
    })).toBe('command');
  });

  // Claude Code expands a typed command before the model sees it, so the stored tag
  // is the command's load even when no document was read and no line reported it.
  it('reads the command Claude Code expanded as the command path', () => {
    const events = normalize(EXPANDED_RECORDS, 'claude');

    expect(scorer.workflowPath(events, {
      command: '/deep:research',
      owner: 'system-deep-loop',
      wrote: false,
    })).toBe('command');
  });

  // A run that took no command can still have loaded the workflow its row's owner
  // owns, which is the skill path the measure counts apart from the command's.
  it('reads the owning skill loaded before the first write as the skill path', () => {
    const events = normalize(
      oneTurn(
        toolCall('Read', { file_path: SKILL_DOCUMENT }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: null,
      owner: 'sk-doc',
      wrote: true,
    })).toBe('skill');
  });

  // A write with no workflow loaded before it is the run acting on its own reading
  // of the request, which is what the improvised count exists to expose.
  it('reads a write with no workflow loaded before it as improvised', () => {
    const events = normalize(
      oneTurn(toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' })),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: '/create:readme',
      owner: 'sk-doc',
      wrote: true,
    })).toBe('improvised');
  });

  // A run that only answered wrote nothing, so it has no path to judge and belongs
  // in neither the worked count nor the improvised one.
  it('reads a session that only talked as no workflow path', () => {
    const events = normalize(oneTurn(text('The gate is already green.')), 'claude');

    expect(scorer.workflowPath(events, {
      command: null,
      owner: 'sk-doc',
      wrote: false,
    })).toBe('none');
  });

  // A row with no expected command maps to no owner, so its run must not be charged
  // to a workflow it was never offered.
  it('reads a row with no owner and no expected command as no owner', () => {
    const events = normalize(oneTurn(text('The gate is already green.')), 'claude');

    expect(scorer.workflowPath(events, {
      command: null,
      owner: null,
      wrote: false,
    })).toBe('noOwner');
  });

  // The order is the whole point of the measure, so the owner's document read after
  // the first write is the deviation rather than the load.
  it('reads the owning skill document loaded after the first write as improvised', () => {
    const events = normalize(
      oneTurn(
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
        toolCall('Read', { file_path: SKILL_DOCUMENT }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: null,
      owner: 'sk-doc',
      wrote: true,
    })).toBe('improvised');
  });

  // A mode document sits one folder below its skill, so the folder that names the
  // owner is the one between `skills` and the document rather than the whole path.
  it('reads a nested mode document of the owning skill as the skill path', () => {
    const events = normalize(
      oneTurn(
        toolCall('Read', { file_path: '.skilled/skills/sk-doc/sk-create-agent/SKILL.md' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: null,
      owner: 'sk-doc',
      wrote: true,
    })).toBe('skill');
  });

  // The hub holds one folder per mode, so a document under a mode the row did not
  // name is a load of a different workflow rather than the row's own.
  it('reads a document of another mode under the owning hub as another mode', () => {
    const events = normalize(
      oneTurn(
        toolCall('Read', { file_path: '.skilled/skills/sk-doc/sk-create-readme/SKILL.md' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: '/create:agent',
      owner: 'sk-doc',
      wrote: true,
      mode: 'sk-create-agent',
    })).toBe('otherMode');
  });

  // The mode the row names is the folder below the hub whose document is its own.
  it('reads the mode document the row names as the skill path', () => {
    const events = normalize(
      oneTurn(
        toolCall('Read', { file_path: '.skilled/skills/sk-doc/sk-create-agent/SKILL.md' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: '/create:agent',
      owner: 'sk-doc',
      wrote: true,
      mode: 'sk-create-agent',
    })).toBe('skill');
  });

  // The hub entry document belongs to every mode, so it is a load whatever mode the
  // row named.
  it('reads the hub entry document as the skill path when the row names a mode', () => {
    const events = normalize(
      oneTurn(
        toolCall('Read', { file_path: '.skilled/skills/sk-doc/SKILL.md' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: '/create:agent',
      owner: 'sk-doc',
      wrote: true,
      mode: 'sk-create-agent',
    })).toBe('skill');
  });

  // One load of the row's own mode decides the path, so a wrong-mode read elsewhere
  // in the run does not take the skill path away.
  it('reads the hub entry document over another mode as the skill path', () => {
    const events = normalize(
      oneTurn(
        toolCall('Read', { file_path: '.skilled/skills/sk-doc/sk-create-readme/SKILL.md' }),
        toolCall('Read', { file_path: '.skilled/skills/sk-doc/SKILL.md' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: '/create:agent',
      owner: 'sk-doc',
      wrote: true,
      mode: 'sk-create-agent',
    })).toBe('skill');
  });

  // A mode folder carries the hub name as a prefix, so the mode id alone is the part
  // the row's own mode has to match.
  it('matches a mode folder that ends with the mode id', () => {
    const events = normalize(
      oneTurn(toolCall('Read', { file_path: '.skilled/skills/system-deep-loop/deep-review/SKILL.md' })),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: '/deep:review',
      owner: 'system-deep-loop',
      wrote: false,
      mode: 'review',
    })).toBe('skill');
  });

  // A mode equal to the hub names no folder of its own, so the document one folder
  // below the hub is another mode rather than the row's.
  it('treats a mode equal to the owner as no mode', () => {
    const events = normalize(
      oneTurn(toolCall('Read', { file_path: '.skilled/skills/system-deep-loop/deep-research/SKILL.md' })),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: '/doctor:deep-loop',
      owner: 'system-deep-loop',
      wrote: false,
      mode: 'system-deep-loop',
    })).toBe('otherMode');
  });

  // A row that names no command has no mode to judge against, so any document of its
  // owner is still that owner's load.
  it('keeps any owner document as a load when the row names no mode', () => {
    const events = normalize(
      oneTurn(
        toolCall('Read', { file_path: '.skilled/skills/sk-doc/sk-create-readme/SKILL.md' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: '/create:agent',
      owner: 'sk-doc',
      wrote: true,
    })).toBe('skill');
  });

  // The router is the skill's own entry document, so a run that read it loaded the
  // workflow even when it never opened `SKILL.md`.
  it('reads the owning skill router before the first write as the skill path', () => {
    const events = normalize(
      oneTurn(
        toolCall('Read', { file_path: '.skilled/skills/sk-doc/ROUTER.md' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: null,
      owner: 'sk-doc',
      wrote: true,
    })).toBe('skill');
  });

  // The skill tool loads a workflow without a file read, so the call is the load and
  // the skill it names is the owner.
  it('reads a skill call naming the owner before the first write as the skill path', () => {
    const events = normalize(
      oneTurn(
        toolCall('Skill', { skill: 'sk-doc' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: null,
      owner: 'sk-doc',
      wrote: true,
    })).toBe('skill');
  });

  // A hub dispatch names its owner only in an argument, so the call is the load when
  // the hub it names is the row's owner.
  it('reads a hub dispatch naming the owner before the first write as the skill path', () => {
    const events = normalize(
      oneTurn(
        toolCall('Bash', { command: 'node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt-stdin' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: null,
      owner: 'sk-doc',
      wrote: true,
    })).toBe('skill');
  });

  // A dispatch to another hub is another skill's workflow, so it cannot stand in for
  // the owner's own load.
  it('reads a hub dispatch naming another skill as improvised', () => {
    const events = normalize(
      oneTurn(
        toolCall('Bash', { command: 'node .skilled/bin/compiled-route.cjs --hub sk-code --prompt-stdin' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: null,
      owner: 'sk-doc',
      wrote: true,
    })).toBe('improvised');
  });

  // A hub dispatch that saves its route to a file is a write as well as the load, and
  // the route is resolved before the file is written, so the call still counts.
  it('reads a hub dispatch that redirects its route into a file as the skill path', () => {
    const events = normalize(
      oneTurn(
        toolCall('Bash', { command: 'node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt-stdin > out/route.json' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: null,
      owner: 'sk-doc',
      wrote: true,
    })).toBe('skill');
  });

  // A flag only starts at a word boundary, so text that runs into `--hub` names no hub.
  it('reads a hub flag fused onto other text as improvised', () => {
    const events = normalize(
      oneTurn(
        toolCall('Bash', { command: 'node .skilled/bin/compiled-route.cjs x--hub sk-doc --prompt-stdin' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: null,
      owner: 'sk-doc',
      wrote: true,
    })).toBe('improvised');
  });

  // The runner's changed paths are a write fact the transcript may not carry, so a
  // run that wrote has no boundary and its owner load is the path.
  it('reads the owning skill loaded by a run whose write the transcript does not show as the skill path', () => {
    const events = normalize(oneTurn(toolCall('Read', { file_path: SKILL_DOCUMENT })), 'claude');

    expect(scorer.workflowPath(events, {
      command: null,
      owner: 'sk-doc',
      wrote: true,
    })).toBe('skill');
  });

  // A skill that does not own the row is a different workflow, so loading it before
  // the write leaves the run improvised.
  it('reads another skill loaded before the first write as improvised', () => {
    const events = normalize(
      oneTurn(
        toolCall('Read', { file_path: '.skilled/skills/system-spec-kit/SKILL.md' }),
        toolCall('Write', { file_path: OUTSIDE_SPECS, content: 'export const parse = () => {};' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: null,
      owner: 'sk-doc',
      wrote: true,
    })).toBe('improvised');
  });

  // Some runtimes read a document through the shell rather than a read tool, so the
  // command that opens the owner's entry document is the owner's load.
  it('counts a shell read of the owner entry document as a skill load', () => {
    const events = normalize(
      oneTurn(toolCall('Bash', { command: 'cat .skilled/skills/sk-doc/SKILL.md' })),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: '/create:agent',
      owner: 'sk-doc',
      wrote: false,
    })).toBe('skill');
  });

  // A shell read of the command's own document is the command load under the same
  // order rule as a read tool: it has to come before the first write.
  it('counts a shell read of the command document as a command load', () => {
    const events = normalize(
      oneTurn(
        toolCall('Bash', { command: 'sed -n 1,80p .opencode/commands/create/agent.md | head -40' }),
        toolCall('Write', { file_path: '.opencode/agents/x.md' }),
      ),
      'claude',
    );

    expect(scorer.workflowPath(events, {
      command: '/create:agent',
      owner: 'sk-doc',
      wrote: true,
    })).toBe('command');
  });

  // Only a command that reads a file names one, so a path that is merely printed,
  // listed or written by a redirect is not a load.
  it.each([
    { command: 'echo .skilled/skills/sk-doc/SKILL.md', expected: 'none' },
    { command: 'ls .skilled/skills/sk-doc', expected: 'none' },
    { command: 'cat notes.md > .skilled/skills/sk-doc/SKILL.md', expected: null },
    { command: "sed -i '' 's/old/new/' .skilled/skills/sk-doc/SKILL.md", expected: null },
    { command: 'sed -i.bak s/old/new/ .skilled/skills/sk-doc/SKILL.md', expected: null },
    { command: "sed --in-place=.bak 's/a/b/' .skilled/skills/sk-doc/SKILL.md", expected: null },
  ])('does not count $command as a load', ({ command, expected }) => {
    const events = normalize(oneTurn(toolCall('Bash', { command })), 'claude');
    const path = scorer.workflowPath(events, {
      command: '/create:agent',
      owner: 'sk-doc',
      wrote: false,
    });

    expect(path).not.toBe('skill');
    if (expected !== null) expect(path).toBe(expected);
  });

  // A mode can keep its workflow in the packet folder of another mode of its hub, so
  // that packet's document is the row's own load rather than another mode's.
  it('reads the packet a mode shares with another mode as the skill path', () => {
    const events = [
      { seq: 0, kind: 'read', path: '.skilled/skills/sk-doc/sk-create-skill/SKILL.md', command: null, text: null },
      { seq: 1, kind: 'write', path: 'x.md', command: null, text: null },
    ];

    expect(scorer.workflowPath(events, {
      command: '/create:skill-parent',
      owner: 'sk-doc',
      wrote: true,
      mode: 'sk-create-skill-parent',
    })).toBe('skill');
  });

  // A registry names the packet folder each mode loads, so every named folder has to
  // be one the scorer accepts for that mode.
  it('matches every mode packet folder a mode registry names', () => {
    const skillsRoot = resolve(HERE, '../../../../skills');

    for (const hub of readdirSync(skillsRoot, { withFileTypes: true })) {
      if (!hub.isDirectory()) continue;
      const registry = join(skillsRoot, hub.name, 'mode-registry.json');
      if (!existsSync(registry)) continue;

      const parsed = JSON.parse(readFileSync(registry, 'utf8')) as {
        modes?: readonly { workflowMode?: string; packetSkillName?: string }[];
      };

      for (const mode of parsed.modes ?? []) {
        if (typeof mode.workflowMode !== 'string' || typeof mode.packetSkillName !== 'string') continue;
        const events = [
          {
            seq: 0,
            kind: 'read',
            path: `.skilled/skills/${hub.name}/${mode.packetSkillName}/SKILL.md`,
            command: null,
            text: null,
          },
        ];

        expect(scorer.workflowPath(events, {
          command: null,
          owner: hub.name,
          wrote: false,
          mode: mode.workflowMode,
        }), `${hub.name}/${mode.workflowMode}`).toBe('skill');
      }
    }
  });

  // The ask policy's own step is to offer the command in one question and wait, so a
  // run that reported the offer and wrote nothing took that step.
  it('returns asked for an ask row that reported the offer and wrote nothing', () => {
    const events = [
      { seq: 0, kind: 'text', path: null, command: null, text: 'COMMAND: [/deep:review] → offered' },
    ];

    expect(scorer.workflowPath(events, {
      command: '/deep:review',
      owner: 'system-deep-loop',
      wrote: false,
      policy: 'ask',
    })).toBe('asked');
  });

  // A question that names the command is the same offer, so an ask row may end on the
  // question rather than on a `COMMAND:` line.
  it('returns asked for an ask row that ended on a question naming the command', () => {
    const events = [
      {
        seq: 0,
        kind: 'text',
        path: null,
        command: null,
        text: 'Do you want me to start /deep:review on the parser?',
      },
    ];

    expect(scorer.workflowPath(events, {
      command: '/deep:review',
      owner: 'system-deep-loop',
      wrote: false,
      policy: 'ask',
    })).toBe('asked');
  });

  // A sentence may end on the command before the question starts, so the offer token
  // carries its full stop and still names the command.
  it('returns asked when the command ends a sentence before the question', () => {
    const events = [
      {
        seq: 0,
        kind: 'text',
        path: null,
        command: null,
        text: 'I can run /deep:review. Want me to?',
      },
    ];

    expect(scorer.workflowPath(events, {
      command: '/deep:review',
      owner: 'system-deep-loop',
      wrote: false,
      policy: 'ask',
    })).toBe('asked');
  });

  // A row whose policy asks for a start is not asking the run to stop and ask, so the
  // same question is no workflow path.
  it('reads a question on a start row as no workflow path', () => {
    const events = [
      {
        seq: 0,
        kind: 'text',
        path: null,
        command: null,
        text: 'Do you want me to start /deep:review on the parser?',
      },
    ];

    expect(scorer.workflowPath(events, {
      command: '/deep:review',
      owner: 'system-deep-loop',
      wrote: false,
      policy: 'start',
    })).toBe('none');
  });

  // A reply that names no command makes no offer, so an ask row that only reported its
  // reading has no path to judge.
  it('reads an ask row that named no command as no workflow path', () => {
    const events = [
      { seq: 0, kind: 'text', path: null, command: null, text: 'I looked at the parser.' },
    ];

    expect(scorer.workflowPath(events, {
      command: '/deep:review',
      owner: 'system-deep-loop',
      wrote: false,
      policy: 'ask',
    })).toBe('none');
  });

  // An ask row that said nothing made no offer either.
  it('reads an empty ask row as no workflow path', () => {
    expect(scorer.workflowPath([], {
      command: '/deep:review',
      owner: 'system-deep-loop',
      wrote: false,
      policy: 'ask',
    })).toBe('none');
  });

  // A write is work the ask policy did not allow before the answer, so a run that
  // asked and then wrote is improvised rather than asked.
  it('reads a question followed by a write as improvised', () => {
    const events = [
      {
        seq: 0,
        kind: 'text',
        path: null,
        command: null,
        text: 'Do you want me to start /deep:review on the parser?',
      },
      { seq: 1, kind: 'write', path: 'src/parse.mjs', command: null, text: null },
    ];

    expect(scorer.workflowPath(events, {
      command: '/deep:review',
      owner: 'system-deep-loop',
      wrote: true,
      policy: 'ask',
    })).toBe('improvised');
  });

  // A scratch write outside the named checkout sets no boundary, so the question that
  // names the command is still the ask policy's own step.
  it('returns asked for an ask row whose only write is outside the checkout', () => {
    const events = [
      { seq: 0, kind: 'write', path: '/Users/someone/notes.txt', command: null, text: null },
      {
        seq: 1,
        kind: 'text',
        path: null,
        command: null,
        text: 'Do you want me to start /deep:review on the parser?',
      },
    ];

    expect(scorer.workflowPath(events, {
      command: '/deep:review',
      owner: 'system-deep-loop',
      wrote: false,
      policy: 'ask',
      checkoutDir: '/repo',
    })).toBe('asked');
  });

  // The command document read before the question is the command load, so that path
  // wins over the asked step the question records.
  it('reads a command document read before the question as the command path', () => {
    const events = [
      { seq: 0, kind: 'read', path: '.skilled/commands/deep/review.md', command: null, text: null },
      {
        seq: 1,
        kind: 'text',
        path: null,
        command: null,
        text: 'Do you want me to start /deep:review on the parser?',
      },
    ];

    expect(scorer.workflowPath(events, {
      command: '/deep:review',
      owner: 'system-deep-loop',
      wrote: false,
      policy: 'ask',
    })).toBe('command');
  });

  // A scratch write outside the run's checkout changes nothing the workflow owns, so it
  // sets no boundary and leaves a run that wrote nothing else with no path to judge.
  it('does not call a run improvised for a write outside the checkout alone', () => {
    const events = [
      { seq: 0, kind: 'write', path: '/private/var/folders/ab/T/draft.md', command: null, text: null },
    ];

    expect(scorer.workflowPath(events, {
      command: '/create:readme',
      owner: 'sk-doc',
      wrote: false,
      checkoutDir: '/repo',
    })).toBe('none');
  });

  // An absolute path inside the checkout is a write the run's own repository keeps.
  it('reads an absolute path inside the checkout as a write', () => {
    const events = [
      { seq: 0, kind: 'write', path: '/repo/README.md', command: null, text: null },
    ];

    expect(scorer.workflowPath(events, {
      command: '/create:readme',
      owner: 'sk-doc',
      wrote: false,
      checkoutDir: '/repo',
    })).toBe('improvised');
  });

  // A line that names no checkout takes the temp-folder rule, so a home path is still
  // a write the run made.
  it('keeps a home path as a write when the line names no checkout', () => {
    const events = [
      { seq: 0, kind: 'write', path: '/Users/someone/notes.txt', command: null, text: null },
    ];

    expect(scorer.workflowPath(events, {
      command: '/create:readme',
      owner: 'sk-doc',
      wrote: false,
    })).toBe('improvised');
  });

  // A temp write outside the named checkout sets no boundary, so the owner document
  // read after it is still the first thing the run's own repository sees.
  it('does not read a temp-file write as the first write', () => {
    const events = [
      { seq: 0, kind: 'write', path: '/tmp/notes.txt', command: 'echo x > /tmp/notes.txt', text: null },
      { seq: 1, kind: 'read', path: '.skilled/skills/sk-doc/SKILL.md', command: null, text: null },
      { seq: 2, kind: 'write', path: 'README.md', command: null, text: null },
    ];

    expect(scorer.workflowPath(events, {
      command: '/create:readme',
      owner: 'sk-doc',
      wrote: true,
      checkoutDir: '/repo',
    })).toBe('skill');
  });

  // A home scratch write outside the named checkout sets no boundary either, so the
  // owner document read after it is still the first thing the run's own repository sees.
  it('does not read a home scratch write outside the named checkout as the first write', () => {
    const events = [
      { seq: 0, kind: 'write', path: '/Users/someone/notes.txt', command: null, text: null },
      { seq: 1, kind: 'read', path: '.skilled/skills/sk-doc/SKILL.md', command: null, text: null },
      { seq: 2, kind: 'write', path: 'README.md', command: null, text: null },
    ];

    expect(scorer.workflowPath(events, {
      command: '/create:readme',
      owner: 'sk-doc',
      wrote: true,
      checkoutDir: '/repo',
    })).toBe('skill');
  });

  // A line that names no checkout keeps the temp-folder fallback, so the same scratch
  // write still sets no boundary for the owner load.
  it('falls back to the temp folders when the line names no checkout', () => {
    const events = [
      { seq: 0, kind: 'write', path: '/tmp/notes.txt', command: 'echo x > /tmp/notes.txt', text: null },
      { seq: 1, kind: 'read', path: '.skilled/skills/sk-doc/SKILL.md', command: null, text: null },
      { seq: 2, kind: 'write', path: 'README.md', command: null, text: null },
    ];

    expect(scorer.workflowPath(events, {
      command: '/create:readme',
      owner: 'sk-doc',
      wrote: true,
    })).toBe('skill');
  });
});
