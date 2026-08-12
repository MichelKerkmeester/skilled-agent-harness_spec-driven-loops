---
title: "Plan: Cross-Runtime Directive Lifecycle"
description: "Add a canonical directive-lifecycle core and wire it into the [SYS] runtime consumers (shim + OpenCode plugin) so a proven same-content repeat keeps the route line and drops the constant directive block, fail-open, reset on lifecycle boundaries."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "cross-runtime directive lifecycle plan"
  - "directive lifecycle dedup plan"
importance_tier: "high"
contextType: "plan"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/014-cross-runtime-directive-lifecycle"
    last_updated_at: "2026-08-11T08:31:00Z"
    last_updated_by: "claude"
    recent_action: "Initial lifecycle delivery shipped; phase 018 hardened the current implementation"
    next_safe_action: "None; historical packet complete and superseded for implementation detail by phase 018"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts"
      - ".opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs"
    session_dedup:
      fingerprint: "sha256:58b288a550758d8d8b19072e6c4d4ba701d97f546c05fb3110247dfb82f6374d"
      session_id: "2026-08-11-cross-runtime-directive-lifecycle"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Cross-Runtime Directive Lifecycle

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`hooks/claude/user-prompt-submit.ts` is the shared UserPromptSubmit shim consumed by the Claude/Cursor/Devin/Codex hook adapters. It builds the advisor brief, renders it via `render.ts`, and emits it as the `additionalContext` envelope of a JSON hook output — model-visible `[SYS]` context on every prompt. `plugins/mk-skill-advisor.js` is the OpenCode plugin that pushes the same brief into the system transform. Both re-print the three constant directives on every turn, and neither can consume the canonical TypeScript core directly (the shim can — it is TS; the plugin is plain JS and cannot build). Phase 013 already fixed Pi's visible repetition with a Pi-local dedup; this phase generalizes that lifecycle rule to the `[SYS]` consumers with one canonical core and one plain-JS mirror.

### Overview

Add `hooks/lib/directive-lifecycle.ts` as the canonical owner of the lifecycle rule: split the brief on `\nDirectives:` into the dynamic head and the constant directive block; suppress the block on a confirmed session's proven same-content repeat within one lifecycle epoch; re-deliver in full on the first message of a session and after every lifecycle boundary (startup/resume/compact, or a transcript shrink/path-change signature for the shim); fail open on every uncertain case. Wire the decision into the shim's emitted envelope (with a durable per-session file-backed store for its per-call subprocess model) and into the plugin's system transform (with an in-process per-session map and lifecycle re-arm). Add status-tool observability lines to the plugin. Pi is not touched.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The shim's emitted-envelope assembly point, the plugin's transform push point, the `\nDirectives:` separator, and the Pi call site (which must stay session-less) are located.
- The fail-open cases (unknown session, directives-only fallback, kill-switch, corrupt/missing store, thrown errors) are enumerated, and the lifecycle-event + transcript-signature inputs are confirmed to exist on both consumers.

### Definition of Done

- The core suppresses only a confirmed same-content repeat within one epoch; every uncertain case delivers full.
- The shim and the plugin both re-deliver full after every lifecycle boundary and under the kill-switch; the plugin status tool reports the dedup state.
- The three vitest suites (core+store 21 cases, DL1-DL6, PL1-PL7 plus two updated pre-existing tests) pass; `render.ts`, `policy-plan.ts`, the 007 matrix, the bridge, and `prompt-advisor.ts` are unchanged; full gate verification passes.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Deliver-once-per-epoch with fail-open, one canonical core and a codebase-convention plain-JS mirror. The decision is a pure function over `(context, input)` plus an injected per-session state; it never does IO itself. State storage is swappable: an in-memory `Map` for the long-lived OpenCode plugin process, and a per-session JSON file store for the per-call subprocess shim so parallel hook invocations share durable state.

### Key Components

- `decideDirectiveLifecycleDelivery(context, input)` — returns `{ reducedContext, suppressed }`; suppresses only on a confirmed, same-content, same-epoch repeat; records the delivered block on every full delivery.
- `splitDirectiveBrief(context)` — separates the route-line head from the directive block on `\nDirectives:`; returns null (full delivery) when there is no separator or the separator sits at index 0 (the directives-only fallback has no head to keep).
- `InMemoryDirectiveLifecycleStore` — bounded `Map<sessionId, DirectiveLifecycleRecord>` (64 sessions, oldest evicted) for tests and in-process adapters.
- `FileDirectiveLifecycleStore` — per-session JSON under `${SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR ?? tmpdir}/speckit-advisor/directive-lifecycle/<project-hash>/<session-hash>.json`; atomic tmp+rename writes; every IO path fails open.
- `isDirectiveLifecycleDedupEnabled()` — kill-switch `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP` (0|false|off|no disables; default on).
- Plugin mirror — `decideOpenCodeDirectiveLifecycle(brief, sessionID, lifecycleEvent, dedupBySession)` + `state.directiveDedupBySession` per-instance map, re-armed on `session.created`/`session.resumed`/`session.compacted`/`session.compact`/`session.deleted`; status tool gains `directive_lifecycle_dedup` and `directive_dedup_sessions` lines.

### Data Flow

Shim: `UserPromptSubmit` → brief built/rendered → `emitted` → lifecycle decision (session id + confirmation + lifecycle event + transcript path/size against the file-backed store) → `effectiveEmitted` (route line only when suppressed) → `hookSpecificOutput.additionalContext` → `observeEmittedAdvisorPolicy(effectiveEmitted)`.

Plugin: transform → advisor block → `decideOpenCodeDirectiveLifecycle` (per-session map, pending shadow lifecycle event) → reduced block pushed to `output.system`; lifecycle events clear the session's record so the next message re-delivers full.

Pi: calls the shim with only `{ prompt, cwd, hook_event_name }` — no session id — so the shim's decision always falls open to full there, and Pi's own 013 dedup remains the only active mechanism on that runtime.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Locate the shim's emitted-envelope assembly point, the plugin's transform push point, the `\nDirectives:` separator, the lifecycle-event plumbing on both consumers, and the Pi call site. Confirm the render.ts-mirror convention for the plugin.

### Phase 2: Core Implementation

Add the canonical core (`directive-lifecycle.ts`): kill-switch, split, decision, in-memory store, file-backed store, default-store helpers. Wire the shim: compute session id/confirmation/lifecycle event/transcript signature, apply the decision to `emitted`, fail open on any throw. Wire the plugin: plain-JS mirror, per-instance dedup map, transform integration, lifecycle re-arm on all five session events, status-tool lines. Leave the bridge and Pi untouched.

### Phase 3: Verification

Run the core+store suite (21 cases), the shim DL1-DL6 suite, and the plugin PL1-PL7 suite with the two updated pre-existing tests; then the full gate (recursive validate.sh on the parent, scoped diff audit proving `render.ts`/`policy-plan.ts`/007/bridge/Pi untouched).

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Core+store (`directive-lifecycle.vitest.ts`): unit tests of the decision over synthetic briefs — first/repeat/dirty/route-change/lifecycle-boundaries/transcript-shrink/path-change/growth/unknown-session/fallback/kill-switch/isolation/non-reducible, the kill-switch env parsing, and file-store round-trip, cross-instance persistence, corrupt-record fail-open, bounded eviction, missing-dir clear, and env-overridable base dir.
- Shim (`claude-user-prompt-submit-hook.vitest.ts` DL1-DL6): envelope-level proof that the first message keeps the full brief and a same-content repeat drops only the directive block; full re-delivery after a compact boundary, without a confirmed session id, under the kill-switch, for the fallback brief, and on a transcript shrink.
- Plugin (`mk-skill-advisor-plugin.vitest.ts` PL1-PL7): transform-level proof of suppression, lifecycle re-arm (event and transform-carried), unknown-session, kill-switch, session isolation, and status-tool reporting; two pre-existing repeat-turn tests assert the new route-line-only expectations.
- Regression: full existing suites for the shim, the plugin, and Pi; scope diff audit for the frozen files.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `node:crypto` (sha256 for project/session file keys) and `node:fs`/`node:os`/`node:path` in the core; nothing new in the plugin. No new packages, no network. The core is consumed via relative import from the shim; the plugin keeps its local mirror per the render.ts-mirror convention until the core ships a compiled dist.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Two-file core rollback plus one consumer each: reverting `directive-lifecycle.ts` (new), the shim hunk, and the plugin hunk restores always-full delivery on every runtime; removing the new test files and reverting the two updated plugin tests restores the prior suites. `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` is a runtime opt-out needing no revert. The file-backed store lives under tmpdir (or the env override) and is never a source of truth: deleting it merely re-delivers full. No build artifacts, shared-library changes, or activation-matrix edits to unwind.

<!-- /ANCHOR:rollback -->
