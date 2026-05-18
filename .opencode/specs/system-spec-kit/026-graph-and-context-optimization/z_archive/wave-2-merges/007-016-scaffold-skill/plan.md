---
title: "Implementation Plan: Scaffold system-code-graph skill folder"
description: "Create Phase 002 packet docs and the empty system-code-graph skill shape; no source moves."
trigger_phrases:
  - "code graph skill scaffold"
  - "system-code-graph scaffold"
  - "002 scaffold-skill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/016-scaffold-skill"
    last_updated_at: "2026-05-14T08:00:03Z"
    last_updated_by: "codex"
    recent_action: "Validated Phase 002 scaffold"
    next_safe_action: "Phase 003 can move source"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140002"
      session_id: "002-scaffold-skill"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Scaffold system-code-graph skill folder

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Create the Phase 002 child packet, populate the empty `.opencode/skills/system-code-graph/` package boundary, add placeholders for future source/docs/database locations, update parent graph metadata, and validate the packet plus required scaffold tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] ADR-001 accepted in `001-design-and-decision-record/decision-record.md`.
- [x] Gate 3 points to this new child packet.
- [x] Phase boundary confirmed: no code moves until Phase 003.

### Definition of Done
- [x] Phase 002 packet files exist and validate strictly. (exit code 0)
- [x] Skill scaffold required files and directories exist. (`SKILL_TREE_VALIDATED=yes`)
- [x] Parent 014 metadata lists this child and marks it active.
- [x] No files under `system-spec-kit/mcp_server/code_graph/` are modified.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, TypeScript config |
| **Framework** | Spec Kit Level 2 packet plus skill scaffold |
| **Storage** | `.opencode/skills/system-code-graph/` |
| **Testing** | Strict spec validation and shell tree existence checks |

### Approach
1. Read ADR-001 and the 001 packet precedent.
2. Read system-spec-kit skill README/config shapes.
3. Create the 002 packet files.
4. Populate `system-code-graph` top-level docs and metadata.
5. Create `.gitkeep` placeholders for empty scaffold directories.
6. Patch parent 014 `graph-metadata.json`.
7. Run strict packet validation and required tree validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm precedent docs and ADR constraints.
- Capture current UTC timestamp for metadata.

### Phase 2: Implementation
- Create packet docs and metadata.
- Create skill docs/config and placeholder directories.
- Update parent graph metadata pointer.

### Phase 3: Verification
- Run strict spec validation for this packet.
- Run the required scaffold tree checks.
- Inspect that code-graph source tree stayed untouched.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Structure | Packet has required Level 2 files | `validate.sh --strict` |
| Scaffold | Required skill tree entries exist | Shell `test -f` / `test -d` chain |
| Boundary | No code moves | Git status/diff review for `system-spec-kit/mcp_server/code_graph/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- ADR-001 in child 001.
- Existing system-spec-kit templates and validation scripts.
- Parent 014 packet metadata.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Revert the Phase 002 packet folder, remove newly added `system-code-graph` scaffold files, and restore parent 014 `graph-metadata.json` to the prior `001-design-and-decision-record` active child.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|------------|-----|
| Phase 1 | ADR-001 | Locks scaffold target and topology |
| Phase 2 | Phase 1 | Writes follow the accepted shape |
| Phase 3 | Phase 2 | Verification requires the scaffold on disk |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Packet docs | ~700 lines |
| Skill docs/config | ~250 lines |
| Placeholder files | 12 files |
| **Total** | **Docs/config only, 0 LOC runtime code** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- Strict validation reports packet-structure errors.
- Tree validation reports missing scaffold entries.

### Recovery
1. Patch the missing packet or scaffold entries.
2. Re-run strict validation and tree validation.
3. If validation cannot be made green, revert Phase 002 and report the blocker.

### Data Safety
No production data or runtime source code is changed in this phase.
<!-- /ANCHOR:enhanced-rollback -->
