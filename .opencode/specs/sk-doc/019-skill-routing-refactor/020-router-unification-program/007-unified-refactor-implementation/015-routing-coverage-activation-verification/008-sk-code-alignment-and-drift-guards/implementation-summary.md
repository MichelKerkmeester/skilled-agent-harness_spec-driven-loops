---
title: "Implementation Summary: sk-code Alignment & Drift Guards"
description: "Completion record for sk-code alignment guards. Commit a1cdb65d90 delivered the RESOURCE_MAP doc-truth fix, default-off --check-router validation with positive/drift fixtures, the shared qualifiedIdToLeaf bridge and bidirectional bijection tests, and run-all-drift-guards.sh. The P1 surfaceBundle request-context was explicitly deferred; the repository default and routing decisions remain unchanged, and the frozen scorer trio stayed SHA-256-identical."
trigger_phrases:
  - "sk-code alignment implementation summary"
  - "drift guards delivered summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/008-sk-code-alignment-and-drift-guards"
    last_updated_at: "2026-07-21T03:58:44Z"
    last_updated_by: "codex-gpt-5.6"
    recent_action: "Reconciled delivery evidence to commit a1cdb65d90"
    next_safe_action: "P4/011 operator-gated cutover remains pending"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "P0 guards and P1 check-router landed; P1 surfaceBundle was deferred"
---
# Implementation Summary: sk-code Alignment & Drift Guards

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented — landed in `a1cdb65d90`. The RESOURCE_MAP doc-truth fix, the `qualifiedIdToLeaf` bidirectional bijection test, and the `run-all-drift-guards.sh` orchestrator are built (002 landed, satisfying its REQ-006 dependency); the frozen scorer trio stayed byte-identical (SHA-256 unchanged) |
| **Authored** | 2026-07-20 |
| **Level** | 2 |
| **Serving authority** | Unaffected — this child changes no manifest, no `selectedPolicy`, and no routing decision |
| **Strict validation** | Rerun after final metadata regeneration; result recorded at handoff |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> **Status: Implemented** (landed in `a1cdb65d90`). The build below is delivered; the frozen scorer stayed SHA-256-identical and routing byte-identical to legacy.

The code-opencode alignment-authority interface now names `sk-code-router-sync.vitest.ts` as the RESOURCE_MAP-equality guard and backlinks it from `alignment-verification-automation.md`. The shared `qualifiedIdToLeaf` reverse lookup and the router-sync Vitest close the compiled-destination ↔ leaf-manifest ↔ RESOURCE_MAP bijection in both directions. `run-all-drift-guards.sh` provides one non-zero-on-any-failure entry point over the language, stack-folder, and router-sync guards. The P1 `--check-router` addition landed default-off with positive, drift, and default-behavior fixtures. The separate P1 `surfaceBundle` request-context did not land and remains explicitly deferred.

### Files Delivered

| Area | Files | Purpose |
|------|-------|---------|
| Doc-truth | `code-opencode/SKILL.md`, `alignment-verification-automation.md §5` | Name and backlink the real RESOURCE_MAP-equality guard |
| Bijection | `leaf-resource-contract.cjs`, `leaf-resource-contract.test.cjs`, `sk-code-router-sync.vitest.ts` | `qualifiedIdToLeaf` export + bidirectional test coverage |
| Orchestration | `run-all-drift-guards.sh` (new) | Single entry point over all three drift guards |
| P1 delivered | `verify_alignment_drift.py`, `test_verify_alignment_drift.py` | Default-off RESOURCE_MAP dead-path check plus positive/drift/default fixtures |
| P1 deferred | Promoted runtime request contract | Optional `surfaceBundle` context was not included in `a1cdb65d90` |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

> **Status: Implemented** (landed in `a1cdb65d90`). The phases below describe the delivered sequence.

Commit `a1cdb65d90` delivered the doc-truth rename/backlink and authority note first, then the shared reverse lookup, bidirectional tests, orchestrator, and gate-list update. It also delivered the default-off `--check-router` parser and its Python fixtures. The optional `surfaceBundle` context/LUNA case was not included, so the completion boundary is the implemented P0 scope plus REQ-005; REQ-006 remains an explicit P1 deferral. Every delivered change is additive or default-off and reversible by file revert.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Split CF-SC-1's fix into a P0 doc-truth rename and a P1 markdown-parser stretch | The rename is the cheapest correct fix (makes the claim true immediately); the parser is a heavier, optional enhancement that can ship independently without blocking the P0 truth-fix |
| Bijection test is bidirectional, not one-directional | A one-directional check (compiled → RESOURCE_MAP only) would miss a documented resource with no compiled backing; CF-SC-2 explicitly requires both directions |
| One orchestrator script over three disjoint guards, not a merge of the guards themselves | The three guards have different runtimes (Python, Python, Vitest) and different owners; unifying the entry point (not the implementation) avoids a risky rewrite while closing the "no single command" gap |
| `surfaceBundle` context is additive-only and gated on 002 | The public front door change must never regress prompt-text-only callers, and the promoted-path dependency means REQ-006 cannot be built against the mutable spec-tree copy |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| RESOURCE_MAP authority wording | Pass — `SKILL.md` and the automation reference name/backlink `sk-code-router-sync.vitest.ts` |
| Shared reverse lookup | Pass — `qualifiedIdToLeaf` landed in `leaf-resource-contract.cjs` with direct success and fail-closed tests |
| Bidirectional bijection | Pass — router-sync Vitest covers manifest round trips and every code-opencode RESOURCE_MAP entry |
| Unified drift entry point | Pass — `run-all-drift-guards.sh` invokes all three guards and returns non-zero when any command fails |
| `--check-router` | Pass — Python tests cover aligned, dead-path, and default-off/no-markdown behavior |
| `surfaceBundle` request context | Deferred (P1) — no such runtime change or LUNA case appears in `a1cdb65d90` |
| Frozen scorer | Pass — no frozen path in the commit; start/end SHA-256 values are checked separately |
| Strict packet validation | Pending only until final metadata regeneration; final result recorded at handoff |

## Milestone Status

| Milestone | Status | Evidence |
|-----------|--------|----------|
| M0 doc truth | Done | Authority wording/backlink landed in `a1cdb65d90` |
| M1 bijection + orchestration | Done | Shared lookup, direct tests, router-sync tests, and unified guard script landed |
| M2 P1 markdown guard | Done | Default-off `--check-router` and fixtures landed |
| M3 P1 composite context | Deferred | `surfaceBundle` request-context and LUNA case were not included |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **REQ-006 is explicitly deferred.** The additive `surfaceBundle` request-context and its LUNA-high case did not land; no summary or checklist row claims otherwise.
2. **The markdown guard is intentionally default-off.** Normal `verify_alignment_drift.py` behavior remains unchanged unless `--check-router` is passed.
3. **No live canary or default flip occurred.** These guards support readiness; P4/011 remains operator-gated and blocked on siblings 013/014.

<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [x] P0 doc-truth, shared bijection, and unified drift-orchestrator scope landed in `a1cdb65d90`.
- [x] P1 default-off `--check-router` and its fixtures landed in `a1cdb65d90`.
- [ ] REQ-006: add `surfaceBundle` request context and a LUNA-high case only under a separately approved follow-up; it is not required for this completed child boundary.
- [ ] Consume these guards during the operator-gated P4/011 canary after the join gate is green.

<!-- /ANCHOR:follow-up -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

The planned P1 work split: `--check-router` shipped, while `surfaceBundle` and its LUNA-high evidence were deferred. The core P0 alignment authority was not reduced. No routing decision, manifest, repository default, or frozen scorer changed.

<!-- /ANCHOR:deviations -->
