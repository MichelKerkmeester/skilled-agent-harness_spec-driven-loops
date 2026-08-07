---
title: "Tasks: Phase 3 — Surface Detection & Routing"
description: "Execution checklist for the code-opencode SKILL.md Rust routing edits."
trigger_phrases:
  - "018 phase 003 tasks"
  - "code-opencode routing tasks rust"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/003-surface-routing"
    last_updated_at: "2026-07-11T08:53:41Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded this phase task list from the 018 research manifest"
    next_safe_action: "Execute T001 (locate live SKILL.md routing lines)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3 — Surface Detection & Routing

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Locate the live SKILL.md detection, INTENT_SIGNALS, RESOURCE_MAP, and CODE_QUALITY lines (re-anchor off the research estimates) — re-anchored to live `SKILL.md` detection L18, `INTENT_SIGNALS` L56, `RESOURCE_MAP` L68, `CODE_QUALITY` L77
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add `.rs` + `Cargo.toml`/`Cargo.lock` detection after surface selection — extension `.rs` -> Rust plus Cargo fallback + napi-rs/wasm-bindgen intent-signal note added to `SKILL.md` detection prose
- [x] T003 Add the `RUST` INTENT_SIGNALS entry (keyword list from Deliverable 2B) — `RUST` intent added with 12 keywords (`rust`, `.rs`, `cargo.toml`, `napi-rs`, `wasm-bindgen`, `wasi`, `cdylib`, …)
- [x] T004 Add the `RUST` RESOURCE_MAP entry (references/rust/*) — `RUST` maps to the `references/rust/` trio (style_guide/quality_standards/quick_reference)
- [x] T005 Register `rust_checklist.md` under CODE_QUALITY + the human-facing reference map — `rust_checklist.md` added to `CODE_QUALITY` list + human ref-map row + quality-gate inventory
- [x] T006 Add the surface-wide Rust non-negotiable line — `Rust preserves the TypeScript contract` bullet added to §3 (JS-visible bytes/numerics/ordering/IDs/DTOs match the TS oracle)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirm every routed RUST path exists (phase 002 files) — python `ast.parse` of the machine block OK; `RUST` present in both INTENT_SIGNALS and RESOURCE_MAP; all `references/rust/` targets on disk
- [x] T008 Confirm no existing-language intent/resource regressed — 10 intent keys preserved (`IMPLEMENTATION`…`RUST`); JavaScript/TypeScript/Python/Shell/Config entries byte-unchanged
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Detection + RUST routing + checklist registration applied — 7 `SKILL.md` edits (T002–T006)
- [x] No `[B]` blocked tasks remaining — all T001–T008 marked `[x]`
- [x] No existing-language regression — 10 intent keys preserved; sibling-language maps byte-unchanged
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: spec.md
- **Plan**: plan.md
- **Manifest**: ../001-research/research/research.md (Deliverable 2B)
<!-- /ANCHOR:cross-refs -->
