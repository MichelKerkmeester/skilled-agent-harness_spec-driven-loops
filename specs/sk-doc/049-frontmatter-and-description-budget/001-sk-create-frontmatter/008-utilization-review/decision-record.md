---
title: "Decision Record: Utilization Review"
description: "Why the canary source hashes were left stale rather than re-pinned over a concurrent session's uncommitted bytes."
trigger_phrases:
  - "canary re-pin decision"
  - "compiled routing waiver"
  - "concurrent edit blocker"
  - "adr utilization review"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/008-utilization-review"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "Recorded the canary re-pin waiver"
    next_safe_action: "Re-pin once the sibling packet edit lands"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-049-008-followup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Utilization Review

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Wait for the concurrent edit before re-pinning the canary

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-03 |
| **Deciders** | Implementation session for this phase |

---

<!-- ANCHOR:adr-001-context -->
### Context

Correcting the inflation claim in `sk-create-frontmatter/SKILL.md` changed one of the eighteen source
hashes the sk-doc canary pins in `AUTHORED_DIGESTS`, so the canary went red on that entry. It was red on
a second entry too. `sk-create-with-human-voice/SKILL.md` was modified in the working tree by a
concurrent session and still matched its pin at `HEAD`, which means the canary was already red before
this work began.

`AUTHORED_DIGESTS` is refreshed as a set, and `harness/build-artifacts.cjs` reads every source file from
disk. There is no way to re-pin one entry while leaving the other at its committed value.

### Constraints

- The other packet's bytes were uncommitted work owned by a different session, and Law 2 puts them out of scope.
- The pinned digests are a drift tripwire. A hash captured from a file that is later reverted leaves the canary red for a reason nobody can trace.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: not to re-pin while the sibling file was uncommitted, and to re-pin both entries together
once it landed.

**How it works**: the activation manifests were re-minted first, both runtime and authored, so the guard
read fresh and sk-doc kept serving compiled routing while the canary was still red. The concurrent
session then committed its change during this session. With both files' bytes settled,
`build-artifacts.cjs` regenerated the compiled artifacts and the two `AUTHORED_DIGESTS` entries were
updated in one pass. The canary returns `REAL-GREEN` at exit 0.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Wait, then re-pin both together** | One pass, and every pinned byte is committed | Depends on the other session landing, which it did | 9/10 |
| Re-pin immediately | The canary goes green in one command | Freezes another session's uncommitted bytes into a tripwire this packet does not own | 3/10 |
| Leave both stale and report it | Nothing outside this packet enters the diff | Ships a red canary and leaves the next reader to work out which half is theirs | 5/10 |

**Why this one**: it is the only option where every pinned hash names a committed file, and it cost
nothing but ordering.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The canary is green on an unchanged working tree, for the first time since the sibling packet drifted.
- Both stale entries were closed in one pass rather than two.

**What it costs**:
- The re-pin captures a second packet's bytes. Mitigation: those bytes are committed at `HEAD`, so the pin attests a real state rather than a session-local one.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The sibling commit is later reverted | L | One `build-artifacts.cjs` run re-pins whatever the tree then holds |
| A future hub edit leaves the pins stale again | M | The constant carries a comment saying a deliberate hub change refreshes it in the same commit |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The canary was red and the edit that made it red is this packet's |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed, two rejected on what they would overwrite or leave behind |
| 3 | **Sufficient?** | PASS | Two constant values and one regeneration, no new machinery |
| 4 | **Fits Goal?** | PASS | The directive requires the hub edit to carry its refresh sequence |
| 5 | **Open Horizons?** | PASS | The next hub edit follows the same one-pass recipe |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: the two drifted values in `AUTHORED_DIGESTS` in
`009-parent-hub-rollout/007-sk-doc/harness/validate-canary.cjs`, and the six compiled and activation
artifacts `build-artifacts.cjs` regenerates beside it.

**How to roll back**: `git checkout -- specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/007-sk-doc/`
restores every one of them, since all seven files are tracked.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
