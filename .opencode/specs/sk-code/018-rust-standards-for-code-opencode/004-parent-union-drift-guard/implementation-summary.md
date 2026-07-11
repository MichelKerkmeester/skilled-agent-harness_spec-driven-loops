---
title: "Implementation Summary: Phase 4 — Parent-Hub Union & Drift Guard"
description: "Outcome of mirroring the child RUST routing into the parent-hub union in shared/references/smart_routing.md — the re-prefixed RUST resource entry, parent CODE_QUALITY registration of rust_checklist.md, the parent RUST intent, and the human-facing overlay row — which turns the sk-code-router-sync drift-guard vitest from 1-failed (4-path overExtraction) to 7/7 green."
trigger_phrases:
  - "018 rust parent union summary"
  - "smart_routing.md rust union outcome"
  - "sk-code-router-sync drift guard green"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/004-parent-union-drift-guard"
    last_updated_at: "2026-07-11T09:56:28Z"
    last_updated_by: "claude-code"
    recent_action: "Mirrored RUST into the smart_routing.md parent union; drift guard green"
    next_safe_action: "Wire the six registration touchpoints (phase 005)"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-parent-union-drift-guard |
| **Completed** | 2026-07-11 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The parent-hub half of the Rust routing, in `shared/references/smart_routing.md` — four edits from `research.md` Deliverable 2C that mirror phase 003's child map into the parent union the Lane C router-replay reads:

1. **Parent RUST `RESOURCE_MAP`** — the three child paths re-prefixed with `code-opencode/` (`code-opencode/references/rust/{style_guide,quality_standards,quick_reference}.md`).
2. **Parent `CODE_QUALITY`** — `code-opencode/assets/checklists/rust_checklist.md` (kept under `CODE_QUALITY`, not `RUST`, because the guard compares resources per intent).
3. **Parent RUST `INTENT_SIGNALS`** — the same weight-1, 12-keyword entry the child router uses.
4. **Human-facing §6 overlay** — a RUST row in the OpenCode Language-overlay table.

The charter correction from the research holds: the union lives in `smart_routing.md`, not `sk-code/SKILL.md` (which has no machine `RESOURCE_MAP`).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-code/shared/references/smart_routing.md` | Modified | Parent RUST union + parent CODE_QUALITY + parent RUST intent + human overlay row |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Applied directly by Claude Code. The failing drift guard was run first to capture the exact deficit — `sk-code-router-sync.vitest.ts` reported the 4 child paths (`RUST` trio + `rust_checklist.md`) as `overExtraction` — which pinned the parent edit precisely. After applying the four edits, the guard was re-run to 7/7 green and the parent `python` machine block was re-parsed to confirm validity and that `RUST` landed in both parent dicts.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Bundle the 003 + 004 code so the guard is never red on origin | Phase 003 alone breaks the guard; pushing that state would put a red gate on a branch a live operator session shares |
| Keep `rust_checklist.md` under parent `CODE_QUALITY`, not `RUST` | The guard compares resources per intent; the child registers it under `CODE_QUALITY`, so the parent must match |
| Defer the `LANGUAGE_STANDARDS` keyword-vocab extension | Outside the frozen 004 scope; the 012 goal flagged hub-vocab edits as a scorer-eval ratchet-regression risk — it belongs in a separate measured change |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Drift guard | Pass | `sk-code-router-sync.vitest.ts` 7/7 (`overExtraction`/`uncovered`/`tierViolations` all empty) |
| Parent block parses | Pass | `ast.parse` OK; parent `RESOURCE_MAP["RUST"]` = 3 re-prefixed paths; `CODE_QUALITY` has `rust_checklist`; `INTENT_SIGNALS` has `RUST` |
| Union equality | Pass | Parent map == re-prefix(children) + parent-owned allowlist, no orphan `code-opencode/` path |
| Structure | Pass | `validate.sh --strict` on this folder |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`LANGUAGE_STANDARDS` vocab not extended.** Deliverable 2C also proposed adding Rust/`.rs`/Cargo/napi-rs/wasm-bindgen/WASI terms to the parent `LANGUAGE_STANDARDS` keyword list. That is deferred: it is outside this phase's frozen scope and the 012 goal established that hub-vocab edits perturb the advisor scorer-eval ratchet, so it needs its own measured change with a ratchet baseline.
2. **Full router-replay report not re-baselined here.** This phase proves the drift-guard equality; the end-to-end fail-closed router-replay (D5 coverage, scenario pass) runs in phase 006's gate plan after the phase 005 touchpoints and fixtures land.

<!-- /ANCHOR:limitations -->
