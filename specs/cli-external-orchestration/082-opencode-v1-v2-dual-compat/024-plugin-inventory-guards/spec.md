---
title: "Feature Specification: Phase 24: plugin-inventory-guards"
description: "The v2 plugin tests cover the plugin folder through two hand-written lists, so a new plugin without the dual export passes unnoticed. This phase replaces both lists with an inventory read from disk, adds guards for unmapped hooks and unrouted event names, observes v2 event delivery read-only, and fixes the stale counts in the plugins README and the two-version proof."
trigger_phrases:
  - "plugin inventory guards"
  - "phase 24 plugin inventory guards"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 24: plugin-inventory-guards

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/161-plugin-inventory-guards` |
| **Parent Spec** | ../spec.md |
| **Phase** | 24 of 26 |
| **Predecessor** | 014-post-merge-deep-research |
| **Successor** | None |
| **Handoff Criteria** | The plugin tests read the inventory from disk, the four fix-list rows are closed or documented with evidence, and both doctor battery families stay green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 24** of the OpenCode v1 and v2 dual-compatibility specification. It closes fix-list rows 6, 7, 8 and 30 from `../014-post-merge-deep-research/research/research.md` (the fix list at lines 163 to 196).

**Scope Boundary**: The v2 plugin tests and their helper and manifest under `.opencode/plugins/tests/`, one export line in `.opencode/plugins/lib/v2-bridge.js`, the plugins `README.md`, `ARCHITECTURE.md` and `tests/README.md` wording that names the pinned lists or stale counts, the doctor battery count row in `../011-two-version-proof-and-closeout/proof.md`, this folder's records and the parent phase map. No plugin behavior changes.

**Dependencies**:
- The research fix list and its architecture note: one bridge per surface, plus an inventory read from disk, a test that it equals what is declared and a manifest of named exceptions, with sk-vision listed as a native-dual exception.
- OpenCode 2.0.32 for the read-only event observation, run on a private port, never the shared service.

**Deliverables**:
- `tests/helpers/plugin-inventory.cjs` and `tests/plugin-inventory.json`, read by the v2 tests.
- `tests/plugin-inventory.test.cjs`: the inventory, unmapped-hook and event-name guards.
- The two v2 suites driven by the inventory instead of their pinned lists.
- Corrected docs and a dated proof row.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`tests/v2-registration.test.cjs` checks 12 plugins named in `PLUGIN_NAMES` and `tests/v2-hard-plugins.test.cjs` checks five named in `PLUGINS`. A new plugin file is checked only once someone adds it to one of those lists, so a plugin without the dual export reaches OpenCode 2 untested (row 6, P1). The bridge reports hook keys it cannot map through `cleanup.skippedKeys`, but no test reads it (row 7). Plugins compare event types against v1 names, and nothing checks that each name reaches a v2 plugin through a bridge alias or mapping or arrives under the same name (row 8). The plugins README states the suite counts as fixed numbers, and the two-version proof still gives the 16-plugin battery counts from before sk-vision joined the folder, without a date (row 30).

### Purpose
The plugin tests derive their coverage from the files on disk and a manifest of named exceptions, so a new plugin, an unmapped hook or an unrouted event name fails a test, and every count in the docs either comes from the inventory or carries its date.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An inventory helper and a manifest that lists sk-vision as the one native-dual exception, the hooks a plugin may leave unmapped (none today) and the event names by how they reach v2.
- An inventory test that fails on an unlisted file, a manifest entry with no file, a consumer without the bridge, a bridged plugin with an unmapped hook, and an event name that is neither mapped, aliased nor listed.
- The two v2 suites rewired to read the inventory.
- A read-only observation of event delivery on OpenCode 2.0.32.
- Wording and count fixes in the plugins docs and the proof.

### Out of Scope
- Changing any plugin's behavior, including the disposal handlers that never fire on OpenCode 2. They are recorded in the manifest and the README.
- The duplicate plugin ID failure that the v2 battery shows when it runs inside a worktree nested under the main checkout. OpenCode 2 walks up from the nested worktree and loads the main checkout's plugins too. CI runs from a fresh clone and is not affected.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/tests/helpers/plugin-inventory.cjs` | Create | Reads the plugin folder and the manifest and reports problems |
| `.opencode/plugins/tests/plugin-inventory.json` | Create | Native-dual exceptions, allowed skipped hooks and the event-name lists |
| `.opencode/plugins/tests/plugin-inventory.test.cjs` | Create | The inventory, skipped-hook and event-name guards |
| `.opencode/plugins/tests/v2-registration.test.cjs` | Modify | Covers every bridged plugin from the inventory |
| `.opencode/plugins/tests/v2-hard-plugins.test.cjs` | Modify | Requires a case for every native-dual exception and every case to name an inventory file |
| `.opencode/plugins/lib/v2-bridge.js` | Modify | Exports its hook and event tables for the tests |
| `.opencode/plugins/README.md`, `ARCHITECTURE.md`, `tests/README.md` | Modify | Describe the inventory instead of the pinned lists and drop fixed counts |
| `../011-two-version-proof-and-closeout/proof.md` | Modify | Date-stamp the battery count row |
| This folder and `../spec.md` | Modify | Records and the phase map row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Row 6: the v2 tests read their plugin list from `.opencode/plugins` and a manifest. | The inventory test fails on an unlisted file, a manifest entry with no file and a consumer without the bridge, each shown by a probe in a temporary copy. |
| REQ-002 | No regressions in the plugin suite or the doctor batteries. | The plugin suite passes with the new tests added to the 397 baseline, and both battery families exit 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Row 7: every bridged plugin maps all of its hooks unless the manifest lists the skip. | The assertion fails when a plugin in a temporary copy returns an unmapped hook. |
| REQ-004 | Row 8: every event name a bridged plugin handles is mapped, aliased or listed, and v2 delivery is observed read-only. | The policy test fails on an unlisted event name in a temporary copy, and `scratch/v2-events/` records what OpenCode 2.0.32 delivered. |
| REQ-005 | Row 30: no stale count in the README or the proof. | The README counts come from the inventory or are removed, and the proof row carries its date. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of rows 6, 7, 8 and 30 is fixed or documented with evidence in this folder.
- **SC-002**: Every new or changed test fails on a mutation recorded under `scratch/mutation/`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The event-name scan reads comparisons with a regex and can miss a name compared some other way | Med | The test also fails on a listed name that no plugin handles, so the lists cannot drift silently, and the README names the regex's limit |
| Risk | Bridged plugins now set up in the registration suite, including the goal plugin | Low | The suite points the goal state at a temporary folder |
| Dependency | A private OpenCode 2 host for the observation | Without it row 8 stays a policy test only | The host runs on its own port with its own data folders, and the shared service's start time is checked before and after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Events that need a model turn were not observed on OpenCode 2, because the private host had no provider credentials. They are listed as unverified in the manifest.
<!-- /ANCHOR:questions -->

---
