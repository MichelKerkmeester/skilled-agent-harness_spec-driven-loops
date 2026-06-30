---
title: "Tasks: NAMING LINT + DOC COMPLETENESS design-system artifact contract"
description: "Additive task list to ship a conditional naming/doc-completeness contract page + deterministic lint for token/component/library artifacts: passes token_starter.md, bites a violation, exempts non-system outputs, leaves the OVERVIEW backlog and hubRoute 23/5/0 untouched."
trigger_phrases:
  - "d6-r11 naming lint doc completeness"
  - "naming lint design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/011-naming-lint-doc-completeness"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every naming/doc lint task complete with per-task evidence"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-foundations/references/design_system_artifact_contract.md"
      - ".opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py"
      - ".opencode/skills/sk-design/design-foundations/scripts/fixtures/naming_doc/violating.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: NAMING LINT + DOC COMPLETENESS design-system artifact contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture baseline: confirm no `design_system_artifact_contract.md` in references and no `naming_doc_check.py` in scripts (`.opencode/skills/sk-design/design-foundations/`) [10m] — Evidence: baseline in plan §1; neither file existed pre-build.
- [x] T002 Enumerate the must-pass set: list every `--token` name and every content heading in `assets/token_starter.md` (`.opencode/skills/sk-design/design-foundations/assets/token_starter.md`) [10m] — Evidence: 25 token names + COLOR RAMP/TYPE SCALE/SPACING SCALE/HAND OFF.
- [x] T003 Record read-only hashes for `token_starter.md`, `design_token_vocabulary.md`, `mode-registry.json` to prove they stay unchanged (`.opencode/skills/sk-design/`) [5m] — Evidence: `git status` shows all three byte-unchanged (clean).
- [x] T004 Resolve the three design decisions: applicability marker, regex shape (per-tier vs category-led + allowlist), fixture-pair vs scratch probe (see plan §6) [15m] — Evidence: marker = artifactKind-or-table, per-tier regexes, committed fixture pair.
- [x] T005 Author the contract page: token tiers + per-tier naming regexes derived to pass every `token_starter.md` name (`.opencode/skills/sk-design/design-foundations/references/design_system_artifact_contract.md`) [25m] — Evidence: 8 tier rows; `token_starter.md` exits 0.
- [x] T006 Add required-doc-headings per artifact kind (token kind = subset of `token_starter.md` headings: ramp/type/spacing/handoff; component/library defined but dormant) (`.opencode/skills/sk-design/design-foundations/references/design_system_artifact_contract.md`) [15m] — Evidence: §2 Required Headings table covers token/component/library.
- [x] T007 Add a compliant worked example + a labelled anti-example; keep the page evergreen (no spec id/path) (`.opencode/skills/sk-design/design-foundations/references/design_system_artifact_contract.md`) [10m] — Evidence: §3 Compliant Shape + §4 Anti-Examples; grep finds no spec id/path.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Scaffold + applicability gate
- [x] T008 Scaffold the lint per the sibling Python convention: file arg + `--json`; exit 0/1/2; reuse `_clean_cell`/row-parse idioms (`.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py`) [25m] — Evidence: `_clean_cell`/`_split_table_row` present; `main()` returns 0/1/2; `py_compile` OK.
- [x] T009 Implement the applicability gate: detect a design-system-artifact marker (declared `--token` props and/or `artifactKind` frontmatter); no marker → exit 0 NOT_APPLICABLE (`.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py`) [25m] — Evidence: `_detect_artifact`; `design_token_vocabulary.md` → NOT_APPLICABLE, exit 0.
- [x] T010 Extract declared `--token` names from the artifact and bind each to its tier (`.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py`) [20m] — Evidence: `_find_token_table_declarations`/`_find_all_token_declarations` + `_match_token_tier`; 25 names tiered on `token_starter.md`.
- [x] T011 Validate each name against its tier regex (or category-led shape + allowlist); collect offenders (`.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py`) [25m] — Evidence: `_check_tokens` over 9 tier regexes; `violating.md` reports 3 offenders with reasons.

### Doc-completeness lint
- [x] T012 Check each required heading is present, numeric-prefix tolerant (`^#{1,6}\s+(?:\d+\.\s+)?<NAME>\s*$`); collect missing headings (`.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py`) [20m] — Evidence: `_check_headings` + `_normalize_heading`; `violating.md` reports missing SPACING SCALE.
- [x] T013 Emit the result (text + `--json`) and the exit code (0 pass/exempt, 1 violation, 2 usage/read); keep all comments evergreen — no spec path/phase id (`.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py`) [15m] — Evidence: `_print_text` + `--json` branch; grep finds no spec id/path.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Pass-on-clean: run the lint against `assets/token_starter.md`; tune the contract/regex until exit 0 (all names conform, all required headings present) (`.opencode/skills/sk-design/design-foundations/`) [15m] — Evidence: `token_starter.md` → 25 names, 4 headings, PASS, exit 0.
- [x] T015 [P] Author the fixture pair: `compliant.md` passes, `violating.md` has malformed names + a missing required heading (`.opencode/skills/sk-design/design-foundations/scripts/fixtures/naming_doc/`) [15m] — Evidence: `compliant.md` exit 0; `violating.md` exit 1.
- [x] T016 Naming bite: run against the malformed-name fixture; confirm exit 1 with the offending name reported (`.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py`) [10m] — Evidence: `violating.md` reports `--PrimaryColor`/`--color_primary`/`--clr-primary`, exit 1.
- [x] T017 Doc-completeness bite: run against the missing-heading fixture; confirm exit 1 with the missing heading reported (`.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py`) [10m] — Evidence: `violating.md` reports `missing heading SPACING SCALE`, exit 1.
- [x] T018 [P] Exemption: run against a non-system reference doc; confirm exit 0 NOT_APPLICABLE (`.opencode/skills/sk-design/shared/design_token_vocabulary.md`) [5m] — Evidence: `design_token_vocabulary.md` → NOT_APPLICABLE, exit 0.
- [x] T019 Separate-backlog non-flag: confirm the lint does NOT flag the ~22 skill/reference docs lacking `## OVERVIEW` (exempted by the applicability gate) (`.opencode/skills/sk-design/`) [10m] — Evidence: sk-design `SKILL.md` → NOT_APPLICABLE, exit 0.
- [x] T020 No-regression: confirm `hub-router.json` / `mode-registry.json` untouched, `token_starter.md` byte-unchanged, `hubRoute` 23/5/0 held (`.opencode/skills/sk-design/`) [10m] — Evidence: `git status` shows only 3 new untracked files; routing + `token_starter.md` clean.
- [x] T021 (Decision, P2) The optional `design-foundations/SKILL.md` wiring line was NOT taken (`.opencode/skills/sk-design/design-foundations/SKILL.md`) [5m] — Evidence: scope stays additive-only; `git status` shows no SKILL.md change.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` — Evidence: T001-T021 all complete above.
- [x] No `[B]` blocked tasks remaining — Evidence: no `[B]` markers in this file.
- [x] Lint passes on `token_starter.md` (exit 0); bites on a malformed name AND a missing heading (exit 1) — Evidence: `token_starter.md` exit 0; `violating.md` exit 1.
- [x] Non-system output exempt (exit 0 NOT_APPLICABLE); the ~22 OVERVIEW-lacking docs are NOT flagged — Evidence: `design_token_vocabulary.md` + sk-design `SKILL.md` → NOT_APPLICABLE, exit 0.
- [x] `hub-router.json` / `mode-registry.json` / `token_starter.md` byte-unchanged; `hubRoute` 23/5/0 held — Evidence: `git status` shows only 3 new untracked files; routing unaffected by construction.
- [x] Evergreen [HARD]: no spec id/path in contract page, lint, or fixtures (no SKILL.md line was added) — Evidence: grep of the 3 new files finds no spec id/path.
- [x] Checklist.md fully verified — Evidence: all CHK items marked with evidence; P0 10/10, P1 9/9, P2 2/2.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Additive: new contract page + new lint script (+ optional fixtures, optional SKILL.md line)
- Passes token_starter.md, bites a violation, exempts non-system outputs
- Leaves the separate OVERVIEW backlog and hubRoute 23/5/0 untouched
-->
