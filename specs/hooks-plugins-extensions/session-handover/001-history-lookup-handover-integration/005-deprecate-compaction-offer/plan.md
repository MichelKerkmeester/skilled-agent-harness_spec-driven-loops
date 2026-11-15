---
title: "Implementation Plan: Phase 5: deprecate-compaction-offer"
description: "Remove the compaction-time locator mint and the lookup section from five producers, delete the OpenCode plugin and its test, and rebuild the locator suites on one shared fixture so the handover is the only offer."
trigger_phrases:
  - "deprecate compaction offer plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: deprecate-compaction-offer

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript hooks under `runtime/hooks`, plus one `.mjs` and one `.cjs` adapter |
| **Framework** | None; the hooks are plain modules the hosts load |
| **Storage** | The hook-state JSON file under the temp directory, read through `hook-state.ts` |
| **Testing** | Vitest for the runtime suites, `node:test` for the OpenCode plugin suites |

### Overview
The change is a removal, not a rewrite. Each producer loses its mint call, its state write and its offer text, while the summary and the `/speckit:resume` pointer it also emits stay. The suites that used a producer's mint as a fixture move to one shared builder, so the locator contract is still tested without a compaction path to mint it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 004 prints a lookup command from `claim` (`tasks.md` T001).
- [ ] No handover module imports a producer's mint (`tasks.md` T002).
- [ ] The history and hook suites pass before the first edit (`tasks.md` T003).

### Definition of Done
- [ ] `rg -n "History Lookup|buildHistoryLookupSection|mintHistoryLocator"` over the seven producer files prints nothing and exits 1.
- [ ] `npx vitest run tests/history-*.vitest.ts tests/hook-precompact.vitest.ts` exits 0 from `.skilled/skills/system-spec-kit/runtime`.
- [ ] `node --test .opencode/plugins/tests/` exits 0.
- [ ] Docs updated (spec/plan/tasks).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single owner. The handover owns the offer; the compaction path keeps only recovery text.

### Key Components

What each producer does for the lookup today, and what this phase removes. The line numbers are the state of the tree this plan was written against; phase 002 relocates `runtime/hooks/lib/history/`, so re-resolve those paths if the move has landed.

| File and line | What it does for the lookup | Removed |
|---|---|---|
| `claude/compact-inject.ts:105` | Exports `mintHistoryLocator`, which hashes the transcript path into an `hl1_` handle | The export, and its call at `:707` inside the `input.transcript_path` branch at `:703` |
| `claude/compact-inject.ts:560` | `persistCompactResult` writes `historyLocator` into the same state patch as the compact cache (`:582`) and mirrors it to the checkout root at `:584` | The fourth parameter, the `historyLocator` field and the `mirrorToCheckoutRoot` call |
| `claude/compact-inject.ts:594` | `mirrorToCheckoutRoot` writes a second state copy at the checkout root | The function |
| `claude/compact-inject.ts:144` | `stampHistoryLocator` refreshes the mint time on each persist | The function and its two calls at `:723` and `:743` |
| `claude/session-prime.ts:88` | `buildHistoryLookupSection` gates a stored locator on session, runtime, workspace, provenance source and a 30-minute age | The function and its call at `:205` |
| `claude/session-prime.ts:118` | `loadHistoryCapability` reads the reader table before any offer | The function |
| `claude/session-prime.ts:354` | `formatBudgetedHookOutput` reserves the offer's bytes before the brief (`:355-364`) | The reservation branch; the plain `truncateToTokenBudget` call stays |
| `pi/session-compact-context.ts:115` | Mints a Pi locator on `session_compact` | The function and the call at `:192` |
| `pi/session-compact-context.ts:150` | Persists the locator through the hook-state writer | The function and the call at `:194` |
| `pi/session-compact-context.ts:195` | Pushes the offer into the recovery message | The offer lines; `fitRecoverySections` at `:202` stays |
| `dsh/session-compact-context.mjs:82` | Mints a DSH locator on `compaction/end` | The function and the call at `:174` |
| `dsh/session-compact-context.mjs:110` | Persists the locator | The function and the call at `:175` |
| `dsh/session-compact-context.mjs:125` | `composeCompactionContext` appends the offer before the recovery pointer | The offer branch at `:132-135` and the `locator` and `historyCapability` parameters |
| `devin/post-compaction.cjs:178` | Mints a Devin locator | The function and the call at `:313` |
| `devin/post-compaction.cjs:207` | Persists the locator and writes the one-shot marker at `:219` | The function, `pendingOfferPath` at `:231` and `recordPendingOffer` at `:236` |
| `devin/user-prompt-submit.ts:139` | `takeHistoryLookupSection` reads the marker, clears it and returns the offer | The function and the call at `:201` |
| `devin/user-prompt-submit.ts:76` | `pendingOfferPath`, `readPendingOffer` at `:80` and `clearPendingOffer` at `:91` | All three, with `locatorIsFresh` at `:99` and `inDirectory` at `:166` |
| `.opencode/plugins/session-history-lookup.js:130` | `sessionHistoryLookupPlugin` mints on `session.compacted` (`:145`) and pushes the section into each request's system text (`:165`) | The whole file |

What stays untouched:

- `lookup-offer.ts:132` `buildHistoryLookupSection` and `:171` `fitRecoverySections`, because the handover and the summary budget still call them.
- `hook-state.ts:285` `HistoryLocatorSchema` and the `historyLocator` field at `:353`, because phase 004 writes through them.
- `cli.ts:397`, which re-derives the handle, and the `hl1_` digest.

### Data Flow
Before: a compaction event mints a locator, writes it beside the compact cache, and the recovery message carries the summary, the lookup section and the `/speckit:resume` pointer. After: the compaction event writes the cache only, and the recovery message carries the summary and the pointer. The handover's `prepare` mints and its `claim` prints the one offer.

### Precondition
Deleting a producer's mint is safe only when the handover does not import it. `tasks.md` T002 checks `.skilled/hooks/session-handover` for the name. If it appears, keep that one export and delete only its call site; the rest of the plan is unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Setup**: confirms the claim offer is proven and reads the seven producers.
- **Implementation**: removes the mint and the offer from each producer, deletes the OpenCode plugin and its test, and moves the suites onto one locator fixture.
- **Verification**: reruns the history, hook, type-check and plugin gates and proves no producer names the lookup.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Gate | Command | Expected |
|---|---|---|
| No producer offers | `rg -n "History Lookup\|buildHistoryLookupSection\|mintHistoryLocator"` over the seven producer files | no output, exit 1 |
| History suites | `npx vitest run tests/history-*.vitest.ts tests/hook-precompact.vitest.ts` in `.skilled/skills/system-spec-kit/runtime` | exit 0 |
| Types | `npx tsc --noEmit -p tsconfig.json` in `.skilled/skills/system-spec-kit/runtime` | exit 0 |
| Plugin suites | `node --test .opencode/plugins/tests/` | exit 0 |

Deleted suites and what replaces their proof:

- `history-lookup-adapters-e2e.vitest.ts`, `history-lookup-after-session-start.vitest.ts` and `history-lookup-devin-prompt-offer.vitest.ts` prove the offer each producer printed. The offer is gone, so the proof is gone with it.
- `history-locator-adapters.vitest.ts` proves the four producers share one digest. `history-lookup-cli.vitest.ts` already redeems a real locator through the CLI for Claude, Devin, Pi and DSH, and a wrong digest fails there with `handle_mismatch`.
- The OpenCode CLI path keeps no suite of its own once the plugin test is deleted. Phase 004's claim tests own the offer that reaches it; this gap is stated in `spec.md` section 6.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 004 claim offer | Internal | Required | No offer would remain, so the phase must not start |
| `historyHandle` in `locator-digest.ts` | Internal | Available | The shared fixture cannot build a locator the CLI accepts |
| Vitest and `node:test` | External | Available | The suite gates cannot run |

No new package is added.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a session reaches a compaction and is left with no way to recover its earlier turns, or the claim offer stops printing.
- **Procedure**: revert the scoped commits. The producers return with their mint and offer, and the OpenCode plugin returns with its test. No state file, schema or stored locator needs migration, because this phase writes no new field.
<!-- /ANCHOR:rollback -->

---
