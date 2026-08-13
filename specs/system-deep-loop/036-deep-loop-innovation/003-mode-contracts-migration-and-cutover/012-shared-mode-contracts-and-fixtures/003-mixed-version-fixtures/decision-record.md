---
title: "Decision Record: Mixed-Version Fixture Evidence Boundaries"
description: "Records the evidence-grounded resume classifier decision, the authored-digest guarantee boundary, and one frozen-registry follow-up observation."
trigger_phrases:
  - "mixed-version fixture evidence boundary"
  - "authored case digest guarantee"
  - "resume classifier restart evidence"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/003-mixed-version-fixtures"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/003-mixed-version-fixtures"
    last_updated_at: "2026-07-21T14:35:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded fixture evidence and integrity boundaries"
    next_safe_action: "Consume the sealed corpus in phase-013 mode migrations"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/mixed-version-fixtures/reducer-resume-oracle.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/mixed-version-fixtures/fixture-corpus.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Restart classification is computed from sealed restart metadata and the frozen census row."
      - "Authored case digests detect runtime mutations but do not pin a source literal across sessions."
---
# Decision Record: Mixed-Version Fixture Evidence Boundaries

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Bind Resume Classification to Verified Restart Evidence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Deciders** | Mixed-version fixture maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

The interrupted fixture previously passed an empty evidence array to the frozen
in-flight classifier. Every census row therefore returned `BLOCK` with
`MISSING_EVIDENCE`, so the authored `block` expectation could pass without using
the fixture's restart state or the row's policy.

The restart capsule already seals a quiescent lease, one pending effect, its
receipt, a fencing token, a stop sequence, and a continuity identity. The frozen
`fanout-checkpoints` row has `atomic-replace` mutability and a `PIN` policy.

### Constraints

- The expected resume outcome remains an independently authored literal.
- Reducer execution contexts continue to omit `expected` physically.
- Frozen compatibility, parity, sealing, and in-flight classification sources remain byte-identical.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Build classifier evidence from the verified fixture restart metadata and compare the resulting frozen-policy disposition with the authored literal.

**How it works**: The adapter binds lease state, pending work, receipts,
continuity, fencing epoch, rollback evidence, and the real census mutability into
a pin proof. The frozen classifier returns `pin-legacy` for the receipt-backed
restart. Removing receipt coverage returns `block`, and a deliberately mismatched
authored literal throws `MIXED_VERSION_RESUME_DIVERGENCE`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Verified restart evidence** | Exercises the real row policy and remains falsifiable | Requires a narrow evidence adapter | 10/10 |
| Empty evidence fallback | Fail-closed for missing input | Proves no fixture semantics and makes all rows look identical | 1/10 |
| Derive the authored outcome from classifier output | Always stays synchronized | Destroys the independent oracle invariant | 0/10 |

**Why this one**: It preserves independent authorship while making the comparison depend on the sealed restart facts that the fixture claims to test.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- The interrupted resume arm can fail when restart evidence or the authored literal changes.
- The corpus distinguishes a real `PIN` policy result from a missing-evidence `BLOCK` fallback.

**What it costs**:

- The fixture owns a narrow mapping from sealed restart metadata to classifier evidence. Mitigation: the frozen classifier remains the only disposition authority, and receipt removal is covered as a falsifier.

**Digest guarantee boundary**:

`AUTHORED_CASE_DIGESTS` is computed from `AUTHORED_CASES` at module load and then
checked before compilation. It detects runtime or pipeline mutation of a loaded
case: every covered per-field mutation is rejected with `FIXTURE_REBASELINE`.
It does not provide a cross-session cryptographic pin against a bad-faith source
edit that changes the authored outcome literal before the module computes its
digest map. Source review, versioned fixture identities, and repository history
own that threat; the runtime digest does not claim to.

**Upstream observation**:

The frozen compatibility substrate validates event-side losslessness when a
record is read, while the state upcaster registry validates losslessness during
construction. The corpus always reads event records through the real boundary,
so its cases have no coverage gap. Harmonizing construction-time behavior belongs
to a future compatibility-substrate change and is outside this leaf.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Evidence mapping drifts from restart metadata | H | Seal metadata, type the shape, and keep receipt-removal and authored-divergence falsifiers |
| Runtime digest is mistaken for source authenticity | M | State the cross-session boundary explicitly and require source review for literal edits |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The old test passed through `MISSING_EVIDENCE` for every row policy |
| 2 | **Beyond Local Maxima?** | PASS | Empty evidence and derived expectations were rejected as non-falsifiable |
| 3 | **Sufficient?** | PASS | One scoped evidence adapter closes the hole without changing frozen code |
| 4 | **Fits Goal?** | PASS | Trustworthy fixture evidence is the corpus's primary value |
| 5 | **Open Horizons?** | PASS | The boundary remains reusable without granting cutover authority |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `reducer-resume-oracle.ts` builds evidence from verified restart metadata and asserts the authored comparison.
- `fixture-corpus.ts` changes the authored interrupted disposition from `block` to `pin-legacy`.
- `mixed-version-fixtures.vitest.ts` proves the real disposition, the missing-receipt fallback, and the divergence error.

**How to roll back**: Revert the scoped fixture, test, and leaf-document changes together. Do not restore the empty-evidence call independently because that recreates a vacuous green test.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
