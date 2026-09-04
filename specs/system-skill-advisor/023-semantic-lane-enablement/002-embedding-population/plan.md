---
title: "Implementation Plan: Phase 2: embedding-population"
description: "Reproduce the skip against a copy of the database, fix whatever caused it, run the refresh through the daemon's own writable handle, then hold coverage with a check that fails when a node goes uncovered."
trigger_phrases:
  - "embedding refresh plan"
  - "vec table upsert"
  - "content hash guard"
  - "backend outage policy"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/002-embedding-population"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the implementation plan"
    next_safe_action: "Copy the database and reproduce the skip"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-002-embedding-population"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: embedding-population

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node |
| **Framework** | The advisor daemon, which owns the only writable database handle |
| **Storage** | SQLite, table `vec_768`, keyed by `skill_id` with a model id and a content hash per row |
| **Testing** | Vitest, including the refresh round-trip suite |

### Overview

Start with a copy of the live database and reproduce the skip, because the simplest explanation
is already ruled out and a fix aimed at a guess would be worse than no fix. Then run the refresh
through the daemon, verify the table by count rather than by the run's own report, and add a
check that fails when a node has no row.

The adapter path is already the one that runs, because the active pointer exists. It embeds the
`description` from each hub's `SKILL.md` frontmatter, upserts into the table named by the pointer
dimension, and skips a row whose stored hash still matches.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 recorded coverage, so there is a number to move
- [ ] The local backend serves the model the active pointer names
- [ ] A copy of the live database sits in `scratch/` for the reproduction

### Definition of Done
- [ ] Every acceptance criterion is met or waived against a decision record
- [ ] The coverage count is read from the table, not from the refresh result object
- [ ] A test fails when a node is left without a row
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Idempotent batch population behind a content hash, with a single writer.

### Key Components

- **`refreshSkillEmbeddings`**: dispatches to the adapter path when the active pointer exists, and to the retired column path when it does not.
- **`refreshSkillEmbeddingsViaAdapter`**: resolves the adapter, refuses to run on a dimension mismatch, walks nodes in identifier order, and upserts or deletes per row.
- **`skillDescriptionForEmbedding`**: reads `SKILL.md` beside the node's source path and returns its frontmatter description. An empty result deletes the row.
- **`loadSkillEmbeddings`**: the read side, which prefers the active `vec_<dim>` table and returns nothing when that table is absent.

### Data Flow

A refresh reads each node's source path, loads the description beside it, hashes it, compares
against the stored hash, embeds when they differ, and upserts the vector with the model id and
the new hash. The lane later reads that table per call.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `refreshSkillEmbeddingsViaAdapter` | Writes the active vector table | update, once the mechanism is known | The round-trip test covers the reproduced case |
| `skillDescriptionForEmbedding` | Decides whether a node is embeddable | update or unchanged, depending on the finding | A node with a description never reaches the delete path |
| `handlers/skill-graph/scan.ts` | Rebuilds the graph | update | A scan reports how many rows it wrote and how many it skipped |
| `loadSkillEmbeddings` | The read side | unchanged | No diff. Changing the reader would move the definition of coverage mid-packet |
| `tests/skill-graph/refresh-roundtrip.vitest.ts` | Covers dispatch and round-trip | update | A deliberately uncovered node fails the suite |

Required inventories:
- Same-class producers: `rg -n 'vec_768|vecTableNameForDim|upsertEmbedding' .opencode/skills/system-skill-advisor/mcp-server --glob '*.ts'`.
- Consumers of changed symbols: `rg -n 'refreshSkillEmbeddings|loadSkillEmbeddings' . --glob '*.ts' --glob '*.md'`.
- Matrix axes: pointer present or absent, description present or empty, backend up or down, hash matching or stale. Sixteen rows before completion is claimed.
- Algorithm invariant: after a successful refresh, every row of `skill_nodes` has exactly one row in the active vector table under the active model. A run that ends otherwise is a failed run, whatever it reports.
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
| Unit | The hash guard, the delete path and the dimension check | Vitest |
| Integration | A refresh against a copied database with all fourteen nodes | Vitest with a temporary database directory |
| Manual | The live refresh through the daemon, verified by a count query afterwards | The advisor CLI and sqlite3 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Local embedding backend | External | Green | No vectors, and the phase cannot close |
| Active pointer in `vec_metadata` | Internal | Green | A missing pointer sends the refresh down the retired column path |
| The daemon's writable handle | Internal | Green | A second writer risks corrupting the graph database |
| Phase 001 coverage number | Internal | Green | Without it there is no before to compare against |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The refresh empties rows it should have kept, or coverage falls after a run.
- **Procedure**: Stop the daemon, restore the database copy from `scratch/`, restart, and confirm the row count matches the pre-run figure.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Reproduce (copied database) ──► Fix ──► Populate (live, through the daemon)
                                              │
                                              └──► Hold (coverage check)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Reproduce | Phase 001 coverage | Fix |
| Fix | Reproduce | Populate |
| Populate | Fix | Hold |
| Hold | Populate | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour |
| Core Implementation | Medium | Four to six hours, most of it the reproduction |
| Verification | Medium | Two to three hours |
| **Total** | | **Seven to ten hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The live database is copied to `scratch/` with the daemon stopped
- [ ] The active pointer is recorded before the run
- [ ] The backend answers a single embed request before the batch starts

### Rollback Procedure
1. Stop the daemon so the writable handle is released
2. Restore the copied database over the live file
3. Restart and confirm the row count and the active pointer both match the pre-run record
4. Record what the failed run wrote, because a partial write is evidence about the mechanism

### Data Reversal
- **Has data migrations?** Yes. The refresh writes vectors and can delete rows
- **Reversal procedure**: Restore the copied database. Vectors are derived data, so nothing is lost that a rerun cannot rebuild
<!-- /ANCHOR:enhanced-rollback -->

---
