---
title: "Tasks: Devin MCP-host integration"
description: "Task breakdown for registering this repo's 3 MCP servers with Devin under a two-tier permission policy."
trigger_phrases: ["devin mcp host integration tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/009-devin-mcp-host-integration"
    last_updated_at: "2026-07-24T06:43:46Z"
    last_updated_by: "claude-code"
    recent_action: "Authored task breakdown; all tasks unchecked, phase Planned"
    next_safe_action: "Start T001 live contract verification once auth available"
    blockers: ["devin auth login needed for live verification"]
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Devin MCP-host integration

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that can run in parallel; `[B]` marks a blocked task pending a decision.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Live-verify `devin mcp add/list/get/remove/enable/disable` + config schema against an authenticated session
- [ ] T002 Confirm whether Devin normalizes hyphenated server IDs (e.g. `mk-spec-memory`) to underscores in emitted tool names
- [ ] T003 Confirm the absence of a `cwd` field in Devin's MCP config schema and the scope-precedence order (local/project/user)
- [ ] T004 [B] Resolve all 4 ADRs in `decision-record.md` before writing config
- [ ] T005 Enumerate the exact mutation-tool list per server from a live `tools/list` call, cross-checked against `tool-schemas.ts` source (not assumed exhaustive from source alone)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T006 Author `.devin/config.json` (Tier 1): 3 stdio `mcpServers` entries (`mk-spec-memory`, `mk_code_index`, `mk_skill_advisor` → their existing `.opencode/bin/*-launcher.cjs` scripts)
- [ ] T007 Add exact per-tool read-only `permissions` allows to `.devin/config.json` for all non-mutation tools
- [ ] T008 Add explicit deny/ask entries to `.devin/config.json` for every T005-enumerated mutation tool - no `MK_SKILL_ADVISOR_TRUST_DEFAULT` anywhere in this file
- [ ] T009 [P] Author `.devin/config.local.json.example` (Tier 2 template): optional provider secrets + explicit `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` opt-in with a "do not commit the real file" inline warning
- [ ] T010 Update `.gitignore` to protect the real `.devin/config.local.json`
- [ ] T011 Choose and document an embedding tier for `mk-spec-memory` under Devin's sandbox (Ollama / hf-local / cloud), with no silent laptop-daemon dependency
- [ ] T012 [P] Author `cli-external-orchestration/cli-devin/references/mcp-host-integration.md` (two-tier policy, acceptance matrix, cwd/bootstrap contract, rollback steps); cross-ref from `cli-devin/SKILL.md`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T013 Live clean-session smoke: `devin mcp add` for all 3 servers, `list`/`get`, `tools/list` discovery, one read-only call per server
- [ ] T014 Live deny-confirmation: attempt each T005-enumerated mutation tool without Tier 2 opt-in - confirm deny/ask
- [ ] T015 Live wildcard-survival: grant a session-level "allow all tools on this server," confirm the project-level deny still wins
- [ ] T016 Live cross-session-mode: confirm all 3 launchers resolve from repo root in fresh, resumed, sandboxed, and handed-off sessions
- [ ] T017 Live cold-bootstrap: confirm native modules (`better-sqlite3`, `sqlite-vec`, tree-sitter/WASM) build/resolve on Devin's Linux without assuming prebuilt artifacts
- [ ] T018 Rollback test: disable/remove the 3 entries, confirm no repository database or source file is touched
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] T019 Re-evaluate `008-devin-hook-parity`'s `mcp-route-guard.cjs` dormancy note now that real MCP servers are registered
- [ ] T020 Finalize `implementation-summary.md`; `validate.sh --strict` → 0 errors; update parent `spec.md`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Re-evaluates `../008-devin-hook-parity/` (`mcp-route-guard.cjs` dormancy).
- Depends only on `../001-devin-contract-pin/` (Complete).
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`, `decision-record.md`
