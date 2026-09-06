---
title: "Feature Specification: Phase 6: legacy-memory-surface-inventory"
description: "Inventory every repository surface that references or integrates the system-spec-memory subsystem, classified by surface type, reference kind, lifecycle and owning phase, so the rewire and removal phases miss nothing."
trigger_phrases:
  - "legacy memory surface inventory"
  - "memory decommission inventory"
  - "system-spec-memory consumers"
  - "memory surface census"
  - "rewire and delete worklist"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: legacy-memory-surface-inventory

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-ripgrep-retrieval-research |
| **Successor** | None |
| **Handoff Criteria** | The synthesis worklists and preserve set are folded into phases 002 and 003 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Deep research for the memory decommission: ripgrep retrieval optimization and legacy memory surface inventory specification.

**Scope Boundary**: Research only. This phase reads the repository and writes inside its own lineage directory. It changes no runtime file and it never calls the memory MCP.

**Dependencies**:
- The parent `spec.md` and `goal.md`, read before the first research action
- Phases 002 and 003, which consume the worklists this phase produces

**Deliverables**:
- Five iteration files plus a synthesis at `research/lineages/luna-max/research.md`
- A row-level inventory at `research/lineages/luna-max/inventory.external.json`
- A phase 002 rewire worklist, a phase 003 deletion worklist and a preserve set

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phases 002 and 003 were scoped against a parent estimate of roughly 167 logical consumers, a figure derived by judgment rather than by scanning. Nothing in the packet knew how many surfaces actually name the subsystem, which of them are live instructions versus historical narrative, or which shared seams would break if the server tree were deleted underneath them. A rewire built on an estimate misses consumers, and a deletion built on the same estimate breaks callers that still speak the old contract.

### Purpose

Every surface that references or integrates system-spec-memory is recorded with its path, line, classification and concrete action before any rewire or deletion begins.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Markdown docs, READMEs, `SKILL.md` files and skill references
- `AGENTS.md`, `CLAUDE.md`, `REPO RULES.md` and `repo-rules/`
- Command markdown plus their YAML and TXT assets, and agent files across every runtime mirror
- Hooks, plugins and the bin launchers and shims
- MCP and runtime config, environment files, package scripts, CI workflows and tests
- Templates, feature catalogs, manual-testing playbooks, graph-metadata and description JSON and code imports
- The 41 exposed tool names, the `SPECKIT_*` flag vocabulary, the sockets, the launcher and plugin filenames and the `/memory:` and `/doctor` command families

### Out of Scope

- Any rewire, edit or deletion of a surface the inventory names, because that is phase 002 and phase 003 work
- Calling the memory MCP, because the subsystem is the thing being decommissioned
- `z_archive`, excluded by the operator topic as historical bulk nothing retrieves against

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/lineages/luna-max/iterations/iteration-001.md` to `iteration-005.md` | Create | One file per forced research iteration |
| `research/lineages/luna-max/research.md` | Create | The synthesis, counts, worklists and preserve set |
| `research/lineages/luna-max/inventory.external.json` | Create | Row-level inventory, authoritative, kept out of git |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every inventory row carries path, line, surface type, reference kind, lifecycle, owning phase and action | Each row in `inventory.external.json` has all seven fields with no omissions |
| REQ-002 | The scan is case-insensitive and ignores the global ignore file | `rg --json --ignore-case --no-ignore-global`, with root `opencode.json` and `.utcp_config.json` reachable |
| REQ-003 | The synthesis reports counts per surface type, reference kind and owning phase | Sections 4.1, 4.2 and 4.3 of `research.md` carry the three count tables |
| REQ-004 | Every seam that still speaks the old contract is named with a source anchor | Section 9 names each break-risk surface with its file and line range |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The parent estimates are checked against the scan and corrected where wrong | Section 3 reports the tool count, tracked-tree size, flag count and consumer figure against the parent |
| REQ-006 | A preserve set names what must survive the phase 003 deletion | Section 11 lists the advisor, shared embedding, HF and IPC, deep-loop state and historical evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Five iteration files exist on disk and `research.md` names its stop reason as `maxIterationsReached`
- **SC-002**: Every inventory row carries path, line, surface type, reference kind, lifecycle, owning phase and action
- **SC-003**: The synthesis reports counts per surface type, reference kind and owning phase
- **SC-004**: The synthesis names every seam that still speaks the old contract and the preserve set that must survive deletion
- **SC-005**: Phase 002 and 003 spec, plan, tasks and acceptance docs carry the worklists and the preserve set
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Lifecycle is classified by path structure, so a live file under a research directory reads as historical | Med | The label is triage, and phase 002 re-opens ambiguous rows at edit time |
| Risk | The 69 MB row artifact cannot be committed | Med | It stays out of git and the synthesis carries the summaries the packet needs |
| Risk | Shared embedding, HF and IPC code is read as delete-only | High | The preserve set in section 11 and the break-risk seams in section 9 |
| Dependency | Phases 002 and 003 | The worklists are only useful once folded in | Fold-in tracked in `goal.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The parent figure of roughly 167 logical consumers still needs owner-by-owner reconciliation against the row inventory, because raw path counts cannot answer it.
- The replacement retrieval path must state honest loss where ripgrep cannot preserve semantic paraphrase, fusion ranking, decay and causal traversal.
<!-- /ANCHOR:questions -->

---
