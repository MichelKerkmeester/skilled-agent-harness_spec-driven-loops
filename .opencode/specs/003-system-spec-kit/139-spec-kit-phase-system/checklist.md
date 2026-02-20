<!-- SPECKIT_LEVEL: 3+ -->
# Verification Checklist: SpecKit Phase System

<!-- SPECKIT_TEMPLATE_SOURCE: checklist + checklist-extended | v2.2 -->

---

## Phase 1: Detection & Scoring

- [ ] **P0** `recommend-level.sh` includes `determine_phasing()` function [Source: ]
- [ ] **P0** JSON output includes `recommended_phases`, `phase_score`, `phase_reason`, `suggested_phase_count` [Test: ]
- [ ] **P0** Phase threshold: score >= 25 AND level >= 3 triggers recommendation [Test: ]
- [ ] **P1** New flags `--recommend-phases` and `--phase-threshold <N>` implemented [Source: ]
- [ ] **P1** 5 test fixtures created and passing: below threshold, at boundary, above threshold, extreme scale, no risk factors [Test: ]
- [ ] **P1** Backward compatibility: existing 51 test fixtures unaffected [Test: ]
- [ ] **P2** Confidence penalty when phase score near boundary (within 5 pts) [Source: ]

## Phase 2: Templates & Creation

- [ ] **P0** `create.sh --phase` creates parent folder with correct level templates [Test: ]
- [ ] **P0** `create.sh --phase` creates numbered child folders (001-*, 002-*) with `memory/` + `scratch/` [Test: ]
- [ ] **P0** Parent spec.md includes Phase Documentation Map section [File: ]
- [ ] **P0** Child spec.md includes parent back-references (`../spec.md`, `../plan.md`) [File: ]
- [ ] **P1** `--phases <N>` flag creates N child folders with correct numbering [Test: ]
- [ ] **P1** `--phase-names <list>` flag applies descriptive names to child folders [Test: ]
- [ ] **P1** `--phase` and `--subfolder` are mutually exclusive (error if both provided) [Test: ]
- [ ] **P1** Template addendum files created: `phase-parent-section.md`, `phase-child-header.md` [File: ]
- [ ] **P2** Default child level is L1 with `--child-level N` override [Test: ]

## Phase 3: Commands & Router

- [ ] **P0** SKILL.md PHASE intent signal added with keywords and weight [Source: ]
- [ ] **P0** SKILL.md RESOURCE_MAP includes PHASE → phase_definitions.md mapping [Source: ]
- [ ] **P0** SKILL.md COMMAND_BOOSTS includes `/spec_kit:phase` → PHASE [Source: ]
- [ ] **P0** `/spec_kit:phase` command: `phase.md` + 2 YAML assets created [File: ]
- [ ] **P1** `/spec_kit:plan` supports Gate 3 Option E and `--phase-folder` argument [Source: ]
- [ ] **P1** `/spec_kit:implement` resolves nested phase paths correctly [Test: ]
- [ ] **P1** `/spec_kit:complete` includes phase lifecycle validation step [Source: ]
- [ ] **P1** `/spec_kit:resume` detects phase folders and offers phase selection [Source: ]
- [ ] **P1** `"phase"` keyword removed from IMPLEMENT intent to avoid double-scoring [Source: ]

## Phase 4: Validation, Docs & Nodes

- [ ] **P0** `validate.sh --recursive` discovers `[0-9][0-9][0-9]-*/` child folders [Test: ]
- [ ] **P0** Recursive validation produces per-phase + aggregated results [Test: ]
- [ ] **P0** Exit code reflects worst result across parent + all children [Test: ]
- [ ] **P1** `check-phase-links.sh` rule script validates parent-child back-references [Test: ]
- [ ] **P1** JSON output includes `"phases": [...]` array [Test: ]
- [ ] **P1** 6 new test fixtures: flat, 1-phase, 3-phase, mixed levels, empty child, broken links [Test: ]
- [ ] **P1** `nodes/phase-system.md` created with correct content and MOC linkage [File: ]
- [ ] **P1** `index.md` updated with phase-system node in Workflow & Routing section [File: ]
- [ ] **P1** `references/structure/phase_definitions.md` created [File: ]
- [ ] **P1** `sub_folder_versioning.md` updated with Phases vs Versions section [File: ]
- [ ] **P1** `level_specifications.md` updated with Phase-Aware Specifications section [File: ]
- [ ] **P1** `template_guide.md` §10 expanded for phase organization [File: ]
- [ ] **P1** `quick_reference.md` updated with phase workflow shortcuts [File: ]
- [ ] **P1** `validation_rules.md` updated with PHASE_LINKS rule documentation [File: ]
- [ ] **P2** CLAUDE.md Gate 3 updated with Option E [File: ]

## Cross-Cutting Verification

- [ ] **P0** All 51 existing test fixtures pass with --recursive flag (backward compatibility) [Test: ]
- [ ] **P0** Non-phased spec folders validate identically with/without --recursive [Test: ]
- [ ] **P1** End-to-end workflow: /spec_kit:phase → create → validate → resume cycle works [Test: ]
- [ ] **P1** Retrospective validation: system correctly flags 136/138 profiles as needing phases [Test: ]
- [ ] **P1** All modified reference docs internally consistent (no broken cross-references) [Review: ]
- [ ] **P2** Bash 4.0+ compatibility verified for all script changes [Test: ]

## Governance Sign-offs

| Gate | Status | Date | Evidence |
|------|--------|------|----------|
| G1: Plan Approval | Pending | | |
| G2: Phase 1 Complete | Pending | | |
| G3: Phase 2 Complete | Pending | | |
| G4: Phase 3 Complete | Pending | | |
| G5: Phase 4 Complete | Pending | | |
| G6: Final Acceptance | Pending | | |
