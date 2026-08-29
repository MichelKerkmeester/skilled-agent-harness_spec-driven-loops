---
title: "Implementation Plan: Phase 7 — Split code-opencode Rust References"
description: "Deterministic line-partition of the 4 Rust docs, then a lockstep rewire of the RUST/CODE_QUALITY router contract, gated by the three deterministic vitests."
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7 — Split code-opencode Rust References

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
Four `code-opencode` Rust docs exceed 500 lines and are load-bearing entries in the machine-readable router contract (RUST + CODE_QUALITY intents, mirrored to the parent-hub union under a drift guard).

### Overview
Losslessly partition each into topic-cohesive parts, then rewire every live authored route to the new part paths, proving correctness with the deterministic router guards.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
Heading-aligned split boundaries computed and dry-run verified (contiguous 1..EOF, ≤500/part).

### Definition of Done
21/21 router-guard tests pass; no dangling old paths in authored files; 0 regressions vs clean-HEAD baseline; `validate.sh --strict` on this child passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic slicer (judgment on boundaries pre-computed) + lockstep map rewrite (child RESOURCE_MAP ⇄ parent union ⇄ vitest constants) + graded-contract update (playbook `expected_resources`).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Split
Run the slicer on the 4 files → 21 parts; delete sources.

### Step 2: Rewire
`code-opencode/SKILL.md` (RUST 3→17, CODE_QUALITY checklist→4); `shared/references/smart_routing.md` (RUST RESOURCE_MAP + prose row); `surface-slice-sync.vitest.ts` (RUST_TRIO + line-132); internal cross-links; playbook `expected_resources`.

### Step 3: Gate
3 vitests + dangling grep + baseline delta + `validate.sh --strict`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Deterministic vitests are the fast gate (`npx vitest run` from `deep-improvement/scripts`). The live Mode-B benchmark re-baseline (paid) is deferred to the 012 rollup; it does not gate this phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Parent 018 widened for WS2 (spec + graph-metadata list 007-012). No dependency on sibling WS2 phases; 007 is independent per surface.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

One commit on `skilled/v4.0.0.0`; `git revert` restores the monolithic files. The split is reversible (parts concatenate back to source).
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `implementation-summary.md`
- Parent: `../spec.md`
