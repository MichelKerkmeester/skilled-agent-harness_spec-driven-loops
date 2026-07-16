---
title: "Tasks: sk-prompt changelog and version verification (032 phase 004.006)"
description: "Tasks for phase 006 of the sk-prompt kebab-case program: inventory release evidence, compare versions and rename-set coverage, and issue a pass/block handoff without changing the skill surface."
trigger_phrases:
  - "sk-prompt changelog verification tasks"
  - "sk-prompt release evidence tasks"
  - "sk-prompt phase 006 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/006-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/006-changelog-verify"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the verification-only release evidence task map"
    next_safe_action: "Capture BASE and candidate release metadata without changing the skill tree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/changelog/"
      - ".opencode/skills/sk-prompt/prompt-improve/changelog/"
      - ".opencode/skills/sk-prompt/prompt-models/changelog/"
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-models/description.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase performs verification only; it does not create or edit changelog entries."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: sk-prompt changelog and version verification

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

- [ ] T001 Pin BASE and candidate SHAs and capture the historical changelog file lists (`sk-prompt/*/changelog/`)
- [ ] T002 [P] Record candidate release dates and active version fields (`SKILL.md`, `description.json`, `graph-metadata.json`)
- [ ] T003 [P] Collect the completed phase 001–005 checklists, maps, and exemption evidence (`004-sk-prompt/001-*` through `005-*`)
- [ ] T004 Locate the new release entry for the hub, prompt-improve, and prompt-models surfaces (`sk-prompt/*/changelog/`)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Compare each entry's version, file list, rename set, and exemption claims with the collected phase evidence (`release-evidence-matrix`)
- [ ] T006 [P] Compare changelog versions and filenames with active skill and descriptor metadata (`SKILL.md`, `description.json`, `graph-metadata.json`)
- [ ] T007 [P] Confirm historical changelog files are unchanged from BASE (`sk-prompt/*/changelog/`)
- [ ] T008 Record any missing entry, stale claim, or version contradiction as a blocking finding; do not edit the skill tree (`release-evidence-matrix`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Confirm all five path-phase maps and the phase 006 release evidence cover the complete child scope (`004-sk-prompt/001-*` through `006-*`)
- [ ] T010 Check the new entries explicitly name the kebab-case rename set and preserved exemption boundary (`sk-prompt/*/changelog/`)
- [ ] T011 Publish the release-evidence matrix with versions, paths, commands, and verdicts (`phase evidence`)
- [ ] T012 Hand a pass/block result and unresolved findings to phase 007 (`007-skill-gate/`)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remain
- [ ] Each release surface has a matching changelog entry and coherent version evidence
- [ ] Historical records remain frozen and phase 007 receives the evidence matrix
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verifier contract**: See `checklist.md`
- **Parent phase map**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
