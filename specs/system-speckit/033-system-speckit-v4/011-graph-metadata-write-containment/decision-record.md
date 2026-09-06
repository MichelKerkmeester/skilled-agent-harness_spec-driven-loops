---
title: "Decision Record: Workspace Path Containment"
description: "What the graph-metadata write guard actually bounds, recorded after a fresh-model review reproduced the condition that defeats it and showed one of its two root sources decides nothing."
trigger_phrases:
  - "containment guard scope"
  - "opencode anchor bypass"
  - "root source subsumed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/011-graph-metadata-write-containment"
    last_updated_at: "2026-08-30T15:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded what the guard bounds after review reproduced its limits"
    next_safe_action: "Remove the subsumed root source under the follow-up packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/graph-metadata-write-containment.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-workspace-path-containment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Workspace Path Containment

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The guard bounds accidental destinations, not adversarial ones

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-30 |
| **Deciders** | Operator, claude-code |

---

<!-- ANCHOR:adr-001-context -->
### Context

This packet closed on the claim that a destination which merely looks spec-shaped is refused. A
fresh-context review reproduced the condition that defeats that claim: the guard's strength is
entirely that a directory named `.opencode` exists within twelve ancestors of the destination.

```
mkdir -p $T/specs/999-outside          -> refused
mkdir -p $T/.opencode                  -> the same write now succeeds
```

That is the suite's own "spec-shaped path outside the workspace" case, flipped by one `mkdir`.

The finding is not that the guard is worthless. It is that the packet's acceptance criteria stated
a stronger property than the code provides, and a reader would reasonably infer a security
boundary from it.

### Constraints

- Measuring membership on the canonicalized path was tried and refused every track that is a symlink into a sibling repository — three of four are not tracked in git, so no committed-link test separates them from an arbitrary one.
- Deriving roots only from the calling process was tried and refused every write from a workspace that was not the caller's, including writes into this repository from a hook launched elsewhere.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: State the guard's real scope and stop claiming more — it bounds a caller passing an
arbitrary destination, and it does not survive an attacker who can create a directory.

**How it works**: The code is unchanged by this record. The acceptance criterion that overstated
the property is superseded by this ADR, and the follow-up packet adds a suite case that asserts
the permissive outcome, so the limit is pinned by a test rather than described in prose.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Record the real scope, keep the code** | Honest, costs nothing, keeps every legitimate write working | The guard stays weak against an adversary | 8/10 |
| Canonicalize before the membership test | Closes the link-redirect case | Measured: refuses every symlinked sibling-repository track | 3/10 |
| Require the workspace to be git-tracked | Would separate a planted anchor from a real one | Measured: breaks three of the four tracks, which are untracked | 2/10 |
| Remove the guard entirely | No false sense of protection | Loses the case that was actually reachable — an arbitrary destination written without complaint | 4/10 |

**Why this one**: The two stricter variants were not theoretical; both were built and both refused
writes that were always legitimate. Anyone who can plant a directory in the repository can edit
this guard directly, so the stricter reading buys nothing it does not already have.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The packet's record matches the code, so the next reader does not build on a boundary that is not there.
- The condition that defeats the guard becomes a test case rather than a discovery.

**What it costs**:
- The guard remains defeatable by directory creation. Mitigation: it is documented as a typo-catcher, and filesystem permissions remain the actual boundary.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future reader treats the guard as a security control | M | The suite asserts the permissive outcome directly, so the limit is discoverable from the tests |
| The weak guard invites a stricter rewrite that breaks the tracks again | M | Both failed variants are recorded above with why they failed |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------------|----------|
| 1 | **Necessary?** | PASS | The shipped criterion asserted a property the code does not have |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives, two of them built and measured |
| 3 | **Sufficient?** | PASS | A record plus a test case; no code change is warranted |
| 4 | **Fits Goal?** | PASS | The packet's goal was proving membership; this states how far that proof reaches |
| 5 | **Open Horizons?** | PASS | Leaves a stricter guard available, with the two dead ends documented |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Acceptance criteria: the overstated row is superseded by this ADR.
- Implementation summary: the verification table names the condition under which the refusal holds.

**How to roll back**: Delete this file and restore the superseded row's prior status. No code is affected.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: One of the guard's two root sources decides nothing

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-30 |
| **Deciders** | Operator, claude-code |

---

<!-- ANCHOR:adr-002-context -->
### Context

The guard consults roots discovered from the calling process and roots derived from the
destination. Every path the first accepts, the second also accepts: walking up from a destination
inside a configured root reaches the same workspace anchor. Removing the first leaves the
containment suite at 8 of 8.

The second source was added to fix a real regression — the process-only version refused twenty-one
legitimate tests and would have refused any hook running outside the checkout. Keeping the first
alongside it was caution, not a measured requirement.

### Constraints

- The removal is a behaviour-preserving deletion, proven by the suite, not by argument.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Remove the process-derived source, under the follow-up packet rather than here.

**How it works**: The deletion is one expression. It ships separately from the repair-write fix in
the same follow-up packet, so a behaviour-preserving deletion is not mistaken for part of a
behaviour-changing fix.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Remove it in the follow-up packet** | Keeps the deletion reviewable on its own | Defers a known no-op briefly | 8/10 |
| Remove it here, reopening a closed packet | Immediate | Mixes a closed packet's history with new work | 4/10 |
| Keep both sources | No change | Claims a check that is not performed | 2/10 |

**Why this one**: A branch that changes no outcome is not defence in depth; it is a false claim
about how much is being checked. Removing it belongs with the other containment work.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The guard's code says what it does, with no branch implying a second check.

**What it costs**:
- A brief window where the record and the code disagree. Mitigation: the follow-up packet names the removal as a requirement.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The removal is read as weakening the guard | L | The suite result before and after is the evidence, recorded here |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------------|----------|
| 1 | **Necessary?** | PASS | The branch implies a check that does not happen |
| 2 | **Beyond Local Maxima?** | PASS | Keeping it and removing it here were both considered |
| 3 | **Sufficient?** | PASS | Deleting one expression is the whole change |
| 4 | **Fits Goal?** | PASS | The packet's subject is what the guard proves |
| 5 | **Open Horizons?** | PASS | Nothing is foreclosed; the source can return if a case ever needs it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Tracked as a requirement in the path-containment follow-up packet; no change in this packet.

**How to roll back**: Restore the removed root source; the suite passes either way, which is the point.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
