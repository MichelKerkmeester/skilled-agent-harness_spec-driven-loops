---
title: "Implementation Summary: Phase 5: external-cli provider"
description: "Added a first-class external-cli provider family, an injected child-process transport, deterministic tests, and catalog and playbook references; the package gate is green."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/005-external-cli-provider"
    last_updated_at: "2026-08-20T21:58:00Z"
    last_updated_by: "claude"
    recent_action: "Landed external-cli provider; gate green"
    next_safe_action: "Reconcile parent metadata and validate"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/cli-communication-projection/src/transports/cli.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-external-cli-provider"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The engine selector lives in the provider id; the endpoint is a non-resolving .invalid sentinel because validation requires an http/https URL and no HTTP egress occurs."
      - "External agents route as hosted-retained; inference-control capabilities are attested because the transport honors them via the composed prompt, not a remote wire field."
      - "The per-engine command mapping is caller-supplied; the subprocess is behind an injected boundary, so no test spawns a live CLI."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 5: external-cli provider

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Phase** | 5 of 10 |
| **Completed** | 2026-08-19 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- A new `external-cli` provider family: the `EXTERNAL_CLI` value, its adapter case (reusing the OpenAI-chat wire shape), and a registry family/protocol compatibility clause.
- `createExternalCliModelRecord`: an evidence-backed preset that builds a hosted-retained external-cli provider record for a chosen engine and model.
- `src/transports/cli.ts`: `createExternalCliTransport` (the pipeline seam), `createChildProcessCliRunner` (a generic subprocess runner with an injected spawn boundary), and the supporting types and default helpers.
- Public exports for the preset and the transport through the existing barrels.
- Deterministic tests: `test/providers/external-cli.test.ts` and `test/transports/cli.test.ts` (19 tests).
- A feature-catalog entry (`provider-and-privacy/external-cli-provider.md`) and a manual-testing-playbook scenario (`fidelity-and-privacy/external-cli-provider-fallback.md`, COMM-009), both registered in their indexes.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The external-cli family reuses the OpenAI-chat adapter, so the transport synthesizes an OpenAI-chat response whose content is the CLI rewrite and the shared executor, fidelity validation, and exact-original fallback apply unchanged. The engine selector lives in the provider id; the endpoint is a non-resolving `.invalid` sentinel that still satisfies the http/https validator, because no HTTP egress occurs. The subprocess lives only in `createChildProcessCliRunner`, behind an injected spawn boundary, so argv construction, timeout, stdin delivery, and fail-closed mapping are exercised with a test double. The default-off gate, the default transport, and the live wrapper path were not touched; the provider is inert unless a caller selects its record and transport.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Hosted-retained privacy class: external agents cannot honestly claim zero-data-retention, and the UNKNOWN class is auto-denied by the router, so hosted-retained is the honest, routable class under an egress-consented policy.
- `none:cli` credential and `none` authorization scheme: the CLI binary owns its own authentication, so the package holds no credential and the executor performs no credential check.
- Caller-supplied per-engine command mapping: the exact CLI argv depends on which binaries are installed and authenticated and cannot be verified here, so the package ships the tested machinery and leaves the per-engine command as injected data rather than shipping unverified argv guesses.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- Typecheck: `tsc --noEmit -p tsconfig.json` exit 0 (src and all tests).
- Build: `tsc -p tsconfig.build.json` exit 0.
- Tests: `vitest run` reports 78 test files and 427 tests passing (including the 19 new external-cli tests).
- Import smoke: the public entry resolves `createExternalCliModelRecord`, `createExternalCliTransport`, and `createChildProcessCliRunner`.
- Standard: `rg "console\.|process\.stdout|process\.stderr"` over the touched src returns nothing (no TUI writes).
- Commands: both trigger commands validate `--type command` with zero issues; the machine command-contract requires owned YAML assets only for the six router families, so neither needs one.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The default child-process spawn is integration-only; it is typechecked and built but exercised in tests through an injected boundary rather than against a live CLI binary.
- The per-engine command mapping is not shipped as a verified default; a caller supplies it for the engines whose binaries are installed and authenticated.
- Wiring the external-cli provider into command 2's authored runtime was deferred from this phase and is delivered in phase 006 (`006-external-cli-runtime-wiring`): a runnable entrypoint drives the provider through `projectMessage`, and command 2's Branch B invokes it.
<!-- /ANCHOR:limitations -->
