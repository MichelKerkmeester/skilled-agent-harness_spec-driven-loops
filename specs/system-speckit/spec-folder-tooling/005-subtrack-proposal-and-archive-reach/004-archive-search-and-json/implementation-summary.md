---
title: "Implementation Summary"
description: "Archived packets can now be searched and validated on request with --include-archive, and the default search and the default recursive run are unchanged. No archived packet records a stale parent and the description cache holds no dead row. One acceptance criterion waits for the regenerated trigger index."
trigger_phrases:
  - "archive search and json implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/004-archive-search-and-json"
    last_updated_at: "2026-11-13T13:58:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed AC-004 and AC-006, seven of eight acceptance criteria are Met"
    next_safe_action: "Regenerate the trigger index, then close AC-002 and T020"
    blockers: []
    key_files:
      - "specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/004-archive-search-and-json/acceptance-criteria.md"
      - ".skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-archive-search-and-json"
      parent_session_id: null
    completion_pct: 95
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
| **Spec Folder** | 004-archive-search-and-json |
| **Completed** | Built 2026-11-13, code committed as `05a83a7d88`, regenerated metadata as `55e73d37b5`. Not closed: AC-002 waits for the regenerated trigger index |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

`rg-wrapper.mjs --include-archive` now finds a phrase that lives only in an archived packet and marks each such hit `[archived]`, and `validate.sh --recursive --include-archive` validates the packets in a `z_archive/`. Without the flag both behave as before. The archived metadata is also correct now: 0 of 267 archived packets record a stale parent, down from 35, and `specs/descriptions.json` holds 0 dead rows, down from 1334.

### Phase 4: archive-search-and-json

You can search an archive on request. Add `--include-archive` to any wrapper recipe and the run drops the one glob that hides `z_archive`, keeps the other three exclusions and ends every archived hit with `[archived]`. The JSON rows of the structured and count recipes carry `archived: true` or `archived: false`. A second invocation, the JSON lane, lists the `description.json` and `graph-metadata.json` files of archived packets that hold the phrase under a `json    :` section. The run exits 0 when either lane matches. Resume and the trigger index still leave archives out.

You can validate an archive on request. `validate.sh <folder> --recursive --include-archive` adds the packets in the folder's `z_archive/` to the folders a recursive run visits, and the packets in each subtrack's `z_archive/` when the folder is a track root. The flag without `--recursive` exits 2 with an error that names `--recursive`. Old archived packets fail current rules, so a run with the flag is expected to exit 2.

Archived metadata now stays correct by itself. `archive.sh` calls the description cache producer after each archive and each restore, so the cache drops the row for the old path and gains one for the new path. `repair-derived.cjs` clears an archived packet's stale `parent_id` even when the validator reports nothing derivable for that packet. The comments and reference rows that said archives are excluded from the description cache now say `z_archive` stays in.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs` | Modified | Exports `ARCHIVE_GLOBS`, filtered from the frozen `GLOBS`, and the three recipes take an `{ includeArchive }` option |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` | Modified | The `--include-archive` flag, the `[archived]` label, `archived` in the JSON rows and the JSON lane `jsonLaneRecipe` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modified | The `--include-archive` flag and `append_archived_packets`, called from `collect_phase_dirs` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modified | `refresh_description_cache`, called at the end of `archive_spec` and `restore_spec` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modified | `recordsArchiveParent` keeps an archived packet with a stale parent in the repair. Not in the planned file list, added on the operator's decision |
| `.skilled/skills/system-spec-kit/runtime/lib/search/folder-discovery.ts` | Modified | The doc comment and one inline comment say `z_archive` stays in the description cache |
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Modified | The comment says `archive.sh` re-derives an archived packet when it moves it |
| `.skilled/commands/speckit/search.md` | Modified | Documents the mode with one recipe and says resume excludes archives |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modified | Documents the mode beside the glob rules, in the glob order note and in the coverage row |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | Two rows name only z-future as excluded |
| `.skilled/skills/system-spec-kit/runtime/lib/search/README.md` | Modified | One row names only z-future as excluded |
| `specs/**/z_archive/*/graph-metadata.json` | Modified | Written by `repair-derived.cjs --roots <archive> --apply` |
| `specs/descriptions.json` | Modified | Regenerated by `ensureDescriptionCache`. 5152 rows, 0 dead rows |
| `specs/**/description.json` | Modified | Rewritten by the same producer run where a file mtime made the folder look stale |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

DeepSeek V4.1 Flash built the code through the dsh harness on the LLM Gateway route, one change per dispatch, in eight dispatches: `ARCHIVE_GLOBS` and the option in `rg-lane.mjs`, the flag and the label in `rg-wrapper.mjs`, the JSON lane in `rg-wrapper.mjs`, the flag in `validate.sh`, the comment fix in `folder-discovery.ts`, the comment fix in `orchestrator.ts`, `refresh_description_cache` in `archive.sh` and `recordsArchiveParent` in `repair-derived.cjs`. The orchestrator read every diff. A Fable 5.2 documents worker edited the four reference docs.

The orchestrator first measured the two counts, picked the phrase "skill routing refactor" and saved the test baseline in `scratch/baseline.txt`. After the search changes it ran the phrase with and without the flag, then the JSON lane on an archived packet's id. After the validation change it ran `validate.sh specs/sk-doc --recursive` with and without `--include-archive` and compared the default run with the script from before the change. The repair pass ran as a dry run over all 53 archives, then with `--apply`, then again after the fix to `repair-derived.cjs`. The description cache producer ran first in a throwaway clone and then on the real tree. The `archive.sh` hook ran live in a throwaway clone. The full `npm test` run came last and matched the baseline.

The eleven code and reference doc files are in commit `05a83a7d88`. The regenerated metadata is committed as `55e73d37b5`, which holds 5397 files: 5145 `description.json`, 218 `graph-metadata.json`, 32 archived documents with a rewritten packet pointer and `specs/descriptions.json`. The documents of this phase are in `a637944644`. Nothing was pushed.

Two operator decisions shaped the build, both asked through the question tool in this session: "Commit everything, add hook" for the description cache and "Fix repair-derived" for the archived parent ids. The orchestrator records both in `decision-record.md` with the continuity writer.

Three checks came after the first closeout. `node --check` exited 0 for `rg-wrapper.mjs` and `rg-lane.mjs`. `npx vitest run tests/archive-track.vitest.ts` alone passed 60 tests. A restore in a throwaway clone exited 0 and left 0 dead rows. The subtrack and phase depths of the archive validation were then observed through `tests/validate-archive-recursive.vitest.ts`, written in phase 005.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Commit everything the producer rewrites and add the `archive.sh` hook. Operator decision | No CLI regenerates `specs/descriptions.json`. The producer also rewrites per-packet `description.json` files whose mtime makes them look stale, 5147 in a throwaway clone. Keeping the rewrites gives a cache with 0 dead rows, and the hook keeps it that way after each move |
| Fix `repair-derived.cjs`, a file outside the planned list. Operator decision | After the first `--apply` 31 archived packets still recorded their archive as `parent_id`. `repairFolder` returned before `fixRecordedLocation` when the validator report held no derivable rule, and the validator does not flag an archived packet's stale parent. Without the fix REQ-005 could not be met by the tool the plan names |
| Build the archive glob set by filtering the frozen `GLOBS` | The default constant is never edited, so a run without the flag builds the same argument vector as before. Each of the two files filters its own `GLOBS`, and the parity check compares both spellings in both modes |
| Run the JSON lane as a second invocation | Ripgrep lets the last output mode win without an error, so a metadata search cannot ride on the main recipe. The lane stays out of the named recipes, and the parity check never compares it |
| Leave a failed cache refresh as a warning | As built: the code comment in `archive.sh` says the move asks the producer to rebuild the cache and reports a failure rather than undoing the move. The move is already done when the refresh runs |
| Call the producer from the compiled module | No CLI regenerates the cache, so `archive.sh` imports `ensureDescriptionCache` from the compiled `folder-discovery.js` and warns when that file is missing. Why no CLI was added was not recorded during the build |
| Add no vitest case in this phase | Phase 005 owns the suites. The manual runs and the unchanged full suite are the cover until then |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

Every row is an orchestrator run of 2026-11-13 unless it names another source.

| Check | Result |
|-------|--------|
| Before the change: archived packets with a non-null `parent_id` | 35 of 267 packets directly in a `z_archive/` |
| Before the change: rows of `specs/descriptions.json` whose folder is missing on disk | 1334 of 3916 |
| Before the change: `node rg-wrapper.mjs path "skill routing refactor"` | Exit 1, 0 paths. `rg -l -F -i` found the phrase in `specs/sk-doc/z_archive/019-skill-routing-refactor/spec.md` and `timeline.md` |
| Before the change: `npm test`, saved in `scratch/baseline.txt` | Exit 0. 206 files passed and 3 skipped, 2525 tests passed and 20 skipped, 0 failed in every legacy stage |
| The phrase without the flag, after the change | The argument vector still holds `--glob '!**/z_archive/**'`, exit 1. The JSON record holds no `jsonLane` and no `archived` field |
| The phrase with `--include-archive`, path recipe | Exit 0, 2 paths, both ending `[archived]` |
| The phrase with `--include-archive`, structured recipe with `--json` | 2 rows, both `archived: true`, and `includeArchive: true` |
| `rg -n -F "'!**/z_archive/**'" rg-lane.mjs` | Still prints line 54 inside `GLOBS` |
| `rg-wrapper.mjs path "sk-doc/z_archive/019-skill-routing-refactor" --include-archive --limit 2` | Exit 0. A `json    : 308 archived metadata file(s)` section, 154 of its lines `graph-metadata.json` paths ending `[archived]` |
| A phrase that exists nowhere, with `--include-archive` | Exit 1, `json    : 0 archived metadata file(s)` |
| `tests/rg-wrapper-recipes.vitest.ts` and `tests/retrieval-coverage-parity.vitest.ts` | 44 tests passed |
| `bash -n validate.sh` and `bash -n archive.sh` | Exit 0 for both |
| `validate.sh specs/sk-doc --include-archive` | Printed `ERROR: --include-archive requires --recursive`, exit 2 |
| `validate.sh specs/sk-doc --recursive --include-archive` | 73 `RESULT:` lines, one for `specs/sk-doc/z_archive/019-skill-routing-refactor`. Exit 2, expected, because old archived packets fail current rules |
| `validate.sh specs/sk-doc --recursive` | 25 `RESULT:` lines, none holding `z_archive`, exit 0. Identical, timings stripped, to the run with the script from before the change |
| Repair pass, first dry run over all 53 `z_archive/` folders | 43 exit 0 and 10 exit 1, 187 packets to re-derive |
| Repair pass, dry run after `--apply` | Exit 0 for all 53, but 31 packets still recorded their archive as `parent_id` |
| Repair pass after the `repair-derived.cjs` fix, `--apply` on those 31 packets | 31 exit 0. 0 of 267 archived packets record a non-null `parent_id`, and the dry run exits 0 for all 53 archives |
| Description cache producer in a throwaway clone | 81 seconds. Also rewrote 5147 per-packet `description.json` files |
| Description cache producer on the real tree | 30 seconds. `specs/descriptions.json` holds 5152 rows, 0 dead rows and 2213 rows under `z_archive` |
| Clone: `archive.sh --force specs/cli-classifier/006-jev-feature-auto-enable` | Exit 0 in 13 seconds. The cache held no row for the old path, one row for `cli-classifier/z_archive/006-jev-feature-auto-enable` and 0 dead rows |
| Clone, after that archive: `archive.sh --restore specs/cli-classifier/z_archive/006-jev-feature-auto-enable` | Exit 0. The cache held a row for `cli-classifier/006-jev-feature-auto-enable`, no row for the archived path and 0 dead rows |
| `tests/validate-archive-recursive.vitest.ts`, the real `validate.sh` in temp trees | 5 of 5 passed. The sub-track case and the phase parent case each assert the archived folder is reported with the flag and absent without it |
| `node --check` on `rg-wrapper.mjs` and `rg-lane.mjs` | Exit 0 for both |
| `npx vitest run tests/archive-track.vitest.ts` alone | 60 passed |
| `rg -c "staging and archive" folder-discovery.ts` and `rg -c "nothing re-derives it" orchestrator.ts` | Both print nothing |
| `npm run build` in `.skilled/skills/system-spec-kit/runtime` | Exit 0 |
| `rg -c -e "--include-archive"` on `search.md` and `retrieval-conventions.md` | 1 or more for each file |
| The two `ENV-REFERENCE.md` rows and the `README.md` row | Each names only z-future as excluded |
| `npm test` after the build | Exit 0. 206 files passed and 3 skipped, 2525 tests passed and 20 skipped, 0 failed. Identical to `scratch/baseline.txt` |
| `generate-trigger-index.mjs --check` | Exit 1 during the build. 33 documents of this packet are new since the index was last built. Not caused by the code of this phase, and open until the orchestrator regenerates the index |
| Closeout worker: diff of commit `05a83a7d88` read for comments, credentials and search roots | No comment names a spec path, a task id or a requirement id. No credential or `.env` read. No new search root. A reading, not a run |
| Closeout worker: `validate.sh` on this phase folder with `--strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The archive validation reads one level only.** A run adds the `z_archive/` packets of the folder it is given and of each subtrack of a track root. It does not enter the archive of a packet it visits or the phase children of an archived packet. Run `validate.sh` on that packet with the flag to reach them.
2. **On the real tree archive validation is observed at track depth only.** The subtrack and phase depths are observed through `tests/validate-archive-recursive.vitest.ts`, which runs the real `validate.sh` in temp trees. No real subtrack archive or phase parent archive was validated with the flag.
3. **The restore through the new hook was run once, in a clone.** It exited 0 and left 0 dead rows. No vitest case asserts the cache after a restore, so rerun the restore by hand after a change to `refresh_description_cache`.
4. **The trigger index check is still red.** `generate-trigger-index.mjs --check` exits 1 until the index is regenerated with the new documents of this packet. T020, AC-002 and the goal criterion on it stay open until then.
5. **The vitest cover for this phase lives in phase 005.** `rg-include-archive.vitest.ts` and `validate-archive-recursive.vitest.ts` are in commit `5fefd819e1`. No suite covers the description cache hook or the `repair-derived.cjs` fix beyond the suites that existed before.
6. **The `archive.sh` hook costs one producer run per move.** That was 13 seconds in the clone and 30 seconds on the full tree. The run can also rewrite per-packet `description.json` files whose mtime makes them look stale, so check `git status` after a move and commit or discard those rewrites on purpose.
7. **One stale comment is left outside the scope.** The doc comment on `isExcludedFromGeneratedMetadata` in `runtime/lib/utils/index-scope.ts` still says "z_* staging or archive segment". The file was not in this phase's list.
8. **`scratch/baseline.txt` stays.** T004 and T022 cite it. Remove it when the phase closes.
<!-- /ANCHOR:limitations -->

---
