---
title: "Goal: Phase 12: fix-barter-022-handover-items-for-doctor-scripts"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fix barter 022 handover items for doctor scripts goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/012-fix-barter-022-handover-items-for-doctor-scripts"
    last_updated_at: "2026-11-16T10:06:48Z"
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
# Goal: Phase 12: fix-barter-022-handover-items-for-doctor-scripts

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Close the three doctor script items still open from a vendoring project's first handover, so its own hook, its excluded paths and a generator's rewrite each have a supported form.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Plan first. The operator chose check and plan on 2026-11-16. No script changes until the operator has read `plan.md`. |
| D2 | The vendoring project's tree at `barter/ai-speckit` is read-only. Work it must do is written to `handover-to-barter.md` in this packet. |
| D3 | Each change starts with a test that fails first, and is paired with a test that the nearest refusal still holds. |
| D4 | A stage keeps skipping the regenerate steps. The operator chose this on 2026-11-16. |
| D5 | A host hook is declared as `skilled.hostHook` in local git config, one value per hook. The operator chose this on 2026-11-16. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` with the new tests in the count.
- [ ] A test passes the hooks row for an installed hook listed under `skilled.hostHook`.
- [ ] A test adopts a path under `repin.exclude` that has an overlay source.
- [ ] `handover-to-barter.md` exists in this folder.
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
| Handover copied in | Done | `cmp` against the vendoring project's `022-repin-edf921316c/handover.md` printed nothing, exit 0 |
| Three items read against the scripts | Done | The `rg` output in `spec.md` under Measured Behavior |
| Spec, plan and tasks | Done | This folder |
| Operator review of the plan | Pending | None yet |
| Build | Pending | None yet |

### Deviations and findings

| Item | Note |
|------|------|
| None of the three limits has been run here | Each is read in the code and observed by the vendoring project. T003, T004 and T006 are the first runs. |
| The handover's first proposal for item 2 is declined | A stage drops the regenerate steps on purpose, at line 3783 of the engine. The operator confirmed this on 2026-11-16. |
| Where `skilled.omitHook` is documented | UNKNOWN. A search of the markdown under `.skilled` finds only a changelog entry. T002 settles it. |
<!-- /ANCHOR:log -->
