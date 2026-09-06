---
title: "Decision Record: Path Containment Follow-Ups"
description: "Why the symlinked-track criterion could not be met as written: the repair walk never yields such a path, so the constraint the strict check was feared to break does not exist on this surface."
trigger_phrases:
  - "symlinked track out of scope"
  - "repair walk skips symlinks"
  - "entry.isDirectory false for symlink"
  - "criterion superseded not fabricated"
  - "handle identity device and inode"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/013-repair-handle-containment"
    last_updated_at: "2026-08-30T16:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded why the symlinked-track criterion is vacuous for this walk"
    next_safe_action: "Close the packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-path-containment-followups"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Path Containment Follow-Ups

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The symlinked-track constraint does not apply to this walk

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-30 |
| **Deciders** | Operator, claude-code |

---

<!-- ANCHOR:adr-001-context -->
### Context

This packet carried a required criterion that a legitimate repair inside a track
symlinked into a sibling repository must still succeed. It was written because a stricter
variant of the neighbouring write guard was built and measured as worse for exactly that
reason, and repeating that mistake was the main risk here.

It does not apply. The repair walk classifies entries with `entry.isDirectory()`, which is
false for a symlink, so it never descends into a symlinked track and never produces a
candidate inside one. The constraint is vacuous on this surface: there is no legitimate
write for a strict check to refuse.

That behaviour predates this packet and is already recorded as a limitation of the
predecessor — the walk drops symlinks silently rather than reporting them.

### Constraints

- Changing the walk to follow symlinked tracks is a different change with a different blast radius, and nothing in this packet requires it.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Supersede the criterion rather than satisfy it with a fabricated case.

**How it works**: The identity check compares the opened handle against the device and
inode recorded when the scan classified the file. Because no candidate reaches it through a
symlink, the check refuses only objects the scan did not classify.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Supersede it, record why** | Honest; the criterion cannot be exercised | Leaves symlinked tracks unrepairable, as before | 8/10 |
| Build a fixture that looks like a track | Row turns green | Proves nothing — the walk would never produce that path | 1/10 |
| Make the walk follow symlinked tracks | Would make the criterion real | A separate change, unrelated to the write boundary, with its own risks | 4/10 |

**Why this one**: A criterion that cannot be exercised should be retired, not satisfied by
constructing an input the system never generates.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The packet closes on criteria that were actually exercised.

**What it costs**:
- Symlinked tracks remain outside the repair sweep. Mitigation: unchanged from before this packet, and recorded as a limitation rather than discovered later.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Someone later makes the walk follow tracks without revisiting the identity check | M | The check keys on scan-time identity, so it stays correct if the walk widens; this ADR names the dependency |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------------|----------|
| 1 | **Necessary?** | PASS | The criterion blocks closure and cannot be met as written |
| 2 | **Beyond Local Maxima?** | PASS | Fabricating a fixture and widening the walk were both considered |
| 3 | **Sufficient?** | PASS | A record; no code change is warranted |
| 4 | **Fits Goal?** | PASS | The packet's goal is the write boundary, not walk coverage |
| 5 | **Open Horizons?** | PASS | Widening the walk stays available and is named here |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**: One acceptance criterion moves to Superseded, naming this ADR.

**How to roll back**: Restore the criterion's prior status. No code is affected.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
