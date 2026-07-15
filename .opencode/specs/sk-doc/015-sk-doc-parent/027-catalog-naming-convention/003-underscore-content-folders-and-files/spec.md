---
title: "Feature Specification: restyle catalog/playbook content folders and files to underscore_case"
description: "Every hyphenated category folder and per-feature file under feature_catalog/ and manual_testing_playbook/ (plus references/, assets/, benchmark/ content subfolders) renamed from hyphen-case to underscore_case, repo-wide across all skills. Unlike sibling de-numbering packets 001/002, no runtime gate keys on hyphen-vs-underscore (the validator classifies leaves by the feature_catalog/manual_testing_playbook parent-dir NAME, and the Lane C loader selects by frontmatter), so load-bearing risk was low. Shipped as one merged change via three parallel agent branches; skill/agent/command/phase-folder names stay hyphenated. Verified end-state: 0 tracked hyphenated content folders/files remain (excl z_archive), 2,032 tracked underscore .md content files present."
trigger_phrases:
  - "underscore content folders"
  - "hyphen to underscore catalog"
  - "restyle feature_catalog folders"
  - "underscore per-feature filenames"
  - "content folder underscore migration"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/003-underscore-content-folders-and-files"
    last_updated_at: "2026-07-12T11:31:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled 003 to a completed Level-2 leaf reflecting the shipped underscore migration"
    next_safe_action: "Commit path-scoped after strict validate"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Validator classifies catalog/playbook leaves by the feature_catalog/manual_testing_playbook parent-dir NAME, not the slug (validate_document.py:129,137) -> underscore slugs validate unchanged"
      - "Lane C loader selects scenario files by frontmatter, not filename shape (load-playbook-scenarios.cjs:306) -> underscore filenames load unchanged"
      - "Shipped as one merged change (merge commits 0659149d08 + b5afa1206c, each merging parallel agent branches), not the 5 planned sub-phase folders"
      - "Verified end-state: git ls-files finds 0 tracked hyphenated content folders/files under catalog/playbook (excl z_archive); 2,032 tracked underscore .md content files present"
      - "50 untracked hyphenated .md files under system-deep-loop/deep-alignment/ are a concurrent live session's working files, not migration residue -> out of scope"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Underscore Restyle of Catalog/Playbook Content

> Phase adjacency under the 027 parent (grouping order, not a runtime dependency): predecessor `002-deprecate-numbered-snippet-filenames`, successor `004-remove-superset-copilot-hook-bridge`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/015-sk-doc-parent/027-catalog-naming-convention/003-underscore-content-folders-and-files |
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-12 |
| **Owner skill** | sk-doc (owns the `create-feature-catalog` + `create-manual-testing-playbook` conventions, templates, `/create:*` generators, and the `validate_document.py` classifier) |
| **Origin** | Operator: "make sure all folders in feature catalog, playbook, benchmarks, skill references, assets, etc use underscores (folder_name not folder-name)" — confirmed as all content folders AND all per-feature files |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Catalog/playbook content was named in hyphen-case: category folders (`feature_catalog/mcp-tool-surface/`),
per-feature files (`read-path-freshness.md`), and content subfolders under `references/`, `assets/`, and
`benchmark/`. The operator's canonical form is `underscore_case`, so `feature_catalog/mcp-tool-surface/read-path-freshness.md`
became `feature_catalog/mcp_tool_surface/read_path_freshness.md`.

Unlike the sibling de-numbering packets (001/002), **no runtime consumer keys on hyphen-vs-underscore**: the sk-doc
validator classifies a catalog/playbook leaf by its `feature_catalog` / `manual_testing_playbook` parent-directory NAME
(`validate_document.py:129,137`), and the Lane C benchmark loader selects scenario files by frontmatter content, not by
filename shape (`load-playbook-scenarios.cjs:306`). So the work was a mechanical rename + path-scoped reference sweep,
not a gate-neutralization problem.

### Purpose
Make `underscore_case` the sole canonical form for all in-scope catalog/playbook content folders and files, repo-wide,
without regressing validation, the Lane C benchmark corpus, or CI; and rewrite the convention docs/generators so new
content is emitted in the underscore form.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **All hyphenated content folders** + **all hyphenated per-feature `.md` files** under `feature_catalog/<category>/`
  and `manual_testing_playbook/<category>/` (plus hyphenated subfolders under `references/`, `assets/`, `benchmark/`),
  across all skills — renamed hyphen→underscore on path segments only.
- **Reference sweep**: root index tables (`feature_catalog.md` / `manual_testing_playbook.md` rows), `category:`
  frontmatter values, and markdown cross-reference links pointing at in-scope paths.
- **Convention docs**: `create-feature-catalog` + `create-manual-testing-playbook` generators rewritten from
  `category-name` / `feature-name.md` to `category_name` / `feature_name.md` (shipped separately as 027 parent commit
  `7cc369f2ed`).

### Out of Scope (deliberate)
- **Skill / agent / command directory names** and **spec phase-folder names** (`^[0-9]{3}-[a-z0-9-]+$`) — hyphen-only
  by hard convention; never underscored. The sweep is path-scoped and word-boundary-safe.
- **Changelogs, `z_archive/`, completed spec history** — frozen.
- The **de-numbering** work (siblings 001/002, already complete).
- The 5 non-`.md` files (`superset-notify.json`, `409-fixture.json`, 3× `setup-cp-sandbox.sh`) — left hyphenated
  (renaming would break tests/hooks/frozen history).
- **Untracked concurrent-session working files** — e.g. the 50 hyphenated `.md` files under
  `system-deep-loop/deep-alignment/feature_catalog|manual_testing_playbook/` are a live session's uncommitted new
  files (0 tracked), not migration residue; a no-new-hyphen guard would catch them if/when they are committed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `feature_catalog/<category>/**` + `manual_testing_playbook/<category>/**` | Renamed | hyphen→underscore on folder + `.md` basenames, all skills |
| `create-feature-catalog` + `create-manual-testing-playbook` generators | Modified | underscore canonical form (027 parent commit `7cc369f2ed`) |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All in-scope tracked content folders/files use underscore_case | `git ls-files` finds zero hyphenated category folders / per-feature files under the in-scope surfaces (excl z_archive) |
| REQ-002 | Every live reference rewritten in lockstep | Root index tables, `category:` frontmatter, and cross-ref links resolve; no dangling hyphenated path refs |
| REQ-003 | No validation regression | Catalog/playbook leaves still classify as their typed document (validator keys on parent-dir name) |
| REQ-004 | No skill/agent/command/phase-folder name underscored | The rename touched only content path segments |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Convention generators emit underscore form | `create-*` generators use `category_name` / `feature_name.md` (027 commit `7cc369f2ed`) |
| REQ-006 | Lane C benchmark corpus unchanged | Discovered-scenario count unchanged; no D1-D5 scoring regression (loader is separator-agnostic) |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero tracked hyphenated category folders or per-feature files remain under the in-scope surfaces
  (excl. frozen `z_archive`).
- **SC-002**: `validate.sh --strict` Errors 0 on the 027 parent recursively; every catalog/playbook leaf still typed
  correctly (validator keys on `feature_catalog`/`manual_testing_playbook` parent-dir name).
- **SC-003**: The Lane C smart-routing benchmark shows no scoring regression; scenario count unchanged (loader selects
  by frontmatter, not filename shape).
- **SC-004**: Convention generators emit only `underscore_case`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-broad sweep touching hyphenated skill/tool names in prose | Broken references | Path-scoped, word-boundary-safe sweep + deny-list; markdown-link guard |
| Risk | Rename collisions | Lost files | Rename map computed from live tree; hard-abort on collision before writing |
| Risk | Concurrent-session churn | Entangled diff | Built + executed in isolated worktrees; commits path-scoped; untracked live-session files left untouched |
| Dependency | Lane C harness (unchanged) | Regression check | Separator-agnostic loader; baseline captured before execution |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: The rename is a pure `-`→`_` transform on path segments only, so each agent could rewrite cross-skill
  references independently with no coordination.

### Safety
- **NFR-S01**: Dry-run + collision hard-abort before any `git mv`; disjoint file-ownership partitioning across the
  parallel agent branches; untracked concurrent-session files never staged.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Digit-bearing topic names** (e.g. `4-stage-pipeline-architecture`): same `-`→`_` treatment, hard-abort on any
  resulting name collision.
- **Non-`.md` content files** entangled with tests/hooks/frozen history: left hyphenated (out of scope).
- **`.github/` dotdirs and stray `.opencode/node_modules/` trees under content surfaces**: not content; never targeted
  by the sweep.
- **Concurrent-session untracked files**: hyphenated `.md` files created after the migration by a live session are not
  migration residue; they are out of scope and left for the no-new-hyphen guard / that session's own commit.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

None. Shipped as one merged change (merge commits `0659149d08` + `b5afa1206c`, each merging parallel agent branches),
verified and merged onto `skilled/v4.0.0.0`; the nominal 5-phase decomposition was not materialized as folders because
the deterministic transform made a single fanned-out pass safe.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:related-docs -->
