---
title: "Tasks: Design + ADR for code-graph extraction"
description: "Inventory, deep-research, synthesize resource map, write ADR, parent update, validate."
trigger_phrases:
  - "code graph extraction design tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/014-extraction-design-and-decision-record"
    last_updated_at: "2026-05-14T07:00:38Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Author deep-research config and dispatch 10-iter loop"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Design + ADR for code-graph extraction

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

- [x] T001 Inventory `mcp_server/code_graph/` tree.
- [x] T002 Grep repo for code-graph consumers.
- [x] T003 Read `tool-schemas.ts` + `context-server.ts` code-graph registrations.
- [x] T004 Identify all category-22 docs in feature_catalog + manual_testing_playbook.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T010 Author `research/deep-research-config.json` with the 8 questions, 10-iter cap, native executor.
- [x] T011 Run 3-iteration deep-research loop natively.
- [x] T012 Monitor convergence; on completion, synthesize `research/research.md`.
- [x] T013 Author `resource-map.md` enumerating every touchpoint with disposition.
- [x] T014 Author `decision-record.md` with ADR-001 locking 8 decisions + alternatives table.
- [x] T015 Update parent 014 `spec.md` "What Needs Done" with locked sequence.
- [x] T016 Update this packet's `implementation-summary.md` with chosen shape + key tradeoffs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T020 Strict-validate this packet.
- [x] T021 Strict-validate parent 014.
- [x] T022 Cross-check ADR-001 has alternatives table for all 8 decisions.
- [x] T023 Cross-check resource-map.md covers all categories (READMEs/Documents/Commands/Agents/Skills/Specs/Scripts/Tests/Config/Meta).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [x] All Phase 1-3 tasks `[x]`.
- [x] No `[B]` blockers.
- [x] ADR-001 locks all 8 decisions.
- [x] Parent phase spec updated to reflect locked sequence.
- [x] Strict validation green (parent: PASSED 0E/0W; child: 0E/1W advisory).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent: `005-code-graph/013-system-code-graph-extraction`
- Predecessor stability: `005-code-graph/005-code-graph-backend-resilience`, `005-code-graph/010-broader-excludes-and-granular-skills`
- Precedent: `015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/001-extraction-design-and-adr`
- Downstream packets gated on this: `014/002-scaffold-new-skill-folder` (not yet scaffolded), `014/003-move-source-and-database`, `014/004-rewire-consumers-and-tool-registration`, `014/005-doc-and-runtime-migration`, `014/006-validation-and-cleanup`
<!-- /ANCHOR:cross-refs -->
