---
title: "Implementation Summary: Memory-Index Scan-Path Same-Path Dedup Gap"
description: "Investigated a suspected memory-index duplicate-row bug through two hypotheses, refuted both against real evidence, and landed the regression test the investigation produced. No confirmed code defect; no fix shipped."
trigger_phrases:
  - "memory scan dedup gap summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-memory-scan-dedup-gap"
    last_updated_at: "2026-08-07T19:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Investigation closed, regression test landed, no fix warranted"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/tests/memory-save-supersede-reindex.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-033-memory-scan-dedup-gap"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-memory-scan-dedup-gap |
| **Completed** | 2026-08-07 — investigation closed, no fix |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A suspected memory-index bug turned out not to be one — at least not the one, or the two, hypotheses this investigation could confirm. What shipped is a genuine regression test covering a scenario that had no coverage before, and a fully documented chain of evidence for the next person who finds a fresh duplicate-row pair.

### The chase

It started from a real observation: two rows in `memory_index` for the same file, byte-identical content, one tagged `deprecated` and one `normal`, 7 minutes apart. The first hypothesis was a same-path insert branch in `memory-save.ts` that appeared to conflate "no prior row" with "prior row found, unchanged" into one plain-INSERT path. A controlled test reproducing exactly that scenario — index a file, mark its row `deprecated`, re-index unchanged content through the real production entry point — was written and run against current `HEAD` before touching any source, per this packet's own confirm-first design.

It passed. Not failed — passed. The hypothesis was wrong. An earlier gate (`checkExistingRow`, called before the branch this investigation had targeted) already catches this case correctly and always had.

The second hypothesis was a cross-process race: `checkExistingRow` runs outside any database transaction, so two concurrent indexing passes for the same file could both read stale state. This session's own ~3-hour reindex ran alongside a shared daemon and other live sessions for extended stretches — exactly the condition a race needs. But `memory_history`'s audit trail for the one concrete reproduction told a cleaner story: the deprecated row has an `UPDATE` event at the exact same timestamp the new row has its `ADD` event. That's the signature of the already-tested-and-correct "content genuinely changed" branch firing, not a race. The most likely explanation: the file was edited and reverted within that 7-minute window, and today's byte-identical hashes are just where it landed, not evidence anything went wrong.

### What actually landed

One new test in `memory-save-supersede-reindex.vitest.ts`, sibling to the existing "supersedes a changed doc" test, covering the case that test didn't: unchanged content re-scanned against an already-deprecated predecessor stays at exactly one row.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Confirm-first, exactly as `plan.md` specified before any hypothesis was chased: write the controlled repro, run it against real `HEAD`, let the result — not a preference for having found a bug — decide whether to proceed. It didn't confirm. The second hypothesis got the same treatment: checked against real audit-trail data (`memory_history` timestamps) rather than argued from code reading alone. Neither survived. `tsc --noEmit` clean throughout since no source file outside the test suite was ever touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Stop at the plan's own designed stop condition instead of pushing through to a fix anyway | The plan explicitly said "if it does NOT fail, the hypothesis is wrong and this plan stops here for re-diagnosis before touching any source" — honoring that when it actually fired is the entire point of writing it down in advance |
| Chase a second hypothesis (TOCTOU race) instead of closing immediately after the first refutation | The production duplicate was real and still unexplained after the first test passed; closing without at least one more concrete attempt would have left a genuine observation unaddressed |
| Close without a fix once the second hypothesis also lacked confirming evidence, rather than shipping a "fix" for an unconfirmed cause | A fix with no confirmed defect behind it is a coin flip on a shared production database — the honest move is to say so and keep the regression coverage the investigation did produce |
| Keep the new test even though it didn't reproduce the bug | It closes a genuine, previously-uncovered scenario (unchanged re-scan against a tier-exempted predecessor) that is correct today but had zero test coverage proving that before this packet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New regression test (`does not mint a duplicate row when unchanged content is re-scanned against an already-deprecated predecessor`) | PASS |
| Pre-existing sibling test (`supersedes a changed doc by deprecating the predecessor...`) | PASS, unmodified — confirms no regression from adding the new test to the same file |
| `tsc --noEmit` on `mcp-server` | PASS, exit 0, no output |
| `memory_history` audit trail cited for the closing conclusion | Confirmed directly via a read-only query against the live database, not asserted from memory |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The edit-then-revert explanation is the most parsimonious account of the evidence available, not a proof.** No git history was cross-checked against the exact 05:46:36-05:53:43 window on 2026-08-07 to directly confirm the file was actually edited then. If a future session finds a *fresh* duplicate-row pair, re-run this packet's methodology against it before assuming the same explanation applies — this conclusion is specific to the one reproduction that was available, not a general proof that the mechanism can never produce a real duplicate.
2. **No corpus-wide cleanup was attempted.** Whatever duplicate-looking rows exist elsewhere in the live index were explicitly out of scope — some may be genuine edit-then-revert lineage (correct, not a bug), some may not be. Distinguishing them would need the same evidence-based approach this packet used, applied case by case, not a blind bulk operation.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
