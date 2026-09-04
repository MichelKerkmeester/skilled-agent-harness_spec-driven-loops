---
title: "Decision Record: Phase 4: gated-enable"
description: "Why the override is the switch, where the Gate B target comes from, and what makes the enable revert."
trigger_phrases:
  - "weight decision"
  - "gate b target derivation"
  - "revert rule"
  - "override versus default"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/004-gated-enable"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the enable and revert decisions"
    next_safe_action: "Apply the researched weight and measure"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-004-gated-enable"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 4: gated-enable

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The environment override is the switch

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-09-03 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The lane weight is a scoring parameter, and every routing decision reads it. The accuracy ratchet
holds six metrics against a committed baseline and would normally authorize a change like this,
but its baseline is captured with the test flag set, which makes the lane substitute deterministic
vectors for real ones. A change whose usual gate cannot see it needs a cheap way back.

### Constraints

- The lane registry already reads a per-lane weight override from the environment, merges it over the defaults, and clamps each value between zero and one.
- An unparseable override falls back to the defaults without raising anything, so a run that does not read the resolved weights back can measure nothing and report success.
- The override is process-scoped, so the daemon has to be restarted for it to take effect.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Apply the weight through the existing environment override, and move the committed default only after the override has held through a full gate run.

**How it works**: The daemon starts with the override set, the resolved weights are read back from
the status surface, and only then is anything measured. The revert is unsetting the variable and
restarting.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Use the existing override** | Reverts in one command, per lane, already clamped and tested | The running weight and the committed weight can disagree | 9/10 |
| Change the committed default directly | One source of truth at all times | A bad result costs a code change and a rebuild, on a change the gate cannot see | 3/10 |
| Add a dedicated feature flag | Explicit, and named for this purpose | A second switch over the same value, and one more thing to get wrong | 4/10 |

**Why this one**: The cheapest revert wins when the authorizing gate is blind to the variable.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A bad result costs a restart rather than a release.
- The weight can be moved and measured several times in one session.

**What it costs**:
- The running configuration can differ from the committed one. Mitigation: every measurement reads the resolved weights back first, and the read-back is an acceptance criterion.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A typo leaves the old weight and the run reports no change | M | The read-back catches it, and a malformed override is a named test case |
| The override is forgotten and the default never moves | M | Phase 005 reconciles the running weight against the committed one before closeout |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The change touches every routing decision and its usual gate runs on fixture vectors |
| 2 | **Beyond Local Maxima?** | PASS | Two alternatives were priced and rejected on stated cost |
| 3 | **Sufficient?** | PASS | The mechanism already exists, is per lane, and is clamped |
| 4 | **Fits Goal?** | PASS | The packet's whole point is a reversible enable |
| 5 | **Open Horizons?** | PASS | Moving the default later stays available and is sequenced rather than blocked |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The daemon environment carries the weight override for the measured run.
- The committed default in the lane registry moves in a second, separate step.

**How to roll back**: Unset the override, restart the daemon, read the resolved weights back to
confirm the defaults returned, and re-run the accuracy ratchet.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Gate B targets 30 of 172, and reverts below 20

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-09-03 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-002-context -->
### Context

A target set by feel is not a target. The predecessor measurement gives every number the
derivation needs: 180 corpus rows, 172 of them advisor-routable once the command-bridge modes
leave the denominator, 8 reaching the right mode first, 20 appearing anywhere in the returned
list, and 109 returning either nothing at all or floor noise with no target.

### Constraints

- The lane cannot fix a wrong-hub miss where a competing hub wins on real signal. That is 40 rows.
- It cannot fix the 12 rows shadowed by a legacy duplicate entry, which another packet owns.
- It has no effect on the 8 command-bridge rows, which are never scored.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: The enable must reach 30 of 172, and it reverts below 20 of 172.

**How it works**: The revert line is today's loose count. Twenty rows already surface the right
hub somewhere in the list, so a lane that cannot promote them to the top bought nothing. The
target adds roughly a fifth of the 109 silent rows to the 8 already held, which claims only that
semantic matching starts returning something for prompts that currently return nothing.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **30 of 172, revert below 20** | Derived from the miss table, and claims nothing about misses the lane cannot fix | Still a judgement about what share of silent rows recover | 8/10 |
| A percentage target such as fifty percent | Ambitious and easy to state | Requires fixing wrong-hub and legacy-duplicate misses, which this packet does not own | 3/10 |
| No target, report whatever happens | Honest about uncertainty | Gives the phase no way to fail, which makes the gate decorative | 2/10 |

**Why this one**: A target that can fail is the point, and this one fails on the rows the lane is
actually responsible for.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The enable has a number that decides it rather than a reading of the result.
- The revert line is defensible, because it is the count the system already achieves loosely.

**What it costs**:
- A genuine improvement that lands at 25 would revert under this rule. Mitigation: a result between 20 and 30 is recorded as a partial and re-argued rather than silently accepted or silently discarded.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The target is met while the controls lose prompts | H | The controls and the abstain counts are separate revert triggers |
| The corpus is edited so the target lands | H | The corpus is pinned by hash in phase 001 and re-derived after the run |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a number the phase cannot fail, and a gate that cannot fail is not a gate |
| 2 | **Beyond Local Maxima?** | PASS | A percentage target and no target were both priced |
| 3 | **Sufficient?** | PASS | Two numbers, both derived from the committed miss table |
| 4 | **Fits Goal?** | PASS | Gate B is the measurement the packet exists to move |
| 5 | **Open Horizons?** | PASS | A later packet raising the ceiling is expected, and this target does not block it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `research/enable-measurement.md` records the count against 172 with the raw replies kept.
- The acceptance criteria carry the target and the revert line as separate rows.

**How to roll back**: The target is a document, so a change to it is an amendment recorded here
rather than a code revert.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---
