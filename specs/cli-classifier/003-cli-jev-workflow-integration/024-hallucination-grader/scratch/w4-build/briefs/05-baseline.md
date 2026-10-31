GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader

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

TASK: add the model-state builder and the deterministic baseline to the D4 agreement script, with three tests. 2 files.
S = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
T = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts
Read first: S, T, S's sibling deterministic/hallucination-flag.cjs (the check you spawn; do not edit it), and section 4 of specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/scratch/w4-build/design.md (implement ONLY section 4).

STEP 1. In S, insert a new section after `// 4. LABELS` (after `sha256Hex`) and before the EXPORTS divider: divider `// 5. BASELINE`; renumber EXPORTS to `// 6. EXPORTS`. Add, with JSDoc each:
- `buildState(fixture, outputText)`: sections joined by `\n\n`: `Task:\n<task>` only when `typeof fixture.task === 'string'`; `Visible spec:\n<visibleSpec>` only when `typeof fixture.visibleSpec === 'string'`; `Allowlist:\n<JSON.stringify(fixture.allowlist)>` only when the fixture has an own `allowlist` property; then always `Output:\n<outputText>`.
- `deterministicCall(fixture, outputPath)` exactly as design section 4: temp dir via `fs.mkdtempSync(path.join(os.tmpdir(), 'd4-check-'))`, write `{ id: fixture.id, allowlist: fixture.allowlist || {} }` to `fixture.json` there, spawnSync `process.execPath` with `[HALLUCINATION_CHECK, <that json>, outputPath]`, `{ encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }`, remove the temp dir in `finally`. On `res.error` or `res.status !== 0` throw `deterministic check failed on <path.basename(outputPath)>: <res.stderr trimmed, or 'exit ' + res.status when empty>`. Parse trimmed stdout; when parsing fails or `score` is not a finite number throw `deterministic check failed on <basename>: unparseable result`. Return `'yes'` when score < 1, else `'no'`. A comment says the check runs unchanged and a failure stops the run because a default score would fake the baseline.
- `chooseBaseline(rows)` exactly as design section 4 (rows `{ file, label, check }`; majorityClass `'yes'` only when yes labels outnumber no labels; method `'check'` when checkRight >= majorityRight; calls Map file -> chosen call).
- Add `buildState, deterministicCall, chooseBaseline` to the end of `module.exports`.

STEP 2. In T add `//   Deterministic baseline (buildState, deterministicCall, chooseBaseline)` to the MODULE header list, and append a block `describe('score-d4-agreement baseline', ...)` with three it():
1. 'reads an unlisted flag as yes and an allowlisted flag as no': `const fixtures = d4.loadFixtures(writeFixtures()); const dir = writeOutputs([]); const file = path.join(dir, 'fx-a.md'); fs.writeFileSync(file, 'Run: tool --dry-run\n');` then `d4.deterministicCall(fixtures.byId.get('fx-a'), file)` is `'no'` and `d4.deterministicCall(fixtures.byId.get('fx-b'), file)` is `'yes'`.
2. 'keeps the check on a tie and takes the majority class when the check does worse': `d4.chooseBaseline([{ file: 'a', label: 'yes', check: 'no' }, { file: 'b', label: 'no', check: 'no' }])` has method 'check', right 1, majorityClass 'no'. `d4.chooseBaseline([{ file: 'a', label: 'yes', check: 'yes' }, { file: 'b', label: 'no', check: 'yes' }, { file: 'c', label: 'no', check: 'no' }, { file: 'd', label: 'no', check: 'yes' }])` has method 'majority', checkRight 2, majorityRight 3, right 3, and `[...calls.values()]` equal `['no', 'no', 'no', 'no']`.
3. 'builds the state from the task, the visible spec, the allowlist and the output': for fx-a and text 'X' the result is `'Task:\nWrite add(a, b).\n\nVisible spec:\nadd(1, 2) is 3\n\nAllowlist:\n{"cli_flags":["--dry-run"],"symbols":["add"]}\n\nOutput:\nX'`; for fx-c it is `'Output:\nX'`.

VERIFY (repo root; paste each command, its result line and exit code):
  node --check .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
  grep -c "// 6. EXPORTS" .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs   (expect 1)
  grep -c "describe('score-d4-agreement baseline'" .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts   (expect 1)
Accept when: 2 files changed (S and T) and nothing else; each check prints what it expects.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader
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
