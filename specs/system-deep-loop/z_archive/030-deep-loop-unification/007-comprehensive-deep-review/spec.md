---
title: "Feature Specification: Comprehensive Deep Review — system-deep-loop"
description: "20-iteration autonomous deep review of the entire system-deep-loop hub (all 4 workflow packets' SKILL.md, references/, assets/, scripts/) for bugs and sk-doc template alignment, via GPT-5.5-fast at high reasoning effort."
trigger_phrases:
  - "system-deep-loop comprehensive review"
  - "deep loop 20 iteration review"
  - "system-deep-loop bug sweep"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/007-comprehensive-deep-review"
    last_updated_at: "2026-07-09T03:31:53.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "20 iterations + remediation complete; all checkers pass"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/SKILL.md"
      - ".opencode/skills/system-deep-loop/deep-research/SKILL.md"
      - ".opencode/skills/system-deep-loop/deep-review/SKILL.md"
      - ".opencode/skills/system-deep-loop/deep-improvement/SKILL.md"
      - ".opencode/skills/system-deep-loop/deep-ai-council/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Spec folder: new phase (007) under 030-deep-loop-unification, distinct from the just-completed 006 template-conformance work — confirmed by operator."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Comprehensive Deep Review — system-deep-loop

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-08 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 of 7 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 006 verified SKILL.md structural template conformance across `system-deep-loop` (already 100%) and fixed a set of soft warnings (asset naming, word count, changelog frontmatter). It did not do a deep, iteration-by-iteration bug/correctness/security/traceability review of the whole tree's actual content — the SKILL.md files' prose, the references/ documentation, the assets/ templates and fixtures, and the scripts/ automation across the hub and all 4 workflow packets.

### Purpose
Run a genuine 20-iteration autonomous `/deep:review` loop (GPT-5.5-fast, high reasoning effort, forced max-iterations) over the entire `system-deep-loop` skill tree, covering correctness, security, traceability (including sk-doc template alignment), and maintainability for the hub and each of its 4 packets, then fix whatever real bugs are found.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `.opencode/skills/system-deep-loop/SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json` (hub tier).
- `.opencode/skills/system-deep-loop/{deep-research,deep-review,deep-improvement,deep-ai-council}/` — SKILL.md, references/, assets/, scripts/, changelog/, README.md for each.
- Cross-cutting sk-doc template alignment (re-confirming 006's fixes are still solid, extending coverage to references/assets/scripts template conformance where sk-doc defines one).
- Any genuine bug found (logic error, broken reference, incorrect script behavior, security issue) — fixed as part of this pass, not just reported.

### Out of Scope
- The live (non-`system-deep-loop`) parts of the repo.
- Re-litigating the hub's two-axis architecture (already canon-clean per `parent-skill-check.cjs`, 0 FAIL/0 WARN, confirmed repeatedly this session).
- `.opencode/specs/descriptions.json` and the SQLite/vector daemon index.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| Any file under `.opencode/skills/system-deep-loop/` with a genuine finding | Modify | Fix confirmed via the review loop's claim-adjudication + independent re-verification |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-001 | 20 forced review iterations complete | `deep-review-state.jsonl` shows 20 `type:"iteration"` records, all passing `verify-iteration.cjs` |
| REQ-002 | All 4 review dimensions covered for the hub and each of the 4 packets | `deep-review-strategy.md` dimension coverage table shows correctness/security/traceability/maintainability touched for each area |
| REQ-003 | Every confirmed P0/P1 finding is fixed and independently re-verified | `review-report.md` Active Finding Registry shows 0 open P0/P1 after remediation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|----------------------|
| REQ-004 | sk-doc template alignment re-confirmed, not just assumed from phase 006 | Fresh `package_skill.py --check` + `parent-skill-check.cjs` runs as part of the review, not stale results |
| REQ-005 | No regression introduced by any fix | Relevant test suites re-run after fixes, pre-existing vs new failures distinguished |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 20/20 iterations complete, mechanically valid (narrative + state + delta artifacts).
- **SC-002**: Final packet verdict (PASS/CONDITIONAL/FAIL) stated with real evidence.
- **SC-003**: Every real bug found is either fixed-and-verified or explicitly deferred with the operator's approval — none silently dropped.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `deep_review_auto.yaml`'s phase_loop contract | Same hand-driven orchestration proven in the prior 5-iteration review this session | Reuse the same dispatch script, reducer, convergence, and verification pattern already working |
| Risk | 20 iterations over a much larger tree could surface a high volume of findings, some low-value | Review noise, wasted remediation effort | Claim-adjudication requires typed evidence for every P0/P1; low-confidence/low-impact findings stay P2 and are not auto-remediated without review |
| Risk | Fixes to live, actively-used skill files could introduce regressions | Runtime behavior of a heavily-used skill family breaks | Every fix independently re-verified; relevant test suites re-run; no fix applied without evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding — spec-folder placement confirmed by the operator (see frontmatter `answered_questions`).
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-001
REQ-002
REQ-003
REQ-004
REQ-005
**Given**
**Given**
**Given**
**Given**
**Given**
-->
