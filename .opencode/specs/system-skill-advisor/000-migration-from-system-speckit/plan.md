---
title: "Implementation Plan: Migration From system-speckit"
description: "Batch-by-batch execution plan for moving skill-advisor spec folders out of system-speckit/026, 027, 028 into system-skill-advisor, driven by a /deep:review loop."
trigger_phrases:
  - "migration plan"
  - "skill-advisor extraction plan"
  - "deep review 20 iterations"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/000-migration-from-system-speckit"
    last_updated_at: "2026-07-07T11:01:53Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md alongside spec.md"
    next_safe_action: "Dispatch the /deep:review 20-iteration loop"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-07-07-skill-advisor-extraction"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Migration From system-speckit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec docs, JSON metadata (`description.json`, `graph-metadata.json`), git |
| **Framework** | system-spec-kit toolchain (`.opencode/skills/system-spec-kit/scripts/`) |
| **Storage** | Filesystem spec tree under `.opencode/specs/` |
| **Testing** | `validate.sh --strict --recursive` plus repo-wide `rg` for stale path references |

### Overview
Move every skill-advisor-scoped spec folder from `system-speckit/026/027/028` into `system-skill-advisor/`, numbered `001`-`012` in true chronological order, then reconcile the `children_ids`/prose fallout in the 3 source packets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (see spec.md)
- [x] Full source-to-destination manifest documented (see spec.md Scope section)
- [x] Chronological order confirmed via `git log --follow` archaeology, not assumed

### Definition of Done
- [ ] All folders in the manifest moved via `git mv`
- [ ] All cross-references rewritten
- [ ] `validate.sh --strict --recursive` clean on every touched folder
- [ ] docs updated (spec/plan/tasks all reconciled with final state)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequenced batch migration: each batch is one coherent subtree move (`git mv` plus cross-ref rewrite plus metadata regen plus validate), batches sequenced oldest-to-newest so the destination track fills in true chronological order.

### Key Components
- **Migration manifest** (spec.md Scope section): the source-to-destination mapping, authoritative task definition for the executor loop.
- **Tooling scripts** (`system-spec-kit/scripts/dist/{graph,spec-folder,memory}/*.js`, `spec/validate.sh`): mechanical move/regen/validate primitives, no dedicated move-script exists so these compose per `rename_pattern.md`.
- **`/deep:review` loop**: the executor, iterates batches until convergence or the 20-iteration budget is spent.

### Data Flow
Each iteration reads the next unmigrated batch from spec.md, moves it, regenerates its `description.json`/`graph-metadata.json`, updates the old and new parents' `children_ids`, validates, and commits before moving to the next batch.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Migration manifest documented in spec.md
- [x] Tracking spec folder authored and validated
- [ ] Tracking folder committed (scoped, explicit paths)

### Phase 2: Core Implementation

#### Batch 2a: 026 primary hub extraction
- [ ] Move `026/002-spec-kit-internals/002-skill-advisor/{001-006}` to `system-skill-advisor/{001-006}`
- [ ] Reconcile `026/002-spec-kit-internals/` `children_ids` (drops `002-skill-advisor`)

#### Batch 2b: Scattered leaves + embedder-stack cluster
- [ ] Append the 4 April-2026 hardening leaves into `system-skill-advisor/004-skill-advisor-production-hardening/` as children `005-008`
- [ ] Append the affordance-evidence leaf into `system-skill-advisor/003-skill-advisor-routing-engine/` as child `006`
- [ ] Merge the 3 May-2026 embedder-stack folders into new `system-skill-advisor/007-skill-advisor-embedder-stack/`
- [ ] Reconcile the 5-6 source parents this touches in 026

#### Batch 2c: 027 content extraction
- [ ] Move `027/004-shared-infrastructure/001-mcp-to-cli-tool-transition/003-skill-advisor-cli/` to `system-skill-advisor/008-skill-advisor-cli/`
- [ ] Extract the 8 advisor-only items out of `027/003-advisor-and-codegraph/` into `system-skill-advisor/009-advisor-and-codegraph-migrated-items/`
- [ ] Move `027/000-release-cleanup/009-skill-frontmatter-alignment/021-system-skill-advisor` to `system-skill-advisor/010-skill-advisor-frontmatter-alignment/`
- [ ] Renumber `027/003-advisor-and-codegraph/002-xce-feature-adoption-advisor-codegraph`'s remaining 4 code-graph-only children `001-004`, update `027/003-advisor-and-codegraph/spec.md` prose for its narrower remaining scope

#### Batch 2d: 028 hub + destination renumber
- [ ] Move `028/002-skill-advisor/` to `system-skill-advisor/011-skill-advisor-phase-parent/`
- [ ] Renumber `028`'s remaining top-level children `003→002, 004→003, 005→004, 006→005`
- [ ] Rename `system-skill-advisor/001-skill-advisor-tuning/` to `012-skill-advisor-tuning/`, fix every internal `001`-referencing metadata field (`packet_pointer`, `children_ids`, frontmatter) to `012`

#### Batch 2e: Destination track finalization
- [ ] Rewrite `system-skill-advisor/spec.md` (track root) to narrate the full 001-012 history
- [ ] Write `system-skill-advisor/context-index.md` documenting the 6 left-in-place shared/joint items
- [ ] Regenerate `system-skill-advisor/description.json` + `graph-metadata.json` for the full 001-012 children set

### Phase 3: Verification
- [ ] `validate.sh --strict --recursive` clean on `system-skill-advisor/`, `026/`, `027/`, `028/`
- [ ] Repo-wide `rg` for every old path fragment returns zero live hits
- [ ] Scoped `memory_index_scan` per moved path (never full-tree, this corpus SIGBUS's)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Every touched spec folder's metadata | `validate.sh --strict --recursive` |
| Cross-reference | Repo-wide stale path detection | `rg -l "<old-path-fragment>"` |
| Manual | Destination track root narrates coherently | Direct read of `system-skill-advisor/spec.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `backfill-graph-metadata.js` | Internal | Green | Manual `graph-metadata.json` edits needed |
| `generate-description.js` | Internal | Green | Manual `description.json` edits needed |
| `generate-context.js` | Internal | Green | `children_ids` reconciliation done by hand |
| `validate.sh` | Internal | Green | No automated strict-mode check |
| Concurrent sk-doc/sk-design session settling its own dirty files | External | Yellow (in progress at plan time) | Scoped commits avoid this dependency entirely by never touching paths outside this migration's scope |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any batch fails `validate.sh --strict` and cannot be fixed forward within the same iteration, or a `git mv` collides with an existing path.
- **Procedure**: `git revert` the single scoped commit for that batch (each batch is committed independently, so reverting one never touches another batch's work). Re-derive the batch's target paths before retrying.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Phase 1 (Setup) ──► Phase 2 (Core: 2a 026 hub → 2b scattered → 2e finalize) ──► Phase 3 (Verify)
                                     └─► 2c (027) ─┐
                                     └─► 2d (028 + destination) ─┘──► 2e
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Batch 2a (026 hub) | Phase 1 | `system-skill-advisor/001-006` | Batch 2b |
| Batch 2b (scattered + embedder) | Batch 2a | `system-skill-advisor/003/004/007` finalized | Batch 2e |
| Batch 2c (027) | Phase 1 | `system-skill-advisor/008-010` | Batch 2e |
| Batch 2d (028 + destination) | Phase 1 | `system-skill-advisor/011-012` | Batch 2e |
| Batch 2e (finalize) | Batch 2b, Batch 2d | Track root spec.md + full metadata | Phase 3 |
| Phase 3 (verify) | Batch 2e | Green `validate.sh --strict --recursive` | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Batch 2a (026 hub, ~90 folders)** - largest single batch - CRITICAL
2. **Batch 2b (scattered leaves + embedder merge)** - most judgment calls - CRITICAL
3. **Batch 2e (finalize) + Phase 3 (verify)** - convergence gate - CRITICAL

**Parallel Opportunities**:
- Batch 2c (027) and Batch 2d (028 + destination) have no shared file surface and can run in either order relative to Batch 2a/2b.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | 026 hub landed | `system-skill-advisor/001-006` exist, validate clean | Iteration ~6 |
| M2 | 027 + 028 landed | `system-skill-advisor/008-011` exist, validate clean | Iteration ~12 |
| M3 | Fully converged | All batches done, `validate.sh --strict --recursive` clean repo-wide on touched folders | Iteration ≤20 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the full ADRs (numbering scheme, shared-infra left-in-place, registry-fallout renumbering policy).

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
Before starting any batch in Phase 2: confirm the prior batch's `validate.sh --strict` passed, confirm no uncommitted changes from a different batch are sitting in the working tree, re-read any content-unconfirmed folder's spec.md before filing it.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Batches execute in the order listed in Phase 2 (2a through 2e); do not skip ahead |
| TASK-SCOPE | Each batch's `git mv` and metadata regen stays scoped to the folders named in that batch, never a broader sweep |

### Status Reporting Format
After each batch: report which folders moved, which parents were reconciled, and the `validate.sh --strict` result (Errors/Warnings count) for that batch's touched folders.

### Blocked Task Protocol
If a batch cannot complete (path collision, validate failure that cannot be fixed forward, missing tooling), stop that batch, leave prior batches' commits intact, and report the blocker instead of forcing the batch through.

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
