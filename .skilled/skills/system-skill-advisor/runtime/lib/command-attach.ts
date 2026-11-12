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
