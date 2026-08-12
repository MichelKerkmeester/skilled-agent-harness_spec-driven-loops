---
title: "Spec: Cross-Runtime Directive Lifecycle"
description: "Extend the 013 lifecycle rule to the model-context [SYS] runtimes: a canonical directive-lifecycle core drops the three constant advisor directives on a proven same-content repeat within a lifecycle epoch across the Claude/Cursor/Devin/Codex shim and the OpenCode plugin, fail-open everywhere, with Pi's local dedup and the shadow program untouched."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "cross-runtime directive lifecycle"
  - "directive lifecycle dedup"
  - "SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP"
  - "model-context directive suppression"
  - "constant directive repetition"
importance_tier: "high"
contextType: "spec"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/014-cross-runtime-directive-lifecycle"
    last_updated_at: "2026-08-11T09:40:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented canonical directive-lifecycle core, shim wiring, and OpenCode plugin mirror"
    next_safe_action: "None; packet complete, parent map reconciled"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts"
      - ".opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs"
    session_dedup:
      fingerprint: "sha256:001aa2786f1ac46c691b5ccd75ef6bceaec5c69116d3174be1030e7db7ea95d5"
      session_id: "2026-08-11-cross-runtime-directive-lifecycle"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Cross-Runtime Directive Lifecycle

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-cross-runtime-directive-lifecycle |
| **Status** | Complete |
| **Created** | 2026-08-11 |
| **Level** | 2 |
| **Predecessor** | 013-pi-local-directive-dedup |
| **Successor** | 015-directive-docs-alignment |
| **Priority** | P2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The three constant advisor directives (comment-hygiene, governor, proof-over-appearance, ~763 B) are appended to every turn on every runtime. Phase 013 fixed the **visible** Pi `[MSG]` repetition with a Pi-adapter-local dedup. This phase extends the same lifecycle rule to the **model-context `[SYS]` runtimes**: the shared Claude/Cursor/Devin/Codex shim (`hooks/claude/user-prompt-submit.ts`, consumed by all four hook adapters) and the OpenCode plugin (`plugins/mk-skill-advisor.js`). On those runtimes the repetition is invisible but still occupies context on every prompt — the exact payload the 002 program's candidate 004 models (full-first + route-only repeats), which remains **shadow-only in every runtime** with the 007 activation gate hardcoding zero activated cells.

The purpose here is a canonical, cross-runtime lifecycle rule with one source of truth: deliver the full brief on the first message of a session and after every lifecycle boundary, and on a proven same-content repeat within one lifecycle epoch keep the dynamic `Advisor:` route line while dropping the constant directive block. Every uncertain case falls open to the full brief so a guardrail is never silently dropped. Pi stays untouched: it calls the shim without a session id, so the shim's dedup always fails open there and Pi's own 013 dedup (`SPECKIT_PI_DIRECTIVE_DEDUP`) keeps working — the layering is intentionally transparent.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: the new canonical core `hooks/lib/directive-lifecycle.ts` (`decideDirectiveLifecycleDelivery`, `splitDirectiveBrief` on the `\nDirectives:` separator, `InMemoryDirectiveLifecycleStore`, `FileDirectiveLifecycleStore` under the `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` env override or `tmpdir/speckit-advisor/directive-lifecycle/<project-hash>/`, and the kill-switch `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP`); the shim's wiring of the decision into the emitted `additionalContext` envelope (lifecycle events, transcript-shrink/path-change signature); the OpenCode plugin's plain-JS mirror with its in-process per-session map, lifecycle re-arm, and status-tool lines; and the three vitest suites (`directive-lifecycle.vitest.ts` core+store, `claude-user-prompt-submit-hook.vitest.ts` DL1-DL6, `mk-skill-advisor-plugin.vitest.ts` PL1-PL7 plus two pre-existing repeat-turn tests updated to the new expectations).

Out of scope: `render.ts` and its shadow route-only path, `policy-plan.ts`, the phase-007 `activation-matrix.json` and its zero-activation invariants, the bridge (`plugin-bridges/mk-skill-advisor-bridge.mjs`, which stays a pure producer — the delivery decision lives in the consumers), `prompt-advisor.ts` (Pi, untouched), and any activation of a central 002 candidate. This packet changes what the `[SYS]` runtimes emit on repeats and nothing else.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P0]** On the model-context runtimes (shim + OpenCode plugin), the full brief is delivered on the first message of a session and after every lifecycle boundary: `startup`/`resume`/`compact` lifecycle events, or — for the shim — a transcript path-change or shrink signature that indicates compaction/clear without an explicit event.
- **REQ-002 [P0]** On a **confirmed** session's proven **same-content** repeat within one lifecycle epoch, the delivered context keeps the dynamic `Advisor:` route line and drops the constant directive block; suppression requires a byte-identical directive block and an unambiguous session identity.
- **REQ-003 [P0]** Fail-open: an unknown or unconfirmed session id, the directives-only fallback brief (no route-line head to keep), the kill-switch, a corrupt or missing file-backed store, or any thrown error yields the full brief — a guardrail is never silently dropped.
- **REQ-004 [P0]** Session isolation: dedup state is per-session; one session's suppression never suppresses another's delivery, and both stores are bounded (64 sessions) with oldest-record eviction.
- **REQ-005 [P0]** Pi non-interference: `prompt-advisor.ts` is untouched and keeps its 013 local dedup (`SPECKIT_PI_DIRECTIVE_DEDUP`); because Pi calls the shim without a session id, the shim's dedup always fails open there, so the two mechanisms layer transparently with no double suppression and no loss.
- **REQ-006 [P1]** A kill-switch `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` (or false/off/no) reverts to always-full delivery; the feature is otherwise on by default. `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` overrides the file-store base directory (test/override path).
- **REQ-007 [P1]** No change to `render.ts`, `policy-plan.ts`, the 007 activation matrix, or the bridge; the central 002 program stays shadow with zero activated cells, and no cell is activated by this packet.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** The canonical core suite (`directive-lifecycle.vitest.ts`, 21 cases) proves: first-turn full; same-content repeat suppressed with the route line kept; dirty directive text re-delivers full; changed route line with unchanged directives still suppresses; every lifecycle boundary (startup/resume/compact) re-delivers full; transcript shrink and path-change re-arm while normal growth does not; unknown/unconfirmed sessions never suppress; the directives-only fallback is never suppressed; the kill-switch reverts to always-full; sessions are isolated; a non-reducible brief (no separator) delivers full; the file store round-trips per session, persists across store instances (per-call subprocess simulation), fails open on a corrupt record, evicts the oldest record at the bound, and honors the env-overridable base dir.
- **SC-002** The shim suite proves DL1-DL6: first turn full and repeat drops only the directive block; re-delivery after a compact boundary; no suppression without a confirmed session id; kill-switch always-full; fallback brief always full; transcript-shrink re-arms full delivery.
- **SC-003** The plugin suite proves PL1-PL7: same-content repeat keeps the route line and drops the block; `session.compacted` and transform-carried lifecycle events re-deliver full; unknown session never suppresses; kill-switch always-full; session isolation; the status tool reports `directive_lifecycle_dedup` and `directive_dedup_sessions`. The two pre-existing repeat-turn tests updated to the new expectations pass unchanged otherwise.
- **SC-004** Scope: `render.ts`, `policy-plan.ts`, the 007 activation matrix, the bridge, and `prompt-advisor.ts` are byte-identical to their prior revisions; the Pi suite still passes; no central 002 cell is activated.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Long session without compaction.** On repeat turns the directives live only in the turn-1 message still in context; a very long session that never compacts relies on that retention. This is the same accepted trade-off as 013, with one extra mitigation here: the shim also treats a transcript shrink or path change as a boundary, so any history-summarising event re-delivers the full block even when the host omits an explicit lifecycle event.
- **Transcript-shrink heuristic is fail-open.** The shim's `statSync` on `transcript_path` can fail (missing file, unreadable), in which case the signature is `null` and the decision never suppresses on that signal alone — it degrades to full delivery, never to a silent drop.
- **Per-call subprocess durability.** The Claude/Cursor/Devin/Codex hook runs as a fresh subprocess per call; the file-backed store makes dedup state durable across calls, keyed by project hash + session hash, and every IO path (missing/corrupt record, failed write, failed eviction) fails open to full delivery.
- **Brief-format drift.** The split keys on the `\nDirectives:` separator (mirrors `render.ts` `DIRECTIVES_LABEL`). If the format ever drifts past that separator, the split returns "not reducible" and the adapter delivers the full brief — a safe degradation, not a silent drop.
- **Dependencies.** None new. Uses `node:crypto` (sha256 for the project/session file keys) and `node:fs`/`node:os`/`node:path` already in the runtime's toolchain; the plugin mirror uses no new imports.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The historical scope completed with default-on delivery and an always-full kill-switch. Phase 018 is authoritative for the current high-water, trusted-boundary, hardened-store, identity, adapter, and evidence contracts.

<!-- /ANCHOR:questions -->
