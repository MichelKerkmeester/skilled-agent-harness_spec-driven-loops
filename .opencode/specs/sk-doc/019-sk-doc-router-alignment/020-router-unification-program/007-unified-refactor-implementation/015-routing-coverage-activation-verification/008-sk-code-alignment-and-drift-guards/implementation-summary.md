---
title: "Implementation Summary: sk-code Alignment & Drift Guards"
description: "Planning-time record (Status: Planned) of the RESOURCE_MAP doc-truth fix, the qualifiedIdToLeaf bidirectional bijection test, the run-all-drift-guards.sh orchestrator, and the additive surfaceBundle request-context. No code has been written yet; this document will be updated with delivery evidence once implementation completes."
trigger_phrases:
  - "sk-code alignment implementation summary"
  - "drift guards planned summary"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: sk-code Alignment & Drift Guards

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned — not yet started; depends on `002-runtime-promotion-and-status-foundation` for REQ-006 only |
| **Authored** | 2026-07-20 |
| **Level** | 2 |
| **Serving authority** | Unaffected — this child changes no manifest, no `selectedPolicy`, and no routing decision |
| **Strict validation** | Planning-doc validation (`validate.sh --strict` on this folder) is run at authoring time; implementation-time re-run against delivered code is a separate completion gate, not yet exercised |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

> **Status: Planned.** Nothing below has been built yet; this section states the intended build so implementation can be verified against it.

A corrected code-opencode alignment-authority interface: `code-opencode/SKILL.md`'s RESOURCE_MAP-equality claim will name the real guard (`sk-code-router-sync.vitest.ts`) instead of the markdown-blind `verify_alignment_drift.py`, backlinked from `alignment-verification-automation.md §5`. A `qualifiedIdToLeaf` bidirectional bijection test will close the gap between the compiled router's `targetQualifiedIds` output and the RESOURCE_MAP's documented leaves. A single `run-all-drift-guards.sh` entry point will unify sk-code's three disjoint drift guards behind one non-zero-on-any-failure exit code. Two P1 stretch items — a default-off `--check-router` markdown parser on `verify_alignment_drift.py`, and an additive `surfaceBundle` composite-routing context on the promoted runtime request contract — extend the same interface once `002` has shipped. Together, this is the single code-opencode alignment authority (CF-SC-5) that `009`, `010`, and `011` are expected to consume rather than re-derive.

### Files Planned

| Area | Files | Purpose |
|------|-------|---------|
| Doc-truth | `code-opencode/SKILL.md`, `alignment-verification-automation.md §5` | Name and backlink the real RESOURCE_MAP-equality guard |
| Bijection | `leaf-resource-contract.cjs`, `leaf-resource-contract.test.cjs`, `sk-code-router-sync.vitest.ts` | `qualifiedIdToLeaf` export + bidirectional test coverage |
| Orchestration | `run-all-drift-guards.sh` (new) | Single entry point over all three drift guards |
| Stretch (P1) | `verify_alignment_drift.py` (`--check-router`), promoted runtime request contract | Markdown RESOURCE_MAP parsing; additive `surfaceBundle` context |
| Documentation | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | This planning record |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

> **Status: Planned.** The phases below describe the intended delivery sequence; none has executed yet.

Per `plan.md`, four phases: (1) doc-truth — rename the claim, add the backlink, draft the authority-interface note; (2) bijection + orchestration — add `qualifiedIdToLeaf`, the bidirectional Vitest suite, and `run-all-drift-guards.sh`, then update `SKILL.md`'s gate list; (3) stretch (P1) — the default-off `--check-router` markdown parser with positive and drift fixtures, and the additive `surfaceBundle` request-context field proven by one LUNA-high playbook case; (4) verification — re-hash the frozen scorer trio before and after the full diff, then run `validate.sh --strict` on this folder. Every phase is additive or flag-gated; none requires a rollback beyond a plain file revert.

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

> **Status: Planned.** The checks below are what will be run; none has been run yet.

Once implemented, this child will be verified by: (1) the bijection Vitest suite reporting zero orphans in both directions; (2) `run-all-drift-guards.sh` exiting non-zero when any single guard is seeded to fail, and 0 when all three pass; (3) — P1 — `--check-router` passing its positive fixture and failing its drift fixture, with default (no-flag) behavior byte-identical to today; (4) — P1 — the LUNA-high playbook case recording a `surfaceBundle` result containing `sk-code:code-opencode`; (5) frozen-scorer SHA-256 digests unchanged pre/post the full diff; (6) `validate.sh --strict` on this folder reporting Errors: 0. None of these checks has been run yet — this section states what will be confirmed, not what has been confirmed.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a planning-only record.** Status is Planned, not Complete; no code, test, or script described above has been written yet.
2. **REQ-005 and REQ-006 (P1) may be deferred with user approval** if `002`'s promoted request-contract shape is not final when this child's implementation starts.
3. **The exact `--check-router` implementation strategy is an open question** (native markdown-table parser vs. shelling out to `router-replay.cjs`'s existing `parseRouter`), resolved at build time per `spec.md` §7.

<!-- /ANCHOR:limitations -->

<!--
_memory:
  continuity:
    status: planned
    current_focus: "Level-2 planning docs authored for 008-sk-code-alignment-and-drift-guards (spec/plan/tasks/checklist/implementation-summary); no implementation started"
    next_steps:
      - "Wait for 002-runtime-promotion-and-status-foundation to ship before starting REQ-006"
      - "Implement REQ-001..REQ-004 (P0) independently of 002"
      - "Resolve the three Open Questions in spec.md §7 at build time"
    blockers:
      - "002-runtime-promotion-and-status-foundation not yet started (blocks REQ-006 only)"
-->
