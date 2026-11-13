---
title: "Implementation Plan: Phase 4: archive-search-and-json"
description: "Add an opt-in --include-archive mode to the two ripgrep recipe files and to validate.sh --recursive, without touching the default path. Run one repair-derived pass over archives and regenerate the description cache. Prove it with a phrase that lives only in an archive and an unchanged trigger index."
trigger_phrases:
  - "archive search and json plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: archive-search-and-json

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), bash, TypeScript comments and markdown |
| **Framework** | None. ripgrep is the search engine |
| **Storage** | `graph-metadata.json` under archives and `specs/descriptions.json`, both written by their producers |
| **Testing** | vitest, run with `npm test` in `.skilled/skills/system-spec-kit/runtime/cli` |

### Overview
This phase changes `rg-wrapper.mjs`, `rg-lane.mjs`, `validate.sh` and `archive.sh` in place and adds no new file. During the build it also changed `repair-derived.cjs`, on the operator's decision, because the first repair pass left 31 archived packets with a stale `parent_id`. The archive mode is a second glob set built from the frozen default, so a run without the flag is identical to today. Proof is a search for a phrase that lives only under `specs/sk-doc/z_archive/`, with and without the flag, and a clean `generate-trigger-index.mjs --check`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met. Open: AC-002 is `Unmet` until the regenerated trigger index makes `generate-trigger-index.mjs --check` exit 0. The other seven rows of `acceptance-criteria.md` are `Met`
- [x] `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0 with no failure that the baseline run did not have
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Opt-in flag branch

### Key Components
- **`rg-wrapper.mjs`** (extended in place): the recipe builders take the archive variant of `GLOBS` when the flag is set. Archived rows end `[archived]` in the text report and carry `archived: true` in the JSON rows. The JSON lane, `jsonLaneRecipe`, is a second invocation and stays out of the named recipes.
- **`rg-lane.mjs`** (extended in place): exports `ARCHIVE_GLOBS` beside the frozen `GLOBS`, and its three recipes take an `{ includeArchive }` option. As built each file filters its own `ARCHIVE_GLOBS` from its own `GLOBS`, and `assertRecipeParity` compares the two spellings in both modes.
- **`validate.sh`** (extended in place): the new `append_archived_packets` adds the `z_archive/[0-9][0-9][0-9]*/` folders of the folder `collect_phase_dirs` is given, and of each subtrack of a track root, when the flag is set. It reads one level only.
- **`archive.sh`** (extended in place): the new `refresh_description_cache` calls the description cache producer after `rederive_moved`, in `archive_spec` and in `restore_spec`. A failed refresh prints a warning and does not undo the move.
- **`repair-derived.cjs`** (extended in place, added during the build): the new `recordsArchiveParent` keeps a packet in the repair when it records its archive as `parent_id`, even when the validator report holds no derivable rule.
- **No new file**: each change is a branch in a script that already owns the behavior.

### Data Flow
A search with `--include-archive` builds its ripgrep arguments without the archive exclusion, runs the markdown recipe and the JSON lane, and marks every result whose path holds a `z_archive` segment. The exit is 0 when either lane matches. A recursive validation with the flag appends the archived packet folders to the list of folders it already visits, for the folder it is given and for each subtrack of a track root.

### Operator Decisions
- **Commit everything the producer rewrites, and add the `archive.sh` hook.** No CLI regenerates `specs/descriptions.json`. Its producer, `ensureDescriptionCache`, also rewrites per-packet `description.json` files whose mtime makes them look stale, 5147 of them in a throwaway clone. The operator chose to keep those rewrites and to call the producer from `archive.sh` after each move.
- **Fix `repair-derived.cjs`.** The file was not in this phase's list. `repairFolder` returned before `fixRecordedLocation` when the validator report held no derivable rule, so 31 archived packets kept a stale `parent_id` after the first `--apply`. The operator chose the fix over a second tool.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches the shared search recipe and corrects misleading comments, so the surfaces are listed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/retrieval/lib/rg-lane.mjs` `GLOBS` | Producer: the shared glob set | update, default frozen | The default vector test passes unchanged |
| `runtime/cli/retrieval/rg-wrapper.mjs` `GLOBS` | Producer: the wrapper's glob set | update, default frozen | `node rg-wrapper.mjs` without the flag prints the same report as before on one fixed phrase |
| `runtime/cli/retrieval/lib/corpus.mjs` `EXCLUDED_DIR_NAMES` | Policy: trigger index walker excludes `z_archive` | unchanged | `generate-trigger-index.mjs --check` exits 0 |
| `runtime/cli/spec/validate.sh` `collect_phase_dirs` | Producer: the recursive folder list | update | `validate-subtrack.vitest.ts` passes |
| `runtime/cli/spec/repair-derived.cjs` `repairFolder` | Producer: re-derives metadata and the recorded location | update, added during the build | After `--apply` on the 31 packets, 0 of 267 archived packets record a non-null `parent_id` and the dry run exits 0 for all 53 archives |
| `runtime/cli/spec/archive.sh` `archive_spec` and `restore_spec` | Producer: moves a packet into or out of an archive | update | `bash -n archive.sh` exits 0 and `archive-track.vitest.ts` passes |
| `runtime/lib/search/folder-discovery.ts` `ensureDescriptionCache` | Producer: writes `specs/descriptions.json` and stale per-packet `description.json` files | unchanged, called from the compiled module | The dead row count measured again prints 0 |
| `runtime/lib/utils/index-scope.ts` lines 192 to 201 | Policy: keeps `z_archive` in generated metadata on purpose | unchanged, the source of truth for the comment fixes | `rg -n "z_archive is deliberately kept" runtime/lib/utils/index-scope.ts` prints one line |
| `runtime/lib/validation/orchestrator.ts` `isArchivedPacket` | Consumer: its comment says nothing re-derives an archived packet | update the comment only | `npm run build` in `runtime/` exits 0 |

Required inventories:
- Same-class producers: `rg -n "z_archive/\*\*" .skilled/skills/system-spec-kit --glob '*.mjs' --glob '*.ts' --glob '*.md' --glob '!**/node_modules/**'`.
- Consumers of changed symbols: `rg -n "rg-lane|rg-wrapper|GLOBS" .skilled/skills/system-spec-kit/runtime --glob '*.mjs' --glob '*.ts' --glob '*.cjs'`.
- Matrix axes: flag (off, on), archive depth (specs root, track, subtrack, phase), file kind (markdown, `description.json`, `graph-metadata.json`).
- Algorithm invariant: with the flag off, the ripgrep argument vector is byte-identical to the one built before this phase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup measures the stale `parent_id` records and the dead rows in `specs/descriptions.json` and picks the archive-only phrase. Implementation edits `rg-lane.mjs`, `rg-wrapper.mjs`, `validate.sh` and `archive.sh`, runs the repair pass, fixes `repair-derived.cjs` and reruns it on the 31 packets the first pass left, regenerates the description cache and fixes the docs and comments. Verification searches the phrase with and without the flag and runs `generate-trigger-index.mjs --check`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The default and the archive argument vectors. Phase 005 writes the suite. This phase adds no vitest case. `rg-wrapper-recipes.vitest.ts` and `retrieval-coverage-parity.vitest.ts` stay green | vitest |
| Integration | `validate-subtrack.vitest.ts`, `archive-track.vitest.ts` and `repair-derived.vitest.ts` stay green, as part of the full `npm test` run | vitest |
| Manual | `rg-wrapper.mjs` with and without the mode on the archive-only phrase, the JSON lane on an archived packet's id, `validate.sh specs/sk-doc --recursive` with and without `--include-archive`, the repair dry runs over all 53 archives and one `archive.sh` move in a throwaway clone | `node`, `bash` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `rg` (ripgrep) | External | Green | No search lane at all |
| `runtime/cli/spec/repair-derived.cjs --roots` | Internal | Green | Stale `parent_id` records stay |
| The producer of `specs/descriptions.json`, `ensureDescriptionCache` in the compiled `folder-discovery.js` | Internal | Green | No CLI regenerates the cache, so the producer is called from the compiled module. Without the compiled module `archive.sh` warns and leaves the cache as it is |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A default search returns an archived hit, or `generate-trigger-index.mjs --check` exits non-zero.
- **Procedure**: Revert commit `05a83a7d88`, which carries the eleven code and reference doc files of this phase. The archive metadata repair and the cache regeneration are not in that commit. They are committed as `55e73d37b5`, which holds 5397 files: 5145 `description.json`, 218 `graph-metadata.json`, 32 archived documents with a rewritten packet pointer and `specs/descriptions.json`. Revert that commit to undo them.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 003-subtrack-archive-and-numbering | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 005-tests-and-closeout |
<!-- /ANCHOR:phase-deps -->

---
