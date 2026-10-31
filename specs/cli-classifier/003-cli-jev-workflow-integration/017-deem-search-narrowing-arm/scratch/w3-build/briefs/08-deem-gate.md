GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm

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

TASK: add the Deem availability gate behind --deem, with the --out refusal after a passing gate, and three vitest cases.
S = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs. T = .skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts. R = specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/briefs/ref-gates.mjs, a read-only reference copy of a sibling script's proven helpers. Read S, T and R first.

In S:
1. Add `import { spawnSync } from 'node:child_process';` with the node imports.
2. New section `7. DEEM ARM` before section 9. Exported constants DEEM_MODEL = 'deem-0.8-v1', DEEM_P50_MS = 65.6, HEALTH_TIMEOUT_MS = 10000, and `const REPO_CLI_DEEM = path.resolve(SCRIPT_DIR, '..', '..', '..', '..', 'cli-classifier', 'cli-deem', 'scripts', 'cli-deem.mjs');`.
3. Port from R, same behavior, with JSDoc: `which(name, env)` (module-private), `export function deemCommand(env)` (cli-deem on env.PATH, else [process.execPath, REPO_CLI_DEEM]), `export function readDeemHealth(cmd, env)` using HEALTH_TIMEOUT_MS and DEEM_MODEL, and `export function deemGate(ctx)` with ctx { out, env }. The printed lines stay exactly as R prints them: `deem: health backend=<b> model=<m> model_commit=<mc> source_commit=<sc>` on a pass; `deem arm skipped: <reason>` on a failure, followed by `deem: found=<JSON.stringify(found)>` when the reason is 'model' or 'bad health response'. The gate starts no server and passes no key.
4. In main, replace the `// Model arms run here` comment line with that comment plus:
   if (values.deem === true) { if (!summary.headroom) out('deem arm skipped: no headroom'); else { const deemCheck = deemGate({ out, env }); if (deemCheck.passed && (typeof values.out !== 'string' || values.out === '')) { err('--deem needs --out <dir> so every call is recorded'); return 2; } } }
   where env = deps.env ?? process.env. A failed gate leaves every other line exactly as the default run prints it, and the run still returns 0.

In T add describe('score-track-narrowing deem gate'). Each case: root = tempDir, ({ indexPath, probesPath } = smallCorpus(root)), deps = { repoRoot: root, indexPath, probesPath, hubNames: [], env: { ...process.env, PATH: `${stubs}${path.delimiter}${process.env.PATH}` } }, logs read as fs.readFileSync(path.join(stubs, 'cli-deem.log'), 'utf8').split('\n').filter(Boolean). HEALTHY = `if [ "$1" = health ]; then echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}'; exit 0; fi; exit 2`.
 1. 'skips a stub backend with the rest of the output byte-identical': stubs = stubDir({ 'cli-deem': `echo '{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}'` }); base = await runMain([], deps); run = await runMain(['--deem', '--out', tempDir('stn-out-')], deps). run.code 0; run.lines includes 'deem arm skipped: stub backend'; run.lines.filter((line) => line !== 'deem arm skipped: stub backend') equals base.lines; the cli-deem log equals ['health'].
 2. 'skips an unreachable server, a wrong model and a body that is not json': three stub dirs with bodies `echo '{"ok":false,"error":"Deem unreachable: ECONNREFUSED"}' >&2; exit 4`, `echo '{"ok":true,"backend":"torch","model":"deem-1.5","model_commit":"m1","source_commit":"s1"}'` and `echo 'not json'`; with --deem --out <tmp> each returns 0 and run.lines.filter((line) => !base.lines.includes(line)) equals ['deem arm skipped: not reachable'], ['deem arm skipped: model', 'deem: found="deem-1.5"'] and ['deem arm skipped: bad health response', 'deem: found="not json"'].
 3. 'refuses a passing gate without --out before any call': stubs = stubDir({ 'cli-deem': HEALTHY }); runMain(['--deem'], deps) gives code 2, an err line '--deem needs --out <dir> so every call is recorded', a line 'deem: health backend=torch model=deem-0.8-v1 model_commit=m1 source_commit=s1', and the cli-deem log equals ['health'].

VERIFY (repo root): node --check .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs
Accept when: 2 files changed and nothing else; node --check exits 0.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm
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
