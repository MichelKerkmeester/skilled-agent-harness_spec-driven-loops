---
trigger_phrases: []
---
Finish 036/012-runtime-enablement, now on a DELETION-FIRST direction (operator switch 2026-08-23).
You ORCHESTRATE; executors write/delete code, you verify. Worktree .worktrees/022-012-runtime-enablement-build.
Do not push. READ scratch/direction-switch-delete-overengineering.md FIRST — it holds the decision, the
measured inventory, the import-graph audit, and the deletion order.

MISSION: the improved ledger loop IS the system. Delete the over-engineered rollback, migration, and
back-compat machinery that was never needed for system-deep-loop and dragged this epic out (~45-50k LOC,
about a quarter of the runtime). This is honest SIMPLIFICATION — remove the ceremony, never fabricate that a
safety window closed. Deletion first, gate work after.

STATE AT SWITCH:
- Committed: f2d4d01d08 (012 projection contracts + fleet flip); 5511e4eac2 (U1 window-free finalize CAS +
  phase 010 scaffold).
- Uncommitted but verified: U3+U4 in 005/scratch/run-gate.mjs (authority-state accepts final; real
  negative-controlled reader-contracts).
- Not executed: U2 finalize (8 records still new_authoritative_reversible; backed up under
  scratchpad/authority-state-backup-pre-finalize/). Authority verified live: all 8 on ledger, allOnLedger true.

RECURRING DEFECT (still in force): a check placed where it cannot observe what it names. Treat every green as
guilty until a perturbation turns it red, and check WHY. Recorded blockers decay — re-measure every claim
first. For deletions the analogue: never assume a module is unused — prove it by the import graph, sever
live-loop imports before deleting, and re-run typecheck + suite after every wave.

DELETION ORDER (import-graph verified — do not reorder without re-auditing):
1. Open the deletion phase (Gate-3: new child under 012, e.g. 011-delete-overengineering, or a sibling
   packet). Author its lean spec.
2. Sever live-loop -> migration imports: per-mode-authority-flip/types.ts and preflight.ts import
   inflight-state-classification (confirm it is only a type/enum, inline or drop it). Verify build green.
3. WAVE 1 — rollback ceremony (A, ~34k LOC): 8 *-rollback-gate modules + rollback-drills + their 9 test files.
   rollback-gates have ZERO external importers (leaf) — safest first. Verify build + suite after.
4. WAVE 2 — migration scaffolding (B, ~20k LOC): *-shadow-parity x3 + shadow-parity, cutover-certificate,
   mixed-version-fixtures, restart-observation, deep-research-cutover-evidence, the *-certificates dirs, then
   inflight-state-classification (after step 2). Verify build + suite after each sub-step.
5. Re-simplify the whole-system gate: drop the shadow-parity / rollback / inflight checks; keep
   authority-state, reader-contracts (real), runtime-suite, tree-clean, fanout-real-run. Re-baseline the suite.
6. Resolve the finalize + gate decision on the lean system: land U3+U4, decide whether to run U2 finalize
   (all 8 -> final, legacy shadow dropped) and land a lean literal PASS, or defer.

KEEP (load-bearing live loop — never delete): per-mode-authority-flip authority-selector + authority-registry
+ finalize CAS; mode-append-gateway; the event ledger + event-envelope; legacy-projections (consumer surface,
Category C — a separate future decision to keep or migrate consumers off).

EXECUTOR: devin -p --model glm-5-2 --permission-mode bypass --respect-workspace-trust false --prompt-file <file>
run with AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0 SYSTEM_SPEC_GATE_ENFORCE=0 and </dev/null, as a background
Bash job (never add & inside). Unsuffixed glm-5-2 IS GLM-5.2 High free; -max is paid. No substitutes — if
unavailable, HALT. Brief it to work DIRECTLY with its own tools, foreground, no run_subagent, no background.
The devin dispatch needs operator permission once (granted this session). Briefs forbid git
stash/checkout/restore/reset/clean and STOP on a failed premise.

VERIFY: read diffs, not reports. After each deletion wave: typecheck/build green, then the named suites, then
compare the full-suite failing set BY NAME against baseline (16/192 files, 14/4302 tests; the set moves with
desktop load — repeat a condition before accusing a change). Negative-control every guard you keep. Reconcile
012 metadata at the end (003/004 stale Blocked -> Complete per their impl-summaries; 005/006/009/010 + the new
deletion phase); validate.sh <folder> --strict at Errors:0. Never adjust a gate to pass it; never fabricate.

REPORT per boundary: what ran and its exit status, baseline->delta as sets, executor claim vs what you
confirmed, commit SHA; separate confirmed from inferred; declare deviations; HALT on red.
