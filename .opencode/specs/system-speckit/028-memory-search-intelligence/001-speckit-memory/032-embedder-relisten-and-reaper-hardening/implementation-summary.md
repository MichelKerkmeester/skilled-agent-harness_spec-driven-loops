---
title: "Implementation Summary: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening"
description: "Planning-only packet. Nothing has been implemented yet; this document records the intended work so a future implementer starts from an honest baseline."
trigger_phrases:
  - "implementation"
  - "summary"
  - "embedder relisten reaper hardening"
importance_tier: "high"
contextType: "implementation"
parent: "system-speckit/028-memory-search-intelligence/001-speckit-memory"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/032-embedder-relisten-and-reaper-hardening"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Deferred-work spec authored"
    next_safe_action: "Implement WS1 (embedder re-listen) first"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-embedder-relisten-and-reaper-hardening-authoring"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 032-embedder-relisten-and-reaper-hardening |
| **Completed** | Not started - this packet is Planned, see spec.md |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet collects everything packet 030 deliberately deferred - the embedder demand-listener re-arm gap and the orphan-sweeper process-killer hardening - into one tracked follow-up. Only the planning artifacts (spec.md, plan.md, tasks.md, checklist.md, this file) exist so far.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Requirements, scope, risks, and success criteria for WS1-WS5 |
| `plan.md` | Created | Technical approach, affected-surfaces inventory, and phase sequencing |
| `tasks.md` | Created | Task breakdown across Setup, Implementation, and Verification |
| `checklist.md` | Created | Pre-implementation verification checklist, all items pending |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not applicable - nothing has shipped yet. Once WS1 lands it will ship behind a live-durability test with two real launcher processes before merge, per the rollback plan in plan.md.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| WS1 (embedder re-arm) ships first, ahead of WS2-WS5 | It is the only item in this packet currently blocking the memory-index scan of packet 025's docs, so it has the clearest, most immediate payoff |
| WS3 (sweeper hardening) requires adversarial review before any live activation | `orphan-mcp-sweeper.sh` is a process killer; a false-positive reap there can break MCP transport for every concurrent session, so the blast radius justifies a second reviewer pass beyond unit tests |
| WS4 is documented as a runbook, not implemented as code | The staged dry-run-to-live activation (stop-hook env var, launchd plist) already exists in the repo; what is missing is a written, reviewable sequence, not new code |
| WS5's outcome is left genuinely open between "fix" and "root-cause as env-only" | The investigation has not started; committing to one outcome before investigating would be a fabricated claim |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh 032-embedder-relisten-and-reaper-hardening --strict` | See the packet's checklist.md and this session's delivery notes for the actual run output; no implementation to test yet |
| Manual/unit/integration tests for WS1-WS5 | Not run - no code exists yet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No implementation yet.** This packet is planning-only; spec.md documents the intended scope but no code has been written for WS1-WS5.
2. **description.json and graph-metadata.json are not yet present in this folder.** They are backfilled by the parent phase-parent's own metadata refresh flow, not authored by hand in this pass.
3. **WS5's root cause is unknown.** The `launcher-lease.vitest.ts` owner-reap timeout could be an environment-timing artifact or a real bug; this packet does not assume either answer.
<!-- /ANCHOR:limitations -->
