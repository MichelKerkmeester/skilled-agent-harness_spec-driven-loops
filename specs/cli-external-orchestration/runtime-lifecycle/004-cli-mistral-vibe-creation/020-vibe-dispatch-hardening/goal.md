---
title: "Goal: Phase 20: vibe-dispatch-hardening"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vibe dispatch hardening goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/020-vibe-dispatch-hardening"
    last_updated_at: "2026-11-14T21:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Planned the four carried Vibe dispatch gaps"
    next_safe_action: "Run T001 to capture the rule suite baseline"
    blockers: []
    key_files:
      - ".skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs"
      - ".skilled/skills/cli-external-orchestration/cli-mistral-vibe/hard-rules.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which lineage posture: keep --auto-approve behind the rendered guards, or tighten?"
      - "Does the repository pre-commit hook run any hook node:test suite?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 20: vibe-dispatch-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make sure no Vibe dispatch runs without its guards unnoticed, the lineage posture is a recorded decision, and every Vibe hook test runs in CI.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The render step is enforced as a dispatch hard rule on the command text, in the existing Vibe rule family |
| D2 | A `VIBE_HOME` named by a variable passes the render rule only when the same command renders into the same textual value, so the documented recipe with the render step removed is refused |
| D3 | The lineage posture is chosen by the operator before any lineage flag changes |
| D4 | CI, not a new local hook, is the gate for the repo-guards tests unless T003 finds a pre-commit seam that already runs hook suites |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` prints `fail 0` with a refuse case for an unrendered dispatch
- [ ] The parent's `decision-record.md` holds the lineage posture decision, both axes, with the operator's approval
- [ ] `rg -c '\.vibe/' .github/workflows/opencode-plugin-tests.yml` prints at least 3
- [ ] `rg -c 'SPECKIT_DIST_AUTO_REBUILD' .skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/cli-reference.md` prints at least 1
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
| Baseline | Done | Six Vibe hard rules, none for the render step; lineages pass `--auto-approve` at `fanout-run.cjs:3236`; the CI workflow names no `.vibe/` path (`spec.md` Measured Behavior) |
| Build | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| goal-vibe test already collected | `.skilled/hooks/goal/vibe/goal-vibe.test.mjs` sits under `.skilled/hooks`, which the CI node:test collection already walks; only the two repo-guards tests are outside it |

Open question: which lineage posture, keep `--auto-approve` behind the rendered strict guards or tighten with `--enabled-tools`, `--add-dir` or a narrower agent, and keep or lift `SYSTEM_SPEC_GATE_DISABLED=1`? The operator decides in T005.

Open question: does the repository's pre-commit hook run any hook node:test suite? T003 records it.
<!-- /ANCHOR:log -->
