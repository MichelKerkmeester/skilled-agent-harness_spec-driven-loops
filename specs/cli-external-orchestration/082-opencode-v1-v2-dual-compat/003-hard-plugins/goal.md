---
title: "Goal: Phase 3: hard-plugins"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hard plugins goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/003-hard-plugins"
    last_updated_at: "2026-10-18T12:45:03Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-hard-plugins"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: hard-plugins

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Port the five hard OpenCode plugins so that each loads and behaves on v2 2.0.32 as well as on v1 1.19.3, and rebuild the sk-vision bundle from its source or record its blocker.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| L1 | Each v2 leg uses only the hook names that the 2.0.32 declarations list in `scratch/v2-types.txt`. |
| L2 | Each port keeps its v1 hook body, and it changes only the export and the v2 leg. |
| L3 | Each v2 behaviour case uses a stub context, and it asserts the observed effect, not only the registration. |
| L4 | Each seam moves to a core module under `.opencode/plugins/lib/`, and no default export keeps a seam key. |
| L5 | A v2 event that never fires is recorded as a gap, with the phase 1 verdict beside it. The phase does not claim the behaviour. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `opencode2 api GET /api/plugin` lists all five names from `scratch/hard-5.txt` as active, and `scratch/v1-load-after-003.txt` lists all five with no `failed to load plugin` line.
- [ ] `scratch/hard-before.txt` fails all registration cases, and `scratch/hard-after.txt` passes them.
- [ ] Both behaviour cases named `sentinel` and `spec gate` fail in `scratch/hard-before.txt`, and both pass in `scratch/hard-after.txt`.
- [ ] `sk-vision` loads on v1 and v2 from a rebuilt `dist/plugin.js`, or `scratch/sk-vision-blocked.txt` names the phase 1 blocker.
- [ ] `scratch/suite-after.txt` reports zero failures and a pass count at or above `scratch/baseline-floor.txt`, and no step runs `opencode2 service stop`, `opencode2 service start` or `opencode2 service restart`.
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
| Tests, ports, sk-vision, verification and review | Pending | Tasks T001 to T025 in `tasks.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Class of `system-skill-advisor` | Research marks it mechanical. The brief marks it hard. This goal follows the brief, and task T003 records the orchestrator's decision. |
| Seam homes | The brief names no core modules. Each seam moves to its own core module under `.opencode/plugins/lib/`, and task T003 confirms the names. |
| Goal port size | `opencode-goal.js` is about 143 KB. The port runs in three dispatches (T012a to T012c). |
| `sk-vision` named export | `src/plugin.ts` exports `SkVisionPlugin` beside its default. Task T003 decides whether it stays. |
<!-- /ANCHOR:log -->
