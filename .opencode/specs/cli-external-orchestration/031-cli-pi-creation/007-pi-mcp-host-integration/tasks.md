---
title: "Tasks: Pi MCP-host integration (pi-mcp-extension, third-party)"
description: "Task breakdown for translating this repo's 5 native MCP servers and 10 external UTCP manuals into .pi/mcp.json, gated on live stdio-transport verification."
trigger_phrases: ["pi mcp host integration tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/007-pi-mcp-host-integration"
    last_updated_at: "2026-07-27T10:22:00Z"
    last_updated_by: "claude-code"
    recent_action: "Pre-work tasks complete; install-dependent tasks deferred, phase Blocked"
    next_safe_action: "Commit as Blocked; phase 008 proceeds independently"
    blockers: ["Installing pi-mcp-extension crosses this phase's own Hard Constraint (planning only); deferred to a future execution phase"]
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-phase-007-planning", parent_session_id: null }
    completion_pct: 60
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
- [B] T003 Live-attempt `pi install npm:pi-mcp-extension`; if the real syntax differs from this inferred convention, record the actual observed syntax [DEFERRED: out of this planning phase's own scope per spec.md's Hard Constraint - this phase does not run `pi install` or any system-mutating command; a future execution phase performs this step]
- [B] T004 Author a minimal single-entry `.pi/mcp.json` registering only `sequential_thinking` as a stdio server (lowest-risk probe: stateless, no repo write access, no credentials) [DEFERRED: out of this planning phase's own scope, same reason as T003]
- [B] T005 Live-check `/mcp` (or equivalent discovery surface) in a Pi session against that single entry — this is the go/no-go test for REQ-002 (stdio transport support), the phase's primary open risk [DEFERRED: out of this planning phase's own scope, same reason as T003]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [B] T006 If T005 confirms stdio support: translate the remaining 4 native servers (`mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`, `code_mode`) from `.mcp.json`'s `command`/`args`/`env` shape into `.pi/mcp.json` [DEFERRED: gated on T005, itself deferred out of this planning phase's own scope]
- [B] T007 If T005 disconfirms stdio support: document the gap explicitly (exact error/behavior observed, verbatim) and scope the rest of this phase down to a documented limitation, not a worked-around config [DEFERRED: gated on T005]
- [B] T008 Live-confirm (or disconfirm) whether pi-mcp-extension exposes any per-tool permission/deny surface beyond `transport`/`url`/`lifecycle` [DEFERRED: requires a live installed session, out of this planning phase's own scope - the live docs re-fetch already confirmed no such field is DOCUMENTED (T002), but documented-absence is not the same as live-confirmed-absence]
- [B] T009 [P] If no per-tool surface exists inside pi-mcp-extension, live-check whether Pi's core Security/tool-approval settings (documented under Getting Started > Security) gate MCP tool calls the same way they gate other tools [DEFERRED: requires a live installed session, out of this planning phase's own scope]
- [B] T010 Enumerate each of the 4 non-`sequential_thinking` servers' mutation-shaped tools from a live discovery call, not source inspection alone [DEFERRED: requires a live installed session; the source-inspection cross-check itself was re-verified this closeout - `.mcp.json`'s own inline env notes confirm `mk_skill_advisor`'s `advisor_rebuild`/`skill_graph_scan`/`skill_graph_propagate_enhances` mutation tools verbatim]
- [x] T011 Design the Tier 1 (committed, deny-by-default) vs. Tier 2 (maintainer opt-in) split [EVIDENCE: `plan.md` §3 Key Components names both tiers; the exact Tier 2 mechanism (global `~/.pi/agent/mcp.json` vs. project-local gitignored file) is explicitly recorded as an open question in `plan.md`'s frontmatter, not silently assumed]
- [x] T012 Decide and document the explicit policy for `code_mode`'s `call_tool_chain` tool [EVIDENCE: `spec.md` REQ-007 and `plan.md` §3 both state `call_tool_chain` needs its own explicit, more-restrictive-than-blanket-allow policy decision, not an inherited grant]
- [x] T013 [P] Carry forward `code_mode`'s machine-specific absolute Node path (`/Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node`) as a documented pre-existing portability risk, not a silent fix [EVIDENCE: re-confirmed live via `.mcp.json` direct read during this closeout, the path is present verbatim; `spec.md` REQ-008 documents it as carried-forward, matching `030/011`'s treatment]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [B] T014 Live-verify `/mcp` shows the full expected connected set (up to 5 servers, contingent on T005/T006's outcome) [DEFERRED: gated on T005]
- [B] T015 Live-verify a representative mutation tool from each server is denied/asked by default without any Tier 2 opt-in, or record the absence of any deny mechanism as an explicit, documented gap [DEFERRED: gated on T005]
- [B] T016 Live-verify `code_mode`'s `call_tool_chain` is gated per the T012 decision, not left at an implicit allow [DEFERRED: gated on T005]
- [B] T017 Rollback test: remove/disable the config, confirm no repository database or source file is touched (`git status`/`git diff` clean outside `.pi/`) [DEFERRED: gated on T005; this closeout's own real edits stay scoped inside this phase folder, confirmed via `git status --porcelain`]
- [x] T018 Record every live finding (pass or gap) as evidence for `008-pi-hook-extension-layer` and `009-pi-model-registry-and-routing` [EVIDENCE: `implementation-summary.md` records the docs-drift finding (stdio now documented) and the still-open REQ-002 gap for both successors to consume]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or explicitly `[B]` with a documented reason [EVIDENCE: this file - 6 `[x]` (T001/T002/T011/T012/T013/T018), 12 `[B]` all carrying a `[DEFERRED: ...]` reason]
- [B] REQ-002 (stdio transport support) resolved one way or the other, never left ambiguous [DEFERRED: docs now show a stdio config shape (narrowing the question), but live-connecting it requires installing pi-mcp-extension - out of this planning phase's own scope, deferred to a future execution phase]
- [x] Every `[B]` blocked task carries an explicit reason tied to this phase's own Hard Constraint (no `pi install`) [EVIDENCE: this file]
- [x] Status stays "Blocked" (not "Complete", not "Planned") until a future execution pass actually installs pi-mcp-extension and resolves REQ-002 — this closeout's own completion is "planning re-verified live where possible, primary gate honestly still open," not "built" [EVIDENCE: `implementation-summary.md`]
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
