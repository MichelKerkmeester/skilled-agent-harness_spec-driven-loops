---
title: "Implementation Plan: Make Fan-Out Fulfillment Evidence-Derived and Dispatch Containment Enforced"
description: "Replace report-presence fulfillment with a per-mode artifact contract, make dispatch provenance durable in the executor audit, enforce containment uniformly across dispatch kinds with content-identity dirty-path detection, move shell wrappers to argv dispatch, and allowlist the observability sink."
trigger_phrases:
  - "fanout dispatch integrity"
  - "fanout fulfillment artifact contract"
  - "write containment dirty path"
  - "executor audit provenance"
  - "deep loop 028 fanout"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/028-fanout-dispatch-integrity"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan from the WS1 phase-tree proposal"
    next_safe_action: "Set up the isolated worktree before any dispatch work"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

# Implementation Plan: Make Fan-Out Fulfillment Evidence-Derived and Dispatch Containment Enforced

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS (`runtime/scripts`) plus TypeScript (`runtime/lib/deep-loop`) and YAML command assets |
| **Framework** | vitest via `runtime/vitest.config.ts` |
| **Storage** | Lineage artifact trees, executor audit JSONL, observability sink records |
| **Testing** | vitest (`npm test`), tsc (`npm run typecheck`), the existing `executor-audit-*.test.ts` receipts suites |

### Overview
Define the per-mode artifact contract before touching dispatch, because fulfillment is the load-bearing half. Then restore provenance, unify containment across kinds, move wrappers to argv, and allowlist the sink. Every dispatch test runs in an isolated worktree, because this child's own findings include a live incident where containment reverted a concurrent session's files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `021`'s hashed-child-manifest boundary has landed, so this child can be scaffolded without widening the parent recursive glob
- [ ] An isolated worktree is in use
- [ ] The `021` `runtime` baseline captured and cited
- [ ] Existing lineage shapes enumerated, and wrapper shell usage enumerated

### Definition of Done
- [ ] Fulfillment derived from the artifact contract; iteration counts from files
- [ ] Containment uniform across kinds, with content-identity dirty-path detection
- [ ] Argv dispatch; filtered Codex environment; allowlisted sink
- [ ] Whole gate re-run and reported as a delta against the captured baseline
- [ ] Independent adversarial verification pass complete
- [ ] `validate.sh --strict` exits 0 for this child
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-derived fulfillment with uniform containment

### Key Components
- **Per-mode artifact contract**: The set of artifacts a mode must produce for a lineage to be fulfilled
- **File-derived iteration count**: Iteration counts read from the iteration files rather than from a synthesis self-report
- **Provenance-complete audit**: Executor audit records that distinguish materially different invocations
- **Uniform containment**: One boundary applied to every dispatch kind, with content-identity dirty-path detection
- **Argv dispatch**: `execFile` with an argument vector, replacing shell string interpolation
- **Allowlisted sink**: The observability sink persists only allowlisted fields and emits no raw labels

### Data Flow
Dispatch request -> provenance-complete executor audit -> child process (argv, filtered env, enforced sandbox mode) -> lineage artifacts on disk -> artifact-contract validation -> fulfilled or not. Post-dispatch containment compares the worktree against its pre-dispatch content identity for every kind.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child plans from a deep-review CONDITIONAL verdict, so the fix addendum applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fanout-run.cjs` | Fulfills on report presence; drops provenance; kind-specific containment | update | Artifact-contract tests; provenance assertions; per-kind containment tests |
| `codex-dispatch.cjs` | Forwards the whole parent environment | update | Filtered-environment test |
| `write-containment.ts` | Pathname-based dirty exemption; empty list on out-of-worktree scope | update | Truncation-detection and hard-failure tests |
| `executor-audit.ts` | Records five fields | update | Distinctness assertions in the existing receipts suites |
| `observability-events.cjs` | Persists whole payloads; interpolates raw labels | update | Redaction and no-raw-label tests |
| `deep-{research,review}-{auto,confirm}.yaml` | Shell-interpolated dispatch | update to argv | Punctuation-bearing topic survives dispatch |
| `024` `runtime/lib/deep-loop/` files | Same directory, different files | not a consumer; serialize the merge | Ownership in `MANIFEST.md` |
| `031` exit-code classification | Will edit `fanout-run.cjs` | sequenced after this child | Ordering in `MANIFEST.md` |

Required inventories (run before implementation, record the output):
- Fulfillment predicates: `rg -n "fulfil|fulfill|report" .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`.
- Provenance drop site: `rg -n "effectiveConfig|invocationFingerprint" .opencode/skills/system-deep-loop/runtime`.
- Containment kind checks: `rg -n "cli-codex|cli-opencode|native" .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`.
- Shell interpolation: `rg -n "\{research_topic\}|\{config\.fanout_json\}" .opencode/skills/system-deep-loop/commands/deep/assets`.

**Algorithm invariant.** A lineage is fulfilled only if every artifact its mode contract requires exists and is internally consistent, and no dispatch may write outside its declared scope regardless of kind. Adversarial cases: a report with no state log; a synthesis claiming a count with no iteration files; a duplicated state log; a child truncating an already-dirty out-of-scope file; an artifact realpath outside the worktree; a topic containing shell metacharacters; an unsupported sandbox mode.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm, isolate and enumerate
- [ ] Set up an isolated worktree before any dispatch work
- [ ] T001 classification of all 12 findings at HEAD
- [ ] Enumerate existing lineage shapes and wrapper shell usage
- [ ] Cite the `021` baseline

### Phase 2: Artifact contract
- [ ] Define the per-mode artifact contract and decide where it lives
- [ ] Validate state JSONL, iteration records, deltas, findings registry and terminal synthesis before fulfillment
- [ ] Derive iteration counts from actual iteration files

### Phase 3: Provenance
- [ ] Carry `effectiveConfig` and `invocationFingerprint` through to the worker
- [ ] Record sandbox mode, timeout, search policy, config dir, governor and executable identity in the audit
- [ ] Assert audit distinctness for materially different invocations

### Phase 4: Containment and dispatch
- [ ] Reject sandbox modes a kind cannot enforce
- [ ] Run post-dispatch containment for every kind
- [ ] Detect dirty-path truncation by content identity
- [ ] Hard-fail out-of-worktree artifact scopes
- [ ] Move wrappers to argv dispatch
- [ ] Filter the standalone Codex environment

### Phase 5: Sink and gate
- [ ] Allowlist the observability sink; stop interpolating raw labels
- [ ] Re-run typecheck, tests and the receipts suites; report the delta
- [ ] Independent adversarial verification pass
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | Artifact-contract fulfillment per mode | vitest |
| Negative | Report without state log; synthesis without iteration files; duplicated state log | vitest |
| Containment | One test per dispatch kind, plus dirty-path truncation and out-of-worktree scope | vitest in an isolated worktree |
| Dispatch | Punctuation-bearing topic survives argv dispatch | vitest |
| Redaction | Credential-shaped keys and prompt text at the sink | vitest |
| Receipts | Existing `executor-audit-*.test.ts` suites with distinctness assertions | vitest |
| Regression | Whole `runtime` suite as a delta against the `021` baseline | vitest, tsc |

### Named verification commands

- `cd .opencode/skills/system-deep-loop/runtime && npm run typecheck`
- `cd .opencode/skills/system-deep-loop/runtime && npm test`
- `cd .opencode/skills/system-deep-loop/runtime && npx vitest run tests/executor-audit-receipts.test.ts tests/executor-audit-cli-branch-receipts.test.ts`
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/036-deep-loop-innovation/028-fanout-dispatch-integrity --strict`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `021` honest baselines | Internal | Red (not started) | Evidence issued against dishonest counts |
| An isolated worktree | Internal | Green | Dispatch tests can damage a concurrent session; this was observed live |
| `024` `runtime/lib/deep-loop/` ownership | Internal | Yellow | Merge conflicts; serialize |
| `031` sequencing on `fanout-run.cjs` | Internal | Downstream | `031` must land after this child |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The artifact contract rejects a genuine historical lineage, or argv dispatch breaks a wrapper that relied on a shell feature not caught by the enumeration.
- **Procedure**: The artifact contract, provenance, containment and argv work are separate commits. Revert the one that caused the failure and re-run its tests. Reverting the artifact contract re-opens `F-010-01` and `F-010-02`, which must be recorded.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm + isolate + enumerate)
        │
        ▼
Phase 2 (Artifact contract) ──► Phase 3 (Provenance)
        │                              │
        ▼                              ▼
Phase 4 (Containment + dispatch) ──► Phase 5 (Sink + gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Confirm + isolate + enumerate | `021` | 2 |
| 2 Artifact contract | 1 | 3, 4 |
| 3 Provenance | 2 | 5 |
| 4 Containment + dispatch | 2 | 5 |
| 5 Sink + gate | 3, 4 | `031` |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm + isolate + enumerate | Medium | 6-10 hours |
| Artifact contract | High | 16-26 hours |
| Provenance | Medium | 8-12 hours |
| Containment + dispatch | High | 18-28 hours |
| Sink + gate | Medium | 8-12 hours |
| **Total** |  | **56-88 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [ ] Baseline captured for every runner this child touches, at a named SHA
- [ ] Work runs in an isolated git worktree (a concurrent session moved the review target mid-run)
- [ ] Isolated worktree confirmed before any dispatch test runs
- [ ] Existing lineage shapes and wrapper shell usage enumerated

### Rollback Procedure
1. Identify which commit caused the failure: artifact contract, provenance, containment, or argv.
2. Revert that commit; the others stand.
3. Re-run that mechanism's tests in the isolated worktree.
4. Record which findings re-open.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — dispatch and validation behavior only.
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐
│ Lineage-shape census │
└──────────┬───────────┘
           ▼
┌──────────────────────┐    ┌──────────────────┐
│ Artifact contract    │───►│ Provenance       │
└──────────┬───────────┘    └──────────────────┘
           ▼
┌──────────────────────┐    ┌──────────────────┐
│ Uniform containment  │───►│ Argv dispatch    │
└──────────────────────┘    └────────┬─────────┘
                                     ▼
                          ┌──────────────────────┐
                          │ Allowlisted sink     │
                          └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Lineage-shape census | `021` | The artifact shapes real lineages produce | Artifact contract |
| Artifact contract | Lineage-shape census | Evidence-derived fulfillment | Provenance, containment |
| Provenance | Artifact contract | Distinguishable audit blocks | Sink |
| Uniform containment | Artifact contract | One boundary across dispatch kinds | Argv dispatch |
| Argv dispatch | Uniform containment | Punctuation-safe dispatch | Sink |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Enumerate lineage shapes and wrapper shell usage** - 6-10 hours - CRITICAL
2. **Define and enforce the per-mode artifact contract** - 16-26 hours - CRITICAL
3. **Unify containment across dispatch kinds** - 18-28 hours - CRITICAL
4. **Allowlist the sink and close the gate** - 8-12 hours - CRITICAL

**Parallel Opportunities**:
- Provenance (Phase 3) runs alongside containment and dispatch (Phase 4) once the contract exists.
- The sink allowlist is independent of the dispatch work.
- This child is not on the `014` unblock path, so it can be sequenced for throughput.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Isolated and enumerated | Worktree in place; lineage shapes and shell usage listed | End of Phase 1 |
| M2 | Fulfillment is evidence | Report-only and self-reported-count lineages both fail | End of Phase 2 |
| M3 | Provenance durable | Materially different invocations produce distinguishable audits | End of Phase 3 |
| M4 | Containment uniform | One boundary per kind; truncation detected by content identity | End of Phase 4 |
| M5 | Sink safe | Allowlisted persistence; no raw labels on stderr | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Fulfillment is derived from a per-mode artifact contract, never from report presence | Proposed |
| ADR-002 | Dispatch moves from shell interpolation to argv | Proposed |
| ADR-003 | Containment is uniform across dispatch kinds and detects truncation by content identity | Proposed |

Full context, alternatives, and consequences: `decision-record.md`.
<!-- /ANCHOR:l3-adr-summary -->
