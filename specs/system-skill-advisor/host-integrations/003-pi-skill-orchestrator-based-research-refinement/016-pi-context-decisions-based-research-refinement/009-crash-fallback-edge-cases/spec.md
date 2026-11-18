---
title: "Feature Specification: Crash-Fallback Edge Cases"
description: "The shared hook's crash fallback drops the setup hint, shows a skipped prompt as an outage, skips directive dedup and records its policy observation with no session or runtime. A throwing clock still makes the handler reject. This phase closes those five edges behind red-first tests and corrects a false clause about confidenceOnly mode in the threshold doc row."
trigger_phrases:
  - "crash fallback edge cases"
  - "phase 9 crash fallback edge cases"
  - "advisor hook crash setup wording skipped prompt"
  - "crash fallback directive dedup policy observation"
  - "confidenceOnly threshold doc clause"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Crash-Fallback Edge Cases

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-11-18 |
| **Branch** | `worktrees/474-advisor-pasted-context-and-crash-fallback` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 13 |
| **Predecessor** | 008-handler-scored-prompt-consumers |
| **Successor** | 010-route-receipts-research |
| **Handoff Criteria** | Each of the five edges has a test that failed before its fix, the hook suite is green and the `confidenceOnly` clause is corrected. Phase 011 edits the same hook file later, so this phase pins its lines first |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the pi-context-decisions refinement packet. It closes the edge cases the phase 004 refutation pass confirmed, recorded in `tmp/p004-briefs/last-refute.txt` at the repository root and listed in `../004-crash-path-fallback/implementation-summary.md` Known Limitations item 2 and Verification. It also fixes the doc clause that item 3 left alone.

Paths are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot. The crash fallback is the text the shared hook's outer catch returns when the hook's own code throws. The timeout fallback is the text it returns when the advisor answers `fail_open`. Directive dedup, short for directive-lifecycle dedup, drops the repeated `Directives:` block on later turns of a known session.

**Scope Boundary**: The handler `handleClaudeUserPromptSubmit` and its outer catch in `hooks/claude/user-prompt-submit.ts`, its hook test file, one clause on one line of `ENV-REFERENCE.md` and one sentence in `hooks/skill-advisor-hook.md`. `runtime/lib/render.ts` and the adapters stay as they are.

**Dependencies**:
- `renderAdvisorFallbackDirective` and `renderAdvisorTimeoutFallback` (`runtime/lib/render.ts:651-674`) already take a `deliveryState` and a `setupWording` option and already classify a skipped result.
- `decideDirectiveLifecycleDelivery` (`hooks/lib/directive-lifecycle.ts:121`) and `observeEmittedAdvisorPolicy` (`runtime/lib/render.ts:469`), which the normal path already calls.

**Deliverables**:
- A crash fallback that keeps the setup hint and the skipped classification, runs directive dedup with the deferred receipt and records its policy observation once with the runtime and delivery state.
- A clock read inside the guarded region, so a throwing clock yields the fallback and never a rejection.
- Seven red-first tests and one guard test in the hook test file.
- The corrected `confidenceOnly` clause and the corrected crash sentence in the hook doc.

**Amendment of 004.** `../004-crash-path-fallback/implementation-summary.md:80` records "Render with default options and skip directive-lifecycle dedup in the catch" as by design, and `../004-crash-path-fallback/spec.md:143` accepts the skipped dedup as a low risk. This phase reverses both halves under the operator directive "Fix all open work leave nothing open or untested" (`../spec.md:38`). 004's reason was that the catch cannot trust state built in the try. This phase answers it this way: the catch reads only values that were fully assigned before the throw or still hold their initial default, and dedup runs inside its own try. 004's files stay as written. This spec and its `goal.md` carry the amendment.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 004 made the outer catch of `handleClaudeUserPromptSubmit` (`hooks/claude/user-prompt-submit.ts:469-492`) return `renderAdvisorTimeoutFallback()` with default options inside a nested try (`:483-491`). Five edges remain.

- **(a) Setup wording.** The normal path passes `setupWording` from `SETUP_WORDING.test(prompt)` (`:389`), and the outage head adds `for setup or health checks, run /doctor:setup` only when it is set (`runtime/lib/render.ts:657`). The catch passes no options, so a crashing setup prompt loses the hint.
- **(b) Skipped prompt.** A prompt the policy skips gets `skippedAdvisorResultFor` (`:372`) and normally renders `Advisor: prompt skipped.` (`runtime/lib/render.ts:658-659`). If rendering then throws, the catch shows it as an outage.
- **(c) Directive dedup.** The normal path runs `decideDirectiveLifecycleDelivery` inside its own try (`:398-432`) and attaches the deferred full-delivery receipt (`:454-459`). The catch skips both, so a known session gets the full `Directives:` block on every crashing turn.
- **(d) Policy observation.** The fallback render observes the policy through `observeAdvisorPolicy` (`runtime/lib/render.ts:664`), which hands `options.deliveryState` to the shadow observer (`:454`). The catch passes no options, so that state is empty. The normal path also records the emitted policy once with the runtime label and delivery state (`hooks/claude/user-prompt-submit.ts:461-467`). The catch does not.
- **(e) The clock.** `dependencies.now` runs at `:313`, before the try at `:317`. It runs again inside `elapsed` (`:314`). A throwing clock makes the exported handler reject. The catch also calls `elapsed()` and `workspaceRootFor(input)` as arguments (`:470-478`). Both are evaluated before `emitDiagnostic`'s own guard (`:261-273`), so a clock or workspace fault there throws out of the catch.

Separately, the `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` row says a recommendation below the threshold "is filtered out unless `confidenceOnly` mode is active" (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:382`). That is false. In `confidenceOnly` mode `passingRecommendations` still requires `confidence >= confidenceThreshold` (`runtime/lib/skill-advisor-brief.ts:175-176`), and the mode drops only the uncertainty check (`:178-179`). The hook doc also still says the handler returns `{}` "when an exception escapes" (`hooks/skill-advisor-hook.md:57`), which has been false since phase 004.

### Purpose
A crash in the shared hook delivers the same fallback, dedup and policy record a timeout delivers for the same turn, and the handler never rejects.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Run on 2026-11-18 from `.skilled/skills/system-skill-advisor/runtime/` against the built hook in `runtime/dist/`. The build is from 15:38:42 and the hook source is from 15:36:18, so the build holds the 004 catch. Both probe scripts are kept in this folder's `scratch/`. Each injects a `renderBrief` that throws, and the second runs the timeout path for the same prompts. Output heads only.

```text
$ node <phase folder>/scratch/probe.mjs "$PWD/dist" 2>/dev/null; echo "exit=$?"
(a) Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json
(b) Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json
(c) turn 1 directives=true
(c) turn 2 directives=true
(d) crash records= 0
(d) timeout-path records= 2 runtimes= pi
(e) rejected: clock
exit=0

$ node <phase folder>/scratch/probe2.mjs "$PWD/dist" 2>/dev/null; echo "exit=$?"
timeout path [set up the hooks and install the toolchain] Advisor: outage (fail_open); for setup or health checks, run /doctor:setup; route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json
timeout path [/help] Advisor: prompt skipped.
exit=0
```

For the same prompts the timeout path keeps the setup hint and the skipped head, and the crash path loses both. Two crashing turns of one session both carry the directive block. The crash records 0 policy observations where the timeout path records 2 under `pi`, and a throwing clock rejects. The hook suite baseline the same day was 11 files and 171 of 171 passing.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hoist `prompt`, `workspaceRoot`, `skippedResult` and `deliveryState` above the try in `handleClaudeUserPromptSubmit`, so the catch reads values the try fully assigned or their initial defaults.
- Read the clock inside the try after the disabled and invalid-payload returns. Make `elapsed` return 0 when the clock throws.
- Move the dedup block (`:396-432`) into a module-local `applyDirectiveLifecycle`, and the output build, receipt and emitted-policy record (`:448-468`) into a module-local `finishAdvisorDelivery`. Both paths call them.
- Make the catch render `renderAdvisorFallbackDirective(renderOptions, skippedResult)` for a skipped prompt and `renderAdvisorTimeoutFallback(renderOptions)` otherwise, with `renderOptions = { deliveryState, setupWording }`. Then run `applyDirectiveLifecycle` and `finishAdvisorDelivery`, all inside the nested try whose last resort stays `{}`.
- Add seven red-first tests and one guard test, correct the `confidenceOnly` clause on `ENV-REFERENCE.md:382` and correct the crash sentence on `hooks/skill-advisor-hook.md:57`.

### Out of Scope
- `runtime/lib/render.ts` - passing the delivery state reaches the existing observer, so no render option is needed.
- The adapters in `hooks/pi/`, `hooks/dsh/` and `hooks/vibe/` and the Codex and Claude shims - they forward what the shared handler returns, as Reach below shows.
- A separate diagnostic status for a crash on a skipped prompt - the hook did crash, so the diagnostic stays `fail_open` with `errorCode` `UNKNOWN`.
- The `SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD` row - the brief names one clause on one line.

### Reach
Pi, DSH, Vibe and Codex reach this shared handler. OpenCode does not.
- **Claude**: the CLI entry calls the handler with `deferDirectiveReceipt: true` (`hooks/claude/user-prompt-submit.ts:535-538`). Edges (a) to (e) all apply, and the deferred receipt is why the catch must attach it.
- **Codex**: `runClaudeHookAdapter` (`.skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts:90`) runs the Claude shim with `SPECKIT_RUNTIME=codex` (`:98-104`), and `emitNormalizedCodexContext` (`:134`) passes its `additionalContext` on. The shim spawns the same built hook (`.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:17`, `:155`), so Codex gets what Claude gets.
- **Vibe**: forwards `session_id` and `transcript_path` (`hooks/vibe/prompt-advisor.mjs:229-238`) and calls the handler without a deferred receipt (`:190-195`). Dedup and the policy record apply.
- **DSH**: forwards `session_id` but no transcript (`hooks/dsh/prompt-advisor.mjs:168-173`), so shared dedup always returns full text (`hooks/lib/directive-lifecycle.ts:133-135`) and DSH reduces repeats in its own `deliveredContext` (`:177`). The policy record applies.
- **Pi**: forwards only `prompt`, `cwd` and `hook_event_name` (`hooks/pi/prompt-advisor.ts:290-294`). With no session there is no dedup, and `recordObservedPolicyDelivery` returns null (`runtime/lib/policy-plan.ts:840-843`). Edges (a), (b) and (e) apply.
- **OpenCode**: uses its own `experimental.chat.system.transform` plugin (`.opencode/plugins/system-skill-advisor.js:1671`), as `hooks/skill-advisor-hook.md:59` says.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `hooks/claude/user-prompt-submit.ts` | Modify | Hoisted values, the guarded clock, the two extracted helpers, the rewritten catch and the corrected comment at `:390-395` |
| `runtime/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify | `runHookWithStore` gains an optional `renderBrief` parameter. Eight tests: (a), (b), three for (c), (d) and two for (e) |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | One clause on line 382. The `daemon starts` sentence stays word for word |
| `hooks/skill-advisor-hook.md` | Modify | The last sentence of line 57 says what a crash returns now |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A crashing setup prompt keeps the `/doctor:setup` hint | With a throwing `renderBrief` and the prompt `set up the hooks and install the toolchain`, `additionalContext` equals what the timeout path returns for the same prompt. The test fails before the fix |
| REQ-002 | A crashing skipped prompt keeps the skipped fallback | With a throwing `renderBrief` and the prompt `/help`, `additionalContext` equals `EXPECTED_SKIPPED_CONTEXT`. The test fails before the fix |
| REQ-003 | The crash fallback goes through directive dedup | Two crashing turns of one known session, sharing one store, return the full outage context and then its head alone. With `deferDirectiveReceipt` true, the second turn stays full until `commitClaudeDirectiveDeliveryReceipt` on the first output returns true, and a third turn after the commit is the head alone. Both tests fail before the fix |
| REQ-004 | A dedup fault keeps the full text | With a store whose `clock` throws, a crashing turn returns the full outage context. This guard test passes before and after the fix by construction |
| REQ-005 | The crash path records the policy observation once with the runtime and delivery state | With `runtime: 'pi'`, a session id and `lifecycle_event: 'startup'`, a crashing turn leaves as many `getPolicyObservationRecords()` records as the timeout path leaves for the same input shape, more than 0, each with `binding.runtime` `pi`. The test fails before the fix |
| REQ-006 | A throwing clock yields the fallback and never a rejection | With `now` throwing, a valid payload resolves to the outage context. The test fails before the fix, because the handler rejects |
| REQ-007 | A disabled hook and an invalid payload stay `{}` under a throwing clock | With `now` throwing, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` resolves to `{}`, and a `null` payload resolves to `{}`. The test fails before the fix, because the handler rejects |
| REQ-008 | Existing hook behavior is unchanged | `npx vitest run tests/hooks tests/parity` from `runtime/` exits 0, including the 004 crash test and DL1 to DL6 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | The threshold row states what `confidenceOnly` does | ``rg -n "unless `confidenceOnly`" .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`` prints nothing, `rg -n 'skips only the uncertainty check' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints line 382, `rg -n 'daemon starts' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` still prints line 382 and `git diff --numstat` on that file prints 1 added and 1 deleted line |
| REQ-010 | The hook doc says what a crash returns | `rg -n 'exception escapes' .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` prints nothing, and `rg -n 'outage fallback' .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` prints line 57 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: For any one input, the crash path and the timeout path return the same `additionalContext`, apart from the diagnostic record.
- **SC-002**: Every call the catch makes is guarded. `emitDiagnostic` has its own try (`hooks/claude/user-prompt-submit.ts:261-273`) and its arguments read only hoisted values and the guarded `elapsed`. Render, dedup and delivery sit in the nested try whose last resort is `{}`.
- **SC-003**: `git diff --stat` for this phase lists exactly the four files in Files to Change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 011 edits the same hook file after this phase | 011's line pins would drift if it planned against today's lines | The parent build order puts 009 before 011, and 011 re-reads the file in its own setup |
| Risk | Dedup or delivery code put back on the crash path could throw again | Low | `applyDirectiveLifecycle` keeps the existing inner try that returns the full text. `observeEmittedAdvisorPolicy` is fail-open (`runtime/lib/render.ts:469-501`). The nested try still returns `{}` |
| Risk | The clock read moves below the disabled and invalid-payload returns | Low. Those two paths now record `durationMs` 0, and the normal path's duration starts after the hook-enabled check | Both paths return `{}` before any advisor work, so their duration was near 0 already |
| Risk | A missing prompt string with a throwing clock now returns the outage fallback where a working clock returns `{}` | Low. Only an injected clock can throw, and no registered host passes `now`: the CLI entry (`:535-538`), Pi (`hooks/pi/prompt-advisor.ts:298`), DSH (`hooks/dsh/prompt-advisor.mjs:124-127`) and Vibe (`hooks/vibe/prompt-advisor.mjs:192-195`) | Accepted. Recorded here |
| Risk | Hoisted state is wrong after a partial try | Low | Each hoisted value is either its initial default or a fully assigned result, and `deliveryStateOptionsFor` is pure (`:240-254`) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- (d) asks for the smallest change. Recommended default: pass `deliveryState` into the fallback render and call `observeEmittedAdvisorPolicy` once in `finishAdvisorDelivery`. This is the same pair of calls the normal path makes, `runtime/lib/render.ts` does not change and `observeRenderedAdvisorPolicy` is a no-op (`runtime/lib/policy-plan.ts:963-966`), so one call is the only sink write. The alternative, a render option that turns observation off on the crash path, would need a `render.ts` edit and would leave the crash path unlike the timeout path.
- (e) Should a throwing clock instead fall back to `performance.now()` and let the turn deliver its normal brief? Recommended default: no. The brief asks for the fallback, and the catch is the one place that already promises a non-rejecting result.
- `hooks/skill-advisor-hook.md:57` is not in the brief. Recommended default: keep it in this phase, because this phase changes the behavior that sentence describes and the operator directive leaves nothing open. The conductor may drop REQ-010 and its task without touching anything else.
- Brief line drift. The brief puts the outer catch at about `:468-497`. The file has `return output` at `:468`, the catch at `:469-492` and the function's closing brace at `:493`.
<!-- /ANCHOR:questions -->

---
