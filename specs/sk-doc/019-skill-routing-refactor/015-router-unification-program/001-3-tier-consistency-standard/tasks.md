---
title: "Tasks: Fleet-Wide Routing Consistency (3-tier standard)"
description: "Task breakdown for the fleet routing-consistency packet. The route-gold gate full-fix tasks are complete (7/7 hubs green); the harness de-skill-specifying, full convergence, and fleet-verification tasks remain staged."
trigger_phrases:
  - "fleet routing consistency tasks"
  - "route-gold gate tasks"
  - "3-tier standard task breakdown"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/001-3-tier-consistency-standard"
    last_updated_at: "2026-07-17T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Route-gold gate full-fix: 7/7 hubs PASS (91 scenarios), pushed to v4"
    next_safe_action: "REQ-001 harness de-skill-specific + REQ-002 convergence, then REQ-006 fleet verification"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 45
    open_questions:
      - "REQ-006 fleet verification (mutation/blind-holdout/live-mode) not yet run"
    answered_questions:
      - "Route-gold reconciliation ratified as FULL-FIX hub-by-hub, done for all 7 hubs"
---
# Tasks: Fleet-Wide Routing Consistency (3-tier standard)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (artifact) [evidence]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Define route-gold gate semantics: exact mode set + exact leaf set per scenario `sameSet(observed, expected)`
- [x] T002 Establish the anti-circularity rule: derive the answer from scenario prose, fix the router, then set gold `intent-derived`
- [x] T003 Prove the recipe directly on sk-prompt (proof-of-recipe) `commit 5dd0a330a4`
- [x] T004 Encode the gate semantics + scope-lock into an airtight fan-out brief `brief-validated`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Fan out mcp-tooling as a single brief-validation dispatch `13/13 route-gold`
- [x] T011 [P] Fix cli-external-orchestration route-gold defects `7/7, commit 691418d967`
- [x] T012 [P] Fix system-deep-loop frontmatter/prose intent mismatches `20/20, commit 6cd8ab14e4`
- [x] T013 [P] Fix sk-code surface RESOURCE_MAP completeness (2 shared refs) `15/15, commit 0e3528cb32`
- [x] T014 [P] Fix sk-doc catch-all over-emission (8-mode fan-out) `32/32, commit 023b974b12`
- [x] T015 Remove the generic catch-all vocabulary class from specialized modes `over-emission root cause`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Re-run the route-gold gate per returned hub against a clean committed tree `7/7 PASS`
- [x] T021 Scope-check every agent diff: own-hub only, no `scripts/`/`mcp_server/`/`dist` edits `diff review`
- [x] T022 Confirm each `leaf-manifest.json` byte-stable and every added leaf path exists on disk `byte-stable`
- [x] T023 Full fleet route-gold sweep on clean tree `7/7 hubs, 91 scenarios, 0 violations`
- [ ] T024 REQ-001 de-skill-specify the shared harness classifier + gold-derivation
- [ ] T025 REQ-002 converge every unit to one router shape + frontmatter typed gold
- [ ] T026 REQ-006 run fleet verification with teeth (mutation + blind holdout + live-mode)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Route-gold slice: all 7 hubs PASS on a clean committed tree
- [x] Every fix intent-derived; no gold bent to a broken router
- [x] Working tree clean; all slice commits pushed to `skilled/v4.0.0.0`
- [ ] Remaining REQ-001/REQ-002/REQ-006/REQ-007 tracked as staged follow-ups (packet at ~45%)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
