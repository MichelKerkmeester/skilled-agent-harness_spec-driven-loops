---
title: "Decision Record: Rust standards in sk-code, informed by rust-anything"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "007-sk-code-rust operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/007-sk-code-rust"
    last_updated_at: "2026-11-26T13:05:49.712Z"
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
# Decision Record: Rust standards in sk-code, informed by rust-anything

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Update the existing Rust references and checklist in place inside sk-code-skilled, with no new sk-code-rust surface. | Not stated. | None | goal.md D1, plan.md Final File List |
| Q002 | The research pulls all four angles from rust-anything: its own Rust craft, its port-and-prove method, its cross-language types and its agent skill design. | Not stated. | None | research/research.md sections 4 and 5 |
| Q003 | The deep research runs three lineages of up to eight iterations each. | Not stated. | None | goal.md D2, research/research.md section 1 |
| Q004 | The work is one Level 2 packet, not a phased packet with research and update children. | recommend-level.sh scored the phase need 10 of 50 against a threshold of 25. | None | goal.md Deviations and findings, spec.md |
| Q005 | Delete scratch/before/ and the two stray lineage specs/ folders, since the copies match HEAD and the configs are stale initialization copies. | Not stated. | None | tasks.md CHK-051, scratch/ |
| Q006 | Run LS-006 steps 3 to 5 through one cli-mistral-vibe worker on deepseek-flash. | Not stated. | None | tasks.md CHK-021, scratch/ls006-replay.txt |
| Q007 | Write the sending session's 13 queued answers into decision records: the Rust ones in this packet and the bots ones in the bots parity packet, at the operator's direction against the save rule that skips another session's answers. | Not stated. | None | decision-record.md Q001 to Q004 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_01Etb68FfmzeCNRgvnGYK5BY:1 -->

Question:
```text
sk-code already has Rust: about 6,600 lines of references and a checklist inside the sk-code-skilled surface. It is built for napi-rs and WASM bindings that must match a TypeScript oracle, and it loads only for code inside Skilled itself (bots-tui would qualify). A Rust file in any other repo gets no Rust standards. Which shape?
```

Options:
```text
Update in place (Recommended)
New sk-code-rust surface
```

Answer:
```text
Update in place (Recommended)
```

### Q002
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_01Etb68FfmzeCNRgvnGYK5BY:2 -->

Question:
```text
What should the research pull from rust-anything (89 Rust files, about 75,000 lines, MIT or Apache-2.0)?
```

Options:
```text
Its own Rust craft (Recommended)
Port and prove method (Recommended)
Cross-language types
Its agent skill design
```

Answer:
```text
Its own Rust craft (Recommended), Port and prove method (Recommended), Cross-language types, Its agent skill design
```

### Q003
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_01Etb68FfmzeCNRgvnGYK5BY:3 -->

Question:
```text
How big should the deep research run be? Per your rule it runs on Vibe DeepSeek flash max only.
```

Options:
```text
3 lineages x 8 iterations (Recommended)
1 lineage x 10
5 lineages x 10
```

Answer:
```text
3 lineages x 8 iterations (Recommended)
```

### Q004
<!-- source: claude:833af0cc-38d5-498d-8268-a1869252b4d2:toolu_016zK9tgqMFjMg6XKkhg6xrB:0 -->

Question:
```text
The plan said a phased packet: 007-sk-code-rust with a research child and an update child. spec-kit's level helper scores this work as Level 2 and does not recommend phases: phase score 10 of 50, threshold 25 (recommend-level.sh, phase-definitions.md section 2). Deep research writes into the packet's own research/ folder either way. Which shape?
```

Options:
```text
One Level 2 packet (Recommended)
Keep the phased shape
```

Answer:
```text
One Level 2 packet (Recommended)
```

### Q005
<!-- source: claude:9214d15c-f092-4715-b003-a7d2c9126ab8:toolu_012QPy7nXpne9b7pZhY1ndCp:0 -->

Question:
```text
Delete the task's leftover untracked files in the Rust packet? scratch/before/ holds 22 pre-change copies, and all 22 match HEAD byte for byte, so `git show HEAD:<path>` restores any of them. research/lineages/vibe-1/specs/ and vibe-2/specs/ each hold one stale deep-research-config.json saved at initialization. The real lineage configs beside them are newer.
```

Options:
```text
Delete all three (Recommended)
Delete only scratch/before/
Keep everything
```

Answer:
```text
Delete all three (Recommended)
```

### Q006
<!-- source: claude:9214d15c-f092-4715-b003-a7d2c9126ab8:toolu_012QPy7nXpne9b7pZhY1ndCp:1 -->

Question:
```text
LS-006 is the one open P0 in the Rust packet. Steps 1 and 2 passed: the advisor put sk-code first at 0.85. Steps 3 to 5 need a fresh model session to run the sandbox prompt and report which references it loaded. How should those steps run?
```

Options:
```text
Vibe deepseek-flash worker (Recommended)
I run it myself
Leave it open
```

Answer:
```text
Vibe deepseek-flash worker (Recommended)
```

### Q007
<!-- source: claude:9214d15c-f092-4715-b003-a7d2c9126ab8:toolu_012QPy7nXpne9b7pZhY1ndCp:2 -->

Question:
```text
The sending session left 13 operator answers queued with no decision record (session 833af0cc). The /speckit:save contract says to report another session's pending answers and write no entries for them in this save. The handoff asked to write them: the Rust answers into this packet and the bots-plan answers into specs/system-skilled-bots/003-openbot-parity-build in the bots worktree. What should happen to them?
```

Options:
```text
Write them, both packets (Recommended)
Write only the Rust ones
Leave all queued
```

Answer:
```text
Write them, both packets (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
