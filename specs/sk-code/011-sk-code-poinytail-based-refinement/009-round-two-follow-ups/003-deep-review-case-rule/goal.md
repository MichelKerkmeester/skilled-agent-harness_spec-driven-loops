---
title: "Goal: Phase 3: deep-review-case-rule"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/003-deep-review-case-rule"
    last_updated_at: "2026-10-10T08:38:50Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-009-003-deep-review-case-rule"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: deep-review-case-rule

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every finding a deep-review iteration reports carry the case that proves it, in the same words the review mode uses, without changing how the deep-loop readers count or rank findings.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The case rule applies at every severity, P2 included, because the review mode's rule ("A finding with no case is not reported") has no severity exception and a one-line case is cheap. |
| D2 | The rule lives only as one bullet in Step 7 of the deep-review agent. No field is added to the JSONL ledger, `findingDetails` or the registry, and the prompt pack, the readers and the schema stay unchanged. Carrying the case into the registry is a recorded follow-up. |
| D3 | The case is written on one line that does not start with a number and a period, because `parseIterationMarkdownFindings` counts such a line as another finding. |
| D4 | The `.claude` fork receives the identical bullet by hand, the Codex and Pi mirrors come from their generators, and the Hermes copy comes from the orchestrator's single generator run. No generated mirror is hand-edited. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From the repository root, `rg -n 'Case:' .skilled/agents/deep-review.md .claude/agents/deep-review.md && grep -c 'A finding with no case is not reported, at any severity' .skilled/agents/deep-review.md .claude/agents/deep-review.md; echo "exit=$?"` prints one `Case:` line from each file (lines 214 and 201, both inside Step 7), then `.skilled/agents/deep-review.md:1` and `.claude/agents/deep-review.md:1`, then `exit=0`.
- [ ] From the repository root, `diff <(sed -n '/^#### Step 7: Write Findings/,/^#### Step 8/p' .skilled/agents/deep-review.md) <(sed -n '/^#### Step 7: Write Findings/,/^#### Step 8/p' .claude/agents/deep-review.md); echo "exit=$?"` prints only `exit=0`.
- [ ] From the repository root, `(cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/deep-review-reducers.vitest.ts tests/unit/deep-review-projections-contract.vitest.ts tests/unit/deep-review-deltas-contract.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts tests/unit/verify-iteration.vitest.ts); echo "exit=$?"` prints `Test Files  5 passed (5)`, `Tests  133 passed (133)` and `exit=0`. The 133 is the 132 passing before this phase plus the new test in `deep-review-state-reducer.vitest.ts`, which reduces an iteration with Case lines to the same findings as one without.
- [ ] From the repository root, `node .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all && node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check && node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check && node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check; echo "exit=$?"` prints `all mirrors in sync`, `PASS: 12 agents are in sync.` twice, `PASS: 70 Hermes skill copies in sync` and `exit=0`. The Hermes leg passes only after the orchestrator has run the Hermes generator.
- [ ] From the repository root, `for f in .skilled/agents/deep-review.md .claude/agents/deep-review.md; do python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py $f --type agent | grep -E 'VALID|Total issues'; done; echo "exit=$?"` prints a `VALID:` line and `Total issues: 1` for each file, the same single non-blocking numbering warning as before the edit, then `exit=0`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/003-deep-review-case-rule --strict` prints `RESULT: PASSED` and exits 0.
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
| C1 The canonical and fork agents each carry one Case line in Step 7 and the no-case-at-any-severity rule | Done | `Case:` at `.skilled/agents/deep-review.md:214` and `.claude/agents/deep-review.md:201`, `grep -c` 1 and 1, `exit=0` |
| C2 Step 7 of the fork equals Step 7 of the canonical agent | Done | Step 7 range `diff` printed nothing, `exit=0` |
| C3 The five deep-review test files pass at 133 tests including the new reducer test | Done | `Test Files  5 passed (5)`, `Tests  133 passed (133)`, `exit=0` |
| C4 Agent mirror sync, Codex, Pi and Hermes checks pass | Done | Orchestrator rerun after one Hermes generator run: `all mirrors in sync`, `PASS: 12 agents are in sync.` twice, `PASS: 70 Hermes skill copies in sync`, exit 0 |
| C5 Both agent files validate with the same single warning | Done | `VALID:` and `Total issues: 1` for each file, `exit=0` |
| C6 validate.sh --strict prints RESULT: PASSED | Done | `RESULT: PASSED`, `Errors: 0  Warnings: 0`, `exit=0` |
| Orchestrator rerun | Done | All six criteria rerun by the orchestrator on 2026-10-10 from the final tree, each passing |

### Deviations and findings

| Item | Note |
|------|------|
| Hermes leg | The Hermes generator was not run, by the orchestrator's parallel-build override. The Hermes `--check` also names `sk-code-quality`, which belongs to a sibling build and was not touched here |
<!-- /ANCHOR:log -->
