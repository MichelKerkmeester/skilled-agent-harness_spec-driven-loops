# Deep Review — Iteration 003

**Dimension:** traceability — core: `spec_code`, `checklist_evidence`; overlay: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`.

**Target:** commit `a682c06d3d` on `worktrees/131-tieorder-warning` (diff `c62d7d1399..a682c06d3d`), doctor check 5l.

## Files Reviewed

- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` — heading `HUB-ROUTER CHECKS (5a-5l)` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1019]; `checkNativeSurfaceLast` (1159-1178); hub gate [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166]; softFail message [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1173]
- `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` — `addNamedSurfaces` (243-258); clean-fixture assertions (311-322, incl. [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:315]); the three 5l tests (478-501)
- `README.md` — hand-edit sentence [SOURCE: README.md:1468]
- `specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/spec.md` — REQ-001..004 (103-111), SC-001/002 (126-127), NFR-R01 (147), edge cases (156-158)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/decision-record.md` — ADR-001 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/decision-record.md:62]; ADR-002 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/027-surface-tie-order-warning/decision-record.md:158]
- commit diff `c62d7d1399..a682c06d3d` (16 files: 3 product, 10 packet docs, 3 parent bookkeeping)
- Not opened this iteration (tool-call cap): `goal.md` (scope file), `acceptance-criteria.md`, `implementation-summary.md`, `tasks.md`, `.skilled/skills/sk-code/hub-router.json`

## Findings by Severity

### P0

None.

### P1

None.

### P2

**R3-P2-001 — The spec's 5l edge-case silence statements are unpinned by the shipped tests**

- Case: a future edit drops the sk-code basename gate or the opencode-absent early return; 5l then prints a line on the six other hubs (or on an sk-code tree without `sk-code-opencode`), deviating from spec.md:156-158, and no test fails — the clean-fixture case asserts only FAIL/WARN absence plus a fixed PASS-id list, so a stray `PASS: 5l:` line on a non-sk-code hub goes unnoticed.
- File: `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:315`
- Evidence: [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:315] is the only negative assertion (`/^(FAIL|WARN): /m`); the id loop (316-319) never checks for absent lines; all three new tests build an sk-code fixture (478-501); the silence behavior is implemented at [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1166] and 1168.
- User impact: silent drift on six hubs, or on an sk-code fork without the native surface, ships green; the scoping promise loses its regression guard.
- Finding class: matrix/evidence
- Counterevidence sought: spec.md:50 promises exactly three tests, so the edge-case lines may be informational; an E2E doctor suite outside this file could pin the silence — none is present in the change set.
- Confidence: medium-high. Downgrade trigger: a test outside this file already asserts no 5l line on a non-sk-code hub.
- Recommendation: add two small cases — no 5l line on a non-sk-code hub, and no 5l line on an sk-code tree whose `tieBreak` lacks `sk-code-opencode`; optionally pin that 5l ignores a workflow mode after opencode.

Carried context, not a new finding: the 5l test fixtures skip manifest regeneration and description keywords (their sibling helpers do both), so their exit codes stay non-discriminating — already recorded as a strategy risk; the 5l line assertions are unaffected. Dedupe: R2-P2-001 (security, control-character interpolation) is distinct from this finding; the strategy's swept/blocked directions were not re-entered.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | pass | REQ-001 -> gate/filter/message; REQ-002/003 -> shipped-order and examples-removed tests; REQ-004 -> hub gate plus the global no-FAIL/WARN assertion; heading 5a-5l; README sentence |
| `checklist_evidence` | core | partial | REQ-level evidence verified this iteration; CHK-030..032 carried from iteration 2; closure rows (CHK-010 onward) live in `acceptance-criteria.md`, not opened (tool-call cap) |
| `skill_agent` | overlay | notApplicable | no skill or agent artifact in the change set (diff stat) |
| `agent_cross_runtime` | overlay | notApplicable | no agent definitions changed |
| `feature_catalog_code` | overlay | deferred | catalog-to-code range sweep not evidenced; no catalog artifact in the change set; tool-call cap |
| `playbook_capability` | overlay | deferred | same as `feature_catalog_code` |

ADR cross-check (deferred in iterations 1-2, performed now): ADR-001's `SK_CODE_NATIVE_SURFACE` / `SK_CODE_EXAMPLE_SURFACES` constants and the hub gate appear verbatim in the code; ADR-002's `softFail` is the emitted verdict with the FAIL/WARN split intact. ADR-001's "none is a PASS line" is not contradicted by the clean-case PASS line — NFR-R01 promises exactly that one PASS line.

## Verdict

No P0, no P1; one new P2 (advisory). `spec_code` passes; `checklist_evidence` advances to partial with the closure rows as the only gap; overlays scoped (two notApplicable, two deferred). Nothing blocks release readiness.

## Next Dimension

maintainability

Review verdict: PASS