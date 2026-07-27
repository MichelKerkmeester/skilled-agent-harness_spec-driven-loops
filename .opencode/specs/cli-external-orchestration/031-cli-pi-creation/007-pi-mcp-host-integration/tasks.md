---
title: "Tasks: Pi MCP-host integration (pi-mcp-extension, third-party)"
description: "Task breakdown for translating this repo's 5 native MCP servers and 10 external UTCP manuals into .pi/mcp.json, gated on live stdio-transport verification."
trigger_phrases: ["pi mcp host integration tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/007-pi-mcp-host-integration"
    last_updated_at: "2026-07-27T07:55:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored 18-task breakdown across 3 phases; all tasks unchecked, phase Planned"
    next_safe_action: "Start T001 once phase 001/006 are available"
    blockers: ["stdio transport support in pi-mcp-extension is unconfirmed from docs"]
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-phase-007-planning", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pi MCP-host integration (pi-mcp-extension, third-party)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm `001-pi-contract-pin`'s live headless/session contract is available before treating any Pi-session assumption in this phase as verified
- [ ] T002 Re-read pi-mcp-extension's package docs page live (https://pi.dev/packages/pi-mcp-extension) to reconfirm the config shape and install verb before authoring anything, since docs can drift from this planning pass's snapshot
- [ ] T003 [B] Live-attempt `pi install npm:pi-mcp-extension`; if the real syntax differs from this inferred convention, record the actual observed syntax
- [ ] T004 Author a minimal single-entry `.pi/mcp.json` registering only `sequential_thinking` as a stdio server (lowest-risk probe: stateless, no repo write access, no credentials)
- [ ] T005 Live-check `/mcp` (or equivalent discovery surface) in a Pi session against that single entry — this is the go/no-go test for REQ-002 (stdio transport support), the phase's primary open risk
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 [B] If T005 confirms stdio support: translate the remaining 4 native servers (`mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`, `code_mode`) from `.mcp.json`'s `command`/`args`/`env` shape into `.pi/mcp.json`
- [ ] T007 If T005 disconfirms stdio support: document the gap explicitly (exact error/behavior observed, verbatim) and scope the rest of this phase down to a documented limitation, not a worked-around config
- [ ] T008 Live-confirm (or disconfirm) whether pi-mcp-extension exposes any per-tool permission/deny surface beyond `transport`/`url`/`lifecycle`
- [ ] T009 [P] If no per-tool surface exists inside pi-mcp-extension, live-check whether Pi's core Security/tool-approval settings (documented under Getting Started > Security) gate MCP tool calls the same way they gate other tools
- [ ] T010 Enumerate each of the 4 non-`sequential_thinking` servers' mutation-shaped tools from a live discovery call, not source inspection alone, cross-checked against what is already known from `.mcp.json`'s own inline env notes (e.g. `mk_skill_advisor`'s `advisor_rebuild`/`skill_graph_scan`/`skill_graph_propagate_enhances`)
- [ ] T011 Design the Tier 1 (committed, deny-by-default) vs. Tier 2 (maintainer opt-in) split, explicitly deciding whether Tier 2 is the maintainer's own global `~/.pi/agent/mcp.json` or a project-local gitignored file — confirmed against which mechanism pi-mcp-extension's project/global override semantics actually support, not assumed from Devin's differently-shaped precedent
- [ ] T012 Decide and document the explicit policy for `code_mode`'s `call_tool_chain` tool, since it alone fans out to all 10 external UTCP manuals (several write-capable: ClickUp task creation, GitHub writes, GitKraken)
- [ ] T013 [P] Carry forward `code_mode`'s machine-specific absolute Node path (`/Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node`) as a documented pre-existing portability risk, not a silent fix, mirroring how `030/011` treated the identical entry for Cursor
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Live-verify `/mcp` shows the full expected connected set (up to 5 servers, contingent on T005/T006's outcome)
- [ ] T015 Live-verify a representative mutation tool from each server is denied/asked by default without any Tier 2 opt-in, or record the absence of any deny mechanism as an explicit, documented gap
- [ ] T016 Live-verify `code_mode`'s `call_tool_chain` is gated per the T012 decision, not left at an implicit allow
- [ ] T017 Rollback test: remove/disable the config, confirm no repository database or source file is touched (`git status`/`git diff` clean outside `.pi/`)
- [ ] T018 Record every live finding (pass or gap) as evidence for `008-pi-hook-extension-layer` and `009-pi-model-registry-and-routing`, since both inherit whatever MCP-adjacent context this phase produces
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or explicitly `[B]` with a documented resolution
- [ ] REQ-002 (stdio transport support) resolved one way or the other, never left ambiguous
- [ ] No `[B]` blocked tasks remaining unresolved
- [ ] Status stays "Planned" until a future execution pass actually runs these tasks — this authoring pass's own completion is "planning complete, falsifiable," not "built"
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- Depends on `../001-pi-contract-pin/` (live session/headless contract) and `../006-pi-agent-bridge/` (immediate predecessor, sequencing only)
- Feeds `../008-pi-hook-extension-layer/` (per the packet's handoff-criteria table) and, indirectly, `../003-cli-pi-skill-packet/` (eventual home for the `mcp-host-integration.md` reference doc)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
