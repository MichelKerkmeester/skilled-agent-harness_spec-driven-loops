---
title: "Goal: Phase 1: unknowns-and-baseline"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "unknowns and baseline goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/001-unknowns-and-baseline"
    last_updated_at: "2026-10-18T12:45:01Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-unknowns-and-baseline"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: unknowns-and-baseline

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Settle the eleven open OpenCode v1 and v2 questions with evidence, and record a load baseline for all 16 repo plugins on both versions, before any repo code changes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| L1 | This phase writes only inside its own folder. The one exception is the gitignored sk-vision `dist/` folder, which the build step creates. |
| L2 | A verdict cites the command and output it came from. A question that a rerun does not settle stays unknown. |
| L3 | Every probe that writes sessions sets `OPENCODE_DB` to a file under `scratch/`. |
| L4 | Probes that call a model name a model id that does not exist, so no paid model call runs. |
| L5 | The sk-vision bundle is built in place, as the parent goal log asks, and the built artifact is recorded. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `findings.md` holds one `### Q` verdict per question from Q1 to Q11, and verdicts cite a command and an output excerpt. `grep -c '^### Q' findings.md` prints 11.
- [ ] `baseline.json` lists 16 repo plugins, and entries hold a v1 load state and a v2 load state. `node -p 'Object.keys(require("./specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline/baseline.json").plugins).length'` prints 16.
- [ ] `findings.md` names the source path `vision-runtime/src` and records a load result for sk-vision on v1 and on v2, or records sk-vision as blocked.
- [ ] No new path appears outside the child folder when `git status --porcelain` is compared with `scratch/status-before.txt`, apart from a gitignored sk-vision `dist/` folder.
- [ ] `baseline.json` records pass and fail counts for two suites, named plugin and guard.
- [ ] `findings.md` lists decision changes for the parent `spec.md` under the heading `## Decision changes for the parent`.
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
| Planning documents filled | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` and `implementation-summary.md` in this folder |
| Probes, baseline and findings | Pending | `findings.md` and `baseline.json` are not written yet |

### Deviations and findings

| Item | Note |
|------|------|
| sk-vision build location | The parent goal log says 001 builds the bundle before the baseline. The brief's acceptance says no file outside the child changes. The plan builds in place, and the orchestrator confirms the choice. |
| Parent goal written during planning | The parent `goal.md` was not in its folder when this planning began. The orchestrator or another session wrote it during planning. This goal restates no parent decision, and the parent binds the phase. |
<!-- /ANCHOR:log -->
