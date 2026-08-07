---
title: "Implementation Plan: Phase 13 — Behavior Benchmark Templates & Creation Guide"
description: "Study the shipped deep-alignment package + framework, author three templates and a guide mirroring them, extend the create-benchmark SKILL/README with the second family, and validate every authored file."
trigger_phrases:
  - "018 phase 013 plan behavior benchmark"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/013-behavior-benchmark-templates"
    last_updated_at: "2026-07-12T08:54:18Z"
    last_updated_by: "claude-code"
    recent_action: "Templates + guide + SKILL authored and validated"
    next_safe_action: "Commit 013 and push"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13 — Behavior Benchmark Templates & Creation Guide

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
sk-doc documentation authoring. New family added to the existing `create-benchmark` packet; no code, no runtime change.
### Overview
Read the shipped deep-alignment package + shared framework, author three templates and a guide that mirror them and match sk-doc conventions, extend SKILL/README, and validate.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
Shipped `deep-alignment/behavior_benchmark/` and `framework.md` read as the fidelity reference.
### Definition of Done
All authored files validate 0 issues; relative links to the framework resolve; scenario template mirrors the runner-parsed contract shape.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Second benchmark family inside one packet: MCP promotion (§2-§7) and behavior (§8). Templates in `assets/`, guide in `references/`, contract in `SKILL.md`; the measurement contract stays external in `shared/behavior-benchmark/framework.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Study: read framework, shipped index/scenario/baseline, sk-doc template pattern.
2. Author templates: scenario, index, baseline (with usage headers + placeholders).
3. Author guide: `references/behavior_benchmark_guide.md`.
4. Extend contract: SKILL §1 families + §8, README, references/README, changelog v1.1.0.0.
5. Validate: run the shared validator on every authored file; fix to 0 issues.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
`validate_document.py` on each new/edited markdown file (asset/reference/readme/skill/changelog auto-detected). Relative-link resolution checked by filesystem probe. Fidelity checked by diffing template output shape against the shipped deep-alignment files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- `system-deep-loop/shared/behavior-benchmark/framework.md` (normative, read-only).
- `deep-alignment/behavior_benchmark/` (fidelity reference, read-only — concurrent session's work).
- `sk-doc/shared/scripts/validate_document.py` (validation).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
All changes are additive files plus one packet's SKILL/README/changelog edits. Rollback = `git revert` the 013 commit; no runtime or data state to unwind.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `./spec.md`, `./tasks.md`, `./implementation-summary.md`
- `../spec.md` (018 parent)
- `.opencode/skills/sk-doc/create-benchmark/SKILL.md`
- `.opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md`
