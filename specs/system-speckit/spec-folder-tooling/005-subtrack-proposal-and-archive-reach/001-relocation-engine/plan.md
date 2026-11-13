---
title: "Implementation Plan: Phase 1: relocation-engine"
description: "Add relocate.mjs, a Node CLI that moves, renumbers and re-parents spec packets by calling the existing writers in a fixed order. Widen two document lists so the pointer gap is both healed and gated. Prove it in a throwaway copy of the repository."
trigger_phrases:
  - "relocation engine plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: relocation-engine

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), CommonJS (`.cjs`) and bash |
| **Framework** | None. Plain Node CLI beside the existing `runtime/cli/spec/` scripts |
| **Storage** | Files under `specs/` and one JSON ledger |
| **Testing** | vitest, run with `npm test` in `.skilled/skills/system-spec-kit/runtime/cli` |

### Overview
This phase adds `relocate.mjs` in `.skilled/skills/system-spec-kit/runtime/cli/spec/`. It owns the order of operations and reuses the existing writers for each store. It also widens `DOCS` in `repair-derived.cjs` and the candidate list in `check-metadata-disk-consistency-helper.cjs`, and gives `archive.sh` restore a collision path. Proof is a dry run on the real tree, an apply in a throwaway copy and a second run that reports nothing to do.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0 with no failure that the baseline run did not have
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ordered writer pipeline

### Key Components
- **`relocate.mjs`** (new file): parses the map, runs preflight, moves folders and calls each writer in order. Extending `repair-derived.cjs` in place fails, because it repairs a folder where it sits and has no old path, so it cannot move a folder, renumber one or rewrite inbound references.
- **`repair-derived.cjs`** (extended in place): `DOCS` at line 104 gains four file names.
- **`check-metadata-disk-consistency-helper.cjs`** (extended in place): the candidate list gains three file names.
- **`archive.sh`** (extended in place): `restore_spec` calls the engine when a differently named live packet holds the restored number. A folder or link at the exact destination is still refused.
- **`relocation-ledger.json`** (new file): the redirect table is rebuilt from scans and cannot hold the operator-approved map, which is why the November regroup maps were never stored.

### Data Flow
A map of `from` and `to` pairs enters preflight. A clean preflight declares any new sub-track the map names, then moves the folders. The rewrites follow in this order: phase-parent `children_ids` and every whole-id reference under `specs/` in one pass, then `description.json` identity, then `graph-metadata.json` identity and document pointers for the moved packets and a re-derive of every packet whose references changed, then track and subtrack roots. References go first because a rewritten document changes the fingerprint the identity writers record. The applied map is appended to the ledger, the redirect table and trigger index are refreshed, and `sweep-track-roots.mjs` then `validate.sh` on each moved packet close the run.

### Implementation Decisions
These were settled while building and are what the code does.
- **Reference reach.** Every whole old id in every text file under `specs/` is replaced, not only `manual.*` and link targets, because no old id may remain there. Relative markdown links are resolved and recomputed when their file or their target moves, which also fixes outbound links from a moved packet.
- **Order.** References are rewritten before the identity writers run, as the data flow says. A rerun that finishes an interrupted apply re-derives the moved packets and every packet that names a moved id, because it cannot know which ones the first run rewrote.
- **Description cache.** No command regenerates `specs/descriptions.json`, so moved rows are renamed by the same whole-id substitution the November regroup used. Full regeneration belongs to phase 004.
- **Map input.** The `--map` file is never rewritten, wherever it is kept, because it names every old id on purpose.
- **Extra refusals.** A destination that is another entry's source is refused, since a chain or swap makes a rerun ambiguous. A number already held by a live or archived sibling is refused, and `--renumber` counts archived numbers as taken.
- **Sub-tracks.** A map may move packets into a sub-track that does not exist yet, and the run declares it. `--declare-subtrack` alone refuses a track that holds flat packets, since that would leave the track mixed.
- **Dirty tree.** The check runs only while moves are pending. A rerun works on the tool's own uncommitted output and would otherwise refuse itself.
- **Pointer check.** `check-metadata-disk-consistency-helper.cjs` reads the first listed document that carries a pointer, so the three added names are read only when the earlier documents carry none. Reading every document would flag the live stale pointers measured in T001.
- **Parent on a move into a track root.** `repair-derived.cjs` `expectedParentId` clears a recorded parent other than the packet's own track for a packet directly in a track root, and any recorded parent at the specs root. The re-derive cannot clear it, because `mergeGraphMetadata` keeps a stored parent over a null one.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches path handling and a shared validator rule, so the surfaces are listed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/spec/repair-derived.cjs` `DOCS` | Producer: names the documents whose `packet_pointer` is rewritten | update | `rg -n "^const DOCS" runtime/cli/spec/repair-derived.cjs` lists nine file names |
| `runtime/cli/rules/check-metadata-disk-consistency-helper.cjs` | Policy: names the documents `METADATA_DISK_PATH_CONSISTENCY` reads | update | `rg -c "goal.md" runtime/cli/rules/check-metadata-disk-consistency-helper.cjs` prints 1 |
| `runtime/cli/spec/archive.sh` `archive_spec` and `restore_spec` | Consumer: calls `repair-derived.cjs --roots <dest> --apply` after a move | update `restore_spec` only | `archive-track.vitest.ts` passes |
| `runtime/cli/lib/track-roots.mjs` `trackLayout` | Helper: judges a mixed track for `sweep-track-roots.mjs` | unchanged, imported | `rg -n "trackLayout" runtime/cli/spec/relocate.mjs` prints one import line |
| `runtime/cli/tests/repair-derived.vitest.ts` | Test: pins the current five-document behavior | update expectations | `npx vitest run tests/repair-derived.vitest.ts` exits 0 |

Required inventories:
- Same-class producers: `rg -n "packet_pointer" .skilled/skills/system-spec-kit/runtime/cli --glob '*.cjs' --glob '*.mjs' --glob '*.sh'`.
- Consumers of changed symbols: `rg -n "DOCS\b|repair-derived" .skilled/skills/system-spec-kit/runtime --glob '*.ts' --glob '*.cjs' --glob '*.mjs' --glob '*.sh'`.
- Matrix axes: input mode (map, single, renumber), tracked or untracked, source depth (track, subtrack, phase), destination depth (track, subtrack, phase).
- Algorithm invariant: an id is rewritten only when the whole path id matches a `from` entry. Adversarial cases are a prefix id, a joined id, a path outside `specs/`, a no-op map and a symlinked folder.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup measures the stale pointers and captures the `npm test` baseline. Implementation builds `relocate.mjs` and widens `repair-derived.cjs`, `check-metadata-disk-consistency-helper.cjs` and `archive.sh`. Verification runs a dry run on the real tree, an apply in a throwaway copy and a second run that exits 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Preflight refusals and id substitution in `relocate.mjs`. Phase 005 writes the suite | vitest |
| Integration | `repair-derived.vitest.ts` and `archive-track.vitest.ts` stay green after the widened lists | vitest |
| Manual | `relocate.mjs --map <sample>` dry run on the real tree, then `--apply` in a throwaway copy | `node`, `git status --porcelain` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `runtime/cli/graph/migrate-generated-json.ts --only` | Internal | Green | No writer for `specId` and `parentChain` |
| `runtime/cli/spec/refresh-track-roots.mjs --track` | Internal | Green | Track roots stay stale and the pre-push gate blocks |
| `sk-doc/shared/scripts/cite-drift-scan.mjs --rebuild-redirects` | Internal | Green | The redirect table lags the move |
| The command that regenerates `specs/descriptions.json` | Internal | Green | None exists. T002 found the producer has no caller, so moved rows are renamed by substitution |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `relocate.mjs --apply` exits 2 in the throwaway copy with stores that disagree, or `repair-derived.vitest.ts` fails after the `DOCS` change.
- **Procedure**: Revert the commit that carries this phase. No real packet moves in this phase, so no data needs restoring.
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
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 002-subtrack-proposal |
<!-- /ANCHOR:phase-deps -->

---
