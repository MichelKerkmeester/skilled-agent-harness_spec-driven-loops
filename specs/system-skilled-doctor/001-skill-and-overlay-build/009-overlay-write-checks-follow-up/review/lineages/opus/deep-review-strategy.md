---
title: Deep Review Strategy - opus lineage
description: Session tracking for the opus fan-out lineage reviewing the overlay write-checks follow-up commits.
---

# Deep Review Strategy - opus lineage

## 2. TOPIC
Review of commits c57b7e4cef..e97ca56e8d on main: `overlay-engine.cjs`, its `overlay-engine-*.test.cjs` tests, `.skilled/hooks/overlay-guard/opencode/`, `doctor/overlay.md` with `_routes.yaml` and `assets/doctor-overlay-*`, and `system-skilled-doctor/references/overlays.md` with its `manual-testing-playbook/overlays/`.

Operator review focus: data-loss and safety paths first (lock takeover, layout link retarget, removal of dropped json-entry items, apply --relayout moves and backups), then the strict write checks, the commit check and status --audit, the OpenCode adapter, and doc-to-engine parity.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness (iteration 1)
- [x] D2 Security (iteration 2)
- [x] D3 Traceability (iteration 2)
- [x] D4 Maintainability (iteration 2)
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- Trigger-index regeneration, leaf-alias JSON, and the packet's research artifacts in the same commit range.
- Running the test suites (the session permission layer refuses `node`).

---

## 5. STOP CONDITIONS
- stopPolicy max-iterations: stop after iteration 2 and synthesize with stopReason maxIterationsReached.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | Relayout can strand a layout link the next apply refuses to fix; three P2 safety gaps in lock takeover, dropped-item ownership and relayout atomicity. |
| D2 Security | PASS (advisory) | 2 | Write checks and audit sound; a staged pin change switches the commit check off (P2). |
| D3 Traceability | CONDITIONAL | 2 | Apply YAML reports "nothing was written" after relayout moved copies (P1); status YAML names a nonexistent relayout target; lock docs omit relayout and rollback. |
| D4 Maintainability | PASS (advisory) | 2 | Relayout link rewrite has no test or playbook coverage. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active
- **P2 (Minor):** 7 active
- **Delta this iteration:** +0 P0, +1 P1, +4 P2
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Reading each data-loss path end to end (plan, apply, state write) and then checking the follow-up test fixture for that path found the untested relayout link rewrite (iteration 1).
- Diffing the commit range for `links`, `items`, lock takeover and relayout confirmed all four are new, which made the upgrade-from-older-state case the one to test (iteration 1).

---

## 9. WHAT FAILED
- Running the append gateway, the reducer, or the engine tests: every `node` call was refused by the session permission layer (iteration 1).
- Reading the packet's acceptance criteria did not fit the iteration 2 budget; checklist_evidence stays uncovered (iteration 2).

### Iteration 2 what worked
- Grepping the command docs for each engine behaviour (relayout, audit, lock, pre-commit) and reading the engine's ordering beside each claim found two contract drifts and settled iteration 1's downgrade trigger (iteration 2).

---

## 10. EXHAUSTED APPROACHES (do not retry)

### Node execution in this session -- BLOCKED (iteration 1, 3 attempts)
- What was tried: inline `node -e` event builder, a builder script inside the lineage, `append-mode-event.cjs --help`.
- Why blocked: the permission layer requires approval for every `node` invocation and nobody can grant it.
- Do NOT retry: record gateway events as files under `gateway-events/` for replay instead.

---

## 11. RULED OUT DIRECTIONS
- Shared item records across overlays on one destination: `analyze` throws on duplicate destinations (iteration 1, overlay-engine.cjs:2150).
- Retarget deleting a real file: lstat guard before unlink (iteration 1, overlay-engine.cjs:1737).

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Synthesis (iteration cap 2 reached, stopReason maxIterationsReached). Recheck OPUS-I1-P1-001 and OPUS-I2-P1-005; carry the node-permission blocker into the report. Not covered: packet acceptance-criteria (checklist_evidence) and running any test.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
- Target pointers: `.skilled/commands/doctor/scripts/overlay-engine.cjs` (4895 lines; +1017/- in range), `tests/overlay-engine-follow-up.test.cjs` (804 new lines), `tests/overlay-engine-strict-writes.test.cjs` (223 new lines), `hooks/overlay-guard/opencode/` (README + 1-line adapter), five new playbook scenarios.
- Lineage blocker: the append gateway and reducer cannot run in this session; canonical records are kept at `gateway-events/iteration-NNN.json` and `deltas/iter-NNN.jsonl`.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
- spec_code: partial (iteration 1)
- checklist_evidence: pending
- playbook_capability: pending
<!-- MACHINE-OWNED: END -->
