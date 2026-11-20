---
title: "Decision Record: Phase 8: track-subtrack-regrouping"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "008-track-subtrack-regrouping operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/008-track-subtrack-regrouping"
    last_updated_at: "2026-11-19T17:38:08.786Z"
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
# Decision Record: Phase 8: track-subtrack-regrouping

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Every track gets sub-tracks, or as many as are relevant, rather than only sk-git. | Not stated. | none | specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/008-track-subtrack-regrouping/spec.md |
| Q002 | All ten Skilled tracks are regrouped into 40 sub-tracks, one commit per track, renumbered from 001 in creation order. | Not stated. | none | specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos/008-track-subtrack-regrouping/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01DRjxMrxDnV5BAwfaynkBER:0 -->

Question:
```text
Approve this sub-track map for regrouping sk-git's 19 active packets? live-sync (020, 021, 023, 024), worktrees (022, 026, 029, 035, 038), commit-and-push-gates (025, 027, 030, 032, 033, 034, 037), history-and-hygiene (028, 031, 036). Each sub-track renumbers from 001 in creation order. Moving changes every packet's id, so older commits' Spec: trailers will name the old paths.
```

Options:
```text
Approve as proposed (Recommended)
Keep the old numbers
Pick another track
```

Answer:
```text
We should give every track sub tracks or atleast as many as relevant
```

### Q002
<!-- source: claude:1dd4a9a8-36db-41ed-a4d5-da599d436310:toolu_01FDfQkDcXcg3G21Ui8tRv9D:0 -->

Question:
```text
Approve regrouping 10 Skilled tracks into 40 sub-tracks? About 175 packets move, one commit per track, each renumbered from 001 in creation order. The pinned packets hooks-plugins-extensions/028 and sk-code/019 stay where they are. Seven small tracks stay flat.
```

Options:
```text
Approve all ten (Recommended)
Pilot sk-git first
Change some maps
```

Answer:
```text
Approve all ten (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
