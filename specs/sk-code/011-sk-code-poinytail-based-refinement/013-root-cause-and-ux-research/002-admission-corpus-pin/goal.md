---
title: "Goal: Phase 2: admission-corpus-pin"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/002-admission-corpus-pin"
    last_updated_at: "2026-10-10T19:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-002-admission-corpus-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: admission-corpus-pin

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the compiled-route admission suite pass on a clean checkout by pinning the live gold corpus size it guards, with the report rerun that the pin's comment asks for.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The pin stays a literal change detector; it is re-pinned, not derived, because its job is to fail when scenarios change. |
| D2 | The rerun report goes to this phase's `evidence/` folder; the original baseline in its own packet is left as recorded. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/bin/tests/compiled-route-admission.test.cjs 2>&1 | grep -E '^ℹ (pass|fail)'`, run from the repository root, prints `ℹ pass 29` and `ℹ fail 0`.
- [x] `grep -c 'const LIVE_CORPUS_SIZE = 86;' .skilled/bin/tests/compiled-route-admission.test.cjs`, run from the repository root, prints 1.
- [x] `grep -c '^| `' specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/002-admission-corpus-pin/evidence/admission-report.md`, run from the repository root, prints 7 or more.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/002-admission-corpus-pin --strict`, run from the repository root, prints RESULT: PASSED.
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
| Before numbers | Done | 29 tests, 28 pass, 1 fail, actual 86 expected 80 |
| Pin changed | Done | cli-pi build; 29 tests, 29 pass, 0 fail |
| Report rerun | Done | `compiled-route-admission.cjs --all --warn-only --out evidence` exit 0; seven hubs, scenario counts sum to 86 |

### Deviations and findings

| Item | Note |
|------|------|
| Baseline left in place | The pin's comment asks for a baseline rerun. The original lives in a closed system-speckit packet, so the rerun was written here instead of overwriting another packet's evidence |
| Drift reported, not fixed | The rerun shows system-deep-loop at drift, 21 of 22 fitted. It is outside this phase's file |
<!-- /ANCHOR:log -->
