---
title: "Verification Checklist: Phase State and Metadata Reconciliation"
description: "Completed verification gates for status consistency, parent map uniqueness, generated metadata freshness, and recursive strict validation."
trigger_phrases:
  - "phase state reconciliation checklist"
  - "metadata reconciliation verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/008-phase-state-reconciliation"
    last_updated_at: "2026-08-05T00:23:03Z"
    last_updated_by: "pi-phase-state-reconciliation"
    recent_action: "Completed status, evidence, metadata, and scope verification"
    next_safe_action: "Review freshness caveat"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "../spec.md"
      - "../graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:f8c792563fa57a89c3e8d90ed649752e2f29aa951cbe19c8a99477fd5c313f9e"
      session_id: "2026-08-04-cli-038-008-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All nine phase children have evidence-supported Complete status and current generated metadata."
      - "The package-root corpus remains an explicit exit-1 deferral; focused evidence is green."
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase State and Metadata Reconciliation

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or receive user approval |
| **[P2]** | Optional | Can defer only with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Packet-wide status inventory covers phases 001-009 across all status surfaces. [TESTED: final status matrix]
  - [EVIDENCE: the recorded Node status-matrix command prints `STATUS_MATRIX=9/9 COMPLETE` and exits 0 after cross-reading all nine child status surfaces.]
- [x] CHK-002 [P0] Pre-change metadata copies and diff baseline are captured for rollback. [TESTED: baseline validator and status snapshot]
  - [EVIDENCE: baseline `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/hooks/007-fable-governor-pi-hook --strict` reported metadata-integrity failures before repair; the pre-change status snapshot and packet file hashes were captured outside the repository.]
- [x] CHK-003 [P1] Phase 007 evidence inventory status is recorded with its owner and revisit trigger. [TESTED: Phase 007 evidence ledger]
  - [EVIDENCE: `007-dispatch-validation-evidence/evidence/full-corpus-baseline.md` records the package-root command, exit 1, 18 failed files, 27 failed tests, owner, and revisit trigger; focused Pi/shared/Node receipts are 32/32, 351/351, and 7/7.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every phase has one normalized status agreed by spec, summary, checklist/task, and graph surfaces. [TESTED: final status matrix]
  - [EVIDENCE: all nine child rows read Complete/100% from authored docs and `derived.status` reads Complete from regenerated graph metadata; the matrix command exits 0.]
- [x] CHK-011 [P0] Phases 006-009 retain their evidence-supported Complete/100% state and source/test ownership boundaries. [TESTED: focused receipts and cross-document scan]
  - [EVIDENCE: Phase 006/007 focused receipts and Phase 009 contract/bridge/strict receipts are recorded in their owning artifacts; this repair changes no production source or test.]
- [x] CHK-012 [P1] No summary body claims implementation its frontmatter or checklist does not support. [TESTED: status/evidence scan]
  - [EVIDENCE: final cross-document scan finds no Complete summary paired with Draft/0% state or unchecked required criteria; recursive strict validation passes status and evidence gates.]
- [x] CHK-013 [P1] Completion percentages and next-action fields match actual work. [TESTED: frontmatter and evidence scan]
  - [EVIDENCE: completed children expose 100% and command-backed next-state text; the packet root and Phase 008 expose 100% completion while the corpus deferral remains explicit.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Recursive strict validation reports zero structural and integrity errors. [TESTED: final recursive validator]
  - [EVIDENCE: final `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/hooks/007-fable-governor-pi-hook --strict` exits 2 with parent `Errors: 0, Warnings: 0, RESULT: PASSED`; all nine children have `Errors: 0`, and the nine remaining warnings are `CONTINUITY_FRESHNESS` only (001-005 timestamp lag; 006-009 stale fingerprint and/or dirty packet path).]
- [x] CHK-021 [P0] Generator commands exit 0 for the parent and every child. [TESTED: final generator loop]
  - [EVIDENCE: `generate-description.js` and `backfill-graph-metadata.js` each exit 0 for the parent and all nine child folders; repository re-derive prints `METADATA_INTEGRITY=PASS`, exit 0, with `violations=0` for all ten folders.]
- [x] CHK-022 [P1] Re-running generators is idempotent apart from timestamps and memory-sequence fields. [TESTED: generator rerun]
  - [EVIDENCE: `node .opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js <folder>` exits 0 on the second pass; metadata comparison shows no semantic drift beyond volatile save timestamps.]
- [x] CHK-023 [P1] Resume pointer (`last_active_child_id`) identifies the most recently reconciled child while matching the Complete parent rollup. [TESTED: final JSON read]
  - [EVIDENCE: final parent graph metadata points to `hooks/007-fable-governor-pi-hook/009-injection-contract-directive-sync`; parent and all nine child statuses are Complete.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Parent phase map lists phases 001-009 exactly once with no duplicate rows. [TESTED: map scan]
  - [EVIDENCE: `rg -n "^\\| (1|2|3|4|5|6|7|8|9) \\|" ../spec.md` reports nine map rows, one per phase.]
- [x] CHK-FIX-002 [P0] Handoff table has one row per adjacent pair, each with a criterion and verification command. [TESTED: handoff scan]
  - [EVIDENCE: `rg -n "^\\| 00[1-9]-|recursive strict validation|grep|vitest|node --test" ../spec.md` confirms eight adjacent transitions plus the terminal row, each with criteria and a named command.]
- [x] CHK-FIX-003 [P0] No placeholder rows (`[Phase N scope]`, `TBD`) remain in the parent map or handoffs. [TESTED: placeholder scan]
  - [EVIDENCE: `rg -n "TBD|\\[Phase [0-9] scope\\]" ../spec.md` returns no matches and the scan exits 1 as the expected negative control.]
- [x] CHK-FIX-004 [P0] Generated `children_ids` includes all nine on-disk children. [TESTED: final graph read]
  - [EVIDENCE: final `graph-metadata.json` contains the nine ordered child packet IDs and the child-directory comparison exits 0.]
- [x] CHK-FIX-005 [P1] Historical phases 001-005 records are preserved with their scopes and statuses. [TESTED: folder and map inventory]
  - [EVIDENCE: `find ../001-research ../002-governor-parity ../003-pi-directive-capsule ../004-pi-directive-enforcement ../005-agents-md-pi-row -type f` confirms all five historical child folders and authored documents remain present.]
- [x] CHK-FIX-006 [P1] Evidence rows live in the artifact that owns the check. [TESTED: evidence ownership scan]
  - [EVIDENCE: Phase 007 corpus receipts remain under its evidence directory, focused test receipts remain in Phase 006/007 artifacts, and Phase 008 status receipts remain in its tasks/checklist/summary.]
- [x] CHK-FIX-007 [P1] Final claims are tied to final-state command output. [TESTED: final command receipts]
  - [EVIDENCE: final summary records the exact generator, validator, focused-test, map, pointer, diff-check, and scope-sweep commands with their observed exit codes.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No phase status is elevated without local command or checklist evidence. [TESTED: evidence matrix]
  - [EVIDENCE: Complete child states are backed by Phase 006/007/009 receipts or preserved historical evidence; no reviewer-only assertion promotes a phase.]
- [x] CHK-031 [P0] No historical phase record or folder is deleted. [TESTED: folder inventory]
  - [EVIDENCE: the final `find` inventory still contains all nine phase directories and their authored documents; no deletion appears in the worker's scoped file-hash comparison.]
- [x] CHK-032 [P1] Changes are confined to spec artifacts and generated metadata under `.opencode/specs`. [TESTED: scope sweep]
  - [EVIDENCE: final status comparison against the pre-worker snapshot shows no new path outside `.opencode/specs/hooks/007-fable-governor-pi-hook`; production source and tests remain untouched by this worker.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Summaries, checklists, tasks, and the parent map describe the same phase states. [TESTED: cross-document read]
  - [EVIDENCE: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .. --strict` confirms parent map, Phase 008 docs, and generated metadata describe the nine-phase Complete state and explicit corpus deferral.]
- [x] CHK-041 [P1] Completion metadata is reconciled; no document claims a conflicting completion state. [TESTED: metadata and status scan]
  - [EVIDENCE: Phase 008 frontmatter/body/checklist/tasks now report Complete/100%; Phase 004 what-built citation satisfies the sufficiency rule; generated fingerprints are refreshed by the generators.]
- [x] CHK-042 [P2] Phase 009 receives an accurate description of the completed contract state. [TESTED: Phase 009 handoff read]
  - [EVIDENCE: Phase 009 spec, tasks, checklist, summary, and graph metadata remain Complete with their exact grep, bridge-test, and strict-validation receipts; no Phase 009 implementation file is changed.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary inventory and baseline outputs are confined outside the packet's authored surface. [TESTED: no-stray sweep]
  - [EVIDENCE: baseline hashes/logs were kept in `/tmp`; no inventory output or scratch fixture was added under the packet folder.]
- [x] CHK-051 [P1] Scratch fixtures are removed or durable evidence is copied into the implementation summary before completion. [TESTED: final file inventory]
  - [EVIDENCE: `find . -type f` final inventory contains only authored docs, evidence artifacts, and generator-owned JSON; no task-created scratch output remains.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------:|---------:|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-05; all scoped reconciliation gates are complete. Recursive strict validation exits 2 with zero structural/integrity errors; parent result is PASSED and the nine child `CONTINUITY_FRESHNESS` warnings are reported separately because this packet remains uncommitted.
<!-- /ANCHOR:summary -->
