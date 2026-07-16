---
title: "Implementation Plan: Opus Review Runtime Remediation (013 cross-review)"
description: "Fix the 4 P1 findings (restore crash window, front-proxy UTF-8 frame corruption, reconcileMoves spec_folder omission, version/tool-count doc sweep) and 17 P2 advisories from the Opus 4.8 cross-review of the deployed 013 runtime. Surgical, minimal diffs; each behavior-changing fix proven by a focused vitest."
trigger_phrases:
  - "opus review remediation plan"
  - "013 cross-review fix phases"
  - "restore crash window fix plan"
  - "front-proxy utf-8 frame fix plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/015-opus-review-runtime-remediation"
    last_updated_at: "2026-06-02T16:07:14Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 015 remediation packet from validated 013/002 sibling"
    next_safe_action: "Fix P1-1 checkpoint-restore data-loss crash window first"
    blockers: []
    key_files:
      - "lib/storage/checkpoints.ts"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
      - "lib/storage/incremental-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-review-remediation-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Opus Review Runtime Remediation (013 cross-review)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), better-sqlite3 |
| **Framework** | Spec Kit Memory MCP server |
| **Storage** | SQLite main DB plus `active_vec` vector shard (sqlite-vec) |
| **Testing** | Vitest (`npm run typecheck`, `npm run test:core`) |

### Overview
Remediate the Opus 4.8 cross-review of the deployed 013 runtime in four surgical fixes plus the P2 sweep. P1-1 reorders the checkpoint-restore file swap and hardens boot recovery so a crash mid-swap can never leave the daemon without a live database. P1-2 buffers raw bytes in the front-proxy and decodes UTF-8 only on complete-frame boundaries so split multi-byte sequences are never mangled. P1-3 carries `spec_folder` through the `reconcileMoves` row rewrite. P1-4 reconciles stale `SCHEMA_VERSION` and tool-count claims in the cited runtime docs. Each runtime-behavior fix is proven by a focused vitest that is added or extended and run. No file outside a cited finding is touched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Each cited finding verified against the current deployed source (see `spec.md` REQ-001)
- [ ] Success criteria measurable (SC-001..SC-004)
- [ ] Affected surfaces inventoried (restore swap, front-proxy decode, reconcile rewrite, cited docs)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-007)
- [ ] `npm run typecheck` shows 0 new errors and `npm run test:core` is green
- [ ] Each P1 behavior fix proven by a focused vitest that fails pre-fix and passes post-fix
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Minimal targeted fixes against the deployed runtime. Each finding maps to one surface; no shared abstraction is introduced. The restore-swap reorder keeps the existing two-phase journal; the front-proxy gains a single accumulating byte buffer drained on frame completion; the reconcile rewrite gains one preserved field.

### Key Components
- **Restore swap ordering (`checkpoints.ts`)**: order operations so the snapshot is in place before the live file is retired, and make boot recovery reconstruct a single consistent live DB from any partial on-disk state, preserving the journal semantics.
- **Front-proxy frame decode (`launcher-session-proxy.cjs`)**: accumulate raw bytes across reads, detect complete-frame boundaries, decode UTF-8 only once a frame is whole, and bound the accumulator.
- **`reconcileMoves` rewrite (`incremental-index.ts`)**: include `spec_folder` in the moved-row rewrite so the field is preserved verbatim, NULL included.
- **Doc reconciliation**: replace stale `SCHEMA_VERSION` and tool-count claims in the cited docs with the deployed values.

### Data Flow
P1-1 changes only the order of filesystem operations during restore and the recovery branch on boot. P1-2 changes the front-proxy from per-chunk decode to buffer-then-decode-on-boundary. P1-3 adds one column to the values carried through an existing rewrite. P1-4 is a documentation edit with no runtime effect.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet fixes correctness defects in a live runtime (data-loss crash window, frame corruption, field omission), so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/storage/checkpoints.ts` restore swap | Swaps snapshot files in during restore | update (reorder; harden recovery) | Crash-window vitest; existing restore tests stay green |
| `.opencode/bin/lib/launcher-session-proxy.cjs` frame decode | Decodes inbound frames per read | update (buffer; decode on boundary) | Split-sequence vitest asserts byte-identity |
| `lib/storage/incremental-index.ts` rewrite | Rewrites moved-file rows | update (carry `spec_folder`) | Reconcile vitest asserts `spec_folder` preserved |
| Cited runtime docs | State `SCHEMA_VERSION` and tool counts | update (reconcile to deployed) | grep confirms no stale value at cited locations |
| Non-cited 013 code | Other workstreams | unchanged | grep confirms no edits outside cited findings |

Required inventories:
- Same-class producers: confirm whether the restore-swap ordering pattern, the per-chunk decode pattern, and the row-rewrite omission appear elsewhere; fix only cited instances, record class status.
- Consumers of changed symbols: re-check callers of the restore swap, the front-proxy decode path, and `reconcileMoves` for assumptions about the old behavior.
- Algorithm invariant: restore must always leave exactly one consistent live DB after recovery; frame decode must be byte-identical to source; the rewrite must preserve `spec_folder` verbatim.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Every phase is gated: `npm run typecheck` (0 new errors) plus `npm run test:core` (green) before the next phase starts. Phase 0 is this packet setup, done by the orchestrator, not the executor.

### Phase 1: P1 correctness fixes (with proving tests)
- [ ] P1-1: reorder the restore swap and harden boot recovery; add/extend the crash-window vitest and run it
- [ ] P1-2: buffer bytes and decode UTF-8 on complete-frame boundaries; add/extend the split-sequence vitest and run it
- [ ] P1-3: carry `spec_folder` through the `reconcileMoves` rewrite; add/extend the reconcile vitest and run it
- [ ] Gate: `npm run typecheck` 0 new errors AND `npm run test:core` green

### Phase 2: P1-4 documentation sweep
- [ ] Reconcile stale `SCHEMA_VERSION` claims to the deployed value at every cited location
- [ ] Reconcile stale tool-count claims to the deployed count at every cited location
- [ ] grep confirms no stale value remains in the cited docs

### Phase 3: P2 advisories
- [ ] Resolve each of the 17 P2 advisories at its exact cited line, or record an explicit deferral with rationale
- [ ] Any P2 that changes runtime behavior gains a focused vitest and is run
- [ ] Gate: `npm run typecheck` 0 new errors AND `npm run test:core` green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `reconcileMoves` `spec_folder` carry-through (set + NULL) | Vitest |
| Integration | Restore crash mid-swap → boot recovery yields one live DB | Vitest |
| Integration | Front-proxy split multi-byte frame decodes byte-identical | Vitest |
| Regression | Existing restore, front-proxy, and reconcile tests stay green | Vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Cross-review findings accuracy | External (review artifact) | Green | A finding that does not match source must be reported, not blindly fixed |
| Existing two-phase restore journal | Internal | Green | P1-1 must preserve its semantics |
| Vitest harness | Internal | Green | Cannot prove behavior fixes |
| Deployed runtime source | Internal | Green | Each fix must verify against the live source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix regresses existing behavior, or a fix cannot be verified against deployed source.
- **Procedure**: Each fix is an independent minimal diff. Revert the offending per-fix change in isolation; the other fixes and all unrelated 013 code remain intact. P1-4 doc edits are revertible with no runtime effect.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (P1 correctness) ──► Phase 2 (P1-4 docs) ──► Phase 3 (P2 advisories)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2 |
| Phase 2 | Phase 1 | Phase 3 |
| Phase 3 | Phase 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: P1 correctness fixes | High | 4-6 hours |
| Phase 2: P1-4 doc sweep | Low | 1-2 hours |
| Phase 3: P2 advisories | Med | 3-5 hours |
| **Total** | | **8-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Main committed and recovery-baseline hash recorded
- [ ] Worktree node_modules symlinks in place (`mcp_server/node_modules`, `system-spec-kit/node_modules`, `system-spec-kit/shared/dist`)
- [ ] No `npm run build` while the daemon is live; typecheck only until the deliberate restart

### Rollback Procedure
1. Stop dispatching; `pkill -9 -f "opencode run"` between dispatches.
2. Revert the offending per-fix change on `main`.
3. Re-run `npm run typecheck` plus `npm run test:core` to confirm green.
4. Doc-only P1-4 edits revert with no runtime effect.

### Data Reversal
- **Has data migrations?** No — no schema-version bump is in scope.
- **Reversal procedure**: None required; all fixes are code/doc only.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│ P1 fixes    │     │ P1-4 docs   │     │ P2 advisory │
│ + tests     │     │ sweep       │     │ sweep       │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| P1 fixes + tests | None | 3 verified runtime fixes | P1-4 docs |
| P1-4 docs | Phase 1 | Accurate version/tool-count docs | P2 sweep |
| P2 sweep | P1-4 | 17 advisories resolved or deferred | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 - P1 correctness fixes** - 4-6 hours - CRITICAL
2. **Phase 2 - P1-4 doc sweep** - 1-2 hours - CRITICAL
3. **Phase 3 - P2 advisories** - 3-5 hours - CRITICAL

**Total Critical Path**: 8-13 hours

**Parallel Opportunities**:
- The three P1 fixes are independent and could be implemented in parallel; they are listed sequentially within Phase 1 only for a single gate.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | 4 P1 findings fixed | P1-1/P1-2/P1-3 vitests green; P1-4 docs accurate; existing tests green | End Phase 2 |
| M2 | 17 P2 advisories resolved or deferred | Each P2 fixed at its cited line or deferred with rationale | End Phase 3 |
| M3 | Packet validates strict | `validate.sh --strict` Errors: 0 | End Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Full ADRs live in `decision-record.md`. Summary:

### ADR-001: Surgical per-finding fixes over a runtime refactor

**Status**: Accepted

**Context**: The 013 runtime is deployed and live; the cross-review found discrete correctness defects, not a structural flaw.

**Decision**: Fix each cited finding with the minimal diff at its exact location; do not restructure or touch non-cited code.

**Consequences**:
- Smallest blast radius and easiest review.
- Two code paths or styles may briefly coexist where a finding is local.

**Alternatives Rejected**:
- A broader restore/front-proxy refactor: out of scope, higher risk on a live runtime.

---

## EXECUTOR DISPATCH CONTRACT

Per-fix code implementation runs through cli-opencode, model `openai/gpt-5.5-fast --variant high`, fast tier. The orchestrator verifies each gate and owns all git writes.

- Dispatch: `AI_SESSION_CHILD=1 opencode run --model openai/gpt-5.5-fast --variant high --agent general --format json --dir <worktree> "<prompt>" </dev/null`
- RM-8 four-layer safeguards (cli-opencode SKILL.md ALWAYS rule 13): (L1) rendered prompt carries literal `BANNED OPERATIONS` plus `ALLOWED WRITE PATHS`; (L2) `--dir` is a fresh `git worktree`, not the live tree; (L3) main committed plus recovery-baseline hash recorded; (L4) gpt-5.5 chosen for instruction-following.
- Worktree node_modules gotcha: three symlinks required - `mcp_server/node_modules`, `system-spec-kit/node_modules`, `system-spec-kit/shared/dist` - or `tsc` fails resolving `@spec-kit/shared/types`.
- Build-while-live: never `npm run build` (emits to `dist/` that the live daemon reloads). Typecheck is `npm run typecheck` (`tsc --noEmit`) only; daemon restart is a deliberate final step.
- `pkill -9 -f "opencode run"` between dispatches; treat `TS5101 baseUrl deprecated` in clean worktrees as pre-existing noise (count only new errors).
<!-- /IF -->
