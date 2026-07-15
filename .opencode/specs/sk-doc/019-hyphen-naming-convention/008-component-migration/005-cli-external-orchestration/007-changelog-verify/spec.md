---
title: "Feature Specification: cli-external-orchestration changelog and version verification (017 phase 005.007)"
description: "This verification-only phase confirms that the cli-external-orchestration hub and its three CLI workflow release surfaces record the completed kebab-case rename set and coherent version bumps. It does not rename files, rewrite historical changelogs, or repair metadata contradictions."
trigger_phrases:
  - "cli-external changelog verification"
  - "cli-external rename release evidence"
  - "cli-external phase 007 verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/007-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/007-changelog-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verification docs"
    next_safe_action: "Capture post-migration release evidence"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/changelog/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/changelog/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/changelog/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/changelog/"
      - ".opencode/skills/cli-external-orchestration/description.json"
    completion_pct: 0
    open_questions:
      - "The execution-time release version, date, and new changelog filenames are not known during authoring."
    answered_questions:
      - "The current root metadata reports version 1.1.0.0 while root changelog history includes v1.2.0.0; this is a required verification point, not an authoring fix."
      - "This phase performs verification only and does not create or edit changelog entries."
      - "Actual per-surface baselines on v4: hub 1.1.0.0/changelog v1.2.0.0, cli-opencode v1.3.15.3, cli-claude-code v1.3.0.0, cli-codex v1.7.1.0; the verifier anchors on these, not a uniform version."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: cli-external-orchestration changelog and version verification

> Phase adjacency under the cli-external-orchestration component parent: predecessor `006-benchmark`; successor `008-skill-gate`.

> **RECONCILED — v4 reconciliation (2026-07-15).** Actual current release baselines on v4 (verified in-tree): hub `description.json` `1.1.0.0` with hub changelog latest `v1.2.0.0` (the known, still-present mismatch); `cli-opencode` `v1.3.15.3`; `cli-claude-code` `v1.3.0.0`; `cli-codex` `v1.7.1.0`. The verifier anchors on THESE per-surface baselines when checking for a new migration entry — the four surfaces are at different versions and it must not assume a uniform pre-migration version. See the packet's v4-reconciliation-inventory.md.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/007-changelog-verify |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | cli-external-orchestration |
| **Origin** | Verification phase 007 of the cli-external-orchestration subtree under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The path phases can complete while release records omit the rename set or point at the wrong version. The live surface has separate changelog histories for the hub (`description.json` `1.1.0.0`, changelog latest `v1.2.0.0`), cli-opencode (`v1.3.15.3`), cli-claude-code (`v1.3.0.0`), and cli-codex (`v1.7.1.0`) — four independently-versioned surfaces, plus the root metadata/history mismatch. This phase verifies the post-migration evidence and reports contradictions without rewriting frozen history or silently normalizing metadata.

The purpose is to hand phase 008 a release-evidence matrix proving that each surface has a matching rename entry, version bump, exemption statement, and file-list coverage.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify a new changelog entry exists for the hub, cli-opencode, cli-claude-code, and cli-codex release surfaces after phases 001–006.
- Confirm each entry names the completed kebab-case rename set, preserved exemptions, and the relevant version bump/date.
- Compare entry versions and filenames with active `SKILL.md`, root `description.json`, `graph-metadata.json`, and other active metadata where present.
- Confirm each entry's file list and reference claims match phases 001–006 disposition maps and the benchmark zero-candidate/evidence result.
- Record a reproducible pass/block matrix for phase 008.

### Out of Scope
- Any filesystem rename, path-reference rewrite, playbook/benchmark migration, or changelog repair.
- Rewriting historical files under any of the four changelog directories.
- Inventing a release version, silently fixing the known root metadata/history mismatch, or changing skill metadata in this verification phase.
- Code, scripts, identifiers, data keys, frontmatter fields, generated output, and tool-mandated names.

### Files to Inspect

| File Path | Verification |
|-----------|--------------|
| `changelog/` | Locate the hub entry for the completed rename set and compare release version |
| `cli-opencode/changelog/` | Locate the OpenCode entry and compare its rename/file-list claims |
| `cli-claude-code/changelog/` | Locate the Claude Code entry and compare its rename/file-list claims |
| `cli-codex/changelog/` | Locate the Codex entry and compare its rename/file-list claims |
| Root `SKILL.md`, `description.json`, `graph-metadata.json`, component `SKILL.md` files | Compare active version/path metadata where present |
| Phases 001–006 checklists/evidence | Match release claims to actual path and exemption maps |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | Release entries exist | Each of the four release surfaces has a new migration entry with version, date, and file path recorded in evidence |
| REQ-002 [P0] | Entries match the rename set | Each entry covers its owned paths, the four-tree playbook result, benchmark result, and preserved Python/package/tool/generated/frozen exemptions without claiming out-of-scope changes |
| REQ-003 [P0] | Version metadata is coherent | Entry version, filename, active metadata, and release claims agree; any contradiction, including the known root baseline mismatch, is explicitly blocking |
| REQ-004 [P1] | Historical records remain frozen | Existing changelog files and historical narratives are byte-for-byte unchanged |
| REQ-005 [P1] | Rollup handoff is complete | Phase 008 receives release-entry paths, version comparisons, coverage results, commands, and unresolved findings |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four release surfaces have matching changelog evidence for the completed cli-external rename work.
- **SC-002**: Changelog file lists and exemption claims agree with phases 001–006.
- **SC-003**: Version fields and filenames are coherent, with no unreported contradiction.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The primary risk is treating an old historical entry as migration evidence or accepting a version bump while active metadata disagrees. The phase depends on all six path/census phases and must fail closed when release coverage is missing or a contradiction requires an authorized release edit.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

The release version and date are execution-time values. The verifier must record them from the candidate release metadata and must not infer them from the current root version mismatch.
<!-- /ANCHOR:questions -->

