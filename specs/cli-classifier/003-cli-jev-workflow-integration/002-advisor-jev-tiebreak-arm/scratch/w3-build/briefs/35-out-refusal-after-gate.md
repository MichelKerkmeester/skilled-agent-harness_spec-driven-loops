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

TASK: move the `--jev` needs `--out` refusal from before the census to just before the first billed call. A failed Jev gate must keep its old path (census, skip lines, exit 0) with or without `--out`; only a passing gate that would make billed calls, with no `--out`, exits 2. Tests pin both.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read main, its JSDoc and describe('score-jev-tiebreak jev gate') first.

In the script, in main only:
1. Delete these 5 lines after `const { values } = parsed;`:
  // Jev calls are billed, so a Jev run must leave its call record behind.
  if (values.jev === true && (typeof values.out !== 'string' || values.out === '')) {
    process.stderr.write('--jev needs --out <dir> so every billed call is recorded\n');
    return 2;
  }
2. Directly after `    const gate = jevGate({ out, env, timeoutMs });` add:
    // Jev calls are billed, so an arm that will call must leave its call record behind.
    const billed = gate.passed && (summary.headroom === 'ok' || summary.headroom === 'underpowered');
    if (billed && (typeof values.out !== 'string' || values.out === '')) {
      process.stderr.write('--jev needs --out <dir> so every billed call is recorded\n');
      return 2;
    }
3. JSDoc line old: ` * --jev with a missing or empty --out returns 2 before any call.`
   new: ` * A passing Jev gate that would make billed calls returns 2 without --out, before the first billed call.`

In the vitest file:
1. describe('score-jev-tiebreak jev gate'): in each of its three tests, delete the line `const out = mkdtempSync(join(tmpdir(), 'jev-tiebreak-gate-out-'));`, change `runScript(['--jev', '--out', out], env)` to `runScript(['--jev'], env)`, and delete `rmSync(out, { recursive: true, force: true });`. In the third test, which then has an empty finally block, remove the try/finally wrapper and keep its body. Every expectation stays: exit 0, the census prefix, the skip lines, the stub log.
2. describe('score-jev-tiebreak entry point'): replace the whole it('refuses --jev without --out before any call', ...) block with:
  it('refuses a passing jev gate without --out before any billed call', () => {
    const stub = makeStub('jev', `case "$1" in --version) echo 'jev 0.6.2';; auth) exit 0;; esac\nexit 0`);
    try {
      const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}`, JEV_PROVIDER: 'openrouter' };
      const result = runScript(['--jev'], env);
      expect(result.status).toBe(2);
      expect(result.stderr).toContain('--jev needs --out <dir> so every billed call is recorded');
      const prefix = defaultStdout() ?? '';
      expect((result.stdout ?? '').startsWith(prefix)).toBe(true);
      expect(readFileSync(join(stub, 'jev.log'), 'utf8').split('\n').filter((line) => line !== '')).toEqual([
        '--version',
        'auth status --provider openrouter',
      ]);
    } finally {
      rmSync(stub, { recursive: true, force: true });
    }
  }, 120_000);
   The stub log holds only the two gate checks, which bill nothing: no `auth test`, `choice` or `noul` line.

VERIFY (repo root):
  node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
  grep -c "jev-tiebreak-gate-out-" .skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts
Accept when: 2 files changed and nothing else; node --check exits 0; the grep prints 1 (the jev arm test that keeps its --out dir).

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
