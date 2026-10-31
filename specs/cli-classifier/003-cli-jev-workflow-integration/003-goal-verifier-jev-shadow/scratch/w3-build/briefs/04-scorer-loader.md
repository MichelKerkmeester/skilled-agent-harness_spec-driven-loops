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

TASK: create the labeled-set scorer's row loader and verdict normalization, plus their unit test. Two new files. CommonJS, 'use strict', Node builtins only. No em dash anywhere. Later briefs add the arms and the CLI to the same file, so write only what is below: no main, no CLI, no plugin import.
Layout: box header with COMPONENT and PURPOSE lines as in .skilled/hooks/goal/lib/goal-core.test.cjs:1-9, numbered section dividers as in .skilled/hooks/goal/lib/goal-core.cjs:9-37 (1. IMPORTS, 2. CONSTANTS, 3. NORMALIZATION, 4. LOADER, 5. EXPORTS), JSDoc on each export.

FILE 1 .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs. module.exports = { normalizeLabel, normalizeVerdict, reasonCategory, loadRows }.
- normalizeLabel(value): undefined, null, or a string empty after trim returns "unlabeled". Otherwise, for a string, trim and lowercase it: "met" returns "met", "not_met" or "not-met" returns "not_met", "blocked" returns "blocked". Anything else, including any non-string, returns "invalid".
- normalizeVerdict(value): "met", "not_met", "blocked" and "unclear" return as is, "not-met" returns "not_met", anything else throws new Error(`unknown verdict: ${String(value)}`). The OpenCode plugin answers not_met and goal-core answers not-met or unclear, and unclear keeps its own value.
- reasonCategory(reason): exact strings map as follows, anything else returns "other".
  "Evidence is too short to prove completion" too_short
  "Evidence includes blocking or incomplete-work language" blocking
  "Evidence appears truncated before it proves completion" truncated
  "Evidence lacks an explicit completion signal" no_completion
  "Evidence does not reference the goal objective specifically enough" weak_link
  "Evidence gives an explicit completion signal tied to the goal objective" met
- loadRows(text): split on "\n", skip lines empty after trim, count lines from 1. Returns { total, labeled, unlabeled, sources: { claude, pi }, errors }, all counts starting at 0 and labeled and errors as arrays.
  A line JSON.parse rejects pushes `line ${n}: not JSON`. For a parsed row, ref is `row ${row.id}` when row.id is a string non-empty after trim, else `line ${n}`. The first failing check below pushes `${ref}: <message>` and drops the row:
  1 id is a string non-empty after trim: "id must be a non-empty string"
  2 id not seen on an earlier accepted row: "duplicate id"
  3 source is "claude" or "pi": "source must be claude or pi"
  4 objective is a string non-empty after trim: "objective must be a non-empty string"
  5 raw_text is a string: "raw_text must be a string"
  6 ingested_text is a string: "ingested_text must be a string"
  7 raw_length is an integer >= 0: "raw_length must be a non-negative integer"
  8 normalizeLabel(row.label) is not "invalid": `label "${String(row.label).slice(0, 20)}" is not met, not_met, not-met or blocked`
  An accepted row adds 1 to total and to sources[row.source]. Its label "unlabeled" adds 1 to unlabeled, any other label pushes { ...row, label: normalizeLabel(row.label) } to labeled.

FILE 2 .skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs (node:test, node:assert/strict, const scorer = require('./score-verifier-labeled-set.cjs')). Helper row(id, label) returns { id, source: 'pi', objective: 'Ship the widget exporter', raw_text: 'r', ingested_text: 'r', raw_length: 1, label }; lines are JSON.stringify(row) joined by "\n".
Test 1 normalizeLabel: 'met' met, 'not-met' not_met, ' NOT_MET ' not_met, 'blocked' blocked, '' unlabeled, undefined unlabeled, 'unclear' invalid, 'done' invalid.
Test 2 normalizeVerdict: 'not-met' not_met, 'unclear' unclear, 'met' met, and 'maybe' throws /unknown verdict: maybe/.
Test 3 reasonCategory: each of the six strings above gives its key, and 'Verifier returned no usable result' gives 'other'.
Test 4 loadRows on rows r1 'met', r2 '', r3 'not-met': total 3, labeled.length 2, labeled[1].label 'not_met', unlabeled 1, sources deepEqual { claude: 0, pi: 3 }, errors deepEqual [].
Test 5 loadRows on lines: row r1 'met', row r1 'met' again, the text '{bad', row r3 'done', and row r4 'met' with raw_text deleted. errors deepEqual ['row r1: duplicate id', 'line 3: not JSON', 'row r3: label "done" is not met, not_met, not-met or blocked', 'row r4: raw_text must be a string'].

Accept when: 2 files changed, both new, and the checks below pass.
CHECKS (run exactly these; do not run node --test):
  node --check .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs
  node --check .skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs
  grep -c "unknown verdict" .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs     (expect 1 or more)

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
