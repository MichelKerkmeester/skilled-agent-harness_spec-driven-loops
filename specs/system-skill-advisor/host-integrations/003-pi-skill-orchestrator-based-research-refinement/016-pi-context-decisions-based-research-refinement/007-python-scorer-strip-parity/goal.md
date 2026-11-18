---
title: "Goal: Python Scorer Strip Parity"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "python scorer strip parity goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/007-python-scorer-strip-parity"
    last_updated_at: "2026-11-18T17:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Start task T001 once phase 006 is complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20078428-5166-43d7-85ac-a68d9210f82f"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Python Scorer Strip Parity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The Python local scorer drops a pasted earlier reply exactly as the native scorer does, so the CLI's fallback, validation and the parity ledger all score the same text on both sides.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The strip runs first in `analyze_request`, after its empty check, so every Python caller gets it from one call |
| D2 | The Python rule is phase 006's final rule. It uses JavaScript's whitespace set for `\s` and for trimming, and `re.IGNORECASE` with `re.ASCII` |
| D3 | The Python test reads `runtime/tests/fixtures/pasted-reply-strip-cases.json` through the existing harness. No new test framework |
| D4 | The ledger changes only through `capture-local-native-divergence-ledger.mjs`, after a rebuild |
| D5 | A parity pin moves only up, by the rows the port fixes, with the accepted regression list unchanged |
| D6 | Built by the parent's Luna swarm with the Vibe fallback. The conductor runs every check. The Python test lands and fails before the port |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `python3 .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` exits 0 with a PASS line for each of the 23 fixture ids
- [ ] `npx vitest run tests/parity` exits 0 from the advisor runtime folder
- [ ] `rg -c rr-paste-208 .skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` prints nothing and exits 1
- [ ] Piping the phase 002 probe to `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py --threshold 0.8 --uncertainty 0.35 --stdin` returns `sk-code` as the first skill
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Phase planned | Done | `spec.md`, `plan.md` and `tasks.md` written 2026-11-18. Measurements in `spec.md` Measured Behavior |

### Deviations and findings

| Item | Note |
|------|------|
| Extra files beyond the brief | The two parity suites pin Python-reference counts that the port raises, so they are listed now instead of found by a failing gate |
| CLI fallback line range | The brief cited `skill-advisor-cli.ts:1456-1468`. `runLocalScorer` spans `:1456-1476` and its call site is `:1577` |
<!-- /ANCHOR:log -->
