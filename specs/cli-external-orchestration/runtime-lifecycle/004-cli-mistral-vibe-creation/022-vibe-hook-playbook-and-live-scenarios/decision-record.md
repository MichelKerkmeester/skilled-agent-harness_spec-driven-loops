---
title: "Decision Record: Phase 22: vibe-hook-playbook-and-live-scenarios"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "022-vibe-hook-playbook-and-live-scenarios operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/022-vibe-hook-playbook-and-live-scenarios"
    last_updated_at: "2026-11-14T22:33:40.866Z"
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
# Decision Record: Phase 22: vibe-hook-playbook-and-live-scenarios

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Review phases 013 to 021 with a fresh Opus 5.5 at medium effort, as a native subagent. | Opus 5.2 does not exist on the Claude CLI (unrecognized_model). | None | Review of the 013-021 planning docs |
| Q002 | Vibe lineages keep --auto-approve and the compensating guards are recorded instead of tightening approval. Approved by the operator 2026-11-14. | Not stated. | None | 020-vibe-dispatch-hardening T005, T009, T020; 020 scratch/posture-options.md |
| Q003 | Vibe lineages keep both AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_DISABLED=1. Approved by the operator 2026-11-14. | Not stated. | None | 020-vibe-dispatch-hardening T005 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:71fbba2f-7c00-4a2d-92c9-3f295e790e77:toolu_01WeNuNSRLcS86aHJUUt5DGU:0 -->

Question:
```text
You asked for a fresh Opus 5.2 medium to review the nine new phases (013-021), but the Claude CLI rejects claude-opus-5-2 as an unrecognized model. Which reviewer should I run instead? It stays read-only either way.
```

Options:
```text
Opus 5.5 medium (Recommended)
Opus 5.5 medium on claude2
Fable 5.2 medium on claude2
```

Answer:
```text
Opus 5.5 medium (Recommended)
```

### Q002
<!-- source: claude:71fbba2f-7c00-4a2d-92c9-3f295e790e77:toolu_01Q3steZBMPXixkX3yUWvVDB:0 -->

Question:
```text
Vibe deep-loop lineages run with --auto-approve, which turns off Vibe's permission model, so an iteration can write anywhere the process can. Twelve repo hooks still guard each call, seven of them strict. Which approval posture should lineages use?
```

Options:
```text
A: keep, record guards (Recommended)
B: allowlist tools
C: real confinement
```

Answer:
```text
A: keep, record guards (Recommended)
```

### Q003
<!-- source: claude:71fbba2f-7c00-4a2d-92c9-3f295e790e77:toolu_01Q3steZBMPXixkX3yUWvVDB:1 -->

Question:
```text
Lineages set both AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_DISABLED=1. In the current code AI_SESSION_CHILD=1 alone already stops the spec gate firing, so the second switch is a redundant safety layer. Keep it?
```

Options:
```text
Keep both (Recommended)
D: drop the extra switch
```

Answer:
```text
Keep both (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
