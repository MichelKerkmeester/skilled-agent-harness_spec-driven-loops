GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are a read-only reviewer (Pi MiMo). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

TASK: read-only recheck of one code fix made after your review of this phase. Edit nothing, create nothing, run no git command that writes.
Your P0 on drift-flag polarity: `noul` is the probability that the window still shows the cited fact, yet `flag` was `probability >= 0.5` and was scored as drifted.
The fix, by DeepSeek V4.1 Flash:
1. `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`: both arms now set `flag = probability < FLAG_THRESHOLD` (lines 1095 and 1399), and both Brier inputs now use `actual: drifted ? 0 : 1` (lines 1145 and 1457). The JSDoc of the Brier helper changed to match.
2. `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs`: seven expectations moved with it: Brier 0.2100 for both arms, `A=30 B=30 W=0 L=0 TP=0 FP=0`, `call.flag` false twice, and the K=1 case `A=1 B=1 W=0 L=0 TP=0 FP=0`.
Your P1 on the gates spawning under the label gate was ruled against by the session: the goal's criterion 2 and the design's proof plan run the gates on an unlabeled tree, and a gate check calls no model. Do not re-raise it.
Check the fix against REQ-011 and the Brier definition in the phase's `spec.md`, and run `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` (paste its tests/pass/fail lines). Check that each changed expectation follows from the fixed polarity, not from a test bent to pass. Report one line `closed|open - evidence` for the P0, then any new P0 or P1 in the two files. End with exactly one line `VERDICT: PASS` (closed, nothing new at P0 or P1) or `VERDICT: FAIL`.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/032-citation-drift-scan
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
