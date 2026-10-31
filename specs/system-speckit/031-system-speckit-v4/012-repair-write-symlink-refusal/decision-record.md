---
title: "Decision Record: Repair Write Symlink Refusal"
description: "The refusal covers the final path component only. A review reproduced a directory swap writing through it and destroying a file outside the scanned tree; this records what the packet actually closed and what it did not."
trigger_phrases:
  - "symlink refusal scope"
  - "directory swap write through"
  - "o_nofollow final component"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/012-repair-write-symlink-refusal"
    last_updated_at: "2026-08-30T15:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the vector the refusal does not cover, reproduced against the shipped code"
    next_safe_action: "Close the directory-swap vector under the path-containment follow-up packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs"
      - ".opencode/skills/system-spec-kit/scripts/tests/repair-write-symlink-refusal.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-repair-write-symlink-refusal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Repair Write Symlink Refusal

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The refusal covers the file, not the path to it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-30 |
| **Deciders** | Operator, claude-code |

---

<!-- ANCHOR:adr-001-context -->
### Context

This packet closed on a suite reporting 5 of 5 against the shipped function, with a negative
control. All five cases replace the destination *file* with a symlink. `O_NOFOLLOW` refuses a
symlink at the final path component and follows every parent directory, so none of the five
touches the reachable half of the same defect.

Reproduced against the shipped code:

```
ln -s $T/evil $T/real/pkt
writeExistingFileNoFollow("$T/real/pkt/graph-metadata.json", "REPAIRED")  -> WROTE
cat $T/evil/graph-metadata.json                                           -> REPAIRED
```

A file outside the scanned tree is overwritten and its previous content is gone. The suite result
is accurate and the conclusion drawn from it was not: 5 of 5 measured one component of a path.

This is the same shape the packet was opened to fix — a property established by inspecting
something, then acted on through a handle that can point elsewhere by the time it is used. The fix
moved the check one level closer to the write and stopped one level short.

### Constraints

- Legitimate repair targets include tracks that are symlinks into sibling repositories, so any stricter rule has to keep those writable — a stricter variant in the neighbouring guard was built and refused exactly those.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Record the vector as open, keep the partial protection, and close it in the
follow-up packet by proving handle identity rather than path shape.

**How it works**: After opening, the handle's device and inode are compared against what the scan
observed for that candidate; a mismatch means the object being written is not the object that was
classified, and the write is refused. No change lands in this packet.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Record here, fix in the follow-up packet** | Keeps the fix with its sibling containment work and its own controls | The vector stays open in the interim | 8/10 |
| Reopen this packet and fix it here | Closes it sooner | Reopens a closed packet, and the fix belongs with the related containment work | 5/10 |
| Open every parent with `O_DIRECTORY \| O_NOFOLLOW` in sequence | Closes it without new state | Rewrites the walk, and refuses the symlinked tracks that must stay writable | 3/10 |
| Leave it undocumented until someone fixes it | No work now | The packet's record would keep asserting a protection it does not provide | 1/10 |

**Why this one**: The interim exposure is a repair script run by this repository's own tooling, not
an untrusted input path. The cost of getting the fix wrong — refusing legitimate repair across the
symlinked tracks — is what the follow-up packet's criteria are built to catch.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The packet stops asserting a protection it does not provide.
- The follow-up packet inherits a reproduction, not a suspicion.

**What it costs**:
- A repair run can still destroy a file outside the tree if a scanned directory is replaced mid-run. Mitigation: the window is between scan and write within a single run, and the fix is scheduled rather than hypothetical.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The interim window is exploited or hit by accident | M | Named in the follow-up packet as its P0 requirement, with the reproduction attached |
| The fix refuses legitimate writes in symlinked tracks | H | A required acceptance criterion exercises a real track, not a fixture |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------------|----------|
| 1 | **Necessary?** | PASS | The summary claimed a refusal that a reproduction walks through |
| 2 | **Beyond Local Maxima?** | PASS | Four options, including fixing it here and rewriting the walk |
| 3 | **Sufficient?** | PASS | A record plus a scheduled requirement; no half-fix landed here |
| 4 | **Fits Goal?** | PASS | The packet's subject is exactly this write boundary |
| 5 | **Open Horizons?** | PASS | The handle-identity approach generalizes to the sibling findings |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Implementation summary: the verification table names what the suite measured, and the open vector is listed as a limitation rather than absent.
- The fix itself is a requirement of the path-containment follow-up packet.

**How to roll back**: Delete this file. No code is affected by this record.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
