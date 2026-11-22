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
const MODE_SUFFIX = /^(?::(?:auto|confirm|autopilot|unattended|with-(?:context|phases|research)))+(?![a-z0-9_:-])/;

// A command that was renamed is still typed from habit. Its old name reads as
// the command that replaced it, so the reader lands on the live workflow and
// not on whatever skill the leftover words happen to score for. The old name
// gets no command file of its own: this table is the only place it lives.
const RETIRED_COMMANDS: Readonly<Record<string, string>> = {
  '/create:skill': '/create:sk-skill',
};

export function typedCommandIn(prompt: string): string | undefined {
  const lowered = prompt.toLowerCase();
  let found: string | undefined;
  for (const key of [...Object.keys(TRACKED_COMMANDS), ...Object.keys(RETIRED_COMMANDS)]) {
    let index = lowered.indexOf(key);
    while (index !== -1) {
      const before = index === 0 ? '' : lowered[index - 1];
      const after = lowered[index + key.length] ?? '';
      const next = lowered[index + key.length + 1] ?? '';
      const startsAtBoundary = before === '' || COMMAND_START_BOUNDARY.test(before);
      const hasModeSuffix = MODE_SUFFIX.test(lowered.slice(index + key.length));
      const continuesName =
        !hasModeSuffix
        && (COMMAND_CONTINUATION.test(after) || ((after === '/' || after === '.') && WORD_CHARACTER.test(next)));
      const endsAtBoundary = after === '' || !continuesName;
      if (startsAtBoundary && endsAtBoundary) {
        if (found === undefined || key.length > found.length) found = key;
        break;
      }
      index = lowered.indexOf(key, index + 1);
    }
  }
  if (found !== undefined && Object.hasOwn(RETIRED_COMMANDS, found)) return RETIRED_COMMANDS[found];
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
  if (commandOnlyMentioned(prompt, command)) return undefined;
  const row = TRACKED_COMMANDS[command];
  const sameCommandRow = commandRowFor(topSkillId)?.command === command;
  if (topSkillId !== row.ownerSkillId && !sameCommandRow) return undefined;
  return { command, policy: row.policy, ownerSkillId: row.ownerSkillId };
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
export const LOOP_WORDING: readonly string[] = [
  'deep research',
  'deep review',
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
const ITERATIVE_VERB = '(?:review|research|audit|investigate|inspect|check|scan|examine|analy[sz]e|look into|go over)';
export const ITERATIVE_ASK = new RegExp(
  `\\b(?:iterative|looped) ${ITERATIVE_ACTIVITY}\\b`
  + `|\\biteratively ${ITERATIVE_VERB}\\b`
  + `|\\b${ITERATIVE_VERB}\\b(?: [\\w./'-]+){0,6}? iteratively\\b`
  + '|\\b(?:in|over|through) (?:(?:several|multiple|many|a few|successive|repeated) )?iterations\\b'
  + '|\\b(?:several|multiple|(?<!\\bhow )many|a few|successive|repeated|more) iterations\\b',
);

// Passes and rounds are also things a prompt can be about, as in "three funding
// rounds" or "several rounds of layoffs", so they ask for the loop only when
// nothing but a loop word stands between the count and the noun, and an "of"
// after them names the review, the research or the target rather than another
// subject.
const PASS_GAP = '(?:(?:more|extra|additional|full|deep|review|research|audit|iterative) ){0,2}';
const PASS_NOUN = '(?:rounds|passes)\\b(?! of (?!(?:review|research|audit|investigation|the|it|this|that|these|those|my|our)\\b)[a-z])';

// More than one pass or round asks for the loop the way iterations do. "How
// many passes does it run" asks about the loop, so `many` counts only where no
// `how` stands before it.
export const MULTI_PASS = new RegExp(`\\b(?:multiple|several|(?<!\\bhow )many) ${PASS_GAP}${PASS_NOUN}`);

// An iteration count asks for the loop whether it is typed as a digit or spelled
// out, and a hyphen may join the two, as in "twelve-iteration". A pass or a
// round counts only from two up, because "one pass" asks for a single pass, and
// the singular counts only when hyphen-joined, as in "two-pass", because "3
// tests pass" uses it as a verb. A spelled count after a word that points back,
// as in "the first two iterations", names runs that already happened rather
// than asking for more.
const COUNT_WORDS = '(?<!\\b(?:first|last|previous|past|prior|earlier|those|these|the|both) )(?:two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|(?:a )?dozen)';
export const LOOP_COUNT = new RegExp(
  `\\b(?:\\d+|one|${COUNT_WORDS})[- ](?:[a-z-]+ ){0,2}?iterations?\\b`
  + `|\\b(?:[2-9]|\\d{2,}|${COUNT_WORDS})(?:-(?:rounds?|pass(?:es)?)\\b| ${PASS_GAP}${PASS_NOUN})`,
);

// A loop's own name is how a reader asks about the loop as often as how they ask
// to run one, so "how does the research loop decide when it has enough" stays a
// question. The name counts as asking for the run only behind a use verb, as in
// "start a research loop".
export const LOOP_NAMES: readonly string[] = [
  'deep loop',
  'research loop',
  'review loop',
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
export const DEFECT_CHECK = /\b(?:check|inspect|scan|examine|go over|look over)\b(?:\s+[\w./-]+){0,5}?\s+for\s+(?:[\w-]+\s+){0,2}?(?:bugs?|defects?|mistakes?|errors?|vulnerabilit(?:y|ies)|issues?|problems?|regressions?|flaws?)\b/;
export const MODE_CUES: Readonly<Record<string, RegExp>> = {
  research: /\b(?:research|investigat(?:e|es|ing|ion)|look into|find out)\b/,
  review: new RegExp(`\\b(?:review|audit)\\b|${DEFECT_CHECK.source}`),
};

// A run that is stuck, never converges or whose graph looks stale is a fault in
// an existing run, so it asks for a diagnosis rather than for a new run. The
// subject has to name a deep run or its state, because "my build is stuck" is
// not about the loop, and a use verb right before the subject turns it back
// into a request, as in "run deep research on why sockets hang". An audit loop
// is the review loop by another name, and "the review I started" names a run the
// reader launched, while "the test runner I started" names no deep run at all.
const LOOP_RUN_SUBJECT = /\b(?:deep[- ](?:research|review|loop)|(?:research|review|audit) (?:loop|run)|(?:research|review|audit)(?: (?:loop|run))? (?:i|we) (?:just )?(?:started|launched|kicked off|ran|began|set off|set up)|coverage graph|convergence)\b/;
// "keep going" asks for more of a run, so it is not among the symptoms, and
// "spinning up" starts a run rather than describing one that is stuck.
const LOOP_RUN_SYMPTOM = /\b(?:stuck|hangs?|hanging|hung|frozen|stalled|stalls|spins|spinning(?! up)|never (?:converges?|finishes|stops|ends|fires)|(?:not|isn't|is not|won't|will not|doesn't|does not|didn't|did not|can't|cannot|without) (?:converg\w*|finish\w*|progress\w*|mov\w*|fir\w*)|stopped (?:converg\w*|progress\w*|moving)|keeps? (?:running|repeating|looping)|stale|empty|(?:hasn't|has not|haven't|have not) (?:moved|changed|converged|progressed)|no progress)\b/;
const LOOP_RUN_REQUESTED = /\b(?:run|start|use|launch|kick off|do|rerun|re-run) (?:[a-z0-9'-]+ ){0,2}(?:deep[- ](?:research|review|loop)|(?:research|review|audit) (?:loop|run))\b/;

export function isStuckRunComplaint(text: string): boolean {
  const lower = text.toLowerCase().replace(/[‘’]/g, "'");
  return LOOP_RUN_SUBJECT.test(lower) && LOOP_RUN_SYMPTOM.test(lower) && !LOOP_RUN_REQUESTED.test(lower);
}

// A request to read, summarize or explain what a past run produced wants that
// output, not another run. A continue, resume or extend verb asks for the run
// again, so it keeps the offer.
const PAST_RUN_READ_VERB = /\b(?:summari[sz]e|summary|recap|explain|read|tell me|walk me through|go through|what did|show me|pull out|extract)\b/;
const PAST_RUN_OUTPUT = /\b(?:last|previous|prior|earlier|yesterday's|finished|completed) (?:[\w'-]+ ){0,2}?(?:deep[- ])?(?:research|review|loop|run)\b|\b(?:research|review(?:-report)?)\.md\b|\b(?:research|review) report\b|\bdeep[- ](?:research|review) (?:output|report|results|findings|produced|concluded|found|wrote)\b/;
const RUN_CONTINUED = /\b(?:continue|resume|extend|rerun|re-run|more iterations?|\d+ more)\b/;

export function isPastRunRead(text: string): boolean {
  const lower = text.toLowerCase().replace(/[‘’]/g, "'");
  return PAST_RUN_READ_VERB.test(lower) && PAST_RUN_OUTPUT.test(lower) && !RUN_CONTINUED.test(lower);
}

// Writing a piece about a loop method names the loop as a topic. The genre noun
// is what marks it, so "write up the findings" after a run still asks for one.
const WRITING_ABOUT_TOPIC = /\b(?:write|draft|compose|author|prepare|publish|outline)\b (?:[\w'-]+ ){0,3}?(?:blog(?: post)?|article|essay|newsletter(?: section| issue)?|tweet(?: thread)?|thread|post|talk|presentation|slides?|deck|tutorial|op-ed|piece|whitepaper|white paper|primer|explainer)s?\b (?:[\w'-]+ ){0,3}?(?:about|on|explaining|covering|describing|introducing|why|how)\b/;

export function isWritingAboutTopic(text: string): boolean {
  return WRITING_ABOUT_TOPIC.test(text.toLowerCase());
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

// A refusal or a question reaches its command through a use verb, so the two
// lists below share this one. A gap holds one or two plain words and no
// punctuation, because a comma ends the clause that holds the lead.
export const COMMAND_USE_VERB = '(?:run|start|use|invoke|launch|execute|call|trigger|open|rerun|re-run|kick off)';
export const COMMAND_GAP_WORDS = "(?:[a-z']+ ){0,2}";

// A loop name also asks for the run when the reader says they want one, as in
// "I'd like a research loop on X". The article has to follow the want verb at
// once, so "I'd like to know what a review loop is" stays a question.
const LOOP_WANT_LEAD = "(?:i'd like|i would like|we'd like|we would like|i want|we want|i need|we need|give me|set up|spin up)";

// One alternation over the loop wording keeps the gate a single test per
// prompt, and the boundary markers keep a phrase from firing inside a longer
// word while a multi-word phrase still has to match as a whole. An iterative
// ask, an iteration count, more than one pass, and a loop name behind a use
// verb or a want verb each ask for the loop, so they are appended raw as
// patterns beside the escaped vocabulary.
const LOOP_NAME_PATTERN = `(?:${LOOP_NAMES.map(escapePhrase).join('|')})`;
export const LOOP_REQUEST = new RegExp(
  `\\b(?:${LOOP_WORDING.map(escapePhrase).join('|')}`
  + `|${COMMAND_USE_VERB} (?:[a-z0-9'-]+ ){0,3}${LOOP_NAME_PATTERN}`
  + `|${LOOP_WANT_LEAD} (?:an?|another) (?:[a-z0-9'-]+ ){0,2}?${LOOP_NAME_PATTERN})\\b`
  + `|${ITERATIVE_ASK.source}|${MULTI_PASS.source}|${LOOP_COUNT.source}`,
);

// Loop wording also names a loop the reader is not asking to start: a past run
// whose output they want read, a stuck run they want diagnosed, or a method they
// want to write about. Both deep-loop offer paths read this one test, so the
// routed mode and the deferred mode cannot disagree on what counts as the ask.
export function asksForLoopRun(prompt: string): boolean {
  const lowered = prompt.toLowerCase();
  return LOOP_REQUEST.test(lowered)
    && !isPastRunRead(lowered)
    && !isStuckRunComplaint(lowered)
    && !isWritingAboutTopic(lowered)
    && !isLoopQuestion(lowered);
}

// A question about how the loop works names it the way a request to run it
// does, as in "how does the deep review decide it has converged". It asks for
// the run only when it also tells the loop to start or gives an iteration count.
// The loop has to be what the question is about, so "deep research: how do
// vector databases handle hybrid search" still asks for a run on that topic.
const LOOP_SUBJECT = '(?:[\\w\'-]+ ){0,2}?(?:deep[- ](?:research|review|loop)|(?:research|review) loop)\\b';
const LOOP_QUESTION = new RegExp(
  `\\b(?:how|why|when|what) (?:does|do|is|are|did|makes) ${LOOP_SUBJECT}`
  + `|\\b(?:explain|describe) (?:how|what|why|when) ${LOOP_SUBJECT}`,
);
// Only a digit count turns the question back into a request. The spelled count
// is left out on purpose, so a question that quotes one, as in "why does it stop
// after ten iterations", stays the question it was before spelled counts were
// read as a loop ask.
const ITERATION_COUNT = /\b\d+ (?:[a-z-]+ ){0,2}iterations?\b/;

function isLoopQuestion(lowered: string): boolean {
  return LOOP_QUESTION.test(lowered)
    && !LOOP_RUN_REQUESTED.test(lowered)
    && !ITERATION_COUNT.test(lowered);
}

// `why not` proposes the command rather than refusing it, so the word refuses
// only where no `why` stands before it.
const COMMAND_NOT_WORD = '(?<!\\bwhy )not';

// A command the reader refuses is named without being asked for, so this list
// holds the leads that mark that naming. A lead must sit directly before the
// command so a later clause cannot refuse an earlier request, and a gap holds
// plain words only so a refusal before a comma cannot swallow the request after
// it. A reader who stops using a command names it only to refuse it.
export const COMMAND_DECLINE_LEADS: readonly string[] = [
  `(?:do not|don't|dont|never|${COMMAND_NOT_WORD}|won't|wont|no longer|cannot|can't|no need to|need not|needn't) (?!(?:forget|hesitate|fail|mind)\\b)${COMMAND_GAP_WORDS}${COMMAND_USE_VERB} ${COMMAND_GAP_WORDS}`,
  `(?:skip|skipping|without|instead of|rather than|avoid|stop|stopped|quit|${COMMAND_NOT_WORD}) (?:(?!${COMMAND_USE_VERB}\\b)[a-z']+ ){0,2}`,
];

// A refusal or a question over an or-list covers every command the list joins,
// while a second use verb opens a clause of its own, so the list joins only `or`
// and `, or`. A listed command may carry `the` before it and
// `command` after it, and the command after the last `or` may carry `the`. A
// listed command may also carry one plain word after it, such as the subcommand a
// doctor command takes, so `do not run /x now or /y` refuses both.
const COMMAND_OR_LIST = '(?:(?:the )?\\/[a-z][a-z0-9_-]*(?::[a-z][a-z0-9_-]*)?(?: [a-z][a-z0-9_-]*)?(?: command)?,? or (?:the )?)*';

// A command the reader asks about is named without being asked for, so this list
// holds the leads that mark that naming. A lead must sit directly before the
// command so a later clause cannot turn an earlier request into a question, and
// a gap holds plain words only so a question before a comma cannot swallow the
// request after it.
export const COMMAND_ASK_LEADS: readonly string[] = [
  "(?:what does|what is|what's|what would|what will|what did|how does|how did|why does|why did|explain|describe|tell me what|tell me how|tell me about|tell me why|difference between|differ from|differs from|different from|undo what|ran|already ran|was running) (?:the )?(?:command )?",
  `(?:should i|should we|do i need to|when would i) ${COMMAND_USE_VERB} (?:the )?(?:command )?`,
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
const RUN_COMMAND_WITHDRAWN = /\?|\b(?:not|don't|dont|never|cancel|scratch that|hold off|wait|undo|is it|should i|nevermind|never mind)\b/;

function runCommandRequested(before: string, after: string, name: string): boolean {
  if (RUN_COMMAND_WITHDRAWN.test(after)) return false;
  return new RegExp(`(?:^|[.!?;:\\n] *)(?:(?:please|now|just|then|and) )*${name}$`).test(before)
    || new RegExp(`\\b${COMMAND_USE_VERB} ${COMMAND_GAP_WORDS}(?:the )?${name}$`).test(before);
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
    .replace(/[`*"\u201c\u201d[\]()~\u00ab\u00bb\u2032\u2039\u203a]/g, '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/(^|[^a-z0-9])'(?=\/[a-z])/g, '$1')
    .replace(/(\/[a-z][a-z0-9_-]*(?::[a-z][a-z0-9_-]*)*(?: [a-z][a-z0-9_-]*)?)'(?![a-z0-9])/g, '$1')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/ *\n\s*/g, '\n');
  const current = command.toLowerCase();
  const spellings = [current, ...Object.keys(RETIRED_COMMANDS).filter((retired) => RETIRED_COMMANDS[retired] === current)]
    .sort((left, right) => right.length - left.length);
  const name = `(?:${spellings.map(escapePhrase).join('|')})`;
  const runsWithoutAsking = TRACKED_COMMANDS[current]?.policy === 'run';
  const occurrences = [...text.matchAll(new RegExp(`(?:^|[^a-z0-9_/])${name}(?![a-z0-9_-]|[./][a-z0-9])`, 'g'))];
  if (occurrences.length === 0) return false;
  return occurrences.every((occurrence) => {
    const nameEnd = (occurrence.index ?? 0) + occurrence[0].length;
    const before = text.slice(0, nameEnd);
    const tail = text.slice(nameEnd);
    const clause = tail.split(/(?:^|[\s,;(])\/[a-z][a-z0-9_-]*(?::[a-z][a-z0-9_-]*)?(?![a-z0-9_\/-]|\.[a-z0-9])/)[0];
    if (COMMAND_DECLINED_BY_PRONOUN.test(clause)) return true;
    if (COMMAND_ASKED_BY_PRONOUN.test(clause)) return false;
    if (COMMAND_AS_DOCUMENT.test(tail) && !/\bthen\b/.test(clause)
      && new RegExp(`\\b(?:the|this|that) ${name}$`).test(before)) return true;
    const led = COMMAND_DECLINE_LEADS.some((lead) => (
      new RegExp(`(?:^|[^a-z0-9_/])${lead}${COMMAND_OR_LIST}${name}$`).test(before)
    )) || COMMAND_ASK_LEADS.some((lead) => (
      new RegExp(`(?:^|[^a-z0-9_/])${lead}${COMMAND_OR_LIST}${name}$`).test(before)
    ));
    if (led) return true;
    const bareLead = new RegExp(`(?:^|[^a-z0-9_/])${COMMAND_BARE_ASK_LEAD}${COMMAND_OR_LIST}${name}$`).test(before);
    if (!bareLead) return runsWithoutAsking && !runCommandRequested(before, tail, name);
    const sentenceEnd = tail.search(/[.!\n]/);
    const sentence = sentenceEnd === -1 ? tail : tail.slice(0, sentenceEnd);
    // A chat question often leaves the question mark off, so a bare ask word that
    // opens a sentence still asks about the command.
    return sentence.includes('?')
      || new RegExp(`(?:^|[.!?\\n] *)${COMMAND_BARE_ASK_LEAD}${COMMAND_OR_LIST}${name}$`).test(before);
  });
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
  if (skillId === 'system-deep-loop' && isStuckRunComplaint(prompt)) {
    return isNoEditRequest(prompt) || commandOnlyMentioned(prompt, DEEP_LOOP_DOCTOR_COMMAND)
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

  // A reader who rules out a change gets no command from either path, so the hub
  // route never offers what the scorer already withholds.
  if (isNoEditRequest(prompt)) return undefined;

  // Own-key lookup on both levels: the table is data read from a generated
  // object, so an inherited name such as `constructor` must not resolve to a
  // command the hub never declared.
  if (!Object.prototype.hasOwnProperty.call(modeCommands, skillId)) return undefined;
  const commands = modeCommands[skillId];
  if (!Object.prototype.hasOwnProperty.call(commands, workflowMode)) return undefined;

  // A route can pick the mode because the prompt named its command, so a naming
  // that refused or asked about the command must not produce the offer.
  if (commandOnlyMentioned(prompt, commands[workflowMode])) return undefined;

  // A correction inside one document is not a request for a creation workflow,
  // which scaffolds, reviews and validates a whole one.
  if (
    SMALL_EDIT_GATED_COMMANDS.has(commands[workflowMode])
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
    const typesThisCommand = typedCommandIn(prompt) === commands[workflowMode];
    if (!typesThisCommand && !asksForLoopRun(prompt)) return undefined;
  }

  return commands[workflowMode];
}

// The hub's router reads fixed phrases, so it defers on "run 8 more review
// iterations" though the prompt asks for the loop and names one mode. A loop
// request with exactly one mode cue names that mode as surely as a router
// phrase does, while a cue for both modes or for neither leaves the choice to
// the reader. The refusal and mention guards apply here as on a routed mode.
function deferredLoopCommand(
  skillId: string,
  prompt: string,
  modeCommands: Readonly<Record<string, Readonly<Record<string, string>>>>,
): string | undefined {
  if (!Object.prototype.hasOwnProperty.call(modeCommands, skillId)) return undefined;
  const lowered = prompt.toLowerCase();
  if (!asksForLoopRun(prompt) || isNoEditRequest(prompt)) return undefined;
  const commands = modeCommands[skillId];
  const cued = Object.keys(MODE_CUES).filter((mode) => (
    MODE_CUES[mode].test(lowered) && Object.prototype.hasOwnProperty.call(commands, mode)
  ));
  if (cued.length !== 1) return undefined;
  const command = commands[cued[0]];
  return commandOnlyMentioned(prompt, command) ? undefined : command;
}

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
