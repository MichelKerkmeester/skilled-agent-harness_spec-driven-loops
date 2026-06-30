---
title: "Implementation Plan: Doc migration for system-code-graph"
description: "Move code-graph-owned docs, update runtime references, and validate the Phase 005 packet."
trigger_phrases:
  - "code graph doc migration plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-doc-and-runtime-migration"
    last_updated_at: "2026-05-14T08:21:27Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded Phase 005 plan"
    next_safe_action: "Execute category-22 split and reference updates"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Doc migration for system-code-graph

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Move code-graph-core category-22 feature catalog and playbook docs into the `system-code-graph` skill, keep shared hook/runtime/context docs in `system-spec-kit`, update references across agents, commands, top-level docs, skill cross-refs, constitutional/config docs, and refresh the `system-code-graph` SKILL/README status.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] Phase 003 source/database migration complete.
- [x] Phase 004 consumer/tool registration rewire complete.
- [x] ADR-001 locks stable tool IDs and sibling-skill ownership.

### Definition of Done
- [ ] Phase 005 packet strict validation passes.
- [ ] Feature catalog and playbook moved-doc counts captured.
- [ ] Requested agent, command, top-level, skill cross-ref, constitutional, and config docs updated or verified.
- [ ] Old `system-spec-kit/mcp_server/code_graph` source-path references removed from requested surfaces.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, TOML/config docs |
| **Framework** | Spec Kit Level 2 packet |
| **Storage** | `.opencode/skills/system-code-graph/{feature_catalog,manual_testing_playbook}` |
| **Testing** | Strict spec validate + grep/count sanity checks |

### Approach
1. Classify category-22 docs using filename and opening body text.
2. Move code-graph-owned files with `git mv`.
3. Add cross-skill references to stayed shared docs where useful.
4. Update path references in agents, commands, top-level docs, skill cross-refs, constitutional/config docs.
5. Refresh `system-code-graph/SKILL.md` and `README.md`.
6. Validate and record counts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Create this packet and update parent metadata.
- Confirm category-22 source and destination directories.

### Phase 2: Migration
- Move feature catalog docs that are primarily code-graph internals.
- Move playbook docs that primarily validate code-graph internals.
- Update stayed shared docs with cross-skill references.

### Phase 3: Reference Updates
- Update agent, command, top-level, skill cross-reference, constitutional/config, and `system-code-graph` skill docs.

### Phase 4: Verification
- Run strict packet validation.
- Count moved docs.
- Grep for stale code-graph source paths in requested surfaces.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Structure | Packet is valid | `validate.sh --strict` |
| Migration | Moved doc counts | `find ... -name "*.md" | wc -l` |
| References | Old source paths removed | `rg "system-spec-kit/mcp_server/code_graph"` over requested docs |
| Scope | No code modified | `git diff --name-only` review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- Phase 004 completed stable tool registration.
- Existing target skill folder `.opencode/skills/system-code-graph/`.
- ADR-001 decisions from child 001.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Revert moved docs and edited references in one change set. Because runtime tool IDs are unchanged and this is doc-only, rollback is limited to filesystem docs/config metadata.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|------------|-----|
| Phase 1 | 014 parent + ADR-001 | Establish packet scope |
| Phase 2 | Phase 1 | Move only after packet exists |
| Phase 3 | Phase 2 | Update references after final doc locations exist |
| Phase 4 | Phase 3 | Validate final state |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Packet creation | ~7 files |
| Feature catalog split | ~30 docs reviewed |
| Playbook split | ~27 docs reviewed |
| Reference updates | ~25 docs/configs |
| Verification | validate + grep + counts |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- Validation fails with packet-structure errors.
- A moved doc is found to be primarily shared hook/runtime context.

### Recovery
1. Move misclassified docs back with `git mv`.
2. Patch cross-skill references.
3. Re-run strict validation and grep checks.

### Data Safety
No database or runtime state is modified.
<!-- /ANCHOR:enhanced-rollback -->
