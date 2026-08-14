---
title: "Decision Record: Reconcile Migration-Program Completion Claims Against the Current Suites"
description: "Decision record for 001-completion-evidence-reconcile: the architectural rulings this remediation child depends on, with alternatives and consequences."
trigger_phrases:
  - "completion evidence reconcile"
  - "blocker 4 evidence drift"
  - "migration program completion claims"
  - "recursive validation child manifest"
  - "deep loop 021 reconcile"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/001-completion-evidence-reconcile"
    last_updated_at: "2026-07-31T03:16:25Z"
    last_updated_by: "claude"
    recent_action: "Closed out 021: ADRs accepted, checklist reconciled, 016 fixed"
    next_safe_action: "None; monitor 031 Lane B for the alignment RED-anchor re-verify"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

# Decision Record: Reconcile Migration-Program Completion Claims Against the Current Suites

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Completion evidence cites a test name, a suite-content digest, and a candidate SHA

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner, independent verifier |

Accepted on the strength of the reconciled checklists (123 lines carrying the citation format, digests independently recomputed 4/4 by the adversarial pass).

---

<!-- ANCHOR:adr-001-context -->
### Context

The migration program marked items complete with evidence strings like a run count or a raw line number. Those reproduce from nothing: a count changes when a suite is de-duplicated or extended, and a line anchor drifts on the next edit. `F-025-01` through `F-025-04` are all instances of the same defect, and `F-029-01` shows the same class one level up in the review manifest. The review's own durable lesson is that a passing gate authored alongside the change is not independent evidence, and a bare number is the weakest possible form of that gate.

### Constraints

- The citation must be checkable by a second party from the doc string alone.
- It must survive `031` Lane B de-duplication, which will legitimately reduce discovered test counts.
- It must not require new tooling to read; a human with a checkout must be able to verify it.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Every completion claim cites a test **name**, a suite-content digest, and the candidate SHA it was observed at.

**How it works**: The test name identifies what ran, the suite-content digest pins the suite body so a rename or an added case is visible, and the SHA pins the tree. A verifier checks out the SHA, runs the suite, confirms the digest, and finds the named test.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Test name + suite digest + SHA** | Reproducible by a second party; survives de-duplication; no new tooling to read | Longer evidence strings; digest must be computed | 9/10 |
| Bare run count (status quo) | Cheap to write | Reproduces from nothing; is exactly the defect under repair | 1/10 |
| Test name + SHA only | Shorter; still reproducible | A suite edited in place at the same SHA is invisible; weaker against silent suite change | 6/10 |
| CI artifact link | Machine-generated, hard to fake | Requires CI retention; dead link after expiry; not readable from a checkout alone | 4/10 |

**Why this one**: It is the cheapest format that a second party can independently reproduce, and it is the only one of the four that survives the test-count change `031` will legitimately introduce.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Every reopened claim becomes independently checkable rather than trusted.
- De-duplication in `031` no longer invalidates citations issued here.
- Drift becomes visible at the gate instead of at the next review.

**What it costs**:
- Evidence strings get longer and take more effort to author. Mitigation: the digest is computed once per suite per SHA, not per item.
- Existing complete packets outside this tree still carry the old format. Mitigation: this ADR binds the reopened set and future claims in the 021-032 tree, not a repo-wide retrofit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Authors revert to bare counts under time pressure | M | CHK-050 greps for bare-count strings and blocks completion |
| Digest computation differs across machines | M | NFR-D02: repo-relative paths, stable sort, documented digest command |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Blocker 4 is a named cutover blocker; four CONFIRMED findings are instances of it |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including a CI-artifact approach |
| 3 | **Sufficient?** | PASS | No tooling required to verify; a checkout and the doc string are enough |
| 4 | **Fits Goal?** | PASS | Directly discharges Blocker 4, which gates `014` |
| 5 | **Open Horizons?** | PASS | Format is additive and can be adopted by other packets without changing this one |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The four `013` checklists reopened by this child.
- Any future completion claim inside the 021-032 remediation tree.

**How to roll back**: Revert the checklist commits to the pre-change SHA. The format change is documentation-only and carries no runtime effect, so no code rollback is involved.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Recursive strict validation accepts a bounded, hashed child manifest

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner, spec-kit maintainer |

Accepted on the strength of the landed boundary (32-entry declared manifest accepted live, negative test green, undeclared-parent control identical).

---

<!-- ANCHOR:adr-002-context -->
### Context

`F-029-03` is CONFIRMED: `validate.sh --recursive` globs every numbered child under a parent with no phase-manifest boundary. That means the acceptance set is whatever happens to be on disk, so adding a child silently widens it. This tree adds twelve children at once, which turns a latent problem into an immediate one: the parent recursive gate would go redder with every child scaffolded, and nobody could tell an intentional addition from an accidental one.

### Constraints

- `validate.sh` is shared by every packet in the repo; a behavior change there has the widest blast radius in this child.
- Packets without a manifest must keep working exactly as they do today.
- The manifest must be stable across machines so its hash is comparable.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: A parent may declare a frozen, hashed child manifest; when present, recursive strict validation validates exactly that set and fails on any child outside it.

**How it works**: The parent declares its acceptance children and a hash over that list. `--recursive` reads the manifest, validates the listed children, and fails if an on-disk numbered child is absent from the list or a listed child is absent from disk. With no manifest, behavior is unchanged.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Opt-in hashed manifest in `validate.sh`** | One mechanism, repo-wide; unchanged for packets that do not opt in; makes additions explicit | Touches a shared script; needs a whole-repo before/after delta | 9/10 |
| Manifest in the parent `graph-metadata.json` | No shared-script change | `graph-metadata.json` is generator-owned; hand-editing it fights the generator contract | 5/10 |
| Nest 021-032 under a new phase parent instead of bounding the glob | Confines the blast radius to one subtree | Relocates the problem rather than fixing it; an unbounded glob under a new parent behaves the same | 4/10 |
| Leave unbounded, accept the noise | No work | The parent gate becomes uninformative exactly when this tree needs it most | 1/10 |

**Why this one**: It is the only option that makes an addition to the acceptance set an explicit, reviewable act, and its blast radius is contained by being opt-in.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Adding a child becomes a deliberate manifest edit rather than a silent widening.
- The parent recursive gate stays informative while twelve children land.
- A missing child folder becomes a hard failure instead of a silent skip.

**What it costs**:
- A shared repo-wide script changes. Mitigation: opt-in, plus a whole-repo before/after recursive delta as a landing gate.
- Manifest maintenance becomes a step when adding a child. Mitigation: that is the intended behavior, not an accident.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Whole-repo recursive validation regresses for unrelated packets | H | Opt-in default plus CHK-111 before/after delta across every packet |
| Manifest drifts from disk and blocks unrelated work | M | Failure message names the exact missing or extra child so the fix is one line |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `F-029-03` is CONFIRMED, and this tree makes the condition materially worse |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including the nesting alternative the WS1 proposal raised |
| 3 | **Sufficient?** | PASS | A frozen list plus a hash is the smallest mechanism that makes additions explicit |
| 4 | **Fits Goal?** | PASS | Discharges the acceptance half of Blocker 4 and unblocks scaffolding of 022-032 |
| 5 | **Open Horizons?** | PASS | Opt-in, so other packets adopt it when they want the property |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` recursive path.
- The `036-deep-loop-innovation` parent gains a declared child manifest covering 001-020 plus 021-032.

**How to roll back**: Revert the `validate.sh` commit and re-run whole-repo recursive validation to confirm the prior counts return. The manifest declaration becomes inert data with no reader, so it can be left in place or removed separately.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The pre-cutover validation artifacts stay in place; phase 016 is re-scoped around them

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-31 |
| **Deciders** | Operator (explicit ruling), packet owner |

---

<!-- ANCHOR:adr-003-context -->
### Context

The `001-whole-system-gate` folder holds `review/` and `alignment/` trees produced by an
operator-requested pre-cutover validation run. `PRE-014-VALIDATION-RUN.md` records that these
artifacts are not phase-016 execution: the phase's own blocking prerequisite (landed
legacy-writer-retirement evidence) is unmet, so its gate cannot legitimately have run. The fork
was relocation (move ~90 landed files to a dedicated sibling) versus re-scoping (own the
artifacts formally inside 016 as a distinct pre-cutover stage).
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

The operator ruled for re-scoping. Phase 016 gains an explicit two-stage structure: **Stage A —
pre-cutover validation** owns the existing `review/` and `alignment/` artifacts as landed
evidence gathered before the cutover; **Stage B — the whole-system gate proper** remains
unexecuted and keeps its blocking prerequisite on legacy-writer retirement. No files move;
existing references and history stay intact.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

- **Relocation to a new sibling packet** — cleaner nominal separation, but moves ~90 landed
  files, breaks the cross-references already landed in the findings register, the remediation
  children, and the parent handoff criteria, and re-writes history for no behavioral gain.
- **Deferral to 016's own execution** — leaves the placement ambiguity open through the whole
  remediation program, letting further references accrete against an undecided layout.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

- `016/spec.md` documents the two stages; the boundary notice stays as the Stage-A provenance
  record with its disposition line updated.
- Stage B's prerequisite language is unchanged; nothing about this decision advances the gate.
- The remediation children keep citing `001-whole-system-gate/review/` paths unchanged.

**How to roll back**: Revert the two doc edits; the fork reopens with both options intact
because no files moved.
<!-- /ANCHOR:adr-003-consequences -->
<!-- /ANCHOR:adr-003 -->
