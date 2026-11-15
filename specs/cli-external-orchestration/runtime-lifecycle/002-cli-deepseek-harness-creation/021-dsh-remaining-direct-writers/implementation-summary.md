---
title: "Implementation Summary"
description: "A failed code verification and both write-containment findings now survive a ledger-backed state log's refresh in review and research, and the executor check finds the executor on the iteration's opening row."
trigger_phrases:
  - "dsh remaining direct writers implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/021-dsh-remaining-direct-writers"
    last_updated_at: "2026-11-15T05:44:33Z"
    last_updated_by: "template-author"
    recent_action: "Built and verified the phase"
    next_safe_action: "Release the phase with a changelog and a version bump"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-021-dsh-remaining-direct-writers"
      parent_session_id: null
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
| **Spec Folder** | 021-dsh-remaining-direct-writers |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A failed code verification and both write-containment findings now survive a state log refresh in review and research. The documented executor check accepts the executor where the audit puts it on a ledger-backed run, and the research prompt pack says so.

### Phase 21: dsh-remaining-direct-writers

Phase 020 left three writers that still appended straight into a ledger-backed state log, so the next append's refresh dropped their rows. They now go through the append gateway with the run's session id, the way phase 020 routed the dispatch failure rows, and a state log with no ledger beside it gets the same rows as before. The `executor_missing` check also reads the iteration's opening `iteration_start` row on such a log, so a run whose executor the audit recorded there no longer fails it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | Exports `ledgerModeFor` and `appendFailureRow` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts` | Modified | `sessionId` on the input, the degraded row through the gateway helper and the opening-row executor check |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modified | `sessionId` on the input and both containment rows through the gateway helper on a ledger-backed log. The helper loads through a guarded `import()` so plain Node can still load the guard |
| `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` | Modified | The review gateway takes the three rows |
| The five research schema, projection and reducer files named in `spec.md` section 3 | Modified | Three new research stems carried field for field |
| `.skilled/commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml`, `deep-research-auto.yaml`, `deep-research-confirm.yaml` | Modified | The session id on every containment call and every validate step |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modified | The executor sentence |
| `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | Modified | The same executor sentence in the review protocol |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts` | Modified | The harness branch test now looks for the harness refusal only. The Mistral Vibe runtime merged from origin/main added its own `cli-mistral-vibe runs only as a fan-out lineage` refusal, which failed the old phrase-wide assertion on origin/main |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`, `deep-research.contract.markdown` | Regenerated | They pin the workflow and prompt pack digests. The AI Council contract regenerated unchanged |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-ledger-projection.vitest.ts`, `deep-research-ledger-schema.vitest.ts`, `check-ledger-stem-producers.vitest.ts`, `write-containment-yaml-call-sites.vitest.ts` | Modified | Survival, fallback, executor, round-trip, census and call-site tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A scratch probe measured the loss at `73a8a2d9c1` before any edit. The source edits went in, then the tests. Each new test ran against the nine source files put back at `HEAD` and failed there before passing on the new code. The call-site guard ran the same way against the four workflows at `HEAD`. The typecheck, the four check scripts and the full suite ran last. Nothing was committed, and the changelog and version bump are left to the caller.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `appendFailureRow` | It already routes through the gateway, never throws and falls back to the same direct write the validator used |
| Review reuses `deep_review.iteration_recorded` | Its schema and projection already carry any record whole |
| Research gets three new stems | No existing research stem keeps the confidence, the paths or the note |
| The opening-row check applies only on a ledger-backed log | A log with no ledger still gets the post-dispatch patch, so its check stays as strict as before |
| The containment guard loads the helper through a guarded top-level `import()` | The fan-out runner loads the guard under plain Node, where `executor-audit.ts` does not load. A static import failed eight tests there |
| The containment guard keeps `appendFileSync` with no ledger | It is today's write, and a log write must never block a containment decision |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Survival file | PASS. `Tests  18 passed (18)`, up from 10 |
| Fail first, survival file | PASS. With the nine source files at `HEAD` it printed `7 failed \| 11 passed (18)`. The one new case that passes there is the `executor_missing` edge case, which holds on both |
| Research schema and census | PASS. `Tests  65 passed (65)`, and `4 failed \| 61 passed (65)` on the old sources |
| Call-site guard | PASS. `Tests  3 passed (3)`, and `1 failed \| 2 passed (3)` with the workflows at `HEAD` |
| Typecheck | PASS. `npm run typecheck` exit 0 |
| Stem census and append checks | PASS. `"ok":true` with `"registered":91` and `"reserved":68`. `check-projection-coverage.cjs` and `check-protocol-append-sites.cjs` each `"ok":true` |
| Contract drift | PASS. `[CONTRACT DRIFT] OK commands=3` |
| Full deep-loop suite | PASS. The final run after the release edits printed `Test Files  176 passed (176)` and `Tests  2941 passed \| 8 skipped (2949)` with no failure. An earlier run showed one `fanout-pool.vitest.ts` timing failure that passes alone `42 passed (42)` |
| First full run | FAIL, then fixed. A static import of `executor-audit.js` failed eight tests in `write-containment.vitest.ts` and `fanout-run.vitest.ts` under plain Node. After the guarded `import()` those two files and the survival files printed `295 passed (295)` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The executed gate does not read the executor.** `post_dispatch_validate` runs `verify-iteration.cjs`, which never checks `executor_missing`. The opening-row check lives in the documented `validateIterationOutputs` only, and so does the session id its step now names.
2. **Each diagnostic row costs a gateway spawn on a ledger-backed log.** That is about one second per row, paid only when verification fails or containment finds a path.
<!-- /ANCHOR:limitations -->

---
