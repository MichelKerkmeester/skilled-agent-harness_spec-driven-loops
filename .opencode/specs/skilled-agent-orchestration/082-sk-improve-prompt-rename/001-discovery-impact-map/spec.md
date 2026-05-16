---
title: "Feature Specification: Phase 001 Discovery Impact Map"
description: "Read-only inventory for every active reference to sk-improve-prompt before rename execution begins. Produces discovery-output.md, or inventory.md plus inventory.tsv, and validates measured counts against the parent resource-map estimates."
trigger_phrases:
  - "082 phase 001"
  - "sk-improve-prompt discovery inventory"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/082-sk-improve-prompt-rename/001-discovery-impact-map"
    last_updated_at: "2026-05-06T10:45:10Z"
    last_updated_by: "codex"
    recent_action: "Completed active reference inventory and edge-case audit"
    next_safe_action: "Phase 002 skill-folder-rename"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-082-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: Phase 001 Discovery Impact Map

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `082-sk-improve-prompt-rename` |
| **Phase** | 001 of 006 |
| **Handoff Criteria** | Inventory complete; counts validated against `../resource-map.md` estimates within +/-10%; no source files modified |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 082 renames `sk-improve-prompt` to `sk-prompt` across active repo surfaces. The parent resource map estimates broad impact, but implementation phases need an exact active-reference inventory before any source rename starts.

### Purpose
Phase 001 is read-only inventory. It produces `discovery-output.md` or `inventory.md` plus `inventory.tsv` cataloging every active reference to `sk-improve-prompt`, with phase ownership and measured counts.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Search active repo surfaces for exact text references and filename/symlink embeds containing `sk-improve-prompt`.
- Produce `discovery-output.md`, or `inventory.md` plus `inventory.tsv`.
- Compare measured counts with `../resource-map.md` estimates and flag variance outside +/-10%.
- Record phase ownership for every active hit.

### Out of Scope
- Modifying source files that contain `sk-improve-prompt`.
- Renaming the skill folder, updating advisor graph JSON, runtime mirrors, root docs, or config files.
- Rewriting frozen historical scope under archive, future, or excluded completed packets.
- Running advisor rebuilds or final validation probes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-discovery-impact-map/spec.md` | Replace | Phase 001 scope and handoff contract |
| `001-discovery-impact-map/discovery-output.md` | Create | Single-file inventory option |
| `001-discovery-impact-map/inventory.md`, `inventory.tsv` | Create | Human and machine-readable inventory option |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Produce a canonical machine-readable inventory | `inventory.tsv` exists with phase, category, path, ref_count, and notes columns |
| REQ-002 | Produce a human-readable inventory | `inventory.md` groups every inventory row by owning phase |
| REQ-003 | Produce an edge-case audit | `edge-cases.md` covers filename embeds, JSON keys, symlink state, path links, hardcoded IDs, fixtures, observability, memory DB, code graph, and root docs |
| REQ-004 | Keep source files read-only | Only files under `001-discovery-impact-map/` are authored |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Use absolute grep counts | Each content row uses `rg -c 'sk-improve-prompt' <path>` |
| REQ-006 | Document sanity-command reconciliation | The row-count comparison is recorded in `inventory.md` |
| REQ-007 | Validate the phase folder | Strict spec validation passes after authoring |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `inventory.tsv` has one parseable data row per canonical active source file.
- **SC-002**: `inventory.md` stays under 250 lines.
- **SC-003**: `edge-cases.md` stays under 150 lines and covers all required edge-case classes.
- **SC-004**: Strict validation passes for the `001-discovery-impact-map` folder.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hidden runtime mirrors are missed by default grep | Phase 004 could start with an incomplete ledger | Search `.claude`, `.codex`, and `.gemini` explicitly |
| Risk | Symlink counted as a file | Inventory row count could double-count source content | Track symlink in `edge-cases.md` instead |
| Risk | Generated binary state contains old IDs | Rename could leave search indexes stale | Defer memory and code-graph re-index to Phase 006 |
| Dependency | `rg` counts | Inventory accuracy depends on exact current file contents | Use fresh counts and cite reconciliation |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Parseability
- **NFR-P01**: `inventory.tsv` must remain tab-separated with exactly five fields per row.
- **NFR-P02**: Notes must avoid commas to keep downstream parsing simple.

### Maintainability
- **NFR-M01**: Phase ownership must map directly to Phase 002-005 execution scopes.
- **NFR-M02**: Edge-case decisions must be explicit enough for Phase 006 validation.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Filename embeds**: paths containing `sk-improve-prompt` need rename handling even when content counts are zero.
- **JSON keys**: `skill-graph.json` contains object keys and graph edges, not only value strings.
- **Symlink**: `.opencode/changelog/sk-improve-prompt` must be renamed or recreated after the skill folder move.
- **Generated state**: memory DB and code-graph stores require re-index rather than direct editing.
- **Hidden roots**: runtime mirrors and root `AGENTS.md` require explicit search beyond the final sanity command.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should generated observability history be rewritten or regenerated? **Resolved for Phase 001:** inventory it as forward-facing active IDs and let Phase 005 decide mutation strategy.
- Should `CLAUDE.md` be counted separately from `AGENTS.md`? **Resolved:** no, it is a symlink to `AGENTS.md`.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Dimension | Rating | Rationale |
|-----------|--------|-----------|
| File count | Medium | 58 canonical active files need ownership mapping |
| Behavioral risk | Low | Phase 001 is documentation-only inventory |
| Rename risk | Medium | Later phases touch routing and advisor IDs |
| Verification risk | Medium | Hidden runtime mirrors and generated indexes need explicit handling |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:implementation -->
## 11. IMPLEMENTATION APPROACH

Dispatch cli-codex gpt-5.5 medium fast for this phase. The executor should run read-only `rg` and filename/symlink discovery, normalize hits into the chosen inventory artifact shape, and leave all rename-target source files untouched.
<!-- /ANCHOR:implementation -->

<!-- ANCHOR:handoff -->
## 12. HANDOFF CRITERIA

- Inventory artifact exists and catalogs every active `sk-improve-prompt` reference and filename embed.
- Counts are validated against `../resource-map.md` estimates within +/-10%, or deviations are explained.
- `git diff --name-only` shows no source-file edits outside the Phase 001 folder.

```bash
rg -n 'sk-improve-prompt' .opencode .claude .codex .gemini README.md AGENTS*.md --glob '!**/z_archive/**' --glob '!**/z_future/**'
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/082-sk-improve-prompt-rename/001-discovery-impact-map --strict
```
<!-- /ANCHOR:handoff -->

<!-- ANCHOR:related -->
## 13. RELATED DOCUMENTS

- **Parent Spec**: [../spec.md](../spec.md)
- **Resource Map**: [../resource-map.md](../resource-map.md)
- **Predecessor Phase**: None
- **Successor Phase**: [../002-skill-folder-rename/spec.md](../002-skill-folder-rename/spec.md)
<!-- /ANCHOR:related -->
