---
title: "Feature Specification: Comprehensive deep review of the deep-loop + skill-system trio (152/153/155)"
description: "An operator-directed, 50-seat-budget deep review of three sibling packets — 152-deep-loop-workflows (the 9-phase merge), 153-mcp-skill-install-doctor-standardization, and 155-parent-nested-skill-pattern — run as an orchestrated-wave deep review to surface release-readiness gaps with file:line evidence and a prioritized remediation plan. Read-only: it produces no production code, only the review report and the plan."
trigger_phrases:
  - "deep-loop skill-system trio review"
  - "152 153 155 comprehensive deep review"
  - "deep-loop review report remediation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-deep-loop-skill-system-review"
    last_updated_at: "2026-06-15T19:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored control docs for the delivered review workspace"
    next_safe_action: "Open the remediation phase from the P1 trio plus sk-doc split"
    blockers: []
    key_files:
      - "review/review-report.md"
      - "review/deep-review-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-156-deep-loop-skill-system-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does this packet ship production code? (No — it is a read-only review producing review-report.md plus a remediation plan)"
      - "Does the verdict hold at the discovery budget used? (Yes — round-2 converged; pushing to the full 50-seat budget adds P2s, not a verdict change)"
---
# Feature Specification: Comprehensive deep review of the deep-loop + skill-system trio (152/153/155)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Type** | Read-only deep review (review workspace, not a feature packet) |
| **Reviews** | `../152-deep-loop-workflows`, `../153-mcp-skill-install-doctor-standardization`, `../155-parent-nested-skill-pattern` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three sibling packets landed in close succession and need a release-readiness check before the trio is called "done": `152-deep-loop-workflows` (the 9-phase merge that folded the five deep-loop mode packets into one parent skill, including a destructive old-skill-deletion phase), `153-mcp-skill-install-doctor-standardization` (new install/doctor scripts), and `155-parent-nested-skill-pattern` (the parent-nested-skill formalization). The risk surface is completion-honesty (did the destructive phase actually run its release gates?), dead-path fallout from the deletion, and post-rename doc staleness — none of which a single linear read reliably catches. The operator also flagged the `sk-doc` `skill_creation.md` file (1138 lines) as a dissection candidate and wanted it mapped as a concrete remediation item.

### Purpose
Run a comprehensive, evidence-grounded deep review across the three packets — operator-directed at a 50-seat budget, executed as an orchestrated-wave review with adversarial round-2 verification — and deliver one report at `review/review-report.md` carrying a verdict, file:line findings triaged P0/P1/P2, the list of refuted hypotheses, and an ordered remediation plan (with the operator-requested `skill_creation.md` split fully mapped). This packet produces no production code; the remediation is a follow-on phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A read-only deep review of three packets: `152-deep-loop-workflows`, `153-mcp-skill-install-doctor-standardization`, `155-parent-nested-skill-pattern`.
- Orchestrated-wave execution: in-process scope-mapping → discovery seats → orchestrator-executed resolution check → round-2 adversarial-verify seats prompted to *refute* every escalated P0/P1.
- Executor stack per `review/deep-review-config.json`: `claude2 opus-4.8` read-only primary, `cli-opencode gpt-5.5-fast xhigh` fallback; orchestrator writes all iteration/delta/state (Gate-3 safe).
- The deliverable `review/review-report.md` — verdict, surviving findings with file:line evidence, refuted-by-verification list, and an ordered remediation plan.
- A full map of the operator-requested `sk-doc` `references/skill_creation.md` dissection (the split target + the live inbound refs to repoint), recorded as the top non-P1 remediation item.

### Out of Scope
- Implementing any fix. The P1 trio (152 metadata reconciliation, the failing sk-doc test, the stale 155 `key_files`), the `skill_creation.md` split, and the P2 dead-path sweep are all remediation work that lands in the follow-on phase, not here.
- Producing any production code, behavior change, or migration — this is a review workspace.
- Exhaustive coverage to the full 50-seat budget. The review converged in round-2; the remaining surface is lower-yield P2-hunting and is available on request, not run here.
- Re-reviewing packets outside the trio, or re-litigating already-shipped 152 merge decisions beyond their release-readiness.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | This review-workspace spec (control doc). |
| `plan.md` | Create | How the review was run, verified, and handed off. |
| `tasks.md` | Create | The review → report → handoff task list. |
| `checklist.md` | Create | Verification that the review was sound and the report complete. |
| `implementation-summary.md` | Create | The delivered verdict, seat count, and remediation handoff. |
| `review/**` | Reference only | Already-produced workspace (config, deltas, iterations, report) — referenced, not recreated. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (MUST):** The review covers all three packets (152/153/155) with allocation roughly matching `review/deep-review-config.json` (`152:20, 153:18, 155:12`) and produces file:line evidence for surviving findings.
- **R2 (MUST):** Every escalated P0/P1 is adversarially verified in round-2 by a fresh seat prompted to refute it; findings that do not survive are recorded as refuted, not shipped.
- **R3 (MUST):** Execution stays read-only — seats analyze only, the orchestrator writes all `review/` state (Gate-3 safe); no production file is mutated by the review.
- **R4 (MUST):** `review/review-report.md` carries a verdict, the surviving-findings triage (P0/P1/P2), the refuted list, and an ordered remediation plan including the `skill_creation.md` split map.
- **R5 (MUST):** The packet is a valid Level-2 spec folder: `spec.md` + `plan.md` + `tasks.md` + `checklist.md` + `implementation-summary.md`, `validate.sh --strict` clean (modulo the orchestrator-generated `description.json`/`graph-metadata.json`).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

This review is complete when:
- A verdict is delivered. **Recorded outcome: CONDITIONAL PASS** — the trio is functionally sound (zero P0); the conditions are a contained completion-honesty + dead-path cluster plus routine cleanup.
- The raw findings are reduced through round-2 adversarial verification. **Recorded: 38 raw → 0 P0 / 3 P1 / 35 P2, with ~7 hypotheses refuted** (cold-clone CI gate inert, mutating installers unsafe, broken requires from +1 nesting, loop-lock race as P1, C-plus only-canonical as P1, seam-guard coverage hole, stale skill-graph drift).
- The 3 surviving P1s are named with evidence: (a) 152's destructive 5-skill deletion shipped while the parent claims Complete with its 18 release-blocking gates un-run (no live harm; git-recoverable); (b) a failing `sk-doc` test reading a now-deleted changelog; (c) a stale `key_files` path in `155/003`.
- The operator-requested `sk-doc` `skill_creation.md` dissection is fully mapped as the top remediation item (split target + inbound refs to repoint).
- This packet validates green at Level 2 and the remediation phase is identified as the follow-on.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

**Depends on:** the three reviewed packets (`../152-deep-loop-workflows`, `../153-mcp-skill-install-doctor-standardization`, `../155-parent-nested-skill-pattern`) existing in their shipped form, and the `review/deep-review-config.json` executor stack being reachable.

- **False escalation** (a discovery seat over-reports a P1 that is correct-by-design) — mitigated by the round-2 refute pass, which downgraded/refuted ~7 of the escalated findings.
- **False completion read** (treating a finding as confirmed without opening the cited code) — mitigated by file:line evidence on every surviving finding and an orchestrator-executed resolution check (the 23-require resolution that refuted the "broken requires" hypothesis).
- **Premature convergence** (calling the verdict before the surface is covered) — the report states the coverage honestly: round-2 converged, ~15 verified passes covered the high-value surface, and the remaining surface is lower-yield P2-hunting that would not change the verdict.
- **Executor availability** — `claude2 opus-4.8` session limits or the opus-budget window can exhaust mid-run; the documented fallback is `cli-opencode gpt-5.5-fast xhigh`, used for the overflow seats.

Rollback is not applicable — the review mutates no production state; the workspace is additive evidence.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Read-only safety:** no production file is written by the review; the orchestrator owns all `review/` state writes (Gate-3 safe).
- **Evidence integrity:** every surviving finding cites file:line; refuted hypotheses are recorded so they cannot be silently re-escalated.
- **Convergence honesty:** the verdict is reported as stable only because round-2 converged; the un-run remaining budget is disclosed, not hidden behind a "fully covered" claim.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A finding that is correct-as-observed but correct-by-design (e.g. the C-plus only-canonical guard, the runtime-scoped seam-guard) — downgraded to P2 with the design rationale, not shipped as a defect.
- A hypothesis that looks alarming at scope time but is refuted on execution (e.g. "broken requires from the +1 nesting" — all 23 cross-skill requires resolve) — recorded in the refuted list to prevent re-litigation.
- A real false-completion claim with no live harm (152's destructive deletion is git-recoverable and the skills are merged + functional) — still surfaced as P1, because the honesty gap is the finding, independent of blast radius.
- A stale metric inside a reviewed packet (153's "85%" validate figure) — checked live (`validate.sh --strict` passes) rather than trusted, flipping the packet to PASS.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Moderate. The blast radius of the review itself is zero (read-only, no production mutation), but the analytical surface is large: three packets, a 9-phase destructive merge, ~38 raw findings, and a round-2 adversarial pass across them. The genuine difficulty is calibration — separating real completion-honesty gaps from correct-by-design behavior — which is why the round-2 refute pass and file:line evidence are load-bearing. Level 2 fits: QA-grade verification discipline without the architectural-decision machinery of Level 3.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None blocking the review (it is delivered). The one operator decision the report hands forward: whether to run the remaining lower-yield surface to the full 50-seat budget (available on request) before opening remediation, or to proceed straight to the P1 trio + `skill_creation.md` split. The report recommends proceeding to remediation, since round-2 converged and the extra budget adds P2s, not a verdict change.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **The deliverable**: `review/review-report.md` (verdict, findings, refuted list, remediation plan).
- **Review config**: `review/deep-review-config.json` (executor stack, allocation, round structure).
- **Evidence**: `review/deltas/iter-00*.jsonl` (per-iteration findings), `review/iterations/iteration-000-scope-foundation.md`.
- **Reviewed packets**: `../152-deep-loop-workflows`, `../153-mcp-skill-install-doctor-standardization`, `../155-parent-nested-skill-pattern`.
- **Top remediation target**: `.opencode/skills/sk-doc/references/skill_creation.md` (the dissection candidate).
