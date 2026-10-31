GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge

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

TASK: make an empty or missing reply file cost only that reply its baseline, instead of stopping the whole census.
Why: the committed runs hold five empty reply files (failed generations), and `score.mjs` refuses a whole replies directory when one reply is empty or missing, so the census exits 2 on real data. score.mjs scores each case's reply on its own, so a stand-in text for the unusable file changes no other reply's scores.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (exists)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists)
Read S and T in full first. Change only what the steps name. Same style as S.

STEP 1. In S section 1, add exported `CASES_PATH = path.join(SCRIPT_DIR, 'cases.json')` below `RUBRIC_PATH`, with a one-line JSDoc.

STEP 2. Rewrite the body of `runBaseline(repliesDirs)` (keep its name and return type) and its JSDoc. For each dir in order: make `tmp` as today; create `tmp/replies`; for each case `id` of `JSON.parse(fs.readFileSync(CASES_PATH, 'utf8')).map((c) => c.id)`: when `dir/<id>.md` exists and its text is non-empty after trim, copy that text to `tmp/replies/<id>.md`; otherwise write `'placeholder for an empty or missing reply\n'` there and remember the id as a stand-in. Copy `dir/<id>.meta.json` beside it when it exists. Spawn `score.mjs` exactly as today but with `--replies` set to `tmp/replies`. On a non-zero status throw the same `score.mjs failed on ${dir}: ...` error as today. For every row of `[...rows, ...noOps]`, take `id = path.basename(row.replyFile, '.md')`, skip stand-in ids, and set key `path.resolve(dir, \`${id}.md\`)` to `row.dimensionScores`. Remove tmp in the `finally` as today. A comment says why: a stand-in keeps score.mjs from refusing the directory, and its row is dropped, so no reply is ever scored without its own text.

STEP 3. In `summaryLines`, accept an extra input `noBaseline` (a number, default 0) and add the line `` `no baseline: ${noBaseline}` `` directly after the `unmatched:` line. When `labelsInfo` is not null, the labels line becomes `` `labels: rows=${rows} sha256=${sha256} unmatched=${unmatchedRows} no_baseline=${labelsInfo.noBaselineRows ?? 0}` ``.

STEP 4. In `main`: when building `baseline`, a matched SHA whose reply file has no scores no longer returns 2. Count it in `noBaseline` and leave it out of `baseline`. Then build `labeled` as `joined.labeled` without the SHAs missing from `baseline`, count the dropped ones as `noBaselineRows`, pass that `labeled` to `summaryLines`, add `noBaselineRows` to `labelsInfo`, and pass `noBaseline`. Remove the `score.mjs gave no scores for` error path.

STEP 5. In T:
a. Test 8 (the one deleting `C1.md` and expecting a throw) becomes: delete `C1.md` and empty `C2.md` in the fixture's first replies dir; `runBaseline([thatDir])` returns a Map of size 5 without the `C1.md` and `C2.md` paths. Keep its title meaningful.
b. New test: write `'{not json'` to `C3.meta.json` in the first replies dir; `runBaseline([thatDir])` throws `/score\.mjs failed on/`.
c. New test: in `makeFixture()`, before calling `run`, overwrite `r1/C1.md` and the one masked file that carries it (`m1/C1-A.md`) so the reply text is empty: write `'\n'` to `r1/C1.md` and `'Case: C1\n\nPrompt for C1\n\nReply A:\n\n\n'` to `m1/C1-A.md`. The default run exits 0, its lines include `matched: 21` and `no baseline: 1`, and the last line is `stop: fewer than 20 labeled replies`.
d. Wherever an existing test asserts the exact first lines of a default run, keep it passing; a `no baseline: 0` line now follows `unmatched: 0`.

Accept when: 2 files changed (S and T), no other file changed, both pass `node --check`, and `grep -c "score.mjs gave no scores" S` prints 0.
Checks you run: `node --check S`, `node --check T`, that grep. Do not run `node --test`: the orchestrator runs it.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge
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
