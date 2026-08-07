---
title: "Feature Specification: Phase 7 — Split code-opencode Rust References"
description: "Split the four oversized code-opencode Rust docs (style_guide.md 1987, quick_reference.md 1571, quality_standards.md 1475, assets/checklists/rust_checklist.md 1005) into 21 topic-cohesive parts (each <=500 lines) and rewire the router contract — the RUST and CODE_QUALITY RESOURCE_MAPs in code-opencode/SKILL.md, the parent smart_routing.md union, the surface-slice-sync RUST_TRIO, and the rust-standards playbook expected_resources — so every deterministic gate stays green."
trigger_phrases:
  - "018 phase 007 split rust references"
  - "code-opencode rust reference hygiene"
  - "rust style_guide quick_reference split"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/007-code-opencode-rust-references"
    last_updated_at: "2026-07-11T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Split applied (21 parts), router contract rewired, 21/21 guards green, 0 regressions"
    next_safe_action: "Commit phase 007, then proceed to phase 008"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-sk-code-018-007-rust-references"
      parent_session_id: null
    completion_pct: 100
    status: "Complete"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 7 — Split code-opencode Rust References

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 006-gate-verification-rollup (WS1) |
| **Successor** | 008-code-opencode-other-references |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four `code-opencode` Rust docs exceed 500 lines — `references/rust/style_guide.md` (1987), `references/rust/quick_reference.md` (1571), `references/rust/quality_standards.md` (1475), and `assets/checklists/rust_checklist.md` (1005). Three are routed under the `RUST` intent and the checklist under `CODE_QUALITY`, so a split must rewire the machine-readable router contract in lockstep or the drift-guard / surface-slice vitests fail closed.

### Purpose
Losslessly partition each of the four docs into topic-cohesive sub-files (≤500 lines) under a subdir named after the file's stem, then rewire every live authored reference to the new parts, proving correctness with the deterministic gates.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Split the 4 files → 21 parts (7 / 5 / 5 / 4) via a deterministic line-partition (no content rewriting).
- Rewire: `code-opencode/SKILL.md` `RESOURCE_MAP.RUST` (3→17 paths) + `CODE_QUALITY` (rust_checklist → 4 parts) + §2 prose; `shared/references/smart_routing.md` RUST rows (RESOURCE_MAP + prose table); `surface-slice-sync.vitest.ts` `RUST_TRIO` + the line-132 assertion; internal cross-links in the split files; `manual_testing_playbook/language-standards/009-rust-standards.md` `expected_resources`.

### Out of Scope
- Changing any reference *content* (splits are byte-preserving partitions plus a generated per-part title/frontmatter header).
- Generated benchmark reports and historical spec-docs/changelogs referencing the old paths.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `code-opencode/references/rust/style_guide/*.md` | Create (7) | Parts of style_guide.md |
| `code-opencode/references/rust/quick_reference/*.md` | Create (5) | Parts of quick_reference.md |
| `code-opencode/references/rust/quality_standards/*.md` | Create (5) | Parts of quality_standards.md |
| `code-opencode/assets/checklists/rust_checklist/*.md` | Create (4) | Parts of rust_checklist.md |
| `code-opencode/references/rust/{style_guide,quick_reference,quality_standards}.md` | Delete | Replaced by parts |
| `code-opencode/assets/checklists/rust_checklist.md` | Delete | Replaced by parts |
| `code-opencode/SKILL.md` | Update | RESOURCE_MAP RUST + CODE_QUALITY + prose |
| `shared/references/smart_routing.md` | Update | RUST RESOURCE_MAP + prose table |
| `.../skill-benchmark/tests/surface-slice-sync.vitest.ts` | Update | RUST_TRIO + line-132 path |
| `code-opencode/manual_testing_playbook/language-standards/009-rust-standards.md` | Update | expected_resources → new parts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
- R1: Each split part ≤500 lines; the union of parts reproduces the source content exactly (lossless partition).
- R2: Every new part path appears in the `RESOURCE_MAP` (child SKILL.md) and the parent `smart_routing.md` union; no deleted path remains in any authored route.
- R3: The three router guards (`sk-code-router-sync`, `surface-slice-sync`, `code-surface-path-parse`) pass, with no new failures vs the clean-HEAD baseline.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- All 4 sources split into 21 parts; sources deleted; no part >500 lines.
- 21/21 router-guard tests pass; dangling-old-path grep clean; 0 regressions vs baseline.
- `validate.sh --strict` on this child passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- Router contract drift if child map and parent union move out of lockstep → mitigated by the drift-guard vitest (fails closed).
- Graded playbook `expected_resources` staleness on the live benchmark → updated to the new part set; verified on the next paid live run (deferred).
- Content loss during split → mitigated by a deterministic line-partition slicer with contiguity/coverage assertions (no rewriting).
- Dependency: parent 018 widened for WS2 (spec + graph-metadata list 007-012).
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- None. Boundaries computed and dry-run verified before this spec was written.
<!-- /ANCHOR:questions -->
