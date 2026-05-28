---
title: "Implementation Plan: Import Upstream Snapshot"
description: "Plan for Bootstrap import of the downloaded upstream cocoindex-code v0.2.33 snapshot into the local mcp-coco-index fork root with an import manifest."
trigger_phrases:
  - "027 phase 001"
  - "cocoindex import-upstream"
  - "001-import-upstream"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/013-cocoindex-complete-fork/001-import-upstream"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded child packet for Import Upstream Snapshot"
    next_safe_action: "Implement scoped tasks for 001-import-upstream"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-12-027-001-001-import-upstream"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Parent decomposition and dependency order are pre-approved by orchestrator."
---
# Implementation Plan: Import Upstream Snapshot

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python, shell, Markdown, JSON |
| **Framework** | MCP server and SpecKit skill packaging |
| **Storage** | Local repo files and isolated CocoIndex runtime paths where needed |
| **Testing** | Strict spec validation plus child-specific shell or pytest checks |

### Overview
Bootstrap import of the downloaded upstream cocoindex-code v0.2.33 snapshot into the local mcp-coco-index fork root with an import manifest.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent phase folder exists.
- [x] Dependency list is encoded in `graph-metadata.json`.
- [x] Scope is limited to this child file boundary.

### Definition of Done
- [ ] Child implementation tasks complete.
- [ ] Child-specific verification commands recorded in `checklist.md`.
- [ ] Strict validation exits 0 for this child.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Topical decomposition by file-subdirectory boundary.

### Key Components
- **Input**: validated outputs from dependency children.
- **Owned surface**: files listed in this child spec.
- **Output**: validation evidence and handoff state for downstream children.

### Data Flow
Dependency child output is read first, this child updates its owned files, then validation evidence is written back into this child packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Readiness
- [ ] Confirm dependencies have validation evidence.
- [ ] Read owned files before editing.

### Phase 2: Scoped Implementation
- [ ] Inventory external/cocoindex-code-main and current mcp_server tree
- [ ] Copy selected upstream source and package files into mcp_server
- [ ] Classify Docker, skill, uv, and docs assets as imported, excluded, or deferred
- [ ] Port current spec-kit patch overlay markers into the new baseline
- [ ] Update ADR/resource map with the final import boundary

### Phase 3: Verification
- [ ] Run child-specific verification.
- [ ] Run strict spec validation.
- [ ] Update checklist evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Spec validation | This child packet | `validate.sh --strict` |
| Dependency check | Required predecessor outputs | Direct file reads |
| Implementation smoke | Owned files | Child-specific shell, pytest, or doc grep checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| None | Child phase | Green | This child can start immediately |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: child verification fails after implementation or a dependency contract changes.
- **Procedure**: revert only this child owned file surface, preserve evidence in this child packet, and rerun strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Readiness | None | Scoped implementation |
| Scoped implementation | Readiness | Verification |
| Verification | Scoped implementation | Downstream child handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work | Estimated Effort |
|------|------------------|
| Scope implementation | ~300 LOC, mostly mechanical copy and manifest work |
| Verification and evidence | 30-60 minutes |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:l3-architecture -->
## L3: ARCHITECTURE NOTES

The import is a two-layer baseline: upstream v0.2.33 first, then spec-kit patch overlay. The manifest is the control artifact that lets later children distinguish upstream files from local modifications.
<!-- /ANCHOR:l3-architecture -->


---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

1. Revert only this child owned file surface.
2. Preserve failure evidence in `implementation-summary.md`.
3. Rerun `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child-folder> --strict`.
<!-- /ANCHOR:enhanced-rollback -->


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
001-import-upstream -> 002-scripts
001-import-upstream -> 003-tests-port
001-import-upstream -> 004-docs
001-import-upstream -> 005-attribution
002..005 -> 006-integration-smoke
```
<!-- /ANCHOR:dependency-graph -->


---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The critical path starts with importing the v0.2.33 baseline and ends when integration smoke validates every parallel child output.
<!-- /ANCHOR:critical-path -->


---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 | Import manifest and fork root exist |
| M2 | Parallel child scopes have validated outputs |
| M3 | Integration smoke and recursive validation pass |
<!-- /ANCHOR:milestones -->
