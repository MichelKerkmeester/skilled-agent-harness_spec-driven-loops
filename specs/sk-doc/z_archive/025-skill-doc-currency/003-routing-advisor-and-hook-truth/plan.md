---
title: "Implementation Plan: routing-advisor-and-hook-truth"
description: "Rule the advisor gate as policy before touching its numbers, resolve every documented hook path against the filesystem, and single-source the rosters and counts that four disagreeing authorities currently publish."
trigger_phrases:
  - "advisor gate policy"
  - "hook path resolution"
  - "roster single sourcing"
  - "fail open honesty"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/003-routing-advisor-and-hook-truth"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "track-e-spec-author"
    recent_action: "Authored implementation plan"
    next_safe_action: "Execute T001, hook-topology findings first"
    blockers:
      - "Soft-blocked on the canon rulings in the sibling canon phase"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: routing-advisor-and-hook-truth

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
| **Language/Stack** | Markdown references, JSON hook configuration and profile data, TypeScript advisor server, Node and Python checks |
| **Framework** | Advisor validation tooling, CLI offline smoke check, document validator, path-existence assertions |
| **Storage** | Repository files only; the user-global hook installation is read-only to this phase |
| **Testing** | Advisor validation output, smoke check, document validator, path assertions |

### Overview

This is the live-numbers phase, so the discipline that bites hardest here is baseline-first. Capture the advisor validation slices and the smoke output verbatim **before** any edit, then state deltas. Rule the gate policy before rewriting a threshold, because a threshold rewritten under an unstated policy is still an unfalsifiable claim. Resolve every documented hook path and smoke command against the filesystem, in both directions — a path that exists but is unregistered and a registration pointing at nothing are both failures. Finally, replace each retyped roster and count with a generator or a link, so the four-authority problem cannot recur.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] **[OPERATOR-DECISION: DR-6 — gate policy]** ruled, before any threshold edit
- [ ] **[OPERATOR-DECISION: Q3 — supplementary findings]** answered, because it sets this phase's arithmetic at 22 or 18
- [ ] **[OPERATOR-DECISION: Q4 — Codex hook drift]** confirmed, so no task here touches a global installation
- [ ] The canon phase's structure ruling is available, or the six-reference lane is explicitly deferred to last

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing: path assertions clean, document validator clean on the six references, roster assertion green
- [ ] Docs updated (spec/plan/tasks)
- [ ] Every live number reported as a delta against a recorded pre-edit capture
- [ ] The fail-open safety claim is reproduced-and-documented or refuted-and-recorded, never assumed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Name the generator, delete the copy. Every number in scope belongs to exactly one of three classes, and each class has a different repair.

### Key Components

- **Measurements** (validation slices, tool counts): derived from the generator or the snapshot, never retyped, and always carrying the capture date.
- **Policies** (the gate thresholds): ruled explicitly, stated as policy, and tied to the measurement they are compared against.
- **Topology** (hook paths, adapter registrations, model routes): asserted against the filesystem and the registries, in both directions.
- **Path-existence assertion**: the durable artifact; it is cheap enough to reuse in CI and in later phases.
- **Roster assertion**: every model with an authored profile is resolvable, or is excluded by an explicit marker.

### Data Flow

Generator or snapshot → number in the document, with a date. Filesystem and hook configuration → path assertion → both-direction pass. Profile data → roster assertion → router selectable set. No hand-typed value survives without one of these sources behind it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches shared policy, env-var ownership and a safety-contract claim, so the addendum applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Advisor baseline snapshot | Authority for measured values | Unchanged — read-only | Its date is carried into every document that cites it |
| Advisor scorer and thresholds in code | Behaviour | Unchanged | This phase edits statements about them, not them |
| Validation-baselines reference | Consumer stating policy as fact | Update per DR-6 | The stated policy is coherent against the dated snapshot |
| Advisor hook reference and integration inventory | Consumers naming adapters | Update | Path assertion, both directions |
| Sibling hook-system reference | Consumer with the mirror-image defect | Update | Same assertion |
| Runtime hook configuration | Registration pointing at an absent file | Update — repoint, or restore the proxy as a flagged behaviour change | The registered path exists |
| Per-runtime adapter READMEs | Consumers describing return contracts | Update | Read against the extension code's own stated channel |
| Pre-push hook and its tests | Authority for the enforcement behaviour | **Unchanged** | The fail-open path is reproduced as evidence, not modified |
| Remote-branch policy document | Consumer overstating the protection | Update — documentation honesty | The limitation is prominent; advisory and guaranteed enforcement are distinguished |
| Prompt-model profile data | Authority for the roster | Unchanged — read-only | Roster assertion |
| Prompt leaf router | Consumer that cannot select a profiled model | Update | Every profiled model resolves |
| CLI tool-count constant | Authority | Unchanged | All three consuming sites read it or are generated from it |
| Timeout-flag documentation | Ownership moves to the hub with the live consumers | Update | The consumers are named; the sibling keeps a pointer at most |

Required inventories:
- Same-class producers: `rg -n 'hooks/(claude|codex|opencode|copilot|pi|cursor)' .opencode/ .claude/ .cursor/ .codex/` to find every adapter statement, not only the reported ones.
- Consumers of changed symbols: `rg -n '<timeout-flag-name>' .` and, for the counts, a grep for each published number across references, smoke checks and tests.
- Matrix axes: runtime × adapter file × registration site × documentation site. Every cell is resolved in both directions.
- Algorithm invariant: the path assertion is sound on absence — an unreadable configuration is a failure, never a pass — and it reports the number of paths checked so a vacuous pass is visible.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm all 22 items against HEAD, hook topology and the four supplementary items first
- [ ] Capture live baselines verbatim: advisor validation slices, CLI smoke output, document-validator errors on the six references
- [ ] Reproduce the fail-open path that the safety claim depends on, or record it as refuted
- [ ] Rule DR-6 before any threshold edit

### Phase 2: Core Implementation
- [ ] Rewrite the gate statement under the ruled policy, carrying the snapshot's date
- [ ] Repair hook topology across both references, the integration inventory and the runtime registration
- [ ] Repair the adapter READMEs' return-contract descriptions
- [ ] State the fail-open limitation and replace the packet-history citations in the policy document
- [ ] Repair the advisor's self-contradictory stale-state statement
- [ ] Single-source the CLI counts and the prompt-model roster; make every profiled model resolvable
- [ ] Restructure the six non-conformant references, last, under the canon ruling

### Phase 3: Verification
- [ ] Path assertion over every hook path and smoke command: zero unresolvable, both directions
- [ ] Roster assertion: every profiled model resolvable
- [ ] Re-run the advisor validation and the smoke check; report deltas against the recorded captures
- [ ] Document validator over the six references: zero blocking errors
- [ ] Confirm every scope item reached a terminal state
- [ ] `validate.sh --strict` at Errors: 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Path assertion on an unreadable configuration and on a registered-but-absent file | The repo's Node test runner |
| Integration | Advisor validation slices, before and after | The advisor validation command |
| Integration | CLI offline smoke check, before and after | The smoke script |
| Integration | Document structure over the six references | `python3 .../validate_document.py --type reference` |
| Manual | The fail-open reproduction | Following the hook's documented failure path in a scratch clone |
| Regression | Roster resolvability across every authored profile | The roster assertion |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The canon phase's structure ruling | Internal | Yellow | The six-reference lane cannot land; the rest proceeds |
| The first phase's fleet-gate re-baseline | Internal | Yellow | No-regression claims are unfalsifiable |
| Advisor validation command | Internal | Green | Baselines cannot be captured; those numbers stay unverified |
| DR-6 ruling | Internal | Yellow | The threshold edit cannot start |
| A scratch clone for the fail-open reproduction | Internal | Green | The safety claim stays unconfirmed and must not be edited |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the hook-topology confirmation rate collapses (the trees moved again); the fail-open path cannot be reproduced and the safety claim is refuted; a hook registration edit breaks a live runtime.
- **Procedure**: revert the phase's commits. Re-run the path assertion and the advisor validation and confirm the recorded pre-edit state. For a hook registration specifically, verify the runtime loads its hooks again before considering the rollback complete — a config revert that leaves a cached state is not a rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Confirm (hooks first) ──► Baselines ──► DR-6 ──► Gate lane
                             │
                             ├──► Hook topology lane
                             ├──► Safety + policy-doc lane
                             ├──► Roster + counts lane
                             └──► Reference structure lane (last, needs canon ruling)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm | None | Everything |
| Baselines | Confirm | Every delta claim |
| DR-6 | Baselines | Gate lane |
| Gate lane | DR-6 | Verification |
| Hook topology lane | Confirm | Verification |
| Safety + policy-doc lane | Fail-open reproduction | Verification |
| Roster + counts lane | Baselines | Verification |
| Reference structure lane | Canon ruling | Verification |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | High | Confirmation of the least stable surface plus a live reproduction |
| Core Implementation | High | Five lanes, one of them gated on an external ruling |
| Verification | Medium | Assertions are cheap once written |
| **Total** | | **Dominated by confirmation and the fail-open reproduction** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Advisor validation slices recorded verbatim
- [ ] CLI smoke output recorded verbatim
- [ ] Document-validator error counts recorded for the six references
- [ ] The runtime's hook configuration recorded before edit
- [ ] The fleet-gate re-baseline from the first phase is available and cited

### Rollback Procedure
1. Revert the phase's commits.
2. Re-run the advisor validation; confirm the recorded slices return.
3. Re-run the smoke check; confirm the recorded output.
4. Re-run the path assertion; confirm the recorded unresolvable count.
5. For hook-configuration reverts, confirm the runtime actually reloads its hooks.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. No user-global state is written at any point.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────────┐   ┌────────────────────────┐
│ Confirm 22 items       │──►│ Live baselines +       │
│ (hooks + 4 § first)    │   │ fail-open reproduction │
└────────────────────────┘   └───────────┬────────────┘
                                         ▼
                              ┌────────────────────────┐
                              │ DR-6 gate policy       │
                              └───────────┬────────────┘
        ┌──────────────┬──────────────────┼──────────────────┬──────────────┐
        ▼              ▼                  ▼                  ▼              ▼
   ┌─────────┐  ┌─────────────┐   ┌──────────────┐   ┌─────────────┐  ┌──────────┐
   │ Gate    │  │ Hook        │   │ Safety +     │   │ Roster +    │  │ Ref      │
   │ lane    │  │ topology    │   │ policy doc   │   │ counts      │  │ structure│
   └────┬────┘  └──────┬──────┘   └──────┬───────┘   └──────┬──────┘  └────┬─────┘
        └──────────────┴─────────────────┴──────────────────┴──────────────┘
                                         ▼
                              ┌────────────────────────┐
                              │ Verification           │
                              └────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Confirmation | None | Per-ID dispositions | All lanes |
| Baselines | Confirmation | Recorded live numbers | Every delta claim |
| DR-6 | Baselines | A ruled gate policy | Gate lane |
| Hook topology lane | Confirmation | Resolvable paths both directions | Verification |
| Safety lane | Reproduction | Honest enforcement language | Verification |
| Roster + counts lane | Baselines | One authority per number | Verification |
| Reference structure lane | Canon ruling | Conformant references | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm the hook-topology group** — CRITICAL. This is the least stable surface in the program and everything in that lane depends on it.
2. **Capture live baselines** — CRITICAL. Without them no delta claim is admissible.
3. **DR-6** — CRITICAL to the gate lane specifically.
4. **Fail-open reproduction** — CRITICAL to the safety lane; editing that claim without it would be asserting a safety fact on hearsay.

**Parallel Opportunities**:
- Hook topology, roster/counts and the safety lane are mutually independent once confirmed.
- The reference-structure lane runs last regardless.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Confirmation closed | All 22 items dispositioned; hook group confirmed first | End of Phase 1 |
| M2 | Baselines recorded | Validation slices, smoke output and validator counts captured verbatim | End of Phase 1 |
| M3 | Gate ruled and rewritten | DR-6 signed; the statement is coherent against the dated snapshot | Mid Phase 2 |
| M4 | Topology resolvable | Zero unresolvable paths in either direction | Mid Phase 2 |
| M5 | Phase closed | Deltas reported; validator clean on the six references; `validate.sh --strict` Errors: 0 | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

DR-6 (is the advisor gate an absolute floor or a bounded delta from a dated snapshot?) is **not pre-decided by this package.** It is a policy choice with no synthesis ruling behind it, and the research loop asked it twice without answering it. `decision-record.md` is scaffolded from the template at copy time and populated during execution, before the threshold edit it governs.

---
