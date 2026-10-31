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

TASK: refuse `--jev` without `--out`. Jev calls are billed, and a run without `--out` keeps no calls.jsonl and no report.json, so it would spend up to 334 calls with no record. main must exit 2 before any call when `--jev` is set and `--out` is missing or empty. Tests pin it.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read main and every test that passes '--jev' first.

In the script, in main, directly after the line `  const { values } = parsed;` add:
  // Jev calls are billed, so a Jev run must leave its call record behind.
  if (values.jev === true && (typeof values.out !== 'string' || values.out === '')) {
    process.stderr.write('--jev needs --out <dir> so every billed call is recorded\n');
    return 2;
  }
Update main's JSDoc to say so. Nothing else changes.

In the vitest file:
1. describe('score-jev-tiebreak jev gate') has three tests that call runScript(['--jev'], env). In each, create `const out = mkdtempSync(join(tmpdir(), 'jev-tiebreak-gate-out-'));` before the call, call runScript(['--jev', '--out', out], env) instead, and remove `out` with rmSync(out, { recursive: true, force: true }) in that test's existing finally block (or add one). Their expectations stay as they are: a skipped gate makes no call, so nothing else changes.
2. In describe('score-jev-tiebreak jev arm'), it('names the model unknown when auth test omits it') calls main(['--jev'], ...). Make a temp dir the same way, call main(['--jev', '--out', dir], ...) and remove the dir in its finally block.
3. In describe('score-jev-tiebreak entry point'), add:
  it('refuses --jev without --out before any call', async () => {
    const stub = makeStub('jev', 'exit 0');
    try {
      const code = await main(['--jev'], {
        census: synthCensus(),
        out: () => {},
        env: { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}` },
      });
      expect(code).toBe(2);
      expect(existsSync(join(stub, 'jev.log'))).toBe(false);
    } finally {
      rmSync(stub, { recursive: true, force: true });
    }
  });

VERIFY (repo root):
  node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
  grep -c "\['--jev'\]" .skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts
Accept when: 2 files changed and nothing else; node --check exits 0; the grep prints 1 (the new refusal test only).

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
