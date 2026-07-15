---
title: "Feature Specification: mcp-code-mode changelog verification (017 component 011 phase 006)"
description: "The mcp-code-mode surface has a changelog through v1.0.8.0 and SKILL.md currently declares version 1.0.8.0, while the embedded npm lock metadata separately records 1.0.9. This verify-only phase checks that the completed rename set has an explicit matching changelog entry and version bump without performing any renames."
trigger_phrases:
  - "mcp-code-mode changelog verification"
  - "mcp-code-mode phase 006"
  - "rename changelog version check"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/006-changelog-verify"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verify docs"
    next_safe_action: "Compare the future changelog entry to sibling evidence"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: mcp-code-mode changelog verification

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/006-changelog-verify |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 006 of the 017 mcp-code-mode component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The latest visible mcp-code-mode changelog is v1.0.8.0 and SKILL.md declares 1.0.8.0, but the embedded package-lock metadata declares the npm package version 1.0.9. A filesystem rename set can therefore be documented against the wrong version or omitted entirely unless the skill version source of truth and changelog entry are checked together.

This phase is verify-only. It confirms that a post-migration changelog entry exists, names the actual mcp-code-mode rename set, and matches the declared skill version bump. It performs no renames and does not repair a missing entry.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The mcp-code-mode/changelog directory, the newest entry after v1.0.8.0, and the skill version metadata in SKILL.md.
- Cross-checking the changelog file/heading, version bump, file list, and rename descriptions against phases 001 through 005 evidence.
- Classifying README.md and mcp_server/package-lock.json version values if they differ from the skill release version.

### Out of Scope
- Any filesystem rename, code/script change, changelog repair, or package/version rewrite during this verify phase.
- Rewriting prior changelog history, changing tool/package versions by assumption, or changing identifiers, keys, fields, Python names, or generated metadata.
- The rollup naming census and sibling completion aggregation owned by phase 007.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A post-migration changelog entry exists | A new entry after v1.0.8.0 is present with a file/heading version and release date |
| REQ-002 | The entry matches the actual rename set | It names the mcp-server closure, script result, references/assets files, runtime result, and manual-playbook tree result exactly as evidenced by sibling phases |
| REQ-003 | The version bump is explicit and coherent | SKILL.md and the changelog entry agree on the skill release version; README.md and package-lock.json differences have an explicit separate disposition |
| REQ-004 | Historical changelog records remain frozen | Existing entries through v1.0.8.0 are unchanged and no old path is rewritten in frozen history |
| REQ-005 | This phase performs verification only | The phase report shows no rename or code mutation and fails the gate when the required entry or version evidence is absent |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The changelog contains a versioned entry that accurately describes the completed mcp-code-mode rename set.
- **SC-002**: The skill release version, changelog heading, and sibling evidence are consistent without conflating npm package metadata.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is a plausible but incomplete release note: the entry may mention only the visible reference files and omit
the package or manual-playbook closures. This phase depends on all five preceding child reports and a clean comparison
against the pinned rename maps; it intentionally fails closed when the changelog is missing or version ownership is unclear.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; the phase report must identify the skill release version source of truth before accepting the entry.
<!-- /ANCHOR:questions -->
