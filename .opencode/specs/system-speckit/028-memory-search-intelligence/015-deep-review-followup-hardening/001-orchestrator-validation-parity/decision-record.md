---
title: "Decision Record: Orchestrator Validation Parity"
description: "Architecture decisions for closing the native-vs-shell validation parity gaps: shared started-work definition, strict-aware filtering, and the quiet-tree rebuild gate."
trigger_phrases:
  - "orchestrator parity decisions"
  - "decision record"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/015-deep-review-followup-hardening/001-orchestrator-validation-parity"
    last_updated_at: "2026-07-02T15:10:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored ADRs"
    next_safe_action: "Implementer confirms decisions hold during build"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-001-orchestrator-parity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Orchestrator Validation Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Fix Parity In The Native Path, Not By Rerouting To Shell

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-02 |
| **Deciders** | Packet 032 orchestrator (Claude) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The Node orchestrator is validate.sh's default path and diverges from the shell rules in two verified ways (strict-only rules never run; completion docs demanded from unstarted folders). The divergence could be closed either by fixing the native logic or by routing the affected checks back to shell execution.

### Constraints
- validate.sh's default path must stay the Node orchestrator (performance and registry-bridge architecture already shipped in packet 030 phase 011 child 006).
- Non-strict behavior must remain unchanged.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Fix both gaps inside `orchestrator.ts` so the native path itself honors the shell contract; do not reroute checks to shell execution.

**Details**: The strict filter gains one condition; FILE_EXISTS gains a started-work predicate. The shell rules remain the reference semantics and their fixtures remain the integration proof.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fix native logic (chosen)** | One authoritative fast path; shell stays reference-only | Native code must mirror shell semantics carefully | 9/10 |
| Route affected checks to shell always | Zero native logic to maintain | Reintroduces per-rule subprocess cost on every run; splits the check set across paths permanently | 4/10 |
| Delete the native checks, bridge everything | Single execution model | Throws away the shipped native performance for all checks; huge regression surface | 2/10 |

**Why Chosen**: The native path exists for speed and coherence; teaching it the two missing semantics is a smaller, safer delta than re-architecting execution.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- One path, one behavior, both modes truthful.
- Bash fixtures continue to guard the shell reference semantics.

**Negative**:
- Two definitions of "started work" exist (shell + native) and must be kept mirrored. Mitigation: both directions unit-tested; heuristic documented in both places.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Native/shell heuristics drift apart later | M | Unit fixtures encode the exact shell examples (legend row, `- [x]` line) |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Both gaps produce real wrong outcomes today (weak strict runs; false errors on honest scaffolds) |
| 2 | **Beyond Local Maxima?** | PASS | Shell rerouting and full re-bridging were scored |
| 3 | **Sufficient?** | PASS | Two focused fixes close both verified gaps completely |
| 4 | **Fits Goal?** | PASS | Restores the packet-030 registry-bridge promise: default path equals shell semantics |
| 5 | **Open Horizons?** | PASS | Native path remains the single place future parity fixes land |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**: orchestrator registry filter; `validateFileExists`; new vitest file.

**Rollback**: Revert the file and rebuild; shell fixtures unaffected.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Quiet-Tree Gate For The Shared-Dist Rebuild

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-02 |
| **Deciders** | Packet 032 orchestrator (Claude), from live multi-session incident evidence |

---

<!-- ANCHOR:adr-002-context -->
### Context

This repo runs multiple concurrent AI sessions against one working tree. The mcp_server dist is shared: rebuilding compiles whatever source state exists, including other sessions' uncommitted WIP. On 2026-07-02 this was a live blocking condition twice (different files each time). The dist-freshness backstop (packet system-speckit/030) fails validate.sh repo-wide when sources are newer than dist, so "edit source, defer rebuild" is not a viable partial state either.

### Constraints
- Never compile another session's uncommitted work into shared dist without explicit approval.
- Never leave watched sources newer than dist (backstop fails everyone).
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Source edits and the rebuild ship as one atomic step, executed only when `git status` shows no other-session uncommitted sources in the package, or when the operator explicitly approves sweeping the observed WIP.

**Details**: The implementer checks the gate immediately before editing (not just before rebuilding), so the edit-to-rebuild window is minutes, not hours. If the gate is closed, the child stays Not Started rather than half-shipped.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Atomic edit+rebuild behind quiet-tree gate (chosen)** | No half-states; respects other sessions; backstop never trips | Work can be deferred by others' activity | 9/10 |
| Edit now, rebuild later | Decouples authoring from coordination | Backstop fails repo-wide validate.sh in the gap | 1/10 |
| Build in an isolated worktree, copy dist artifacts over | No WIP sweep risk | Copied dist diverges from tree sources; fingerprint/manifest mismatch with finalize-dist | 3/10 |

**Why Chosen**: The only option with zero broken intermediate states under the shipped freshness enforcement.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**Positive**:
- No repo-wide validation outage caused by this child.
- Other sessions' WIP is structurally protected.

**Negative**:
- Scheduling dependency on concurrent sessions. Mitigation: gate check is cheap and repeatable; operator can approve explicitly when they own the WIP.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Gate never clears during a working day | M | Operator approval path exists; WIP owner is the same human |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two live gate-closed incidents on 2026-07-02 alone |
| 2 | **Beyond Local Maxima?** | PASS | Deferred rebuild and isolated-worktree builds were scored |
| 3 | **Sufficient?** | PASS | Atomicity plus the gate covers both failure modes (sweep and backstop) |
| 4 | **Fits Goal?** | PASS | Preserves the freshness guarantees this program itself shipped |
| 5 | **Open Horizons?** | PASS | Same gate protocol reusable for any shared-dist package |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**Affected Systems**: Dispatch sequencing (this child last); implementer pre-edit gate check.

**Rollback**: Not applicable; the gate is procedure, not code.

<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
