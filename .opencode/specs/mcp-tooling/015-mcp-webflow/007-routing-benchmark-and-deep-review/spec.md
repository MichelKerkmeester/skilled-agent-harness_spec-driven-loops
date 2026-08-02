---
title: "Feature Specification: Phase 7 - Webflow routing benchmark and deep review"
description: "Benchmark mcp-webflow routing boundaries and compiled-routing behavior, then run an independent deep review that resolves or explicitly defers every verified finding before closeout."
trigger_phrases: ["webflow routing benchmark", "mcp-webflow phase 7", "webflow deep review"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/007-routing-benchmark-and-deep-review"
    last_updated_at: "2026-08-02T21:10:00Z"
    last_updated_by: "pi"
    recent_action: "Authored the pending benchmark and deep-review contract"
    next_safe_action: "Wait for Phase 6 registration"
    blockers: ["Phase 6 is pending"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7 - Webflow routing benchmark and deep review

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 of 8 |
| **Predecessor** | `006-hub-registration-and-advisor` |
| **Successor** | `008-verification-and-closeout` |
| **Handoff Criteria** | Routing benchmark passes with recorded evidence, the independent deep review issues a verdict, and no P0 finding is unresolved and no P1 deferral is unapproved. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context
This phase proves the registered mode behaves correctly under routing load and independent scrutiny. Benchmarks exercise the compiled-routing suite and confusion boundaries against sibling modes; the deep review checks the whole packet from an independent vantage point.

**Dependencies**: completed Phase 6 registration and current benchmark/deep-review contracts under `mcp-tooling/benchmark/` and `/deep:review`.

**Deliverables**: compiled-routing benchmark report, baseline reconciliation, advisor-recall evidence, boundary findings, independent `review-report.md`, and a verdict with zero unresolved P0 findings.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
Registration is not proof of behavior. Webflow intents can still route to the wrong mode, sibling modes can regress, and the advisor can miss Webflow recall. A packet can also look complete while a reviewer finds safety, documentation, or evidence gaps.

### Purpose
Generate measurable routing evidence and obtain an independent review verdict so closeout (Phase 8) only verifies a mode that demonstrably routes and has no unresolved critical findings.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Run the compiled-routing scenario suite with Webflow intents added in Phase 6; record a dated run report under `benchmark/reports/compiled-routing/`.
- Test routing boundaries: Webflow site/CMS/publish intents must not leak into `mcp-figma`, `mcp-chrome-devtools`, `mcp-click-up`, or other modes, and vice versa.
- Test advisor recall: Webflow prompts surface `mcp-webflow` in skill-advisor recommendations.
- Reconcile findings against the baseline; record failures and recommendations honestly.
- Run `/deep:review` on the packet; produce `review-report.md` with verified findings, severities, and a verdict.

### Out of Scope
- Registration changes (Phase 6 owns them; review findings may propose them).
- Final recursive validation, live smoke, and completion reconciliation (Phase 8).
- Running Phase 1 research lineages again.
- Any production Webflow mutation; benchmark and review are read-only.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/benchmark/reports/compiled-routing/<date>--webflow--<executor>/` | Create | Routing run report and evidence |
| `.opencode/skills/mcp-tooling/benchmark/reports/baseline/` | Modify | Reconcile findings and recommendations |
| `007-routing-benchmark-and-deep-review/review-report.md` | Create | Independent review verdict and findings |
| `.opencode/skills/mcp-tooling/changelog/` | Modify | Record benchmark/review outcome if required |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Benchmark Webflow routing | Compiled-routing suite runs with Webflow scenarios and a dated report records pass/fail evidence |
| REQ-002 | Prove boundary isolation | Webflow intents resolve only to `mcp-webflow`; sibling-mode intents do not resolve to it |
| REQ-003 | Prove advisor recall | Skill-advisor recommendation returns `mcp-webflow` for representative Webflow prompts |
| REQ-004 | Run independent deep review | `review-report.md` records verified findings with severity and a verdict |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Resolve or defer findings | No P0 unresolved; every P1 deferral has operator approval and is recorded |
| REQ-006 | Reconcile with baseline | Findings reference the baseline and state the delta in routing behavior |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: Benchmark report shows correct resolution for all Webflow scenarios and no sibling regressions.
- **SC-002**: Review verdict is explicit; P0 count is zero after resolution.
- **SC-003**: Every finding carries evidence and a resolution or approved-deferral record.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 6 registration | Nothing to benchmark | Block until registry/router are live |
| Risk | Boundary confusion with design modes | Wrong mode selected for design-pairing requests | Explicit confusion scenarios in the suite |
| Risk | Advisor misses recall | Mode undiscoverable despite registration | Representative recall prompts across phrasing variants |
| Risk | Reviewer finding treated as fact | Wrong fix or false alarm | Findings are hypotheses until reproduced against real symptoms |
| Risk | Benchmark run mutates state | Corrupted evidence | Read-only runs; snapshot inputs before execution |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- Which executor and reasoning tier should the review fan-out use per the operator's model directive?
- Do current baseline findings already predict Webflow routing failures that the suite must include?
<!-- /ANCHOR:questions -->
