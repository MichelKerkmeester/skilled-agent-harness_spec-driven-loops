---
title: "Feature Specification: Convergence Design and Hardening"
description: "Design (decision-record) a sliding-window convergence mode for forced-depth loops, and implement 4 concrete hardening recommendations: stall alerting, merge-time dedup, per-lineage cost cap, lag-ceiling observability mapping."
trigger_phrases:
  - "sliding window convergence design"
  - "stall watchdog alerting"
  - "per lineage token cost budget"
  - "lag ceiling observability mapping"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/009-research-backlog-remediation/009-convergence-design-and-hardening"
    last_updated_at: "2026-07-01T08:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from research.md F-013 and F-016 (Tier2 #16,#17)"
    next_safe_action: "Author plan.md and tasks.md, then dispatch implementation to MiMo v2.5 ultraspeed"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Is a sliding-window convergence mode worth implementing now, or should this phase deliver only the decision-record/proposal and defer implementation to a follow-up, given research.md itself marks it needs-design and not directly observed as a live problem in the actual runs so far?"
    answered_questions: []
---
# Feature Specification: Convergence Design and Hardening

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 9 |
| **Predecessor** | 008-convergence-threshold-and-forced-depth-flag |
| **Successor** | 010-validate-sh-template-detection |
| **Handoff Criteria** | A decision-record exists proposing (not necessarily shipping) a sliding-window convergence mode; all 4 named hardening items are implemented and tested |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two distinct, lower-severity items from `research/research_archive/20260701T071133Z-gen1/research.md` §4.3-4.4:
- **F-013 (needs-design)**: the rolling-average newInfoRatio calculation's denominator grows with iteration count, which glm hypothesizes increasingly suppresses genuinely-novel late-loop discoveries below a fixed threshold regardless of whether real novelty still exists — not directly observed as a live failure in any run so far (neither lineage reached iteration 30+ until the forced-depth generation-2 re-run, which is a new data point worth checking against this hypothesis once it completes).
- **F-016**: four concrete, independently actionable hardening recommendations: (1) stall-watchdog alerting on the observability event stream, (2) explicit finding-deduplication logic at merge time (related to but distinct from child 001's schema-tolerance fix — this is about genuine near-duplicate findings across lineages, not schema mismatches), (3) a per-lineage token/cost budget cap, (4) `lagCeiling`-to-observability-status mapping so operators see backpressure on the dashboard.

### Purpose
Produce a decision-record evaluating whether/how a sliding-window convergence mode should work (design only — implementation is a follow-up unless the design turns out to be trivial), and implement the 4 concrete hardening items, which don't require new algorithm design.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write `decision-record.md` proposing a sliding-window convergence mode (e.g. average newInfoRatio over the last N iterations rather than full history) as an alternative `convergenceMode` value, alongside the existing `default`/`off` modes — cite the actual generation-2 forced-depth run's data (once available) as supporting/refuting evidence for whether denominator-drag is real.
- Implement stall-watchdog alerting: detect when a lineage's observability event stream goes quiet beyond a threshold and emit an alert-class event.
- Implement merge-time near-duplicate dedup for genuinely similar (not identical) findings — check whether `fanout-merge.cjs`'s existing `enableNearDuplicateDedup` option already covers this, since prior code already references it; if so, this may just need enabling/documenting rather than building from scratch.
- Implement a per-lineage token/cost budget cap that halts a lineage gracefully when exceeded.
- Map `lag_ceiling_exceeded`/`lag_ceiling_abort` events to typed observability statuses visible on the dashboard.

### Out of Scope
- Actually implementing the sliding-window convergence mode itself (design/decision-record only, per the Level-2 scope split above) — flag as a clear follow-up item if the decision-record concludes it should be built.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `decision-record.md` (new) | Create | Sliding-window convergence design proposal |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Stall alerting, cost budget cap, lag-ceiling status mapping |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | Modify | Near-duplicate dedup enable/verify (check `enableNearDuplicateDedup` usage first) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A decision-record exists evaluating the sliding-window proposal | File exists, cites real evidence (including generation-2 data if available by the time this is implemented), and reaches an explicit recommendation (build now / defer / not needed) |
| REQ-002 | Stall-watchdog alerting implemented | New test: a simulated quiet-stream triggers an alert-class event |
| REQ-003 | Per-lineage cost budget cap implemented | New test: a lineage exceeding the configured budget halts gracefully rather than running unbounded |
| REQ-004 | Lag-ceiling events map to typed observability statuses | New test: `lag_ceiling_exceeded`/`lag_ceiling_abort` produce a typed (not raw/unknown) dashboard status |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Near-duplicate dedup confirmed working or explicitly enabled | Either confirm `enableNearDuplicateDedup` already covers this with a test, or wire it up if it's currently unused/disabled by default |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 4 hardening items have a passing regression test.
- **SC-002**: Decision-record reaches an explicit, evidence-based recommendation on the sliding-window design.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Scope | 4 independent hardening items in one phase is a wide surface | Risk of shallow implementation on any one item | Each item gets its own explicit test; document any deferred sub-item clearly rather than silently skipping |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the sliding-window mode should actually be implemented in this phase or deferred — see frontmatter open_questions; resolve based on what the decision-record concludes.
<!-- /ANCHOR:questions -->
