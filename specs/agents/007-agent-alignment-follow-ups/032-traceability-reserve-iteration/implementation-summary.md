---
title: "Implementation Summary"
description: "A deep review now names its unfinished core traceability protocols in the registry and the stop inputs, steers the last iteration under the cap to them, and raises a partial result to pass only with file:line evidence."
trigger_phrases:
  - "traceability reserve iteration implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/032-traceability-reserve-iteration"
    last_updated_at: "2026-11-15T21:03:55Z"
    last_updated_by: "generate-context"
    recent_action: "Built phase 032 last-iteration traceability steer"
    next_safe_action: "Commit phase 032, then build phase 033"
    packet_purpose: "Purpose: Spend the last iteration under the cap on the core protocols that are still unfinished, and accept a raised result only with evidence a reader can check."
    blockers: []
    key_files:
      - "specs/agents/007-agent-alignment-follow-ups/032-traceability-reserve-iteration/implementation-summary.md"
      - ".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs"
      - ".skilled/commands/deep/assets/deep-review.yaml"
      - ".skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl"
    session_dedup:
      fingerprint: "sha256:0031f0d9c4e1b4534f5ce04a84cecdc39c7d9515e61beb850ac69c77554712c7"
      session_id: "scaffold-032-traceability-reserve-iteration"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-15T21:03:55Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 032-traceability-reserve-iteration |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The last iteration a review gets before its cap now goes to the core traceability protocols it has not finished, instead of the next dimension in the queue. Of 60 recent registries, 9 stopped at the cap and 5 of those still held a core protocol unfinished as their reducer recorded it.

### Phase 32: traceability-reserve-iteration

`convergence.cjs` exports `reviewUnfinishedCoreProtocols(config, registry)`: each core protocol in `config.crossReference.core` whose latest result is missing or `pending`, `deferred`, `skipped`, `partial` or `blocked`. The review stop inputs carry it as `unfinishedCoreProtocols`, and the reducer writes it to `registry.traceability.unfinishedCoreProtocols`. In the rollup, a `pass` that follows a `partial` for the same protocol counts only when its `evidenceRefs` or `evidence` holds a file:line reference. The workflow's read step takes the list from the registry; when `max_iterations` is at least 2 and the next iteration is the last, `next_dimension` is `traceability` and the prompt names the protocols and the evidence rule. The recovery line names them too.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modified | Unfinished core protocol ids in the stop inputs |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modified | Registry field; evidence rule for partial to pass |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision.vitest.ts` | Modified | The function |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/traceability-rollup.vitest.ts` | Modified | Evidence rule |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/review-stop-path-replay.vitest.ts` | Modified | Stop decision names a partial core protocol |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modified | Focus, prompt variable, recovery line |
| `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` | Modified | Prompt slot |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts and .skilled/skills/system-deep-loop/runtime/tests/fanout-review-focus.vitest.ts` | Modified | Fixtures bind the new slot |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerated | Source digests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at `--thinking max` through cli-pi built each task in its own dispatch, and the conductor read every diff and reran the checks. One rollup test asserted the upgrade the new rule forbids, a partial then a bare pass, so it now carries a file:line reference and the bare case became its own test. Two prompt-pack fixtures render the real template with a fixed variable map, and the renderer refuses a missing variable, so they gained the new slot.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Store the list in the registry | The read step already reads the registry every iteration, so the steer needs no value carried across loop passes |
| A `fail` result is finished | It ran and found drift; another pass would not change it |
| Only from two iterations up | With a cap of 1 every protocol is unfinished at the start, and the one iteration would be spent on traceability alone |
| Keep the cap absolute | The cap still stops the loop before every veto; the change spends the iteration before it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Rollup, stop-decision and replay tests | PASS: 125 of 125 in five files |
| Prompt-pack tests | PASS: 21 of 21 |
| Runtime suite | PASS: 184 files, 3,092 passed, 9 skipped (baseline 184 files, 3,087 passed) |
| `npm run typecheck` | PASS: no errors |
| Contract drift | PASS: `OK commands=2` |
| spec-kit `deep-review-contract-parity.vitest.ts` | PASS: 12 of 12 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The steer is workflow guidance.** The loop agent reads the focus rule and the prompt; no script forces the dimension.
2. **A run that hits its duration budget is not steered.** The duration stop has no last-iteration notice.
<!-- /ANCHOR:limitations -->

---
