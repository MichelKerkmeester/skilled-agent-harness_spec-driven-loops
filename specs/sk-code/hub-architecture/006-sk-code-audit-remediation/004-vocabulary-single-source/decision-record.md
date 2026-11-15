---
title: "Decision Record: Phase 4: vocabulary-single-source"
description: "Why the vocabulary comparison does not run for sk-code-ci, and why it lives in check 2 of the guard."
trigger_phrases:
  - "vocabulary single source decision record"
  - "vocabulary mirrors decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/004-vocabulary-single-source"
    last_updated_at: "2026-11-14T15:30:00Z"
    last_updated_by: "implement-workflow"
    recent_action: "Recorded ADR-001, ADR-002 and one operator answer"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "7af6e9dd-2e69-40a8-ad96-09de518ccdff"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 4: vocabulary-single-source

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The three-way keyword match does not run for sk-code-ci

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-14 |
| **Deciders** | Michel Kerkmeester, operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

REQ-006 asks for the new comparison to run for `sk-code-ci` with no change to its keywords, on the premise that its vocabulary is copied the same way as the frontend surface's. It is not. The two `code-ci` classes in `hub-router.json` hold 72 keywords, the hub `ROUTER.md` `CI_WORKFLOW` row holds 58 and the packet row holds 12. A strict match would fail on the clean tree, which REQ-002 forbids.

### Constraints

- Decision D2 in `goal.md` allows no keyword change in this phase.
- REQ-002 requires the router-sync leg to pass on the unmodified tree.
- The frontend surface's three copies are equal, 162 keywords each, since phase 002.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Compare the three copies only for a surface that `hub-router.json` lists under `vocabularyMirrors`, list the frontend surface there, and record the CI difference as ledger row `H7`.

**How it works**: The alias rule runs for every mode and passes for `sk-code-ci`. The three-way match runs for each listed surface. `sk-code-ci` is not listed, so its copies are not compared until a later packet aligns them and adds it.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **List mirrored surfaces, frontend only** | No CI keyword changes, and the clean tree passes | CI's copies stay unguarded | 8/10 |
| Align CI's rows to its classes and guard both | Both surfaces guarded | Changes CI's second-stage keywords, which D2 forbids | 4/10 |
| Hard-code the frontend packet name in the guard | No new key | A host hub could not enrol its own surface | 3/10 |

**Why this one**: It guards the copies that are equal today and names the ones that are not, without changing how CI routes.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A frontend keyword changed in one copy and not the others fails check 2.
- A registry alias that no class holds fails check 2 for every mode.

**What it costs**:
- CI's copies can keep drifting. Mitigation: ledger row `H7` records the three counts and the fix, which is to align the rows and add `sk-code-ci` to the list.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A maintainer assumes CI is guarded | M | The scripts README and the hub README say the match runs only for listed surfaces |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | REQ-006 and REQ-002 cannot both hold for CI |
| 2 | **Beyond Local Maxima?** | PASS | Two options were put to the operator |
| 3 | **Sufficient?** | PASS | One optional list key, read like `surfaceIntentFolds` |
| 4 | **Fits Goal?** | PASS | A mismatch between the frontend copies fails a guard |
| 5 | **Open Horizons?** | PASS | Adding a surface is one list entry |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `hub-router.json` gains the optional `vocabularyMirrors` list with `sk-code-frontend`.
- `acceptance-criteria.md` row AC-006 is `Superseded` and names ADR-001.
- The findings ledger gains row `H7`.

**How to roll back**: Remove `vocabularyMirrors` from `hub-router.json`. Check 2 then runs the alias rule alone.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The vocabulary comparison lives in check 2, not in a new leg

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-14 |
| **Deciders** | Michel Kerkmeester, operator |

---

<!-- ANCHOR:adr-002-context -->
### Context

The plan adds a new leg to `verify-router-sync.cjs`. A sixth leg changes the guard's total from `5/5` to `6/6` and the leg list `1a,1b,2,3,4` that `run-all-drift-guards.sh` passes. Fourteen playbook scenarios and the doctor playbook quote `5/5`, and two of those files sit outside `.skilled/skills/sk-code/`.

### Constraints

- Parent decision D5 lets files outside `.skilled/skills/sk-code/` change only after the operator answers a question that names them.
- Check 2 already checks each surface's `hub-router.json` entries.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Put the vocabulary comparison inside check 2 and extend that check's title.

**How it works**: `legSurfaceMap` calls `vocabularyProblems` right after `surfaceSignalProblems`. A mismatch prints under `FAIL check 2` with the keyword and both file names. The leg list and the `5/5` total do not change.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Inside check 2** | No document outside the hub changes, and the runner needs no edit | One check covers two concerns | 8/10 |
| A new leg `5` | Selectable alone with `--checks 5` | Changes the total quoted in about twenty files, two outside the hub | 4/10 |

**Why this one**: The requirement is that the guard fails and names the file. Check 2 is the surface check, and it does both.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The existing runner and every document that quotes `5/5` stay correct.

**What it costs**:
- The vocabulary comparison cannot be run alone. Mitigation: `--checks 2` runs it with the surface map check, in under a second.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader looks for a separate vocabulary leg | L | Both script READMEs say check 2 carries it |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A new leg would change files D5 protects |
| 2 | **Beyond Local Maxima?** | PASS | The new-leg option was costed against its ripple |
| 3 | **Sufficient?** | PASS | Two functions and one call |
| 4 | **Fits Goal?** | PASS | REQ-001 holds, the guard exits 1 and names `hub-router.json` |
| 5 | **Open Horizons?** | PASS | The functions can move to their own leg later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `verify-router-sync.cjs` gains `keywordsOf` and `vocabularyProblems`, one call in `legSurfaceMap` and a longer title for check 2.

**How to roll back**: Delete the two functions and the call, and restore the check 2 title.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Guard the frontend copies and record the CI difference | CI's three copies hold 72, 58 and 12 keywords, and aligning them is a keyword change decision D2 forbids | REQ-006 as written | ADR-001, AC-006 and ledger row `H7` |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001

Question: Phase 004 wants the new guard leg to compare the three keyword copies for sk-code-ci as well as sk-code-frontend, 'with no change to its keywords'. Frontend's three copies are equal (162 each). CI's are not: 72 keywords in hub-router.json, 58 in the hub ROUTER.md row and 12 in the packet row. A strict leg would fail on the clean tree for CI. Which way?

Options: `Guard frontend, record CI (Recommended)`, `Align CI now, guard both`.

Answer, 2026-11-14: `Guard frontend, record CI (Recommended)`
<!-- /ANCHOR:operator-answers-verbatim -->

---
