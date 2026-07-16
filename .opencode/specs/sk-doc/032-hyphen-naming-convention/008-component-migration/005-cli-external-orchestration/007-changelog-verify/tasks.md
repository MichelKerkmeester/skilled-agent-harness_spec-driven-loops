---
title: "Tasks: cli-external-orchestration changelog and version verification (032 phase 005.007)"
description: "Tasks for the verification-only release phase: inventory four changelog surfaces, compare rename-set coverage and versions with child evidence, preserve history, and hand off a pass/block matrix."
trigger_phrases:
  - "cli-external changelog verification tasks"
  - "cli-external release evidence tasks"
  - "cli-external phase 007 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/007-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/007-changelog-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored changelog verification tasks"
    next_safe_action: "Capture the four release surfaces"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/changelog/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/changelog/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/changelog/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/changelog/"
      - ".opencode/skills/cli-external-orchestration/description.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase performs verification only; it does not create or edit changelog entries."
---
# Tasks: cli-external-orchestration changelog and version verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Pin BASE and candidate SHAs and capture historical file lists (`changelog/`, `cli-opencode/changelog/`, `cli-claude-code/changelog/`, `cli-codex/changelog/`)
- [ ] T002 [P] Record candidate release dates and active version fields (`SKILL.md`, root `description.json`, `graph-metadata.json`)
- [ ] T003 [P] Collect phases 001–006 checklists, maps, hashes, and evidence (`001-*` through `006-*`)
- [ ] T004 Locate the new migration entry for each of the four release surfaces (`changelog/` trees)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Compare each entry's version, file list, rename set, and exemption claims with child evidence (`phase evidence/release-evidence-matrix`)
- [ ] T006 [P] Compare changelog versions and filenames with active skill and descriptor metadata (`SKILL.md`, `description.json`, `graph-metadata.json`)
- [ ] T007 [P] Confirm historical changelog files are unchanged from BASE (`four changelog trees`)
- [ ] T008 Record every missing entry, stale claim, or version contradiction as a blocking finding; do not edit the skill tree (`release-evidence-matrix`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Confirm phases 001–006 and their release-relevant evidence are represented without scope overclaim (`phase evidence`)
- [ ] T010 Check entries explicitly name the kebab-case rename set and preserved exemption boundary (`four changelog trees`)
- [ ] T011 Publish the release-evidence matrix with versions, paths, commands, exit codes, coverage verdicts, and findings (`phase evidence`)
- [ ] T012 Hand a pass/block result to phase 008 without changing any skill or changelog file (`008-skill-gate/`)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain
- [ ] Each release surface has matching entry and coherent version evidence
- [ ] Historical records remain frozen and phase 008 receives the evidence matrix
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Parent phase map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

