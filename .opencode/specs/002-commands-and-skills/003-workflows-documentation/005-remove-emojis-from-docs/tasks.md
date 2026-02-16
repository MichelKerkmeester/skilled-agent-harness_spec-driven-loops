# Tasks: Remove Emojis from All Documentation

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or group)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-0 -->
## Phase 0: Validation Engine & workflows-documentation (COMPLETED)

- [x] T001 Set `h2_emoji_required: false` for all 7 document types in `template_rules.json`
- [x] T002 Remove `missing_h2_emoji` and `toc_missing_emoji` from blocking errors in `template_rules.json`
- [x] T003 Remove `add_h2_emoji` and `fix_toc_emoji` auto-fix rules from `template_rules.json`
- [x] T004 Remove TOC emoji check from `validate_document.py`
- [x] T005 Clear `EMOJI_REQUIRED_TYPES` set in `extract_structure.py`
- [x] T006 Remove `h2_emoji` checklist items from all checklists in `extract_structure.py`
- [x] T007 Update DQI scoring to remove emoji factor in `extract_structure.py`
- [x] T008 Strip emojis from H2 headings in `SKILL.md`
- [x] T009 Remove "Emoji Usage Rules" section from `SKILL.md`
- [x] T010 Strip emojis from H2 headings and TOC in `README.md`
- [x] T011 Remove Section 8 "EMOJI USAGE RULES" from `references/core_standards.md`
- [x] T012 Strip emojis from H2 headings in `references/validation.md`
- [x] T013 Strip emojis from 9 template files in `assets/`
- [x] T014 Strip emojis from 5 reference files in `references/`
- [x] T015 Update all 6 test fixtures to remove emojis
- [x] T016 Update `test_validator.py` to expect no emoji enforcement
- [x] T017 Run test suite (6/6 pass)
- [x] T018 Create changelog entry `v1.0.7.0.md`
- [x] T019 Bump version in SKILL.md to 1.0.7.0
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: system-spec-kit Skill (84 files)

- [ ] T100 [P] Strip emojis from `system-spec-kit/SKILL.md`
- [ ] T101 [P] Strip emojis from `system-spec-kit/README.md`
- [ ] T102 [P] Strip emojis from 17 `scripts/**/README.md` files
- [ ] T103 [P] Strip emojis from 20 `mcp_server/**/README.md` files
- [ ] T104 [P] Strip emojis from `mcp_server/INSTALL_GUIDE.md`
- [ ] T105 [P] Strip emojis from 26 `references/**/*.md` files
- [ ] T106 [P] Strip emojis from 4 `assets/*.md` files
- [ ] T107 [P] Strip emojis from 5 `shared/**/README.md` files
- [ ] T108 [P] Strip emojis from `constitutional/README.md` and `config/README.md`
- [ ] T109 [P] Strip emojis from `templates/scratch/README.md`
- [ ] T110 Verify: zero emoji H2 headings in `system-spec-kit/`
- [ ] T111 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: mcp-figma Skill (6 files)

- [ ] T200 [P] Strip emojis from `mcp-figma/SKILL.md`
- [ ] T201 [P] Strip emojis from `mcp-figma/README.md`
- [ ] T202 [P] Strip emojis from `mcp-figma/INSTALL_GUIDE.md`
- [ ] T203 [P] Strip emojis from `mcp-figma/references/tool_reference.md`
- [ ] T204 [P] Strip emojis from `mcp-figma/references/quick_start.md`
- [ ] T205 [P] Strip emojis from `mcp-figma/assets/tool_categories.md`
- [ ] T206 Verify: zero emoji H2 headings in `mcp-figma/`
- [ ] T207 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: mcp-code-mode Skill (10 files)

- [ ] T300 [P] Strip emojis from `mcp-code-mode/SKILL.md`
- [ ] T301 [P] Strip emojis from `mcp-code-mode/README.md`
- [ ] T302 [P] Strip emojis from `mcp-code-mode/INSTALL_GUIDE.md`
- [ ] T303 [P] Strip emojis from 5 `mcp-code-mode/references/*.md` files
- [ ] T304 [P] Strip emojis from 2 `mcp-code-mode/assets/*.md` files
- [ ] T305 Verify: zero emoji H2 headings in `mcp-code-mode/`
- [ ] T306 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: workflows-code--opencode Skill (22 files)

- [ ] T400 [P] Strip emojis from `workflows-code--opencode/SKILL.md`
- [ ] T401 [P] Strip emojis from `workflows-code--opencode/README.md`
- [ ] T402 [P] Strip emojis from 3 `references/python/*.md` files
- [ ] T403 [P] Strip emojis from 3 `references/typescript/*.md` files
- [ ] T404 [P] Strip emojis from 3 `references/javascript/*.md` files
- [ ] T405 [P] Strip emojis from 3 `references/shell/*.md` files
- [ ] T406 [P] Strip emojis from `references/config/quick_reference.md`
- [ ] T407 [P] Strip emojis from `references/shared/code_organization.md`
- [ ] T408 [P] Strip emojis from 6 `assets/checklists/*.md` files
- [ ] T409 Verify: zero emoji H2 headings in `workflows-code--opencode/`
- [ ] T410 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: workflows-chrome-devtools Skill (7 files)

- [ ] T500 [P] Strip emojis from `workflows-chrome-devtools/SKILL.md`
- [ ] T501 [P] Strip emojis from `workflows-chrome-devtools/README.md`
- [ ] T502 [P] Strip emojis from `workflows-chrome-devtools/INSTALL_GUIDE.md`
- [ ] T503 [P] Strip emojis from 3 `references/*.md` files
- [ ] T504 [P] Strip emojis from `examples/README.md`
- [ ] T505 Verify: zero emoji H2 headings in `workflows-chrome-devtools/`
- [ ] T506 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:phase-6 -->
## Phase 6: workflows-code--full-stack Skill (33 files)

- [ ] T600 [P] Strip emojis from `workflows-code--full-stack/SKILL.md`
- [ ] T601 [P] Strip emojis from `workflows-code--full-stack/README.md`
- [ ] T602 [P] Strip emojis from 7 `references/frontend/react/*.md` files
- [ ] T603 [P] Strip emojis from 12 `references/backend/go/*.md` files
- [ ] T604 [P] Strip emojis from `references/backend/nodejs/nodejs_standards.md`
- [ ] T605 [P] Strip emojis from 6 `references/mobile/react-native/*.md` files
- [ ] T606 [P] Strip emojis from 6 `references/mobile/swift/*.md` files
- [ ] T607 [P] Strip emojis from 6 `assets/backend/**/*.md` checklist files
- [ ] T608 Verify: zero emoji H2 headings in `workflows-code--full-stack/`
- [ ] T609 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-6 -->

---

<!-- ANCHOR:phase-7 -->
## Phase 7: workflows-code--web-dev Skill (29 files)

- [ ] T700 [P] Strip emojis from `workflows-code--web-dev/SKILL.md`
- [ ] T701 [P] Strip emojis from `workflows-code--web-dev/README.md`
- [ ] T702 [P] Strip emojis from 13 `references/implementation/*.md` files
- [ ] T703 [P] Strip emojis from 4 `references/performance/*.md` files
- [ ] T704 [P] Strip emojis from 5 `references/standards/*.md` files
- [ ] T705 [P] Strip emojis from `references/verification/*.md` and `references/debugging/*.md` and `references/research/*.md`
- [ ] T706 [P] Strip emojis from 2 `references/deployment/*.md` files
- [ ] T707 [P] Strip emojis from 3 `assets/checklists/*.md` files
- [ ] T708 Verify: zero emoji H2 headings in `workflows-code--web-dev/`
- [ ] T709 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-7 -->

---

<!-- ANCHOR:phase-8 -->
## Phase 8: workflows-git Skill (10 files)

- [ ] T800 [P] Strip emojis from `workflows-git/SKILL.md`
- [ ] T801 [P] Strip emojis from `workflows-git/README.md`
- [ ] T802 [P] Strip emojis from 5 `references/*.md` files
- [ ] T803 [P] Strip emojis from 3 `assets/*.md` files
- [ ] T804 Verify: zero emoji H2 headings in `workflows-git/`
- [ ] T805 [P] Update SKILL.md version in frontmatter
<!-- /ANCHOR:phase-8 -->

---

<!-- ANCHOR:phase-9 -->
## Phase 9: Agent Files (32 files)

- [ ] T900 [P] Strip emojis from root agent files (`debug.md`, `context.md`, `speckit.md`, `research.md`, `write.md`, `review.md`, `orchestrate.md`, `handover.md`)
- [ ] T901 [P] Strip emojis from 8 `copilot/*.md` agent files
- [ ] T902 [P] Strip emojis from 8 `chatgpt/*.md` agent files
- [ ] T903 [P] Strip emojis from 8 `.provider-backups/**/*.md` files
- [ ] T904 Verify: zero emoji H2 headings in `agent/`
<!-- /ANCHOR:phase-9 -->

---

<!-- ANCHOR:phase-10 -->
## Phase 10: Command Files + Shared READMEs (24 files)

- [ ] T1000 [P] Strip emojis from `command/agent_router.md`
- [ ] T1001 [P] Strip emojis from 5 `command/memory/*.md` files
- [ ] T1002 [P] Strip emojis from 7 `command/spec_kit/*.md` files
- [ ] T1003 [P] Strip emojis from 4 `command/create/*.md` files
- [ ] T1004 [P] Strip emojis from `.opencode/README.md`
- [ ] T1005 [P] Strip emojis from `skill/README.md`
- [ ] T1006 [P] Strip emojis from `skill/scripts/README.md`
- [ ] T1007 [P] Strip emojis from `skill/scripts/SET-UP_GUIDE.md`
- [ ] T1008 Verify: zero emoji H2 headings in `command/` and shared files
<!-- /ANCHOR:phase-10 -->

---

<!-- ANCHOR:phase-11 -->
## Phase 11: Spec Folder Archives (25 files, P2)

- [ ] T1100 [P] Strip emojis from `specs/003-system-spec-kit/**/*.md` files
- [ ] T1101 [P] Strip emojis from `specs/002-commands-and-skills/**/*.md` files (excluding 005-remove-emojis-from-docs)
- [ ] T1102 [P] Strip emojis from `specs/001-anobel.com/**/*.md` files
- [ ] T1103 Verify: zero emoji H2 headings in `specs/` (excluding this spec folder)
<!-- /ANCHOR:phase-11 -->

---

<!-- ANCHOR:phase-12 -->
## Phase 12: Final Verification & Reporting

- [ ] T1200 [B] Run global grep for emoji H2 patterns across `.opencode/` (blocked on phases 1-11)
- [ ] T1201 [B] Run `validate_document.py` on all README.md files
- [ ] T1202 [B] Run `extract_structure.py` on all SKILL.md files
- [ ] T1203 [B] Verify semantic H3 emojis preserved in RULES sections
- [ ] T1204 [B] Verify body-text emojis preserved
- [ ] T1205 [B] Verify exempt files unchanged (AGENTS.md, root README.md)
- [ ] T1206 [B] Generate final summary report with file counts
- [ ] T1207 [B] Create changelog entries for all modified skills
<!-- /ANCHOR:phase-12 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Phase 12 verification passed (zero emoji H2 headings)
- [ ] All SKILL.md and README.md files pass validation
- [ ] Summary report generated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
