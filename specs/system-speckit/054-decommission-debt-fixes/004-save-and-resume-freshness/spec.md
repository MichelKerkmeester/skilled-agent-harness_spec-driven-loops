---
title: "Feature Specification: Phase 4: save-and-resume-freshness"
description: "A canonical continuity save never checks the trigger index against the packet's current phrases, and the resume ladder lets a newer unbound handover.md and a malformed thin-continuity fallback outrank validated, packet-bound continuity."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: save-and-resume-freshness

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 7 |
| **Predecessor** | `../003-retrieval-coverage-alignment/spec.md` |
| **Successor** | `../005-hook-fallback-failure-signal/spec.md` |
| **Handoff Criteria** | Save-time staleness detection is implemented and tested, and the resume ladder prefers packet-bound validated continuity over an unbound newer handover in a reproducing test |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the decommission debt fixes specification.

**Scope Boundary**: `scripts/core/workflow.ts`'s save completion step, `scripts/memory/generate-context.ts`, and `runtime/lib/resume/resume-ladder.ts`'s handover-versus-continuity comparison and thin-continuity fallback. No change to the trigger-index generator's own algorithm (that is Phase 3's surface).

**Dependencies**:
- None on Phase 3's exclusion/coverage work, though both phases touch the trigger-index generator's callers and should be reviewed together before either closes.

**Deliverables**:
- A save-time staleness check (or cheap regeneration) comparing the packet's current trigger phrases against the committed index.
- A resume-ladder change that ranks validated, packet-bound continuity over an unbound newer handover.
- A resume-ladder change that rejects a malformed thin-continuity record outright instead of falling back to an unvalidated manual field extraction.
- Tests for each.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
**Problem A - save completes without proving index freshness.** `scripts/core/workflow.ts:1578-1587` logs `'Trigger index: run node .opencode/skills/system-spec-kit/scripts/retrieval/generate-trigger-index.mjs when trigger phrases changed'` as its entire connection between a canonical save and the trigger index - a reminder string, not a check. The save (`scripts/memory/generate-context.ts` through `runWorkflow`) can complete successfully while the committed `runtime/data/trigger-index.json` still reflects the packet's phrases from before this save, so a `/memory:search` lookup immediately after a completed save can miss content the save just wrote.

**Problem B - resume prefers freshness over validation.** `runtime/lib/resume/resume-ladder.ts:632-663` (`parseContinuitySignal`) calls `readThinContinuityRecord`, and when that strict validation fails (a malformed `session_dedup.fingerprint`, an out-of-shape `session_id`, or any of the other `MEMORY_0NN` errors it can raise), the function does not return `null` - it falls through to a second, manual field-extraction pass over the raw frontmatter block (`extractContinuityField` for `packet_pointer`, `last_updated_at`, `last_updated_by`, `recent_action`, `next_safe_action`) that skips every validation `readThinContinuityRecord` just failed. Separately, `resume-ladder.ts:587` (`parseHandoverSignal`) builds a resume signal from `handover.md` with no packet-identity or content-fingerprint binding to the resolved spec folder at all. At line 1063, when both a handover signal and a continuity signal exist, `const primary = continuitySignal.updatedAtMs > handoverSignal.updatedAtMs ? continuitySignal : handoverSignal` picks whichever is newer by timestamp alone - an unbound, unvalidated handover with a later `last_updated_at` wins over a validated, packet-bound continuity record every time.

### Purpose
A completed save either proves the trigger index reflects the packet's current phrases or reports it stale; resume ranks a validated, packet-bound continuity signal ahead of a merely-newer unbound handover; and a thin-continuity record that fails strict validation is rejected outright rather than partially trusted through the manual fallback.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- After a canonical save completes, compare the saved packet's `trigger_phrases` (frontmatter) against what `runtime/data/trigger-index.json` currently records for that packet, and either report the delta as a staleness warning or trigger a regeneration when it is cheap enough to do inline - the decision between "warn" and "auto-regenerate" is this phase's to make and record.
- Change `parseContinuitySignal`'s fallback (`resume-ladder.ts:636-663`) so a `readThinContinuityRecord` failure returns `null` (no continuity signal) instead of a manually-extracted, unvalidated one - the resume ladder should fall through to the next tier (spec-document signal) rather than trust malformed continuity.
- Change the handover-versus-continuity comparison (`resume-ladder.ts:1063`) so a validated, packet-bound continuity signal is preferred over an unbound handover signal regardless of which is textually newer, unless the handover itself can be shown to carry the same packet identity and a fingerprint that verifies against the resolved folder.
- Add resume-ladder tests: a malformed thin-continuity record no longer contributes a signal; a newer unbound handover no longer outranks a validated continuity record; a handover that does carry a matching packet pointer and passes fingerprint verification is still allowed to win on freshness.
- Add a workflow test: a save with an unchanged trigger-index versus a save that introduces a new trigger phrase, asserting the staleness signal fires only in the second case.

### Out of Scope
- The trigger-index generator's own corpus/exclusion algorithm - covered by Phase 3.
- Changing `handover.md`'s document shape or the fields the resume ladder reads from it - only the trust ranking relative to continuity changes.
- Auto-regenerating the trigger index on every save unconditionally, if the cost is judged too high during planning - this phase records that decision rather than presupposing it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/core/workflow.ts` | Modify | Replace the reminder-only log at lines 1578-1587 with an actual staleness check (or inline regeneration) against `runtime/data/trigger-index.json` |
| `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Modify | Surface the staleness result in the save's own output, if the check lives in the workflow layer |
| `.opencode/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts` | Modify | `parseContinuitySignal`'s fallback (lines 632-663) rejects a failed `readThinContinuityRecord` outright; the line-1063 comparison prefers validated packet-bound continuity over an unbound newer handover |
| A resume-ladder test suite (new or existing under `runtime/tests/`) | Modify | Cases for malformed-record rejection, unbound-handover deprioritization, and bound-handover freshness win |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A completed canonical save reports whether the committed trigger index reflects the packet's current `trigger_phrases`, instead of only logging a manual-regeneration reminder |
| REQ-002 | `parseContinuitySignal` returns no signal (not a manually-extracted one) when `readThinContinuityRecord` fails strict validation |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The resume ladder prefers a validated, packet-bound continuity signal over an unbound handover signal, regardless of which document's timestamp is later |
| REQ-004 | A handover signal that does carry a matching packet pointer and a verifying fingerprint is still eligible to win on freshness against continuity - the fix narrows trust, it does not disable handover-based resume entirely |
| REQ-005 | Tests cover: malformed thin-continuity rejection, unbound-newer-handover deprioritization, and bound-handover freshness win; plus a workflow test for the save-time staleness signal firing only when trigger phrases actually changed |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Saving a packet whose `trigger_phrases` changed since the last trigger-index regeneration produces a visible staleness signal in the save's own output; saving a packet with unchanged phrases produces none.
- **SC-002**: A resume-ladder unit test constructs a malformed `session_dedup.fingerprint` in `implementation-summary.md` and confirms no continuity signal reaches the ladder's comparison step.
- **SC-003**: A resume-ladder unit test constructs a `handover.md` newer than `implementation-summary.md` with no packet-pointer binding, and confirms the continuity signal still wins; a second test gives the handover a matching packet pointer and verifying fingerprint and confirms it can then win on freshness.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Auto-regenerating the trigger index on every save could be too expensive for a frequently-saved packet | Med | This phase measures `generate-trigger-index.mjs`'s wall-clock cost (already touched by Phase 3) before deciding warn-vs-regenerate; a warn-only fallback is always safe to ship first |
| Risk | Narrowing handover trust could break an existing resume flow that relies on handover.md being authoritative when continuity is absent | Med | REQ-004 keeps handover eligible to win when continuity is missing entirely or when the handover itself verifies against the resolved packet; only the "newer-but-unbound-beats-validated" case is closed |
| Dependency | Phase 3's trigger-index coverage decision may change which packets and phrases the index tracks, affecting what "current" means for the staleness check | Low | Land Phase 3 first or coordinate the staleness check against Phase 3's final corpus scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The save-time staleness check adds no more than one read of `runtime/data/trigger-index.json` and one comparison against the packet's own frontmatter - no full corpus re-walk unless the decision is "auto-regenerate".
- **NFR-P02**: The resume-ladder changes add no new filesystem read beyond what `parseHandoverSignal`/`parseContinuitySignal` already perform.

### Security
- **NFR-S01**: No new environment variable or credential surface.
- **NFR-S02**: The fingerprint verification added for handover eligibility (REQ-004) reuses the existing `buildContinuityFingerprint`/`readStableMarkdownDocument` machinery, not a new hashing scheme.

### Reliability
- **NFR-R01**: A missing or unreadable `runtime/data/trigger-index.json` at save time degrades to the current reminder-only behavior, not a save failure.
- **NFR-R02**: Rejecting a malformed thin-continuity record must not throw - the resume ladder falls through to the next tier (spec-document signal) exactly as it already does for a missing `implementation-summary.md`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a packet with no `trigger_phrases` in its frontmatter produces no staleness signal (nothing to compare).
- Maximum length: a packet whose phrases changed by one word still triggers the staleness signal - the comparison is set-equality, not a fuzzy diff.
- Invalid format: a `runtime/data/trigger-index.json` that fails to parse degrades to the reminder-only behavior (NFR-R01), not a crash.

### Error Scenarios
- External service failure: not applicable - no network call.
- Network timeout: not applicable.
- Concurrent access: two saves to different packets do not race on the shared trigger-index read, since this phase only reads it at save time and does not write it unless the "auto-regenerate" branch is chosen.

### State Transitions
- Partial completion: a save that fails mid-write never reaches the staleness check, matching the existing workflow's step ordering.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two independent seams (save-time staleness, resume-ladder trust ranking) in three files |
| Risk | 10/25 | Resume-ladder behavior is load-bearing for session continuity; both changes narrow trust rather than removing a path outright, which bounds the regression surface |
| Research | 3/20 | Both seams were confirmed by direct source reading and exact line citations before this spec was written |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should a stale trigger index at save time warn (current default-safe choice) or trigger inline regeneration? This spec recommends warn-first, with auto-regenerate as a follow-up once Phase 3 confirms the generator's wall-clock cost is acceptable to run on every save.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
