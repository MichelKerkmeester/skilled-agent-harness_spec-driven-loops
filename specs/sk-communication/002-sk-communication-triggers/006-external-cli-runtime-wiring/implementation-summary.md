---
title: "Implementation Summary: Phase 6: external-cli runtime wiring"
description: "Shipped a runnable external-cli entrypoint over projectMessage, a verified per-engine command table, a spawn-boundary stdin fix, deterministic tests, and the command 2 Branch B adoption; the package gate is green."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/006-external-cli-runtime-wiring"
    last_updated_at: "2026-08-19T07:35:00.000Z"
    last_updated_by: "claude"
    recent_action: "Landed external-cli runtime wiring; gate green"
    next_safe_action: "Reconcile parent metadata and validate recursively"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/cli-communication-projection/src/runtime/external-cli-projection.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/transports/cli-engines.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/bin/external-cli-project.mjs"
      - ".opencode/commands/rewrite-response-by-external-agent.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-external-cli-runtime-wiring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The entrypoint calls projectMessage so the whole route/execute/validate/render tail is reused, not reimplemented."
      - "Prompt delivery is a trailing argument with a closed stdin, the only shape opencode tolerates; the spawn boundary now always closes stdin."
      - "Per-engine argv drops write escalation because a rewrite needs no write access; it is documentation-verified from each skill's SKILL.md, not live-verified."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 6: external-cli runtime wiring

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Phase** | 6 of 7 |
| **Completed** | 2026-08-19 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `src/transports/cli-engines.ts`: `resolveCliEngineCommand`, a per-engine `CliCommandResolver` mapping the six cli-* engines (`claude-code`, `codex`, `cursor`, `devin`, `opencode`, `pi`) to their documented non-interactive one-shot dispatch argv, plus the `CliEngineIds` constant.
- `src/runtime/external-cli-projection.ts`: `runExternalCliProjection`, which builds the external-cli `projectMessage` inputs (a hosted-retained record, a completed single-message generation from the target text, an egress-consented policy, and the injected CLI transport) and returns the terminal projection or exact original.
- `bin/external-cli-project.mjs`: a runnable launcher over the projection module that reads the target message and prints the projection or the byte-exact original plus a `STATUS=` line.
- A one-line hardening in `src/transports/cli.ts`: the default spawn now always closes stdin so a prompt-arg engine that reads stdin (opencode) receives EOF instead of hanging.
- Public exports for the engine table and the projection module through the transports and runtime barrels.
- Deterministic tests: `test/transports/cli-engines.test.ts` and `test/runtime/external-cli-projection.test.ts` (12 tests).
- Command 2 Branch B rewritten to invoke the entrypoint, with a NOTES bullet documenting the pipeline routing.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The entrypoint reuses `projectMessage`, so the assembly, bounded-context, protected-span, privacy-routing, provider-execution, fidelity-validation, and render stages all apply unchanged; the only new logic is the external-cli input assembly and the engine argv table. The prompt is delivered as the trailing argument with a closed stdin — the single invocation shape opencode tolerates — and the per-engine argv drops write escalation because a plain-English rewrite needs no write access. Each engine's argv is sourced from its cli-external-orchestration SKILL.md and is documentation-verified rather than live-verified, so an engine whose output does not match the expected shape fails closed to the exact original through the shared fidelity validation. The default-off gate is preserved: the launcher sets no global state, and projection runs only while `COMMUNICATION_PROJECTION_ENABLED=1` is scoped to the invocation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Reuse `projectMessage` instead of re-implementing the projection tail, so the cli-* path cannot diverge from the local and hosted paths.
- Uniform trailing-argument prompt delivery with a closed stdin, because opencode hangs on an open stdin and the other engines accept a trailing positional prompt.
- Read-only per-engine argv, because a rewrite never needs write access and the read-only shape sidesteps every sandbox-mutation concern.
- Caller/entrypoint-supplied model with a per-engine provider derivation for pi, keeping model knowledge in each skill's SKILL.md rather than duplicated in code.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- Typecheck: `tsc --noEmit -p tsconfig.json` exit 0.
- Build: `tsc -p tsconfig.build.json` exit 0.
- Tests: `vitest run` reports 80 test files and 439 tests passing (including the 12 new tests).
- Import smoke: the public entry resolves `runExternalCliProjection`, `resolveCliEngineCommand`, `CliEngineIds`, `createExternalCliModelRecord`, `createExternalCliTransport`, and `projectMessage`.
- Launcher fail-safe smokes: projection disabled returns the byte-exact original (`exact-original:projection-disabled`); an absent binary returns the byte-exact original (`exact-original:provider-error`); empty input returns `NOOP`.
- Standard: `rg "console\.|process\.stdout|process\.stderr"` over the new src modules returns nothing (no TUI writes; the bin launcher writes intentionally, as the sibling wrapper launcher does).
- Comment hygiene: no artifact ids or spec paths in code comments.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The per-engine argv is documentation-verified against each skill's SKILL.md, not executed against installed, authenticated CLI binaries; a caller can override `resolveCommand` for a local environment whose binaries differ.
- opencode and pi have output shapes (a JSON event stream and a provider dimension) that make plain-text extraction less certain than the four cleaner engines; an unexpected shape degrades safely to the exact original rather than corrupting the display.
<!-- /ANCHOR:limitations -->
