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
This phase changes `rg-wrapper.mjs`, `rg-lane.mjs`, `validate.sh` and `archive.sh` in place and adds no new file. The archive mode is a second glob set built from the frozen default, so a run without the flag is identical to today. Proof is a search for a phrase that lives only under `specs/sk-doc/z_archive/`, with and without the flag, and a clean `generate-trigger-index.mjs --check`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0 with no failure that the baseline run did not have
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Opt-in flag branch

### Key Components
- **`rg-wrapper.mjs`** (extended in place): the recipe builders take the archive variant of `GLOBS` when the flag is set, label archived rows and run the JSON lane.
- **`rg-lane.mjs`** (extended in place): exports the archive variant beside the frozen `GLOBS`, so both files share one definition.
- **`validate.sh`** (extended in place): `collect_phase_dirs` adds `z_archive/[0-9][0-9][0-9]-*/` entries when the flag is set.
- **`archive.sh`** (extended in place): calls the description cache producer after `rederive_moved`.
- **No new file**: each change is a branch in a script that already owns the behavior.

### Data Flow
A search with `--include-archive` builds its ripgrep arguments without the archive exclusion, runs the markdown recipe and the JSON lane, and marks every result whose path holds a `z_archive` segment. A recursive validation with the flag appends the archived packet folders to the list of folders it already visits, at track, subtrack and phase depth.
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

Setup measures the stale `parent_id` records and the dead rows in `specs/descriptions.json` and picks the archive-only phrase. Implementation edits `rg-lane.mjs`, `rg-wrapper.mjs`, `validate.sh` and `archive.sh`, runs the repair pass and fixes the docs and comments. Verification searches the phrase with and without the flag and runs `generate-trigger-index.mjs --check`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The default and the archive argument vectors. Phase 005 writes the suite | vitest |
| Integration | `validate-subtrack.vitest.ts`, `archive-track.vitest.ts` and `repair-derived.vitest.ts` stay green | vitest |
| Manual | `/speckit:search` with and without the mode on the archive-only phrase, and `validate.sh specs/sk-doc --recursive --include-archive` | `node`, `bash` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `rg` (ripgrep) | External | Green | No search lane at all |
| `runtime/cli/spec/repair-derived.cjs --roots` | Internal | Green | Stale `parent_id` records stay |
| The command that regenerates `specs/descriptions.json` | Internal | Yellow | UNKNOWN command. REQ-006 stays blocked until phase 001 task T002 names it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A default search returns an archived hit, or `generate-trigger-index.mjs --check` exits non-zero.
- **Procedure**: Revert the commit that carries this phase. The archive metadata repair and the cache regeneration are in the same commit and revert with it.
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
