---
title: "Feature Specification: Pi hook extension layer"
description: "Plan a .pi/extensions/*.ts bridge from this repo's runtime-neutral guard cores (spec-gate, dispatch-preflight-lint, dispatch-audit, post-edit-quality, code-graph-freshness, mcp-route-guard, completion-evidence-sentinel, task-dispatch-guard) into Pi's native TypeScript extension-module system, live-probing the extension API's lifecycle surface before assuming any Claude/Codex/Cursor/Devin event parity."
trigger_phrases:
  - "pi extension hooks"
  - "pi hook bridge"
  - "pi guard core adapter"
  - "pi lifecycle events"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/008-pi-hook-extension-layer"
    last_updated_at: "2026-07-27T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase 008 spec.md as planning-only Pi extension hook-bridge design"
    next_safe_action: "Await phase 001 Pi contract-pin probe and phase 003 hub registration first"
    blockers:
      - "phase 001 (pi-contract-pin) has not executed - no live-verified Pi extension API surface exists yet"
      - "phase 003 (cli-pi-skill-packet) has not landed - no cli-pi hub mode for a future adapter phase to attach to"
      - "pi binary and .pi/ directory both confirmed absent from this environment at authoring time"
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../001-pi-contract-pin/spec.md"
      - "../007-pi-mcp-host-integration/spec.md"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/cursor/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "What does a .pi/extensions/*.ts module actually export or register to subscribe to a lifecycle point?"
      - "Can a Pi extension deny/block a tool call, or only observe it after the fact?"
      - "Single consolidated extension module vs one file per guard core - which fits Pi's discovery model?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: pi-hook-extension-layer

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
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 11 |
| **Predecessor** | 007-pi-mcp-host-integration |
| **Successor** | 009-pi-model-registry-and-routing |
| **Handoff Criteria** | **Inbound (007 -> 008):** `pi-mcp-extension` is installed and `/mcp` in-session shows at least the 5 native MCP servers connected under a deny-by-default policy (or the stdio-transport gap is explicitly documented as unresolved). **Outbound (008 -> 009):** a discriminating test suite passes for each bridged extension, with fail-open/fail-closed behavior matching the intended policy per guard. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the CLI Pi creation specification.

**Scope Boundary**: This phase plans (does not build) a bridge from Pi's native `.pi/extensions/*.ts` auto-discovery system into the 8 runtime-neutral guard cores that already have thin per-CLI adapters for Claude, Codex, Devin, and Cursor. The scope stops at documented planning: a live-probe protocol, a provisional (all-UNCONFIRMED) guard-to-lifecycle mapping table, and two candidate adapter architectures. No `.pi/extensions/*.ts` file, no `hooks/pi/` sibling directory, and no live Pi session is created or run in this phase.

**Dependencies**:
- Phase 001 (`pi-contract-pin`) — must have live-verified Pi's install, `.pi/` directory behavior, and (loosely) extension loading before this phase's own live-probe step can build on rather than duplicate that groundwork.
- Phase 003 (`cli-pi-skill-packet`) — must have registered `cli-pi` as the hub's 6th mode so a future implementation of this phase's bridge has a hub context to attach to.
- Phase 007 (`pi-mcp-host-integration`) — the immediately preceding phase in the packet's serial numbering; not a hard technical blocker for guard-hook bridging, but its MCP-transport findings (stdio vs streamable-http) are relevant precedent for how skeptical to be about undocumented Pi surfaces.

**Deliverables** (for the future execution pass this phase plans, not for this authoring pass):
- A live-probe protocol capable of discovering Pi's real extension lifecycle API before any adapter code is written.
- Sibling adapter directories mirroring `hooks/codex/`, `hooks/devin/`, `hooks/cursor/` (`mcp-server/hooks/pi/`, `runtime/hooks/pi/`, plus each guard-owning packet's own `hooks/pi/` sibling).
- The actual `.pi/extensions/*.ts` entrypoint(s), registered via Pi's documented auto-discovery path.
- A documented, honest gap list for any guard core the live probe shows cannot be bridged (mirroring the empty `PermissionRequest` / non-firing `beforeSubmitPrompt`/`stop` precedent from the Devin and Cursor phases).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This repo enforces its scope-lock, spec-folder, quality, and completion-evidence discipline through 8 runtime-neutral guard cores (`spec-gate-core.mjs`, `dispatch-rule-checks.mjs`, `dispatch-audit.mjs`, `post-edit-router.cjs`, `freshness-core.cjs`, `mcp-route-guard.cjs`, `completion-evidence-sentinel.cjs`, `dispatch-guard.cjs`), each already bridged into Claude, Codex, Devin, and Cursor via thin per-CLI adapter directories (`mcp-server/hooks/<cli>/`, `runtime/hooks/<cli>/`, plus guard-owning-packet siblings) registered through each CLI's own external hook-config file (`.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`). `cli-pi` has none of this, so once phases 001-007 land, a dispatched Pi executor session in this repo will have zero guard coverage — the same enforcement blind spot the Codex, Devin, and Cursor adapters already closed for their CLIs. Pi makes this harder than any prior CLI in this packet: per pi.dev docs, its extension system is native TypeScript, auto-discovered from `.pi/extensions/*.ts` (project) or `~/.pi/agent/extensions/*.ts` (global) — there is no external JSON hooks-config file to register events against, and pi.dev has no dedicated "Hooks" page in its docs nav at all (only "Extensions" under Customization). The Claude/Codex/Devin/Cursor `SessionStart`/`PreToolUse`/`PostToolUse`/`Stop` event taxonomy this packet's other hook-adapter phases mirrored cannot be assumed to carry over to Pi's extension API without live verification.

### Purpose
Plan — without installing anything, writing extension code, or running a live Pi session — a guard-core bridge design for Pi that (a) enumerates every runtime-neutral guard core needing eventual coverage, (b) defines the concrete live-probe protocol a future implementation phase must run before writing any adapter code, since Pi's real extension lifecycle surface is undocumented at the field level, (c) documents two candidate adapter architectures (in-process direct-call vs. spawnSync delegate-to-compiled-Claude-adapter) pending that probe's findings, and (d) carries forward the fail-open discipline and honest-gap-documentation precedent the Codex/Devin/Cursor hook-adapter phases already established.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Enumerate the 8 runtime-neutral guard cores needing an eventual Pi bridge, with their real file paths and their existing Claude/Codex/Devin/Cursor adapter precedent locations (see `plan.md` §3 Architecture for the full table).
- Define the live-probe protocol a future implementation phase must run before any adapter code exists: re-read `pi.dev/docs/latest/extensions` live at execution time (Pi is pre-1.0 and evolving; this phase's cached findings could already be stale), locate and type-introspect whatever SDK/type definitions ship with the installed `@earendil-works/pi-coding-agent` package for the extension registration surface, author one minimal instrumented `.pi/extensions/*.ts` probe module that logs every lifecycle callback name/payload it actually receives, and run both a real interactive `pi` session and the phase-001-confirmed headless/programmatic dispatch surface to see which callbacks fire.
- Draft two candidate architecture shapes for how a `.pi/extensions/*.ts` module could reach the existing guard cores once the lifecycle surface is known: (A) in-process direct `import()`/`require()` of the guard core's own `.mjs`/`.cjs` export — extensions run inside Pi's own Node process per the auto-discovery model, unlike every other CLI's external-subprocess hook model, so this could avoid the per-invocation `spawnSync` cost every existing adapter pays; (B) `spawnSync` delegate-to-compiled-Claude-adapter, mirroring `hooks/codex/shared.ts`, `hooks/devin/shared.ts`, and `hooks/cursor/shared.ts` exactly, as the fallback if in-process execution proves unsafe (module-format mismatches between the guard cores' mixed CJS/ESM shapes and whatever loader Pi's extension system uses, or if Pi sandboxes extensions away from `child_process`/filesystem access).
- A provisional guard-core-to-Pi-lifecycle-point mapping table, every row explicitly marked UNCONFIRMED pending the live probe — a map of candidates, not a wiring plan, since no Pi extension lifecycle event name has been observed as of this authoring pass.
- A fail-open design policy per bridged guard, carried forward from the Codex/Devin/Cursor precedent's discipline: never block or destabilize a Pi session on a malformed payload or an unexpected extension-API shape.
- A deferral/gap-documentation plan mirroring the Devin/Cursor precedent: if the live probe shows the extension API cannot intercept (let alone deny) a given lifecycle point, that gap is recorded explicitly rather than shipping a bridge that silently can't enforce anything.

### Out of Scope
- Actually installing Pi, writing any `.pi/extensions/*.ts` file, or running a live Pi session — this phase is planning only. Confirmed empirically at authoring time: `command -v pi` returns nothing and no `.pi/` directory exists in this checkout; phase 001 owns the install.
- Modifying any of the 8 runtime-neutral guard cores themselves (`spec-gate-core.mjs`, `dispatch-rule-checks.mjs`, `dispatch-audit.mjs`, `post-edit-router.cjs`, `freshness-core.cjs`, `mcp-route-guard.cjs`, `completion-evidence-sentinel.cjs`, `dispatch-guard.cjs`) — like every sibling CLI's hook-adapter phase, this phase only ever plans a translate-only bridge.
- `ADVISOR_RUNTIME_VALUES` enum changes — a hosting-runtime concern (Pi acting as the primary assistant), not a dispatched-executor concern, matching the same exclusion recorded in `029-cli-devin-revival/004-devin-hook-adapter-layer` and `030-cli-cursor-creation/004-cursor-hook-adapter-layer`.
- Building `pi-mcp-extension`'s MCP bridge (phase 007) or `pi-subagents`' agent bridge (phase 006) — this phase covers only the guard-hook/extension surface.
- Achieving full event-for-event parity with Claude/Codex/Cursor/Devin's lifecycle taxonomy in the first implementation pass — start with whichever lifecycle points the live probe actually confirms exist, extend incrementally, mirroring how Devin's first hook-adapter phase covered 2 events and a dedicated later phase closed the rest.
- Registering the eventual bridge via `.pi/settings.json`'s `"extensions"` array or the `--skill`/`-e` flags — per pi.dev docs, auto-discovery from `.pi/extensions/*.ts` is the default path; the settings.json/CLI-flag surfaces are documented alternates, not adopted here without a reason to deviate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp-server/hooks/pi/**` (shared module, per-guard adapters, `README.md`) | Planned (future phase) | Thin Pi-extension bridge modules mirroring `hooks/codex/`, `hooks/devin/` structurally; exact module shape (class export, plain function export, or `on(event, handler)` registration) depends on live-probe findings. |
| `.opencode/skills/system-spec-kit/runtime/hooks/pi/**` (spec-gate classify/enforce equivalents, `README.md`) | Planned (future phase) | Pi-side spec-gate wiring into the shared `spec-gate-core.mjs`. |
| `.pi/extensions/*.ts` (project-level) | Planned (future phase) | The actual auto-discovered extension entrypoint(s) Pi loads; single-file-vs-one-per-guard layout is an open question (§7). |
| `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/hooks/pi/**` | Planned (future phase) | `dispatch-preflight-lint`/`dispatch-audit` Pi bridges, mirroring the Codex/Devin siblings. |
| `.opencode/skills/sk-code/code-quality/scripts/hooks/pi/**` | Planned (future phase) | `post-edit-quality` Pi bridge. |
| `.opencode/skills/system-code-graph/runtime/hooks/pi/**` | Planned (future phase) | `code-graph-freshness` Pi bridge. |
| `.opencode/skills/mcp-code-mode/runtime/hooks/pi/**` | Planned (future phase) | `mcp-route-guard` Pi bridge. |
| `.opencode/skills/system-deep-loop/runtime/hooks/pi/**` | Planned (future phase) | `task-dispatch-guard` Pi bridge — fold-in vs. dedicated-adapter choice depends on whether phase 006's `pi-subagents` bridge exposes a distinguishable tool name to match on. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Before any adapter/extension code is written, live-probe Pi's actual extension lifecycle API surface (type definitions + one instrumented test extension + a real `pi` session) and record the confirmed callback/event names. | A follow-on implementation phase's `decision-record.md`/`README.md` lists each Pi lifecycle point by name with a citation to how it was observed (a type-file line reference or a captured invocation), never just a docs-page quote. |
| REQ-002 | The guard-core-to-Pi-lifecycle mapping table in `plan.md` marks every row UNCONFIRMED with an explicit "pending live probe" note; no row may be presented as already verified. | `plan.md`'s mapping table contains zero rows lacking an UNCONFIRMED/pending marker. |
| REQ-003 | Both candidate adapter shapes (in-process direct-call vs. `spawnSync` delegate-to-compiled-Claude-adapter) are documented with tradeoffs, so a future implementation does not default to copy-pasting the Codex/Devin/Cursor `spawnSync` pattern without first checking whether Pi's in-process TS-module model makes a lighter-weight direct call viable. | `plan.md` §3 Architecture names both shapes, states which is more likely and why, and names the specific live-probe finding needed to decide between them. |
| REQ-004 | This phase does not modify `ADVISOR_RUNTIME_VALUES` and does not modify any of the 8 runtime-neutral guard cores. | `git diff` against those paths is empty as a result of this authoring pass (spec-folder docs only). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `plan.md`'s rollback/deferral section documents that a guard core with no reachable Pi lifecycle interception point is an accepted, explicitly-documented gap, not silently treated as bridged. | `plan.md` §7 Rollback Plan states this policy in the same terms as the empty `PermissionRequest` (Devin) / non-firing `beforeSubmitPrompt`/`stop` (Cursor) precedent. |
| REQ-006 | The mapping table plus fail-open policy section covers all 8 runtime-neutral guard cores by name and file path, so no guard is silently omitted from consideration even if it ultimately can't be bridged. | `plan.md` §3's mapping table has exactly 8 guard-core rows, each citing a real file path confirmed via `Read`/`Grep` at authoring time. |
| REQ-007 | This phase's dependency on phase 001 (live contract pin) and phase 003 (hub registration) is stated explicitly, not left implicit. | §6 Risks & Dependencies below names both phases and what specifically blocks on each. |

### P2 - Nice-to-have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | A stretch design note captures whether a single consolidated `.pi/extensions/*.ts` module (mirroring Cursor's consolidated `post-tool-use.mjs`, which chains 3 guard cores from one file) or one file per guard core (mirroring Codex/Devin's one-file-per-core layout) is the better fit for Pi's auto-discovery model. | `plan.md` §3 names both layout options and states this is undecided until the live probe shows how Pi extensions declare multiple lifecycle subscriptions from one module. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `plan.md`'s live-probe protocol names concrete, executable steps (not just "check the docs") that a future implementer can run start-to-finish to discover Pi's real extension lifecycle API before writing any adapter code.
- **SC-002**: Every one of the 8 runtime-neutral guard cores has an explicit row in the mapping table (bridged-candidate, deferred-pending-probe, or documented-as-unreachable) — none silently missing, avoiding the gap the original Devin hook-parity file matrix had to correct mid-implementation (`spec-gate-enforce.mjs` was missed and added as a 10th file).
- **SC-003**: `tasks.md`'s Phase 1 (Setup) sequences the live-probe work strictly before Phase 2 (adapter authoring), and every `checklist.md` item is falsifiable by a future implementer or CI, not a restatement of the plan.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 (`pi-contract-pin`) has not executed; no live-verified extension API surface exists | This phase's entire mapping table stays hypothetical until 001 lands or this phase's own Setup step runs the probe independently | Every mapping-table row marked UNCONFIRMED; REQ-001 gates all adapter code on the live probe, never on this planning pass |
| Dependency | Phase 003 (`cli-pi-skill-packet`) has not landed | No `cli-pi` hub-mode context exists for a future adapter phase to attach to | Sequenced explicitly as a precondition in `plan.md` §6 |
| Risk | Pi's extension API may expose only post-hoc observation, not a pre-tool-call interception/deny point, unlike every prior CLI's hook model | `spec-gate-enforce`'s real Gate-3 BLOCK (not just the advisory classify step) could be structurally unbridgeable on Pi, not just unregistered | Document as an explicit, named gap per REQ-005 rather than forcing a no-op "bridge" that can't actually deny anything |
| Risk | Pi is pre-1.0 and pi.dev's docs could already differ from the installed version's real behavior by execution time | A future implementer could code against a stale event name pulled from this phase's cached findings | REQ-001 mandates re-reading the live docs AND live-probing at execution time, not trusting this phase's citations |
| Risk | Extensions run in-process inside Pi's own Node runtime (unlike every other CLI's external-subprocess hook model) | A crashing or hanging guard-core call inside an in-process extension could destabilize the whole Pi session, not just fail one hook invocation | Candidate Shape A (in-process direct-call) must be evaluated against this specific failure mode before being preferred over Shape B's isolated-subprocess delegate pattern |
| Risk | `pi` binary and `.pi/` directory are both confirmed absent from this environment at authoring time | No local way to sanity-check any assumption in this phase, even informally | Confirmed via `command -v pi` (empty) and `ls .pi` (absent); not worked around — phase 001 owns installing Pi |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What does a `.pi/extensions/*.ts` module actually export or register to subscribe to a lifecycle point — a named export function per event, a single default-exported object with event-keyed callbacks, an `on(event, handler)`-style registration call, or something else entirely? UNKNOWN, needs live verification (REQ-001).
- Does Pi's extension API expose anything equivalent to Claude/Codex/Devin/Cursor's deny-capable `PreToolUse` interception, or can an extension only observe/log a tool call after the fact? UNKNOWN — this materially changes whether `spec-gate-enforce` (the actual Gate-3 BLOCK) can ever be bridged at all.
- Does the pi.dev extensions doc's `CONFIG_DIR_NAME`-instead-of-hardcoding-`.pi` note imply extensions receive some resolved-path/config API surface at load time, and if so, does that surface also expose anything hook-relevant (session id, tool name, cwd) the way Claude's hook payload does? UNKNOWN.
- Is a single consolidated extension module (Cursor's `post-tool-use.mjs` pattern) or one file per guard core (Codex/Devin's pattern) the better fit once Pi's actual multi-subscription mechanics are known? Open per REQ-008, routed to whichever future phase builds this.
- Should the `task-dispatch-guard` Pi bridge fold into a generic pre-tool-use matcher (Codex's approach, since Codex has no native Task-equivalent tool) or get its own dedicated adapter (Devin's approach, justified by `run_subagent` being a first-class tool)? Depends on whether phase 006's `pi-subagents` package exposes a distinguishable tool name Pi's extension API can match on — open until 006 lands.
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
