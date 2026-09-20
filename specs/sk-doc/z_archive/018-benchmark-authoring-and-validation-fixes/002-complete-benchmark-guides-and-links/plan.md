---
title: "Implementation Plan: Benchmark Authoring Completion and Cross-Links"
description: "Phased plan to author the Lane A authoring guide, complete the create-benchmark <-> deep-loop bidirectional links, and land the 016->015 metadata, sibling, and fixtureDir corrections, without relocating any lane-owned contract."
trigger_phrases:
  - "benchmark authoring completion plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-benchmark-authoring-and-validation-fixes/002-complete-benchmark-guides-and-links"
    last_updated_at: "2026-07-13T14:35:28Z"
    last_updated_by: "claude-code"
    recent_action: "Plan authored"
    next_safe_action: "Execute Phase 1 fixes"
    blockers: []
---
# Implementation Plan: Benchmark Authoring Completion and Cross-Links

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
Two read-only audits established the move map. The four already-authored families keep their templates/guides in create-benchmark; nothing migrates from deep-alignment (its `behavior_benchmark/` is all filled instances). The shared `framework.md` and the four measurement contracts have no code readers but are run/scoring authorities; per operator ruling they stay lane-owned and are cross-linked. Lane A has code-reader coupling on `improvement_config.json`. create-benchmark SKILL.md is at the 5000-word cap, so new detail lands in the reference guide.

### Overview
Author the family guide, integrate it into the SKILL word-neutrally, complete the bidirectional links, and land the three carried-over corrections — all without moving a lane-owned artifact.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Move map and blast radius established by audit; operator ruling recorded (contracts stay lane-owned).
- Target paths and cross-link authorities enumerated.

### Definition of Done
- `validate_document.py` 0 issues on new/changed docs; `package_skill.py create-benchmark --check` PASS.
- `validate.sh --strict` Errors:0 on this child; no run/scoring or contract diff.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
create-benchmark owns benchmark-authoring GUIDANCE; the deep-loop lanes own run/scoring. Guides cross-link the lane authorities bidirectionally, never restating or relocating them.

### Key Components
- create-benchmark reference guides (per family) + the §2 family router.
- deep-improvement lane contracts, schemas, and code-coupled templates (unchanged).
- The bidirectional link mesh between the two trees.

### Data Flow
An author enters at create-benchmark §2, routes to a family guide, and follows links into the lane for the normative contract. A lane reader finds the authoring guide via the lane->hub back-pointer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `sk-doc/create-benchmark/**` — one new guide, SKILL §1/§2/§12, changelog, version.
- `system-deep-loop/deep-alignment/behavior_benchmark/behavior_benchmark.md` — one back-pointer bullet.
- `system-deep-loop/deep-improvement/assets/agent_improvement/README.md` — one back-pointer.
- `system-deep-loop/deep-improvement/assets/model_benchmark/benchmark_profiles/*.json` — fixtureDir repoint (data only).
- `specs/sk-doc/018-benchmark-authoring-and-validation-fixes/**` (excl. `review/**`) — identity + sibling corrections.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Land the carried-over corrections (fixtureDir, packet identity, sibling) — independent and low-risk.

### Phase 2: Core Implementation
Author the family guide; integrate it into the SKILL word-neutrally (family table, §1, §12, version, changelog); complete the two lane->hub back-pointers.

### Phase 3: Verification
Run `validate_document.py`, `package_skill.py --check`, link check, and `validate.sh --strict`; generate child metadata; write the implementation summary; reconcile the parent phase map.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Link-not-copy grep on each guide.
- Word-count measurement before/after each SKILL edit.
- No-regression: `git diff --stat` reviewed against the scope list; zero diff under run/scoring code, contracts, templates, deep-alignment engine.
- Path resolution: every new back-pointer and every profile `fixtureDir` resolves on disk.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Parent 015 family-section shape (mirrored by the new guides).
- Operator ruling: contracts stay lane-owned, cross-linked.
- sk-doc shared validators (`validate_document.py`, `package_skill.py`) and the spec validator.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All edits are additive docs, one-line back-pointers, a mechanical config path fix, and metadata normalization. Rollback is `git checkout` of the changed paths; no data migration or destructive move is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Phase 1 is independent of Phases 2-3.
- The guide (Phase 2) precedes the SKILL §12 links and the lane->hub back-pointer (the target must exist first).
- Metadata generation and the parent phase-map update (Phase 3) run last.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Estimate | Notes |
|-----------|----------|-------|
| One family guide | Moderate | Author against a proven exemplar; validate it. |
| SKILL integration | Small | Word-neutral edits under a hard cap. |
| Links + three fixes | Small | Mechanical; verified by grep/resolution. |
| Gates + close-out | Small | Validators + metadata + summary. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Confirm no diff under run/scoring code, contracts, code-coupled templates, or deep-alignment engine dirs.
- Confirm SKILL word count <= cap and `--check` PASS.

### Rollback Procedure
- `git checkout -- <changed paths>` restores the prior state; the changes are non-destructive.

### Data Reversal
- None required; no data migration, deletion, or schema change is performed.
<!-- /ANCHOR:enhanced-rollback -->
