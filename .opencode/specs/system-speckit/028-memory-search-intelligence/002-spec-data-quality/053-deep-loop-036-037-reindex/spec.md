---
title: "Feature Specification: Reindex the renamed system-deep-loop 036 router-replay-surface-slice-sync and 037 scenario-loader-code-surface-sync folders and repoint their stale copied metadata identifiers and inbound references [template:level_1/spec.md]"
description: "The renamed 036 and 037 deep-loop folders carry description.json and graph-metadata.json copied from their old locations, so their identifiers still point at the pre-rename paths, and two inbound references in 124-sk-code-parent still cite the old slugs."
trigger_phrases:
  - "deep-loop 036 037 reindex"
  - "stale specFolder identifiers"
  - "router-replay slug rename"
  - "harness dependencies repoint"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/053-deep-loop-036-037-reindex"
    last_updated_at: "2026-07-06T08:49:49.047Z"
    last_updated_by: "michel-kerkmeester"
    recent_action: "Authored Level 1 spec for the deep-loop 036/037 folder-rename reindex"
    next_safe_action: "Overlap-check 036/037, then regenerate metadata and repoint references"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/036-router-replay-surface-slice-sync/description.json"
      - ".opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync/description.json"
      - ".opencode/specs/skilled-agent-orchestration/124-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/124-sk-code-parent/022-collapse-to-four-subskills/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/053-deep-loop-036-037-reindex"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does regenerating description.json/graph-metadata.json in place preserve the existing status: complete and importance_tier: high fields, or does regeneration reset them and require a manual restore?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Reindex the renamed system-deep-loop 036 router-replay-surface-slice-sync and 037 scenario-loader-code-surface-sync folders and repoint their stale copied metadata identifiers and inbound references

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator renamed `.opencode/specs/system-deep-loop/037-router-replay-surface-slice-sync` to `036-router-replay-surface-slice-sync` and added a new `037-scenario-loader-code-surface-sync`. Both folders are untracked and carry full doc sets copied from their old locations, so their `description.json`/`graph-metadata.json` still carry the pre-rename identifiers: `036`'s files say `specFolder`/`packet_id`/`spec_folder`: `system-deep-loop/037-router-replay-surface-slice-sync` (specId `037`), and `037`'s files say `system-deep-loop/038-scenario-loader-code-surface-sync` (specId `038`). Every one of the five markdown docs inside each folder (spec, plan, tasks, checklist, implementation-summary) also references its own old slug internally. Two inbound references from `skilled-agent-orchestration/124-sk-code-parent` still cite both old slugs.

### Purpose
Regenerate `description.json` and `graph-metadata.json` for both renamed folders so their identifiers match the new paths, fix every internal doc reference to the old slug inside each folder's own docs, and repoint the two confirmed inbound references in `124-sk-code-parent` to the new slugs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Regenerate `description.json` for `system-deep-loop/036-router-replay-surface-slice-sync` (new `specFolder`/`specId: "036"`/`folderSlug`).
- Regenerate `description.json` for `system-deep-loop/037-scenario-loader-code-surface-sync` (new `specFolder`/`specId: "037"`/`folderSlug`).
- Regenerate `graph-metadata.json` for both folders so `packet_id` and `spec_folder` match the new paths.
- Fix every internal reference to the old slug inside each folder's own five docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`).
- Repoint the two confirmed inbound references: `skilled-agent-orchestration/124-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline/spec.md:178` and `skilled-agent-orchestration/124-sk-code-parent/022-collapse-to-four-subskills/spec.md:191`, both currently reading `system-deep-loop/037-router-replay-surface-slice-sync`, `system-deep-loop/038-scenario-loader-code-surface-sync` in a "Harness dependencies" bullet.
- Overlap-check both folders against the concurrent-session dirty set before writing, since both are currently untracked.

### Out of Scope
- The global `.opencode/specs/descriptions.json` - regenerated later via a separate reindex, not edited by this phase.
- Any other tree beyond these two folders and the two named inbound references. The reindex targets live in `system-deep-loop`, a different tree from this phase's own `system-speckit` packet; this phase documents the work, implementation happens later.
- Re-litigating the underlying work the two folders describe. Both already carry `status: "complete"` in their copied `graph-metadata.json`; this phase only fixes identifiers and references, it does not reopen the implementation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/specs/system-deep-loop/036-router-replay-surface-slice-sync/description.json` | Modify | Regenerate so `specFolder`/`specId`/`folderSlug` match the new `036` path |
| `.opencode/specs/system-deep-loop/036-router-replay-surface-slice-sync/graph-metadata.json` | Modify | Regenerate so `packet_id`/`spec_folder` match the new `036` path |
| `.opencode/specs/system-deep-loop/036-router-replay-surface-slice-sync/{spec,plan,tasks,checklist,implementation-summary}.md` | Modify | Fix internal references from the old `037-router-replay-surface-slice-sync` slug to `036-router-replay-surface-slice-sync` |
| `.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync/description.json` | Modify | Regenerate so `specFolder`/`specId`/`folderSlug` match the new `037` path |
| `.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync/graph-metadata.json` | Modify | Regenerate so `packet_id`/`spec_folder` match the new `037` path |
| `.opencode/specs/system-deep-loop/037-scenario-loader-code-surface-sync/{spec,plan,tasks,checklist,implementation-summary}.md` | Modify | Fix internal references from the old `038-scenario-loader-code-surface-sync` slug to `037-scenario-loader-code-surface-sync` |
| `.opencode/specs/skilled-agent-orchestration/124-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline/spec.md:178` | Modify | Repoint the "Harness dependencies" bullet to the new `036`/`037` slugs |
| `.opencode/specs/skilled-agent-orchestration/124-sk-code-parent/022-collapse-to-four-subskills/spec.md:191` | Modify | Repoint the "Harness dependencies" bullet to the new `036`/`037` slugs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | `036-router-replay-surface-slice-sync`'s `description.json` matches the new path | `specFolder` reads `system-deep-loop/036-router-replay-surface-slice-sync` and `specId` reads `036` |
| REQ-002 | `037-scenario-loader-code-surface-sync`'s `description.json` matches the new path | `specFolder` reads `system-deep-loop/037-scenario-loader-code-surface-sync` and `specId` reads `037` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-003 | `036`'s `graph-metadata.json` no longer points at the old `037-router-replay-surface-slice-sync` path | Given `036`'s `graph-metadata.json` currently sets `packet_id`/`spec_folder` to the old `037-...` path, When it is regenerated, Then both fields read `system-deep-loop/036-router-replay-surface-slice-sync` |
| REQ-004 | `037`'s `graph-metadata.json` no longer points at the old `038-scenario-loader-code-surface-sync` path | Given `037`'s `graph-metadata.json` currently sets `packet_id`/`spec_folder` to the old `038-...` path, When it is regenerated, Then both fields read `system-deep-loop/037-scenario-loader-code-surface-sync` |
| REQ-005 | Every internal doc inside each folder references its own new slug, not the old one | Given each folder's five markdown docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) currently reference the old slug, When this phase runs, Then a search for the old slug inside each folder's own docs returns zero matches |
| REQ-006 | Both confirmed inbound references are repointed | Given the "Harness dependencies" bullet at `124-sk-code-parent/021-playbook-gold-and-lane-c-rebaseline/spec.md:178` and the identical bullet at `124-sk-code-parent/022-collapse-to-four-subskills/spec.md:191`, When this phase runs, Then both read `system-deep-loop/036-router-replay-surface-slice-sync`, `system-deep-loop/037-scenario-loader-code-surface-sync` |
| REQ-007 | Neither folder is mid-edit by a concurrent session before this phase writes to it | Given both folders currently show as untracked in `git status`, When this phase begins, Then an overlap check confirms no concurrent session is actively editing either folder before any write |
| REQ-008 | The global descriptions index is not touched | Given `.opencode/specs/descriptions.json`, When this phase runs, Then that file is not edited; it is regenerated later via a separate reindex |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both folders' `description.json` and `graph-metadata.json` carry identifiers that match their current, renamed paths, with no reference to the pre-rename slugs anywhere inside either folder's own docs.
- **SC-002**: Both confirmed inbound references in `124-sk-code-parent` point at the new `036`/`037` slugs, and `.opencode/specs/descriptions.json` is untouched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `generate-description.js` / `backfill-graph-metadata.js` | Regeneration mechanism for both files | Reused as-is; this phase only supplies the correct target folder |
| Risk | Regenerating `graph-metadata.json` might reset `status: "complete"` / `importance_tier: "high"`, which are already correct in the copied files | Would understate the folders' actual state | Verify the regenerated output preserves those fields, or restore them explicitly if the generator resets them (see Open Questions) |
| Risk | A concurrent session is mid-edit on either untracked folder | A blind write could clobber in-flight work | Overlap-check via `git status` before any write; skip and report if either folder shows unexpected concurrent activity |
| Risk | Additional inbound references beyond the two confirmed ones exist elsewhere in the repo | Scope could be incomplete | This phase scopes to the two confirmed references; a broader repo-wide reference sweep is out of scope unless named later |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does regenerating `description.json`/`graph-metadata.json` in place preserve the existing `status: "complete"` and `importance_tier: "high"` fields, or does regeneration reset them and require a manual restore afterward?
- Are there inbound references to the old `037-router-replay-surface-slice-sync` / `038-scenario-loader-code-surface-sync` slugs beyond the two confirmed in `124-sk-code-parent`, and if so, should they be repointed in the same pass or tracked separately?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
