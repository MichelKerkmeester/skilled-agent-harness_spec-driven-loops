---
title: "Decision Record: Phase 005 - Parity Benchmark Release Gate"
description: "Decision record for parity evidence, release authority, baseline overwrite control, and failure handling."
trigger_phrases:
  - "phase 005 decision record"
  - "release authority"
  - "baseline overwrite"
  - "routing and parity evidence"
importance_tier: "high"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/005-parity-benchmark-release-gate"
    last_updated_at: "2026-07-06T01:30:00.000Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Recorded release owner authority, append-only baseline policy, and conditional gate decision."
    next_safe_action: "Operator executes live/manual/browser lanes before any READY verdict."
---
# Decision Record: Phase 005 - Parity Benchmark Release Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Release Requires Routing Invariants and Live Parity Evidence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-05 |
| **Deciders** | Release owner, design reviewer, maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

The parity release gate must prove that `sk-design` behaves like a useful Claude Design-style assistant while preserving OpenCode-native routing. Routing checks alone are not enough because a system can select the right public mode and still produce weak, generic, inaccessible, low-polish, or unhelpful design output.

### Constraints

- The public advisor identity remains `sk-design`.
- The five public modes remain the user-facing execution lanes.
- Private procedure selection remains internal after public mode selection.
- md-generator extraction behavior remains preserved and separately verified.
- Benchmark baselines are append-only unless overwrite authority is recorded.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Release readiness requires both routing invariants and live/usefulness/parity evidence.

**How it works**: The release gate records separate verdicts for router/advisor invariants, golden prompt behavior, procedure selection, context/proof gates, anti-slop and quality lanes, manual usefulness scenarios, negative controls, and md-generator preservation. A release-ready claim needs all P0 lanes passing, or an explicit release-owner decision for any accepted risk.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Require routing invariants plus live parity evidence | Prevents router-only false confidence and protects design usefulness | Requires more evidence collection | 9/10 |
| Accept router/advisor invariants as release proof | Fast and easy to automate | Misses weak design quality and live usefulness failures | 3/10 |
| Require only manual reviewer approval | Captures taste and usefulness | Weak repeatability and poor baseline discipline | 5/10 |

**Why this one**: The combined gate is the simplest approach that proves both OpenCode-native behavior and Claude Design-like usefulness without treating either track as sufficient by itself.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Release claims become evidence-backed instead of route-backed.
- Design quality failures can block release even when routing succeeds.
- md-generator preservation remains visible as a P0 release lane.

**What it costs**:
- More benchmark and manual review effort. Mitigation: use a fixed golden prompt corpus and repeatable release report schema.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Review effort delays release | Medium | Keep prompt corpus bounded and reuse it for future releases |
| Manual judgments vary | Medium | Use explicit review lanes and record reviewer notes |
| Evidence gaps are discovered late | High | Require readiness checks before release decision |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The task pre-mortem identifies weak parity criteria and router-only false confidence as high risks. |
| 2 | **Beyond Local Maxima?** | PASS | The decision compares router-only, manual-only, and combined gates. |
| 3 | **Sufficient?** | PASS | The gate covers routing, procedure, proof, design quality, manual usefulness, negative controls, and md-generator preservation. |
| 4 | **Fits Goal?** | PASS | The goal is to prove Claude Design-like behavior while preserving OpenCode-native behavior. |
| 5 | **Open Horizons?** | PASS | The benchmark corpus and baseline ledger can be reused for future release gates. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Future benchmark execution must produce separate routing and usefulness verdicts.
- Future release reports must include baseline/current/delta evidence.
- Future failures must route to release-owner decision instead of being hidden.

**How to roll back**: If a release report incorrectly claims readiness, preserve the report, mark it invalid, create a corrected append-only report, and require release-owner review before release proceeds.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Baseline Overwrite and Benchmark Failure Authority

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-05 |
| **Deciders** | Release owner |

### Context

Benchmark discipline fails when new runs overwrite old baselines or when failures are reframed as success without authority. The release gate needs an owner who can decide whether a failure blocks release, is accepted as scoped risk, or requires another implementation pass.

### Decision

**We chose**: Existing baselines are append-only by default, and release owner authority is required for any overwrite, accepted failure, conditional release, or release block.

**How it works**: Benchmark execution creates a new run and compares it against the named baseline. If an overwrite is requested, the release owner records the reason, affected baseline, and replacement run before the old baseline is changed.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Append-only default with release-owner authority | Preserves auditability and clear failure decisions | Requires governance step | 9/10 |
| Auto-overwrite baseline on every release | Simple repeated workflow | Erases regression evidence | 2/10 |
| Never overwrite baselines | Strong audit trail | Can preserve obsolete baselines after intentional criteria changes | 7/10 |

### Consequences

**What improves**:
- No-regression claims remain grounded in recoverable comparison data.
- Failure handling is explicit and accountable.

**What it costs**:
- Release owner must be named before execution. Mitigation: block benchmark execution until authority is assigned.

**How to roll back**: Restore the prior baseline from preserved run artifacts and record the invalid overwrite as a failed release-gate event.
<!-- /ANCHOR:adr-002 -->
