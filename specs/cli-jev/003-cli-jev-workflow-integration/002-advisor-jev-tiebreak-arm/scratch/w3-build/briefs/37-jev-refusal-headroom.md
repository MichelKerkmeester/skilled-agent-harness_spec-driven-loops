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

TASK: test-only. Cover the two headroom branches of the Jev `--out` refusal in main. A passing Jev gate at `no headroom` without `--out` exits 0, no refusal, no paid call. At `underpowered` without `--out` it exits 2 with the refusal and no paid call. Paid calls are `auth test`, `choice` and `noul`; the gate's `--version` and `auth status` are free.
File: .skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts only. Read main in R/scripts/routing-accuracy/score-jev-tiebreak.mjs (do not edit it), then the test file's imports, synthCensus, mk and makeStub.

1. Change `import { describe, expect, it } from 'vitest';` to `import { describe, expect, it, vi } from 'vitest';`.
2. Add at the end of the file:
describe('score-jev-tiebreak jev refusal by headroom', () => {
  async function run(census: ReturnType<typeof synthCensus>) {
    const stub = makeStub('jev', `case "$1" in --version) echo 'jev 0.6.2';; auth) exit 0;; esac\nexit 0`);
    const lines: string[] = [];
    const errors: string[] = [];
    const spy = vi.spyOn(process.stderr, 'write').mockImplementation((chunk: string | Uint8Array) => { errors.push(String(chunk)); return true; });
    try {
      const env = { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}`, JEV_PROVIDER: 'openrouter' };
      const code = await main(['--jev'], { census, out: (line: string) => lines.push(line), env, timeoutMs: 1500, backoffMs: 10 });
      const log = readFileSync(join(stub, 'jev.log'), 'utf8').split('\n').filter((line) => line !== '');
      return { code, lines, errors: errors.join(''), log };
    } finally {
      spy.mockRestore();
      rmSync(stub, { recursive: true, force: true });
    }
  }

  it('runs a passing gate at no headroom without --out and makes no paid call', async () => {
    const rows = ['n0', 'n1', 'n2', 'n3', 'n4', 'n5'].map((id) => mk(id, 'a', ['a', 'b'], ['a', 'b']));
    const result = await run({ ...synthCensus(), rows });
    expect(result.code).toBe(0);
    expect(result.lines).toContain('no headroom');
    expect(result.errors).not.toContain('needs --out');
    expect(result.log).toEqual(['--version', 'auth status --provider openrouter']);
  });

  it('refuses a passing gate at underpowered without --out before any paid call', async () => {
    const result = await run(synthCensus());
    expect(result.code).toBe(2);
    expect(result.lines).toContain('underpowered');
    expect(result.errors).toContain('--jev needs --out <dir> so every billed call is recorded');
    expect(result.log).toEqual(['--version', 'auth status --provider openrouter']);
  });
});
Change nothing else in the file.

VERIFY (repo root): grep -c "jev refusal by headroom" .skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts
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
