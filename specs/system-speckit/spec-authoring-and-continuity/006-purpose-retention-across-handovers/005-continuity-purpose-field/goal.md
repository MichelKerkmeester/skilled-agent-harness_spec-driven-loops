---
title: "Goal: Phase 5: continuity-purpose-field"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/005-continuity-purpose-field"
    last_updated_at: "2026-11-14T08:45:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ef52f514-275d-4013-b7bd-ab365324057d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: continuity-purpose-field

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The continuity block a save writes names the packet's purpose in one line copied from its spec docs, and the Goal facet built from that block leads with the purpose and keeps the next safe action beside it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] REQ-001: The reader keeps a valid `packet_purpose` through a write and a read, and drops an invalid one while the rest of the block still loads. The tests `keeps the purpose line through a write and a read, and leads the Goal facet with it` and `drops a purpose that is not one short line and keeps the rest of the block` pass, and the probe prints `has_packet_purpose=true` and `kept_in_markdown=true` after the build
- [x] REQ-002: A `--full-auto` save that writes continuity sets `packet_purpose` from the helper for the leaf it writes, including a leaf reached from a phase parent, and removes a stored copy when the helper returns null. The tests `copies the nearest authored purpose into the leaf a parent-targeted save reaches` and `removes a stored purpose copy once no purpose is authored` pass
- [x] REQ-003: No existing block fails to load or save because of the change. The baseline runs in `plan.md` section 5 pass unchanged, with 58, 39, 106 and 171 passing tests before and 61, 41, 109 and 173 after
- [x] REQ-004: The Goal facet lists the purpose first and the next safe action second when both exist, and the next safe action alone when no purpose is stored. The record tests above assert both orders, and the snapshot test `keeps the stored purpose copy and leads the Goal facet with it` passes
- [x] REQ-005: Both packages build, typecheck and lint clean, and the API boundary check passes. `npm --prefix $RT run build` and `npm --prefix $RT/cli run build` exit 0, both typecheck commands print nothing and exit 0, eslint exits 0 and `check-api-boundary.sh` prints `PASS`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase built | Done | Status Complete in `spec.md`. Criteria marked from that status and `implementation-summary.md`, not rerun on 2026-11-14 |

### Deviations and findings

| Item | Note |
|------|------|
| None recorded | The criteria above are this phase's own requirement rows, copied from its `spec.md` |
<!-- /ANCHOR:log -->
