---
title: "Tasks: Design + ADR for skill advisor extraction"
description: "Survey, enumerate, score, pick, ADR, parent update, validate."
trigger_phrases:
  - "advisor extraction design tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/001-extraction-design-and-adr"
    last_updated_at: "2026-05-14T02:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "tasks.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Design + ADR for skill advisor extraction

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[ ]` | Open |
| `[x]` | Done |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [ ] T001 Inventory `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/` tree by directory + file purpose.
- [ ] T002 Grep whole repo for advisor consumers (`advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_advisor`, `skillAdvisor`).
- [ ] T003 Read `tool-schemas.ts` + `context-server.ts` advisor registrations.
- [ ] T004 Note relevant feature_catalog, manual_testing_playbook, references entries that mention the advisor.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T010 Enumerate 3-4 architectural shapes (A own MCP server / B co-resident / C stub-and-reexport / D split lib vs tools).
- [ ] T011 Score each shape on 6 criteria (ergonomics, topology, tool-id stability, backwards-compat, test isolation, launcher complexity).
- [ ] T012 Pick winner + rationale.
- [ ] T013 Write `research/extraction-survey.md` covering inventory + scoring.
- [ ] T014 Write `decision-record.md` ADR-001 locking the shape.
- [ ] T015 Update parent phase `006-system-skill-advisor-package-extraction/spec.md` "What Needs Done" section to reflect chosen migration sequence.
- [ ] T016 Update this packet's `implementation-summary.md` with the chosen shape + key tradeoffs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T020 Strict validate this packet.
- [ ] T021 Strict validate parent 016.
- [ ] T022 Cross-check ADR-001 has ≥ 3 alternatives.
- [ ] T023 Cross-check survey covers all advisor consumers (compare against `git grep advisor_` count).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All Phase 1-3 tasks `[x]`.
- [ ] No `[B]` blockers.
- [ ] ADR-001 locks the chosen shape.
- [ ] Parent phase spec updated to reflect sequence.
- [ ] Strict validation green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent: `006-system-skill-advisor-package-extraction`
- Predecessor stability: `002-semantic-routing-lane` (8 sub-packets shipped)
- Downstream packets gated on this: `016/002-scaffold-new-skill-folder` (not yet scaffolded), `016/003-move-source-and-tests`, `016/004-update-consumers`, `016/005-validation-and-cleanup`
<!-- /ANCHOR:cross-refs -->
