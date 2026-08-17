---
title: "Implementation Summary: Forward --stop-policy on the deep-research fan-out path"
description: "Closeout for wiring stop_policy end to end and generalizing the max-iterations completeness validator to research."
trigger_phrases:
  - "deep-research stop-policy forwarding summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-deep-loop/040-deep-research-stop-policy-forwarding"
    last_updated_at: "2026-08-17T19:30:00.000Z"
    last_updated_by: "claude"
    recent_action: "Wired stop_policy through both YAMLs; validator now covers research forced-depth."
    next_safe_action: "Validate the packet; then run Packet C deep-research."
    blockers: []
    key_files:
      - "specs/system-deep-loop/040-deep-research-stop-policy-forwarding/implementation-summary.md"
      - ".opencode/commands/deep/assets/deep-research-auto.yaml"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-040-stop-policy-forwarding"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 040-deep-research-stop-policy-forwarding |
| **Status** | In Progress |
| **Level** | 1 |

The wiring and the validator generalization are done and tested; the commit on v4 is the remaining step.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/deep:research --stop-policy=max-iterations` now reaches the fan-out runtime and produces a real forced-depth guarantee, validated for research loops.

### Fix evidence

| Edit | Artifact | Result |
|------|----------|--------|
| Resolve the flag | `deep-research-presentation.txt` | `stop_policy` row, default `convergence` |
| Bind + forward (auto) | `deep-research-auto.yaml` | `user_inputs` + `required_values_present` + `--stop-policy {stop_policy}` |
| Bind + forward (confirm) | `deep-research-confirm.yaml` | same three edits |
| Generalize validator | `fanout-run.cjs` `findMaxIterationsPolicyViolation` | gate covers research; loop-type-aware state-file names |
| Loop-type completion artifact | `fanout-run.cjs` `completionFromArtifacts` | checks `research.md` for research (was hardcoded to `review-report.md`) — surfaced by the live run |
| Tests | `fanout-run.vitest.ts` | research forced-depth cases incl. the real maxIterationsReached + research.md shape |
| Recompiled contract | `compiled/deep-research.contract.md` | regenerated via `compile-command-contracts.cjs --command deep/research --write` so the command renders with the new wiring |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The runtime already applied the forced-depth clause in the lineage prompt for any loop type, so the gap was purely that the flag never travelled: the presentation layer resolved no `stop_policy`, and neither YAML forwarded it. A `stop_policy` row was added to the presentation resolution table (default `convergence`), declared in each YAML's `user_inputs`, required in `required_values_present`, and forwarded on the `fanout-run.cjs` invocation. `--convergence-mode` was deliberately not forwarded — `fanout-run.cjs` does not parse it, so it would be a dead flag. Finally the completeness validator, previously gated to review, was generalized to research; the caller already loads the correct per-loop state file, so only the gate and its error strings changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bind `stop_policy` with a default and require it | Consistent with `convergence_mode`; the default keeps existing runs passing preflight |
| Drop `--convergence-mode` forwarding | The runtime does not consume it; a dead flag would imply behavior that does not exist |
| Generalize the validator rather than duplicate | The record shape and on-disk completeness check are identical across research and review |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `git show HEAD` fail-first | gate was `loopType !== 'review'`; auto YAML `stop-policy` count 0 |
| after fix | both YAMLs forward `--stop-policy {stop_policy}`; gate covers research |
| `node --check fanout-run.cjs` | exit 0 |
| `fanout-run.vitest.ts` max-iterations block | 9/9 pass (incl. real research shape) |
| `fanout-run.vitest.ts` full | 109 pass |
| Live-run repro | validator returns null on the actual 048 research artifacts (10 iterations + `research.md`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

- The forced-depth guarantee is proven at the wiring + validator layer; the end-to-end 10-iteration behavior is exercised by the follow-on deep-research run.
- Command-contract integration tests were slow to run in this session; the targeted `fanout-run.vitest.ts` suite is the primary evidence.
- The `render-command-contract.vitest.ts` compiled contracts for `deep/ai-council` and `deep/review` were already stale on `HEAD` (confirmed with this packet's edits stashed); they are a pre-existing maintenance gap left untouched, out of this packet's scope.
- `description.json` / `graph-metadata.json` are conductor-generated, not hand-authored.
- Changes are uncommitted pending an explicit commit instruction.
<!-- /ANCHOR:limitations -->
