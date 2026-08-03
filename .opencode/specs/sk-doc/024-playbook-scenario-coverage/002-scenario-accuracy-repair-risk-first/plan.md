---
title: "Implementation Plan: risk-first repair of inaccurate playbook scenarios"
description: "Nineteen shipped scenarios are indexed, counted, and in several cases recorded PASS while their exact command sequence would fail today or would instruct the operator to violate a hard repository rule — an unpermissioned remote push, a worktree created outside the clone-wide allocator, a dispatch flag the target CLI rejects. This phase repairs them in four risk tiers, executing each repaired scenario once for real, and escalates the one finding that is a live safety-gate defect rather than a document error."
trigger_phrases:
  - "scenario accuracy repair risk first implementation plan"
  - "playbook scenario coverage implementation plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/002-scenario-accuracy-repair-risk-first"
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

# Implementation Plan: Risk-First Repair of Inaccurate Playbook Scenarios

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown scenario documents; the repairs are validated by running real shell, git, CLI, and MCP commands |
| **Framework** | None. The execution surfaces are git, the sk-git allocator, the codex hook installer, external CLI dispatch, and the spec-kit memory tooling |
| **Storage** | A disposable clone and a disposable remote for Tier 1/2; a disposable spec packet for the context-save case |
| **Testing** | Real execution, once per repaired scenario, plus child `001`'s validator and cited-path resolver as the mechanical backstop |

### Overview

Reproduce each defect at HEAD, repair the scenario, execute the repaired scenario once for real, and file the run
artifact in the dated-run report tree. Four tiers in blast-radius order. One finding leaves the documentation
domain entirely and is escalated as an amendment decision before its scenario is touched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Child `001` closed: verdict enum migrated, contract checker available, cited-path resolver available.
- [ ] Disposable clone and disposable remote provisioned and verified as **not** the real origin.
- [ ] Tier-1/2 reproduction transcripts captured at HEAD.
- [ ] The Gate-3 reproduction captured and the amendment escalated.

### Definition of Done
- [ ] Every repaired scenario has a real run artifact under `<skill>/benchmark/reports/<dated-run>/`.
- [ ] Cited-path resolver returns zero unresolvable paths across the repaired set.
- [ ] `validate-playbook-package.cjs --strict` exits 0 over the repaired set.
- [ ] The Gate-3 rewrite cites an adjudicated ruling id.
- [ ] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reproduce → repair → execute → file the artifact. The loop is per scenario, and the artifact is the evidence.
Reading the repaired document is explicitly **not** acceptance, because reading is what let these defects ship.

### Key Components
- **Disposable execution environment** — a throwaway clone plus a throwaway remote. Every Tier-1/2 command runs
  there and nowhere else.
- **Destructive-isolation contract** — a fixed declaration block every mutating scenario adopts: what it mutates,
  where, how it is isolated, how the mutation is reverted, and what evidence proves the cleanup ran.
- **Run-artifact routing** — repaired-scenario runs land in the dated-run report tree the predecessor packet
  already built. Nothing is baked back into scenario truth.
- **Mechanical backstop** — child `001`'s cited-path resolver plus a `test -f` preflight for every file a
  scenario claims to edit. This is exactly the check that would have caught the missing-source-file defect.

### Data Flow
HEAD scenario → reproduction transcript → repaired scenario → real execution → run artifact → validator pass.
The amendment branch diverges after reproduction: reproduction → escalation → ruling → rewrite → execution.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches scenarios that mutate git state, push to a remote, install runtime hooks, and write to the
memory database, so the inventory is mandatory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Remote-branch policy + pre-push hook | Owns when a push is permitted and what override unlocks it | Not a consumer — the scenario must be corrected to match it, never the reverse | Re-read the policy at repair time; the scenario cites it |
| `sk-git` worktree allocator script | Clone-wide counter under its own lock | Not a consumer — the scenario must drive it instead of hand-composing | Repaired scenario invokes the allocator; a hand-composed branch is asserted refused |
| Codex hook installer | Exposes both mutating install and a non-mutating `--check` drift path | Not a consumer — the scenario gains the missing path | Repaired scenario exercises `--check` and asserts no mutation |
| Memory save command | Defaults to a non-mutating save plan | Not a consumer — the scenario must model the real default | Two cases present; the default case asserts no write |
| Gate-3 hook source | Displays one option semantics, parses another | **Escalate, do not modify** | Reproduction transcript; amendment ruling id |
| External CLI dispatch contract | Rejects the flag the scenario passes | Not a consumer — the scenario is corrected | Repaired dispatch runs to completion |
| Child `001` validator + resolver | The mechanical backstop | Consumer — this phase runs them over the repaired set | Both exit clean |
| Dated-run report tree | Where run evidence lives | Consumer — artifacts land here | Artifacts present; scenario truth unchanged |

Required inventories:
- Same-class producers: `rg -n 'git push|worktree add|checkout -b|update-ref' .opencode/skills/*/manual-testing-playbook`
  — find every OTHER scenario in the same hazard class before declaring these two instance-only.
- Consumers of changed cited paths: `rg -n '<cited-path>' .opencode --glob '*.md'`
- Matrix axes: {4 tiers} × {reproduced, repaired, executed, filed} — every scenario needs all four rows.
- Algorithm invariant: for the Gate-3 finding, the invariant is that the displayed option semantics and the
  parsed option semantics agree for every letter A-E. State the adversarial cases before the ruling is sought.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm against HEAD (all tiers, before any edit)
- [ ] Re-run each Tier-1/2 command sequence in a disposable clone; capture the actual failure.
- [ ] Reproduce the Gate-3 parser against a bare `D` answer.
- [ ] Re-confirm the still-absent source directory, the still-absent runtime advisory hook, and the rejected
      dispatch flag.
- [ ] Re-read the remote-branch policy and the owner-first naming contract at HEAD.

### Phase 2: Escalate the safety-gate defect
- [ ] File the amendment decision under `system-spec-kit` with the reproduction attached.
- [ ] Record the ruling in `decision-record.md` when it arrives. **Everything on that finding waits here.**

### Phase 3: Tier 1 — remote publication and irreversible git state
- [ ] Repair, execute against the disposable remote, file the artifacts, add the refusal assertions.

### Phase 4: Tier 2 — unisolated state mutation
- [ ] Adopt the destructive-isolation contract; repair, execute in the disposable clone, file the artifacts.

### Phase 5: Tier 3 — external dispatch and safety gates
- [ ] Repair the dispatch and precondition defects; rewrite the Gate-3 scenario **only if** the ruling exists.

### Phase 6: Tier 4 — stale contracts and route shapes
- [ ] Repair against live registries read at repair time; execute each; file the artifacts.

### Phase 7: Close
- [ ] Run the resolver and the validator over the whole repaired set; reconcile all packet docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Reproduction | Every Tier-1/2 scenario plus the Gate-3 parser, at HEAD, before edits | Disposable clone; real commands |
| Execution | Every repaired scenario, once, for real | The scenario's own command sequence |
| Negative | Tier-1 refusal assertions: unapproved push refused, direct branch creation refused | Real commands against the disposable remote |
| Mechanical | Cited-path resolution and `test -f` preflight over the repaired set | Child `001`'s resolver |
| Contract | Every repaired file under the operator-contract validator | `validate-playbook-package.cjs --strict` |
| Cleanup | Post-run state of the disposable clone matches pre-run | Declared cleanup evidence per scenario |

The single most important assertion is that **each repaired scenario ran**. Everything else in this phase is
downstream of that one artifact.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child `001` | Internal, blocking | Red until `001` closes | No tier repair can start; Phase 1 reproductions may still run |
| **AMENDMENT-DECISION** on the Gate-3 contradiction | Operator decision | Red | One Tier-3 repair is frozen; the other 18 proceed |
| **OPERATOR-DECISION Q4b** (absent advisory hook) | Operator decision | Yellow | The six-runtime advisory repair waits |
| Disposable remote | Environment | Yellow | Tier 1 cannot execute; repairs may be drafted but not marked done |
| Dated-run report tree | Internal | Green | Already built by the predecessor packet |
| WS1 harness-repair packet | External | Green | Sequencing coordination only; no shared file |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a repaired scenario proves wrong on execution, or an execution leaves state behind that the
  declared cleanup did not reverse.
- **Procedure**: revert the scenario edit (a document change, trivially revertible); discard and re-provision the
  disposable clone; record the failed execution as evidence rather than deleting it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (reproduce) ──┬──► Phase 3 (Tier 1) ──► Phase 4 (Tier 2) ──► Phase 5 (Tier 3) ──► Phase 6 (Tier 4) ──► Phase 7
                      └──► Phase 2 (escalate) ─────────────────────────► [Gate-3 rewrite inside Phase 5]
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 Reproduce | None (may precede `001` closing) | All repairs |
| 2 Escalate | Phase 1 Gate-3 reproduction | The Gate-3 rewrite only |
| 3 Tier 1 | Phase 1, child `001`, disposable remote | Phase 4 |
| 4 Tier 2 | Phase 3 | Phase 5 |
| 5 Tier 3 | Phase 4; Gate-3 rewrite additionally on Phase 2's ruling | Phase 6 |
| 6 Tier 4 | Phase 5 | Phase 7 |
| 7 Close | Phase 6 | child `003` |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 Reproduce | Med | Front-loaded; gates everything |
| 2 Escalate | Low | Small, but wall-clock unbounded — it waits on a person |
| 3-4 Tiers 1-2 | High | Five scenarios, real execution, isolation contracts |
| 5 Tier 3 | Med | Three scenarios, one of them gated |
| 6 Tier 4 | Med | Eleven scenarios, broad but mechanical |
| **Total** | | **Estimate at scaffold time; deliberately unstated rather than guessed** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Disposable clone provisioned; `git remote -v` verified as **not** the real origin.
- [ ] Reproduction transcripts captured and stored before the first edit.
- [ ] The Gate-3 rewrite task is marked `[B]` and stays that way until a ruling id exists.

### Rollback Procedure
1. Revert the offending scenario edit.
2. Discard and re-provision the disposable clone.
3. Re-run the declared cleanup and confirm state matches pre-run.
4. Keep the failed run artifact — it is evidence, not garbage.

### Data Reversal
- **Has data migrations?** The context-save case writes to a memory database. It runs against a disposable packet.
- **Reversal procedure**: delete the disposable packet and re-index; the scenario states this as its cleanup step.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
        child 001 (gate, enum, resolver)
                    │
                    ▼
┌──────────────────────────────────────┐
│  Phase 1  reproduce at HEAD          │
└───────┬──────────────────────┬───────┘
        │                      │
        ▼                      ▼
   Tier 1 ─► Tier 2 ─► Tier 3 ─► Tier 4 ─► close ─► child 003
                          ▲
                          │
              Phase 2 escalate ─► AMENDMENT ruling
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Reproductions | HEAD, disposable clone | Failure transcripts | All repairs |
| Amendment escalation | Gate-3 reproduction | Operator ruling | Gate-3 rewrite |
| Tier 1-4 repairs | child `001`, reproductions | Repaired scenarios + run artifacts | Phase 7 |
| Close | All tiers | Clean resolver + validator run | child `003` |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Child `001` closes** — CRITICAL. Nothing repairs before the gate exists.
2. **Phase 1 reproductions** — CRITICAL. Repairing an unreproduced finding is repairing a hypothesis.
3. **Phase 2 amendment escalation** — CRITICAL for one finding, and wall-clock unbounded, so it is filed first.
4. **Tiers 1-2 execution** — CRITICAL. The highest-blast-radius scenarios.

**Parallel Opportunities**:
- Phase 1 reproductions can run while child `001` is still in flight.
- Tier-4 repairs are independent of one another and parallelize across hubs once Tier 3 clears.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Every defect reproduced at HEAD | SC-001 | End of Phase 1 |
| M2 | Safety-gate defect escalated with evidence | REQ-007, REQ-008 filed | End of Phase 2 |
| M3 | Hazardous scenarios repaired and executed | SC-002, SC-003, SC-004 | End of Phase 4 |
| M4 | All 19 closed; backstop clean | SC-005, SC-006, SC-007, SC-008 | End of Phase 7 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Execution is the acceptance criterion, not review

**Status**: Proposed

**Context**: Every defect in this phase shipped past review. The documents read correctly; the commands failed.
A review-based acceptance criterion would reproduce the exact failure mode being repaired.

**Decision**: A repaired scenario is not repaired until it has been executed once, for real, with the run artifact
filed in the dated-run report tree.

**Consequences**:
- The phase is slower and needs a disposable clone and a disposable remote.
- Some scenarios will legitimately end in `SKIP` with a named blocker; that is an honest outcome, not a shortfall.

**Alternatives Rejected**:
- Peer review of the repaired documents: it is precisely the control that already failed.

### ADR-002: The safety-gate defect is escalated, not patched here

**Status**: Proposed

**Context**: The Gate-3 hook displays one meaning for an option letter and parses another. Two authorities inside
one file disagree. A documentation packet has neither the mandate nor the blast-radius ownership to rule on that.

**Decision**: Reproduce it, escalate it as an amendment decision under the runtime's own packet, and rewrite the
scenario only after adjudication so it certifies ruled behavior.

**Consequences**:
- One repair is blocked on a person, with unbounded wall-clock. It is filed first for that reason.
- This packet ships no parser change, by design.

**Alternatives Rejected**:
- Rewriting the scenario to match the parser: it would bless the contradiction and hide a live operator hazard
  behind a green test.
- Rewriting it to match the display: same problem, opposite direction, and it would assert behavior that does not
  exist.
