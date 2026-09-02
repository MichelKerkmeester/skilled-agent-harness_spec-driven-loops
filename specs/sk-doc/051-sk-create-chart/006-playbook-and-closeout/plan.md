---
title: "Implementation Plan: Phase 6: playbook-and-closeout"
description: "Read the operator-scenario contract from its validator, author eight scenarios that each catch something no other one catches, then close the packet on gate output rather than on a reading."
trigger_phrases:
  - "chart playbook plan"
  - "operator scenario contract plan"
  - "chart closeout gates"
  - "playbook negative control"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: playbook-and-closeout

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documents, validated by Node scripts |
| **Framework** | The operator-scenario contract owned by `sk-create-manual-testing-playbook` |
| **Storage** | None. The playbook is files in the packet |
| **Testing** | `validate-playbook-package.cjs`, `check-corpus.cjs`, `parent-skill-check.cjs`, `compiled-route-manifest.cjs`, `validate.sh` |

### Overview

Author a manual testing playbook for the chart packet, to the operator-scenario contract and to
nothing beyond it, then close the packet on the output of the whole-fleet gates. The contract is
read from the validator source rather than from a summary of it, because the failure mode that
matters here is a package that reports a clean skip.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] The operator-contract check reports a nonzero operator count
- [x] Docs updated and reconciled against what shipped
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Split-document playbook package. One root index carries the policy and the directory, and each
scenario lives in its own file under a kebab-case category folder.

### Key Components
- **Root index**: the operator directory, the review protocol, the wave plan, the family coverage map and the recorded render flake.
- **Category folders**: `reading-the-chart/`, `corpus-integrity/` and `delivery-and-routing/`, one file per scenario.
- **Closeout edits**: the parent phase map, the child statuses and this phase's own documents.

### Data Flow

The package validator walks the playbook tree, classifies every file as an operator scenario or
as routing gold, then validates the operator files against the contract. A file carrying a
routing-gold frontmatter signature is excluded, so the operator count is what says whether the
package was checked at all.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix. The table below records the surfaces this phase writes to and how each was verified.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-create-chart/manual-testing-playbook/` | Was an empty directory holding a tracked marker | Create nine documents | `validate-playbook-package.cjs --package sk-doc/sk-create-chart` reports a nonzero operator count |
| Parent `spec.md` phase map | Listed shipped phases as Pending | Update | `validate.sh --strict --recursive` from the final state |
| Child `spec.md` status fields | Said Draft while the parent said Complete | Update | The same recursive run |
| Hub compiled routing | Not a consumer. The playbook tree is not a routing input | Unchanged | `compiled-route-manifest.cjs freshness --hub sk-doc` reports fresh |

Required inventories:
- Contract source read directly: `sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`.
- Sibling shape read directly: `sk-create-with-human-voice/manual-testing-playbook/` and `sk-create-diagram/manual-testing-playbook/`.
- Scenario grounding read directly: the corpus record's defect table, the template contract and the corpus check.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and the task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | The playbook package against the operator-scenario contract | `validate-playbook-package.cjs` |
| Negative control | The routing-gold trap, reproduced and reversed | The same validator, with a checksum-verified restore |
| Fleet | The hub, the corpus and the compiled routing | `parent-skill-check.cjs`, `check-corpus.cjs --render`, `compiled-route-manifest.cjs` |
| Spec | Every folder in the packet | `validate.sh --strict --recursive` |
| Voice | Every authored document | `hvr_scan.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-create-manual-testing-playbook` validator | Internal | Green | No contract to write against |
| The shipped chart corpus and its check | Internal | Green | Nothing for the scenarios to describe |
| The hub registration from the previous phase | Internal | Green | The routing scenario has nothing to replay |
| A Chrome or Chromium binary | External | Green | The render gate records a named blocker rather than a pass |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate fails from the final state and the cause is in this phase's edits.
- **Procedure**: The playbook tree is new and untracked, so removing the three category folders and the root index returns the packet to its previous state. The spec-document edits revert with `git checkout --` of the touched paths.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Read the contract ──► Author the scenarios ──► Reconcile the packet ──► Run the gates
                                   │
                          Negative control
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Read the contract | None | Author |
| Author | Read the contract | Negative control, Reconcile |
| Negative control | Author | Gates |
| Reconcile | Author | Gates |
| Gates | Negative control, Reconcile | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Reading the validator and one sibling package |
| Core Implementation | Medium | Nine documents, each grounded in a real defect |
| Verification | Medium | Five gates plus a negative control and a restore |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup taken before the negative control, verified by checksum afterwards
- [x] No feature flag applies. Nothing here is runtime behavior
- [x] Baselines captured for every gate before the first edit

### Rollback Procedure
1. Remove the playbook tree, which is new and carries nothing else.
2. Revert the spec-document edits with `git checkout --` of the touched paths.
3. Re-run the five gates and compare against the captured baselines.
4. No stakeholder notification applies. Nothing user-facing changed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Read contract  │────►│  Author package │────►│   Run gates     │
│  from source    │     │  nine documents │     │   from final    │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                       ┌─────────▼─────────┐
                       │ Negative control  │
                       │ and restore       │
                       └───────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Contract reading | None | The frontmatter and section rules | Authoring |
| Root index | Contract reading | The directory, policy and coverage map | Scenarios, gates |
| Scenario files | Root index | Eight execution contracts | Gates |
| Negative control | Scenario files | Proof the trap is real | Gates |
| Closeout edits | Scenario files | A reconciled packet | Gates |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Read the validator source** - the contract decides every frontmatter field - CRITICAL
2. **Author the nine documents** - the deliverable - CRITICAL
3. **Run the five gates from the final state** - the closeout claim rests on them - CRITICAL

**Total Critical Path**: One session

**Parallel Opportunities**:
- The negative control and the closeout edits are independent once the scenarios exist
- The voice scan runs against any document as soon as it is written
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Contract understood from source | The frontmatter field set and the five required sections are known | Before the first document |
| M2 | Package authored | The contract check reports a nonzero operator count with zero violations | Before the closeout edits |
| M3 | Packet closed | Every gate run from the final state, with its output read | End of phase |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Three decisions were taken in this phase and all three live in `decision-record.md`, which is the
single place they are numbered. Restating them here would produce a second ADR-001 with different
content, which is how a waiver ends up citing the wrong record.

| ADR | Decision |
|-----|----------|
| ADR-001 | Scenarios group by failure mode, with a family coverage table |
| ADR-002 | The result-persistence sentence is restated without its semicolon |
| ADR-003 | The fleet metadata criterion closes as a waiver |

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
