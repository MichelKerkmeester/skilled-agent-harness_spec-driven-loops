---
title: "Implementation Plan: executor-and-dispatch-contract-truth"
description: "Repair executor and dispatch documentation by deriving every roster from its owning authority and every flag table from a versioned CLI help fixture, starting with the fleet-gate repair that makes the program's baseline honest."
trigger_phrases:
  - "executor contract plan"
  - "cli fixture regeneration"
  - "fleet gate repair"
  - "derived roster check"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/001-executor-and-dispatch-contract-truth"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "track-e-spec-author"
    recent_action: "Authored implementation plan"
    next_safe_action: "Execute T001 confirm-against-HEAD"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: executor-and-dispatch-contract-truth

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
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
| **Language/Stack** | Markdown documentation, JSON manifests, YAML command assets, Node.js checks |
| **Framework** | Spec Kit validation, `parent-skill-check.cjs` fleet gate, ripgrep sweeps |
| **Storage** | Repository files only; checked-in CLI help fixtures |
| **Testing** | `npm run typecheck && npm test` in the runtime, plus the checks this phase introduces |

### Overview

Three mechanisms carry this phase. First, a **fixture pipeline**: capture each installed CLI's own help output into a checked-in file that records the binary version and the capture date, then regenerate every flag table from that fixture instead of editing prose by hand. Second, a **derived-roster check**: assert that every executor list appearing in a document is a subset of the schema's kinds, and that council documents are a subset of the resolver's allowlist. Third, a **pattern sweep** for the malformed three-item list, run before and after so the delta is real. The text edits are the visible output; the three mechanisms are what stop the same drift returning.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] **[OPERATOR-DECISION: Q2 — unaudited CLI packets]** answered, because it changes the task list and the phase's completeness claim
- [ ] **[OPERATOR-DECISION: DR-1 — Copilot retire or register]** answered, because "register" moves work into the code-conformance packet
- [ ] **[OPERATOR-DECISION: Q7 — shared tooling ownership]** answered, or an explicit consumer edge recorded
- [ ] The installed CLI binaries needed for fixture capture are present, or the affected packets are marked unverified up front

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing: runtime typecheck and test suite green, with the pre-edit numbers recorded alongside the post-edit numbers
- [ ] Docs updated (spec/plan/tasks)
- [ ] Fleet gate green on all 11 roots, from a recorded run
- [ ] Corruption sweep returns zero, with the pre-sweep count recorded
- [ ] Every one of the 22 scope items has a terminal state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Derivation over transcription. Each class of claim gets exactly one authority, and documents either link to it or carry a value a check can prove against it.

### Key Components

- **Help fixtures**: per-CLI captures under the packet's assets, each recording binary version and capture date. The mechanism that stops flag-table re-rot.
- **Derived-roster check**: parses executor lists out of documents and asserts subset against the schema's kinds and the council resolver's allowlist. The mechanism that stops roster re-rot.
- **Corruption sweep**: a narrow pattern for the known malformation plus a widened variant, run pre and post.
- **Leaf-manifest regeneration**: the single command that returns the fleet gate to green.
- **Roster authority**: one named document per roster class; every other mention becomes a link.

### Data Flow

Installed binary → help fixture (versioned, dated) → flag table in the reference. Executor schema and resolver allowlist → derived-roster check → pass/fail over every document that names executors. Neither path allows a human-typed value to survive without a source.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase plans from a research verdict where several findings touch schema boundaries and dispatch policy, so the addendum applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Executor schema module | Authority for which executor kinds exist | Unchanged — read-only source of truth | Read at HEAD; the derived-roster check imports or parses it rather than restating it |
| Council kind-resolver | Authority for which kinds the council accepts | Unchanged — read-only source of truth | The council documents' advertised set is asserted a subset of its allowlist |
| Runtime capability data | Authority behind the capability matrix | Unchanged | Matrix rows reconciled against it row by row |
| Deep-loop `SKILL.md` and references | Consumers that retype rosters | Update — link or derived subset | Derived-roster check; corruption sweep |
| Command YAML assets | Consumers that branch on an undefined kind | Update per the accepted ruling | `rg` for the branch key returns only what the ruling permits |
| CLI packet references | Consumers that retype flag tables | Update — regenerated from fixtures | Each table's values reproducible from its fixture |
| Code Mode catalog and workflows | Consumers that retype a tool inventory and a namespace | Update — reconciled against the live manual configuration and registered tool count | Namespace grep against the configured manuals; tool count against the registration sites |
| Leaf manifest | Generated artifact currently stale | Regenerate | Fleet gate reports 0 invariant failures |
| The feature-catalog fan-out leaf | Same fact, different owner | Not a consumer of this phase's edits — ceded to another track | Cross-track note; the catalog leaf links to this phase's roster authority |

Required inventories:
- Same-class producers: `rg -n 'cli-codex|cli-claude-code|cli-opencode|cli-cursor|cli-devin|cli-pi|native' .opencode/skills --glob '*.md'` to find every document that names executors, not only the reported ones.
- Consumers of changed symbols: `rg -n 'EXECUTOR_KINDS|resolveExecutorKind|if_cli_copilot' . --glob '*.ts' --glob '*.cjs' --glob '*.md' --glob '*.yaml'`.
- Matrix axes: executor kind × document class (SKILL.md, reference, README, command asset) × claim type (exists / invocable / capability). Every axis row is checked, not sampled.
- Algorithm invariant: the derived-roster check must be *sound on absence* — a document it cannot parse counts as a failure, never as a pass.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm every scope item against HEAD and record a per-ID disposition
- [ ] Repair the leaf manifest and re-baseline the fleet gate across all 11 roots
- [ ] Capture pre-edit baselines: corruption-sweep counts, runtime typecheck and test results, installed CLI versions
- [ ] Capture the CLI help fixtures

### Phase 2: Core Implementation
- [ ] Regenerate the four audited CLI packets' flag and permission tables from fixtures
- [ ] Audit the two zero-finding CLI packets and close the two confirmed gaps
- [ ] Replace deep-loop executor rosters with links or derived subsets
- [ ] Apply the Copilot ruling to the command YAML assets
- [ ] Reconcile the Code Mode catalog, namespaces and allowed-tools
- [ ] Repair the MCP hub topology statement and the packet tool contract

### Phase 3: Verification
- [ ] Run the derived-roster check and the corruption sweep; report deltas against the recorded baselines
- [ ] Re-run the fleet gate and the runtime suite; report deltas
- [ ] Confirm every scope item reached a terminal state
- [ ] `validate.sh --strict` at Errors: 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Derived-roster check behaviour on a document it cannot parse, and on a legitimate subset | Node test runner used by the repo |
| Integration | Fleet gate across all 11 hub roots | `parent-skill-check.cjs` |
| Integration | Runtime typecheck and test suite, before and after | `npm run typecheck && npm test` |
| Manual | Each regenerated flag table read against its fixture | Reading, with the fixture open |
| Regression | Corruption sweep pre and post | `rg -c` with the narrow and widened patterns |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Installed CLI binaries | External | Yellow | Affected flag tables are marked unverified rather than edited from memory |
| Executor schema and council resolver at HEAD | Internal | Green | The derived-roster check has no authority to assert against |
| The whole-system-gate docs-drift child | Internal | Yellow | Shared file; whichever lands second rebases |
| The track (c) feature-catalog packet | Internal | Yellow | Roster-authority link target must be agreed |
| Shared helper ownership | Internal | Yellow | Duplicate validators ship. **[OPERATOR-DECISION: Q7]** |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: T001 confirmation rate below 75%; the fleet gate failing to return to green after regeneration; the runtime suite regressing against its recorded pre-edit numbers.
- **Procedure**: this phase touches documentation, one generated manifest and four YAML assets, all tracked. Revert the phase's commits; re-run the fleet gate and the runtime suite to confirm the recorded pre-edit state is restored. The checked-in help fixtures may be kept even on rollback — they are evidence, not behaviour.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Confirm-against-HEAD ──┬──► Fleet-gate repair ──► Baselines ──┬──► CLI fixture lane
                       │                                      ├──► Deep-loop roster lane
                       │                                      ├──► Code Mode / MCP hub lane
                       └──────────────────────────────────────┘
                                                              └──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm-against-HEAD | None | Everything |
| Fleet-gate repair | Confirm | Every no-regression claim in the whole packet |
| Baseline capture | Fleet-gate repair | Every delta claim |
| CLI fixture lane | Baselines | Verification |
| Deep-loop roster lane | Baselines | Verification |
| Code Mode / MCP hub lane | Baselines | Verification |
| Verification | All lanes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (confirm, gate repair, baselines, fixtures) | High | Largest single block — the confirmation gate is 22 items and the fixtures are five binaries |
| Core Implementation | High | Three lanes, parallelizable |
| Verification | Medium | Mechanical once the checks exist |
| **Total** | | **The dominant cost is confirmation and fixture capture, not editing** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Pre-edit fleet-gate output recorded verbatim
- [ ] Pre-edit corruption-sweep counts recorded, narrow and widened
- [ ] Pre-edit runtime typecheck and test results recorded
- [ ] Installed CLI versions recorded

### Rollback Procedure
1. Revert the phase's commits.
2. Re-run the fleet gate; confirm the count matches the recorded pre-edit count.
3. Re-run the runtime typecheck and test suite; confirm the recorded pre-edit state.
4. Re-run the corruption sweep; confirm the recorded pre-edit count returns.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. The one generated artifact (the leaf manifest) is regenerable from the same command at any time.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
│ Confirm vs HEAD    │──►│ Fleet-gate repair  │──►│ Baseline capture   │
│ (22 items)         │   │ + 11-root re-run   │   │ (sweep/tests/vers) │
└────────────────────┘   └────────────────────┘   └─────────┬──────────┘
                                                            │
                        ┌───────────────────────────────────┼───────────────────┐
                        ▼                                   ▼                   ▼
              ┌───────────────────┐            ┌───────────────────┐  ┌───────────────────┐
              │ CLI fixture lane  │            │ Deep-loop roster  │  │ Code Mode + MCP   │
              │ (6 packets)       │            │ lane (6 docs+YAML)│  │ hub lane (5 docs) │
              └─────────┬─────────┘            └─────────┬─────────┘  └─────────┬─────────┘
                        └────────────────────────────────┴──────────────────────┘
                                                 ▼
                                       ┌───────────────────┐
                                       │ Verification      │
                                       └───────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Confirmation gate | None | Per-ID disposition table | All lanes |
| Fleet-gate repair | Confirmation | Green gate + recorded pass count | All packet-level regression claims |
| Baseline capture | Gate repair | Recorded pre-edit numbers | All delta claims |
| CLI fixture lane | Baselines | Versioned fixtures + regenerated tables | Verification |
| Deep-loop roster lane | Baselines | Derived or linked rosters | Verification |
| Code Mode / MCP hub lane | Baselines | Reconciled inventories and topology | Verification |
| Verification | All lanes | Deltas and terminal states | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm-against-HEAD for all 22 items** — CRITICAL. Nothing may be edited before its ID has a disposition.
2. **Leaf-manifest regeneration and 11-root gate re-run** — CRITICAL. This is the packet-wide unblock.
3. **Fixture capture across the installed binaries** — CRITICAL for the CLI lane; a missed capture turns a regenerated table back into a hand-typed one.
4. **Derived-roster check implementation** — CRITICAL for the deep-loop lane; without it the roster edits are unverifiable.

**Parallel Opportunities**:
- The three edit lanes run simultaneously once baselines exist.
- Fixture capture for different binaries is independent.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Confirmation gate closed | All 22 items dispositioned; confirmation rate at or above 75% | End of Phase 1 |
| M2 | Fleet green and baselined | 11-root run recorded; 0 invariant failures | End of Phase 1 |
| M3 | Rosters derived | Derived-roster check passes over every document naming executors | End of Phase 2 |
| M4 | Tables reproducible | Every changed flag table traceable to a versioned fixture | End of Phase 2 |
| M5 | Phase closed | Sweep at zero; deltas reported; `validate.sh --strict` Errors: 0 | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Three decisions carry evidence and a recommendation and are recorded in full in `decision-record.md` (ADR-001 Copilot disposition, ADR-002 capability versus policy, ADR-003 roster ownership). All three are **Proposed** until the operator signs them; the tasks that depend on each are marked blocked in `tasks.md`.

---
