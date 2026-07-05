---
title: "Feature Specification: Phase 13 sk-code two-axis restructure"
description: "Restructure sk-code into a two-axis parent hub with five workflow modes and three read-only surface evidence packets, folding code-review into review and reconciling registry/router vocabulary."
trigger_phrases:
  - "sk-code two-axis restructure"
  - "sk-code surface packets"
  - "code-review fold into review"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/013-sk-code-two-axis-restructure"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled strict Level 2 spec documentation for the shipped two-axis restructure."
    next_safe_action: "Use as phase record; phase 014 owns deferred close-out"
---
# Feature Specification: Phase 13 sk-code two-axis restructure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-05 |
| **Branch** | `remote 028` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 124 cutover merged the sk-code parent hub with a workflow-only decomposition: implement, quality, debug, verify, and review. Surface evidence for Webflow frontend work, OpenCode system code, and Motion.dev animation remained scattered across workflow packets, and the parent hub vocabulary sync was red with 13 orphan aliases, 4 collisions, and 1 ownership drift.

### Purpose
Make sk-code a two-axis parent hub. Workflow modes continue to act, while read-only surface packets carry domain evidence and can be bundled alongside workflow modes without becoming advisor-routable modes themselves.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move whole directories into three read-only surface packets: `webflow/`, `opencode/`, and `animation/`.
- Fold `code-review` into `review` and repoint rename-affected contracts in the same commit.
- Convert `mode-registry.json` to the two-axis model with `packetKind`, three surface entries, and `extensions.surface-axis`.
- Update `hub-router.json` with surface router signals, owned vocabulary classes, `outcomes.surfaceBundle`, and full tie-break behavior.
- Normalize `smart_routing.md` paths and update router replay and sync guards for the new surface layout.
- Repair move-broken relative links and update hub documentation/version metadata to `4.1.0.0`.

### Out of Scope
- Canonical memory or skill-graph reindexing.
- Lane-C fresh baseline and playbook gold re-derivation.
- Any follow-up parent roll-up beyond recording this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/mode-registry.json` | Update | Two-axis registry with workflow and surface packet kinds |
| `.opencode/skills/sk-code/hub-router.json` | Update | Surface routing signals, vocabulary ownership, bundle outcome, tie-breaks |
| `.opencode/skills/sk-code/shared/references/smart_routing.md` | Update | Hub-root-relative packet-qualified resource paths |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Update | Surface prefixes, surface layout detection, asset deferral, language-slice matching |
| `.opencode/skills/sk-code/webflow/` | Create | Read-only Webflow surface evidence packet |
| `.opencode/skills/sk-code/opencode/` | Create | Read-only OpenCode surface evidence packet |
| `.opencode/skills/sk-code/animation/` | Create | Read-only Motion.dev surface evidence packet |
| `.opencode/skills/sk-code/review/` | Rename | Folded review workflow packet from `code-review` |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | sk-code exposes a two-axis hub model | Registry contains five workflow modes and three read-only surface entries with `packetKind` and `extensions.surface-axis` |
| REQ-002 | Surface vocabulary is owned cleanly | `parent-hub-vocab-sync` reports 0 orphan aliases, 0 collisions, and 0 ownership drift |
| REQ-003 | Surface evidence moves preserve routing | Router replay for `review my webflow animation` resolves `[review, webflow, animation]` with `missingResources: 0` |
| REQ-004 | Review rename is consistently repointed | CI, deep-review agents, prompt pack, rule-copy scripts/tests, sk-doc schema docs, and speckit YAMLs no longer speak the old live contract |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Moved links are repaired | Reverse-move resolver repairs 298 move-broken links and sk-code tree reports 0 broken links |
| REQ-006 | Parent skill checks remain clean | `parent-skill-check` passes default and strict, with strict reporting 23/23 pass |
| REQ-007 | Router and vocabulary sync tests pass | Vocab-sync and router-sync vitests pass 9/9 |
| REQ-008 | Hub docs reflect the new version | Hub SKILL, README, description, and graph metadata point at version `4.1.0.0` |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Shipped commit `90e8833411` contains the combined restructure, wiring, review rename, and link repair.
- **SC-002**: `parent-hub-vocab-sync` flips from 13 orphan aliases, 4 collisions, and 1 ownership drift to 0, 0, and 0.
- **SC-003**: `parent-skill-check` passes in default mode and strict mode with 23/23 strict checks green.
- **SC-004**: Router replay confirms the two-axis bundle for `review my webflow animation` with `missingResources: 0`.

### Acceptance Scenarios

- **Scenario 1**: **Given** a review prompt mentions Webflow and animation, **when** router replay runs, **then** the workflow mode is `review` and the surface bundle contains `webflow` and `animation`.
- **Scenario 2**: **Given** the moved surface packets exist, **when** link integrity runs across sk-code, **then** no moved-path broken links remain.
- **Scenario 3**: **Given** strict parent-skill checking runs, **when** all six strict gaps are closed, **then** strict mode reports 23/23 pass.
- **Scenario 4**: **Given** the review rename landed, **when** rename-affected contracts are checked, **then** the rule-copy check and its test pass.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Parent hub registry/router contracts | Two-axis dispatch could drift if registry and router disagree | Updated both in one commit and verified with vocab/router sync tests |
| Dependency | Relative markdown links after renames | Moved evidence packets could carry stale paths | Repaired 298 move-broken links with reverse-move resolver and checked for 0 broken links |
| Risk | Review rename consumers | CI, agents, templates, or schema docs could still reference old live paths | Repointed named consumers and ran rule-copy checks |
| Risk | Reindex deferred to phase 014 | Advisor graph data can lag the shipped filesystem | Deterministic router gates proved local routing; reindex is explicitly deferred |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Router replay must resolve the two-axis bundle without missing resources.

### Security
- **NFR-S01**: Surface packets remain read-only evidence bases with allowed tools limited to Read, Bash, Grep, and Glob.

### Reliability
- **NFR-R01**: Parent skill checks, vocab sync, router sync, link integrity, and rule-copy checks must all pass before the commit is considered shipped.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Surface aliases must belong to the surface packets, not the implement workflow.
- `opencode` language-slice routing must still recognize language-oriented evidence under the new surface layout.

### Error Scenarios
- Broken relative links after directory moves must resolve to 0 before completion.
- Live `code-review` contract references outside acceptable historical docs would fail the rename repoint requirement.

### Concurrent Operations
- Canonical reindex and Lane-C re-baseline were left to phase 014 because they are add-only follow-up work and the daemon or branch state was not safe for this phase.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 24/25 | Largest phase, 200 files and 148 renames |
| Risk | 18/25 | Routing, vocabulary ownership, rename consumers, and link integrity |
| Research | 12/20 | Mechanical restructure with known target architecture and strong deterministic gates |
| **Total** | **54/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None for this shipped phase. Phase 014 owns gated reindex, Lane-C re-baseline, worktree decision, and parent roll-up.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->
