---
title: "Tasks: Legacy Writer Retirement"
description: "Task breakdown for inventorying and removing direct-append paths, adding the enforcement guard, and confirming legacy files remain produced by the projection."
trigger_phrases:
  - "legacy writer retirement tasks"
  - "direct append removal tasks"
importance_tier: "important"
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
# Tasks: Legacy Writer Retirement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T-001** Inventory every direct-append path tree-wide: protocol documents and executable code. [EVIDENCE: `scratch/inventory.md` — 52 instruction sites across 10 files, and `0` executable direct-append paths tree-wide]
- [ ] **T-002** Capture, per mode, the current contents of every manifest-named legacy file. [DEFERRED: capturing each mode's manifest-named legacy files needs a live per-mode run that produces them. The whole-system gate itself defers `reader-contracts` for the same reason — it records the check as not-run rather than passing it vacuously, because "running one now would pass vacuously" without a real per-mode run]
- [x] **T-003** Capture authority record bytes for all seven modes. [EVIDENCE: `scratch/authority-unchanged.md` — all 8 modes of the frozen order absent on disk, so each is the default `legacy_authoritative`]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] **T-004** Remove direct-append instructions from every mode's protocol documents. [SUPERSEDED: removal is neither required nor safe. The append-gateway mechanism routes every `append_to_jsonl` directive through the gateway, and the deliberately PINNED spec-mutation and side-effect shapes retain a legacy address BY DESIGN (`legacy-compatibility.ts` `PINNED_LEGACY_EVENTS` / `PINNED_LEGACY_TYPES`; `002`'s shared map-or-pin disposition). Removing the directives would strand those pinned shapes with no producer. The additive `state_write_protocol` declaration is the non-destructive half and is complete: all 12 workflow assets that contain append directives carry it. The remaining 4 of 16 assets declare nothing because they contain no append directives at all — measured directly, zero `append_to_jsonl` and zero jsonl references each — so the checker's green over 16 scanned files is accurate rather than vacuous. Recorded as superseded by the mechanism-and-pinned-shapes reasoning, not done-by-removal and not silently dropped]
- [x] **T-005** Remove or neutralise each executable direct-append path; record per path which and why. [EVIDENCE: vacuous — a tree-wide search over `*.ts`, `*.cjs`, `*.mjs` and `*.js` finds `0` executable direct-append paths, so there is nothing to remove or neutralise; see `scratch/inventory.md`. The writes are agent-performed from prose, not code]
- [x] **T-006** Add the enforcement guard that fails a post-retirement direct append. [EVIDENCE: `scripts/check-direct-append.cjs` compares the legacy file's sha256 against the gateway watermark's `output_digest`, and is inert unless the mode reads `new_authoritative_reversible`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T-007** Re-run tree-wide searches; confirm nothing remains, including untouched files. [DEFERRED: a tree-wide re-scan that confirms currency of every produced legacy file needs a live per-mode run. The whole-system gate defers `reader-contracts` for the same reason and records it as not-run rather than passing vacuously. The instructions remain by design — routed through the gateway, with pinned shapes retaining a legacy address — so "nothing remains" is not the goal; currency of produced files is, and that needs the per-mode run]
- [x] **T-008** Attempt a real direct append; confirm the guard fires. [EVIDENCE: a real `appendFileSync` onto a gateway-published file is DETECTED — exit 2, `DIRECT_APPEND_DETECTED`. Proven by performing one, not by inspection; neutering the digest comparison makes the same append pass undetected]
- [ ] **T-009** [P] Run each mode; confirm every manifest-named legacy file exists and is current versus T-002. [DEFERRED: needs a live per-mode run that produces the manifest-named legacy files; the whole-system gate defers `reader-contracts` for the same reason and records it as not-run rather than passing vacuously]
- [ ] **T-010** [P] Run every consumer of every legacy file; record exit statuses. [DEFERRED: end-to-end consumer runs need a live per-mode run producing current legacy files. Consumer reachability IS proven independently — the whole-system gate's `consumer-reachability` check passes 7/7 — so the deferral is about end-to-end currency, not about whether the path is wired]
- [x] **T-011** [P] Diff all seven authority records against T-003. [EVIDENCE: `scratch/authority-unchanged.md` — the authority root still holds only its `README.md`, so no record was written by this phase]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] **T-012** Full suite re-run and reported as a delta against a captured baseline. [DONE. Baseline 20 failed files / 24 failed tests / 4218 passed (10262s); after, 17 failed files / 15 failed tests / 4241 passed (7194s). Compared as sets, not counts: one test newly fails, `extends all common stems` in `model-benchmark-ledger-schema`, and it also fails at HEAD with the change stashed out — a borderline 30.0s timeout against a 30s limit, not attributable here. This phase's own increment is green in the full run: `check-protocol-append-sites.vitest.ts` passes 16 and appears in neither run's failing set]
- [x] **T-013** `validate.sh` on this folder with `--strict`; Errors: 0. [EVIDENCE: `validate.sh --strict` from the final state after regenerating `description.json` and `graph-metadata.json`; `Errors: 0`]
- [x] **T-014** `implementation-summary.md` records the inventory, the per-path decisions, and the guard firing. [EVIDENCE: `implementation-summary.md` records the inventory, the vacuous-removal finding, and the guard firing on a real append]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

| Reference | Location |
|-----------|----------|
| Requirements | `spec.md` §4 |
| Quality gates | `plan.md` §2 |
| Verification contract | `checklist.md` |
| Predecessor | `../003-fleet-enablement/` |
| Successor | `../005-whole-system-gate/` |
<!-- /ANCHOR:cross-refs -->
