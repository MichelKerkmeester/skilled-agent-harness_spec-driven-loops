---
title: "Implementation Summary: devin allowlist prune, DeepSeek gap, and mirror parity"
description: "The devin fan-out surface now equals the curated four-family catalog exactly: pruned aliases fail closed, DeepSeek finally dispatches, and CJS-mirror drift is a test failure instead of a silent risk."
trigger_phrases:
  - "devin prune shipped"
  - "deepseek via devin enabled"
  - "mirror parity test shipped"
  - "devin curated scope enforced"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/047-executor-wiring-and-parity/005-devin-allowlist-prune-and-deepseek"
    last_updated_at: "2026-07-30T07:45:39.076Z"
    last_updated_by: "implementer"
    recent_action: "Implementation verified; packet docs finalized"
    next_safe_action: "Commit the runtime change + packet to skilled/v4.0.0.0"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-045-summary"
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
| **Spec Folder** | 045-devin-allowlist-prune-and-deepseek |
| **Completed** | 2026-07-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The devin fan-out dispatch surface now matches the curated catalog exactly. Nine curated-out aliases (`adaptive`, `opus`, `sonnet`, `claude`, `haiku`, `gpt`, `gemini`, `codex`, `swe-1-6`) are pruned and fail closed; the DeepSeek family — which the catalog featured but the runtime silently could not dispatch at all — is now allowlisted (`deepseek-v4-pro` + uid `deepseek-v4`); and the deliberate CJS mirror is pinned to the TS source by parity tests, so drift now fails CI instead of shipping.

### The curated 15-id surface, enforced

`DEVIN_SUPPORTED_MODELS` (TS) and `DEVIN_ALLOWED_MODELS` (CJS mirror) both hold exactly: `swe`, the six GLM-5.2 uids, the three SWE-1.7 uids, the three Grok 4.5 uids, and the two DeepSeek ids. Default stays `swe`. The prune was evidence-gated: a sweep of runtime-consumed configs found nothing naming a pruned alias.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-loop/executor-config.ts` | Modified | Allowlist → curated 15-id set; truthful comments |
| `runtime/scripts/fanout-run.cjs` | Modified | Mirror aligned; set + default exposed via existing exports |
| `runtime/tests/unit/fanout-run.vitest.ts` | Modified | New exact-set pin, pruned-id rejections, mirror-parity tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A config sweep gated the prune and a catalog↔runtime re-check caught the DeepSeek omission the predecessor packet missed. One GPT-5.6 SOL (high, fast) dispatch via cli-codex implemented the exact target state; the orchestrator verified everything independently — its own vitest run (182/182, up 2 for the parity tests) and content greps of both surfaces.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Parity test instead of structural de-duplication | The mirror is deliberate (synchronous, directly unit-testable — the file documents this, matching the cursor mirror); a test converts the drift risk to a CI failure without refactor risk |
| Prune now, not later | The gating config sweep came back clean, and fail-closed rejection means any missed consumer surfaces loudly rather than misbehaving |
| Add both DeepSeek forms (family slug + uid) | `--model` accepts either; allowing both mirrors how the GLM/SWE families are listed by uid while keeping the family entry dispatchable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run` both suites (orchestrator-run) | PASS — Test Files 2 passed, Tests 182 passed (182) |
| Both devin blocks = 15 ids, 0 pruned, deepseek ×2 | PASS (greps) |
| Default `swe` in both surfaces | PASS (`executor-config.ts:252`, `fanout-run.cjs:1809`) |
| Mirror parity assertions vs TS exports | PASS (`fanout-run.vitest.ts:1258-1266`) |
| Pruned ids fail closed | PASS (`adaptive`/`opus` rejection fixtures green) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Aliases pruned only for the deep-loop runtime.** Manual `devin -p --model opus` still works — the prune governs orchestrated fan-out dispatch, by design.

(The originally-noted cursor-mirror gap was closed by the addendum below.)

---

<!-- ANCHOR:addendum -->
## Addendum: cursor + pi mirror parity

The parity pattern was extended to the remaining two mirrors in the same session: `CURSOR_ALLOWED_MODELS`/`CURSOR_DEFAULT_MODEL` and `PI_ALLOWED_MODELS`/`PI_DEFAULT_MODEL` are now exposed on the script's export surface and pinned to their TS sources by four new assertions (`fanout-run.vitest.ts:1285-1297`). No allowlist content changed — both mirrors already matched. Orchestrator-run suites: Test Files 2 passed, Tests 186 passed (186). All three executor mirrors are now CI-guarded against drift.
<!-- /ANCHOR:addendum -->
<!-- /ANCHOR:limitations -->
