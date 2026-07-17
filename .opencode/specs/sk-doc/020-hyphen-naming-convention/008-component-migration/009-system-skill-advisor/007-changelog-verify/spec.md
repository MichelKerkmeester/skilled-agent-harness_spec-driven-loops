---
title: "Feature Specification: system-skill-advisor changelog verification"
description: "Verify that the system-skill-advisor changelog records the completed filesystem rename set and the matching version bump. This is an evidence-only phase and performs no filesystem renames."
trigger_phrases:
  - "system-skill-advisor changelog verification"
  - "advisor rename release evidence"
  - "kebab-case changelog entry"
  - "skill version bump verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/007-changelog-verify"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the changelog evidence contract"
    next_safe_action: "Verify the release entry against the completed sibling rename evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/changelog"
      - ".opencode/skills/system-skill-advisor/SKILL.md"
      - ".opencode/skills/system-skill-advisor/README.md"
      - ".opencode/skills/system-skill-advisor/INSTALL_GUIDE.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current changelog has versioned entries through v0.10.0; the execution owner chooses the next valid release version."
      - "The current SKILL.md and README expose different version strings, so verification must check the canonical version source and the release entry together."
      - "This phase verifies evidence only and does not perform renames or silently author a missing release entry."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: system-skill-advisor changelog verification

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/007-changelog-verify |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 007 of the system-skill-advisor component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor has versioned changelog entries through v0.10.0, while the skill identity documents expose version
values that are not currently identical. A filesystem migration is not releasable unless its release evidence names
the actual rename set, the exemption boundary, the compatibility impact, and the version selected by the release
owner. A missing or vague entry would let the subtree gate pass without a durable audit trail.

### Purpose
Verify that a changelog entry exists for the completed system-skill-advisor rename set and that its version bump agrees
with the canonical skill version metadata; report a blocker when evidence is missing or inconsistent.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The newest system-skill-advisor changelog entry and its release/version metadata.
- Evidence that the entry names the MCP package root, scripts, references, hooks, feature-catalog tree, and
  manual-playbook tree covered by phases 001–006.
- Evidence that the entry states Python/tool/generated/lockfile/identifier exemptions, compatibility impact, and
  verification results.
- Cross-checks against SKILL.md, README.md, and INSTALL_GUIDE.md version values and release links.

### Out of Scope
- Any filesystem rename, reference rewrite, code change, or version selection by this verification phase.
- Rewriting frozen historical changelog entries or normalizing unrelated version inconsistencies without an owned
  release decision.
- Claiming completion when the expected release entry is absent; absence is a blocking verification failure.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-skill-advisor/changelog/ | Verify only | Confirm a new entry records this rename set and release version |
| .opencode/skills/system-skill-advisor/SKILL.md | Verify only | Compare canonical version metadata |
| .opencode/skills/system-skill-advisor/{README,INSTALL_GUIDE}.md | Verify only | Compare displayed version and release links |
| 007-changelog-verify/checklist.md | Evidence | Record the pass/fail result and exact release-entry path |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A release entry records the rename | The newest changelog entry exists at the expected version path and names the system-skill-advisor filesystem rename set. |
| REQ-002 | The entry covers all sibling outcomes | It mentions the MCP package root/manifest closure, scripts, references, hooks audit, feature catalog, and manual playbook, including no-op/audit outcomes where applicable. |
| REQ-003 | The exemption boundary is explicit | The entry states that Python filenames/package directories, tool-mandated/generated/lockfile names, and code/data identifiers were preserved. |
| REQ-004 | The version bump is consistent | The changelog version, canonical skill version metadata, release date, and linked release references agree with the release decision. |
| REQ-005 | Verification evidence is present | The entry cites the subtree gate result, compatibility/test/link evidence, and any intentional retained historical names. |
| REQ-006 | This phase performs no migration | The phase diff contains only its evidence record, and no source/path rename is attributed to phase 007. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewer can identify the exact changelog entry and version that records this subtree migration.
- **SC-002**: The entry matches the sibling checklists and the canonical skill version source.
- **SC-003**: Missing or contradictory release evidence blocks the phase rather than being silently repaired here.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Sibling phase evidence | A changelog entry can overstate a phase that did not pass | Compare every release claim to the sibling checklist and final gate evidence. |
| Risk | README and SKILL version drift | Reviewers may accept the wrong release as canonical | Identify the authoritative version source and record the comparison explicitly. |
| Risk | Verification phase edits the release history | Evidence becomes circular and frozen history may be rewritten | Fail closed on missing evidence and hand the correction to the release owner. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The release owner must supply the target version at execution time; the verifier must not infer it from
the current v0.10.0 ceiling or from a stale README value.
<!-- /ANCHOR:questions -->
