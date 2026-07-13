---
title: "Implementation Summary: Codex agent TOML sync"
description: "Deterministic Codex agent adapters now mirror the live canonical OpenCode agent set with drift enforcement."
trigger_phrases: ["Codex agent TOML sync summary"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/005-codex-agent-toml-sync"
    last_updated_at: "2026-07-13T10:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Generated deterministic Codex agent adapters with parity enforcement"
    next_safe_action: "Run live Codex 0.144.1 agent-load smoke"
    blockers: ["Live Codex agent-load smoke requires orchestrator"]
    key_files: [".opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs", ".codex/agents/*.toml"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "134-005", parent_session_id: "134-wave2" }
    completion_pct: 90
    open_questions: ["Will all generated agents load in a live Codex 0.144.1 session?"]
    answered_questions: ["The canonical set is the 13 live Markdown filenames, not a fixed count"]
---
# Implementation Summary
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|---|---|
| **Spec Folder** | 005-codex-agent-toml-sync |
| **Completed** | Source implementation 2026-07-13; live verification deferred |
| **Level** | 1 |
| **Status** | Implemented; live agent-load smoke pending |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## What Was Built
A checked-in CommonJS generator now discovers the canonical `.opencode/agents/*.md` filenames, sorts them, converts their frontmatter and full Markdown bodies into Codex agent TOMLs, and removes stale generated TOMLs. The same script exposes a read-only `--check` mode that reports missing, extra, and byte-stale adapters.

### Files Changed
| File | Action | Purpose |
|---|---|---|
| `.opencode/skills/system-spec-kit/scripts/codex/sync-agents.cjs` | Created | Generate and check Codex agent adapter parity. |
| `.codex/agents/*.toml` | Created | Provide one derived Codex adapter per live canonical OpenCode agent. |
| `spec.md` | Modified | Reconcile status and the stale agent-count assumption. |
| `tasks.md` | Modified | Record completed static work and deferred live smoke evidence. |
| `implementation-summary.md` | Created | Record decisions, verification, and remaining runtime work. |
<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## How It Was Delivered
The canonical set is derived from live Markdown filenames rather than a hardcoded count. Historical Codex settings recovered from the retired adapters remain authoritative where present; new agents derive `sandbox_mode` from writable frontmatter grants and default to `gpt-5.5` with high reasoning effort. Generated instructions use TOML multiline literal strings, with a valid basic-string fallback if a future body contains the literal delimiter.
<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## Key Decisions
| Decision | Why |
|---|---|
| Derive inventory from `.opencode/agents/*.md` | The inventory rule makes live filenames authoritative and prevents fixed-count drift. |
| Preserve recovered settings before deriving defaults | Existing runtime tuning remains stable, including Markdown's medium reasoning effort. |
| Use one script for write and check modes | Generation and parity checks share one renderer, so stale-content detection cannot drift from generation. |
| Leave commit-gate wiring as a runnable check | The plan names no live hook target or safe insertion point; hook wiring is UNKNOWN and belongs to the orchestrator. |
<!-- /ANCHOR:decisions -->
<!-- ANCHOR:logic-sync -->
## Logic Sync
The live canonical inventory contains 13 Markdown agents. The earlier Phase 005 prose count of 14 and prior plan count of 15 were both stale. The implementation therefore records no fixed count in executable logic and derives the set from sorted live filenames on every run.
<!-- /ANCHOR:logic-sync -->
<!-- ANCHOR:verification -->
## Verification
| Check | Result |
|---|---|
| Node syntax | PASS: `node --check` accepted `sync-agents.cjs`. |
| Negative mirror check | EXPECTED DRIFT: before generation, `--check` reported all 13 adapters missing. |
| Generation | PASS: first run wrote 13 of 13 adapters; second run wrote 0 of 13. |
| TOML parsing | PASS: Python 3.11 `tomllib` loaded every generated adapter. |
| Filename parity | PASS: source and adapter counts are 13/13 and the sorted basename diff is empty. |
| Content parity | PASS: `--check` reports 13 agents in sync and all parsed instruction bodies round-trip verbatim. |
| Scoped rerun status | PASS: `.codex/agents/` status output was unchanged across the second generator run. |
| Comment hygiene | PASS: the checker reported no findings when run through its Python shebang interpreter. |
| Scoped alignment drift | PASS: 1 file scanned with 0 findings, errors, warnings, or violations. |
| Live Codex agent load | NOT RUN: requires the orchestrator's live Codex 0.144.1 smoke. |
| `validate.sh --strict` | NOT RUN: explicitly excluded from this leaf task. |
| Dist rebuild | NOT RUN: explicitly excluded from this leaf task. |
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## Known Limitations
1. **Live loading is unverified.** A Codex 0.144.1 session must load the generated agents before runtime acceptance is claimed.
2. **Commit-gate wiring is not installed.** The plan does not identify a live pre-commit integration point, so the checked-in `--check` command remains the safe enforcement entrypoint.
3. **Generated adapters are derived artifacts.** They must be updated only by rerunning the generator, never by hand.
<!-- /ANCHOR:limitations -->
