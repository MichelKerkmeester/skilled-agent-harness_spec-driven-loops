---
title: "Implementation Plan: authoring the operator scenarios the coverage map proves are owed"
description: "With the operator-scenario contract enforceable and the false coverage removed, this phase authors what is genuinely absent: four uncovered external executors and their fail-closed cases, two end-to-end user-boundary workflows that no scenario runs today, the destructive and asynchronous public MCP tools that appear in no executable scenario, and seven declared-but-unauthored features and mode boundaries. The derived coverage map is the worklist and the gate; the applicability rule governs every item, so absence of a file is never by itself the reason to author one."
trigger_phrases:
  - "uncovered workflow authoring implementation plan"
  - "playbook scenario coverage implementation plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/003-uncovered-workflow-authoring"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan from research synthesis"
    next_safe_action: "Confirm baselines in T001 before any edit begins"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Authoring the Operator Scenarios the Coverage Map Proves Are Owed

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown scenario documents authored to the operator-scenario contract |
| **Framework** | None. The execution surfaces are external CLI executors, the deep-loop runtime, the completion workflow, and the public MCP tool surface |
| **Storage** | A disposable memory database for the destructive-tool lane; a disposable spec packet for the closeout lane |
| **Testing** | Child `001`'s validator under `--strict` on first commit, plus one real execution per Lane A and Lane C scenario |

### Overview

Re-derive the uncovered inventory from live registries, author against that map in four risk-ordered lanes, run
every new scenario through the gate on first commit, and record an explicit not-applicable-because for every
residual the map leaves behind.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Child `001` closed: coverage map derivable, validator available and fail-closed.
- [ ] Child `002` closed: authoring happens against repaired scenarios and settled censuses.
- [ ] The uncovered inventory re-derived at phase start and recorded.
- [ ] **OPERATOR-DECISION Q3** answered — Lane B placement depends on it.
- [ ] Executor binary and credential availability surveyed, so honest `SKIP` verdicts are planned, not improvised.

### Definition of Done
- [ ] Uncovered-inventory report shrunk to exactly the recorded not-applicable set.
- [ ] Every new scenario passed the gate on first commit, with no follow-up fix commit.
- [ ] Every Lane A/C scenario has a real run artifact.
- [ ] Cross-playbook ID-uniqueness check passes.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Map-driven authoring. The derived uncovered inventory is both the worklist and the acceptance gate; the finding
list is a seed. Each authored scenario is written to the contract, validated on first commit, and — for the two
riskiest lanes — executed once against a disposable target.

### Key Components
- **Uncovered-inventory report** (from child `001` Lane C) — the authoritative worklist. Re-derived here, not
  inherited on trust.
- **Not-applicable register** — every residual entry with the limb of the applicability rule it fails. This is
  what stops the same question being re-asked at every future audit.
- **Ownership rule for cross-skill workflows** — one execution-truth owner per workflow; everyone else links.
  Enforced by a cross-playbook ID-uniqueness check, not by convention.
- **Automated-matrix anchor** — the 117-combination command-construction matrix is cited by the executor
  scenarios as existing automated coverage, bounding the manual worklist.

### Data Flow
Live registries → re-derived uncovered inventory → authored scenarios → gate on first commit → real execution for
Lanes A and C → run artifacts → inventory re-run → residuals into the not-applicable register.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Lane A dispatches external CLIs and Lane C invokes destructive public tools, so the inventory is required.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Hub `mode-registry.json` files | Declare the routable workflow modes | Not a consumer — the source of the expected inventory | Re-derived count matches the declared modes |
| Live executor schema | Declares the executor kinds | Not a consumer — the source for the parity scenarios | Every declared kind appears in the worklist or the not-applicable register |
| The automated combination matrix | Automated command-construction coverage; logs credentialed dispatch as skipped | Not a consumer — referenced as an anchor | Cited by the Lane A scenarios; manual count stays bounded |
| Public MCP tool surface | Destructive and asynchronous maintenance tools | Not a consumer — exercised against a disposable database | Run artifacts; refusal assertions present |
| `command-metadata.json` | Declares the public command surface | Not a consumer — source for the command-coverage inventory | Both `/interface:*` commands appear covered |
| Playbook roots of 8 hubs | Index the scenarios | Update: new scenarios indexed | Derived census updates with no hand-typed number |
| Child `001` validator | The gate | Consumer — run on first commit | Exit 0 with no follow-up fix commit |
| Other hubs' playbooks | May already carry cross-hub coverage | Not a consumer, but must be searched before claiming absence | Cross-playbook search recorded per absence claim |

Required inventories:
- Same-class producers: `rg -n '<executor-name>' .opencode/skills/*/manual-testing-playbook` per executor, before
  authoring — the "absent everywhere" claim must be tested everywhere.
- Consumers: `rg -n '<tool-name>' .opencode/skills/*/manual-testing-playbook` for each public tool in Lane C.
- Matrix axes: {declared executors} × {routed workflow, fail-closed} — enumerate the required rows and state the
  bound before authoring.
- Algorithm invariant: for each hub, the set of declared features equals covered ∪ not-applicable, with no overlap
  and no remainder.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm against HEAD and re-derive the map
- [ ] Re-derive the uncovered inventory from live registries; do **not** treat the finding list as the worklist.
- [ ] Re-confirm each absence claim cross-playbook, not just in the owning hub.
- [ ] Survey executor binary and credential availability; plan the honest `SKIP` set.
- [ ] Take the Q3 ownership ruling.

### Phase 2: Lane A — external executor dispatch
- [ ] Author one routed workflow plus one fail-closed scenario per uncovered executor; state the bound.
- [ ] Author the executor-kind and fan-out parity coverage against the live schema.
- [ ] Cite the automated matrix as the anchor; do not expand it.
- [ ] Execute each; file the artifacts.

### Phase 3: Lane B — end-to-end user-boundary workflows
- [ ] Author the bounded end-to-end research loop in the hub the Q3 ruling assigns.
- [ ] Author the successful implementation-to-closeout path.
- [ ] Run both; the produced artifacts are the evidence.

### Phase 4: Lane C — public mutating and asynchronous tools
- [ ] Author the four lifecycles with their refusal counterparts, against a disposable database.
- [ ] Execute each; file the artifacts.

### Phase 5: Lane D — declared-but-unauthored features and mode boundaries
- [ ] Author the seven items, each validated on first commit.
- [ ] Replace the retired routing probe with live quality-control coverage.

### Phase 6: Close
- [ ] Re-run the inventory; record every residual with its not-applicable-because.
- [ ] Run the ID-uniqueness check and the validator over the whole new set; reconcile the packet docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | Every new scenario, on first commit | `validate-playbook-package.cjs --strict` |
| Execution | Every Lane A and Lane C scenario, once, for real | Real binaries; disposable memory database |
| Artifact | Lane B — real loop artifacts and a real spec-folder closeout | The loop's own state records; the closeout's own outputs |
| Coverage | Inventory re-run at close | Child `001`'s derivation |
| Anti-duplication | Cross-playbook scenario-ID uniqueness | Repository-wide ID scan |
| Negative | Every destructive Lane C step has a paired refusal assertion | The tools' own refusal paths |

The gate-on-first-commit rule is deliberate: a scenario that needs a follow-up commit to pass the contract was not
authored to the contract, and letting that slide is how the fleet reached its current state.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child `001` (map + gate) | Internal, blocking | Red until `001` closes | No worklist, no gate; authoring cannot start |
| Child `002` | Internal, sequencing | Yellow | Authoring against broken scenarios and a mid-sweep census invites rework |
| **OPERATOR-DECISION Q3** | Decision | Red for Lane B | Lane B placement undecided; Lanes A/C/D proceed |
| **OPERATOR-DECISION Q5** | Decision | Yellow | May add a fourth Lane-D item at 4-6 scenarios |
| Executor binaries and credentials | Environment | Yellow | Those scenarios land as honest `SKIP` with named blockers |
| Disposable memory database | Environment | Yellow | Lane C cannot execute; scenarios may be drafted but not marked done |
| The automated combination matrix | Internal | Green | Exists; referenced as an anchor |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an authored scenario proves wrong on execution, or duplicates coverage that already existed elsewhere.
- **Procedure**: delete the added scenario file and its index row; the derived census self-corrects. Retain the
  failed run artifact as evidence and record why the scenario was withdrawn.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
child 001 (map + gate) ─┐
child 002 (repaired)  ──┴─► Phase 1 (re-derive) ─┬─► Lane A ─┐
                                                 ├─► Lane B ─┤
                                                 ├─► Lane C ─┼─► Phase 6 (close)
                                                 └─► Lane D ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Re-derive | children `001`, `002`; Q3 | All lanes |
| Lane A | Phase 1 | Phase 6 |
| Lane B | Phase 1, Q3 | Phase 6 |
| Lane C | Phase 1, disposable database | Phase 6 |
| Lane D | Phase 1 | Phase 6 |
| 6 Close | All lanes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 Re-derive and confirm | Med | Front-loaded; sets the worklist |
| Lane A | High | Up to 8 scenarios plus parity coverage, each executed |
| Lane B | High | Two scenarios, but they run whole workflows |
| Lane C | Med | Four lifecycles with refusal paths |
| Lane D | Med | Seven items, broad across hubs, parallelizable |
| **Total** | | **~25-35 new scenario files; wall-clock estimated at scaffold time rather than guessed here** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Disposable memory database provisioned and confirmed not live.
- [ ] Absence claims re-tested cross-playbook before authoring.
- [ ] Lane A bound stated before the first scenario is written.

### Rollback Procedure
1. Delete the withdrawn scenario file and its root index row.
2. Re-run the derived census; confirm it self-corrected.
3. Record the withdrawal reason; keep the failed artifact.

### Data Reversal
- **Has data migrations?** Lane C writes to a memory database — a disposable one.
- **Reversal procedure**: drop and re-provision the disposable database; each Lane C scenario states this as its
  cleanup step.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐   ┌──────────────┐
│  child 001   │   │  child 002   │
│  map + gate  │   │   repaired   │
└──────┬───────┘   └──────┬───────┘
       └────────┬─────────┘
                ▼
        ┌───────────────┐
        │  re-derive    │
        │  the map      │
        └───┬───┬───┬───┘
            │   │   │
        ┌───▼┐ ┌▼─┐ ┌▼──┐ ┌────┐
        │ A  │ │B │ │ C │ │ D  │
        └──┬─┘ └┬─┘ └─┬─┘ └─┬──┘
           └────┴─────┴─────┘
                   ▼
              close + register
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Re-derivation | `001`, `002` | The authoritative worklist | All lanes |
| Lane A | Worklist, executor availability | Executor scenarios + artifacts | Close |
| Lane B | Worklist, Q3 | End-to-end scenarios + real artifacts | Close |
| Lane C | Worklist, disposable database | Tool lifecycles + artifacts | Close |
| Lane D | Worklist | Seven feature scenarios | Close |
| Close | All lanes | Shrunk inventory + not-applicable register | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Child `001` closes** — CRITICAL. No map, no gate, no phase.
2. **Re-derivation of the inventory** — CRITICAL. Authoring from the finding list instead would repeat the exact
   failure mode this program exists to end.
3. **Lane A** — CRITICAL. The largest single hole in the fleet.
4. **Close: inventory re-run and the not-applicable register** — CRITICAL. Without it, "done" is an assertion again.

**Parallel Opportunities**:
- Lanes A, C, and D are independent of each other once the map lands.
- Lane B can start as soon as Q3 is answered, in parallel with Lane A.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Worklist re-derived and absence claims re-tested | SC-001, SC-002 | End of Phase 1 |
| M2 | Executor coverage complete and bounded | SC-006, SC-009 | End of Lane A |
| M3 | End-to-end and destructive-tool coverage complete | SC-007, SC-006 | End of Lanes B and C |
| M4 | Inventory shrunk to the ruled-empty set | SC-003, SC-004, SC-005, SC-008, SC-010 | End of Phase 6 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: The derived map is the worklist and the gate

**Status**: Proposed

**Context**: Coverage in this fleet has always been argued from prose, and it drifted in every hub counted. A
finding list is a snapshot of one research loop; the registries are the live truth.

**Decision**: The uncovered inventory, re-derived from live registries at phase start, is the worklist. Findings
seed it. Closure is measured by the report shrinking, never by assertion.

**Consequences**:
- Some findings may not survive re-derivation; those are re-examined rather than authored on faith.
- The phase gains a hard, cheap definition of done.

**Alternatives Rejected**:
- Authoring straight from the 13 findings: faster, and it reinstates the prose-driven coverage claim this whole
  program exists to remove.

### ADR-002: Absence is a cross-playbook claim, not a hub-scoped one

**Status**: Proposed

**Context**: A research finding asserting "no coverage anywhere" was refuted during the loop precisely because the
coverage lived under a different hub's playbook.

**Decision**: Every absence claim is re-tested across all 11 playbooks before a scenario is authored against it,
and the search is recorded.

**Consequences**:
- Slightly more work per item, and it is the difference between authoring a needed scenario and shipping a duplicate.

**Alternatives Rejected**:
- Trusting the owning hub's index: it is exactly the assumption that produced the refuted finding.
