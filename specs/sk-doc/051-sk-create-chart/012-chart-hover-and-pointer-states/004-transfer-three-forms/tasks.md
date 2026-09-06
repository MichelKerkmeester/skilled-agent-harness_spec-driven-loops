---
title: "Tasks: Transfer the pointer mechanism to stacked-bars, daily-line and bar-line-composed"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Transfer the pointer mechanism to stacked-bars, daily-line and bar-line-composed

<!-- SPECKIT_LEVEL: 2 -->

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

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirmed: corpus run on untouched files prints `RESULT: PASSED` (interaction-hygiene 120/0, interaction-state 60/0, number-format 180/0; grouped-bars carries the phase-3 excerpt and passes inside it). Baseline transcript: /tmp/phase004-baseline-structural.txt (`scripts/check-corpus.cjs`)
- [x] T002 [P] All three copied to /tmp/phase004-prechange/ with bytes-before.txt (23218 / 22130 / 28181); restore discipline followed throughout, no `git checkout --` used (`assets/templates/stacked-bars.html`, `assets/templates/daily-line.html`, `assets/templates/bar-line-composed.html`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Added verbatim: tooltip CSS block, hygiene line already present, `[data-chart-tooltip]` transition guard inside the reduced-motion block, `<g data-chart-tooltip id="tip-stacked-bars">` after `<desc>`, card script with `TIP_ROWS = 1`, full listener block (pointermove/pointerleave + click-pin + document dismissal) ending in `svg.appendChild(tipLayer)` (`assets/templates/stacked-bars.html`)
- [x] T004 All 12 segments registered: name `SEGMENTS[s] + ', ' + d.label`, row `['Value', fmt(v)]` — restates the printed number at/above the 22-unit gate (printed-flag arithmetic: T T T T T T T T F F T F), supplies it below (`assets/templates/stacked-bars.html`)
- [x] T005 Same transfer, id `tip-daily-line`, `TIP_ROWS = 1` (`assets/templates/daily-line.html`)
- [x] T006 All 28 finite days registered as `Day N` / `['Orders', fmt(v)]`, plus the `.mark` crown registered for day 11, which covers its own dot; the finite filter keeps a gapped day unregistered (`assets/templates/daily-line.html`)
- [x] T007 Same transfer, id `tip-bar-line-composed`, `TIP_ROWS = 2` (`assets/templates/bar-line-composed.html`)
- [x] T008 All 8 columns (yCount) and 8 rate dots (yRate) registered; both rows ladder-tagged: `['Count (left scale)', fmt(d.count)]`, `['Rate (right scale)', fmt(d.rate, 1)]` (`assets/templates/bar-line-composed.html`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Manual walks were driven by a CDP pointer driver (headless Chrome, Node built-in WebSocket, no dependencies) issuing real mouse events; both colour schemes pinned with the checker's own `--blink-settings` flags. Summary: hover 52/52, 118/118, 68/68; pin 8/8 ×3; reduced-motion 3/3 ×3; no-script byte-equal page text vs pre-change copies; card colours equal palette tokens in both schemes on all three forms; console clean on every walk; ~87–92% of pixels differ light vs dark (dark palette reaches the paint).

- [x] T009 Structural run per file change plus final `--render`: literal `RESULT: PASSED`, exit 0, 29 checks all 0 failures; interaction-hygiene 120/0, interaction-state 60/0, number-format 180/0; render/dark-render/settled-render all green (`scripts/check-corpus.cjs`)
- [x] T010 Hover walk stacked-bars: 12/12 open, names/rows match the data table, right-edge card flips inside the frame (52/52)
- [x] T011 Pin walk stacked-bars: tap pins, tap re-pins, second tap clears, tap outside clears, hover inert while pinned (8/8)
- [x] T012 Reduced-motion stacked-bars: computed `transition-duration: 0s` on the card, opens with no fade (3/3)
- [x] T013 No-script stacked-bars: body innerText and figure texts identical to the pre-change file; 0 marks registered; tooltip group ships empty
- [x] T014 Gate check stacked-bars: card supplies 6/7/4 for segments below the gate, restates printed values above it, agreeing with the table
- [x] T015 Hover walk daily-line: 29/29 (28 dots + the emphasised crown), 118/118 checks
- [x] T016 Pin walk daily-line (8/8)
- [x] T017 Reduced-motion daily-line (3/3)
- [x] T018 No-script daily-line: identical page text vs pre-change
- [x] T019 Hover walk bar-line-composed: 16/16 (8 columns + 8 dots), 68/68 checks, right-edge flip verified
- [x] T020 Pin walk bar-line-composed (8/8)
- [x] T021 Reduced-motion bar-line-composed (3/3)
- [x] T022 No-script bar-line-composed: identical page text vs pre-change
- [x] T023 Every card on bar-line-composed reads `Count (left scale)` and `Rate (right scale)` — verified for all 16 marks in the hover walk
- [x] T024 No decoration intercepts: behavioural proof in the walks (correct card on every mark, including tall stacked segments under their printed value, dots under the printed low, W6–W8 columns under the crossing rate line) plus `pointer-events: none` added to `.on-dark`/`.on-light`, `.note` and `.rate-line` with WHY comments, mirroring box-plot
- [x] T025 Byte delta (wc -c): stacked-bars 23218→30084 (+6866), daily-line 22130→29168 (+7038), bar-line-composed 28181→35377 (+7196); none matches the donor's 7016, as the spec's NFR-P02 anticipated
- [x] T026 Negative control on the real stacked-bars.html in place: `[data-chart-tooltip]` guard misspelled to `.tip` via sed on the live file → `motion: 1 failure(s)` naming the file and selector, `RESULT: FAILED`, exit 1; restored from /tmp copy, `diff` byte-identical to pre-break state, corpus back to `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T001–T026, each with its evidence inline)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (3 forms × 5 walks × 2 pinned schemes; both traps guarded)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (read and followed this session)
- [x] CHK-002 [P0] Technical approach defined in plan.md (read and followed this session)
- [x] CHK-003 [P1] Dependencies identified and available: phase 3's excerpt is in the corpus and passes inside it; checker and Chrome present
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: the packet ships no linter; `script-parses` 30/0 and the full corpus gate are the format authorities here — both green
- [x] CHK-011 [P0] No console errors or warnings: collected over CDP on every walk; all three forms report clean
- [x] CHK-012 [P1] Error handling: excerpt guards carried (Number.isFinite filter, em dash for a missing reading, closest-guarded listeners)
- [x] CHK-013 [P1] Code follows project patterns: donor excerpt verbatim except id/TIP_ROWS/registration; corpus conventions kept (palette tokens, mono figures, WHY comments)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met: REQ-001..006 implemented and verified; SC-001/002/003 evidenced in Phase 3 above; packet-level AC reconciliation stays phase 8's deliverable per spec §3
- [x] CHK-021 [P0] Manual testing complete: 3 forms × hover/pin/reduced/no-script/colours × both pinned schemes
- [x] CHK-022 [P1] Edge cases tested: missing rate → 15 marks (8 columns + 7 dots), card prints the table's em dash, no mark on the gap; missing day → 28 marks, no card on the gap; gate boundary: no shipped segment sits exactly at the 22-unit gate (nearest printed pixel height 23.2) and every printed segment's card agreed with its label
- [x] CHK-023 [P1] Error scenarios validated: no-script renders identical text on all three; scripted/unscripted parity proven against pre-change copies
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] No findings were raised in this phase; nothing to classify
- [x] CHK-FIX-002 [P0] No findings; no producer inventory owed
- [x] CHK-FIX-003 [P0] Consumers of the three files are the corpus checker and the catalog; both re-run green on the final state
- [x] CHK-FIX-004 [P0] No security/path/parser/redaction fix in this phase; not applicable
- [x] CHK-FIX-005 [P1] Matrix listed before completion: 3 files × hover/pin/reduced/no-script/colours × light/dark, plus the two gap variants — run in that shape
- [x] CHK-FIX-006 [P1] Hostile environment variant executed: both colour schemes pinned explicitly (the machine-inheritance trap); reduced-motion emulated via CDP
- [x] CHK-FIX-007 [P1] Evidence pinned to /tmp transcripts and the final working-tree diffs; the packet is intentionally uncommitted per the no-commit instruction
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: grep over the three files finds only the pre-existing palette-token prose; no credential shapes
- [x] CHK-031 [P0] Input validation: data-block values pass the Number.isFinite guards before any mark or card is built
- [x] CHK-032 [P1] Auth/authz: not applicable — self-contained static files with no network surface (no-external enforces it)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized: tasks.md carries the executed evidence; plan.md's DoD checkboxes are outside this phase's edit scope and mirror these results
- [x] CHK-041 [P1] Code comments adequate: every added comment states the durable why; no artifact labels or spec paths in code
- [x] CHK-042 [P2] README updated: no checker or contract behaviour changed, so scripts/README.md needs nothing
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: every temp artifact of this session lives in /tmp (phase004-*); the repo scratch/ was not written
- [x] CHK-051 [P1] scratch/ cleaned before completion: nothing was added by this session; the pre-existing phase-3 record stays
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-05
<!-- /ANCHOR:summary -->

---
