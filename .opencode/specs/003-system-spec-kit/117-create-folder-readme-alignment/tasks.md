# Tasks: Create Folder README Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Phase 1: HIGH Gaps (Structural Fixes)

- [ ] T001 Audit current YAML type-specific section structures — document each type's section count and names (`create_folder_readme.yaml`)
- [ ] T002 Map template's 14-section standard to each README type — determine which sections apply per type (`readme_template.md` → `create_folder_readme.yaml`)
- [ ] T003 Rewrite YAML type-specific section definitions to match template standard (`create_folder_readme.yaml`) [Gap 1]
- [ ] T004 Identify all embedded template content in YAML (~140 lines) (`create_folder_readme.yaml`)
- [ ] T005 Replace embedded templates with references to `readme_template.md` §13 (`create_folder_readme.yaml`) [Gap 2]
- [ ] T006 Identify all `notes.*` key references in `folder_readme.md` (`folder_readme.md`)
- [ ] T007 Map each broken reference to the correct YAML key path (`create_folder_readme.yaml` + `folder_readme.md`)
- [ ] T008 Replace broken `notes.readme_type_selection` and `notes.key_patterns` with valid YAML keys (`folder_readme.md`) [Gap 3]

---

## Phase 2: MEDIUM Gaps (Consistency Fixes)

- [ ] T009 [P] Determine canonical DQI target value (review YAML=70, folder_readme=90+, @write=75+) [Gap 4]
- [ ] T010 Update DQI target in `create_folder_readme.yaml` to canonical value (`create_folder_readme.yaml`) [Gap 4]
- [ ] T011 Update DQI target in `folder_readme.md` to canonical value (`folder_readme.md`) [Gap 4]
- [ ] T012 [P] Audit emoji usage: compare template emojis vs YAML section emojis (`readme_template.md` vs `create_folder_readme.yaml`) [Gap 5]
- [ ] T013 Fix emoji mismatches — features section emoji, troubleshooting section emoji (`create_folder_readme.yaml`) [Gap 5]
- [ ] T014 [P] Audit YAML `emoji_conventions` vs actual emoji usage within YAML (`create_folder_readme.yaml`) [Gap 6]
- [ ] T015 Reconcile `emoji_conventions` definitions with actual usage throughout YAML (`create_folder_readme.yaml`) [Gap 6]

---

## Phase 3: LOW Gaps (Polish)

- [ ] T016 [P] Add references to template evolution patterns: anchors, TOC format, badges, diagrams (`create_folder_readme.yaml`) [Gap 7]
- [ ] T017 [P] Fix `sequential_5_step` naming — rename to match actual step count or adjust steps (`create_folder_readme.yaml`) [Gap 8]
- [ ] T018 [P] Replace all `/documentation:create_readme` references with `/create:folder_readme` (`folder_readme.md`) [Gap 9]
- [ ] T019 [P] Renumber steps in `folder_readme.md` to start at Step 1 instead of Step 4 (`folder_readme.md`) [Gap 10]

---

## Phase 4: Verification

- [ ] T020 Validate YAML syntax (no parse errors in `create_folder_readme.yaml`)
- [ ] T021 Grep all key references in `folder_readme.md` and verify each resolves to a YAML key
- [ ] T022 Cross-check DQI target, emojis, and section names are consistent across all 3 files
- [ ] T023 Update spec folder documentation (implementation-summary.md, checklist.md)

---

## Completion Criteria

- [ ] All 23 tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 10 gaps verified resolved
- [ ] YAML syntax valid
- [ ] All key references resolve

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Prior spec**: `115-readme-template-alignment/` (canonical template update)
- **Template**: `.opencode/skill/workflows-documentation/assets/documentation/readme_template.md`

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
