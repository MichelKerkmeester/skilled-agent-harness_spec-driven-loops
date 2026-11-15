---
title: "Decision Record: Mistral as a provider across the CLI runtimes and Mistral Vibe as a cli-external-orchestration runtime mode"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "004-cli-mistral-vibe-creation operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation"
    last_updated_at: "2026-11-14T12:51:29.807Z"
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
# Decision Record: Mistral as a provider across the CLI runtimes and Mistral Vibe as a cli-external-orchestration runtime mode

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Build the DeepSeek Harness Mistral route now and prove it once MISTRAL_API_KEY is exported. | Not stated. | None | 003-dsh-mistral-route T004-T010 |
| Q002 | A direct-dispatch-only Pi row needs the roster alone; a fan-out model also needs PI_SUPPORTED_MODELS. | Not stated. | None | cli-pi/SKILL.md, cli-pi/references/providers-and-models.md |
| Q003 | Review phases 013 to 021 with a fresh Opus 5.5 at medium effort, as a native subagent. | Opus 5.2 does not exist on the Claude CLI (`unrecognized_model`). | None | Review of 013-021 planning docs |
| Q004 | Vibe lineages keep `--auto-approve`; the compensating guards are recorded instead of tightening approval. Approved by the operator 2026-11-14. | Not stated. | None | 020-vibe-dispatch-hardening T005, T009, T020 |
| Q005 | Vibe lineages keep both `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_DISABLED=1`. Approved by the operator 2026-11-14. | Not stated. | None | 020-vibe-dispatch-hardening T005 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:7b5419e7-b051-48ae-a853-821592ddf9fd:toolu_01BcMfUT78fjRZJb5Jm5Y446:1 -->

Question:
```text
What next for the DSH Mistral route?
```

Options:
```text
Build after I export key
Build now, prove later
Hold phase 003
```

Answer:
```text
Build now, prove later
```

### Q002
<!-- source: claude:7b5419e7-b051-48ae-a853-821592ddf9fd:toolu_01BcMfUT78fjRZJb5Jm5Y446:2 -->

Question:
```text
Apply the one-line fix to the cli-pi PI_SUPPORTED_MODELS rule?
```

Options:
```text
Apply the fix
Wire fan-out instead
Leave as is
```

Answer:
```text
Apply the fix (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
