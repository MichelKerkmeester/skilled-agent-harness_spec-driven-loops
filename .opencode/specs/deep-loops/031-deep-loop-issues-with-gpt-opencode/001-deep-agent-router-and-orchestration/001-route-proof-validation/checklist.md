---
title: "Verification Checklist: Route-Proof Validation"
description: "Verification Date: TBD"
trigger_phrases: ["verification", "checklist", "route-proof-validation"]
importance_tier: "critical"
contextType: "implementation"
_memory: { continuity: { packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/001-deep-agent-router-and-orchestration/001-route-proof-validation", last_updated_at: "2026-06-30T15:30:00Z", last_updated_by: "opencode-gpt", recent_action: "Checklist stub scaffolded", next_safe_action: "Complete during implementation", blockers: [], session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "031-001-001-checklist", parent_session_id: "031-001-phase-parent" }, completion_pct: 0, open_questions: [], answered_questions: [] } }
---
# Verification Checklist: Route-Proof Validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

## FUNCTIONAL
- [ ] Route-proof fields present in iteration/delta records for all 4 modes
- [ ] Wrong-mode (schema-valid) artifact is REJECTED (F27 closed)
- [ ] Native/Claude baseline still passes (no false rejects)

## EVIDENCE + CITATIONS
- [ ] Prior-research evidence base resolved (recovered OR formally accepted-as-axiom with decision-record)
- [ ] C1 (ai-council mode), C3 (predecessor_research path) fixed

## VALIDATION
- [ ] `validate.sh --strict` passes on this phase
