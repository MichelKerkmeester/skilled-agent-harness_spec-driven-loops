---
title: "Implementation Plan: Doctrine Coherence Sweep"
description: "Probe-driven prose sweep: re-verify lens-1 findings, batch-correct the advisor-facing mislabels and overlay leftover, replace second file-lists with matrix links, add canonical-contract links across advisor docs, regenerate touched manifests."
trigger_phrases:
  - "doctrine coherence sweep plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/025-doctrine-coherence-sweep"
    last_updated_at: "2026-07-28T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Planned"
    next_safe_action: "Execute after operator go"
    blockers:
      - "Execution awaits operator authorization"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "025-doctrine-coherence-sweep"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Doctrine Coherence Sweep

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Mechanical alignment sweep driven by greppable probes: fix the mislabels, kill the restatements, add the links, prove zero stale phrasings remain, regenerate whatever leaf churn the edits cause.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Stale-phrase probes | zero hits repo-wide for the catalogued phrasings |
| Fleet gate + freshness + doctor + suites | green after regeneration |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Prose-only: the contract stays the single stated authority; every touched doc either agrees or links. No behavior changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Re-verify and build the probe list

Confirm each lens-1 finding on the execution tip; derive the exact grep probes that must return zero after the sweep.

### Phase 2: create-skill surfaces

Templates, scaffold, SKILL.md shape trees, README, parent doctrine, router-schema related list.

### Phase 3: advisor surfaces

Feature-catalog auto-indexing docs, graph references, mcp-server READMEs — link, don't restate.

### Phase 4: Regenerate and prove

Gate --fix for leaf churn, compiled re-mint if router inputs moved, probes at zero, full sweep green.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The probe list is the test: stale phrasings at zero, plus the standing gates unchanged-green.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Lens-1 evidence; the canonical contract doc; independent of 024/026 (parallel-safe, different files except SKILL.md — coordinate that one file if run concurrently with 024).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Single revert; prose-only.
<!-- /ANCHOR:rollback -->
