---
title: "Feature Specification: Phase 6: advisor-and-integration"
description: "Phase 006 plans the remaining documentation, advisor-graph, and integration sweep after the structural sk-prompt parent-hub fold-in. It covers stale sk-prompt-models prose references, generated skill-graph refresh, and the prompt-card sync gate without executing those changes in this drafting pass."
trigger_phrases:
  - "sk-prompt parent phase 006"
  - "advisor integration sweep"
  - "sk-prompt-models referrer sweep"
  - "prompt card sync gate"
  - "skill graph regeneration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/007-sk-prompt-parent/006-advisor-and-integration"
    last_updated_at: "2026-07-09T17:00:00Z"
    last_updated_by: "claude"
    recent_action: "Executed the referrer sweep; skill-graph.json regen explicitly deferred"
    next_safe_action: "Proceed to phase 007"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/graph-metadata.json"
      - ".opencode/skills/sk-prompt/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-advisor-and-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "skill-graph.json regeneration deferred — file was already stale before this program (predates an unrelated deep-loop rename), and memory flags the canonical reindex as operator/successor-gated to avoid clobbering concurrent-session work"
      - "Also fixed 2 gaps beyond the original task list: sk-prompt/README.md was missing (broken link from .opencode/skills/README.md), and sk-prompt/prompt-improve/README.md still described itself as the old flat 'sk-prompt' with the old /prompt command"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: advisor-and-integration

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
| **Branch** | `scaffold/006-advisor-and-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 8 |
| **Predecessor** | 005-foldin-prompt-models |
| **Successor** | 007-routing-benchmark-and-review |
| **Handoff Criteria** | Future executor can begin with the grouped referrer sweep, regenerate the advisor graph from updated metadata, run the prompt-card sync gate, and verify the stale-reference grep is clean. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Merge sk-prompt and sk-prompt-models into one parent hub sk-prompt with two workflow modes: prompt-improve and prompt-models specification.

**Scope Boundary**: Author the execution plan for the advisor/integration cleanup only. This drafting pass does not edit the referrer files, generated graph, CI workflow, or benchmark assets.

**Dependencies**:
- Phases 004 and 005 have completed the structural move and the two functional runtime path-join updates.
- Phase 005 has repointed the `/deep:model-benchmark` write-target automation that owns the live benchmark tree.
- The hub's surviving `graph-metadata.json` includes the folded `prompt-models` advisor identity signals before `skill-graph.json` is regenerated.

**Deliverables**:
- A scoped spec for sweeping remaining active documentation/prose referrers to the new nested `sk-prompt/prompt-models` location.
- A plan for regenerating `skill-graph.json` from metadata rather than hand-editing it.
- A plan for exercising `.github/workflows/prompt-card-sync.yml` through `check-prompt-quality-card-sync.sh` against the new layout.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phases 004 and 005 move the skill content and functional write targets, roughly 50 active documentation and prose referrers can still point at the old flat `.opencode/skills/sk-prompt-models/` identity. Leaving those references stale makes operator guidance, manual-testing playbooks, install docs, and advisor metadata inconsistent with the parent-hub layout.

### Purpose
Ensure zero stale active references to the old flat `sk-prompt-models` skill remain, the advisor graph is regenerated from the merged metadata, and the prompt-card sync CI gate passes against the new layout.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Sweep the remaining active documentation/prose referrers named for phase 006 from `sk-prompt-models` to the nested `sk-prompt/prompt-models` packet model.
- Regenerate `skill-graph.json` from updated `graph-metadata.json` through the repository's advisor rebuild/compiler path; never hand-edit the generated artifact.
- Exercise `.github/workflows/prompt-card-sync.yml`'s sync-check script, `check-prompt-quality-card-sync.sh`, against the new layout.

### Out of Scope
- Lane-C benchmark execution or benchmark-result evaluation - phase 007 owns that work.
- Moving directories, updating the two runtime path-join call sites, or repointing `/deep:model-benchmark` write-target automation - phase 005 owns those atomic structural changes.
- Creating a `prompt-models` slash command - locked decision says `prompt-models` remains advisor-routed and cross-skill-reference only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-opencode/README.md` | Modify | Update prose references from the old flat `sk-prompt-models` skill to the nested `sk-prompt/prompt-models` workflow packet. |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | Update pre-dispatch guidance so small-model prompt-craft routing points at the folded packet. |
| `.opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json` | Modify | Update packet-local permission/example references that name `sk-prompt-models`. |
| `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | Modify | Update prompt-card content for the new `prompt-models` packet path and identity. |
| `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Modify | Update template prose that instructs loading or consulting `sk-prompt-models`. |
| `.opencode/skills/cli-opencode/references/context-budget.md` | Modify | Update context-budget guidance that references small-model prompt-craft lookup. |
| `.opencode/skills/cli-opencode/references/permissions-matrix.md` | Modify | Update permission-matrix documentation for the folded packet. |
| `.opencode/skills/cli-opencode/manual_testing_playbook/prompt-templates/*.md` | Modify | Sweep prompt-template playbook references to the new packet. |
| `.opencode/skills/system-deep-loop/deep-improvement/{SKILL.md,README.md,references/shared/runtime_truth_contracts.md,assets/model_benchmark/benchmark-profiles/reviewer_regression.json}` | Modify | Update deep-improvement and model-benchmark prose references that still name the old skill. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/{01,06,07}--*/*.md` | Modify | Update advisor manual-testing scenarios that mention the old skill identity. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/{14,16}--*/*.md` | Modify | Update spec-kit manual-testing playbook references to the folded prompt packet. |
| `.opencode/skills/README.md` | Modify | Update top-level skill inventory text for the new parent-hub structure. |
| `.opencode/install_guides/README.md` | Modify | Update install-guide references for the folded prompt skill layout. |
| `.opencode/install_guides/SET-UP - AGENTS.md` | Modify | Update setup instructions that still mention `sk-prompt-models`. |
| `AGENTS.md` | Modify | Update root operating guidance that references small-model prompt-craft routing. |
| `README.md` | Modify | Update root project documentation references to the folded prompt skill. |
| `skill-graph.json` generated artifact | Regenerate | Regenerate from the updated hub `graph-metadata.json` through the advisor rebuild/compiler command; do not hand-edit. |
| `.github/workflows/prompt-card-sync.yml` and `check-prompt-quality-card-sync.sh` | Verify | Exercise the CI sync-check path against the new prompt-card layout; no workflow edit is expected unless the check proves the workflow path is stale. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove stale active `sk-prompt-models` references from the phase 006 referrer set. | `grep -rl "sk-prompt-models"` across active paths returns zero hits outside the new `sk-prompt/` packet content and historical spec/changelog text. |
| REQ-002 | Regenerate `skill-graph.json` from source metadata rather than editing it manually. | The advisor graph compiler/rebuild command completes successfully after the hub metadata is updated, and diff review shows `skill-graph.json` changed only as generated output. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Exercise the prompt-card sync CI gate against the new layout. | `check-prompt-quality-card-sync.sh` completes successfully through the same sync-check path guarded by `.github/workflows/prompt-card-sync.yml`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The re-run stale-reference sweep is clean for active files: no `sk-prompt-models` hits remain outside the folded `sk-prompt/` packet and historical spec/changelog text.
- **SC-002**: `skill-graph.json` is regenerated through the advisor rebuild/compiler path, not manually edited.
- **SC-003**: The prompt-card sync check passes against the new `sk-prompt/prompt-models` layout.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005 structural move and runtime path updates | If phase 005 is incomplete, this phase may update prose to paths that do not exist yet. | Confirm the moved packet and functional path updates are present before sweeping prose. |
| Dependency | Advisor rebuild/compiler command | If the compiler path is unavailable, generated graph drift cannot be closed safely. | Stop and inspect the repository's advisor rebuild workflow; do not hand-edit `skill-graph.json`. |
| Risk | Historical references mixed with active operational references | High: a naive global replace could corrupt changelog/spec history or miss active guidance. | Scope the sweep to active files and explicitly allow historical spec/changelog text. |
| Risk | Prompt-card sync script still assumes old layout | Medium: CI can fail after prose updates even if docs look correct. | Run `check-prompt-quality-card-sync.sh` and fix only proven stale sync paths in scope. |
| Risk | Lane-C benchmark work pulled into this phase | Medium: benchmark execution can expand blast radius and obscure the referrer sweep. | Keep benchmark execution and review in phase 007. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Locked decisions and phase boundaries are established by the parent packet context.
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
