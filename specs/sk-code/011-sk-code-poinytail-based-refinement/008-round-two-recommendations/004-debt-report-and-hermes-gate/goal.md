---
title: "Goal: Phase 4: debt-report-and-hermes-gate"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate"
    last_updated_at: "2026-10-10T07:15:00Z"
    last_updated_by: "planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-008-004-debt-report-and-hermes-gate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: debt-report-and-hermes-gate

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the sk-code quality gate list every shortcut comment whose trigger can never fire, and make the pre-commit mirror gate block a stale Hermes skill or prompt copy before CI does.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The report reads each comment with the quote-aware detection of the comment-hygiene checker and matches a marker only at the start of that comment. A bare occurrence of the marker word, in an identifier or in prose, is not a marker. |
| D2 | A marker's trigger is the text after its first `;`, or after its first `,` when it has no `;`. An empty trigger is tagged `no-trigger`. A trigger with no number and no measurable term is tagged `no-signal`. Only the trigger is checked for a measurable term. |
| D3 | The two Hermes `--check` commands join the existing mirror check list, and their two output trees join the output list, so all eight checks run on every commit. No other gate changes, and this fix regenerates no `.hermes/` tree. |
| D4 | The doctor's runtime-mirrors doc is corrected to the mirrors its workflow checks. The workflow is not extended to Hermes. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh; echo "exit=$?"` prints `All ceiling report test cases passed`, then `exit=0`. Covers REQ-001, REQ-002 and REQ-003.
- [ ] `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh; echo "exit=$?"` ends with a line `markers=N no-trigger=N no-signal=N`, then `exit=0`. Covers REQ-001.
- [ ] `bash -n .skilled/scripts/git-hooks/pre-commit && node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check && node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check; echo "exit=$?"` prints a PASS line from each Hermes check, then `exit=0`. Covers REQ-005.
- [ ] `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh; echo "exit=$?"` prints `pre-commit gates: 71 passed, 0 failed`, then `exit=0`. Covers REQ-004 and REQ-006.
- [ ] `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs && node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js; echo "exit=$?"` prints `failed=0` from the freshness gate, then `exit=0`. Covers REQ-007 and REQ-008.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate --strict` prints `RESULT: PASSED`.
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
| Criterion 1, report test passes (REQ-001, REQ-002, REQ-003) | Done | `ceiling-report.test.sh; echo "exit=$?"` -> `All ceiling report test cases passed`, exit=0 |
| Criterion 2, report runs on the repo and prints the summary (REQ-001) | Done | `ceiling-report.sh; echo "exit=$?"` -> `markers=0 no-trigger=0 no-signal=0`, exit=0 |
| Criterion 3, both Hermes checks and pre-commit parse (REQ-005) | Done | `bash -n` and both Hermes `--check` -> `PASS: 70 Hermes skill copies in sync` and `[hermes-prompt-sync] PASS: 37 prompts are in sync.`, exit=0 |
| Criterion 4, pre-commit harness passes with 71 checks (REQ-004, REQ-006) | Done | `pre-commit.test.sh; echo "exit=$?"` -> `pre-commit gates: 71 passed, 0 failed`, exit=0 |
| Criterion 5, leaf freshness and rule copies pass (REQ-007, REQ-008) | Done | freshness -> `checked=14 fresh=14 failed=0`; `check-rule-copies.js` exit=0 |
| Criterion 6, validate.sh --strict prints RESULT: PASSED | Done | `validate.sh <folder> --strict` -> `RESULT: PASSED`, `Errors: 0  Warnings: 0`, exit=0 |

### Deviations and findings

| Item | Note |
|------|------|
| The report matches the marker only at the start of a quote-aware comment | The brief says "comment lines containing" the marker. A bare match counts identifiers and prose, in twelve code files today. Decision D1 anchors the match. The operator is asked to accept this. |
| The live hook is the main checkout's copy | `core.hooksPath` runs the main checkout's `pre-commit`, which has no Hermes entries until the change lands there. The harness proves the worktree copy only. |
| The gate's timing sentence goes false | Measured at planning: six existing checks 0.21 s, the Hermes pair 0.27 s, all eight 0.48 s. The comment's "under a quarter of a second" is rewritten with the measured figure. Outcome: the six checks measured 0.53 s on the first run in this worktree, so the planning figure did not hold. Five warm passes of all eight checks had a median of 0.46 s, and the comment now says about half a second on a warm checkout. |
| The leaf manifest should not change | The new script sits outside the leaf roots the sk-code-quality mode declares, so no byte change is expected. A diff is a finding to report, not a hand edit. Outcome: the regeneration wrote the same bytes, so the diff is empty. |
| No version bump and no changelog entry | The packet version lives in SKILL.md, which this fix may not edit. The operator decides the release. |
| Orchestrator verification, 2026-10-10 | All six criteria rerun from the final state: test harness exit 0, report exit 0 with `markers=0 no-trigger=0 no-signal=0`, both Hermes checks PASS, pre-commit harness 71 passed 0 failed, freshness 14/14, strict validation 0 errors |
| Gate header corrected by the orchestrator | The header still said the gate runs exactly what CI's mirror job runs; it now names the mirror and hermes-mirror jobs, and "a seventh mirror" became "a new mirror". Harness rerun: 71 passed, 0 failed |
| Builder removed its own `__pycache__` with `rm -rf` | Its `py_compile` check created the directory; nothing tracked was removed. Later checks used `ast.parse` |
<!-- /ANCHOR:log -->
