---
title: "Implementation Plan: Phase 7 - Webflow routing benchmark and deep review"
description: "Benchmark compiled routing and boundaries for mcp-webflow, verify advisor recall, then run an independent deep review with evidence-backed resolution or approved deferral."
trigger_phrases: ["webflow benchmark plan", "webflow deep review plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/007-routing-benchmark-and-deep-review"
    last_updated_at: "2026-08-02T21:10:00Z"
    last_updated_by: "pi"
    recent_action: "Created the benchmark and deep-review plan"
    next_safe_action: "Wait for Phase 6"
    blockers: ["Hub registration is pending"]
    key_files: ["spec.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7 - Webflow routing benchmark and deep review

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY
| Aspect | Value |
|--------|-------|
| **Workflows** | Hub compiled-routing benchmark; `/deep:review` for independent review |
| **Inputs** | Registered mode, router vocabulary, compiled-routing scenarios, packet docs |
| **Outputs** | Dated routing run report, boundary and recall evidence, review verdict |
| **Safety** | Read-only benchmark; no Webflow mutation; findings verified before acting |

Benchmark first, review second. Review fan-out uses the operator-designated high-capability executors (GPT-5.6 LUNA MAX FAST / GPT-5.6 SOL HIGH FAST tiers) and treats every finding as a hypothesis to confirm against the real surface before any fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- [ ] Phase 6 registration validated and generated assets fresh.
- [ ] Compiled-routing suite includes Webflow scenarios.
- [ ] Baseline report is current.

### Definition of Done
- [ ] Dated run report records pass/fail for every Webflow and boundary scenario.
- [ ] Advisor recall proven for representative prompts.
- [ ] `review-report.md` verdict issued; P0 count zero; P1 deferrals operator-approved.
- [ ] Findings reconciled against baseline with delta.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Scenario-driven routing evidence, then independent adversarial review.

### Key Components
- **Compiled-routing suite**: Webflow intents plus sibling-mode confusion cases.
- **Boundary matrix**: intent -> expected mode for Webflow, Figma, Chrome DevTools, ClickUp, and generic tool-bridge phrasings.
- **Advisor recall probes**: representative Webflow prompts through the skill-advisor surface.
- **Deep review**: `/deep:review` state machine with convergence; findings recorded with severity and reproduction path.

### Data Flow
Suite run -> report -> baseline reconciliation -> review scope -> review-report -> verdict -> handoff to Phase 8.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `benchmark/reports/compiled-routing/` | Run history | Add dated Webflow run | Report contents and pass/fail evidence |
| `benchmark/reports/baseline/` | Known findings | Reconcile deltas | Findings referenced in report |
| Skill advisor | Recommendation surface | Probe Webflow recall | Recommendation outputs |
| `review-report.md` | Review artifact | Create in this phase | Verdict and severity record |
| Hub registration | Routing inputs | Read-only here; fix via Phase 6 if findings demand | Re-validation after fixes |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup
- [ ] Load the benchmark and deep-review contracts.
- [ ] Confirm compiled-routing scenarios include Webflow and boundaries.
- [ ] Snapshot baseline findings and current route outputs.

### Phase 2: Benchmark
- [ ] Run the compiled-routing suite and record the dated report.
- [ ] Run boundary matrix cases and advisor recall probes.
- [ ] Reconcile deltas against baseline; record failures and recommendations.

### Phase 3: Deep Review
- [ ] Scope the review to the packet and hub surfaces.
- [ ] Run `/deep:review` iterations to convergence.
- [ ] Verify each finding against the real surface; resolve P0s, approve-defer P1s.
- [ ] Issue the verdict and update summary; hand off to Phase 8.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test Type | Scope | Tools |
|-----------|-------|-------|
| Routing | Webflow and boundary intents | Compiled-routing suite |
| Recall | Advisor recommendation surface | Skill-advisor probes |
| Non-regression | Sibling modes | Full compiled-routing run |
| Review | Packet-wide correctness and safety | `/deep:review` convergence report |
| Safety | No external mutation | Run audit and side-effect log |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 6 registration | Internal | Pending | Nothing to benchmark |
| Compiled-routing suite | Internal | Available | Webflow scenarios cannot run |
| Deep-review workflow | Internal | Available | Manual review would violate workflow lock |
| High-capability executors | External | Available per operator directive | Review depth would degrade |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger**: A benchmark failure or review finding invalidates routing or docs.
- **Procedure**: Revert the failing surface through its owning phase (registration via Phase 6), re-run the affected suite portion, and re-issue the review verdict before closeout. Review artifacts are additive; do not rewrite historical run reports.
<!-- /ANCHOR:rollback -->
