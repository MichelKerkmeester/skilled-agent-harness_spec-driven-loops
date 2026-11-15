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
| Q004 | Lanes A and C, which timed out on the opencode-go preset, rerun on the codex preset, and D4 records the amendment. | Both lanes timed out at 1800 s on DeepSeek V4.1 Flash max while still reading files, and an earlier run had the same timeout recovered on Codex. | None | goal.md D4, scratch/alignment-run.txt, T065 |
| Q005 | Fix the four failed Vibe routing probes in this phase by adding compound phrases to both routing stages and reminting the compiled routes. | Not stated. | None | T083, hub graph-metadata.json, hub-router.json, hub ROUTER.md |
| Q006 | The self-invocation guard for cli-mistral-vibe is the SKILL.md section that names the refusal, as in the sibling packets. | Not stated. | None | T086, cli-mistral-vibe/SKILL.md |
| Q007 | Push the aligned Vibe plugins README to origin/main. | Not stated. | None | origin/main 1ce8ff5b78d, T088 |
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

### Q004
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_01N5T4FSzG5eEHtmJgTpAEip:0 -->

Question:
```text
Phase 022's goal.md decision D4 freezes the alignment pass on the opencode-go preset (DeepSeek V4.1 Flash max). Lanes A (code) and C (READMEs, changelogs, env docs) timed out there at 1800 s while still reading files. I started a rerun of A and C on the codex preset (Luna xhigh via cli-codex), following the 2026-11-14 run's precedent. That breaks D4. How should A and C be covered?
```

Options:
```text
Use the Codex rerun (Recommended)
Record A, C as timed out
Retry on opencode-go
```

Answer:
```text
Use the Codex rerun (Recommended)
```

### Q005
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_013RQm8v2BNkmDDsvAA7uGWM:0 -->

Question:
```text
The critic upheld 4 failed routing probes (D-05). Plain requests such as 'read export.json to confirm the vibe run finished' route to sk-code or to nothing instead of cli-mistral-vibe. The fix adds compound phrases ('vibe run', 'vibe roster', 'export.json') to hub-router.json and graph metadata, then rebuilds the compiled routes and reruns the probes. Phase 022's goal requires no open in-scope finding at recheck. What should happen to this item?
```

Options:
```text
Defer as a follow-up (Recommended)
Fix it in this phase
```

Answer:
```text
Fix it in this phase
```

### Q006
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_013RQm8v2BNkmDDsvAA7uGWM:1 -->

Question:
```text
The critic's X-07 (P1) says cli-mistral-vibe has no self-invocation refusal, yet its playbook claims 'A Vibe dispatch is refused inside a Vibe child'. Siblings such as cli-claude-code and cli-devin refuse by detecting their own runtime (for example $CLAUDECODE). I have no verified signal that a Vibe child sets, and cli-deepseek-harness has the same gap. What should I do?
```

Options:
```text
Correct the claim, defer the guard (Recommended)
Build the guard now
```

Answer:
```text
The doc in the skill naming it, is the guard
```

### Q007
<!-- source: claude:425e79e1-c5de-4edb-b8bb-77ee620d2538:toolu_014BTdMXEa5YVS2xZvadF34r:0 -->

Question:
```text
The Vibe plugins README now follows the sk-create-readme code-folder shape. The reference checker passes 103 of 103. Push it now?
```

Options:
```text
Push it now (Recommended)
Don't push yet
```

Answer:
```text
Push it now (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
