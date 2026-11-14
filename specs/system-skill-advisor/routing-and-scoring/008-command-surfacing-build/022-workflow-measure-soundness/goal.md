---
title: "Goal: Phase 22: workflow-measure-soundness"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "workflow measure soundness goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/022-workflow-measure-soundness"
    last_updated_at: "2026-11-14T08:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the durable directive"
    next_safe_action: "Run T001 once phases 019 and 021 are Complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-022-workflow-measure-soundness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 22: workflow-measure-soundness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make the workflow measure count what a run did, so its rate can be read as how often a model opened the right workflow or asked as its policy told it to.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every field the earlier summary prints keeps its name and its rule. New facts arrive as new fields. |
| D2 | Phase 019's folder and its recorded numbers are not edited. This phase writes its own files and states why its numbers differ. |
| D3 | No rule is bent to make a stored run score better. Each changed count is explained by the rule that moved it. |
| D4 | No rate is called a gain or evidence of the outcome here. The rows are tuned and each ran once. |
| D5 | No model session, behaviour run, corpus edit or target value. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `env -u AI_SESSION_CHILD npx vitest run` in `.skilled/skills/system-skill-advisor/runtime` reports 0 failed.
- [ ] `node scratch/planning/probe-measure-units.mjs`, run from the repository root by its path in this folder, prints `skill`, `command`, `command`, `command`, `otherMode`, `skill` and `asked` as the values of its first seven lines.
- [ ] `scratch/workflow-after-pre.json` and `scratch/workflow-after-final.json` exist, and in each `workflow` block `command + skill + asked + otherMode + improvised + none` equals the denominator of `followedRate`.
- [ ] Each `workflow` block still holds `share`, `loadRate` and `noneActed`, and the denominator of each `loadRate` equals the sum of its six path counts.
- [ ] `scratch/workflow-delta.txt` holds 11 lines that start with a runtime and `pre` or `post`, each with a reason for every changed count.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/022-workflow-measure-soundness --strict` prints `RESULT: PASSED` with the phase status Complete.
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
| Phase planned | Done | 2026-11-14, commit 16c9757ac0 with phase 019's scorer uncommitted. Probes in `scratch/planning/` |
| Final arm, counted by the probe | Recorded | Ask rows scored `none` with no write: claude 4 of 4, pi 3 of 4, opencode 2 of 4, devin 1 of 4. Improvised runs whose first write was outside the repository: 6 of 6. Possible missed shell loads: pi 7, opencode 6, dsh 1 |
| Level | Decided | `recommend-level.sh --loc 320 --files 6` printed Level 1. Level 2 chosen because the closure gate is `acceptance-criteria.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Review findings in scope | A-9, A-11 in two of three parts, A-12, B-2, B-7 and B-8. A-3 is stated here and fixed by phase 021 |
| Already fixed in phase 019 | A-1 and A-10 |
| Declined | The fallback head counted as a delivery: it is one, and its offer is recorded as null |
<!-- /ANCHOR:log -->
