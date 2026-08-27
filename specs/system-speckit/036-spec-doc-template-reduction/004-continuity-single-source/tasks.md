---
title: "Tasks: Phase 4: continuity-single-source"
description: "Relax continuity validators before removing redundant template blocks, preserve implementation-summary as the runtime source, and verify save and fleet compatibility."
trigger_phrases:
  - "continuity single source tasks"
  - "validator-first template dedup"
  - "canonical implementation-summary"
  - "SESSION_LINEAGE regression"
importance_tier: "important"
contextType: "general"
---
# Tasks: Phase 4: continuity-single-source

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path); done when ...`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [REQ-001, REQ-004] Inventory the continuity validators and real save path (`.opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts`, `.opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts`, `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts`); done when the validator-first order and real-save observation method are recorded.
- [ ] T002 [REQ-001] Capture the shipped five-copy validation case (`specs/` representative packet); done when strict validation of the old continuity shape is available as the compatibility baseline.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [REQ-001] Relax `FRONTMATTER_MEMORY_BLOCK` for canonical-only continuity (`.opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts`); done when the old five-copy packet passes strict validation before template edits.
- [ ] T004 [REQ-003] Rescope the `SESSION_LINEAGE` scan (`.opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts`); done when representative shipped packets do not gain a session-lineage failure.
- [ ] T005 [REQ-002] Remove redundant continuity emission from the four non-canonical templates (`.opencode/skills/system-spec-kit/templates/manifest/{spec,plan,tasks,checklist}.md.tmpl`); done when `implementation-summary.md.tmpl` remains the only canonical template source and runtime consumer paths are unchanged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 [REQ-004] Inspect a real save through the compiled context generator (`.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`); done when the save writes continuity only to implementation-summary or the confirmed contract explains any allowed compatibility write.
- [ ] T007 [REQ-002, REQ-003] Compare continuity consumers and representative fleet results (`.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts`, `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts`, `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`); done when resume, status, freshness, and strict-validation behavior show no unintended change.
- [ ] T008 [REQ-001, REQ-002, REQ-003, REQ-004] Record the phase acceptance evidence (`004-continuity-single-source/spec.md`); done when all four requirements have evidence and the template/doc dedup is clearly separated from unchanged runtime behavior.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] REQ-001 through REQ-004 each have a completed mapped task and evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
