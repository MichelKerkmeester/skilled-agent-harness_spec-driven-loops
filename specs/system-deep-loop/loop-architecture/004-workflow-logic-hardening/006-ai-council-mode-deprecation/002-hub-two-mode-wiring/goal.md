---
title: "Goal: Phase 2: hub-two-mode-wiring"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hub two mode wiring goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/002-hub-two-mode-wiring"
    last_updated_at: "2026-11-14T20:19:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-14-split-002-hub-two-mode-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: hub-two-mode-wiring

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make `system-deep-loop` a two-mode hub on every routing surface, with the council mode packet and the `/deep:ai-council` command gone.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The hub registers two modes, research and review, on the registry, router, root `ROUTER.md`, graph metadata, command metadata, description and leaf manifest. |
| D2 | Wiring changes follow `.skilled/repo-rules/skill-hub-routing.md`: the per-hub gate runs with the hub path and its subject line is read before the verdict. |
| D3 | The packet changelog moves to a real folder at `.skilled/changelog/system-deep-loop/deep-ai-council/` before the packet is deleted. Every deleted file is tracked and reverts through `git revert`. |
| D4 | `ai-council/**` inside spec folders, untracked files, hub `benchmark/` reports and `changelog/` files are never edited. |
| D5 | Runtime libraries and advisor entries are not edited here, except tests that assert the deep command set. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node -e 'const r=require("./.skilled/skills/system-deep-loop/mode-registry.json");console.log(r.modes.map(m=>m.workflowMode).join(" "), r.extensions["runtime-loop"].runtimeLoopTypes.join(" "))'` prints `research review research review`.
- [ ] `rg -n -i 'council' .skilled/skills/system-deep-loop/hub-router.json` prints nothing and `rg -n 'AI_COUNCIL' .skilled/skills/system-deep-loop/ROUTER.md` prints nothing.
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` prints `INFO: Parent skill: .skilled/skills/system-deep-loop`, `declares 2 modes` and `OK: parent-skill-check`.
- [ ] `git ls-files .skilled/skills/system-deep-loop/deep-ai-council .skilled/commands/deep/ai-council.md` prints nothing.
- [ ] `ls .skilled/changelog/system-deep-loop/deep-ai-council | wc -l` prints 20 and the path is not a symlink.
- [ ] `find -L .claude/commands .cursor/commands .opencode/commands .codex/prompts .pi/prompts .dsh/prompts -maxdepth 2 \( -iname '*deep-ai-council*' -o -path '*/deep/ai-council.md' \) | wc -l` prints 0.
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
| T018-T038, T094 hub two-mode wiring | done, committed adbba5a06a | parent-skill-check prints declares 2 modes and OK; check-contract-drift prints OK commands=2; compiled-route-guard all hubs fresh |

### Deviations and findings

| Item | Note |
|------|------|
| Ids carried from the parent | Task, requirement, criterion and checklist ids keep the numbers they had in phase 006 before the split, so this child's ids do not start at 001. |
<!-- /ANCHOR:log -->
