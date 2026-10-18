---
title: "Goal: Phase 3: drift-guard-warning-count"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "drift guard warning count goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/003-drift-guard-warning-count"
    last_updated_at: "2026-10-10T21:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reran every completion criterion from the final state"
    next_safe_action: "Commit the child"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-012-003-drift-guard-warning-count"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: drift-guard-warning-count

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the sk-code drift-guard umbrella show its non-blocking warning count on each PASS line and in its summary, without changing any pass or fail decision.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Warnings are counted and shown, never turned into failures, and a run with zero warnings prints its old lines unchanged. |
| D2 | Only stdout is counted, and each guard's stderr keeps going to stderr. |
| D3 | `sk-code-skilled` moves to 1.2.2.0 in `SKILL.md` with `changelog/v1.2.2.0.md`. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0, prints four lines starting `PASS: `, and its last line reads `run-all-drift-guards: all 4 guards PASSED, N non-blocking warning(s)` with N equal to the alignment-drift warning count.
- [ ] The same run prints a `PASS: alignment-drift  (verify_alignment_drift.py --check-router) (N warnings)` line.
- [ ] `rg -n 'non-blocking' .skilled/skills/sk-code/sk-code-skilled/scripts/README.md` prints at least one line.
- [ ] `rg -n '^version: 1\.2\.2\.0$' .skilled/skills/sk-code/sk-code-skilled/changelog/v1.2.2.0.md` prints one line, and `python3 -I .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/sk-code/sk-code-skilled --check --strict` prints `Result: PASS`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/003-drift-guard-warning-count --strict` prints `RESULT: PASSED`.
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
| Umbrella summary shows 272 | Passed | exit 0, four PASS lines, last line with `272 non-blocking warning(s)` |
| Alignment PASS line shows 272 | Passed | `(272 warnings)` |
| README names the suffix | Passed | `rg` printed line 34 |
| Version 1.2.2.0 in two files | Passed | `rg` printed two lines |
| Strict validation | Passed | `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Stderr merge removed | The builder piped `"$@" 2>&1` into `tee`. Every `[WARN]` line is on stdout, so the orchestrator dropped `2>&1` to keep stderr separate |
| Criterion 1 amended 2026-10-11 | Later phases added five alignment-drift warnings, so the fixed count of 272 went stale. The property the phase added, a summary that shows the warning count, is what the criterion now checks |
| Criterion 2 amended 2026-10-11 | Later phases added five alignment-drift warnings, so the fixed count of 272 went stale |
| Criterion 4 amended 2026-10-11 | sk-code-skilled moved to 1.2.3.0 in the kebab-case rename phase, so the SKILL.md half went stale. The release entry still exists, and the strict package check proves the SKILL.md version matches the newest entry |
<!-- /ANCHOR:log -->
