---
title: "Decision Record: Fix eight skill and command surfacing gaps in the advisor scorer, its CLI JSON and its index freshness check"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "011-surfacing-scorer-follow-ups operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/011-surfacing-scorer-follow-ups"
    last_updated_at: "2026-11-17T22:04:54.279Z"
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
# Decision Record: Fix eight skill and command surfacing gaps in the advisor scorer, its CLI JSON and its index freshness check

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Hand the nine fixes to a session with fresh context through a handoff note, which this session then claimed and continued after compaction. | Not stated. | None | scratch/work-record.md |
| Q002 | Keep the low-information wide-cluster rule, so a floored rival still makes a short vague prompt abstain. | The rule is a recorded decision from commit 1c80022452b, and the cited prompt does not reproduce in Skilled. | None | spec.md section 10, tasks.md T008 |
| Q003 | Keep the 0.08 command tie-break, so a command still ranks below its owning skill on an exact bridge match. | Packet 007 research kept the tie-break, and the command is still offered beside its owner. | None | spec.md section 10, tasks.md T009 |
| Q004 | Change both rules the first round kept: the command order and the short-prompt floor tie. | Not stated. | Q002, Q003 | ADR-001, REQ-010, REQ-011 |
| Q005 | Fill laneContributions beside laneBreakdown in the CLI JSON when attribution is requested. | Not stated. | None | REQ-012, AC-012, handlers/advisor-recommend.ts |
| Q006 | Keep doctor commands listed after their skills; the command-order change is not made. | A lead-when-it-outscores rule flipped 12 pinned doctor prompts, and no margin or ownership rule singled out the repin prompt. | None | ADR-001, REQ-006, REQ-010, AC-010 |
| Q007 | No decision: the operator asked whether "skill budget audit" is a real Skilled command, which it is (/doctor:skill-advisor skill-budget), and the question was asked again. | Not stated. | None | scratch/work-record.md |
| Q008 | Change the short-prompt floor rule, except when a passing command matched one of its own full phrases. | Without the exception, "skill budget audit" went to sk-code on the single word audit instead of its own command. | None | ADR-001, REQ-011, AC-011, lib/scorer/ambiguity.ts, lib/scorer/fusion.ts |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Change the floor rule, keep the command order

**Status**: Accepted (operator, 2026-11-18)

**Context**: On 2026-11-17 the operator kept two scorer rules, recorded as Q002 and Q003 above. A second report on 2026-11-18 asked again for both, and the operator answered "fix all", then "Fix both now". Measured on this checkout, "re-pin the vendored skilled tree" scored the repin command 0.581 against its owner skill 0.389 and listed it second, because the doctor-bridge ordering keeps skills first. A lead-when-it-outscores rule flipped 12 rows of the doctor routing corpus, where the commands lead their skills by 0.03 to 0.58, and no margin or ownership rule separated the repin prompt from them. The floor change alone moved one corpus row: "skill budget audit", the full phrase of `/doctor:skill-advisor skill-budget`, went to sk-code on the single word "audit".

**Decision**: The command order stays: a doctor command follows its skill, and the 0.08 tie-break stays. The floor rule changes: on a short low-information prompt whose top is a real match, a rival that only reached the confidence floor no longer ties that top into abstention, except when a passing command matched one of its own full phrases word for word. The full scoring pass passes that fact to the doctor-free pass that decides the skills' abstention.

**Rationale**: The skill-first order is a designed policy that the hook brief and the doctor corpus rely on, and the report's case was one prompt of that policy. A floored confidence carries no evidence of its own, but an exact command phrase does, so it still outranks a one-word skill match. The guard from commit `1c80022452b` holds: an abstaining prompt floors the whole wide set, and a floored top still abstains.

**Consequence**: REQ-005 and AC-005 are superseded by REQ-011. REQ-006 stays, and REQ-010 records the kept command order. "re-pin the vendored skilled tree" still lists `/doctor:overlay repin` second.

---

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:3ae3d8e4-7b9e-4e6b-a563-896588eb48b6:toolu_01B1XWDX66jJdHhzNs27k82s:2 -->

Question:
```text
This session is past its context window, and the 9 fixes are a large build: scorer changes with a regression corpus on top of each. Should I hand over to a fresh session or keep going here?
```

Options:
```text
Hand over (Recommended)
Continue here
```

Answer:
```text
Hand over (Recommended)
```

### Q002
<!-- source: claude:3ae3d8e4-7b9e-4e6b-a563-896588eb48b6:toolu_01R735gnWaCqN99iMUjcwf7M:0 -->

Question:
```text
Item 2: the vendoring project wants a floored rival (confidence lifted to 0.82) to stop tying a real match on short prompts. Skilled chose the opposite in commit 1c80022 (2026-10-27): "the low-information abstention still reads the wider cluster so a floored skill cannot top an under-specified prompt", and a test pins it. The prompt they cite does not reproduce in Skilled: "commit my changes" routes to sk-git at 0.92. Which wins?
```

Options:
```text
Keep current rule (Recommended)
Narrow the rule
```

Answer:
```text
Keep current rule (Recommended)
```

### Q003
<!-- source: claude:3ae3d8e4-7b9e-4e6b-a563-896588eb48b6:toolu_01R735gnWaCqN99iMUjcwf7M:1 -->

Question:
```text
Item 3: on an exact bridge match, the command still ranks second, below the skill that owns it (-0.08 when the prompt has no slash). Packet 007's research decided to "keep the 0.08 adjustment as a tie-break and add a same-owner precedence rule", and the brief already offers the command as the same answer. Which wins?
```

Options:
```text
Keep the order (Recommended)
Command first on exact match
```

Answer:
```text
Keep the order (Recommended)
```

### Q004
<!-- source: claude:3ae3d8e4-7b9e-4e6b-a563-896588eb48b6:toolu_01CgsM8PsRbataPVTQYDCC9V:2 -->

Question:
```text
Fixes 4 and 5 reverse two rules you kept yesterday: the -0.08 command tie-break, and the short-prompt wide-cluster abstention (commit 1c80022452b chose it so a floored skill cannot top a vague prompt). 'Fix all' includes them. Confirm?
```

Options:
```text
Fix both now
Fix 4 only
Keep both as decided
```

Answer:
```text
Fix both now
```

### Q005
<!-- source: claude:3ae3d8e4-7b9e-4e6b-a563-896588eb48b6:toolu_01CgsM8PsRbataPVTQYDCC9V:3 -->

Question:
```text
Fix 6: per-lane scores are already returned as laneBreakdown when the request sets includeAttribution. What should change?
```

Options:
```text
Fill laneContributions (Recommended)
Always include lane scores
Docs only
```

Answer:
```text
Fill laneContributions (Recommended)
```

### Q006
<!-- source: claude:3ae3d8e4-7b9e-4e6b-a563-896588eb48b6:toolu_01LxALHmBZAz7MGCUHsR8f3S:0 -->

Question:
```text
Fix 4 (a doctor command ranks below its skill) collides with a deliberate policy: on a doctor prompt the skill leads and its doctor command follows as "Also: /doctor:git setup (run)". A designed corpus pins this for 12 prompts. When the command leads only if it outscores the skills, all 12 flip too, because the commands win by 0.03 to 0.58 (repin by 0.19). No margin or ownership rule singles out repin. Which way?
```

Options:
```text
Keep skill-first (Recommended)
Command leads everywhere
Lead on close wording only
```

Answer:
```text
Keep skill-first (Recommended)
```

### Q007
<!-- source: claude:3ae3d8e4-7b9e-4e6b-a563-896588eb48b6:toolu_01QNhd4X2ofQj2JzivRcapWm:0 -->

Question:
```text
Fix 5 (a floor-only rival no longer ties a real top on a short prompt) breaks one designed row: "skill budget audit" used to go to /doctor:skill-advisor skill-budget, whose full phrase it is. Now sk-code wins on the single word 'audit' and leads. No other corpus row moves. How should fix 5 handle this?
```

Options:
```text
Refine: phrase command wins (Recommended)
Accept, update the row
Revert fix 5
```

Answer:
```text
skill budget audit? is that even a thing for skiled
```

### Q008
<!-- source: claude:3ae3d8e4-7b9e-4e6b-a563-896588eb48b6:toolu_01XirZKdHWBd7mEYrwTP8hkc:0 -->

Question:
```text
"skill budget audit" is the full trigger phrase of /doctor:skill-advisor skill-budget (it checks skill description lengths). Fix 5 as built sends it to sk-code on the word 'audit'. Which way?
```

Options:
```text
Refine: phrase command wins (Recommended)
Accept, update the row
Revert fix 5
```

Answer:
```text
Refine: phrase command wins (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
