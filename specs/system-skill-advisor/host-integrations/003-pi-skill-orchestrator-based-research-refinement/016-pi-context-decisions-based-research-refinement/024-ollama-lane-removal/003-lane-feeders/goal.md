---
title: "Goal: lane feeders"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/003-lane-feeders"
    last_updated_at: "2026-11-20T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-497-ollama-lane-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: lane feeders

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove every code path that computes, refreshes or reads a vector for the advisor's prompt path, so nothing feeds the lane.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The lane id and schema stay until phase 004. |
| D2 | The four ratchets run with score baselines untouched. A ratchet that needs recapturing is a finding. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] In `.skilled/skills/system-skill-advisor/runtime/`, `npm run typecheck`, `npm test` and `npm run build` each exit 0.
- [ ] The four CI routing ratchets pass, and `git diff --stat` shows no change to a score baseline file.
- [ ] The daemon, the watcher, the recommend path and `fusion.ts` compute and read no vector, and the `embeddingText` field and its generator are deleted.
- [ ] The launcher forwards no lane env key.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase 003 | Pending | Parent phase map row 3 |

### Deviations and findings

| Item | Note |
|------|------|
| Criterion 3 reading | "`fusion.ts` computes and reads no vector" covers the exact rerank and the command meaning path, which are gone. The lane call at fusion's semantic-shadow call site stays for phase 004, because `native-scorer.vitest.ts` asserts a non-zero `semantic_shadow` score through it (`plan.md` ADR-002). The conductor confirmed this reading. |
| Criterion 4 reading | "The launcher forwards no lane env key" means the three feeder keys `OLLAMA_BASE_URL`, `OLLAMA_REQUEST_TIMEOUT_MS` and `SYSTEM_SKILL_ADVISOR_EMBED_REFRESH`, which are gone. The model-server keys stay for phase 005 and `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` for phase 004 (`plan.md` ADR-003). The conductor confirmed this reading. |
<!-- /ANCHOR:log -->
