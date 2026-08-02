---
title: "Implementation Plan: playbook standard enforcement and fleet normalization"
description: "The sk-doc operator-scenario contract has no mechanical check anywhere in the repository, so every playbook coverage claim in the fleet is hand-typed prose that has drifted. This keystone phase settles the corpus-split and verdict rulings, builds the missing operator-contract validator with paired fixtures and fail-closed CI wiring, derives a per-hub coverage map from live registries, and normalizes all 11 playbook roots to a derived census."
trigger_phrases:
  - "playbook standard and fleet normalization implementation plan"
  - "playbook scenario coverage implementation plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/001-playbook-standard-and-fleet-normalization"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan from research synthesis"
    next_safe_action: "Run the fixture and fleet gates, then reconcile child evidence"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Playbook Standard Enforcement and Fleet Normalization

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`), matching the sibling topology gate |
| **Framework** | None — a standalone CLI validator, plus Python helpers already used by the sk-doc shared scripts |
| **Storage** | None. Read-only filesystem walk; reports to stdout |
| **Testing** | Fixture-driven: paired positive/negative directories under `scripts/tests/`, exercised by the repo's existing test runner |

### Overview

Build the missing operator-contract validator beside the SKILL.md that defines the contract, wire it fail-closed
into CI, derive per-hub coverage from live registries, and sweep all 11 playbook roots onto derived numbers. Four
sequential lanes: settle the rulings, build the gate, derive the map, normalize the fleet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### BUILD LEAF EXECUTION NOTE

The operator supplied the fresh HEAD baseline and locked rulings in the build brief. This leaf is limited to the
operator-contract validator, paired fixtures, explicit whole-tree manifest overrides, per-file typed-gold
classification, packet doctrine/templates, and child evidence documents. Fleet scenario repair, topology-gate
changes, Lane-C loader changes, CI wiring, and the shared helper are out of scope and remain pending for their owning
workstreams.

### Definition of Ready
- [ ] The HEAD baseline in `spec.md` SC-001 is re-run and recorded **before any edit**.
- [ ] **OPERATOR-DECISION Q2** answered — Lane A's shape depends on it.
- [ ] **OPERATOR-DECISION Q1** answered — the helper's location depends on it.
- [ ] The per-feature required-content field set is enumerated against SKILL.md §3 and pinned.

### Definition of Done
- [ ] Every P0 requirement has a paired positive and negative fixture.
- [ ] Seeded-violation test proves the CI job exits non-zero.
- [ ] Baseline re-run at close with every delta explained.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standalone read-only CLI validator plus a separate, explicitly-invoked sweep. Validation never mutates; mutation
is a distinct step an operator runs on purpose. This is the same separation the topology gate already uses.

### Key Components
- **`validate-playbook-package.cjs`** — walks one hub's `manual-testing-playbook/` tree, applies the
  operator-scenario contract checks, emits a report and an exit code.
- **`scripts/tests/` fixtures** — one positive and one negative directory per check. Negative fixtures are frozen
  copies of live repository files, carrying a provenance header, so later repairs do not silently disarm them.
- **Shared count-derivation helper** — one definition site; derives an expected inventory from a registry and
  fails on mismatch. Imported by this validator and by the sibling tracks that need the same derivation.
- **Coverage-map derivation** — joins the registry-derived inventory to indexed scenario IDs and emits the
  uncovered set. Its output is the worklist handed to child `003`.

### Data Flow
Registry files (`mode-registry.json`, `command-metadata.json`, public tool schemas, registered hooks/adapters)
→ expected inventory → joined against the walked scenario index → uncovered-inventory report. The feature catalog
joins in **widening-only**: it may add expected features, never remove them.

### Exit-code contract

```js
// Strict is the default because this repository already carries two fail-open
// validators, and a gate that reports a failure while exiting 0 is indistinguishable
// from no gate at all. --no-strict exists for local triage and is never used in CI.
// 0 = conforming, 1 = contract violations, 2 = usage or boundary error.
const EXIT_OK = 0;
const EXIT_VIOLATIONS = 1;
const EXIT_USAGE = 2;
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The corpus ruling and the strict-default flip both touch shared policy, so the inventory is required.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `validate-playbook-topology.cjs` | The only playbook gate; routing-gold contract; fail-open | Update: strict-default. Boundary change **only if** Q2 rules "move" | Run over a hub with blocked fixtures; assert non-zero without an explicit `--strict` |
| Lane-C skill-benchmark loader | Reads scenario files from `<skill>/manual-testing-playbook` | Not a consumer under "discriminator"; **must move in the same commit** under "move" | Pre/post fixture-count assertion on a benchmark run |
| `sk-create-manual-testing-playbook/SKILL.md` §7 | Files the section, bijection, and link checks under "Manual Checks" | Update: promote to Automated Checks, naming the new command | Diff shows the checks moved and the command is runnable as written |
| Both playbook templates | Define `PARTIAL` at scenario and feature level | Update: remove; derived-census language | `grep -c PARTIAL` over both templates = 0 |
| 11 playbook roots | Hand-typed censuses, stale verdict vocabulary, index drift | Update via the Lane D sweep | Derived census check passes on each root |
| CI workflow / pre-push gate | Runs the fleet's existing doc gates | Update: add the validator, fail-closed | Seeded-violation test |
| Sibling tracks + WS1 harness packet | Need the same count derivation / verdict normalizer | Not a consumer of this file, but an importer of the helper | Single-definition-site test |

Required inventories:
- Same-class producers: `rg -n 'PARTIAL|UNAUTOMATABLE|READY' .opencode/skills/*/manual-testing-playbook .opencode/skills/sk-doc/sk-create-manual-testing-playbook/assets`
- Consumers of the playbook path: `rg -n 'manual-testing-playbook' .opencode --glob '*.cjs' --glob '*.ts' --glob '*.js' --glob '*.json'`
- Matrix axes: {11 hubs} × {contract A, contract B} × {strict, no-strict} — enumerate the required rows before coding.
- Algorithm invariant: the derived census equals the walked tree for every root, under any traversal order.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm against HEAD and settle the rulings (Lane A)
- [ ] Re-run the whole SC-001 baseline and record it before touching anything.
- [ ] Re-read the topology gate's boundary resolution and its exit path to confirm the fail-open behavior.
- [ ] Enumerate the per-feature required-content field set against SKILL.md §3 and pin the number.
- [ ] Take the Q2 ruling; record it in `decision-record.md`.
- [ ] Amend the templates: remove `PARTIAL`, add derived-census language.

### Phase 2: Build the validator (Lane B)
- [ ] Implement each P0 check with its paired fixtures, in requirement order.
- [x] Correct mixed-hub corpus classification with the topology gate's per-file typed-gold signature and add a
      fixture proving the signature-bearing file is skipped from operator auditing.
- [ ] Implement the exit-code contract and `--help` contract-naming output.
- [ ] Land the shared count-derivation helper with its single-definition-site test.
- [ ] Flip the topology gate to strict-default.

### Phase 3: Derive the coverage map (Lane C)
- [ ] Build the registry-derived inventory per hub; record the weaker-signal path for single skills.
- [ ] Join to indexed scenario IDs; emit the uncovered-inventory report.
- [ ] Prove reproducibility: two consecutive runs diff clean.

### Phase 4: Normalize the fleet and wire CI (Lane D)
- [ ] Sweep the 11 roots: derived census, verdict migration, index repair, version-drift sync.
- [ ] Migrate the 10 numeric-prefixed filenames link-safe; repository-wide link pass.
- [ ] Remove the retired placeholder from the denominator; index the 3 unindexed CLI files.
- [ ] Replace the dead release census glob with a category-agnostic derivation.
- [ ] Migrate baked run results and developer-path scenarios to the dated-run report tree.
- [ ] Reclassify `system-spec-kit` per the Q7 ruling.
- [ ] Wire CI fail-closed; re-run the full baseline and explain every delta.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each contract check against its paired positive/negative fixture | Node test runner used by the sibling gate |
| Integration | Full-tree run over each of the 11 hubs; report shape and exit codes | The validator itself, `--format json` |
| Regression | Whole baseline re-run at close; deltas explained | The SC-001 baseline commands |
| Negative | Seeded violation in CI must exit non-zero | CI job, asserted as a test |
| Idempotence | Two consecutive coverage-map runs diff clean | `diff` on the emitted report |

The two most important tests are the **fail-closed proof** and the **single-definition-site assertion**. Both are
written as tests precisely because both are the kind of claim that otherwise survives as prose.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| **OPERATOR-DECISION Q2** (corpus split) | Decision | Red | Lane A cannot start; the whole phase stalls |
| **OPERATOR-DECISION Q1** (helper ownership) | Decision | Yellow | Helper lands locally with a follow-up to relocate |
| **OPERATOR-DECISION Q7** (NOT READY wording) | Decision | Yellow | Lane D sweep completes; the reclassification wording waits |
| Catalog integrity track's gated validator | External packet | Yellow | Proceed with the registry-derived denominator; record the catalog ceiling as a known limitation |
| The dated-run report tree from the predecessor packet | Internal | Green | Already built and Complete; consume, do not duplicate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the CI flip reds the fleet in a way the Lane D sweep does not resolve, or the corpus cutover
  measurably changes what the Lane-C loader reads.
- **Procedure**: revert the CI wiring commit first (restores the prior fail-open posture with no data loss), then
  the validator commit. The sweep commits are content edits and revert independently.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Lane A (rulings) ──► Lane B (validator) ──► Lane D (sweep + CI)
                             │
                             └──────────► Lane C (coverage map) ──► child 003
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Lane A | Q2, Q1 | Lane B |
| Lane B | Lane A | Lane C, Lane D, child `002` |
| Lane C | Lane B | child `003` |
| Lane D | Lane B, Q7 | child `002` |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Lane A — rulings and template amendment | Med | Small, gated on decisions |
| Lane B — validator plus fixtures | High | The bulk of the phase |
| Lane C — coverage map | Med | Moderate |
| Lane D — 11-root sweep, 10 renames, CI | High | Broad but mechanical once the gate exists |
| **Total** | | **Estimate at scaffold time; deliberately unstated here rather than guessed** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline recorded before any edit.
- [ ] Pre/post fixture-count assertion captured if Q2 rules "move".
- [ ] CI flip staged as its own commit so it reverts independently.

### Rollback Procedure
1. Revert the CI wiring commit — restores the prior posture immediately.
2. Revert the validator commit if the gate itself is the problem.
3. Re-run the baseline; confirm it matches the pre-phase numbers.
4. Record what was reverted and why in `implementation-summary.md`.

### Data Reversal
- **Has data migrations?** No database. The only "migration" is file renames and content edits, both reversible in git.
- **Reversal procedure**: `git revert` per commit; the repository-wide link pass re-run to confirm restoration.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Lane A     │───►│   Lane B     │───►│   Lane D     │
│   rulings    │    │  validator   │    │ sweep + CI   │
└──────────────┘    └──────┬───────┘    └──────┬───────┘
                           │                   │
                    ┌──────▼───────┐           ▼
                    │   Lane C     │      child 002
                    │ coverage map │
                    └──────┬───────┘
                           ▼
                      child 003
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Lane A | Q2, Q1 | Corpus ruling, amended templates | Lane B |
| Lane B | Lane A | Validator, fixtures, shared helper | Lane C, Lane D, child `002` |
| Lane C | Lane B | Uncovered-inventory report | child `003` |
| Lane D | Lane B, Q7 | 11 normalized roots, CI gate | child `002` |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Q2 ruling** — CRITICAL. Nothing in Lane A moves without it.
2. **Required-field enumeration** — CRITICAL. REQ-005 cannot be coded correctly without it.
3. **Lane B validator + fixtures** — CRITICAL. Both siblings are blocked on it.
4. **Lane D sweep + CI flip** — CRITICAL. Without the flip, the gate is another fail-open validator.

**Parallel Opportunities**:
- Lane C derivation can proceed alongside the Lane D sweep once Lane B lands.
- Template amendment (Lane A ii) is independent of the Q2 ruling and can start immediately.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline and rulings settled | SC-001 recorded; Q2 in `decision-record.md`; field set pinned | End of Lane A |
| M2 | Gate exists and is fail-closed | SC-002, SC-003 | End of Lane B |
| M3 | Coverage map handed off | SC-007 | End of Lane C |
| M4 | Fleet normalized, baseline re-run | SC-004, SC-005, SC-006, SC-008, SC-009 | End of Lane D |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: The validator lives with the standard, not with the existing gate

**Status**: Proposed

**Context**: The only playbook gate today is owned by the packet that defines the *routing-gold* contract, while
the packet that defines the *operator-scenario* contract ships no scripts at all. That ownership inversion is why
`sk-git` is scored 0-of-42 against a contract it was never written to.

**Decision**: `validate-playbook-package.cjs` lives under `sk-create-manual-testing-playbook/scripts/`, beside the
SKILL.md that defines what it enforces. Both validators name their contract in their output.

**Consequences**:
- The standard's packet gains a `scripts/` directory and an ownership obligation it did not have.
- Two validators now walk the same trees; the contract-naming requirement is what keeps their reports legible.

**Alternatives Rejected**:
- Extending the topology gate with operator-contract checks: it would put two contracts behind one exit code and
  deepen exactly the confusion this phase exists to end.

### ADR-002: Strict is the default

**Status**: Proposed

**Context**: This repository already carries two fail-open validators. A gate that prints a failure and exits 0 is
indistinguishable from no gate.

**Decision**: Strict on by default; `--no-strict` for local triage only, never in CI, asserted by a test.

**Consequences**:
- Four hubs currently reporting `FAIL` under the sibling gate will red CI the moment the flip lands, so the flip is
  sequenced after the Lane D sweep.

**Alternatives Rejected**:
- Matching the sibling's opt-in strictness for consistency: consistency with a known defect is not a reason.

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the scoped packet and read its current spec, plan, tasks, and checklist before editing.
- Keep scenario content, sibling gates, consumers, CI, and shared helpers outside this leaf.
- Run the fixture suite before live package gates and preserve direct exit codes.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SCOPE | Edit only the validator packet and this child packet. |
| TASK-SEQ | Read first, implement, run fixtures, run package/fleet gates, refresh metadata, then run strict packet validation. |
| NO-MASS-EDIT | Do not rewrite or mass-edit scenario files. |

### Status Reporting Format

Report each gate as `command`, `result`, and direct `rc`; distinguish confirmed receipts from deferred work.

### Blocked Task Protocol

If a required file is missing, a scope boundary is unclear, or a gate fails, stop the affected workstream, record the
exact command and output, and leave the packet In Progress. Do not silently substitute another workflow.
<!-- /ANCHOR:ai-execution -->
