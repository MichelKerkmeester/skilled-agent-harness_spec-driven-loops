---
title: "Implementation Plan: Phase 6: external-cli runtime wiring"
description: "Plan for the external-cli runtime entrypoint, the per-engine command table, the projection module over projectMessage, tests, and the command 2 Branch B adoption."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/006-external-cli-runtime-wiring"
    last_updated_at: "2026-08-19T20:34:00.000Z"
    last_updated_by: "claude"
    recent_action: "Landed entrypoint, engine table, and command wiring; gate green"
    next_safe_action: "Reconcile parent metadata and validate recursively"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/cli-communication-projection/src/runtime/external-cli-projection.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/transports/cli-engines.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/bin/external-cli-project.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-external-cli-runtime-wiring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
trigger_phrases: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: external-cli runtime wiring

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Ship a runnable entrypoint that drives the phase-005 external-cli provider through the package's `projectMessage` orchestrator, a verified per-engine command table for the six cli-* skills, and the command 2 Branch B adoption. The entrypoint reuses the whole assembly, privacy, fidelity, and render stage order rather than reimplementing it, so the only new logic is the external-cli input assembly and the engine argv table. Change no default-off gate, default transport, or existing wrapper path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `runExternalCliProjection` returns a projection for a successful injected runner and the exact original for a failed one or when projection is disabled.
- `resolveCliEngineCommand` returns a plain-text, prompt-arg command for all six engines and null for an unknown engine.
- The launcher prints the projected text or the byte-exact original plus a `STATUS=` line, and sets no global state.
- `npm run check` (typecheck, build, test, import smoke) exits 0.
- Comment hygiene is clean and no source module writes to the TUI.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`projectMessage` runs the frozen stage order: assemble the message, select bounded context, protect spans, route privacy, execute the provider, validate the candidate, and decide the render. The external-cli entrypoint builds that function's inputs for the external-cli case — a hosted-retained record, a completed single-message generation from the target text, an egress-consented policy, and the injected CLI transport — and calls it. The per-engine table maps each engine to the documented non-interactive one-shot dispatch argv, delivering the prompt as the trailing argument with a closed stdin. The child-process spawn boundary now always closes stdin so a prompt-arg engine that reads stdin does not hang. The launcher is a thin wrapper over the projection module.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `src/transports/cli-engines.ts` — the per-engine command table (new).
- `src/transports/cli.ts` — the spawn boundary now always closes stdin.
- `src/transports/index.ts` — engine-table exports.
- `src/runtime/external-cli-projection.ts` — the projection module (new).
- `src/runtime/index.ts` — projection-module exports.
- `bin/external-cli-project.mjs` — the runnable launcher (new).
- `test/transports/cli-engines.test.ts`, `test/runtime/external-cli-projection.test.ts` — coverage.
- `.opencode/commands/rewrite-response-by-external-agent.md` — Branch B adoption.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Engine table and spawn hardening

- [x] Add `resolveCliEngineCommand` for the six cli-* engines, sourced from each skill's SKILL.md.
- [x] Close stdin unconditionally in the default spawn so prompt-arg engines do not hang.
- [x] Export the engine table through the transports barrel.

### Phase 2: Projection module and launcher

- [x] Add `runExternalCliProjection` building the external-cli `projectMessage` inputs.
- [x] Export the projection module through the runtime barrel.
- [x] Add the `bin/external-cli-project.mjs` launcher over the module.

### Phase 3: Tests, command wiring, and gate

- [x] Cover the engine table argv and the projection module candidate and fallback paths.
- [x] Rewrite command 2 Branch B to invoke the entrypoint.
- [x] Run `npm run check` and the launcher fail-safe smokes; capture output and exit status.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Unit: `resolveCliEngineCommand` returns the exact argv and env per engine and null for an unknown engine, and derives the pi provider from a `provider/model` id.
- Module: `runExternalCliProjection` projects with an injected runner, falls back to the exact original on a failed runner, returns the exact original when projection is disabled, and drives the resolved argv through an injected spawn boundary.
- Launcher: fail-safe smokes confirm the exact original passes through when projection is disabled and when a binary is absent.
- Whole gate: `npm run check`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The phase-005 external-cli provider, transport, and child-process runner.
- The `projectMessage` orchestrator and its assembly, privacy, fidelity, and render stages (used unchanged).
- Each cli-* skill's SKILL.md as the source of its dispatch argv.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is additive except the one-line spawn hardening. Removing `src/transports/cli-engines.ts`, `src/runtime/external-cli-projection.ts`, `bin/external-cli-project.mjs`, the two barrel exports, and the two test files, reverting command 2 Branch B, and restoring the previous stdin handling fully reverts the phase. No default-off gate, default transport, or wrapper behavior is touched.
<!-- /ANCHOR:rollback -->
