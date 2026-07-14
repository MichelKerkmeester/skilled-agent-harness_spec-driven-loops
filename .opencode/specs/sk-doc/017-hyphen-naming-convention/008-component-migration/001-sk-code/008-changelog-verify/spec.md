---
title: "Feature Specification: sk-code changelog verification (017 phase 008/008)"
description: "The sk-code rename set needs an auditable changelog entry and a consistent version bump after the component phases land. This verification-only phase checks the changelog, SKILL.md, README.md, and hub metadata against the actual rename evidence and performs no filesystem renames."
trigger_phrases:
  - "sk-code changelog verification"
  - "kebab-case migration changelog"
  - "sk-code version bump check"
  - "rename set release note"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/008-changelog-verify"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verification spec"
    next_safe_action: "Verify the sk-code changelog entry and version bump"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/changelog/"
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/README.md"
      - ".opencode/skills/sk-code/description.json"
      - ".opencode/skills/sk-code/graph-metadata.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This child performs verification only; it performs no filesystem rename."
      - "The changelog entry must describe the actual 001-007 rename set and exemption boundary."
      - "The selected post-migration version must be greater than the BASE version and consistent across the declared version surfaces."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-code changelog verification

> Phase adjacency under the sk-code component parent: predecessor 007-benchmark; successor 009-skill-gate.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/008-changelog-verify |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-code |
| **Origin** | Verification-only phase 008 of the sk-code component migration under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The current sk-code release history is versioned, and the current hub reports version 4.1.0.0 in SKILL.md and README.md, but a completed naming migration needs an explicit release record that can be compared with the actual component evidence. Without this check, the subtree can be physically migrated while the public changelog omits the rename set, exemptions, reference repair, or version change.

### Purpose

Verify that the sk-code changelog contains a release entry for the completed rename set and version bump, that the entry matches the evidence from phases 001-007, and that every declared version surface is internally consistent without performing any rename.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Read the existing .opencode/skills/sk-code/changelog/ entries and identify the new append-only entry for the naming migration.
- Compare the changelog's affected-surface list with the phase 001-007 handoffs: hub/shared, code-opencode, code-quality, code-review, code-webflow, hub playbook, and benchmark storage.
- Verify the changelog states the kebab-case canonical form, Python/package/tool-mandated/generated/frozen exemptions, reference repair, and validation evidence.
- Verify the post-migration version is greater than the BASE version 4.1.0.0 and agrees across SKILL.md, README.md, frontmatter, description metadata, and any declared hub version surface.
- Record a blocking discrepancy report for the 009 gate when the entry is absent, incomplete, or inconsistent.

### Out of Scope

- Any filesystem rename, content migration, code/script change, benchmark rerun, or changelog rewrite unrelated to the rename set.
- Inventing a version number without the release/versioning evidence supplied by the component closeout.
- Rewriting frozen historical entries; history remains append-only under the 017 policy.
- Validating sibling implementation details beyond checking their handoff evidence and stated scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-code/changelog/** | Verification target | Confirm the migration entry exists and matches the phase evidence. |
| .opencode/skills/sk-code/SKILL.md and README.md | Verification target | Compare declared version and public migration summary. |
| .opencode/skills/sk-code/description.json and graph-metadata.json | Verification target | Check version/metadata consistency when those surfaces declare it. |
| 001-007 child checklists and reports | Evidence input | Reconcile the rename set, exemptions, references, and verification receipts. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A changelog entry records the complete sk-code rename set | The entry names all 001-007 surfaces or links to their evidence and does not claim a narrower migration. |
| REQ-002 | The entry records the naming policy and exemptions | It states kebab-case as canonical and preserves Python .py/package, tool-mandated, generated/lockfile, identifier/key/frontmatter, and frozen-history boundaries. |
| REQ-003 | The entry records reference and verification outcomes | It covers path/reference repair, symlink or scenario/benchmark implications, and the relevant non-zero/parity evidence. |
| REQ-004 | The version bump is consistent | The post-migration version is greater than 4.1.0.0 and agrees across the changelog, SKILL.md, README.md, and any declared metadata/version surfaces. |
| REQ-005 | Verification is non-mutating with respect to the rename | The phase report shows no filesystem rename or unrelated changelog/history rewrite and records discrepancies for 009 rather than silently accepting them. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The changelog has an evidence-matching entry for the sk-code rename set.
- **SC-002**: The release/version surfaces agree on a post-migration version greater than 4.1.0.0.
- **SC-003**: Missing or inconsistent evidence blocks the skill gate explicitly.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

A version string can be updated without describing the actual surface migration, or a changelog entry can overclaim by treating generated/frozen/exempt names as renamed. The mitigation is a row-by-row comparison with 001-007 handoffs, an explicit BASE-version comparison, and a non-mutating diff check. This phase depends on all sibling phase reports and does not repair their implementation.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. If the release process selects a version surface not listed in this spec, the verifier must add it to the discrepancy report before sign-off rather than infer consistency.
<!-- /ANCHOR:questions -->
