---
title: "Decision Record: Consolidate the seven dot-state directories under .opencode/skills into a single .state subfolder"
description: "Decision record template for documenting architectural choices, alternatives, consequences, and implementation notes."
trigger_phrases:
  - "decision"
  - "record"
  - "name"
  - "template"
  - "decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/005-skills-runtime-state-consolidation"
    last_updated_at: "2026-08-28T09:06:37Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored four ADRs"
    next_safe_action: "Commit the packet and the relocation"
    blockers: []
    key_files:
      - ".gitignore"
      - ".opencode/skills/.state/"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "038-skills-state-consolidation"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether a standing guard check should fail the gate on any pre-.state path write"
    answered_questions:
      - "One .state parent rather than seven siblings"
      - "Discard existing state rather than migrate it"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Consolidate the seven dot-state directories under .opencode/skills into a single .state subfolder

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: One .state parent, not seven siblings

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-28 |
| **Deciders** | Operator, implementing agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

Seven runtime-state directories sat directly under `.opencode/skills/`, sharing a namespace with the skills themselves. A person listing that directory to find a skill saw seven entries that were not skills, with nothing to group them.

### Constraints

- The skills root is a browsing surface for end users, not only a runtime path.
- All seven are machine-local and owned by four different subsystems, so no single subsystem could absorb them.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a single `.state/` parent with one child per owning subsystem.

**How it works**: Each of the seven directories becomes `.opencode/skills/.state/<subsystem>/`. The skills root now lists skills plus one state entry. Nothing above the resolvers is aware of the extra segment.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One `.state/` parent** | Skills root lists skills; one obvious home; one ignore rule | Every reference moves one level deeper | 9/10 |
| Leave them in place | Zero work, zero risk | The problem is exactly that they are in place | 2/10 |
| Move outside the skills tree entirely | Cleanest separation of code from state | Breaks the workspace-relative resolution every subsystem relies on, for a larger blast radius | 4/10 |

**Why this one**: the complaint is about what the skills directory shows. Grouping fixes that at the smallest blast radius; relocating out of the tree would fix it at a much larger one.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- The skills root lists skills and one grouped state entry.
- Fifteen ignore rules collapse to two.
- A future relocation edits one parent, not seven siblings.

**What it costs**:

- Every reference moved one level deeper, which broke fifty-seven relative links in the relocated READMEs and one test fixture that hardcoded the depth. Both fixed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A missed reference silently recreates an old directory | H | Residual scan returned zero, and the old paths are left un-ignored so a recurrence appears as untracked |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The skills root is a user-facing listing and two thirds of its hidden entries were not skills |
| 2 | **Beyond Local Maxima?** | PASS | Leaving in place and moving out of the tree were both weighed |
| 3 | **Sufficient?** | PASS | Seven constants, one ignore block, no new mechanism |
| 4 | **Fits Goal?** | PASS | Directly answers the operator's request |
| 5 | **Open Horizons?** | PASS | A future move edits the parent only |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- Seven directories relocated; seven resolvers updated; three build outputs regenerated.

**How to roll back**: `git checkout -- .gitignore .opencode` and `rm -rf .opencode/skills/.state`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->


---

<!-- ANCHOR:adr-002 -->
## ADR-002: Discard existing state rather than migrate it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-28 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-002-context -->
### Context

Thirty untracked runtime files existed across the seven directories: an advisor daemon lease, goal state, sentinel dedup history, spec-gate session records and telemetry. A relocation could move them or let them regenerate.

### Constraints

- All of it is machine-local and derived; none of it is shared or authoritative.
- Some of it was open by a running process at the time of the change.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: discard the untracked runtime files and let each subsystem regenerate its own.

**How it works**: The seven tracked READMEs move as renames, preserving history. The thirty untracked files are deleted with the old directories. Each subsystem recreates what it needs on next use, which the advisor demonstrated immediately.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Discard and regenerate** | No migration code; no risk of moving a file a process holds open | Loses dedup and session history | 8/10 |
| Move the data with the directories | Preserves history | Migration code for disposable data, and moving a file an active daemon holds open | 5/10 |
| Compatibility window reading both paths | Safest against a missed reference | Dual-path code someone must later remove; the exact mess the consolidation is meant to end | 4/10 |

**Why this one**: the operator chose it, and the data supports it: every file is derived, and the only durable content in those directories was the seven READMEs, which moved.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- No migration code to write, test or later delete.
- No risk of relocating a file held open by a running process.

**What it costs**:

- Sentinel dedup history and open spec-gate session records are gone, so one duplicate advisory or one re-asked gate question is possible. Both are self-healing.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A subsystem assumes its state exists and fails on absence | M | Every one of the seven already creates its directory on demand; the fail-open tests cover the unwritable case |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The relocation forces a choice either way |
| 2 | **Beyond Local Maxima?** | PASS | Migration and a compatibility window were both weighed |
| 3 | **Sufficient?** | PASS | Deletion plus regeneration; no code |
| 4 | **Fits Goal?** | PASS | Operator-directed |
| 5 | **Open Horizons?** | PASS | Leaves no transitional code behind |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:

- Thirty untracked files removed with their directories; seven READMEs moved as renames.

**How to roll back**: Not applicable to the data, which was derived. The directory structure rolls back with the tracked files.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->


---

<!-- ANCHOR:adr-003 -->
## ADR-003: Match one level inside .state rather than excluding the tree

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-28 |
| **Deciders** | Implementing agent |

---

<!-- ANCHOR:adr-003-context -->
### Context

The obvious ignore rule for the new shape is `**/.state/**` with a negation re-including each README. It was written that way first, and it silently dropped all seven READMEs: `git add` staged nothing and reported nothing.

### Constraints

- Git cannot re-include a file whose parent directory is excluded. A negation under an excluded directory is inert.
- Runtime state must stay untracked; the seven READMEs must stay tracked.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: exclude one level inside each subsystem directory instead of excluding the tree.

**How it works**: `.opencode/skills/.state/*/*` excludes the contents of each subsystem directory while leaving the directories themselves included, so `!.opencode/skills/.state/*/README.md` can re-include the docs. Both directions are asserted with `git check-ignore`.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Match one level inside** | The negation works; both directions verified | Slightly less obvious than excluding the tree | 9/10 |
| `**/.state/**` plus negation | Reads as the obvious intent | Inert negation; drops the READMEs with no error at all | 0/10 |
| Force-add the READMEs | Works | Every future README needs `-f`, and the rule lies about what is tracked | 3/10 |

**Why this one**: the failure mode is silent. A rule that looks correct and quietly untracks documentation is worse than a slightly less obvious rule that is verified in both directions.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:

- Fifteen rules become two.
- The ignore behavior is asserted rather than assumed.

**What it costs**:

- The pattern needs the comment that explains why it is not the obvious one, or a future editor will simplify it back.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Someone simplifies the rule to `**/.state/**` | M | The comment states the constraint; the README would silently untrack, which the packet records as the symptom |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The first shape was written and observed to fail |
| 2 | **Beyond Local Maxima?** | PASS | Force-add was considered and rejected |
| 3 | **Sufficient?** | PASS | Two lines and a comment |
| 4 | **Fits Goal?** | PASS | Without it the consolidation loses its documentation |
| 5 | **Open Horizons?** | PASS | Extends to any future state child |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:

- `.gitignore` rule block replaced; both directions verified with `git check-ignore`.

**How to roll back**: Restore the previous fifteen-rule block from git history.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->


---

<!-- ANCHOR:adr-004 -->
## ADR-004: Derive the fixture's parent from the resolved path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-28 |
| **Deciders** | Implementing agent |

---

<!-- ANCHOR:adr-004-context -->
### Context

Two spec-gate fail-open tests write a plain file at the state-directory path to make it unwritable. They created the parent by hardcoding `join(root, '.opencode', 'skills')`. With the extra `.state` segment the parent no longer existed and both tests failed with ENOENT.

### Constraints

- The tests must keep proving that an unwritable state directory never blocks a turn.
- The fixture should not encode how deep the state directory sits.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: create `dirname(stateDir)` from the resolver's own answer.

**How it works**: Each fixture calls `resolveGuardPaths(root)` already, so it takes the parent from the returned path instead of rebuilding it. The tests now survive any future relocation without edits.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`dirname(stateDir)`** | Correct at any depth; uses the resolver as the single source | Needs one extra import | 10/10 |
| Add `'.state'` to the hardcoded join | Smallest diff | Re-encodes the depth, so the next move breaks it again | 3/10 |

**Why this one**: the test broke precisely because it duplicated knowledge the resolver already had. Deriving it removes the duplication rather than updating it.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:

- The fail-open guarantee is now tested independently of where state lives.

**What it costs**:

- None material; one import added.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future fixture hardcodes the depth again | L | The two existing sites now demonstrate the pattern |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two tests failed against the new depth |
| 2 | **Beyond Local Maxima?** | PASS | The minimal-diff alternative was rejected as re-encoding the bug |
| 3 | **Sufficient?** | PASS | One import, two call sites |
| 4 | **Fits Goal?** | PASS | Restores a load-bearing fail-open assertion |
| 5 | **Open Horizons?** | PASS | Survives the next relocation |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:

- `spec-gate-core.test.mjs`: `dirname` imported; two fixture sites derive the parent.

**How to roll back**: Restore the hardcoded join, accepting that the tests then encode the directory depth.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->


---
