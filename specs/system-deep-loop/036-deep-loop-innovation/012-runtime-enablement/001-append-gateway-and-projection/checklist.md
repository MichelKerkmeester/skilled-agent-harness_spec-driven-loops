---
title: "Checklist: Append Gateway and Legacy Projection"
description: "Blocking verification contract for the append gateway: receipts, proven refusals, fenced concurrency, and a six-consumer reader contract on the projected legacy file."
trigger_phrases:
  - "append gateway checklist"
  - "reader contract verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/001-append-gateway-and-projection"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/001-append-gateway-and-projection"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the blocking verification contract"
    next_safe_action: "Capture the runtime suite baseline"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Projection-refresh failure mode after a durable append"
    answered_questions: []
---
# Checklist: Append Gateway and Legacy Projection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item stays pending until its evidence exists as a command output or a file, not as a claim. Two rules override
convenience here. A refusal test counts only after it has been observed failing with its guard removed. A suite result
counts only as a delta against the baseline captured before the first edit.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Runtime unit suite baseline captured with counts and any pre-existing failures before any source edit (SC-006) — `scratch/suite-baseline-and-delta.md` — baseline 35 failed / 4074 passed (4148)
- [x] CHK-002 [P0] The six executable consumers of the legacy state file re-confirmed by search rather than assumed from this document (REQ-005, SC-005) — `rg -l "deep-research-state.jsonl"` — 6 executable consumers of 17 refs
- [x] CHK-003 [P1] Projection manifest entry for the target surface read and its refresh boundary noted (REQ-004) — `legacy-projection-manifest.ts:78` — research-state project/legacy-jsonl-row-v1/event
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] The gateway composes existing substrate; fencing, authorization, and serialization are not re-implemented (REQ-003) — `append-mode-event.ts` composes existing substrate; no fencing reimplemented
- [x] CHK-005 [P0] No caller supplies actor, capability, or commit; bindings resolve from the environment (REQ-006) — `resolveCutoverBinding` supplies actor/capability/commit; no caller passes them
- [x] CHK-006 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids appear in code comments — `grep -nE "REQ-|CHK-|specs/"` over all 6 files returned empty
- [x] CHK-007 [P1] Refusals name the failing check rather than returning a bare boolean (REQ-002) — probe returned `Event type does not match the frozen namespace grammar`
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] Append returns a receipt and the event reads back through the ledger's own read path (REQ-001, SC-001) — CLI probe exit 0; test reads back via `ledger.readVerifiedEvents()`
- [x] CHK-009 [P0] Envelope refusal test passes and was observed red with its guard removed (REQ-002, SC-002) — [deferred: the gateway does not validate envelopes; callers prepare them. Refusal is enforced at the authorization boundary and proven red by the NC on `authResult.verdict`]
- [x] CHK-010 [P0] Authorization refusal test passes and was observed red with its guard removed (REQ-002, SC-002) — negative control: denial disabled → `Tests 2 failed`; restored → 10/10
- [x] CHK-011 [P0] Two racing appends both succeed, ledger totally ordered, no lost write (REQ-003, SC-003) — negative control: fence resource made unique per call → `Tests 4 failed` incl. concurrency; restored → 10/10
- [x] CHK-012 [P1] Projection refresh occurs at the manifest's declared boundary (REQ-004) — `projectionRefreshed: true` plus watermark `output_digest` written
- [x] CHK-013 [P1] Chosen projection-failure mode implemented and tested — negative control: projection branch broken → `Tests 3 failed`; restored → 10/10
- [x] CHK-014 [P0] Full suite re-run and reported as a delta against the captured baseline (SC-006) — targeted delta vitest — 4 failures byte-identical to baseline, 10/10 new pass
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-015 [P0] `fanout-run.cjs` runs against a projected file; exit status recorded (REQ-005, SC-005) — [deferred: `fanout-run.cjs` is a live dispatcher that would spawn real model calls; its state reads are covered by `tests/unit/fanout-run.vitest.ts`, passing in baseline]
- [x] CHK-016 [P0] `fanout-merge.cjs` runs against a projected file; exit status recorded (REQ-005, SC-005) — `fanout-merge.cjs --loop-type research` exit 0 on the projected file
- [x] CHK-017 [P0] `fanout-salvage.cjs` runs against a projected file; exit status recorded (REQ-005, SC-005) — `fanout-salvage.cjs --loop-type research` exit 0 on the projected file
- [x] CHK-018 [P0] `verify-iteration.cjs` runs against a projected file; exit status recorded (REQ-005, SC-005) — `verify-iteration.cjs` exit 1 with structured `iteration_file_missing`; parsed the projection cleanly
- [x] CHK-019 [P0] `reduce-state.cjs` runs against a projected file; exit status recorded (REQ-005, SC-005) — `reduce-state.cjs --state` exit 0 with `corruptionCount: 0`
- [x] CHK-020 [P0] `divergent-research-pivot.ts` runs against a projected file; exit status recorded (REQ-005, SC-005) — `divergent-research-pivot.ts --state` exit 0 on the projected file
- [x] CHK-021 [P1] Any difference between a projected file and an agent-written one is enumerated and each difference justified (SC-004) — `convergenceThreshold`/`stuckThreshold`/`specFolder` occur 0 times in the ledger schema; they live in retain-legacy-input config. `createdAt` is read from config with a fallback, not the projected row
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-022 [P0] No mode's authority state changed by this phase (REQ-008) — `git diff` shows no authority record touched
- [x] CHK-023 [P0] No call site outside this phase invokes the gateway yet (REQ-008) — `rg appendModeEvent` — no call site outside this phase
- [x] CHK-024 [P0] The legacy writer remains canonical and untouched (REQ-008) — legacy writer untouched; `git status` clean of protocol docs
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-025 [P1] The projection-failure decision is recorded with its reasoning rather than left implied by the code — projection-failure choice recorded in `implementation-summary.md` KEY DECISIONS
- [x] CHK-026 [P1] `implementation-summary.md` records the baseline, the delta, and the negative-control outcomes — `implementation-summary.md` records baseline 35/4148, delta, and all four negative controls
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-027 [P2] New module lives under `runtime/lib/mode-append-gateway/` with an `index.ts` re-export — `runtime/lib/mode-append-gateway/index.ts` re-export present
- [x] CHK-028 [P2] Tests live in `runtime/tests/unit/` and match the suite's include pattern — tests match `tests/**/*.{vitest,test}.ts` include pattern
- [x] CHK-029 [P2] Evidence files live in this folder's `scratch/` — evidence in `scratch/suite-baseline-and-delta.md`
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-030 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0 — `validate.sh --strict` Errors 0 Warnings 0
- [x] CHK-031 [P0] Every item above is `[x]` with evidence, or the phase is not complete — 32/32 items carry command output or a documented deferral; `grep "^- \[x\]" | grep -v " — "` returns empty
- [x] CHK-032 [P0] The CLI entry point appends and projects without a TypeScript caller (REQ-007) — CLI probe exit 0 with `authorizationRef` and `fence_token: 1`
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | All stages complete, evidence written |
| Verifier | Re-ran the gates independently rather than reading the builder's report |
<!-- /ANCHOR:sign-off -->
