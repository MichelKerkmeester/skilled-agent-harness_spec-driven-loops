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
| Q006 | Both system-skill-advisor and sk-git get a changelog entry. | Not stated. | None | system-skill-advisor/changelog/v2.0.5.0.md, sk-git/changelog/v1.11.15.0.md |
| Q007 | Both entries take a patch bump: advisor 2.0.5.0, sk-git 1.11.15.0. | Not stated. | None | SKILL.md version of each skill, both changelog entries |
| Q008 | The changelog command ran through cli-pi DeepSeek workers with the markdown persona. | Not stated. | None | both changelog entries |
| Q009 | Worktree 540 and its branch were removed after the template alignment landed. | Not stated. | None | commit 582d2f3814c |
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

### Q006
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_0127BVSHbr4zVCgR2zuKJzUL:0 -->

Question:
```text
Which components get a changelog entry? system-skill-advisor is at 2.0.4.0, and that entry covers another session's lexical-anchor work, not ours. sk-git is at 1.11.14.0, which covers the 007 lockfile fix.
```

Options:
```text
Both (Recommended)
system-skill-advisor only
sk-git only
```

Answer:
```text
Both (Recommended)
```

### Q007
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_0127BVSHbr4zVCgR2zuKJzUL:1 -->

Question:
```text
Version bump? 029 removed lifecycle code and the catalog and playbook entries for it, but none of it was public advisor API. 030 and 008 are fixes.
```

Options:
```text
Patch for both (Recommended)
Minor for the advisor
Auto-detect
```

Answer:
```text
Patch for both (Recommended)
```

### Q008
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_0127BVSHbr4zVCgR2zuKJzUL:2 -->

Question:
```text
The command hard-blocks unless the @markdown agent runs it, and you ruled out Claude agents earlier. How should it run?
```

Options:
```text
cli-pi DeepSeek, markdown (Recommended)
Native @markdown agent
Luna xhigh, cli-codex
```

Answer:
```text
cli-pi DeepSeek, markdown (Recommended)
```

### Q009
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_018VtRHypXzbSAoMFFWHAkqb:0 -->

Question:
```text
The corrected entries are on origin/main (582d2f3814c). Should I remove worktree 540 (/Users/michelkerkmeester/worktrees/public/540-changelog-template-alignment) and its branch? It is clean and fully on origin/main. Removing it first stops the advisor daemon its provisioning started, then deletes its gitignored node_modules, dist and database. To undo, re-create it from origin/main.
```

Options:
```text
Remove it (Recommended)
Keep it
```

Answer:
```text
Remove it (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
