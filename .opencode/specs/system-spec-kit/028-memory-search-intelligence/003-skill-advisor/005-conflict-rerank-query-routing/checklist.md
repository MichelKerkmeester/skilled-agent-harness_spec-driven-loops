---
title: "Verification Checklist: Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)"
description: "Verification Date: 2026-06-19. Default-off C1/QCR/C6 scorer seams implemented and verified; live promotion gates pending."
trigger_phrases:
  - "advisor conflict rerank routing checklist"
  - "C1 QCR C6 deferred checklist"
  - "skill advisor deferred routing gate checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/005-conflict-rerank-query-routing"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified default-off C1/QCR/C6 scorer seams with typecheck and broad advisor vitest"
    next_safe_action: "Run live conflict and benchmark gates"
    blockers: []
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-005-conflict-rerank-query-routing"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

**Sub-phase state:** all three candidates have default-off code seams and deterministic unit coverage. Live/default promotion remains pending: C1 needs live conflict-edge evidence, QCR needs held-out routing-quality evidence, and any ranking flip needs benchmark acceptance. Packet 030 was not touched.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..007 with per-candidate gates) — evidence: spec.md §4
- [x] CHK-002 [P0] Technical approach defined in plan.md (gate-first sequencing; Phases 1-3; affected-surface inventory) — evidence: plan.md §3-4, FIX ADDENDUM
- [x] CHK-003 [P1] Dependencies identified (001 RRF spine for all three; declared `conflicts_with` edge for C1; held-out benchmark + class taxonomy for QCR) — evidence: plan.md §6, spec.md §6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format/`tsc` checks — evidence: `npm run typecheck` exit 0; comment-hygiene checker exit 0 on modified code files; alignment drift PASS
- [x] CHK-011 [P0] No console errors or warnings; existing advisor scorer suite green — evidence: broad vitest 18 files, 127 passed, 2 skipped
- [x] CHK-012 [P1] Error handling implemented — evidence: QCR is disabled by default and preserves `explicit_author` dominance; exact rerank returns an empty map if vectors are unavailable
- [x] CHK-013 [P1] Code follows advisor scorer patterns — evidence: C1 mirrors the comparator surface and metrics pattern; QCR uses `effectiveScorerWeights`; C6 reuses semantic vector scoring
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance criteria met for default-off implementation — evidence: no default-on behavior; live promotion gates remain explicit
- [x] CHK-021 [P0] Default-inert assertion green — evidence: QCR unset equals explicitly false; C1 and C6 require opt-in flags
- [x] CHK-022 [P1] Edge cases tested — evidence: conflict demotion counter, QCR dominance, exact subset cutoff bypass, bounded exact-rerank tiebreak
- [x] CHK-023 [P1] Error scenarios validated for code-only scope — evidence: exact rerank skips when vectors are unavailable; C6 cannot run unless RRF is also enabled; live graph rebuild window remains sibling/live verification scope
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each candidate has a finding class: C1/QCR/C6 are algorithmic scorer-seam changes
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed — evidence: read `graph-causal.ts`, `fusion.ts`, `semantic-shadow.ts`, and existing RRF spine tests before editing
- [x] CHK-FIX-003 [P0] Consumer inventory completed — evidence: affected surfaces are `effectiveScorerWeights`, ranking comparator, semantic vector scorer, and metric definitions
- [x] CHK-FIX-004 [P0] Adversarial table tests added — evidence: `tests/scorer/conflict-query-rerank.vitest.ts`
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion — evidence: empty conflict data, flag unset/false, exact below-cutoff subset, and RRF-required C6 path covered; live graph rebuild remains deferred
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed for code-only scope — evidence: env flags are toggled with `vi.stubEnv`; semantic prompt embedding is cleared after each test
- [ ] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range — deferred: user requested no git commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — evidence: code diff contains env flag names and constants only
- [x] CHK-031 [P0] Input validation: QCR classifies query text for weighting only; no execution or storage path added
- [x] CHK-032 [P1] QCR ships default-off; no live/default weight change occurs unless `SPECKIT_ADVISOR_QUERY_CLASS_ROUTING=true`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (all carry the default-off implementation status + live promotion gates)
- [x] CHK-041 [P1] Code comments adequate — evidence: comment-hygiene checker exit 0 on modified code files
- [x] CHK-042 [P2] README updated (N/A — internal scorer-seam changes)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files avoided — evidence: no live conflict query output or benchmark capture was created
- [x] CHK-051 [P1] scratch/ cleanup N/A — no scratch artifacts created
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 9/10 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-19

**Note:** one P1 item remains open because the user explicitly requested no git commit; evidence is therefore pinned to command output and local diff, not a fix SHA. Live promotion gates remain pending by design.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
