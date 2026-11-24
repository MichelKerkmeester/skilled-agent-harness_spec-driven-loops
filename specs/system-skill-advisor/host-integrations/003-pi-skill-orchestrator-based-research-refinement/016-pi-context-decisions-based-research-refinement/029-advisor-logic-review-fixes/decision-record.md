---
title: "Decision Record: Fix every finding of the twelve-pass deep review of the system-skill-advisor logic"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "029-advisor-logic-review-fixes operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes"
    last_updated_at: "2026-11-24T09:40:56.624Z"
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
# Decision Record: Fix every finding of the twelve-pass deep review of the system-skill-advisor logic

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The fixes land by commit, merge with origin/main and push once every gate passes. | Not stated. | None | tasks.md T043, plan.md section 7 |
| Q002 | A narrow skill_graph_scan deletes only nodes whose stored source lies under the root it scanned. | Not stated. | None | REQ-001, skill-graph-db.ts deleteMissingNodesUnderRoot |
| Q003 | The launcher keeps its trusted default, and the comments and docs that denied it are corrected. | Any caller can already declare itself trusted, so the default adds no reach. | None | REQ-004, plan.md U13 |
| Q004 | routeSupersession, rollbackGraphMetadataFile, backfillDerivedV2 and readMixedVersion are deleted with their catalog and playbook entries. | Not stated. | None | REQ-005, plan.md U12 and U13b |
| Q005 | scoreAdvisorPrompt stays one function, and a characterization test pins its stage order. | Not stated. | None | REQ-008, tests/scorer/score-stage-order.vitest.ts |
| Q006 | The lifecycle stress file is trimmed, keeping sa-014 and sa-016, the only tests of the live age multipliers. | sa-014 and sa-016 cover live code that no other test reaches. | None | REQ-005, lifecycle-routing-stress.vitest.ts |
| Q007 | The stop-word fix lands with 'review' added to the task-intent words, so 'auto review this PR' stays on sk-code. | It keeps the holdout ratchet at 49 of 63 and the sweep-vocabulary assertion unchanged. | None | REQ-006, fusion.ts TASK_INTENT and skill_advisor.py TASK_INTENT_RE |
| Q008 | The last docs unit runs on cli-pi DeepSeek Flash max as one-change briefs after the Codex quota ran out. | It could start at once instead of waiting about three hours for the quota reset. | None | tasks.md T029, implementation-summary.md How It Was Delivered |
| Q009 | The verification review passes run on cli-pi DeepSeek V4.1 Flash max instead of native Opus. | Not stated. | None | REQ-014, tasks.md T042 |
| Q010 | The fixes are committed locally first, and further review passes read the committed tree to record every closure before landing. | Not stated. | None | REQ-014, AC-014 |
| Q011 | Generation 5 is extended in place by 4 native Opus passes, followed by 4 Hy4 Flash Free passes. | Not stated. | None | review/deep-review-config.json, review/review-report.md |
| Q012 | The Hy4 Flash Free passes are skipped and the fix plan starts, because cli-opencode review dispatch refuses a dirty primary checkout. | Not stated. | None | review/review-report.md, 029-advisor-logic-review-fixes |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01KRiHZaGsa1kbA6qJzirWdE:2 -->

Question:
```text
How should the fixes land once every gate passes (the advisor suites, the parity and routing ratchets, Python tests, strict validation)?
```

Options:
```text
Commit, merge, push (Recommended)
Commit only
No commit
```

Answer:
```text
Commit, merge, push (Recommended)
```

### Q002
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01JU8fFJbd2nPEnq6LozyuZ3:0 -->

Question:
```text
P1 G5-I1-P1-001: a trusted skill_graph_scan whose skillsRoot is one skill's folder deletes every other skill from the live graph (skill-graph-db.ts:745 'DELETE ... NOT IN' via :976). How should the scan behave?
```

Options:
```text
Scope the delete (Recommended)
Refuse a narrow root
```

Answer:
```text
Scope the delete (Recommended)
```

### Q003
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01JU8fFJbd2nPEnq6LozyuZ3:1 -->

Question:
```text
P2 G5-I2-P2-001: the launcher defaults SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT to 'trusted', but advisor-server.ts:324-326 and the catalog promise that a call with no caller block is untrusted. Any caller can already declare itself trusted, so the default adds no reach. Which side changes?
```

Options:
```text
Fix comment and docs (Recommended)
Make the default untrusted
```

Answer:
```text
Fix comment and docs (Recommended)
```

### Q004
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01JU8fFJbd2nPEnq6LozyuZ3:2 -->

Question:
```text
P2 G5-I3-P2-002: the feature catalog presents supersession routing, rollback and the v2 backfill as live, but routeSupersession, rollbackGraphMetadataFile, backfillDerivedV2 and readMixedVersion are called only from a stress test. What should the fix do?
```

Options:
```text
Correct the catalog (Recommended)
Delete the dead code
Wire them in
```

Answer:
```text
Delete the dead code
```

### Q005
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01JU8fFJbd2nPEnq6LozyuZ3:3 -->

Question:
```text
P2 G5-I4-P2-002: scoreAdvisorPrompt (fusion.ts:1108-1474) is a 366-line pipeline with no stage boundary and no ordering test. How deep should the fix go?
```

Options:
```text
Ordering test only (Recommended)
Split into named stages
```

Answer:
```text
Ordering test only (Recommended)
```

### Q006
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_012QMCf4LoDG9bRy6aT2x6Fo:0 -->

Question:
```text
Lifecycle deletion: you chose to delete the dead lifecycle code 'with its only test'. The stress file lifecycle-routing-stress.vitest.ts also holds sa-014, the only test of the live age-multiplier code (archived, future and deprecated branches), and sa-016, which covers live archive handling. What should happen to that file?
```

Options:
```text
Trim, keep live cases (Recommended)
Delete the whole file
```

Answer:
```text
Trim, keep live cases (Recommended)
```

### Q007
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_012QMCf4LoDG9bRy6aT2x6Fo:1 -->

Question:
```text
Stop-word fix (G5-I1-P2-004): counting only meaningful words makes 'auto review this PR' low-information. Its route moves from sk-code to system-deep-loop. That breaks sk-git-worktree-sweep-vocabulary.vitest.ts:66-69 and drops the holdout ratchet from 49/63 to 48/63. How should I handle it?
```

Options:
```text
Add 'review' to task intent (Recommended)
Defer the stop-word fix
Accept the route change
```

Answer:
```text
Add 'review' to task intent (Recommended)
```

### Q008
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01RNXoc1ANKnSeKvYcbiuhGv:0 -->

Question:
```text
Codex (Luna) hit its usage limit until 12:55, mid-way through U13b, the last unit. U13b is the lifecycle documentation: delete 3 catalog and 2 playbook entries, move one paragraph, fix links and counts, and edit the alias and manifest files. It made no edits before the limit hit. How should I finish it?
```

Options:
```text
DeepSeek Flash, split (Recommended)
Wait for Luna at 12:55
Mistral Vibe, split
```

Answer:
```text
DeepSeek Flash, split (Recommended)
```

### Q009
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01HSbZZpqyZ1Sj5XmJqzcUMq:0 -->

Question:
```text
All fixes are in and every gate is green. REQ-014 needs one more deep-review pass over the fixed code, and its verdict must not be FAIL. The plan said a native (Opus) pass, which you've ruled out. Which executor should run it?
```

Options:
```text
DeepSeek Flash max, cli-pi (Recommended)
Luna xhigh after 12:55
Mistral Vibe DeepSeek
Skip it, land now
```

Answer:
```text
DeepSeek Flash max, cli-pi (Recommended)
```

### Q010
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01FTKZrEPKupHSpJNVWPw3XD:0 -->

Question:
```text
The verification passes found 0 P0 and 0 P1. All 19 original findings are confirmed fixed, plus 2 small P2s the passes raised, which are now fixed too. The review verdict still prints FAIL, for bookkeeping reasons: pass 9's record omitted its closures, the last fixes came after the final pass, and one finding sits in a new file outside the frozen scope. How should I close REQ-014 ('verdict not FAIL')?
```

Options:
```text
Commit, then 1 more pass (Recommended)
Accept, record as-is
Land now, review later
```

Answer:
```text
Commit, then 1 more pass (Recommended)
```

### Q011
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01PviNsS1gM2ACZk8rkVk3nX:0 -->

Question:
```text
'Extend' is only possible in place on generation 5 with its own executor, native Opus: --extend keeps the executor and is refused with fan-out. Hy4 Flash Free (probed just now: opencode-go/hy4-flash-free#high answered) can't join that run. How should the 8 iterations with Hy4 and Opus medium run?
```

Options:
```text
Extend Opus 8, then Hy4 8
Fan-out gen 6, 8 + 8 (Recommended)
Extend Opus 4, then Hy4 4
Fan-out gen 6, 4 + 4
```

Answer:
```text
Extend Opus 4, then Hy4 4
```

### Q012
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01Dp9uDWVfve4e8SAqEyLFXg:0 -->

Question:
```text
The 4 Hy4 Flash Free passes can't run right now. dispatch-iteration.cjs:722-730 refuses every cli-opencode review dispatch while the primary checkout is dirty ('primary worktree must be clean before unrestricted execution'). It has 519 uncommitted entries from other sessions (.pi/settings.json plus a browser-hub review), which I must not touch. Hy4 runs only through OpenCode, and Pi doesn't list it. Generation 6 is open with its lock released, and no pass was spent. How should I proceed?
```

Options:
```text
Skip Hy4, start the fix plan (Recommended)
Wait for a clean primary
Fixes now, Hy4 after
```

Answer:
```text
Skip Hy4, start the fix plan (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
