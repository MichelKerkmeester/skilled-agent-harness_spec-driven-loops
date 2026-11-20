---
title: "Decision Record: Review P2 Fixes"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "014-review-p2-fixes operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/014-review-p2-fixes"
    last_updated_at: "2026-11-19T05:30:56.281Z"
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
# Decision Record: Review P2 Fixes

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Keep the merged local branch worktrees/474-advisor-pasted-context-and-crash-fallback. | Criterion 6 stays re-runnable. | None | Parent goal criterion 6, which checks that ref name |
| Q002 | Run /speckit:plan for 014 in autonomous mode. | Not stated. | None | 014-review-p2-fixes/plan.md |
| Q003 | Amend the 016 parent goal so criterion 5 counts fifteen folders and the build order includes 014, and author a child 014 goal. | Not stated. | None | ../goal.md and 014-review-p2-fixes/goal.md |
| Q004 | Build 014 in a sk-git worktree, commit there, and merge to main once both suites, the built checks and strict validation pass. Commit the 014, 015 and 016 spec folders and the parent edits to main first. No push. | Recommended option chosen: the worktree needs the spec docs, and the merge waits on every check. | Parent D6, which approved commits only for worktree 474 | ../goal.md decision D6 |
| Q005 | Run /speckit:implement for 014 in autonomous mode. | Recommended option chosen. | None | This build run |
| Q006 | Run /speckit:implement for 014 in autonomous mode. | Not stated. | Q005 | tasks.md T001 to T020, implementation-summary.md |
| Q007 | Fix every follow-up: the DSH and Vibe receipt gaps, the Python flag producer and every open 015 and 016 finding. | Not stated. | None | REQ-010 to REQ-013, tasks T021 to T036 |
| Q008 | Record the advisor work in the existing v4.1.0.0 entry, following the post-tag precedent. | Not stated. | None | REQ-015, .skilled/changelog/skilled/v4.1.0.0.md |
| Q009 | Release system-skill-advisor as 1.1.1.0 with a component changelog entry. | Not stated. | None | REQ-015, SKILL.md, changelog/v1.1.1.0.md |
| Q010 | Advisor-work probes route to system-skill-advisor, with sk-code accepted for the code-work probes P02 and P05. | Not stated. | None | REQ-014, T032, graph-metadata.json |
| Q011 | Forward both routing threshold variables to the daemon rather than correct the doc. | Not stated. | None | REQ-012, T027, T028, system-skill-advisor-launcher.cjs |
| Q012 | Accept probe P04 on the CLI hub: naming an executor is a deliberate routing signal. | Not stated. | None | REQ-014, T032, implementation-summary.md limitation 4 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:0f4e8d57-c5f3-4b3c-8df3-8c6a224f2889:toolu_01RYKEbgkx2gXQEyz6rFUbvk:1 -->

Question:
```text
The local branch worktrees/474-advisor-pasted-context-and-crash-fallback is merged into origin/main and has no remote copy. sk-git's finish flow says delete merged branches, but goal criterion 6 checks this exact ref name and would fail (exit 128) once it's gone. Keep or delete it?
```

Options:
```text
Keep the branch (Recommended)
Delete with git branch -d
```

Answer:
```text
Keep the branch (Recommended)
```

### Q002
<!-- source: claude:0f4e8d57-c5f3-4b3c-8df3-8c6a224f2889:toolu_0142vGijFkoAz959QLr1LHNN:0 -->

Question:
```text
SpecKit Plan setup for child 016/014-review-p2-fixes. Already settled: Q0 feature = fix the 9 P2 review findings in your order; Q1 = C (new child 014 of packet 016); Q3 prior context = Skip; Q4 intent = fix_bug; Q5 phase decomposition = No. Q2: which execution mode should planning run in? Planning stops before implementation either way.
```

Options:
```text
Autonomous (Recommended)
Interactive
Autopilot
```

Answer:
```text
Autonomous (Recommended)
```

### Q003
<!-- source: claude:0f4e8d57-c5f3-4b3c-8df3-8c6a224f2889:toolu_0142vGijFkoAz959QLr1LHNN:1 -->

Question:
```text
Q8: session goal for this planning run. The parent goal.md will be amended (via /create:goal amend) so criterion 5 counts fifteen folders and the D1 build order includes 014; the parent goal's slice is at 3,996 of 4,000 characters, so the amendment will also trim it to fit.
```

Options:
```text
Amend parent goal (Recommended)
Child goal only
Skip goals
```

Answer:
```text
Amend parent goal (Recommended)
```

### Q004
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833 -->

Question:
```text
Where should phase 014 (the nine review P2 fixes, built by the GPT-6 Luna swarm via cli-codex per parent D2) be built and committed? Parent D6 approves commits only for worktree 474, so this answer is also the commit approval for 014. Nothing is pushed either way.
```

Options:
```text
Worktree, commit, merge (Recommended)
Worktree, commit, no merge
Current branch, uncommitted
```

Answer:
```text
Worktree, commit, merge (Recommended)
```

### Q005
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833 -->

Question:
```text
Which /speckit:implement execution mode for phase 014?
```

Options:
```text
Autonomous (Recommended)
Interactive
```

Answer:
```text
Autonomous (Recommended)
```

### Q006
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_012UB1Sgy3r4sYf6E3yHLKyv:1 -->

Question:
```text
Which /speckit:implement execution mode for phase 014?
```

Options:
```text
Autonomous (Recommended)
Interactive
```

Answer:
```text
Autonomous (Recommended)
```

### Q007
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_014nYjHfZ3vNe4yVR2bJkEBo:0 -->

Question:
```text
Which follow-ups should this cover? Confirmed in code: (1) the DSH and Vibe advisor extensions write a route receipt even when the model gets no brief, and (2) the Python native bridge drops confidenceFloored. Separately, the 015/016 alignment runs left about 40 open doc and metadata findings, triaged as 'Fix' but never assigned.
```

Options:
```text
The two code follow-ups (Recommended)
Code follow-ups plus alignment fixes
Alignment fixes only
```

Answer:
```text
ALL FOLLOW UPS
```

### Q008
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01M6TYZr1yrXopeGvDtCqfq2:0 -->

Question:
```text
C-06: where should the merged advisor work (pasted-reply strip, crash fallback, route receipts, and these fixes) be recorded in the release changelog? v4.1.0.0 is tagged, and the 2026-11-18 post-tag work was appended to its entry.
```

Options:
```text
Append to v4.1.0.0 (Recommended)
New v4.1.0.1 entry
No release entry
```

Answer:
```text
Append to v4.1.0.0 (Recommended)
```

### Q009
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01M6TYZr1yrXopeGvDtCqfq2:1 -->

Question:
```text
C-07: system-skill-advisor is at version 1.1.0.0, and its last changelog entry predates this work. What version should it get?
```

Options:
```text
1.2.0.0 + changelog (Recommended)
1.1.1.0 + changelog
No bump
```

Answer:
```text
1.1.1.0 + changelog
```

### Q010
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01M6TYZr1yrXopeGvDtCqfq2:2 -->

Question:
```text
Probes P01-P05 send advisor-work prompts. P01 routes to system-skill-advisor; P02-P05 route to sk-code, sk-prompt, cli-deepseek-harness or nothing. P02 ('add a regression test for the route receipt...') and P05 ask for code work. What should they route to?
```

Options:
```text
Advisor, sk-code ok for code (Recommended)
Advisor for all five
Leave routing as is
```

Answer:
```text
Advisor, sk-code ok for code (Recommended)
```

### Q011
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01M6TYZr1yrXopeGvDtCqfq2:3 -->

Question:
```text
L4-4: ENV-REFERENCE says the advisor daemon reads SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD when it starts, but the launcher's CHILD_ENV_ALLOWLIST strips that variable, so the setting never reaches the daemon. The allowlist already forwards other documented tuning variables for the same reason. Which way should it be fixed?
```

Options:
```text
Forward it to the daemon (Recommended)
Correct the doc
```

Answer:
```text
Forward it to the daemon (Recommended)
```

### Q012
<!-- source: claude:0b81ad2f-04a7-4ad7-b174-0b3f9930b833:toolu_01RNF2Wp8swcjqLg9CRHxN1t:0 -->

Question:
```text
Probe P04 ("rotate the session lifecycle clock when dsh starts an agent or finishes compaction") still routes to cli-external-orchestration at 0.95, with system-skill-advisor second. You asked for P04 to route to the advisor. Metadata can't do it: executor-delegation.ts:55 deliberately lifts any prompt that names an executor CLI such as dsh to 0.95. That file isn't in phase 014's file list (D5), so T032 is blocked. All other work is done, reviewed, and green (full suite 2533 passed vs 2531 on main). How should P04 close?
```

Options:
```text
Accept on CLI hub (Recommended)
Change scorer policy
```

Answer:
```text
Accept on CLI hub (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
