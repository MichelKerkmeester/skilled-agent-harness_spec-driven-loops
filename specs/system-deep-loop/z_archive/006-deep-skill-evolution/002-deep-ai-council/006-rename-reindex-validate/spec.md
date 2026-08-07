---
title: "Feature Specification: 115/006 — reindex + validate + reconcile"
description: "Sequential after 002-005: skill_graph_compiler.py rerun + advisor_recommend smoke + parity vitest + validate.sh --strict on all 6 children + parent + generate-context.js parent reconcile + nested-changelog.js."
trigger_phrases: ["115 006", "reindex validate", "advisor smoke 115"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/002-deep-ai-council/006-rename-reindex-validate"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 006 spec.md"
    next_safe_action: "Author 006 plan.md"
    blockers: []
    key_files: [".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115006"
      session_id: "115-006-spec-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: 115/006 — reindex + validate + reconcile

---

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 (sequential after 002-005) |
| **Status** | Planned |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 of 6 |
| **Predecessor** | 002 + 003 + 004 + 005 (ALL) |
| **Handoff Criteria** | compiled graph fresh; advisor_recommend `sk-ai-council` ≥ 0.7; validate.sh --strict on parent + all 6 children = 0; parent graph-metadata.json reconciled |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context
Phase 6 of 6 (final). Sequential after 002+003+004+005 ALL land. Runs compiler + advisor smoke + parity vitest + strict validate + parent reconcile + nested changelog.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
After 002-005 land file edits, the compiled skill-graph.json + advisor cache need to be refreshed so the advisor surfaces the renamed identities.
### Purpose
Compile, smoke-test, validate, reconcile, ship.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Compiler rerun
- advisor_rebuild + advisor_validate + advisor_recommend smoke
- Vitest parity test execution
- validate.sh --strict on parent + 6 children
- generate-context.js canonical save (parent reconcile)
- nested-changelog.js per-phase

### Out of Scope
File mutations (handled by 002-005).

### Files to Change
| File | Action |
|------|--------|
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` | Regenerate |
| `116-deep-skill-evolution/001-ai-council/graph-metadata.json` | Refresh via generate-context.js |
| `116-deep-skill-evolution/001-ai-council/changelog/*.md` | Generate per-phase via nested-changelog.js |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0
| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Compiled skill-graph.json fresh | jq generated_at recent |
| REQ-002 | advisor_recommend on canonical prompt returns sk-ai-council ≥ 0.7 | MCP call |
| REQ-003 | vitest parity passes | npx vitest run exit 0 |
| REQ-004 | validate.sh --strict on parent + 6 children all exit 0 | aggregate matrix |
| REQ-005 | Parent graph-metadata.json children_ids includes all 6 phases | jq |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: All phase children pass strict validate.
- **SC-002**: Advisor surfaces both renamed identities at confidence ≥ 0.7.
- **SC-003**: Nested changelog generated for each phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Mitigation |
|------|------|------------|
| Risk | Compiler hits unrelated blocker | Incidental-fix protocol per 007 precedent |
| Dependency | 002+003+004+005 ALL landed | gating |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
(none — final phase)
<!-- /ANCHOR:questions -->
