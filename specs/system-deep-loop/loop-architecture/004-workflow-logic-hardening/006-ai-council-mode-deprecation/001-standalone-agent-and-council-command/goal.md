---
title: "Goal: Phase 1: standalone-agent-and-council-command"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "standalone agent and council command goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/001-standalone-agent-and-council-command"
    last_updated_at: "2026-11-14T20:19:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-14-split-001-standalone-agent-and-council-command"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: standalone-agent-and-council-command

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the council run from one self-contained agent and one `/speckit:ai-council` command, before any council file is deleted.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The agent names no `system-deep-loop` path and runs no script. It keeps `bash: deny` and writes `ai-council/**` with its own Write and Edit tools, with the artifact layout and output schema in its own body. |
| D2 | The agent reaches every runtime through the existing mirror mechanism: `.skilled` and `.claude` authored, `.codex`, `.pi` and `.dsh` generated, `.cursor`, `.devin` and `.opencode` symlinked. No second mechanism is added. |
| D3 | The command is `/speckit:ai-council`, owned by `system-spec-kit`, single round, with one workflow file `speckit-ai-council.yaml` and one presentation file. |
| D4 | Nothing is deleted in this child. `/deep:ai-council` and the packet stay until child 002. |
| D5 | The gate baseline is captured at the start commit before the first edit and names that SHA. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n 'system-deep-loop|deep-ai-council|/deep:ai-council|append-mode-event|persist-artifacts|node ' .skilled/agents/ai-council.md .claude/agents/ai-council.md` prints nothing.
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs --all` and `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` exit 0.
- [ ] `find -L .skilled/agents .claude/agents .codex/agents .cursor/agents .devin/agents .dsh/agents .opencode/agents .pi/agents -maxdepth 1 -name 'ai-council*' | wc -l` prints 8.
- [ ] `ls .skilled/commands/speckit/assets/speckit-ai-council*.yaml | wc -l` prints 1.
- [ ] `find -L .claude/commands .cursor/commands .opencode/commands .codex/prompts .pi/prompts .dsh/prompts -maxdepth 2 \( -path '*/speckit/ai-council.md' -o -name 'speckit-ai-council.md' \) | wc -l` prints 6.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
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
| Child docs authored | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and `goal.md` written on 2026-11-14 when phase 006 was split into five children. Implementation has not started. |

### Deviations and findings

| Item | Note |
|------|------|
| Ids carried from the parent | Task, requirement, criterion and checklist ids keep the numbers they had in phase 006 before the split, so this child's ids do not start at 001. |
<!-- /ANCHOR:log -->
