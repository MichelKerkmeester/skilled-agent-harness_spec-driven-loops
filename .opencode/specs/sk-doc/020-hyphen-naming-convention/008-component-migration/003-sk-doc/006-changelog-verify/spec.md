---
title: "Feature Specification: sk-doc changelog and version verification"
description: "The sk-doc component migration needs a changelog entry that names the completed rename set and records the corresponding four-part version bump. This verification phase performs no filesystem renames; it checks the released changelog evidence against the sibling phase manifests and the current skill version contract."
trigger_phrases:
  - "sk-doc changelog verification"
  - "sk-doc version bump check"
  - "020 changelog verify phase"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/006-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/006-changelog-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verify docs"
    next_safe_action: "Verify the migration changelog entry"
    blockers: []
    key_files: [".opencode/skills/sk-doc/changelog/", ".opencode/skills/sk-doc/SKILL.md"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: sk-doc changelog and version verification
> Phase adjacency — predecessor `005-benchmark`; successor `007-skill-gate`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/006-changelog-verify` |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 006 of the sk-doc component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sk-doc changelog currently has historical four-part entries through `v1.8.1.0`, while `SKILL.md` declares a newer version anchor. After the rename phases execute, the component needs one release entry that describes the actual kebab-case migration and records the version selected by the existing create-changelog rules. A rename phase must not be accepted on changelog prose alone, and this phase must not perform the rename.

The outcome is a blocking evidence check that the new changelog entry exists, names the completed sk-doc rename set, uses a greater four-part version, and agrees with the skill's declared version.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Verify a new `.opencode/skills/sk-doc/changelog/v<VERSION>.md` entry exists after the sibling migration phases.
- Verify the entry names the hub/shared, scripts, create-packet, manual-testing-playbook, benchmark, and verification work covered by this subtree.
- Verify `<VERSION>` is a valid four-part version greater than baseline `v1.8.1.0` and matches the post-migration `SKILL.md` version anchor.
- Verify the entry's file/path references and migration notes match the phase manifests without claiming unperformed work.

### Out of Scope

- Renaming any filesystem path, editing `SKILL.md`, or creating the changelog entry during this authoring pass.
- Rewriting historical changelog entries or changing version semantics owned by create-changelog.
- Verifying changelog entries for other skills or packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/changelog/v<VERSION>.md` | Verify | Confirm the migration entry and version bump after execution |
| `.opencode/skills/sk-doc/SKILL.md` | Read/compare | Confirm the declared version anchor agrees with the entry |
| `006-changelog-verify/` | Documentation only | Store the verification contract; no release file is created here |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A migration changelog entry exists | One new four-part versioned entry is present under the sk-doc changelog root |
| REQ-002 | The entry matches the completed rename set | It names the hub/shared, scripts, create-packet, root playbook, benchmark, and gate evidence without inventing scope |
| REQ-003 | The version bump is valid and synchronized | Version is greater than `v1.8.1.0`, matches four-part format, and agrees with post-migration `SKILL.md` |
| REQ-004 | Changelog paths and notes are accurate | Every cited target path exists and no old path is presented as live |
| REQ-005 | This phase performs no migration | The phase diff contains only documentation authored for this packet |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A versioned sk-doc changelog entry accurately records the completed naming work.
- **SC-002**: Changelog and `SKILL.md` version evidence agree without modifying historical entries.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Sibling phase reports | Entry may omit a completed component | Compare each direct/nested checklist and manifest |
| Risk | Version anchor and latest changelog disagree | Release cannot be reproduced | Pin both values and apply create-changelog version rules |
| Risk | Historical entry is edited instead of appended | Frozen history is corrupted | Require a new versioned file and leave old entries unchanged |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The execution report must record the exact resolved version rather than assuming a target number in this planning document.
<!-- /ANCHOR:questions -->
