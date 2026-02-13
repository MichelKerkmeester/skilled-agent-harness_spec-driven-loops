# Tasks: README Rewrite

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] [Priority] Description (file path) → CHK-###`

---

## Phase 1: Research & Inventory

- [ ] T001 [P0] Read current README.md completely (README.md) → CHK-001
- [ ] T002 [P0] Inventory all 22 MCP tools and verify layer architecture (lib/) → CHK-001
- [ ] T003 [P0] Inventory all 10 agents and verify routing logic (.opencode/agent/) → CHK-001
- [ ] T004 [P] [P1] Inventory all 9 skills and verify auto-detection (.opencode/skill/) → CHK-001
- [ ] T005 [P] [P1] Inventory all 17 commands across 4 categories (.opencode/command/) → CHK-001
- [ ] T006 [P] [P1] Verify test statistics (118 files, 3,872 tests, 0 TS errors)
- [ ] T007 [P1] Document feature inventory in scratch/ for reference during writing

**Phase Gate**: All P0 inventory tasks complete; feature counts verified before writing begins

---

## Phase 2: Content Creation

- [ ] T008 [P0] Write Hero Section: name, one-line description, badges, 3-sentence value prop (~20 lines) (README.md) → CHK-020
- [ ] T009 [P0] Write Quick Start: installation + first commands in <30 lines (README.md) → CHK-020
- [ ] T010 [P0] Write Architecture Overview: ASCII diagram + component summary (~40 lines) (README.md) → CHK-020
- [ ] T011 [P0] Write The Memory Engine: 22 tools, 7 layers, cognitive features (8 subsystems), causal memory graph with example (~80 lines) (README.md) → CHK-020, CHK-100
- [ ] T012 [P0] Write The Agent Network: 10 agents, routing logic, enterprise patterns (~60 lines) (README.md) → CHK-020
- [ ] T013 [P0] Write The Gate System: 3 gates, dual-threshold validation, ASCII flow diagram (~40 lines) (README.md) → CHK-020
- [ ] T014 [P] [P1] Write Spec Kit Documentation: 4 levels, CORE+ADDENDUM templates, validation (~50 lines) (README.md) → CHK-020
- [ ] T015 [P] [P1] Write Skills Library: 9 skills with auto-detection triggers (~40 lines) (README.md) → CHK-020
- [ ] T016 [P] [P1] Write Commands: 17 commands in 4 categories (~30 lines) (README.md) → CHK-020
- [ ] T017 [P] [P1] Write Installation: essential steps + link to detailed guide (~30 lines) (README.md) → CHK-020
- [ ] T018 [P] [P1] Write What's Next / Contributing (~20 lines) (README.md) → CHK-020

**Phase Gate**: All 11 sections written; draft README complete → CHK-010

---

## Phase 3: Verification & Review

- [ ] T019 [P0] Cross-reference ALL feature claims against codebase (22 tools, 10 agents, 9 skills, 17 commands, 118 test files, 3,872 tests) → CHK-021, CHK-022
- [ ] T020 [P0] Test all code examples and commands mentioned in Quick Start and throughout README → CHK-021
- [ ] T021 [P] [P1] Review entire README for tone consistency — flag any dry/reference-manual sections or repetitive marketing → CHK-023
- [ ] T022 [P] [P1] Verify line count target: total 400-550 lines, section budgets within 20% of targets → CHK-020
- [ ] T023 [P] [P1] Test ASCII diagram rendering in GitHub markdown preview → CHK-023
- [ ] T024 [P1] Verify no duplicate before/after comparison tables (max 1 allowed) → CHK-020
- [ ] T025 [P2] Check all internal links and cross-references are valid

**Phase Gate**: All P0 verification tasks pass; all acceptance criteria verified → CHK-020

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 10 success criteria from spec.md verified
- [ ] All P0 checklist items verified with evidence
- [ ] README.md line count verified in 400-550 range

---

## Cross-References

- **Specification**: See `spec.md` (requirements REQ-001 through REQ-014)
- **Plan**: See `plan.md` (phases, milestones, effort estimates)
- **Verification**: See `checklist.md` (CHK items referenced by tasks)
- **Decisions**: See `decision-record.md` (D1-D8 decisions guiding structure)

---

## L2: TASK-CHECKLIST MAPPING

| Task ID | Checklist Item | Priority | Status |
|---------|----------------|----------|--------|
| T001-T007 | CHK-001 (Requirements documented) | P0 | [ ] |
| T008-T018 | CHK-020 (Acceptance criteria met) | P0 | [ ] |
| T011 | CHK-100 (Architecture decisions documented) | P0 | [ ] |
| T019 | CHK-021 (Manual testing complete), CHK-022 (Edge cases) | P0/P1 | [ ] |
| T020 | CHK-021 (Code examples tested) | P0 | [ ] |
| T021 | CHK-023 (Error scenarios / tone issues validated) | P1 | [ ] |
| T022 | CHK-020 (Line count acceptance criterion) | P1 | [ ] |

---

## L2: PHASE COMPLETION GATES

### Gate 1: Research & Inventory Complete
- [ ] All feature counts verified against codebase
- [ ] MCP tool layer architecture confirmed (L1-L7, 22 tools)
- [ ] Agent list confirmed (10 agents: 8 custom + 2 built-in)
- [ ] Skill list confirmed (9 skills with detection triggers)
- [ ] Command list confirmed (17 commands in 4 categories)
- [ ] Ready for content creation

### Gate 2: Content Creation Complete
- [ ] All 11 sections written with actual content
- [ ] No placeholder text remaining
- [ ] Draft assembled as single README.md
- [ ] Section line counts approximately match budgets
- [ ] Quality checks pass (CHK-010, CHK-011)

### Gate 3: Verification Complete
- [ ] All feature claims cross-referenced against codebase (CHK-021)
- [ ] Code examples tested and working (CHK-021)
- [ ] Tone review passed (CHK-023)
- [ ] Line count in 400-550 range (CHK-020)
- [ ] ASCII diagrams render correctly

---

## L2: BLOCKED TASK TRACKING

| Task ID | Blocker | Impact | Resolution |
|---------|---------|--------|------------|
| (none currently) | — | — | — |

---

## L3: ARCHITECTURE TASKS

### ADR Implementation

| Task ID | ADR Reference | Description | Status |
|---------|---------------|-------------|--------|
| T011 | ADR-001 (D1) | Lead with Memory Engine as crown jewel section | [ ] |
| T024 | ADR-002 (D2) | Ensure max 1 before/after comparison table | [ ] |
| T013 | ADR-003 (D3) | Gate System gets own section, not buried | [ ] |
| T017 | ADR-004 (D4) | Installation compressed to ~30 lines + link | [ ] |
| T010 | ADR-005 (D5) | Architecture diagram (ASCII) included | [ ] |
| T008-T018 | ADR-006 (D6) | Engaging tone maintained, no marketing repetition | [ ] |
| T012 | ADR-007 (D7) | Enterprise orchestration folded into Agent Network | [ ] |
| T022 | ADR-008 (D8) | Line count target ~450-500 (hard bounds 400-550) | [ ] |

---

## L3: MILESTONE TRACKING

| Milestone | Target | Tasks Required | Status |
|-----------|--------|----------------|--------|
| M1: Feature Inventory Complete | End of Phase 1 | T001-T007 | [ ] |
| M2: Draft README Complete | End of Phase 2 | T008-T018 | [ ] |
| M3: Verification Passed | End of Phase 3 | T019-T025 | [ ] |

---

## L3: RISK MITIGATION TASKS

| Task ID | Risk ID | Mitigation Action | Priority | Status |
|---------|---------|-------------------|----------|--------|
| T019 | R-001 | Cross-reference every feature claim against actual codebase | P0 | [ ] |
| T021 | R-002 | Review for completeness — flag any sections that feel too thin | P1 | [ ] |
| T023 | R-003 | Test ASCII diagrams in multiple renderers (GitHub, VS Code) | P1 | [ ] |
| T021 | R-004 | Tone review to catch marketing/reference oscillation | P1 | [ ] |
| T022 | R-005 | Verify section ordering feels logical, get feedback | P1 | [ ] |
| T017 | R-006 | Note placeholder for install guide link if guide doesn't exist yet | P1 | [ ] |

---

<!--
LEVEL 3 TASKS (~130 lines)
- Core + L2 verification + L3 architecture
- Task-to-checklist traceability
- Phase completion gates
- ADR-linked tasks and milestones
-->
