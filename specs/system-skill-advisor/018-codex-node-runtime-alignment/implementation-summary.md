---
title: "Implementation summary: Codex skill advisor Node runtime alignment"
description: "Codex now launches the skill advisor with the Node ABI required by its installed native SQLite module. Direct MCP handshakes confirm the startup blocker is removed without changing other server-specific runtime pins."
trigger_phrases:
  - "Codex skill advisor runtime fixed"
  - "mk_skill_advisor initialize passes"
  - "Codex MCP startup ABI alignment"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/018-codex-node-runtime-alignment"
    last_updated_at: "2026-08-14T07:52:06Z"
    last_updated_by: "claude-code"
    recent_action: "Verified the repaired advisor and dependent startup chain"
    next_safe_action: "Start a fresh Codex session and confirm the startup banner is clear"
    blockers: []
    key_files:
      - ".codex/config.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-mcp-runtime-alignment-20260810"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The skipped MCP servers were a startup-interruption cascade, not six independent configuration failures."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-codex-node-runtime-alignment |
| **Completed** | 2026-08-10 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Codex can now initialize the skill advisor instead of aborting the MCP startup sequence. The advisor uses Node 25 ABI 141, which matches the installed `better-sqlite3` binary, while memory and code mode retain their independently verified Node 22 and Node 24 pins.

### Runtime Alignment

The `mk_skill_advisor` registration now launches `/opt/homebrew/bin/node`. A durable comment records the native ABI constraint so a future runtime normalization does not reintroduce the failure.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.codex/config.toml` | Modified | Run the advisor with the compatible Node ABI. |
| `specs/system-skill-advisor/018-codex-node-runtime-alignment/` | Created | Record scope, proof, rollback, and final state. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The same native constructor that failed under Node 22 passed under Node 25, then the exact configured launcher completed a live MCP initialize handshake. Independent handshakes confirmed the other locally testable servers were healthy and had only been skipped after the advisor interrupted startup.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Change only the Codex advisor runtime. | Rebuilding SQLite for Node 22 would break runtimes already using its ABI 141 binary. |
| Preserve memory and code-mode pins. | Their separate dependency trees initialized successfully under Node 22 and Node 24. |
| Use the Codex CLI as the TOML authority. | The system Python is 3.9 and does not provide `tomllib`; `codex mcp list/get` loaded and resolved the actual production configuration. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Node 22 SQLite negative control | PASS: reproduced `NODE_MODULE_VERSION 141` versus required 127 with `ERR_DLOPEN_FAILED`. |
| Node 25 SQLite positive control | PASS: in-memory database constructor completed under ABI 141. |
| Advisor MCP initialize | PASS: `mk_skill_advisor` v0.1.0 initialized and shut down cleanly. |
| Memory MCP initialize | PASS: `mk-spec-memory` v1.8.0 initialized under its unchanged Node 22 pin. |
| Code mode MCP initialize | PASS: `CodeMode-MCP` v1.0.0 initialized under its unchanged Node 24 pin. |
| Node REPL MCP initialize | PASS: `rmcp` v1.5.0 initialized from the resolved Codex registration. |
| Sites picker MCP initialize | PASS: `Sites Design Picker` v0.1.30 initialized. |
| Codex configuration authority | PASS: `codex mcp list` and `codex mcp get mk_skill_advisor --json` resolved `/opt/homebrew/bin/node`. |
| Python TOML helper | FAIL, non-authoritative: system Python 3.9 lacks `tomllib`; replaced by the production Codex parser check. |
| Whole-tree sk-code guards | CONDITIONAL: stack-folders and router-sync passed; alignment-drift reported the known unrelated backlog of 12,514 errors and 11,799 warnings across 788,322 files. |
| Packet-scoped alignment delta | PASS: 2 scanned machine descriptors, 0 errors, 0 warnings; no reported finding names either changed scope path. |
| Strict spec validation | PASS: final-state run exited 0 with zero errors and zero warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fresh-session UI confirmation remains operator-observable.** `codex_apps` is runtime-managed and does not appear in `codex mcp list`; starting a new Codex session is the final check that its prior skipped status has cleared.
2. **Repository-wide alignment backlog remains.** The scoped change adds no finding, but the whole-tree guard remains non-zero because of unrelated files and nested worktrees.
<!-- /ANCHOR:limitations -->
