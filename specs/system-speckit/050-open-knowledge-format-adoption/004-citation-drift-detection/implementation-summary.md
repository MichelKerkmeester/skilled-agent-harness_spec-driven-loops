---
title: "Implementation Summary"
description: "The citation scanner now reads spec docs as well as skill docs and tells a renamed file from a deleted one, so the census separates moved citations from broken ones."
trigger_phrases:
  - "citation drift census"
  - "moved gone past end citations"
  - "cite drift redirect table"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/004-citation-drift-detection"
    last_updated_at: "2026-10-04T10:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built the drift scanner changes and reproduced the census"
    next_safe_action: "Operator decides AC-006 and the commit"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs"
      - ".skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-citation-drift-detection |
| **Completed** | 2026-10-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The citation scanner now covers spec docs, and it can tell a file that was renamed from one that is gone. Across 140,287 `path:line` citations at commit `5285608745fe`, 27,320 point at a file that only moved, 45,777 point at nothing the repository ever renamed, and 678 point past the end of a file that still exists. Before this phase all three counted as broken.

### Phase 4: citation-drift-detection

`cite-drift-scan.mjs` takes `--corpus skills|specs|all`. Spec docs are grouped by track, and any path through a `z_archive` folder is left out, as in the phase 002 census. Each citation lands in one class:

| Class | Census fields | Meaning |
|-------|---------------|---------|
| moved | `moved_in_range`, `moved_past_end` | The written path is gone, and the redirect table maps it to a tracked file. The line is checked in the new file |
| gone | `unresolved`, plus the `missing` share of `dead` | No tracked file at the written path and no recorded rename to one |
| past end | `past_end` | The file exists but is shorter than the cited line |
| guessed | `basename_only`, `ambiguous` | Only the file name matches, once or several times. Reported, never counted as moved |
| in range | `in_range` | The path resolves as written and the line exists. Existence only, never support |

The redirect table `cite-drift-redirects.json` holds 701 directory-prefix rules derived from 455,348 rename records in `git log -M`. Each rule needs at least 50 records and 95% agreement, and the table names the commit and command it came from. The largest rules are `.opencode/specs/` to `specs/` (49,889 records) and `.opencode/` to `.skilled/` (17,767).

`--moved` lists each moved citation with its new path. `/doctor:speckit` uses it: its retrieval route now asks whether to run the census (all, skills only, or skip), writes the listing to packet scratch and reports a per-family table with the ten largest moved prefixes. It never raises the doctor's severity, because fixing a citation is an authoring task.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modified | Corpus option, moved and basename-only classes, redirect loading and derivation, the `--moved` listing, and a memory fix for one very long paragraph |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json` | Created | The 701 redirect rules and their provenance |
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | Modified | Fixtures for each new class, the corpus filter, the redirect table and the listing |
| `.skilled/skills/sk-doc/shared/scripts/README.md` | Modified | The option, the classes, `--moved` and the table |
| `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml`, `.skilled/commands/doctor/_routes.yaml` | Modified | The opt-in citation-drift step and its listing target |
| `census.txt` | Created | The census at `5285608745fe`, `--corpus all` |
| `threshold-proposal.md` | Created, then retired | The phase 006 proposal; deleted when the operator removed phase 006 (decision-record.md) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A build agent changed the scanner, the tests, the README and the redirect table, and reported 39 tests passing before and 45 after, plus two byte-identical census runs. The orchestrator then checked each claim: it reran the tests, reran the census, checked the table's thresholds against its contents, confirmed the worktree HEAD matches the table's pinned commit, and checked the agent's files against its scope. The orchestrator added `--moved`, the doctor step and the proposal.

Nothing is committed (root decision D4).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A unique basename match is `basename_only`, never `in_range` | A guessed path with a fitting line looked like a healthy citation. The build agent reports that, against the census before the change, 10 skill-doc citations left `in_range` and 3 left `ambiguous`, and those 13 now show as 5 moved and 8 basename-only |
| `dead` keeps its old meaning | A moved citation is counted under its own class, so existing readers of `dead` see no jump |
| `--moved` is opt-in | The default output and its recorded hash stay unchanged, so the census stays comparable across runs |
| The doctor asks before running the census | A full run takes about 11 minutes; skills only takes about 3 |
| No census-based threshold in the proposal | The census totals were seen before the proposal was written, so any threshold on them could have been fitted to the data |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scanner tests | PASS, 45/45, exit 0. 39/39 before the change |
| Census reproduces | PASS. Four runs with `--corpus all` at `5285608745fe` give sha256 `dec373f6c88f4d47800a6c4018549ff3b27a98bf0d351bef88b1bb45fa0055ec`, 720 lines, exit 0 |
| Default output unchanged by `--moved` | PASS. A fourth run with the final code gives the same sha256 |
| Default run writes no file | PASS. `git status --porcelain --untracked-files=all` is identical before and after a full run. Two files changed in the meantime, both the skill advisor daemon's own database, which the scanner never references |
| Default run makes no model call and reads no credential | PASS. Outside `--jev` the scanner spawns only `git rev-parse`, `git ls-files` and `git show`; a `.env` target is refused before any read, and the `refused .env` test covers it |
| Redirect table | PASS. 701 rules, smallest 50 records and 95.1% agreement; `source.commit` equals the worktree HEAD |
| Moved listing spot check | PASS. `--moved` prints 27,320 lines, equal to the two moved fields. Eight drawn at random (seed 4): each old path untracked, each new path tracked, each line inside the new file, including chained packet renumberings |
| Doctor summary output | PASS. The step's summary, built from the `--moved` listing as the workflow says, gives the per-family table and the ten largest moved prefixes (`scratch/doctor-citation-summary.md`). The interactive `/doctor:speckit` run itself, with its gates, is left to the operator |
| Doctor route | PASS. `route-validate.sh` validates 9 routes and confirms all 22 script invocations are called by their workflow YAML; its two warnings are about other routes. `route-validate.test.sh` 19/19, the route contract test passes, and both YAML files parse |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The proposal came after the census was seen, then lost its consumer.** REQ-006 asked for the reverse order. The operator later removed phase 006, so the proposal was retired and AC-006 superseded (decision-record.md ADR-001).
2. **"Gone" includes paths that never existed.** `unresolved` also holds illustrative paths and citations to files outside the repository, so it overstates deleted files.
3. **Guessed matches are large in spec docs.** 51,074 spec citations match only by file name, mostly short forms such as `spec.md:12`. They are reported but not resolved.
4. **A full census takes about 11 minutes.** Most of it is one `git show` per doc; a single `git cat-file --batch` read would be faster, but one existing test counts `git show` calls.
5. **The table has no rebuild flag.** `deriveRedirects` is exported, and rebuilding means calling it directly. 9,896 rename records with quoted paths were skipped.
<!-- /ANCHOR:limitations -->

---
