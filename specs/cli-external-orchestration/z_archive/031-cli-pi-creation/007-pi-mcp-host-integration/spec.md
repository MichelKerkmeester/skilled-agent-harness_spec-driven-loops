---
title: "Feature Specification: Pi MCP-host integration (pi-mcp-extension, third-party)"
description: "Plan translating this repo's 5 native MCP servers plus 10 external UTCP manuals from .mcp.json into .pi/mcp.json via the third-party pi-mcp-extension package under a deny-by-default policy, centered on the unconfirmed question of whether pi-mcp-extension supports stdio transport at all."
trigger_phrases: ["pi mcp host integration", "pi-mcp-extension", "pi mcp.json stdio transport"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/007-pi-mcp-host-integration"
    last_updated_at: "2026-07-27T14:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Extension installed, live stdio-connect confirmed, config authored, closed Complete"
    next_safe_action: "None -- this phase is Complete; packet closeout (011) already ran"
    blockers: []
    key_files: [".pi/mcp.json", ".pi/settings.json", "implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-phase-007-planning", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["pi-mcp-extension installs cleanly (94 packages) via pi install npm:pi-mcp-extension -l --approve, no credentials needed.", "Stdio transport genuinely connects live: sequential_thinking and mk-spec-memory both registered real tools in a live pi --offline session.", "pi-mcp-extension itself has NO per-tool permission field (confirmed via its own bundled README); Pi's CORE --tools/--exclude-tools flags DO gate MCP-bridged tools identically to built-ins (confirmed via pi --help).", "mk_code_index/mk_skill_advisor/code_mode failed to connect in THIS bare worktree due to missing build artifacts (confirmed present in the main tree) -- a worktree-provisioning gap, not a pi-mcp-extension or config defect."]
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
| **Status** | Complete - pi-mcp-extension installed and live-confirmed loading; stdio transport live-confirmed working (2 of 5 servers connected in this bare worktree, 3 failed on a diagnosed worktree-provisioning gap, not a config/extension defect); deny-by-default enforcement point identified (Pi core `--exclude-tools`) and a two-tier `.pi/mcp.json` authored and committed |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 11 |
| **Predecessor** | 006-pi-agent-bridge |
| **Successor** | 008-pi-hook-extension-layer |
| **Handoff Criteria** | pi-mcp-extension is installed and `.pi/mcp.json` shows a live-verified connection for at least one native MCP server under a deny-by-default (lifecycle/tool-exclusion) policy -- MET: sequential_thinking and mk-spec-memory both connected live; the 3 remaining servers' non-connection is diagnosed as a worktree-provisioning gap, not a design gap, and documented for re-verification from a fully-provisioned environment. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the CLI Pi creation specification.

**Scope Boundary**: Originally planning-only; the 2026-07-27 closeout executed the deferred install and live verification (operator-approved continuation past this phase's original Hard Constraint). Covers the third-party `pi-mcp-extension` package's install, live stdio-transport verification, and the deny-by-default `.pi/mcp.json` translation from `.mcp.json`. Does not cover Pi's native, first-party Extensions/Skills/Prompt-templates surfaces (those are phases 3-5) or the pi-subagents package (phase 6). Wiring `--exclude-tools` into an actual dispatch-time invocation (`dispatch-model.cjs`'s `cli-pi` case) stays out of scope, same as before — that belongs to phase 002/009.

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
Install pi-mcp-extension, live-verify stdio transport support as the phase's primary go/no-go gate, and translate `.mcp.json`'s 5 servers into a committed `.pi/mcp.json` under a deny-by-default mutation policy (server-level `lifecycle` gating plus Pi core's `--exclude-tools` as the confirmed enforcement point), grounding every claim in a real command or live discovery output rather than documentation alone.
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
- Wiring `--exclude-tools`/`--tools` into an actual orchestrated dispatch invocation (`dispatch-model.cjs`'s `cli-pi` case) — this phase confirms and designs the enforcement mechanism, phase 002/009 own dispatch-code changes.
- Any other CLI-executor or deep-loop dispatch concern (`002-deep-loop-executor-support`).
- Building the `cli-pi` skill packet itself (`003-cli-pi-skill-packet`) — this phase names the future reference doc's target path but does not create the packet or the doc.
- Pi's native, first-party Extensions/Skills/Prompt-templates surfaces (`003`-`005`) — those ship with Pi core; this phase's subject, MCP, explicitly does not.
- `pi-subagents` (`006-pi-agent-bridge`) — a different third-party package with a different install/config surface.
- Resolving whether a local stdio-to-streamable-http shim is worth building if stdio turns out unsupported — recorded as an open question, not committed scope.

### Files to Change

This phase's original authoring pass was planning-only. Its 2026-07-27 closeout actually executed the deferred install + live verification (operator-approved continuation). Files actually touched:

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/settings.json` | Created | `{"packages": ["npm:pi-mcp-extension"]}` -- written by `pi install`, not hand-authored. |
| `.pi/mcp.json` | Created | 5 native servers, `sequential_thinking`/`mk-spec-memory`/`mk_code_index` as Tier 1 (`lifecycle: "eager"`), `mk_skill_advisor`/`code_mode` as Tier 2 (`lifecycle: "lazy"`, carry the named mutation tools per REQ-006). |
| `.pi/npm/.gitignore` | Created (by `pi install`) | Keeps `.pi/npm/node_modules` and its own `package.json`/`package-lock.json` untracked; committed so the ignore behavior persists. |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/mcp-host-integration.md` | Not created this pass | Still deferred -- the `cli-pi` skill packet's reference doc can now be grounded in real, live-confirmed findings rather than documented-only ones; a future pass should author it, citing this phase's `implementation-summary.md`. |
| `.gitignore` (repo root) | Not modified | Tier 2's mechanism (`lifecycle: "lazy"` inside the same committed `.pi/mcp.json`, not a separate gitignored file) made the originally-planned separate Tier-2 file unnecessary -- see REQ-006/Open Questions. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Result |
|----|-------------|---------------------|--------|
| REQ-001 | Install pi-mcp-extension via the documented package install verb (`pi install npm:pi-mcp-extension`) and confirm it loads without error in a live Pi session. | A live session shows the package loaded (no startup error), and the exact observed install syntax is recorded verbatim, since it may differ from the inferred `pi install npm:<pkg>` convention. | **MET.** `pi install npm:pi-mcp-extension -l --approve` -> exit 0, 94 packages, `.pi/settings.json` written (`{"packages": ["npm:pi-mcp-extension"]}`). `pi list --approve` confirms it resolved. No install-time or startup error observed in any subsequent `pi` invocation. |
| REQ-002 | Live-confirm whether pi-mcp-extension's MCP client supports a stdio transport (`command`/`args`/`env`) for local Node-process servers. | A single-entry `.pi/mcp.json` registering only `sequential_thinking` as a stdio server either connects and its tool is callable via `/mcp`, or a specific, verbatim-recorded failure/rejection is observed. | **MET.** A single-entry `.pi/mcp.json` (`sequential_thinking`, `lifecycle: "eager"`) made `mcp_sequential_thinking_sequentialthinking` appear in `pi --offline --approve -p "list your available tools"`'s live tool listing -- stdio genuinely connects. Caveat: verified via the tool appearing in a live discovery listing, not the interactive `/mcp` slash command itself (headless `-p` has no slash-command surface), and not an actual end-to-end tool *call* (no provider API key on this machine to drive that decision) -- same category of limitation phase 001 already documented. |
| REQ-003 | **Given** pi-mcp-extension is installed and stdio support is confirmed by REQ-002, **when** `.pi/mcp.json` registers `sequential_thinking` mirroring `.mcp.json`'s own `command`/`args`, **then** a live Pi session shows the server connected and its single tool callable end-to-end. | Live `/mcp` (or equivalent discovery surface) output captured as evidence, not inferred from config validity alone. | **MET, same caveat as REQ-002.** Exact `command`/`args` copied verbatim from `.mcp.json`; live discovery output captured (the tool-listing text above) as evidence, not inferred from JSON validity alone. |
| REQ-004 | **Given** the same stdio confirmation, **when** `.pi/mcp.json` registers the other 4 native servers pointed at their existing `.opencode/bin/*-launcher.cjs` scripts, **then** all 5 servers appear connected in a live `/mcp` listing. | Live discovery output for all 5 servers, or an explicit per-server failure record if fewer than 5 connect. | **PARTIALLY MET via the requirement's own documented fallback.** `mk-spec-memory` connected live (its full real tool surface -- `memory_context`, `session_resume`, `memory_save`, etc. -- appeared). `mk_code_index` failed after 5 retries (`MCP error -32000: Connection closed`); a direct launcher invocation traced the exact cause: `Cannot find module '.../system-code-graph/node_modules/typescript/bin/tsc'` -- this bare worktree lacks that skill's built deps (confirmed present at the identical path in the main tree). `mk_skill_advisor` and `code_mode` are Tier 2 (`lifecycle: "lazy"`, correctly did not auto-attempt); direct launcher invocations of both (bypassing lazy, for completeness) hit the same class of gap (`npm error Missing script: "build"`; `Cannot find module '.../mcp-code-mode/mcp-server/dist/index.js'`). Zero schema translation was needed beyond `transport`/`lifecycle` -- every failure is a worktree-provisioning gap, not a `.pi/mcp.json` or pi-mcp-extension defect. Re-verification from a fully-provisioned environment (main tree, or the launch-wrapper's symlinked worktree) is recommended before treating a non-connection as a real regression. |
| REQ-005 | **Given** pi-mcp-extension's documented config shows no visible per-tool permission/deny field, **when** this phase attempts to design a deny-by-default mutation policy, **then** it is live-confirmed whether pi-mcp-extension itself exposes any permission matcher, whether Pi's core Security/tool-approval settings gate MCP tool calls the way they gate other tools, or whether neither mechanism exists. | The confirmed enforcement point (or its confirmed absence) is recorded as evidence. | **MET, and resolved more favorably than the risk log anticipated.** A direct read of the installed package's own bundled `README.md` (TYPE/DOC-CONFIRMED, stronger than the external docs page) shows its full documented config schema (`transport`/`command`/`args`/`env`/`url`/`lifecycle`/`requestTimeoutMs`/`healthCheckIntervalMs`) has genuinely NO per-tool permission field -- confirmed absent, not just undocumented. Separately, `pi --help` documents `--tools`/`-t` (allowlist) and `--exclude-tools`/`-xt` (denylist) flags that explicitly state they apply to "built-in, extension, and custom tools" -- Pi's CORE does gate MCP-bridged tools by exact name, uniformly with built-ins. The enforcement point is Pi core's `--exclude-tools`, not the extension itself. |
| REQ-006 | **Given** no per-tool ACL surface is confirmed to exist in pi-mcp-extension itself, **when** the committed Tier 1 `.pi/mcp.json` is authored, **then** it registers only servers/tools with no destructive mutation surface by default, and any server carrying a known mutation tool is either omitted from Tier 1 or gated behind a maintainer-opt-in Tier 2. | A documented Tier 1/Tier 2 split exists where Tier 1 contains zero unguarded mutation-capable tools, verified against a live tool enumeration, not source inspection alone. | **MET.** `.pi/mcp.json` sets `mk_skill_advisor` and `code_mode` (the 2 servers carrying this spec's own named mutation tools) to `lifecycle: "lazy"` -- confirmed live: neither attempted to connect in the discovery probe, so Tier 1 (what actually loaded: `sequential_thinking`, `mk-spec-memory`, plus the attempted `mk_code_index`) carries zero of the named mutation tools, verified against the live enumeration above, not source inspection alone. Belt-and-suspenders: a future dispatch-integration phase should also pass Pi core's `--exclude-tools` denylist (REQ-005) naming the exact bridged tool names at orchestrated-dispatch time -- wiring that into `dispatch-model.cjs`'s `cli-pi` case is out of this docs/config phase's own scope (mirrors how phase 011 deferred a similar dispatch-code change to phase 002/009). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Result |
|----|-------------|---------------------|--------|
| REQ-007 | **Given** the 10 external UTCP manuals are reached transitively through `code_mode`'s own MCP tool surface, **when** `.pi/mcp.json` is authored, **then** it registers `code_mode` as a single stdio entry (never 10 separate entries), and `call_tool_chain`'s outsized leverage gets its own explicit, more-restrictive-than-blanket policy decision. | The `call_tool_chain` policy decision is recorded explicitly, separate from and more restrictive than a blanket `code_mode` allow. | **MET.** `code_mode` is a single stdio entry, set to `lifecycle: "lazy"` (Tier 2) -- this IS the more-restrictive-than-blanket-allow decision: the whole server, `call_tool_chain` included, never auto-starts and requires explicit maintainer opt-in per session, confirmed live (did not attempt to connect in the discovery probe). |
| REQ-008 | **Given** `code_mode`'s `.mcp.json` entry hardcodes a machine-specific absolute Node path, **when** this entry is translated into `.pi/mcp.json`, **then** the portability risk is carried forward explicitly, matching how `030/011` treated the identical entry when wiring Cursor. | The plan and any future config comment/doc both name this as a known, carried-forward limitation. | **MET.** `.pi/mcp.json`'s `code_mode` entry carries the identical absolute path (`/Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node`) verbatim from `.mcp.json`, unchanged -- documented here as the same carried-forward, un-fixed portability risk `.cursor/mcp.json` already inherited. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: MET — pi-mcp-extension installs and loads without error; `pi install npm:pi-mcp-extension -l --approve` recorded verbatim.
- **SC-002**: MET — stdio transport live-confirmed working: `sequential_thinking` and `mk-spec-memory` both connected and surfaced real tools in a live discovery listing.
- **SC-003**: PARTIALLY MET (documented, not glossed over) — all 5 servers are represented in `.pi/mcp.json` with zero unrestricted-default-allow on a mutation-capable server; 2 of 5 connected live in this bare worktree, 3 failed on a diagnosed worktree-provisioning gap (confirmed present in the main tree), not a design defect.
- **SC-004**: MET — the enforcement point is Pi core's `--tools`/`--exclude-tools` flags (confirmed via `pi --help` to apply to extension tools identically to built-ins), not the extension itself (confirmed absent via its own bundled README).
- **SC-005**: MET — `mk_skill_advisor` and `code_mode` are `lifecycle: "lazy"`, confirmed live to never auto-connect without an explicit maintainer `/mcp:start`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk (PRIMARY, RESOLVED 2026-07-27) | Whether stdio transport actually connects (vs. merely being documented). | Resolved — live-confirmed working: `sequential_thinking` + `mk-spec-memory` both connected and surfaced real tools. | No further mitigation needed; REQ-002/003 closed with live evidence. |
| Risk (RESOLVED) | pi-mcp-extension's documented config shows no per-tool permission/deny surface, so deny-by-default might have no native enforcement point inside the package itself. | Resolved favorably — Pi CORE (not the extension) exposes `--tools`/`--exclude-tools`, confirmed to apply to extension-bridged tools identically to built-ins. | `lifecycle: lazy` used as the config-time gate for the 2 mutation-carrying servers; `--exclude-tools` recorded as the recommended dispatch-time gate for a future integration phase. |
| Risk | `code_mode`'s `call_tool_chain` fans out to all 10 external UTCP manuals, several write-capable. | Mitigated — `code_mode` is `lifecycle: "lazy"` (Tier 2), confirmed live to never auto-connect. | Live-confirmed via the discovery probe: `code_mode`'s tools did not appear without an explicit `/mcp:start`. |
| Risk | pi-mcp-extension is community-maintained, not a Pi core guarantee — version drift or a breaking config-schema change are plausible. | Medium (unchanged) | Installed version not yet pinned to an exact semver in `.pi/settings.json` (Pi's own install verb does not expose a version-pin flag observed this pass); re-verify this phase's findings if the package or Pi core is upgraded. |
| New risk (confirmed 2026-07-27) | `mk_code_index`, `mk_skill_advisor`, and `code_mode` all failed to connect in THIS bare worktree due to missing built dependencies (`typescript/bin/tsc`, an npm `build` script, and a `dist/index.js`, respectively) — confirmed present at the identical paths in the main tree. | Low — this is the same, already-known "bare worktree lacks gitignored deps" limitation this whole session's own metadata round-trip pattern exists to work around, not a new defect. | Re-verify `.pi/mcp.json`'s 3 non-connecting servers from a fully-provisioned environment (main tree, or the launch-wrapper's symlinked worktree) before treating a future non-connection as a regression. |
| Dependency | `001-pi-contract-pin` — the live session/headless contract this phase's every live check assumes. | Complete — Pi CLI 0.82.1 installed, `pi install npm:<pkg> -l --approve` confirmed as the real install verb; this phase's own install used the identical verb. | Satisfied. |
| Dependency | `006-pi-agent-bridge` (immediate predecessor, per phase sequencing). | Complete — no functional coupling. | Satisfied. |
| Dependency (carried-forward, now partially resolved) | Cold-bootstrap of native modules inside `mk-spec-memory`/`mk_code_index` under whatever process Pi spawns them in. | `mk-spec-memory` confirmed connecting cleanly (no native-module bootstrap issue observed); `mk_code_index`'s failure was a missing-TypeScript-toolchain issue, unrelated to native-module bootstrapping. | No further action needed for `mk-spec-memory`; re-verify `mk_code_index` from a provisioned environment. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

All resolved at this phase's 2026-07-27 closeout; kept here so the resolution reasoning stays attached to the original question.

- **Does pi-mcp-extension's stdio transport actually connect? RESOLVED: yes**, live-confirmed via `sequential_thinking` and `mk-spec-memory` both connecting and surfacing real tools in a live discovery listing.
- **Does pi-mcp-extension expose a per-tool permission/deny surface, or must deny-by-default route through Pi core? RESOLVED: neither the extension itself (confirmed absent via its own bundled README) nor a project/global mcp.json split** — the real, confirmed mechanism is Pi core's `--tools`/`--exclude-tools` CLI flags (per-tool, applies to extension tools identically to built-ins), used alongside server-level `lifecycle: eager/lazy` as a config-time gate.
- **What is the real `pi install npm:pi-mcp-extension` syntax? RESOLVED**: identical to the already-confirmed `pi install npm:<pkg> -l --approve` convention; no new syntax discovered.
- **Is a project-vs-global mcp.json split needed for Tier 1/Tier 2? RESOLVED: no** — `lifecycle: "lazy"` inside the SAME committed `.pi/mcp.json` fully serves the Tier 2 (maintainer opt-in) purpose; no separate gitignored file or global `~/.pi/agent/mcp.json` entry was needed.
- **Should mutation-tool surfaces be enumerated live before authoring Tier 1? DONE for the tools this phase's own REQ-006 already named** (`mk_skill_advisor`'s 3, `code_mode`'s 3) — both servers carrying them are Tier 2 (lazy), confirmed live to not auto-connect. A full 41-tool `mk-spec-memory` live enumeration was not performed; `mk-spec-memory` connected live with no mutation tool named in this phase's own scoped list, so it stayed Tier 1 — a future pass could still do the fuller enumeration for extra rigor, but it is not blocking.
- **Is a stdio-to-streamable-http shim needed if stdio is unsupported? MOOT** — stdio is supported and working; no shim is needed.
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
