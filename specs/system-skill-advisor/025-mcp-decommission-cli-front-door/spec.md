---
title: "Feature Specification: skill advisor MCP decommission"
description: "Phase parent for removing the system_skill_advisor MCP transport and making the daemon-backed CLI the single front door, with no loss of capability, automatic routing, or operator-visible behavior"
trigger_phrases:
  - "skill advisor mcp decommission"
  - "advisor cli front door"
  - "advisor transport removal"
  - "skill advisor without mcp"
  - "advisor daemon protocol"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/025-mcp-decommission-cli-front-door"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "planner"
    recent_action: "Authored phase-parent spec and eight child scope boundaries"
    next_safe_action: "Plan child 001-transport-and-consumer-inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts"
      - ".opencode/bin/skill-advisor.cjs"
      - "opencode.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-session"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the resident daemon survive with a non-MCP protocol, or does the CLI run stateless?"
    answered_questions:
      - "Rename mcp-server/ to runtime/ inside this program rather than deferring it"
      - "One CLI front door for every caller, including the prompt hooks"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: skill advisor MCP decommission

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | None; track root `specs/system-skill-advisor/` |
| **Predecessor** | 024-routing-perfection-research |
| **Successor** | None |
| **Handoff Criteria** | No runtime config declares the advisor as an MCP server, the CLI answers every capability the MCP surface answered, and the prompt-time brief still arrives with no operator action |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The skill advisor is the last subsystem in this framework's own runtime that ships an MCP server, and that server owns no behavior.

Three measurements drive the removal:

1. **The transport is a pass-through.** `mcp-server/advisor-server.ts` is 347 lines. Its two SDK request handlers, list-tools and call-tool, both delegate to `dispatchTool` in `mcp-server/tools/index.ts`, which is already transport-agnostic and already serves the CLI over the same process.
2. **A working CLI already covers the whole surface.** `.opencode/bin/skill-advisor.cjs` reaches the daemon over a unix socket and its manifest declares all nine tools: the four advisor tools and the five skill-graph tools. A live `advisor_status` call through it round-trips to the daemon and returns a schema error from the real handler, so the path is exercised, not theoretical.
3. **The automatic routing everyone depends on never uses MCP.** The Claude prompt hook imports the advisor library in-process and falls back to the CLI shim. The Gate 2 brief that appears at the top of every session is produced on that path. MCP carries none of it.

What MCP does cost is real: a server declaration in five runtime config roots, an SDK dependency, a plugin bridge for OpenCode, an MCP-shaped JSON-RPC framing the CLI has to speak to its own daemon, and a second calling convention that every instruction surface has to describe alongside the first.

### Purpose

Make the daemon-backed CLI the single front door, delete the MCP transport and everything that exists only to serve it, and rename the package directory so nothing advertises a transport that is gone. Capability, automatic prompt-time routing, and operator-visible behavior all stay exactly as they are.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- All nine advisor and skill-graph tools reachable as CLI commands under a frozen JSON contract and a stable exit taxonomy.
- The daemon's fate settled by measurement rather than preference, including the protocol its socket speaks once MCP framing is gone.
- Every caller repointed at the CLI: the Claude prompt hook, the pi prompt hook, the OpenCode plugin, the doctor routes and their `allowed-tools`, and the skill and gate documentation that names the tool ids.
- Removal of the stdio transport, the `@modelcontextprotocol/sdk` dependency, the plugin bridge, the MCP JSON-RPC framing, and the server declaration in all five runtime config roots.
- The package directory rename from `mcp-server/` to `runtime/`, with every path, dist path, freshness check, import and document that names it.
- Documentation brought to current reality: architecture, README, SKILL.md, feature catalog, manual-testing playbook, install guides and the env reference.

### Out of Scope

- Routing quality. Lane weights, thresholds, the fusion, the scorer and the skill-graph schema are untouched, and no recommendation may change as a result of this work.
- Every other MCP server in the repository. Code Mode, Figma, Webflow, GitKraken and the rest keep their registrations; this packet touches only the advisor's.
- `system-spec-kit` and `system-deep-loop`. Both are read as the pattern to follow and neither is modified.
- The shared HF model server, its socket, and the shared IPC socket bridge under `@spec-kit/shared`. All three are preserved.
- The Python compatibility shim's own behavior, beyond whatever the rename and the doc sweep touch.

### Files to Change

Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/system-skill-advisor/mcp-server/skill-advisor-cli.ts` | Modify | 003 | Front-door contract, exit taxonomy, warm path |
| `.opencode/skills/system-skill-advisor/hooks/` | Modify | 004 | Claude and pi hooks onto the single seam |
| `.opencode/plugins/system-skill-advisor.js` | Modify | 004 | Plugin calls the CLI instead of the bridge |
| `.opencode/commands/doctor/` | Modify | 004 | Routes and `allowed-tools` off the MCP ids |
| `.opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts` | Delete | 005 | The stdio transport |
| `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/` | Delete | 005 | The OpenCode MCP bridge |
| `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.pi/mcp.json` | Modify | 005 | Five server declarations removed |
| `.opencode/bin/system-skill-advisor-launcher.cjs` | Modify | 005 | Daemon supervisor, not an MCP launcher |
| `.opencode/skills/system-skill-advisor/mcp-server/` | Move | 006 | Renamed to `runtime/` |
| `ARCHITECTURE.md`, `README.md`, `SKILL.md`, `feature-catalog/`, `manual-testing-playbook/` | Modify | 007 | Current-reality documentation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-transport-and-consumer-inventory/ | Research. Inventory every MCP surface, every caller, every flag and every document that names the tool ids, and record the preserve set and the behavior that must survive untouched | Complete |
| 2 | 002-daemon-transport-decision/ | Research. Measure the resident daemon against a stateless CLI on the real prompt-hook path, then freeze the socket protocol the CLI will speak | Complete |
| 3 | 003-cli-front-door-parity/ | Build. Make the CLI the complete documented front door: nine commands, frozen JSON contract, stable exit taxonomy, session warm path, and a harness proving per-tool output parity with the MCP surface | Complete |
| 4 | 004-caller-rewire/ | Build. Repoint the two prompt hooks, the OpenCode plugin, the doctor routes and every instruction surface at the CLI while MCP still exists as a fallback | Complete |
| 5 | 005-mcp-transport-removal/ | Build. Delete the stdio transport, the SDK dependency, the plugin bridge and the MCP framing, remove all five server declarations, and reduce the launcher to a daemon supervisor | Complete |
| 6 | 006-runtime-package-rename/ | Build. Rename `mcp-server/` to `runtime/` and carry every path, import, dist location, freshness check and reference with it | Complete |
| 7 | 007-docs-and-residue-sweep/ | Build. Bring architecture, README, SKILL.md, catalog, playbook, install guides and env reference to current reality, then sweep until no live surface describes an MCP server that exists | Complete |
| 8 | 008-verification-and-closeout/ | Gate. Cold-boot every runtime, prove the automatic brief still arrives, report the latency delta against the recorded baseline, run the suites, and validate the packet recursively | Complete |
| 9 | 009-deep-review-decommission/ | Audit. Hunt every surviving MCP reference and stale surface on a live instruction surface, then confirm the required findings actually close | Complete |
| 10 | 010-deep-research-residue/ | Audit. Study what the decommission teaches: which failures a promoted fallback exposes, what residue a transport removal leaves, and the checklist the next migration needs | Complete |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- **Ordering is load-bearing.** Nothing is deleted in phase 005 until phase 003 has a proven replacement and phase 004 has repointed every caller at it. Deleting earlier would leave Gate 2 routing without a mechanism, which is the one outcome this packet exists to prevent.
- **The rename waits for the removal.** Phase 006 runs after 005 so the move carries a tree that no longer contains a transport, and the rename diff stays mechanical instead of hiding deletions.

- **Implementation runs on DeepSeek V4.1 Flash at max thinking, through the LLM Gateway provider, dispatched by cli-pi.** The dispatch form is `pi --provider llmgateway --model llmgateway/deepseek-v4.1-flash --thinking max`; the gateway takes the bare model id and rejects a provider-prefixed one. Read `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md` before composing any brief for it. Briefs stay short, name one change, and carry literal text rather than description.
### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-transport-and-consumer-inventory | 003, 004, 005, 007 | Every MCP surface, caller, flag and document is classified as rewire, delete or preserve, with no unclassified rows | Inventory table complete; each row carries an owning phase |
| 002-daemon-transport-decision | 003-cli-front-door-parity | The daemon question is answered with measured numbers, and the socket protocol is frozen as a written contract | Benchmark output against the recorded hook-latency baseline; protocol contract committed |
| 003-cli-front-door-parity | 004-caller-rewire | Each of the nine tools returns byte-equivalent payloads through the CLI and through the MCP surface on a frozen input set | Parity harness output; exit-taxonomy test suite green |
| 004-caller-rewire | 005-mcp-transport-removal | No caller reaches the advisor through MCP, and the prompt brief still arrives in every runtime with MCP still registered | Caller sweep empty outside the server tree; per-runtime session start showing the brief |
| 005-mcp-transport-removal | 006-runtime-package-rename | No runtime config declares the advisor server, the SDK is absent from the dependency tree, and every runtime boots clean | Five config roots at zero hits; dependency tree check; cold boot per runtime |
| 006-runtime-package-rename | 007-docs-and-residue-sweep | Nothing outside history resolves a path under the old directory name, and the CLI still answers from the renamed tree | Path sweep; live CLI call after the move |
| 007-docs-and-residue-sweep | 008-verification-and-closeout | No live instruction surface presents the advisor as an MCP server or names a retired tool id | Residue sweep with reasoned exemptions listed |
| 008-verification-and-closeout | (packet complete) | Every parent completion criterion holds with evidence recorded against it | `validate.sh --recursive --strict` exits 0; goal DONE WHEN table fully populated |
| 008-verification-and-closeout | 009-deep-review-decommission | [Criteria TBD] | [Verification TBD] |
| 009-deep-review-decommission | 010-deep-research-residue | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **ANSWERED by phase 002: the resident daemon survives.** Cold start costs 3008 ms against 926 ms warm on the same daemon, so it is worth roughly 2082 ms per call. A stateless CLI would land between those two figures and beat neither. D3's inconclusive-keeps-the-daemon rule points the same way, so the decision is robust without building a stateless prototype.
- **What protocol does the socket speak once MCP framing is gone?** The CLI currently speaks MCP-shaped JSON-RPC to its own daemon over the shared bridge. Phase 002 must name the replacement and phase 003 must freeze it as a contract.
- **What warms the daemon at session start?** Today the MCP client connection starts it. With no MCP client, something has to take that job or the first prompt of every session pays cold start. The CLI already has a `--warm-only` mode; phase 003 must decide what invokes it.
- **Does the OpenCode plugin keep a resident path?** It shells out through a bridge today. Phase 004 must confirm a plain CLI spawn stays inside the plugin's latency budget, or name what it does instead.
- **ANSWERED by phase 001: the Python shim stays untouched.** The question assumed it was a fallback for callers that cannot reach MCP. It is not. It is called in production by the OpenCode plugin, the doctor parent-skill check, the deep-loop benchmark probe, two create-skill command assets and four modules inside the advisor package, and it never touched the transport. It is a preserve-set item.
- **Where do the five env blocks live after the declarations go?** Phase 001 found that the MCP server blocks also carry the database directory, the socket directory, the doc-trigger flag and the trust default, all of which the daemon still needs. The trust default is the sharp one: it grants trust to callers whose MCP metadata omits transport markers, so mutation commands fail closed if it is deleted without a CLI equivalent. Phase 005 must rehome them before deleting anything.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Packet goal**: See `goal.md` for the durable directive and the completion criteria
- **Pattern reference**: `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/` removed the sibling MCP subsystem and replaced it with a CLI plus committed index
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
