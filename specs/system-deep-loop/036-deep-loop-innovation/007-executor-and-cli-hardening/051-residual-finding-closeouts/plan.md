---
title: "Implementation Plan: Residual Finding Closeouts (022 / 025 / 028)"
description: "Planned plan for closing three sibling residuals — 022's REQ-005 full-surface fixtures, 025's F-011-01 restore-authorization under-binding, and 028's open QA items — without reopening the landed siblings. Each workstream is independent and routes its fix to the correct runtime/test surface."
trigger_phrases:
  - "residual finding closeouts plan"
  - "REQ-005 fixture closeout plan"
  - "F-011-01 sameReference fix plan"
  - "028 open QA closeout plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/051-residual-finding-closeouts"
    last_updated_at: "2026-08-12T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the closeout plan with three independent workstreams"
    next_safe_action: "Confirm harness seams, then execute the three workstreams in a later pass"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions:
      - "Which workstream runs first once approved?"
    answered_questions:
      - "Siblings stay read-only; fixes route to runtime/test surfaces."
---
# Implementation Plan: Residual Finding Closeouts (022 / 025 / 028)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

> Planned scaffold. No fixture, runtime, or test is implemented in this pass; the phases below describe the later execution.

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Track** | `system-deep-loop/036-deep-loop-innovation` phase child |
| **Surfaces** | Shadow-parity harness fixtures (022), `sealed-reference-artifacts` store (025), fan-out dispatch tests + rollback docs (028) |
| **Testing** | Vitest suites owned by each source surface; serial, hang-safe execution |
| **Status** | Planned — three independent closeout workstreams |

### Overview

This plan closes three deferred residuals that already-landed siblings documented. Each residual is an independent workstream with its own fix surface, so they can run in any order or in parallel. The plan keeps the source siblings read-only and routes every fix to the runtime or test surface the residual actually names.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Each residual's source definition is quoted with a `file:line` citation (see `spec.md` §3, §4)
- [ ] Harness/test seams for REQ-001 and REQ-003 confirmed available
- [ ] Operator decision recorded on whether the F-011-01 change lands here or in its own runtime packet

### Definition of Done
- [ ] REQ-001 full-surface coverage (or approved exclusions) proven for all six modes
- [ ] REQ-002 `sameReference` binding change red-before/green-after verified
- [ ] REQ-003 028 residual bar satisfied or each item explicitly deferred with reason
- [ ] `validate.sh --strict` tracked to exit 0 for this child

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three independent closeout workstreams sharing one tracking packet. No shared runtime component; each workstream targets a distinct surface.

### Key Workstreams
- **WS-022 (REQ-001)**: Per-mode protected-surface enumeration plus fixtures that emit every event stem, so each surface element is field-by-field divergence-diffed across all six shadow-parity modes.
- **WS-025 (REQ-002)**: A one-call-site change in `resolveLifecycleAuthorization` to use `sameReference` instead of a `qualified_digest`-only compare, plus a red-before/green-after negative test and a positive control.
- **WS-028 (REQ-003)**: Fan-out dispatch QA debt — baseline capture, per-finding negative tests, per-dispatch-kind containment tests, sink redaction, rehearsed rollback, and a clean strict validation exit.

### Data Flow (per workstream)
1. Read the source residual at its cited `file:line`.
2. Enumerate the exact closeout deliverable and its evidence contract.
3. Implement on the residual's own runtime/test surface (never on the sibling docs).
4. Prove closure with the source's own verification standard.
5. Record the final state in this child's closeout evidence.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Intake and Seam Confirmation
- [ ] Re-read the three residuals at their cited `file:line` and confirm they still match the landed state
- [ ] Confirm shadow-parity harness seams (REQ-001) and fan-out test seams (REQ-003)
- [ ] Record the F-011-01 landing decision (this child vs. its own runtime packet)

### Phase 2: Closeout Execution (independent workstreams)
- [ ] WS-025: land the `sameReference` binding change with red-before/green-after tests
- [ ] WS-022: enumerate per-mode surfaces and add fixtures emitting every stem; record accepted schema-gap exclusions
- [ ] WS-028: capture pre-edit baseline, add per-finding + per-kind tests, sink redaction, and rehearse rollback

### Phase 3: Verification and Closeout
- [ ] Prove each residual closed against its source's verification standard, or record an explicit deferral
- [ ] Track `validate.sh --strict` to exit 0 for the closed 028 surface (CHK-008) and for this child
- [ ] Author the closeout evidence and reconcile status

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Shadow-parity divergence | Per-surface-element divergence detection across six modes (REQ-001) | Mode vitest harnesses |
| Authorization negative/positive | Same-`qualified_digest`/different-`artifact_kind` rejection; legitimate resolve (REQ-002) | `sealed-reference-artifacts` vitest |
| Fan-out dispatch QA | Per-finding negatives, per-dispatch-kind containment, fulfillment, sink redaction (REQ-003) | `fanout-run` / `write-containment` vitest |
| Whole-gate delta | Baseline-vs-final delta for the 028 surface | Runtime suite + receipts suites |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Landed siblings 022 / 025 / 028 | Internal | Green | Residual definitions must match landed state |
| Shadow-parity harness seams | Internal | Unknown | REQ-001 fixture expansion blocked until confirmed |
| `sealed-artifact-store.ts` `resolveLifecycleAuthorization` | Internal | Green | REQ-002 fix site |
| Fan-out test + rollback surfaces | Internal | Green | REQ-003 QA closeout |
| Operator decision on F-011-01 landing | External | Pending | Determines whether WS-025 lands here |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A closeout change regresses a landed sibling deliverable or the fan-out gate.
- **Procedure**: Revert only the closeout workstream's commits on its runtime/test surface; the source siblings are untouched, so no sibling rollback is needed.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Intake) ──> Phase 2 (WS-022 | WS-025 | WS-028, independent) ──> Phase 3 (Verify + Closeout)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Intake | None | Execution |
| WS-022 / WS-025 / WS-028 | Intake | Verify |
| Verify + Closeout | Execution | None |

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Workstream | Complexity | Notes |
|-----------|------------|-------|
| WS-025 (F-011-01) | Low | One call-site change plus two tests |
| WS-022 (REQ-005) | Medium-High | Six modes; some fields need a reducer-schema decision |
| WS-028 (open QA) | High | 14 P0 items behind landed code |

<!-- /ANCHOR:l2-effort -->
---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-execution Checklist
- [ ] Pre-edit baseline captured for every runner an in-scope workstream touches (028 CHK-002)
- [ ] Each workstream's surface identified so a revert is scoped to that surface only

### Rollback Procedure
1. **Identify** the workstream whose change regressed.
2. **Revert** only that workstream's commits on its runtime/test surface.
3. **Re-run** the affected suite and confirm the baseline is restored.
4. **Confirm** no source sibling file changed (they are read-only in this child).

### Data Reversal
- **Has data migrations?** No — closeout work is fixtures, tests, and a one-line binding change.

<!-- /ANCHOR:l2-rollback -->
