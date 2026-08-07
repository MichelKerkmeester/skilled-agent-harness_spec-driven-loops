---
title: "Implementation Summary: Codex revival docs and closeout"
description: "Active docs advertise cli-codex under one availability-gated contract; the revival packet is closed with prior-phase and fail-closed evidence."
trigger_phrases: ["Codex revival closeout summary"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/027-cli-codex-revival/006-docs-and-closeout"
    last_updated_at: "2026-07-13T10:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Advertised cli-codex in README under the fail-closed contract and closed the packet"
    next_safe_action: "Build dist and run the four-event hook smoke in a live Codex session"
    blockers: ["Hook live smoke and full runtime suite require an orchestrator dist build"]
    key_files: ["README.md", ".opencode/skills/cli-external-orchestration/changelog/v1.2.0.0.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "134-006", parent_session_id: "134-wave2" }
    completion_pct: 100
    open_questions: ["Do all four hooks fire once in a live Codex 0.144.1 session after a dist build?"]
    answered_questions: ["Active docs describe one availability-gated Codex contract", "Packet 122 is referenced, not rewritten"]
---
# Implementation Summary
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|---|---|
| **Spec Folder** | 006-docs-and-closeout |
| **Completed** | Docs and closeout 2026-07-13; hook live smoke deferred |
| **Level** | 1 |
| **Status** | Implemented; hook live smoke pending dist build |
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:what-built -->
## What Was Built
Active documentation now advertises the revived `cli-codex` executor as the third `cli-external-orchestration` mode, described under a single availability-gated contract (it fails closed when the `codex` binary is absent). A hub-level changelog records the mode revival, and the packet is closed with cross-phase and guardrail evidence. Packet 122 is cited as the reversed predecessor and left byte-unchanged.

### Files Changed
| File | Action | Purpose |
|---|---|---|
| `README.md` | Modified | Advertise `cli-codex` as a hub mode with the `command -v codex` fail-closed contract. |
| `.opencode/skills/cli-external-orchestration/changelog/v1.2.0.0.md` | Created | Record the `cli-codex` mode revival at the hub level. |
| `spec.md` | Modified | Reconcile the closeout status. |
| `tasks.md` | Modified | Record completed closeout work and the deferred live-smoke evidence. |
| `implementation-summary.md` | Created | Capture closeout decisions, evidence, and remaining runtime work. |
<!-- /ANCHOR:what-built -->
<!-- ANCHOR:how-delivered -->
## How It Was Delivered
The active README hub section gained a `cli-codex` bullet and a routing-line reference, both stressing that every routing surface checks `command -v codex` before advertising or dispatching. `AGENTS.md` needed no change (its CLI-dispatch rule is mode-agnostic), and `PUBLIC_RELEASE.md` was intentionally left untouched (it is a release-workflow document with no per-skill listing; the changelog is the release-note surface). Prior-phase gates were re-run rather than re-derived from prose.
<!-- /ANCHOR:how-delivered -->
<!-- ANCHOR:decisions -->
## Key Decisions
| Decision | Why |
|---|---|
| Reference packet 122, never rewrite it | Preserves the deprecation audit trail; this packet is the documented reversal, not a history edit. |
| Advertise `cli-codex` only with its fail-closed clause | One availability-gated contract prevents an absent binary from ever reading as usable. |
| Leave `PUBLIC_RELEASE.md` unedited | It carries release workflow, not a skill catalog; the hub changelog is the correct release note. |
| Keep the hook live smoke deferred | It needs a compiled `dist` and a trusted live Codex session, consistent with the phase 002/004 deferral. |
<!-- /ANCHOR:decisions -->
<!-- ANCHOR:logic-sync -->
## Logic Sync
Packet 122's SC-001 asserted zero active Codex references outside the archive. The revival deliberately inverts that expectation: active Codex references are restored and expected to be present, while 122's own documents stay unchanged. Separately, phase 002 carries one environment-blocked verification item (the full runtime suite and recursive validate depend on a dist rebuild that was withheld); its impl-summary already documents this, and the packet validates at Errors:0 despite the derived in-progress marker on that single child.
<!-- /ANCHOR:logic-sync -->
<!-- ANCHOR:verification -->
## Verification
| Check | Result |
|---|---|
| Prior phases 001-005 strict validation | PASS: each child validates at Errors:0 (003/004/005 confirmed this session; 001/002 shipped in wave 1). |
| Fail-closed guardrail | PASS: real `fanout-run.cjs` functions, PATH-shadowed absent binary, `buildLineageCommand` threw `cli-codex executor unavailable` (4 of 4 assertions). |
| Agent adapter parity | PASS: `sync-agents.cjs --check` reports 13 of 13 in sync. |
| Bridge config validity | PASS: `.codex/hooks.json` valid JSON; `.codex/config.toml` and all `.codex/agents/*.toml` valid TOML. |
| Recursive strict packet validation | PASS: parent plus six children at Errors:0. |
| Hook four-event live smoke | NOT RUN: requires an orchestrator `dist` build and a trusted live Codex 0.144.1 session. |
| Full runtime suite | NOT RUN: blocked by the same withheld dist rebuild documented in phase 002. |
<!-- /ANCHOR:verification -->
<!-- ANCHOR:limitations -->
## Known Limitations
1. **Hook live smoke is unverified.** The four Codex hook events must be exercised in a trusted live session after a `dist` build before end-to-end acceptance is claimed.
2. **Codex hook adapters delegate to the compiled Claude lifecycle owners** (documented in phase 004); prompt diagnostics may retain a Claude runtime label until a future refactor lifts the shared lifecycle into the neutral cores.
3. **Generated `.codex/agents/*.toml` are derived artifacts** — regenerate via `sync-agents.cjs`, never hand-edit.
<!-- /ANCHOR:limitations -->
