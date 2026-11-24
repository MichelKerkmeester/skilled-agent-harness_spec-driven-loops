---
title: "Decision Record: Run the advisor suite on hook-only changes and delete the production-dead advisor helpers"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "030-advisor-ci-filter-dead-helpers operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/030-advisor-ci-filter-dead-helpers"
    last_updated_at: "2026-11-24T12:22:46.626Z"
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
# Decision Record: Run the advisor suite on hook-only changes and delete the production-dead advisor helpers

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Resolve the test_skill_advisor.py merge conflict by keeping both sides, then rerun the gates. | Not stated. | None | Landing merge 7226b913e47 of child 029 |
| Q002 | Merge origin/main into the primary checkout's local main without pushing. | Not stated. | None | Primary checkout merge 500938fc76f; implementation-summary.md |
| Q003 | Open child 030 for the CI path filter and the four dead helpers. | Not stated. | None | spec.md, REQ-001, REQ-002 |
| Q004 | Report the other sessions' pending answers instead of recording them here. | Not stated. | None | implementation-summary.md |
| Q005 | Build 030 with one-change briefs on cli-pi DeepSeek V4.1 Flash max. | Not stated. | None | plan.md, tasks.md T004-T012 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01GRBxnq2wtqqkyGbEfebvDt:0 -->

Question:
```text
Merging origin/main into the fix branch hit a conflict in a source file, tests/python/test_skill_advisor.py. Both sides only add tests at the same spot: ours adds test_prompt_policy_missing_degrades, and origin/main's deep-loop offer fix (777feef2920) adds six deep-loop tests. Each hunk also adds the matching calls. Nothing is deleted or rewritten on either side. fusion.ts, skill_advisor.py and skill-advisor-cli.ts changed on both sides too, but merged cleanly. How should I resolve it?
```

Options:
```text
Keep both, rerun gates (Recommended)
Abort the merge
```

Answer:
```text
Keep both, rerun gates (Recommended)
```

### Q002
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01BkbSqG5uHHbQetwxbxaRd6:0 -->

Question:
```text
Your primary checkout's local main holds 7 unpushed commits from another session (mcp-browser-use fixes and an advisor lexical-anchor change), and origin/main now has this work on top of b9e9b3283b2. The primary's working tree also has that session's 519 dirty files. What should happen to local main?
```

Options:
```text
Leave it to its session (Recommended)
Merge origin/main now
```

Answer:
```text
Merge origin/main now
```

### Q003
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01BkbSqG5uHHbQetwxbxaRd6:1 -->

Question:
```text
Two leftovers sit outside the 029 scope: the CI workflow path filter that would run the new parity tests on a hook-only change, and the dead code with no production caller (redirect-metadata.ts, sanitizeEnvelopeSkillLabel, filterDefaultRoutable, rollbackDerivedBlock). What should happen to them?
```

Options:
```text
New follow-up packet (Recommended)
Record only
CI filter only
```

Answer:
```text
New follow-up packet (Recommended)
```

### Q004
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01BkbSqG5uHHbQetwxbxaRd6:2 -->

Question:
```text
Five other sessions ended with operator answers not yet in a decision record (5, 14, 11, 7 and 2 answers). Those answers came from those sessions, so this session wrote no entries for them. What should I do?
```

Options:
```text
Just report them (Recommended)
List their questions
```

Answer:
```text
Just report them (Recommended)
```

### Q005
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01WY3n4hwX6k5bM2CCmHRq5V:1 -->

Question:
```text
Which executors should build 030?
```

Options:
```text
DeepSeek Flash, cli-pi (Recommended)
Luna xhigh after reset
```

Answer:
```text
DeepSeek Flash, cli-pi (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
