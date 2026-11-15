---
title: "Feature Specification: Phase 3: mint-locator-at-prepare"
description: "prepare writes a relaunch record and validates the note, then the receiver starts with nothing the lookup CLI can redeem, because no locator exists for the sending session. This phase mints and persists a handover-sourced locator at prepare, without ever blocking the handover."
trigger_phrases:
  - "mint locator at prepare"
  - "phase 3 mint locator at prepare"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: mint-locator-at-prepare

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/399-hook-feature-subtracks` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-history-core-relocation |
| **Successor** | 004-offer-lookup-at-claim |
| **Handoff Criteria** | `prepare` stores a locator whose provenance source is `handover` for a Claude sender, a mint that cannot complete leaves prepare's exit code and output unchanged, and both test files named in `tasks.md` pass. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the history-lookup handover packet: the handover's `prepare` step leaves a locator for the sending session, so a later claim can redeem it.

**Scope Boundary**: The mint and its one write. The claim output, the receiver step and the compaction mint belong to other phases.

**Dependencies**:
- Phase 002 for where the shared history helpers live. This phase names behaviour, not paths.

**Deliverables**:
- A `handover` provenance source in the locator schema.
- A mint helper in the handover core that reuses the shared digest and the shared state writer.
- One call in `prepare`, after the relaunch record is written.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`prepare` validates the note and writes the relaunch record, and the receiving session then starts with only the note's four sections. Prepare mints no locator, so a sender that never compacted leaves no `historyLocator` in the hook state file the lookup CLI reads, and the receiver has nothing to redeem. Every mint that exists today runs on the compaction path, which the handover exists to avoid.

### Purpose
A handover prepared in this checkout leaves a locator for the sending session that the receiving session's lookup CLI can redeem.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n --count-matches --include-zero "historyHandle|persistHistoryLocator|historyLocator" .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts .skilled/hooks/session-handover/bin/session-handover.cjs .skilled/hooks/session-handover/lib/relaunch-core.cjs
.skilled/hooks/session-handover/bin/session-handover.cjs:0
.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:20
.skilled/hooks/session-handover/lib/relaunch-core.cjs:0
```

The 20 matches are the PreCompact producer. The two 0 counts are `prepare` and the handover core, which name no locator helper at all.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Accept `handover` as a provenance source in `HistoryLocatorSchema`, beside the two sources it already carries.
- Mint a locator for the sending session when `prepare` writes a relaunch record, reusing the shared handle digest and the shared state writer instead of a second digest.
- Persist the locator through the hook-state writer, which keys the file by the checkout root the printed command runs from.
- Keep the handover fail-open: a mint that cannot complete changes neither prepare's exit code nor its output.

### Out of Scope
- Printing the lookup section in the claim output - phase 004 owns that surface.
- Re-minting at claim - the CLI treats a locator 30 minutes old as stale, and phase 004 owns the second mint.
- Removing the compaction mint - phase 005 owns that removal.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts` | Modify | Add `handover` to the locator's provenance source enum. |
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modify | Mint and persist the sender's locator, beside the transcript resolvers it needs. |
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | Modify | Call the mint from `prepare` after the record is written. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-locator.vitest.ts` | Modify | Cover the new provenance source in the schema contract. |
| `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` | Modify | Cover the mint, the identity it stores and the fail-open path. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `prepare` mints and persists a locator for the sending session when it writes a relaunch record. | After a prepare whose Claude session log exists, the sender's hook state file holds a `historyLocator` whose `provenance.source` is `handover` and whose `handle` matches `^hl1_[a-f0-9]{32}$`. |
| REQ-002 | The stored locator carries the identity the CLI re-derives. | Recomputing the shared digest from the stored locator and the sender's transcript path returns the stored `handle`; `workspace` is the checkout root, and `sessionDirectory` is present only when the sender ran below that root. |
| REQ-003 | A mint that cannot complete leaves the handover unchanged. | With the hook-state directory unwritable, `prepare` exits 0 and writes the relaunch record. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The locator schema accepts `handover` and still rejects an unknown source. | `HistoryLocatorSchema.safeParse` accepts `source: 'handover'` and rejects `source: 'model_authored'`. |
| REQ-005 | The mint stays silent where the locator could not be redeemed. | A runtime with no entry in `HISTORY_LOCATOR_KINDS` (Cursor) and a Claude sender whose session log cannot be found both leave `historyLocator` null, and prepare still exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A prepare in a sandbox holding a Claude session log leaves exactly one stored locator with source `handover`, and `node --test .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` exits 0.
- **SC-002**: `npx vitest run tests/history-locator.vitest.ts` exits 0 with the new provenance source covered.
- **SC-003**: The measured command prints a non-zero count for both handover files after the change, against 0 for both before it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002's location for the shared history helpers | A wrong module path mints nothing and says nothing | Resolve the helpers through the one path phase 002 publishes, and log a warning on the fail-open branch so a wrong path is visible. |
| Risk | One shared state field: the compaction mint writes the same `historyLocator` field | A later compaction replaces the handover locator, or the reverse | The Claude compaction offer checks the provenance source it expects (`session-prime.ts:99`), so a handover locator is withheld there instead of printed with a command that cannot redeem it. |
| Risk | The CLI refuses a locator 30 minutes old | A slow or manual hop finds the locator stale | The refusal is a named `locator_stale` code and the handover still completes; the packet's claim phase owns a fresh mint. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
