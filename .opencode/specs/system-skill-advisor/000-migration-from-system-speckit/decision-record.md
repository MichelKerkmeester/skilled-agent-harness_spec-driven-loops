---
title: "Decision Record: Migration From system-speckit"
description: "ADRs for the skill-advisor spec extraction: chronological numbering source, shared-infra left-in-place policy, and registry-fallout renumbering."
trigger_phrases:
  - "decision record"
  - "skill-advisor migration adr"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/000-migration-from-system-speckit"
    last_updated_at: "2026-07-07T11:01:53Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored decision-record.md alongside spec.md, plan.md, tasks.md, checklist.md"
    next_safe_action: "Dispatch the /deep:review 20-iteration loop"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-07-07-skill-advisor-extraction"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Migration From system-speckit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Chronological numbering derived from git log --follow, not current folder numbers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-07 |
| **Deciders** | User, Claude Sonnet 5 |

---

<!-- ANCHOR:adr-001-context -->
### Context

The destination track's existing packet (`system-skill-advisor/001-skill-advisor-tuning/`) is correctly and consistently numbered `001` in every metadata surface, but it was created 2026-07-06, the newest work in the whole subsystem's history. The 026 hub predates it by roughly two and a half months (first touched 2026-04-21). Keeping it at `001` while the older 026/027/028 content lands alongside it would put the newest work first and the oldest work last, backwards from what "perfect historical context" requires.

### Constraints

- No dedicated tooling exists to compute true folder-creation dates. `git log --diff-filter=A` alone is unreliable, it reports the date of whatever commit last touched the path, including unrelated bulk-rename commits, not the original authorship date.
- Generic filenames like `spec.md` produce occasional false-positive rename traces. One file in this investigation traced back to the repo's initial commit via a coincidental content match.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: derive true chronological order via `git log --follow` on a representative file per hub, usually `spec.md`, reading the earliest commit in the trace, cross-checked against the commit message for plausibility. A "land workspace snapshot" or "batch-sync parallel tracks" commit is a rename event, not a creation date.

**How it works**: for each of the 5 waves (026 hub ~April 2026, 026 embedder-stack cluster ~May 2026, 027 CLI arc ~June 2026, 027/028 hubs ~mid-to-late June 2026, the existing destination packet ~July 2026), the earliest plausible commit sets its position in the final `001`-`012` sequence.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen: git log --follow archaeology** | Evidence-based, catches the "newest packet currently sits at 001" inversion | Occasional false-positive rename traces need a sanity check against commit messages | 8/10 |
| Keep current folder numbers as-is | Zero research cost | Numbering would be arbitrary, defeats "perfect historical context" | 2/10 |
| Number by destination-track arrival order (import order) | Simple, mechanical | Same inversion problem as current numbers, doesn't reflect subsystem history | 3/10 |

**Why this one**: the user explicitly asked for numbering that gives "perfect historical context." That is only possible with real dates, and generic-filename rename-trace noise is a known, checkable failure mode, cross-referencing commit messages catches it.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A reader opening `system-skill-advisor/` sees the subsystem's real history in order, not an arbitrary import order.
- The newest packet correctly lands at `012` instead of misleadingly claiming `001`, the lowest number in the track.

**What it costs**:
- Extra research time (3 parallel Explore agents plus direct `git log --follow` archaeology) before any file was moved. Mitigation: this cost is already paid, it is sunk, not ongoing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A rename-trace false positive slips through undetected | Low | Cross-check every trace against its commit message before trusting the date |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The destination track's newest packet occupies the lowest number in the track, this must renumber regardless of the rest of the migration |
| 2 | **Beyond Local Maxima?** | PASS | Considered import order and keeping current numbers, both rejected as arbitrary |
| 3 | **Sufficient?** | PASS | git log --follow with commit-message cross-check is the simplest approach that actually produces evidence-based dates |
| 4 | **Fits Goal?** | PASS | Directly serves the user's stated goal of "perfect historical context" |
| 5 | **Open Horizons?** | PASS | The resulting 001-012 sequence has room to append future skill-advisor work at 013+ without renumbering again |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `system-skill-advisor/001-skill-advisor-tuning/` renamed to `012-skill-advisor-tuning/`, with every internal metadata and frontmatter reference corrected from `001` to `012`.
- The 026/027/028 hubs land at `system-skill-advisor/001` through `011` in the order derived above.

**How to roll back**: each batch is an independently committed `git mv` plus metadata regen. `git revert` the single commit for the affected batch restores the pre-move state for that batch only.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Genuinely shared or joint infra stays in place, not moved

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-07 |
| **Deciders** | User, Claude Sonnet 5 |

---

### Context

The user asked to move "all system-skill-advisor related specs." A literal reading would move every folder that mentions skill-advisor, including folders whose actual deliverable is shared between skill-advisor and code-graph, a BFS helper, a daemon bridge, one joint research packet with 4 of 5 children being code-graph-only.

### Constraints

- Moving a shared-ownership folder into a subsystem-specific track misrepresents which subsystem actually owns it.
- Fragmenting a coherent joint-research packet to extract one shared child loses more context, the packet's own narrative, than it preserves.

### Decision

**We chose**: leave 6 items in place, the shared BFS helper, the shared daemon bridge, the joint code-graph-resilience-and-advisor packet, the 4 pure-code-graph siblings under the split 027 hub, one content-unconfirmed ambiguous scaffold, and 2 non-spec-folder finding-tracking artifacts. Document each with a rationale in a new `context-index.md` inside `system-skill-advisor/`, so the historical-context goal is served by reference rather than relocation.

**How it works**: `context-index.md` lists each left-in-place path with a one-line reason and a link back to its actual location, readable alongside the moved 001-012 sequence.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen: leave shared/joint items in place, reference-link them** | Preserves accurate ownership, preserves joint-packet coherence | Deviates from a literal "move everything" reading | 9/10 |
| Move everything literally, including shared items | Satisfies the literal instruction | Misrepresents ownership, fragments the joint research packet | 3/10 |
| Duplicate shared items into both tracks | Nothing left behind | Duplication drifts over time, no clear source of truth | 2/10 |

**Why this one**: a handful of small, low-stakes, reversible items curated out is a better trade than corrupting ownership signals across the whole track. Flagged explicitly rather than silently decided.

---

## ADR-003: Registry fallout renumbered contiguous, even for long sibling lists

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-07 |
| **Deciders** | User, Claude Sonnet 5 |

---

### Context

Every parent folder that loses a child to this migration needs its `children_ids` updated. The user's explicit precedent, the prior 028 renumber session, closed every gap, including at the top level. One case here, `027/000-release-cleanup/009-skill-frontmatter-alignment/`, has 20+ siblings, so a full contiguous renumber after removing one child produces a larger diff than a typical case.

### Constraints

- The user's stated preference is "perfect historical context," which reads as valuing consistency over minimizing diff size.
- 028's own top-level renumber precedent (`003→002, 004→003, 005→004, 006→005`) already establishes contiguous renumbering as the norm in this exact packet.

### Decision

**We chose**: renumber every affected parent's remaining siblings contiguous, including the 20+-item list, rather than leaving a gap to save diff size.

**How it works**: after removing a child, every sibling numbered higher than the removed slot shifts down by the count of removed slots before it.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Chosen: always renumber contiguous** | Matches established precedent and the user's stated preference | Larger diff for the 20+-item list | 8/10 |
| Leave gaps for lists over some size threshold | Smaller diff | Inconsistent policy, contradicts precedent and the "perfect" framing | 4/10 |

**Why this one**: consistency with the established 028 precedent outweighs the extra diff size for one long list.
