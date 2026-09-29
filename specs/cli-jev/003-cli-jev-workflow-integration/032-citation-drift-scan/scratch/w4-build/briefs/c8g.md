GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/scratch/w4-build

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

TASK: update seven expectations in the arm tests to the corrected polarity. One change in T. Change nothing in S.
T = `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs`. Read it first. S = `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` (read only; a row is now flagged drifted when the yes probability is below 0.5, and Brier pairs that probability with 1 for a row that still supports its claim).
WHY: the stubs answer 0.9 (yes, the window still shows the claim) on every row. The 40-row arm fixture holds 30 supporting rows, where the identifier-overlap comparator is right, and 10 drifted rows, where it is wrong. With the corrected polarity no row is flagged, so the model is right on the 30 supporting rows exactly where the comparator is, and Brier is (30 x 0.01 + 10 x 0.81) / 40 = 0.2100.
EDIT (each a literal replacement, change nothing else):
1. `'brier deem: 0.6100'` becomes `'brier deem: 0.2100'`.
2. `'verdict deem: kill (precision) K=40 M=40 A=10 B=30 W=10 L=30 TP=10 FP=30 F=n/a p='` becomes `'verdict deem: kill (precision) K=40 M=40 A=30 B=30 W=0 L=0 TP=0 FP=0 F=n/a p='`.
3. In the Deem arm's call-record loop, `assert.equal(call.flag, true);` becomes `assert.equal(call.flag, false);`.
4. `'brier jev: 0.6100'` becomes `'brier jev: 0.2100'`.
5. `'verdict jev: kill (precision) K=40 M=40 A=10 B=30 W=10 L=30 TP=10 FP=30 F=0 p='` becomes `'verdict jev: kill (precision) K=40 M=40 A=30 B=30 W=0 L=0 TP=0 FP=0 F=0 p='`.
6. In the Jev arm's call-record loop, `assert.equal(call.flag, true);` becomes `assert.equal(call.flag, false);`.
7. `'verdict jev: kill (precision) K=1 M=1 A=0 B=1 W=0 L=1 TP=0 FP=1 F=0 p='` becomes `'verdict jev: kill (precision) K=1 M=1 A=1 B=1 W=0 L=0 TP=0 FP=0 F=0 p='`.
VERIFY (repo root), paste the summary lines:
  node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs
Accept when: only T changed; the run prints `fail 0`. If a case fails, stop and report BLOCKED with the failing case names and the first error lines; do not change an expectation beyond the seven listed.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan/scratch/w4-build
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
