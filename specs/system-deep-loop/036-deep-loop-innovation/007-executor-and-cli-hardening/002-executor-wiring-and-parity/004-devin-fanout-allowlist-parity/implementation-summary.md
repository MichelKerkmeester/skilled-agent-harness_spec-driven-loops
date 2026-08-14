---
title: "Implementation Summary: devin fan-out allowlist parity"
description: "The deep-loop runtime now dispatches every model the curated cli-devin catalog features, and a model-less devin fan-out defaults to swe instead of the adaptive router."
trigger_phrases:
  - "devin allowlist parity shipped"
  - "grok via devin fanout enabled"
  - "devin default swe runtime"
  - "fanout duplicated allowlist aligned"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/004-devin-fanout-allowlist-parity"
    last_updated_at: "2026-08-11T14:03:33Z"
    last_updated_by: "implementer"
    recent_action: "Implementation verified; packet docs finalized"
    next_safe_action: "Commit the packet + runtime change to skilled/v4.0.0.0"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-044-summary"
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
| **Spec Folder** | 004-devin-fanout-allowlist-parity |
| **Completed** | 2026-07-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deep-loop fan-out can now dispatch every model the curated cli-devin catalog features. Before this, `grok-4-5-*`, `swe-1-7-lightning`, and three GLM variants were hard-rejected by the runtime allowlist even though the docs featured them and the live `devin models list` confirms them — and a dispatch omitting a model got the `adaptive` router the catalog had dropped.

### Allowlist parity, in both surfaces

`DEVIN_SUPPORTED_MODELS` gained the seven curated ids (`grok-4-5-low/-medium/-high`, `swe-1-7-lightning`, `glm-5-2-max-1m`, `glm-5-2-none`, `glm-5-2-none-1m`) and `DEVIN_DEFAULT_MODEL` moved from `adaptive` to `swe` — in `executor-config.ts` AND in the plain-JS mirror inside `fanout-run.cjs`, a duplicated allowlist the first implementation pass surfaced. The mirror now carries a comment stating it must track the TS source. The change is additive: every pre-existing alias (`adaptive`, `opus`, `sonnet`, ...) still dispatches, so no existing lane config breaks.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/deep-loop/executor-config.ts` | Modified | +7 ids; default → `swe`; block comment updated |
| `runtime/scripts/fanout-run.cjs` | Modified | Duplicated allowlist + default aligned; mirror note |
| `runtime/tests/unit/fanout-run.vitest.ts` | Modified | Allowlist pin +7; default test → `swe`; rejection fixture → `kimi-k3-high` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented by two GPT-5.6 SOL (high, fast) dispatches via cli-codex under exact-edit briefs; the first pass stopped at its scope boundary when it discovered the duplicated allowlist in `fanout-run.cjs` and asked, the orchestrator authorized the fourth file, and the second pass completed it. Every executor claim was re-verified by the orchestrator: an independent vitest run and content greps of both surfaces.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Additive-only; curated-out aliases kept | Removing `adaptive`/`opus`/etc. could break existing deep-loop lane configs; pruning needs a config sweep first (future packet) |
| Default follows the skill's curated default (`swe`) | The catalog, SKILL.md, and cli-reference.md all state `swe`; the runtime was the last surface still on `adaptive` |
| Keep the duplicate list in `fanout-run.cjs` (aligned, not de-duplicated) | Collapsing the CJS mirror into an import is a refactor with its own risk; out of this packet's scope |
| Rejection fixture swapped to `kimi-k3-high` | `grok-4-5-high` became a supported id; the test must still prove fail-closed enforcement with a genuinely off-list id |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts` (orchestrator-run) | PASS — Test Files 2 passed, Tests 180 passed (180) |
| 7/7 new ids present in `executor-config.ts` and `fanout-run.cjs` | PASS (grep) |
| `DEVIN_DEFAULT_MODEL === 'swe'` in both surfaces | PASS (`executor-config.ts:260`, `fanout-run.cjs:1816`) |
| Additive-only (no id removed) | PASS (allowlist pin retains all prior aliases) |
| `node --check` on `fanout-run.cjs` | PASS (executor pass 2) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The alias superset remains.** `adaptive`, `opus`, `sonnet`, `claude`, `haiku`, `gpt`, `gemini`, `codex`, `swe-1-6` stay dispatchable although the curated catalog no longer features them. Pruning is deferred until a sweep confirms no lane config names them.
2. **The CJS mirror is still a duplicate.** `fanout-run.cjs` intentionally keeps its own copy of the list; drift is possible until someone unifies the two behind one source.
<!-- /ANCHOR:limitations -->
