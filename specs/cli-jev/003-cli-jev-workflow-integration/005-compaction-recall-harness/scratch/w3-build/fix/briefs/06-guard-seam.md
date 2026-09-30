GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness

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

TASK: give main an optional hooks argument whose beforeGuard runs just before the free-text guard, and add the case
that proves the guard is wired into main. Never read ~/.claude, ~/.pi or any transcript or session file.
Edit only these two files (read both first; in S read from the JSDoc of `export async function main` to the end):
S = .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs; T = .skilled/skills/system-spec-kit/runtime/tests/compaction-recall.vitest.ts
1. S:1460 (the JSDoc of main, not of parseCliArgs), after the line ` * @param {string[]} argv Raw arguments after the script name.` insert exactly:
 * @param {{ beforeGuard?: (report: object) => void }} [hooks] Called with the complete report just before the free-text guard.
2. S:1463, replace `export async function main(argv) {` with exactly: `export async function main(argv, hooks = {}) {`
3. S:1587, insert immediately above the line `  // The report is the census's only output, so it is checked whole before` exactly:
  // The hook lets a test plant a string that a real run cannot produce.
  if (hooks.beforeGuard) {
    hooks.beforeGuard(report);
  }
4. T:12, replace the vitest import line with exactly: import { afterEach, describe, expect, it, vi } from 'vitest';
5. T, inside the existing afterEach callback, add `    vi.restoreAllMocks();` as its first statement.
6. T, add this case as the last case, just before the final `});`, after one blank line:
  it('main voids the census and writes no report when a planted string reaches the guard', async () => {
    const dir = transcriptDir();
    const out = join(tempDir('compaction-recall-out-'), 'r.json');
    const { main } = await import(pathToFileURL(SCRIPT).href);
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    const code = await main(['--transcripts', dir, '--out', out], {
      beforeGuard: (report) => {
        report.rows[0].note = 'CANARY-planted';
      },
    });

    expect(code).toBe(1);
    expect(write.mock.calls.map((call) => String(call[0])).join('')).toBe('stop: census void (free text in report)\n');
    expect(existsSync(out)).toBe(false);
  });
VERIFY (repo root, S and T as above): node --check S; grep -c 'hooks.beforeGuard' S (expect 2); grep -cE '^  it[(.]' T (expect 19)
Accept when: 2 files changed (S and T), nothing else; node --check exits 0; both greps as expected.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness
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
