---
title: "Decision Record: Expansive-depth sub-mode for deep-research and deep-review"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "007-expansive-depth-mode operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode"
    last_updated_at: "2026-11-17T16:56:11.456Z"
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
# Decision Record: Expansive-depth sub-mode for deep-research and deep-review

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Put all 13 build-slice phases as children of 007-expansive-depth-mode, overriding the earlier choice of a 004-workflow-logic-hardening child for Slice A. | Not stated. | None | spec.md Phase Documentation Map, 001-013 children |
| Q002 | 001 must merge first; wave 1 builds 001, 003, 005, 007 and 009 in parallel, the rest rebase after. | Not stated. | None | D1, scratch/orchestration-strategy.md |
| Q003 | Allow up to 8 concurrent DeepSeek V4.1 flash max dispatches across cli-pi llmgateway, cli-vibe and cli-opencode Go. | Not stated. | None | scratch/orchestration-strategy.md |
| Q004 | Each phase writes its own manual testing playbook scenarios through /create:manual-testing-playbook; 014 only verifies and aligns. | Not stated. | None | each phase tasks.md, 014-docs-playbooks-alignment/spec.md |
| Q005 | Goal D2 is flag-scoped: the expansive flag adds nothing to a run, and default runs change only through named, tested defect fixes. | Not stated. | None | goal.md D2 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01QNtigJUS3fQfEwq1b7Wmjd:0 -->

Question:
```text
Where should the phase packets for all 13 build slices (A-M from research.md §20) go? Fresh Opus 5.5 medium agents will write the spec docs, one agent per phase, with no code changes. Earlier you put Slice A, the completed-run extension, under 004-workflow-logic-hardening. I recommend one new phase parent holding all 13, so the build order and dependencies live in one place. Slices F, H and L get a decision task first because they wait on your choices.
```

Options:
```text
New parent, all 13 (Recommended)
Split: A in 004, rest new
Children of 007
```

Answer:
```text
Children of 007
```

### Q002
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01BBCfDeSVVnJctNmF39aK2G:0 -->

Question:
```text
Build order: does "001 first" mean 001 must MERGE before others, letting wave 1 build 001 alongside 003, 005, 007 and 009 (which share no files with 001), or must 001 finish before anything else starts?
```

Options:
```text
001 merges first (Recommended)
001 merges first + 004/006 early
001 strictly alone
```

Answer:
```text
001 merges first (Recommended)
```

### Q003
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01BBCfDeSVVnJctNmF39aK2G:2 -->

Question:
```text
How many external DeepSeek V4.1 flash max dispatches may run at once?
```

Options:
```text
5 (Pi 2, Go 2, Vibe 1) (Recommended)
3
8
```

Answer:
```text
opencode go hangs? Dude you also have llm gateway provider and cli vibe mistral provider for deepseek flash max do 8 if possible
```

### Q004
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01BBCfDeSVVnJctNmF39aK2G:3 -->

Question:
```text
Who writes the deep-loop manual testing playbooks? 001's plan hand-edits both loop playbooks for --extend; 014 says playbooks are written only through /create:manual-testing-playbook.
```

Options:
```text
014 owns all playbooks (Recommended)
Each phase writes its own
```

Answer:
```text
Each phase writes its own
```

### Q005
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01GXZervRj4ta5M1vXJ4deg8:0 -->

Question:
```text
Parent goal D2 says that without --depth-mode=expansive, output stays byte-identical to the old baseline. But phases 002-008 and 012-013 fix defects on purpose, which changes default runs. How should D2 read?
```

Options:
```text
Flag-scoped (Recommended)
Keep strict
```

Answer:
```text
Flag-scoped (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
