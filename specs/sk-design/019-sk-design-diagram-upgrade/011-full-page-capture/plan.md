---
title: "Implementation Plan: Phase 11: full-page-capture"
description: "Add an opt-in --full-page flag to the shared screenshot renderer, reshoot the diagram corpus at true content height, prove the chart skill is untouched, and rerun CAP-001."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: full-page-capture

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS), zero dependencies — `execFileSync` against the system Chrome binary |
| **Framework** | None; `render-screenshots.cjs` is a standalone CLI script shared by `sk-design-diagram` and `sk-design-chart` |
| **Storage** | Filesystem only — HTML sources under `assets/`, PNG outputs under `screenshots/`, one JSON+Markdown report per `benchmark/reports/<dated-folder>/` |
| **Testing** | No existing automated test harness for `shared/scripts/`; verification is empirical (byte-diff, per-file height comparison) matching how this script has always been proven |

### Overview
`render-screenshots.cjs` takes a fixed `1280x900` Chrome window for every capture, confirmed in this authoring pass to never auto-crop to content — a `--window-size=W,H` invocation always outputs exactly `WxH` pixels, regardless of how tall the page's own content is. The fix adds an opt-in `--full-page` flag: a temp-copy measurement pass reads each file's true document height via an injected script and `--dump-dom`, then the real capture (on the pristine original) uses that height instead of the fixed constant. `sk-design-chart` never passes the flag, so its output stays byte-identical, proven by a fresh unflagged render diffed against its committed screenshots.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-3)
- [x] The full-page measurement technique is empirically validated, not theoretical: `template-full.html` measured 1364px at a 900px viewport via the temp-copy/`--dump-dom` technique, and a follow-up capture at `--window-size=1280,1364` produced an exact 1364px PNG with no crop
- [x] Dependencies identified (spec.md §6) — 009's merge and 007's content fixes are read at execution time, not assumed

### Definition of Done
- [ ] All acceptance criteria in `acceptance-criteria.md` are `Met`, `Waived` or `Superseded` — 8/10 `Met` (AC-001 through AC-007, AC-009); AC-008 (the S10 playbook note) is `Unmet` and unwaived, so AC-010 (the phase gate) is also `Unmet`
- [x] `sk-design-chart`'s images are proven byte-identical after the change (diff, not visual spot-check) — instrumented at implementation time (39 unflagged spawns, no measurement) and independently re-diffed this closeout session, empty
- [x] Every screenshot under `sk-design-diagram/screenshots/diagrams/` has a pixel height matching its source's measured content height — a fresh full-corpus `--full-page` render this session reproduced every committed PNG byte-for-byte
- [x] A second CAP-001 report exists, addressing all five findings from the first report — `benchmark/reports/2026-09-11--manual-testing-playbook--capture-review-2/`
- [x] `spec.md` / `tasks.md` / `acceptance-criteria.md` / `goal.md` are synchronized with the final state — done in this closeout pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file CLI extension. No new module, no new dependency — the flag and its measurement function live inside `render-screenshots.cjs` beside the existing `capture`/`captureOnce`/`main` functions.

### Key Components
- **`measureContentHeight(src)`** (new): copies `src` to an OS temp file, appends a `<script>` before `</body>` that sets `document.head`'s `<meta name="rs-measured-height">` content to `Math.ceil(document.documentElement.getBoundingClientRect().height)` after `load` plus a short settle, runs Chrome with `--dump-dom --virtual-time-budget=${SETTLE_MS}` against the temp file, regex-parses the meta value out of the dumped DOM text, deletes the temp file in a `finally`, and returns the parsed height or `null` on any failure.
- **`captureOnce(src, dest, height)`** (modified): accepts an explicit height parameter (defaults to the existing fixed `HEIGHT`) and passes `--window-size=${WIDTH},${height}` to Chrome, so the pristine original file is always what gets screenshotted — the temp copy exists only for measurement, never for capture.
- **`main()`** (modified): parses `--full-page`; when set, calls `measureContentHeight(src)` per file before capturing and falls back to the fixed `HEIGHT` (with a printed warning naming the file) when measurement returns `null`.

### Data Flow
`assets/diagrams/*.html` (+ `assets/icons.html`) -> [`--full-page` set?] -> per-file measurement pass on a temp copy -> real capture of the original file at the measured (or fallback) height -> `screenshots/diagrams/*.png` (+ `screenshots/icons.png`). The chart's own invocation never sets the flag, so its flow is unchanged: `sk-design-chart/assets` -> fixed `1280x900` capture -> `sk-design-chart/screenshots/*.png`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

`render-screenshots.cjs` is shared policy — both `sk-design-diagram` and `sk-design-chart` call it with the same two positional arguments today, so this phase's change surface is exactly the boundary D12 protects.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs` | Producer: the one capture implementation both packets call | Update — add the opt-in flag and its measurement function | `grep -n -- "--full-page" render-screenshots.cjs` finds the flag parse; `grep -n "getBoundingClientRect" render-screenshots.cjs` finds the measurement comment |
| `sk-design-diagram/README.md` capture snippet | Consumer: documents the regeneration command for this packet | Update — add `--full-page` to the documented command | `grep -n -- "--full-page" sk-design-diagram/README.md` finds it |
| `sk-design-chart/README.md` capture snippet | Consumer: documents the regeneration command for the chart | Not a consumer of the flag — stays unflagged (D12) | `git diff` over `sk-design-chart/README.md` is empty for this phase |
| `sk-design-chart/screenshots/*.png` | Consumer: committed output of the unflagged invocation | Unchanged | Fresh unflagged render into a scratch dir, `diff -rq` against committed set, empty |
| `.github/workflows/diagram-corpus.yml` | Consumer: greps `check-diagram-corpus.cjs`'s `RESULT: PASSED`, never touches `screenshots/` | Not a consumer of this change — the checker asserts markup under `assets/`, not rendered PNGs under `screenshots/` | `node scripts/check-diagram-corpus.cjs` still reports `RESULT: PASSED` after the reshoot (T015) |

Required inventories:
- Same-class producers: `grep -rn "render-screenshots.cjs" .opencode/skills/sk-design/` — two call sites (`sk-design-diagram/README.md`, `sk-design-chart/README.md`), both already read in this authoring pass; no third caller exists.
- Consumers of the changed function signatures (`captureOnce`, `capture`): both are module-internal to `render-screenshots.cjs` — the file exports nothing (`main()` runs directly), so no external consumer inventory beyond the two README-documented CLI invocations.
- Matrix axes: `{flag present | absent}` x `{measurement succeeds | falls back}` — four rows; the two flag-absent rows must reproduce today's exact output regardless of measurement success, since measurement never runs when the flag is off.
- Algorithm invariant: the flag being absent MUST short-circuit before `measureContentHeight` is ever called, so a bug in the new measurement path cannot affect the unflagged path even in principle, not just in the common case.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression (byte-diff) | `sk-design-chart`'s unflagged capture stays identical | Fresh render into a scratch dir + `diff -rq` against committed `screenshots/` |
| Per-file measurement | Every regenerated `screenshots/diagrams/*.png` height matches its source's independently measured content height | `sips -g pixelHeight` on the PNG, compared against a second, independent `measureContentHeight`-style pass |
| Corpus regression | The reshoot touches only `screenshots/`, never `assets/`, so the corpus checker's `RESULT: PASSED` must still hold unchanged | `node scripts/check-diagram-corpus.cjs` |
| Manual | Visual spot-check of the six previously-cropped forms plus two short forms, confirming no legend/footer/info-card is cut off and the shrunk-short forms still read cleanly | Chrome / image viewer |

No new automated unit-test suite is added: `shared/scripts/` carries no existing test harness, and the script's core behavior (spawning a real browser against a real file) is not naturally unit-testable without introducing a dependency this phase's scope does not call for. The byte-diff and per-file height checks are the standing, repeatable proof this phase leaves behind.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `render-screenshots.cjs` (current, unflagged) | Internal | Green — read in full in this authoring pass | N/A, already exists |
| 009's `assets/diagrams/` merge | Internal | Not yet landed (009 is still a scaffold as of this authoring pass) | The reshoot targets whichever source layout is actually on disk at execution time (spec.md Edge Cases) |
| 007's content fixes (dp-integration, venn, template-full, swimlane mask) | Internal | Not yet landed | The CAP-001 rerun carries any still-open finding forward with a reason rather than blocking (REQ-007) |
| System Chrome (`/Applications/Google Chrome.app/...` or `CHROME_PATH`) | External | Available on this machine, confirmed in this authoring pass | Capture cannot run at all without it — pre-existing dependency, not new to this phase |
| `run-manual-playbook-scenario.cjs` | Internal | Exists and confirmed working (the first CAP-001 report was produced through it) | CAP-001 cannot be persisted without it — this is the only path the playbook's Result Persistence contract allows |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `sk-design-chart`'s byte-diff proof (REQ-003) fails, or the reshoot introduces a crop the corpus checker or a visual spot-check catches.
- **Procedure**: `render-screenshots.cjs` is a single file with the flag isolated behind an `if (fullPage)` branch — revert the file to its pre-phase state via `git checkout -- .opencode/skills/sk-design/shared/scripts/render-screenshots.cjs` and re-run the unflagged capture for both packets to restore the committed PNGs.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T003) ──────┐
                         ├──► Implementation (T004-T013) ──► Verification (T014-T016)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 007/009 state read from disk | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Reading three files and confirming corpus state on disk |
| Core Implementation | Medium | One flag, one new function, one signature change, one full corpus reshoot, one scenario rerun |
| Verification | Low | Scripted diffs and one visual spot-check |
| **Total** | | Single-session mechanical execution once 007/009 land |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `sk-design-chart`'s byte-diff proof is green before the diagram-side reshoot is committed
- [ ] No temp file left under the repo tree from the measurement pass

### Rollback Procedure
1. `git checkout -- .opencode/skills/sk-design/shared/scripts/render-screenshots.cjs`
2. `git checkout -- .opencode/skills/sk-design/sk-design-diagram/screenshots/` to restore the pre-reshoot committed PNGs
3. Re-run the unflagged capture for both packets and confirm both diff empty against their now-restored committed sets
4. No stakeholder notification needed — this is a local packet, not a deployed service

### Data Reversal
- **Has data migrations?** No — PNG regeneration and one benchmark report folder, both plain files under version control
- **Reversal procedure**: `git checkout` on the touched paths, as above
<!-- /ANCHOR:enhanced-rollback -->

---
