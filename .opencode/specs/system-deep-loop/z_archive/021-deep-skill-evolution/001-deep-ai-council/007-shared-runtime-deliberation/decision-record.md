---
title: "Decision Record: sk-ai-council Shared Runtime Deliberation"
description: "Council-derived ADRs for whether sk-ai-council should become a shared runtime. Verdict: HYBRID, with primitive extraction deferred until explicit criteria are met."
trigger_phrases:
  - "124 sk-ai-council decision"
  - "ai-council runtime ADR"
  - "hybrid council runtime"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/001-deep-ai-council/007-shared-runtime-deliberation"
    last_updated_at: "2026-05-23T05:04:55Z"
    last_updated_by: "codex"
    recent_action: "Recorded HYBRID council ruling and guardrail ADRs."
    next_safe_action: "Open a follow-on implementation packet only if ADR-001 trigger criteria are met."
    blockers: []
    key_files:
      - "decision-record.md"
      - "ai-council/council-report.md"
    session_dedup:
      fingerprint: "sha256:1241241241241241241241241241241241241241241241241241241241240005"
      session_id: "116-deep-skill-evolution/001-ai-council/007-shared-runtime-deliberation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Full runtime extraction is not approved now; primitive-only extraction may be opened later under explicit criteria."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: sk-ai-council Shared Runtime Deliberation

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: HYBRID - Defer Full Runtime Extraction, Allow Primitive-Only Extraction When Triggered

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | sk-ai-council seats 1/2/3/4 via this packet |
| **Decision Source** | Seat 4 adjudicator after no 2-of-3 advocate majority |

---

<!-- ANCHOR:adr-001-context -->
### Context

The current `sk-ai-council` skill is planning-only and owns packet-local `ai-council/**` artifacts, convergence checks, state, seats, deliberations, and rollback evidence. It already has reusable-looking helpers: `persist-artifacts.js` parses reports, renders artifacts, scopes writes, and appends audit events; `audit-trail.js` normalizes append-only JSONL; `replay-graph-from-artifacts.cjs` rebuilds derived graph payloads.

The deep-loop precedent proves that runtime extraction is useful when the extracted surface has multiple workflow consumers, lifecycle ownership, script entry points, storage, and tests. The council does not yet show the same pressure.

### Constraints

- Packet-local `ai-council/**` artifacts remain the source of truth.
- Council graph rows are derived projection state, not authoritative state.
- Existing packet artifacts must remain readable.
- No source code changes are authorized by this deliberation packet.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: HYBRID. Keep orchestration, seat prompt authoring, report synthesis, and packet artifact ownership in `sk-ai-council`; allow a future `.opencode/skills/ai-council-runtime/` only for low-level primitives after trigger criteria are met.

**How it works**: A follow-on packet may extract state JSONL appenders, scoped artifact write guards, checksum/audit helpers, convergence classifiers, and parser/rendering utilities. It must not move the council agent identity, strategy selection, seat mandates, report authorship, or packet-local source-of-truth rules unless a later council specifically authorizes full extraction.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **HYBRID (chosen)** | Reuses real primitives; avoids extracting orchestration too early; matches current evidence | Requires future trigger discipline | 9/10 |
| Full extraction | Clear runtime boundary; parity with deep-loop-runtime vocabulary | Overbuilt with current consumer count; high parity-test and artifact compatibility burden | 6/10 |
| Keep inline forever | Lowest immediate cost; no compatibility risk | Ignores reusable state/write primitives and future drift risk | 7/10 |
| Defer without criteria | Avoids action now | Leaves future maintainers with the same ambiguous question | 5/10 |

**Why this one**: HYBRID prices the evidence correctly. The low-level state and writer helpers are plausible runtime material, but current orchestration is still council-specific and should not move without stronger consumer evidence.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Future extraction has a narrow target and a testable boundary.
- Existing `ai-council/**` packet artifacts remain authoritative and compatible.
- Maintainers get explicit trigger criteria instead of repeating the same architecture debate.

**What it costs**:
- No immediate code reuse gain lands in this packet. Mitigation: use the trigger criteria to open a follow-on only when the cost is justified.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Full extraction happens anyway under this ADR | H | ADR text explicitly limits authorized extraction to primitives |
| Primitive extraction misses hidden callers | M | Require repo-wide consumer grep and fixture parity before implementation |
| Runtime package becomes a dumping ground | M | Gate new modules on active cross-consumer evidence |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `sk-ai-council` has runtime-like helpers, but not enough evidence for full extraction. |
| 2 | **Beyond Local Maxima?** | PASS | Full extraction, keep-inline, hybrid, and defer-only options were argued by separate seats. |
| 3 | **Sufficient?** | PASS | Primitive-only extraction is the smallest useful boundary if pressure appears. |
| 4 | **Fits Goal?** | PASS | The decision answers the user question and names usefulness conditions. |
| 5 | **Open Horizons?** | PASS | It preserves a path to full extraction if active consumers grow. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- No source code changes in this packet.
- A future packet may create `.opencode/skills/ai-council-runtime/` with primitive modules only.
- Future parity targets: `persist-artifacts` fixtures, state JSONL examples, output schema parsing, scoped-write rejection, and graph replay output.

**How to roll back**: Delete this packet or supersede ADR-001 with a new council packet. No runtime rollback is needed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Packet-Local Artifacts Remain Source of Truth

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | sk-ai-council seats 1/2/3/4 |

### Context

The council skill and graph reference both state that packet-local `ai-council/**` artifacts win over derived projections. This is the stabilizing rule that lets old packet reports, seats, and state logs remain auditable even when helper code evolves.

### Decision

**We chose**: Any future runtime extraction must keep `ai-council/ai-council-state.jsonl`, `seats/**`, `deliberations/**`, `critiques/**`, and `council-report.md` as packet-local source-of-truth artifacts.

### Consequences

**What improves**:
- Runtime extraction cannot silently replace or reinterpret historical packets.
- Council graph rows stay rebuildable and disposable.

**What it costs**:
- Runtime helpers must preserve file-format compatibility instead of optimizing freely.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Full Extraction Requires Explicit Trigger Criteria

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | sk-ai-council seats 1/2/3/4 |

### Context

Deep-loop-runtime had two workflow consumers, relocated storage, script entry points, runtime-owned tests, and a directive to remove MCP coupling. `sk-ai-council` currently has a smaller active consumer set and one canonical agent workflow.

### Decision

**We chose**: Re-deliberate or open implementation only when one of these triggers is met:

1. Three or more active consumers depend on council state/writer/convergence helpers.
2. A real state-safety incident appears in council JSONL or scoped-write handling.
3. Two separate skills duplicate council-like state, convergence, or artifact writer primitives.
4. Council graph and artifact replay need the same primitive library from both MCP and non-MCP runtimes.

### Consequences

**What improves**:
- Avoids speculative runtime creation.
- Gives maintainers a concrete checklist for future extraction.

**What it costs**:
- Some reuse remains latent until the criteria are met.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: This Packet Authorizes Deliberation Only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | User scope plus packet author |

### Context

The user explicitly requested a deliberation packet and forbade source-code changes, arc 010 touches, CLI self-dispatch, and commits.

### Decision

**We chose**: This packet creates only the Level 3 spec docs and `ai-council/**` artifacts. It does not modify `sk-ai-council`, `deep-loop-runtime`, `system-spec-kit`, or any implementation source.

### Consequences

**What improves**:
- The recommendation is reviewable before implementation.
- Parallel arc 010 work remains untouched.

**What it costs**:
- Any useful extraction still needs a follow-on spec and verification plan.
<!-- /ANCHOR:adr-004 -->
