---
title: "Implementation Summary: Phase 3 — Surface Detection & Routing"
description: "Outcome of wiring Rust into the code-opencode surface SKILL.md: .rs plus Cargo.toml/Cargo.lock detection, a RUST INTENT_SIGNALS entry, a RUST RESOURCE_MAP pointing at references/rust/*, CODE_QUALITY registration of rust_checklist.md, the human-facing reference map, and the surface-wide Rust-preserves-the-TypeScript-contract non-negotiable. Seven surgical edits, re-anchored to live line numbers, machine block verified parseable."
trigger_phrases:
  - "018 rust surface routing summary"
  - "code-opencode skill.md rust routing outcome"
  - "rust detection intent resource complete"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/003-surface-routing"
    last_updated_at: "2026-07-11T09:56:28Z"
    last_updated_by: "claude-code"
    recent_action: "Applied the seven code-opencode SKILL.md Rust routing edits"
    next_safe_action: "Mirror the RUST routing into the parent union (phase 004)"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-surface-routing |
| **Completed** | 2026-07-11 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Rust wiring in `code-opencode/SKILL.md` — seven surgical edits from `research.md` Deliverable 2B, each re-anchored to the live file (the research line estimates drifted a few lines):

1. **Detection** — `.rs` -> Rust added to the extension list, plus a Cargo fallback sentence (`Cargo.toml`/`Cargo.lock` select Rust only after the OpenCode surface is established; napi-rs/wasm-bindgen vocabulary are intent signals, not cross-project surface detectors).
2. **RUST `INTENT_SIGNALS`** — weight-1 entry with 12 keywords (`rust`, `.rs`, `cargo.toml`, `cargo.lock`, `napi-rs`, `napi_rs`, `#[napi]`, `wasm-bindgen`, `wasm_bindgen`, `#[wasm_bindgen]`, `wasi`, `cdylib`).
3. **RUST `RESOURCE_MAP`** — maps to the `references/rust/` trio.
4. **`CODE_QUALITY`** — `rust_checklist.md` registered alongside the sibling language checklists.
5. **Human-facing reference map** — a Rust row among the core source languages.
6. **Human-facing quality-gate inventory** — `rust_checklist.md` listed.
7. **Surface non-negotiable** — "Rust preserves the TypeScript contract" bullet in §3.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-code/code-opencode/SKILL.md` | Modified | Detection, RUST intent + resource map, CODE_QUALITY registration, human maps, surface non-negotiable |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Applied directly by Claude Code as surgical edits, not via an authoring swarm — this is a shared routing file with a machine-readable block that a deterministic router-replay parses, so precision and live-line re-anchoring mattered more than bulk authoring. Each edit matched the file's existing single-line intent style and multi-line resource style. After the edits, the `python` machine block was extracted and `ast.parse`d to confirm it stays valid, and the two dict literals were evaluated to confirm `RUST` landed in both maps and `CODE_QUALITY` gained the checklist.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Re-anchor every edit to live line numbers | `research.md` deliverables carry model-estimated lines that drift; file targets/structure were correct |
| Match existing single-line intent / multi-line resource styles | Keeps the machine block diff-clean and the router-replay parser happy |
| Place Rust among the core source languages in the human map | Rust is a first-class source language here, not a descriptor/plugin slice |
| Defer the "one language per task" multi-language reconciliation | Deliverable 2B's touched-language-set change is phase 005 scope, not 003 |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Machine block parses | Pass | `ast.parse` of the extracted `python` block succeeds |
| RUST routed both ways | Pass | `RUST` in `INTENT_SIGNALS` (12 kw) and `RESOURCE_MAP` (3 trio paths); `CODE_QUALITY` has `rust_checklist.md` |
| No sibling regression | Pass | 10 intent keys preserved; JavaScript/TypeScript/Python/Shell/Config entries byte-unchanged |
| Routed paths exist | Pass | All `references/rust/` targets present on disk (phase 002) |
| Structure | Pass | `validate.sh --strict` on this folder |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Drift guard is red after this phase alone.** Adding `RUST` to the child map without the parent union makes `sk-code-router-sync.vitest.ts` report the 4 child paths as `overExtraction`. This is the designed sequencing — phase 004 mirrors the re-prefixed paths into `smart_routing.md` and closes the guard (verified green there).
2. **Multi-language reconciliation deferred.** The "one language per task" rule is left intact here; reconciling it into a touched-language set (so Rust+TypeScript parity work loads both trios) is Deliverable 2B's multi-language interop item, scoped to phase 005.

<!-- /ANCHOR:limitations -->
