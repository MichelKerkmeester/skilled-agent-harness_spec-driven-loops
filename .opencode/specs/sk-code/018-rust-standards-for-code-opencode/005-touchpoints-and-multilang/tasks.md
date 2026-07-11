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
    last_updated_at: "2026-07-11T13:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Completed T006/T008/T010 (router-replay touched-language set) — all six touchpoints done"
    next_safe_action: "Phase 5 complete; proceed to phase 006 gate verification and parent rollup"
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
- [x] T006 `router-replay.cjs`: surface regex, OPENCODE_LANGUAGES, Rust detection + fixtures — `.rs` added to `detectSurface`; `OPENCODE_LANGUAGES += rust`; `detectOpencodeLanguage`→`detectOpencodeLanguages` (Set) with the napi-rs/wasm-bindgen/WASI/cdylib marker regex; landed atomically in commit `d5bf1513b5`
- [x] T007 [P] shared trio: Rust in `universal_patterns.md` + `code_organization.md` — `universal_patterns.md` Rust scope + trio link + determinism-contracts block; `code_organization.md` `references/rust/` layout + Rust module/test conventions
- [x] T008 Change first-match selection to a touched-language set; add Rust+TypeScript fixtures — scalar→Set filter keyed on `ocLangs.has`; golden diff over 14 probes shows every single-language + parity prompt byte-identical and multi-language tasks gaining their second trio; 8 parent-level fixtures added to `surface-slice-sync.vitest.ts`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verifiers exit 0 for a `references/rust/` folder — `verify_stack_folders.py` exit 0 and `verify_alignment_drift.py --root .` exit 0; drift guard `sk-code-router-sync.vitest.ts` still 7/7
- [x] T010 Router-replay Rust + Rust+TypeScript fixtures select the right trios; no existing-language regression — parity fixture pins the exact `{rust,typescript}` folder set; full skill-benchmark vitest shows an identical pre-existing failure set (11) with 116 pass unchanged; Gate 2 report verdict PASS 9/9
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All six touchpoints recognize Rust — all six done; the `router-replay.cjs` touchpoint landed in commit `d5bf1513b5`
- [x] No `[B]` blocked tasks remaining — T006, T008, T010 all complete
- [x] Touched-language set works; no regression — golden diff proves single-language + parity prompts byte-identical; multi-language tasks gain their second trio by design

> **Complete:** all six touchpoints recognize Rust, and the first-match→touched-language-set change landed in `router-replay.cjs` — atomic (the Set swap and `OPENCODE_LANGUAGES += rust` in one commit) and proven non-regressing by a 14-probe golden diff plus the full skill-benchmark vitest (identical pre-existing failure set, 116 pass unchanged). The deferred cross-skill touchpoint was un-deferred and completed in an isolated worktree once the shared benchmark was safe to edit.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: spec.md
- **Plan**: plan.md
- **Manifest**: ../001-research/research/research.md (Deliverable 2D)
<!-- /ANCHOR:cross-refs -->
