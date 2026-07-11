---
title: "Tasks: Phase 5 — Registration Touchpoints & Multi-Language Routing"
description: "Execution checklist for the six Rust registration touchpoints and the touched-language-set change."
trigger_phrases:
  - "018 phase 005 tasks"
  - "touchpoints multilang tasks rust"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/005-touchpoints-and-multilang"
    last_updated_at: "2026-07-11T08:53:41Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded this phase task list from the 018 research manifest"
    next_safe_action: "Execute T001 (locate each touchpoint's Rust-relevant block)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5 — Registration Touchpoints & Multi-Language Routing

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

- [x] T001 Locate each touchpoint's Rust-relevant block (detection tables, language sets, fixtures) — anchored `verify_stack_folders.py:15`, `hub-router.json:70`, `stack_detection.md` §3 table, `verify_alignment_drift.py` SUPPORTED_EXTENSIONS, shared-trio scope/layout sections
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] `stack_detection.md`: add the RUST detection row — `RUST` row (`.rs` + Cargo fallback + napi-rs/wasm-bindgen) plus a Rust+TypeScript touched-language-set note
- [x] T003 [P] `hub-router.json`: extend the code-opencode-runtime vocabulary with Rust terms — +10 terms (`rust`, `.rs`, `cargo.toml`, `napi-rs`, `wasm-bindgen`, `wasi`, `cdylib`, …); still valid JSON
- [x] T004 [P] `verify_stack_folders.py`: add `rust` to KNOWN_LANGUAGES — verifier exits 0: "6 language folder(s) all resolve — config, javascript, python, rust, shell, typescript" (clears the phase-002 orphan)
- [x] T005 `verify_alignment_drift.py`: add `.rs -> rust` + Rust checks; update its test — `.rs`→rust + `check_rust` (`RUST-UNSAFE-NO-SAFETY` ERROR, `RUST-PANIC-BOUNDARY` WARN) + 4 tests; `python3 -m unittest` 15/15 pass
- [B] T006 `router-replay.cjs`: surface regex, OPENCODE_LANGUAGES, Rust detection + fixtures — DEFERRED: shared cross-skill benchmark infra a concurrent operator session may read live; operator-directed split
- [x] T007 [P] shared trio: Rust in `universal_patterns.md` + `code_organization.md` — `universal_patterns.md` Rust scope + trio link + determinism-contracts block; `code_organization.md` `references/rust/` layout + Rust module/test conventions
- [B] T008 Change first-match selection to a touched-language set; add Rust+TypeScript fixtures — DEFERRED: the code change lives in `router-replay.cjs` (see T006); the `stack_detection.md` touched-language-set doc note is done in T002
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verifiers exit 0 for a `references/rust/` folder — `verify_stack_folders.py` exit 0 and `verify_alignment_drift.py --root .` exit 0; drift guard `sk-code-router-sync.vitest.ts` still 7/7
- [B] T010 Router-replay Rust + Rust+TypeScript fixtures select the right trios; no existing-language regression — DEFERRED: depends on T006/T008 (`router-replay.cjs`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All six touchpoints recognize Rust — 5/6 done; `router-replay.cjs` (T006) deferred
- [ ] No `[B]` blocked tasks remaining — T006, T008, T010 blocked on the deferred `router-replay.cjs` work
- [ ] Touched-language set works; no regression — doc note landed (T002); the code change is deferred (T008)

> **Partial (In Progress):** the five sk-code-local touchpoints are complete and verified. The `router-replay.cjs` touchpoint (surface regex, touched-language-set refactor, Rust+TS fixtures — T006/T008/T010) is deferred by operator direction: it is shared cross-skill benchmark infrastructure a concurrent operator session may be running against, so it will land when that session is quiet. Phase 006's router-replay gate waits on it.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: spec.md
- **Plan**: plan.md
- **Manifest**: ../001-research/research/research.md (Deliverable 2D)
<!-- /ANCHOR:cross-refs -->
