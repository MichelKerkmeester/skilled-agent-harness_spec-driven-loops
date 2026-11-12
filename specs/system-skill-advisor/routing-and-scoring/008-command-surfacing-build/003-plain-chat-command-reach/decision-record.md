---
title: "Decision Record: Phase 3: plain-chat-command-reach"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "003-plain-chat-command-reach operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/003-plain-chat-command-reach"
    last_updated_at: "2026-11-12T18:28:28.819Z"
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
# Decision Record: Phase 3: plain-chat-command-reach

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Build phase 003 with DeepSeek through cli-pi. | Not stated. | None | 003 spec.md change log v1.1 |
| Q002 | Replace the umbrella ids with one id per command now and relabel the gold lines. | Not stated. | None | 003 plan.md ADR-011, REQ-014 |
| Q003 | Add doctor plain-chat reach to phase 003 as workstream 7. | Not stated. | None | 003 spec.md REQ-018, REQ-019 |
| Q004 | Add meaning-based matching now as the answer to the holdout gap. | Not stated. | None | 003 plan.md ADR-012, 004-command-meaning-matching/spec.md |
| Q005 | Re-pin every test that pinned the old state, including the accuracy ratchet, and show the list. | Not stated. | None | 003 plan.md ADR-011 |
| Q006 | Re-point the Gate 4 text in AGENTS.md, the root README, the orchestrate agent and the doctor manifest. | Not stated. | None | 003 plan.md ADR-015 |
| Q007 | The hook looks up the compiled route for the top recommendation only. | Not stated. | None | 003 plan.md ADR-013, T015 |
| Q008 | /create:changelog asks first because its release path publishes outside the repo. | Not stated. | None | 003 plan.md ADR-014 |
| Q009 | Investigate and fix the wrong attachment on the holdout row, move it to tune and author a fresh holdout row. | Not stated. | None | 003 implementation-summary.md decisions |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01PyeS5awnFtShixtx6s73dt:0 -->

Question:
```text
Phase 003 (plain-chat command reach) is planned: 44 tasks across six workstreams, strict validation passed, nothing built. It is the first phase that changes scoring. Start the build, and with which workers?
```

Options:
```text
Build with DeepSeek (Recommended)
Build with Luna 6
Hold
```

Answer:
```text
Build with DeepSeek (Recommended)
```

### Q002
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01PyeS5awnFtShixtx6s73dt:1 -->

Question:
```text
Three old umbrella ids (command-spec-kit, memory:save, command-memory-save) are the correct answer on 17 lines of the pinned test corpora. Phase 003 adds one scored row per command, so what happens to the umbrella ids?
```

Options:
```text
Replace now (Recommended)
Keep until phase 004
```

Answer:
```text
Replace now (Recommended)
```

### Q003
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01PyeS5awnFtShixtx6s73dt:2 -->

Question:
```text
The 17 doctor commands also score 0 on plain-chat prompts, and the review's reach design does not cover them. That caps this phase at 27 of 44 plain rows per split. Include doctor reach in phase 003?
```

Options:
```text
Leave out (Recommended)
Add to phase 003
```

Answer:
```text
Add to phase 003
```

### Q004
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_012BTTu1NGGfKeLBYTc9BcLN:0 -->

Question:
```text
Phase 003 is built but holdout plain-chat reach is still 0 of 44 (tune went 0 to 9 of 44, typed recall 19 to 24 of 44, false offers 0, pinned numbers 159/50/20/5). The holdout prompts are paraphrases with no shared wording, and the advisor only matches whole phrases, so more authored phrases would only fit the tune rows. How should the phase close?
```

Options:
```text
Close with the gap named (Recommended)
Add meaning-based matching now
Keep attach only
```

Answer:
```text
Add meaning-based matching now
```

### Q005
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_012BTTu1NGGfKeLBYTc9BcLN:1 -->

Question:
```text
23 tests in 13 files now fail because they pin the old state: the three retired ids, the active-row counts, the Python projection, the parity ledgers and the scorer accuracy ratchet (it pins 158 exactly, now 159, plus fixture hashes for the 17 relabelled gold lines). May I re-pin them to the new state, including the accuracy ratchet baseline?
```

Options:
```text
Re-pin all, show me the list (Recommended)
Re-pin all except the ratchet
Hold the re-pins
```

Answer:
```text
Re-pin all, show me the list (Recommended)
```

### Q006
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01H2iBVKGmtYy8VUSrevmZP4:0 -->

Question:
```text
The alignment run found that AGENTS.md Gate 4, the root README Gate 4 box, the orchestrate agent and the /doctor:agents-md manifest still say the `command-spec-kit` bridge wins on ambiguity. This work retired that id. How should I handle those four places?
```

Options:
```text
Re-point all four (Recommended)
Leave for a separate packet
```

Answer:
```text
Re-point all four (Recommended)
```

### Q007
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01H2iBVKGmtYy8VUSrevmZP4:1 -->

Question:
```text
The hook now asks for a compiled route for every hub in the top three, which raised hook time (median 194 to 251 ms, p95 281 to 450 ms) and nothing prints the command until phase 004. What do you want?
```

Options:
```text
Top result only (Recommended)
Off until phase 004
Keep as is
```

Answer:
```text
Top result only (Recommended)
```

### Q008
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_01H2iBVKGmtYy8VUSrevmZP4:2 -->

Question:
```text
`/create:changelog` is classed as safe to start, but with --release it pushes a tag and publishes a GitHub release. The packet 007 audit kept it at start as a known limit. Change it?
```

Options:
```text
Make it ask first (Recommended)
Keep at start
```

Answer:
```text
Make it ask first (Recommended)
```

### Q009
<!-- source: claude:fddcf466-8e1f-44cf-a132-6f846b676c18:toolu_0112ZL1zL8yAz3kSnvmprbvj:2 -->

Question:
```text
One holdout prompt gets /create:changelog attached where /create:agent was expected. Finding the cause means reading that holdout prompt and tuning against it, which makes the holdout set less trustworthy as an unseen check. How should I handle it?
```

Options:
```text
Leave it as a known limit (Recommended)
Investigate and fix
```

Answer:
```text
Investigate and fix
```

<!-- /ANCHOR:operator-answers-verbatim -->
