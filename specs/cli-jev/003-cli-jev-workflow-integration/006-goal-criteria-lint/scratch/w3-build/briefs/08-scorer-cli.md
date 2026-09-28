GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/code.md; focused summary for a one-change brief) ===
You are @code, a leaf implementer dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. Read each file before editing it and re-read the edited region after.
Standards: read .skilled/skills/sk-code/SKILL.md and follow the route it resolves for this file type.
Comment hygiene is a hard block: no spec paths, packet or phase numbers, or REQ/task ids in code comments. Keep the durable why.
Verification: run only the checks this brief lists. Fail closed: no retry loop, no workaround. Report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: code) ===

TASK: give the goal-lint scorer its command line (--labels, --lint, --root) and pin it with two tests that write synthetic fixture files to a temporary directory.
G = .skilled/skills/sk-doc/sk-create-goal/scripts. Edit only G/score-goal-lint.cjs and G/tests/score-goal-lint.test.cjs. Read both first, and G/lint-goal-criteria.cjs's parseLintArguments, main and direct-run guard (the pattern to mirror).

EDIT 1, G/score-goal-lint.cjs: add a `1. IMPORTS` section (same divider style) above CONSTANTS with `const fs = require('node:fs');` and `const path = require('node:path');` only.

EDIT 2, section 3 HELPERS: `getDefaultWorkspaceRoot()` returns path.resolve(__dirname, '../../../../../'). `parseLabels(text)` returns { rows, errors }: split String(text) on /\r?\n/u; skip a line whose trim() is ''; JSON.parse each other line; push it to rows when the result is a non-null object that is not an array, else push { line: index + 1, message: 'not a JSON object' } to errors; a parse failure pushes { line: index + 1, message: error.message }.

EDIT 3, section 4 CORE LOGIC, after formatScore, with JSDoc blocks:
- `parseScoreArguments(argv)` returns { labels: null, lint: null, root: null } filled from `--labels <file>`, `--lint <file>` and `--root <path>`, each path.resolve'd. A flag without a value throws Error(flag + ' requires a path'); any other argument throws Error('unknown option: ' + arg); a missing --labels throws Error('--labels is required').
- `main(argv)`: on a parse error print TAG + ' ERROR ' + message to stderr and return 2. Read the labels file; on failure print TAG + ' ERROR ' + options.labels + ': ' + message and return 2. parsed = parseLabels(text); print TAG + ' ERROR labels line ' + e.line + ': ' + e.message for each parse error and go on. Records: with options.lint, JSON.parse the file and take its `records` array (a read or parse failure, or no records array, prints TAG + ' ERROR ' + options.lint + ': ' + message, with 'no records array' as the message for the last case, and returns 2). Without it, `const { lintWorkspace } = require('./lint-goal-criteria.cjs')` inside main and use lintWorkspace(options.root || getDefaultWorkspaceRoot()).records. Print each formatScore(scoreLabels(parsed.rows, records)) line to stdout and return 0.
Add parseLabels, parseScoreArguments and main to the exports.

EDIT 4, after the EXPORTS section, a direct-run guard:
if (require.main === module) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error(TAG + ' ERROR ' + (error instanceof Error ? error.message : String(error)));
    process.exitCode = 2;
  }
}

EDIT 5, G/tests/score-goal-lint.test.cjs: require spawnSync (node:child_process), fs, os and path, import parseLabels too, and let SCORER = path.join(__dirname, '..', 'score-goal-lint.cjs'). Append two tests, spawning process.execPath with { encoding: 'utf8' }:
  7. 'the command line scores fixture labels from a saved lint run': dir = fs.mkdtempSync(path.join(os.tmpdir(), 'score-goal-lint-')); write dir/lint.json as JSON.stringify({ records: RECORDS }) and dir/labels.jsonl as LABELS.map((row) => JSON.stringify(row)).join('\n') + '\n'. [SCORER, '--labels', dir/labels.jsonl, '--lint', dir/lint.json] gives status 0 and a stdout line equal to 'labeled_violation_rate=3/4=0.7500 wilson95=[0.3006,0.9544]'. Then write dir/unlabeled.jsonl with two rows for hashes 'a1' and 'a2' whose rubric, rule4_ok, rule5_ok and labeler are null; the same call on it gives status 0, stdout lines including 'unlabeled=2' and 'no labeled rows', and no line starting with 'labeled_violation_rate'. Remove dir in a finally block.
  8. 'the command line refuses a missing labels flag and names a bad labels line': [SCORER] gives status 2 and stderr including '[score-goal-lint] ERROR --labels is required'. parseLabels('{"a":1}\n\nnot json\n[1]\n') gives rows deepEqual [{ a: 1 }] and errors.map((e) => e.line) deepEqual [3, 4].

VERIFY (repo root):
  node --check .skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs
  node .skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs; echo "exit=$?"
Accept when: 2 files changed and nothing else; node --check exits 0; the second command prints the '--labels is required' ERROR line and exit=2.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint
- Other workers edit other files in this tree at the same time. Touch only the files this brief names.
- The orchestrator runs the test suites, spec validation and every git commit after you return.
- Your sandbox may block test runners that open local sockets (tsx, vitest). Run only the checks listed here; the orchestrator runs the rest.

DON'T
- Edit, create or delete any file this brief does not name.
- Run a git command that writes (add, commit, stash, checkout, restore, reset, merge, rebase, push).
- Install anything (npm/pnpm/pip/brew install, npm ci) or touch node_modules.
- Open any .env file, print environment variables, or write a key or token into any file.
- Call jev, the local Deem server (127.0.0.1:8300) or any network service.
- Put spec paths, packet or phase numbers, or REQ/task ids in code comments.
- Reformat, reorder or "improve" anything outside the named edit.
- Ask a question. If a step cannot be done exactly as written, stop and report BLOCKED with the reason.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
