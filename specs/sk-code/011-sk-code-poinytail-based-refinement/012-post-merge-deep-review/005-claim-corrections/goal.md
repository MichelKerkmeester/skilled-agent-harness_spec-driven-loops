---
title: "Goal: Phase 5: claim-corrections"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "claim corrections goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/005-claim-corrections"
    last_updated_at: "2026-10-10T21:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reran every completion criterion from the final state"
    next_safe_action: "Commit the child"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-012-005-claim-corrections"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 5: claim-corrections

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the two child summaries and the mirror checker header the review flagged state what a rerun or a read shows today.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The ceiling row keeps its original reading with its timing and adds the current reading and its cause, and the debt-report goal log stays as recorded. |
| D2 | The test count row reads "Six new test cases, 12 in total". |
| D3 | The checker gets a comment-only change, and deep-improvement moves to 1.19.2.0 in `SKILL.md` with `changelog/v1.19.2.0.md`. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` ends with `markers=3 no-trigger=1 no-signal=1`, and line 115 of `specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate/implementation-summary.md` contains that same text.
- [ ] `grep -c '^test(' .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-doc-claims.test.cjs` prints 12, and line 61 of `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/implementation-summary.md` contains `12 in total`.
- [ ] `rg -c 'codex/agents/<name>.toml' .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs` prints 1, and `node .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all` exits 0.
- [ ] `rg -n '^version: 1\.19\.2\.0$' .skilled/skills/system-deep-loop/deep-improvement/changelog/v1.19.2.0.md` prints one line, and `python3 -I .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/system-deep-loop/deep-improvement --check --strict` prints `Result: PASS`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/005-claim-corrections --strict` prints `RESULT: PASSED`.
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
| Ceiling row matches rerun | Passed | report ends `markers=3 no-trigger=1 no-signal=1`, line 115 matches |
| Test count matches file | Passed | 12 cases, line 61 matches |
| Checker header and output | Passed | header names the Codex mirror, `--all` exit 0 |
| Version 1.19.2.0 in two files | Passed | `rg` printed two lines |
| Strict validation | Passed | `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Header wording | With three copies, the builder's "without the other" became "without the others" |
| Criterion 2 amended 2026-10-11 | The sk-code-opencode scripts were renamed to kebab-case by `sk-doc/066-feature-catalog-template-anchor-deprecation/007-sk-code-script-kebab-names`, so the criterion names the current file |
| Criterion 4 amended 2026-10-11 | deep-improvement moved to 1.19.5.0 in later phases, so the SKILL.md half went stale. The release entry still exists, and the strict package check proves the SKILL.md version matches the newest entry |
<!-- /ANCHOR:log -->
