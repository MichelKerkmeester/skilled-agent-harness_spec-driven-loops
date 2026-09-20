---
title: "Implementation Plan: create-skill-canon-self-consistency"
description: "Make the executable root-metadata module the single authority for skill-authoring canon, convert the four contradicting prose surfaces into deference, and add a conformance test that reads both sides so the divergence cannot return quietly."
trigger_phrases:
  - "canon consistency plan"
  - "prose versus module test"
  - "skill scaffold rehearsal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/002-create-skill-canon-self-consistency"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "track-e-spec-author"
    recent_action: "Authored implementation plan"
    next_safe_action: "Execute T001 confirm-against-HEAD and the authority proof"
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
# Implementation Plan: create-skill-canon-self-consistency

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
| **Language/Stack** | Markdown doctrine and templates, JSON scaffolds and registry, Node.js contract module, Python packaging script |
| **Framework** | Skill root metadata contract, `parent-skill-check.cjs` fleet gate, `package_skill.py` |
| **Storage** | Repository files only |
| **Testing** | The introduced conformance test, the packaging script over real skills, a throwaway scaffold rehearsal |

### Overview

One rule carries the phase: **the executable module is the authority; prose defers to it and never restates it.** Applying that rule mechanically resolves the companion-metadata contradiction across four surfaces, and applying the same rule to versions, resource directories, naming examples and sibling topology resolves the rest. The durable half is a conformance test that parses the requirement tables out of the prose and the class sets out of the module and fails when they disagree — because the evidence is unambiguous that text edits alone re-rot here: the mechanical gate passed three hubs with zero warnings while these contradictions were live.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] **The authority question is settled by reading the contract in full**, not assumed. If the contract is the stale side, the phase halts and escalates
- [ ] **[OPERATOR-DECISION: Q3 — supplementary findings]** answered, because it sets this phase's arithmetic at 22 or 15

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing: conformance test green, packaging script produces no new failures, scaffold rehearsal passes the fleet gate
- [ ] Docs updated (spec/plan/tasks)
- [ ] DR-4 and DR-5 recorded as decisions with status, not left implicit in the diff
- [ ] No placeholder file exists anywhere that did not exist before
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Single authority with enforced deference. Exactly one artifact holds each rule; every other mention is a pointer, and a test proves the pointers still point somewhere true.

### Key Components

- **The root-metadata contract module**: authority for which companion files each skill class requires. Read-only in this phase.
- **The four prose surfaces**: doctrine, workflow, hub template, scaffold preamble. Converted from restatement to deference.
- **The conformance test**: parses both sides, fails on disagreement, fails on unreadable.
- **The scaffold rehearsal**: proves the repaired template produces a conformant hub, which is the only end-to-end evidence available.
- **The absence guardrail**: an assertion that no placeholder file appeared, run after the edits.

### Data Flow

Module class sets → conformance test ← prose requirement tables. Repaired template → throwaway scaffold → fleet gate. Neither path lets a prose claim stand without a source.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes shared policy consumed by every future skill, so the addendum applies in full.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Root-metadata contract module | Authority for class requirements | Unchanged — read-only | Read in full during T001; authority status recorded |
| Root-metadata markdown contract | Authority prose | Unchanged — read-only | Same |
| Parent-hub doctrine | Consumer that restates the policy | Update — defer | Grep proves one policy statement remains |
| Creation workflow | Consumer that restates the policy | Update — defer | Same |
| Hub template | Consumer that restates the policy and over-states resource requirements | Update — defer | Same, plus resource language matched to the packet's own prose |
| Command-metadata scaffold preamble | Consumer that restates the policy | Update — defer | Same |
| Packaging script required-field list | Authority for frontmatter fields | Unchanged — read-only | Template's labels matched to it; script run over real skills for no new failures |
| Section-requirement validation | Authority whose strictness is in question | **Do not change alone** | DR-4 must rule on prose and validator together |
| Sibling hub registries | Authority for mode topology | Unchanged — read-only | Four restating documents treated per DR-5 |
| Hub README and default fallback resource | Consumers describing a stale tree | Update | Path-existence assertion, zero unresolvable |
| Mode registry aliases | Routing vocabulary | Update | Consumers and router tests updated in the same change |
| Standalone-class skill root | Correct absence of a placeholder | Unchanged — guardrail | Post-edit absence assertion |

Required inventories:
- Same-class producers: `rg -n 'command-metadata' .opencode/skills/sk-doc/` to find every statement of the policy, not only the four reported.
- Consumers of changed symbols: `rg -n 'OPTIONAL_BY_CLASS|REQUIRED_BY_CLASS' . --glob '*.cjs' --glob '*.md'` and, for the alias change, a grep for each alias string across scripts, tests and generated indexes.
- Matrix axes: skill class × companion file × source-of-claim (module, contract prose, doctrine, workflow, template, scaffold). Every cell is checked.
- Algorithm invariant: the conformance test is sound on absence — a side it cannot read is a failure, never a pass.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm all 22 items against HEAD, with the seven supplementary items individually verified
- [ ] Prove the contract module is the authority by reading it in full; halt and escalate if it is not
- [ ] Capture the pre-edit baseline: fleet gate on the affected hub roots, packaging-script results on the sample skills, and a full inventory of existing placeholder files
- [ ] Rule DR-4 and DR-5 before the edits they govern

### Phase 2: Core Implementation
- [ ] Convert the four prose surfaces from restatement to deference
- [ ] Repair the remaining canon self-contradictions: frontmatter, resource directories, naming example, sibling topology
- [ ] Repair the hub front door: README, default fallback resource, orphaned router, alias case
- [ ] Repair the seven supplementary surfaces, individually
- [ ] Build the conformance test

### Phase 3: Verification
- [ ] Conformance test green, and proven to fail on an introduced mismatch
- [ ] Scaffold rehearsal: throwaway command-less hub emits no placeholder and passes the fleet gate
- [ ] Absence guardrail: no new placeholder anywhere
- [ ] Packaging script over the sample skills: no new failures against the recorded baseline
- [ ] `validate.sh --strict` at Errors: 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Conformance test on an introduced mismatch, and on an unreadable prose table | The repo's Node test runner |
| Integration | Scaffold rehearsal end to end | Scaffolder plus `parent-skill-check.cjs` |
| Integration | Packaging script over two or three real skills, before and after | `python3 package_skill.py` |
| Manual | Naming-rule table read for column disjointness | Reading |
| Regression | Placeholder-file inventory before and after | `find`/`rg` over skill roots |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Root-metadata contract module at HEAD | Internal | Green | No authority to defer to |
| DR-4 and DR-5 rulings | Internal | Yellow | Two edit groups cannot start |
| Sibling hub registries | Internal | Green | Topology statements cannot be generated or checked |
| Two wave-2 phases waiting on this one | Internal | Yellow | They idle or proceed on a rule about to change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the authority proof fails and the contract turns out to be the stale side; the conformance test cannot be made sound; the scaffold rehearsal produces a non-conformant hub.
- **Procedure**: all changes are tracked documentation, one JSON registry and one new test. Revert the phase's commits, re-run the fleet gate and the packaging script, and confirm the recorded pre-edit results return. Delete any throwaway scaffold.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Confirm + authority proof ──► DR-4 / DR-5 rulings ──┬──► Canon prose lane
                                                    ├──► Hub front-door lane
                                                    ├──► Supplementary lane
                                                    └──► Conformance test
                                                              │
                                                              ▼
                                                        Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm + authority proof | None | Everything |
| DR rulings | Confirm | Canon prose lane, supplementary lane |
| Canon prose lane | DR rulings | Verification, and the wave-2 phases |
| Hub front-door lane | Confirm | Verification |
| Supplementary lane | DR rulings | Verification |
| Conformance test | Canon prose lane | Verification |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | The authority proof is careful reading, not volume |
| Core Implementation | High | Sixteen files, but each edit is small; the conformance test is the real work |
| Verification | Medium | The scaffold rehearsal dominates |
| **Total** | | **Dominated by the conformance test and the rehearsal, not by the prose edits** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Placeholder-file inventory recorded across all skill roots
- [ ] Fleet-gate results recorded for the affected roots
- [ ] Packaging-script results recorded for the sample skills
- [ ] Router-test results recorded before the alias change

### Rollback Procedure
1. Revert the phase's commits.
2. Re-run the fleet gate on the affected roots; confirm the recorded state.
3. Re-run the packaging script on the sample skills; confirm the recorded state.
4. Re-run the router tests; confirm the recorded state.
5. Remove any throwaway scaffold.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐   ┌──────────────────────┐
│ Confirm 22 items     │──►│ Authority proof      │──► halt+escalate if inverted
│ (7 supplementary §)  │   │ (read contract full) │
└──────────────────────┘   └──────────┬───────────┘
                                      ▼
                           ┌──────────────────────┐
                           │ DR-4 / DR-5 rulings  │
                           └──────────┬───────────┘
              ┌───────────────────────┼───────────────────────┐
              ▼                       ▼                       ▼
    ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
    │ Canon prose lane │   │ Hub front door   │   │ Supplementary    │
    └────────┬─────────┘   └────────┬─────────┘   └────────┬─────────┘
             └──────────────────────┴──────────────────────┘
                                    ▼
                        ┌──────────────────────┐
                        │ Conformance test +   │
                        │ scaffold rehearsal   │
                        └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Authority proof | Confirmation | A recorded ruling that the module is authoritative | All edits |
| DR rulings | Authority proof | Two signed decisions | Canon and supplementary lanes |
| Canon prose lane | DR rulings | Four deferring surfaces | Conformance test, wave 2 |
| Hub front-door lane | Confirmation | A README and fallback that describe real directories | Verification |
| Supplementary lane | DR rulings | Seven individually-verified repairs | Verification |
| Conformance test | Canon prose lane | A failing-on-divergence gate | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Authority proof** — CRITICAL. Everything downstream inverts if it fails.
2. **DR-4 and DR-5 rulings** — CRITICAL. Two edit groups cannot start without them.
3. **Canon prose lane** — CRITICAL. This is what the two wave-2 phases are waiting on.
4. **Conformance test** — CRITICAL to the phase's durability, not to its text output.

**Parallel Opportunities**:
- The hub front-door lane runs as soon as confirmation is done; it needs no ruling.
- The seven supplementary repairs are independent of each other.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Authority settled | The contract is proven authoritative, or the phase has escalated | End of Phase 1 |
| M2 | Rulings signed | DR-4 and DR-5 have a status and a rationale | End of Phase 1 |
| M3 | Canon deferring | One policy statement in the packet; wave 2 unblocked | Mid Phase 2 |
| M4 | Re-rot guarded | Conformance test fails on an introduced mismatch | End of Phase 2 |
| M5 | Phase closed | Rehearsal passes, absence guardrail holds, `validate.sh --strict` Errors: 0 | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

DR-4 (is the workflow section required or advisory?) and DR-5 (is the per-hub extension matrix generated or explicitly illustrative?) are **not pre-decided by this package.** Neither has a synthesis ruling backed by evidence — both are genuine forks, and DR-4 carries an explicit warning from its own finding against changing the validator alone. `decision-record.md` is therefore scaffolded from the template at copy time and populated during execution, before the edits each decision governs. Writing the decisions now would fabricate a ruling nobody has made.

---
