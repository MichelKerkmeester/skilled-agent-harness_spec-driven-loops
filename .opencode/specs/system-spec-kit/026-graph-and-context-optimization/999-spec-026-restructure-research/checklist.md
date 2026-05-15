---
title: "Checklist: 999 — 026 restructure research"
description: "Verification checklist for the 999 research packet. P0 blocks claiming research complete; P1 blocks executing the restructure; P2 polish."
trigger_phrases:
  - "999 checklist"
  - "026 restructure checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/999-spec-026-restructure-research"
    last_updated_at: "2026-05-15T22:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored Level 2/3 checklist with CHK-NNN identifiers"
    next_safe_action: "Mark items complete as work progresses"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:5e54e0a4c0a4f08a9f9eaa6f4f88b6e2b5fb1c5d4c2a8f7e2e0c8a5d4f3b2a1c"
      session_id: "999-checklist"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Checklist: 999 — 026 restructure research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. Summary

Verification surfaces for the 999 deep-research run and the follow-on execution.

| Tag | Meaning |
|-----|---------|
| **[P0]** | HARD BLOCKER — cannot claim done |
| **[P1]** | Required — must complete OR get user approval |
| **[P2]** | Optional — polish, defer with documented reason |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:p0 -->
## 2. P0 — Blocks claiming research complete

- [ ] CHK-001 [P0] All 40 iter outputs exist under `research/iterations/iteration-001.md` through `iteration-040.md`, each ≥ 500 bytes
- [ ] CHK-002 [P0] `research/deep-research-state.jsonl` has 40 valid rows, one per iter
- [ ] CHK-003 [P0] Each iter JSONL row has required fields: iter_id / timestamp_utc / executor / model / track / status / findings_count
- [ ] CHK-004 [P0] `research/research.md` exists post-synthesis; cites every iter; follows the heading structure from `research/prompts/synthesis.md`
- [ ] CHK-005 [P0] `resource-map.md` authored at the packet root with 4 sections: current state / proposed state / migration plan / recall optimization
- [ ] CHK-006 [P0] Strict-validate exits 0 on the 999 packet
- [ ] CHK-007 [P0] All iter + synthesis commits land on `main` (no feature branch)
<!-- /ANCHOR:p0 -->

---

<!-- ANCHOR:p1 -->
## 3. P1 — Blocks executing the restructure

- [ ] CHK-008 [P1] Multi-AI council review verdict is APPROVE or APPROVE_WITH_ADJUSTMENTS
- [ ] CHK-009 [P1] Any council-requested adjustments incorporated into `resource-map.md` before execution
- [ ] CHK-010 [P1] `decision-record.md` captures the major architectural choices with rationale
- [ ] CHK-011 [P1] Migration plan in `resource-map.md` is ordered (merge first, delete after, parent-doc updates last)
- [ ] CHK-012 [P1] Every proposed delete has a delete-reason citing the iter that justified it
- [ ] CHK-013 [P1] Every proposed merge has a retained-target citing the iter that justified it
- [ ] CHK-014 [P1] Implementation strategy documented: deepseek-v4-pro via cli-opencode primary, cli-devin fallback, SWE-1.6 fallback
- [ ] CHK-015 [P1] Recovery baseline commit hash captured for rollback
- [ ] CHK-016 [P1] HEAD baseline commit recorded before executing the restructure
- [ ] CHK-017 [P1] All 999 mutations are read-only outside the 999 packet
- [ ] CHK-018 [P1] `git rm -rf 999-spec-026-restructure-research/` cleanly removes the packet without affecting other 026 children (verified by the follow-on)
<!-- /ANCHOR:p1 -->

---

<!-- ANCHOR:p2 -->
## 4. P2 — Polish

- [ ] CHK-019 [P2] Every iter prompt verified to match its iter contract (framework / pre-planning / scoped RQ / output contract)
- [ ] CHK-020 [P2] Iter outputs have ≥ 3 file:line citations per claim (research-iter contract floor)
- [ ] CHK-021 [P2] `research/research.md` provenance section maps every finding to its source iter
- [ ] CHK-022 [P2] Sample-query proof points (iter 040) show ≥ 2 hops saved on average
- [ ] CHK-023 [P2] All 999 packet docs pass sk-doc validate
- [ ] CHK-024 [P2] The 999 packet is marked for deletion in the follow-on restructure packet (not deleted by 999 itself)
<!-- /ANCHOR:p2 -->
