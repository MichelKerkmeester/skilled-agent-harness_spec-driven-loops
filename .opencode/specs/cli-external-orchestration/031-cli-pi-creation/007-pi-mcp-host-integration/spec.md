---
title: "Feature Specification: Pi MCP-host integration (pi-mcp-extension, third-party)"
description: "Plan translating this repo's 5 native MCP servers plus 10 external UTCP manuals from .mcp.json into .pi/mcp.json via the third-party pi-mcp-extension package under a deny-by-default policy, centered on the unconfirmed question of whether pi-mcp-extension supports stdio transport at all."
trigger_phrases: ["pi mcp host integration", "pi-mcp-extension", "pi mcp.json stdio transport"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/007-pi-mcp-host-integration"
    last_updated_at: "2026-07-27T10:22:00Z"
    last_updated_by: "claude-code"
    recent_action: "Docs re-fetched live: stdio config now documented; pre-work re-verified"
    next_safe_action: "Commit as Blocked; phase 008 proceeds independently (no functional coupling)"
    blockers: ["Installing pi-mcp-extension and live-confirming the now-documented stdio config crosses this phase's own Hard Constraint (planning only); deferred to a future execution phase"]
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-phase-007-planning", parent_session_id: null }
    completion_pct: 60
    open_questions: ["Does pi-mcp-extension support a stdio transport (command/args/env) for local Node-process servers at all?", "Does pi-mcp-extension expose any per-tool permission/deny surface, or must deny-by-default route through Pi's core Security/tool-approval settings instead?"]
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pi MCP-host integration (pi-mcp-extension, third-party)

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Blocked - planning re-verified live where possible (docs re-fetch found a material update: stdio config is now documented); the primary go/no-go gate (REQ-002, live-confirming that config actually connects) requires installing pi-mcp-extension, which is out of this phase's own Hard Constraint (planning only) — deferred to a future execution phase, not silently skipped |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 11 |
| **Predecessor** | 006-pi-agent-bridge |
| **Successor** | 008-pi-hook-extension-layer |
| **Handoff Criteria** | pi-mcp-extension is installed and `/mcp` in-session shows at least the 5 native MCP servers connected under a deny-by-default policy (or the stdio-transport gap is explicitly documented as unresolved). |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the CLI Pi creation specification.

**Scope Boundary**: Planning only, for the third-party `pi-mcp-extension` package that would give Pi CLI access to this repo's MCP servers. Covers the translation design from `.mcp.json` into `.pi/mcp.json`'s documented shape, and the deny-by-default policy design mirroring `029-cli-devin-revival/009-devin-mcp-host-integration`. Does not cover Pi's native, first-party Extensions/Skills/Prompt-templates surfaces (those are phases 3-5) or the pi-subagents package (phase 6).

**Dependencies**:
- `001-pi-contract-pin` — the live Pi session/headless contract every downstream assumption in this phase rests on.
- `006-pi-agent-bridge` (immediate predecessor, per the packet's phase sequencing) — sequencing only; no functional coupling between agent-bridge and MCP-host work.
- The third-party `pi-mcp-extension` npm package itself — this phase cannot proceed past its first live check without it installing and loading cleanly.

**Deliverables**:
- A live-verified answer to the phase's primary risk: does pi-mcp-extension support a stdio transport for local command-based servers at all.
- A designed (not yet committed, since this phase is planning-only) two-tier `.pi/mcp.json` translation of `.mcp.json`'s 5 native servers, contingent on that answer.
- A designed deny-by-default mutation policy, with its actual enforcement point (pi-mcp-extension permission surface vs. Pi core Security settings vs. neither) named as an open question for live resolution, not assumed.
- A scoped, explicit policy question for `code_mode`'s `call_tool_chain` tool, which alone fans out to all 10 external UTCP manuals.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This repo runs 5 native MCP servers (`sequential_thinking`, `mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`, `code_mode`) that Claude Code and OpenCode already reach via `.mcp.json`'s stdio `{command, args, env}` shape, plus 10 external UTCP manuals (`chrome_devtools_1/2`, `aside`, `clickup_official`, `figma`, `github`, `gitkraken`, `open_design`, `refero`, `mobbin`) reached transitively through `code_mode`'s own tool surface. Pi CLI has no first-party MCP support at all — the only path is a third-party, community-maintained package, `pi-mcp-extension` (https://pi.dev/packages/pi-mcp-extension, author `irahardianto`, v1.5.0), which is explicitly **not built into core Pi**.

**Correction from a live re-fetch at this phase's 2026-07-27 closeout** (superseding this phase's original authoring-time premise): the docs page now documents an explicit stdio config shape — `"command": "/path/to/pathfinder-mcp", "transport": "stdio", "lifecycle": "eager"`, plus an args/env variant (`"command": "npx", "args": ["-y", "@context7/mcp"], "env": {"NODE_ENV": "production"}`) — alongside the remote `streamable-http` + `url` example this phase was originally authored against. This narrows REQ-002 from "determine whether stdio is even possible" to "confirm the now-documented stdio config actually connects in a live session" — still genuinely unconfirmed (docs vs. live behavior), but a materially smaller gap than originally scoped. No per-tool permission/deny field is documented either way (config table: `transport`/`command`/`args`/`env`/`url`/`lifecycle`/`requestTimeoutMs`/`healthCheckIntervalMs` only) — REQ-005's premise is unchanged.

### Purpose
Produce a concrete, falsifiable plan — not yet executed — for installing pi-mcp-extension, live-verifying stdio transport support as the phase's primary go/no-go gate, and (contingent on that result) translating `.mcp.json`'s 5 servers into `.pi/mcp.json` under a deny-by-default mutation policy that mirrors `029/009`'s two-tier design intent, while explicitly flagging every claim that rests on documentation rather than live Pi behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Planning the install of `pi-mcp-extension` (`pi install npm:pi-mcp-extension`; exact syntax pending live confirmation, likely in phase 1) and reading its actual, current config surface before authoring anything.
- Planning the live verification of pi-mcp-extension's stdio transport support — the phase's PRIMARY open risk, per the phase focus — using the lowest-risk possible probe (`sequential_thinking`, a stateless server with no repo write access and no credentials) before touching any of the other 4 servers.
- Planning the translation of `.mcp.json`'s 5 native stdio entries into `.pi/mcp.json`'s documented shape, contingent on that verification succeeding.
- Planning how the 10 external UTCP manuals are represented: NOT as 10 separate `.pi/mcp.json` entries, but transitively through the single `code_mode` stdio entry's own MCP tool surface (`call_tool_chain`, `search_tools`, `list_tools`, `register_manual`, `deregister_manual`, `tool_info`, `get_required_keys_for_tool`) — mirroring how `030-cli-cursor-creation/011-cursor-mcp-wiring-and-route-guard-fix` explicitly kept those same external manuals out of `.cursor/mcp.json` as separate entries for the identical reason.
- Designing a two-tier deny-by-default posture mirroring `029/009`'s design intent (a committed, minimal, no-mutation-by-default tier plus a maintainer-opt-in tier that is never silently inherited), while explicitly flagging that pi-mcp-extension's own documented config surface (`transport`/`url`/`lifecycle`) shows no visible per-tool permission/deny mechanism, unlike Devin's `devin mcp` matchers — so the enforcement point itself is an open question this phase must resolve live, not assume.
- Naming the target path for a future `cli-pi/references/mcp-host-integration.md` reference doc (to be authored once the `cli-pi` skill packet exists in phase 3), documenting the policy, acceptance matrix, and rollback steps.
- Explicitly deciding a policy question for `code_mode`'s `call_tool_chain` tool, since a single coarse allow on `code_mode` would implicitly grant reach into all 10 external, several write-capable, UTCP manuals.

### Out of Scope
- Actually running `pi install`, editing `.pi/mcp.json`, or any other system-mutating command — this phase is planning only, per the packet-wide hard constraint.
- Any CLI-executor or deep-loop dispatch concern (`002-deep-loop-executor-support`).
- Building the `cli-pi` skill packet itself (`003-cli-pi-skill-packet`) — this phase names the future reference doc's target path but does not create the packet or the doc.
- Pi's native, first-party Extensions/Skills/Prompt-templates surfaces (`003`-`005`) — those ship with Pi core; this phase's subject, MCP, explicitly does not.
- `pi-subagents` (`006-pi-agent-bridge`) — a different third-party package with a different install/config surface.
- Resolving whether a local stdio-to-streamable-http shim is worth building if stdio turns out unsupported — recorded as an open question, not committed scope.

### Files to Change

This phase authors planning content only; it modifies no file outside this phase folder. The table below lists the **future** targets a later, execution-phase pass would touch, contingent on this phase's own live-verification requirements resolving favorably — none of these exist yet and none are created by this planning pass.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/mcp.json` | Create (future) | Tier 1, committed: up to 5 stdio entries translated from `.mcp.json`, contingent on REQ-002; no server carrying a known mutation tool gets a default allow. |
| `.pi/mcp.local.json` or the maintainer's own `~/.pi/agent/mcp.json` (exact mechanism TBD, see REQ-006) | Create (future) | Tier 2, maintainer-opt-in, never committed. |
| `.gitignore` | Modify (future) | Protect the real Tier 2 file, if a project-local one is confirmed to be the correct mechanism. |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/mcp-host-integration.md` | Create (future, depends on phase 3 existing) | Policy, acceptance matrix, rollback steps. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Install pi-mcp-extension via the documented package install verb (`pi install npm:pi-mcp-extension`) and confirm it loads without error in a live Pi session. | A live session shows the package loaded (no startup error), and the exact observed install syntax is recorded verbatim, since it may differ from the inferred `pi install npm:<pkg>` convention. |
| REQ-002 | Live-confirm whether pi-mcp-extension's MCP client supports a stdio transport (`command`/`args`/`env`) for local Node-process servers, since the only documented config example uses `"transport": "streamable-http"` plus a remote `url`. | A single-entry `.pi/mcp.json` registering only `sequential_thinking` as a stdio server either connects and its tool is callable via `/mcp`, or a specific, verbatim-recorded failure/rejection is observed — either outcome resolves REQ-002, silence or assumption does not. |
| REQ-003 | **Given** pi-mcp-extension is installed and stdio support is confirmed by REQ-002, **when** `.pi/mcp.json` registers `sequential_thinking` as a stdio entry mirroring `.mcp.json`'s own `command`/`args`, **then** a live Pi session shows the server connected and its single tool callable end-to-end. | Live `/mcp` (or equivalent discovery surface) output captured as evidence, not inferred from config validity alone. |
| REQ-004 | **Given** the same stdio confirmation, **when** `.pi/mcp.json` registers `mk-spec-memory`, `mk_skill_advisor`, `mk_code_index`, and `code_mode`, pointed at their existing `.opencode/bin/*-launcher.cjs` scripts with `.mcp.json`'s own `env` blocks carried forward, **then** all 5 servers appear connected in a live `/mcp` listing without needing a schema translation beyond what pi-mcp-extension's config format actually requires. | Live discovery output for all 5 servers, or an explicit per-server failure record if fewer than 5 connect. |
| REQ-005 | **Given** pi-mcp-extension's documented config shows no visible per-tool permission/deny field (only `transport`/`url`/`lifecycle`), **when** this phase attempts to design a deny-by-default mutation policy, **then** it is live-confirmed whether pi-mcp-extension itself exposes any permission matcher, whether Pi's core Security/tool-approval settings (documented under Getting Started > Security) gate MCP tool calls the way they gate other tools, or whether neither mechanism exists. | The confirmed enforcement point (or its confirmed absence) is recorded as evidence in this phase's own findings, not asserted from Devin's differently-shaped precedent. |
| REQ-006 | **Given** no per-tool ACL surface is confirmed to exist in pi-mcp-extension itself, **when** the committed Tier 1 `.pi/mcp.json` is authored, **then** it registers only servers/tools with no destructive mutation surface by default, and any server carrying a known mutation tool (e.g. `mk_skill_advisor`'s `advisor_rebuild`/`skill_graph_scan`/`skill_graph_propagate_enhances`, `code_mode`'s `register_manual`/`deregister_manual`/`call_tool_chain`) is either omitted from Tier 1 or gated behind a maintainer-opt-in Tier 2, mirroring `029/009`'s two-tier intent even if the concrete file mechanics differ. | A documented Tier 1/Tier 2 split exists where Tier 1 contains zero unguarded mutation-capable tools, verified against a live tool enumeration, not source inspection alone. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | **Given** the 10 external UTCP manuals are reached transitively through `code_mode`'s own MCP tool surface rather than as independent MCP servers, **when** `.pi/mcp.json` is authored, **then** it registers `code_mode` as a single stdio entry (never 10 separate entries), and the plan explicitly documents that `call_tool_chain` is the single highest-leverage tool in the whole surface — it can dispatch any of the 10 registered manuals' tools, several of which are write-capable (e.g. ClickUp task creation, GitHub writes) — and therefore needs its own explicit policy decision, never a default allow inherited from a coarse "allow code_mode" grant. | The `call_tool_chain` policy decision is recorded explicitly in the plan, separate from and more restrictive than a blanket `code_mode` allow. |
| REQ-008 | **Given** `code_mode`'s `.mcp.json` entry hardcodes a machine-specific absolute Node path (`/Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node`), **when** this entry is translated into `.pi/mcp.json`, **then** the portability risk is carried forward explicitly as a pre-existing condition inherited from `.mcp.json`, matching how `030/011` treated the identical entry when wiring Cursor — not silently fixed and not silently ignored. | The plan and any future config comment/doc both name this as a known, carried-forward limitation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: pi-mcp-extension installs and loads without error in a live Pi session, with the exact observed install syntax recorded.
- **SC-002**: Whether stdio transport works is live-confirmed one way or the other — pass means at least one of the 5 native servers connects over stdio and its tools appear in a live discovery surface; fail means the exact observed rejection/error is documented as an unresolved gap, not glossed over.
- **SC-003**: If stdio is supported, all 5 native servers (including `code_mode` as the sole entry point to the 10 UTCP manuals) are represented in the designed `.pi/mcp.json`, with no server or tool carrying an unrestricted default allow on a known mutation-capable tool.
- **SC-004**: The enforcement point for deny-by-default (pi-mcp-extension's own permission surface, Pi's core Security settings, or neither) is identified and recorded as live evidence, not assumed from Devin's differently-shaped precedent.
- **SC-005**: A maintainer-opt-in path for mutation-capable tools exists in the design and is never silently inherited by the default (Tier 1) configuration.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk (PRIMARY, downgraded 2026-07-27 closeout) | Originally: pi-mcp-extension might not support stdio transport at all (only a remote `streamable-http` example was documented at authoring time). A live re-fetch at closeout found the docs NOW show an explicit stdio config shape (`"transport": "stdio"` plus a `command`/`args`/`env` variant) — the package added or documented stdio support since this phase was authored. | Downgraded to Medium — the config shape is now documented, but whether it actually connects in a real Pi session (vs. merely being valid JSON per the docs) remains unconfirmed live. | REQ-002 still requires a live, single-entry probe before any further config work is trusted; the probe's job shifted from "does stdio exist at all" to "does the documented stdio config actually work." |
| Risk | pi-mcp-extension's documented config shows no per-tool permission/deny surface, so the deny-by-default intent inherited from `029/009` may have no native enforcement point inside the package itself. | Medium-High — the phase's whole policy design could rest on a mechanism that doesn't exist. | REQ-005 live-checks whether Pi's core Security/tool-approval settings substitute; if neither mechanism exists, Tier 1 stays limited to servers with zero mutation-capable tools rather than trusting an unenforced deny. |
| Risk | `code_mode`'s `call_tool_chain` is a single tool that fans out to all 10 external UTCP manuals, several write-capable (ClickUp, GitHub, GitKraken). A coarse "allow code_mode" grant would implicitly grant all 10. | Medium-High — the highest-leverage single tool in the whole surface. | REQ-007 requires an explicit, separate policy decision for `call_tool_chain`, not an inherited blanket allow. |
| Risk | pi-mcp-extension is community-maintained (author page: https://pi.dev/packages/pi-mcp-extension), not a Pi core guarantee — version drift, abandonment, or a breaking config-schema change are all plausible for a third-party package. | Medium | Pin an exact installed version once phase 1 confirms the real `pi install` syntax; treat every claim about this package's behavior as needing re-verification if Pi core or the package itself is ever upgraded. |
| Dependency | `001-pi-contract-pin` — the live session/headless contract this phase's every live check assumes. | Complete — Pi CLI 0.82.1 installed, `pi install npm:<pkg> -l --approve` confirmed as the real install verb. | This phase's live-verification requirements can proceed once a future execution phase is authorized to install pi-mcp-extension. |
| Dependency | `006-pi-agent-bridge` (immediate predecessor, per phase sequencing). | Complete — planning-only, same as this phase; no functional coupling. | No functional coupling — this phase does not depend on `pi-subagents` succeeding. |
| Dependency (carried-forward discipline) | Cold-bootstrap of native modules (`better-sqlite3`, `sqlite-vec`, tree-sitter/WASM) inside `mk-spec-memory`/`mk_code_index` under whatever process Pi spawns them in. | Low likelihood — Pi appears to run locally like Claude Code/OpenCode/Cursor, not in a remote sandbox like Devin's cloud, so this is carried forward from `029/009`'s R-002 out of discipline, not because it is expected to be relevant. | Live-verify during REQ-004 rather than assuming local-machine parity with Claude/OpenCode. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does pi-mcp-extension's now-documented stdio transport (`command`/`args`/`env`, confirmed present in the docs as of this phase's 2026-07-27 closeout re-fetch) actually connect and surface tools in a real Pi session, matching its documented shape? (REQ-002 — this phase's PRIMARY open risk, narrowed from "does stdio exist" to "does the documented stdio config work live.")
- Does pi-mcp-extension expose any per-tool permission/deny surface of its own, or must deny-by-default be enforced entirely through Pi's core Security/tool-approval settings (or through neither, meaning Tier 1 must stay limited to inherently mutation-free tools)? (REQ-005)
- What is the real `pi install npm:pi-mcp-extension` syntax — confirmed identically to how phase 1 must confirm `pi install npm:pi-subagents` for phase 6? (feeds REQ-001)
- Is Pi's project-vs-global `.pi/mcp.json` split (`.pi/mcp.json` overriding `~/.pi/agent/mcp.json`, per the documented settings-merge behavior) enough to construct a Tier-1/Tier-2 pair analogous to Devin's `config.json`/`config.local.json`, or does the maintainer-opt-in tier have to live in the maintainer's own global `~/.pi/agent/mcp.json` instead, outside the repo entirely? (feeds REQ-006 — genuinely unconfirmed; Pi's documented mechanism is a project/global split, not a committed/gitignored-local split like Devin's.)
- Should `mk-spec-memory`'s full mutation-tool surface (41 tools total per this repo's own tooling inventory, only a handful named in `.mcp.json`'s own inline env notes) be enumerated via a live discovery call before any Tier 1 entry is authored, mirroring `029/009`'s requirement that its mutation-tool list come from a live `tools/list` call rather than source inspection alone?
- If stdio transport is confirmed unsupported, is a local stdio-to-streamable-http shim worth exploring in a later phase, or should Pi simply be documented as having no native MCP access to this repo's servers?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
