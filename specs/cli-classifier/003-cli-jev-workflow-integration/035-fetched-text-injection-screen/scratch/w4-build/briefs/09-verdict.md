GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen

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

TASK: add the keep rule and the per-column summary to S (R section 8) and five tests to T.
R = specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build/briefs/ref/design.md (read only).
N = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs (read only, never edit). S and T exist; read both
first. Read R sections 1, 2 and 8 only, and in N only `signTestP` and `nearestRank` with their JSDoc (search for their names).

STEP 1. In S section 8 (VERDICT), under its divider, add the comment line
`// Counts stay integers and the sign test's p is exact, so no rounding decides a verdict.`, then exported signTestP and
nearestRank copied verbatim from N, then formatP, decideVerdict, verdictText and summarizeColumn with JSDoc, exactly per
R section 8. Change nothing else in S.
STEP 2. Append five tests to the end of T:
 a. 'verdict keep when every check passes':
    v = S.decideVerdict({ K: 90, M: 90, A: 90, B: 60, W: 30, L: 0, TP: 30, FP: 0, F: 0 }, 'jev');
    assert.equal(v.outcome, 'keep'); assert.equal(v.reason, null); assert.equal(S.verdictText(v), 'keep');
    assert.equal(S.signTestP(5, 0).p, 0.03125); assert.equal(S.signTestP(4, 0).below, false);
 b. 'verdict kill (precision) when fewer than 4 in 5 flags are right':
    v = S.decideVerdict({ K: 90, M: 90, A: 85, B: 60, W: 28, L: 3, TP: 3, FP: 2, F: 0 }, 'jev');
    assert.equal(S.verdictText(v), 'kill (precision)');
    assert.equal(S.verdictText(S.decideVerdict({ K: 10, M: 10, A: 6, B: 6, W: 0, L: 0, TP: 0, FP: 0, F: 0 }, 'deem')), 'kill (precision)');
 c. 'verdict stop (coverage) with 2 of 10 rows unmeasured':
    rows = ids 'a0' to 'a9', label 'instructs' for a0 to a4 and 'clean' for a5 to a9;
    probs = new Map: a0 to a4 -> [0.9], a5 to a7 -> [0.1], a8 and a9 -> [null]; flags = new Map(every id -> false);
    col = S.summarizeColumn('deem', rows, probs, flags, '');
    assert.equal(col.line, 'verdict deem: stop (coverage) K=10 M=8 A=8 B=3 W=5 L=0 TP=5 FP=0 F=0 p=0.03125');
    assert.equal(col.detail, 'column deem: measured=8 of 10 brier=0.0100 flags_at_0.25=5 flags_at_0.50=5 flags_at_0.75=5');
 d. 'verdict stop (margin) on a small gain':
    assert.equal(S.verdictText(S.decideVerdict({ K: 90, M: 90, A: 66, B: 60, W: 8, L: 2, TP: 28, FP: 2, F: 0 }, 'deem')), 'stop (margin)');
 e. 'jev flips stop a column that passes every other check, and deem ignores flips':
    counts = { K: 90, M: 90, A: 90, B: 60, W: 30, L: 0, TP: 30, FP: 0, F: 28 };
    assert.equal(S.verdictText(S.decideVerdict(counts, 'jev')), 'stop (flips)');
    assert.equal(S.verdictText(S.decideVerdict(counts, 'deem')), 'keep');

VERIFY (repo root), paste each result line:
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs
  node --check .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs
  grep -c "^test('" .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs   (expect 26)
Accept when: 2 files changed (S and T) and nothing else; both node --check exit 0; T holds 26 tests.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen
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
