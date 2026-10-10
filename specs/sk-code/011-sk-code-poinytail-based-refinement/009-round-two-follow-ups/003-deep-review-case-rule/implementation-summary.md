---
title: "Implementation Summary"
description: "Every finding a deep-review iteration reports now carries a Case line, in the review mode's own words, and a reducer test proves the deep-loop readers count and rank findings exactly as before."
trigger_phrases:
  - "deep review case rule implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/003-deep-review-case-rule"
    last_updated_at: "2026-10-10T08:50:00Z"
    last_updated_by: "deep-review-case-rule-builder"
    recent_action: "Built the Case bullet, the reducer test and the Codex and Pi mirrors; recorded the results"
    next_safe_action: "Orchestrator runs the Hermes generator, reruns the mirror criterion, then updates spec.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-deep-review-case-rule"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-deep-review-case-rule |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deep-review iteration can no longer report a finding without the case that proves it. Step 7 of the deep-review agent now asks for a fourth line on every finding, `Case: ...`, and says in the review mode's own words that a finding with no case is not reported, at any severity. The deep-loop readers count and rank findings exactly as before, and a new reducer test proves it. The Hermes copy of the agent is the one piece still waiting, because the orchestrator runs that generator once after all five children are built.

### Phase 3: deep-review-case-rule

The review mode already refused a finding with no reproducing case, but the format every `/deep:review` iteration follows asked only for a title, a location, a description and three fix-completeness lines. One bullet in Step 7 closes that gap. It sits directly after the fix-completeness bullet, it is identical in the canonical agent and the hand-kept Claude fork, and the Codex and Pi mirrors carry it because their generators copied it.

The bullet tells the agent to write the case on one line that does not start with a number and a period. That clause matters because the iteration finding counter reads every numbered line under `## Findings` as another finding. The plan's probe gave 4 findings for 2 when a case carried two numbered steps, and this build's probe gave 2 for 2 with a plain `Case:` sub-line. The other readers (`reduce-state.cjs`, `verify-iteration.cjs`, `post-dispatch-validate.ts`, the reducer library) were traced and ignore a line that is not a finding, so none changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/agents/deep-review.md` | Modified | Step 7: one `Case:` bullet after the fix-completeness bullet (line 214) |
| `.claude/agents/deep-review.md` | Modified | The identical bullet in the hand-kept fork (line 201) |
| `.codex/agents/deep-review.toml` | Regenerated | Output of `sync-agents.cjs`, one line added, never hand-edited |
| `.pi/agents/deep-review.md` | Regenerated | Output of `sync-agents-pi.cjs`, one line added, never hand-edited |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Modified | One `describe` with one test: an iteration whose findings carry `Case:` lines reduces to the same ids, severities and titles as one without |
| `.hermes/skills/agent-deep-review/SKILL.md` | Not touched | Deferred: the orchestrator runs `sync-skills-hermes.cjs` once after every build |
| `scratch/` in this folder | Created | Baseline and after captures; the orchestrator removes them before the commit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines were captured before any edit: the five deep-review test files read 132 tests, every agent mirror check exited 0, the agent validators read `VALID` with one non-blocking numbering warning, and the compiled route guard read `system-deep-loop fresh`. The two bullets and the test were then added, and the Codex and Pi generators were run in write mode. Each wrote exactly one agent and one file changed under `.codex` and `.pi`.

The after-run matches the plan: 133 tests (132 plus the new one), both agent files still read `Total issues: 1`, Step 7 of the fork equals Step 7 of the canonical agent, and `git status` under the deep-loop skill shows only the one test file added to the baseline. A negative control confirmed the test can fail: giving the reducer a case line shaped as a `- **F009**:` bullet raised the finding count from 2 to 3. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The case rule applies at every severity, P2 included | The review mode's rule has no severity exception, and a P2 with no case is as unverifiable as a P0 with none. A one-line case is cheap. |
| The rule is one bullet in Step 7 only, with no ledger, `findingDetails` or registry field | The format owner is Step 7. Carrying the case into the registry touches the schema and every reader, so it stays a recorded follow-up. |
| The case is one line that does not start with a number and a period | `parseIterationMarkdownFindings` counts any such line as a finding, so a numbered case would inflate the count. |
| The Hermes copy is left to the orchestrator | The Hermes generator rewrites every copy, so running it here would write other builders' files. This build ran only its `--check` form. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Goal C1: `rg -n 'Case:'` on both agents, then `grep -c 'A finding with no case is not reported, at any severity'` | PASS. One `Case:` line per file (`.skilled/agents/deep-review.md:214`, `.claude/agents/deep-review.md:201`), then `.skilled/agents/deep-review.md:1` and `.claude/agents/deep-review.md:1`, `exit=0` |
| Goal C2: `diff` of the Step 7 ranges of the two agents | PASS. No output, `exit=0` |
| Goal C3: the five deep-review vitest files | PASS. `Test Files  5 passed (5)`, `Tests  133 passed (133)`, `exit=0`. The earlier unpiped run of the same command also exited 0 |
| Goal C4: agent mirror sync, Codex, Pi and Hermes checks | PASS after the orchestrator ran the Hermes generator once (`Wrote 2 of 70 Hermes skill copies`): `all mirrors in sync`, `PASS: 12 agents are in sync.` twice, `PASS: 70 Hermes skill copies in sync`, exit 0 |
| Goal C5: `validate_document.py --type agent` on both agents | PASS. `VALID:` and `Total issues: 1` for each file (the same `non_sequential_numbering` warning as the baseline), `exit=0` |
| Goal C6: `validate.sh --strict` on this folder | PASS. `Errors: 0  Warnings: 0`, `RESULT: PASSED`, `exit=0`, run after `repair-derived.cjs --apply` |
| Scope: no reader, schema or prompt pack changed | PASS. `git status --porcelain -- .skilled/skills/system-deep-loop` added only ` M .../deep-review-state-reducer.vitest.ts` to the baseline, and `grep -c 'Case' prompt-pack-iteration.md.tmpl` printed `0` |
| Regression: contract parity, route guard, leaf manifest | PASS. `Tests  12 passed (12)`, `system-deep-loop            fresh`, `leaf-manifest.json OK`, `exit=0` |
| Negative control: a case line shaped as a finding bullet | PASS. The reducer read 3 open findings against 2 for the `Case:` line, so the new test fails if a reader starts counting case lines |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Hermes copy is stale until the orchestrator runs the generator.** `.hermes/skills/agent-deep-review/SKILL.md` holds no `fourth required line` yet, and the Hermes `--check` exits 1 until `sync-skills-hermes.cjs` runs once. After that run the mirror criterion must be rerun.
2. **The rule is prose and nothing enforces it.** No checker reads a deep-review narrative for a `Case:` line. A narrative checker like the review mode's `check-review-findings.js` is a follow-up.
3. **The case does not reach the registry.** There is no `case` field on `findingDetails` or in the ledger schema, so a case lives only in the iteration narrative. Carrying it into the registry is a follow-up that touches the schema and the readers.
4. **A numbered case still inflates the count.** `parseIterationMarkdownFindings` counts any trimmed line starting with a number and a period, which is why the rule asks for a one-line case. Hardening the counter would let that clause go.
5. **Step 11, the Binary Quality Gates table and the Pre-Delivery Checklist do not check for a case.** A one-line check in each is a follow-up. A second follow-up is reconciling `reduce-state.cjs`, which reads `- **F###**:` bullets, with the `N. **Title** -- file:line` shape Step 7 asks for.
<!-- /ANCHOR:limitations -->

---
