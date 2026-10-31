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

TASK: add the entry point that runs the zero-call census end to end, with integration tests.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (exists)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists)
Read S and T in full first, then `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` lines 1882-1920 (the `main(argv, deps)` shape to follow). Keep every existing line unchanged except the two JSDoc lines in STEP 0. Same style as S.

STEP 0. In S section 5, replace `/** Fixed margin M the keep rule reads. */` with `/** The 10-point gain over the baseline that the keep rule requires. */`, and replace `/** Kill, margin, sign and flip thresholds restated for the report reader. */` with `/** Every keep-rule check in its order, restated for the report reader. */`.

STEP 1. In S, append section `9. ENTRY POINT` after section 5 (sections 6 to 8 come later and go between them). Add:
- exported constant `USAGE = 'usage: node judge-agreement.mjs --masked <dir>... --replies <dir>... [--labels <file>] [--jev] [--deem] [--out <dir>] [--accept-payload]'`.
- `export async function main(argv, deps = {})`, returning the exit code. Defaults: `repoRoot` REPO_ROOT, `out` writes the line plus `'\n'` to stdout, `err` the same to stderr, `env` process.env, `timeoutMs` 90000, `backoffMs` 2000. Steps in order:
 1. `parseArgs({ args: argv, strict: true, allowPositionals: false, options: { masked: { type: 'string', multiple: true }, replies: { type: 'string', multiple: true }, labels: { type: 'string' }, deem: { type: 'boolean' }, jev: { type: 'boolean' }, out: { type: 'string' }, 'accept-payload': { type: 'boolean' } } })`. A throw: `err(message)`, return 2.
 2. No `--masked` or no `--replies`: `err(USAGE)`, return 2.
 3. `--deem` or `--jev` without a non-empty `--out`: `err('--deem and --jev need --out <dir> so every call is recorded')`, return 2. This runs before any file is read.
 4. In one try block: `dimensions = loadRubric()`, `census = buildCensus(masked, replies)`, `scores = runBaseline(replies)`, `labelsText` from `--labels` via `fs.readFileSync(file, 'utf8')` or `null`, `rows` from `parseLabels` or `[]`, `joined = joinLabels(rows, census, repoRoot)`. Any throw: `err(error.message)`, return 2.
 5. When `joined.conflict`: `out('stop: label conflict')`, `err(joined.conflict)`, return 2.
 6. `baseline`: a Map over each unique `sha` of `census.maskedFiles` that `census.replyBySha` holds, to `baselineLevels(scores.get(path.resolve(reply.file)), ids)`. A missing score: `err(\`score.mjs gave no scores for ${reply.file}\`)`, return 2.
 7. `summaryLines({ census, dimensionIds: ids, questionsSha: questionSetSha(dimensions), baseline, labelsInfo, labeled: joined.labeled })`, labelsInfo `null` or `{ rows: rows.length, sha256: sha256Hex(labelsText), unmatchedRows: joined.unmatchedRows }`. Print every line with `out`. Return 0.
 A comment above `main` says the default run writes no file and spawns no model binary, so its stdout is the same on every run.
- Last lines of the file: `if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) { process.exitCode = await main(process.argv.slice(2)); }`.

STEP 2. In T, add helper `run(argv, env)`: calls `main(argv, { out, err, env })` with `out` and `err` pushing to arrays, returns `{ code, lines, errors }`. Then five tests, each on `makeFixture()` plus `makeStubBin(fixture.root)`, env `stubEnv(fixture.root)`, args `--masked m1 --masked m2 --replies r1 --replies r2 --replies r3` (absolute paths):
19. Default run: code 0, lines start `['masked: 28', 'distinct: 21', 'matched: 21', 'unmatched: 0']`, include `labels: none` and `labeled: 0`, end with `stop: fewer than 20 labeled replies`; `readStubLog(root)` is `[]`; and the fixture root holds the same entry names before and after.
20. `--deem` without `--out`: code 2, `lines` is `[]`, errors include the `--out` message, stub log `[]`.
21. A labels file whose one row drops `tone`: code 2, lines `[]`, an error matching `/labels row 1: missing dimension tone/`.
22. Two label rows for `m1/C1-B.md` and `m2/C1-A.md` with one grade different: code 2, lines `['stop: label conflict']`.
23. `node judge-agreement.mjs --masked <m1>` (no `--replies`) spawned with `spawnSync(process.execPath, ...)`: status 2 and stderr includes `usage:`.

Accept when: 2 files changed (S and T), no other file changed, both pass `node --check`, and `grep -c "^export async function main" S` prints 1.
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
