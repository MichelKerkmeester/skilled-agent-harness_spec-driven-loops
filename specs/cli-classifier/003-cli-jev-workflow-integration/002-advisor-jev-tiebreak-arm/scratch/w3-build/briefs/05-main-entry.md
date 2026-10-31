GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm

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

TASK: add the entry point, main(argv, deps), and the direct-run guard, with a default-run test that proves no model binary is spawned.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read both first.

In the script:
1. Add realpathSync to the node:fs import and add `import { parseArgs } from 'node:util';`.
2. After summarizeCensus add `export async function main(argv, deps = {})` with a JSDoc block naming deps.census (a pre-scored census, default loadCensus()), deps.out (a line writer, default writes the line plus '\n' to stdout), deps.env (default process.env) and deps.timeoutMs (default 90000). Body:
   a. Parse argv with parseArgs({ args: argv, strict: true, allowPositionals: false, options: { jev: { type: 'boolean' }, deem: { type: 'boolean' }, out: { type: 'string' } } }) in a try block. On a parse error write `${error.message}\n` to stderr and return 2.
   b. const out = deps.out ?? ((line) => process.stdout.write(`${line}\n`)); const census = deps.census ?? await loadCensus();
   c. const summary = summarizeCensus(census); call out(line) for each summary line. Return 1 when summary.voided, otherwise return 0.
3. At the very end of the file add the guard, so importing the module never runs it:
   if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
     process.exitCode = await main(process.argv.slice(2));
   }

In the vitest file add main to the import, add existsSync, mkdtempSync, rmSync and writeFileSync from 'node:fs', tmpdir from 'node:os', delimiter, dirname, join and resolve from 'node:path', spawnSync from 'node:child_process' and fileURLToPath from 'node:url'. Add const SCRIPT = resolve(dirname(fileURLToPath(import.meta.url)), '../../scripts/routing-accuracy/score-jev-tiebreak.mjs'). Add describe('score-jev-tiebreak entry point') with:
1. main(['--bogus']) resolves to 2.
2. With const lines: string[] = [] and out = (l: string) => lines.push(l): main([], { census: synthCensus(), out }) resolves to 0 and lines equal summarizeCensus(synthCensus()).lines; main([], { census: synthCensus(52), out }) resolves to 1 with last line 'baseline mismatch: comparison void'.
3. it('default run prints the census and spawns no model binary', ..., 120_000): stub = mkdtempSync(join(tmpdir(), 'jev-tiebreak-stub-')). For name of ['jev', 'cli-deem'] write join(stub, name) with mode 0o755 and content `#!/bin/sh\necho "$*" >> "${join(stub, name)}.log"\n`. Run spawnSync(process.execPath, [SCRIPT], { encoding: 'utf8', timeout: 110_000, env: { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}` } }). Expect status 0; stdout lines include one starting 'census: file=labeled rows=177 ', one starting 'census: file=holdout rows=64 ', exactly 'baseline: holdout_top1=53/70', one starting each of 'comparator: name=scorer ', 'comparator: name=confidence ', 'comparator: name=always_second ', 'comparator: name=rerank ' and 'power: movable='; existsSync of join(stub, 'jev.log') and join(stub, 'cli-deem.log') both false. Remove stub in a finally block.

VERIFY (repo root):
  node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
  node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs 2>/dev/null | grep -c '^comparator: '
Accept when: 2 files changed and nothing else; node --check exits 0; the grep prints 4.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm
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
