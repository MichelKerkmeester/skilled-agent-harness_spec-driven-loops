---
title: "Implementation Plan: System-code-graph skill docs sk-doc alignment"
description: "Docs-only plan for aligning the system-code-graph skill manifest, feature catalog and manual testing playbook with sk-doc structure, HVR and source-anchor standards."
trigger_phrases:
  - "011 skill docs sk-doc alignment plan"
  - "system-code-graph docs plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-025-skill-docs-sk-doc-alignment"
    last_updated_at: "2026-05-14T17:43:47Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-011"
    recent_action: "Planned scoped docs-only alignment"
    next_safe_action: "Commit scoped documentation changes"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/feature_catalog/"
      - ".opencode/skills/system-code-graph/manual_testing_playbook/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-011-skill-docs-sk-doc-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Packet 010 has landed, so live MCP namespace references use mk-code-index."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: System-code-graph skill docs sk-doc alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | OpenCode skills and Spec Kit |
| **Storage** | None |
| **Testing** | `validate.sh --strict`, `rg` audits and sk-doc validation helpers |

### Overview

Update only the scoped system-code-graph skill docs and the new 011 packet. The pass favors current behavior, precise file anchors, complete frontmatter, natural operator prompts and `mk-code-index` MCP namespace references.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Spec folder pre-answered and created at the 011 path.
- [x] Packet 010 rename status checked.
- [x] Target file list captured for `SKILL.md`, feature catalog, manual playbook and references.

### Definition of Done

- [x] Scoped docs have no template placeholders.
- [x] Stale MCP namespace references are absent from scoped skill docs.
- [x] Strict spec validation passes.
- [x] Scoped files are staged and committed on `main`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Docs-only quality pass.

### Key Components

- **Skill manifest**: runtime trigger and routing surface for `system-code-graph`.
- **Feature catalog**: current feature inventory with source anchors.
- **Manual testing playbook**: operator validation package with deterministic scenarios.
- **011 packet**: scope, plan, task and evidence record for this docs-only change.

### Data Flow

The skill manifest points users to the catalog and playbook. The catalog maps current features to source anchors. The playbook maps operator scenarios back to the catalog and source files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `SKILL.md` | Skill routing and runtime instructions | Refresh wording, paths and `mk-code-index` namespace examples | `rg` namespace audit and sk-doc validation |
| `feature_catalog/**/*.md` | Current feature inventory | Update source anchors, trigger phrases and current-reality classes | `rg` placeholder/stale-anchor audit |
| `manual_testing_playbook/**/*.md` | Manual validation scenarios | Replace RCAF prompts, update root guidance and precise source references | `rg` prompt and HVR audit |
| `011-skill-docs-sk-doc-alignment/` | Packet record | Replace scaffold placeholders and record evidence | `validate.sh --strict` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research

- [x] Read sk-doc skill guidance and relevant templates.
- [x] Survey target skill docs and packet 010 rename state.

### Phase 2: Documentation Alignment

- [x] Update the system-code-graph skill manifest.
- [x] Update feature catalog root and per-feature files.
- [x] Update manual testing playbook root and per-scenario files.
- [x] Replace scaffolded 011 packet content.

### Phase 3: Verification

- [x] Run scoped `rg` audits.
- [x] Run sk-doc validation helpers where applicable.
- [x] Run `validate.sh --strict` for the 011 packet.
- [x] Stage and commit scoped changes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | 011 packet | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <011> --strict` |
| Documentation lint | Skill docs | `rg` for placeholders, stale namespaces, semicolons and RCAF prompts |
| Sk-doc validation | Skill manifest and root docs | `python3 .opencode/skills/sk-doc/scripts/quick_validate.py` and `validate_document.py` |
| Git safety | Stage scope | `git diff --cached --name-only` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 010 MCP rename | Internal packet | Complete | Use `mk-code-index` in live MCP docs. |
| Parallel packet 013 | Internal packet | Active elsewhere | Avoid README files. |
| Parallel packet 014 | Internal packet | Active elsewhere | Avoid architecture docs. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation fails or stage scope includes forbidden files.
- **Procedure**: Revert only the files changed by this packet, leave unrelated worktree changes untouched and rerun validation before any commit.
<!-- /ANCHOR:rollback -->
