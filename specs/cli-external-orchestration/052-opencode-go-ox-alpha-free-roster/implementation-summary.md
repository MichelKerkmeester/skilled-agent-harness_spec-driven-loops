---
title: "Implementation Summary: opencode-go Ox Alpha Free roster"
description: "Added ox-alpha-free to the cli-pi fan-out roster (both synced enforcement points) mapped to opencode-go, plus opencode-go doc rows in cli-pi and cli-opencode. Guard tests green; routing live-confirmed; full turn deferred by opencode-go monthly quota."
trigger_phrases:
  - "implementation summary"
  - "ox-alpha-free roster"
  - "opencode-go ox alpha"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/052-opencode-go-ox-alpha-free-roster"
    last_updated_at: "2026-08-22T10:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped roster + docs; guard tests green; routing live-confirmed"
    next_safe_action: "Commit when operator approves"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-052-opencode-go-ox-alpha-free"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: opencode-go Ox Alpha Free roster

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 052-opencode-go-ox-alpha-free-roster |
| **Completed** | 2026-08-22 |
| **Level** | 2 |
| **Status** | Complete (end-to-end turn deferred by opencode-go monthly quota) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both CLIs can now select **Ox Alpha Free (unlimited)** via the OpenCode Go gateway. On **cli-pi** the model `ox-alpha-free` was added to the enforced deep-loop fan-out roster and mapped to the `opencode-go` provider, so a fan-out dispatch constructs `pi -p --offline --model opencode-go/ox-alpha-free`. On **cli-opencode** (no code-level allowlist) the model was documented as `opencode-go/ox-alpha-free`.

### Roster enforcement (two synced points)
`ox-alpha-free` was added to `PI_SUPPORTED_MODELS` (`executor-config.ts`, the source of truth) and to its synchronous mirror `PI_ALLOWED_MODELS` (`fanout-run.cjs`). In `fanout-run.cjs`'s `PI_MODEL_PROVIDERS` map, `ox-alpha-free` maps to `opencode-go` — following the existing `qwen3.8-max → opencode-go` pattern.

### Docs
Both skills gained a row under their existing `### opencode-go` section in `providers-and-models.md`: cli-pi (bare id `ox-alpha-free`, with the pi store-staleness caveat) and cli-opencode (`opencode-go/ox-alpha-free`). Each row cites the live check that confirmed it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../runtime/lib/deep-loop/executor-config.ts` | Modified | `PI_SUPPORTED_MODELS` += `ox-alpha-free` |
| `.../runtime/scripts/fanout-run.cjs` | Modified | Mirror += `ox-alpha-free`; provider map += `ox-alpha-free → opencode-go` |
| `.../cli-pi/references/providers-and-models.md` | Modified | New `ox-alpha-free` row under `### opencode-go` |
| `.../cli-opencode/references/providers-and-models.md` | Modified | New `opencode-go/ox-alpha-free` row under `### opencode-go` |
| `.../runtime/tests/unit/executor-config.vitest.ts` | Modified | 11-id exact-roster assertion |
| `.../runtime/tests/unit/fanout-run.vitest.ts` | Modified | `providerByModel` coverage += `ox-alpha-free` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Research first: `opencode models opencode-go` confirmed the `opencode-go/ox-alpha-free` slug live, and reading `executor-config.ts` + `fanout-run.cjs` surfaced the fail-closed mirror and the provider map (a missing map entry throws at command construction). Edited both synced points and the provider map, then ran the two guard tests **before** editing them — exactly one assertion failed (the `PI_SUPPORTED_MODELS` exact-roster pin, diff showing `+ "ox-alpha-free"`), confirming the roster guard bites on the intended change. Extended the two guard tests; the suite then returned 199 passed. A fanout builder probe (`buildLineageCommand`) confirmed the constructed command is `pi -p --offline --model opencode-go/ox-alpha-free`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add `ox-alpha-free` to both cli-pi and cli-opencode | Direct operator directive (opencode-go picker screenshot) |
| Map to `opencode-go`, mirror the `qwen3.8-max` pattern | Ox Alpha Free is fronted by the opencode-go gateway; reuse the existing provider-routing shape |
| Add the pi roster entry despite pi's stale store | pi's custom-model-id fallback routes the id to the gateway (proven live); store presence is a cache convenience, not a dispatch requirement |
| Ship without a completed turn | The opencode-go monthly free-tier quota was exhausted (429); existence + routing were confirmed independently, so the roster change is verifiable now and a completion turn is a later, optional upgrade |
| Update guard tests rather than weaken them | The tests exist to pin the exact roster; the roster legitimately grew, so the pins move with it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| Model exists on opencode-go | `opencode models opencode-go \| grep ox-alpha` | PASS — `opencode-go/ox-alpha-free` listed (2026-08-22) |
| Syntax | `node --check scripts/fanout-run.cjs` | PASS — exit 0 |
| Negative control | pre-edit `npx vitest run` (2 guard files) | PASS — 1 failed exactly on `PI_SUPPORTED_MODELS`, diff `+ "ox-alpha-free"` |
| Guard suite | post-edit `npx vitest run` (2 guard files) | PASS — 199 passed / 0 failed |
| Roster sync | `grep -c ox-alpha-free` both files | PASS — executor-config=1, fanout-run=2 (mirror + map) |
| Builder wiring | `node -e buildLineageCommand(cli-pi, ox-alpha-free)` | PASS — `pi -p --offline --model opencode-go/ox-alpha-free probe` |
| cli-pi live routing | `pi -p --offline --model opencode-go/ox-alpha-free "…"` | ROUTED — reached gateway, `429 GoUsageLimitError` (custom-model-id fallback), NOT model-not-found |
| cli-opencode live routing | `opencode run --model opencode-go/ox-alpha-free "…" </dev/null` | ROUTED — selected the model (`> build · ox-alpha-free`); no completion body (quota) |
| `validate.sh --strict` | packet folder | PASS — recorded in this session (0 errors) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Completion turn deferred by quota** — a full end-to-end model turn was not completed on either CLI because the opencode-go monthly free-tier quota was exhausted at implementation time (`429 GoUsageLimitError`, "Resets in 16 days"). Account-level and transient; model existence and routing were confirmed independently. Re-run after the quota resets or with balance enabled to upgrade the doc rows to "completed a real turn".
2. **pi store staleness** — pi's cached `models-store.json` does not (yet) list `ox-alpha-free`, so pi emits a benign `Warning: Model "ox-alpha-free" not found for provider "opencode-go". Using custom model id.` and routes it anyway. A pi catalog refresh clears the warning.
3. **Manual mirror** — `executor-config.ts` and `fanout-run.cjs` are hand-synced by design (no TS import in the CJS script); the guard tests are what keep them honest.
4. **Not committed** — awaiting operator review/approval per the direct-push discipline.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Add roster + provider map + docs | Also extended two guard tests | The tests hardcode the exact roster/provider pins and had to move with the change |
| Live-verify a completed turn (as 034 did) | Verified existence + routing only | The opencode-go monthly free-tier quota was exhausted; a completed turn is deferred, not a defect in the change |
<!-- /ANCHOR:deviations -->
