---
title: "Implementation Summary"
description: "A host names its trigger index folder in .skilled-host.json, and the generator, the lookup and the host check follow it. A setting that cannot be honored exits 2 instead of falling back."
trigger_phrases:
  - "configurable host index folder implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/023-configurable-host-index-folder"
    last_updated_at: "2026-11-09T18:41:01Z"
    last_updated_by: "claude-haiku-5-5"
    recent_action: "Recorded the verification evidence for the packet"
    next_safe_action: "Review the twelve-file diff and commit it"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-023-configurable-host-index-folder"
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-configurable-host-index-folder |
| **Status** | Complete |
| **Completed** | 2026-11-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Barter can name its host index folder `.index` with one file at its root. The generator, the lookup and the host check all follow that name, and a host that names nothing keeps `.speckit-index/`.

### Let a host repository name its trigger index folder

A host now declares its index folder in `.skilled-host.json` at its root, for example `{ "indexDir": ".index" }`. `hostIndexDir()` reads that file, and `hostIndexPath()`, `isHostRepository()` and the generator's own-folder check all resolve through it. A linked project reads the setting at its owning host, so the project needs no file of its own.

A setting the scripts cannot honor is an error, not a fallback. A file that is not valid JSON, an empty `indexDir`, an absolute path, `.`, a path that escapes the root, or a folder inside `.skilled/`, `specs/`, `.git/` or `node_modules/` makes the generator, the lookup and the legacy upgrade exit 2 and name the file. The folder is judged by where it lands, so a link, a differently cased name or a regular file under that name is refused as well. The default would have read or published an index the host did not ask for, and exit 1 would have looked like a clean no-hit.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/host-index.mjs` | Modified | `hostIndexDir()`, the settings check, and the configured folder in `hostIndexPath()` and `isHostRepository()` |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Modified | The own-folder check uses `hostIndexDir()`, and a setting error exits 2 with a prefixed message |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Modified | A setting error exits 2 with the message, and the comments name the configured folder |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts` | Modified | A new `host-named index directory` block of 27 cases, and one linked-project case |
| `.skilled/skills/system-spec-kit/runtime/data/README.md` | Modified | Describes `.skilled-host.json` and how linked projects read it |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md` | Modified | Documents the new exports and the error rules |
| `.skilled/skills/system-spec-kit/references/structure/folder-structure.md` | Modified | Section 7 names the configured folder |
| `.skilled/commands/speckit/search.md` | Modified | Describes automatic host index selection and adds the setting error to exit 2 |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modified | A setting error at start-up exits 2 with the message |
| `README.md` | Modified | "How search works" names the host index folder and the setting |
| `.skilled/skills/system-spec-kit/README.md` | Modified | The Gate 1 capability row names the host index folder and the setting |
| `.skilled/commands/speckit/README.txt` | Modified | Two troubleshooting rows for the setting |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline came first. At HEAD the host test file held 20 cases, and HEAD fixed the folder at lines 35 and 84 of `host-index.mjs`. The change followed. The exit-2 handling was added after a manual probe showed both scripts exiting 1 with a stack trace on a bad setting, because exit 1 means a clean no-hit to every caller.

The host test file then ran alone, and the 15 cli test files that reference the host or trigger index modules ran as one set. One of those runs overlapped a concurrent change to the same worktree, so its failures are not evidence about the code. The first clean run recorded the hashes and modification times of the seven files changed by then, before and after.

A review of that state found three gaps, and a second pass closed them. The folder check read only the spelling, so a link or a differently cased name could reach a refused place. The legacy upgrade crashed with exit 1 on a bad setting. The packet counted seven files where eight had changed. The second pass added `upgrade-legacy.mjs` as the ninth file.

A third pass closed what the review had left open. The lookup now prints one stderr line when the setting names a folder with no index while the default folder still holds one. A new case proves a linked project reads the index it keeps itself. Three more docs name the setting, which brings the count to twelve files. The host file and the 15-file set ran again on the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The setting lives in `.skilled-host.json` at the host root | A file the host controls, and a linked project reads it from its owner. An environment variable would have to be set in every linked project too |
| The setting is read at the owning root, not at the project | `owningHostRoot` already names the owner, so the owner's file decides and the project needs no setup |
| A malformed or unsafe setting throws and exits 2, with no fallback | A silent fallback would read or publish an index the host did not name, and exit 1 would look like a clean no-hit |
| `.skilled/`, `specs/`, `.git/` and `node_modules/` are excluded as folder names | `.skilled/` must stay identical to the pin, `specs/` is the corpus the index is built from, and the other two belong to tools that rewrite what they find inside |
| The folder is judged by its resolved location as well as its spelling | A link, or a differently cased name on a case-insensitive volume, reaches a refused folder under a spelling that looks harmless |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `host-trigger-index.vitest.ts` run alone | Observed in this session: `Test Files  1 passed (1)`, `Tests  48 passed (48)`, exit 0, on the final state. The HEAD file held 20 cases, so 28 are new. The second pass added nine: four rejection rows, the blank-space case, the two link cases, the regular-file case and the legacy-upgrade exit case. The third pass added the stderr-line case and the linked-project case |
| 15 related cli test files, final state | Observed in this session: `Test Files  15 passed (15)`, `Tests  297 passed | 1 skipped (298)`, exit 0 |
| 15 related cli test files, before the second pass | Observed: `Test Files  15 passed (15)`, `Tests  286 passed | 1 skipped (287)`, exit 0 |
| 15 related cli test files, first clean run | Observed in this session: `Test Files  15 passed (15)`, `Tests  282 passed | 1 skipped (283)`, exit 0. The hashes and modification times of the seven changed files matched before and after the run, and HEAD stayed at 5474fd9695 |
| 15 related cli test files, baseline | Operator-recorded before the change: 269 passed and 1 skipped (270). Not re-run here |
| `node --check` on the scripts | Observed on the final state: exit 0 for `host-index.mjs`, `lookup-trigger-index.mjs` and `upgrade-legacy.mjs`. `generate-trigger-index.mjs` passed before the second pass and was not touched after |
| `git diff --check` | Observed: exit 0 |
| Level helper, `recommend-level.sh --loc 494 --files 12` | Observed: prints Level 1 with score 42/100. The packet stays Level 2 as scaffolded. The LOC bands in `folder-structure.md` place 100 to 499 LOC at Level 2 |
| Mutation check | Operator-recorded: restoring the hard-coded default in `isHostRepository()` fails "counts the named directory, not the default, as the host signal". Not re-run here |
| Manual probe before the exit-2 change | Operator-recorded: both scripts exited 1 with a stack trace on a bad setting |
| `validate.sh --strict` | Observed on the final state: `Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0. The validator's own derived-metadata repair rewrote `description.json` and `graph-metadata.json` before this run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Leftover index seen from a linked project.** The stderr line is printed for the repository the lookup runs in. A linked project whose host is half migrated falls back to the packaged index with no line.
2. **Missing owner folder.** A linked project whose owner names a folder holding no index gets the packaged index, even when the owner still keeps an index in the default folder. This is deliberate, since the setting disowns that folder, and the case "gives a linked project the packaged index when its host names a folder holding no index" pins it.
3. **Barter's side.** The re-pin, the `.skilled-host.json` file, the regeneration and the removal of `.speckit-index/` belong to Barter.
<!-- /ANCHOR:limitations -->

---

