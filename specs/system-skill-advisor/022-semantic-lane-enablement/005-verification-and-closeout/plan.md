---
title: "Implementation Plan: Phase 5: verification-and-closeout"
description: "Run every gate once from one final state, re-derive the hashes afterwards to prove nothing moved, then reconcile the predecessor packet and this packet's own completion claims."
trigger_phrases:
  - "final state pass"
  - "recursive validation"
  - "metadata regeneration"
  - "register reconciliation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/005-verification-and-closeout"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the implementation plan"
    next_safe_action: "Rebuild the validation orchestrator, then run the final-state pass"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-005-verification-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: verification-and-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell and Node for the gates, Markdown for the reconciliation |
| **Framework** | The spec validation orchestrator and the advisor CLI |
| **Storage** | The packet folder, plus two named documents in packet 052 |
| **Testing** | The accuracy ratchet, the frozen corpora and the recursive validator |

### Overview

Run everything once, in one pass, from the state the packet leaves behind. Then re-derive the
corpus hashes and the coverage count, because a gate that passed against a state which has since
moved proves nothing. The reconciliation comes last, so it describes the run rather than
anticipating it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 004 closed, with its decision recorded
- [ ] The compiled validation orchestrator is current, rebuilt if it reports itself stale
- [ ] The daemon is live and its generation is recorded

### Definition of Done
- [ ] Every folder reports a passing validation result with its rule lines present
- [ ] Every gate has a final-state number beside the command that produced it
- [ ] No two documents in the packet claim different completion states
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A single final-state pass, followed by reconciliation.

### Key Components

- **The gates**: the accuracy ratchet, the frozen 180-row corpus, the 444 declared signals, the 224 controls and the five canaries.
- **The validator**: invoked through a resolved real path, read per folder rather than at its tail, and required to report a passing result rather than merely not failing.
- **The metadata pair**: `description.json` and `graph-metadata.json` per folder, regenerated after the last document edit so the integrity fingerprint matches what it attests.
- **The predecessor documents**: the packet 052 roadmap entry and finding 10, both of which point here and neither of which closes itself.

### Data Flow

Gates produce numbers, the numbers land in one document, and the reconciliation reads that
document rather than the memory of the run.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `research/final-state.md` | The record of the final pass | create | Every gate appears with its command and its number |
| `../spec.md` | The parent phase map | update | Every phase status matches its folder |
| `../goal.md` | The parent progress table | update | Every row carries evidence rather than a state word alone |
| `specs/sk-doc/052-routing-completeness/roadmap.md` | Points at this packet | update | The Later entry names this packet and its result |
| `specs/sk-doc/052-routing-completeness/research/findings-register.md` | Carries finding 10 | update | Finding 10 reads resolved and names the evidence |

Required inventories:
- Same-class producers: `rg -n 'semantic lane|semantic_shadow' specs/sk-doc/052-routing-completeness`.
- Consumers of changed symbols: none. This phase changes documents.
- Matrix axes: gate by state. Every gate runs against exactly one final state, which is the point of the pass.
- Algorithm invariant: a gate result is only valid when the corpus hashes and the coverage count are identical before and after the pass.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None new. The existing suites run as gates | Vitest |
| Integration | The recursive spec validation across all six folders | The validation orchestrator |
| Manual | The five canaries and a spot check of two corpus rows through the live daemon | The advisor CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 outcome | Internal | Red until phase 004 closes | There is no final state to verify |
| The compiled orchestrator | Internal | Yellow | A stale build makes the validator emit nothing at all |
| Packet 052 documents | External to this packet | Yellow | Another agent may be editing them, so they are re-read immediately before the edit |
| The advisor daemon | Internal | Green | No canaries and no corpus pass |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate fails from the final state, or the hashes moved during the pass.
- **Procedure**: Stop the closeout, record which gate failed and against what state, and return the packet to phase 004 rather than marking anything complete.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Rebuild validator ──► Final-state pass ──► Re-derive hashes ──► Reconcile ──► Validate recursively
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Rebuild | Phase 004 | Pass |
| Pass | Rebuild | Re-derive |
| Re-derive | Pass | Reconcile |
| Reconcile | Re-derive | Validate |
| Validate | Reconcile | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour |
| Core Implementation | Medium | Three to four hours, most of it the corpus pass |
| Verification | Medium | Two hours, including the recursive validation |
| **Total** | | **Five to seven hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The daemon generation is recorded before the pass
- [ ] The corpus hashes and the coverage count are recorded before the pass
- [ ] The two packet 052 documents are re-read immediately before they are edited

### Rollback Procedure
1. Stop the closeout at the first failing gate
2. Record which gate failed, and against which state
3. Return the packet to phase 004 rather than marking anything complete
4. Leave the acceptance criteria rows unmet, since a failed closeout is information rather than a formality

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. This phase writes documents and runs read-only gates
<!-- /ANCHOR:enhanced-rollback -->

---
