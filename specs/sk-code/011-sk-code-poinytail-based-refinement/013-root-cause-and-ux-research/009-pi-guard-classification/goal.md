---
title: "Goal: Phase 9: pi-guard-classification"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/009-pi-guard-classification"
    last_updated_at: "2026-10-10T19:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-009-pi-guard-classification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 9: pi-guard-classification

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the shared dispatch inspector classify shell `-c` wrapped dispatches by their payload and stop reading a print flag beside a variable argument as a dispatch, fix the Pi denial wording, and make the catalog and playbook describe both.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `inspectDispatch` returns the payload's classification, ambiguous included, so a wrapped ambiguous dispatch is denied rather than allowed. |
| D2 | The catalog and playbook belong to another track; the operator directed this fix, so it is recorded here. |
| D3 | No hub version bump; the master bumps each hub once at merge. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/dispatch/lib/dispatch-audit.test.mjs .skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts 2>&1 | grep -c 'Tests  117 passed (117)'`, run from the repository root, prints 1.
- [x] `node --test --test-reporter=tap .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs 2>&1 | grep -E '^# (pass|fail)'`, run from the repository root, prints `# pass 20` and `# fail 0`.
- [x] `grep -c 'alias or path' .skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts`, run from the repository root, prints 0.
- [x] `grep -c 'shell `-c` wrapper' .skilled/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md`, run from the repository root, prints 1 for each file.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/009-pi-guard-classification --strict`, run from the repository root, prints RESULT: PASSED.
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
| Baseline | Done | Inspector plus Pi suites 111 passed |
| Negative rows | Done | 2 failed, then passed after the command-position rule (113) |
| Wrapper rows | Done | 4 failed, then passed after the inspector unwrap (117) |
| Resolver | Done | Rule-checks failed its `bash -c` jev case after the unwrap; passed 20 of 20 after the resolver fix |
| Deny text | Done | New assertion failed, then passed |
| Docs | Done | Both validate with 0 issues |

### Deviations and findings

| Item | Note |
|------|------|
| Resolver change | Not in the review's list. The inspector unwrap made `resolveSegment` blank quotes on the outer wrapper instead of the payload, so it now unwraps first; found by the existing rule-checks suite |
| Track boundary | The catalog and playbook belong to another track and were edited by operator direction |
<!-- /ANCHOR:log -->
