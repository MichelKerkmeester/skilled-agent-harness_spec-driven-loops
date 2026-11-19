---
title: "Decision Record: Symlinked runtime: entry guard, project root and empty saves"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "003-symlinked-runtime-root operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/003-symlinked-runtime-root"
    last_updated_at: "2026-11-19T17:37:44.499Z"
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
# Decision Record: Symlinked runtime: entry guard, project root and empty saves

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Handover tasks 1-3 (the core fix) are in scope; the operator asked for more detail on 2 and 3. | Not stated. | none | specs/system-speckit/runtime-and-release/003-symlinked-runtime-root/spec.md |
| Q002 | The alignment scope is narrowed and the S14 spec-packet surface is skipped. | Not stated. | none | specs/system-speckit/runtime-and-release/003-symlinked-runtime-root/spec.md |
| Q003 | Only the alignment battery runs, without the paid review lanes and critic. | Not stated. | none | specs/system-speckit/runtime-and-release/003-symlinked-runtime-root/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:beff7f58-e294-4bce-a7d4-93d8d56375c6:toolu_01V2DdVHpoXhkuGYwBQMk8tq:1 -->

Question:
```text
Which handover tasks are in scope?
```

Options:
```text
1-3 core fix (Recommended)
4 doctor project_owned
5 .skilled/specs decision
```

Answer:
```text
1-3 core fix (Recommended), tell me more about 2,3
```

### Q002
<!-- source: claude:beff7f58-e294-4bce-a7d4-93d8d56375c6:toolu_01KkWkNmUQrBep8hsVNpTxDK:0 -->

Question:
```text
Alignment scope for commit 51d9907db3 (HEAD vs origin/main). The scope also picked up 7,604 uncommitted files that aren't mine, mostly the specs/hooks deletions already in the working tree, so the spec-packet surface S14 would replay 1,965 files. My commit is 2 code files plus packet 037, which already passes strict validation. Surfaces that fire: S1 code vs sk-code, S3 feature catalog, S4 playbooks, S5 READMEs, S6 changelogs, S13 env docs, S14 spec packets, S15 CI parity. How should the run go?
```

Options:
```text
Narrow, skip S14 (Recommended)
Approve all
Cancel
```

Answer:
```text
Narrow, skip S14 (Recommended)
```

### Q003
<!-- source: claude:beff7f58-e294-4bce-a7d4-93d8d56375c6:toolu_01KkWkNmUQrBep8hsVNpTxDK:1 -->

Question:
```text
After the battery, should the four paid review lanes plus the critic run (preset opencode-go: cli-opencode deepseek-v4.1-flash at max, for both lanes and critic)?
```

Options:
```text
Battery only (Recommended)
Approve lanes
```

Answer:
```text
Battery only (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
