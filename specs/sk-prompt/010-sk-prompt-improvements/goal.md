---
title: "Goal: Fix sk-prompt drift and recommend improvements from a survey of other prompt improvers"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "sk prompt improvements goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/010-sk-prompt-improvements"
    last_updated_at: "2026-10-30T05:32:33Z"
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
# Goal: Fix sk-prompt drift and recommend improvements from a survey of other prompt improvers

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make sk-prompt a lighter, test-backed prompt improver whose method matches what current prompt improvers and vendor guidance actually do.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | sk-prompt drops the DEPTH thinking framework; the operator chose this on 2026-10-30 |
| D2 | Recommendations come from a survey of other prompt improvers, local and public, not from a DEPTH or deep-research run |
| D3 | Both stale references are fixed in their own repos: Skilled and AI Systems |
| D4 | sk-prompt stays model-agnostic: no per-model output profiles and no `target_model` field; the operator chose this on 2026-10-30 |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `rg -n "skill_advisor.py" .skilled/skills/sk-prompt/SKILL.md` and the `sk-prompt-small-model` grep over Prompt Improver both print nothing
- [x] `rg -c "DEPTH"` over sk-prompt, its agent and `/prompt:improve` prints 0 outside changelogs
- [x] `bash .skilled/skills/sk-prompt/benchmark/router/run_fixtures.sh` prints `PASSED n/n`
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
| Drift fix | Done | Residue greps exit 1; Prompt Improver `run_fixtures.sh` printed `PASSED 32/32 fixtures` |
| Survey and recommendations | Done | `scratch/prompt-improver-survey.md`, `spec.md` REQ-002 to REQ-011 |
| Build | Done | `tasks.md` T004 to T011 marked with evidence; router fixtures `PASSED 12/12 fixtures` |
| DEPTH residue | Done | Outside changelogs only two 2026-07-21 benchmark report JSONs match; they are recorded run output, left as written |

### Deviations and findings

| Item | Note |
|------|------|
| Vendored copy | AI Systems keeps DEPTH by operator decision (2026-10-30); its copy is not resynced from Skilled |
<!-- /ANCHOR:log -->
