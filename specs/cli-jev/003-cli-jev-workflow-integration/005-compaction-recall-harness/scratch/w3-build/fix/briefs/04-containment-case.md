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

TASK: add two cases to T that pin how the census refuses an --out inside a named transcript directory: the exact-case
path, and the upper-cased path on a case-insensitive disk. Test-only: the script already behaves this way.
Never read ~/.claude, ~/.pi or any transcript or session file. Edit only this file (read all of it first):
T = .skilled/skills/system-spec-kit/runtime/tests/compaction-recall.vitest.ts
1. T:9, replace the node:path import line with exactly:
import { basename, delimiter, dirname, join, resolve } from 'node:path';
2. T, insert after the closing `}` of function runScript, after one blank line, exactly:
// On a case-insensitive disk the upper-cased name of a directory opens the same directory.
const CASE_INSENSITIVE = (() => {
  const dir = mkdtempSync(join(tmpdir(), 'compaction-recall-case-'));
  const folded = existsSync(join(dirname(dir), basename(dir).toUpperCase()));
  rmSync(dir, { recursive: true, force: true });
  return folded;
})();
3. T, add these two cases as the last cases, just before the final `});`, each after one blank line:
  it('an exact-case --out inside the transcript directory is refused', () => {
    const dir = transcriptDir();
    const out = join(dir, 'r.json');
    const run = runScript(SCRIPT, ['--transcripts', dir, '--out', out]);

    expect(run.code).toBe(2);
    expect(run.stderr).toBe('refused: report path inside transcript directory\n');
    expect(existsSync(out)).toBe(false);
  });

  it.skipIf(!CASE_INSENSITIVE)('an upper-cased --out inside the transcript directory is refused', () => {
    const dir = transcriptDir();
    const upper = join(dirname(dir), basename(dir).toUpperCase());
    const run = runScript(SCRIPT, ['--transcripts', dir, '--out', join(upper, 'r-upper.json')]);

    expect(run.code).toBe(2);
    expect(run.stderr).toBe('refused: report path inside transcript directory\n');
    expect(existsSync(join(dir, 'r-upper.json'))).toBe(false);
  });
VERIFY (repo root): grep -cE '^  it[(.]' .skilled/skills/system-spec-kit/runtime/tests/compaction-recall.vitest.ts (expect 16)
and: grep -c 'CASE_INSENSITIVE' .skilled/skills/system-spec-kit/runtime/tests/compaction-recall.vitest.ts (expect 2)
Accept when: 1 file changed (T), nothing else; T holds 16 cases; CASE_INSENSITIVE appears twice.

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
