---
title: "Goal: Phase 21: vibe-hook-docs-correction"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vibe hook docs correction goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/021-vibe-hook-docs-correction"
    last_updated_at: "2026-11-14T21:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Planned the Vibe hook doc correction and parent closeout"
    next_safe_action: "Wait for phases 014 to 020, then run T001"
    blockers:
      - "Phases 014 to 020 must close with recorded runs first"
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 21: vibe-hook-docs-correction

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the Vibe guard reference and its index describe the hook seams that were built, each line backed by a recorded run.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No line changes on a source reading alone: each corrected line cites a phase 014 to 019 test or `scratch/` record |
| D2 | A row whose proof run is missing keeps its current verdict with an UNVERIFIED note naming the missing run |
| D3 | The phase runs last, after phases 014 to 020 close |
| D4 | One code comment is the only non-doc change |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `scratch/citation-map.md` maps every changed line in the guard reference to a recorded run
- [ ] `rg -c 'UNKNOWN wire format'` on the cli-mistral-vibe `SKILL.md` and `README.md` exits 1
- [ ] `validate.sh <parent> --recursive --strict` prints `RESULT: PASSED`
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
| Baseline | Done | Five `not portable` rows, one `UNKNOWN wire format` line in each index, and the `pre_agent` comment (`spec.md` Measured Behavior) |
| Build | Pending | Waits on phases 014 to 020 |

### Deviations and findings

| Item | Note |
|------|------|
| Index line numbers | The carried note named `SKILL.md:144` and `README.md:109`; the lines sit at 145 and 110 in this checkout, so T001 anchors by text |
| Rows beyond the carried list | The carried list named lines 65, 130-131, 135, 160 and 163; rows 132 and 133 (session relaunch, history lookup) and rows 128-129 (dist freshness, skill advisor) also change once phases 015, 018 and 019 run |
<!-- /ANCHOR:log -->
