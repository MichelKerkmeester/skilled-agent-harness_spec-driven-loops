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

TASK: add the scorer's report lines, a pure function over labeled rows and per-arm results, plus its unit test. Two existing files. No em dash anywhere. Pure code only: no file I/O, no plugin import, no main.

FILE 1 .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs. Add a numbered section "REPORT" just before the EXPORTS section (renumber EXPORTS by one) and add summarizeArm and reportLines to module.exports. Keep every existing line unchanged.
Inputs: rows is an array of rows whose label is "met", "not_met" or "blocked". results is an array of the same length; results[i] is { heuristic, tail_window, parity }, each { verdict, category } where verdict is met, not_met, blocked or unclear and category is a reasonCategory key.
- summarizeArm(rows, results, arm) returns { table, falseMet, falseNotMet, labeledMet, rate, errors }:
  table[verdict][label] counts rows, for verdict in met, not_met, blocked, unclear and label in met, not_met, blocked.
  falseMet counts rows whose arm verdict is met and label is not met. falseNotMet counts rows labeled met whose arm verdict is not met (not_met, blocked and unclear all count). labeledMet counts rows labeled met. rate = labeledMet ? falseNotMet / labeledMet : 0.
  errors counts the falseNotMet rows by the arm's category, with keys too_short, blocking, truncated, no_completion, weak_link, other; any other category counts as other.
- reportLines(rows, results) returns these strings, arms in the order heuristic, tail_window, parity:
  `arm: <arm>`, then four lines `table: verdict=<v> label_met=<n> label_not_met=<n> label_blocked=<n>` for v = met, not_met, blocked, unclear, then
  `two_class: arm=<arm> false_met=<n> false_not_met=<n> labeled_met=<n> false_not_met_rate=<rate.toFixed(2)>` and `errors: arm=<arm> too_short=<n> blocking=<n> truncated=<n> no_completion=<n> weak_link=<n> other=<n>`. Once after the three arms:
  `clamp_defects: <n>`  rows whose heuristic category is truncated and whose tail_window category is not truncated
  `wrapper: held=<n>`  rows whose heuristic category is too_short or blocking
  `finding: goal-core answers not-met and unclear where the plugin answers not_met, so not-met maps to not_met and unclear keeps its own row`

FILE 2 .skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs. Append one test, keep the existing tests unchanged.
Test "reportLines prints three arms, the clamp count and the wrapper count":
rows = labels ['met', 'met', 'not_met', 'blocked'] as { id: 'r' + i, label }.
results, per row, as heuristic / tail_window / parity { verdict category }: r0 not_met truncated / met met / unclear truncated; r1 and r2 met met in all three arms; r3 not_met blocking in all three arms.
const lines = scorer.reportLines(rows, results); assert.equal(lines.length, 24);
assert.deepEqual(lines.slice(0, 7), [
'arm: heuristic',
'table: verdict=met label_met=1 label_not_met=1 label_blocked=0',
'table: verdict=not_met label_met=1 label_not_met=0 label_blocked=1',
'table: verdict=blocked label_met=0 label_not_met=0 label_blocked=0',
'table: verdict=unclear label_met=0 label_not_met=0 label_blocked=0',
'two_class: arm=heuristic false_met=1 false_not_met=1 labeled_met=2 false_not_met_rate=0.50',
'errors: arm=heuristic too_short=0 blocking=0 truncated=1 no_completion=0 weak_link=0 other=0']);
assert.equal(lines[7], 'arm: tail_window'); assert.equal(lines[14], 'arm: parity'); assert.equal(lines[12], 'two_class: arm=tail_window false_met=1 false_not_met=0 labeled_met=2 false_not_met_rate=0.00');
assert.equal(lines[18], 'table: verdict=unclear label_met=1 label_not_met=0 label_blocked=0');
assert.equal(lines[19], 'two_class: arm=parity false_met=1 false_not_met=1 labeled_met=2 false_not_met_rate=0.50');
assert.deepEqual(lines.slice(21, 23), ['clamp_defects: 1', 'wrapper: held=1']); assert.ok(lines[23].startsWith('finding: goal-core answers not-met and unclear'));

Accept when: 2 files changed (both existing), only additions plus the renumbered EXPORTS divider, and the checks below pass.
CHECKS (run exactly these; do not run node --test):
  node --check .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs
  node --check .skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs
  grep -c "clamp_defects" .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs     (expect 1 or more)

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
