---
title: "Implementation Summary: Phase 6: rg-flood-control"
description: "The ripgrep wrapper's structured recipe now shows each matching file once at its best line, cuts at --limit files and reports what it hid."
trigger_phrases:
  - "rg flood control implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/006-rg-flood-control"
    last_updated_at: "2026-11-09T22:10:00Z"
    last_updated_by: "conductor"
    recent_action: "Built, aligned, benchmarked and closed"
    next_safe_action: "Packet-wide recheck, then operator merge and push decision"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-rg-flood-control"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-rg-flood-control |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

One busy file no longer floods a ripgrep search. "iteration" over the phase 2 research folder used to fill its first 20 rows from 2 files, 19 of them from one; it now shows all 14 files once each, with `(+N more in this file)` on the busy ones.

### Phase 6: rg-flood-control

After the existing rank tuple orders the matches, the structured recipe keeps each file's first-ranked row and cuts the file list at `--limit` (default 20, `--limit 0` uncapped). The record says what it hid: `moreInFile` per row, `hidden: { files, matches }`, `matchCount`, `fileCount`, `limit` and `truncated`, under `schemaVersion: 2`. Shaping filters the ranked list and never re-sorts it, so the tuple stays the lane's only ranker, and total matches are unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/retrieval/lib/rg-lane.mjs` | Modified | `DEFAULT_LIMIT`, `shapeRankedMatches()`; the unused capped recipe builder deleted |
| `runtime/cli/retrieval/rg-wrapper.mjs` | Modified | `--limit` with a safe-integer guard, the new record fields, schema 2, the elision strings in the human view |
| `runtime/cli/ops/retrofit-convention.mjs` | Modified | The baseline counts `matchCount`, so it keeps total-match semantics |
| `runtime/cli/tests/rg-wrapper-recipes.vitest.ts`, `retrofit-convention-pipeline.vitest.ts` | Modified | Shaping cases, the body-vs-frontmatter fixture moved to a second file, a human-view case and a retrofit count case |
| `references/retrieval/retrieval-conventions.md` | Modified | Section 2.1 shaping paragraph, section 5 item 4 |
| `.skilled/commands/speckit/README.txt`, `assets/search-presentation.txt` | Modified | Wrapper output described; the raw `/speckit:search` recipe is marked as unshaped |
| System-spec-kit `README.md`, retrieval `README.md`, `lib/README.md`, root `README.md` | Modified | Describe one row per file, `--limit` and the hidden counts |
| `feature-catalog/retrieval/rg-flood-control.md`, `feature-catalog.md` | Created, Modified | Catalog entry and index block |
| `manual-testing-playbook/retrieval/rg-flood-control.md`, `manual-testing-playbook.md` | Created, Modified | Conversational scenario 491 and its row |
| `changelog/v2.12.43.0.md`, `SKILL.md` | Created, Modified | Changelog and version 2.12.43.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

In worktree 335 on top of the phase 5 commit `98fe345072`. Devin DeepSeek ran the before benchmark and built the code; three codex Luna workers wrote the tests and conventions, the catalog and scenario, and the READMEs and changelog, in parallel. The conductor found two defects the workers missed: the human view still cut at 20 rows after shaping, which silently hid files at `--limit 0` or above 20, and the `unparsed` count had dropped out of it. Both were fixed, and a test was added that fails with the old cut. `/local-skilled-alignment` on the codex preset found 6 lane findings and 5 critic findings; all were fixed except two pre-existing items. Devin walked scenario 491 (PASS, twice), and the conductor ran the after benchmark, the full suite and the recheck.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Shape after ranking instead of `--max-count 1` | `--max-count` keeps a file's earliest line, not its best-ranked one, and loses the per-file totals the elision needs |
| Leave `/speckit:search` on the raw recipe and say so in its presentation | Routing the command through the wrapper edits `search.md`, outside this phase's file list; the presentation now renders the suffix and `HIDDEN` slot only for a wrapper record |
| Print every shaped row in the human view | Shaping already bounds the list; a second cut at 20 hid files that neither a suffix nor the tail counted |
| Reject a `--limit` beyond the safe integer range | A 400-digit value parsed to `Infinity` and the record reported `limit: null` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Phase test files | `rg-wrapper-recipes.vitest.ts`, `retrofit-convention-pipeline.vitest.ts`: 55 passed; the human-view and retrofit cases each fail when their fix is reverted |
| Full system-spec-kit suite | 4110 passed, 33 skipped, 0 failed, 334 files (baseline 4071 passed, 0 failed) |
| Quality gate, comment hygiene, `npm run check` | 0 findings; exit 0; exit 0 |
| Measured query | `schemaVersion` 2, 14 rows from 14 files; `rg -n structuredCappedRecipe .skilled` prints nothing (exit 1) |
| Catalog and playbook validators | `validate_catalog_package.py` exit 0; `validate-playbook-package.cjs` exit 0 |
| Scenario 491 on devin | PASS 1/1 after the reply check was tightened (`benchmark/scenario-491/`) |
| `/local-skilled-alignment` recheck | Recheck 1: resolved 2, still open 2 (both P2: BAT-01, and C-001, which is fixed but reads as open because the new text contains the old), new 0, needs review 6, all reviewed below (`alignment/recheck.md`) |
| `validate.sh --strict` on this phase | RESULT: PASSED |
| Benchmark: measured query | 2 files shown before, 14 after; most rows from one file 19 before, 1 after |
| Benchmark: queries reporting what they hid | 0/8 before, 8/8 after |
| Benchmark: median query time | 38.1 ms before, 37.5 ms after (-1.4%) |

Needs-review findings, resolved by the conductor: the P1 `/speckit:search` mismatch fixed in the presentation and the command README; A1, CC-1, CC-2 and CC-4 fixed as described above; C-002 kept as below. Open P2 findings, kept with a reason: C-002, `SPECKIT_RG_BIN` is missing from the env docs, but it existed at the base commit; BAT-01, `S9-command-references` names a gitignored generated SQLite file that exists in the main checkout but not in this fresh worktree. Routing probes P01 and P02 route the same on main.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **`/speckit:search` does not shape results yet.** It runs the raw ripgrep recipe, so a common phrase can still flood it. Call `rg-wrapper.mjs structured` directly, or route the command through the wrapper in a follow-up.
2. **The fetch is still uncapped.** Shaping happens after ripgrep returns every match, so the 128 MB output ceiling still applies to a very common phrase.
<!-- /ANCHOR:limitations -->

---
