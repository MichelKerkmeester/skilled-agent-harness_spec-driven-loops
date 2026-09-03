---
title: "Implementation Plan: Phase 5: external-cli provider"
description: "Plan for the external-cli provider family, adapter, preset, injected child-process transport, tests, and the catalog and playbook references."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/005-external-cli-provider"
    last_updated_at: "2026-08-19T07:35:00.000Z"
    last_updated_by: "claude"
    recent_action: "Landed external-cli provider; gate green"
    next_safe_action: "Reconcile parent metadata and validate"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/cli-communication-projection/src/transports/cli.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-external-cli-provider"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
trigger_phrases: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: external-cli provider

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Add an `external-cli` provider family to the projection package and a new injected child-process transport, so command 2's cli-* path runs through the real privacy and fidelity pipeline. Reuse the OpenAI-chat adapter shape, encode the engine in the provider id, and keep the subprocess behind an injected boundary so the whole path is deterministically tested. Change no default-off gate, default transport, or wrapper path. Then reference the new adapter code from a feature-catalog entry and a playbook scenario.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `validateProviderModelRecord` succeeds for the external-cli preset and `selectPrivacyRoute` approves it under an egress-consented hosted-retained policy.
- `executeProviderRoute` returns a candidate on a successful CLI result and the exact original on any failure or empty output.
- `npm run check` (typecheck, build, test, import smoke) exits 0.
- The sk-code drift guards report a clean packet-scoped delta against the frozen baseline.
- Both new docs are registered in their indexes and reference the source and test files.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The provider system drives every family through an injected `ProviderTransport`: an adapter compiles a wire request, the transport returns a wire response, and the executor parses it and applies fidelity validation with an exact-original fallback. The external-cli family reuses the OpenAI-chat adapter, so its transport synthesizes an OpenAI-chat-shaped response whose message content is the CLI rewrite. The engine selector lives in the provider id (`external-cli-<engine>`); the endpoint is a non-resolving `.invalid` sentinel because the record validator requires an http/https URL and no HTTP egress ever happens. The subprocess lives only in a generic runner behind an injected spawn boundary, so argv construction, timeout, stdout capture, and fail-closed behavior are all tested without a live CLI.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `src/providers/{types,adapters,registry,presets,index}.ts` — family, adapter case, compatibility clause, preset, exports.
- `src/transports/{cli.ts,index.ts}` — the new transport, generic runner, engine table, exports.
- `test/transports/cli.test.ts`, `test/providers/external-cli.test.ts` — deterministic coverage.
- `feature-catalog/` and `manual-testing-playbook/` — the new entry and scenario plus their indexes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Provider family and record

- [x] Add `EXTERNAL_CLI` to `ProviderFamilies` and the adapter switch case.
- [x] Add the registry family/protocol compatibility clause.
- [x] Add `createExternalCliModelRecord` and export it.

### Phase 2: Transport and runner

- [x] Create `createExternalCliTransport` mapping a wire request to a CLI invocation and back.
- [x] Create `createChildProcessCliRunner` with an injected spawn boundary and an engine-command table.
- [x] Export the transport API through the barrel.

### Phase 3: Tests and pipeline proof

- [x] Cover preset validity, privacy routing, adapter body, and end-to-end candidate and fallback.
- [x] Cover the transport seam, engine resolution, argv, timeout, and stdout handling with an injected double.

### Phase 4: Verification and references

- [x] Run `npm run check` and the sk-code drift guards; capture output and exit status.
- [x] Author the feature-catalog entry and playbook scenario and register them in their indexes.
- [x] Run `validate.sh --strict` on every touched spec folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Unit: preset builds a record that `validateProviderModelRecord` accepts; `selectPrivacyRoute` approves it; the adapter compiles a body carrying the system and user messages.
- Seam: the transport returns a candidate wire response for a successful injected runner and a non-2xx response for a failed or empty one, so the executor falls back to the exact original.
- Runner: with an injected spawn double, assert the argv for a given engine and model, the timeout via the abort signal, and stdout capture.
- End-to-end: `executeProviderRoute` through the CLI transport returns a candidate on success and an exact-original terminal on failure.
- Whole gate: `npm run check` and the sk-code drift guards.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The existing provider executor, privacy router, and fidelity validator (used unchanged).
- The OpenAI-chat adapter shape reused for the external-cli family.
- The established provider and transport test helpers.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is additive: a new family value, a new adapter case, a new preset, a new transport file, new exports, and new tests. Removing the `EXTERNAL_CLI` family value, its adapter case, its compatibility clause, its preset, `src/transports/cli.ts`, the two barrel exports, and the two test files fully reverts the phase. No default-off gate, default transport, or wrapper behavior is touched, so no runtime default changes on rollback.
<!-- /ANCHOR:rollback -->
