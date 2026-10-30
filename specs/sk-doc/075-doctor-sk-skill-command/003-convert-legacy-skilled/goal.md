---
title: "Goal: Phase 3: convert-legacy-skilled"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "convert legacy skilled goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/003-convert-legacy-skilled"
    last_updated_at: "2026-10-30T07:10:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: convert-legacy-skilled

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Convert an older Skilled skill whose machine router lives in `SKILL.md` into a canon root with `ROUTER.md`, with proof that its parsed router did not change.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The section moves verbatim; any `parseRouter` difference rolls the step back. |
| D2 | Every overwrite is backed up first; every create is exclusive; nothing writes without `--apply`. |
| D3 | Dual declarations, hubs, nested packets and `local-` prefixed names are refused, not converted. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` exits 0
- [x] The converted pre-move fixture's machine section is byte-equal to the post-move file, `parseRouter` text output deep-equals, and actual routing semantics are unchanged
- [x] `package_skill.py --check --strict` on the converted fixture prints `Result: PASS`
- [x] A second `apply --apply` on the converted fixture changes no file hash
- [x] A target file that already exists is byte-identical after `apply --apply`
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
| Phase implementation | Complete | Converter test: 5/5; route validator: 18 routes; drift guards: 4/4; golden strict gate: PASS |

### Deviations and findings

| Item | Note |
|------|------|
| Backup path | Named `.state/doctor-sk-skill/` to follow the operator's `/doctor:sk-skill` rename; the design wrote `.state/doctor-skill/` |
<!-- /ANCHOR:log -->
