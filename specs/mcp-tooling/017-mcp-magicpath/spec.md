---
title: "Feature Specification: MagicPath tool bridge over the CLI transport"
description: "MagicPath ships no MCP server; its agent integration is a Node CLI plus vendor-written skill files. This decomposition reaches it through Code Mode's CLI transport and gives it a mode packet under the mcp-tooling hub."
trigger_phrases:
  - "magicpath skill"
  - "magicpath cli bridge"
  - "utcp cli manual"
  - "magicpath code mode"
  - "mcp-magicpath"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/017-mcp-magicpath"
    last_updated_at: "2026-08-29T12:31:29Z"
    last_updated_by: "session"
    recent_action: "Routed the mode through the hub; only verification remains"
    next_safe_action: "Execute 005-playbook-and-verification"
    blockers:
      - "The installed CLI reports authenticated:false; live calls beyond `info` need `magicpath-ai login` or MAGICPATH_TOKEN"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 75
    open_questions:
      - "Whether the mutating command family is exposed as tools or left to the operator"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: MagicPath tool bridge over the CLI transport

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | mcp-tooling |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | An agent reaches MagicPath through `call_tool_chain` against a registered manual, and the hub routes a MagicPath request to a mode packet that documents the real command surface |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

MagicPath has no MCP server. The request that opened this packet assumed one, and the assumption does not survive contact with what the vendor publishes.

`magicpath-ai` is the only MagicPath package on npm. Its dependency list carries no `@modelcontextprotocol/sdk`, and the string `mcp` appears zero times in its shipped CLI bundle. Its published integration path is not a protocol at all: `setup-skills` writes vendor-authored instruction files into `.claude/skills/magicpath/SKILL.md`, `.cursor/rules/magicpath.mdc` and `.github/instructions/magicpath.instructions.md`, and the agent is expected to read those and shell out.

That leaves a gap between how this repository reaches every other external tool and how it would reach this one. All thirteen manuals registered in `.utcp_config.json` are `call_template_type: "mcp"`, so the established path has nothing to bind to. Meanwhile the vendor's own answer - drop instruction files into three runtime directories - bypasses the hub, the advisor and the mode registry that every other tool bridge routes through, and would leave MagicPath the only external surface this repository cannot describe in its own terms.

The transport to close that gap already exists and is already installed. `@utcp/cli@1.1.0` sits in the Code Mode server's dependencies beside `@utcp/mcp`, and it registers a manual whose tools are command templates rather than protocol calls. Nothing in the repository uses it yet.

### Purpose

Reach MagicPath the way this repository reaches everything else - one registered manual, called through Code Mode, described by a mode packet under the hub that routes to it - using the transport that matches what the vendor actually ships.

### Phase Qualification

Recorded so the parent's declared level is not mistaken for a claim that the work is small.

The work qualifies for phased decomposition on both counts: it spans five surfaces (a transport, a registration, a packet, hub metadata, a playbook), introduces an external dependency with its own credential and release cadence, and produces well beyond five hundred lines across the packet and its documents. The complexity sits in the mid-twenties on the fifty-point scale, driven by the number of independent surfaces rather than by any one being hard.

The parent document itself declares Level 2, matching every phase parent in this repository. That is a property of the document, not of the work: a phase parent carries the lean trio and no plan or tasks file, and the AI-protocol rule that Level 3 triggers reads only those two files, so a Level 3 marker here is unsatisfiable by construction rather than by omission. The depth lives in the five children.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- One or more `cli` manuals in `.utcp_config.json` exposing the MagicPath command surface through Code Mode.
- Authentication wiring through the dotenv loader already configured for this repository.
- A `mcp-magicpath` mode packet under the `mcp-tooling` hub, authored against the `sk-create-skill` contract.
- The hub metadata that makes the mode routable: mode registry, hub router, leaf manifest, router and readme surfaces.
- A manual-testing playbook and the end-to-end verification that the bridge answers.

### Out of Scope

- Writing an MCP server for MagicPath. The vendor ships none, and standing one up would mean owning a protocol surface that breaks whenever their CLI changes.
- The vendor's own `setup-skills` output. Those three instruction files are the vendor's integration for agents that have no hub; this repository has one, and running that command would scatter a competing MagicPath instruction surface across three runtime directories.
- Node interpreter resolution hardening. The resolver exists because a wrong interpreter segfaults a native addon uncatchably; `magicpath-ai` has no native addon and an open `>=16.0.0` floor, so nothing here would consult it. The parser's refusal of open-ended lower bounds is recorded as a finding against the resolver's own packet, not fixed here.
- Any change to the thirteen existing manuals or to the Code Mode server itself.

### Files to Change

Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.utcp_config.json` | Modify | 002 | Register the MagicPath manual; the transport proof needed no change here, since a manual can be registered at runtime |
| A discovery emitter, path to be decided | Create | 002 | The `cli` transport registers a manual by executing a command whose stdout IS a UTCP manual, so the tool definitions need an emitter this repository owns |
| `.env.example` | Modify | 002 | Record the MagicPath token variable without its value |
| `.opencode/skills/mcp-tooling/mcp-magicpath/SKILL.md` | Create | 003 | The mode packet's entry contract |
| `.opencode/skills/mcp-tooling/mcp-magicpath/README.md` | Create | 003 | Packet readme |
| `.opencode/skills/mcp-tooling/mcp-magicpath/references/` | Create | 003 | Command surface and auth reference |
| `.opencode/skills/mcp-tooling/mcp-magicpath/assets/` | Create | 003 | The registered manual, documented as an asset |
| `.opencode/skills/mcp-tooling/mcp-magicpath/changelog/` | Create | 003 | First changelog entry |
| `.opencode/skills/mcp-tooling/mode-registry.json` | Modify | 004 | Declare the mode, its packetKind and backendKind |
| `.opencode/skills/mcp-tooling/hub-router.json` | Modify | 004 | Route the mode |
| `.opencode/skills/mcp-tooling/leaf-manifest.json` | Modify | 004 | Regenerated, never hand-edited |
| `.opencode/skills/mcp-tooling/ROUTER.md` | Modify | 004 | Router prose |
| `.opencode/skills/mcp-tooling/README.md` | Modify | 004 | Hub readme member list |
| `.opencode/skills/mcp-tooling/mcp-magicpath/manual-testing-playbook/` | Create | 005 | Operator scenarios |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-cli-transport-proof/ | Prove a `cli` manual registers and answers through Code Mode, using one read-only command, before anything depends on it | Complete |
| 2 | 002-manual-and-auth/ | Build the discovery emitter the transport requires, register the real command surface through it, and wire the token through the loader this repository already uses | In Progress |
| 3 | 003-skill-packet/ | Author the `mcp-magicpath` mode packet against the create-skill contract | In Progress |
| 4 | 004-hub-integration/ | Make the mode routable: registry, router, regenerated manifest, hub prose | Complete |
| 5 | 005-playbook-and-verification/ | Operator scenarios and the end-to-end proof that the bridge answers | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-cli-transport-proof | 002-manual-and-auth | A `cli` manual is callable through Code Mode and returns parsed output | A `call_tool_chain` against the probe manual returns the CLI's own JSON, not an error |
| 002-manual-and-auth | 003-skill-packet | The registered surface answers for an authenticated operator, and refuses legibly without a token | Read-only tools return data; with no token the failure names the missing credential |
| 003-skill-packet | 004-hub-integration | The packet exists and validates against the create-skill contract | The packaging gate passes for the new packet |
| 004-hub-integration | 005-playbook-and-verification | The hub resolves a MagicPath request to the mode | The fleet metadata audit passes with the mode present and the leaf manifest regenerated |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Settled**: the CLI is upgraded to 2.6.1, so the published readme and the installed build agree. The upgrade surfaced a replacement concern worth carrying: `info -o json` reports a stale command list that omits `create-project` and `skills`, so `--help` is the only authoritative surface for validating declared tools.
- Whether the mutating command family (`add`, `code`, `image`, `create-project`, `clone`) is exposed as callable tools or left to the operator. Every other transport in this hub declares `mutatesWorkspace:false`, and `add` writes `.tsx` files and installs npm packages into the calling project.
- Whether one manual covers the whole surface or the read-only and mutating families are registered separately, so the mutation boundary is visible in the registration rather than only in prose.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
