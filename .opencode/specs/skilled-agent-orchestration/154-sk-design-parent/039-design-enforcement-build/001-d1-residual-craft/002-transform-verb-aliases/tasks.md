---
title: "Tasks: Transform-verb registry aliases + interface authoring lane"
description: "Level 2 task list for registering five transform verbs as interface routing aliases, syncing the router vocabulary, creating the interface transform authoring lane, and adding router-replay gold prompts."
trigger_phrases:
  - "transform verb aliases tasks"
  - "design transform routing tasks"
  - "interface transform application tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/002-transform-verb-aliases"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked all transform-verb tasks complete with one-line evidence"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/design-interface/references/design-process/transform_application.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Router consumes hub-router.json vocabularyClasses, not registry aliases, so scope was amended to include it"
---
# Tasks: Transform-verb registry aliases + interface authoring lane

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

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Reconcile]

- [x] T001 Read the `interface` mode `aliases[]` and capture the baseline alias + collision count (`sk-design/mode-registry.json`) [10m] — baseline captured, 0 collisions
- [x] T002 [P] Read the `interface` `taskProjections` and confirm shared verbs + their `ownerMode` (`sk-design/command-metadata.json`) [10m] — four shared verbs owned by interface
- [x] T003 [P] Confirm no verb of `bolder/quieter/distill/clarify/delight` already appears as an alias on any mode (`sk-design/mode-registry.json`) [5m] — none collide, clean additive
- [x] T004 [P] Confirm `transform_application.md` is absent and note its `design-process/` sibling references (`sk-design/design-interface/references/design-process/`) [5m] — confirmed absent, siblings noted

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Aliases and Lane]

### Registry Aliases & Tie-breaker
- [x] T005 Append `bolder`, `quieter`, `distill`, `clarify`, `delight` to the `interface` mode `aliases[]`, preserving all existing entries (`sk-design/mode-registry.json`) [30m] — appended, prior aliases preserved
- [x] T006 Add the additive audit-vs-interface tie-breaker block (audit = "should it be" / interface = "make it") (`sk-design/mode-registry.json`) [30m] — `transformVerbRouting` block plus `audit-transform-question` class synced to hub-router (scope amendment)
- [x] T006b Sync the five verbs into the live router vocabulary and add the `audit-transform-question` class (`sk-design/hub-router.json`) [30m] — added mid-phase, the router reads hub-router not the registry

### Interface Authoring Lane
- [x] T007 Create the authoring-lane doc with a lane per verb — keep/remove ledger, before/after frame, earned-moment + reduced-motion + opt-out guards (`sk-design/design-interface/references/design-process/transform_application.md`) [45m] — five lanes plus shared contract
- [x] T008 [P] Document the tie-break rule in prose and list the gold prompts inside the lane doc (`sk-design/design-interface/references/design-process/transform_application.md`) [20m] — routing rule and 10-row gold-prompt table present

### Router-replay Gold Prompts
- [x] T009 Author one alias arm per verb — public prompt + private `expected.workflowMode: interface` / `routeOutcome: single` / `forbiddenWorkflowModes` (skill-benchmark `fixtures/sk-design/`) [30m] — 5 alias arms to interface
- [x] T010 [P] Author an audit-vs-interface minimal pair per verb sharing a `minimalPairGroup` — interface arm "make it …" → interface, audit arm "should it be …" → audit (skill-benchmark `fixtures/sk-design/`) [30m] — 5 audit arms to audit, shared `minimalPairGroup` per verb

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Structural
- [x] T011 Validate `mode-registry.json` parses as JSON [5m] — parses clean, `hub-router.json` also parses
- [x] T012 Confirm zero alias collisions across all modes after the additions (`sk-design/mode-registry.json`) [10m] — drift guard reports 0 collisions

### Routing
- [x] T013 Run `router-replay` over the gold prompts; confirm every interface arm resolves to `interface` [15m] — 5 interface arms route to interface
- [x] T014 Confirm every audit-framed arm resolves to `audit` via the tie-breaker [10m] — 5 audit arms route to audit

### Reconciliation & Evergreen
- [x] T015 [P] Confirm shared verbs (`bolder/quieter/distill/delight`) resolve to the same owner as their command task projection (`interface`) [10m] — D2 reconciliation holds, clarify alias-only
- [x] T016 [P] Static-scan the changed/created artifacts for embedded spec IDs, packet numbers, or finding IDs (must be none) [10m] — evergreen grep over four targets finds none

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — every task complete with evidence
- [x] No `[B]` blocked tasks remaining — none blocked
- [x] `mode-registry.json` parses, zero alias collisions — both JSONs parse, drift guard 0 collisions
- [x] Router-replay deterministic for every verb (interface) and every audit arm (audit) — hubRoute scorer routes all 10 arms correctly
- [x] Shared-verb owner reconciliation confirmed against `command-metadata.json` — four shared verbs owned by interface, clarify alias-only
- [x] Checklist.md fully verified — all checklist items marked with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~100 lines)
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
