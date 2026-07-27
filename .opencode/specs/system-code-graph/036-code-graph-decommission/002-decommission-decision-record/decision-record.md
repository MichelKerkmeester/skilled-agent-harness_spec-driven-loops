---
title: "Decision Record: Code Graph Decommission"
description: "The ratified decisions governing removal of the system-code-graph subsystem: accepted capability loss, replacement routing, strip-versus-delete dispositions, archival boundary, sequencing, and the rollback gap git cannot cover."
trigger_phrases:
  - "code graph decommission ADR"
  - "code graph removal decision"
  - "structural search replacement decision"
  - "strip versus delete launcher infra"
  - "decommission rollback gap"
importance_tier: "critical"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-code-graph/036-code-graph-decommission/002-decommission-decision-record"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Ratified the decommission decisions from the merged research synthesis"
    next_safe_action: "Answer the single open operator question on ignored-state retention, then begin phase 003"
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-036-002-decommission-decision-record"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Code Graph Decommission

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

Every decision below is grounded in the merged three-lane research synthesis at
`../001-touchpoint-research/research/research.md`.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Retire structural code search rather than replace it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-27 |
| **Deciders** | Repository owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

The `system-code-graph` skill is the live implementation of the `mk_code_index` MCP server. It
exposes eight tools — `code_graph_scan`, `code_graph_query`, `code_graph_status`,
`code_graph_context`, `code_graph_classify_query_intent`, `code_graph_verify`, `code_graph_apply`,
and `detect_changes` — backed by a SQLite graph store and a CLI front door. Project doctrine
currently lists these as mandatory tools and routes concept discovery to them by default.

Removing the implementation without deciding what replaces that routing would leave every agent,
command, and instruction file pointing at tools that no longer exist.

### Constraints

- The removal is permanent: no replacement indexing engine is being built as part of this work.
- Doctrine, agents, and commands must name a path that actually exists after removal.
- Grep, Glob, and `memory_search` are the only retrieval surfaces that survive.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: remove the subsystem outright and accept the permanent loss of structural code search.

**How it works**: code discovery routes to Grep and Glob; spec-doc and saved-memory retrieval
continues through `memory_search`, which is a separate subsystem and unaffected. The Mandatory Tools
table, the Code Search Decision Tree, the MCP server roster, and the daemon fallback ladder are
rewritten to describe that reality rather than the removed one.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full decommission (chosen)** | Ends the maintenance cost of a five-runtime subsystem; no dead fallbacks left behind | Permanent capability loss; broad, ordered change set | 8/10 |
| Retire the skill, relocate the engine | Keeps the tools working | Keeps the entire maintenance surface while adding a migration; solves nothing the owner asked for | 4/10 |
| Deprecate in place | Cheapest immediately | Leaves a live subsystem everyone is told to stop using — the worst of both states | 3/10 |

**Why this one**: the owner's intent is removal, not migration. A decommission that leaves fallback
stubs behind carries the cost of both options and the benefit of neither.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Three MCP registrations, two plugins, four hook families, a CI job, and a `/doctor` route stop
  needing maintenance across five runtimes.
- Session start stops spawning a daemon that most sessions never query.

**What it costs**:
- Callers, imports, and impact analysis become Grep-shaped rather than graph-shaped. Mitigation:
  none available; this is the accepted trade.
- The `context` and `deep-review` agents lose a retrieval mode. Mitigation: their definitions state
  plainly what they can still do rather than silently degrading.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Capability regretted later | M | Full rollback procedure in ADR-005; git history preserved |
| Doctrine left mandating a removed tool | H | Doctrine rewrite is a P0 phase, sequenced before deletion (ADR-004) |
| Over-deletion of unrelated graph subsystems | H | ADR-003 names the survivors explicitly |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Owner-directed removal of a subsystem whose cost spans five runtimes |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives scored; research eliminated ten more approaches |
| 3 | **Sufficient?** | PASS | Consumer-first ordering is the minimum that avoids a broken session start |
| 4 | **Fits Goal?** | PASS | Directly on the stated critical path |
| 5 | **Open Horizons?** | PASS | Nothing here blocks a future indexing engine from being introduced cleanly |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Doctrine, agents, and commands stop naming the eight tool ids.
- All three MCP registrations, the launcher, the CLI, and the skill tree are removed.

**How to roll back**: see ADR-005.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Strip shared launcher infrastructure; never delete it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-27 |
| **Deciders** | Repository owner |

### Context

`.opencode/bin/lib/launcher-ipc-bridge.cjs` is required by three launchers — `mk-spec-memory`,
`mk-code-index`, and `mk-skill-advisor` — and branches on `serviceName` for each
(`launcher-ipc-bridge.cjs:84-100`). `launcher-session-proxy.cjs` is shared the same way; only the
replayability set differs per service. An earlier draft of this packet listed the bridge for
deletion. Executing that would have broken both surviving daemons while removing the third.

### Decision

**We chose**: treat both shared libraries as strip-only. Remove the code-graph branch; keep the file.

**How it works**: the `mk-code-index` case is removed from the service switch and its
service-specific paths deleted, leaving the `mk-spec-memory` and `mk-skill-advisor` cases intact.
Verification is behavioural: both surviving daemons must start and serve after the change.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Strip the branch (chosen)** | Surviving daemons keep working | Leaves a smaller shared file to maintain | 9/10 |
| Delete and inline into each launcher | No shared file | Duplicates working code across two launchers for no benefit | 3/10 |
| Delete outright | Simplest diff | Breaks both surviving daemons at startup | 0/10 |

**Why this one**: the file is shared infrastructure that predates and outlives this subsystem.

### Consequences

**What improves**: the removal cannot take down the two daemons that remain.

**What it costs**: the diff is a careful edit rather than a file deletion. Mitigation: start both
daemons as the acceptance check.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Over-eager cleanup deletes the file later | H | Marked strip-only in the phase spec and here |
| A shared helper is removed as "unused" | M | Verify by starting both daemons, not by reading |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Prevents a confirmed break of two live daemons |
| 2 | **Beyond Local Maxima?** | PASS | Three dispositions weighed |
| 3 | **Sufficient?** | PASS | Minimal edit to a shared file |
| 4 | **Fits Goal?** | PASS | Blocks the highest-consequence failure in the packet |
| 5 | **Open Horizons?** | PASS | Leaves the shared bridge pattern usable by future services |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: the two shared libraries lose their code-graph branch;
`mk-spec-memory-launcher.cjs` loses its canonical-database references.

**How to roll back**: restore the two files from HEAD; the branches are self-contained.

---

## ADR-003: Leave history immutable and name the surviving graph subsystems

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-27 |
| **Deciders** | Repository owner |

### Context

The overwhelming majority of matches for the retiring identities live in dated spec packets,
changelogs, and benchmark reports — one lane counted 4,364 archival hits against roughly 384 live
paths. Those documents recorded decisions that were true when written. Separately, the repository
contains several unrelated graph subsystems that a careless match on the word "graph" would damage.

### Decision

**We chose**: never edit archival paths, and never match on "graph" — only on the exact retiring
identities.

**How it works**: `.opencode/specs/**`, changelogs, benchmark reports, and `.worktrees/**` are
inventoried and excluded from every sweep and every edit. Spec Memory's causal and knowledge graphs,
the skill-advisor's skill graph, and deep-loop's coverage and council graphs survive untouched. A
single tombstone at the track root explains the removal to anyone following a stale pointer.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Immutable history plus one tombstone (chosen)** | Preserves the decision trail; one signpost | Stale pointers remain inside old packets | 9/10 |
| Repo-wide scrub | Zero residual matches | Falsifies thousands of dated records | 0/10 |
| No tombstone | Least work | Readers hit dead paths with no explanation | 5/10 |

**Why this one**: rewriting history to hide a removed dependency is the one outcome that makes the
repository less trustworthy than leaving the references alone.

### Consequences

**What improves**: the decision trail stays accurate; three healthy subsystems stay intact.

**What it costs**: residual sweeps must classify hits rather than demand zero. Mitigation: success is
defined as "no live exact-identity residuals", not "no mention anywhere".

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A sweep counts archival or worktree hits as failures | M | Classified residual report with an explicit archival allowlist |
| Bulk replacement damages unrelated prose | M | Research found "graph-first" also matches "photograph-first"; exact identities only |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without it, a literal reading of "removed everywhere" rewrites spec history |
| 2 | **Beyond Local Maxima?** | PASS | Three approaches weighed |
| 3 | **Sufficient?** | PASS | One tombstone covers the discoverability gap |
| 4 | **Fits Goal?** | PASS | Bounds every later phase |
| 5 | **Open Horizons?** | PASS | Keeps the historical record usable for future decisions |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: a tombstone is added at the spec track root; nothing archival is edited.

**How to roll back**: delete the tombstone.

---

## ADR-004: Sequence doctrine before deletion, and retarget CI rather than deleting it early

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-27 |
| **Deciders** | Repository owner |

### Context

The research lanes disagreed on two sequencing points. One argued documentation should land after
deletion, since references become dead links; the packet had it before. A second argued the
`isolation-check` CI job should be retargeted to assert *absence* during teardown and dropped only at
the end, rather than deleted at the start as the packet specified.

### Decision

**We chose**: doctrine before deletion; CI retargeted during teardown and dropped last.

**How it works**: instruction files stop mandating the tools before the tools disappear, so no
session in the intervening window follows a route to a missing server — a dead link in a README is a
smaller harm than a mandate pointing at nothing. The CI job keeps its value during the change window
by asserting the coupling is gone, and is removed only once the subsystem is.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Doctrine first, CI last (chosen)** | No window where doctrine mandates a missing tool; CI guards the teardown | Docs briefly describe a not-yet-removed subsystem as going away | 8/10 |
| Docs last | Docs describe only final state | Leaves a window where every session is told to use a removed tool | 5/10 |
| Delete CI first | Simplest | Removes the guard exactly when regressions are most likely | 2/10 |

**Why this one**: the intervening window is the risky part of a staged removal, and both choices
protect it.

### Consequences

**What improves**: no window in which doctrine and reality disagree in the dangerous direction.

**What it costs**: documentation is written slightly ahead of the final state. Mitigation: doctrine
describes the target state, and the closeout phase reconciles any drift.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Docs updated then deletion stalls | M | Closeout reconciles; rollback restores doctrine with everything else |
| Retargeted CI passes vacuously | M | The absence assertion must fail when the identities are still present |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two lanes disagreed; execution needs one answer |
| 2 | **Beyond Local Maxima?** | PASS | Both orderings weighed on their failure windows |
| 3 | **Sufficient?** | PASS | No further sequencing ambiguity remains |
| 4 | **Fits Goal?** | PASS | Governs phases 009 through 013 |
| 5 | **Open Horizons?** | PASS | Neither choice constrains later work |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: the CI phase becomes retarget-then-drop rather than delete; the doctrine phase
keeps its position before deletion.

**How to roll back**: restore the workflow file and the doctrine files from HEAD.

---

## ADR-005: Rollback is layered, and git alone cannot complete it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-27 |
| **Deciders** | Repository owner |

### Context

Deletion is the one irreversible step. Restoring it means restoring a coherent set of layers in
reverse order — provider, launchers, registrations, consumers, doctrine — because a partial restore
where doctrine, permissions, registration, and provider availability disagree is worse than either
end state. Critically, some state is not in git at all: the SQLite database and its WAL, PID and
lease files, quarantine and audit data, and per-worktree database directories are all ignored.

### Decision

**We chose**: define rollback as an ordered layer restore, and require an explicit retention decision
on ignored state before deletion runs.

**How it works**: restore in reverse order — provider tree and build artifacts, then launchers and
shared bridge support, then the three registrations, then consumers, hooks, plugins, grants,
commands, generated mirrors, and docs — then restart clients and confirm tool discovery. Deletion
lands as its own commit so the rollback point is unambiguous. Whole-file reverts are forbidden for
mixed hooks and CI, which carry unrelated protections.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Layered restore plus retention decision (chosen)** | Restores a coherent system; no silent data loss | Requires an operator answer before deletion | 9/10 |
| `git revert` alone | One command | Cannot restore ignored databases or leases; leaves an incoherent runtime | 3/10 |
| No rollback plan | Fastest | Unacceptable for an irreversible step | 0/10 |

**Why this one**: the ignored-state gap is invisible until someone tries to roll back and finds the
database gone.

### Consequences

**What improves**: rollback is executable from a written procedure rather than improvised.

**What it costs**: one operator decision gates deletion. Mitigation: it is a single yes/no on
backing up ignored state.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Ignored database discarded then needed | H | **Open question below — must be answered before phase 013** |
| Partial rollback leaves layers disagreeing | H | Reverse-order layer restore is mandatory, not advisory |
| Deletion mixed into another commit | M | Deletion lands as its own commit |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Deletion is irreversible without it |
| 2 | **Beyond Local Maxima?** | PASS | Three approaches weighed |
| 3 | **Sufficient?** | PASS | Covers both tracked and ignored state |
| 4 | **Fits Goal?** | PASS | Gates the only irreversible phase |
| 5 | **Open Horizons?** | PASS | The procedure generalises to any subsystem removal |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: deletion is gated on a retention answer and lands as its own commit.

**How to roll back**: the layered procedure above, in reverse order, followed by a client restart and
a tool-discovery check.

---

## Open question requiring an operator answer

One decision cannot be made from the code, and it gates phase 013:

**Do the ignored Code Graph databases and their operator state need backing up before deletion?**

In scope: `mcp-server/database/code-graph.sqlite` and its WAL, the owner-lease and PID registry
markers, readiness and invalidation markers, quarantine and audit data, and any per-worktree database
directories. None of it is tracked, so `git revert` will not bring it back.

The cheap answer is to archive the database directory to a timestamped path outside the repository
before phase 013 runs, and discard the archive once closeout passes. That costs a few hundred
kilobytes and removes the only unrecoverable failure mode in the plan. It is recorded here as a
recommendation, not a ratified decision.
