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

TASK: test-only. Pin how each model arm stops when a choice call exits 130 (interrupted) on the first judgment: the stop line, `partial_rows=0`, one recorded call, no column, no verdict, and exit 0 from main.
File: .skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts only. First read the runJevArm choice loop, runDeemArm's deemCall and stop, and main's return in .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs (do not edit the script), then describe('score-jev-tiebreak jev arm') and describe('score-jev-tiebreak deem arm') in the test file.

1. In the jev arm describe's stubBody (line 722), replace this text:
*hang*) exec sleep 30;;
with:
*sigint*) exit 130;; *hang*) exec sleep 30;;
2. In the deem arm describe's stubBody (line 871), replace this text:
exit 0;; *exit1*) exit 1;;
with:
exit 0;; *sigint*) exit 130;; *exit1*) exit 1;;
3. Add as the last test inside describe('score-jev-tiebreak jev arm'):
  it('stops on an interrupt at the first judgment and scores nothing', async () => {
    const result = await drive(['sigint a', 'ok b', 'ok c', 'ok d', 'ok e', 'ok f']);
    expect(result.code).toBe(0);
    expect(result.lines).toContain('jev arm stopped: interrupted');
    expect(result.lines).toContain('jev: partial_rows=0');
    expect(result.lines.some((line) => line.startsWith('column: ') || line.startsWith('verdict: '))).toBe(false);
    const choice = result.calls.filter((call) => call.kind === 'choice');
    expect(choice).toHaveLength(1);
    expect(choice[0]).toMatchObject({ row_id: 'r0', pass: 1, exit_code: 130, answer: null, status: 'unmeasured' });
    expect(result.logLines.filter((line) => line.startsWith('choice'))).toHaveLength(1);
  }, 60_000);
4. Add as the last test inside describe('score-jev-tiebreak deem arm'):
  it('stops on an interrupt at the first judgment and scores nothing', async () => {
    const result = await drive(census(['sigint a', 'ok b', 'ok c', 'ok d', 'ok e', 'ok f']));
    expect(result.code).toBe(0);
    expect(result.lines).toContain('deem arm stopped: interrupted');
    expect(result.lines).toContain('deem: partial_rows=0');
    expect(result.lines.some((line) => /^(column|verdict|calibration): /.test(line))).toBe(false);
    expect(result.calls).toHaveLength(1);
    expect(result.calls[0]).toMatchObject({ kind: 'choice', row_id: 'r0', order: 0, exit_code: 130, answer: null, status: 'unmeasured' });
    expect(result.logLines.filter((line) => line.startsWith('choice'))).toHaveLength(1);
  }, 60_000);
Change nothing else in the file. The script must stay byte-identical.

VERIFY (repo root): grep -c "stops on an interrupt at the first judgment" .skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts
Accept when: 1 file changed and nothing else; the grep prints 2. Do not run vitest; the orchestrator runs it.

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
