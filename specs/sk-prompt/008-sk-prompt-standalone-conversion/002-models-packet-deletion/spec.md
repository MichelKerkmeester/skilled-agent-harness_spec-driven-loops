---
title: "Feature Specification: Phase 2: models-packet-deletion"
description: "Delete the sk-prompt-models packet and remove every advisor, fixture and test consumer of its model-profiles registry."
trigger_phrases:
  - "008 phase 002"
  - "sk-prompt models-packet-deletion"
  - "models-packet-deletion"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: models-packet-deletion

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
| **Phase** | 2 of 8 |
| **Predecessor** | 001-baseline-capture |
| **Successor** | 003-routing-baseline-recapture |
| **Handoff Criteria** | Both delegation suites pass at 10 of 10, including the TS-native versus Python parity case |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the sk-prompt standalone conversion.

**Scope Boundary**: The routing baseline and ratchet pins the deletion moves - owned by 003

**Dependencies**:
- The advisor's node_modules are present in this checkout; the suites run without a fresh install.
- better-sqlite3 is built against a different Node ABI here, so the scorer degrades to its filesystem projection - the same regime CI uses.

**Deliverables**:
- Delete `.opencode/skills/sk-prompt/sk-prompt-models/` in full
- Remove the model-alias resolver branch from the TypeScript scorer
- Remove the mirrored branch from the Python scorer

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-prompt-models packet is not documentation: its model-profiles.json is read at runtime by two parallel scorer implementations and enforced by a PR-blocking CI guard. Deleting the directory alone would leave both scorers resolving a path that no longer exists and a fixture branch asserting a capability that no longer resolves.

### Purpose
The packet and every code path that reads it are gone together, with the advisor's remaining resolver branches still proven equivalent across its TypeScript and Python implementations.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `.opencode/skills/sk-prompt/sk-prompt-models/` in full
- Remove the model-alias resolver branch from the TypeScript scorer
- Remove the mirrored branch from the Python scorer
- Drop the `direct-alias-model` cases from the shared parity fixture
- Remove the vitest case that asserted a bare model name routes to its executor

### Out of Scope
- The routing baseline and ratchet pins the deletion moves - owned by 003
- The card-sync guard checks that read the deleted registry - owned by 004
- The canonical CLI prompt-quality card, which is prompt-improvement doctrine rather than model-profile content and is preserved

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/sk-prompt-models/**` | Delete | The retired workflow packet |
| `lib/scorer/executor-delegation.ts` | Modify | Drop two profile interfaces, the modelAliases field, the registry read block and the consuming back-stop loop |
| `scripts/skill_advisor.py` | Modify | Drop the mirrored model-alias block and its stale docstring reference |
| `tests/parity/fixtures/executor-delegation-cases.json` | Modify | Remove the `direct-alias-model` branch (11 to 9 cases) |
| `tests/scorer/executor-delegation.vitest.ts` | Modify | Remove the model-alias assertion and lower the fixture floor to match |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No source file resolves the deleted registry path | `grep -rn 'sk-prompt-models' lib/ scripts/ tests/` returns no hits |
| REQ-002 | The TypeScript scorer still typechecks | `tsc --noEmit` reports no error naming executor-delegation.ts |
| REQ-003 | TS-native and Python scorers still agree on every surviving case | The shared-fixture parity test passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The fixture stays non-trivial after the branch is removed | All three required branches remain and the count floor still holds |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both delegation suites pass at 10 of 10, including the TS-native versus Python parity case
- **SC-002**: The three routing suites CI runs in its lean job pass at 21 of 21
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Both scorers read the registry defensively | A silent behaviour change rather than a crash | Removed the branch outright in both, so the capability is absent by construction rather than degraded |
| Risk | The Python and TypeScript resolvers can drift apart | Advisor scores differently by runtime | The shared-fixture parity test asserts they agree and is run after the edit |
| Dependency | The fixture count floor was calibrated with the model branch present | The suite fails on a deliberate removal | Floor lowered to the new branch count with the reason recorded in the assertion |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None; the phase closed against its recorded acceptance checks.
<!-- /ANCHOR:questions -->
