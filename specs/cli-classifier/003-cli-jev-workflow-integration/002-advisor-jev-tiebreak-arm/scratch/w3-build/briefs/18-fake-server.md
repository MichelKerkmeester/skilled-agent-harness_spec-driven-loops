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

TASK: add the fake-server `--deem` test: the real cli-deem client talks to a scripted local HTTP server, and the run prints its own Deem column, order-flip rate, commit pair, calibration and a 26-member cluster as unmeasured. Test file only.
File: .skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts. Read it first; do not edit the script.

1. Imports: add `spawn` beside spawnSync, and `mkdirSync`, `symlinkSync` to the node:fs import.
2. Add describe('score-jev-tiebreak fake deem server') at the end of the file with one it(..., 120_000):
   a. SERVER source string, run as `spawn(process.execPath, ['-e', SERVER], { stdio: ['ignore', 'pipe', 'inherit'] })`. It is CommonJS: require('node:http'); on each request read the body; GET /health answers JSON {"status":"ok","backend":"torch","model":"deem-0.8-v1"}; any POST parses { state, questions } and q = questions.answer. For q.type 'noul' the answer is { value: state.includes('write') ? 0.9 : 0.2 }. Otherwise pick = state.includes('flip') ? q.options[0] : (q.options.find((o) => o === 'desc b') ?? q.options[0]) and the answer is { choice: pick, probabilities: { [pick]: 0.8 } }. Reply { model: 'deem-0.8-v1', answers: { answer } } with content-type application/json. It listens on 127.0.0.1 port 0 and writes its port and a newline to stdout. The test awaits the first stdout chunk for the port.
   b. home = mkdtempSync(join(tmpdir(), 'jev-tiebreak-deemhome-')): mkdirSync(join(home, 'models', 'abc1234'), { recursive: true }); symlinkSync('abc1234', join(home, 'models', 'current')); mkdirSync(join(home, 'src', '.git', 'objects'), { recursive: true }); mkdirSync(join(home, 'src', '.git', 'refs', 'heads'), { recursive: true }); writeFileSync(join(home, 'src', '.git', 'HEAD'), `${SHA}\n`) with const SHA = '0123456789abcdef0123456789abcdef01234567'. No git command is run.
   c. CLI = resolve(dirname(SCRIPT), '../../../../cli-classifier/cli-deem/scripts/cli-deem.mjs'). wrap = makeStub('cli-deem', `exec "${process.execPath}" "${CLI}" "$@"`), so the stub logs each call and runs the real client.
   d. rows: six movable rows ['ok0'..'ok5'].map((prompt, i) => ({ ...mk(`r${i}`, 'b', ['a', 'b'], ['a', 'b'], i % 2 ? 'train' : 'test'), prompt })), then { ...mk('r6', 'b', ['a', 'b'], ['a', 'b']), prompt: 'flip row' }, then wide = the 26 keys k0..k25 and mk('r7', 'k1', wide, wide). labels = [{ id: 'l1', prompt: 'write a file', yes: true }, { id: 'l2', prompt: 'read only', yes: false }].
   e. dir = mkdtempSync(join(tmpdir(), 'jev-tiebreak-fake-')). code = await main(['--deem', '--out', dir], { census: { ...synthCensus(), rows, labels }, out, env: { ...process.env, PATH: `${wrap}${delimiter}${process.env.PATH}`, CLI_DEEM_URL: `http://127.0.0.1:${port}`, CLI_DEEM_HOME: home }, timeoutMs: 20000 }). In finally: kill the server child and rmSync wrap, home and dir (recursive, force).
   f. Expect, in this order of lines:
      - code 0
      - lines contain `deem: health backend=torch model=deem-0.8-v1 model_commit=abc1234 source_commit=${SHA}`
      - one line starts 'deem: nothing leaves the machine planned_calls=23 ' and ends 'unmeasured_over25=1'
      - lines contain 'column: backend=deem rows=8 measured=7 wins=6 losses=0 ties=0 abstentions=0 unmeasured=1 unstable=1'
      - one line starts 'column: backend=deem movable_wins=6 ' and ends ' flip=0.0952'
      - one line starts 'verdict: inconclusive backend=deem decided=6 wins=6 losses=0 p_win=0.0156 p_loss=1.0000 flip=0.0952' and ends `model=deem-0.8-v1 model_commit=abc1234 source_commit=${SHA}`
      - lines contain 'calibration: backend=deem n=2 measured=2 accuracy=1.0000 f1=1.0000 brier=0.0250 ece5=0.1500 temperature=0.05 archived_f1=0.9843'
      - calls.jsonl has 23 lines, each with model_commit 'abc1234' and source_commit SHA, and none with row_id 'r7'
      - no line of wrap's cli-deem.log contains '--provider' or 'k25='
3. Change nothing else in the file.

VERIFY (repo root): grep -c "fake deem server" .skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts
Accept when: 1 file changed and nothing else; the grep prints 1. Do not run vitest; the orchestrator runs it.

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
