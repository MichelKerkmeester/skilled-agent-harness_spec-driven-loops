---
title: "Feature Specification: Phase 6: standalone-conversion"
description: "Flip the sk-prompt root from a parent hub to a standalone routed-resource skill and flatten the surviving packet into it, keeping the name and the command."
trigger_phrases:
  - "008 phase 006"
  - "sk-prompt standalone-conversion"
  - "standalone-conversion"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: standalone-conversion

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
| **Phase** | 6 of 8 |
| **Predecessor** | 005-cli-orchestration-repoint |
| **Successor** | 007-compiled-routing-withdrawal |
| **Handoff Criteria** | The fleet metadata gate reports 14 of 14 roots passing with `sk-prompt` classified `[S]` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the sk-prompt standalone conversion.

**Scope Boundary**: Renaming the skill; the name is retained deliberately

**Dependencies**:
- The metadata contract's file matrix defines the target set; it was read rather than inferred.
- Existing standalone skills that own commands establish that a command survives without a command-metadata file.

**Deliverables**:
- Flatten the surviving packet's contents into the skill root
- Delete the four class-forbidden metadata files and the stage-two router
- Author the standalone manifest config and regenerate both derived manifests

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
With one workflow packet left, the hub shape is pure overhead: four authored routing files, a stage-two router document and a nested packet directory all describe a dispatch decision with a single possible answer. The metadata contract forbids exactly those files on a standalone root, so the class change is not cosmetic - the gate rejects a root that declares half a hub.

### Purpose
`sk-prompt` classifies as a standalone routed-resource skill, keeps its name and its `/prompt:improve` command, and its references, assets and playbook sit at the root as the routed corpus.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Flatten the surviving packet's contents into the skill root
- Delete the four class-forbidden metadata files and the stage-two router
- Author the standalone manifest config and regenerate both derived manifests
- Rewrite the skill frontmatter, README and advisor metadata for a single-mode identity
- Repoint the command's workflow assets at the flattened paths

### Out of Scope
- Renaming the skill; the name is retained deliberately
- Removing the command; it survives the class change
- Compiled-routing withdrawal, owned by the next phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-prompt-improve/**` | Modify | Flattened into the skill root by `git mv` to preserve history |
| `{mode-registry,hub-router,description,command-metadata}.json` | Delete | Forbidden on a standalone root |
| `ROUTER.md` | Delete | Stage-two hub control document |
| `leaf-manifest.config.json` | Create | Required on a standalone root |
| `leaf-manifest.json`, `leaf-aliases.json` | Modify | Regenerated for the single-mode root |
| `graph-metadata.json` | Modify | Family, domains, triggers, entities and causal summary rewritten |
| `feature-catalog/**` | Delete | Documented only the hub routing that no longer exists |
| `.opencode/commands/prompt/**` | Modify | Repoint the workflow assets at the flattened skill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The root classifies as a standalone skill with no forbidden files | The fleet metadata gate reports `[S] sk-prompt` and exits 0 |
| REQ-002 | Both derived manifests regenerate byte-identically | The gate's freshness comparison passes with no pending fix |
| REQ-003 | The advisor metadata is valid for a single-mode identity | The skill-graph compiler reports validation passed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The command still resolves its skill | No command asset references the pre-flatten packet path |
| REQ-005 | No document links into the removed packet directory | The link-integrity guard reports 0 broken links |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The fleet metadata gate reports 14 of 14 roots passing with `sk-prompt` classified `[S]`
- **SC-002**: `/prompt:improve` survives the class change without a command-metadata file, matching the precedent of the other standalone skills that own commands
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `git rm` removes a directory once its last file is gone | A following `git mv` fails because its destination vanished | Hit twice; recreated the destination before moving, and restored the un-moved files from HEAD rather than reconstructing them |
| Risk | Flattening collides on same-named files | History or content silently lost | Resolved per pair on which copy the surviving skill should carry, with the engine's own changelog and documents kept |
| Dependency | The metadata gate defines the required and forbidden set by class | A half-declared root is rejected outright | Followed the contract's file matrix exactly and ran the gate after each structural step |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None; the phase closed against its recorded acceptance checks.
<!-- /ANCHOR:questions -->
