---
title: "Tasks: defaultMode Policy Implementation"
description: "Task breakdown for the defaultMode policy packet: four hub flips to null default, the sk-design hub-identity fix, the canon defer-routed archetype, and the follow-up card plus cli runtimeDetection config. All complete, config-only, route-gold-gated."
trigger_phrases:
  - "default mode implementation tasks"
  - "flip hubs to null tasks"
  - "sk-design over-emission fix tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/002-default-mode-implementation"
    last_updated_at: "2026-08-16T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Flipped 4 hubs to defaultMode null + routing-helper fallback; sk-design over-emission fixed"
    next_safe_action: "Open follow-ups: defaultApplied telemetry (blocked), cli runtime enforcement, live measurement"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The defaultMode flips do not move route-gold, so gating was clean"
---
# Tasks: defaultMode Policy Implementation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Record each hub's original `defaultMode` and `defaultResource` for rollback `spec.md section 3`
- [x] T002 Capture the route-gold baseline verdicts before edits `sdl 20/20, mcp 13/13, cli 7/7`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Flip four hubs to `defaultMode: null` + routing-helper `defaultResource` `commit 908efde8d8`
- [x] T011 Keep sk-prompt's `prompt-improve` default (it anchors the `hub-identity` catch-all) `unchanged`
- [x] T012 Remove `hub-identity` from sk-design's six modes' `classes`, keep it discovery-only `six modes`
- [x] T013 Add the defer-routed archetype to create-skill `parent_hub_router_schema.md` `third archetype`
- [x] T014 Follow-up pass: fallback-only card + cli `runtimeDetection` config block `2026-07-18`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Re-run route-gold per hub; confirm each baseline held `all PASS`
- [x] T021 Confirm sk-design defers on "help me with sk-design" `intents: [] no-mode-scored`
- [x] T022 Confirm `defaultApplied` flipped `false` on the flipped hubs `telemetry reflects flip`
- [x] T023 Scope-check the diff: four hub-router files + canon doc + this packet only `config-only`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All four hubs at `defaultMode: null` with the routing-helper fallback; sk-prompt unchanged
- [x] sk-design over-emission fixed and verified via router-replay
- [x] Route-gold green fleet-wide, no regression
- [x] Every change reversible from the recorded originals
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
