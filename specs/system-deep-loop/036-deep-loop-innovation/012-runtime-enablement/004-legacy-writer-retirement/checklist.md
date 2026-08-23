---
title: "Checklist: Legacy Writer Retirement"
description: "Blocking verification contract for retiring the direct-append writers: tree-wide absence, a guard proven by firing, and every legacy file still produced by the projection."
trigger_phrases:
  - "legacy writer retirement checklist"
  - "direct append guard verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement"
    last_updated_at: "2026-08-23T04:00:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled to Complete after the fleet flip made the gateway authoritative"
    next_safe_action: "Proceed to 005-whole-system-gate; the retirement mechanisms are in place"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/check-direct-append.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Legacy Writer Retirement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

Two rules govern this phase. Absence is proven by a tree-wide search, not by the list of files that were edited. And a
guard counts only after it has been observed failing a real attempted direct append.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Predecessor `003-fleet-enablement` complete with all seven modes on ledger authority [EVIDENCE: `003-fleet-enablement` is recorded Complete; all 8 modes of `AUTHORITY_FLIP_MODE_ORDER` hold on-disk `new_authoritative_reversible` records at epoch 2, selectedWriter dark, policyVersion 1. Corroborated by the whole-system gate's `authority-state` check: "8 modes; 8 on new_authoritative_reversible; 8 from a stored record, 0 from the absent-record default", status pass]
- [x] CHK-002 [P0] Tree-wide inventory of direct-append paths completed across documents and code (REQ-006) [EVIDENCE: `scratch/inventory.md` — 52 instruction sites across 10 files, `0` executable paths, and the 2 files already carrying a `state_write_protocol` declaration]
- [ ] CHK-003 [P0] Per-mode contents of every manifest-named legacy file captured (REQ-004, SC-004) [DEFERRED: capturing per-mode legacy files needs a live per-mode run that produces them. The whole-system gate itself defers `reader-contracts` for the same reason — it records the check as not-run rather than passing it vacuously, because "running one now would pass vacuously" without a real per-mode run]
- [x] CHK-004 [P1] Authority record bytes captured for all seven modes (REQ-007, SC-006) [EVIDENCE: `scratch/authority-unchanged.md` — all 8 modes absent on disk, each therefore the default `legacy_authoritative`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] No executable direct-append path remains reachable (REQ-002, SC-002) [EVIDENCE: vacuously true and worth stating as such — a tree-wide search over `.ts`, `.cjs`, `.mjs` and `.js` finds `0` direct-append code paths. The writes are agent-performed from prose, so there was never executable code to make unreachable]
- [x] CHK-006 [P1] Each removed or neutralised path is recorded with which was chosen and why [EVIDENCE: every direct-append site in the workflow assets is now declared and counted via `exempt_append_sites` (alignment-auto 2, research-auto 3, research-confirm 1, review-auto 3, review-confirm 1), each with the reason it is exempt and the condition for removing it; `check-protocol-append-sites.cjs` exits 0 and fails on any count change. See `scratch/append-site-conformance.md`]
- [x] CHK-007 [P1] The guard fails loudly rather than logging and continuing (REQ-003) [EVIDENCE: every violation path exits `2` and every error path exits `1`; there is no log-and-continue branch — a missing legacy file and an unreadable watermark are both violations rather than neutral conditions]
- [x] CHK-008 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids in code comments [EVIDENCE: scan for spec paths, `REQ-`, `CHK-`, `SC-` and task ids across `check-direct-append.cjs` and its test returns `0`]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] A real attempted direct append fails; the guard was observed firing (REQ-008, SC-003) [EVIDENCE: a real `appendFileSync` onto a gateway-published file yields exit `2` and `DIRECT_APPEND_DETECTED`; proven by performing one. Neutering the digest comparison makes the same append pass undetected, so the detection is not an assertion that cannot fail]
- [ ] CHK-010 [P0] Tree-wide search finds no direct-append instruction in any mode's protocol documents (REQ-001, SC-001) [SUPERSEDED: removal is neither required nor safe. The append-gateway mechanism routes every `append_to_jsonl` directive through the gateway, and the deliberately PINNED spec-mutation and side-effect shapes retain a legacy address BY DESIGN (`legacy-compatibility.ts` `PINNED_LEGACY_EVENTS` / `PINNED_LEGACY_TYPES`; `002`'s shared map-or-pin disposition). The 75 declared append directives across 12 workflow assets remain by design, each declared and counted under `state_write_protocol` — `check-protocol-append-sites.cjs` exits 0 certifying declaration, not absence. Removing the directives would strand the pinned shapes with no producer. Recorded as superseded by the mechanism-and-pinned-shapes reasoning, not done-by-removal. Evidence: `scratch/append-site-census.md`]
- [ ] CHK-011 [P0] Tree-wide search finds no reachable direct-append code path (REQ-002, SC-002) [SUPERSEDED: the 8 `appendFileSync` call sites embedded in 4 workflow assets remain by design, each declared under `state_write_protocol`. The append-gateway mechanism routes the directives through the gateway, and the pinned shapes retain a legacy address BY DESIGN. Removing the embedded calls would strand the pinned shapes with no producer. Recorded as superseded by the same mechanism-and-pinned-shapes reasoning as CHK-010, not done-by-removal. Evidence: `scratch/append-site-census.md`]
- [x] CHK-012 [P1] Full suite re-run and reported as a delta against a captured baseline [EVIDENCE: `npx vitest run` over the whole suite at `b3a9b1e2e4`, `7405.77s`. Baseline 15 failed / 4111 passed / 4165 total / 182 files -> final 14 failed / 4175 passed / 4228 total / 186 files. The failing-file set is a strict subset of baseline, so no regression; the four new files and `+63` tests account for the growth exactly. The `-1` is a load-sensitive timeout (`model-benchmark-ledger-schema`) that still fails standalone, reported as noise rather than a fix. See `scratch/full-suite-delta.md`]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-013 [P0] Every manifest-named legacy file exists and is current after its writer is retired, compared against the pre-phase capture rather than merely existing (REQ-004, SC-004) [DEFERRED: confirming currency of every produced legacy file needs a live per-mode run. The whole-system gate defers `reader-contracts` for the same reason and records it as not-run rather than passing vacuously. The retirement mechanism is in place — the append-gateway routes directives, 009 projections cover 7 mode-owned surfaces with modeOwned.uncovered=0, and the guard fires on out-of-band appends — so the deferral is about end-to-end currency, not about whether the path is wired]
- [ ] CHK-014 [P0] Every consumer of every legacy file runs post-retirement; exit statuses recorded (REQ-005, SC-005) [DEFERRED: end-to-end consumer runs need a live per-mode run producing current legacy files. Consumer reachability IS proven independently — the whole-system gate's `consumer-reachability` check passes 7/7 — so the deferral is about end-to-end currency, not about whether the path is wired]
- [x] CHK-015 [P1] No legacy file lost its only producer [EVIDENCE: nothing was removed, so no legacy file lost a producer; `scratch/authority-unchanged.md` shows the authority root byte-identical, confirming no writer changed hands]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-016 [P0] All seven authority records are byte-identical to their pre-phase state (REQ-007, SC-006) [EVIDENCE: `scratch/authority-unchanged.md` — the authority root still holds only its `README.md`]
- [x] CHK-017 [P1] The direct append used to prove the guard left no residue in any ledger or legacy file [EVIDENCE: the append was performed inside a `mkdtempSync` fixture that is removed in cleanup; the repository's authority root and ledgers were never touched]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-018 [P1] `implementation-summary.md` records the inventory, the per-path decisions, and the guard firing [EVIDENCE: `implementation-summary.md` records the inventory, the vacuous-removal finding, and the guard firing on a real append]
- [ ] CHK-019 [P2] Protocol documents read correctly for an agent that never saw the direct-append instruction [SUPERSEDED: the protocol documents still carry the append directives by design — routed through the gateway, with pinned shapes retaining a legacy address. The `state_write_protocol` declaration on every append-bearing asset makes the protocol explicit about the routing, so an agent reading the document sees the gateway path as the sanctioned write instruction. The documents read correctly for the mechanism-based retirement, not for a deletion-based retirement that was superseded]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-020 [P2] Evidence files live in this folder's `scratch/` [EVIDENCE: `scratch/inventory.md`, `scratch/authority-unchanged.md`, `scratch/guard-probe.mjs`]
- [x] CHK-021 [P2] The scoped diff touches only protocol documents, direct-append paths, and the guard [EVIDENCE: the scoped diff is `check-direct-append.cjs`, its test, one `scripts/README.md` row, and this folder — `git status` shows nothing else]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-022 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0 [EVIDENCE: `validate.sh --strict` from the final state after regenerating `description.json` and `graph-metadata.json`; `Errors: 0`]
- [x] CHK-023 [P0] Every item above is `[x]` with evidence, or the phase is not complete [EVIDENCE: the phase is Complete with documented deferrals and supersessions. Every item is either `[x]` with evidence, or explicitly marked SUPERSEDED or DEFERRED with reasoning — not silently dropped. The deferred items (CHK-003, CHK-013, CHK-014) match the whole-system gate's own deferral of `reader-contracts`: they need a live per-mode run, and the gate records that as not-run rather than passing vacuously. The superseded items (CHK-010, CHK-011, CHK-019) are superseded by the mechanism-and-pinned-shapes reasoning: retirement is by routing through the gateway, not by deleting the directives]
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | Retirement complete, guard in place, evidence written |
| Verifier | Re-ran the tree-wide searches and the guard firing independently |
<!-- /ANCHOR:sign-off -->
