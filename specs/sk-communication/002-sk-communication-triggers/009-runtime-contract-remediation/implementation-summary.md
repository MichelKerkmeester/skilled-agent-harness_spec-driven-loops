---
title: "Implementation Summary: Phase 9: runtime contract remediation"
description: "Closed the four runtime-contract defects: a coded per-engine default model so engine-only external dispatch runs, a local static-text projection entrypoint so local mode rewrites the target text, verifiable read-only flags for codex/pi/devin with an honest correction elsewhere, and a reconciled phase/graph/completion metadata set. The package gate is green (447 tests) and the packet validates strict-recursive."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/009-runtime-contract-remediation"
    last_updated_at: "2026-08-20T21:58:00.000Z"
    last_updated_by: "claude"
    recent_action: "Landed the four runtime-contract fixes and reconciled the packet metadata; package gate green"
    next_safe_action: "Parent closeout; the fixes plus the earlier mirror repair are uncommitted"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/cli-communication-projection/src/transports/cli-engines.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/runtime/local-projection.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/bin/local-project.mjs"
      - ".opencode/commands/rewrite/response-by-external-agent.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-009-runtime-contract-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "pi keeps requiring an explicit model: its skill documents no default model and its default provider (google) is not authenticated, so a coded default would guess wrong."
      - "Read-only is enforced only where a CLI has a flag that does not change the rewrite output; the rest rest on the non-mutating prompt plus fail-closed, documented honestly rather than faked."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 9: runtime contract remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Phase** | 9 of 10 |
| **Completed** | 2026-08-20 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `defaultModelForEngine` in `cli-engines.ts`: the documented default model per engine (`claude-code` → `claude-sonnet-4-6`, `codex` → `gpt-5.5`, `cursor` → `composer-2.5`, `devin` → `swe`, `opencode` → `deepseek/deepseek-v4-pro`), and `undefined` for `pi`, exported through the transports barrel.
- `external-cli-project.mjs`: parses positionals before the `--` separator, falls back to the coded default when the model is omitted, and prints a clear "explicit model required" error for `pi`. This also fixes a latent bug where `argv[1]` captured the `--` separator as the model on an engine-only inline-text call.
- `runLocalProjection` in `local-projection.ts`: wraps a static piece of target text as one completed assistant message and runs it through `projectMessage` using the shipped local provider config (record, prompt, local-only policy, transport, judge mode, capabilities), returning a validated projection or the byte-exact original.
- `local-project.mjs`: a runnable local launcher that reads the target text, prints a friendly failure when no local provider is configured, and otherwise prints the projection or the byte-exact original plus a `STATUS=` line.
- Command 2 Branch C rewritten to invoke `local-project.mjs` with the target text on stdin; Branch B documents that the model is optional (defaulted) for every engine except `pi`.
- Read-only: `pi` gains `--tools read,grep,find,ls`; `devin` moves from `--permission-mode auto` to `--permission-mode accept-edits`; `codex` keeps `--sandbox read-only`.
- Metadata reconcile: the phase-006 read-only claim corrected to the true mechanism, the parent active-child pointer moved to this phase, `children_ids` refreshed, the parent spec's pre-rename command names and resolved-fork language cleaned, and the `Phase X of N` denominator normalized to `of 10` across every child.
- Tests: `defaultModelForEngine` coverage and the updated `pi`/`devin` argv in `cli-engines.test.ts`, plus a new `local-projection.test.ts` (projection, judge-rejected fallback, disabled gate). `runLocalProjection` added to the public import smoke.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every fix routes through the existing `projectMessage` tail, so the local path shares the same assembly, privacy, fidelity, and render stages as the external-cli and hosted paths, and any denied route, provider failure, or rejected rewrite returns the exact original. The default-model map keeps model knowledge sourced from each cli-external-orchestration skill's SKILL.md rather than invented, and `pi` stays explicit because its skill documents no default. Read-only is enforced only where a CLI has a flag that does not alter the rewrite output; the remaining engines' no-write property rests on the non-mutating copy-editing prompt plus fail-closed, and the documentation now says so instead of claiming a blanket read-only argv.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Keep the local entrypoint self-contained rather than refactoring the shipped external entrypoint, so the passing external path and its tests are untouched.
- Handle the "no local provider" case in the launcher (a user-facing instruction) rather than fabricating a fallback reason inside `runLocalProjection`, which always receives a loaded config.
- Enforce read-only only where verifiable here; do not ship behavior-altering `plan`/`ask` flags to CLIs whose output shape could not be live-verified in this environment.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `npm run check` exits 0: typecheck (`tsc --noEmit`) 0, build 0, `vitest run` reports 81 test files and 447 tests passing (up from 442; +2 default-model, +3 local-projection), and the public import smoke resolves `runLocalProjection`.
- Launcher smokes: `external-cli-project codex` with no model returns the byte-exact original and exits 0 (no longer exit 2); `external-cli-project pi` with no model prints "needs an explicit model" and exits 2; `local-project` with no provider prints `STATUS=FAIL ERROR="local provider not configured"` and exits 1.
- The updated `devin`/`pi` argv assertions and the new local-projection tests are the negative control: they fail against the pre-change table/module and pass after.
- Comment hygiene: no artifact ids or spec paths in the changed code; the new src module writes no TUI output.
- Recursive `validate.sh --strict` on the packet reports zero errors, and runtime-mirror parity passes.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The per-engine argv and default models are documentation-verified against each skill's SKILL.md, not executed against installed authenticated CLI binaries; a mis-shaped engine output fails closed to the exact original rather than corrupting the display.
- `claude-code`, `cursor`, and `opencode` have no read-only flag that leaves the rewrite output intact, so their no-write guarantee is the non-mutating prompt plus fail-closed, not a sandbox.
- The code fixes and the earlier runtime-mirror repair are present in the working tree but uncommitted; landing them is a separate operator-gated step.
<!-- /ANCHOR:limitations -->
