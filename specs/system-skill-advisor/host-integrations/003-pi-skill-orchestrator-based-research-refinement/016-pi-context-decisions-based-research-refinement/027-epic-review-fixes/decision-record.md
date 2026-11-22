---
title: "Decision Record: Fix the findings of the fresh epic review"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "027-epic-review-fixes operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/027-epic-review-fixes"
    last_updated_at: "2026-11-22T10:37:46.330Z"
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
# Decision Record: Fix the findings of the fresh epic review

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Delete the calibration override, query-class routing and the BM25 length calibration rather than wire them up. | Not stated. | None | REQ-001, REQ-005, spec.md section 3 |
| Q002 | Delete the untracked lane build output from the primary checkout's advisor dist folder. | Not stated. | None | REQ-007, T013 |
| Q003 | Fix every P1 and P2 finding and the drift the fresh review listed, rather than only saving the report. | Not stated. Evidence: yes_no, option false, overlap 0, imperative true, shift false. | None | spec.md section 3, tasks T004 to T014 |
| Q004 | Fix all five Opus verification findings in phase 027, including the two that predate the change. | Not stated. | None | REQ-009, REQ-010, REQ-011, tasks T021 to T025 |
| Q005 | Bump the skill advisor one patch step to 2.0.1.0 and add a changelog entry for these fixes. | Not stated. | None | T027, .skilled/skills/system-skill-advisor/changelog/v2.0.1.0.md |
| Q006 | Resolve the merge conflicts in the four generated trigger-index files by regenerating them on the merged tree. | Not stated. | None | merge commit on worktrees/515-epic-review-fixes |
| Q007 | Add the deep-loop command offers, which shipped under 2.0.1.0 without their own bump, to the v2.0.1.0 changelog in a follow-up commit. | Not stated. Evidence: open_value, option not_applicable, overlap 0, imperative false, shift false. | None | .skilled/skills/system-skill-advisor/changelog/v2.0.1.0.md |
| Q008 | Install dependencies in worktree 517 so the changelog commit runs every pre-commit gate instead of skipping the mirror gate. | Not stated. | None | commit 953e81e9b01 |
| Q009 | Run a fresh read-only review of the skill advisor as shipped at 2.0.1.0 on main. | Not stated. | None | T028, evidence/opus-third-review.md |
| Q010 | A native Opus high subagent does the third review. | Not stated. | None | T028, evidence/opus-third-review.md |
| Q011 | Fix both P1 and every P2 finding of the third review in 027. | Not stated. | None | REQ-012 to REQ-016, T029 to T037 |
| Q012 | Fold the third round into the 2.0.1.0 changelog rather than bumping to 2.0.2.0. | Not stated. | None | .skilled/skills/system-skill-advisor/changelog/v2.0.1.0.md |
| Q013 | Commit the third round on the 518 branch, merge main in, rerun the gates, push origin/main and remove worktree 518. | Not stated. | None | worktrees/518-advisor-review-round-three |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01C8pRMfwHAoTS7iA13QMU8f:2 -->

Question:
```text
Three findings are dead or unreachable settings: the calibration override that nothing calls, query-class routing, and the BM25 length calibration. Should they be deleted or wired up?
```

Options:
```text
Delete all three (Recommended)
Wire all three
Wire calibration only
```

Answer:
```text
Delete all three (Recommended)
```

### Q002
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01C8pRMfwHAoTS7iA13QMU8f:3 -->

Question:
```text
Two untracked build-output leftovers from the removed lane sit in this checkout's dist/ (lanes/semantic-shadow.js plus its .map file, and the embedders/ folder). They're ignored by git and nothing imports them. Can I delete them? This can't be undone, but a rebuild of an older commit would recreate them.
```

Options:
```text
Yes, delete them
No, leave them
```

Answer:
```text
Yes, delete them
```

### Q003
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:chat:9f916b44-4326-48e1-a62b-b443ebcf2633:163e02f9-09ca-40b8-aaac-ad0069b05af5 -->

Question:
```text
Your call: do you want the report saved into the epic, for example as a new phase 027, and the fixes planned? Nothing has been changed yet.
```

Options: none

Answer:
```text
Fix all p1,p2 drift etc
```

### Q004
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01VpLGFF789dYgusDkKBFGSc:0 -->

Question:
```text
The fresh Opus review found five new P2 defects. Items 1 to 3 are gaps in my phase 027 change: the Python native bridge still drops the two location keys, a comment and a catalog line describe the deleted helper, and the new doctor test only runs `--shared-model keep`. Items 4 and 5 predate the change: three `.env.example` threshold keys do nothing, and the Python fallback never applies route exclusions. Which should I fix?
```

Options:
```text
Fix 1 to 3 in 027 (Recommended)
Fix all five in 027
Leave them for now
```

Answer:
```text
Fix all five in 027
```

### Q005
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01WYgghZ2q1pNBJ6xDKnjh7A:1 -->

Question:
```text
These fixes change the skill advisor's behavior: the Python fallback now applies route exclusions, and four documented settings are gone. Should the advisor get a version bump and a changelog entry?
```

Options:
```text
Patch bump + changelog (Recommended)
No bump
```

Answer:
```text
Patch bump + changelog (Recommended)
```

### Q006
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01CcQ8tV4qAuGJszpkFh9mN2:0 -->

Question:
```text
Merging main into worktrees/515-epic-review-fixes conflicted in four files: trigger-index.json, corpus-manifest.json, generation-diagnostics.json and phrase-variants.json. All four are outputs of the trigger-index generator. No source file conflicted. How should I resolve them?
```

Options:
```text
Regenerate them (Recommended)
Abort the merge
```

Answer:
```text
Regenerate them (Recommended)
```

### Q007
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:chat:9e2a49a2-af57-4e4a-a9ff-cdb86b9ed716:70fac6c8-3c74-4ff0-b086-a1ec77ce8d86 -->

Question:
```text
Decision for you: should the 2.0.1.0 changelog get a line for that deep-loop command change? If so, it needs a short follow-up commit.
```

Options: none

Answer:
```text
Yes
```

### Q008
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_019xKPumFB18NLumWSoVn5cp:0 -->

Question:
```text
The changelog line is written and checked, but the commit is blocked. I made worktree 517 without installing dependencies, since the change is docs only. The pre-commit mirror-parity gate needs those dependencies, so its scripts crashed and blocked the commit. Nothing in this commit touches a mirrored file, and the mirror check passes on main: 260 of 260 in sync. How should I get the commit through?
```

Options:
```text
Install deps (Recommended)
Skip the mirror gate
Drop it
```

Answer:
```text
Install deps (Recommended)
```

### Q009
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_019gnadH8TKwvJg3EMjie5Ps:0 -->

Question:
```text
From now on I'll ask decisions with this tool rather than in chat. The epic 016 work is done. The 2.0.1.0 changelog line and both decision entries are on origin/main at bcb6ae7356b, and worktree 517 is removed. One loose end: earlier saves found unrecorded operator answers from other sessions that ended without a save (306ce05f 19, da5c810b 9, df9261d4 5, 31b4908f 3, and a few with 1 or 2). What would you like next?
```

Options:
```text
Stop here (Recommended)
Report orphan answers
Fresh review of 2.0.1.0
```

Answer:
```text
Fresh review of 2.0.1.0
```

### Q010
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01APBtfbY9zUdxKbWdaXmCxs:0 -->

Question:
```text
Which reviewer should do the fresh read-only review of the skill advisor 2.0.1.0 on main? The last two reviews were Fable 5.2 high (via the claude2 account) and native Opus high.
```

Options:
```text
Native Opus high (Recommended)
Fable 5.2 high, claude2
Both, in parallel
```

Answer:
```text
Native Opus high (Recommended)
```

### Q011
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_011pdNJ5BnB2YTthfQ4oShEq:0 -->

Question:
```text
The fresh Opus review found no P0 and two P1s, and I re-ran both myself. P1-a, from my 027 work: the Python native bridge forwards only the two location keys. Nine documented scorer settings, including LANE_WEIGHTS_JSON, the shadow switches, the thresholds, DOC_TRIGGERS and COMPILED_ROUTING, never reach it, so the changelog's 'Documented settings now reach every process that reads them' is false. P1-b, from the other session's deep-loop work: bare 'iterative' or 'iterations' opens a run. 'review the code for the iterative solver' gets /deep:review; the same prompt with 'recursive' gets none. Which should I fix?
```

Options:
```text
Fix both P1s (Recommended)
Fix P1-a only
Fix P1s and the P2s
Report only
```

Answer:
```text
Fix P1s and the P2s
```

### Q012
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_011dxE98X2r4Ni8X9BDAbbsf:0 -->

Question:
```text
These fixes change the advisor's behavior after 2.0.1.0 shipped. The bridge now forwards nine more scorer settings and the private skill roots. 'iterative' as a plain description no longer opens a deep-loop run. The Python fallback gates deep-loop offers. Edits to the exclusion file reach a running daemon. How should the version and changelog handle that?
```

Options:
```text
Bump to 2.0.2.0 (Recommended)
Fold into 2.0.1.0
```

Answer:
```text
Fold into 2.0.1.0
```

### Q013
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_011dxE98X2r4Ni8X9BDAbbsf:1 -->

Question:
```text
Once every gate passes, how far should this round go?
```

Options:
```text
Commit, merge, push (Recommended)
Commit only
```

Answer:
```text
Commit, merge, push (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
