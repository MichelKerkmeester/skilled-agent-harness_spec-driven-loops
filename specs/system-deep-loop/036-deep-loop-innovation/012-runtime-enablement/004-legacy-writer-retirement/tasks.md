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
    last_updated_at: "2026-08-19T22:05:00Z"
    last_updated_by: "claude"
    recent_action: "Inventoried direct-append paths and built the detection guard, proven on a real append"
    next_safe_action: "Operator decision on the missing flip transitions"
    blockers:
      - "Removing the write instruction now would leave agents no sanctioned path"
      - "No mode is on ledger authority, so the guard stays inert"
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/check-direct-append.cjs"
    completion_pct: 50
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
- [ ] **T-002** Capture, per mode, the current contents of every manifest-named legacy file. [BLOCKED: capturing each mode's manifest-named legacy files needs a run of that mode; no mode is enabled and the files are not produced]
- [x] **T-003** Capture authority record bytes for all seven modes. [EVIDENCE: `scratch/authority-unchanged.md` — all 8 modes of the frozen order absent on disk, so each is the default `legacy_authoritative`]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] **T-004** Remove direct-append instructions from every mode's protocol documents. [BLOCKED: removing the instruction while legacy is still the only authority would leave agents with no sanctioned write path. The additive `state_write_protocol` declaration is the non-destructive half and exists on 2 of 10 files]
- [x] **T-005** Remove or neutralise each executable direct-append path; record per path which and why. [EVIDENCE: vacuous — a tree-wide search over `*.ts`, `*.cjs`, `*.mjs` and `*.js` finds `0` executable direct-append paths, so there is nothing to remove or neutralise; see `scratch/inventory.md`. The writes are agent-performed from prose, not code]
- [x] **T-006** Add the enforcement guard that fails a post-retirement direct append. [EVIDENCE: `scripts/check-direct-append.cjs` compares the legacy file's sha256 against the gateway watermark's `output_digest`, and is inert unless the mode reads `new_authoritative_reversible`]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T-007** Re-run tree-wide searches; confirm nothing remains, including untouched files. [PARTIAL: the tree-wide search ran and is recorded in `scratch/inventory.md`. It cannot confirm nothing remains, because the instructions remain by design until the flip]
- [x] **T-008** Attempt a real direct append; confirm the guard fires. [EVIDENCE: a real `appendFileSync` onto a gateway-published file is DETECTED — exit 2, `DIRECT_APPEND_DETECTED`. Proven by performing one, not by inspection; neutering the digest comparison makes the same append pass undetected]
- [ ] **T-009** [P] Run each mode; confirm every manifest-named legacy file exists and is current versus T-002. [BLOCKED: needs a mode whose writer has been retired; none has]
- [ ] **T-010** [P] Run every consumer of every legacy file; record exit statuses. [PARTIAL: all 7 consumer scripts were spawned during the whole-system gate and their exit codes recorded, which proves reachability only]
- [x] **T-011** [P] Diff all seven authority records against T-003. [EVIDENCE: `scratch/authority-unchanged.md` — the authority root still holds only its `README.md`, so no record was written by this phase]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] **T-012** Full suite re-run and reported as a delta against a captured baseline. [NOT RUN: the full suite takes over two hours and this phase adds one script and one test file. The targeted suite runs `6 passed`, and the guard was negative-controlled; a full delta is owed before this phase can be called done]
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
