---
title: "Decision Record: Phase 6: purpose-carry-follow-ups"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-purpose-carry-follow-ups operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/006-purpose-carry-follow-ups"
    last_updated_at: "2026-11-14T07:30:42.706Z"
    last_updated_by: "decision-record-writer"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 6: purpose-carry-follow-ups

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The orchestrating session applies the plan verifier's fixes itself and checks them, instead of another claude2 or DeepSeek run. | Not stated. | None | spec.md Plan Verification of 2026-11-14 |
| Q002 | Phase 010 is built, carrying the Problem Statement's first sentence on the compaction hop. | Not stated. | None | 010-problem-sentence-carry, goal.md D3 |
| Q003 | All four extras go into the plan: phase 011 backfills the 21 empty parents, E2 is widened, the resume purpose_row is pinned in a test and the parent summary names its landing commits. | Not stated. | None | 011-empty-parent-purpose-backfill, 006 plan.md E2, 008 plan.md E9, implementation-summary.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:ef52f514-275d-4013-b7bd-ab365324057d:toolu_014g6y4cDBV6eezJ7UjkrM5K:0 -->

Question:
```text
The verifier passed the purpose-carry remediation plan (phases 006-010) with small wording and test-setup fixes, plus one env rule for phase 008 (run the relaunch suite without AI_SESSION_CHILD). Who should apply those fixes to the plan docs before the DeepSeek build?
```

Options:
```text
I apply them, you check (Recommended)
Fresh Fable 5.2 claude2
DeepSeek dsh worker
```

Answer:
```text
I apply them, you check (Recommended)
```

### Q002
<!-- source: claude:ef52f514-275d-4013-b7bd-ab365324057d:toolu_014g6y4cDBV6eezJ7UjkrM5K:1 -->

Question:
```text
Phase 010 also carries the first sentence of each packet's Problem Statement after a compaction (the why/for-whom), widening the Purpose-only design you approved. Build it?
```

Options:
```text
Build 010 (Recommended)
Skip 010
```

Answer:
```text
Build 010 (Recommended)
```

### Q003
<!-- source: claude:ef52f514-275d-4013-b7bd-ab365324057d:toolu_014g6y4cDBV6eezJ7UjkrM5K:3 -->

Question:
```text
Which optional extras should go into the plan (pick any or none)?
```

Options:
```text
Backfill 21 empty parents
Reword E2 (embeddings)
Pin resume purpose_row
Fix parent summary line
```

Answer:
```text
Backfill 21 empty parents, Reword E2 (embeddings), Pin resume purpose_row, Fix parent summary line
```

<!-- /ANCHOR:operator-answers-verbatim -->
