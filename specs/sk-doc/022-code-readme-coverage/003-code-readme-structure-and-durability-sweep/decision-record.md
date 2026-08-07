# Decision Record: Code README Structure And Durability Sweep

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> All ADRs are **Proposed**. This phase's scope-shaping rulings live in `001/decision-record.md` (ADR-001 tree equivalence, ADR-002 format-rule scope); the three below are this phase's own execution decisions. A fourth ADR may be needed if the operator's tree ruling requires per-lane exceptions — record it here rather than in a task note.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Truth Defects Escalate, They Do Not Get Fixed Here

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Phase implementer |

---

<!-- ANCHOR:adr-001-context -->
### Context

This phase reformats roughly 85 files. While reformatting, an author will notice false claims — that is what happened during the research loop that produced the findings. If those get corrected inline, the phase stops being a reviewable structural pass: a reviewer can no longer tell a formatting change from a semantic one, and the sibling truth phase loses its evidence trail.

### Constraints

- `002` owns factual repair and carries the per-file evidence discipline for it.
- A reviewer must be able to read a lane's diff as pure structure.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: when a lane uncovers a false claim, continue the file's structural work and file the factual defect as a new row in `002`'s checklist with its source evidence. Never repair it in this phase.

**How it works**: each lane carries an escalation list; Phase 7 hands it to `002` in one batch.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Escalate to `002` (chosen) | Diffs stay readable; evidence discipline preserved | A known-false claim survives a little longer |
| Fix inline | Fewer round trips | Mixes semantics into a formatting diff; bypasses `002`'s per-file evidence rule |
| Block the lane on the defect | Nothing false ships | Serializes 85 files behind unrelated single-file investigations |

**Why this one**: it keeps the structural pass reviewable without dropping the finding.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**: a lane's diff is verifiable by reading it.

**What it costs**: `002` may need a second pass after this phase. Mitigation: batch the escalations into one handoff.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The escalation list is never actioned | M | Phase 7 completion depends on the handoff being recorded in `002`'s checklist |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The research loop proves reviewers find truth defects while reading structure |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | One rule covers the whole class |
| 4 | **Fits Goal?** | PASS | Preserves the reviewability the phase depends on |
| 5 | **Open Horizons?** | PASS | Keeps the two phases' responsibilities separable |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: process only. Each lane carries an escalation list; `002`'s checklist gains rows.

**How to roll back**: not applicable — no artifact to revert.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Lane Order D → C → A → B

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Phase implementer |

---

<!-- ANCHOR:adr-002-context -->
### Context

Four lanes of 14, 19, 26 and 29 findings. The gates they run on are new: `001`'s validator mode has never been applied at scale, and the durability pattern is freshly tuned. Applying an untested gate to the largest lane first means discovering the gate's problems across 29 files.

Lane B is also the most entangled: adjacent to WS1 `032`'s tree, adjacent to `019`'s, and containing one file that `002` repairs.

### Constraints

- Gate mechanics must be proven before scale-out.
- Lane B's entanglements resolve only after `002` lands.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: run D (14) first to validate the gates, then C (19), then A (26), then B (29) last.

**How it works**: each lane's four gates must be green before the next lane's task expansion begins.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Smallest-first D → C → A → B (chosen) | Gate problems surface cheaply; B's entanglements resolve last | Slowest to touch the biggest surface |
| Largest-first | Bulk value early | Discovers gate defects across 29 files |
| All lanes in parallel | Fastest | Unreviewable; a gate defect contaminates everything at once |

**Why this one**: the gates are the untested component, not the edits.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**: a gate defect costs 14 files, not 29.

**What it costs**: serialization. Mitigation: within a lane, per-file edits are independent.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Lane B never runs because earlier lanes consume the budget | M | Q6 disposition authorizes lanes explicitly up front |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Gates are new and untested at scale |
| 2 | **Beyond Local Maxima?** | PASS | Three orderings weighed |
| 3 | **Sufficient?** | PASS | No further sequencing rule needed |
| 4 | **Fits Goal?** | PASS | Protects the phase's reviewability |
| 5 | **Open Horizons?** | PASS | Lanes stay independently revertible |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**: execution order and commit structure — one commit range per lane.

**How to roll back**: revert a lane's commit range; other lanes are unaffected.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The Durability Gate Ships Regardless Of How Many Lanes Run

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed — **[OPERATOR-DECISION: Q6 — is the sweep worth doing?]** |
| **Date** | 2026-07-30 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-003-context -->
### Context

Every finding in this phase is P2 and none makes a reader act wrongly. Eighteen of them are the durability class — packet IDs, commit hashes, migration narration and mutable spec paths inside durable READMEs. That class is different from the others in one way that matters: it is guaranteed to grow, because those paths move and new READMEs keep acquiring them. The structural classes are static consistency defects.

### Constraints

- Repainting 85 files for consistency is a real cost with no reader-visible benefit.
- A CI grep gate costs one job and prevents the growing class.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: to be recorded at disposition time.

**Research recommendation**: ship the durability grep gate unconditionally; authorize lanes A and B based on the published survivor count. If survivors stay near 88, the gate alone is the better trade.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Gate always, lanes conditional (recommended) | Stops the growing class at minimal cost; defers the discretionary repaint | Leaves known P2 inconsistencies in place |
| Run all four lanes unconditionally | Full conformance | 85 files repainted for consistency alone |
| Skip the phase entirely | Zero cost | The durability class keeps growing |

**Why**: to be recorded with the disposition.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**: the one class that grows is mechanically stopped.

**What it costs**: if lanes are deferred, the existing durability violations must be fixed before the gate can pass on the full tree. Mitigation: scope the CI gate to the lanes that have been swept, and widen it as lanes land.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A gate scoped to swept lanes never widens | M | Record the widening condition alongside the gate definition |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | Pending | 18 durability findings and a class that grows |
| 2 | **Beyond Local Maxima?** | Pending | Three options weighed |
| 3 | **Sufficient?** | Pending | The gate alone addresses the growing class |
| 4 | **Fits Goal?** | Pending | Delivers the phase's durable value at minimum cost |
| 5 | **Open Horizons?** | Pending | Lanes remain available later |

**Checks Summary**: pending the disposition
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**: a CI job carrying the durability pattern, scoped to the swept lanes.

**How to roll back**: remove the CI job; no file state depends on it.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
