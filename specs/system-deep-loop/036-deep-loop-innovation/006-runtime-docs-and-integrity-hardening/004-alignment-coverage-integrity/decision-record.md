---
title: "Decision Record: Make Alignment Coverage, Seal State and Lane Identity Provable"
description: "Decision record for 004-alignment-coverage-integrity: the architectural rulings this remediation child depends on, with alternatives and consequences."
trigger_phrases:
  - "alignment coverage integrity"
  - "coverage fails open corpus"
  - "lane identity injective normalizer"
  - "unearned coverage credit alignment"
  - "deep loop 026 alignment"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/004-alignment-coverage-integrity"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored ADR-001 through ADR-003 from the WS1 phase-tree proposal"
    next_safe_action: "Operator accepts or rejects ADR-001 through ADR-003"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

# Decision Record: Make Alignment Coverage, Seal State and Lane Identity Provable

---

<!-- ANCHOR:adr-001 -->
## ADR-001: One shared normalizer and one canonical lane identity, used by both readers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner, independent verifier |

---

<!-- ANCHOR:adr-001-context -->
### Context

Two readers process the same corpus bytes and disagree. `check-convergence.cjs` normalizes with `.trim()` while `reduce-alignment-state.cjs` collapses internal whitespace, so identical bytes are accepted by one and rejected as `CORPUS_ORPHAN_LANE_ID` by the other (`F-SOL-04`, CONFIRMED). Lane identity omits the adapter (`F-009-03`) and omits scope type while joining arrays with a comma-space (`F-RES-05`, CONFIRMED), so `paths:["docs/"]` collides with `globs:["docs/"]` and `paths:["a","b"]` collides with `paths:["a, b"]`. Duplicate lane IDs overwrite in Maps while totals sum, so `CONVERGED` can coexist with `overallVerdict: FAIL` (`F-SOL-02`, CONFIRMED).

### Constraints

- `F-RES-05`'s consequence is now inverted: legitimate distinct lanes collide into a duplicate-corpus integrity fault and halt the run, so the fix must restore injectivity without re-introducing the original collision.
- The in-run `F-SOL-04` fix over-tightened and now falsely rejects an honest corpus lane, so this child must fix a fix.
- Existing reducer state is keyed by the old identity and will not match after the change.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: One normalizer module used by both readers, and a canonical lane identity computed as a hash over the canonical scope object including adapter and scope type.

**How it works**: Both readers import the same normalizer, so divergence becomes impossible rather than unlikely. Lane identity hashes a canonical object rather than concatenating strings, which removes separator and ordering ambiguity entirely.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared normalizer + hashed canonical scope object** | Divergence impossible; injective by construction; no separator to choose | Existing state keyed by the old identity will not match | 9/10 |
| Shared normalizer + a separator that cannot occur in scope values | Simpler; human-readable identities | Requires proving no scope value can contain the separator, which is a claim about future data | 6/10 |
| Keep two normalizers and add a conformance test | No refactor | A test that both stay in sync is weaker than making them the same code; drift returns | 3/10 |

**Why this one**: Hashing a canonical object makes injectivity a property of the construction rather than a claim about what characters scope values will never contain.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The two readers cannot disagree, because they share the code.
- Lane identity is injective by construction.
- `CONVERGED` can no longer coexist with `overallVerdict: FAIL`.

**What it costs**:
- Existing alignment state keyed by the old identity becomes unmatched. Mitigation: treat in-flight runs as needing a fresh start; document it in the landing note rather than attempting a rekey.
- Identities become opaque hashes rather than readable strings. Mitigation: retain the canonical object alongside the hash for debugging.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The change alters conclusions for an existing honest corpus unexpectedly | H | Differential test across the adversarial fixture set before landing (CHK-030) |
| Over-tightening recurs | H | REQ-009 makes the honest-corpus-lane acceptance an explicit test case |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three CONFIRMED findings describe reader disagreement and identity collision |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed, including the separator approach |
| 3 | **Sufficient?** | PASS | Shared code plus a canonical hash closes the whole identity family |
| 4 | **Fits Goal?** | PASS | Both readers agreeing is the precondition for every coverage claim |
| 5 | **Open Horizons?** | PASS | A new scope kind extends the canonical object without changing the mechanism |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- A new shared normalizer module.
- `check-convergence.cjs` and `reduce-alignment-state.cjs` identity and normalization paths.

**How to roll back**: Revert the normalizer commit; both readers return to their local normalization. Record that `F-SOL-02`, `F-SOL-04`, `F-009-03` and `F-RES-05` re-open.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Coverage fails closed with four distinguishable states

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

`F-009-01` is CONFIRMED: an absent or malformed corpus yields an empty map, every lane is skipped, and `coverage = discovered>0 ? checked/discovered : 1.0` returns 1.0. Missing evidence reads as full coverage. `F-SOL-03` and `F-SOL-06` record that an absent corpus is indistinguishable from a valid empty one, and `F-SOL-01` records that a configured lane missing from a non-empty corpus becomes `NOT_APPLICABLE` and drops out of both the ratio and the partitioning.

### Constraints

- A genuinely empty corpus is a legitimate state and must not be reported as a fault.
- The workflow currently marks `status complete` without checking `sealed===true` (`F-RES-01`), so the seal must become part of the completion gate.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Four distinguishable states: corpus absent (discovery incomplete, non-pass), present and valid with zero artifacts (genuine `NOTHING_TO_CONVERGE`), present and malformed (integrity fault), and a configured lane missing from a non-empty corpus (integrity fault). No state defaults to full coverage.

**How it works**: The ratio is computed only when discovery is complete and the corpus is valid. Every other case produces a named state that the workflow consumers handle explicitly, including `DISCOVERY_INCOMPLETE`.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Four distinguishable states, fail closed** | Absence of evidence is never coverage; each state is actionable | Workflow consumers must handle four cases | 9/10 |
| Two states (pass/fail) with fail-closed default | Simpler consumers | Conflates a genuine empty corpus with a missing one, which is one of the confirmed findings | 5/10 |
| Keep the ratio, add a warning on an empty corpus | Least change | A warning beside a 100 percent number is the status quo failure | 2/10 |

**Why this one**: The four states are the four situations an operator actually needs to tell apart, and collapsing any two of them reproduces one of the confirmed findings.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A missing corpus can no longer read as complete coverage.
- A genuine empty corpus is reportable without being a fault.
- A configured lane missing from the corpus is a fault rather than a silent drop.

**What it costs**:
- Workflow consumers must handle four cases including `DISCOVERY_INCOMPLETE`. Mitigation: `F-SOL-05` already requires that handling.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A consumer does not handle a new state and fails opaquely | M | REQ-005 and `F-SOL-05`: consumers updated in the same change |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four CONFIRMED findings describe coverage failing open |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | Four states cover every case the findings describe |
| 4 | **Fits Goal?** | PASS | Coverage must be provable to gate the alignment lane of `014` |
| 5 | **Open Horizons?** | PASS | A fifth state can be added without collapsing the existing four |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `check-convergence.cjs` state computation.
- `reduce-alignment-state.cjs` seal predicate.
- `deep-alignment-{auto,confirm}.yaml` completion gate and `DISCOVERY_INCOMPLETE` handling.

**How to roll back**: Revert the state-computation commit; coverage returns to the ratio form. Record that `F-009-01`, `F-SOL-01`, `F-SOL-03`, `F-SOL-06` and `F-RES-01` re-open.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Coverage credit is bound to per-artifact evidence within the dispatched slice

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner, independent verifier |

---

<!-- ANCHOR:adr-003-context -->
### Context

`F-RES-04` is CONFIRMED and is the §5 residual that needs design rather than a patch: neither the reducer nor the leaf writer proves that claimed canonical paths were audited or even belonged to the dispatched slice. The writer only checks that `artifactsChecked` is an array, so a leaf claiming the whole corpus gets full identity-verified coverage. This is the same fabrication mode observed live when a fan-out lineage emitted formally valid iteration artifacts it had not earned, which means the fix should not be alignment-specific. `F-009-04` is the adapter half of the same design, and `F-RES-06` is the slicing half.

### Constraints

- The binding layer sits on top of the closed record parser `024` owns; this child may not restructure leaf publication.
- Evidence must be cheap enough that an honest leaf can always produce it.
- The same fabrication mode occurs outside alignment, so the mechanism should be adoptable by other modes.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Coverage credit requires per-artifact evidence (a finding, a content digest, or an adapter check receipt) and is restricted to artifacts in the dispatched slice.

**How it works**: The leaf writer records evidence per claimed artifact. The reducer credits only artifacts that carry evidence and belong to the dispatched slice. The partition cursor advances from credited evidence, not from a raw count. The live-render adapter returns measurements rather than echoing a caller-supplied string.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-artifact evidence restricted to the dispatched slice** | A claim without work earns nothing; generalizes beyond alignment; the cursor stops stranding | Every honest leaf must emit evidence per artifact | 9/10 |
| Trust the leaf, audit samples afterwards | No leaf-side change | Sampling cannot catch a lineage that fabricates uniformly, which is the observed mode | 3/10 |
| Require a signed leaf attestation | Strong non-repudiation | Signs the same unverified claim; the signature attests to authorship, not to work | 4/10 |

**Why this one**: Only per-artifact evidence distinguishes a leaf that did the work from a leaf that emitted a formally valid claim, and restricting credit to the dispatched slice closes the remaining path where a leaf claims the whole corpus.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- An unearned claim earns zero coverage.
- The partition cursor stops advancing on uncredited counts, so the loop no longer strands.
- The mechanism is available to other modes exhibiting the same fabrication.

**What it costs**:
- Every honest leaf must emit per-artifact evidence. Mitigation: a finding, a content digest, or an adapter receipt all qualify, so an honest leaf always has one.
- A dependency on `024`'s closed parser. Mitigation: `024` schedules the parser early.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Evidence-bound credit rejects a genuine audit | H | Honest-leaf fixtures alongside the unearned-credit test; a rejection is investigated as a finding |
| The design stays alignment-shaped and does not generalize | M | The binding lives in the leaf writer layer, which other modes already use |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `F-RES-04` is CONFIRMED and the same mode was observed live in fan-out |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed, including signed attestation |
| 3 | **Sufficient?** | PASS | Per-artifact evidence plus a slice restriction closes both halves |
| 4 | **Fits Goal?** | PASS | Coverage must be provable to gate the alignment lane of `014` |
| 5 | **Open Horizons?** | PASS | Placed in the leaf writer layer so other modes can adopt it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `leaf-artifact-writer.ts` slice-binding layer, on top of `024`'s closed parser.
- `reduce-alignment-state.cjs` credit computation.
- `partition-corpus.cjs` cursor advance.
- `sk-design-live-render.cjs` check receipt.

**How to roll back**: Revert the slice-binding commit; credit returns to the array-shape check. Record that `F-RES-04`, `F-009-04` and `F-RES-06` re-open.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

## ADR-004: Preserve valid scope bytes while sharing the lane normalizer

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-07 |
| **Deciders** | Packet owner, independent verifier |

### Context

The earlier normalization fix rejected an honest lane by collapsing whitespace that was part of a valid scope value. The two readers needed one implementation without changing valid scope bytes.

### Decision

**We chose**: Normalize only the schema shape and empty-value rules; preserve valid outer and internal scope bytes, then hash the canonical object shared by both readers.

**How it works**: `normalizeLaneId`, `normalizeScope`, and the canonical serializer live in one CommonJS module. Both the reducer and convergence checker import that module, so the regression case reaches the same identity and conclusion in both paths.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preserve valid bytes and share the normalizer** | Fixes divergence without rejecting honest scopes | Identities remain sensitive to intentional whitespace | 9/10 |
| Collapse all whitespace | Shorter identities | Repeats the over-tightening regression | 2/10 |

**Why this one**: The corpus owns scope values. The reader must not rewrite valid values merely to make identifiers look tidy.

### Consequences

**What improves**:
- The honest corpus lane remains accepted.
- Identical bytes reach identical identity and validation logic.

**What it costs**:
- Existing state keyed by a differently normalized identity needs a fresh run. The rollback is to restore the prior reader behavior and re-open the identity findings.

### Implementation

The shared normalizer and the honest-whitespace differential test implement this decision. Rollback restores the previous identity construction in both readers and records the reopened identity findings.

---

## ADR-005: Treat configured lanes in an empty corpus as an integrity mismatch

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-07 |
| **Deciders** | Packet owner, independent verifier |

### Context

An empty corpus is valid only when it describes zero applicable configured lanes. If configuration names a lane but the corpus has no corresponding lane, reporting `NOTHING_TO_CONVERGE` would hide a discovery mismatch.

### Decision

**We chose**: Keep `present-valid-zero-artifacts` distinct from `configured-lane-missing`. A configured lane missing from the corpus is an integrity fault, even when the corpus artifact total is zero.

**How it works**: Corpus readers compare the canonical configured lane set with the corpus lane set before calculating coverage. The empty-valid state remains a genuine no-work result only when no configured lane is missing.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Distinguish empty-valid from configured-lane-missing** | Preserves a real no-work result and exposes discovery mismatch | Requires explicit state handling | 9/10 |
| Treat every empty corpus as no work | Minimal consumer logic | Silently accepts missing discovery output | 2/10 |

**Why this one**: The operator needs to distinguish “there was nothing to inspect” from “the configured inspection lane never appeared.”

### Consequences

**What improves**:
- Empty-valid runs can converge without a false fault.
- Missing configured lanes fail closed rather than disappearing from coverage.

**What it costs**:
- Producers must publish a lane entry for each configured lane, including an explicit empty artifact list when appropriate.

### Implementation

The four-state corpus fixtures and the convergence/reducer readers implement this decision. Rollback restores the old empty-map behavior and re-opens the absent-versus-empty findings.

---

## ADR-006: Bare counts are activity signals, never coverage credit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-07 |
| **Deciders** | Packet owner, independent verifier |

### Context

A repeated numeric artifact count can reach the corpus size without naming or evidencing any artifact. Using that count as a cursor or credit source makes an unmeasured run look complete.

### Decision

**We chose**: Count-only records remain visible as reported activity but cannot earn coverage or advance the partition cursor.

**How it works**: The reducer credits only canonical artifact identities that intersect the corpus and carry per-artifact evidence inside the dispatched slice. The partitioner uses that credited identity set; a raw count is never a substitute.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep counts observational and require identity evidence** | Preserves diagnostics while closing false credit | Producers must emit identities and evidence | 9/10 |
| Advance from the reported count | Backward-compatible shape | Re-credits unmeasured work and can strand the loop | 2/10 |

**Why this one**: A count answers how much a producer claimed, not which artifacts it actually checked.

### Consequences

**What improves**:
- Repeated bare counts cannot satisfy complete coverage.
- The cursor advances only when evidence earns a real artifact identity.

**What it costs**:
- Legacy count-only leaves need a producer update before they can earn alignment credit.

### Implementation

The count-only regression and the partition identity-progress test implement this decision. Rollback would restore count-based cursor advancement and explicitly re-open the coverage-credit finding.
