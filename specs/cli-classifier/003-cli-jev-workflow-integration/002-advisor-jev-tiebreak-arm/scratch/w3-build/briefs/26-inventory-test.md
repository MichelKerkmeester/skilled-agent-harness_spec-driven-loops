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

TASK: the playbook gained scenario SC-006, so its inventory test must expect 48 scenario files instead of 47. One literal edit, the number 47 to 48, on six lines of one file.
File: .skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts. Read it first.

Line 45. Old:
  it('keeps the root playbook aligned with the live 47-scenario corpus', () => {
New:
  it('keeps the root playbook aligned with the live 48-scenario corpus', () => {

Line 50. Old:
    expect(markdown).toContain('47 deterministic scenario files across 9 categories');
New:
    expect(markdown).toContain('48 deterministic scenario files across 9 categories');

Line 51. Old:
    expect(markdown).toContain('all 47 scenario files are `PASS`');
New:
    expect(markdown).toContain('all 48 scenario files are `PASS`');

Line 53. Old:
    expect(rows).toHaveLength(47);
New:
    expect(rows).toHaveLength(48);

Line 54. Old:
    expect(new Set(rows.map((row) => row.id)).size).toBe(47);
New:
    expect(new Set(rows.map((row) => row.id)).size).toBe(48);

Line 55. Old:
    expect(files).toHaveLength(47);
New:
    expect(files).toHaveLength(48);

Nothing else in the file changes. Line 52 (the 24-scenario guard) stays as it is.

VERIFY (repo root):
  grep -c "47" .skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts
  grep -c "48" .skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts
Accept when: 1 file changed and nothing else; the first grep prints 0 and the second prints 6.

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
