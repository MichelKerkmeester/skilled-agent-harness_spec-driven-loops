---
title: "Goal: Phase 11: authoring-speed-research"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "authoring speed research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/011-authoring-speed-research"
    last_updated_at: "2026-10-26T05:35:00Z"
    last_updated_by: "conductor"
    recent_action: "Timed the refined tree with the speed loop"
    next_safe_action: "Run a longer benchmark only if the operator asks for one"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-011-authoring-speed-research-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 11: authoring-speed-research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Find where models spend time writing and maintaining spec docs, and rank the changes that make authoring faster than before packet 054 without losing the quality it added.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The research runs five iterations through `/deep:research` with cli-pi DeepSeek V4.1 Flash max. An Opus 5.5 high subagent synthesizes the result. |
| D2 | Each recommendation names the file it changes, the time it saves and the quality risk it carries. A recommendation without a source citation is not ranked. |
| D3 | A compact speed loop in `scratch/speed-loop/` times the pre-054, 054 and refined trees side by side, under the same load, in minutes rather than hours. The full benchmark waits for 2026-10-26. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `research/research.md` ranks every recommendation by time saved against quality risk, with a `[SOURCE: path:line]` citation for each
- [x] Each ranked recommendation is assigned to a remediation phase or recorded as deferred with its reason
- [x] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
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
| Phase opened | Done | `create.sh --phase --phase-parent` scaffolded this folder on 2026-10-25 |
| Research and synthesis | Done | 5 iterations; `rg -c '\*\*(build now|defer)\*\*' research/research.md` prints 12 |
| Validation | Done | `validate.sh --strict --no-recursive` printed `RESULT: PASSED`, 0 errors, 82 citations resolve |
| Speed loop | Built, smoke-run | `scratch/speed-loop/loop.sh`; one smoke round (`results/20261025T223407Z-30309/summary.md`): author pre-054 236 s vs 054 144 s, upkeep 103 s vs 40 s, both strict PASS, n=1 so INCONCLUSIVE |
| Speed loop, refined tree | Done, INCONCLUSIVE | 2026-10-26, 3 rounds x 4 trees, 24 runs, all strict PASS (`results/20261026T050500Z-67716/summary.md`). Refined against 054 now: author +17 s mean (pairs -174 to +178), upkeep +1 s (-34 to +19). Refined against main without 054: author +0.7 s. Main without 054 against pre-054: author +27 to +176 s in all 3 pairs |

### Deviations and findings

| Item | Note |
|------|------|
| Level | The folder is Level 1, the lightest level that fits a research phase, per parent decision D6. |
| What the loop can see | An authoring run takes 157 to 368 s, and its time follows its tool-call count (r=0.91 over the 12 author runs), not the tree. A wording change worth less than that 75 s spread needs far more rounds than a compact loop gives. What the loop does show: 054 adds no measurable authoring time over the same main without it, and the gap to pre-054 is main's drift. |
<!-- /ANCHOR:log -->
