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

TASK: make `--deem` refuse to call without `--out`, the way `--jev` does. Every call must be recorded, and every `--deem` run whose gate passes makes calls (the calibration runs at any headroom), so a passing Deem gate without `--out` exits 2 before its first call. A failed Deem gate keeps its skip line and exit 0. Tests pin it.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read main, its JSDoc and describe('score-jev-tiebreak deem gate') first.

In the script, in main only:
1. Directly after `    const gate = deemGate({ out, env });` add:
    // Every passing Deem gate leads to calls, so the run must leave its call record behind.
    if (gate.passed && (typeof values.out !== 'string' || values.out === '')) {
      process.stderr.write('--deem needs --out <dir> so every call is recorded\n');
      return 2;
    }
2. In main's JSDoc, directly after the line that starts ` * A passing Jev gate that would make billed calls returns 2`, add:
 * A passing Deem gate returns 2 without --out, before its first call.
Nothing else changes.

In the vitest file, inside describe('score-jev-tiebreak deem gate'):
1. In it('prints the health line when the pinned torch backend answers'): add `const out = mkdtempSync(join(tmpdir(), 'jev-tiebreak-deem-gate-out-'));` directly after its `const stub = makeStub(...)` line, change `runScript(['--deem'], env)` to `runScript(['--deem', '--out', out], env)`, and add `rmSync(out, { recursive: true, force: true });` in its finally block. Its expectations stay as they are.
2. Add at the end of that describe:
  it('refuses a passing deem gate without --out before any call', () => {
    const stub = makeStub('cli-deem', `if [ "$1" = health ]; then echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}'; exit 0; fi; exit 2`);
    try {
      const env: NodeJS.ProcessEnv = { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}` };
      const result = runScript(['--deem'], env);
      expect(result.status).toBe(2);
      expect(result.stderr).toContain('--deem needs --out <dir> so every call is recorded');
      const prefix = defaultStdout() ?? '';
      const stdout = result.stdout ?? '';
      expect(stdout.startsWith(prefix)).toBe(true);
      expect(stdout.slice(prefix.length).split('\n').filter((line) => line !== '')).toEqual([
        'deem: health backend=torch model=deem-0.8-v1 model_commit=m1 source_commit=s1',
      ]);
      expect(readFileSync(join(stub, 'cli-deem.log'), 'utf8').split('\n').filter((line) => line !== '')).toEqual(['health']);
    } finally {
      rmSync(stub, { recursive: true, force: true });
    }
  }, 120_000);
The other five gate tests fail their gate and stay without `--out`. The `main(['--deem', '--out', dir], ...)` calls elsewhere already pass `--out` and stay as they are.

VERIFY (repo root):
  node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
  grep -c "runScript(\['--deem'\], env)" .skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts
Accept when: 2 files changed and nothing else; node --check exits 0; the grep prints 6 (five failing-gate tests and the new refusal test).

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
