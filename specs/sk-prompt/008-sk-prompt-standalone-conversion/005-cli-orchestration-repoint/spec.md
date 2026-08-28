---
title: "Feature Specification: Phase 5: cli-orchestration-repoint"
description: "Repoint every cli-external-orchestration reference off the deleted packet: 63 canonical-card paths move, and the rest are prose about a capability that no longer exists."
trigger_phrases:
  - "008 phase 005"
  - "sk-prompt cli-orchestration-repoint"
  - "cli-orchestration-repoint"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: cli-orchestration-repoint

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 8 |
| **Predecessor** | 004-card-sync-guard-rewrite |
| **Successor** | 006-standalone-conversion |
| **Handoff Criteria** | The CLI hub has zero references to the retired packet and 0 broken markdown links |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the sk-prompt standalone conversion.

**Scope Boundary**: Changelog entries, which are historical records of what was true when written

**Dependencies**:
- The canonical card must already exist at its new location, which an earlier phase ensured.

**Deliverables**:
- Repoint all canonical-card references to the surviving location
- Remove the model-override tier from the executors' precedence rules and renumber
- Remove the retired packet's row from each executor's related-skills table

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The CLI executor hub carried 46 references into the deleted packet across 20 files. They are not one kind of edit: most were paths to the canonical prompt-quality card, which survives at a new location, while the remainder assert a per-model profile contract that is gone and cannot simply be repointed.

### Purpose
No file under the CLI hub references the retired packet, every surviving card path resolves on disk, and the prose that described the removed contract reads correctly without it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repoint all canonical-card references to the surviving location
- Remove the model-override tier from the executors' precedence rules and renumber
- Remove the retired packet's row from each executor's related-skills table
- Delete the two scenarios whose entire subject was dispatching through the deleted packet
- Rewrite the design-context scenario to keep the half of its contract that survives

### Out of Scope
- Changelog entries, which are historical records of what was true when written
- Benchmark reports, which are write-once evidence
- The executor cards' own dispatch mechanics, which never depended on the packet

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-*/SKILL.md` (5) | Modify | Drop the model-override step from the composition rule and renumber the tiers |
| `cli-*/assets/prompt-quality-card.md` (5) | Modify | Repoint the canonical card, drop the per-model trailer and the Devin override table |
| `cli-*/README.md` (5) | Modify | Remove the retired packet's related-skills row |
| `cli-*/manual-testing-playbook/**` | Modify | Remove two scenarios, rewrite a third, fix a pre-existing link depth |
| `.../composer-rcaf-template-dispatch.md` | Delete | Validated a per-model profile that no longer exists |
| `graph-metadata.json` | Modify | Rewrite the advisor edge context to the surviving relationship |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No file under the CLI hub references the retired packet | A recursive search excluding changelogs and benchmarks returns 0 hits |
| REQ-002 | Every canonical-card reference resolves on disk | A resolver over all reference forms reports 0 broken |
| REQ-003 | No dangling scenario or index row survives a deleted feature file | The link-integrity guard reports 0 broken links repository-wide |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Model names themselves are preserved | Provider and model roster tables still list DeepSeek, Kimi, MiniMax, MiMo, GLM and Composer |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The CLI hub has zero references to the retired packet and 0 broken markdown links
- **SC-002**: A precedence rule that lost its middle tier reads as a coherent two-tier rule, not a gap
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A path-only substitution leaves dangling prose | Sentences that reference a contract with the path removed | Split the work: mechanical substitution for the surviving card, prose rewrite for the removed contract |
| Risk | Relative paths differ by directory depth | A depth-preserving edit breaks at one depth | Substituted a shared inner path segment, which preserves each reference's own prefix; then resolved all 68 against disk |
| Dependency | Two scenarios' feature files were deleted | Index rows and wave lists point at nothing | Removed the scenario bodies, index rows, wave entries and section headers together |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None; the phase closed against its recorded acceptance checks.
<!-- /ANCHOR:questions -->
