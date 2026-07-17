---
title: "Feature Specification: mcp-tooling changelog verification (032 phase 007)"
description: "The mcp-tooling changelog history predates the 032 kebab-case rename set and currently has no verified append-only entry for the hub/component filesystem migration. This verification phase checks the root and component changelog version bumps, scope descriptions, exemption notes, and history preservation without performing any rename."
trigger_phrases:
  - "mcp-tooling changelog verify"
  - "mcp tooling naming version bump"
  - "032 mcp tooling phase 007"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/007-changelog-verify"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored phase 007 as a read-only changelog gate"
    next_safe_action: "Verify append-only entries and expected version bumps after migration phases"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/changelog/"
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/changelog/"
      - ".opencode/skills/mcp-tooling/mcp-click-up/changelog/"
      - ".opencode/skills/mcp-tooling/mcp-figma/changelog/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: mcp-tooling Changelog Verification

> Phase adjacency under the 006-mcp-tooling parent: predecessor 006-benchmark; successor 008-skill-gate.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/007-changelog-verify |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 007 of the mcp-tooling component naming migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The existing root and component changelog files describe earlier releases and the parent-hub fold, but they do not yet provide evidence that the 032 naming migration was recorded as an append-only release. The verifier must also distinguish a new migration entry from edits to frozen history and confirm that the version bump matches the affected packet.

This phase reads the latest changelog entries, verifies the migration scope and exemption boundary, and blocks the subtree if the required append-only version entries are absent or inconsistent. It performs no filesystem rename.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The root mcp-tooling changelog and the latest changelog for mcp-chrome-devtools, mcp-click-up, and mcp-figma.
- Expected next versions based on the current baseline: root v1.0.1.0, Chrome v1.0.9.0, ClickUp v1.0.1.0, and Figma v1.0.1.0.
- The append-only entry content: the hub/component rename surfaces, reference repair, preserved tool/Python exemptions, and benchmark zero-candidate result.
- Verification that prior changelog entries remain unchanged.

### Out of Scope
- Any filesystem rename, reference rewrite, code change, or changelog-history rewrite.
- Inventing a changelog entry when the migration evidence is missing; a missing entry is a blocking finding for the owner of the preceding phase.
- Version changes unrelated to the mcp-tooling naming migration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/mcp-tooling/changelog/ | Read | Verify the new root entry follows v1.0.0.0 without rewriting it |
| .opencode/skills/mcp-tooling/mcp-chrome-devtools/changelog/ | Read | Verify the new component entry follows v1.0.8.0 |
| .opencode/skills/mcp-tooling/mcp-click-up/changelog/ | Read | Verify the new component entry follows v1.0.0.0 |
| .opencode/skills/mcp-tooling/mcp-figma/changelog/ | Read | Verify the new component entry follows v1.0.0.0 |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Verify root and component version bumps | The latest entries are root v1.0.1.0, Chrome v1.0.9.0, ClickUp v1.0.1.0, and Figma v1.0.1.0, each following the current latest version |
| REQ-002 | Verify migration scope is recorded | Entries identify hub/shared, Chrome, ClickUp, Figma, hub playbook, benchmark, and reference closure as applicable |
| REQ-003 | Verify exemptions are recorded | Entries state that tool-mandated names, Python files/package directories, keys/fields, generated output, and frozen history were preserved |
| REQ-004 | Preserve changelog history | Existing v1.0.0.0 and prior component entries are byte-for-byte unchanged; the migration record is append-only |
| REQ-005 | Confirm verification-only behavior | The candidate diff contains no filesystem rename or non-changelog migration change from phase 007 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every impacted mcp-tooling changelog has a matching append-only migration entry and version bump.
- **SC-002**: The entries accurately describe the rename set, zero-candidate benchmark condition, and exemptions.
- **SC-003**: No rename or history rewrite is performed by the verification phase.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The primary risk is accepting a generic release note that does not prove the actual mcp-tooling surfaces or version increments. The checklist therefore pins each expected file/version pair and checks the entry against the phase map. A missing entry blocks this phase rather than being silently repaired here.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The expected next versions are derived from the latest changelog files present in the current surface census.
<!-- /ANCHOR:questions -->
