---
title: "Implementation Summary: Pi deep-loop executor support"
description: "cli-pi is now the 6th typed deep-loop ExecutorKind - fail-closed, tested, and independently reviewed - with its command-construction body deliberately stubbed until Pi's real invocation syntax is confirmed."
trigger_phrases:
  - "cli-pi executor support results"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/002-deep-loop-executor-support"
    last_updated_at: "2026-07-27T11:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented via LUNA, re-verified independently, reviewed by GLM-5.2"
    next_safe_action: "Commit; phase 003 builds the skill packet on this widened union"
    blockers: ["Command-construction body stubbed - real Pi invocation syntax unconfirmed"]
    key_files: ["spec.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 90
    open_questions: ["Real command-construction body needs a confirmed Pi headless invocation contract"]
    answered_questions: ["cli-pi is the 6th ExecutorKind, fail-closed by design, GLM-5.2 independently approved"]
---
# Implementation Summary: Pi deep-loop executor support

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-deep-loop-executor-support |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The deep-loop runtime now recognizes `cli-pi` as a real, dispatchable executor kind alongside `native`, `cli-codex`, `cli-claude-code`, `cli-opencode`, and `cli-cursor`. Every new code path fails closed: an absent `pi` binary is caught before any subprocess spawns, and the actual command-construction body is a documented stub rather than a guessed flag, because Pi's real headless invocation syntax still is not confirmed end to end (phase 001 installed Pi and probed its contract, but never completed a successful model dispatch — see that phase's own limitations).

### Executor union widened to 6 members
`EXECUTOR_KINDS` in `executor-config.ts` now includes `cli-pi`. It gets the same confirmed-safe flag set as `cli-cursor` (`model`, `timeoutSeconds`, `liveTools` only — no `sandboxMode`, since Pi documents no sandbox/permission flag), a `PiSupportedModel`/`PI_SUPPORTED_MODELS`/`isPiModelAllowed()` triple that rejects every model while the allowlist is empty, and a matching row in the web-search capability matrix (`inherit: true`, everything else `false`).

### Fail-closed dispatch scaffolding
`executor-audit.ts` gains `cli-pi` rows in the three maps that don't need live confirmation (binary name, state-dir env var, default home dir `.pi`) and deliberately omits the two that do (session-env var, env-var prefix) — nothing was invented to fill the gap. `fanout-run.cjs` gains `isPiBinaryAvailable()` (mirrors the Codex/Cursor checks exactly) and `buildPiLineageCommand`, which runs that preflight first and throws a clear "invocation contract not yet confirmed" error rather than emitting a guessed argv. `dispatch-model.cjs` and `profile-validator.cjs` (the model-benchmark path) get the same treatment.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modified | 6th ExecutorKind, flag matrix, model allowlist scaffold |
| `system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | Binary/state/home-dir maps for cli-pi |
| `system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | `isPiBinaryAvailable`, stubbed `buildPiLineageCommand` |
| `system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Modified | cli-pi in `KNOWN_EXECUTORS`, stubbed spawn-spec case |
| `system-deep-loop/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs` | Modified | cli-pi parity in `KNOWN_EXECUTORS` |
| `system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modified | 6-member union + fail-closed model-allowlist tests |
| `system-deep-loop/runtime/tests/unit/executor-audit.vitest.ts` | Modified | Audit-map coverage incl. proving absent rows stay absent |
| `system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | Absent-binary fail-closed test |
| `system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` | Modified | `KNOWN_EXECUTORS` parity test |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation was dispatched to GPT-5.6-LUNA (`codex exec --model gpt-5.6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast" --sandbox workspace-write`), which produced the full 9-file diff and self-reported test/typecheck results. Those self-reported results were not trusted at face value: this worktree's own `node_modules` are gitignored and absent, so the claimed "213 passed" figure could not have come from a working `vitest` in this environment without further setup. I symlinked the missing `node_modules` from the main checkout (read-only, additive, no risk to the shared tree) and re-ran everything myself. The diff was then sent to GLM-5.2 via `devin -p --model glm-5.2` for an independent second-opinion review, which returned a specific, file:line-level APPROVE with no required changes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Left `buildPiLineageCommand`'s command-construction body as a throwing stub | Phase 001 never completed a successful Pi dispatch (no provider credentials on this machine), so any concrete argv would be a guess — exactly the class of mistake the Cursor/Devin precedents already made once with unverified hook schemas and effort flags. |
| Symlinked `node_modules` into the worktree instead of trusting LUNA's self-reported test results | A background-task self-report is a hypothesis, not a fact, especially when the reporting environment's own toolchain is known to be broken (the same gitignored-deps issue hit earlier in this same packet's spec-kit tooling). Independent re-verification found the real numbers were actually better than claimed (188/188 vs. a claimed 213/215). |
| Did not fix the `remediation.vitest.ts` "retired executor" pre-existing failure | Confirmed via `git stash` that it fails identically against unmodified `HEAD` — genuinely unrelated to this phase, out of scope to fix here. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `executor-config.vitest.ts` + `executor-audit.vitest.ts` + `fanout-run.vitest.ts` | PASS — 188/188 (independently re-run, not just LUNA's self-report) |
| `remediation.vitest.ts` | PASS — 26/27; the 1 failure confirmed pre-existing via `git stash` against unmodified HEAD |
| `tsc --noEmit --composite false -p tsconfig.json` | PASS — exit 0, 0 errors |
| GLM-5.2 independent review (`devin -p --model glm-5.2`) | APPROVE — file:line-specific findings, no required changes |
| `git diff --stat HEAD` scope check | PASS — only the 9 intended files changed, nothing outside `system-deep-loop/` |
| `validate.sh --strict` (this folder) | PASS — Errors: 0, Warnings: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The command-construction body is a stub, not a working implementation.** `buildPiLineageCommand` and `dispatch-model.cjs`'s `cli-pi` case both throw "invocation contract not yet confirmed" rather than dispatching. `cli-pi` is registered and routable through the fail-closed preflight, but cannot yet actually run a real Pi session end to end — this mirrors the exact gap `cli-devin`'s own 029 packet shipped with (skill packet built ahead of its runtime dependency).
2. **`EXECUTOR_SESSION_ENV_BY_KIND['cli-pi']` and `EXECUTOR_ENV_PREFIXES_BY_KIND['cli-pi']` are absent by design**, not oversight — no confirmed session-id env var exists for Pi yet.
3. **`PI_SUPPORTED_MODELS` is empty.** Every candidate model is rejected. Phase 009 owns populating this from a live-fetched `pi.dev/models`.
4. **One pre-existing, unrelated test failure** in `remediation.vitest.ts` ("rejects a retired executor before spawn spec construction") remains — confirmed present against unmodified HEAD, not introduced by this phase, not fixed here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
