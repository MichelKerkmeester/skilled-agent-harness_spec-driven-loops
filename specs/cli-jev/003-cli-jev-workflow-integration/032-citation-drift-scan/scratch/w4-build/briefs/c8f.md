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

TASK: flag a window drifted when the model's yes probability is below 0.5, and score Brier against the yes outcome. One change in S. Change nothing in T.
S = `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`. Read it first.
WHY: the one question is "Does the cited code window still show what the citing sentence claims?", so `noul` returns the probability of yes, that the window still supports the claim. The spec flags a row drifted when that probability is below 0.5. Both arms set `flag = probability >= FLAG_THRESHOLD`, so a model that reads every row correctly scores as its inverse. The Brier input pairs that same probability with 1 for a drifted row, the same inversion.
EDIT 1: the JSDoc line above `export const FLAG_THRESHOLD = 0.5;` becomes `/** A yes probability below this reads as a flagged, drifted window. */`.
EDIT 2: in the Deem arm and in the Jev arm, replace `flag = probability >= FLAG_THRESHOLD;` with `flag = probability < FLAG_THRESHOLD;` (two places).
EDIT 3: in the Deem arm replace `scored.push({ probability: result.probability, actual: drifted ? 1 : 0 });` with `scored.push({ probability: result.probability, actual: drifted ? 0 : 1 });`, and in the Jev arm replace `for (const rerun of reruns) scored.push({ probability: rerun.probability, actual: drifted ? 1 : 0 });` with `for (const rerun of reruns) scored.push({ probability: rerun.probability, actual: drifted ? 0 : 1 });`.
EDIT 4: in the JSDoc of `brierScore`, replace "the row's outcome, 1 for a drifted window and 0 for a clean one" with "the row's outcome, 1 for a window that still shows the claim and 0 for a drifted one, since the probability is the model's yes".
Change nothing else.
VERIFY (repo root), paste each result line:
  node --check .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs
  grep -c "flag = probability < FLAG_THRESHOLD" .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs
  grep -c "actual: drifted ? 0 : 1" .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs
Accept when: only S changed; `node --check` exits 0 and both greps print 2. The orchestrator updates and runs the tests next.

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
