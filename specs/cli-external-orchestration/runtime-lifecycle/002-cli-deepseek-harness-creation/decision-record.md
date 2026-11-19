---
title: "Decision Record: DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "002-cli-deepseek-harness-creation operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation"
    last_updated_at: "2026-11-19T17:35:25.485Z"
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
# Decision Record: DeepSeek Harness (dsh) as a cli-external-orchestration runtime mode mirroring cli-pi

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | The DeepSeek harness installed is github.com/deepseek-ai/deepseek-harness, not CodeWhale. | Not stated. | none | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/spec.md |
| Q002 | API keys are not copied from the opencode config; the operator enters them in the harness config. | Not stated. | none | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/spec.md |
| Q003 | An OpenCode Go/codex lane runner is added to /local-skilled-alignment before running it over the dsh work. | Not stated. | none | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/spec.md |
| Q004 | The completeness critic runs on OpenCode Go DeepSeek instead of native Opus. | Not stated. | none | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/spec.md |
| Q005 | Phase 013's live run uses the LLM Gateway key already set in the shell now. | Not stated. | none | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:617b2600-a71c-4154-80bb-9def2171203a:toolu_012vuf6cB1SVgmABW6Qcr9Bo:0 -->

Question:
```text
Which DeepSeek harness should I install on this Mac? DeepSeek TUI is now called CodeWhale (latest v0.10.2, from github.com/Hmbown/CodeWhale).
```

Options:
```text
CodeWhale via npm (Recommended)
CodeWhale via Homebrew
A different harness
```

Answer:
```text
https://github.com/deepseek-ai/deepseek-harness
```

### Q002
<!-- source: claude:617b2600-a71c-4154-80bb-9def2171203a:toolu_012vuf6cB1SVgmABW6Qcr9Bo:2 -->

Question:
```text
For the opencode-go and llmgateway providers, may I copy their API keys and base URLs from your opencode config into the new harness's own config?
```

Options:
```text
Yes, copy them
No, I'll enter them
```

Answer:
```text
No, I'll enter them
```

### Q003
<!-- source: claude:617b2600-a71c-4154-80bb-9def2171203a:toolu_01VkuqzZoT9FdWN7KWVLLW5j:0 -->

Question:
```text
/local-skilled-alignment's review lanes can only run on Pi (its default preset is Pi + llmgateway DeepSeek V4.1 Flash max) or a native Claude agent — it has no OpenCode Go or cli-codex lane runner. How should I run it over the dsh work?
```

Options:
```text
Default Pi DeepSeek lanes (Recommended)
Battery only (--no-lanes)
Add an OpenCode Go/codex lane runner first
```

Answer:
```text
Add an OpenCode Go/codex lane runner first
```

### Q004
<!-- source: claude:617b2600-a71c-4154-80bb-9def2171203a:toolu_01TtMDQ7AReYCf3KMh2AiHSo:1 -->

Question:
```text
The completeness critic is also native Opus (executors.json critic.kind=native, model opus). Under your 'only OpenCode Go DeepSeek or cli-codex' rule, what should the critic run on?
```

Options:
```text
cli-codex Luna xhigh (Recommended)
OpenCode Go DeepSeek
```

Answer:
```text
OpenCode Go DeepSeek
```

### Q005
<!-- source: claude:617b2600-a71c-4154-80bb-9def2171203a:toolu_01FnBoc3vQoAM1Vv1dx4Yoct:0 -->

Question:
```text
LLMGATEWAY_API_KEY is already set in this session's shell environment (I only checked that it exists, not its value); OPENCODE_API_KEY is not. Should I use the LLM Gateway key now for phase 013's live run? That is one headless dsh request on the LLM Gateway route plus one fan-out deep-research lineage, both from a temp folder with a throwaway DSH_HOME. The OpenCode Go route would stay marked 'configured, not verified'.
```

Options:
```text
Yes, run LLM Gateway now (Recommended)
Wait, I'll add both keys
No live runs yet
```

Answer:
```text
Yes, run LLM Gateway now (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
