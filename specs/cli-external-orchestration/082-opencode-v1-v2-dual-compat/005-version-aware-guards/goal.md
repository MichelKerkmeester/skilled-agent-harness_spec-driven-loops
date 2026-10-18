---
title: "Goal: Phase 5: version-aware-guards"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "version aware guards goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/005-version-aware-guards"
    last_updated_at: "2026-10-18T12:45:05Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-version-aware-guards"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: version-aware-guards

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the dispatch guards classify an `opencode2` run and evaluate only the rules that fit its version, so that no rule blocks a v2 run it cannot satisfy.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| L1 | An unknown version evaluates only the rules that apply to both versions. Rules that apply to v1 alone do not run. |
| L2 | The resolver cache key is the realpath, size and mtime of the binary. |
| L3 | The v2 slash-prompt rule warns and does not block, until a live probe shows that `run` expands a slash message. |
| L4 | A path-qualified binary resolves to `unknown` with no probe. |
| L5 | A rule without an `appliesTo` list reads as both versions. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test --test-reporter=tap .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` exits 0 with `# fail 0`.
- [ ] `cd .skilled && npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs` exits 0, and its `opencode2 run` cases pass.
- [ ] The `opencode2 run` cases failed on the pre-change code, as recorded in the log below.
- [ ] Every guard suite in CHK-002 reports zero failures and a pass count at or above the baseline recorded in the log below.
- [ ] A v2 slash-command fixture produces no violation with block severity.
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
| Planning documents filled | Done | `validate.sh --strict` output in the orchestrator report |
| Baseline counts recorded (T002) | Pending | Not yet run |
| Red run recorded (T005) | Pending | Not yet run |
| Green run recorded (T012 and T013) | Pending | Not yet run |
| Cross-family review (T014) | Pending | Not yet run |

### Deviations and findings

| Item | Note |
|------|------|
| Runner split | `dispatch-audit.test.mjs` is a Vitest file. Run it with `npx vitest run`, not `node --test`. Running it under `node --test` fails at load time with a `TypeError`, and that failure is not an assertion. |
| Planning-time counts | Read-only, not the T002 record: `dispatch-rule-checks.test.mjs` 20 pass and 0 fail under `node --test`, and `dispatch-audit.test.mjs` 86 pass and 0 fail under Vitest. |
| Cache key conflict | The 005 brief says realpath and mtime. Research section 6 and the 006 brief say realpath, size and mtime. Default in L2: all three. Open question Q2 in spec.md. |
| Coverage trade-off | On `unknown`, v1-only rules drop out, so a v1 slash-prompt violation can go unreported when a probe fails. Accepted per the brief. Open question Q5 in spec.md. |
<!-- /ANCHOR:log -->
