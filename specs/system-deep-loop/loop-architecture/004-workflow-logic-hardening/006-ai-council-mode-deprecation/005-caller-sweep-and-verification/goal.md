---
title: "Goal: Phase 5: caller-sweep-and-verification"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "caller sweep and verification goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/005-caller-sweep-and-verification"
    last_updated_at: "2026-11-14T20:19:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-14-split-005-caller-sweep-and-verification"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: caller-sweep-and-verification

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove the deep council mode from every caller outside the hub, the runtime and the advisor, and prove the whole phase on the final tree.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The sweep searches mode vocabulary (`deep-ai-council`, `/deep:ai-council`, `deep-council`, "planning council", "council deliberation"), not the agent name. `@ai-council` and the `ai-council/**` artifact path stay valid. |
| D2 | Changelogs, dated benchmark reports, spec-copy fixtures, `cite-drift-redirects.json` and CI ignore paths into archived specs stay as history on the allowlist in `../scratch/exceptions.md`. |
| D3 | `ai-council/**` artifacts inside spec folders are never edited, and `multi-ai-council-validator.vitest.ts` stays. |
| D4 | The Gate 3 resume phrase names `/speckit:ai-council`, because the operator chose D3 option B. |
| D5 | Both routing stages are replayed on real prompts on the final tree, and every gate is compared with its start value. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] For "convene an ai council to compare three migration plans", `skill_advisor.py --threshold 0.5` prints no `"mode": "ai-council"`, `"research"` or `"review"` row and `compiled-route.cjs --hub system-deep-loop` prints no `"packetId":"deep-` value.
- [ ] "run a deep research loop on vector index tuning" routes to mode `research` and packet `deep-research`, and "deep review this branch for release readiness" routes to mode `review` and packet `deep-review`, in both `skill_advisor.py` and `compiled-route.cjs --hub system-deep-loop`.
- [ ] `rg -l --hidden 'deep-ai-council|deep_ai_council|/deep:ai-council|deep-council|DeepAiCouncil' -g '!specs/**' -g '!**/node_modules/**' -g '!.git/**' -g '!**/changelog/**' -g '!**/benchmark/**' .` prints only files listed in `../scratch/exceptions.md`.
- [ ] `git diff --name-only <start-sha> -- 'specs/**/ai-council/**'` prints nothing.
- [ ] `../scratch/gate-baseline.md` holds a start and a final value for every gate, and no final value is worse than its start value.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on the phase parent with `--recursive --strict` prints `RESULT: PASSED` for the parent and all five children.
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
