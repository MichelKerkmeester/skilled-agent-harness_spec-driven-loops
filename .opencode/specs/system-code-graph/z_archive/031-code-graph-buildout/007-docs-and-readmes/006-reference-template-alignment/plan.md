---
title: "Implementation Plan: System Code Graph Reference Template Alignment"
description: "Move system-code-graph references into canonical sk-doc folders, leave compatibility stubs, and refresh router/navigation docs without runtime behavior changes."
trigger_phrases:
  - "system-code-graph reference alignment"
  - "code graph docs cleanup"
  - "smart router resource map"
importance_tier: "important"
contextType: "documentation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/007-docs-and-readmes/006-reference-template-alignment"
    last_updated_at: "2026-05-24T08:04:41Z"
    last_updated_by: "codex"
    recent_action: "Implemented reference foldering, stubs, router refresh, and validation"
    next_safe_action: "Run the documented verification commands after any follow-up change"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/references/"
    session_dedup:
      fingerprint: "sha256:ad1ce1c290ede65f45fe202c820d048153b2dd0f0864a71e63a4056b86d85ff1"
      session_id: "system-code-graph-reference-template-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: System Code Graph Reference Template Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation and OpenCode skill metadata |
| **Framework** | sk-doc reference and skill validators |
| **Storage** | No runtime storage changes |
| **Testing** | sk-doc extract/validate, quick_validate, rg smoke checks, strict spec validation |

### Overview

The implementation is a documentation/navigation change. It moves canonical references into focused subfolders, replaces old root files with pointer stubs, and rewrites `SKILL.md` routing documentation to the sk-doc smart-router standard while preserving all runtime code and schemas.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Scope limited to documentation/navigation files.
- [x] Existing reference tree, active links, and code-graph spec parent inspected.
- [x] sk-doc reference template requirements identified.

### Definition of Done

- [x] Canonical references moved into snake_case subfolders.
- [x] Old root paths retained as compatibility stubs.
- [x] Canonical references aligned with H1 intro, divider, `## 1. OVERVIEW`, and numbered H2s.
- [x] `SKILL.md`, `README.md`, and `ARCHITECTURE.md` point at canonical references.
- [x] sk-doc and strict spec validations pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation taxonomy with compatibility stubs.

### Key Components

- **Canonical references**: Long-form docs under `references/runtime/`, `references/readiness/`, `references/config/`, and `references/integrations/`.
- **Compatibility stubs**: Root kebab-case files with valid reference shape and a single canonical pointer.
- **Smart router**: `SKILL.md` documentation loader contract with dynamic discovery, path guarding, duplicate suppression, intent scoring, ambiguity handling, and fallback notices.
- **Active navigation**: README and architecture links updated to canonical paths.

### Data Flow

Agents load `SKILL.md`, score the task intent, discover markdown resources recursively, guard paths inside the skill root, and load canonical references only when they exist and have not already been loaded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `references/*.md` root files | Historical direct-link targets | Replaced with valid pointer stubs | Reference blocking validation and local link smoke check |
| `references/runtime/` | Runtime reference domain | Added tool, naming, ownership, and launcher references | `validate_document.py --type reference --blocking-only` |
| `references/readiness/` | Readiness reference domain | Added readiness check and scope fingerprint references | `validate_document.py --type reference --blocking-only` |
| `references/config/` | Config reference domain | Added database path policy | `validate_document.py --type reference --blocking-only` |
| `references/integrations/` | Integration reference domain | Added CCC bridge reference | `validate_document.py --type reference --blocking-only` |
| `SKILL.md` | Skill router and resource map | Rewritten to sk-doc smart-router shape | Skill blocking validation and `quick_validate.py` |
| `README.md`, `ARCHITECTURE.md` | Active documentation navigation | Canonical reference links | Local markdown link resolver |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Discovery

- [x] Inspect current `system-code-graph` skill/router.
- [x] Inspect sk-doc reference template.
- [x] Locate existing code-graph spec parent and next child number.
- [x] Search active stale links.

### Phase 2: Reference Canonicalization

- [x] Create canonical folders: `runtime`, `readiness`, `config`, `integrations`.
- [x] Move references to snake_case canonical paths.
- [x] Add root compatibility stubs.
- [x] Align canonical reference overviews and related links.

### Phase 3: Router and Navigation

- [x] Rewrite smart router with dynamic discovery and guarded loading.
- [x] Refresh resource domains and `RESOURCE_MAP`.
- [x] Update README and architecture links.

### Phase 4: Verification

- [x] Run sk-doc structure extraction.
- [x] Run sk-doc blocking validators.
- [x] Run quick skill validation.
- [x] Run stale-link and numbered-heading checks.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | `SKILL.md`, `README.md`, `ARCHITECTURE.md`, all references and stubs | `extract_structure.py` |
| Reference validation | All canonical references and compatibility stubs | `validate_document.py --type reference --blocking-only` |
| Skill validation | `system-code-graph/SKILL.md` | `validate_document.py --type skill --blocking-only` |
| README validation | `system-code-graph/README.md` | `validate_document.py --type readme --blocking-only` |
| Skill package smoke | Whole skill package | `quick_validate.py .opencode/skills/system-code-graph --json` |
| Link/path smoke | Active docs and references | `rg` checks plus local markdown link resolver |
| Packet validation | This spec packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc scripts | Internal | Green | Cannot prove template alignment. |
| system-spec-kit validator | Internal | Green | Cannot claim packet completion. |
| system-code-graph runtime contracts | Internal | Green | Docs must preserve stable tool IDs and schemas. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- **Trigger**: Validations fail after follow-up edits, or users need the pre-foldered reference tree.
- **Procedure**: Restore canonical content from the moved files, remove or adjust stubs, and revert the `SKILL.md`, `README.md`, and `ARCHITECTURE.md` link updates in one documentation-only patch. No runtime rollback is needed because no executable behavior changed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Discovery | None | Reference canonicalization, router update |
| Reference canonicalization | Discovery | Router/navigation, validation |
| Router/navigation | Canonical paths | Validation |
| Verification | All edits | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Effort |
|-------|------------|---------------|
| Discovery | Low | Completed in-session |
| Reference canonicalization | Medium | Completed in-session |
| Router/navigation | Medium | Completed in-session |
| Verification | Medium | Completed in-session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Deployment Checklist

- [x] Documentation-only scope confirmed.
- [x] Compatibility stubs retained at old paths.
- [x] Active docs updated to canonical paths.

### Rollback Procedure

1. Restore old root reference content from the prior revision.
2. Remove canonical subfolder files and stub-only root files if needed.
3. Revert `SKILL.md`, `README.md`, and `ARCHITECTURE.md` link updates.
4. Re-run sk-doc and spec validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Not applicable.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## 9. DEPENDENCY GRAPH

```text
Discovery -> Reference moves/stubs -> Canonical template alignment
          -> Router/navigation refresh -> Validation
```

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Discovery | User request | Taxonomy and active-link list | Moves, router update |
| Reference moves/stubs | Discovery | Canonical folder tree and compatibility files | Template alignment |
| Router/navigation refresh | Canonical paths | Updated SKILL/README/ARCHITECTURE links | Validation |
| Validation | All edits | Completion evidence | Completion claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Reference canonicalization had to happen before router and README updates because the canonical paths were the source of truth for navigation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Status | Evidence |
|-----------|--------|----------|
| M1 Reference tree split | Complete | Canonical folders and stubs exist. |
| M2 Router aligned | Complete | `SKILL.md` validates with no blocking issues. |
| M3 Navigation updated | Complete | Stale active root-link search has no matches. |
| M4 Validation complete | Complete | sk-doc and strict spec validation pass. |
<!-- /ANCHOR:milestones -->
