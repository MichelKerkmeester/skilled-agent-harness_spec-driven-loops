---
title: "Implementation Summary"
description: "cli-hermes is the eighth executor kind in the deep-loop runtime, with a fail-closed builder, a two-id roster, audit and dispatch-audit coverage and unit tests; one live lineage ran end to end and surfaced the pace finding: a Hermes research iteration needs 1500 seconds or more."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/003-deep-loop-executor-support"
    last_updated_at: "2026-09-14T20:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Executor kind, builder, roster, audit maps, dispatch-audit row and tests shipped"
    next_safe_action: "Raise the default cli-hermes timeoutSeconds guidance in the packet docs if a second lineage confirms the pace"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-003-deep-loop-executor-support"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Live cli-hermes lineage on a scratch folder (needs the provider)"
    answered_questions:
      - "The executor kinds minus native must equal the hub registry's workflow modes; a manifest-integrity test enforces it, so the kind and the registration landed together"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-deep-loop-executor-support |
| **Completed** | 2026-09-14 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/deep:research` and `/deep:review` can now be asked for `--executor=cli-hermes`. The runtime refuses the kind before any spawn when the `hermes` binary is missing or the model is off the two-id roster, and otherwise emits Hermes's quiet oneshot chat with the prompt on stdin.

### Phase 3: deep-loop executor support

You get a seventh CLI executor kind whose dispatch shape is the one the research settled: `chat -Q --oneshot --query-file -`, `--provider llmgateway`, the roster model, `--ignore-rules`, `--source tool`, a turn cap, a run budget one margin under the lineage timeout, an explicit toolset list without `delegation` and `memory`, `--yolo` for write leaves, and the `max` reasoning pin both roster models carry. The web-search policy maps to the `web` toolset. `--worktree` and `-z` never appear.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified | `cli-hermes` in `EXECUTOR_KINDS`; flag support `model`, `reasoningEffort`, `timeoutSeconds`, `liveTools`; preventive sandbox `false`; web-search matrix `inherit`, `disabled`, `live`; `HERMES_SUPPORTED_MODELS`, `HERMES_DEFAULT_MODEL`, `isHermesModelAllowed` |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | Binary `hermes`; session env `HERMES_SESSION_ID`; state env `SPECKIT_HERMES_STATE_DIR` and `HERMES_HOME`; default home `.hermes`; env prefixes `HERMES_` and `LLMGATEWAY_`; not self-presence exempt |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | State-env map entry; `HERMES_ALLOWED_MODELS` mirror and default; `buildHermesLineageCommand`; adapter map entry; `isHermesBinaryAvailable`; exports |
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | Modified | `hermes chat` with a query flag and the top-level `-z` recognized as a dispatch; bare management subcommands ignored |
| `.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modified | Hermes headless shapes in the stdin rule; seven Hermes checks so every hard rule the packet declares has an implementation |
| `runtime/tests/unit/executor-config.vitest.ts`, `fanout-run.vitest.ts`, `combo-matrix.vitest.ts`, `tests/stress/cli-adapter/matrix-manifest.ts`, `cli-codex.vitest.ts` | Modified | Eight kinds; Hermes field, matrix, roster, mirror-parity and adapter tests; a Hermes subject in the frozen stress matrix |
| `.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs`, `dispatch-rule-checks.test.mjs` | Modified | Hermes shape and rule cases |
| `.opencode/commands/deep/assets/deep-research-presentation.txt`, `deep-review-presentation.txt`, compiled contracts, `deep-review/SKILL.md` | Modified | Executor enumerations name `cli-hermes`; contracts recompiled, drift check clean |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baseline first (typecheck clean, 277 tests passing across the four affected unit files), then the change, then the whole gate again from the final state. The builder mirrors the Pi adapter's shape and the roster mirrors Pi's byte-parity contract between the TypeScript source and the runner. A manifest-integrity test couples the executor kinds to the hub's `mode-registry.json`, so the registration in phase 004 landed in the same change set.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Prompt on stdin through `--query-file -`, not argv | An iteration brief exceeds the argv limit; Hermes reads the file verbatim |
| No `configDir` support yet | `HERMES_HOME` relocates credentials too; a fresh home is logged out of every provider |
| `--in` omitted from the builder | The runner spawns in the repo root; the flag stays in the packet's manual shape |
| Run budget one margin under the timeout | Budget expiry has no distinct exit code; the in-agent wrap-up must win the race |
| Unknown effort on a roster model dispatches at `max` | Both roster ids are Flash-family models the runtime pins before the level check; the pin is the contract |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` (deep-loop runtime) | PASS, exit 0, after the change |
| `vitest run` on executor-config, fanout-run, combo-matrix, executor-audit, cli-codex manifest integrity | PASS: 318 passed, 1 skipped, exit 0 (baseline 277 across four files; the fifth adds the integrity test) |
| Toolset correction | `search` is web search only; leaf `terminal,file,skills,todo`, read-only `file,todo`, `web` per policy; `SPECKIT_HERMES_READ_ONLY` and `HERMES_SPEC_FOLDER` injected; suites green after the change |
| Hermes adapter tests | PASS: 8 of 8, including missing-binary refusal, off-roster and provider-prefixed rejection, budget margin, toolset policy, read-only shape |
| Hook vitest: `dispatch-audit.test.mjs`, `dispatch-preflight-lint.test.ts` | PASS: 108 of 108 |
| `node --test dispatch-rule-checks.test.mjs` | PASS: 11 of 11, including the CI guard that every declared check id has an implementation |
| Contract drift (`check-contract-drift.cjs`) | OK, 3 commands |
| Builder dry-run shape | The adapter test asserts the exact argv for both roster ids |
| Live one-iteration `cli-hermes` lineage | Live 2026-09-14: `fanout-run.cjs` lineage `hermes-proof` (`deepseek-v4.1-flash`, `--reasoning max`, 1 iteration) fulfilled, exit 0, 1042 s; `research.md` (91 lines, correct answer: eight ids, `stdin-redirect-required` exercised by construction), `deltas/iter-001.jsonl` (9 findings), `deep-research-state.jsonl` (`synthesis_complete`), `iterations/iteration-001.md`; containment clean; metadata refreshed by the runner |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One research iteration took 1042 seconds** with `deepseek-v4.1-flash` at `max`. The runner's lineage ceiling is twice `iterations × timeoutSeconds`, so a 600-second setting still allowed 1200 s and the leaf finished inside it; the `--run-budget` wrap-up notice at 537 s was advisory to the model. Give a Hermes research lineage 900 seconds or more; the builder's 60-second budget margin is unchanged.
2. **The stress adapter suite covers Hermes** through `cli-hermes.vitest.ts` and `hermes-shim.cjs`; the 14 hermetic cells are implemented in the phase-two matrix.
3. **The AI-council seat resolver and the model-benchmark dispatcher accept `cli-hermes`**; the council feeds the seat prompt on stdin because Hermes reads `--query-file -`.
<!-- /ANCHOR:limitations -->

---
