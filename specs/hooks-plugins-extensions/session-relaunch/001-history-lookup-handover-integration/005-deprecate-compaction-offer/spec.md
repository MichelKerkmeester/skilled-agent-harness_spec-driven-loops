---
title: "Feature Specification: Phase 5: deprecate-compaction-offer"
description: "The handover offers the history lookup at claim, yet five compaction producers still mint a locator and print the same section. This phase removes the compaction-time mint and offer on every runtime and deletes the OpenCode plugin, so one path owns the offer."
trigger_phrases:
  - "deprecate compaction offer"
  - "phase 5 deprecate compaction offer"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: deprecate-compaction-offer

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/399-hook-feature-subtracks` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-offer-lookup-at-claim |
| **Successor** | 006-docs-and-live-hop-proof |
| **Handoff Criteria** | No compaction producer mints a locator or prints the lookup section on any runtime, the handover claim offer from phase 004 still prints one, and the remaining history and hook suites pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Move the session history lookup out of the compaction path and into the in-session handover, so a receiving session can look up the sender's earlier turns. specification.

**Scope Boundary**: The compaction producers and their tests only. The handover's own mint and claim offer are phase 004's, and the docs, catalog and playbooks are phase 006's.

**Dependencies**:
- Phase 004 is proven: a claim prints a lookup command that returns the sender's turns.
- The locator schema in `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts` stays as it is.
- The shared offer builder and the `hl1_` digest stay as they are.

**Deliverables**:
- No compaction producer mints a locator or prints the lookup section.
- The OpenCode plugin and its test are gone.
- The locator suites build their fixtures from one shared builder instead of a producer.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The in-session handover starts a fresh session near the context limit, so compaction rarely happens. Phase 004 puts the lookup in the claim output, which is the path a session actually takes. The compaction path still mints a locator and prints the same `## History Lookup` section on five runtimes, so a session can be offered the lookup twice, and an offer can appear on a path the handover exists to avoid. Two owners for one offer also means two copies of the mint to keep on the same digest.

### Purpose
The handover is the only place the lookup is offered, and no compaction path mints a locator or prints the section on any runtime.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -c --include-zero "mintHistoryLocator|buildHistoryLookupSection" .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs .skilled/skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts .opencode/plugins/session-history-lookup.js
.opencode/plugins/session-history-lookup.js:4
.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs:5
.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs:3
.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:4
.skilled/skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts:2
.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:2
.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:2
```

Seven files name the compaction mint or the offer, in 22 places. The section 3 file table names what each one does with it.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the PreCompact mint and the SessionStart offer from the Claude hooks.
- Remove the post-compaction mint and offer from the Pi, DSH and Devin adapters.
- Delete the OpenCode plugin and its test.
- Replace the producer mints the suites use as fixtures with one shared locator builder.
- Keep the compaction summary and the `/speckit:resume` pointer each producer also emits.

### Out of Scope
- The handover's mint at `prepare` and its offer at `claim` - phase 004 owns both, and this phase must not change them.
- The locator schema, the `hl1_` digest and the lookup CLI - no field, handle or refusal changes here.
- The docs, catalog, playbooks and READMEs that name the compaction offer - phase 006 owns them.
- The OpenCode purpose line planned in `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/spec.md:188` - recorded as a risk, not carried here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | Modify | Drop the PreCompact mint, the locator field in `persistCompactResult`, `stampHistoryLocator` and `mirrorToCheckoutRoot`. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | Modify | Drop the SessionStart lookup section, its freshness gate, its capability read and its budget reservation. |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts` | Modify | Drop the Pi mint, the persist call and the offer. |
| `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs` | Modify | Drop the locator support block, the mint, the persist call and the offer. |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` | Modify | Drop the mint, the persist call, the one-shot marker and its helpers. |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/user-prompt-submit.ts` | Modify | Drop the marker read and the prompt-time offer; keep the advisor context. |
| `.opencode/plugins/session-history-lookup.js` | Delete | The OpenCode compaction offer. |
| `.skilled/skills/system-spec-kit/runtime/tests/_support/history-fixtures.ts` | Modify | Add one locator builder the suites share. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-lookup-cli.vitest.ts` | Modify | Build locators from the fixture, not from the producers. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-locator.vitest.ts` | Modify | Drop the mint, PreCompact-persistence and gate suites; seed the locator directly. |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts` | Modify | Drop the two locator cases and call `persistCompactResult` with three arguments. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-vocabulary-drift.vitest.ts` | Modify | Drop the four adapter constants and the case that reads them. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts` | Delete | The adapter mint and offer suites. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-lookup-adapters-e2e.vitest.ts` | Delete | The per-adapter offer redemption cases. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-lookup-after-session-start.vitest.ts` | Delete | The SessionStart offer cases. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-lookup-devin-prompt-offer.vitest.ts` | Delete | The Devin marker and prompt-offer cases. |
| `.opencode/plugins/tests/session-history-lookup.test.cjs` | Delete | The OpenCode plugin's test. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No compaction producer mints a locator. | `rg -n "mintHistoryLocator"` over the seven producer files prints nothing and exits 1. |
| REQ-002 | No compaction producer prints the lookup section. | `rg -n "History Lookup\|buildHistoryLookupSection"` over the seven producer files prints nothing and exits 1. |
| REQ-003 | The OpenCode plugin and its test are deleted. | `ls .opencode/plugins/session-history-lookup.js .opencode/plugins/tests/session-history-lookup.test.cjs` exits 1 for both. |
| REQ-004 | The compaction summary and the `/speckit:resume` pointer stay on Pi, DSH and Devin. | The remaining adapter suites assert `## Post-Compaction Summary` or the summary text and `/speckit:resume` in the same message. |
| REQ-005 | The locator suites build their fixtures from the shared builder. | `rg -n "mintHistoryLocator" .skilled/skills/system-spec-kit/runtime/tests` prints nothing and exits 1. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The vocabulary-drift suite checks only the copies that remain. | `npx vitest run tests/history-vocabulary-drift.vitest.ts` exits 0 from the runtime folder. |
| REQ-007 | No deleted suite leaves a dangling import. | `npx tsc --noEmit -p tsconfig.json` exits 0 from the runtime folder. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n "History Lookup|buildHistoryLookupSection|mintHistoryLocator"` over the seven producer files prints nothing and exits 1.
- **SC-002**: `npx vitest run tests/history-*.vitest.ts tests/hook-precompact.vitest.ts` exits 0 from `.skilled/skills/system-spec-kit/runtime`.
- **SC-003**: `node --test .opencode/plugins/tests/` exits 0 with the plugin test removed.
- **SC-004**: `npx tsc --noEmit -p tsconfig.json` exits 0 from `.skilled/skills/system-spec-kit/runtime`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004's claim offer is proven. | A session would be left with no offer at all. | T001 gates the phase: it must print a lookup line from the claim path before any producer is touched. |
| Risk | The handover imports a producer's mint. | Deleting that export breaks the claim offer. | T002 checks the handover for the name; if it imports one, keep that export and delete only its call site. |
| Risk | The OpenCode purpose line planned at `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/spec.md:188` rides the plugin this phase deletes. | The purpose line loses its carrier. | Recorded here and in `goal.md`; the operator decides, and phase 006 owns the docs that would name a new carrier. |
| Risk | Deleting the adapter suites removes the only OpenCode CLI redemption proof. | An OpenCode claim could regress unnoticed. | Phase 004's claim tests own the offer that reaches OpenCode; `plan.md` section 5 states the gap. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the handover mint a Claude locator over the transcript path? The CLI recomputes the handle from the resolved transcript at `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts:397`, so a locator minted over the identity alone would refuse with `handle_mismatch`. This phase does not change the CLI.
- Who carries the OpenCode purpose line once the plugin is gone? The operator decides; phase 006 owns the docs.
<!-- /ANCHOR:questions -->

---
