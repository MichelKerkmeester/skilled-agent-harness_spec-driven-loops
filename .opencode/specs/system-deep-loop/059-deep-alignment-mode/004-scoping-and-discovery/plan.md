---
title: "Implementation Plan: Phase 4: scoping-and-discovery"
description: "Plan the ARTIFACT-CLASS x AUTHORITY x SCOPE decision tree, N-lane resolution, the non-interactive arg form, and the authority-agnostic discover(scope)->artifacts contract."
trigger_phrases:
  - "deep-alignment scoping plan"
  - "alignment lane resolution plan"
  - "alignment discover contract plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/004-scoping-and-discovery"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted scoping and discovery contract plan"
    next_safe_action: "Await 003 gate before execution"
    blockers:
      - "003-scaffold-mode-packet not yet executed"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-scoping-and-discovery"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: scoping-and-discovery

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode skill markdown (interactive question protocol), CommonJS scripts (non-interactive arg parsing) |
| **Framework** | `system-deep-loop` runtime state machine (INIT -> SCOPE -> DISCOVER -> ITERATE -> CONVERGE -> REPORT) |
| **Storage** | Future `deep-alignment/references/scoping_protocol.md`, `discover_contract.md`, and a lane-resolution script |
| **Testing** | None in this phase — design-only pass; a future implementation pass adds unit coverage for lane resolution |

### Overview
This phase specifies the SCOPE and the input half of the DISCOVER state for `deep-alignment`. It designs a structured three-axis decision tree (ARTIFACT-CLASS, AUTHORITY, SCOPE) that resolves to N alignment lanes, a non-interactive argument form that produces the same lane shape for headless/cron runs, and an authority-agnostic `discover(scope)->artifacts` contract every adapter phase (005-007) implements identically.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 003-scaffold-mode-packet's directory-skeleton plan is available so this phase knows where `references/scoping_protocol.md` and `discover_contract.md` will eventually live.
- [ ] The locked pluggable adapter contract (`{ discover(scope)->artifacts, standardSource(authority)->templates+rules, check(artifact,rules)->findings }`) has been re-read from 002-architecture-decision before drafting the `discover()` half.

### Definition of Done
- [ ] The three-axis decision tree, lane-resolution algorithm, non-interactive arg form, and `discover()` contract are each specified with no adapter-specific logic leaking into the contract.
- [ ] Every genuinely undecided detail (the non-interactive arg grammar) is flagged as pending 002, not invented here.
- [ ] `validate.sh` passes `--strict` with Errors:0 on this phase folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Structured decision tree feeding a lane-resolution function, which feeds N calls to an authority-agnostic `discover()` contract. No free-text scoping is planned — the design brief explicitly locks a decision tree over free text because ambiguous scoping would make lane resolution non-reproducible for cron runs.

### Key Components (planned, not yet built)

**Scoping decision tree** (`references/scoping_protocol.md`, future):
1. **ARTIFACT-CLASS** — one of `docs`, `code`, `designs`, `git-history`. Determines which authorities are even offered next (e.g. `git-history` only offers `sk-git`).
2. **AUTHORITY** — one or more of `sk-doc`, `sk-git`, `sk-design`, `sk-code`, presented as a multi-select so a single run can combine authorities (the operator precedent: "sk-code and sk-git and/or sk-design" in one pass). The set is explicitly extensible — new authorities register without changing the tree's shape, only its offered options.
3. **SCOPE** — paths, globs, or a branch-range, validated against the repo root before being accepted.

**Lane resolution**: the tree's answers cross-product into N lanes, one per `(authority, artifact-class, scope)` combination the operator actually selected — not a full cross-product of every possible combination. Each lane is an independent unit for DISCOVER and ITERATE.

**Non-interactive arg form**: lanes are passed as structured arguments (exact grammar TBD, pending 002) that resolve to the identical internal lane-tuple representation the interactive path produces. When lane args are present, the interactive question is skipped entirely; when absent, the interactive question is the only path. The two never run together and neither is silently skipped when required.

**`discover(scope) -> artifacts` contract** (`references/discover_contract.md`, future):
- **Input**: one resolved lane's `scope` value (paths/globs/branch-range), already validated against the repo root.
- **Output**: a corpus of artifact references (file paths or path+ref pairs for git-history scopes) plus seed FILE nodes, in the shape the coverage graph's `upsert.cjs` (`.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs`) already consumes for deep-review.
- **Guarantee**: the contract signature carries no authority-specific parameters or branching; an adapter registering a fifth authority implements the same three-function shape without any engine change.

### Data Flow
Operator (or cron config) -> SCOPE state (interactive question OR non-interactive args) -> lane list -> DISCOVER state calls `adapter[authority].discover(lane.scope)` once per lane -> artifact corpus + seed FILE nodes -> coverage graph (`upsert.cjs`) -> ITERATE state (phase 008).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase is not a bug fix and touches zero production surfaces; it produces planning documentation only, scoped to `.opencode/specs/system-deep-loop/059-deep-alignment-mode/004-scoping-and-discovery/`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read 003-scaffold-mode-packet's plan.md for the directory-skeleton shape this phase's future files will live in.
- [ ] Re-read the locked pluggable adapter contract from 002-architecture-decision.
- [ ] Read `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` for the coverage-graph seeding shape `discover()` output must match.

### Phase 2: Core Implementation (future execution pass — not run in this phase)
- [ ] Author `deep-alignment/references/scoping_protocol.md` with the three-axis decision tree and lane-resolution algorithm.
- [ ] Author `deep-alignment/references/discover_contract.md` with the authority-agnostic `discover(scope)->artifacts` signature and output shape.
- [ ] Implement the lane-resolution script (interactive path).
- [ ] Implement the non-interactive arg parser once 002 finalizes the grammar, converging on the same internal lane-tuple representation as the interactive path.

### Phase 3: Verification (future execution pass — not run in this phase)
- [ ] Confirm a multi-authority single-run scoping session resolves N independent lanes with no cross-authority coupling.
- [ ] Confirm the non-interactive arg parser and the interactive question produce byte-identical lane tuples for an equivalent scope.
- [ ] Confirm the `discover()` contract carries no authority-specific parameters, verified by diffing the planned signature against every adapter phase's stated usage.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Planning-only | This phase's own spec-folder documents | `validate.sh --strict` |
| Deferred unit | Lane resolution, non-interactive arg parsing, `discover()` stub | Vitest, run when this phase's execution pass actually happens |
| Deferred integration | Interactive vs non-interactive lane-tuple equivalence | Manual comparison run, deferred to execution pass |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003-scaffold-mode-packet | Internal | Pending | No directory skeleton exists for the future reference docs and scripts this phase plans |
| 002-architecture-decision (adapter contract, non-interactive arg grammar) | Internal | Pending | `discover()` contract and arg grammar details stay provisional |
| `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs` | Internal | Green | Without it, the discovered-artifact seeding plan has no real target shape to match |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: 002-architecture-decision changes the adapter contract shape or drops the multi-authority-per-run requirement.
- **Procedure**: Revise this phase's spec.md/plan.md/tasks.md/checklist.md to match the new contract before any execution pass runs; no live files exist yet, so no code rollback is needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
003 (Scaffold) ──────► 004 (Scoping + Discovery) ──────► 005 (sk-doc adapter)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 003-scaffold-mode-packet | 002-architecture-decision | 004 |
| 004-scoping-and-discovery | 003-scaffold-mode-packet | 005, 006, 007 |
| 005-adapter-sk-doc | 004-scoping-and-discovery | 008 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Read three existing files |
| Core Implementation (future) | Medium | Two reference docs plus a lane-resolution script |
| Verification (future) | Low | Manual comparison run, no new infra |
| **Total** | | Deferred to the execution pass this phase plans for |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] N/A — no deployment in this planning phase.

### Rollback Procedure
1. This phase creates zero live files; there is nothing to roll back beyond reverting spec-folder edits if 002's contract changes.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
