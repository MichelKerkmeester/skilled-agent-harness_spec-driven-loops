---
title: "Feature Specification: Env example dead flags"
description: "Remove every environment variable from the root .env.example that no code reads, correct the ones whose description still speaks of the retired memory database, drop the unused batch config they fed, and delete the stale skill-level env template."
trigger_phrases:
  - "env example dead flags"
  - "deprecated spec kit feature flags"
  - "environment variable census"
  - "stale env template"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Env example dead flags

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-cli-package-residue-removal |
| **Successor** | None |
| **Handoff Criteria** | Every variable left in `.env.example` has a reader in the real tree, and the runtime builds |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the spec-kit simplification research program, opened on the operator's observation that the env template still carried memory-database flags.

**Scope Boundary**: the root `.env.example`, the runtime's `ENV-REFERENCE.md`, the batch constants in `runtime/core/config.ts`, and the skill-level `.env.example`.

**Dependencies**:
- A repository-wide census of every variable name against production read sites

**Deliverables**:
- Thirteen dead variables gone from the template, one section banner corrected, one description reworded
- Two unreachable-flag rows gone from the reference
- The unused batch constants gone from the runtime config
- The stale skill-level env template deleted

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The root env template documented 216 variables. Thirteen had no reader anywhere in the real tree: leftovers of the memory database's indexing, ranking rollout and learned-combiner flags, two pre-push test flags whose hook never shipped, and a Devin binary override no adapter reads. The ranking section said the retrieval scripts read its flags when only the skill advisor's fusion scorer does, the spec-doc flag spoke of indexing, and a second env template inside the skill described a provider cascade that no longer exists.

### Purpose
An operator who copies the template sees only variables that change behavior, described in terms of the code that reads them today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the thirteen variables with no production reader
- Reword the ranking section banner and the spec-document discovery flag
- Remove the two reference rows for flags read only by an unreachable module
- Remove the two batch constants nothing imports
- Delete the skill-level env template

### Out of Scope
- The fate of `shared/algorithms/adaptive-fusion.ts` and `shared/ranking/learned-combiner.ts`, which read three of the removed flags but are reachable only through the shared barrel - lane 003 owns the shared package
- External CLI credentials such as the Cursor and Devin API keys - the external binaries read them, not this repository

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.env.example` | Modify | Thirteen lines removed, one banner and one description reworded, sections renumbered |
| `.opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | Two rows removed |
| `.opencode/skills/system-spec-kit/runtime/core/config.ts` | Modify | Batch block removed, sections renumbered |
| `.opencode/skills/system-spec-kit/.env.example` | Delete | Stale duplicate describing a retired cascade |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every variable removed has no production read site in the real tree | The census script over `.opencode`, the runtime mirrors, `.github` and the root reports zero readers for each; hook files without an extension were included |
| REQ-002 | The runtime still builds and the env-reference drift guard passes | `npm run build` in `runtime` exits 0; `env-reference-drift.vitest.ts` passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every variable kept is described by the code that reads it | The ranking banner names the fusion scorer; the discovery flag names discovery, not indexing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The census reports zero no-reader variables among those that remain, after the hook files are included
- **SC-002**: Nothing references the deleted skill-level template
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A variable read through a composed name looks dead to a literal census | Removing it would silence a live switch | The hook-flag family composes `SYSTEM_<CONCERN>_DISABLED` at runtime; every such name was kept |
| Risk | The first census counted an ignored copy of the repository | Dead flags looked live | The census was rerun over the real tree only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The one open thread, whether the adaptive-fusion and learned-combiner modules stay, belongs to lane 003.
<!-- /ANCHOR:questions -->
