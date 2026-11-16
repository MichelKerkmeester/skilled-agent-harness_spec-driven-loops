---
title: "Goal: Let a session surface hint join a scored sk-code route and keep a second matched mode when one surface scores several phrases"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "host surface hint and score window goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/008-host-surface-hint-and-score-window"
    last_updated_at: "2026-11-16T09:33:08Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Let a session surface hint join a scored sk-code route and keep a second matched mode when one surface scores several phrases

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A session's surface hint adds its surface to a scored sk-code route, and a workflow mode a prompt matched is never dropped because a surface matched more phrases.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Plan first. The operator chose analyze and plan on 2026-11-16. No router file changes until the operator has read `plan.md`. |
| D2 | The vendoring project's tree at `barter/ai-speckit` is read-only, and its router overlay is evidence, not a source to copy without review. |
| D3 | No surface score is chosen before both candidates have been run over every case in `canary-cases.v1.json`. |
| D4 | A hint may add a target, for a surface the hub declares as specific. The operator chose this on 2026-11-16. |
| D5 | A hinted prompt that scores no mode routes to the hinted specific surface, in this packet. The operator chose this on 2026-11-16. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` prints `fail 0` with the new tests in the count.
- [x] `scratch/probe-routes.cjs` prints `sk-code-review` and `sk-code-frontend` for `review the dark mode toggle and focus trap`.
- [x] `diff scratch/routes-before.txt scratch/routes-after.txt` prints only the routes `scratch/score-candidates.md` lists.
- [x] `node .skilled/bin/compiled-route-guard.cjs` passes for `sk-code`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Items 8 and 9 checked against the router | Done | `scratch/probe-routes.cjs`, exit 0. Its output is in `spec.md` under Measured Behavior |
| Spec, plan and tasks | Done | This folder |
| Packet validation | Done | `validate.sh --strict --quiet` printed `RESULT: PASSED (errors=0 warnings=0)` on 2026-11-16 |
| Operator review of the plan | Pending | None yet |
| Build | Pending | None yet |
| Surface score, two windows | Done | The operator chose two windows on 2026-11-16. Vibe runs 07 to 17, each exit_code 0, outcome finished, bytes matched. The bin tests printed tests 198, pass 197, fail 0, skipped 1. The probe routes sk-code-review and sk-code-frontend. A prompt that matches all five modes falls back to legacy routing |

### Deviations and findings

| Item | Note |
|------|------|
| The handover names `hintedFallbackSurface` as upstream code | It is not. `git grep` finds it at neither `d0fc9d719b` nor `HEAD`. It is in the vendoring project's overlay of `canary-router.cjs`, four matches. |
| The handover says every file it names is held at upstream bytes unless an overlay is named | `canary-router.cjs` is overlaid in the vendoring project and the handover names no overlay for it. Its overlay also changes the scoring to merged prompt spans. |
| The vendoring project confirmed the `hintedFallbackSurface` finding and corrected its handover on 2026-11-16 | It also added `joinHintedSurface` to its own overlay, which leans on the frontend weight it lowered. It will drop the overlay when Skilled ships its own form. |
| The handover's item 9 scores are 8 and 4 | This repository scores the review prompt 12 and 4, because it counts distinct keywords. The route is the same: the frontend surface alone. |

Open question: is parity with the legacy replay still an enforced gate? The comments in `canary-router.cjs` say the scoring matches it. T002 answers this before any score changes.
<!-- /ANCHOR:log -->
