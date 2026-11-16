---
title: "Decision Record: Find why a command routing baseline capture run straight after a skill graph scan reads the state from before the scan"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "010-baseline-capture-after-graph-scan operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/010-baseline-capture-after-graph-scan"
    last_updated_at: "2026-11-16T10:25:10.726Z"
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
# Decision Record: Find why a command routing baseline capture run straight after a skill graph scan reads the state from before the scan

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | A host holds its captured routing values in its own capture file beside the upstream one. | Skipped rows would stop the ratchet from guarding the rows a host changed. | None | goal.md D4, REQ-005, T009 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:61dcb86a-8ff7-4f18-89e0-e1605b16630d:toolu_01DpXRxKmk12gzk1bpuZyDhp:2 -->

Question:
```text
Advisor plan (Barter phase 022 item 4): which form should a host's captured routing values take? A host with its own hub vocabulary gets other values in the two captured fixture files, so two tests fail there.
```

Options:
```text
Host capture file (Recommended)
Skip marked rows
Leave as is
```

Answer:
```text
Host capture file (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
