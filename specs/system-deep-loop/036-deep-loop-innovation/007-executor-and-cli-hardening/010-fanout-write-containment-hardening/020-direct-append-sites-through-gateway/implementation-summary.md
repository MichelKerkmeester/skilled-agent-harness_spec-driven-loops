---
title: "Implementation Summary"
description: "Every direct state-log append in the deep-loop YAMLs now goes through the gateway under a canonical stem, the exemptions are gone, and a projection refresh cannot drop a row."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/020-direct-append-sites-through-gateway"
    last_updated_at: "2026-09-15T01:34:53Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Routed every direct append through the gateway and filled the packet docs"
    next_safe_action: "Commit once the full suite exits zero"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-020-direct-append-sites-through-gateway"
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
| **Spec Folder** | 020-direct-append-sites-through-gateway |
| **Completed** | 2026-09-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

No deep-loop command YAML writes a state log outside the gateway any more. The review and research ledger schemas under `runtime/lib/deep-review-ledger-schema/` and `runtime/lib/deep-research-ledger-schema/` gained twelve canonical stems with closed payload rules and two field kinds, the reducers route them without changing any projection, and every direct site in the four YAMLs, the review migration marker, recovery baseline, iteration-error and claim-adjudication records and the research run-now and synthesis records, now stages its record and calls `runtime/scripts/append-mode-event.cjs`. The checker declarations carry no exemptions and it reports zero violations across all ten assets. Survival tests append the migrated events and one more and find them intact, while the negative control shows a directly written row dropped by the next refresh, the defect this phase closes. Executing every record shape end to end caught one rejection the harness alone would have missed: a legacy artifact name with a leading dot failed the review schema's token pattern, so the artifact fields are declared as file-name JSON and the production literal is pinned in the test.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash at max through the gateway on cli-pi. The delegate extended the allowed file list to the reducer packages and schema test fixtures because the exhaustive routing switches break the typecheck otherwise, reported that as a deviation, ran every record shape against the live gateway, and ran the whole suite itself. The orchestrator reviewed the diffs, reran the checker, the contract and gateway tests and typecheck, and ran the whole suite again before committing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A canonical stem per event rather than a generic passthrough | The ledger's closed payload rules are what make the projection trustworthy |
| Declare artifact-name fields as JSON | They are file names, not system tokens; the token pattern rejected a real production value |
| Leave append_jsonl directives alone | They are workflow directives the command runtime routes; none is a direct append |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Append-site checker | ok, scanned 10, zero violations, zero exemptions |
| Contract, checker and gateway tests plus typecheck | PASS, exit 0, 68 tests |
| Every record shape against the live gateway | one rejection found and fixed; all pass |
| Full deep-loop suite | `npm test` in the runtime: 152 files, 2644 passed, 8 skipped, exit 0, 1291 s |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **append_jsonl directives.** These remain workflow directives; the in-repo tree has no executor that routes them through the gateway, which is the command runtime's contract, not this phase's.
<!-- /ANCHOR:limitations -->

---


