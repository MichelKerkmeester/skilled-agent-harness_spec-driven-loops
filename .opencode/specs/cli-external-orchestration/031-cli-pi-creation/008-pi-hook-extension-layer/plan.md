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
    last_updated_at: "2026-07-27T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md with two candidate adapter shapes and an 8-guard mapping table"
    next_safe_action: "Author tasks.md and checklist.md next"
    blockers:
      - "depends on 001-pi-contract-pin landing first"
      - "depends on 003-cli-pi-skill-packet landing first"
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "../001-pi-contract-pin/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 0
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
- [ ] Problem statement clear and scope documented (`spec.md` §2/§3)
- [ ] Phase 001 (`pi-contract-pin`) has run, or this phase's own live-probe step (Phase 1 below) is explicitly scoped to cover the extension-loading gap 001 leaves open
- [ ] Phase 003 (`cli-pi-skill-packet`) has landed, giving a future implementation of this phase a `cli-pi` hub mode to attach to

### Definition of Done (for this planning pass only — not the eventual build)
- [ ] Live-probe protocol is concrete and executable (`spec.md` SC-001)
- [ ] All 8 guard cores have an explicit mapping-table row (`spec.md` SC-002)
- [ ] Two candidate adapter shapes are documented with tradeoffs (`spec.md` REQ-003)
- [ ] Every claim sourced from pi.dev docs rather than confirmed live behavior is marked as such
- [ ] `tasks.md` sequences the live probe strictly before any adapter authoring
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
- **Provisional mapping table** (8 guard cores, every row UNCONFIRMED pending the live probe):

| Guard Core | Real Path | Existing CLI Adapters (precedent) | Candidate Pi Lifecycle Point |
|---|---|---|---|
| spec-gate enforce (Gate-3 BLOCK) | `.opencode/skills/system-spec-kit/runtime/lib/spec-gate/spec-gate-core.mjs` (`evaluateMutation()`) | `runtime/hooks/{codex,devin,cursor}/spec-gate-enforce.mjs` | UNCONFIRMED — needs a deny-capable pre-write/pre-exec interception point |
| spec-gate classify (advisory) | same core, classify path | `runtime/hooks/{codex,devin,cursor}/spec-gate-classify.mjs` | UNCONFIRMED — needs a prompt-submit-time point |
| dispatch preflight lint | `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs` | `cli-opencode/scripts/hooks/{codex,devin}/dispatch-preflight-lint.mjs` | UNCONFIRMED — needs a pre-shell-exec interception point |
| dispatch audit | `.opencode/skills/cli-external-orchestration/cli-opencode/scripts/lib/dispatch-audit.mjs` | `cli-opencode/scripts/hooks/{codex,devin}/dispatch-audit-posttooluse.mjs` | UNCONFIRMED — needs a post-shell-exec observation point |
| post-edit quality | `.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs` | `sk-code/code-quality/scripts/hooks/{codex,devin}/post-edit-quality.cjs` | UNCONFIRMED — needs a post-file-write observation point |
| code-graph freshness | `.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs` | `system-code-graph/runtime/hooks/{codex,devin}/code-graph-freshness.cjs` | UNCONFIRMED — needs a post-file-write observation point |
| mcp route guard | `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs` | `mcp-code-mode/runtime/hooks/{codex,devin,cursor}/mcp-route-guard.{cjs,mjs}` | UNCONFIRMED — needs a pre-MCP-tool-call interception point |
| completion-evidence sentinel | `.opencode/skills/system-spec-kit/mcp-server/lib/hooks/completion-evidence-sentinel.cjs` | `system-spec-kit/mcp-server/hooks/{codex,devin}/completion-evidence-stop.cjs` | UNCONFIRMED — needs a session/turn-stop observation point |
| task-dispatch guard | `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs` | `system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs` (Codex folds this in; Devin gave it a dedicated adapter) | UNCONFIRMED — depends on whether phase 006's `pi-subagents` exposes a matchable tool name |

### Data Flow
Candidate, pending the live probe: a Pi lifecycle point fires (name UNCONFIRMED) inside the Pi process → the auto-discovered extension module's registered callback runs → **[Shape A]** a direct in-process call into the guard core's exported function, **or** **[Shape B]** a `spawnSync` into the compiled Claude adapter with JSON on stdin/stdout → the result is translated into whatever response shape Pi's extension API expects for that lifecycle point. That response shape is itself UNCONFIRMED — it could be a return value, a thrown exception to block, a mutated callback argument, or something unlike every prior CLI's stdout-JSON-envelope convention (Codex/Devin's `hookSpecificOutput.additionalContext`, Cursor's `{permission, user_message, agent_message}`).
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
| Phase 001 (`pi-contract-pin`) | Internal | Red (Planned, not started) | No live-verified extension API surface exists; every mapping-table row stays UNCONFIRMED until 001's own extension-loading findings land, or until this phase's own Phase 1 Setup step runs the probe independently |
| Phase 003 (`cli-pi-skill-packet`) | Internal | Red (Planned, not started) | No `cli-pi` hub-mode context for a future adapter phase to register against |
| Phase 007 (`pi-mcp-host-integration`) | Internal | Red (Planned, not started) | Sequencing-only — immediately preceding phase in the packet's serial numbering; not a hard technical blocker for the guard-hook bridge itself |
| Installed `pi` binary + `.pi/` config surface | External | Red — confirmed absent from this environment at authoring time (`command -v pi` empty, no `.pi/` directory) | Blocks any live probe or smoke test; phase 001 owns the install |
| `hooks/codex/`, `hooks/devin/`, `hooks/cursor/` structural precedent | Internal | Green (all three confirmed live on disk at authoring time) | Provides the two candidate adapter shapes this phase documents |
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
