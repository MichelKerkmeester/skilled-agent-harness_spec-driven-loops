---
title: "Plan: sk-design 012 Program Merge"
description: "Phased execution plan for the sk-design 012–018 → one multi-phased 012 merge: worktree isolation, history-preserving moves, metadata regeneration parents-last, cross-ref + pointer rewrites, historic-context root, a program retrospective, and a recursive-strict validation gate. Executed by GPT-5.6-SOL agents; orchestrator verifies each phase."
trigger_phrases:
  - "sk-design 012 merge plan"
  - "program consolidation execution phases"
  - "git-mv metadata regen validation plan sk-design"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/000-program-merge-design"
    last_updated_at: "2026-07-22T15:50:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Aligned plan to Level 3 template"
    next_safe_action: "Operator signs off; then dispatch SOL agents"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/000-program-merge-design/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-000-merge-design-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: sk-design 012 Program Merge

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Spec-folder markdown + JSON metadata |
| **Framework** | system-spec-kit canon (phase-parent, levels, validate.sh) |
| **Storage** | Git worktree cut from `origin/skilled/v4.0.0.0` |
| **Testing** | `validate.sh --recursive --strict` + a content-diff harness + `git log --follow` |

### Overview
Execute the `012–018 → 012` consolidation on an isolated worktree, in five ordered steps mapped onto three named phases: prep+worktree (Setup) → history-preserving moves + metadata + doc edits + retrospective (Core) → recursive-strict validation + commit (Verification). GPT-5.6-SOL-medium-fast agents do the mechanical work per `tasks.md`; the orchestrator verifies each phase against the tree (findings are hypotheses, confirmed before proceeding).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Operator signed off D1/D2/D3 (`decision-record.md`)
- [ ] Tree clean at v4; memory daemon stopped (0 writers)
- [ ] The 29-move map (`tasks.md`) frozen as source of truth

### Definition of Done
- [ ] `validate.sh --recursive --strict` Errors:0 on merged `012`
- [ ] Content-diff shows zero lost prose; `git log --follow` intact
- [ ] `012` root narrative + `retrospective.md` present; 7 old top-level folders gone
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Path + metadata + reference rewrites over a fixed content set (no runtime change).

### Key Components
- **The rename map** (`tasks.md`): the authoritative 29-move source→target table.
- **Metadata tools**: `generate-description.js` + `backfill-graph-metadata.js`, run children-before-parents.
- **The canon**: phase-parent lean-trio vs leaf; numeric level markers; the validation gotchas learned this session.

### Data Flow
Agents move folders with `git mv`, then regenerate metadata bottom-up, then rewrite pointers/cross-refs, then author the roots + retrospective; the orchestrator runs the validation + content-diff gates after each phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when planning changes that touch shared structure. Here the surfaces are spec-folder paths, metadata, and cross-references — no code, security, or persistence boundaries are touched.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design/012–018/**` folder paths | 8 flat sibling packet trees | move into one multi-phased `012` | `git log --follow` + tree listing |
| `description.json` / `graph-metadata.json` | per-folder metadata | regenerate parents-last | `validate.sh` metadata checks |
| `packet_pointer` + cross-ref links | in-doc references | rewrite to new paths | grep 0 stale / 0 broken |

Required inventories:
- Same-source packets: enumerated in `tasks.md` M01–M29.
- Consumers of changed paths: `rg -n '012/00[1-9]|013-|014-|015/|016-|017-|018-' .opencode/specs/sk-design` for cross-refs.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Verify clean v4 + daemon stopped
- [ ] Create worktree from `origin/skilled/v4.0.0.0`; capture `baseline-tree.txt`
- [ ] Freeze the `tasks.md` map

### Phase 2: Core Implementation
- [ ] Execute M01–M29 `git mv` (leaves before parents)
- [ ] Reduce `012` to lean-trio + narrative root; regenerate all metadata children-before-parents
- [ ] Rewrite `packet_pointer`s + inter-packet cross-refs
- [ ] Author `retrospective.md`

### Phase 3: Verification
- [ ] `validate.sh --recursive --strict` Errors:0
- [ ] Content-diff vs pre-merge v4 + `git log --follow` spot-checks
- [ ] Delete `000`; commit + push; reconcile primary checkout
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Merged `012` tree | `validate.sh --recursive --strict` (Errors:0) |
| Content-preservation | Every moved doc | diff new blob vs `git show origin/skilled/v4.0.0.0:<old-path>` — only pointer/cross-ref lines may differ |
| History | Sampled moved files | `git log --follow` |
| Reference integrity | Whole tree | grep 0 stale pointers, 0 broken links, bare `016` gone |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Clean v4 tree | Internal | Green (recovered this session) | Cannot start on a dirty tree |
| Memory daemon stopped | Internal | Green (stopped; fix owned by `031`) | Re-corrupts source docs mid-merge |
| Operator D1–D3 sign-off | External | Pending | Map/depth undecided |
| Canon tools (`generate-description.js`, `validate.sh`) | Internal | Green | Metadata/validation cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any validation/content-diff gate fails, or the operator withdraws approval.
- **Procedure**: Abandon/remove the throwaway worktree — the primary tree and `v4` are untouched. `git mv` keeps history so even a partial merge reverts cleanly. Nothing lands on `v4` until all gates pass and the operator approves the push.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core: move → metadata → refs → retrospective) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Operator sign-off | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | worktree + baseline capture |
| Core Implementation | Medium | 29 moves + ~40 metadata regens + ref rewrites + retrospective |
| Verification | Low-Med | recursive validate + content-diff harness |
| **Total** | | one focused agent run + orchestrator verification |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline tree + pre-merge blobs captured
- [ ] Work isolated on a throwaway worktree
- [ ] Primary tree confirmed clean before any reconcile

### Rollback Procedure
1. Stop the agent run
2. Remove the worktree (`git worktree remove --force`)
3. Confirm primary tree + `origin/skilled/v4.0.0.0` unchanged
4. Re-plan from the clean baseline

### Data Reversal
- **Has data migrations?** No (spec-folder paths only)
- **Reversal procedure**: Discard the worktree; nothing was pushed.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────┐   ┌─────────────────────────────┐   ┌──────────┐
│ Setup    │──►│ Moves → Metadata → Refs →    │──►│ Verify   │
│ worktree │   │ Roots + Retrospective        │   │ + Commit │
└──────────┘   └─────────────────────────────┘   └──────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| git mv M01–M29 | Setup | Moved tree | Metadata |
| Metadata regen | Moves | Valid description/graph JSON | Refs, Verify |
| Pointer/cross-ref rewrite | Moves (paths known) | Resolvable references | Verify |
| Retrospective | Moves (statuses readable) | `retrospective.md` | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **git mv M01–M29** - CRITICAL (everything downstream keys off final paths)
2. **Metadata regen children-before-parents** - CRITICAL
3. **Recursive-strict validate + content-diff** - CRITICAL

**Parallel Opportunities**:
- Pointer/cross-ref rewrites and retrospective authoring can run concurrently after the moves.
- Per-folder metadata regen fans out across agents (parents gated until children done).
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Worktree + baseline ready | `baseline-tree.txt` captured | on approval |
| M2 | 29 moves complete | tree shows renames, `git log --follow` intact | after Setup |
| M3 | Metadata + refs regenerated | 0 stale pointers, valid JSON | after M2 |
| M4 | Validated + pushed | `--recursive --strict` Errors:0; primary reconciled | final |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Full thematic regroup via git-mv on a worktree

**Status**: Accepted

**Context**: Eight interleaved sibling packets need to read as one program story without losing content or history.

**Decision**: Full thematic regroup (5 themes) executed with history-preserving `git mv` on a throwaway worktree, metadata regenerated parents-last, gated by content-diff + recursive-strict validate.

**Consequences**:
- Coherent program narrative + retrospective; ~40 pointers rewritten (mechanical).
- Fully reversible until the operator-approved push.

**Alternatives Rejected**:
- Append-only (keep 012/001-010, add 013–018 as 012/011+): leaves work interleaved, no unified story.
<!-- see decision-record.md ADR-001/002/003 for the D1/D2/D3 detail -->

---

## L3: AI EXECUTION PROTOCOL

How the dispatched GPT-5.6-SOL agents must behave during the merge.

### Pre-Task Checklist
Before each move batch, every agent confirms: (1) it is on the throwaway worktree, never the primary tree; (2) the `tasks.md` map is the only source of truth for source→target paths; (3) the target parent path exists (or is created leaves-last); (4) the daemon is stopped.

### Execution Rules

| ID | Rule |
|----|------|
| TASK-SEQ | Execute moves leaves-before-parents; regenerate metadata children-before-parents. |
| TASK-SCOPE | Touch ONLY paths named in the map. No content edits during Phase 2 moves; no adjacent cleanup. |
| TASK-MOVE | Use `git mv` exclusively (history-preserving). Never copy+delete. |
| TASK-VERIFY | After each phase, hand back to the orchestrator; do not self-certify completion. |

### Status Format
Each agent reports `STATUS=OK|ASK|FAIL|DEFER` with the move/edit IDs it completed and the evidence command it ran (e.g. `git status`, grep count). No optimistic done-language without evidence.

### Blocked Task Protocol
On any BLOCKED condition — target path collision, a cross-ref that cannot be resolved from the map, a content-diff mismatch, or an ambiguous nesting decision — the agent STOPS, emits `STATUS=ASK` with the exact blocker, and waits for the orchestrator. It never guesses a path or mutates content to unblock itself.
