---
title: "Implementation Plan: Program-Surface Leftovers"
description: "Close the four in-scope findings no sibling phase owns: implicit workflow token permissions while npm-fetched tools execute, a feature catalog conflating modes with packets, a deprecated derived-sync writer advertising a schema path it no l"
trigger_phrases:
  - "program leftovers implementation plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/019-program-surface-leftovers"
    last_updated_at: "2026-07-30T11:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed four program-surface leftovers"
    next_safe_action: "Proceed to phase 018"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/019-program-surface-leftovers"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Program-Surface Leftovers

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Close the four in-scope findings no sibling phase owns: implicit workflow token permissions while npm-fetched tools execute, a feature catalog conflating modes with packets, a deprecated derived-sync writer advertising a schema path it no longer serves, and requirement wording that contradicts the phase map's own ordering.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

The workflow declares explicit permissions and still passes CI under them; the feature catalog describes the real mode-to-packet relationship; the deprecated writer is gone or accurately documented with the caller search recorded; the requirement wording agrees with the phase map; and each fix carries a verification specific to it.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Four unrelated surfaces sharing only the property that a coverage audit found them unowned. The workflow and the requirement wording are program artifacts; the catalog and the sync writer are adjacent surfaces the program edited. Each is small enough to land independently, so the phase is four separable changes rather than one coordinated edit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms each finding still reproduces and searches for callers of the deprecated writer. Implementation lands the four changes separately. Verification runs CI under the narrowed permission grant, reads the catalog against the live mode registry, and re-reads the parent spec for remaining contradictions.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each fix has its own check because they share no machinery: a CI run for the permission grant, a read against the mode registry for the catalog, a caller search for the writer, and a contradiction sweep for the wording. Inspection alone is not sufficient for any of them.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 014 edits the same workflow file. If both are open at once, the workflow changes are sequenced so neither rewrites the other's job block.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Four independent commits, each revertible alone. The permission narrowing is the only one that can break a green pipeline, and it is proven by CI before it is accepted.
<!-- /ANCHOR:rollback -->
