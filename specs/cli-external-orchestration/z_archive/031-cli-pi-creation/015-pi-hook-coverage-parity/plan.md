---
title: "Implementation Plan: Pi hook coverage parity"
description: "Plan for bridging Pi's real session-lifecycle events to the 8 buildable hooks devin/cursor have that Pi lacked, and documenting the 2 confirmed non-gaps."
trigger_phrases: ["pi hook coverage parity plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/015-pi-hook-coverage-parity"
    last_updated_at: "2026-07-27T20:30:34Z"
    last_updated_by: "claude-code"
    recent_action: "Authored plan.md: direct-authorship pass, GLM-5.2 independent review"
    next_safe_action: "None -- phase complete"
    blockers: []
    key_files: [".pi/extensions/lib/claude-hook-adapter.ts"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-hook-coverage", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pi hook coverage parity

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | TypeScript (`.pi/extensions/*.ts`), Pi's native `ExtensionFactory`/`ExtensionAPI` surface. |
| **Framework** | None new — reuses the fail-open, delegate-not-reimplement pattern the existing 6 `.pi/extensions/` files already establish. |
| **Storage** | Reuses the existing shared tmpdir state file (`speckit-claude-hooks/<hash>/<hash>.json`) devin's `post-compaction.cjs` already reads; no new storage. |
| **Testing** | Live `pi --offline --approve -p` smoke test after each structural change; isolated `node <dist-hook>.js` spawn tests against real stdin payloads; GLM-5.2 independent review. |

### Overview
Read the installed Pi package's real `types.d.ts` directly (not a prior summary) to confirm the exact event surface. Read every missing devin/cursor hook script's actual source to classify it buildable-via-spawnSync-proxy, buildable-via-native-port, buildable-via-plain-CLI-exec, or a confirmed non-gap. Build one shared Pi-specific adapter helper plus 5 new extension files covering the 8 buildable hooks. Verify each output-shape assumption against a real spawn test before wiring it in (this caught one real bug: `session-prime.js` emits plain text, not the JSON envelope `user-prompt-submit.js` uses). Work directly — the task requires precise reading of real runtime source (types, `runner.js` dispatch semantics, dist hook stdin/stdout contracts), not new-artifact scaffolding a fresh model could do from a brief alone.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `.devin/hooks.v1.json`, `.cursor/hooks.json`, and both READMEs read in full to confirm the real event-to-script wiring. [EVIDENCE: direct Read calls]
- [x] Pi's real Extension API confirmed via a direct read of the installed package's `dist/core/extensions/types.d.ts`, not phase 008's summary alone.
- [x] Every missing hook's real source read (not just its filename) to ground the buildable/non-gap classification in actual logic.

### Definition of Done
- [x] All 8 buildable hooks bridged across 5 new extension files + 1 shared lib file.
- [x] Both non-gaps documented in `.pi/extensions/README.md` §3A with evidence, not silently dropped.
- [x] A live Pi session starts with 0 extension-load errors after every file was added.
- [x] The output-shape bug (`session-prime.js` plain text vs. `user-prompt-submit.js` JSON envelope) found and fixed before commit.
- [x] GLM-5.2 independent review completed, findings addressed.
- [x] `validate.sh --strict` passes for this phase folder; whole-packet `--recursive --strict` still `Errors: 0`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two adapter patterns, chosen per hook based on what Pi's own event model actually offers: (1) **spawnSync proxy** into the existing Claude lifecycle-hook dist files, for hooks whose state/transcript semantics must not drift from the other 3 runtimes (session-prime, session-stop, user-prompt-submit); (2) **native port**, for a hook whose logic is simple enough and whose Pi event already carries the needed data in-process, making a proxy unnecessarily indirect (post-compaction -> `session_compact`). Plain CLI-script advisories (worktree-guard etc.) are executed directly via `ctx.exec()`, no proxy needed since they were already designed as standalone warn-only commands.

### Key Components
- **`lib/claude-hook-adapter.ts`** (new): `runClaudeHookAdapter(projectDir, filename, payload, timeoutMs)` — spawnSync proxy mirroring devin's own `hooks/devin/shared.ts`; `extractAdditionalContext(rawOutput)` — parses the `{hookSpecificOutput:{additionalContext}}` envelope, used only by the one dist hook that emits it.
- **`session-start-context.ts`** (new): `session_start` -> `session-prime.js` (raw text) -> `pi.sendMessage()`.
- **`session-start-advisories.ts`** (new): `session_start` -> 4 sequential `ctx.exec()` calls -> `ctx.ui.notify()` on any warning.
- **`session-stop-context.ts`** (new): `session_shutdown(reason="quit")` -> `session-stop.js`, fire-and-forget (side effects only).
- **`prompt-advisor.ts`** (new): `input` -> `user-prompt-submit.js` (JSON envelope) -> `{action:"transform"}`, verified to chain additively with `spec-gate-classify.ts` via a direct read of `runner.js`'s `emitInput()`.
- **`session-compact-context.ts`** (new): `session_compact` -> native port of devin's `post-compaction.cjs` recovery chain (tmpdir state read + `spec-memory.cjs` CLI fallback) -> `pi.sendMessage()`.

### Data Flow
Two flows, documented in `.pi/extensions/README.md` §4: the pre-existing guard-core flow (`tool_call`/`tool_result`/`input` -> dynamic `import()` of a shared `.mjs`/`.cjs` core -> decision), and the new session-lifecycle flow (`session_start`/`session_shutdown`/`session_compact`/`input` -> `lib/claude-hook-adapter.ts` spawnSync proxy or native logic -> `pi.sendMessage()`/`ctx.ui.notify()`).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the installed `@earendil-works/pi-coding-agent` package's `dist/core/extensions/types.d.ts` directly, confirming the real 33-event surface, `ExtensionAPI.on()` overloads, and result types.
- [x] Read `.devin/hooks.v1.json`, `.cursor/hooks.json`, and both READMEs to confirm the real event-to-script wiring (13 real adapters each).
- [x] Read every missing hook script's actual source: `session-start.js`/`session-prime.ts` (devin + underlying), `session-stop.js`/`session-stop.ts`, `user-prompt-submit.js` (devin shim + skill-advisor implementation), `post-compaction.cjs`, `permission-request-policy.mjs`, `spec-gate-prebind.mjs`, `worktree-guard.sh`, `check-git-hooks.sh`, `install-codex-hooks.mjs`.
- [x] Classify each: 8 buildable (3 spawnSync-proxy, 1 native-port, 4 plain-CLI-exec bundled into 1 file), 2 confirmed non-gaps.

### Phase 2: Core Implementation
- [x] Author `lib/claude-hook-adapter.ts` (spawnSync proxy + JSON-envelope parser).
- [x] Author `session-start-context.ts`, `session-start-advisories.ts`, `session-stop-context.ts`, `prompt-advisor.ts`, `session-compact-context.ts`.
- [x] Run isolated spawn tests against `session-prime.js` and `user-prompt-submit.js` with real stdin payloads; discover and fix the output-shape bug (plain text vs. JSON envelope).
- [x] Confirm `input`-event transform-chaining semantics via a direct read of `runner.js`'s `emitInput()`, correcting an initial regression concern about `prompt-advisor.ts` overwriting `spec-gate-classify.ts`.
- [x] Update `.pi/extensions/README.md`: Directory Tree, Key Files, new §3A CONFIRMED NON-GAPS, Boundaries and Flow (two patterns + output-shape caveat), Entrypoints.

### Phase 3: Verification
- [x] `pi --offline --approve -p "list your available tools"` re-run after each structural change; 0 extension-load errors throughout.
- [x] Isolated spawn tests against the real dist hooks confirming actual stdout content (not just exit code).
- [x] `validate_document.py` on `.pi/extensions/README.md`; manual HVR grep (em dash, semicolon) since the automated validator has a known blind spot for both.
- [x] Dispatch GLM-5.2 for an independent review; fix every blocking/minor finding.
- [x] Whole-packet spec-kit `validate.sh --recursive --strict` (parent + all 15 phases).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Extension-load smoke test | All 12 `.pi/extensions/` files | `pi --offline --approve -p "list your available tools"`, re-run after each change |
| Output-shape verification | `session-prime.js`, `session-stop.js`, `user-prompt-submit.js` | Isolated `node <dist-hook>.js` spawn with real stdin JSON |
| Dispatch-composition verification | `prompt-advisor.ts` vs. `spec-gate-classify.ts` | Direct read of `runner.js`'s `emitInput()` |
| Document structure | `README.md` | `validate_document.py --type readme` + manual HVR grep |
| Independent fact-check | All 6 new files vs. the real repo | GLM-5.2 via `devin -p --model glm-5.2` |
| Structural (whole packet) | Parent + all 15 phase folders | `validate.sh --recursive --strict` (main-tree round-trip) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `008-pi-hook-extension-layer` | Internal | Complete | Original type-confirmed event API this phase re-verified directly |
| `012-pi-runtime-compatibility` | Internal | Complete | Original 6-file `.pi/extensions/` build this phase extends |
| `system-spec-kit/mcp-server/dist/hooks/claude/{session-prime,session-stop,user-prompt-submit}.js` (existing) | Internal | Present (built dist) | The exact lifecycle owner this phase's spawnSync proxies target |
| `system-skill-advisor/mcp-server/dist/hooks/claude/user-prompt-submit.js` (existing) | Internal | Present (built dist) | Real target the devin-style shim resolves to for the advisor recommendation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new hook is later found to hang, error non-fail-open, or block a live Pi session.
- **Procedure**: Delete the specific offending `.pi/extensions/*.ts` file (Pi auto-discovers by filename presence, no registration to unwind) and re-run the live smoke test to confirm the session recovers; each file is independent so removing one does not require touching the other 11.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md` (this phase)
- `../008-pi-hook-extension-layer/spec.md`, `../012-pi-runtime-compatibility/spec.md` (extended by this phase)
