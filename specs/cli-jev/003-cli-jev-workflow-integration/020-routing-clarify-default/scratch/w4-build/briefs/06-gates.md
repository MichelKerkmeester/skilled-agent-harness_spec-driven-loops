GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default

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

TASK: add the `--jev` and `--deem` switches with their gates to score-clarify-default.cjs. A gate that fails prints skip lines and exits 0. No arm runs yet. Plus four tests with stub binaries.

FILE 1 (edit): .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs
a. New section `8. GATES` between VERDICT and CLI. Renumber CLI to 9 and EXPORTS to 10. IMPORTS gains `const { spawnSync } = require('child_process');`.
b. CONSTANTS, append: `JEV_VERSION = 'jev 0.6.2'`, `DEEM_MODEL = 'deem-0.8-v1'`, `HEALTH_TIMEOUT_MS = 2000`, `JEV_TIMEOUT_MS = 90000`, `REPO_CLI_DEEM = '.skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs'`.
c. GATES: port these five functions from `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` to CommonJS, same logic and the same printed lines, JSDoc kept: `which` (lines 1359-1373), `jevGate` (1381-1411; its version and auth spawns use `timeout: JEV_TIMEOUT_MS`), `deemCommand(env, repoRoot)` (1418-1422; the fallback is `[process.execPath, path.join(repoRoot, REPO_CLI_DEEM)]`), `readDeemHealth` (1431-1487; `timeout: HEALTH_TIMEOUT_MS`), `deemGate(ctx)` (1494-1506; `ctx` also carries `repoRoot`, passed to `deemCommand`). `which` needs `fs.statSync`, `fs.accessSync`, `fs.constants.X_OK` and `path.delimiter`.
d. CLI. `parseArgs` gains `jev: false`, `deem: false`, `out: null`: the flags `--jev` and `--deem` take no value, `--out <dir>` does. After the loop: `--jev` or `--deem` without `--score` sets `error = '--jev and --deem need --score <file>'`. USAGE ends ` | --score <rows file> [--jev] [--deem] [--out <dir>]`. `main` gains `env = deps.env || process.env`. In `main`, directly after the `args.error` check and before any other work: when `args.jev` or `args.deem` is set and `args.out` is not, `err('error: --jev and --deem need --out <dir>')` and return 2, so stdout stays empty. `runScoreCommand` receives `env`. After it prints the `headroom:` line: when `args.jev`, run `jevGate({ out, env })`; then when `args.deem`, run `deemGate({ out, env, repoRoot })`. Jev runs before Deem, and a failed gate never starts the other backend: each runs only behind its own switch. Return 0. When `no headroom` or the label-gate stop prints, neither gate runs.
e. EXPORTS gains `which, jevGate, deemCommand, readDeemHealth, deemGate`.

FILE 2 (edit): the test file. Add helper `makeStubs(opts = {})`: a fresh `fs.mkdtempSync` dir holding executable (`fs.chmodSync(file, 0o755)`) `/bin/sh` scripts `cli-deem` and, unless `opts.jev === false`, `jev`. Each first appends `<name> $*` to `"$STUB_LOG"`. `jev`: `--version` echoes `${STUB_JEV_VERSION:-jev 0.6.2}`; `auth status` exits `${STUB_AUTH_EXIT:-0}`; `auth test` echoes `{"model":"stub-jev-model"}`. `cli-deem`: `health` with `${STUB_HEALTH:-ok}` = `ok` echoes `{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"mc1","source_commit":"sc1"}`, `stub` echoes the same with `"backend":"stub"`, `down` writes `{"error":"unreachable"}` to stderr and exits 4. For `choice`, both read stdin into `text`; `*fail*` exits 1; a set `STUB_CHOICE_EXIT` exits with it; the key is the token after `first=` when `STUB_PICK=first`, else after `pick=` (use `sed -n 's/.*pick=\([^ ]*\).*/\1/p'`); print `{"answers":{"answer":{"choice":"<key>","probabilities":{"<key>":0.9}}},"model":"stub-jev-model"}`. Any other first argument exits 2. Returns `{ dir, log }`. Helper `runWithStubs(stubs, args, extraEnv = {})` = `spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', env: { PATH: stubs.dir + ':/usr/bin:/bin', STUB_LOG: stubs.log, ...extraEnv } })`. Helper `withoutLines(text, drop)` removes lines found in `drop`. Append four tests, each on 30 `'second'` rows:
16. `--deem without --out exits 2 before any output`: status 2, stdout `''`.
17. `a stub or unreachable deem backend skips the arm and leaves the rest byte-identical`: `base` = no switch. With `--deem --out <tmp>` and `STUB_HEALTH=stub`: status 0, stdout includes `deem arm skipped: stub backend`, `withoutLines(stdout, ['deem arm skipped: stub backend'])` equals `base.stdout`. With `STUB_HEALTH=down`: includes `deem arm skipped: not reachable`.
18. `a jev without a credential prints its identity and one skip line`: `--jev --out <tmp>`, `STUB_AUTH_EXIT=3`. stdout includes `jev: path=<dir>/jev provider=official` and `jev arm skipped: no credential`; without those two lines it equals `base.stdout`.
19. `jev off PATH and a wrong jev version each skip`: `makeStubs({ jev: false })` prints `jev: path=none provider=official` and `jev arm skipped: jev not on PATH`. `STUB_JEV_VERSION='jev 0.5.0'` prints `jev arm skipped: version` and `jev: found="jev 0.5.0" path=<dir>/jev`.

Accept when: 2 files changed, `node --check` passes on both, and `grep -c "^test(" <test file>` prints 19.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/020-routing-clarify-default
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

Checks to run: `node --check` on both files, and `grep -c "^test(" .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs`.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
