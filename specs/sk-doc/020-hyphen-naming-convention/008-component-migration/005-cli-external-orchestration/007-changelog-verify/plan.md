---
title: "Implementation Plan: cli-external-orchestration changelog and version verification (020 phase 005.007)"
description: "Verification plan for phase 007: inspect four release histories, compare new rename entries with child evidence and active metadata, preserve historical changelogs, and issue a pass/block handoff without changing the skill surface."
trigger_phrases:
  - "cli-external changelog verification plan"
  - "cli-external release evidence plan"
  - "cli-external phase 007 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/007-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/007-changelog-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verification plan"
    next_safe_action: "Capture release-entry/version matrix"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/changelog/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/changelog/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/changelog/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/changelog/"
      - ".opencode/skills/cli-external-orchestration/description.json"
    completion_pct: 0
    open_questions:
      - "The release version and exact new entry filenames are supplied by the migration candidate."
    answered_questions:
      - "The phase is read-only verification and does not create or edit changelog entries."
---
# Implementation Plan: cli-external-orchestration changelog and version verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Hub and three CLI-component changelogs plus active version metadata |
| **Change class** | Read-only release evidence and contradiction reporting |
| **Execution** | Post-migration candidate, phase evidence, version/file-list comparison |

### Overview
The plan snapshots all four historical changelog file lists and active metadata, locates the new migration entries, compares each entry with phases 001–006, and emits a pass/block matrix. Missing coverage or version drift remains a blocking finding; this phase does not repair it.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001–006 have passed their blocking checklist contracts and their maps/evidence are available.
- [ ] Candidate/BASE SHAs, release date, and execution-time version values are recorded.
- [ ] Historical changelog baselines and root active metadata are available for comparison.

### Definition of Done
- [ ] One matching migration entry is identified for each of the four release surfaces.
- [ ] Rename-set, exemption, file-list, and version comparisons are evidenced.
- [ ] Historical files are unchanged and phase 008 receives a clear pass/block result.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use a release-evidence matrix: surface → changelog file/version → active metadata version → phase-map coverage → verdict. Keep historical files separate from the new entry under review.

### Key Components
- **Hub record**: root `changelog/`, `SKILL.md`, `description.json`, and `graph-metadata.json`; the current root version/history mismatch is a required comparison.
- **OpenCode record**: `cli-opencode/changelog/` and `cli-opencode/SKILL.md`.
- **Claude Code record**: `cli-claude-code/changelog/` and `cli-claude-code/SKILL.md`.
- **Codex record**: `cli-codex/changelog/` and `cli-codex/SKILL.md`.

### Data Flow
BASE history → candidate release-entry inventory → active metadata/version comparison → phase-map coverage check → phase 008 pass/block handoff.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture four historical changelog file lists and active version/path metadata at BASE.
- [ ] Record candidate release dates/versions and completed phase 001–006 evidence paths.
- [ ] Locate the new entry for each release surface without editing any file.

### Phase 2: Implementation
- [ ] Compare each entry's version, file list, rename scope, and exemption claims with child evidence.
- [ ] Compare entry versions and filenames with active `SKILL.md`, root descriptors, and graph metadata where present.
- [ ] Record each contradiction as a blocking release finding; do not normalize it here.

### Phase 3: Verification
- [ ] Prove historical changelog files did not change.
- [ ] Confirm all six path/census phase concerns are represented without overclaiming.
- [ ] Publish the release-evidence matrix and pass/block handoff to phase 008.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Enumerate new changelog files and match one migration entry to each release surface |
| REQ-002 | Compare entry text/file list with phases 001–006 maps, benchmark evidence, playbook evidence, and exemption boundary |
| REQ-003 | Compare changelog version/filename with active metadata and fail on unresolved mismatch |
| REQ-004 | Compare historical files with BASE and confirm no frozen narrative changed |
| REQ-005 | Check phase 008 handoff contains paths, versions, coverage, commands, exit codes, and findings |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase depends on the six preceding path/census checklists and their final evidence. It is verification-only and must not become an implicit release-edit phase; missing entries or version repairs return to the authorized release workflow before phase 008.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

There is no filesystem mutation to roll back. If evidence fails, retain the read-only report, mark the phase blocked, and return the release candidate to its owner for an explicit changelog/version change before rerunning this verifier.
<!-- /ANCHOR:rollback -->

