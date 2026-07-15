---
title: "Implementation Summary: metadata-status-derivation"
description: "deriveStatus now honors the spec.md metadata-table Status so Draft and Placeholder specs stop being derived as complete, and the cited 026/027 metadata data files were reconciled to disk and spec reality."
trigger_phrases:
  - "metadata status derivation summary"
  - "table status fallback shipped"
  - "026 027 metadata reconciled"
  - "deriveStatus draft fix"
  - "graph metadata parser summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/005-metadata-status-derivation"
    last_updated_at: "2026-06-04T20:45:44Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped E7 parser fix and reconciled cited 026/027 metadata"
    next_safe_action: "Defer dist rebuild and backfill regen to central"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-metadata-status-derivation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-metadata-status-derivation |
| **Completed** | 2026-06-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A spec with a Draft or Placeholder status in its markdown metadata table no longer reports `complete` just because an implementation-summary file exists. The status derivation now reads that table row, which removes the single most common source of false `complete` derived statuses across the 026 and 027 metadata.

### Table-status fallback in the status parser

The parser used to read spec status from YAML frontmatter only. Most 026/027 specs declare their status in the `| **Status** | Draft |` table row and carry no YAML `status:` key, so the heuristic fell through to the implementation-summary branch and returned `complete`. A new `extractMetadataTableStatus()` helper matches that table row, and `collectPacketDocs` now sets the spec.md status to the frontmatter value when present, otherwise the table value. YAML status keeps strict precedence, the lean-phase-parent preservation branch is untouched, and `Draft`/`Placeholder` normalize to themselves so they never reach the `complete` branch.

### Reconciled 026/027 metadata to reality

The cited data files were brought into agreement with disk and spec truth: the 026 last-active child pointer and prose, the track-000 leaf-changelog counts, the two completion-contradiction packets, the 027 placeholder child removal, the renumbered 027 child titles and triggers, the two Draft-but-complete derived statuses, the resource-map missing-on-disk honesty, and the 027 lean-parent note plus a pin to the 026 surface it builds on.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/graph/graph-metadata-parser.ts` | Modified | E7: table-status helper + collectPacketDocs fallback |
| `mcp_server/tests/graph-metadata-schema.vitest.ts` | Modified | E7: Draft + Placeholder fixture tests |
| `026 graph-metadata.json` + `026 spec.md` | Modified | E1: last-active pointer + prose |
| `026 track-000 changelog root` + `changelog README.md` | Modified | E2: leaf count 1/128 to 129 |
| `026 009-readme-and-references-accuracy/{spec,graph-metadata,checklist,implementation-summary}` | Modified | E3: reconciled to Complete |
| `026 016-embedding-provider-local-first/{spec,graph-metadata,checklist,implementation-summary}` | Modified | E3: reconciled to Complete |
| `027 description.json` + `027 graph-metadata.json` | Modified | E4: de-list placeholder child |
| `027 {002,007,008}/description.json` | Modified | E5: title + trigger renumbering |
| `027 {003,006}/graph-metadata.json` | Modified | E6: derived.status to draft |
| `026 resource-map.md` | Modified | E8: missing-on-disk honesty |
| `027 spec.md` + `026 spec.md` | Modified | E9: lean-parent note + 026-surface pin |
| `026 context-index.md` | Modified | Pre-existing narrative recent_action compacted to unblock parent --strict |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The parser change is two surgical blocks (a helper plus a fallback expression) verified by typecheck against the project tsconfig and two new fixtures. Per the cluster verify policy the vitest run was deferred to central so peer edits in the same test tree are not disturbed. Every edited 026/027 packet then passed `validate.sh --strict` with Errors 0, and every edited JSON file passed a `JSON.parse` sanity check.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Inject the table read only into the spec.md status, not the whole precedence chain | The ranked chain already reads spec.md status last, so populating that one field is the single load-bearing change and avoids redesigning precedence |
| Resolve both E3 packets to Complete rather than flip impl-summaries to in-progress | The actual remediation shipped for 009 (validate strict passes) and the 016 source is committed (commit 79cb4e4d21) with the local-first resolver live in factory.ts |
| De-list the 027 placeholder child instead of scaffolding it | The folder is a hollow shell with no trio and the parent OPEN QUESTIONS frames it as an indefinite placeholder |
| Compact the pre-existing 026 context-index recent_action | It was the lone --strict blocker on the 026 parent I own for E1/E9; the fix is a safe one-field length trim |
| Defer dist rebuild + global backfill to central | The backfill needs the rebuilt parser and a global run would clobber peer edits; E7 makes the E3/E6 hand-edits durable against a later re-derive |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Typecheck parser (project tsconfig) | PASS, no errors in graph-metadata-parser.ts; pre-existing unrelated errors in handlers/memory-search.ts only |
| Typecheck test file | PASS, no errors in graph-metadata-schema.vitest.ts |
| graph-metadata-schema.vitest.ts Draft + Placeholder fixtures | Authored, vitest run deferred to central per verify policy |
| validate.sh --strict on edited 026/027 packets | PASS, Errors 0 (026 parent recursive, 027 parent recursive, 009, 016, 027/003, 027/006) |
| JSON.parse on every edited JSON metadata file | PASS |
| E5 stale-id grep | PASS, only `027 phase 008` remains which is the correct current folder number |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Global backfill not run.** The mcp_server dist rebuild and `backfill-graph-metadata.ts` run that regenerates derived.status across all 026/027 packets are deferred to central. E3/E6 hand-edits stay correct because E7 makes the table status authoritative, but the broader 163-contradiction sweep happens at central.
2. **Tracks 003/004 changelog rollup drift untouched.** Only track-000 was in scope per the cited evidence; the similar 240/27 and 76/10 claims are flagged for a follow-up, not fixed here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
