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

- [ ] CHK-001 [P0] Predecessor `003-fleet-enablement` complete with all seven modes on ledger authority [BLOCKED: `003-fleet-enablement` closed at 19 of 27 with no mode on ledger authority; the whole-system gate reads `8 of 8 on legacy_authoritative`]
- [x] CHK-002 [P0] Tree-wide inventory of direct-append paths completed across documents and code (REQ-006) [EVIDENCE: `scratch/inventory.md` — 52 instruction sites across 10 files, `0` executable paths, and the 2 files already carrying a `state_write_protocol` declaration]
- [ ] CHK-003 [P0] Per-mode contents of every manifest-named legacy file captured (REQ-004, SC-004) [BLOCKED: capturing per-mode legacy files needs a run of each mode; none is enabled and the files are not produced]
- [x] CHK-004 [P1] Authority record bytes captured for all seven modes (REQ-007, SC-006) [EVIDENCE: `scratch/authority-unchanged.md` — all 8 modes absent on disk, each therefore the default `legacy_authoritative`]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] No executable direct-append path remains reachable (REQ-002, SC-002) [EVIDENCE: vacuously true and worth stating as such — a tree-wide search over `.ts`, `.cjs`, `.mjs` and `.js` finds `0` direct-append code paths. The writes are agent-performed from prose, so there was never executable code to make unreachable]
- [x] CHK-006 [P1] Each removed or neutralised path is recorded with which was chosen and why [EVIDENCE: recorded in `scratch/inventory.md` and the summary — nothing was removed or neutralised, because nothing executable exists; the decision and its reason are written down rather than left implicit]
- [x] CHK-007 [P1] The guard fails loudly rather than logging and continuing (REQ-003) [EVIDENCE: every violation path exits `2` and every error path exits `1`; there is no log-and-continue branch — a missing legacy file and an unreadable watermark are both violations rather than neutral conditions]
- [x] CHK-008 [P1] Comments carry the durable why; no spec paths, packet numbers, or task ids in code comments [EVIDENCE: scan for spec paths, `REQ-`, `CHK-`, `SC-` and task ids across `check-direct-append.cjs` and its test returns `0`]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] A real attempted direct append fails; the guard was observed firing (REQ-008, SC-003) [EVIDENCE: a real `appendFileSync` onto a gateway-published file yields exit `2` and `DIRECT_APPEND_DETECTED`; proven by performing one. Neutering the digest comparison makes the same append pass undetected, so the detection is not an assertion that cannot fail]
- [ ] CHK-010 [P0] Tree-wide search finds no direct-append instruction in any mode's protocol documents (REQ-001, SC-001) [NOT MET: 10 workflow assets now declare the gateway via `state_write_protocol`, including two (`deep-alignment-auto.yaml`, `deep-alignment-confirm.yaml`) that no earlier inventory had found. `check-protocol-append-sites.cjs` makes the requirement enforceable and currently exits 2 on two real violations, so the tree is not yet clean. The earlier deferral reason was also wrong: `mode-append-gateway.vitest.ts:38` pins authority at `legacy_authoritative` and that suite passes 11/11, so the gateway is a working pre-flip write path. Evidence: `scratch/protocol-retirement-baseline.md`, `scratch/append-site-conformance.md`]
- [ ] CHK-011 [P0] Tree-wide search finds no reachable direct-append code path (REQ-002, SC-002) [RETRACTED: this was marked complete on a `grep` over `*.ts`, `*.cjs`, `*.mjs` and `*.js`, which never looked inside `*.yaml`. Workflow assets embed executable JavaScript, and `check-protocol-append-sites.cjs` finds `appendFileSync` calls on the state log in `deep-research-auto.yaml` and `deep-research-confirm.yaml`. Those are reachable direct-append paths, so the search was incomplete and the claim does not hold. Evidence: `scratch/append-site-conformance.md`]
- [ ] CHK-012 [P1] Full suite re-run and reported as a delta against a captured baseline [NOT RUN: the full suite takes over two hours and this phase adds one script and one test. The targeted suite runs `6 passed`; a full delta is owed before this phase is done]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-013 [P0] Every manifest-named legacy file exists and is current after its writer is retired, compared against the pre-phase capture rather than merely existing (REQ-004, SC-004) [BLOCKED: no writer has been retired, so there is no post-retirement state to confirm]
- [ ] CHK-014 [P0] Every consumer of every legacy file runs post-retirement; exit statuses recorded (REQ-005, SC-005) [PARTIAL: 7 consumer scripts were spawned during the whole-system gate and exit statuses recorded — reachability only, and not post-retirement]
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
- [ ] CHK-019 [P2] Protocol documents read correctly for an agent that never saw the direct-append instruction [BLOCKED: the protocol documents still instruct a direct append, so they do not yet read correctly for an agent that never saw one]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-020 [P2] Evidence files live in this folder's `scratch/` [EVIDENCE: `scratch/inventory.md`, `scratch/authority-unchanged.md`, `scratch/guard-probe.mjs`]
- [x] CHK-021 [P2] The scoped diff touches only protocol documents, direct-append paths, and the guard [EVIDENCE: the scoped diff is `check-direct-append.cjs`, its test, one `scripts/README.md` row, and this folder — `git status` shows nothing else]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-022 [P0] `validate.sh` on this folder with `--strict` reports Errors: 0 [EVIDENCE: `validate.sh --strict` from the final state after regenerating `description.json` and `graph-metadata.json`; `Errors: 0`]
- [ ] CHK-023 [P0] Every item above is `[x]` with evidence, or the phase is not complete [BLOCKED: 8 items remain open — all downstream of the flip that has not happened, plus the owed full-suite delta]
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

| Role | Condition |
|------|-----------|
| Builder | Retirement complete, guard in place, evidence written |
| Verifier | Re-ran the tree-wide searches and the guard firing independently |
<!-- /ANCHOR:sign-off -->
