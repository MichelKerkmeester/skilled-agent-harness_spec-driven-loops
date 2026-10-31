---
title: "Implementation Summary: Runtime Surface Coverage"
description: "Audit phase complete: a gpt-5.6-sol (high thinking) scout subagent enumerated every runtime-support doc and script that still names only Claude/Codex/OpenCode. Spec packet documents 20+ stale enumeration sites across six runtime surfaces; implementation pending."
trigger_phrases:
  - "runtime surface coverage"
  - "six runtime surfaces"
  - "runtime enumeration audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/002-runtime-surface-coverage"
    last_updated_at: "2026-08-04T06:30:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Scout audit recorded; spec/plan/tasks/checklist written; implementation not started"
    next_safe_action: "Implement T001-T009 (Phase 1 P1 fixes)"
    blockers: []
    key_files:
      - "AGENTS.md"
      - "CLAUDE.md"
      - "README.md"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/advisor-runtime-values.ts"
      - ".opencode/commands/scripts/validate-command-references.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-agents-002"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Should Devin MCP registration be added? Default: remain absent"
    answered_questions:
      - "copilot is deprecated (user decision 2026-08-04)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-runtime-surface-coverage |
| **Completed** | — (audit phase done, implementation pending) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now have a complete, evidence-backed map of every place the repo still talks about three runtimes (Claude, Codex, OpenCode) when it actually ships six (`.opencode`, `.claude`, `.codex`, `.cursor`, `.pi`, `.devin`). The audit found 20+ stale enumeration sites, from the root AGENTS.md contract down to per-runtime SYNC.md manifests, and separated real gaps from non-issues — `sk-code`'s surface detection and the completed terminal-proof packet are both clean.

### Audit Deliverable

A scout subagent (openai-codex/gpt-5.6-sol, high thinking, fresh context, read-only) produced the gap inventory, categorized into hard gaps (AGENTS.md + CLAUDE.md mirror + README + advisor runtime enum + validation allowlists + orchestrator guidance), soft gaps (secondary skill docs, SYNC.md counts, doctor docs), and structural facts (all six runtime dirs exist; Devin has no MCP registration; Cursor dispatch is asymmetric; copilot is deprecated per user decision). The packet captures every finding with file:line evidence and turns them into REQ-001..008 with acceptance criteria.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Requirements REQ-001..008 from audit evidence; scope; decisions D-001..D-003 |
| `plan.md` | Created | 3-phase implementation approach with rollback and verification path |
| `tasks.md` | Created | T001..T022 task breakdown |
| `checklist.md` | Created | Verification gates for the six-surface claim |
| `implementation-summary.md` | Created | This document |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The audit ran as a read-only scout dispatch on gpt-5.6-sol at high thinking (run e8d44f53, exit 0, acceptance attested). Its findings were cross-checked against the repo structure (all six runtime dirs listed, MCP configs grepped) before being written into the packet. No implementation changes have been made yet — the packet is the approved plan for the next work session.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Do not claim Devin MCP registration | No checked-in Devin MCP config exists; a false support claim would break the honesty mandate |
| Remove copilot from the supported set | User confirmed copilot is deprecated (2026-08-04); no `.copilot/` surface exists, so the enum fix removes it rather than labeling it legacy |
| Generated mirrors are regenerated, never hand-edited | `.codex/agents` and `.pi/agents` are machine output; hand-editing creates drift that the roster checker flags |
| Historical completed specs stay historical | Rewriting past packets to current truth would corrupt the audit trail; only live docs get updated |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scout audit run (e8d44f53) | PASS — exit 0, full gap inventory with file:line evidence |
| All six runtime dirs exist | PASS — `.opencode`, `.claude`, `.codex`, `.cursor`, `.pi`, `.devin` listed |
| Packet scaffold | PASS — Level 2 template set created via create.sh (spec, plan, tasks, checklist, impl-summary, description.json, graph-metadata.json) |
| Implementation (T001-T022) | NOT STARTED — next session |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Line numbers are audit-snapshot references.** Files will shift as edits land; re-grep before each change rather than trusting quoted line numbers.
2. **Copilot deprecation is decided.** The enum fix removes copilot from the supported set (user decision 2026-08-04); any consumer still routing to copilot must be updated in the same change.
3. **Daemon restart needed after enum change.** The skill-advisor daemon caches runtime values; stale consumers may reject new enum entries until restarted.
<!-- /ANCHOR:limitations -->
