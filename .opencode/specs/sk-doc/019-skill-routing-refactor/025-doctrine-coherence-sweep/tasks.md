---
title: "Task Breakdown: Doctrine Coherence Sweep"
description: "Planned tasks for the stale-phrase probes, create-skill and advisor doc corrections, and regeneration."
trigger_phrases:
  - "doctrine coherence sweep tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/025-doctrine-coherence-sweep"
    last_updated_at: "2026-07-28T16:27:03Z"
    last_updated_by: "claude-code"
    recent_action: "Delivered and verified"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "025-doctrine-coherence-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Task Breakdown: Doctrine Coherence Sweep

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` planned; `T-nn` in execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Re-verify all 22 lens-1 findings; build the zero-hit probe list [evidence: 22 findings re-verified; probe list: advisor-facing, advisor-routable pair, overlay wording]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-02 Fix the five advisor-facing description.json mislabels (templates, scaffold, doctrine, graph template derived lists) [evidence: description/hub templates, scaffold, doctrine and graph-template derived lists corrected]
- [x] T-03 Remove the overlay-policy restatement; link the hub-required rule [evidence: doctrine states the class-H rule with the contract link]
- [x] T-04 SKILL.md shape trees + README lists: complete or replace with matrix links [evidence: shape trees + README list the full class sets]
- [x] T-05 Advisor feature-catalog/graph/mcp-server docs: add canonical-contract links [evidence: advisor feature-catalog/graph/mcp-server docs link the contract]
- [x] T-06 Version-bump every edited authored doc [evidence: edited authored docs version-bumped]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-07 Probes at zero; gate --fix + compiled re-mint as needed; full sweep green; land [evidence: probes zero outside changelogs (historical wording kept by design); gates 11/11]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Zero stale phrasings; all gates green; landed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · Evidence `../024-create-journey-gate-fixes/research/swarm/lens1-report.md`
<!-- /ANCHOR:cross-refs -->
