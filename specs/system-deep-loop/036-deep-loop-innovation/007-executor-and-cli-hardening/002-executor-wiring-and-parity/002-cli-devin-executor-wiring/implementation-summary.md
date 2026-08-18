---
title: "Implementation Summary: cli devin executor wiring"
description: "cli-devin is now a first-class deep-loop fan-out executor: a wired kind, an enforced model allowlist, a fail-closed adapter, and unit coverage mirroring cli-cursor, all landed and green."
trigger_phrases:
  - "cli-devin executor wiring"
  - "devin deep loop executor summary"
  - "add devin executor kind"
  - "devin fanout lineage"
  - "impl summary core"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/002-cli-devin-executor-wiring"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Documented landed cli-devin executor wiring"
    next_safe_action: "Commit the reconciled packet docs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-041-cli-devin-executor-wiring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-cli-devin-executor-wiring |
| **Status** | Complete |
| **Completed** | 2026-08-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`cli-devin` is now a first-class deep-loop fan-out executor. A `/deep:research` or `/deep:review` run can name `kind: cli-devin` and dispatch through the Devin CLI, which reaches models that only Devin hosts, including the free GLM-5.2 High tier. Before this change the config parser rejected the kind before a lineage ever expanded, so no multi-model run could select a Devin-hosted model.

### The cli-devin executor kind

`cli-devin` joins the executor union in `executor-config.ts:11`, alongside a flag-support row (`model`, `sandboxMode`, `timeoutSeconds`, `liveTools`) and a web-search capability row that inherits with nothing enforceable, matching the flag-less shape of `cli-cursor`. Two of the per-kind tables are exhaustive `Record<ExecutorKind, ...>` types, so the compiler refuses an incomplete addition.

### Enforced model allowlist

`DEVIN_SUPPORTED_MODELS` (`executor-config.ts:314`) is a curated 23-id allowlist read from the live `devin models list` roster, with `isDevinModelAllowed()` as its type guard and `DEVIN_DEFAULT_MODEL = 'swe'` as the fallback. An id outside the list is rejected before any command is built, so a typo or an unvetted model can never reach dispatch.

### Fail-closed fan-out adapter

`buildDevinLineageCommand()` (`fanout-run.cjs:1994`) runs a PATH preflight through `isDevinBinaryAvailable()` and throws when `devin` is absent, then rejects a disallowed model, maps the sandbox mode to a permission mode, and returns argv plus an invocation fingerprint. It is registered in `LINEAGE_COMMAND_ADAPTERS` (`fanout-run.cjs:2153`) and exported for unit tests. The audit tables in `executor-audit.ts` resolve the binary name (`devin`), the state-dir env (`SPECKIT_DEVIN_STATE_DIR`), the default home dir (`.devin`), and the `DEVIN_` env prefix for dispatch isolation and receipts.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-loop/executor-config.ts` | Modified | Kind, flag support, capability row, model allowlist and guard (`107a732a40`) |
| `runtime/lib/deep-loop/executor-audit.ts` | Modified | Binary, state-env, home-dir, env-prefix entries (`107a732a40`) |
| `runtime/scripts/fanout-run.cjs` | Modified | Lineage adapter, allowlist mirror, PATH preflight, export (`107a732a40`, repaired `88ffed2893`) |
| `runtime/tests/unit/executor-config.vitest.ts` | Modified | Capability-matrix literal extended for cli-devin (`107a732a40`) |
| `runtime/tests/unit/fanout-run.vitest.ts` | Modified | cli-devin adapter test block (`107a732a40`, `88ffed2893`) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The wiring landed in `107a732a40` as a purely additive change that mirrors the existing `cli-cursor` adapter, so no existing kind's behaviour was touched. Every CLI fact came from live `devin --help` and `devin models list` output rather than the skill's reference table, which omits tier names and would have produced the wrong id. A follow-up repair, `88ffed2893`, fixed the fan-out dispatch against the current Devin CLI after a live run surfaced flag drift. Coverage arrived in the same commits: `executor-config.vitest.ts` extends the literal capability-matrix assertion, and `fanout-run.vitest.ts` adds a cli-devin block covering command shape, sandbox mapping, allowlist accept and reject, default model, and fail-closed absence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read every flag and model id from the live CLI | The skill's documented model table omits tier names, so trusting it would have recorded the wrong `glm-5-2` identity |
| Keep the allowlist curated, not the full 37-family roster | The allowlist is plain data, so it extends later without touching the adapter, and a curated set avoids shipping ids with unknown prompt-craft behaviour |
| Default to `swe` rather than Devin's model router | A concrete default keeps dispatch deterministic instead of deferring model choice to a remote router |
| Omit a session-id env entry | None is documented or observed in `devin --help`, and inventing one would be fabrication |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `vitest run` both adapter test files | PASS: 198 passed (198), 2 files |
| `vitest run -t "devin"` cli-devin coverage | PASS: 9 passed, 189 skipped |
| `parseExecutorConfig({ kind: 'cli-devin' })` parses | PASS: kind in `EXECUTOR_KINDS` (`executor-config.ts:11`) |
| Allowlist rejects an unvetted id before build | PASS: `buildDevinLineageCommand` throws (`fanout-run.cjs:2000`) |
| Fail-closed on absent binary | PASS: PATH preflight throws (`fanout-run.cjs:1995`) |
| `validate.sh --strict` on this packet | PASS: Errors 0 (lone `dirty_tree` continuity warning is expected pre-commit) |
| Live `devin -p` smoke dispatch on `glm-5-2` | DEFERRED: needs an authenticated Devin account; exercised by the `88ffed2893` repair, external re-run pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live smoke dispatch is not re-run here.** A `devin -p` dispatch on `glm-5-2` requires an authenticated Devin account. The `88ffed2893` repair confirms it was exercised against the current CLI, but this reconcile does not reproduce the paid external run.
2. **The allowlist is curated, not exhaustive.** `DEVIN_SUPPORTED_MODELS` covers 23 vetted ids, not the full 37-family Devin roster. Add an id to the allowlist data to enable it; no adapter change is needed.
3. **No session identifier is captured.** Devin exposes none in `devin --help`, so audit receipts carry the invocation fingerprint but no Devin-side session id.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
