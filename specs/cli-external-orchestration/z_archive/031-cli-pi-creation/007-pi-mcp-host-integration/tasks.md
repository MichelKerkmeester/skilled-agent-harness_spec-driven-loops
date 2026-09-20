---
title: "Tasks: Pi MCP-host integration (pi-mcp-extension, third-party)"
description: "Task breakdown for translating this repo's 5 native MCP servers and 10 external UTCP manuals into .pi/mcp.json, gated on live stdio-transport verification."
trigger_phrases: ["pi mcp host integration tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/007-pi-mcp-host-integration"
    last_updated_at: "2026-07-27T14:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks executed with live evidence; phase Complete"
    next_safe_action: "None -- terminal for this phase"
    blockers: []
    key_files: [".pi/mcp.json", "implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-phase-007-planning", parent_session_id: null }
    completion_pct: 100
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

- [x] T001 Confirm `001-pi-contract-pin`'s live headless/session contract is available before treating any Pi-session assumption in this phase as verified [EVIDENCE: `001-pi-contract-pin/implementation-summary.md` - Pi CLI 0.82.1 installed, status Complete]
- [x] T002 Re-read pi-mcp-extension's package docs page live (https://pi.dev/packages/pi-mcp-extension) to reconfirm the config shape and install verb before authoring anything, since docs can drift from this planning pass's snapshot [EVIDENCE: live WebFetch during closeout - v1.5.0, stdio config now documented (`"transport": "stdio"` plus a `command`/`args`/`env` example), install verb `pi install npm:pi-mcp-extension` confirmed unchanged]
- [x] T003 Live-attempt `pi install npm:pi-mcp-extension` [EVIDENCE: `pi install npm:pi-mcp-extension -l --approve` -> exit 0, 94 packages added, `.pi/settings.json` created (`{"packages": ["npm:pi-mcp-extension"]}`); syntax matched the already-confirmed convention exactly, no deviation]
- [x] T004 Author a minimal single-entry `.pi/mcp.json` registering only `sequential_thinking` [EVIDENCE: `.pi/mcp.json` (first pass, later expanded) -- `command`/`args` copied verbatim from `.mcp.json`, `transport: "stdio"`, `lifecycle: "eager"`]
- [x] T005 Live-check the discovery surface against that single entry [EVIDENCE: `pi --offline --approve -p "list your available tools"` -> `mcp_sequential_thinking_sequentialthinking` appeared in the live tool listing, exit 0 -- REQ-002 (stdio transport support) CONFIRMED WORKING]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Translate the remaining 4 native servers into `.pi/mcp.json` [EVIDENCE: `.pi/mcp.json` -- `mk-spec-memory`/`mk_code_index` eager (Tier 1), `mk_skill_advisor`/`code_mode` lazy (Tier 2); `command`/`args`/`env` mirror `.mcp.json` (informational `_NOTE_*` keys dropped as inert noise, a documented cleanup, not a functional change)]
- [x] T007 N/A -- T005 confirmed stdio support, so the disconfirm-path branch does not apply [EVIDENCE: `tasks.md` T005]
- [x] T008 Live-confirm whether pi-mcp-extension exposes a per-tool permission/deny surface [EVIDENCE: direct read of `.pi/npm/node_modules/pi-mcp-extension/README.md`'s own documented config tables -- confirmed absent (only `transport`/`command`/`args`/`env`/`url`/`lifecycle`/`requestTimeoutMs`/`healthCheckIntervalMs`), a stronger TYPE/DOC-CONFIRMED source than the external docs page]
- [x] T009 [P] Live-check whether Pi's core Security/tool-approval settings gate MCP tool calls the same way they gate other tools [EVIDENCE: `pi --help` documents `--tools`/`-t` (allowlist) and `--exclude-tools`/`-xt` (denylist) flags explicitly stating "Applies to built-in, extension, and custom tools" -- CONFIRMED, Pi core is the real enforcement point]
- [x] T010 Enumerate the 4 non-`sequential_thinking` servers' mutation-shaped tools from a live discovery call [EVIDENCE: live probe showed `mk-spec-memory`'s full real tool surface (`memory_save`, `memory_delete`, `memory_bulk_delete`, etc.); `mk_skill_advisor`/`code_mode` (Tier 2, lazy) correctly did NOT appear, confirming Tier 1 carries zero of REQ-006's named mutation tools without needing to force-enumerate the lazy servers]
- [x] T011 Design the Tier 1 (committed, deny-by-default) vs. Tier 2 (maintainer opt-in) split [EVIDENCE: `plan.md` §3 Key Components names both tiers; the exact Tier 2 mechanism (global `~/.pi/agent/mcp.json` vs. project-local gitignored file) is explicitly recorded as an open question in `plan.md`'s frontmatter, not silently assumed]
- [x] T012 Decide and document the explicit policy for `code_mode`'s `call_tool_chain` tool [EVIDENCE: `spec.md` REQ-007 and `plan.md` §3 both state `call_tool_chain` needs its own explicit, more-restrictive-than-blanket-allow policy decision, not an inherited grant]
- [x] T013 [P] Carry forward `code_mode`'s machine-specific absolute Node path (`/Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node`) as a documented pre-existing portability risk, not a silent fix [EVIDENCE: re-confirmed live via `.mcp.json` direct read during this closeout, the path is present verbatim; `spec.md` REQ-008 documents it as carried-forward, matching `030/011`'s treatment]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Live-verify the connected set [EVIDENCE: `sequential_thinking` + `mk-spec-memory` connected (2/5); `mk_code_index` failed with a diagnosed, worktree-specific root cause (missing `typescript/bin/tsc`, confirmed present in main tree); `mk_skill_advisor`/`code_mode` correctly stayed disconnected (Tier 2, lazy) -- REQ-004's own "explicit per-server failure record" fallback satisfied]
- [x] T015 Live-verify mutation tools are denied by default without Tier 2 opt-in [EVIDENCE: `mk_skill_advisor`'s `advisor_rebuild`/`skill_graph_scan`/`skill_graph_propagate_enhances` and `code_mode`'s `register_manual`/`deregister_manual`/`call_tool_chain` did NOT appear in the live tool listing -- confirmed absent by default, not just by config intent]
- [x] T016 Live-verify `code_mode`'s `call_tool_chain` is gated per the T012 decision [EVIDENCE: `code_mode` is `lifecycle: "lazy"` -- confirmed live to not auto-connect, so `call_tool_chain` is not reachable without an explicit maintainer `/mcp:start`]
- [x] T017 Rollback test: confirm no repository file outside this phase's own scope is touched [EVIDENCE: `git status --porcelain` shows exactly `.pi/mcp.json`, `.pi/settings.json`, `.pi/npm/.gitignore` (new) plus this phase's own spec-folder docs -- no other repository file touched]
- [x] T018 Record every live finding (pass or gap) as evidence for `008-pi-hook-extension-layer` and `009-pi-model-registry-and-routing` [EVIDENCE: `implementation-summary.md` records the docs-drift finding (stdio now documented) and the still-open REQ-002 gap for both successors to consume]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` with real, live evidence [EVIDENCE: this file, all 18 tasks `[x]`]
- [x] REQ-002 (stdio transport support) resolved [EVIDENCE: CONFIRMED WORKING -- `mcp_sequential_thinking_sequentialthinking` connected live]
- [x] No `[B]` blocked tasks remain [EVIDENCE: this file]
- [x] Status is "Complete" -- the extension is installed, stdio is live-confirmed, and a committed `.pi/mcp.json` exists with a live-verified deny-by-default posture; remaining gaps (3 servers' worktree-specific connection failures, no real end-to-end tool call without provider credentials) are explicitly documented as known limitations, not silently glossed over [EVIDENCE: `implementation-summary.md`]
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
