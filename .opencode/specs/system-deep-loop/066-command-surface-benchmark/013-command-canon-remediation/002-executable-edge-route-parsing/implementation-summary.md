---
title: "Implementation Summary: executable-edge route parsing"
description: "Status of the schema-aware route-parsing phase: scaffolded doc set in place; no code written yet. Records the planned change, decisions, and the verification gates that will apply once implemented."
status: in_progress
trigger_phrases:
  - "executable edge route parsing implementation"
  - "route cycle false positive status"
  - "yaml comment edge parsing progress"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/002-executable-edge-route-parsing"
    last_updated_at: "2026-07-16T08:08:17Z"
    last_updated_by: "claude"
    recent_action: "Authored Level-1 doc set for route-parsing phase"
    next_safe_action: "Read sk-doc-command.cjs route inference and flagged YAML fixtures"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs"
      - ".opencode/commands/create/assets/create_readme_auto.yaml"
      - ".opencode/commands/doctor/_routes.yaml"
    completion_pct: 0
    open_questions:
      - "Reuse an available YAML parser in the adapter or add a scoped dependency?"
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-executable-edge-route-parsing |
| **Status** | In Progress |
| **Completed** | 0 of 5 tasks; doc set scaffolded, no code written yet |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been implemented yet. This phase is scaffolded: the Level-1 spec, plan, and tasks are in place, but no adapter or fixture code has been written and no commit exists for this work.

The planned change is a schema-aware rewrite of the route-inference path in the sk-doc-command adapter. Today that path scans the command YAMLs as raw text, so YAML comments and prose read as dispatch edges — the source of the three reported P0 circular-dependency findings, which are therefore likely false positives. The planned parser reads each YAML structurally and follows only the schema-declared dispatch fields, emitting one typed edge per declared reference (direct, subaction, or workflow) tagged with its source location, and then re-runs cycle detection over that executable-only edge set.

### Files Changed

No files have been changed yet. The table below lists the intended targets once implementation begins.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs` | Planned change | Schema-aware route parse over declared dispatch fields, typed edges with source location |
| `.opencode/commands/create/assets/create_readme_auto.yaml` | Planned re-classification | One flagged false-positive cycle to re-classify against the corrected edge set |
| `.opencode/commands/doctor/_routes.yaml` | Planned re-classification | One flagged false-positive cycle to re-classify against the corrected edge set |
| Benchmark route fixtures | Planned update | Reflect the corrected edge set and retain a genuine executable cycle as a regression guard |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The intended approach parses each command YAML into a structured document, walks only the declared dispatch fields, and records typed edges with their source location. Cycle detection then runs over the executable-only edge set, so comment-derived and prose-derived references contribute no edges. A genuine direct, subaction, or workflow cycle is retained in the fixtures so real cycles stay covered.

This phase is independent of the 000 to 001 chain and of the 014 asset-layer research, so it can be built in parallel. Its blast radius is low: the change is confined to one adapter and its fixtures, with no runtime dispatch behavior touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Parse YAML structurally instead of scanning raw text | Comments and prose stop being read as dispatch edges, which is the root cause of the false P0 cycles |
| Tag each edge with kind and source location | Re-classification can express a real cycle's path in executable fields |
| Retain a genuine executable cycle in the fixtures | Guards against a parser that drops real edges while clearing false ones |
| Keep the contract schema and semantic invariants out of scope | Those belong to phase 001 and phase 003; this phase is edge inference only |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has been run; there is no implementation to exercise. The gates below apply once the work is built.

| Check | Result |
|-------|--------|
| Comment-only / prose-only references yield zero edges | PENDING — not yet implemented |
| Each edge carries a kind and source location | PENDING — not yet implemented |
| Genuine direct/subaction/workflow cycle still fails | PENDING — not yet implemented |
| Reported P0 cycles re-classified | PENDING — not yet implemented |
| Benchmark route fixtures reflect corrected edge set | PENDING — not yet implemented |
| Strict packet validation | PASS: `validate.sh --strict` Errors:0 Warnings:0 on the scaffolded doc set |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** Only the Level-1 doc set exists. The adapter parser change, the cycle re-classification, and the fixture updates are all still owed.
2. **Open question outstanding.** Whether to reuse a YAML parser already available to the adapter or add a scoped dependency for the structural parse is undecided and should be settled before Phase 1 code begins.
<!-- /ANCHOR:limitations -->
