---
title: "Goal: Phase 18: benchmark-redesign-and-remeasure"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "benchmark redesign and remeasure goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/018-benchmark-redesign-and-remeasure"
    last_updated_at: "2026-10-26T18:30:00Z"
    last_updated_by: "conductor"
    recent_action: "Closed out: every acceptance criterion Met"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-018-benchmark-redesign-and-remeasure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 18: benchmark-redesign-and-remeasure

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Print one parseable level line on request. WEAK: Improve the script. -->

**Objective:** Tell the operator, under one stated rule, which effects of packet 054 on a weak model's spec authoring are real, using a rescore of the existing packets and a fair rerun on a task no template names.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The new task is "Add a `--min-percent <N>` option to `calculate-completeness.sh`" at the level the helper prints for `--loc 40 --files 2`, which is Level 0 and so `--level 1` by the card; no forced Level 3. If phase 015's neutral example names that script, the conductor picks another script no template names and records it here. |
| D2 | A comparison is REAL only when at least 4 of 5 rounds give a valid pair and every valid pair shares one sign on its metric, `tok_out` for speed and the blind total for quality; a quality claim also needs the rescore's `Verify:` ratio or residue count to move the same way. Anything else is INCONCLUSIVE. Seconds never decide alone. |
| D3 | Run 2 pre054 round 1 is contaminated and is left out of the rescore and every mean. A run the new loop marks contaminated gets no grade. |
| D4 | The benchmark subject is cli-devin `deepseek-v4-1-flash-1017-max`. Loop edits run on DeepSeek V4.1 Flash max through cli-pi, with cli-codex `gpt-6-luna` as fallback. Each grade and each review comes from a fresh Opus medium agent. |
| D5 | The variants are pre054, main-no054, now054 and refined, and refined is snapshotted only after phases 015, 016 and 017 are Complete. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--quiet` prints 1 line and exits 0. WEAK: The work is done. -->

- [ ] `scratch/rescore/rescore.tsv` holds 23 data rows
- [ ] Every sandbox line of the new run in `prep/prep-times.tsv` reads `task_term_refs=0`
- [ ] `scratch/remeasure/results.tsv` holds 20 author rows
- [ ] `scratch/grading/` holds one JSON file per valid author run
- [ ] `scratch/report.md` holds one REAL or INCONCLUSIVE line per comparison
- [ ] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `rg -n quiet` printed line 510. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase planned | Done | spec, plan, tasks, acceptance criteria and this goal written on 2026-10-26 |
| Rescore and loop hardening | Done | `rescore.tsv` 23 rows; loop review `Verdict: PASS` after its fix check |
| 5-round run | Done, with a top-up | Main run `20261026T164410Z-40710` (17 valid author runs) plus top-up `20261026T170823Z-68750` (12 valid), 8 rounds in all |
| Grading and report | Done | 29 blind grades; `report.md` verdicts; report review `Verdict: PASS` after its fix check |
| Closeout | Done | Every acceptance criterion Met; loop and results `eace51ce7c`, docs `ef939bf0ac` |

### Deviations and findings

| Item | Note |
|------|------|
| `step.sh` fix already in the tree | `SPECKIT_DIST_AUTO_REBUILD=0` was added before this phase opened, after newer trees rebuilt packages inside timed steps; this phase commits it |
| Level 1 packets | The new task scores Level 0, so its packets hold no `acceptance-criteria.md` and fewer sample sections; residue counts compare within one run only |
| Top-up run | main-no054 was refused for rounds 3 to 5 after its round 2 author dirtied the sandbox, so a 3-round top-up ran; D2 is applied over 8 rounds as at least 4 valid pairs, all of one sign |
<!-- /ANCHOR:log -->
