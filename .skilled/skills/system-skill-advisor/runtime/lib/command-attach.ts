// ───────────────────────────────────────────────────────────────
// MODULE: Slash command attached to a hub's recommendation
// ───────────────────────────────────────────────────────────────
//
// The advisor can name the workflow mode a hub would route a prompt to, but the
// reader still has to translate that mode into the slash command that acts on
// it. This module owns that translation and nothing else, kept free of imports
// so the recommend path and a test read the same semantics.
//
// The mode-to-command table is generated rather than hand-maintained: each row is
// derived from a hub's own command files, so a hub that adds or renames a mode
// regenerates its row instead of drifting from a copy someone forgot to update.

// BEGIN GENERATED MODE COMMANDS
export const MODE_COMMANDS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  'sk-design': {
    'sk-design-chart': '/design:chart',
    'sk-design-diagram': '/design:diagram',
    'sk-design-md-generator': '/design:extract',
  },
  'sk-doc': {
    'sk-create-agent': '/create:agent',
    'sk-create-benchmark': '/create:benchmark',
    'sk-create-changelog': '/create:changelog',
    'sk-create-command': '/create:command',
    'sk-create-diff': '/create:diff',
    'sk-create-feature-catalog': '/create:feature-catalog',
    'sk-create-goal': '/create:goal',
    'sk-create-manual-testing-playbook': '/create:manual-testing-playbook',
    'sk-create-readme': '/create:readme',
    'sk-create-repo-rule': '/create:repo-rule',
    'sk-create-skill': '/create:sk-skill',
    'sk-create-skill-parent': '/create:skill-parent',
    'sk-create-with-human-voice': '/create:with-human-voice',
  },
  'system-deep-loop': {
    'research': '/deep:research',
    'review': '/deep:review',
  },
};
// END GENERATED MODE COMMANDS

// One row of the command table: the runnable slash command, the policy that says
// whether it runs, asks or starts a session, the class that says what the run
// writes, and the skill that owns it. The rows are generated, so only the shape
// lives here.
export interface CommandRow {
  readonly command: string;
  readonly policy?: 'run' | 'start' | 'ask';
  readonly mutating?: 'read-only' | 'add-only' | 'mutates';
  readonly ownerSkillId: string;
}

// The table below covers every tracked command, whether or not its bridge is
// active, so a typed command always has a policy and an owner. `scorerRow` says
// whether a scorer can also return the command on its own.
export interface TrackedCommand {
  readonly policy: 'run' | 'start' | 'ask';
  readonly ownerSkillId: string;
  readonly scorerRow: boolean;
}

// BEGIN GENERATED COMMAND ROWS
export const COMMAND_ROWS: Readonly<Record<string, CommandRow>> = {
  'command-create-agent': { command: '/create:agent', policy: 'start', mutating: 'mutates', ownerSkillId: 'sk-doc' },
  'command-create-changelog': { command: '/create:changelog', policy: 'ask', mutating: 'mutates', ownerSkillId: 'sk-doc' },
  'command-create-feature-catalog': { command: '/create:feature-catalog', policy: 'start', mutating: 'mutates', ownerSkillId: 'sk-doc' },
  'command-create-manual-testing-playbook': { command: '/create:manual-testing-playbook', policy: 'start', mutating: 'mutates', ownerSkillId: 'sk-doc' },
  'command-create-readme': { command: '/create:readme', policy: 'start', mutating: 'mutates', ownerSkillId: 'sk-doc' },
  'command-create-sk-skill': { command: '/create:sk-skill', policy: 'start', mutating: 'mutates', ownerSkillId: 'sk-doc' },
  'command-deep-research': { command: '/deep:research', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-deep-loop' },
  'command-deep-review': { command: '/deep:review', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-deep-loop' },
  'command-doctor-agents-md-check': { command: '/doctor:agents-md check', policy: 'run', mutating: 'read-only', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-agents-md-embed': { command: '/doctor:agents-md embed', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-agents-md-restore': { command: '/doctor:agents-md restore', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-ci-report': { command: '/doctor:ci report', policy: 'run', mutating: 'read-only', ownerSkillId: 'sk-code' },
  'command-doctor-ci-scaffold': { command: '/doctor:ci scaffold', policy: 'ask', mutating: 'mutates', ownerSkillId: 'sk-code' },
  'command-doctor-ci-toggle': { command: '/doctor:ci toggle', policy: 'ask', mutating: 'mutates', ownerSkillId: 'sk-code' },
  'command-doctor-deep-loop': { command: '/doctor:deep-loop', policy: 'run', mutating: 'add-only', ownerSkillId: 'system-deep-loop' },
  'command-doctor-env': { command: '/doctor:env list', policy: 'run', mutating: 'read-only', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-git-hooks': { command: '/doctor:git hooks', policy: 'ask', mutating: 'mutates', ownerSkillId: 'sk-git' },
  'command-doctor-git-setup': { command: '/doctor:git setup', policy: 'run', mutating: 'read-only', ownerSkillId: 'sk-git' },
  'command-doctor-git-standards': { command: '/doctor:git standards', policy: 'ask', mutating: 'mutates', ownerSkillId: 'sk-git' },
  'command-doctor-helper': { command: '/doctor:helper', policy: 'run', mutating: 'read-only', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-install': { command: '/doctor:install', policy: 'run', mutating: 'read-only', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-mcp-debug': { command: '/doctor:mcp debug', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-mcp-install': { command: '/doctor:mcp install', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-overlay-apply': { command: '/doctor:overlay apply', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-overlay-repin': { command: '/doctor:overlay repin', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-overlay-status': { command: '/doctor:overlay status', policy: 'run', mutating: 'read-only', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-runtime-mirrors': { command: '/doctor:runtime-mirrors', policy: 'run', mutating: 'read-only', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-setup': { command: '/doctor:setup', policy: 'run', mutating: 'read-only', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-sk-code-quality': { command: '/doctor:sk-code quality', policy: 'ask', mutating: 'mutates', ownerSkillId: 'sk-code' },
  'command-doctor-sk-code-setup': { command: '/doctor:sk-code setup', policy: 'run', mutating: 'read-only', ownerSkillId: 'sk-code' },
  'command-doctor-sk-skill-check': { command: '/doctor:sk-skill check', policy: 'run', mutating: 'read-only', ownerSkillId: 'sk-doc' },
  'command-doctor-sk-skill-convert': { command: '/doctor:sk-skill convert', policy: 'ask', mutating: 'mutates', ownerSkillId: 'sk-doc' },
  'command-doctor-skill-advisor-parent-skill': { command: '/doctor:skill-advisor parent-skill', policy: 'run', mutating: 'read-only', ownerSkillId: 'system-skill-advisor' },
  'command-doctor-skill-advisor-rebuild': { command: '/doctor:skill-advisor rebuild', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-skill-advisor' },
  'command-doctor-skill-advisor-router-reach': { command: '/doctor:skill-advisor router-reach', policy: 'run', mutating: 'read-only', ownerSkillId: 'system-skill-advisor' },
  'command-doctor-skill-advisor-skill-budget': { command: '/doctor:skill-advisor skill-budget', policy: 'run', mutating: 'read-only', ownerSkillId: 'system-skill-advisor' },
  'command-doctor-skill-advisor-skill-graph-freshness': { command: '/doctor:skill-advisor skill-graph-freshness', policy: 'run', mutating: 'read-only', ownerSkillId: 'system-skill-advisor' },
  'command-doctor-skill-advisor-tune': { command: '/doctor:skill-advisor tune', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-skill-advisor' },
  'command-doctor-speckit': { command: '/doctor:speckit', policy: 'run', mutating: 'add-only', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-symlink-check': { command: '/doctor:symlink check', policy: 'run', mutating: 'read-only', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-symlink-link': { command: '/doctor:symlink link', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-symlink-unlink': { command: '/doctor:symlink unlink', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-skilled-doctor' },
  'command-doctor-update': { command: '/doctor:update', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-skilled-doctor' },
  'command-prompt-improve': { command: '/prompt:improve', policy: 'start', mutating: 'mutates', ownerSkillId: 'sk-prompt' },
  'command-spec-kit-deep-research': { command: '/deep:research', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-deep-loop' },
  'command-spec-kit-deep-review': { command: '/deep:review', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-deep-loop' },
  'command-speckit-ai-council': { command: '/speckit:ai-council', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-spec-kit' },
  'command-speckit-complete': { command: '/speckit:complete', policy: 'start', mutating: 'mutates', ownerSkillId: 'system-spec-kit' },
  'command-speckit-handoff': { command: '/speckit:handoff', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-spec-kit' },
  'command-speckit-implement': { command: '/speckit:implement', policy: 'start', mutating: 'mutates', ownerSkillId: 'system-spec-kit' },
  'command-speckit-plan': { command: '/speckit:plan', policy: 'start', mutating: 'mutates', ownerSkillId: 'system-spec-kit' },
  'command-speckit-resume': { command: '/speckit:resume', policy: 'start', mutating: 'mutates', ownerSkillId: 'system-spec-kit' },
  'command-speckit-save': { command: '/speckit:save', policy: 'start', mutating: 'mutates', ownerSkillId: 'system-spec-kit' },
  'command-speckit-search': { command: '/speckit:search', policy: 'run', mutating: 'read-only', ownerSkillId: 'system-spec-kit' },
  'create:agent': { command: '/create:agent', policy: 'start', mutating: 'mutates', ownerSkillId: 'sk-doc' },
  'create:manual-testing-playbook': { command: '/create:manual-testing-playbook', policy: 'start', mutating: 'mutates', ownerSkillId: 'sk-doc' },
};
export const TRACKED_COMMANDS: Readonly<Record<string, TrackedCommand>> = {
  '/create:agent': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: true },
  '/create:benchmark': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false },
  '/create:changelog': { policy: 'ask', ownerSkillId: 'sk-doc', scorerRow: false },
  '/create:command': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false },
  '/create:diff': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false },
  '/create:feature-catalog': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false },
  '/create:goal': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false },
  '/create:manual-testing-playbook': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: true },
  '/create:readme': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false },
  '/create:repo-rule': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false },
  '/create:sk-skill': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false },
  '/create:skill-parent': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false },
  '/create:with-human-voice': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false },
  '/deep:research': { policy: 'ask', ownerSkillId: 'system-deep-loop', scorerRow: false },
  '/deep:review': { policy: 'ask', ownerSkillId: 'system-deep-loop', scorerRow: false },
  '/design:chart': { policy: 'start', ownerSkillId: 'sk-design', scorerRow: false },
  '/design:diagram': { policy: 'start', ownerSkillId: 'sk-design', scorerRow: false },
  '/design:extract': { policy: 'ask', ownerSkillId: 'sk-design', scorerRow: false },
  '/doctor:agents-md check': { policy: 'run', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:agents-md embed': { policy: 'ask', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:agents-md restore': { policy: 'ask', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:ci report': { policy: 'run', ownerSkillId: 'sk-code', scorerRow: true },
  '/doctor:ci scaffold': { policy: 'ask', ownerSkillId: 'sk-code', scorerRow: true },
  '/doctor:ci toggle': { policy: 'ask', ownerSkillId: 'sk-code', scorerRow: true },
  '/doctor:deep-loop': { policy: 'run', ownerSkillId: 'system-deep-loop', scorerRow: true },
  '/doctor:env list': { policy: 'run', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:git hooks': { policy: 'ask', ownerSkillId: 'sk-git', scorerRow: true },
  '/doctor:git setup': { policy: 'run', ownerSkillId: 'sk-git', scorerRow: true },
  '/doctor:git standards': { policy: 'ask', ownerSkillId: 'sk-git', scorerRow: true },
  '/doctor:helper': { policy: 'run', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:install': { policy: 'run', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:mcp debug': { policy: 'ask', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:mcp install': { policy: 'ask', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:overlay apply': { policy: 'ask', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:overlay repin': { policy: 'ask', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:overlay status': { policy: 'run', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:runtime-mirrors': { policy: 'run', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:setup': { policy: 'run', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:sk-code quality': { policy: 'ask', ownerSkillId: 'sk-code', scorerRow: true },
  '/doctor:sk-code setup': { policy: 'run', ownerSkillId: 'sk-code', scorerRow: true },
  '/doctor:sk-skill check': { policy: 'run', ownerSkillId: 'sk-doc', scorerRow: true },
  '/doctor:sk-skill convert': { policy: 'ask', ownerSkillId: 'sk-doc', scorerRow: true },
  '/doctor:skill-advisor parent-skill': { policy: 'run', ownerSkillId: 'system-skill-advisor', scorerRow: true },
  '/doctor:skill-advisor rebuild': { policy: 'ask', ownerSkillId: 'system-skill-advisor', scorerRow: true },
  '/doctor:skill-advisor router-reach': { policy: 'run', ownerSkillId: 'system-skill-advisor', scorerRow: true },
  '/doctor:skill-advisor skill-budget': { policy: 'run', ownerSkillId: 'system-skill-advisor', scorerRow: true },
  '/doctor:skill-advisor skill-graph-freshness': { policy: 'run', ownerSkillId: 'system-skill-advisor', scorerRow: true },
  '/doctor:skill-advisor tune': { policy: 'ask', ownerSkillId: 'system-skill-advisor', scorerRow: true },
  '/doctor:speckit': { policy: 'run', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:symlink check': { policy: 'run', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:symlink link': { policy: 'ask', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:symlink unlink': { policy: 'ask', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/doctor:update': { policy: 'ask', ownerSkillId: 'system-skilled-doctor', scorerRow: true },
  '/prompt:improve': { policy: 'start', ownerSkillId: 'sk-prompt', scorerRow: true },
  '/speckit:ai-council': { policy: 'ask', ownerSkillId: 'system-spec-kit', scorerRow: true },
  '/speckit:complete': { policy: 'start', ownerSkillId: 'system-spec-kit', scorerRow: true },
  '/speckit:handoff': { policy: 'ask', ownerSkillId: 'system-spec-kit', scorerRow: true },
  '/speckit:implement': { policy: 'start', ownerSkillId: 'system-spec-kit', scorerRow: true },
  '/speckit:plan': { policy: 'start', ownerSkillId: 'system-spec-kit', scorerRow: true },
  '/speckit:resume': { policy: 'start', ownerSkillId: 'system-spec-kit', scorerRow: true },
  '/speckit:save': { policy: 'start', ownerSkillId: 'system-spec-kit', scorerRow: true },
  '/speckit:search': { policy: 'run', ownerSkillId: 'system-spec-kit', scorerRow: true },
};
// END GENERATED COMMAND ROWS

// The row for an id a recommendation carries, or undefined when that id names no
// command. Own-key lookup because the table is generated data, so an inherited
// name such as `constructor` must not resolve to a row nobody declared.
export function commandRowFor(id: string): CommandRow | undefined {
  return Object.hasOwn(COMMAND_ROWS, id) ? COMMAND_ROWS[id] : undefined;
}

// The deep-loop hub owns one diagnosis command besides its two run commands.
const DEEP_LOOP_DOCTOR_COMMAND = '/doctor:deep-loop';

// A typed command is the reader's own wording, so it counts only where a command
// can start and where it ends on a boundary. That keeps a path such as
// `docs/create:goal.md` and a prefix such as `/create:sk` from reading as a
// command, and the longest key wins so `/group:name-parent` is never reduced to
// its `/group:name` prefix. A dot or a slash followed by a word character
// continues a file name or a path, while a sentence-ending period does not.
// A mode suffix and a `:with-*` modifier end the command name the way a space
// does, after any tracked command. The argument hints say which commands take
// which, but a modifier typed on a command that does not take it still names
// that command. The hints chain them, as in `:auto:with-research`, so a run of
// them counts as one suffix.
const COMMAND_START_BOUNDARY = /[\s`'"(*[~>\u201c\u2018\u00ab\u2032\u2039]/;
const COMMAND_CONTINUATION = /[a-z0-9_:-]/;
const WORD_CHARACTER = /[a-z0-9_]/;
// The suffix words are data, one per line, because the Python fallback keeps its
// own copy of the same vocabulary and a test reads both lists so the two copies
// fail the build when one gains a word the other never got.
export const MODE_SUFFIXES: readonly string[] = [
  'auto',
  'confirm',
  'autopilot',
  'unattended',
  'with-context',
  'with-phases',
  'with-research',
];
const MODE_SUFFIX = new RegExp(`^(?::(?:${MODE_SUFFIXES.map(escapePhrase).join('|')}))+(?![a-z0-9_:-])`);

// A command that was renamed is still typed from habit. Its old name reads as
// the command that replaced it, so the reader lands on the live workflow and
// not on whatever skill the leftover words happen to score for. The old name
// gets no command file of its own: this table is the only place it lives.
const RETIRED_COMMANDS: Readonly<Record<string, string>> = {
  '/create:skill': '/create:sk-skill',
};

// Whether `key` is typed at `index`: it starts where a command can start and ends
// on a boundary, a mode suffix or a `:with-*` modifier.
function typedAt(lowered: string, index: number, key: string): boolean {
  const before = index === 0 ? '' : lowered[index - 1];
  const after = lowered[index + key.length] ?? '';
  const next = lowered[index + key.length + 1] ?? '';
  const startsAtBoundary = before === '' || COMMAND_START_BOUNDARY.test(before);
  const hasModeSuffix = MODE_SUFFIX.test(lowered.slice(index + key.length));
  const continuesName =
    !hasModeSuffix
    && (COMMAND_CONTINUATION.test(after) || ((after === '/' || after === '.') && WORD_CHARACTER.test(next)));
  const endsAtBoundary = after === '' || !continuesName;
  return startsAtBoundary && endsAtBoundary;
}

const TYPED_COMMAND_KEYS: readonly string[] = [...Object.keys(TRACKED_COMMANDS), ...Object.keys(RETIRED_COMMANDS)];

export function typedCommandIn(prompt: string): string | undefined {
  const lowered = prompt.toLowerCase();
  let found: string | undefined;
  for (const key of TYPED_COMMAND_KEYS) {
    let index = lowered.indexOf(key);
    while (index !== -1) {
      if (typedAt(lowered, index, key)) {
        if (found === undefined || key.length > found.length) found = key;
        break;
      }
      index = lowered.indexOf(key, index + 1);
    }
  }
  if (found !== undefined && Object.hasOwn(RETIRED_COMMANDS, found)) return RETIRED_COMMANDS[found];
  return found;
}

// Every command the prompt types, in the order the reader typed them. A prompt
// can type two workflows, as in "run /deep:review, then /create:changelog", and
// the longest of them says nothing about whether the other was asked for, so a
// gate that asks "was this command typed" reads this list. Only two keys that
// start at the same place compete, and the longer one wins there, so
// `/group:name-parent` is never also read as `/group:name`.
export function typedCommandsIn(prompt: string): string[] {
  const lowered = prompt.toLowerCase();
  const atIndex = new Map<number, string>();
  for (const key of TYPED_COMMAND_KEYS) {
    let index = lowered.indexOf(key);
    while (index !== -1) {
      if (typedAt(lowered, index, key)) {
        const held = atIndex.get(index);
        if (held === undefined || key.length > held.length) atIndex.set(index, key);
      }
      index = lowered.indexOf(key, index + 1);
    }
  }
  const ordered = [...atIndex.entries()].sort(([left], [right]) => left - right).map(([, key]) => (
    Object.hasOwn(RETIRED_COMMANDS, key) ? RETIRED_COMMANDS[key] : key
  ));
  return [...new Set(ordered)];
}

// A typed command travels on the recommendation that leads, so it is delivered
// only when the leading skill owns the command or carries the same command row.
// A leading skill unrelated to the command must not carry it.
export interface TypedCommand {
  readonly command: string;
  readonly policy: 'run' | 'start' | 'ask';
  readonly ownerSkillId: string;
}

// A prompt that types two commands delivers the first one the leading skill owns
// or carries, so a longer command typed for another skill does not hide it.
export function typedCommandForTop(topSkillId: string, prompt: string): TypedCommand | undefined {
  for (const command of typedCommandsIn(prompt)) {
    if (!Object.hasOwn(TRACKED_COMMANDS, command)) continue;
    if (commandOnlyMentioned(prompt, command)) continue;
    const row = TRACKED_COMMANDS[command];
    const sameCommandRow = commandRowFor(topSkillId)?.command === command;
    if (topSkillId !== row.ownerSkillId && !sameCommandRow) continue;
    return { command, policy: row.policy, ownerSkillId: row.ownerSkillId };
  }
  return undefined;
}

// Deep-loop commands open a long, multi-pass run, so one attached to a prompt
// that merely mentions the topic spends the reader's budget on work they never
// asked for. The list below is the vocabulary that counts as asking for it, and
// it names the loop itself: a deep loop by name, iterations, or more than one
// pass. Depth wording such as `thorough` or `in depth` asks for care inside a
// single pass, and a bare topic word such as `research` or `review` says what
// to look at, so neither qualifies on its own.
//
// The phrases live in a data list, one per line, so the vocabulary a reviewer
// has to judge stays visible and cheap to correct.
//
// A reader asks for more than one run as often as for one, as in "run two deep
// reviews", so each phrase is listed in both spellings: with the singular alone
// the plural matches nothing and the request goes unanswered.
export const LOOP_WORDING: readonly string[] = [
  'deep research',
  'deep researches',
  'deep-research',
  'deep-researches',
  'deep review',
  'deep reviews',
  'deep-review',
  'deep-reviews',
  'multi-pass',
];

// `iterative` and an uncounted `iterations` are also how a prompt describes its
// subject, as in "the iterative solver" or "the last iterations of the plan", so
// they ask for the loop only where they say how a review or research runs: on
// the activity itself ("iterative review", "a looped investigation"), as the
// manner of a review or research verb ("audit it iteratively"), or as the work's
// unit ("in several iterations", "more iterations"). Counted iterations are
// LOOP_COUNT's.
const ITERATIVE_ACTIVITY = '(?:deep[- ])?(?:review|research|audit|investigation|analysis|inspection|check|pass(?:es)?|rounds?|loop)';
// The verbs are data, one per line, so the vocabulary a reviewer has to judge
// stays visible and cheap to correct. `analyse` and `analyze` are one verb in
// two spellings, and a list of words cannot carry a character class, so both
// are listed.
export const ITERATIVE_VERBS: readonly string[] = [
  'review',
  'research',
  'audit',
  'investigate',
  'inspect',
  'check',
  'scan',
  'examine',
  'analyze',
  'analyse',
  'look into',
  'go over',
];
const ITERATIVE_VERB_PATTERN = `(?:${ITERATIVE_VERBS.map(escapePhrase).join('|')})`;
export const ITERATIVE_ASK = new RegExp(
  `\\b(?:iterative|looped) ${ITERATIVE_ACTIVITY}\\b`
  + `|\\biteratively ${ITERATIVE_VERB_PATTERN}\\b`
  + `|\\b${ITERATIVE_VERB_PATTERN}\\b(?: [\\w./'-]+){0,6}? iteratively\\b`
  + '|\\b(?:in|over|through) (?:(?:several|multiple|many|a few|successive|repeated) )?iterations\\b'
  // "the model needed more iterations to converge" reports what a process took,
  // so a verb of taking or using before the amount leaves it a description.
  + '|\\b(?<!\\b(?:needed|took|takes|required|requires|used|ran|had|after) )(?:several|multiple|(?<!\\bhow )many|a few|successive|repeated|more) iterations\\b',
);

// Passes and rounds are also things a prompt can be about, as in "three funding
// rounds" or "several rounds of layoffs", so they ask for the loop only when
// nothing but a loop word stands between the count and the noun, and an "of"
// after them names the review, the research or the target rather than another
// subject. Rounds of a named thing are that thing's rounds, as in "3 rounds of
// the clinical trial", so after "of" a round takes only a pronoun, the loop
// noun itself or one named review, as in "rounds of the security audit". The
// named review needs its determiner and has to end there, because "rounds of
// peer review" and "rounds of the peer review process" name the subject. A pass
// may still take its target, as in "passes of the code".
const PASS_GAP = '(?:(?:more|extra|additional|full|deep|review|research|audit|iterative) ){0,2}';
const PASS_NOUN = '(?:passes\\b(?! of (?!(?:review|research|audit|investigation|the|it|this|that|these|those|my|our)\\b)[a-z])'
  + '|rounds\\b(?! of (?!(?:(?:the|this|that|my|our) )?(?:review|research|audit|investigation|analysis|deep)\\b'
  + '|(?:the|this|that|my|our) [a-z-]+ (?:review|research|audit|investigation|analysis)\\b(?! (?!(?:on|of|for|in|with|to|and|then|until|so|at|across|against|over|before|after)\\b)[a-z])'
  + '|(?:it|this|that)\\b(?! [a-z]))[a-z]))';

// More than one pass or round asks for the loop the way iterations do. "How
// many passes does it run" asks about the loop, so `many` counts only where no
// `how` stands before it.
export const MULTI_PASS = new RegExp(`\\b(?:multiple|several|(?<!\\bhow )many) ${PASS_GAP}${PASS_NOUN}`);

// An iteration count asks for the loop whether it is typed as a digit or spelled
// out, and a hyphen may join the two, as in "twelve-iteration". A count counts
// from two up, because "in one iteration" asks for a single pass, and one counts
// only as one more, as in "do one more iteration". A pass or a round counts the
// same way, and the singular counts only when hyphen-joined, as in "two-pass",
// because "3 tests pass" uses it as a verb. A count after a word that points
// back, as in "the first 2 iterations", or after "after", as in "failed after 3
// iterations", names runs that already happened rather than asking for more,
// while "stop after 10 iterations" sets the length of the run it asks for.
const COUNT_BACK_POINTER = '(?<!\\b(?:first|last|previous|past|prior|earlier|those|these|the|both|(?<!\\bstop )after) )';
// An article may precede `dozen`, spelling the same count, so it hangs off that
// entry as the pattern is built rather than in the list, which keeps one bare
// word per line.
export const COUNT_WORDS: readonly string[] = [
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'dozen',
];
const COUNT_WORDS_PATTERN = `(?:${COUNT_WORDS.map((word) => (word === 'dozen' ? '(?:a )?' : '') + escapePhrase(word)).join('|')})`;
const LOOP_COUNT_LEAD = `${COUNT_BACK_POINTER}(?:[2-9]|\\d{2,}|${COUNT_WORDS_PATTERN}|(?:1|one)(?= (?:more|extra|additional|further)\\b))`;
export const LOOP_COUNT = new RegExp(
  `\\b${LOOP_COUNT_LEAD}[- ](?:[a-z-]+ ){0,2}?iterations?\\b`
  + `|\\b${LOOP_COUNT_LEAD}(?:-(?:rounds?|pass(?:es)?)\\b| ${PASS_GAP}${PASS_NOUN})`,
);

// A loop's own name is how a reader asks about the loop as often as how they ask
// to run one, so "how does the research loop decide when it has enough" stays a
// question. The name counts as asking for the run only behind a use verb, as in
// "start a research loop". The plural names the same loop, as in "run two
// research loops", so both spellings are listed.
export const LOOP_NAMES: readonly string[] = [
  'deep loop',
  'deep loops',
  'research loop',
  'research loops',
  'review loop',
  'review loops',
];

// A creation workflow scaffolds, reviews and validates a whole document, which is
// the wrong size for a correction inside one. The list below is the vocabulary
// that marks that correction, and a line number points at one the same way.
export const SMALL_EDIT_WORDING: readonly string[] = [
  'typo',
  'typos',
  'spelling',
  'misspelled',
  'misspelling',
  'grammar',
  'punctuation',
  'wording',
  'broken link',
  'broken links',
  'dead link',
  'dead links',
  'one line',
  'single line',
];

// A phrase may carry punctuation a regex would read as a metacharacter, so it is
// escaped before it is trusted as a pattern.
function escapePhrase(phrase: string): string {
  return phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// One word that names a deep-loop mode. A route that defers on a loop request
// still names its mode when the prompt carries exactly one of these cues.
// A check or an inspection aimed at defects is a review in plain words, so it
// counts beside review and audit. The defect noun is required, because "check
// that the build passes" asks for no review at all. The scorer reads the defect
// check on its own as well, because its verbs also read as a request to explain.
// The -ing form asks the same way, as in "a deep loop checking the parser for bugs".
// The verbs and the defect nouns are data, one list each, so the fallback's own
// copy of this cue is compared with the vocabulary rather than with a pattern.
export const DEFECT_CHECK_VERBS: readonly string[] = [
  'check',
  'checking',
  'inspect',
  'inspecting',
  'scan',
  'scanning',
  'examine',
  'examining',
  'go over',
  'going over',
  'look over',
  'looking over',
];
export const DEFECT_CHECK_NOUNS: readonly string[] = [
  'bug',
  'bugs',
  'defect',
  'defects',
  'mistake',
  'mistakes',
  'error',
  'errors',
  'vulnerability',
  'vulnerabilities',
  'issue',
  'issues',
  'problem',
  'problems',
  'regression',
  'regressions',
  'flaw',
  'flaws',
];
export const DEFECT_CHECK = new RegExp(
  `\\b(?:${DEFECT_CHECK_VERBS.map(escapePhrase).join('|')})\\b`
  + `(?:\\s+[\\w./-]+){0,5}?\\s+for\\s+(?:[\\w-]+\\s+){0,2}?`
  + `(?:${DEFECT_CHECK_NOUNS.map(escapePhrase).join('|')})\\b`,
);
// The -ing form carries the cue too, as in "a deep loop reviewing the session store".
// The words are data, one list per mode, so the vocabulary a reviewer has to
// judge stays visible and cheap to correct, and the fallback's own copy of these
// cues can be compared with it instead of parsed back out of a pattern. A list of
// words cannot carry a character class, so each verb is spelled in every form it
// is read in.
export const MODE_CUE_WORDS: Readonly<Record<string, readonly string[]>> = {
  research: ['research', 'researching', 'investigate', 'investigates', 'investigating', 'investigation', 'look into', 'find out'],
  review: ['review', 'reviewing', 'audit', 'auditing'],
};

function modeCue(words: readonly string[]): RegExp {
  return new RegExp(`\\b(?:${words.map(escapePhrase).join('|')})\\b`);
}

export const MODE_CUES: Readonly<Record<string, RegExp>> = {
  research: modeCue(MODE_CUE_WORDS.research),
  review: new RegExp(`${modeCue(MODE_CUE_WORDS.review).source}|${DEFECT_CHECK.source}`),
};

// A loop run reads the code and reports on it, and the report it writes is its
// own output rather than the change the reader ruled out, so a mode listed here
// stays the answer to a no-edit request. The doctor is the one deep-loop command
// that adds files, and it keeps that guard.
export const READ_ONLY_LOOP_MODES: readonly string[] = [
  'research',
  'review',
];

// A run that is stuck, never converges or whose graph looks stale is a fault in
// an existing run, so it asks for a diagnosis rather than for a new run. The
// subject has to name a deep run or its state, because "my build is stuck" is
// not about the loop, and a use verb right before the subject turns it back
// into a request, as in "run deep research on why sockets hang". An audit loop
// is the review loop by another name, and "the review I started" names a run the
// reader launched, while "the test runner I started" names no deep run at all.
// Convergence and a coverage graph belong to training runs and test reports as
// much as to the loop, so they name a deep run only beside a review or research
// noun, as in "the research convergence" or "the coverage graph for my review".
const LOOP_RUN_SUBJECT = /\b(?:(?:deep[- ](?:research|review|loop)|(?:research|review|audit) (?:loop|run))(?:s|es)?|(?:research|review|audit)(?: (?:loop|run))? (?:i|we) (?:just )?(?:started|launched|kicked off|ran|began|set off|set up)|(?:the|my|our|this|that) (?:research|review|audit)(?:'s)? (?:coverage graph|convergence)|(?:coverage graph|convergence) (?:of|for|in|on) (?:(?:the|my|our|this|that) )?(?:research|review|audit))\b/;
// "keep going" asks for more of a run, so it is not among the symptoms, and
// "spinning up" starts a run rather than describing one that is stuck. A state
// word that a negation leads, as in "the run is not stuck", denies the symptom,
// while the negated verbs further on, as in "not converging", are symptoms.
// The state words are data, one word per line, so the vocabulary a reviewer has
// to judge stays visible. `hang` is listed beside `hangs` so both spellings
// read, and the `spinning up` exclusion and the negation lookbehind stay in the
// pattern, because they are grammar rather than vocabulary.
export const LOOP_RUN_SYMPTOMS: readonly string[] = [
  'stuck',
  'hang',
  'hangs',
  'hanging',
  'hung',
  'frozen',
  'stalled',
  'stalls',
  'spins',
  'spinning',
  'stale',
  'empty',
];
const LOOP_RUN_SYMPTOMS_PATTERN = `(?:${LOOP_RUN_SYMPTOMS.map((word) => escapePhrase(word) + (word === 'spinning' ? '(?! up)' : '')).join('|')})`;
const LOOP_RUN_SYMPTOM = new RegExp(
  `\\b(?:(?<!\\b(?:not|isn't|wasn't|aren't|weren't|longer|never) )${LOOP_RUN_SYMPTOMS_PATTERN}`
  + '|never (?:converges?|finishes|stops|ends|fires)'
  + `|(?:not|isn't|is not|won't|will not|doesn't|does not|didn't|did not|can't|cannot|without) (?:converg\\w*|finish\\w*|progress\\w*|mov\\w*|fir\\w*)`
  + '|stopped (?:converg\\w*|progress\\w*|moving)|keeps? (?:running|repeating|looping)'
  + `|(?:hasn't|has not|haven't|have not) (?:moved|changed|converged|progressed)|no progress)\\b`,
);
const LOOP_RUN_REQUESTED = /\b(?:run|start|use|launch|kick off|do|rerun|re-run) (?:[a-z0-9'-]+ ){0,2}(?:deep[- ](?:research|review|loop)|(?:research|review|audit) (?:loop|run))(?:s|es)?\b/;
// A global pattern, because every occurrence has to be read before one of them
// can be trusted as an ask the reader still wants.
const LOOP_RUN_REQUESTED_ALL = new RegExp(LOOP_RUN_REQUESTED.source, 'g');

// A rerun can point back at the run the prompt already names, as in "run it
// again" or "rerun that", so the pronoun is how a reader asks for the same run a
// second time without spelling its name. The pronouns are data, one spelling per
// line, so the vocabulary a reviewer has to judge stays visible and the Python
// fallback's own copy can be compared with it.
export const RERUN_PRONOUNS: readonly string[] = [
  'it',
  'that',
  'this',
  'that one',
  'this one',
];
const RERUN_PRONOUN = `(?:${RERUN_PRONOUNS.map(escapePhrase).join('|')})`;
// "again" and "once more" say the run happens a second time, so a use verb takes
// the pronoun only with one of them after it: "run it by hand" names a manner and
// "don't run it" refuses the run. A rerun verb says the same on its own.
const RERUN_MARKER = '(?:again|once again|once more)';
const PRONOUN_RERUN_ASK_SOURCE = `\\b(?:rerun|re-run) ${RERUN_PRONOUN}\\b`
  + `|\\b(?:run|do|start|launch|kick off) ${RERUN_PRONOUN} ${RERUN_MARKER}\\b`;
const PRONOUN_RERUN_ASK = new RegExp(PRONOUN_RERUN_ASK_SOURCE);
// A global pattern, because every occurrence has to be read before one of them
// can be trusted as an ask the reader still wants.
const PRONOUN_RERUN_ASK_ALL = new RegExp(PRONOUN_RERUN_ASK_SOURCE, 'g');

// The pronoun names no run on its own, so the prompt has to name the deep run the
// rerun repeats: "run it again" about a test suite asks for no loop at all.
function hasUnrefusedPronounRerun(lower: string): boolean {
  return LOOP_RUN_SUBJECT.test(lower)
    && [...lower.matchAll(PRONOUN_RERUN_ASK_ALL)].some((match) => !runAskNegatedAt(lower, match.index));
}

// The deep loop's doctor reads a deep run's own state, so a prompt that names no
// deep run, as in "the model needed more iterations to converge", has nothing for
// it to read, however many of its keywords the prompt shares. A run the reader
// asked to repeat, as in "run it again", or whose finished output they asked to
// read, as in "summarize the deep reviews from last week", names a run without
// asking about its state, so the doctor has nothing to read there either. A
// fault reported in the same prompt does name a state to read, so it keeps the
// doctor the way it keeps the run ask.
export function namesDeepRun(text: string): boolean {
  const lower = text.toLowerCase().replace(/[‘’]/g, "'");
  return LOOP_RUN_SUBJECT.test(lower) && !hasUnrefusedPronounRerun(lower)
    && (isStuckRunComplaint(lower) || !isPastRunRead(lower));
}

// A run ask that a refusal leads, as in "don't run another deep review", forbids
// the run instead of asking for it, so it leaves the stuck reading standing. Only
// an ask the reader still wants cancels the complaint, because a complaint that
// also refuses the loop asks for the diagnosis and not for the run it refused.
// A pronoun rerun, as in "run it again", asks for the same run, so it cancels the
// reading as well.
function hasUnrefusedRunAsk(lower: string): boolean {
  return [...lower.matchAll(LOOP_RUN_REQUESTED_ALL)].some((match) => !runAskNegatedAt(lower, match.index))
    || hasUnrefusedPronounRerun(lower);
}

// A counted run ask, as in "run 5 more iterations", asks for more of the run
// whatever state the reader reports it in, so it cancels the stuck reading
// unless a refusal leads it.
export function isStuckRunComplaint(text: string): boolean {
  const lower = text.toLowerCase().replace(/[‘’]/g, "'");
  return LOOP_RUN_SUBJECT.test(lower) && LOOP_RUN_SYMPTOM.test(lower) && !hasUnrefusedRunAsk(lower)
    && ![...lower.matchAll(COUNTED_RUN_ASK)].some((match) => !runAskNegatedAt(lower, match.index));
}

// A run asked for in so many words: a use verb on a deep loop's name, or on a
// count of iterations, rounds or passes, as in "run 10 research iterations".
const COUNTED_RUN_ASK = new RegExp(
  `\\b(?:run|start|launch|kick off|do|rerun|re-run) (?:(?:an?|another) )?(?:${LOOP_COUNT.source})`,
  'g',
);
const EXPLICIT_RUN_ASK = new RegExp(
  `${LOOP_RUN_REQUESTED.source}|${COUNTED_RUN_ASK.source}|${PRONOUN_RERUN_ASK.source}`,
  'g',
);

// The refusal leads are data, one lead per line, so the vocabulary a reviewer
// has to judge stays visible and a test can compare it with the Python
// fallback's copy. `refuse` is listed in its plain form, because the pattern
// takes `d` and `to` after it.
export const RUN_ASK_REFUSAL_LEADS: readonly string[] = [
  'do not',
  "don't",
  'dont',
  'never',
  'no need to',
  'need not',
  "needn't",
  'no need for',
  'without',
  'not asking for',
  'not looking for',
  'skip',
  'skipping',
  'avoid',
  'avoiding',
  'instead of',
  'rather than',
  'refuse',
];

// Two leads carry grammar of their own: `skip` followed by `to`, as in "skip
// straight to the deep review", jumps ahead to the run and asks for it, and a
// refusal verb may take `to` after it, as in "refused to run a deep review".
function refusalLeadSource(lead: string): string {
  const escaped = escapePhrase(lead);
  if (lead === 'skip') return `${escaped}(?!\\s+(?:(?:straight|right|ahead|directly)\\s+)?to\\b)`;
  if (lead === 'refuse') return `${escaped}(?:d)?(?:\\s+to)?`;
  return escaped;
}

// A run ask with a negation close before it, as in "but do not run another deep
// review", forbids the run rather than asking for it. The negation has to sit
// within two words of the ask, because "do not summarize it but run a deep
// review" negates the summary and still asks for the run. A bare "no" refuses
// only the loop name right after it, as in "no deep review, please", and "not
// asking for" refuses what it names, while a bare "not" is left out because
// "why not run a deep review" proposes the run.
// Refusal verbs lead the same way, as in "skip the deep review" or "avoid deep
// research". The two-word gap stays as it is, because "don't hesitate to run a
// deep review" and "don't forget to run a deep review" ask for the run four
// words after the negation; the one longer refusal, "do not even think about",
// is a lead of its own. A conjunction inside the gap starts a new clause, as in
// "skip it and deep review the parser" or "don't fix it and run a deep review",
// so the run the second clause names is asked for.
const RUN_ASK_REFUSAL_LEAD = `(?:${RUN_ASK_REFUSAL_LEADS.map(refusalLeadSource).join('|')}`
  + `|(?:do not|don't|dont|never) even (?:think about|consider))`;
const RUN_ASK_REFUSAL_GAP = "(?:(?!(?:and|then|but|or)\\s)[\\w'-]+\\s+){0,2}";
const RUN_ASK_NEGATED_SOURCE = String.raw`(?:\b${RUN_ASK_REFUSAL_LEAD}\s+${RUN_ASK_REFUSAL_GAP}|\bno\s+)$`;

// The leads the gate reads before a phrase are a few words long, so each one is
// read on a bounded window that ends where the phrase starts rather than on the
// whole prefix. Reading the whole prefix once per phrase made a long prompt that
// repeats a phrase cost time quadratic in its length. The window leaves room for
// an or-list of several commands before a name. A lead has to start inside the
// window, and the search starts there over a slice that keeps a few characters of
// real text in front, so the text-start anchor cannot fire at the cut and a word
// boundary or lookbehind there reads the real characters before it. A lead longer
// than the window is lost and none is invented. The Python fallback reads the
// same window through its search bounds.
export const LEAD_WINDOW = 400;
const LEAD_CONTEXT = 16;

// A global pattern, because only a global pattern starts its search at a set
// position.
function windowedPattern(source: string): RegExp {
  return new RegExp(source, 'g');
}

function endsBefore(pattern: RegExp, text: string, end: number): boolean {
  const start = Math.max(0, end - LEAD_WINDOW);
  const context = Math.min(start, LEAD_CONTEXT);
  pattern.lastIndex = context;
  return pattern.test(text.slice(start - context, end));
}

const RUN_ASK_NEGATED = windowedPattern(RUN_ASK_NEGATED_SOURCE);

function runAskNegatedAt(lower: string, index: number): boolean {
  return endsBefore(RUN_ASK_NEGATED, lower, index);
}

// A refusal can also follow the loop name, as in "a deep review is not needed".
// It keys on a need word, so "the deep research run is not stuck" stays a
// statement about the run.
const LOOP_ASK_REFUSED_AFTER = /^(?: (?:run|loop|pass|iterations?))? (?:(?:is|are|was|were) (?:not|no longer)|isn't|aren't|wasn't|weren't|not) (?:needed|necessary|required|wanted|warranted|called for)\b/;

// The past-run and writing-about readings below describe a prompt's purpose, so
// an explicit run ask outranks them when it comes first, as in "run deep
// research to explain why the last CI run failed", or when it opens a clause of
// its own after them. A run ask inside the topic, as in "write a blog post about
// how to run a deep review", is part of what the piece covers.
// The first clause mark after the reading is found once, because every run ask
// after it opens a clause of its own and every one before it does not.
function explicitRunOutranks(lower: string, readingAt: number): boolean {
  let clauseMark: number | undefined;
  for (const match of lower.matchAll(EXPLICIT_RUN_ASK)) {
    if (runAskNegatedAt(lower, match.index)) continue;
    if (match.index < readingAt) return true;
    if (clauseMark === undefined) {
      const found = lower.slice(readingAt).search(/[,.;!?\n]/);
      clauseMark = found === -1 ? -1 : readingAt + found;
    }
    if (clauseMark !== -1 && clauseMark < match.index) return true;
  }
  return false;
}

// A request to read, summarize or explain what a past run produced wants that
// output, not another run. A continue, resume or extend verb asks for the run
// again, so it keeps the offer.
// The read verbs are data, one per line, so the vocabulary a reviewer has to
// judge stays visible. `summarise` and `summarize` are one verb in two
// spellings, so both are listed.
export const PAST_RUN_READ_VERBS: readonly string[] = [
  'summarize',
  'summarise',
  'summary',
  'recap',
  'explain',
  'read',
  'tell me',
  'walk me through',
  'go through',
  'what did',
  'show me',
  'pull out',
  'extract',
];
const PAST_RUN_READ_VERB_PATTERN = new RegExp(`\\b(?:${PAST_RUN_READ_VERBS.map(escapePhrase).join('|')})\\b`);
// A past-time phrase after the loop's name, as in "the deep reviews from last
// week", dates the run the read verb asks about just as the marker before the
// name does, so the output is what the reader wants and not another run.
const PAST_RUN_OUTPUT = /\b(?:last|previous|prior|earlier|yesterday's|finished|completed) (?:[\w'-]+ ){0,2}?(?:deep[- ])?(?:research|review|loop|run)\b|\b(?:research|review(?:-report)?)\.md\b|\b(?:research|review) report\b|\bdeep[- ](?:research|review) (?:output|report|results|findings|produced|concluded|found|wrote)\b|\b(?:deep[- ])?(?:research|review|loop|run)s?\b (?:from|of|in|during|over) (?:the )?(?:last|previous|prior|earlier|past|yesterday)\b/;
const RUN_CONTINUED = /\b(?:continue|resume|extend|rerun|re-run|more iterations?|\d+ more)\b/;

export function isPastRunRead(text: string): boolean {
  const lower = text.toLowerCase().replace(/[‘’]/g, "'");
  const readVerb = PAST_RUN_READ_VERB_PATTERN.exec(lower);
  return readVerb !== null && PAST_RUN_OUTPUT.test(lower) && !RUN_CONTINUED.test(lower)
    && !explicitRunOutranks(lower, readVerb.index);
}

// Writing a piece about a loop method names the loop as a topic. The genre noun
// is what marks it, so "write up the findings" after a run still asks for one.
const WRITING_ABOUT_TOPIC = /\b(?:write|draft|compose|author|prepare|publish|outline)\b (?:[\w'-]+ ){0,3}?(?:blog(?: post)?|article|essay|newsletter(?: section| issue)?|tweet(?: thread)?|thread|post|talk|presentation|slides?|deck|tutorial|op-ed|piece|whitepaper|white paper|primer|explainer)s?\b (?:[\w'-]+ ){0,3}?(?:about|on|explaining|covering|describing|introducing|why|how)\b/;

// Many keyboards type a contraction with a curly apostrophe, and the gate's
// patterns spell it straight, so each exported test reads the text lowercased
// and folded to the straight form.
function lowerFolded(text: string): string {
  return text.toLowerCase().replace(/[\u2018\u2019]/g, "'");
}

export function isWritingAboutTopic(text: string): boolean {
  const lower = lowerFolded(text);
  const writing = WRITING_ABOUT_TOPIC.exec(lower);
  return writing !== null && !explicitRunOutranks(lower, writing.index);
}

// The line alternative is a pattern rather than a phrase, so it is appended raw
// beside the escaped vocabulary instead of being escaped with it.
const SMALL_EDIT_REQUEST = new RegExp(
  `\\b(?:${SMALL_EDIT_WORDING.map(escapePhrase).join('|')}|line \\d+)\\b`,
);

// A request that asks for a document to be created or written wants the whole
// document, even when it names a correction to make afterwards, so this check
// stands the small-edit gate down.
const CREATION_REQUEST = /\b(?:creat(?:e|es|ing)|writ(?:e|es|ing)|author(?:ing)?|draft(?:ing)?|scaffold(?:ing)?|generat(?:e|es|ing)|mak(?:e|es|ing)|new|build(?:ing)?|set up|add an?|need an?)\b/;

// A small edit names the correction to make, so the verb is what marks one.
const CORRECTION_VERB = /\b(?:fix|correct|update|edit|change|tweak|repair)\b/;

// These three creation commands write a whole document that is later corrected in
// place, so a correction request names an edit to it rather than a new one. Every
// other creation command names a purpose that a correction word belongs to.
const SMALL_EDIT_GATED_COMMANDS: ReadonlySet<string> = new Set(['/create:readme', '/create:feature-catalog', '/create:manual-testing-playbook']);

// Wording that asks for an answer and rules out a change. One pattern serves
// every gate that has to honour it, so a new gate cannot drift from the first.
// Words alone cannot tell "make no changes to the files" from a change request
// that says what to leave alone, so both read as no change: losing an offer
// costs less than offering a mutating command on a prompt that ruled one out.
// A negated write verb counts only with an object that names nothing in
// particular, because "don't add tools" limits a change and does not refuse it.
export const NO_EDIT_REQUEST = /\b(no edits?|make no changes|no changes yet|without making changes|(?:do not|don't|dont) (?:make (?:any )?changes|change|edit|modify|touch|(?:create|write|add|delete|remove) (?:it|this|that|anything|any files?))|read-only only|no edits yet|only; do not|just show|just list)\b/;

// Many keyboards type the contraction with a curly apostrophe, so the text is
// folded to the straight form before the pattern reads it.
export function isNoEditRequest(text: string): boolean {
  return NO_EDIT_REQUEST.test(text.toLowerCase().replace(/[\u2018\u2019]/g, "'"));
}

// Wording that refuses any run or any fix, as in "please don't run anything" or
// "I don't want a fix". The doctor command runs a diagnosis and offers repairs,
// so a stuck-run complaint with this wording gets no doctor. It is kept apart
// from the no-edit pattern because that one gates every writing command, and
// refusing a run says nothing about whether a file may change. A refused run
// names no particular run, as in "don't run any commands" or "don't run it", so
// "don't run another deep review" or "don't run it again" refuses a rerun and
// still leaves the doctor as the answer; a counting word before "again" keeps
// that reading, as in "don't run that one again". "Yet" postpones the action
// rather than refusing it, so it leaves the diagnosis as the answer, as in
// "don't fix it yet, just diagnose it", while a postponed doctor is the thing
// postponed and stays a refusal. The verb "do" takes only an object that names
// nothing in particular, because "don't do it by hand" refuses a manner rather
// than the work. A bare "no fix" counts only when it closes the request, as in
// "no fix please", because "no fix I tried works" reports a failed repair.
export const RUN_REFUSED = /\b(?:(?:do not|don't|dont|never) (?:run|start|launch|kick off|change|fix|do) (?:anything|any commands?)(?! yet\b)\b|(?:do not|don't|dont|never) (?:run|start|launch|kick off|change|fix) (?:it|this|that)(?! (?:one )?again\b| yet\b)\b|(?:do not|don't|dont|never) (?:run|start|launch|kick off|change|fix|do) the doctor\b|(?:do not|don't|dont) (?:want|need) (?:a|any) fix(?:es)?\b|(?:do not|don't|dont) (?:want|need) (?:you )?to (?:run|fix|change) (?:anything|it|this|that)\b|no fix(?:es)?(?:,? please\b| (?:needed|wanted|required)\b|[.!]*$))/;

export function isRunRefused(text: string): boolean {
  return RUN_REFUSED.test(text.toLowerCase().replace(/[\u2018\u2019]/g, "'"));
}

// A refusal or a question reaches its command through a use verb, so the two
// lists below share this one. A gap holds one or two plain words and no
// punctuation, because a comma ends the clause that holds the lead.
export const COMMAND_USE_VERB = '(?:run|start|use|invoke|launch|execute|call|trigger|open|rerun|re-run|kick off)';
export const COMMAND_GAP_WORDS = "(?:[a-z']+ ){0,2}";

// A loop name also asks for the run when the reader says they want one, as in
// "I'd like a research loop on X". The article has to follow the want verb at
// once, so "I'd like to know what a review loop is" stays a question.
// "Set up" also configures a standing process, so it asks for a run only when
// the loop name is not followed by what the process serves, as in "set up a
// review loop for PR approvals". A wanted loop that serves every item or that a
// clause describes, as in "we need a review loop for every PR" or "a review
// loop that approves PRs", is that standing process too, while "a research
// loop on cache eviction" or "a deep loop for the parser" still names a run.
export const LOOP_WANT_LEADS: readonly string[] = [
  "i'd like",
  'i would like',
  "we'd like",
  'we would like',
  'i want',
  'we want',
  'i need',
  'we need',
  'give me',
  'spin up',
];
const LOOP_WANT_LEAD = `(?:${LOOP_WANT_LEADS.map(escapePhrase).join('|')})`;

// A continue, resume or extend verb asks for a run the reader already has.
const LOOP_CONTINUE_VERB = '(?:continue|resume|extend|restart)';

// The loop name has to be the verb's own object, so the words between them
// hold no preposition or clause word: "run tests until the review loop passes"
// runs the tests.
const LOOP_OBJECT_GAP = "(?:(?!(?:until|while|when|whenever|unless|if|once|before|after|because|so|then|and|but|or|for|on|in|of|with|against|to|into|over|through|from|by|at)\\b)[a-z0-9'-]+ ){0,3}";

// One alternation over the loop wording keeps the gate a single test per
// prompt, and the boundary markers keep a phrase from firing inside a longer
// word while a multi-word phrase still has to match as a whole. A wording
// phrase also stops at a path or a file name, so `deep-review.md` and
// `system-deep-review/` name files rather than the loop. An iterative ask, an
// iteration count, more than one pass, and a loop name behind a use, continue
// or want verb each ask for the loop, so they are appended raw as patterns
// beside the escaped vocabulary.
const LOOP_NAME_PATTERN = `(?:${LOOP_NAMES.map(escapePhrase).join('|')})`;
export const LOOP_REQUEST = new RegExp(
  `(?<![\\w/.-])(?:${LOOP_WORDING.map(escapePhrase).join('|')})(?![\\w-]|[./]\\w)`
  + `|\\b(?:(?:${COMMAND_USE_VERB}|${LOOP_CONTINUE_VERB}) ${LOOP_OBJECT_GAP}${LOOP_NAME_PATTERN}`
  + `|${LOOP_WANT_LEAD} (?:an?|another) (?:[a-z0-9'-]+ ){0,2}?${LOOP_NAME_PATTERN}(?! (?:that|which|for (?:every|each|all|any))\\b)`
  + `|set up (?:an?|another) (?:[a-z0-9'-]+ ){0,2}?${LOOP_NAME_PATTERN}(?! (?:for|that|which|to)\\b))\\b`
  + `|${ITERATIVE_ASK.source}|${MULTI_PASS.source}|${LOOP_COUNT.source}`,
);
const LOOP_REQUEST_ALL = new RegExp(LOOP_REQUEST.source, 'g');

// A loop name can be the subject of the request rather than what it asks for:
// an edit or fix verb leads it, as in "refactor the deep research scorer", or a
// code, file or result noun or a result verb follows it, as in "open the review
// loop config" or "fix the bugs the deep review found". The edit verb reaches
// the name across the same gap a use verb does, so "fix the parser with a deep
// review" still asks for the run.
const LOOP_EDIT_LEAD = windowedPattern(`\\b(?:refactor|fix|edit|modify|rewrite|debug|patch|rename|tweak|tune|clean up) ${LOOP_OBJECT_GAP}$`);
// An effort verb leads the loop name the way an edit verb does, as in "speed up
// the deep research loop" or "improve the deep review": the name is the verb's
// object, so the reader asks for a change to the loop rather than a run of it.
// The verbs are data, one per line, so the vocabulary a reviewer has to judge
// stays visible.
export const LOOP_EFFORT_LEADS: readonly string[] = [
  'speed up',
  'slow down',
  'improve',
  'optimize',
  'optimise',
];
const LOOP_EFFORT_LEAD = windowedPattern(`\\b(?:${LOOP_EFFORT_LEADS.map(escapePhrase).join('|')}) ${LOOP_OBJECT_GAP}$`);
// The artifact nouns are data, one per line, so the vocabulary a reviewer has to
// judge stays visible. The possessive before them and the word boundary after
// them stay in the pattern.
export const LOOP_ARTIFACT_NOUNS: readonly string[] = [
  'scorer',
  'scoring',
  'config',
  'configs',
  'configuration',
  'settings',
  'module',
  'script',
  'scripts',
  'implementation',
  'prompt',
  'prompts',
  'template',
  'templates',
  'schema',
  'runner',
  'reducer',
  'logic',
  'tests',
  'docs',
  'documentation',
  'yaml',
  'json',
  'findings',
  'results',
  'dashboard',
  'command file',
  'found',
  'flagged',
  'reported',
  'raised',
  'produced',
  'surfaced',
  'returned',
  'generated',
  'turned up',
];
const LOOP_ARTIFACT_AFTER = new RegExp(`^(?:'s)? (?:${LOOP_ARTIFACT_NOUNS.map(escapePhrase).join('|')})\\b`);
// A complaint about the loop's own speed or cost puts its effort word where the
// loop's result would go, as in "the deep review loop is too slow" or "deep
// research runs cost too much", so the name is what the reader complains about
// rather than what they ask for. The same word as a manner belongs to the
// request, as in "run a fast deep review on the parser" or "run a deep review
// slower", so the word is read only in a complaint's shape: a verb or copula
// carries it, or a change verb makes it the complement of the loop's name. A
// bare effort word after a run the reader asked for says how to run it, so with
// neither of those it stays a manner. The effort words are data, one per line;
// the loop noun, the verb and the intensifier around them stay in the pattern,
// and a cost complaint is a fixed idiom because its measure word describes
// rather than names.
export const LOOP_EFFORT_WORDS: readonly string[] = [
  'slow',
  'slower',
  'faster',
  'expensive',
  'costly',
  'long',
  'longer',
];
const LOOP_EFFORT_WORD = `(?:${LOOP_EFFORT_WORDS.map(escapePhrase).join('|')})`;
// The verb and the intensifier a complaint puts around its effort word are the
// grammar an English clause needs rather than vocabulary a reviewer judges, so
// they stay in the pattern. The verb is what makes the effort word a complaint:
// with it the loop name is a clause's subject, and without it the word can only
// describe a run the reader asked for.
const LOOP_EFFORT_COPULA = '(?:is|are|was|were|gets?|got|feels?|seems?|runs?|takes?|costs?)';
const LOOP_EFFORT_INTENSIFIER = '(?:too|very|so|really|quite|way)';
const LOOP_EFFORT_AFTER = new RegExp(
  `^(?: (?:loop|run|pass|iterations?|runs?))? ${LOOP_EFFORT_COPULA}`
  + `(?: ${LOOP_EFFORT_INTENSIFIER})? ${LOOP_EFFORT_WORD}\\b`
  + `|^(?: (?:runs?|pass|passes|iterations?))? costs? too much\\b`,
);
// A change verb makes the loop name its object and an effort word its
// complement, as in "make the deep review faster" or "making the research loop
// faster", so the word asks for a change to the loop rather than a run of it.
// Only a complement that follows the name at once is read that way, because a
// change verb that produces a loop, as in "make a deep review of the parser",
// still asks for the run. The verbs are data, one per line, so the vocabulary a
// reviewer has to judge stays visible.
export const LOOP_EFFORT_CHANGE_VERBS: readonly string[] = [
  'make',
  'makes',
  'making',
  'made',
];
const LOOP_EFFORT_CHANGE_LEAD = windowedPattern(
  `\\b(?:${LOOP_EFFORT_CHANGE_VERBS.map(escapePhrase).join('|')}) ${LOOP_OBJECT_GAP}$`,
);
const LOOP_EFFORT_COMPLEMENT_AFTER = new RegExp(
  `^(?: (?:loop|run|pass|iterations?|runs?))?(?: ${LOOP_EFFORT_INTENSIFIER})? ${LOOP_EFFORT_WORD}\\b`,
);

// A run that already happened is reported with its own past verb right after the
// loop's name, as in "how many deep reviews ran yesterday", so the name is that
// verb's subject and asks for no new run. A target the name takes leaves it the
// request, as in "run deep reviews on the parser", so only a verb that reports a
// run is read here, and it has to follow the name at once.
const RUN_REPORTED_AFTER = /^ (?:ran|took|failed|started|finished|completed|happened)\b/;

// A hyphen count or `multi-pass` is an adjective, so it measures the loop only
// when it qualifies the loop's own work or ends the phrase, as in "a three-pass
// review" or "review it multi-pass", and not when it describes a subject, as in
// "three-pass vs two-pass compilers" or "our multi-pass compiler". Up to three
// words may stand before the loop's noun, as in "a multi-pass security and
// correctness audit".
const HYPHEN_COUNT = /-(?:pass(?:es)?|rounds?|iterations?)$/;
const HYPHEN_COUNT_MEASURES_LOOP = /^(?:$|\s*[,.;:!?)\n]| (?:[a-z-]+ ){0,3}?(?:deep[- ])?(?:review|research|audit|investigation|analysis|inspection|check|scan|sweep|loop|run|approach)(?:s|es)?\b| (?:on|of|over|across|through|for|at|against|with|in|into|until|and|then|to|please|now)\b)/;

// A count of iterations of something that is not the loop, as in "compare 10
// iterations of the model", counts the subject's versions, and a count that
// does something, as in "several passes of the linter failed", reports runs
// that already happened.
const COUNT_NOUN = /(?:pass(?:es)?|rounds?|iterations?)$/;
const ITERATIONS_OF_SUBJECT = /^ of (?!(?:(?:the|this|that|my|our|a|an) )?(?:deep[- ])?(?:review|research|audit|investigation|analysis|loop)\b|(?:it|this|that)\b|(?:the|this|that|my|our) [a-z-]+ (?:review|research|audit|investigation|analysis)\b)/;
const COUNT_AS_SUBJECT = /^(?: of (?:[\w'-]+ ){0,2}?[\w'-]+)? (?:failed|ran|took|were|was|had|showed|found|produced|returned|crashed|broke|timed out|succeeded|completed|finished|didn't|did not)\b/;

// The edit, effort and change leads are read on the bounded window before the
// phrase. The patterns after it are anchored at its end, so they read the rest
// of the prompt whole, and the effort complement needs both readings: the change
// verb in front of the name and the word behind it.
function namesLoopSubject(phrase: string, lowered: string, start: number, after: string): boolean {
  if (endsBefore(LOOP_EDIT_LEAD, lowered, start) || endsBefore(LOOP_EFFORT_LEAD, lowered, start)) return true;
  if (LOOP_ARTIFACT_AFTER.test(after) || LOOP_EFFORT_AFTER.test(after)) return true;
  if (LOOP_EFFORT_COMPLEMENT_AFTER.test(after) && endsBefore(LOOP_EFFORT_CHANGE_LEAD, lowered, start)) return true;
  if (RUN_REPORTED_AFTER.test(after)) return true;
  if (HYPHEN_COUNT.test(phrase) && !HYPHEN_COUNT_MEASURES_LOOP.test(after)) return true;
  if (/iterations?$/.test(phrase) && ITERATIONS_OF_SUBJECT.test(after)) return true;
  return COUNT_NOUN.test(phrase) && COUNT_AS_SUBJECT.test(after);
}

// Any one loop phrase that is neither refused nor the request's subject asks
// for the run, so "don't summarize it, run a deep review" still asks. A pronoun
// rerun names the run the prompt already names rather than the loop's own words,
// so it is read here too, as in "the deep review didn't finish, run it again".
function hasLoopAsk(lowered: string): boolean {
  for (const match of lowered.matchAll(LOOP_REQUEST_ALL)) {
    const after = lowered.slice(match.index + match[0].length);
    if (runAskNegatedAt(lowered, match.index) || LOOP_ASK_REFUSED_AFTER.test(after)) continue;
    if (namesLoopSubject(match[0], lowered, match.index, after)) continue;
    return true;
  }
  return hasUnrefusedPronounRerun(lowered);
}

// Loop wording also names a loop the reader is not asking to start: a past run
// whose output they want read, a stuck run they want diagnosed, or a method they
// want to write about. Both deep-loop offer paths read this one test, so the
// routed mode and the deferred mode cannot disagree on what counts as the ask.
// The want leads spell their contractions with a straight apostrophe, so a curly
// one is folded first, and every exception below reads the folded text too.
export function asksForLoopRun(prompt: string): boolean {
  const lowered = lowerFolded(prompt);
  return hasLoopAsk(lowered)
    && !isPastRunRead(lowered)
    && !isStuckRunComplaint(lowered)
    && !isWritingAboutTopic(lowered)
    && !isLoopQuestion(lowered);
}

// A question about how the loop works names it the way a request to run it
// does, as in "how does the deep review decide it has converged". It asks for
// the run only when it also tells the loop to start or gives an iteration count.
// A negated question, as in "why doesn't my deep review converge", asks about
// the loop the same way. The loop has to be what the question is about, so
// "deep research: how do vector databases handle hybrid search" still asks for
// a run on that topic.
const LOOP_SUBJECT = '(?:[\\w\'-]+ ){0,2}?(?:deep[- ](?:research|review|loop)|(?:research|review) loop)(?:s|es)?\\b';
// "How many" asks about the loop's length, as in "how many passes does the deep
// review do".
// The finite verb a question puts after its interrogative word is data, one per
// line, so the vocabulary a reviewer has to judge stays visible. A modal reads
// the same question, as in "how can a deep research loop stop early", which asks
// how that loop stops rather than for a run of it.
export const LOOP_QUESTION_AUXILIARIES: readonly string[] = [
  'does',
  'do',
  'is',
  'are',
  'did',
  'makes',
  "doesn't",
  "don't",
  "isn't",
  "aren't",
  "didn't",
  "won't",
  "can't",
  'can',
  'could',
  'should',
  'would',
];
const LOOP_QUESTION_AUX = `(?:${LOOP_QUESTION_AUXILIARIES.map(escapePhrase).join('|')})`;
const LOOP_QUESTION = new RegExp(
  `\\b(?:how|why|when|what) ${LOOP_QUESTION_AUX} ${LOOP_SUBJECT}`
  + `|\\bhow many (?:[\\w'-]+ ){0,2}?(?:does|do|is|are|did|will|would|should|can) ${LOOP_SUBJECT}`
  + `|\\b(?:explain|describe) (?:how|what|why|when) ${LOOP_SUBJECT}`,
);
// A reader who asks how to work the loop puts themselves in the question, as in
// "how do I run a deep review on this", so the loop name is what they ask about
// even though their own use verb stands between the two. A second person, as in
// "can you run a deep review on the parser", states the request itself and is
// left out on purpose.
const LOOP_HOW_TO_QUESTION = new RegExp(`\\bhow ${LOOP_QUESTION_AUX} (?:i|we) ${LOOP_SUBJECT}`);
// Only a digit count turns the question back into a request. The spelled count
// is left out on purpose, so a question about the loop that quotes one, as in
// "why does the deep review stop after ten iterations", stays the question it
// was before spelled counts were read as a loop ask. A question that names no
// loop is not a loop question at all, so "why does it stop after ten
// iterations" still reads its count as a request for a run.
const ITERATION_COUNT = /\b\d+ (?:[a-z-]+ ){0,2}iterations?\b/;
// A later clause that opens with a use verb on "one" or "it" asks for the loop
// the question named, as in "what is a deep review? run one on the parser".
const LOOP_RUN_BY_PRONOUN = /(?:^|[,.;!?\n]) *(?:(?:and|then|so|please|now|just|go ahead and) )*(?:run|start|launch|do|kick off) (?:one|it|another)\b/;

// A how-to question holds the use verb the reader asks about, so that verb does
// not turn the question back into a request; a run the prompt asks for in a
// clause after the question still does.
function isLoopQuestion(lowered: string): boolean {
  if (ITERATION_COUNT.test(lowered) || LOOP_RUN_BY_PRONOUN.test(lowered)) return false;
  const howTo = LOOP_HOW_TO_QUESTION.exec(lowered);
  if (howTo !== null) return !LOOP_RUN_REQUESTED.test(lowered.slice(howTo.index + howTo[0].length));
  return LOOP_QUESTION.test(lowered) && !LOOP_RUN_REQUESTED.test(lowered);
}

// `why not` proposes the command rather than refusing it, so the word refuses
// only where no `why` stands before it. The guard is grammar that reaches one
// word, so it stays in the pattern while the word itself is listed as data.
const COMMAND_NOT_WORD = '(?<!\\bwhy )not';

// A lead word is used as a pattern, so a phrase that carries punctuation a regex
// would read as a metacharacter is escaped before it is trusted, and the one word
// that carries a guard keeps its guard.
function commandLeadWord(word: string): string {
  return word === 'not' ? COMMAND_NOT_WORD : escapePhrase(word);
}

// One lead shape is its words as a single alternation, then the grammar that
// follows them.
function commandLead(words: readonly string[], tail: string): string {
  return `(?:${words.map(commandLeadWord).join('|')}) ${tail}`;
}

// A command the reader refuses is named without being asked for, so these lists
// hold the words that mark that naming. A refusal reaches the command either
// through a use verb, as in "don't run /x", or by naming the command's own work,
// as in "skip the /x", so the vocabulary splits by the grammar each shape takes.
// A lead must sit directly before the command so a later clause cannot refuse an
// earlier request, and a gap holds plain words only so a refusal before a comma
// cannot swallow the request after it. A reader who stops using a command names
// it only to refuse it.
const COMMAND_DECLINE_VERB_WORDS: readonly string[] = [
  'do not',
  "don't",
  'dont',
  'never',
  'not',
  "won't",
  'wont',
  'no longer',
  'cannot',
  "can't",
  'no need to',
  'need not',
  "needn't",
];
// A refusal that names the work takes it as its object, as in "skip the /x",
// while "skip it and run /x" asks for the run.
const COMMAND_DECLINE_WORK_WORDS: readonly string[] = [
  'skip',
  'skipping',
  'without',
  'instead of',
  'rather than',
  'avoid',
  'stop',
  'stopped',
  'quit',
  'not',
];
// A verb-led refusal holds a gap either side of the use verb, so "don't rush to
// run /x" still refuses it, while the exceptions are idioms such as "don't
// forget to run /x", which ask for the run.
const COMMAND_DECLINE_VERB_TAIL = `(?!(?:forget|hesitate|fail|mind)\\b)${COMMAND_GAP_WORDS}${COMMAND_USE_VERB} ${COMMAND_GAP_WORDS}`;
// A work-led refusal holds no use verb in its gap, so "skip the /x" refuses it.
const COMMAND_DECLINE_WORK_TAIL = `(?:(?!${COMMAND_USE_VERB}\\b)[a-z']+ ){0,2}`;

// The refusal vocabulary also reads as one flat list, because the Python fallback
// keeps its own copy of it and a test compares the two, so a word added to one
// side alone fails.
export const COMMAND_DECLINE_LEAD_WORDS: readonly string[] = [
  ...COMMAND_DECLINE_VERB_WORDS,
  ...COMMAND_DECLINE_WORK_WORDS,
];
export const COMMAND_DECLINE_LEADS: readonly string[] = [
  commandLead(COMMAND_DECLINE_VERB_WORDS, COMMAND_DECLINE_VERB_TAIL),
  commandLead(COMMAND_DECLINE_WORK_WORDS, COMMAND_DECLINE_WORK_TAIL),
];

// A refusal or a question over an or-list covers every command the list joins,
// while a second use verb opens a clause of its own, so the list joins only `or`
// and `, or`. A listed command may carry `the` before it and
// `command` after it, and the command after the last `or` may carry `the`. A
// listed command may also carry one plain word after it, such as the subcommand a
// doctor command takes, so `do not run /x now or /y` refuses both.
const COMMAND_OR_LIST = '(?:(?:the )?\\/[a-z][a-z0-9_-]*(?::[a-z][a-z0-9_-]*)?(?: [a-z][a-z0-9_-]*)?(?: command)?,? or (?:the )?)*';

// A command the reader asks about is named without being asked for, so these
// lists hold the words that mark that naming. A question word names the command
// directly, as in "what does /x do", or reaches it through a use verb, as in
// "should i run /x", so the vocabulary splits by the grammar each shape takes
// again. A lead must sit directly before the command so a later clause cannot
// turn an earlier request into a question, and a gap holds plain words only so a
// question before a comma cannot swallow the request after it.
const COMMAND_ASK_NAMED_WORDS: readonly string[] = [
  'what does',
  'what is',
  "what's",
  'what would',
  'what will',
  'what did',
  'how does',
  'how did',
  'why does',
  'why did',
  'explain',
  'describe',
  'tell me what',
  'tell me how',
  'tell me about',
  'tell me why',
  'difference between',
  'differ from',
  'differs from',
  'different from',
  'undo what',
  'ran',
  'already ran',
  'was running',
];
const COMMAND_ASK_SHOULD_WORDS: readonly string[] = [
  'should i',
  'should we',
  'do i need to',
  'when would i',
];
// A named command may carry `the` before it and `command` after it, as in "what
// does the /x command do", and a question that reaches the command through a use
// verb carries that verb first.
const COMMAND_ASK_TARGET = '(?:the )?(?:command )?';

// The question vocabulary also reads as one flat list, because the Python
// fallback keeps its own copy of it and a test compares the two, so a word added
// to one side alone fails.
export const COMMAND_ASK_LEAD_WORDS: readonly string[] = [
  ...COMMAND_ASK_NAMED_WORDS,
  ...COMMAND_ASK_SHOULD_WORDS,
];
export const COMMAND_ASK_LEADS: readonly string[] = [
  commandLead(COMMAND_ASK_NAMED_WORDS, COMMAND_ASK_TARGET),
  commandLead(COMMAND_ASK_SHOULD_WORDS, `${COMMAND_USE_VERB} ${COMMAND_ASK_TARGET}`),
];

// A bare ask word opens a statement as often as a question, so it marks a naming
// only when the command it precedes is followed by a question mark before the
// sentence ends, or when the lead itself opens a sentence, which a question mark ends as a full stop does.
// A question often names the command after `the`, as in `is the /x command safe`.
export const COMMAND_BARE_ASK_LEAD = '(?:is|does|can|will|would) (?:the )?';

// A clause that opens with a use verb and `it` asks for the command an earlier
// clause only named, so a naming such as `not run /x yet, please start it`
// becomes a request. The clause has to open that way so `I will run it` stays a
// statement.
const COMMAND_ASKED_BY_PRONOUN = new RegExp(`(?:^|[,.;!?\\n]) *(?:(?:and|then|so|please|now|just|go ahead and) )*${COMMAND_USE_VERB} it\\b`);

// A refusal can come after the name, as in "/create:readme is not what I want, do
// not run it" or "run /doctor:git setup but do not actually run it". The clause
// opens a new sentence or follows "but", "and" or "so", and refuses "it" with a
// use verb, so "run /speckit:save and don't skip it" stays a request. The refusal
// has to end its clause, because "don't run it twice" or "never run it without a
// budget" limits the run rather than refusing it.
const COMMAND_DECLINED_BY_PRONOUN = new RegExp(`(?:^|[,.;!?\\n]|\\b(?:but|and|so|though)\\b) *(?:(?:please|just|then|still) )*(?:do not|don't|dont|never)(?: (?:actually|really|yet|ever|even))? ${COMMAND_USE_VERB} it(?: (?:yet|now|for now|at all|please))? *(?:$|[,.;!?\\n])`);

// A command named as a document is read about, not run: "read the /create:readme
// document", "open the /deep:review command file". The name needs a determiner
// before it, because a typed request puts its argument there instead, as in
// "/create:diff file a.md b.md". A naming followed by "then" goes on to ask for
// work, as in "read the /deep:review docs, then do a thorough review", so it is
// not only a read.
const COMMAND_AS_DOCUMENT = /^(?: command)?(?:'s)? (?:doc|docs|document|documentation|file|page|source|definition|markdown)\b/;

// A command whose policy is run acts without asking, so an unled naming of it is
// read as a request only on positive evidence: a use verb shortly before it, or
// the name opening the prompt or a sentence. "no need for /doctor:deep-loop"
// names no lead the lists know, and must not start the command on that alone.
// The words after the name can still take the request back or turn it into a
// question, as in "/doctor:speckit, cancel that" or "/doctor:install - is it
// safe?", so any of those after the name leaves the naming a mention.
const RUN_COMMAND_WITHDRAWN = /\?|\b(?:not|don't|dont|never|cancel|scratch that|hold off|wait|undo|is it|should i|nevermind|never mind)\b/g;

// A naming's clause ends where the next command name starts.
const COMMAND_CLAUSE_END = /(?:^|[\s,;(])\/[a-z][a-z0-9_-]*(?::[a-z][a-z0-9_-]*)?(?![a-z0-9_\/-]|\.[a-z0-9])/g;

// The first match at or after a position, for callers whose positions only grow,
// as a name's occurrences do. An answer stays good until the caller passes it, so
// the prompt is scanned about once rather than once per occurrence, which kept a
// prompt that repeats a command from costing time quadratic in its length.
function forwardSearch(text: string, pattern: RegExp): (from: number) => number {
  const global = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
  let found = -2;
  return (from: number): number => {
    if (found === -1 || found >= from) return found;
    global.lastIndex = from;
    found = global.exec(text)?.index ?? -1;
    return found;
  };
}

// Each command's patterns are built once and kept, because building them per
// occurrence cost as much as reading them. The names come from the command
// tables, so the cache stays small; the bound only guards a caller that passes
// arbitrary names.
interface CommandNamingPatterns {
  readonly occurrences: RegExp;
  readonly led: RegExp;
  readonly bareLead: RegExp;
  readonly bareLeadOpensSentence: RegExp;
  readonly namedAsDocument: RegExp;
  readonly requestedOpeningSentence: RegExp;
  readonly requestedByUseVerb: RegExp;
  readonly requestedAfterComma: RegExp;
}

const COMMAND_NAMING_CACHE = new Map<string, CommandNamingPatterns>();
const COMMAND_NAMING_CACHE_LIMIT = 256;

function commandNamingPatterns(current: string): CommandNamingPatterns {
  const cached = COMMAND_NAMING_CACHE.get(current);
  if (cached) return cached;
  const spellings = [current, ...Object.keys(RETIRED_COMMANDS).filter((retired) => RETIRED_COMMANDS[retired] === current)]
    .sort((left, right) => right.length - left.length);
  const name = `(?:${spellings.map(escapePhrase).join('|')})`;
  // One alternation of every lead answers what testing each lead in turn did.
  const leads = [...COMMAND_DECLINE_LEADS, ...COMMAND_ASK_LEADS].map((lead) => `(?:${lead})`).join('|');
  const patterns: CommandNamingPatterns = {
    occurrences: new RegExp(`(?:^|[^a-z0-9_/])${name}(?![a-z0-9_-]|[./][a-z0-9])`, 'g'),
    led: windowedPattern(`(?:^|[^a-z0-9_/])(?:${leads})${COMMAND_OR_LIST}${name}$`),
    bareLead: windowedPattern(`(?:^|[^a-z0-9_/])${COMMAND_BARE_ASK_LEAD}${COMMAND_OR_LIST}${name}$`),
    bareLeadOpensSentence: windowedPattern(`(?:^|[.!?\\n] *)${COMMAND_BARE_ASK_LEAD}${COMMAND_OR_LIST}${name}$`),
    namedAsDocument: windowedPattern(`\\b(?:the|this|that) ${name}$`),
    requestedOpeningSentence: windowedPattern(`(?:^|[.!?;:\\n] *)(?:(?:please|now|just|then|and) )*${name}$`),
    requestedByUseVerb: windowedPattern(`\\b${COMMAND_USE_VERB} ${COMMAND_GAP_WORDS}(?:the )?${name}$`),
    // A comma joins a clause to the command that answers it, so a naming behind
    // one asks for a run-policy command the way a sentence opener does, as in
    // "my run is stuck, /doctor:deep-loop".
    requestedAfterComma: windowedPattern(`, *(?:(?:please|now|just|then|and) )*${name}$`),
  };
  if (COMMAND_NAMING_CACHE.size >= COMMAND_NAMING_CACHE_LIMIT) COMMAND_NAMING_CACHE.clear();
  COMMAND_NAMING_CACHE.set(current, patterns);
  return patterns;
}

// The withdrawal words can sit anywhere after the name, so the caller reads the
// whole rest of the prompt for them; the request leads before it are short.
function commandRunRequested(patterns: CommandNamingPatterns, text: string, nameEnd: number, withdrawn: boolean): boolean {
  if (withdrawn) return false;
  if (endsBefore(patterns.requestedOpeningSentence, text, nameEnd)) return true;
  if (endsBefore(patterns.requestedByUseVerb, text, nameEnd)) return true;
  if (!endsBefore(patterns.requestedAfterComma, text, nameEnd)) return false;
  // A comma asks for the command only where the clause it joins refuses
  // nothing: "no fix please, /x" names the command inside the refusal rather
  // than asking for it. That clause is read inside the window a lead is read
  // in, so a prompt of any length still pays one bounded read per naming.
  return !isRunRefused(text.slice(Math.max(0, nameEnd - LEAD_WINDOW), nameEnd));
}

// A prompt names a command to refuse it or to ask about it as often as it names
// one to run it, so an offer must read the naming before it trusts the name. The
// text is folded first, because a keyed apostrophe or a run of spaces must not
// hide the lead, while a line break survives as the sentence end it is. Inline
// code, bold, strike, brackets, parentheses, guillemets, primes and quote marks
// around a name are dropped for the same reason, so a refusal of a wrapped
// command reads as the plain refusal does. An underscore stays, because a
// command name may hold one. A single quote goes only where it
// opens or closes a command name, because the same mark is the apostrophe of a
// lead such as "don't" or "what's". A retired name is read beside the current
// one, because a reader who refuses the old spelling refuses the command it now
// maps to. The
// boundary before the lead keeps a command name from matching inside a word or a
// path, and the boundary after it keeps a longer command name from reading as the
// shorter one or a doc path such as `/create:readme.md` from reading as a naming.
// Every occurrence has to carry a lead, because one led naming does not turn a
// later unled naming into a request.
export function commandOnlyMentioned(prompt: string, command: string): boolean {
  const text = prompt
    .toLowerCase()
    .replace(/<\/?(?:code|kbd|samp|tt)>/g, '')
    .replace(/[`*"“”[\]()~«»′‹›]/g, '')
    .replace(/[‘’]/g, "'")
    .replace(/(^|[^a-z0-9])'(?=\/[a-z])/g, '$1')
    .replace(/(\/[a-z][a-z0-9_-]*(?::[a-z][a-z0-9_-]*)*(?: [a-z][a-z0-9_-]*)?)'(?![a-z0-9])/g, '$1')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n\s*/g, '\n');
  const current = command.toLowerCase();
  const patterns = commandNamingPatterns(current);
  const runsWithoutAsking = TRACKED_COMMANDS[current]?.policy === 'run';
  const occurrences = [...text.matchAll(patterns.occurrences)];
  if (occurrences.length === 0) return false;
  // The clause, the sentence and the withdrawal reads each look forward from a
  // naming, and the namings come in order, so each look starts where the last
  // one left off.
  const clauseEndFrom = forwardSearch(text, COMMAND_CLAUSE_END);
  const sentenceEndFrom = forwardSearch(text, /[.!\n]/);
  const questionFrom = forwardSearch(text, /\?/);
  const withdrawnFrom = forwardSearch(text, RUN_COMMAND_WITHDRAWN);
  for (const occurrence of occurrences) {
    const nameEnd = (occurrence.index ?? 0) + occurrence[0].length;
    const clauseEnd = clauseEndFrom(nameEnd);
    const clause = text.slice(nameEnd, clauseEnd === -1 ? text.length : clauseEnd);
    if (COMMAND_DECLINED_BY_PRONOUN.test(clause)) continue;
    if (COMMAND_ASKED_BY_PRONOUN.test(clause)) return false;
    if (COMMAND_AS_DOCUMENT.test(text.slice(nameEnd, nameEnd + LEAD_WINDOW)) && !/\bthen\b/.test(clause)
      && endsBefore(patterns.namedAsDocument, text, nameEnd)) continue;
    if (endsBefore(patterns.led, text, nameEnd)) continue;
    if (!endsBefore(patterns.bareLead, text, nameEnd)) {
      if (runsWithoutAsking && !commandRunRequested(patterns, text, nameEnd, withdrawnFrom(nameEnd) !== -1)) continue;
      return false;
    }
    // A chat question often leaves the question mark off, so a bare ask word that
    // opens a sentence still asks about the command.
    const sentenceEnd = sentenceEndFrom(nameEnd);
    const question = questionFrom(nameEnd);
    const asked = question !== -1 && (sentenceEnd === -1 || question < sentenceEnd);
    if (!asked && !endsBefore(patterns.bareLeadOpensSentence, text, nameEnd)) return false;
  }
  return true;
}

// A compiled route arrives as unvalidated JSON from a separate process, so the
// shape is narrowed here rather than trusted. Arrays count as objects in
// JavaScript and would let `action` read off an unrelated field, so they are
// excluded explicitly.
function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return undefined;
  return value as Record<string, unknown>;
}

// The command for a hub's recommendation, or undefined when the route does not
// single out one mode. Only a single-mode route names a command unambiguously:
// a bundle or a multi-target route has more than one answer, and asking the
// reader to pick belongs to the recommend path, not here. Never throws, because
// a missing command must degrade to "no command offered" rather than break
// routing. The prompt decides whether a costly deep-loop command is offered at
// all: a reader who only asks about the topic gets no command, rather than one
// that would launch work they never requested.
export function attachCommand(
  skillId: string,
  compiledRoute: unknown,
  prompt: string,
  modeCommands: Readonly<Record<string, Readonly<Record<string, string>>>> = MODE_COMMANDS,
): string | undefined {
  const route = asRecord(compiledRoute);
  if (!route) return undefined;
  // A complaint about a stuck run is answered by the hub's own diagnosis command,
  // whichever mode the route picked, because a new run would repeat the fault.
  // A doctor command the reader typed and asked for is the request itself, so
  // refusal and no-edit words limit what it repairs rather than withhold it, as
  // the scorer keeps its typed row.
  if (skillId === 'system-deep-loop' && isStuckRunComplaint(prompt)) {
    if (typedCommandsIn(prompt).includes(DEEP_LOOP_DOCTOR_COMMAND) && !commandOnlyMentioned(prompt, DEEP_LOOP_DOCTOR_COMMAND)) {
      return DEEP_LOOP_DOCTOR_COMMAND;
    }
    return isNoEditRequest(prompt) || isRunRefused(prompt) || commandOnlyMentioned(prompt, DEEP_LOOP_DOCTOR_COMMAND)
      ? undefined
      : DEEP_LOOP_DOCTOR_COMMAND;
  }
  if (skillId === 'system-deep-loop' && (route.action === 'defer' || route.action === 'clarify')) {
    return deferredLoopCommand(skillId, prompt, modeCommands);
  }
  if (route.action !== 'route' || route.selectionKind !== 'single') return undefined;

  const targets = route.targets;
  if (!Array.isArray(targets) || targets.length !== 1) return undefined;

  const onlyTarget = asRecord(targets[0]);
  if (!onlyTarget) return undefined;

  const workflowMode = onlyTarget.workflowMode;
  if (typeof workflowMode !== 'string' || workflowMode === '') return undefined;

  // A reader who rules out a change gets no writing command from either path, so
  // the hub route never offers what the scorer already withholds. A loop mode
  // only reads the code, so its run survives the no-edit wording.
  if (isNoEditRequest(prompt) && !(skillId === 'system-deep-loop' && READ_ONLY_LOOP_MODES.includes(workflowMode))) {
    return undefined;
  }

  // Own-key lookup on both levels: the table is data read from a generated
  // object, so an inherited name such as `constructor` must not resolve to a
  // command the hub never declared.
  if (!Object.prototype.hasOwnProperty.call(modeCommands, skillId)) return undefined;
  const commands = modeCommands[skillId];
  if (!Object.prototype.hasOwnProperty.call(commands, workflowMode)) return undefined;
  // The hub's router scores fixed phrases, and one of those phrases can be a loop
  // name the request only works on: "run a deep loop to review the research loop
  // config" scores the research phrase while the ask is a review of that loop.
  // A routed mode the prompt's own ask never names therefore gives way to the
  // mode the ask does name, read the way a deferred route reads it, so the two
  // offer paths cannot disagree on what the prompt asked for.
  const servedMode = skillId === 'system-deep-loop'
    ? routedLoopMode(prompt, workflowMode, commands)
    : workflowMode;

  // A route can pick the mode because the prompt named its command, so a naming
  // that refused or asked about the command must not produce the offer.
  if (commandOnlyMentioned(prompt, commands[servedMode])) return undefined;

  // A correction inside one document is not a request for a creation workflow,
  // which scaffolds, reviews and validates a whole one.
  if (
    SMALL_EDIT_GATED_COMMANDS.has(commands[servedMode])
    && SMALL_EDIT_REQUEST.test(prompt.toLowerCase())
    && !CREATION_REQUEST.test(prompt.toLowerCase())
    && CORRECTION_VERB.test(prompt.toLowerCase())
  ) return undefined;

  // Deep-loop commands are the ones that commit the reader to a long, multi-pass
  // run, so they are offered only when the prompt asks for the loop itself.
  // Typing the command being attached is itself the ask, while typing another
  // deep-loop command asks for that command, not this one. Every other hub
  // answers a short question with a short answer, so no other skill consults the
  // wording list.
  if (skillId === 'system-deep-loop') {
    const typesThisCommand = typedCommandsIn(prompt).includes(commands[servedMode]);
    if (!typesThisCommand && !asksForLoopRun(prompt)) return undefined;
  }

  return commands[servedMode];
}

// The hub's router reads fixed phrases, so it defers on "run 8 more review
// iterations" though the prompt asks for the loop and names one mode. A loop
// request with exactly one mode cue names that mode as surely as a router
// phrase does, while a cue for both modes or for neither leaves the choice to
// the reader. The refusal and mention guards apply here as on a routed mode: a
// phrase the prompt refuses names the run it ruled out rather than the mode.
function deferredLoopCommand(
  skillId: string,
  prompt: string,
  modeCommands: Readonly<Record<string, Readonly<Record<string, string>>>>,
): string | undefined {
  if (!Object.prototype.hasOwnProperty.call(modeCommands, skillId)) return undefined;
  if (!asksForLoopRun(prompt)) return undefined;
  const commands = modeCommands[skillId];
  const mode = askedLoopMode(loopAskCues(lowerFolded(prompt)), commands);
  if (mode === undefined) return undefined;
  // A loop mode reads the code and reports on it, so ruling out a change does
  // not withhold the run the prompt names; a writing mode would keep the guard.
  if (isNoEditRequest(prompt) && !READ_ONLY_LOOP_MODES.includes(mode)) return undefined;
  const command = commands[mode];
  return commandOnlyMentioned(prompt, command) ? undefined : command;
}

// A routed mode stands only when the prompt's own ask names it, read on the same
// ask text the deferred route reads. An ask that names both modes or neither
// leaves the router's answer alone, because it is then the only reading there is.
function routedLoopMode(
  prompt: string,
  routedMode: string,
  commands: Readonly<Record<string, string>>,
): string {
  const cues = loopAskCues(lowerFolded(prompt));
  if (askNamesMode(cues, routedMode)) return routedMode;
  return askedLoopMode(cues, commands) ?? routedMode;
}

// The words a mode is read from: every loop phrase the prompt refuses or only
// works on is blanked first, so a run the reader ruled out, or a loop name that
// is the object of another verb, settles nothing. Each blank keeps its phrase's
// length, so every offset still points at the same words.
interface LoopAskCues {
  readonly text: string;
  readonly named: ReadonlySet<string>;
}

function loopAskCues(lowered: string): LoopAskCues {
  let text = '';
  let cursor = 0;
  for (const match of lowered.matchAll(LOOP_REQUEST_ALL)) {
    const index = match.index ?? 0;
    const end = index + match[0].length;
    if (!runAskNegatedAt(lowered, index) && !LOOP_ASK_REFUSED_AFTER.test(lowered.slice(end))) continue;
    text += lowered.slice(cursor, index) + ' '.repeat(end - index);
    cursor = end;
  }
  text += lowered.slice(cursor);
  const named = new Set<string>();
  for (const match of text.matchAll(NAMED_LOOP_MODE)) {
    const index = match.index ?? 0;
    const after = text.slice(index + match[0].length);
    if (namesLoopSubject(match[0], text, index, after)) {
      text = text.slice(0, index) + ' '.repeat(match[0].length) + text.slice(index + match[0].length);
      continue;
    }
    named.add((match[1] ?? match[2]) === 'research' ? 'research' : 'review');
  }
  return { text, named };
}

// The single mode the ask names, or undefined when it names both or neither. A
// name that qualifies the loop's own unit settles the mode; the looser topic
// words are counted only when no such name was read.
function askedLoopMode(cues: LoopAskCues, commands: Readonly<Record<string, string>>): string | undefined {
  const cued = cues.named.size === 1
    ? [...cues.named].filter((mode) => Object.prototype.hasOwnProperty.call(commands, mode))
    : Object.keys(MODE_CUES).filter((mode) => (
      MODE_CUES[mode].test(cues.text) && Object.prototype.hasOwnProperty.call(commands, mode)
    ));
  return cued.length === 1 ? cued[0] : undefined;
}

// Whether the ask names this mode at all, which a routed mode has to answer to
// stand. The router's own phrase is blanked out of the ask text before this read,
// so a phrase the request only works on cannot vouch for the mode it scored.
function askNamesMode(cues: LoopAskCues, mode: string): boolean {
  return cues.named.has(mode)
    || (Object.prototype.hasOwnProperty.call(MODE_CUES, mode) && MODE_CUES[mode].test(cues.text));
}

// A mode word that qualifies the loop's own unit names the mode outright, as in
// "run 5 research iterations on review tooling", where "review" is the topic.
// One such name settles the mode before the looser topic cues are counted. The
// deep name is read in both numbers, because the wording list carries the plural
// ask and the cue read cannot see it: its word boundary stops inside "reviews".
// The pattern is exported so the drift guard can compare its grammar with the
// fallback's transcription of it, which no word list would cover.
export const NAMED_LOOP_MODE = /\b(?:deep[- ](research|review)(?:s|es)?|(research|review|audit)[- ](?:loop|iterations?|passes|rounds?|runs?))\b/g;

// A hub that withholds its command because the prompt names no single mode must
// still tell the reader why no command came with it, and only a hub whose modes
// map to commands withholds one. A hub that tops a prompt which never named it
// is the scorer's guess, so the label would point at modes the reader did not
// ask about.
export function routeNeedsMode(
  skillId: string,
  compiledRoute: unknown,
  namedSkills: readonly string[],
): boolean {
  if (!namedSkills.includes(skillId)) return false;
  const route = asRecord(compiledRoute);
  if (!route) return false;
  if (route.action !== 'defer' && route.action !== 'clarify') return false;
  return Object.prototype.hasOwnProperty.call(MODE_COMMANDS, skillId);
}
