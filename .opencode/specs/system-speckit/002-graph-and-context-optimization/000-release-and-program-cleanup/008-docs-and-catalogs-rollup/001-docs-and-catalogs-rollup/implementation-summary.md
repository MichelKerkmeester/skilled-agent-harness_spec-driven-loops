---
title: "Implementation Summary: Docs and Catalogs Rollup"
description: "Synced the umbrella docs and catalog indexes to the capabilities spec 026 actually shipped, via gap analysis then surgical content-preserving additions."
trigger_phrases:
  - "docs rollup summary"
  - "umbrella docs sync result"
  - "impl summary core"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/001-docs-and-catalogs-rollup"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Rollup shipped"
    next_safe_action: "None, packet complete"
    blockers: []
    key_files:
      - "README.md"
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000024"
      session_id: "docs-rollup-2026-06-01"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-docs-and-catalogs-rollup |
| **Completed** | 2026-06-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The umbrella docs and catalog indexes now reflect the capabilities spec 026 actually shipped. A read-only gap analysis compared each of the 7 umbrella docs against the 026 changelogs and found the docs were already largely current (they were maintained through the program). Only four final-sprint capabilities were genuinely missing, so the work was surgical additions, not a rewrite.

### What was added

The four genuinely-missing capabilities, surfaced where each doc needs them:
- `memory_embedding_reconcile`, a net-new dry-run-default MCP maintenance tool. This bumped the mk-spec-memory tool count from 35 to 36 (and the program total from 60 to 61, the feature catalog from 54 to 55).
- `memory_index_scan` self-maintaining behavior: coalesced overlapping scans, async lexical-first commit with a `complete_with_pending_vectors` status, move reconciliation for renamed spec folders, and the new `memory_health` index block.
- Track 007 daemon reliability: non-destructive incremental build, WAL durability, boot FTS5 integrity-check, and the opt-in RSS-ceiling watchdog.
- Track 006 operator tooling: the `session-cleanup.sh` rename and the worktree-per-session isolation scripts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `README.md` | Modified | Daemon reliability, index-scan, reconcile, tool counts |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | Index-scan and reconcile notes, worktree and session tooling |
| `.opencode/skills/system-spec-kit/README.md` | Modified | Reconcile, index-scan, RSS flag, corrupt-health troubleshooting |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Reconcile entrypoint, WAL and boot-integrity guardrails |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modified | Reconcile and health tools, non-destructive build, corrupt-health row |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Modified | Reconcile entry, index-scan and health notes, session and worktree tooling |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modified | Reconcile scenario, extended index-scan scenario contract |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A read-only gap-analysis workflow (one agent per doc) compared each doc against the 026 changelogs and reported genuine gaps plus moot or misscoped items. A second apply workflow (one agent per doc) inserted only the listed gaps with a content-preservation guard. Every doc's diff was verified additions-only, HVR lint ran on added lines, and every newly-referenced path was confirmed to exist.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gap analysis before any edit | The docs were already maintained through 026, so a blind rewrite would risk degrading current content |
| Surgical additions, not rewrites | Preserve every existing line, add only what genuinely shipped and was missing |
| Code-graph and advisor handlers left out | They were extracted to the system-code-graph and system-skill-advisor skills, so their docs live there |
| Original packet deliverables reconciled | The 012-era plan to add code-graph handlers to system-spec-kit mcp_server is moot post-extraction |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Content preservation (per-doc diff additions-only) | PASS, removals were count bumps and line extensions only |
| HVR lint on added lines | PASS, 0 em-dashes, the one INSTALL_GUIDE prose semicolon fixed; playbook semicolons match the doc's existing scenario-contract convention |
| Referenced paths exist | PASS, all worktree/session scripts and the reconcile handler verified |
| Tool count consistency | PASS, 35 to 36 (mk-spec-memory), 60 to 61 (total), 54 to 55 (feature catalog) |
| No factual claim unsupported by a shipped changelog | PASS, every addition cites its changelog |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **merged-phase-map.md is gone.** The original packet planned to update it, but it was removed during the wave-4 reorg and replaced by `context-index.md`. No update was applicable.
2. **The original 012-era deliverables were narrower** (a single sub-campaign). The scope was generalized to the whole 026 program, and several original line items (code-graph handlers in system-spec-kit mcp_server) are moot because code-graph was extracted to its own skill.
<!-- /ANCHOR:limitations -->
