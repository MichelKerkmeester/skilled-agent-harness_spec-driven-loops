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

- [x] For "convene an ai council to compare three migration plans", `skill_advisor.py --threshold 0.5` prints no `"mode": "ai-council"`, `"research"` or `"review"` row and `compiled-route.cjs --hub system-deep-loop` prints no `"packetId":"deep-` value.
- [x] "run a deep research loop on vector index tuning" routes to mode `research` and packet `deep-research`, and "deep review this branch for release readiness" routes to mode `review` and packet `deep-review`, in both `skill_advisor.py` and `compiled-route.cjs --hub system-deep-loop`.
- [x] `rg -l --hidden 'deep-ai-council|deep_ai_council|/deep:ai-council|deep-council|DeepAiCouncil' -g '!specs/**' -g '!**/node_modules/**' -g '!.git/**' -g '!**/changelog/**' -g '!**/benchmark/**' .` prints only files listed in `../scratch/exceptions.md`.
- [x] `git diff --name-only <start-sha> -- 'specs/**/ai-council/**'` prints nothing.
- [x] `../scratch/gate-baseline.md` holds a start and a final value for every gate, and no final value is worse than its start value.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` on the phase parent with `--recursive --strict` prints `RESULT: PASSED` for the parent and all five children.
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
| Caller sweep T065 to T077 | Done | Commit 10c054c7b4. Two DeepSeek dispatches (docs sweep, plugin guard tests) plus hand fixes to one-line fixtures. gate-3 parity 15 passed, both plugin guard tests pass, mirror checkers exit 0, contract drift OK commands=2, compiled-route guard all fresh. |
| Route replay T080 and T081 | Done | Council prompt: stage one returns command-speckit-ai-council with no mode, stage two returns defer. Research prompt: stage one mode research, stage two packetId deep-research. Review prompt: stage one mode review, stage two packetId deep-review. advisor_recommend ties system-deep-loop with sk-git at 0.95 for the review prompt because it says this branch. |
| Sweep T086 and T087 | Done | The vocabulary sweep minus scratch/exceptions.md prints 0 paths. Sixteen paths were added to the allowlist at close: the agent in five runtimes, three hub redirect sentences, pivot wording in three files, one changelog folder and the trigger index with its three fixtures. git diff --name-only a55b1f3d58 over specs ai-council folders prints nothing. |
| Gates T088 | Done | 58 gates rerun from the final tree. None worse than its start. trigger-index-check now passes. Five still fail as at the start: corpus-pin, hub-vocabulary-source, broken-tracked-symlinks, command-router-drift, speckit-cli-vitest. |
| Fix commits | Pinned | c67864c53c baseline, 34692583f9 agent and command, adbba5a06a hub and advisor, 5a9e04f242 runtime, 10c054c7b4 caller sweep. |
| T077 wording | Deviation | The trigger index still has 43 entries with deep-ai-council in the path. All are historical spec folders by that name. No entry points at the deleted packet system-deep-loop/deep-ai-council. |
| heldout.jsonl | Kept | The doctor helper held-out prompt about a council run stays because a test pins the file hash. |

### Deviations and findings

| Item | Note |
|------|------|
| Ids carried from the parent | Task, requirement, criterion and checklist ids keep the numbers they had in phase 006 before the split, so this child's ids do not start at 001. |
<!-- /ANCHOR:log -->
