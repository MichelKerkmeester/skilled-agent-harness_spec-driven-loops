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
    'sk-create-skill': '/create:skill',
    'sk-create-skill-parent': '/create:skill-parent',
    'sk-create-with-human-voice': '/create:with-human-voice',
  },
  'system-deep-loop': {
    'ai-council': '/deep:ai-council',
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
  'command-create-skill': { command: '/create:skill', policy: 'start', mutating: 'mutates', ownerSkillId: 'sk-doc' },
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
  'command-doctor-skill-advisor-embedder': { command: '/doctor:skill-advisor embedder', policy: 'ask', mutating: 'mutates', ownerSkillId: 'system-skill-advisor' },
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
export const COMMAND_POLICIES: Readonly<Record<string, 'run' | 'start' | 'ask'>> = {
  '/create:agent': 'start',
  '/create:changelog': 'ask',
  '/create:feature-catalog': 'start',
  '/create:manual-testing-playbook': 'start',
  '/create:readme': 'start',
  '/create:skill': 'start',
  '/deep:research': 'ask',
  '/deep:review': 'ask',
  '/doctor:agents-md check': 'run',
  '/doctor:agents-md embed': 'ask',
  '/doctor:agents-md restore': 'ask',
  '/doctor:ci report': 'run',
  '/doctor:ci scaffold': 'ask',
  '/doctor:ci toggle': 'ask',
  '/doctor:deep-loop': 'run',
  '/doctor:env list': 'run',
  '/doctor:git hooks': 'ask',
  '/doctor:git setup': 'run',
  '/doctor:git standards': 'ask',
  '/doctor:helper': 'run',
  '/doctor:install': 'run',
  '/doctor:mcp debug': 'ask',
  '/doctor:mcp install': 'ask',
  '/doctor:overlay apply': 'ask',
  '/doctor:overlay repin': 'ask',
  '/doctor:overlay status': 'run',
  '/doctor:runtime-mirrors': 'run',
  '/doctor:setup': 'run',
  '/doctor:sk-code quality': 'ask',
  '/doctor:sk-code setup': 'run',
  '/doctor:sk-skill check': 'run',
  '/doctor:sk-skill convert': 'ask',
  '/doctor:skill-advisor embedder': 'ask',
  '/doctor:skill-advisor parent-skill': 'run',
  '/doctor:skill-advisor rebuild': 'ask',
  '/doctor:skill-advisor router-reach': 'run',
  '/doctor:skill-advisor skill-budget': 'run',
  '/doctor:skill-advisor skill-graph-freshness': 'run',
  '/doctor:skill-advisor tune': 'ask',
  '/doctor:speckit': 'run',
  '/doctor:symlink check': 'run',
  '/doctor:symlink link': 'ask',
  '/doctor:symlink unlink': 'ask',
  '/doctor:update': 'ask',
  '/prompt:improve': 'start',
  '/speckit:complete': 'start',
  '/speckit:handoff': 'ask',
  '/speckit:implement': 'start',
  '/speckit:plan': 'start',
  '/speckit:resume': 'start',
  '/speckit:save': 'start',
  '/speckit:search': 'run',
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
  '/create:skill': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false },
  '/create:skill-parent': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false },
  '/create:with-human-voice': { policy: 'start', ownerSkillId: 'sk-doc', scorerRow: false },
  '/deep:ai-council': { policy: 'ask', ownerSkillId: 'system-deep-loop', scorerRow: false },
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
  '/doctor:skill-advisor embedder': { policy: 'ask', ownerSkillId: 'system-skill-advisor', scorerRow: true },
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

// A typed command is the reader's own wording, so it counts only where a command
// can start and where it ends on a boundary. That keeps a path such as
// `docs/create:goal.md` and a prefix such as `/create:sk` from reading as a
// command, and the longest key wins so `/create:skill-parent` is never reduced to
// its `/create:skill` prefix.
const COMMAND_START_BOUNDARY = /[\s`'"(]/;
const COMMAND_CONTINUATION = /[a-z0-9_:-]/;

export function typedCommandIn(prompt: string): string | undefined {
  const lowered = prompt.toLowerCase();
  let found: string | undefined;
  for (const key of Object.keys(TRACKED_COMMANDS)) {
    let index = lowered.indexOf(key);
    while (index !== -1) {
      const before = index === 0 ? '' : lowered[index - 1];
      const after = lowered[index + key.length] ?? '';
      const startsAtBoundary = before === '' || COMMAND_START_BOUNDARY.test(before);
      const endsAtBoundary = after === '' || !COMMAND_CONTINUATION.test(after);
      if (startsAtBoundary && endsAtBoundary) {
        if (found === undefined || key.length > found.length) found = key;
        break;
      }
      index = lowered.indexOf(key, index + 1);
    }
  }
  return found;
}

// A typed command travels on the recommendation that leads, so it is delivered
// only when the leading skill owns the command or carries the same command row.
// A leading skill unrelated to the command must not carry it.
export interface TypedCommand {
  readonly command: string;
  readonly policy: 'run' | 'start' | 'ask';
  readonly ownerSkillId: string;
}

export function typedCommandForTop(topSkillId: string, prompt: string): TypedCommand | undefined {
  const command = typedCommandIn(prompt);
  if (command === undefined || !Object.hasOwn(TRACKED_COMMANDS, command)) return undefined;
  const row = TRACKED_COMMANDS[command];
  const sameCommandRow = commandRowFor(topSkillId)?.command === command;
  if (topSkillId !== row.ownerSkillId && !sameCommandRow) return undefined;
  return { command, policy: row.policy, ownerSkillId: row.ownerSkillId };
}

// Deep-loop commands open a long, multi-pass run, so one attached to a prompt
// that merely mentions the topic spends the reader's budget on work they never
// asked for. The list below is the vocabulary that counts as asking for it, and
// it holds only effort wording: a bare topic word such as `research`, `review`
// or `council` says what to look at, never how far to go, so it never qualifies
// on its own.
//
// The phrases live in a data list, one per line, so the vocabulary a reviewer
// has to judge stays visible and cheap to correct.
export const DEPTH_WORDING: readonly string[] = [
  'in depth',
  'deep dive',
  'deep research',
  'deep review',
  'thorough',
  'thoroughly',
  'exhaustive',
  'iteratively',
  'multiple passes',
  'many passes',
  'several passes',
  'ask the council',
  'convene',
  'several models',
  'final verdict',
  'everything you can',
];

// A phrase may carry punctuation a regex would read as a metacharacter, so it is
// escaped before it is trusted as a pattern.
function escapePhrase(phrase: string): string {
  return phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// One alternation over the list keeps the gate a single test per prompt, and the
// boundary markers keep `thorough` from firing inside a longer word while a
// multi-word phrase still has to match as a whole.
const DEPTH_REQUEST = new RegExp(`\\b(?:${DEPTH_WORDING.map(escapePhrase).join('|')})\\b`);

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
  if (route.action !== 'route' || route.selectionKind !== 'single') return undefined;

  const targets = route.targets;
  if (!Array.isArray(targets) || targets.length !== 1) return undefined;

  const onlyTarget = asRecord(targets[0]);
  if (!onlyTarget) return undefined;

  const workflowMode = onlyTarget.workflowMode;
  if (typeof workflowMode !== 'string' || workflowMode === '') return undefined;

  // Own-key lookup on both levels: the table is data read from a generated
  // object, so an inherited name such as `constructor` must not resolve to a
  // command the hub never declared.
  if (!Object.prototype.hasOwnProperty.call(modeCommands, skillId)) return undefined;
  const commands = modeCommands[skillId];
  if (!Object.prototype.hasOwnProperty.call(commands, workflowMode)) return undefined;

  // Deep-loop commands are the ones that commit the reader to a long, multi-pass
  // run, so they are offered only when the prompt asks for that effort. Typing
  // the slash command is itself the ask, and every other hub answers a short
  // question with a short answer, so no other skill consults the wording list.
  if (skillId === 'system-deep-loop') {
    const lowered = prompt.toLowerCase();
    if (!lowered.includes('/deep:') && !DEPTH_REQUEST.test(lowered)) return undefined;
  }

  return commands[workflowMode];
}

// A hub that withholds its command because the prompt names no single mode must
// still tell the reader why no command came with it, and only a hub whose modes
// map to commands withholds one.
export function routeNeedsMode(skillId: string, compiledRoute: unknown): boolean {
  const route = asRecord(compiledRoute);
  if (!route) return false;
  if (route.action !== 'defer' && route.action !== 'clarify') return false;
  return Object.prototype.hasOwnProperty.call(MODE_COMMANDS, skillId);
}
