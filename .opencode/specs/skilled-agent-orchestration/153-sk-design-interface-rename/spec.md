---
title: "Feature Specification: Rename sk-interface-design skill to sk-design-interface across the framework [template:level_2/spec.md]"
description: "The sk-interface-design judgment skill predates the emerging sk-design-* family; its name is inconsistent with sibling design skills and the new sk-design-md-generator. Rename it to sk-design-interface and repair every live reference plus the advisor skill-graph."
trigger_phrases:
  - "rename sk-interface-design"
  - "sk-design-interface"
  - "skill rename"
  - "design skill family"
  - "skill-graph rebuild"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/153-sk-design-interface-rename"
    last_updated_at: "2026-06-21T09:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed rename and graph rebuild"
    next_safe_action: "Verify packet 153 closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/graph-metadata.json"
      - ".opencode/changelog/sk-design-interface"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-153-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Numbering: generator=152, rename=153 (151 reserved for kasper)"
      - "Breadth: rewrite history too, with full pointer reconciliation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rename sk-interface-design skill to sk-design-interface across the framework

<!-- SPECKIT_LEVEL: 2 -->
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
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-21 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The interface-design judgment skill is named `sk-interface-design`, which predates the `sk-design-*` family now forming around the new `sk-design-md-generator` skill. The inconsistent name makes the design family harder to discover and reason about, and it is a load-bearing co-load dependency (`mcp-open-design`, `mcp-figma`) whose identity is duplicated across the binary advisor graph, cross-skill mandates, root indexes, the spec registry, and historical packet folders.

### Purpose
Rename the skill to `sk-design-interface` everywhere — filesystem, internal metadata, reciprocal graph edges, cross-skill prose, root/index docs, historical spec records, and the rebuilt `skill-graph.sqlite` — so no live reference speaks the old name and advisor routing resolves the new identity.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Filesystem rename of the skill directory and its changelog symlink (history-preserving `git mv`).
- Internal identity updates: `SKILL.md` name/heading, `README.md` title, `graph-metadata.json` (`skill_id`, `key_files[]`, `entities`, `causal_summary`), feature_catalog, manual_testing_playbook, references.
- Reciprocal sibling graph edges in `mcp-open-design`, `mcp-figma`, `sk-code` graph-metadata (updated BEFORE the graph rebuild).
- Cross-skill live prose: `mcp-open-design`, `mcp-figma`, `sk-prompt`.
- Root and index docs: `/README.md`, `.opencode/skills/README.md`.
- History rewrite (user-elected): rename historical packet folder `143-sk-interface-design` (+ child folders embedding the old slug), reconcile pointers, global string-replace across `.opencode/specs/**` prose and `descriptions.json`.
- Skill-graph rebuild (`skill_graph_scan`) + validation.

### Out of Scope
- Any behavior/content change to the skill itself — this is a pure rename, no capability change.
- `node_modules/` and `dist/` build artifacts — they regenerate and are excluded from verification greps.
- The reserved `151-deep-loop-kasper-based-refinement` slot — untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-interface-design/` | Modify (move) | Directory → `sk-design-interface/` + internal identity edits |
| `.opencode/changelog/sk-interface-design` | Modify (move) | Symlink rename + retargeted to new path |
| `.opencode/skills/{mcp-open-design,mcp-figma,sk-code}/graph-metadata.json` | Modify | Reciprocal edge target strings |
| `.opencode/skills/{mcp-open-design,mcp-figma,sk-prompt}/**` | Modify | Cross-skill co-load prose |
| `/README.md`, `.opencode/skills/README.md` | Modify | Skill index name + link path |
| `.opencode/specs/skilled-agent-orchestration/143-sk-interface-design/` | Modify (move) | Historical packet rename + pointer reconcile |
| `.opencode/specs/descriptions.json` | Modify | Spec registry names/paths/topics |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Skill renamed on disk with `skill_id` matching the new folder basename | `skill-graph-db` folder-name guard does not throw; `ls .opencode/skills/sk-design-interface/` exists; old dir absent |
| REQ-002 | Reciprocal sibling edges updated before rebuild | Post-rebuild `skill_edges` shows 6 edges mirroring the pre-rename set with target `sk-design-interface`; zero UNKNOWN-TARGET drops |
| REQ-003 | Skill-graph rebuilt and re-registered | `skill_nodes` contains `sk-design-interface`, not `sk-interface-design`; `advisor_recommend` on a design prompt returns the new id |
| REQ-004 | Zero live references to the old name | `rg "sk-interface-design"` excluding `node_modules`/`dist` returns no live (non-archival, intentional-quote) hits |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Changelog symlink retargeted and resolvable | `readlink` → `../skills/sk-design-interface/changelog`; target exists |
| REQ-006 | History rewrite with pointer integrity | Renamed historical folders have reconciled `packet_id`/`spec_folder`/`children_ids`/`packet_pointer`; `descriptions.json` consistent; spec-graph validates |
| REQ-007 | Cross-skill co-load mandates corrected | `mcp-open-design` GATE / banners and `mcp-figma` handoff prose name `sk-design-interface` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg "sk-interface-design"` (excluding `node_modules`, `dist`) returns zero live hits.
- **SC-002**: `skill-graph.sqlite` holds node `sk-design-interface` with its 6 reciprocal edges intact; old node absent.
- **SC-003**: `advisor_recommend` on "make this hero not look templated" returns `sk-design-interface` as the top design-judgment candidate.
- **SC-004**: `validate.sh --strict` passes on every touched spec folder; `skill_graph_validate` + `advisor_validate` pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Silent edge drop on rebuild (unknown-target) | High — loses co-load routing | Update reciprocal sibling edges BEFORE `skill_graph_scan`; verify edge count after |
| Risk | History-rewrite pointer drift (children_ids/packet_pointer/descriptions.json desync) | Med — breaks spec graph | Reconcile every pointer per renamed folder; validate spec graph |
| Risk | Dangling changelog symlink | Med — breaks changelog tooling | Recreate symlink with new relative target; `readlink` check |
| Dependency | Advisor daemon + `skill-graph.sqlite` | Stale routing until rebuilt | `advisor_status` re-check post-rebuild; recycle owner / fresh session if old id persists |
| Risk | Shared git index (concurrent sessions) | Med — accidental cross-session commit | Content-based verification, no broad commits; scoped `git commit --only -- <paths>` only when asked |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Skill-graph rebuild completes within the advisor scan budget (no daemon timeout).
- **NFR-P02**: Rename introduces no new runtime cost — identity-only change.

### Security
- **NFR-S01**: Skill-graph mutation runs trusted (`requireTrustedCaller`); no untrusted scan path used.
- **NFR-S02**: No secrets touched; rename is filesystem + metadata only.

### Reliability
- **NFR-R01**: Reversible via git (all changes tracked); rollback documented in plan.
- **NFR-R02**: Post-rename routing parity — design prompts resolve as before the rename.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: N/A — deterministic refactor, no user input.
- Maximum length: N/A.
- Invalid format: graph-metadata `skill_id` ≠ folder basename → scan throws; guarded by atomic dir+id edit.

### Error Scenarios
- External service failure: advisor daemon cold → `skill_graph_scan` warm-spawns it; CLI fallback exit 75 is retryable.
- Network timeout: N/A (local).
- Concurrent access: shared git index across sessions → scoped staging only.

### State Transitions
- Partial completion: rename half-applied → `rg` still finds old name; re-run remaining edits before rebuild.
- Session expiry: continuity ladder in `implementation-summary.md` records progress for resume.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | ~100 live files + ~1900 historical mentions, binary graph rebuild |
| Risk | 16/25 | Silent edge drop + pointer drift; both mitigated and verifiable |
| Research | 8/20 | Procedure pre-verified against daemon/dist/sqlite |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None — numbering and breadth resolved with the user (generator=152, rename=153; rewrite history with pointer reconciliation).
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
