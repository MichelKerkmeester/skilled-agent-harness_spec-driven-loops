---
title: "Implementation Summary"
description: "The legacy lane and the CLI vitest project share 6 confirmed test behaviours out of 928 lane names, so every lane keeps its coverage."
trigger_phrases:
  - "legacy lane overlap measurement implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/009-legacy-lane-overlap-measurement"
    last_updated_at: "2026-11-12T12:08:57Z"
    last_updated_by: "code-agent"
    recent_action: "Measured the overlap and wrote the report"
    next_safe_action: "Operator reads the twelve per-lane recommendations"
    blockers: []
    key_files:
      - "scratch/lane-commands.txt"
      - "scratch/cli-vitest-names.txt"
      - "scratch/lane-name-sources.md"
      - "scratch/measure-overlap.sh"
      - "scratch/legacy-lane-names.txt"
      - "scratch/legacy-lane-overlap.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-009-legacy-lane-overlap-measurement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-legacy-lane-overlap-measurement |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The twelve legacy lanes report 928 test names and the CLI vitest project declares 2,520. Of 245 candidate pairs read in both source files, 6 assert the same behaviour. Every lane keeps at least one name with no confirmed CLI counterpart, so the report recommends `keep` for all twelve.

### Phase 9: legacy-lane-overlap-measurement

The measurement answers one question: does the 161 s legacy lane step assert behaviour the 490 s CLI vitest project already covers? It records both name lists, joins them on a normalized name, reads every candidate pair in both files, and publishes the confirmed count with one recommendation per lane. Nothing is deleted, narrowed or re-timed.

The four phase-classifier names are the only cluster with real overlap: two names in `test-scripts-modules-js` and four in `test-extractors-loaders-js` match tests in `phase-classification.vitest.ts`, `project-phase-e2e.vitest.ts` and `auto-detection-fixes.vitest.ts`. The other 922 names have no confirmed counterpart, which is the evidence the operator needs before considering a narrowing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/lane-commands.txt` | Created | The twelve entry commands, each prefixed `test:legacy` or `test:validation` |
| `scratch/cli-vitest-names.txt` | Created | 2,520 declared CLI vitest names, collected without running a test |
| `scratch/lane-name-sources.md` | Created | One row per lane with its name shape, extractor and proof command |
| `scratch/measure-overlap.sh` | Created | `collect`, `report` and `check`; writes only inside `scratch/` |
| `scratch/legacy-lane-names.txt` | Created | 928 `<lane>` tab `<name>` lines from twelve lane runs |
| `scratch/legacy-lane-overlap.md` | Created | Both lists, 245 reviewed pairs, `Overlap count: 6`, twelve recommendations |
| `scratch/lane-logs/` | Created | One log per lane plus the shared build log |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ran the tasks in order from `tasks.md`, each with its own verify command:

1. Read `package.json` into `lane-commands.txt`: 12 lines.
2. Collected `vitest list --project cli` into `cli-vitest-names.txt`: 2,520 lines.
3. Wrote the twelve-row name-source table.
4. Wrote `measure-overlap.sh` and checked its syntax.
5. Ran `collect`, which built the CLI package once and ran all twelve lanes: 928 names across 12 lanes.
6. Ran `report`: 245 candidate pairs, 0 exact matches.
7. Read every candidate pair in both source files and marked 6 `same`, 239 `different`.
8. Added twelve `Recommendation:` lines, all `keep`.
9. Ran `check`: `lists-match`, `review-complete`, `overlap=ok`.

Two rounds of `collect` ran. The first exposed category-header lines leaking into the two `--list` lanes (40 and 107 entries instead of 31 and 84); the extractor now keeps only `  • [category] name` and `  - [category] name` lines. The second round wrote the final list.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compare on the CLI test name, not the file path | A file path token such as `archive-track` would match almost any path test. The name is the unit the legacy lanes report. |
| Read candidates in full rather than trusting a title match | The token rule is deliberately loose: it produced 245 pairs, and 239 were different once both sides were read. |
| Count `same` only when both tests run the same production code path | A similar title across a different script does not protect the lane from a regression. |
| Collect `test-validation.sh` and `test-validation-extended.sh` in `--list` mode | Their normal output prints a check mark without a category and depends on terminal color; list mode gives the same names in a stable shape and runs no test. |
| Write `keep` for all twelve lanes | No lane has every name confirmed against a CLI test, and `narrow` requires exactly that. |
| Put the check in `measure-overlap.sh check` rather than a test file | The phase adds no test; the check re-derives the report's numbers from its own inputs and fails on disagreement. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `wc -l < scratch/lane-commands.txt` | `12` |
| `wc -l < scratch/cli-vitest-names.txt` | `2520` |
| `rg -c '^\| (node\|bash) tests/' scratch/lane-name-sources.md` | `12` |
| `bash -n scratch/measure-overlap.sh && echo harness-syntax-ok` | `harness-syntax-ok` |
| `awk -F'\t' '{print $1}' scratch/legacy-lane-names.txt \| sort -u \| wc -l` | `12` |
| `rg -c '^Overlap count: ' scratch/legacy-lane-overlap.md` | `1` |
| `measure-overlap.sh check` after the review | `lists-match`, `review-complete`, `overlap=ok` |
| `rg -c '^Recommendation: ' scratch/legacy-lane-overlap.md` | `12` |
| `measure-overlap.sh check` after the recommendations | `lists-match`, `review-complete`, `overlap=ok`; 245 candidate pairs, 0 exact, 6 confirmed same, 6 overlap, 12 recommendation lines |
| `validate.sh --strict --quiet` | `RESULT: PASSED (errors=0 warnings=0)`, exit 0 |
| `git status --short` | Only the six scratch deliverables, `scratch/lane-logs/`, `tasks.md`, `implementation-summary.md` and `graph-metadata.json` (rewritten by the validator's draft repair) changed; every path is inside the packet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The comparison is name-based.** A `same` verdict means both tests were read and run the same production function for the same outcome; it does not prove the CLI test covers every input the lane tries. The 239 `different` verdicts rest on the same reading, so a pair with a misleading title could be misjudged.
2. **The candidate rule is loose by design.** Three shared content tokens produced 245 pairs. A genuinely equivalent pair that shares fewer than three tokens of four or more characters would not appear at all; the 6 confirmed matches are therefore a lower bound on true overlap, not an upper bound.
3. **Two lanes ran in list mode.** `test-validation.sh` and `test-validation-extended.sh` contributed names without executing their tests, so their logs prove the names exist, not that the fixtures pass.
4. **One run.** The counts describe the tree at this commit. A new CLI test or a renamed lane harness changes the lists, and the report must be regenerated with `report --force` and re-reviewed.
<!-- /ANCHOR:limitations -->

---
