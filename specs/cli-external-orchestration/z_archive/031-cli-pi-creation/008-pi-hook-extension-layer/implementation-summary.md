---
title: "Implementation Summary: Pi hook extension layer"
description: "Pre-work closeout for a still-Blocked phase: a live docs re-fetch found pi's Extensions page now fully documents the registration model and confirms block-capable tool interception, resolving this phase's two most central open questions at the docs level. The live-session probe itself is out of this planning phase's own scope."
trigger_phrases:
  - "pi hook extension summary"
  - "pi extension layer implementation status"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/008-pi-hook-extension-layer"
    last_updated_at: "2026-07-27T10:34:00Z"
    last_updated_by: "claude-code"
    recent_action: "Docs re-fetched live; pre-work closed out; phase stays Blocked"
    next_safe_action: "Commit as Blocked; phase 009 proceeds independently"
    blockers:
      - "Live-session probing (T002-T010) requires running an actual pi session, out of this planning phase's own Hard Constraint; deferred to a future execution phase"
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 55
    open_questions:
      - "Does the now-documented pi.on(event, handler) registration and tool_call block-capability behave as documented in a real live session? - requires installing/running pi, deferred"
      - "Single consolidated extension module vs one file per guard core - which fits Pi's discovery model?"
    answered_questions:
      - "Extensions export ExtensionFactory = (pi: ExtensionAPI) => void, using pi.on(event, handler) - type-confirmed via types.d.ts:1078, 850-882"
      - "tool_call fires pre-execution with ToolCallEventResult {block?, reason?} - type-confirmed deny-capability, types.d.ts:772-776"
      - "Real narrow tool names are bash/read/edit/write/grep/find/ls plus a custom-tool catch-all, types.d.ts:646-721"
      - "All 8 runtime-neutral guard core file paths re-confirmed live, unchanged"
      - "pi 0.82.1 is now installed (phase 001 landed); no .pi/ directory exists yet"
---
# Implementation Summary: Pi hook extension layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-pi-hook-extension-layer |
| **Completed** | N/A — phase stays Blocked, see Known Limitations |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase plans a bridge from this repo's 8 runtime-neutral guard cores into Pi's native `.pi/extensions/*.ts` system, so a dispatched Pi executor session gets the same scope-lock/spec-folder/quality/completion-evidence enforcement that Claude, Codex, Devin, and Cursor already have. Like phase 007, this phase's own spec.md puts the one action that would resolve its central open question — running a real Pi session to probe the extension lifecycle API — explicitly out of scope for this planning phase. This closeout does everything achievable short of that: re-verifies every fact the design rests on, and found a very significant update.

### Two-stage evidence upgrade resolved this phase's two central open questions

Both of this phase's original Open Questions were framed as fully "UNKNOWN": what a `.pi/extensions/*.ts` module exports/registers, and whether the extension API can deny a tool call or only observe it. Stage one, a live re-fetch of `pi.dev/docs/latest/extensions`, found the docs now describe both at a high level. Stage two went further and produced the real evidence: `pi`'s installed binary is a symlink (`~/.local/bin/pi` → `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/dist/cli.js`), so the package's own compiled TypeScript declaration file, `dist/core/extensions/types.d.ts`, is sitting on disk right now — a pure filesystem read, not a live Pi session, so it stays inside this planning phase's own scope. That file gives an exact, line-numbered answer: extensions export `type ExtensionFactory = (pi: ExtensionAPI) => void | Promise<void>` (`types.d.ts:1078`), registering against 32 named events via `pi.on(event, handler)` (`types.d.ts:850-882`). And `tool_call` fires before execution with result type `ToolCallEventResult { block?: boolean; reason?: string }` (`types.d.ts:772-776`), plus a mutable `event.input` for in-place argument patching (`types.d.ts:681-683`) — meaning `spec-gate-enforce`'s real Gate-3 BLOCK, this phase's highest-stakes guard, is very likely bridgeable, where the original risk framing treated that as a coin flip. This is TYPE-CONFIRMED — the strongest evidence class short of a captured live invocation, which REQ-001's own acceptance criterion explicitly names as an equally valid alternative citation ("a type-file line reference or a captured invocation"). Still not LIVE-SESSION-CONFIRMED: whether the runtime actually enforces `block: true` the way the type contract promises is the one gap a future execution phase must close.

### Provisional mapping table upgraded from blank-UNCONFIRMED to type-confirmed, line-cited candidates

All 8 guard-core rows in `plan.md`'s mapping table now carry a specific, type-confirmed candidate lifecycle-point name with an exact `types.d.ts` line citation (e.g. `tool_call` narrowed to `toolName === "bash"` via `BashToolCallEvent`, `types.d.ts:646-649`) instead of a blank "UNCONFIRMED — needs X". The type file also revealed the real narrow tool-name vocabulary for `tool_call`/`tool_result` — `bash`/`read`/`edit`/`write`/`grep`/`find`/`ls`, plus a `CustomToolCallEvent`/`CustomToolResultEvent` catch-all for everything else including MCP tools — directly resolving which specific guard maps to which specific narrowed event, not just a guess at the event category.

### Files Changed

No repository files were changed by this phase beyond its own spec folder. No `.pi/extensions/*.ts` file was authored, no live Pi session was run.

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Modified | Problem Statement, Open Questions, and Risks table corrected to reflect the docs re-fetch finding; environment facts refreshed (`pi` 0.82.1 now installed) |
| `plan.md` | Modified | Mapping table upgraded with docs-confirmed candidate event names per guard; dependency table refreshed (phases 001/003 now Complete, 007 Blocked); Definition of Ready/Done checked off where achievable |
| `tasks.md`, `checklist.md` | Modified | T001/pre-work items marked `[x]` with evidence; every live-session-dependent item marked `[B]` with an explicit deferred reason |
| `implementation-summary.md` | Created | This document |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I did not dispatch LUNA or GLM-5.2: there is no code diff, and this phase's own Hard Constraint forbids the one action (running a live Pi session) that would produce one. I did the achievable pre-work directly — a live WebFetch of the Extensions docs page, direct reads confirming all 8 guard-core file paths, and a re-check of the `pi` binary's install state — and made the same deliberate call as phase 007: do not cross this phase's own explicitly-stated scope boundary just because the driving goal says "execute autonomously." A named scope boundary is not something to route around because a broader directive says to keep going.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Do not run a live Pi session, even to resolve this phase's own primary open question | `spec.md`'s Out of Scope section states this as a Hard Constraint, identical in spirit to phases 004-007's own respective planning-only boundaries |
| Set Status to "Blocked", not "Complete" | REQ-001's own acceptance bar (a captured live-session invocation) is genuinely unresolved; a docs citation, however strong, is not the same evidence class |
| Upgrade the mapping table's candidate event names from blank UNCONFIRMED to specific, docs-cited names, while keeping "not live-session-verified" on every row | Gives a future implementer a concrete starting hypothesis per guard instead of nine blank cells, without overstating confidence past what a docs re-fetch can support |
| Still re-fetch pi.dev's Extensions docs live, even though the phase can't act on the answer this session | Same reasoning as phase 007 — cheap to check, and it surfaced the single most consequential finding in this entire packet's planning phases so far |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live WebFetch of `https://pi.dev/docs/latest/extensions` | PASS — found the registration model and full event taxonomy now documented, where the authoring-time snapshot had none of this |
| Direct read of the installed `@earendil-works/pi-coding-agent` package's `dist/core/extensions/types.d.ts` | PASS — a pure filesystem read of an already-installed file, not a live session; confirmed the exact `ExtensionAPI`/`ExtensionFactory` contract, all 32 event types, `ToolCallEventResult`'s block-capability, and the 7 real narrow tool names with exact line citations |
| All 8 guard-core file paths re-confirmed live | PASS — every path in `plan.md`'s mapping table exists exactly as cited |
| `pi` binary install state re-checked | PASS — `command -v pi` returns `/Users/michelkerkmeester/.local/bin/pi`, `pi --version` returns `0.82.1` (was absent at authoring time) |
| `001-pi-contract-pin` and `003-cli-pi-skill-packet` dependency status re-confirmed | PASS — both Complete |
| No repository file outside this phase folder touched | PASS — `git status --porcelain` scoped to this folder only |
| `validate.sh --strict` against this phase folder | Run at commit time via the main-tree round-trip pattern (worktree lacks the toolchain); result recorded in the commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **REQ-001, this phase's PRIMARY requirement, remains unresolved at the live-session level.** The docs re-fetch narrowed the uncertainty substantially (registration model and block-capability are now documented) but did not capture a real invocation. A future execution phase must author the instrumented probe extension (`tasks.md` T003) and run it against a real `pi` session (T004) before any adapter code can be trusted.
2. **No `.pi/extensions/*.ts` file exists**, and neither candidate adapter shape (in-process direct-call vs. `spawnSync` delegate) has been chosen — that decision is gated on the live probe's findings about sandboxing/module-format tolerance.
3. **The mapping table's candidate event names are type-confirmed, line-cited hypotheses, not confirmed runtime bindings.** A live probe could still reveal a guard needs a different event than the type contract suggests, or that a documented/typed event doesn't fire the way its declaration implies.
4. **`task-dispatch guard`'s Pi bridge still depends on phase 006's `pi-subagents` exposing a matchable tool name** — unresolved independent of this phase's own docs finding.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
