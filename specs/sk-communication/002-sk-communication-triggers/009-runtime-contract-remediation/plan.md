---
title: "Implementation Plan: Phase 9: runtime contract remediation"
description: "Plan to add a coded per-engine default model, a local static-text projection entrypoint, verifiable read-only flags with honest documentation, and a metadata reconcile, all routing through the existing projectMessage tail."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/009-runtime-contract-remediation"
    last_updated_at: "2026-08-20T21:40:00.000Z"
    last_updated_by: "claude"
    recent_action: "Executed all four phases; package gate green"
    next_safe_action: "Parent closeout"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/cli-communication-projection/src/transports/cli-engines.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/runtime/local-projection.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-009-runtime-contract-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
trigger_phrases: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: runtime contract remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Four contained fixes, each preserving the projection and default-off invariants. Add `defaultModelForEngine` and let the external launcher fall back to it, so the command's engine-only contract runs. Add `runLocalProjection`, a static-text entrypoint that reuses the shipped local provider config and `projectMessage`, plus a launcher, and point Branch C at it. Add read-only flags only where a CLI supports them without changing the rewrite output, and correct the read-only claim where it does not. Reconcile the parent and child phase, graph, and completion metadata.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `external-cli-project <engine>` with no model uses the coded default for the five engines that document one; `pi` errors clearly.
- The updated devin/pi argv tests fail against the old table and pass after; the new local-projection tests fail without the module and pass with it.
- Local mode projects the resolved target text, not a target command, and falls back to the exact original when no provider is configured or the rewrite is rejected.
- `npm run check` (typecheck, build, test, import smoke) exits 0.
- Comment hygiene is clean; no artifact ids or spec paths in code comments.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`defaultModelForEngine(engine)` returns the model each cli-external-orchestration skill documents as its default (`claude-code` → `claude-sonnet-4-6`, `codex` → `gpt-5.5`, `cursor` → `composer-2.5`, `devin` → `swe`, `opencode` → `deepseek/deepseek-v4-pro`), and `undefined` for `pi`, whose skill documents no default and requires an explicit provider/model. The launcher treats a missing model argument as a request for the default and only errors when none exists.

`runLocalProjection` mirrors `runExternalCliProjection`: it wraps the target text as one completed assistant message and calls `projectMessage`, but sources its provider record, prompt, policy, transport, judge mode, and capabilities from the shipped `loadLocalProjectionConfig`, so the local path shares the same assembly, privacy, fidelity, and render stages. The launcher loads the config, prints a friendly instruction when none is present, and otherwise prints the projection or the byte-exact original.

Read-only is enforced only where a CLI has a flag that does not change the rewrite output: `codex --sandbox read-only` stays, `pi` gains `--tools read,grep,find,ls`, and `devin` moves off the auto-approve mode to its documented print-mode default. `claude-code`, `cursor`, and `opencode` have no such flag, so their no-write guarantee rests on the non-mutating copy-editing prompt plus fail-closed-to-exact-original, and the documentation is corrected to say so.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: External model default (REQ-001)

- [x] Add `defaultModelForEngine` and export it; fall back to it in the launcher; clear error for pi.

### Phase 2: Local static-text projection (REQ-002)

- [x] Add `runLocalProjection` and its launcher; rewrite Branch C; add tests.

### Phase 3: Read-only and docs (REQ-003)

- [x] Update the pi/devin argv; correct the read-only claim in the phase-006 summary and the command notes.

### Phase 4: Metadata reconcile (REQ-004) and verify

- [x] Reconcile parent and child metadata; run the package gate and recursive strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Unit: `defaultModelForEngine` returns the documented default per engine and `undefined` for pi; the updated argv assertions pin the pi tool allowlist and the devin mode.
- Unit: `runLocalProjection` projects a faithful rewrite through an injected transport, and returns the exact original when the transport fails and when projection is disabled.
- Whole gate: `npm run check`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The phase-006 external-cli entrypoint and per-engine table (extended in place).
- The phase-005 local provider config loader (reused wholesale).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each fix is contained. Remove `defaultModelForEngine` and the launcher fallback; delete `local-projection.ts`, its launcher, and its test, and restore Branch C to the wrapper call; restore the pi/devin argv and the read-only wording; revert the metadata edits. No projection-pipeline code is touched, so each revert is exact.
<!-- /ANCHOR:rollback -->
