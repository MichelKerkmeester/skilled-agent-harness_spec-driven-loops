---
title: "Phase 3 tasks - skill doc alignment work groups A-D"
description: "REQ-mapped task ledger for the skill doc alignment: four ordered work groups (A assets, B references, C deletion plus dangler, D README plus playbook) inside the implementation phase, with setup preconditions and a verification phase. Each task cites its file and done-condition. All tasks pending; plan only."
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/008-sk-code-mobile-cli-mode/003-skill-doc-alignment"
    last_updated_at: "2026-08-27T00:00:00.000Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored REQ-mapped task groups A-D with per-file done-conditions."
    next_safe_action: "Operator approves; execute the groups in order in a Public worktree."
    blockers: []
    completion_pct: 0
trigger_phrases: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: sk-code-mobile-cli skill doc alignment

<!-- ANCHOR:notation -->
## TASK NOTATION

| Prefix | Meaning |
|---|---|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) - done-condition [REQ]`. All tasks are pending: this is a
plan-only packet and no edit has landed.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

Preconditions for the four work groups. No source edit happens here.

- [ ] T001 Read the three v4 templates (`sk-create-skill/assets/skill/skill-asset-template.md`, `skill-reference-template.md`, `skill-readme-template.md`) - done when the required section set of each is known.
- [ ] T002 Read the exemplar `SKILL_DIR/assets/token-retint-checklist.md` - done when the conformant OVERVIEW plus RELATED RESOURCES shape is captured as the asset model.
- [ ] T003 [P] Capture the current H2 inventory of all seven target docs plus `README.md` - done when a before list exists so only missing pieces are added.
- [ ] T004 Record the baseline `scan-skill-references.mjs` result against `SKILL.md` - done when the pre-deletion broken count is noted for comparison [REQ-006].
- [ ] T005 Get the OQ-1 operator decision on `dqi-baseline.md` (refresh scores or keep the dated disclaimer) - done when the decision is written into Group B [REQ-007].
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

The four ordered work groups. Structure-only groups A and B run first, the coupled deletion C next, the large
rewrite D last. No hard dependency between them, but the order is kept.

### Group A - Asset-template alignment [REQ-001]

Bring each file to `skill-asset-template.md`: add `## 1. OVERVIEW` (`### Purpose` + `### Usage`), trim the
intro to 1-2 sentences with no subsections, add an H1 `Title - Subtitle`, fold the bespoke unnumbered
`## THE GATE` into the numbered ALL-CAPS pattern with its content kept, add a final `## N. RELATED RESOURCES`.

- [ ] T010 [P] Align `SKILL_DIR/assets/runes-effect-audit-checklist.md` - done when it has OVERVIEW, a trimmed intro, an H1 subtitle, numbered ALL-CAPS H2s with the GATE folded in, and RELATED RESOURCES [REQ-001].
- [ ] T011 [P] Align `SKILL_DIR/assets/story-coverage-checklist.md` - same done-condition [REQ-001].
- [ ] T012 [P] Align `SKILL_DIR/assets/a11y-parity-checklist.md`, and ALL-CAPS the two lowercase H2 parentheticals (`## 1. AT-TREE (role / name / state)`, `## 5. CONTRAST (both themes)`) - done when the file conforms and both parentheticals are ALL-CAPS [REQ-001].
- [ ] T013 [P] Align `SKILL_DIR/assets/bem-rename-checklist.md` (H2s already numbered ALL-CAPS incl. `## 7. THE GATE`) - done when OVERVIEW, H1 subtitle, and RELATED RESOURCES are added without renumbering the already-correct gate [REQ-001].

### Group B - Reference-template alignment [REQ-002]

Bring each file to `skill-reference-template.md`: add `## 1. OVERVIEW` and a final
`## N. REFERENCES AND RELATED RESOURCES`, renumber sections as needed.

- [ ] T020 Align `SKILL_DIR/references/standards/code-standards.md` - done when its OVERVIEW carries Purpose, When-to-Use, Core-Principle, and Key-Sources, sections are renumbered, and REFERENCES AND RELATED RESOURCES is present [REQ-002].
- [ ] T021 Align `SKILL_DIR/references/quality/dqi-baseline.md` with the same OVERVIEW and REFERENCES, and apply the OQ-1 decision - done when the migration-era snapshot is either refreshed to post-migration scores or kept behind a dated disclaimer per the recorded decision, and the stale `docs/...` paths are handled accordingly [REQ-002, REQ-007].
- [ ] T022 Align `SKILL_DIR/references/quality/pi-remote-full-access-runtime-baseline.md` - done when its unnumbered sentence-case H2s (`## How to capture this baseline`, `## Rollback`, `## Baseline screenshots`, and the rest) are numbered ALL-CAPS, `## 1. OVERVIEW` is added, the blockquote intro becomes a 1-2 sentence plain intro, and REFERENCES is present [REQ-002].

### Group C - design-reference deletion and dangler repair [REQ-003, REQ-006]

One coupled change: delete the folder and fix its two live danglers together.

- [ ] T030 Delete `SKILL_DIR/references/design-reference/` (mobile-chat-apps teardown, current-UI map, competitor research, screens; ~9 files) - done when the folder no longer exists [REQ-003].
- [ ] T031 Edit `SKILL_DIR/SKILL.md`: remove the `references/design-reference/` bullet at line 80 - done when the bullet is gone [REQ-003].
- [ ] T032 Edit `SKILL_DIR/SKILL.md`: change the folder count at line 74 from "six" to "five" - done when the doc-set intro reads five [REQ-003].
- [ ] T033 Leave the two historical changelog mentions (`changelog/v0.1.1.0.md:19`, `changelog/v0.1.0.0.md:31`) untouched - done when a grep confirms both lines are unchanged [REQ-003].
- [ ] T034 Re-run `scan-skill-references.mjs` against `SKILL.md` - done when it reports `broken : 0` [REQ-006].

### Group D - README and playbook current-reality reconciliation [REQ-004, REQ-005]

Largest prose rewrite, run last so it reflects A through C.

- [ ] T040 Rewrite `SKILL_DIR/README.md` paths and stack to `app-mobile/`, `app-relay/`, `packages/pi-rpc-protocol/`, SvelteKit, and `app-mobile/src/app.css` (README lines 6, 18, 28, 48-49, 55, 118, 123, 136) - done when no pre-migration path or stack framing remains [REQ-004].
- [ ] T041 Repoint the stale design-system paths to `feature-catalog/design-system/token-library.md`, `feature-catalog/design-system/designer-editability.md`, and `app-mobile/catalog.html` (README lines 48-50) - done when the three targets resolve to current locations [REQ-004].
- [ ] T042 Bring `README.md` to `skill-readme-template.md`: add the one-line blockquote pitch after the H1 and reduce AT A GLANCE from seven rows to four - done when both template elements are present [REQ-004].
- [ ] T043 Fix `SKILL_DIR/manual-testing-playbook/manual-testing-playbook.md` line 23 (old `apps/pi-remote-web/`) - done when the path reads the current `app-mobile/` location [REQ-004].
- [ ] T044 Guard the negative controls across T040-T043 - done when a literal grep of `README.md` and `manual-testing-playbook.md` returns zero matches for `apps/pi-remote-web`, `style.css`, and `App.tsx`, and no other pre-migration path or stack string remains [REQ-005].
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

The objective proof plan, run from the final state.

- [ ] T050 Confirm all seven target docs carry `## 1. OVERVIEW`, a final RELATED-RESOURCES or REFERENCES section, and ALL-CAPS numbered H2s - done when an H2 grep of each file shows the pattern [SC-001].
- [ ] T051 Confirm `design-reference/` is gone and `scan-skill-references.mjs` reports `broken : 0` - done when both hold [SC-002, REQ-006].
- [ ] T052 Confirm the README and playbook contain none of the pre-migration path or stack strings and none of the three negative controls - done when the literal grep returns nothing [SC-003, REQ-005].
- [ ] T053 Confirm `README.md` matches the readme template (blockquote pitch after H1, 4-row AT A GLANCE) - done when both are present [SC-004].
- [ ] T054 Run the skill's `validate_document.py` on each edited doc when present - done when each exits 0, or the validator's absence is recorded [SC-005, REQ-008].
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All P0 tasks (Groups A-D and their verification) are `[x]` with evidence.
- [ ] REQ-007 is resolved or an approved P1 deferral is recorded.
- [ ] `scan-skill-references.mjs` reports `broken : 0` and the negative-control grep returns nothing.
- [ ] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` remain synchronized.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- `spec.md` - requirements REQ-001 through REQ-008 and the success criteria.
- `plan.md` - the four-workstream approach and ordering rationale.
- `checklist.md` - the QA items mapping to the proof plan.
<!-- /ANCHOR:cross-refs -->
