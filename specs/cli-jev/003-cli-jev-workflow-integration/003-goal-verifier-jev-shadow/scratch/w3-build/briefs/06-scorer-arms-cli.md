GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow

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

TASK: add the three zero-call arms and the command line to the scorer, plus CLI tests. Two existing files. No em dash anywhere. Keep existing lines, except numbered dividers you shift.

FILE 1 .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs.
- IMPORTS: add node:fs, node:os, node:path, pathToFileURL from node:url, and const core = require('./goal-core.cjs').
- CONSTANTS: PLUGIN_PATH = path.join(__dirname, '..', '..', '..', 'plugins', 'opencode-goal.js') (the OpenCode goal plugin through the .skilled/plugins link), TAIL_WINDOW_CHARS = 1200 (the plugin's evidence cap), MIN_ROWS = 30.
- Section ARMS after LOADER. async runArms(rows) returns, per row, { heuristic, tail_window, parity }, each { verdict: normalizeVerdict(result.verdict), category: reasonCategory(result.reason) }.
  plugin = await import(pathToFileURL(PLUGIN_PATH).href). If it throws, throw an Error with code 'PLUGIN_LOAD' and message `cannot load the goal plugin at ${PLUGIN_PATH}: ${error.code || error.message}. Where .opencode/node_modules is absent, run node with --preserve-symlinks`.
  helpers = plugin.default.__test. stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'goal-verifier-score-')), removed by fs.rmSync(stateDir, { recursive: true, force: true }) in a finally.
  For row i, arm heuristic then tail_window: sessionID = `score-${arm}-${i}`, evidence = row.ingested_text (heuristic) or row.raw_text.slice(-TAIL_WINDOW_CHARS) (tail_window), then
    const goal = await helpers.setGoal(sessionID, row.objective, { stateDir, nowMs: 1000, goalIdFactory: () => `${sessionID}-goal` });
    await helpers.writeGoalAtomic({ ...goal, lastEvidence: evidence }, { stateDir, maxEvidenceChars: TAIL_WINDOW_CHARS });
    const result = await helpers.maybeVerifyGoal(sessionID, { stateDir, verifierMode: 'heuristic' });
  parity: result = core.verifyGoalHeuristic({ goal: { objective: row.objective }, transcriptText: row.raw_text }).
- Section MAIN before EXPORTS. async main(argv) returns an exit code, writing each line with process.stdout.write or process.stderr.write plus "\n".
  Flags --set <file> (required) and --out <dir> (optional). Return 2 with one stderr line: unknown flag "error: unknown flag <flag>", no --set "error: --set <file> is required", unreadable file "error: cannot read <file>".
  loaded = loadRows(text). If loaded.errors is not empty, print each as "error: <message>" to stderr and return 1.
  lines = [`scorer: rows=${loaded.total} labeled=${loaded.labeled.length} unlabeled=${loaded.unlabeled} claude=${loaded.sources.claude} pi=${loaded.sources.pi}`]. Under MIN_ROWS labeled rows push "stop: fewer than 30 rows", else push ...reportLines(loaded.labeled, await runArms(loaded.labeled)). A thrown error prints "error: <message>" and returns 2 for code PLUGIN_LOAD, 1 otherwise.
  Print lines to stdout. With --out: fs.mkdirSync(out, { recursive: true }) and write lines.join("\n") + "\n" to path.join(out, 'zero-call-report.txt'). Return 0.
  Add runArms and main to module.exports. Last line of the file: if (require.main === module) main(process.argv.slice(2)).then((code) => { process.exitCode = code; });

FILE 2 .skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs. Append tests, keep existing ones. Temp dirs via mkdtempSync, removed in finally.
run(args, env) = spawnSync(process.execPath, ['--preserve-symlinks', SCORER, ...args], { encoding: 'utf8', env: env || process.env }). Comment why: with the linked plugin path kept, @opencode-ai/plugin resolves from .skilled/node_modules, also in a worktree without .opencode/node_modules.
makeRow(id, raw, label) = { id, source: 'pi', objective: 'Ship the widget exporter', raw_text: raw, ingested_text: core.redactEvidence(raw), raw_length: raw.length, label }, core = require('./goal-core.cjs'). A set is its rows as JSONL in a file.
GOOD = 'The widget exporter shipped and the tests passed for the widget exporter.' BLOCKING = 'The widget exporter build failed with an error in the packaging step today.'
CLAMP = 'lorem ipsum dolor sit amet '.repeat(60).slice(0, 1300 - GOOD.length - 1) + ' ' + GOOD, and assert CLAMP.length === 1300.
SET30 = makeRow('c1', CLAMP, 'met'), makeRow('b1', BLOCKING, 'not_met'), then 28 rows makeRow('g' + i, GOOD, 'met').
Test A: 29 GOOD rows labeled 'met' plus 5 GOOD rows labeled '': status 0, stdout === 'scorer: rows=34 labeled=29 unlabeled=5 claude=0 pi=34\nstop: fewer than 30 rows\n'.
Test B: SET30 with '--jev', then with '--deem': status 2 each, stderr contains 'error: unknown flag --jev', then 'error: unknown flag --deem'.
Test C: SET30 with '--out', dir, and env PATH = stub + delimiter + process.env.PATH, where stub holds files jev and cli-deem (mode 0o755), each '#!/bin/sh\necho "$*" >> "$(dirname "$0")/<name>.log"\n'. Status 0. stdout lines include each of
  'table: verdict=not_met label_met=1 label_not_met=1 label_blocked=0'
  'two_class: arm=heuristic false_met=0 false_not_met=1 labeled_met=29 false_not_met_rate=0.03'
  'errors: arm=heuristic too_short=0 blocking=0 truncated=1 no_completion=0 weak_link=0 other=0'
  'two_class: arm=tail_window false_met=0 false_not_met=0 labeled_met=29 false_not_met_rate=0.00'
  'clamp_defects: 1' and 'wrapper: held=1'. 'table: verdict=unclear label_met=1 label_not_met=0 label_blocked=0' comes after 'arm: parity'. stub/jev.log and stub/cli-deem.log do not exist. dir/zero-call-report.txt equals stdout.

Accept when: 2 files changed (both existing) and the checks below pass.
CHECKS (run exactly these; do not run node --test or the scorer):
  node --check .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs
  node --check .skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs
  grep -c "PLUGIN_LOAD" .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs     (expect 2 or more)

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow
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
- Read ~/.pi, ~/.claude or any session or transcript file. The tests build their own fixtures.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
