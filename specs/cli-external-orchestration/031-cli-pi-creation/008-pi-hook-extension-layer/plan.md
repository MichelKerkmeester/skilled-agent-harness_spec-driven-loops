---
title: "Implementation Plan: Pi hook extension layer"
description: "Plan a live-probe-first bridge from Pi's native .pi/extensions/*.ts system into this repo's 8 runtime-neutral guard cores, documenting two candidate adapter shapes pending the probe's findings rather than assuming Claude/Codex/Cursor/Devin event parity."
trigger_phrases:
  - "pi hook adapter plan"
  - "pi extension bridge plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/008-pi-hook-extension-layer"
    last_updated_at: "2026-07-27T10:34:00Z"
    last_updated_by: "claude-code"
    recent_action: "Mapping table upgraded to docs-confirmed candidates; dependency table refreshed"
    next_safe_action: "Commit as Blocked; a future execution phase runs the live probe"
    blockers:
      - "Live-session probing requires running an actual pi session, out of this planning phase's own Hard Constraint"
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 55
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: pi-hook-extension-layer

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Pi extension modules, `.pi/extensions/*.ts`) plus the existing runtime-neutral guard cores, a mix of `.mjs` (ESM) and `.cjs` (CommonJS). The module system Pi's extension loader actually expects (raw ESM, transpiled, or something else) is itself UNCONFIRMED and is part of the live-probe scope. |
| **Framework** | None documented. Per pi.dev docs, extensions are auto-discovered plain TypeScript files, not a plugin framework with a base-class/interface hierarchy — whether a shared SDK type surface exists at all is UNCONFIRMED until the real type definitions are inspected (REQ-001). |
| **Storage** | None. |
| **Testing** | Fixture-based unit probing (mirroring the Codex/Devin/Cursor sibling suites' stdin-pipe smoke tests) once an adapter shape is chosen, plus a live `pi` session smoke test analogous to the Cursor precedent's temporary-probe-file methodology. |

### Overview
This phase plans — it does not build — a bridge from Pi's native TypeScript extension system to this repo's 8 runtime-neutral guard cores. It is structured as a live-probe-first investigation rather than an event-registration exercise, because Pi's `.pi/extensions/*.ts` auto-discovery model has no JSON hooks-config precedent to mirror the way Codex's `.codex/hooks.json`, Devin's `.devin/hooks.v1.json`, and Cursor's `.cursor/hooks.json` adapters did. The output of this phase is a falsifiable investigation protocol, a provisional (all-UNCONFIRMED) guard-to-lifecycle mapping table, and two candidate adapter architectures — not working code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` §2/§3) [EVIDENCE: `spec.md:92` §2]
- [x] Phase 001 (`pi-contract-pin`) has run — Pi CLI 0.82.1 installed [EVIDENCE: `../001-pi-contract-pin/implementation-summary.md`]
- [x] Phase 003 (`cli-pi-skill-packet`) has landed, giving a future implementation of this phase a `cli-pi` hub mode to attach to [EVIDENCE: `../003-cli-pi-skill-packet/implementation-summary.md` - Complete, 6 modes]

### Definition of Done (for this planning pass only — not the eventual build)
- [x] Live-probe protocol is concrete and executable (`spec.md` SC-001) [EVIDENCE: `plan.md` §4 Phase 1]
- [x] All 8 guard cores have an explicit mapping-table row (`spec.md` SC-002) [EVIDENCE: `plan.md` §3 mapping table, 8/8 rows, all 8 real file paths re-confirmed live during this closeout]
- [x] Two candidate adapter shapes are documented with tradeoffs (`spec.md` REQ-003) [EVIDENCE: `plan.md` §3 Key Components, Shape A/B]
- [x] Every claim sourced from pi.dev docs rather than confirmed live behavior is marked as such [EVIDENCE: `rg -c "UNCONFIRMED\|not live-session-verified\|DOCS-CONFIRMED" spec.md plan.md`]
- [x] `tasks.md` sequences the live probe strictly before any adapter authoring [EVIDENCE: `tasks.md` Phase 1 precedes Phase 2]
- [B] REQ-001's live-session probe (installing/running a real `pi` session to capture actual callback invocations) [DEFERRED: out of this phase's own scope per its Hard Constraint - planning only, no live Pi session run - a future execution phase performs this step]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Investigation-first bridge design, not yet a committed implementation pattern. Two competing candidate architectures are documented below for a future implementation phase to choose between once the live probe (Phase 1) resolves what the extension API actually exposes.

### Key Components
- **Live-probe protocol** (Phase 1 deliverable): the concrete steps a future implementer runs to discover Pi's real extension lifecycle surface before writing any adapter code — see §4 Phase 1.
- **Candidate Shape A — in-process direct-call**: an extension module `import()`s a guard core's `.mjs`/`.cjs` export directly and calls it inside the same Node process Pi runs in. Avoids the per-invocation `spawnSync` cost every other CLI's adapter pays, at the cost of needing each guard core's module format (mixed ESM/CJS across the 8 cores) to actually be loadable from wherever Pi's extension loader executes code — UNCONFIRMED whether Pi's loader tolerates arbitrary `node:child_process`/`node:fs` access from within an extension, or sandboxes it.
- **Candidate Shape B — spawnSync delegate-to-compiled-Claude-adapter**: mirrors `hooks/codex/shared.ts`, `hooks/devin/shared.ts`, and `hooks/cursor/shared.ts` exactly — the extension module spawns the existing compiled `hooks/claude/*.js` adapter as a subprocess and translates its output. Isolates any guard-core failure from Pi's own process, at the cost of the same per-invocation subprocess overhead every prior CLI's adapter already accepts.
- **Provisional mapping table** (8 guard cores; this phase's closeout upgraded the evidence class twice — first a live docs re-fetch, then a direct type-file read of the actually-installed `@earendil-works/pi-coding-agent` package at `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/core/extensions/types.d.ts`. Every "Candidate Pi Lifecycle Point" cell below cites a real line number in that file — TYPE-CONFIRMED, the strongest evidence class short of a captured live invocation, which REQ-001's acceptance criterion names as an equally valid citation. None of this has been LIVE-SESSION-CONFIRMED (an extension actually loaded and its callback observed firing) — that remains the residual gap for a future execution phase):

| Guard Core | Real Path | Existing CLI Adapters (precedent) | Candidate Pi Lifecycle Point (type-confirmed, `types.d.ts` line refs) |
|---|---|---|---|
| spec-gate enforce (Gate-3 BLOCK) | `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` (`evaluateMutation()`) | `runtime/hooks/{codex,devin,cursor}/spec-gate-enforce.mjs` | `tool_call`, filtered to `toolName === "bash"` (or `"write"`/`"edit"` if the mutation is a file write) — fires before execution, `ToolCallEventResult { block?: boolean; reason?: string }` (types.d.ts:772-776, 879); `event.input` is mutable in-place (types.d.ts:681-683). The exact deny-capable point this guard needs. |
| spec-gate classify (advisory) | same core, classify path | `runtime/hooks/{codex,devin,cursor}/spec-gate-classify.mjs` | `input`, fired on user input before agent processing, result shape `{action: "continue"\|"transform"\|"handled"}` (types.d.ts:621-641) |
| dispatch preflight lint | `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs` | `cli-opencode/scripts/hooks/{codex,devin}/dispatch-preflight-lint.mjs` | `tool_call` narrowed to `toolName === "bash"` via `BashToolCallEvent`/`isToolCallEventType("bash", ...)` (types.d.ts:646-649, 755) |
| dispatch audit | `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-audit.mjs` | `cli-opencode/scripts/hooks/{codex,devin}/dispatch-audit-posttooluse.mjs` | `tool_result` narrowed to `toolName === "bash"` via `BashToolResultEvent` (types.d.ts:694-697) |
| post-edit quality | `.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs` | `sk-code/code-quality/scripts/hooks/{codex,devin}/post-edit-quality.cjs` | `tool_result` narrowed to `toolName === "edit"` or `"write"` via `EditToolResultEvent`/`WriteToolResultEvent` (types.d.ts:702-709) |
| code-graph freshness | `.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs` | `system-code-graph/runtime/hooks/{codex,devin}/code-graph-freshness.cjs` | `tool_result` narrowed to `toolName === "edit"` or `"write"`, same event shape as post-edit quality above |
| mcp route guard | `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs` | `mcp-code-mode/runtime/hooks/{codex,devin,cursor}/mcp-route-guard.{cjs,mjs}` | `tool_call` via the `CustomToolCallEvent` catch-all (types.d.ts:674-677) — MCP tools are not among the 7 named built-ins (`bash`/`read`/`edit`/`write`/`grep`/`find`/`ls`), so this guard must match on `toolName` string prefix (e.g. `mcp__`), still block-capable via the same `ToolCallEventResult` |
| completion-evidence sentinel | `.opencode/skills/system-spec-kit/mcp-server/lib/hooks/completion-evidence-sentinel.cjs` | `system-spec-kit/mcp-server/hooks/{codex,devin}/completion-evidence-stop.cjs` | `agent_settled`, fired "after an agent run has fully settled and no automatic retry, compaction, or queued continuation will run" (types.d.ts:538-541) — a stronger match than `agent_end` (types.d.ts:534-537), which can still be followed by a retry |
| task-dispatch guard | `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs` | `system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs` (Codex folds this in; Devin gave it a dedicated adapter) | `tool_call` via the `CustomToolCallEvent` catch-all (block-capable) IF phase 006's `pi-subagents` registers a matchable custom tool name; still depends on that phase's own open question |

### Data Flow
Type-confirmed shape (via `types.d.ts`), pending live-session verification: a Pi lifecycle point fires (e.g. `tool_call`) inside the Pi process → the auto-discovered extension's `pi.on(event, handler)`-registered callback runs (`ExtensionFactory = (pi: ExtensionAPI) => void | Promise<void>`, types.d.ts:1078) → **[Shape A]** a direct in-process call into the guard core's exported function, **or** **[Shape B]** a `spawnSync` into the compiled Claude adapter with JSON on stdin/stdout → the handler returns a typed result object per event (`ToolCallEventResult { block?, reason? }` for `tool_call`, `ToolResultEventResult { content?, isError?, ... }` for `tool_result`, `InputEventResult` for `input`, etc. — types.d.ts:768-823). Each event has its own distinct result type, confirmed at the type level; whether the runtime actually enforces `block: true` the way the type contract promises is the residual gap REQ-001's live-session probe must close.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A — this is new-capability planning, not a fix to existing behavior. No file listed in `spec.md` §3 is touched by this authoring pass; every row there is a file **planned** for a future execution phase, not a file this phase itself changes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

These phases describe the **future execution** of this plan (a separately-scoped implementation pass, once phases 001/003/007 have landed for real), sequenced here so `tasks.md` can mirror it. This authoring pass performs none of them.

### Phase 1: Setup (live probe)
- [ ] Re-read `pi.dev/docs/latest/extensions` live at execution time — Pi is pre-1.0 and this phase's citations could already be stale
- [ ] Locate and type-introspect the extension registration surface shipped with the installed `@earendil-works/pi-coding-agent` package
- [ ] Author one minimal instrumented `.pi/extensions/*.ts` probe module that logs every lifecycle callback name/payload it receives
- [ ] Run a real interactive `pi` session and the phase-001-confirmed headless/programmatic dispatch surface, exercising session start, at least one tool call, and session end
- [ ] Record the confirmed lifecycle surface (names, payload shapes, block-capability) before writing any guard-core bridge code

### Phase 2: Core Implementation (gated on Phase 1)
- [ ] Choose Shape A, Shape B, or a hybrid based on the live-probe findings; record the decision and rationale
- [ ] Author `mcp-server/hooks/pi/**` and `runtime/hooks/pi/**`, mirroring the Codex/Devin/Cursor sibling structure
- [ ] Author the guard-specific sibling directories under `cli-opencode`, `sk-code/code-quality`, `system-code-graph`, `mcp-code-mode`, `system-deep-loop`
- [ ] Author the actual `.pi/extensions/*.ts` entrypoint(s), resolving the single-consolidated-vs-one-per-guard question (`spec.md` REQ-008)

### Phase 3: Verification (gated on Phase 2)
- [ ] Fixture-based unit probing of fail-open behavior for each bridged guard
- [ ] Live smoke test each wired lifecycle point against a real `pi` session, capturing evidence
- [ ] Confirm `git diff` shows all 8 runtime-neutral guard cores byte-unchanged
- [ ] Document any guard core the probe shows cannot be bridged as an explicit, named gap
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (future) | Guard-core bridge payload validation, fail-open behavior, per-adapter translation | Node's built-in test runner or Vitest, mirroring the Codex/Devin/Cursor sibling suites |
| Integration (future) | Full lifecycle-point round trip through the shared guard core, once real event names are confirmed | Fixture payloads shaped to match the live-probed schema |
| Manual (future) | Live `pi` session smoke test per bridged lifecycle point | Installed `pi` CLI |
| This phase | None — planning only; no adapter code exists yet to test | N/A |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 (`pi-contract-pin`) | Internal | Complete — Pi CLI 0.82.1 installed | Every mapping-table row is now docs-confirmed-as-candidate (not yet live-session-confirmed); a future execution phase can run Phase 1's live probe directly against the installed binary |
| Phase 003 (`cli-pi-skill-packet`) | Internal | Complete — `cli-pi` registered as the hub's 6th mode | A future adapter phase now has a hub-mode context to attach to |
| Phase 007 (`pi-mcp-host-integration`) | Internal | Blocked — planning-only, its own primary go/no-go gate (stdio transport) still open | Sequencing-only — immediately preceding phase in the packet's serial numbering; not a hard technical blocker for the guard-hook bridge itself |
| Installed `pi` binary + `.pi/` config surface | External | Green — `pi` 0.82.1 installed (`command -v pi` returns `/Users/michelkerkmeester/.local/bin/pi`); no `.pi/` directory exists yet | A future execution phase has a real binary to probe against; still no live session run by THIS planning phase |
| `hooks/codex/`, `hooks/devin/`, `hooks/cursor/` structural precedent | Internal | Green (all three re-confirmed live on disk during this closeout) | Provides the two candidate adapter shapes this phase documents |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A future execution phase discovers Pi's extension API cannot intercept — let alone deny — a tool call at all (only post-hoc observation), so the deny-capable guards (`spec-gate-enforce` in particular) cannot be bridged as designed.
- **Procedure**: Document the gap explicitly in that phase's own decision-record, mirroring the empty `PermissionRequest` (Devin) and non-firing `beforeSubmitPrompt`/`stop` (Cursor) precedent, rather than shipping a bridge that silently no-ops on the one guard that actually needs deny power. This planning phase itself has no code to roll back — reverting it means discarding this `spec.md`/`plan.md`/`tasks.md`/`checklist.md` content, a zero-blast-radius operation since no runtime file outside this phase folder is touched.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
