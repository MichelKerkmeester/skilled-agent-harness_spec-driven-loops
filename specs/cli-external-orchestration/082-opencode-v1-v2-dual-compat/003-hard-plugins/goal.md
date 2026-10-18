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

- [x] `opencode2 api GET /api/plugin` lists all five names from `scratch/hard-5.txt` as active, and `scratch/v1-load-after-003.txt` lists all five with no `failed to load plugin` line. Evidence: `scratch/v2-active-003.txt:5,11,12,14,15` carries all five names, `scratch/v2-after-003.json` reports 16 entries and 16 active, and the five v1 plugin lines sit at `scratch/v1-load-after-003.txt:7,9,10,15,21` with 0 `failed to load plugin` lines.
- [x] `scratch/hard-before.txt` fails all registration cases, and `scratch/hard-after.txt` passes them. Evidence: `scratch/hard-before.txt:1-5` fails all five registration cases (9 tests, 0 pass, 9 fail at `:10-13`), and `scratch/hard-after.txt:1-5` passes them (10 tests, 10 pass, 0 fail at `:11-14`).
- [x] Both behaviour cases named `sentinel` and `spec gate` fail in `scratch/hard-before.txt`, and both pass in `scratch/hard-after.txt`. Evidence: `scratch/hard-before.txt:6-7` and `scratch/hard-after.txt:6-7`.
- [x] `sk-vision` loads on v1 and v2 from a rebuilt `dist/plugin.js`, or `scratch/sk-vision-blocked.txt` names the phase 1 blocker. Evidence: `scratch/sk-vision-build-after-fix.txt:1-8` (typecheck exit 0, build exit 0, `dist/plugin.js` 506257 bytes), `scratch/v1-harness-after-003.jsonl:10` (loaded on v1 on `command.execute.before`), and `scratch/v2-active-003.txt:10` (active on v2).
- [x] `scratch/suite-after.txt` reports zero failures and a pass count at or above `scratch/baseline-floor.txt`, and no step runs `opencode2 service stop`, `opencode2 service start` or `opencode2 service restart`. Evidence: `scratch/suite-after.txt:363-366` reports 353 pass and 0 fail against the floor of 331 (`scratch/baseline-floor.txt:2-4`), and `scratch/service-state.txt:2` shows the same service PID and start time as phase 2, so it was not restarted.
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
| Tests before ports | Done | `scratch/hard-before.txt:10-13` (9 tests, 0 pass, 9 fail against the unported tree) |
| Four JavaScript ports | Done | `scratch/hard-after.txt:1-4` (registration cases pass), `scratch/port-a-tests.txt:51-54` (50 of 50) and `scratch/port-b-tests.txt:139-142` (138 of 138) |
| Seam moves | Done | `scratch/scope-check-003.txt:20-21` (the two core modules), `scratch/grep-checks-003.txt:13-14` (no `__test` line in the entry modules) |
| Shared bridge extension | Done | `.opencode/plugins/lib/v2-bridge.js:148` (the queue call), `:351` (the context hook) and `:367` (the tool transform), `scratch/fix-v2-tests.txt:51-54` (50 of 50) |
| sk-vision port and rebuild | Done | `scratch/sk-vision-build-after-fix.txt:1-15` (typecheck and build exit 0, 29 pass), `scratch/v1-harness-after-003.jsonl:10` and `scratch/v2-active-003.txt:10` |
| Live v2 proof of the event names | Done | `scratch/live-probe/run1-output.txt:3` and `scratch/live-probe/run2-events.jsonl:1` (two approved runs), `scratch/phase1-answers.txt:81-84` (the verdicts) |
| Review and its fixes | Done | `scratch/review-003.txt:7-11` (no P0, four P1), `scratch/fix-003-report.txt:3-15` (the four fixes), `scratch/review-003-verify.txt:2` (all four closed, no new P0 or P1, PASS) |
| Verification captures | Done | `scratch/hard-after.txt:11-14`, `scratch/suite-after.txt:363-366`, `scratch/v1-load-after-003.txt:7`, `scratch/v2-active-003.txt:5`, `scratch/grep-checks-003.txt:1`, `scratch/scope-check-003.txt:1` |
| Closure docs | Done | The completion criteria above, `acceptance-criteria.md` and `tasks.md` in this folder |

### Deviations and findings

| Item | Note |
|------|------|
| Class of `system-skill-advisor` | Research marks it mechanical. The brief marks it hard. Decision 1 records the hard class: it reads session messages through the v1 client and reacts to `session.compacted`, which v2 does not deliver (`scratch/decisions.txt:3`). |
| Seam homes | Decision 2 moves the sentinel and goal seams to `lib/completion-sentinel-core.js` and `lib/opencode-goal-core.js`, and removes the spec-gate seam because no test read it (`scratch/decisions.txt:4-8`). |
| Goal port size | `opencode-goal.js` is about 143 KB. The port ran in three dispatches (T012a to T012c), and one orchestrator test edit cleared 13 ReferenceError failures (decision 6, `scratch/decisions.txt:17`). |
| `sk-vision` named export | Decision 3 removes `SkVisionPlugin`, and decision 12 keeps the named helper `toV1FileUrl` beside the default export for the plugin test (`scratch/decisions.txt:9`, `:28`). |
| Shared bridge carries the v2 legs | Decision 5 amends the per-plugin v2 legs: the phase 2 bridge carries them for the four JavaScript plugins (`scratch/decisions.txt:12-16`). |
| Two approved live model runs | The operator approved two short v2 runs on `llmgateway/deepseek-v4.1-flash`, the one deviation from CHK-031's model-free rule. The operator approved those two runs only (`scratch/evidence.md:24`). |
<!-- /ANCHOR:log -->
