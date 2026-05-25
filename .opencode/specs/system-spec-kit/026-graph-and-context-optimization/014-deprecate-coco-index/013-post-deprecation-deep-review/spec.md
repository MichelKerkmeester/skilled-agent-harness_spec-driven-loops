---
title: "013: Post-deprecation deep review (30 surfaces, cli-devin SWE-1.6) — FAIL (1 P0)"
description: "Independent deep-review of the completed 014 CocoIndex/rerank deprecation across 30 defined surfaces (6 clusters x 4 dimensions) using cli-devin/SWE-1.6 + an orchestrator exec-verify pass. Found 7 residual items (1 P0 GEMINI.md routing, 2 P1, 4 P2) the executor's own greps missed; verdict FAIL routes to remediation."
trigger_phrases:
  - "post-deprecation deep review"
  - "014 deep review 30 surfaces"
  - "cli-devin deep review coco"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Post-Deprecation Deep Review (014 CocoIndex/Rerank Arc)

<!-- SPECKIT_LEVEL: 1 -->

> Deep-review packet. Charter + the 30 surfaces live in `review/deep-review-strategy.md`; the final report in `review/review-report.md`. Executor: cli-devin/SWE-1.6 (4 read-only iters, one dimension each) + orchestrator exec-verify.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete (FAIL verdict — remediation follow-on) |
| **Created** | 2026-05-25 |
| **Branch** | `main` |
| **Depends on** | 002-012 (the deprecation it audits) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 014 deprecation was declared complete, but the session repeatedly found more residual at each grep refinement (`cocoindex`→`ccc`→`ccc_*`), and a pre-review sweep confirmed 4 more misses. The executor demonstrably had pattern/scope blind spots. An independent, systematic deep-review across 30 surfaces was needed before declaring the deprecation truly done.

### Purpose
Find what was missed/broken using cli-devin/SWE-1.6 across 4 dimensions (correctness/security/traceability/maintainability), find-only, producing `review-report.md` + a remediation seed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 30 defined surfaces (6 clusters: reference completeness, config/mirror integrity, build/test/dist/type, behavior/runtime, incident blast-radius + kept exceptions, spec/doc/governance) — see `review/deep-review-strategy.md`.
- Execution-only targets (full vitest, MCP smoke, on-disk, advisor routing) via an orchestrator exec-verify pass (cli-devin review-iter is read-only).

### Out of Scope
- Remediation (separate follow-on); editing frozen records; re-litigating the deprecation decision.

### Files to Change
None (find-only review). Outputs under `review/`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 4-dimension coverage via cli-devin/SWE-1.6 | iters 1-4 cover correctness/security/traceability/maintainability; converged |
| REQ-002 | review-report.md with P0/P1/P2 + remediation seed | Produced; verdict recorded |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Exec-verify the execution-only targets | builds/tests/advisor/on-disk checked + folded into the report |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: 30 surfaces covered across 4 dimensions; converged (new-findings 4→2→1→0).
- **SC-002**: Findings evidenced with file:line + claim-adjudication; verdict FAIL (1 active P0).
- **SC-003**: Exec-verify clean (memory typecheck 0, code-graph 562 pass, advisor no mis-route, on-disk clean).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-devin read-only can't run builds/tests | Med | Orchestrator exec-verify pass covers execution targets |
| Risk | Mac swap-thrash on batched iters | Med | One-at-a-time dispatch, SIGKILL between |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. RESOLVED QUESTIONS
- Verdict: **FAIL** (active P0 F001 = GEMINI.md routes to deleted MCP). Routes to a remediation packet. 7 findings (1 P0, 2 P1, 4 P2) + 2 config-note items remediated in-review. See `review/review-report.md`.
<!-- /ANCHOR:questions -->
