---
title: "Feature Specification: Phase 5: fold in prompt-models"
description: "Fold the independent sk-prompt-models skill into sk-prompt as the prompt-models workflow packet while preserving every live runtime and benchmark write-target consumer. The directory move, advisor identity dissolution, hardcoded profile path repoints, and /deep:model-benchmark write-target repoints must land as one atomic execution unit."
trigger_phrases:
  - "fold in prompt models"
  - "sk-prompt-models"
  - "prompt-models workflow packet"
  - "model benchmark write target"
  - "small model profile path"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-prompt-parent/005-foldin-prompt-models"
    last_updated_at: "2026-07-09T16:30:00Z"
    last_updated_by: "claude"
    recent_action: "Executed the atomic relocation bundle; hub now fully canon-clean"
    next_safe_action: "Proceed to phase 006"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/prompt-models/"
      - ".opencode/skills/sk-prompt/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-foldin-prompt-models"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Closed a phase-003 gap: hub-level changelog/, manual_testing_playbook/, benchmark/ were missing (doctrine calls for them at scaffold time); added additively in this phase, parent-skill-check now 0/0"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: foldin-prompt-models

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
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-09 |
| **Branch** | `scaffold/005-foldin-prompt-models` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 8 |
| **Predecessor** | 004-onboard-prompt-improve |
| **Successor** | 006-advisor-and-integration |
| **Handoff Criteria** | The prompt-models packet tree is moved under sk-prompt, only the hub graph-metadata.json remains, small-model profile consumers resolve the new path, and /deep:model-benchmark writes to the new benchmark target. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Merge sk-prompt and sk-prompt-models into one parent hub sk-prompt with two workflow modes: prompt-improve and prompt-models specification.

**Scope Boundary**: Move and functional rewiring only. This phase performs the prompt-models tree relocation, dissolves the old advisor identity, and repoints the known live hardcoded consumers that would otherwise keep using the dead path.

**Dependencies**:
- Phase 004 has prepared the sk-prompt parent layout and prompt-improve packet so `.opencode/skills/sk-prompt/prompt-models/` can become the second workflow packet.
- Phase 001 research identified the hardcoded runtime profile path joins and /deep:model-benchmark write-target assets that must move atomically with the directory.

**Deliverables**:
- Full `git mv` relocation of `.opencode/skills/sk-prompt-models/` to `.opencode/skills/sk-prompt/prompt-models/`, preserving the 2,616-file tree including `benchmarks/`.
- Deletion of the moved packet's standalone `graph-metadata.json` and fold-in of its `enhances -> cli-opencode (0.8)` edge plus domain and intent-signal content into `.opencode/skills/sk-prompt/graph-metadata.json`.
- Same-change repoints for the two advisor small-model profile path joins and the three /deep:model-benchmark write-target files.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-prompt-models` is still a second independent advisor identity even though the approved target shape is one `sk-prompt` parent hub with two workflow packets. Its live consumers also contain hardcoded paths to the old skill location: cli-opencode's small-model dispatch resolves profile data through advisor path joins, and `/deep:model-benchmark` writes benchmark outputs to the old `sk-prompt-models/benchmarks/` tree unless its command and YAML assets are repointed in the same change as the move.

### Purpose
Fold `sk-prompt-models` into `.opencode/skills/sk-prompt/prompt-models/` as a workflow packet while keeping cli-opencode small-model profile lookup and `/deep:model-benchmark` benchmark writes functional through the relocation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the complete `.opencode/skills/sk-prompt-models/` tree into `.opencode/skills/sk-prompt/prompt-models/` with `git mv`, including the live `benchmarks/` write-target tree.
- Delete the packet-local `graph-metadata.json` after the move and fold its advisor edge, domain, and intent-signal content into the single surviving hub graph metadata file.
- Repoint the two hardcoded small-model profile path-join call sites and all known /deep:model-benchmark write-target path lines in the same atomic execution change as the directory move.
- Reconcile the folded packet's version metadata so the moved packet no longer carries conflicting SKILL, description, and changelog version claims.

### Out of Scope
- The broader documentation and prose referrer sweep across approximately 50 files is out of scope because phase 006 owns advisor and integration cleanup.
- Exercising `.github/workflows/prompt-card-sync.yml` is out of scope because phase 006 owns the card-sync gate against the final integrated layout.
- Creating a `/prompt-models` command is out of scope because the approved design keeps prompt-models advisor-routed and cross-skill-reference only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt-models/` | Move | Source of the full 2,616-file tree to relocate with `git mv`; includes the live `benchmarks/` write target and all current prompt-models assets. |
| `.opencode/skills/sk-prompt/prompt-models/` | Move/Create target | Destination workflow packet folder; folder name, packet skill name, and `workflowMode` must all be `prompt-models`. |
| `.opencode/skills/sk-prompt-models/graph-metadata.json` | Delete after fold | Remove the old independent advisor identity after its `enhances -> cli-opencode (0.8)` edge plus domain and intent-signal content are folded into the hub graph metadata. |
| `.opencode/skills/sk-prompt/graph-metadata.json` | Modify | Single surviving advisor identity for the merged hub; absorbs prompt-models enhancement, domain, and intent-signal content. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts` | Modify | Repoint the hardcoded model profile path join from `sk-prompt-models/assets/model_profiles.json` to `sk-prompt/prompt-models/assets/model_profiles.json`. |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modify | Repoint the hardcoded model profile path join from `sk-prompt-models/assets/model_profiles.json` to `sk-prompt/prompt-models/assets/model_profiles.json`. |
| `.opencode/commands/deep/model-benchmark.md` | Modify | Repoint every interpolated benchmark write-target path from the old skill tree to `.opencode/skills/sk-prompt/prompt-models/benchmarks/`. |
| `.opencode/commands/deep/assets/deep_model-benchmark_auto.yaml` | Modify | Repoint every interpolated benchmark write-target path from the old skill tree to `.opencode/skills/sk-prompt/prompt-models/benchmarks/`. |
| `.opencode/commands/deep/assets/deep_model-benchmark_confirm.yaml` | Modify | Repoint every interpolated benchmark write-target path from the old skill tree to `.opencode/skills/sk-prompt/prompt-models/benchmarks/`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Exactly one `graph-metadata.json` survives under `.opencode/skills/sk-prompt/` after this phase. | A file inventory under `.opencode/skills/sk-prompt/` reports only `.opencode/skills/sk-prompt/graph-metadata.json`, and no `prompt-models/graph-metadata.json` remains. |
| REQ-002 | The two hardcoded small-model profile path-join call sites are repointed and load-tested. | Both `executor-delegation.ts` and `skill_advisor.py` reference `sk-prompt/prompt-models/assets/model_profiles.json`, and a smoke check resolves at least one small-model profile from that new path. |
| REQ-003 | `/deep:model-benchmark` write-target paths are repointed in the same change as the directory move. | The command markdown and both YAML assets reference `.opencode/skills/sk-prompt/prompt-models/benchmarks/`; no functional benchmark write path still targets `.opencode/skills/sk-prompt-models/benchmarks/`. This repoint is not allowed to be a follow-up. |
| REQ-004 | The full prompt-models tree, including `benchmarks/`, is preserved through the move. | The destination packet contains the expected assets, profile data, changelog, SKILL file, and benchmark tree; the old top-level skill folder is absent after the atomic move. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Reconcile prompt-models version metadata during the fold-in. | The moved packet no longer carries contradictory version claims between `SKILL.md`, `description.json`, and latest changelog; any retained version statement is consistent with the fold-in state. |
| REQ-006 | Preserve prompt-models as read-only profile lookup, not a mutating workflow command. | The moved packet keeps read-only tool-surface guidance, has no new slash command, and remains advisor-routed or cross-skill-referenced only. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: cli-opencode can resolve a small-model profile path after the move using the new `.opencode/skills/sk-prompt/prompt-models/assets/model_profiles.json` location.
- **SC-002**: A dry-run or smoke invocation confirms `/deep:model-benchmark` resolves an existing write target at `.opencode/skills/sk-prompt/prompt-models/benchmarks/` after the move.
- **SC-003**: The advisor graph has one `sk-prompt` identity, with the former prompt-models enhancement and intent metadata folded into the hub instead of silently dropped.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004 parent hub structure | The destination packet path may not exist or may not match the approved hub shape. | Confirm `.opencode/skills/sk-prompt/` is ready before executing the atomic move; halt if the expected parent layout is missing. |
| Risk | Splitting the directory move from benchmark path repoints | High: `/deep:model-benchmark` can silently write to a dead old path. | Treat the `git mv`, benchmark path repoints, and advisor path repoints as one atomic execution unit and one verification unit. |
| Risk | Missing one hardcoded advisor path join | High: small-model profile lookup can break silently by resolving the wrong file path. | Repoint both known call sites and verify by loading a small-model profile from the new location. |
| Risk | Dropping graph metadata during identity dissolution | High: advisor loses the `enhances -> cli-opencode (0.8)` relationship and prompt-models routing signals. | Fold the edge, domain, and intent-signal content into the hub `graph-metadata.json` before deleting the packet-local file. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this drafting pass. During execution, confirm the current tree count and old-path references from the live worktree before applying the atomic move.
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
