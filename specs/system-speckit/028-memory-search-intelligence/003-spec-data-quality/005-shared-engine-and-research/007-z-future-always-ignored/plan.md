---
title: "Implementation Plan: z_future Always Ignored In Backfill [template:level_2/plan.md]"
description: "Add z_future to the backfill walk exclusion set so the tree walk unconditionally prunes the staging area, correct the header comment to match, and rebuild the dist via tsc. The change is one set entry plus a comment, scoped to the backfill generator and its dist, leaving the parser and z_archive handling untouched."
trigger_phrases:
  - "z future always ignored"
  - "backfill graph metadata exclusion"
  - "excluded dirs z future"
  - "backfill dist rebuild"
  - "collectSpecFolders staging skip"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/005-shared-engine-and-research/007-z-future-always-ignored"
    last_updated_at: "2026-07-04T17:12:03.578Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Edited the exclusion set and comment, rebuilt dist via tsc"
    next_safe_action: "Verify z_archive parity and a clean dry-run"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: z_future Always Ignored In Backfill

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript backfill generator compiled to a Node dist |
| **Framework** | The system-spec-kit graph tooling, walked over the specs tree |
| **Storage** | graph-metadata.json files under packet folders, not touched by this fix |
| **Testing** | A direct collectSpecFolders check, a z_archive parity check, and a default dry-run |

### Overview
The backfill walk gathers spec folders under a root, then refreshes each one. The walk pruned `z_future` only under `--active-only`, so a default run entered the staging area and the parser threw at the refresh site because `z_future` is not a supported specs root. The fix moves `z_future` from a conditional skip to an unconditional one by adding it to the `EXCLUDED_DIRS` set the walk already consults at every directory boundary. The header comment is corrected to document the new contract. The dist is rebuilt via tsc so the compiled output carries the same exclusion. `z_archive` is deliberately left out of the unconditional set so it stays included by default and skippable via `--active-only`.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A single exclusion set drives the directory pruning for the whole walk. The fix adds one name to that set rather than threading a new conditional through the walk, so the safe behavior is unconditional and there is one place that names every always-skipped directory.

### Key Components
- **`backfill-graph-metadata.ts`**: the generator. Its `EXCLUDED_DIRS` set lists directory names the walk never enters. Adding `z_future` there prunes the staging tree at the boundary, before any folder inside it reaches the refresh path. The header comment documents the resulting contract.
- **The dist `backfill-graph-metadata.js`**: the compiled output the runtime actually loads. It is rebuilt from the corrected source so it carries the same exclusion.

### Data Flow
The walk reads each directory under the root, consults `EXCLUDED_DIRS` before descending, and refreshes the folders it keeps. With `z_future` in the set, the walk prunes it at the boundary and never hands a staging folder to the refresh path, so the parser is never asked to treat a non-specs-root folder as a packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This fix touches path handling in the backfill walk. It changes which directories the walk enters and rebuilds the compiled dist, leaving the parser and z_archive handling unchanged. The surfaces below are the backfill generator and its dist, the two files the fix modifies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `backfill-graph-metadata.ts` EXCLUDED_DIRS | The directory-name set the walk prunes on | add z_future, correct the header comment | grep shows z_future in EXCLUDED_DIRS and the comment states the always-skip contract |
| `backfill-graph-metadata.js` dist | The compiled output the runtime loads | rebuild via tsc from the corrected source | the dist carries z_future in the exclusion and a default dry-run exits clean |
| graph-metadata parser refresh path | Throws when handed a non-specs-root folder | no change, made unreachable for z_future | the walk skips z_future so the parser is never handed it |

Required inventories:
- Same-class producers: `rg -n "EXCLUDED_DIRS" .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`.
- Consumers of changed symbols: the walk in `collectSpecFolders` is the only consumer of `EXCLUDED_DIRS`, nothing else imports the set.
- Path axes: default run versus `--active-only`, z_future always skipped, z_archive skipped only under `--active-only`.
- Algorithm invariant: the walk prunes any directory whose name is in `EXCLUDED_DIRS` before descending, so no folder under a skipped directory reaches the refresh path.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the root cause, the conditional z_future skip lets a default walk enter the staging area and throw
- [x] Confirm z_archive must stay included by default and skippable via --active-only

### Phase 2: Core Implementation
- [x] Add z_future to the EXCLUDED_DIRS set so the walk unconditionally prunes it
- [x] Correct the header comment to state z_future is always skipped while z_archive stays included by default and skippable via --active-only
- [x] Rebuild the dist via tsc from the corrected source

### Phase 3: Verification
- [x] Confirm collectSpecFolders on the specs root returns zero z_future folders and no longer throws
- [x] Confirm z_archive parity, included by default and excluded under --active-only
- [x] Confirm a default dry-run exits 0 with no z_future or supported-specs-root mention
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | collectSpecFolders on the specs root returns zero z_future folders | direct invocation of the collector against the live specs root |
| Integration | A default backfill dry-run completes without throwing on z_future | `backfill --dry-run` exit code and output inspection |
| Manual | z_archive stays included by default and excluded under --active-only | comparing folder counts across the two modes |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The graph-metadata parser refresh path | Internal | Green | The fix exists to stop the walk reaching this path with a staging folder |
| The tsc build of the backfill dist | Internal | Green | A stale dist would keep the crash despite a fixed source |
| The EXCLUDED_DIRS walk pruning | Internal | Green | The fix relies on the walk already pruning on this set |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The exclusion drops a folder it should refresh, or the dist rebuild proves unsound.
- **Procedure**: Remove z_future from EXCLUDED_DIRS, restore the prior header comment, and rebuild the dist. The change is one set entry and a comment, so the revert is mechanical.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Core Implementation | Low | 0.5 hour |
| Verification | Low | 0.5 hour |
| **Total** | | **1-2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] z_archive parity confirmed before and after the change
- [x] Dist rebuilt via tsc and verified to carry the exclusion
- [x] A default dry-run exits clean

### Rollback Procedure
1. Remove z_future from EXCLUDED_DIRS in the source
2. Restore the prior header comment
3. Rebuild the dist via tsc and confirm it matches the reverted source

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change only narrows which directories the walk enters and writes no data
<!-- /ANCHOR:enhanced-rollback -->

---
