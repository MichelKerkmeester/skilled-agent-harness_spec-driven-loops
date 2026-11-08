---
title: "Decision Record: Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "027-ask-surface-enforcement operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/027-ask-surface-enforcement"
    last_updated_at: "2026-11-08T10:45:01.230Z"
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
# Decision Record: Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Fix the prose-menu failure with both a turn-end hook and rule-text changes. | Rule text alone is what already failed. | None | REQ-001, REQ-002, REQ-003, plan.md |
| Q002 | Run the DeepSeek v4.1 flash research on the opencode-go provider after DevPass ran out of credit. | DevPass returned a 402 credit-limit error until 11/10, and opencode-go serves the same model. | None | research/fanout.json, research/lineages/deepseek/ |
| Q003 | Build enforcing guards for Claude Code, DSH, OpenCode and Pi, with advisory Codex and Devin adapters, planned first. | Not stated. | None | REQ-002, REQ-004, REQ-005, tasks.md T009-T013 |
| Q004 | Write the ask-surface conversation scenarios and run the full matrix on Claude Code, OpenCode, Pi and Devin, leaving Codex out for lack of usage. | No Codex usage is available; only opencode-go and the GPT provider through cli-codex, OpenCode, Pi and Devin. | None | tasks.md T020-T022, scratch/live-runs/, the 2026-11-08 ask-surface-guard run report |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:37344d65-539c-401d-8341-c9b769fd34a7:toolu_01E7Z62j6cVurTE5iFSKnX8m:1 -->

Question:
```text
How far should the fix go?
```

Options:
```text
Hook + rule text (Recommended)
Rule text only
Hook only
```

Answer:
```text
Hook + rule text (Recommended)
```

### Q002
<!-- source: claude:37344d65-539c-401d-8341-c9b769fd34a7:toolu_01W5kDMdQRzSbAMGxzJorQyF:0 -->

Question:
```text
DevPass (llmgateway) is out of credit until 11/10, so the DeepSeek v4.1 flash research run never started. How should the 5-iteration run go?
```

Options:
```text
opencode-go route (Recommended)
DeepSeek Harness (dsh)
Wait for 11/10 renewal
```

Answer:
```text
opencode-go route (Recommended)
```

### Q003
<!-- source: claude:37344d65-539c-401d-8341-c9b769fd34a7:toolu_01S6251BbqiRUSaoirBiUr7M:0 -->

Question:
```text
The research is done. How much of the ask-surface plan should I build now in specs/hooks-plugins-extensions/027-ask-surface-enforcement?
```

Options:
```text
All four enforcing runtimes (Recommended)
Rule text + Claude guard first
Plan only
```

Answer:
```text
All four enforcing runtimes (Recommended)
```

### Q004
<!-- source: claude:37344d65-539c-401d-8341-c9b769fd34a7:toolu_01M8AHikJLUd8nezqH3KNe3r:1 -->

Question:
```text
The sk-doc playbook's conversation runner can drive a real subject runtime and fails a turn whose scripted `select` answer finds no question-tool dialog. I can write ask-surface scenarios with it: (1) a bait turn ending in a menu that must end up in the tool dialog, with a check for the guard's re-prompt in history.txt, (2) the same turn under SYSTEM_ASK_SURFACE_DISABLED=1, where the menu stays prose, and (3) a numbered-summary turn the guard must leave alone. How far should I take it?
```

Options:
```text
Write + run on Claude Code (Recommended)
Write + run full matrix
Write only
```

Answer:
```text
Go for 2, but i dont have codex usage. only opencode go and gpt provider through cli codex, opencode, pi and SWE 2 MAX cli devin
```

<!-- /ANCHOR:operator-answers-verbatim -->
