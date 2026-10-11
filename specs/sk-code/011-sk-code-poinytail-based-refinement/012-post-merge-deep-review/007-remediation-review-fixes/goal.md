---
title: "Goal: Phase 7: remediation-review-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "remediation review fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/007-remediation-review-fixes"
    last_updated_at: "2026-10-10T21:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reran every completion criterion from the final state"
    next_safe_action: "Commit the child"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-012-007-remediation-review-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: remediation-review-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix the four P2s the remediation review confirmed with the smallest change each, without a new version bump.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The three hooks join `.skilled/hooks/shared/hook-stdin-deadline.test.mjs`, and `stdin-deadline.test.mjs` is deleted. |
| D2 | The dead Webflow link becomes plain text, child 005 names each commit's own packet, and the sk-git hooks README names the shared reader and suite. |
| D3 | The unreleased sk-git 1.8.1.0 and sk-code-webflow 1.1.3.0 changelogs are corrected in place, with no new bump. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/hooks/shared/hook-stdin-deadline.test.mjs` prints `pass 21` and `fail 0`.
- [ ] `test -e .skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs` exits 1.
- [ ] `rg -n 'specs/0[0-9][0-9]-' .skilled/skills/sk-code/sk-code-webflow -g '!**/changelog/**'` prints nothing.
- [ ] `rg -c '010-round-three-remediation/005-opencode-and-guards' specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/005-claim-corrections/implementation-summary.md specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/005-claim-corrections/spec.md` prints two lines, and `rg -c 'hook-adapter-shared|hook-stdin-deadline' .skilled/skills/sk-git/scripts/hooks/README.md` prints 2.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/007-remediation-review-fixes --strict` prints `RESULT: PASSED`.
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
| Shared suite | Passed | `pass 21`, `fail 0`; pre-fix archive fails the three new rows |
| Old test deleted | Passed | `test -e` exit 1 |
| Webflow sweep | Passed | no match |
| Provenance and README | Passed | two provenance lines, README count 2 |
| Strict validation | Passed | `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Phase 001 criterion 1 | It names the deleted test. A log row in the phase 001 goal records that the shared suite now carries that check |
<!-- /ANCHOR:log -->
