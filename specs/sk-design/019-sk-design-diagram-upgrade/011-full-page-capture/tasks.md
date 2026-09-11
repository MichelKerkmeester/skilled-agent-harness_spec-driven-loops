---
title: "Tasks: Phase 11: full-page-capture"
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
# Tasks: Phase 11: full-page-capture

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

- [x] T001 [P] Confirm 009's `assets/diagrams/` merge and 007's fixes to dp-integration, venn, template-full and the swimlane HANDOFF mask are actually on disk — read directly, not trusted from either phase's own checkbox state — and record which of the four content findings are still open, since the CAP-001 rerun (T013) must state this honestly either way (REQ-007) (goal.md) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: `assets/diagrams/` holds the merged 38-form library (009's merge, commit `59d5aef373`); at CAP-001-2 run time dp-integration, venn and starter-full (formerly template-full) were still open and the swimlane HANDOFF mask overflow did not reproduce — all four stated honestly in the second report's reason field, then dp-integration/venn/starter-full were closed by this phase's own `7bf1c3af7d`
- [x] T002 [P] Re-read `.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs` end to end (`WIDTH`/`HEIGHT` constants, `captureOnce`, `capture`, `htmlFilesUnder`, `destinationFor`, `main`) and confirm both `sk-design-diagram/README.md` and `sk-design-chart/README.md` call it with the same two positional arguments, so REQ-003's byte-identity proof targets the correct shared seam (D12) (.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: both READMEs invoke `render-screenshots.cjs ./assets ./screenshots [...]`; `grep -rn "render-screenshots.cjs" .opencode/skills/sk-design/` finds exactly the two README call sites, no third caller
- [x] T003 [P] Re-measure the corpus's tall forms against the execution-time state of `assets/diagrams/` (or its pre-merge equivalent) using the temp-copy `--dump-dom` technique validated in this phase's authoring pass; confirm the baseline set — `template-full` 1364px, `example-sequence-oauth` 1004px, `example-sequence-oauth-full` 1411px, `example-sequence-oauth-dark` 1004px, `example-loop-terminal` 1039px, `example-quadrant-consultant` 1342px — still holds or record what changed (spec.md §2) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: the merged corpus changed the count — 11 of 38 forms exceed 900px, not six: import-drawio 929, import-mermaid 921, loop 964, loop-terminal 1039, org-chart 940, quadrant-consultant 1342, sequence-oauth 1004, sequence-oauth-dark 1004, sequence-oauth-full 1399, starter-full 1561, starter-terminal 979 (`sips -g pixelHeight` on the committed PNGs this session, reconciled against the CAP-001-2 report's own stated heights); recorded in goal.md's Deviations table
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the `--full-page` CLI flag to `render-screenshots.cjs`'s argument parsing, defaulting to off, so `sk-design-chart`'s unflagged invocation is untouched (REQ-001) (.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: `a69ce8b77c`; `grep -n -- "--full-page" render-screenshots.cjs` finds the flag parse at line 175 and the usage strings
- [x] T005 Add `measureContentHeight(src)`: copy `src` to an OS temp file, append a `<script>` before `</body>` that sets a `<meta name="rs-measured-height">` to `Math.ceil(document.documentElement.getBoundingClientRect().height)` after `load` plus a short settle, run Chrome with `--dump-dom --virtual-time-budget=${SETTLE_MS}` against the temp file, regex-parse the meta value, delete the temp file in a `finally`, and return `null` (never throw) when parsing fails or the value is non-positive (REQ-002) (.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: `a69ce8b77c`; function present at line 121 with the `finally`-block cleanup; a fresh `--full-page` reshoot this session reproduced the committed heights exactly (starter-full 1561px, sequence-oauth-full 1399px, sequence-oauth/-dark 1004px). Amendment beyond the written task: `measureContentHeight` also retries once via the shared `SPAWN_ATTEMPTS` constant, the same way `capture` already did — raised and accepted during implementation, not written into this task or REQ-002
- [x] T006 Document the measurement technique in a comment directly above `measureContentHeight`: name `document.documentElement.getBoundingClientRect().height` as the source of truth and state why a temp copy is measured rather than the live source (never capture from the modified copy) (REQ-002) (.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: `a69ce8b77c`; lines 104-111 carry a multi-line comment directly above `measureContentHeight` explaining the temp-copy rationale and the retry amendment; `getBoundingClientRect` itself sits 13 lines below inside the same function's injected probe, so `grep -n "getBoundingClientRect" render-screenshots.cjs` (AC-002/SC-006's own check) finds it adjacent to the function
- [x] T007 Thread the flag through `capture`/`captureOnce` so the real capture — always on the pristine original file, never the temp copy — uses `--window-size=${WIDTH},${measuredHeight}` when `--full-page` is set and falls back to `${WIDTH},${HEIGHT}` when measurement returned `null`, printing a warning naming the fallen-back file (REQ-001, REQ-002) (.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: `a69ce8b77c`; `captureOnce(src, dest, height = HEIGHT)` and `capture(src, dest, height = HEIGHT)` both accept the parameter; `main()` short-circuits the measurement call behind `if (fullPage)` and prints `UNMEASURED <file>: keeping the fixed 900px` on a `null` measurement
- [x] T008 Re-run `sk-design-chart`'s exact documented capture command (`node ../shared/scripts/render-screenshots.cjs ./assets ./screenshots`, no flag) into a scratch directory and `diff -rq` it against the committed `sk-design-chart/screenshots/`; confirm empty output (REQ-003) (.opencode/skills/sk-design/sk-design-chart/screenshots/) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: proved at implementation time by instrumenting every browser spawn (`a69ce8b77c`'s message: unflagged run produced 39 spawns with no measurement among them, vs. 78 when flagged); independently re-run this closeout session into a scratch dir — `diff -rq` against the committed `sk-design-chart/screenshots/` is empty
- [x] T009 Run `render-screenshots.cjs ./assets ./screenshots --full-page` from `sk-design-diagram/`, covering `assets/diagrams/` and `assets/icons.html`; remove the now-orphaned `screenshots/examples/` and `screenshots/templates/` directories as superseded 1:1 by `screenshots/diagrams/` (REQ-004) (.opencode/skills/sk-design/sk-design-diagram/screenshots/) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: `a69ce8b77c`; `screenshots/diagrams/*.png` covers all 38 sources under `assets/diagrams/`; `assets/icons.html` had already moved to `assets/style-reference/harness-diagram/icons.html` by execution time and is captured to `screenshots/style-reference/harness-diagram/icons.png` (confirmed present). Deviation: `screenshots/examples/` and `screenshots/templates/` were already absent — removed by phase 009's merge (`59d5aef373`), before this phase's own three commits, not by this task's own reshoot; `test -d` on both this session confirms neither exists
- [x] T010 For every regenerated PNG, compare its pixel height (`sips -g pixelHeight`) against its source's independently measured content height; report zero mismatches, or name and fix any that disagree before proceeding (REQ-005) (.opencode/skills/sk-design/sk-design-diagram/screenshots/diagrams/) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: this session, a fresh `--full-page` render of the whole corpus (`./assets` → scratch) reproduced `screenshots/diagrams/` and `screenshots/style-reference/` byte-for-byte (`diff -rq` empty both trees) — every committed PNG's height equals what today's measurement pipeline independently derives, zero mismatches across all 38 forms plus icons.png. No PNG lands at exactly 900px (the crop signature); 11 exceed it (T003's list)
- [x] T011 [P] Update `sk-design-diagram/README.md`'s regeneration snippet to include `--full-page`; confirm `sk-design-chart/README.md`'s snippet is untouched (REQ-009, D12) (.opencode/skills/sk-design/sk-design-diagram/README.md) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — evidence: `sk-design-diagram/README.md:163` carries `--full-page`; `sk-design-chart/README.md` carries no `--full-page` anywhere. Deviation: the diagram README's line landed in `c2b442f827f` (phase 010's "one bundle" work), ahead of this phase's own `a69ce8b77c`/`7bf1c3af7d`/`5334c913d6` — the requirement is satisfied on disk today but none of this phase's three commits themselves touched the README
- [ ] T012 [P] Add the note that a capture review reads full-page images to `manual-testing-playbook.md`'s CAP-001 section or `capture-review/capture-review.md`, naming S10 as the reason (REQ-008) (.opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/capture-review/capture-review.md) — executor: DeepSeek-V4.1-Flash max via cli-pi (llmgateway) — NOT DONE: `grep -rln "S10\|full-page" .opencode/skills/sk-design/sk-design-diagram/manual-testing-playbook/` finds nothing, and none of the phase's three commits touched `manual-testing-playbook.md` or `capture-review/capture-review.md`. A future reviewer of `CAP-001` still has no written pointer to the fixed 900px crop
- [x] T013 Re-run CAP-001: `node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs --skill .opencode/skills/sk-design/sk-design-diagram --scenario CAP-001 --variant capture-review --outcome-json <path>`, with the outcome JSON's reason addressing all five prior findings by name and `executionContext.supersedes` naming `2026-09-11--manual-testing-playbook--capture-review` (REQ-006, REQ-007) (.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/) — executor: human review, two fresh readers (matching CAP-001's own methodology) — evidence: `5334c913d6`; `benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-2/skill-benchmark-report.json` carries `scenarioId: "CAP-001"`, verdict `FAIL`, and a reason naming all five prior findings (dp-integration, venn, starter-full open; swimlane HANDOFF mask closed as not-real; renderer crop closed). Gap: `executionContext.supersedes` is `[]`, not naming the first report's folder as this task's own text specified
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Read the new report's `skill-benchmark-report.md`/`.json` in full: confirm no finding is left with an empty reason, any `SKIP` names its blocker, and the file was produced by the runner, not hand-edited (REQ-006, REQ-007) (.opencode/skills/sk-design/sk-design-diagram/benchmark/reports/) — executor: human review — evidence: read this session end to end; the one `SKIP` (step 2, `python3 -c 'import playwright'`) carries a non-empty reason with the exact install command; every file carries a "Rendered from report.json (do not hand-edit)" banner matching the runner's other dated reports (e.g. the 2026-08-12 set)
- [x] T015 Run `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` and confirm `RESULT: PASSED` still holds after the reshoot — a regression guard, since the reshoot touches only `screenshots/`, never `assets/` (.opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs) — executor: human review — evidence: re-run this session — `RESULT: PASSED` (38 files, 12 families, 0 errors), matching the CAP-001-2 report's own corpus-check line
- [x] T016 Open the six previously-cropped forms plus two short forms (e.g. `example-bar.html`) from `screenshots/diagrams/` and visually confirm no legend, footer or info card is cut off, and that the shrunk-short forms still read cleanly (spec.md Edge Cases) (.opencode/skills/sk-design/sk-design-diagram/screenshots/diagrams/) — executor: human review — evidence: opened `starter-full.png` (1561px, the former `template-full`) this session — header, diagram, legend and all three info cards render fully, footer line intact; opened `bar.png` (813px, a shrunk-short form) — reads cleanly with no wasted space; opened `swimlane.png` and visually confirmed `7bf1c3af7d`'s fix — HANDOFF and REVISE labels now sit clear of their connectors, DEPLOY TRIGGER's label was removed rather than relocated, matching the commit message
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` — 15/16; T012 (the playbook's S10 note) was never written, see T012
- [x] No `[B]` blocked tasks remaining — T012 is undone, not blocked; nothing prevents writing it
- [x] Manual verification passed — T014-T016 executed and evidenced this session
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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-009 present
- [x] CHK-002 [P0] Technical approach defined in plan.md — measurement technique, affected-surfaces table and rollback plan present
- [x] CHK-003 [P1] Dependencies identified and available — `render-screenshots.cjs` read in full, 009/007 state re-checked at execution time (T001), `run-manual-playbook-scenario.cjs` confirmed working (it produced the second report)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `render-screenshots.cjs` still runs clean with no syntax errors after the flag is added — re-run this session (unflagged chart capture, flagged diagram reshoot), both completed with `RESULT: PASSED`
- [x] CHK-011 [P0] No console errors or warnings from either the flagged or unflagged capture path, beyond the intentional fallback-file warning — this session's fresh reshoot reproduced the committed corpus byte-for-byte, which a silently-degraded (fallback-height) capture would not have done
- [x] CHK-012 [P1] Measurement failures degrade to the fixed-height fallback rather than throwing — `measureOnce` returns `null` on any `catch`, `measureContentHeight` retries once before giving up, `main()` falls back to the fixed `HEIGHT` and prints `UNMEASURED <file>` (render-screenshots.cjs lines 121-149, 197-214)
- [x] CHK-013 [P1] The new code follows the file's existing style — no dependency added, `execFileSync` against the system Chrome binary only — confirmed in the `a69ce8b77c` diff; only `os` was added to the `require` list
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria in `acceptance-criteria.md` met — 9/10 (AC-001 through AC-007, AC-009 Met); AC-008 is Unmet (no playbook note was written), so AC-010's phase gate is also Unmet
- [x] CHK-021 [P0] Manual testing complete: byte-diff proof (T008), per-file height comparison (T010), CAP-001 rerun (T013), visual spot-check (T016)
- [ ] CHK-022 [P1] Edge cases tested: a short form (`example-bar.html`, now `bar.html`) shrinks correctly — confirmed, 813px, opened and reads cleanly (T016); a measurement failure falling back was not itself exercised with evidence — no `UNMEASURED` warning was observed in any run this phase left a record of
- [ ] CHK-023 [P1] Error scenarios validated: `--dump-dom` failure path exercised against at least one file — not exercised; the corpus's own files all measure cleanly, so the fallback branch has no recorded trigger case
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: this phase is `class-of-bug` (the fixed viewport crops every tall form corpus-wide, not one instance) with a `cross-consumer` dimension (the fix lives in a script shared with `sk-design-chart`).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: `grep -rn "render-screenshots.cjs"` confirms exactly two call sites (plan.md §Affected Surfaces) — reconfirmed this session (T002).
- [x] CHK-FIX-003 [P0] Consumer inventory completed: `sk-design-diagram/README.md`, `sk-design-chart/README.md`, `sk-design-chart/screenshots/*.png`, `.github/workflows/diagram-corpus.yml` — all listed with their action or non-action in plan.md §Affected Surfaces.
- [x] CHK-FIX-004 [P0] Not applicable — no path/redaction/parser/security surface is touched by this phase.
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion: `{flag present|absent} x {measurement succeeds|falls back}` (plan.md §Affected Surfaces).
- [x] CHK-FIX-006 [P1] Not applicable — no process-wide or hostile-env state is read by this change.
- [x] CHK-FIX-007 [P1] Evidence for the byte-diff and height-comparison proofs is pinned to the fix commit, not a moving branch-relative range — evidence here cites `a69ce8b77c`/`7bf1c3af7d`/`5334c913d6` by SHA and this session's direct re-derivation against the committed tree, never a `git diff` range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — confirmed reading the full `a69ce8b77c` diff; the only literals are Chrome CLI flags and the `rs-measured-height` meta name
- [x] CHK-031 [P0] No new external reachability — the measurement pass renders a local temp copy of an already-local file only
- [x] CHK-032 [P1] Not applicable — no auth/authz surface in this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria/goal synchronized with the final state — done in this closeout pass
- [x] CHK-041 [P1] Code comments adequate — the measurement technique is documented beside its implementation (T006)
- [x] CHK-042 [P2] `sk-design-diagram/README.md` regeneration snippet updated (T011) — present on disk, though landed via `c2b442f827f` rather than this phase's own three commits (see T011)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — the measurement pass's own temp copies live in an OS temp directory (`fs.mkdtempSync(path.join(os.tmpdir(), 'render-screenshots-'))`), never under this packet's `scratch/` or the skill tree, and are removed in a `finally` block on every path out
- [x] CHK-051 [P1] scratch/ cleaned before completion — `specs/.../011-full-page-capture/scratch/` holds only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 12/13 (CHK-020 blocked on AC-008; CHK-021 done) |
| P1 Items | 13 | 11/13 (CHK-022, CHK-023 not exercised with evidence) |
| P2 Items | 1 | 1/1 |

Corrected from the authoring-time estimate: this checklist carries 13 P1 items, not 10.

**Verification Date**: 2026-09-11 (authored); closed out 2026-09-11
<!-- /ANCHOR:summary -->

---
