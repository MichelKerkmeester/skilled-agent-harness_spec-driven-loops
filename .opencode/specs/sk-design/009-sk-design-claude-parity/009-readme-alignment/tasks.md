---
title: "Tasks: Phase 009 — README Alignment (Hub + Sub-Skills)"
description: "Complete Level 2 task list for updating the sk-design hub README.md and its five mode-packet README.md files to match the shipped Phase 002-005 reality."
trigger_phrases:
  - "tasks"
  - "readme alignment"
  - "sk-design readme alignment"
  - "mode packet readme"
importance_tier: "normal"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-design/009-sk-design-claude-parity/009-readme-alignment/"
    last_updated_at: "2026-07-06T05:10:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Verified all six README edits are real and complete; marked T001-T025 done with evidence."
    next_safe_action: "Start Phase 010 feature-catalog-completeness"
---
# Tasks: Phase 009 — README Alignment (Hub + Sub-Skills)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| unchecked marker | Open task; every task below is open, this phase has not started |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or evidence target) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Entry Gate and Live-State Audit

- [x] T001 Confirm Phase 008 gate closure or record explicit user approval to proceed without it (Phase 008 evidence) [10m]
  - Evidence target: Phase 008 `checklist.md` gate status, or a recorded approval note in `implementation-summary.md` once created.
- [x] T002 Read current `sk-design` hub before editing (`.opencode/skills/sk-design/SKILL.md`) [10m]
  - Evidence target: confirm the live section numbers for the hub-shell contract (intake, visible plan, proof gates, verifier cadence, transport-vs-taste) before citing them in the README.
- [x] T003 Read current mode registry before editing (`.opencode/skills/sk-design/mode-registry.json`) [10m]
  - Evidence target: confirm each mode's `proceduresPath` and, for `design-md-generator`, its `aliases` array as the frontmatter `trigger_phrases` source.
- [x] T004 List `benchmark/` and `manual_testing_playbook/` contents at the hub root (`.opencode/skills/sk-design/benchmark/`, `.opencode/skills/sk-design/manual_testing_playbook/`) [10m]
  - Evidence target: confirm `benchmark/baseline/` and `benchmark/after-009/` exist, and confirm the current scenario/category count in `manual_testing_playbook/manual_testing_playbook.md`.
- [x] T005 List each of the five modes' `procedures/` directories (`design-interface/procedures/`, `design-foundations/procedures/`, `design-motion/procedures/`, `design-audit/procedures/`, `design-md-generator/procedures/`) [15m]
  - Evidence target: confirm the current card count and file names per mode before drafting each README edit.
- [x] T006 Re-read `design-motion/manual_testing_playbook/manual_testing_playbook.md` Section 1 to confirm the live scenario count and category list [10m]
  - Evidence target: confirm the count matches (or has drifted from) the 10-scenarios/6-categories figure cited in `spec.md`, since the live count is the source of truth at implementation time.
- [x] T007 Record any logic-sync conflict between this phase's planning docs and the live hub/mode-packet tree before writing (`checklist.md` or a phase note) [10m]
  - Evidence target: name the conflicting fact and the prevailing truth, if any conflict is found.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Hub README

- [x] T008 Add `benchmark/` and `manual_testing_playbook/` references to `.opencode/skills/sk-design/README.md` (`RELATED DOCUMENTS` or an added section) [20m]
  - Evidence target: both paths link and resolve; the description states what each directory holds (baseline plus after-009 skill-benchmark reports; a six-category, 24-scenario manual playbook).
- [x] T009 Name the Phase 002 hub-shell contract sections by number in `.opencode/skills/sk-design/README.md` Section 4 [20m]
  - Evidence target: `Manager Intake Before Routing`, `Visible Plan Before Design or Build Work`, `Proof Gates and Verifier Cadence`, and the transport-vs-taste separation are each attributed to their live `SKILL.md` section number.

### Mode READMEs

- [x] T010 [P] Add a `procedures/` reference to `design-interface/README.md` (6 cards) [15m]
  - Evidence target: `RELATED DOCUMENTS` (or `HOW IT WORKS`) names the folder and, where useful, individual card files.
- [x] T011 [P] Add a `procedures/` reference to `design-foundations/README.md` (3 cards) [15m]
  - Evidence target: same shape as T010, scoped to `design-foundations/procedures/`.
- [x] T012 [P] Add a `procedures/` reference to `design-motion/README.md` (1 card) and correct the VERIFICATION scenario count and category list [20m]
  - Evidence target: the `procedures/` reference is added, and the VERIFICATION section's scenario count and category names match the live playbook confirmed in T006.
- [x] T013 [P] Add a `procedures/` reference to `design-audit/README.md` (2 cards) [15m]
  - Evidence target: same shape as T010, scoped to `design-audit/procedures/`.
- [x] T014 Add a YAML frontmatter block to `design-md-generator/README.md` (title, description, trigger_phrases, version) [20m]
  - Evidence target: `trigger_phrases` are sourced from a subset of `mode-registry.json`'s `md-generator` `aliases` array; `version` starts at a first value consistent with sibling numbering.
- [x] T015 Add a `procedures/` reference to `design-md-generator/README.md` (1 card) [10m]
  - Evidence target: same shape as T010, scoped to `design-md-generator/procedures/`.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Structural and Canon Checks

- [x] T016 Run `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` for each of the six edited files and fix any reported issue in that file only [20m]
  - Evidence target: zero issues per file, recorded per README.
- [x] T017 Run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` and confirm 0 failures, 0 warnings [10m]
  - Evidence target: exit code and failure/warning counts recorded.
- [x] T018 Confirm every newly added link resolves on disk (`procedures/`, `benchmark/`, `manual_testing_playbook/` paths) [15m]
  - Evidence target: `Read`/`Glob` confirmation per cited path.
- [x] T019 Review each edited passage against Human Voice Rules (no em dashes, semicolons, Oxford commas, banned words, or setup phrases) [15m]
  - Evidence target: manual pass over each of the six diffs.

### Scope and Regression

- [x] T020 Run scoped `git diff --name-only` and confirm only the six README files plus this phase folder changed [10m]
  - Evidence target: diff output listing only the expected paths.
- [x] T021 Confirm no `SKILL.md`, `mode-registry.json`, `hub-router.json`, `procedures/**`, `shared/**`, `benchmark/**`, or `manual_testing_playbook/**` content file was edited [10m]
  - Evidence target: scoped diff for those paths returns no output.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification and Handoff

### Documentation

- [x] T022 Update `checklist.md` with concrete evidence per item once implementation runs [15m]
  - Evidence target: every P0/P1/P2 row carries a file, command, or diff citation.
- [x] T023 Regenerate `description.json` and `graph-metadata.json` last, after all content edits land (`node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`) [10m]
  - Evidence target: metadata regenerated only after content is final, per the packet's own metadata-regeneration order.
- [x] T024 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and record the exit code [10m]
  - Evidence target: exit code and any warning text recorded; a sole `CONTINUITY_FRESHNESS` uncommitted-changes warning is acceptable if no commit is made.
- [x] T025 Add `implementation-summary.md` once the work above is actually complete, not before [10m]
  - Evidence target: the file records completed status only after T008-T024 have real evidence, matching the completion-verification rule.

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Phase 008 gate is confirmed closed (or explicit user approval is recorded) before implementation begins.
- [x] Hub `README.md` names `benchmark/` and `manual_testing_playbook/`, and cites the hub-shell contract sections by number.
- [x] All five mode `README.md` files name their own `procedures/` folder.
- [x] `design-motion/README.md`'s VERIFICATION section matches the live playbook's scenario count and category list.
- [x] `design-md-generator/README.md` carries a frontmatter block matching sibling convention.
- [x] README validator reports zero issues for all six files.
- [x] Parent-skill canon check remains a clean pass (0 failures, 0 warnings).
- [x] No non-README file was edited.
- [x] `checklist.md` reflects real evidence, not placeholder text.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Predecessor Gate**: See `../008-smart-routing-optimization/` (not yet created at authoring time)

<!-- /ANCHOR:cross-refs -->
