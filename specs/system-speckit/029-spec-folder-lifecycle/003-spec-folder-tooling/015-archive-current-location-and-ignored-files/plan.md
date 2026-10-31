---
title: "Implementation Plan: Phase 15: archive-current-location-and-ignored-files"
description: "Make archive.sh re-derive a moved packet's recorded paths through repair-derived.cjs, teach that tool to walk archives and fix specFolder and an archived parent, limit upgrade-legacy to derived fields for archived packets, and make the index walk skip git-ignored paths."
trigger_phrases:
  - "archive current location and ignored files plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 15: archive-current-location-and-ignored-files

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash for `archive.sh`, Node CommonJS and ESM for the repair, upgrade and corpus tools, TypeScript for the vitest suites |
| **Framework** | system-spec-kit runtime CLI, no application framework |
| **Storage** | The `specs/` tree and the committed trigger index |
| **Testing** | Vitest (`npx vitest run runtime/cli/tests`) plus an archive and restore of a real packet |

### Overview
Each fix lands at the producer. `archive.sh` hands the moved folder to `repair-derived.cjs`, which already owns derived fields, rather than growing its own rewrite. That tool gains the one field it never wrote, `description.json` `specFolder`, walks archives, and clears the parent a graph merge keeps after a move. The index walk asks git once for the paths the committed ignore files exclude.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented - spec.md sections 2 and 3
- [x] Success criteria measurable - SC-001 is a real archive and restore, SC-002 the index check
- [x] Dependencies identified - phase 13's corpus and phase 14's SH-03

### Definition of Done
- [x] Acceptance criteria reviewed - each row in `acceptance-criteria.md` carries its evidence
- [x] Tests passing - the spec-kit CLI suite
- [x] Docs updated - spec, plan, tasks, acceptance criteria, the implementation summary and both READMEs
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shell entry point over Node helpers. `archive.sh` already calls `refresh-track-roots.mjs` after a move and now calls `repair-derived.cjs` the same way.

### Key Components
- **`archive.sh`**: `rederive_moved` runs `repair-derived.cjs --roots <new folder> --apply` after an archive and after a restore, and warns instead of failing.
- **`repair-derived.cjs`**: archives leave the frozen set, `fixRecordedLocation` writes `specFolder` and clears the parent of a packet directly in an archive.
- **`upgrade-legacy.mjs`**: `repairArchived` runs only `repair-derived` on failing archived packets.
- **`lib/corpus.mjs`**: `gitIgnoredPaths` lists untracked ignored paths, and the walk skips them without listing them.

### Data Flow
A move changes a packet's path. The repair validates the packet, plans the recorded-path edits and re-derives the graph metadata from the new path. The index build lists ignored paths once, then walks the roots and drops any entry in that list.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `archive.sh` | Moves packets in and out of archives | Updated | `archive-track.vitest.ts` and a real archive and restore |
| `repair-derived.cjs` | Repairs derived fields | Updated | `repair-derived.vitest.ts` and a run of the previous version on the same fixture |
| `upgrade-legacy.mjs` | Upgrades old trees | Updated | `upgrade-legacy.vitest.ts` |
| `lib/corpus.mjs` | Walks the index corpus | Updated | `trigger-index.vitest.ts` and a rebuild compared with CI's index |
| Validator path rule | Compares recorded paths with the folder | Unchanged | It is the target the repairs meet |

Required inventories:
- Same-class producers: `archive.sh` archive and restore are the only movers. `migrate-generated-json.ts` already rewrites archives.
- Consumers of changed symbols: `walkCorpus` has one production caller, the generator. `repair-derived.cjs` is called by `archive.sh`, `upgrade-legacy.mjs` and the pre-commit gate.
- Matrix axes: archive or restore, by track packet or phase, by packet with or without a stored parent.
- Algorithm invariant: only derived fields change, and what a document says never does.
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
| Unit | The ignored walk, the archived repair, the archived upgrade | Vitest |
| Integration | `archive.sh` hands both moves to the re-derive | Vitest with a recording stub |
| Manual | Archive and restore a real track packet with a stored parent, validating each step | `archive.sh`, `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `repair-derived.cjs` and the graph backfill | Internal | Green | Moves would leave paths stale |
| git on the machine that builds the index | External | Green | Without it nothing is ignored, as before |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A move leaves a packet failing, or an index build drops a tracked document.
- **Procedure**: `git revert` the code commit, then regenerate the trigger index.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
repair-derived.cjs (specFolder, archives, parent)
     |
     +--> archive.sh (re-derive after a move)
     |
     +--> upgrade-legacy.mjs (archived packets)

lib/corpus.mjs (ignored paths) --> trigger index rebuild
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Repair tool | Nothing | Archive wiring, upgrade |
| Archive wiring | Repair tool | The real archive check |
| Corpus walk | Nothing | Index rebuild |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Repair tool and archive wiring | Med | Two tools and two tests |
| Upgrade alignment | Low | One function and one test |
| Corpus walk | Low | One helper and one test |
| **Total** | | **2026-10-08, no separate estimate recorded** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Archived packets already pass, so walking them plans no edit
- [x] The repair stays confined to the specs tree
- Feature flags and monitoring alerts do not apply to local CLI tools

### Rollback Procedure
1. `git revert` the code commit.
2. Regenerate the trigger index and commit it.
3. Rerun the CLI suite.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: The revert restores the tools. No packet changed in this phase.
<!-- /ANCHOR:enhanced-rollback -->

---
