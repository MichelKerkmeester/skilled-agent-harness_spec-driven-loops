---
title: "Implementation Plan: sk-prompt changelog and version verification (032 phase 004.006)"
description: "Verification plan for phase 006 of the sk-prompt kebab-case program: inspect new release entries, compare version metadata, preserve frozen changelog history, and hand evidence to the rollup gate."
trigger_phrases:
  - "sk-prompt changelog verification plan"
  - "sk-prompt release evidence plan"
  - "sk-prompt phase 006 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/006-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/006-changelog-verify"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the changelog/version verification plan"
    next_safe_action: "Capture the post-migration release metadata and compare it with new changelog entries"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/changelog/"
      - ".opencode/skills/sk-prompt/prompt-improve/changelog/"
      - ".opencode/skills/sk-prompt/prompt-models/changelog/"
      - ".opencode/skills/sk-prompt/description.json"
      - ".opencode/skills/sk-prompt/prompt-models/description.json"
    completion_pct: 0
    open_questions:
      - "The release version is supplied by the completed migration/release candidate, not by this authoring pass."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: sk-prompt changelog and version verification

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Hub, prompt-improve, and prompt-models changelogs plus active version metadata |
| **Change class** | Read-only release evidence and contradiction reporting |
| **Execution** | Post-migration candidate, phase evidence, version/file-list comparison |

### Overview
The plan snapshots the current historical baseline, identifies the new release entries in the candidate, compares each entry with active metadata, and checks the release file list against phases 001–005. Missing or incoherent evidence is a blocking result; this phase does not repair it.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001–005 have passed their blocking checklist contracts.
- [ ] Candidate and BASE SHAs, release date, and execution-time version values are recorded.
- [ ] Historical changelog baselines are available for diff comparison.

### Definition of Done
- [ ] One matching release entry is identified for each of the three sk-prompt surfaces.
- [ ] Rename-set, exemption, file-list, and version comparisons are evidenced.
- [ ] Historical records are unchanged and phase 007 receives a clear pass/block result.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use a release-evidence matrix: surface → changelog file/version → active metadata version → rename-set coverage → verdict. Keep historical files separate from the new entry under review.

### Key Components
- **Hub release record**: `.opencode/skills/sk-prompt/changelog/` and root metadata.
- **Prompt-improve release record**: its changelog plus `SKILL.md` and descriptors.
- **Prompt-models release record**: its changelog plus `SKILL.md`, `description.json`, and graph metadata; the known 0.9.0.1/0.9.0.0 divergence is a required comparison point.

### Data Flow
BASE history → candidate release-entry inventory → metadata/version comparison → phase-map coverage check → phase 007 handoff.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Capture the historical changelog file lists and active metadata versions at BASE.
- [ ] Record the candidate release date/version and the completed phase 001–005 evidence paths.
- [ ] Locate the new entry for each release surface without editing any file.

### Phase 2: Implementation
- [ ] Compare each new entry's version, file list, rename scope, and exemption claims with the phase evidence.
- [ ] Compare entry versions with `SKILL.md`, descriptors, graph metadata, and release filenames.
- [ ] Record any contradiction as a blocking finding for the release owner; do not normalize it here.

### Phase 3: Verification
- [ ] Prove historical changelog files did not change.
- [ ] Confirm all seven child phase concerns are represented where the release entry claims the migration is complete.
- [ ] Publish the release-evidence matrix and a pass/block handoff to phase 007.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Enumerate new changelog files and match one release entry to each surface |
| REQ-002 | Compare entry text/file list with the phase 001–005 maps and exemption evidence |
| REQ-003 | Compare changelog version, filename, `SKILL.md`, descriptors, and graph metadata; fail on unresolved mismatch |
| REQ-004 | Compare historical changelog files with BASE and confirm no frozen narrative changed |
| REQ-005 | Check the phase 007 handoff contains paths, versions, evidence, and unresolved findings |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase depends on the five path-phase checklists and their final rename/exemption maps. It is verification-only and must not become an implicit release-edit phase; any missing entry or version repair returns to the authorized release workflow before phase 007.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

There is no filesystem mutation to roll back. If evidence fails, retain the read-only report, mark the phase blocked, and return the release candidate to the owner for an explicit changelog/version change before rerunning this verifier.
<!-- /ANCHOR:rollback -->
