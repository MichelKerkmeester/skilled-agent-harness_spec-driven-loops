---
title: "Plan: Pi-Headless Fallback Directive De-Duplication"
description: "Planned implementation of headless fallback recognition, exact directive-block comparison, empty-head suppression, and regression coverage while retaining the predecessor's fail-open guardrails."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "pi headless fallback dedup plan"
  - "pi directives-only fallback plan"
importance_tier: "high"
contextType: "plan"
parent: "hooks/002-injection-bloat-reduction"
predecessor: "013-pi-local-directive-dedup"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/015-pi-headless-fallback-dedup"
    last_updated_at: "2026-08-09T14:52:48Z"
    last_updated_by: "sol"
    recent_action: "Reconciled headless Pi fallback de-duplication"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".opencode/hooks/dispatch/pi/directive-dedup.test.ts"
    session_dedup:
      fingerprint: "sha256:4804deccc247f346718530e77497b99d81462d6c778488aa72674bb890363276"
      session_id: "2026-08-09-pi-headless-fallback-dedup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Pi-Headless Fallback Directive De-Duplication

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The predecessor implementation splits a headed advisor brief at `PI_DIRECTIVE_SEPARATOR` and stores the directive block in the bounded per-session map (`prompt-advisor.ts:147-151, 187-205`). `decidePiDirectiveDelivery` accepts only a non-empty head before recording or suppressing (`prompt-advisor.ts:224-250`). The input handler then replaces the full context only when the reduced value is truthy before appending `PI_SUBAGENT_DISPATCH_DIRECTIVE` (`prompt-advisor.ts:589-604`).

The fallback shape begins with `Directives:` and has no route-line head. The existing focused suite encodes the current behavior at `directive-dedup.test.ts:20-21, 86-89`; the planned phase will deliberately change that expectation.

### Overview

The implementation extended the existing splitter rather than introducing a second state path. A recognized headless brief returned an empty head plus the exact full directive block. The decision helper recorded that block on full delivery and returned a suppressed decision with an empty reduced context on the next confirmed, byte-identical repeat. The input assembly honored the suppressed decision even when its reduced context was empty, while the Pi dispatch directive remained independently appended.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The implementation will use the existing `PI_DIRECTIVE_SEPARATOR`, `receiptSessionKey`, bounded session map, and lifecycle reset hooks rather than introducing parallel state.
- The normal headed shape, the headless `Directives:` shape, and an unrecognized shape will have explicit expected outputs before code changes begin.
- The existing fallback test's intentional old assertion will be identified as the one behavior that must change.

### Definition of Done

- The splitter will recognize both supported brief shapes and preserve the directive block's exact bytes.
- Only a confirmed same-content repeat in the current lifecycle epoch will suppress; every unknown, dirty, reset, kill-switch, malformed, or error path will deliver full.
- A headless suppression will produce user text plus the full Pi dispatch directive, with no directive block or accidental extra advisor context.
- The focused Pi gate passed 70 tests, and the implementation remained limited to the adapter and focused test files.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

The phase will keep the predecessor's deliver-once-per-lifecycle-epoch pattern with fail-open behavior. The map's presence will continue to mean that the exact directive block was delivered during the current epoch; the existing session-start and compact resets will define the epoch boundary without adding a separate counter.

### Key Components

- `splitPiDirectiveBrief` will return `{ head: "", directives: context }` for a recognized `Directives:`-first brief, and will retain the current headed split for `\nDirectives:` after a non-empty head.
- `decidePiDirectiveDelivery(context, sessionId)` will accept either non-null split result, use `receiptSessionKey` for confirmed session identity, compare the raw directive block byte-for-byte, and return an empty reduced context only for a suppressed headless repeat.
- `directiveDedupBySession` will remain the bounded per-session record; `resetPiDirectiveDedupForSession` and `resetPiDirectiveDedupState` will remain the reset surfaces.
- The input handler will distinguish `suppressed` from the truthiness of `reducedContext`, so an empty head will remove the advisor context while `PI_SUBAGENT_DISPATCH_DIRECTIVE` stays unconditional.

### Data Flow

| Input state | Decision | Visible result |
|-------------|----------|----------------|
| Headed brief, first full delivery | Record exact block | User text + route line + directives + dispatch |
| Headed brief, exact confirmed repeat | Suppress block | User text + route line + dispatch |
| Headless fallback, first full delivery | Record exact block | User text + directives + dispatch |
| Headless fallback, exact confirmed repeat | Suppress block with empty head | User text + dispatch |
| Unknown session, changed block, lifecycle boundary, kill-switch, malformed shape, or error | Full delivery | User text + complete available brief + dispatch |

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

The implementation will confirm the current separator, the headless fallback form, `receiptSessionKey`, the bounded map, the reset hooks, and the final input assembly. It will define focused assertions for both helper output and rendered prompt output before editing the runtime seam.

### Phase 2: Core Implementation

The implementation will extend `splitPiDirectiveBrief` to recognize `Directives:` at byte zero, remove the non-empty-head-only guard from the decision path while retaining fail-open behavior for null or malformed results, and preserve exact directive block strings. It will then update input assembly so a suppressed empty head is treated as intentional suppression, not as a falsey decision. The dispatch directive and all lifecycle reset calls will remain independent and unchanged in behavior.

### Phase 3: Verification

The implementation will update the existing fallback test, add handler-level coverage for the final headless prompt, run the focused directive-dedup suite and the full Pi dispatch suite, check applicable types, measure the expected byte reduction, and inspect the scoped diff for unintended runtime or metadata changes.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The focused unit tests will cover first/full and second/suppressed fallback delivery, exact fallback-content changes, normal headed briefs, unknown and empty session ids, kill-switch values, session isolation, and both reset helpers. The current test named “never suppresses the advisor-failure fallback” will be rewritten to assert full first delivery followed by suppression on the identical confirmed repeat.

Handler-wiring tests will register `promptAdvisor` with the existing mock `ExtensionAPI`, invoke the input handler twice with the fallback shape, and assert that the second output contains the user text and `PI_SUBAGENT_DISPATCH_DIRECTIVE` but no `Directives:` block. They will also confirm that normal headed repeats retain the route line and that `session_start` resume/fork and `session_compact` re-arm full fallback delivery.

Regression checks will run the existing Pi dispatch suite unchanged in scope. A byte-count check will compare the fallback repeat's advisor-plus-dispatch injection against the research target of approximately 1,321 bytes before the change and approximately 554 bytes after it. Type checking will use the repository's applicable configuration and will distinguish any pre-existing environment artifact from a new error.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The existing Pi adapter state in `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`.
- The existing focused suite at `.opencode/hooks/dispatch/pi/directive-dedup.test.ts` and the repository's Pi dispatch test harness.
- The canonical separator and fallback behavior already emitted by the advisor renderer; this phase will not change that producer.
- No new package, network call, persistence layer, central delivery-state machine, or activation-matrix change will be required.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The implementation remained localized to the Pi adapter and its focused test suite. Reverting those two scoped edits restores the predecessor's always-full fallback behavior; setting `SPECKIT_PI_DIRECTIVE_DEDUP=0` provides an immediate runtime opt-out without changing shared code. No central state, shared renderer, metadata, or non-Pi runtime needs to be unwound.

<!-- /ANCHOR:rollback -->
