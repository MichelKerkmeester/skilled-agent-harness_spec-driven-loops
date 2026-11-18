---
title: "Implementation Plan: Crash-Fallback Edge Cases"
description: "Make the shared hook's crash fallback match the timeout fallback for the same turn. The turn's state moves above the try and the clock read moves inside it. Two local helpers share the dedup and delivery steps between both paths. Two doc sentences are corrected."
trigger_phrases:
  - "crash fallback edge cases plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Crash-Fallback Edge Cases

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node for the hook, Markdown for the two doc lines |
| **Framework** | The shared Claude `UserPromptSubmit` handler, reused by Codex, Pi, DSH and Vibe |
| **Storage** | The directive-lifecycle store the handler already reads, and the in-process policy observation sink |
| **Testing** | Vitest hook suite in the advisor runtime |

### Overview
`handleClaudeUserPromptSubmit` keeps the turn's prompt, workspace root, skipped result and delivery state in variables declared above the try. It reads the clock inside the try. Two module-local helpers take over the dedup step and the delivery step, and both the normal path and the catch call them. The catch then renders the fallback with the turn's options and the skipped classification. Eight tests land first, and two doc sentences are corrected.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 008 strict validation printed `RESULT: PASSED`
- [ ] `sed -n 469,492p hooks/claude/user-prompt-submit.ts` still shows the 004 catch, with `renderAdvisorTimeoutFallback()` on `:486`
- [ ] `npx vitest run tests/hooks` from `runtime/` exits 0 before any edit

### Definition of Done
- [ ] The seven red-first tests failed before the hook edit and pass after it, and the guard test passes throughout
- [ ] `npx vitest run tests/hooks tests/parity` from `runtime/` exits 0
- [ ] `npm run typecheck` and `npm run build` exit 0 in `runtime/`
- [ ] The three `rg` checks on `ENV-REFERENCE.md` and the two on `skill-advisor-hook.md` print what REQ-009 and REQ-010 say
- [ ] `git diff --stat` for this phase lists only the four planned files
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One delivery path.

### Key Components
- **Hoisted turn state** in `hooks/claude/user-prompt-submit.ts`, replacing `:313-314`:

  ```ts
  let startedAt: number | null = null;
  const elapsed = (): number => {
    try {
      const now = dependencies.now?.() ?? performance.now();
      return startedAt === null ? 0 : Number((now - startedAt).toFixed(3));
    } catch {
      return 0;
    }
  };
  let prompt: string | null = null;
  let workspaceRoot: string | undefined;
  let skippedResult: AdvisorHookResult | null = null;
  let deliveryState: ShadowDeliveryRenderOptions = {};
  ```

  Inside the try, `startedAt = dependencies.now?.() ?? performance.now();` sits right after the invalid-payload return (`:341`). `const prompt` and `const workspaceRoot` at `:344-345` become assignments. `skippedResult = injectedBrief ? null : skippedAdvisorResultFor(prompt);` comes before the producer call, and the producer call at `:366-378` reads `skippedResult ?? await buildCliBrief(...)` in place of `skippedAdvisorResultFor(prompt) ?? await buildCliBrief(...)`. `const deliveryState` at `:387` becomes an assignment. The disabled and invalid-payload paths run before the clock is read, so they stay `{}` under a throwing clock and record `durationMs` 0.
- **`applyDirectiveLifecycle(emitted, input, dependencies)`**, module-local. It returns `{ effectiveEmitted: string; commitFullReceipt?: () => boolean }`. Its body is the dedup block at `:396-432`, unchanged, including the inner catch that keeps the full text. The comment at `:390-395` moves with it. Its last clause changes from "thrown errors still get the full text" to say that a fault inside dedup keeps the full text, and that a crash elsewhere in the hook dedups its fallback like any headed fallback.
- **`finishAdvisorDelivery(additionalContext, commitFullReceipt, deliveryState, runtime)`**, module-local. It returns the `ClaudeUserPromptSubmitOutput`. Its body is `:448-467` unchanged. It builds the output and attaches `DIRECTIVE_RECEIPT_COMMIT` when a receipt exists. Then it calls `observeEmittedAdvisorPolicy` once with the runtime label `runtime === 'claude' ? 'Claude Code' : runtime`. The normal path calls it in place of `:448-468`, after its diagnostic.
- **The catch**:

  ```ts
  } catch {
    emitDiagnostic({
      runtime,
      workspaceRoot: workspaceRoot ?? process.cwd(),
      status: 'fail_open',
      freshness: 'unavailable',
      durationMs: elapsed(),
      cacheHit: false,
      errorCode: 'UNKNOWN',
      errorDetails: 'Unhandled UserPromptSubmit hook exception',
    }, writeDiagnostic);
    // A crash shows the model what a timeout would show for this turn, deduplicated the
    // same way. If any of that throws as well, there is nothing safe left to show.
    try {
      const renderOptions = { deliveryState, setupWording: prompt !== null && SETUP_WORDING.test(prompt) };
      const emitted = skippedResult
        ? renderAdvisorFallbackDirective(renderOptions, skippedResult)
        : renderAdvisorTimeoutFallback(renderOptions);
      const delivery = input
        ? applyDirectiveLifecycle(emitted, input, dependencies)
        : { effectiveEmitted: emitted };
      return finishAdvisorDelivery(delivery.effectiveEmitted, delivery.commitFullReceipt, deliveryState, runtime);
    } catch {
      return {};
    }
  }
  ```

  `emitDiagnostic` has its own try (`:261-273`), and its arguments now read only hoisted values and the guarded `elapsed`, so nothing in the catch runs outside a guard.
- **The tests** in `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`. `runHookWithStore` (`:72-95`) gains a fifth parameter `renderBrief = renderAdvisorBrief`, passed through to the handler. A throwing renderer is `() => { throw new Error('render failed'); }`. The eight tests:
  1. (a) `keeps the setup hint when the hook throws on a setup prompt`: the crash output for `set up the hooks and install the toolchain` equals the timeout-path output for the same prompt, built with `fixture('failOpenTimeout.json')`. Each run gets its own `InMemoryDirectiveLifecycleStore` and its own session id, so neither run is deduplicated against the other.
  2. (b) `keeps the skipped fallback when the hook throws on a skipped prompt`: `/help` with a throwing renderer gives `EXPECTED_SKIPPED_CONTEXT`.
  3. (c) `drops the repeated directive block on a second crashing turn`: two `runHookWithStore` turns on one store with session `crash-dl`, the full `expectedOutageContext('fail_open')` and then its first line alone.
  4. (c) `commits the crash fallback receipt only after the output handoff`: the same with `deferDirectiveReceipt` true, mirroring the existing receipt test at `:661-694`.
  5. (c) guard, `keeps the full crash fallback when the dedup store throws`: a store `{ clock: () => { throw new Error('store failed'); } }` cast to `DirectiveLifecycleState` gives the full outage context.
  6. (d) `records the crash fallback policy once under the runtime`: after `clearPolicyObservationSink()`, a crashing turn with `runtime: 'pi'`, a session id and `lifecycle_event: 'startup'` leaves the same record count as the timeout path for a second session of the same shape. The test calls `clearPolicyObservationSink()` again before the timeout-path run, so each count covers one run. The count is above 0, and every `binding.runtime` is `pi`.
  7. (e) `returns the outage fallback when the clock throws`: `now: () => { throw new Error('clock'); }` on a valid payload resolves to `expectedOutageContext('fail_open')`.
  8. (e) `keeps a disabled hook and an invalid payload silent when the clock throws`: with the same clock, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` resolves to `{}` and a `null` payload resolves to `{}`.
- **`ENV-REFERENCE.md:382`**: the sentence `Below this value, a recommendation is filtered out unless \`confidenceOnly\` mode is active.` becomes `Below this value, a recommendation is filtered out, and \`confidenceOnly\` mode skips only the uncertainty check.` Every other word on the line stays, including the `daemon starts` sentence.
- **`hooks/skill-advisor-hook.md:57`**: the sentence `It also returns \`{}\` when input is invalid or an exception escapes.` becomes `It also returns \`{}\` when input is invalid. When its own code throws, it returns the outage fallback, or the skipped fallback for a skipped prompt, and returns \`{}\` only if that fallback cannot be rendered.`

### Data Flow
A turn that throws anywhere after the clock read lands in the catch with whatever the try had assigned. The diagnostic is written as before. The fallback is rendered with that turn's delivery state, setup flag and skip classification. It passes through the same dedup as a timeout. It returns through the same delivery step, which records the policy once with the runtime label.

### Why this is small
The catch fired 0 times in 8,231 retained diagnostic records (`../004-crash-path-fallback/spec.md`, Measured Behavior). This is a correctness pass on a guard, not an incident fix. The helpers move existing code. They add no new behavior to the normal path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-reads the handler and the two doc lines and records the hook suite baseline. Implementation lands the eight tests and the two doc lines and confirms the seven reds. It then edits `hooks/claude/user-prompt-submit.ts` in three serial steps: the helpers, the hoisting with the clock and the catch. Verification runs the hook and parity suites, the typecheck and build, the doc `rg` checks, the scope and hygiene checks and strict validation. The ordered work is in `tasks.md`.

| Wave | Who | Tasks | Files |
|------|-----|-------|-------|
| 0 | Conductor | T001, T002 | none |
| 1 | Luna leaves: T003 to T006 in series on the test file, T007 and T008 in parallel with them | T003 to T008 | `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` and `hooks/skill-advisor-hook.md` |
| 2 | Conductor | T009 confirm seven reds and one green guard | none |
| 3 | 3 Luna leaves in series | T010 helpers, T011 hoisting and clock, T012 the catch | `hooks/claude/user-prompt-submit.ts` |
| 4 | Conductor | T013 to T019 | `implementation-summary.md` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`npx vitest run tests/hooks/claude-user-prompt-submit-hook.vitest.ts` from `runtime/` is the inner loop. After the tests land it fails on exactly seven tests, (a), (b), the two (c) dedup tests, (d) and both (e) tests, while the (c) guard passes. After T010 the same seven still fail and nothing else does, because the helpers only move code. After T011 the two (e) tests pass. After T012 the file exits 0. The gate is `npx vitest run tests/hooks tests/parity`, which held 171 of 171 in `tests/hooks` on 2026-11-18 and must end at 179.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 008 complete. No new package and no new export from `runtime/lib/render.ts`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a turn that did not crash shows a fallback. A disabled hook showing any context or dedup dropping a directive block it should keep is a trigger too. Revert the phase commit. It restores the 004 catch, removes the eight tests and restores both doc sentences. Then rebuild `runtime/` so the adapters load the reverted handler.
<!-- /ANCHOR:rollback -->

---
