---
title: "Decision Record: deep-review reducer-cluster backlog remediation"
description: "ADRs for reopening ADR-002, implementing 5 reducer behaviors, and documenting 4 by-design reducer gaps."
trigger_phrases:
  - "reducer cluster decision record"
  - "ADR-002 reopening"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/001-release-cleanup/010-deep-review-phase5-reducer-cluster-remediation"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "decision-record-authored"
    next_safe_action: "implement-LG-0001"
    blockers: []
    key_files: ["decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000007022"
      session_id: "131-000-007-002-reducer"
      parent_session_id: "131-000-007-002-reducer"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: deep-review reducer-cluster backlog remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reopen ADR-002 to allow reducer behavioral changes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator, main agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

The `003-deep-review` packet froze `scripts/reduce-state.cjs` under ADR-002 (bug-scan only, no behavioral edits) because that packet's scope was documentation re-baselining and the reducer is loop-critical. That froze 9 reducer gaps. The `007` arc reopens the question. Verification showed 5 gaps are genuine doc-vs-code drift the reducer should close, and 4 are by-design.

### Constraints

- The reducer drives the convergence loop, so every change carries blast radius.
- The config contract requires `reducer.idempotent: true`.
- Records predating these contracts must still reduce cleanly (backward compatibility).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Reopen ADR-002 for this child packet and implement the 5 genuinely-open reducer behaviors with vitest coverage, while documenting the 4 by-design gaps with rationale.

**How it works**: Each change is surgical and additive where possible. New optional fields fall back to legacy behavior when absent. A new vitest builds temp review fixtures and asserts on reducer outputs, and the existing reducer suite guards against regression.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Implement all 5 + document 4 (chosen)** | Closes every genuine gap, reducer matches its docs | Highest blast radius on loop-critical code | 8/10 |
| Safe subset (LG-0001/0005 only) | Lowest risk | Leaves 3 documented contracts unmet | 6/10 |
| Document-only, no code | Zero blast radius | Reducer keeps drifting from SKILL.md 8.1 + state_format | 4/10 |

**Why this one**: The operator chose full implementation. The drift is real (SKILL.md 8.1 line 538 claims a reducer behavior that does not exist), and tests plus additive design contain the risk.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The reducer matches its documented contracts (findingDetails fields, traceabilityChecks, content_hash dedup, validation rules).
- The dashboard reflects pause and recovery state instead of always showing RUNNING.

**What it costs**:
- A larger reducer with more code paths . Mitigation: each path is covered by vitest and falls back to legacy behavior when new fields are absent.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dedup collapse merges distinct findings | M | Two-tier key matches SKILL.md 8.1 exactly; fallback preserves legacy behavior |
| Field validation regresses tolerated records | M | Additive warnings, not hard errors; existing-fixture regression test |
| Convergence behavior shifts | H | No change to convergence math (LG-0003 confirmed by-design); only registry/dashboard surfaces change |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Closes documented doc-vs-code drift the operator asked to fix |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed; full-implementation chosen explicitly |
| 3 | **Sufficient?** | PASS | 5 surgical additive changes, no rewrite |
| 4 | **Fits Goal?** | PASS | On the critical path of the 007 backlog arc |
| 5 | **Open Horizons?** | PASS | Aligns reducer to its contracts, easing future maintenance |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `scripts/reduce-state.cjs`: dashboard status (LG-0001), finding field carry-through (LG-0005), traceability rollup (LG-0006), two-tier dedup (LG-0008), field validation (LG-0033).
- New `scripts/tests/reducer-backlog-remediation.vitest.ts`.

**How to roll back**: `git revert` the implementation commit. The reducer reverts to ID-only dedup and the prior dashboard status. Docs-only fields become inert.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Document four reducer gaps as by-design

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-23 |
| **Deciders** | Operator, main agent |

### Decision

**We chose**: Mark LG-0002, LG-0003, LG-0004, and LG-0023 as by-design and close them with rationale rather than changing code.

**Rationale per gap**:
- **LG-0002 (gate-name validation)**: the reducer is deliberately gate-name-agnostic (established in `006-gate-model-reconciliation`). A hardcoded allowlist would reject valid future gates.
- **LG-0003 (rollingAvg + madScore)**: `computeConvergenceScore` reads `compositeStop`, the pre-computed composite that already folds in rolling-average and MAD. Reading the blended score is correct; the raw signals are agent-side inputs.
- **LG-0004 (graphEvents)**: `graphEvents` are consumed by the MCP coverage-graph handler (`coverage-graph/upsert.ts`) into `deep-loop-graph.sqlite`. The JSONL reducer is not their consumer. This is the intended producer/consumer split.
- **LG-0023 (emitResourceMap)**: `--emit-resource-map` flag gating is the design. Synthesis passes the flag and `config.resource_map.emit` controls default behavior, as documented in the resource-map-emission feature.

### Consequences

These four gaps reach a terminal state (closed, by-design) without touching the reducer. If a future contract changes (for example, if graphEvents are ever meant to feed the JSONL reducer), a new packet revisits the relevant ADR.
