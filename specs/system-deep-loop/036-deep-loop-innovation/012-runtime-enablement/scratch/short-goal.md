---
trigger_phrases: []
---
Finish 036/012-runtime-enablement on a DELETION-FIRST switch (2026-08-23). You ORCHESTRATE; executors write/delete, you verify. Worktree .worktrees/022-012-runtime-enablement-build. Do NOT push. Read scratch/direction-switch-delete-overengineering.md first (decision, inventory, import audit, order).

MISSION: the ledger loop IS the system. Delete the over-engineered rollback/migration/back-compat machinery that was never needed and dragged the epic out (~45-50k LOC, ~1/4 of runtime). Honest SIMPLIFICATION — remove ceremony, never fabricate a closed safety window.

STATE: committed f2d4d01d08 (projection contracts + flip), 5511e4eac2 (U1 window-free finalize CAS + phase 010). Verified-but-uncommitted: U3+U4 in 005/scratch/run-gate.mjs (authority-state accepts final; real negative-controlled reader-contracts). NOT run: U2 finalize (8 records still reversible, backed up). Authority live: all 8 on ledger.

DEFECT DISCIPLINE (in force): every green guilty until a perturbation turns it red; check WHY; recorded blockers decay, re-measure. For deletion: never assume unused — prove by import graph, sever live-loop imports first, re-run typecheck+suite after each wave.

DELETION ORDER (import-verified):
1. Open deletion phase (Gate-3: new 012 child 011-delete-overengineering or sibling packet); author lean spec.
2. Sever live-loop->migration imports: per-mode-authority-flip/types.ts + preflight.ts import inflight-state-classification (confirm type-only, inline/drop). Build green.
3. WAVE 1 rollback ceremony (~34k): 8 *-rollback-gate + rollback-drills + 9 tests. Gates have ZERO external importers — safest first. Verify build+suite.
4. WAVE 2 migration scaffolding (~20k): *-shadow-parity x3 + shadow-parity, cutover-certificate, mixed-version-fixtures, restart-observation, deep-research-cutover-evidence, *-certificates, then inflight-state-classification. Verify after each.
5. Re-simplify the gate: drop shadow-parity/rollback/inflight checks; keep authority-state, reader-contracts, runtime-suite, tree-clean, fanout-real-run. Re-baseline.
6. Finalize+gate decision on lean system: land U3+U4, decide U2 finalize (all 8->final, drop legacy shadow) + lean PASS, or defer.

KEEP (never delete): per-mode-authority-flip selector+registry+finalize CAS; mode-append-gateway; event ledger+envelope; legacy-projections (consumer surface; Category C = separate future keep-vs-migrate call).

EXECUTOR: devin -p --model glm-5-2 --permission-mode bypass --respect-workspace-trust false --prompt-file <file>, env AI_SESSION_CHILD=1 MK_SPEC_GATE_ENFORCE=0 SYSTEM_SPEC_GATE_ENFORCE=0, </dev/null, background Bash (no & inside). Unsuffixed glm-5-2 = GLM-5.2 High free; no substitutes, HALT if gone. Brief it: work directly, foreground, no run_subagent/background. Briefs forbid git stash/checkout/restore/reset/clean, STOP on failed premise.

VERIFY: read diffs not reports. Per wave: build green -> named suites -> full-suite failing set BY NAME vs baseline (16/192 files, 14/4302 tests; set moves with load, repeat before accusing). Reconcile 012 metadata at end (003/004 stale Blocked->Complete; 005/006/009/010 + deletion phase); validate.sh --strict Errors:0. Never adjust a gate to pass it; never fabricate. REPORT per boundary: ran+exit, baseline->delta as sets, claim vs confirmed, SHA; confirmed vs inferred; HALT on red.
