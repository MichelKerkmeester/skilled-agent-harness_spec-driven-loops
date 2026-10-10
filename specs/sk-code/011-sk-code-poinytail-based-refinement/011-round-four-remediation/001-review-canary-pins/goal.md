---
title: "Goal: Phase 1: review-canary-pins"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/001-review-canary-pins"
    last_updated_at: "2026-10-10T15:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-011-001-review-canary-pins"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: review-canary-pins

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the review rule canary fail when any of the four AGENTS.md evidence-floor labels the review mode applies is renamed or dropped, and make the PR-state dedup reference pass the sk-doc document validator.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The canary pins only the bold labels `**Confirmed vs inferred**`, `**Observed command evidence**`, `**Finding = hypothesis**` and `**Your own read is also one lens**`, as one `AGENTS.md` entry in `EXACT_INVARIANTS`, never the row sentences. `AGENTS.md` itself is not edited. |
| D2 | The harness gains exactly one tamper case, which renames `**Finding = hypothesis**`, and `scratch/tamper-all.sh` proves the other three labels. |
| D3 | `references/pr-state-dedup.md` gains `## 1. OVERVIEW` above its intro paragraph, and no other heading changes. |
| D4 | The packet moves to version 1.7.1.0 with `changelog/v1.7.1.0.md`, and the Hermes copy and any compiled re-mint are left to the orchestrator. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` exits 0 and its first line is `OK: all rule invariants present (7 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 2 example output(s)).`
- [ ] `bash specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/001-review-canary-pins/scratch/tamper-all.sh` exits 0 and its last line is `RESULT: 4 of 4 label renames caught`.
- [ ] `bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` exits 0, prints 70 lines starting `PASS` including `PASS review_floor_label_drift` and `PASS review_floor_label_drift_output`, and ends with `All rule-canary test cases passed`.
- [ ] `python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md` exits 0 and prints `VALID` and `Total issues: 0`.
- [ ] `rg -n '^version: 1\.7\.1\.0$' .skilled/skills/sk-code/sk-code-review/SKILL.md .skilled/skills/sk-code/sk-code-review/README.md .skilled/skills/sk-code/sk-code-review/changelog/v1.7.1.0.md` prints three lines.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/001-review-canary-pins --strict` prints `RESULT: PASSED`.
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
| Canary exits 0 with `7 exact-string file(s)` | Passed | exit 0, first line `OK: all rule invariants present (7 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 2 example output(s)).` |
| `tamper-all.sh` catches 4 of 4 label renames | Passed | exit 0, `RESULT: 4 of 4 label renames caught` |
| Harness exits 0 with 70 PASS lines and both `review_floor` cases | Passed | exit 0, 70 PASS, `PASS review_floor_label_drift`, `PASS review_floor_label_drift_output`, `All rule-canary test cases passed` |
| `pr-state-dedup.md` validates with 0 issues | Passed | exit 0, `VALID`, `Total issues: 0` |
| Version 1.7.1.0 in three files | Passed | `rg` printed SKILL.md:5, README.md:11, changelog:11 |
| `validate.sh --strict` prints `RESULT: PASSED` | Passed | `Errors: 0  Warnings: 0`, `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| PENDING-ORCHESTRATOR: Hermes regeneration | `sync-skills-hermes.cjs --check` exits 1 with `DRIFT sk-code` and `DRIFT sk-code-review`. The generator was not run |
| PENDING-ORCHESTRATOR: compiled sk-code re-mint | `compiled-route-guard.cjs` exits 1 with `sk-code  stale-manifest` and `Re-mint: sk-code`, caused by sibling edits as well as this child. The re-mint was not run |
| Review result | Full diff of the six owned files and the new changelog read. No defects, `scratch/fix-units.json` is `[]` |
| Task T009 | Unticked, no build report names the contracts read. Not a goal criterion |
| Orchestrator steps | Done on 2026-10-10. Hermes `--check` prints `PASS: 70 Hermes skill copies in sync`, `compiled-route-guard.cjs` prints `sk-code fresh` after the re-mint and archive copy, and the trigger index `--check` exits 0 |
<!-- /ANCHOR:log -->
