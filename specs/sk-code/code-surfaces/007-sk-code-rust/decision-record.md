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
| Q008 | Rerun LS-006 with a fresh Vibe worker rather than accept the first result. | Not stated. | None | tasks.md CHK-021, scratch/ls006-replay.txt |
| Q009 | Fix the LS-006 TypeScript-side load gap inside this packet rather than hand it off. | Not stated. | None | tasks.md CHK-021, sk-code ROUTER.md section 7, sk-code-review/SKILL.md |
| Q010 | Add an app-style Rust playbook scenario and the clap, ratatui and crossterm routing keywords, amending decision D1. | Not stated. | None | goal.md D1, sk-code ROUTER.md, hub-router.json, manual-testing-playbook |
| Q011 | Back up and rebuild the worktree's skill-graph.sqlite with /doctor:skill-advisor rebuild, then probe the LS-006 and LS-007 prompts. | Not stated. | None | tasks.md T028, implementation-summary.md Verification |
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

### Q008
<!-- source: claude:9214d15c-f092-4715-b003-a7d2c9126ab8:toolu_01LpoXfMRWoAD9itKHR4eimL:0 -->

Question:
```text
LS-006 is the last open P0 in the Rust packet. One Vibe worker replayed it: Rust and TypeScript were both detected, every Rust part and the shared guidance loaded, and nothing from Python, shell or config loaded. But it opened no typescript/quick-reference/ file, though the router selects that folder. This packet changed no routing or TypeScript file. How should LS-006 be settled?
```

Options:
```text
Rerun with a new worker (Recommended)
Accept and close
Leave it open
```

Answer:
```text
Rerun with a new worker (Recommended)
```

### Q009
<!-- source: claude:9214d15c-f092-4715-b003-a7d2c9126ab8:toolu_01C8sWnid2VCSnLeasvBFcM6:0 -->

Question:
```text
LS-006 failed the same way twice. Both Vibe workers loaded the whole Rust set but skipped typescript/quick-reference/, which the router selects for a napi-rs plus TypeScript task, and the second also skipped the TypeScript and universal checklists. This packet changed no routing or TypeScript file. How should the Rust packet handle it?
```

Options:
```text
Hand off and close (Recommended)
Fix it in this packet
Keep it open
```

Answer:
```text
Fix it in this packet
```

### Q010
<!-- source: claude:9214d15c-f092-4715-b003-a7d2c9126ab8:toolu_01C8sWnid2VCSnLeasvBFcM6:1 -->

Question:
```text
The review raised two coverage gaps for app-style Rust. A playbook scenario: no scenario checks that a Rust-only clap CLI loads the Rust set and no TypeScript set. Router keywords: clap, ratatui and crossterm are not RUST keywords, so a prompt like 'review my clap CLI' with no .rs file or 'rust' word would miss the Rust set. Adding keywords changes detection, which the packet's frozen decision D1 rules out, so it would be an amendment. Which should be added?
```

Options:
```text
App-style Rust playbook scenario
clap, ratatui, crossterm keywords
```

Answer:
```text
App-style Rust playbook scenario, "clap, ratatui, crossterm keywords"
```

### Q011
<!-- source: claude:7b89ca45-b5de-48e9-8686-d21baf947716:toolu_01XSxTFDSkFXDfwsfbjBL1nM:0 -->

Question:
```text
The skill advisor in the Rust worktree reports its index is stale for one skill (sk-code, whose graph-metadata.json gained rust, napi-rs, ratatui, crossterm and clap cli). May I run /doctor:skill-advisor rebuild there? It copies the gitignored skill-graph.sqlite to a .bak first, rebuilds it from the checked-in metadata, and restores the backup on any failure. Undo is copying the .bak back.
```

Options:
```text
Rebuild (Recommended)
Skip rebuild
```

Answer:
```text
Rebuild (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
