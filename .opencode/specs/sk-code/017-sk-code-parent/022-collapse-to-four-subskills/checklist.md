---
title: "Verification Checklist: Collapse sk-code from 8 sub-skills to 4"
description: "Executed Level 2 verification checklist for the sk-code four-sub-skill collapse: content preserved, routing reconciled, external references repointed, benchmark re-baselined, and all recorded gates passed."
trigger_phrases:
  - "phase 22 checklist"
  - "sk-code four subskills checklist"
  - "collapse sk-code verification"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/022-collapse-to-four-subskills"
    last_updated_at: "2026-07-06T12:00:00.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Four-sub-skill collapse verification evidence recorded"
    next_safe_action: "None; retrospective close-out docs record shipped work"
---
# Verification Checklist: Collapse sk-code from 8 sub-skills to 4

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md defines REQ-001..REQ-007, SC-001..SC-003, files to change, four-sub-skill target shape, zero-loss requirement, routing reconciliation, benchmark re-baseline, and live-mode deferral]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md defines shared workflow doctrine, surface symlinks, animation fold-in, routing reconciliation, benchmark re-baseline, rollback, and dependencies]
- [x] CHK-003 [P1] Deterministic benchmark boundary identified [EVIDENCE: router mode is the CI gate and live-mode benchmark re-baseline is deferred by scope]

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Hub collapsed to exactly four sub-skills [EVIDENCE: SKILL.md remains only under `code-opencode/`, `code-webflow/`, `code-review/`, and `code-quality/`; folders `code-implement`, `code-debug`, `code-verify`, and `code-animation` are gone]
- [x] CHK-011 [P0] Dissolved-mode content preserved [EVIDENCE: `shared/references/workflow_{implement,debug,verify}.md` exists; each workflow reference is symlinked into both `code-opencode/references/` and `code-webflow/references/`]
- [x] CHK-012 [P1] Real assets preserved [EVIDENCE: verify scripts are preserved at `code-opencode/assets/scripts/verify_alignment_drift.py` and `verify_stack_folders.py`; Webflow and universal debugging/verification checklists remain available]
- [x] CHK-013 [P1] Animation content folded into Webflow [EVIDENCE: `code-animation/{references,assets}/*` moved to `code-webflow/{references,assets}/animation/*` as non-skill references/assets]

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Parent hub strict invariants pass [EVIDENCE: parent-skill-check STRICT with `PARENT_HUB_CHECK_STRICT=1` exited 0 on sk-code with all hard invariants passed and 0 warnings]
- [x] CHK-021 [P0] Router vocabulary sync passes [EVIDENCE: parent-hub vocab-sync exited 0 with orphanAliases [], aliasCollisions [], ownershipDrift [], untypedKeywords [], and phantomTypedKeywords []]
- [x] CHK-022 [P1] Rule-copy and Iron Law canary passes [EVIDENCE: check-rule-copies canary exited 0 with all rule invariants present across 4 exact-string files and 3 Iron Law files]
- [x] CHK-023 [P1] Router drift guard passes [EVIDENCE: `sk-code-router-sync.vitest.ts` passed 4/4]

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Routing metadata reconciled [EVIDENCE: `hub-router.json`, `mode-registry.json`, and `shared/references/smart_routing.md` dropped dissolved-mode and `code-animation` routes, with tie-breaks trimmed to quality/review/webflow/opencode]
- [x] CHK-025 [P0] External references repointed [EVIDENCE: agents and specs/docs were repointed off dissolved sub-skills in Stage A; `code-review` wiring in agents/review.md remains intact]
- [x] CHK-026 [P1] Playbook gold and benchmark harness re-baselined [EVIDENCE: 17 manual testing playbook gold files re-translated; three benchmark harness vitests repointed off dissolved modes; `benchmark/router-final` regenerated]

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials touched [EVIDENCE: packet evidence covers sk-code markdown/resources/assets, agents/spec references, verification scripts, benchmark gold, vitests, and router-final outputs; no env values or credential material are part of the evidence set]
- [x] CHK-031 [P1] Offline deterministic route avoids provider exposure [EVIDENCE: router-final re-baseline was deterministic router mode; live mode is intentionally deferred]
- [x] CHK-032 [P1] Rollback is bounded and reversible [EVIDENCE: rollback restores sk-code paths, routing metadata, external references, playbook gold, benchmark harness expectations, and router-final outputs from the prior branch tip]

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec.md, plan.md, and tasks.md describe the same four-sub-skill collapse, zero-loss preservation, routing reconciliation, benchmark re-baseline, and scoped deferrals]
- [x] CHK-041 [P1] Implementation summary updated with actual evidence [EVIDENCE: implementation-summary.md status Complete, completion_pct 100, Files Changed table, Verification table, Known Limitations, and Deviations-from-Plan table]
- [x] CHK-042 [P2] Delivery staging deviation recorded [EVIDENCE: DEVIATION RECORDED — work shipped in two pushed stages, structural collapse then playbook/benchmark re-baseline]

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P2] Live-mode re-baseline deferred with reason [EVIDENCE: DEFERRED WITH REASON — live mode needs configured provider access; router mode is the deterministic CI gate]
- [x] CHK-051 [P2] Harness `intents` deviation recorded with reason [EVIDENCE: SCOPED DEVIATION — one dissolved-mode gold update was required to keep the full skill-benchmark suite green]

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 10/10 |
| P2 Items | 3 | 3/3 |

**Status**: Complete
**Verification Date**: 2026-07-06
**Verified By**: Claude Opus

<!-- /ANCHOR:summary -->
