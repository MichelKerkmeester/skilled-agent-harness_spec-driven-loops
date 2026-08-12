---
title: "Implementation Summary: Cross-Runtime Directive Lifecycle"
description: "The [SYS] runtimes now keep the dynamic Advisor route line and drop the three constant directives on a confirmed session's proven same-content repeat within a lifecycle epoch, via one canonical core, a shim wiring, and a plugin mirror — fail-open everywhere, Pi untouched."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "cross-runtime directive lifecycle implementation"
  - "directive lifecycle dedup summary"
importance_tier: "high"
contextType: "implementation"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/014-cross-runtime-directive-lifecycle"
    last_updated_at: "2026-08-11T09:40:00Z"
    last_updated_by: "claude"
    recent_action: "Initial lifecycle delivery completed; phase 018 supplied security and evidence hardening"
    next_safe_action: "None; historical packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts"
      - ".opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs"
    session_dedup:
      fingerprint: "sha256:ef050f8ecea929f0e039fd74bb29b96f6a97e116bc61469d148b73a44d1cfbe9"
      session_id: "2026-08-11-cross-runtime-directive-lifecycle"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Cross-Runtime Directive Lifecycle

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-cross-runtime-directive-lifecycle |
| **Status** | Complete |
| **Created** | 2026-08-11 |
| **Level** | 2 |
| **Completion** | 100% — historical delivery scope completed and later hardened by phase 018 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet introduced the canonical decision, shim wiring, plugin mirror, and initial suites. The later remediation packet split the contract and hardened file-store, lifecycle-boundary, identity, adapter, and evidence behavior; that packet is authoritative for current implementation detail.

1. **The canonical core.** `hooks/lib/directive-lifecycle.ts` owns the lifecycle rule: `splitDirectiveBrief` separates the dynamic `Advisor:` head from the constant directive block on `\nDirectives:`; `decideDirectiveLifecycleDelivery(context, input)` suppresses the block (returning the route line) only for a confirmed session's byte-identical same-epoch repeat, re-delivering full on the first message of a session and after every lifecycle boundary (`startup`/`resume`/`compact`, or a transcript path-change/shrink signature). Every uncertain case — unknown/unconfirmed session, directives-only fallback, kill-switch, corrupt/missing store, any throw — falls open to the full brief. State is swappable: `InMemoryDirectiveLifecycleStore` for in-process adapters and tests, and `FileDirectiveLifecycleStore` for the per-call subprocess shim, persisting per-session JSON under `${SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR ?? tmpdir}/speckit-advisor/directive-lifecycle/<project-hash>/` with atomic writes, 0700 dirs / 0600 files, and a 64-session bound with oldest-record eviction. The kill-switch `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` (0|false|off|no) disables it; default on.

2. **The shim wiring.** `hooks/claude/user-prompt-submit.ts` (shared by the Claude/Cursor/Devin/Codex adapters) computes session id, confirmation (`session_identity_confirmed` ?? `hasSessionId && !ambiguous`), the lifecycle event (`lifecycle_event`/`lifecycle_source`, or `SessionStart` with a startup/resume/compact source), and the transcript path/size signature, then applies the decision to the rendered brief before emitting `additionalContext`; `observeEmittedAdvisorPolicy` observes the effective (possibly reduced) emission. Any thrown error keeps the full brief.

3. **The plugin mirror.** `plugins/mk-skill-advisor.js` mirrors the decision in plain JS per the render.ts-mirror convention: `decideOpenCodeDirectiveLifecycle` over a per-instance `state.directiveDedupBySession` map (bounded 64), integrated at the transform push point, re-armed on `session.created`/`session.resumed`/`session.compacted`/`session.compact`/`session.deleted` and on runtime reset, with the status tool gaining `directive_lifecycle_dedup` and `directive_dedup_sessions` lines.

4. **The tests.** `tests/hooks/directive-lifecycle.vitest.ts` (21 cases: decision branches, kill-switch env, file-store behavior); shim DL1-DL6 in `claude-user-prompt-submit-hook.vitest.ts`; plugin PL1-PL7 in `mk-skill-advisor-plugin.vitest.ts`, plus two pre-existing repeat-turn tests updated to the new route-line-only expectations (`ROUTE_ONLY_CONTEXT`).

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 013 fixed Pi's visible `[MSG]` repetition with an adapter-local dedup. The same constant ~763 B directive block still rides the invisible `[SYS]` context on the Claude/Cursor/Devin/Codex shim and the OpenCode plugin on every prompt. The central 002 machine (candidate 004's full-first + route-only repeats) is shadow-only in every runtime and the 007 gate hardcodes zero activation, so this phase generalized the 013 lifecycle rule with one canonical core instead of activating the central machine. The core was authored to be consumption-agnostic (pure decision + injected state), the shim wired it with the file store for its per-call subprocess model, and the plugin mirrored it in plain JS because that file cannot build the TypeScript core — the mirror comment explicitly prefers importing a compiled dist when one exists. Pi was deliberately left untouched: it calls the shim without a session id, so the shim always fails open there and Pi's own 013 dedup remains the only active mechanism on that runtime. Tests were written against every branch and every consumer, with the status lines added for operator observability.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One canonical core in `hooks/lib`, not per-adapter copies | The same rule now serves four shim runtimes plus the plugin; a single owner keeps the separator, boundary set, and fail-open semantics identical. The plugin gets a documented plain-JS mirror only because it cannot build TS, and the mirror points back at the canonical file. |
| File-backed store for the shim, in-memory map for the plugin | The shim runs as a fresh subprocess per call, so dedup state must survive across processes; per-session JSON keyed by project hash + session hash does that durably. The plugin is a long-lived process, so a per-instance Map with lifecycle re-arm is enough and cheaper. Both are bounded (64) and both fail open. |
| Transcript shrink/path-change signature as an extra boundary | Hosts do not always emit an explicit compact event to the shim; treating a shrunk or moved transcript as a boundary re-delivers the full guardrail block exactly when history may have been summarised — and the signature is fail-open (missing stat → never suppresses on that signal alone). |
| Fail-open on every uncertain path | A guardrail is never silently dropped: unknown/unconfirmed session, directives-only fallback (no head to keep), kill-switch, corrupt/missing store, and any thrown error all deliver the full brief. |
| Pi untouched; layering transparent | Pi calls the shim with no session id, so the shim's dedup always fails open there; Pi's own 013 dedup keeps working. No double suppression, no loss, zero diff on `prompt-advisor.ts`. |
| Bridge stays a pure producer | The delivery decision lives in the consumers; the bridge (and `render.ts`, `policy-plan.ts`, the 007 matrix) has zero diff — the central program remains shadow with zero activated cells. |
| Default on with a kill-switch | Mirrors 013: the recurring-payload pain is resolved without per-session configuration; `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` restores always-full delivery at runtime. |
| Status-tool observability | `directive_lifecycle_dedup` and `directive_dedup_sessions` lines let an operator confirm the feature state and active session count without digging into logs. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Implementation surface | PASS (static) — canonical core present with full export surface; shim wires the decision into `effectiveEmitted`; plugin mirror + lifecycle re-arm + status lines present. |
| Test suites written | PASS (static) — `directive-lifecycle.vitest.ts` 21 cases; shim DL1-DL6; plugin PL1-PL7; two pre-existing plugin tests updated to `ROUTE_ONLY_CONTEXT` expectations. |
| Frozen-file scope | PASS (static) — zero git diff on `render.ts`, `policy-plan.ts`, the 007 activation folder, the bridge, and `prompt-advisor.ts`; bridge has zero directive-lifecycle references. |
| Comment hygiene | PASS (static) — durable WHY comments only; no ephemeral ids or spec paths in code comments. |
| Full suite run | PASS — directive-lifecycle.vitest.ts 21/21; claude-user-prompt-submit-hook.vitest.ts 16/16 (incl. DL1-DL6); mk-skill-advisor-plugin.vitest.ts 38/38 (incl. PL1-PL7); Pi dispatch suite 54/54. 129 tests green. Detached-HEAD baseline: the 7 new plugin failures at first run were test-mock defects (fixed); the 6 pre-existing plugin failures (stale fallback constant, stale 10s-default-timeout assumption) were root-caused and fixed in the same file. Remaining full-suite failures reproduce identically at HEAD (pre-existing, other files). |
| Recursive spec validation | PASS — 014 `validate.sh --strict` clean (after frontmatter compaction; description.json/graph-metadata.json warnings resolved by parent generation); parent `--recursive` clean except pre-existing 011/012 SPEC_DOC_INTEGRITY failures documented in the parent phase map. |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Long session without compaction.** On repeat turns the directives live only in the turn-1 message retained in context; a very long session that never compacts relies on that retention. This is the same accepted trade-off as 013, now with a second mitigation on the shim: a transcript shrink or path change re-delivers the full block even when no explicit compact event arrives.
2. **Per-call subprocess durability is best-effort.** The file-backed store's writes, evictions, and reads all fail open; a genuinely lost or corrupt record simply costs one full re-delivery, never a suppression. The store is disposable by design.
3. **Pi intentionally still re-renders full from the shim's perspective.** Pi calls the shim session-less, so the shim always delivers full to Pi; Pi's own 013 dedup is what suppresses there. A future phase could thread Pi's session id through, but that would couple the two mechanisms and is deliberately out of scope.
4. **Plugin mirror drift risk.** The plugin's plain-JS mirror can drift from the canonical TS core over time; the mirror's header comment names the canonical file and prefers importing a compiled dist when one exists. Gate verification includes the PL1-PL7 suite to catch behavioral drift.
5. **Full-suite pre-existing failures elsewhere.** The mcp-server suite carries ~33 pre-existing failures in files outside this feature's scope (launcher env-filter, scorer embedding lanes, legacy advisor suites — verified identical at detached HEAD). They are tracked separately; this packet introduces zero regressions.

<!-- /ANCHOR:limitations -->
