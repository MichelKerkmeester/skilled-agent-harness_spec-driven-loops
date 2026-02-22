---
title: "Tasks: sk-code--opencode refinement"
description: "Execution sequence for implementing, verifying, and closing the 043 refinement with a mandatory global quality sweep."
trigger_phrases:
  - "tasks"
  - "sk-code--opencode refinement"
  - "global quality sweep"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: sk-code--opencode refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

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

---

<!-- ANCHOR:phase-0 -->
## Phase 0: Analysis Complete (Locked Inputs)

- [x] T000 Confirm active Level 3+ spec folder and scope lock (`.opencode/specs/002-commands-and-skills/043-sk-code-opencode-refinement/spec.md`)
- [x] T001 Read and extract implementation constraints from research (`.opencode/specs/002-commands-and-skills/043-sk-code-opencode-refinement/research.md`)
- [x] T002 Read and map scratch findings into execution signals (`.opencode/specs/002-commands-and-skills/043-sk-code-opencode-refinement/scratch/*.md`)
- [x] T003 Create Level 3+ execution docs from templates (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `global-quality-sweep.md`)
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Decision Lock and Implementation Setup

- [ ] T010 Lock policy tradeoffs in ADRs before code-standard edits (`decision-record.md`)
- [ ] T011 Freeze in-scope file list from spec section 3 into working notes (`spec.md`)
- [ ] T012 Define verification command bundle and file-level assertions (`plan.md`, `global-quality-sweep.md`)
- [ ] T013 Define optional `sk-code--review` trigger criteria (`decision-record.md`, `tasks.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Core Policy Implementation (`sk-code--opencode`)

- [ ] T020 Update reduced inline-comment policy and AI semantics contract (`.opencode/skill/sk-code--opencode/SKILL.md`)
- [ ] T021 Update shared parse-first comment policy and examples (`.opencode/skill/sk-code--opencode/references/shared/universal_patterns.md`)
- [ ] T022 Reinforce numbered ALL-CAPS section invariants (`.opencode/skill/sk-code--opencode/references/shared/code_organization.md`)
- [ ] T023 [P] Align JavaScript style guide with new comment policy (`.opencode/skill/sk-code--opencode/references/javascript/style_guide.md`)
- [ ] T024 [P] Align TypeScript style guide with new comment policy (`.opencode/skill/sk-code--opencode/references/typescript/style_guide.md`)
- [ ] T025 [P] Align Python style guide with new comment policy (`.opencode/skill/sk-code--opencode/references/python/style_guide.md`)
- [ ] T026 [P] Align Shell style guide with new comment policy (`.opencode/skill/sk-code--opencode/references/shell/style_guide.md`)
- [ ] T027 [P] Align Config style guide with JSONC boundaries and comment semantics (`.opencode/skill/sk-code--opencode/references/config/style_guide.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Checklist Hardening and Optional Review Alignment

- [ ] T030 Add KISS/DRY and full SOLID checks to universal checklist (`.opencode/skill/sk-code--opencode/assets/checklists/universal_checklist.md`)
- [ ] T031 [P] Add JS checklist policy checks (`.opencode/skill/sk-code--opencode/assets/checklists/javascript_checklist.md`)
- [ ] T032 [P] Add TS checklist policy checks (`.opencode/skill/sk-code--opencode/assets/checklists/typescript_checklist.md`)
- [ ] T033 [P] Add Python checklist policy checks (`.opencode/skill/sk-code--opencode/assets/checklists/python_checklist.md`)
- [ ] T034 [P] Add Shell checklist policy checks (`.opencode/skill/sk-code--opencode/assets/checklists/shell_checklist.md`)
- [ ] T035 [P] Add Config checklist policy checks (`.opencode/skill/sk-code--opencode/assets/checklists/config_checklist.md`)
- [ ] T036 Evaluate optional review alignment trigger via mismatch evidence (`.opencode/skill/sk-code--review/SKILL.md`)
- [ ] T037 [Conditional] Apply minimal review router/checklist alignment edits if triggered (`.opencode/skill/sk-code--review/SKILL.md`, `.opencode/skill/sk-code--review/references/quick_reference.md`, `.opencode/skill/sk-code--review/references/code_quality_checklist.md`, `.opencode/skill/sk-code--review/references/solid_checklist.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification (All Changed Files)

- [ ] T040 Run comment policy and AI semantics assertions (`plan.md` command set item 2)
- [ ] T041 Run header invariant assertions across shared and language guides (`plan.md` command set item 3)
- [ ] T042 Run checklist KISS/DRY/SOLID assertions (`plan.md` command set item 4)
- [ ] T043 Run optional review alignment assertions when review files changed (`plan.md` command set item 5)
- [ ] T044 Run spec validation script for this folder (`.opencode/skill/system-spec-kit/scripts/spec/validate.sh`)
- [ ] T045 Update checklist evidence slots with command output references (`checklist.md`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Mandatory Global Quality Sweep and Closure

- [ ] T050 Execute Global Testing Round and record EVT-001 (`global-quality-sweep.md`)
- [ ] T051 Execute Global Bug Detection Sweep and record EVT-002 (`global-quality-sweep.md`)
- [ ] T052 Execute `sk-code--opencode` Compliance Audit and record EVT-003 (`global-quality-sweep.md`)
- [ ] T053 Execute Conditional Standards Update Pathway decision and record EVT-004 (`global-quality-sweep.md`)
- [ ] T054 Confirm closure gate thresholds `P0=0` and `P1=0` (`global-quality-sweep.md`)
- [ ] T055 Sync spec docs and final task/checklist status (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Mandatory global quality sweep phase completed for all changed files
- [ ] Closure gate confirmed with unresolved defects `P0=0`, `P1=0`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Global Sweep**: See `global-quality-sweep.md`
<!-- /ANCHOR:cross-refs -->
