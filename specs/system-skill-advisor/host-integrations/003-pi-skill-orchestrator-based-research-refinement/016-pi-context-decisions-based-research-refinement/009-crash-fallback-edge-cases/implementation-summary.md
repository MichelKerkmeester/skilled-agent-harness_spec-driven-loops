---
title: "Implementation Summary"
description: "Built 2026-11-18: a crash in the shared advisor hook now delivers the turn's own fallback with its setup hint and skip classification, deduplicated and policy-recorded like a timeout, and survives a throwing clock or working directory. Two doc sentences corrected."
trigger_phrases:
  - "crash fallback edge cases implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/009-crash-fallback-edge-cases"
    last_updated_at: "2026-11-18T20:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built and verified the crash fallback edges"
    next_safe_action: "Run phase 010 Q0, the follow-up bench rerun"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20078428-5166-43d7-85ac-a68d9210f82f"
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
| **Spec Folder** | 009-crash-fallback-edge-cases |
| **Completed** | 2026-11-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When the shared advisor hook throws, the model now gets what a timeout would have given that turn. A setup prompt keeps its `/doctor:setup` hint, a skipped prompt keeps `Advisor: prompt skipped.`, a known session drops the repeated directive block, the deferred receipt is attached and the policy is recorded once under the runtime. A throwing clock or a removed working directory no longer makes the handler reject.

### Phase 9: crash-fallback-edge-cases

The dedup block moved into `applyDirectiveLifecycle` and the output, receipt and policy record into `finishAdvisorDelivery`, and both paths call them. The turn's prompt, workspace root, skip result and delivery state are hoisted above the try, the clock is read inside it and `elapsed` returns 0 when the clock throws. This amends phase 004's decision to render the crash fallback with default options and no dedup (`../004-crash-path-fallback/implementation-summary.md:80`); 004's files were not edited.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `hooks/claude/user-prompt-submit.ts` | Modified | The two helpers, the hoisted state, the guarded clock and the rewritten catch, with its diagnostic in its own try |
| `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modified | `runHookWithStore` takes a `renderBrief`; nine tests, eight planned and one for the working directory |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | Line 382: `confidenceOnly` mode skips only the uncertainty check |
| `hooks/skill-advisor-hook.md` | Modified | Line 57 says what a crash returns now |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna `xhigh` `fast` leaves through cli-codex, one file each. The eight planned tests went in through one leaf from one literal block, not four, and the red set was checked as a whole. The hook changes were prepared as three staged copies, dry-run against the typecheck and the test file, then placed by three leaves in order with the conductor running the tests between them. A fourth staged copy added the diagnostic guard after the catch-rewrite leaf reported the unguarded `process.cwd()`. The T002 baseline was taken after the test leaf ran, on the HEAD copy of the test file, which was then restored.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two module-local helpers both paths call | A crash then gets the same dedup and delivery as a normal turn with no copied code |
| Read the clock inside the try | A throwing clock reaches the catch and its fallback; the disabled and invalid-payload paths run before it and stay `{}` |
| Guard the catch's diagnostic call | Its `process.cwd()` argument is evaluated before `emitDiagnostic`'s own try and throws when the working directory was removed. Losing a diagnostic must not cost the fallback |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baselines | `FILE` 41/41; `HOOKS` 19 files, 235/235 |
| Red run | 7 failed, 42 passed: tests 1 to 4 and 6 to 8, each for its planned reason; the throwing-store guard passed |
| Staged builds | Refactor alone: the same 7 red. Hoist and clock: 5 red, tests 7 and 8 green. Catch: 49/49. Typecheck exit 0 at each step |
| Working-directory guard | Red with `Error: cwd`, then 50/50 |
| After the build | Typecheck and build exit 0; `HOOKS` 19 files, 244/244; `tests/hooks tests/parity tests/handlers` 33 files, 360 passed and 1 skipped |
| Planning probe on the new build | `(a)` keeps the setup hint, `(b)` `Advisor: prompt skipped.`, `(c) turn 2 directives=false`, `(d)` 2 crash records against 2 on the timeout path, `(e) resolved` with the outage head |
| Doc and code checks | `renderAdvisorTimeoutFallback()` gone from the hook; the `unless \`confidenceOnly\`` clause and `exception escapes` gone; `daemon starts` still on line 382; hygiene printed nothing |
| Refutation | The catch-rewrite leaf reported the unguarded `process.cwd()`. Confirmed with a deleted directory (`process.cwd()` throws `ENOENT`) and fixed under T020 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A disabled hook in a removed working directory shows the outage fallback.** The disabled path calls `process.cwd()` for its diagnostic inside the try, so a removed directory sends it to the catch, which renders a fallback instead of `{}`. Before this phase the handler rejected there. Both conditions together are needed to reach it. Phase 012 narrowed the case: a null payload or one with no prompt string now returns `{}` from the catch, so only a disabled hook with a valid prompt still reaches the fallback.
<!-- /ANCHOR:limitations -->

---
