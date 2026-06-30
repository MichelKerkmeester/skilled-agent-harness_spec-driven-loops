---
title: "Feature Specification: mcp-magicpath deprecation"
description: "Now that mcp-open-design drives the installed Open Design app from the terminal, the older mcp-magicpath skill that drove the hosted MagicPath canvas is superseded. Deprecate it completely, remove every live reference, and re-center the shared design protocol on mcp-open-design."
trigger_phrases:
  - "mcp-magicpath deprecation"
  - "deprecate magicpath skill"
  - "magicpath superseded by open design"
  - "re-center design protocol on mcp-open-design"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/008-mcp-magicpath-deprecation"
    last_updated_at: "2026-06-14T17:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Deprecated mcp-magicpath and re-centered the design protocol on mcp-open-design"
    next_safe_action: "Operator reviews the deprecation and the four skill version bumps"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-150-008-mcp-magicpath-deprecation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: mcp-magicpath deprecation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mcp-magicpath` skill drives the hosted MagicPath canvas through the `magicpath-ai` CLI. Spec 150 built `mcp-open-design`, which drives the installed Open Design desktop app from the terminal. That skill was live-verified in phase 004 and corrected to the real multi-turn flow in phase 007. With a terminal-native design transport now in place, `mcp-magicpath` is superseded. Leaving it live splits the shared design protocol across two transports and leaves stale sibling edges and references pointing at a tool the system no longer routes to.

### Purpose
Deprecate `mcp-magicpath` completely. Remove the skill folder, rewrite the two shared design docs onto the `mcp-open-design` mechanism, sweep every remaining live reference across the design and prompt skills plus the skills index, drop the reciprocal graph sibling edges, and mark the original install packet superseded. Historical records stay intact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the whole `mcp-magicpath` skill folder (16 files).
- Rewrite `sk-design-interface/references/claude_design_parity.md` so the parity protocol's two members are sk-design-interface (judgment) and mcp-open-design (Open Design terminal transport), with the fidelity check moved onto mcp-open-design's real `previewUrl` and `get_artifact`, and bump sk-design-interface v1.2.0 to v1.3.0 with a changelog.
- Rewrite `sk-prompt/references/design_generation_patterns.md` to cover only the `mcp-open-design` start_run usecase, dropping the MagicPath canvas-authoring usecase, and bump sk-prompt v2.2.0 to v2.3.0 with a changelog.
- Sweep remaining live references across sk-design-interface, sk-prompt, mcp-open-design (bump v1.1.0 to v1.2.0 with a changelog), mcp-figma, and the skills index `.opencode/skills/README.md`.
- Remove the reciprocal graph sibling edges between mcp-magicpath and the other skills, repointing mcp-figma's sibling language to mcp-open-design.
- Mark the original install packet `147-mcp-magicpath` superseded by spec 150.

### Out of Scope
- The skill-advisor `skill-graph.sqlite` rescan to drop the mcp-magicpath node. This is deferred maintenance, run later.
- Any change to the MagicPath product or the `magicpath-ai` CLI itself.
- Historical records: spec 142 references and the skills' historical changelog entries that mention magicpath stay as written. History is not rewritten.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-magicpath/` | Delete | The whole skill folder, all 16 files |
| `.opencode/skills/sk-design-interface/references/claude_design_parity.md` | Modify | Two-member parity onto mcp-open-design, fidelity check on previewUrl and get_artifact |
| `.opencode/skills/sk-design-interface/SKILL.md` | Modify | Drop magicpath references, bump version to 1.3.0 |
| `.opencode/skills/sk-design-interface/README.md` | Modify | Drop magicpath references |
| `.opencode/skills/sk-design-interface/feature_catalog/` | Modify | Drop live magicpath references |
| `.opencode/skills/sk-design-interface/manual_testing_playbook/` | Modify | Drop live magicpath references |
| `.opencode/skills/sk-design-interface/references/design_inventory.md` | Modify | Drop live magicpath references |
| `.opencode/skills/sk-design-interface/graph-metadata.json` | Modify | Drop the magicpath sibling edge, add changelog entry |
| `.opencode/skills/sk-design-interface/changelog/v1.3.0.0.md` | Create | Deprecation and re-centering changelog |
| `.opencode/skills/sk-prompt/references/design_generation_patterns.md` | Modify | mcp-open-design start_run usecase only |
| `.opencode/skills/sk-prompt/SKILL.md` | Modify | Drop magicpath references, bump version to 2.3.0 |
| `.opencode/skills/sk-prompt/README.md` | Modify | Drop magicpath references |
| `.opencode/skills/sk-prompt/changelog/v2.3.0.0.md` | Create | Drop-magicpath-usecase changelog |
| `.opencode/skills/mcp-open-design/SKILL.md` | Modify | Drop magicpath mentions, bump version to 1.2.0 |
| `.opencode/skills/mcp-open-design/README.md` | Modify | Drop magicpath mentions |
| `.opencode/skills/mcp-open-design/graph-metadata.json` | Modify | Drop the magicpath sibling edge, add changelog entry |
| `.opencode/skills/mcp-open-design/changelog/v1.2.0.0.md` | Create | Magicpath-deprecation reference changelog |
| `.opencode/skills/mcp-figma/SKILL.md` | Modify | Repoint the sibling language from magicpath to mcp-open-design |
| `.opencode/skills/mcp-figma/README.md` | Modify | Repoint the sibling language from magicpath to mcp-open-design |
| `.opencode/skills/mcp-figma/graph-metadata.json` | Modify | Drop the magicpath sibling edge, repoint to mcp-open-design |
| `.opencode/skills/README.md` | Modify | Drop the mcp-magicpath index entry |
| `.opencode/specs/skilled-agent-orchestration/147-mcp-magicpath/spec.md` | Modify | Mark superseded by spec 150 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The mcp-magicpath skill folder is removed | `.opencode/skills/mcp-magicpath/` no longer exists and none of its 16 files remain |
| REQ-002 | The parity protocol re-centers on mcp-open-design | `claude_design_parity.md` names sk-design-interface and mcp-open-design as the two members, with the fidelity check on the real `previewUrl` and `get_artifact`, and carries no live magicpath mechanism |
| REQ-003 | The sk-prompt design pattern covers only mcp-open-design | `design_generation_patterns.md` documents the `mcp-open-design` start_run usecase and no longer documents the MagicPath canvas-authoring usecase |
| REQ-004 | No live reference to mcp-magicpath remains | A grep across the design and prompt skills plus the skills index finds no live routing, sibling edge, or how-to reference to mcp-magicpath, only historical records |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Reciprocal graph sibling edges removed | mcp-magicpath sibling edges are dropped from sk-design-interface, mcp-open-design, and mcp-figma graph-metadata, and mcp-figma's sibling language repoints to mcp-open-design |
| REQ-006 | The four affected skills are version-bumped with changelogs | sk-design-interface v1.3.0, sk-prompt v2.3.0, and mcp-open-design v1.2.0 each have a matching changelog file |
| REQ-007 | The original install packet is marked superseded | `147-mcp-magicpath/spec.md` records that spec 150 supersedes it |
| REQ-008 | Historical records preserved | Spec 142 references and the skills' historical changelog entries that mention magicpath are unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.opencode/skills/mcp-magicpath/` is gone and `package_skill.py --check` PASS on each of the three bumped skills.
- **SC-002**: `validate.sh` on this folder with `--strict` reports zero errors.
- **SC-003**: A grep across the design and prompt skills plus the skills index finds no live mcp-magicpath reference, with only historical changelog and spec-142 mentions left.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A live magicpath reference is left behind in a swept doc | High | Grep every magicpath mention across the skills and classify each as live or historical before deleting |
| Risk | The advisor graph still lists the dead mcp-magicpath node | Low | The graph edges are dropped in metadata now, and the sqlite rescan is documented as a deferred follow-up |
| Risk | A version bump misses its changelog | Low | Each bumped skill gets a matching changelog file checked by `package_skill.py --check` |
| Dependency | mcp-open-design is the live design transport | Medium | Built in phase 002, live-verified in 004, corrected in 007, so the re-centering target is proven |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Safety
- **NFR-S01**: The deletion is documentation and skill-metadata only, with no runtime or data state to unwind, and the MagicPath product itself is untouched.

### Consistency
- **NFR-C01**: House voice holds across all edits, with no em dashes and no prose semicolons in new prose.

### Accuracy
- **NFR-A01**: Each swept reference is classified live or historical before action, so a reader can tell a removed routing path from a preserved history note.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Reference boundaries
- A magicpath mention inside a historical changelog entry: preserved, history is not rewritten.
- A magicpath mention inside an active SKILL.md routing table: removed, it is a live reference.

### Graph boundaries
- A sibling edge from a skill to mcp-magicpath: dropped, and mcp-figma's edge repoints to mcp-open-design.
- The skill-advisor sqlite still holding the mcp-magicpath node: out of scope, deferred to a later rescan.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One folder deleted plus references swept across five skills and the index |
| Risk | 7/25 | Reversible, but a missed live reference would leave a dangling route |
| Research | 4/20 | The superseding transport is already proven, so this is a removal and re-centering |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The superseding transport is proven and the deprecation scope is fixed.
<!-- /ANCHOR:questions -->
