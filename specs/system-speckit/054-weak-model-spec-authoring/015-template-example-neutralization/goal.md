---
title: "Goal: Phase 15: template-example-neutralization"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "template example neutralization goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/015-template-example-neutralization"
    last_updated_at: "2026-10-26T15:30:00Z"
    last_updated_by: "planner"
    recent_action: "Recorded the sweep and planned the rewrite"
    next_safe_action: "Take the census and guard baselines, then write the replacement table"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-015-template-example-neutralization"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 15: template-example-neutralization

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Print one parseable level line on request. WEAK: Improve the script. -->

**Objective:** Make every example a model reads while authoring a spec packet use one neutral feature, so no benchmark run can copy hints about its own task.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The neutral example is a `--keep <n>` option for a fictional `scripts/rotate-logs.sh` that deletes all but the newest n archives in `logs/archive/`. With no option every archive stays. With 10 archives, `ls logs/archive \| wc -l` prints 3 after `--keep 3` and 10 after a plain run; a missing or non-numeric value exits 2 with usage. No file named `rotate-logs` exists in the repository. |
| D2 | Phase 018's new benchmark task must differ from D1: it may not add a retention, keep or rotation option to a log script, and may not use `rotate-logs.sh`. |
| D3 | Every rewritten fill note keeps its shape: the instruction before `GOOD:` stays word for word, and it holds one GOOD example then one WEAK example, as before. |
| D4 | Lines that use the real `recommend-level.sh` as the level helper or the real `validate.sh --quiet`, and the tests, fixtures, playbook scenario and records listed in `scratch/example-sweep.md`, stay as written. |
| D5 | DeepSeek V4.1 Flash max through cli-pi makes the edits, one short brief per file with literal old and new text; cli-codex `gpt-6-luna` is the fallback; a fresh Opus medium agent reviews the diff; the conductor runs every gate. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--quiet` prints 1 line and exits 0. WEAK: The work is done. -->

- [ ] The term gate over the fill notes in `templates/core` and `templates/addons` prints 0 lines, and the card holds only its 7 real tool lines
- [ ] `template-fill-guidance.vitest.ts` prints `24 passed` and the regenerated `scaffold-golden-snapshots.vitest.ts` prints `12 passed`
- [ ] `check-card-sync.sh` prints `CARD SYNC OK` and `check-example-drift.sh` prints `EXAMPLE_DRIFT_OK`
- [ ] The sorted strict census over the 4,719 folders diffs to nothing before and after
- [ ] `sync-skills-hermes.cjs --check` prints `PASS`
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
| Phase opened | Done | create.sh scaffolded this folder on 2026-10-26 |
| Sweep | Done | `scratch/example-sweep.md`: 87 lines in 12 files (52 direct, 35 story), plus 96 snapshot lines; term gate baseline 63 |
| Guard baselines | Done | `CARD SYNC OK`; `EXAMPLE_DRIFT_OK`; `PASS: 67 Hermes skill copies in sync`; fill guidance `24 passed`; snapshots `12 passed` |
| Census baseline | Pending | T002 |
| Replacement table | Pending | T004 |

### Deviations and findings

| Item | Note |
|------|------|
| Story lines beyond the direct terms | 35 fill notes tell the flag-on-a-script story without naming it ("callers already pass flags", "the same 40 ms run"); they are in scope because D1 asks for one feature used consistently |
| Manual playbook scenario left alone | `level-1-packet-authored-from-card.md:79` asks a model to describe the same flag; it is a test input, so phase 018 decides whether it moves to the new task |
<!-- /ANCHOR:log -->
