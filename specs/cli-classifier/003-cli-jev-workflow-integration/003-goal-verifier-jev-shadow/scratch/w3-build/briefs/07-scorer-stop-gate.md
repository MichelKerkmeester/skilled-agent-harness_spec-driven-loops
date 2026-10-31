GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow

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

TASK: add the scorer's stop and gate lines, a pure function, wire it into main after the report lines, and unit-test it. Two existing files. No em dash anywhere. Keep every existing line unchanged except the one main line named below.

FILE 1 .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs.
- In the REPORT section add decisionLines(rows, results), same inputs as reportLines, returning an array of strings:
  1. h = summarizeArm(rows, results, 'heuristic'), t = summarizeArm(rows, results, 'tail_window'). better is the arm with fewer falseMet, then the lower rate; a tie picks heuristic. Push `better: arm=<heuristic|tail_window> false_met=<falseMet> false_not_met_rate=<rate.toFixed(2)>`.
  2. If better.falseMet === 0 and better.rate <= 0.10: push 'stop: no headroom' and `finding: clamp fix for the plugin and goal-core owners: clampText appends "..." and the truncation check then reads the cut evidence as truncated, clamp_defects=<n>`, where n counts rows whose heuristic category is truncated and whose tail_window category is not. Return.
  3. reachable counts rows labeled met whose tail_window verdict is not met and whose heuristic category is neither too_short nor blocking (the wrapper rule holds those). If reachable is 0: push 'stop: no reachable rows' and return.
  4. Otherwise push `gate: tail_window leaves <reachable> false not_met rows outside the wrapper rule`, then 'gate: deem arm condition holds', then 'gate: jev arm also needs the three redaction cases and a recorded per-call latency, checked by hand'.
- In main, where the labeled rows reach reportLines, keep the runArms result in a variable and push ...reportLines(labeled, results) and then ...decisionLines(labeled, results).
- Add decisionLines to module.exports.

FILE 2 .skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs. Append three tests, keep existing ones.
Helper: ten rows { id: 'r' + i, label: 'met' }. Helper arms(h, t) = { heuristic: { verdict: h[0], category: h[1] }, tail_window: { verdict: t[0], category: t[1] }, parity: { verdict: h[0], category: h[1] } }. By default every row gets arms(['met', 'met'], ['met', 'met']).
Test "stop: no headroom at a rate of exactly 0.10": r0 gets arms(['not_met', 'truncated'], ['not_met', 'no_completion']). decisionLines deepEqual [
  'better: arm=heuristic false_met=0 false_not_met_rate=0.10',
  'stop: no headroom',
  'finding: clamp fix for the plugin and goal-core owners: clampText appends "..." and the truncation check then reads the cut evidence as truncated, clamp_defects=1' ].
Test "stop: no reachable rows when the wrapper rule holds every miss": r0 and r1 get arms(['not_met', 'blocking'], ['not_met', 'blocking']). decisionLines deepEqual [
  'better: arm=heuristic false_met=0 false_not_met_rate=0.20',
  'stop: no reachable rows' ].
Test "gate lines when a miss survives both the tail window and the wrapper rule": r0 and r1 get arms(['not_met', 'no_completion'], ['not_met', 'no_completion']). decisionLines deepEqual [
  'better: arm=heuristic false_met=0 false_not_met_rate=0.20',
  'gate: tail_window leaves 2 false not_met rows outside the wrapper rule',
  'gate: deem arm condition holds',
  'gate: jev arm also needs the three redaction cases and a recorded per-call latency, checked by hand' ].

Accept when: 2 files changed (both existing) and the checks below pass.
CHECKS (run exactly these; do not run node --test or the scorer):
  node --check .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs
  node --check .skilled/hooks/goal/lib/score-verifier-labeled-set.test.cjs
  grep -c "no headroom" .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs     (expect 1 or more)

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow
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
- Read ~/.pi, ~/.claude or any session or transcript file. The tests build their own fixtures.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
