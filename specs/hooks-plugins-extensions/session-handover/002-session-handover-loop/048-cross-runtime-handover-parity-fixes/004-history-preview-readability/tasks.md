---
title: "Tasks: Phase 4: history-preview-readability"
description: "Ordered tasks for readable model-turn previews in the history engine and a live Pi hop on DeepSeek Flash at max thinking."
trigger_phrases:
  - "history preview readability tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: history-preview-readability

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`HX` is `.skilled/hooks/session-handover/history`. Briefs live in `../scratch/briefs/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline (`HX`). Verify: `npm test` prints its test count with none failing. Evidence: `npm test` in the history engine printed `Tests  140 passed (140)` before the change.
- [x] T002 Write the brief for this phase (`../scratch/briefs/10-readable-turn-previews.md`). Verify: one change, one test. Evidence: `../scratch/briefs/10-readable-turn-previews.md`: one function, one test, then the build.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Readable `previewFor` and its test (`HX/lib/navigator.ts`, `HX/tests/history-search-browse.vitest.ts`). Verify: the new test passes and fails with the old function restored. Evidence: `previewFor` builds from text blocks and each tool call's name and arguments. The new browse test passes, and with the old function restored it fails: `1 failed | 140 passed`. After review, `itemText` uses the same rendering, and a search test fails on the old `itemText` (`1 failed | 141 passed`).
- [x] T004 Rebuild the engine (`HX/dist/`). Verify: `npm run build` exits 0. Evidence: `npm run build` exits 0, and `dist/navigator.js` carries the new `previewFor`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the history engine and handover suites from the final state. Verify: both print zero failures. Evidence: history engine `Tests  142 passed (142)`; the handover suite result is recorded after the merge with main.
- [x] T006 Live Pi hop on DeepSeek Flash at max thinking (`PI_ROUTE=deepseek ../scratch/harness/live-hop.sh pi`). Verify: `score.cjs` prints `5/5`, the side word is reported and absent from the note. Evidence: `../scratch/runs/live3-pi` on `--provider llmgateway --model deepseek-v4.1-flash-1017 --thinking max` scored 5/5 with `sideWordStated: true` and `sideWordInNote: false`. The receiver browsed with count 10 and loaded the sender's first turn, whose result held the side word.
- [x] T007 Review of the change. Verify: no P0 or P1 left open. Evidence: no P0. One P1, search excerpts still serialized whole tool-call blocks, fixed in `itemText` through a shared `turnText` with a search test that fails on the old code. One P2, a split surrogate at the 160-character cut, fixed. The order note was a description fix.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the live Pi receiver reports the side word through History Lookup
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available Evidence: Pi's llmgateway provider answered the live hop.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Drift guards pass Evidence: recorded after the merge with main.
- [x] CHK-011 [P0] No test prints an error Evidence: the history engine prints `Tests  141 passed (141)`.
- [x] CHK-012 [P1] A null block slot is skipped Evidence: a null slot returns no part, as the `block === null` branch shows.
- [x] CHK-013 [P1] Code follows the file's existing style Evidence: the change keeps the file's helper `serialized` and the existing whitespace and 160-character bound.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: every row in `acceptance-criteria.md` is Met.
- [x] CHK-021 [P0] Manual testing complete Evidence: live hop `../scratch/runs/live3-pi` scored 5/5 with the side word recovered through the lookup.
- [x] CHK-022 [P1] Edge cases tested: a turn mixing text, a paging call and a public call Evidence: the fixture turn `history-turn-mixed` mixes text, a paging call and a public call, and its preview shows only the text and `read_file`.
- [x] CHK-023 [P1] Error scenarios validated: arguments that do not serialize Evidence: `serialized` returns an empty string for arguments that serialize to undefined, so the preview shows the name alone.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class Evidence: unreadable preview: `cross-consumer`, the shared reference builder every runtime's lookup uses.
- [x] CHK-FIX-002 [P0] Same-class producers checked Evidence: the one other preview producer, the search excerpt, already quotes the matched term and is unchanged.
- [x] CHK-FIX-003 [P0] Consumers checked Evidence: the consumers are browse, search and load replies, and their existing tests pass unchanged.
- [x] CHK-FIX-004 [P0] Security or path fix reviewed, or N/A Evidence: previews read projected items, which have no thinking, signatures or paging calls, and main's redaction runs before projection.
- [x] CHK-FIX-005 [P1] Matrix axes named Evidence: axes: block kind (text, public call, paging call, null) by runtime reader.
- [x] CHK-FIX-006 [P1] Hostile environment considered Evidence: arguments that cannot be serialized give the call's name alone, and the preview stays bounded at 160 characters.
- [x] CHK-FIX-007 [P1] Evidence pinned to the feature commit Evidence: evidence is pinned to the phase's feature commit on branch `worktrees/420-cross-runtime-handover-parity-fixes`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets Evidence: no secret in code or tests.
- [x] CHK-031 [P0] Input validation: previews read only projected, redacted items Evidence: `buildReference` receives projected items only.
- [x] CHK-032 [P1] N/A: no authentication surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files Evidence: spec, plan and tasks name `navigator.ts`, the browse test, `dist/` and the harness.
- [x] CHK-041 [P1] Code comments carry no spec or phase ids Evidence: the added comment names no ticket, phase or spec id.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned Evidence: only the run folder and the brief were added to `../scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 11 | 0/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
