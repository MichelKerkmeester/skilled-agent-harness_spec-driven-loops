---
title: "Implementation Summary"
description: "A lane that records each iteration twice now validates; the gateway-written copy is retained and the references name the gateway."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-fanout-write-containment-hardening/002-iteration-record-dedupe"
    last_updated_at: "2026-09-14T08:24:16Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Collapsed duplicate iteration records and corrected the references"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-iteration-record-dedupe"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-iteration-record-dedupe |
| **Completed** | 2026-09-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

A completed lane is no longer rejected because its state log holds each iteration twice. The forced-depth validator in `runtime/scripts/fanout-run.cjs` (`retainIterationRecords`, `forcedDepthIterationViolation`) collapses repeated iteration numbers to one record, keeping the copy that carries the gateway's route-proof fields, and only then checks the set against 1..cap. A genuine gap and a duplicate iteration file on disk still fail. The four deep-research reference lines that told the leaf to append to the log directly now name the append gateway as the only path in.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max through the gateway on cli-pi with a brief naming the five files and the gate; the orchestrator fixed one further reference line the delegate flagged outside its list, reviewed the diff, and ran the whole deep-loop suite before committing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Tolerate duplicates in the validator | A contract two independent models broke is not one the runner should depend on |
| Prefer the route-proof copy | It is the gateway's record, which the reducer trusts |
| Keep duplicate files on disk fatal | An extra artifact is a different failure from one artifact recorded twice |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New tolerated-duplicate test against unmodified validator | FAIL as expected at the null assertion |
| `fanout-run.vitest.ts` plus typecheck | PASS, exit 0, 140 tests |
| Replay of retained LUNA and GLM lineages | null at cap 3 for both |
| Full deep-loop suite | `npm test` in the runtime: 156 files, 2659 passed, 7 skipped, exit 0, 1259 s |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Unrouted duplicates.** When no copy carries route-proof fields the first copy is retained; nothing on disk says which writer produced it.
<!-- /ANCHOR:limitations -->

---


