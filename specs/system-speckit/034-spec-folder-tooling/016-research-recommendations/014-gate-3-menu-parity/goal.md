---
title: "Goal: Gate 3 menu parity"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/014-gate-3-menu-parity"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Phase built and verified"
    next_safe_action: "Commit with wave 1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Gate 3 menu parity

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Restore "in the same track" to 9 presentation files and 3 compiled contracts that carry Gate 3 option C menus, and add a parity test that confirms all 12 files match the constant wording.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Constants in `spec-gate-core.mjs:151` are the authored source; the 12 files are verified copies kept in parity by the test |
| D2 | 9 presentation files are edited directly; 3 deep contracts are regenerated from their sources via `compile-command-contracts.cjs` |
| D3 | Hook test baseline (spec-gate-core.test.mjs:324) is left unchanged; no hook test assertions are modified |
| D4 | Built in wave 1 by DeepSeek V4.1 Flash max through cli-pi on the OpenCode Go route: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<brief>" --model opencode-go/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null`. One task from tasks.md per brief, in task order, and the diff is checked before the next brief |
| D5 | Reviewed read-only by Luna max fast through cli-codex with `--sandbox read-only`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D6 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] All 9 named presentation files include "in the same track" in Gate 3 option C
- [x] 3 deep contracts are regenerated and include the phrase
- [x] A parity test passes on all 12 files
- [x] Hook test baseline hash remains unchanged
- [x] Phase validates strictly
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
| Inventory presentation files | Done | 9 named files plus 3 deep contracts; 3 more bearers recorded as follow-ups |
| Update presentation files | Done | One option C line per file, full constant wording |
| Regenerate contracts | Done | `compile-command-contracts.cjs --write --command deep/<name>` for all 3 |
| Create parity test | Done | `gate-3-menu-parity.test.mjs`, 12 pass, 0 fail |
| Cross-family review | Done | Luna round 1: one P1, fixed and confirmed with a planted stale line |
| Validate changes | Done | Hook tests 0 fail, `validate.sh --strict` passed |

### Deviations and findings

| Item | Note |
|------|------|
| Contract regeneration ran by the orchestrator | The codex and pi sandboxes cannot run every check, so this session ran `compile-command-contracts.cjs` itself after the builder's presentation edits |
| Two briefs instead of one per task | T004 was one brief over the 9 files and T006-T007 another, because each is a single mechanical change; the diff was checked after each |
| Three more menu bearers | `speckit-implement.yaml:52`, `worked-examples.md:60` and `trigger-config.md:134` lack the phrase; outside the frozen 12 |
<!-- /ANCHOR:log -->
