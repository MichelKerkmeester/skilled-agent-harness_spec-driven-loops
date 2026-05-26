---
title: "Decision Record: /doctor:code-graph apply-mode Phase B [system-spec-kit/026-graph-and-context-optimization/005-code-graph/012-doctor-apply-mode-implementation/decision-record]"
description: "Architectural decisions for verification gating, recovery workflow translation, rollback semantics, and self-healing boundaries."
trigger_phrases:
  - "doctor code graph apply ADR"
  - "code graph apply decision record"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/012-doctor-apply-mode-implementation"
    last_updated_at: "2026-05-08T22:45:00Z"
    last_updated_by: "codex"
    recent_action: "Authored ADRs for Phase B apply-mode"
    next_safe_action: "Implement ADR-backed runtime behavior"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/apply-orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-apply-mode-phase-b-2026-05-08"
      parent_session_id: "doctor-apply-mode-phase-b-2026-05-08"
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Decision Record: /doctor:code-graph apply-mode Phase B

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Verification-Battery Gating

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-08 |
| **Deciders** | Codex, packet spec |

### Context
<!-- ANCHOR:adr-001-context -->

Apply-mode mutates a rebuildable but operationally important SQLite graph. A successful scan is not enough evidence that structural answers are still trustworthy, because row counts can look healthy while canonical symbols or edge-focus categories regress.
<!-- /ANCHOR:adr-001-context -->

### Decision
<!-- ANCHOR:adr-001-decision -->

**We chose**: every apply invocation runs the gold battery before mutation and after operation dispatch.

**How it works**: pre-flight failure aborts before mutation. Post-flight failure triggers rollback. Pass floors come from `code-graph-gold-queries.json`; environment overrides may raise floors but never lower artifact defaults.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Pre/post battery gate | Catches baseline and operation regressions | Adds latency | 9/10 |
| Post-only battery gate | Faster | Can mask pre-existing degradation | 4/10 |

**Why this one**: pre/post gates are the only option that proves apply-mode did not inherit an already-bad baseline.
<!-- /ANCHOR:adr-001-alternatives -->

### Consequences
<!-- ANCHOR:adr-001-consequences -->

**What improves**:
- Apply-mode cannot mask pre-existing graph degradation.
- Operators get per-run pass-rate evidence in the audit log.

**What it costs**:
- Apply-mode is slower by two battery runs. Mitigation: the 28-query battery is bounded and targeted.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Mutations need verification gates. |
| 2 | Beyond Local Maxima? | PASS | Compared post-only and pre/post gates. |
| 3 | Sufficient? | PASS | Uses existing gold battery. |
| 4 | Fits Goal? | PASS | Directly closes REQ-001 and REQ-002. |
| 5 | Open Horizons? | PASS | Supports future battery expansion. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `gold-battery-runner.ts` wraps `gold-query-verifier`.
- `apply-orchestrator.ts` calls the runner before and after operations.

**How to roll back**: remove `code_graph_apply` registration and the new apply libraries.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Recovery-Playbook to Workflow Translation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-08 |
| **Deciders** | Codex, packet spec |

### Context

The recovery playbook is the source of truth for SQLite corruption, partial-scan failure, and bad-apply rollback. Translating it into code must preserve idempotence without embedding shell snippets or unvalidated commands.

### Decision

**We chose**: implement CG-RP-001, CG-RP-002, and CG-RP-003 as typed TypeScript procedures.

**How it works**: procedures accept validated paths and injected scan functions. SQLite health checks use `better-sqlite3` APIs; triplet copies and moves use `fs` functions inside the code graph data directory.

### Consequences

**What improves**:
- Recovery is testable in Vitest with sandbox DB directories.
- No arbitrary shell execution is needed for playbook automation.

**What it costs**:
- Forensic `.recover --ignore-freelist` is not shell-executed in MVP. Mitigation: the procedure preserves forensic copies and rebuilds trust from source.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Rollback Semantics

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-08 |
| **Deciders** | Codex, packet spec |

### Context

Rollback must avoid silently overwriting the failed DB state because that state is evidence for follow-up debugging. It also must work when no known-good snapshot exists.

### Decision

**We chose**: rollback quarantines the live DB triplet into `bad-apply-*`, restores the latest `known-good-*` triplet when present, then runs a full source rebuild and verification.

**How it works**: the orchestrator creates a known-good snapshot after pre-flight passes and before mutation. CG-RP-003 moves failed live files away, restores the snapshot if found, and re-runs `code_graph_scan({ incremental:false })`.

### Consequences

**What improves**:
- Failed apply evidence is retained.
- Repeated rollback runs are idempotent because every quarantine directory is timestamped.

**What it costs**:
- If no known-good snapshot exists, rollback becomes rebuild-from-source. Mitigation: the audit log records `restored:false`.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Self-Healing Boundary

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-08 |
| **Deciders** | Codex, packet spec |

### Context

Silent full scans or corruption recovery can be expensive and surprising. The staleness model draws a useful boundary: soft-stale states are bounded and safe to auto-heal; hard-stale states require operator confirmation.

### Decision

**We chose**: apply-mode auto-fixes only `soft-stale` states and requires `confirm:true` for hard-stale recovery.

**How it works**: `fresh` is no-op unless an explicit operation is requested. `soft-stale` routes to incremental re-scan. `hard-stale` includes empty/error graphs, unavailable trust, Git HEAD drift, missing persisted timestamp, schema mismatch, stale count over 50, or failed battery floors.

### Consequences

**What improves**:
- Apply-mode cannot silently trigger expensive or high-risk recovery.
- The boundary matches existing readiness behavior and the shipped staleness model.

**What it costs**:
- Some common recoveries need `confirm:true`. Mitigation: the handler returns the required confirmation reason.
<!-- /ANCHOR:adr-004 -->
