---
title: "Decision Record: Phase 2: embedding-population"
description: "Why the embedder stays as configured, why the run is local, and what happens to stored vectors when the backend is gone."
trigger_phrases:
  - "embedder decision"
  - "local embedding policy"
  - "coverage floor"
  - "outage behaviour"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/002-embedding-population"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the embedder and failure-policy decisions"
    next_safe_action: "Reproduce the skip, then run the refresh"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-002-embedding-population"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 2: embedding-population

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep the configured embedder and populate against it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-09-03 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The graph database already carries an active embedder pointer naming `nomic-embed-text-v1.5` at
dimension 768, served locally. Nine of fourteen nodes hold a vector written under that model, and
five hold nothing. The question is whether to fill the gap against the model that is already
there, or to pick a different one while the table is being touched anyway.

### Constraints

- Every stored vector is tied to the model that produced it. A different model invalidates all nine existing rows and forces a full re-embed.
- The read path refuses to mix models. A projection whose stored model set disagrees with the active pointer is marked stale and the lane returns nothing.
- The local backend already serves the configured model, so filling the gap needs no new dependency.
- Hub descriptions are repository content, which argues for keeping them on the machine.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Fill the coverage gap against the configured embedder, and treat any model change as a separate decision with its own re-embed.

**How it works**: The refresh resolves the active pointer, embeds each node's `SKILL.md`
description through the local adapter, and upserts into the table named by the pointer dimension.
Nine rows skip on a matching content hash and five are written.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the configured embedder** | No re-embed of existing rows, no staleness risk, no new dependency | Inherits whatever quality the model has for this vocabulary | 9/10 |
| Switch to a stronger local model | Possibly better separation between hubs | Invalidates nine rows, changes the dimension, and mixes a model choice into a coverage fix | 4/10 |
| Switch to a hosted embedder | Consistent quality, no local backend needed | Sends repository content off the machine, and adds a credential the packet does not need | 2/10 |

**Why this one**: The measured problem is missing rows, not weak vectors. Changing the model
would answer a question nobody has asked yet and would void the comparison this packet depends on.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Coverage goes from nine of fourteen to fourteen of fourteen, including the two hubs Gate B scored at zero across 62 corpus rows.
- The lane can score every hub, so a later weight change acts on complete data.

**What it costs**:
- The vector quality question stays open. Mitigation: phase 003 asks it as a research question rather than settling it by preference.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The configured model separates hubs poorly | M | Phase 003 measures coverage against weight, so a weak model shows up as a flat result rather than as a mystery |
| A future pointer change silently invalidates every row | H | The staleness verdict already catches a model set that disagrees with the pointer, and phase 001 surfaces its reason |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Five hubs have no vector, and two of them own 62 corpus rows that score zero |
| 2 | **Beyond Local Maxima?** | PASS | Two alternatives were priced, and both were rejected on stated cost |
| 3 | **Sufficient?** | PASS | Filling the gap uses the path that already exists, with no new component |
| 4 | **Fits Goal?** | PASS | The packet cannot choose a weight against missing data |
| 5 | **Open Horizons?** | PASS | A model change stays available, and this decision does not foreclose it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The active vector table gains five rows, one per uncovered hub.
- The refresh path gains a coverage check that fails when a node is left without a row.

**How to roll back**: Stop the daemon, restore the database copy taken before the run, restart,
and confirm the row count and the active pointer match the pre-run record.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: A failed embed keeps the old vector

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-09-03 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-002-context -->
### Context

The refresh deletes a row when it cannot embed it, and stops after three consecutive failures,
counting the remaining nodes as failed. A backend that goes away mid-run can therefore empty
rows that were fine a minute earlier, and the lane loses hubs it had.

### Constraints

- Vectors are derived data, so nothing is permanently lost. What is lost is routing quality until the next successful run.
- A stale vector still routes. An absent vector routes nothing.
- The run cannot tell a dead backend from a genuinely unembeddable node without trying.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: An embed failure leaves the stored vector in place and reports the failure. Only an explicitly empty description removes a row.

**How it works**: The failure path stops deleting and instead records the failure count and the
reason. The outage streak still stops the run early, so a dead backend costs one deadline rather
than fourteen.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the old vector on failure** | Routing survives an outage, and a stale vector is better than none | A wrong vector can persist after a description changes | 8/10 |
| Delete on failure, as today | The table never holds a vector whose source changed | An outage silently degrades routing for every hub it touched | 3/10 |

**Why this one**: A stale vector is a small error. A missing vector is the exact failure this
packet exists to fix, and reintroducing it through an outage would be self-defeating.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Coverage stops depending on the backend being up at refresh time.
- An outage becomes a reported condition rather than a silent regression.

**What it costs**:
- A vector can outlive the description it was built from. Mitigation: the content hash records the mismatch, so a later run re-embeds and the drift is visible.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A stale vector routes against an old description | L | The hash comparison already detects it, and the next successful run corrects it |
| Failures become invisible because nothing is deleted | M | The result object reports failure counts, and the coverage check is on the row count rather than on freshness |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The delete path is one of the candidate mechanisms for the five missing rows |
| 2 | **Beyond Local Maxima?** | PASS | Keeping the current behaviour was priced and rejected |
| 3 | **Sufficient?** | PASS | One branch changes, and the outage streak stays as it is |
| 4 | **Fits Goal?** | PASS | Coverage that an outage can undo is not coverage |
| 5 | **Open Horizons?** | PASS | A freshness policy can still be added later on top of the hash |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- The per-row failure branch stops deleting the stored vector.
- A test covers a stopped backend and asserts the row count is unchanged.

**How to roll back**: Restore the deleting branch and rerun the round-trip suite, which should
then fail the outage case by design.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---
