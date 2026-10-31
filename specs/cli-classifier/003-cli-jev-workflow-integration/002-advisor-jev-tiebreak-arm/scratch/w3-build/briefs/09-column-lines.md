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

TASK: add two exported pure functions that format a scored column for stdout, columnLines(summary) and verdictLine(summary, extra), with their tests.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read both first; summarizeColumn in the script returns the summary object these format.

In the script, directly after summarizeColumn, add with JSDoc blocks:
1. `export function columnLines(s)` returning these 5 strings, where b = s.backend, every p, flip and mrr prints with toFixed(4), and latency prints Math.round(value) or 'none' when null:
  `column: backend=${b} rows=${s.rows} measured=${s.measured} wins=${s.wins} losses=${s.losses} ties=${s.ties} abstentions=${s.abstentions} unmeasured=${s.unmeasured} unstable=${s.unstable}`
  `column: backend=${b} movable_wins=${s.movableWins} gold_demotions=${s.goldDemotions} none_on_gold_in_cluster=${s.noneOnGoldInCluster} p_win=<s.pWin> p_loss=<s.pLoss> flip=<s.flip>`
  `column: backend=${b} tau03_inside_wins=<insideWins> tau03_inside_losses=<insideLosses> tau03_outside_wins=<outsideWins> tau03_outside_losses=<outsideLosses>`
  `column: backend=${b} mrr=<column.mrr> right1=<column.right1> right3=<column.right3> scorer_mrr=<scorer.mrr> confidence_mrr=<confidence.mrr> always_second_mrr=<alwaysSecond.mrr> heldout_mrr=<heldColumn.mrr> rerank_mrr=<heldRerank.mrr>`
  `column: backend=${b} latency_p50_ms=<latency.p50> latency_p95_ms=<latency.p95>`
  (the metric objects are s.metrics.column, s.metrics.scorer and so on; tau03 counts are s.tau03.*)
2. `export function verdictLine(s, extra)` returning
  `verdict: ${s.verdict} backend=${s.backend} decided=${s.decided} wins=${s.wins} losses=${s.losses} p_win=<s.pWin toFixed(4)> p_loss=<s.pLoss toFixed(4)> flip=<s.flip toFixed(4)>`
  followed by ` ${extra}` when extra is a non-empty string.

In the vitest file add both to the import. In describe('score-jev-tiebreak column and keep rule'), in the keep case (case 2), also expect:
  verdictLine(summary, 'model=deem-0.8-v1 model_commit=mc1 source_commit=sc1') to be 'verdict: keep backend=deem decided=6 wins=6 losses=0 p_win=0.0156 p_loss=1.0000 flip=0.0000 model=deem-0.8-v1 model_commit=mc1 source_commit=sc1'
  (if that case calls summarizeColumn with a backend other than 'deem', change that argument to 'deem').
  columnLines(summary)[0] to be 'column: backend=deem rows=6 measured=6 wins=6 losses=0 ties=0 abstentions=0 unmeasured=0 unstable=0'
  columnLines(summary)[4] to be 'column: backend=deem latency_p50_ms=10 latency_p95_ms=10'
In the four-outcome case (case 1) also expect verdictLine(summary, '') to start with 'verdict: underpowered backend=' and to end with 'p_win=0.7500 p_loss=0.7500 flip=0.1667'.

VERIFY (repo root): node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
Accept when: 2 files changed and nothing else; node --check exits 0.

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
