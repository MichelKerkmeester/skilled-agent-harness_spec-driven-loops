---
title: "Implementation Summary: Restore the research leaf fields the state-log projection drops (D7, D9)"
description: "The research gateway now carries ten leaf fields from the leaf record to the projected state row, so the findings gate, route proof and focusAlignment run on real data; focusAlignment judges only the latest record and ignores a question-id prefix."
trigger_phrases:
  - "state log leaf fields implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields"
    last_updated_at: "2026-11-17T21:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Upcast, schema, type and projection widened; focusAlignment scoped; ten suites pass 252"
    next_safe_action: "Merge into integration, then write the changelog entry and playbook scenario as @markdown"
    blockers:
      - "Changelog entry and playbook scenario are written by @markdown in integration after merge"
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts"
      - ".skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts"
      - ".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs"
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Restore the research leaf fields the state-log projection drops (D7, D9)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-state-log-leaf-fields |
| **Completed** | 2026-11-17, code and tests; the changelog entry and playbook scenario follow at merge (see Known Limitations) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The research append gateway now keeps ten leaf fields all the way to the state log: `target_agent`, `agent_definition_loaded`, `resolved_route`, `findingsCount`, `keyQuestions`, `noveltyJustification`, `focusTrack`, `edgeCase`, `toolsUsed` and `sourcesQueried`. The upcast copies each field only when it has the right shape and leaves it out otherwise. The `deep_research.iteration_completed` stem rule lists the ten as optional and still rejects any unlisted field. The data type intersects the four persisted shapes with one optional-field interface. The projection spreads each key only when the event carries it, so a ledger written before this change projects the same rows as before.

With the fields in place, two checks start running on every research run. The `findings_not_enumerated` gate now reads a real `findingsCount`, and route proof comes from the projected row, with the delta kept as a fallback. `focusAlignment` now judges only the latest record that carries both question lists, so a run recovers after one off-focus iteration. It also compares the questions with one leading id prefix such as `Q1: ` removed. The prompt pack asks the leaf for `findingsCount` and `keyQuestions`, which matches the agent definition, and the research compiled contract was regenerated.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | Modified | `optionalLeafFields` copies the ten fields into `iteration_completed` data |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts` | Modified | Ten optional field rules on the stem |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Modified | `IterationCompletedLeafFields` intersected with the persisted shapes |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` | Modified | Conditional spreads write the keys into the projected `iteration` row |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modified | `focusAlignment` judges the latest record; `normalizeQuestionForAlignment` strips one id prefix |
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Modified | Comment and warning text no longer say the projection carries no leaf dispatch fields |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modified | Record shape gains `findingsCount` and `keyQuestions`, with the no-prefix rule |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Regenerated | Template digest refreshed |
| Seven test files under `runtime/tests/` | Modified | Gateway-driven cases for the gate, route proof, `focusAlignment`, upcast, stem rule, projected row and prompt pack; three reducer consumer cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Thirteen one-change DeepSeek V4.1 Flash dispatches on the Pi lane. Six test briefs came first and drive the real append gateway. Then came the schema rule, type, template, upcast, projection, convergence guard and verify text. The orchestrator read each diff, reran each check and regenerated the contract natively. Briefs and results are in `scratch/dispatch/`, and the baseline and fail-before output are in `scratch/baseline.txt`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Widen the upcast, schema, type and projection | Operator decision, ADR-001 option 1 |
| `focusAlignment` judges the latest record that carries both lists | Accepted planning call; REQ-009 recovery |
| Keys are spread only when present | A legacy ledger keeps projecting byte-identical rows |
| The type is an intersection with one optional-field interface | Avoids a 2^10 permutation union and keeps `JsonObject` unchanged; `npm run typecheck` exits 0 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Baseline | Recorded | Ten REQ-006 suites: 237 passed, exit 0 (`scratch/baseline.txt`) |
| Fail before | Pass | After the test briefs and before any source edit: 9 failed, 242 passed. The nine failures are the findings gate, route proof, four `focusAlignment` cases, the projected row, the upcast and the stem rule. The prompt-pack case failed before the template edit |
| REQ-006 suites | Pass | Ten suites: 252 passed, exit 0 |
| Typecheck and guards | Pass | `npm run typecheck` exit 0; `check-ledger-stem-producers.cjs` and `check-projection-coverage.cjs` exit 0; `check-contract-drift.cjs` printed `OK commands=2` after regeneration |
| Related suites | Pass | 17 other suites that load a changed file: 369 passed, no failure |
| Generation-2 replay (T018) | Recorded | See Known Limitations item 2 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Changelog entry (T019) and playbook scenario (T020)** need the `@markdown` agent, so they are written in the integration worktree after this phase merges.
2. **The generation-2 replay fails `focusAlignment` on 4 of 5 iterations.** This packet's own five research deltas were replayed as projected state rows through `verify` and `evaluateResearchQualityGuards`. `verify` passes all five, so the findings gate and route proof hold. `focusAlignment` fails iterations 2 to 5:
   - Iterations 2, 3 and 5 answered a question their own `keyQuestions` did not list. Iteration 2 listed the questions still open and answered Q3.
   - Iteration 4 wrote its key question as the bare id `Q6`, which cannot match the answered text even with the prefix removed.

   A failed guard holds a run at CONTINUE. So a leaf that writes `keyQuestions` this way keeps the run going until another stop applies. The prompt pack now defines `keyQuestions` as the exact question text the iteration worked on, which addresses this going forward. Matching a bare id was not added, because the spec compares text.
3. **Full runtime suite** runs once at merge in the integration worktree, not here.
<!-- /ANCHOR:limitations -->
