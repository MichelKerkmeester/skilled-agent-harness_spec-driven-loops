---
title: "Implementation Plan: Parent-Hub Vocabulary Compatibility Measurement"
description: "Plan for the three read-only measurement assets (cross-hub collision report, advisor projection-surface coverage check, labeled cross-hub ambiguity fixture dataset). Assets-first, no vocab/metadata/scorer change; grounds the later gated WU-3 vocab patch."
trigger_phrases:
  - "parent hub vocab compat plan"
  - "cross-hub measurement assets plan"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-skill-advisor-tuning/009-parent-hub-vocab-compat"
    last_updated_at: "2026-07-07T18:33:59.000Z"
    last_updated_by: "claude-opus"
    recent_action: "Planned 3 read-only assets; two dispatched to read-only agents"
    next_safe_action: "Integrate agent assets; generate metadata; validate --strict; commit"
---
# Implementation Plan: Parent-Hub Vocabulary Compatibility Measurement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
Build three read-only measurement assets that make the parent-hub vocabulary collision surface legible, so the gated WU-3 vocab-migration patch is precisely targeted and measurable. Nothing here mutates vocabulary, metadata, or scorer code — the deliverables are analysis documents and one labeled dataset.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- `validate.sh <folder> --strict` → Errors: 0.
- Every load-bearing anchor in each asset is a re-verified `file:line`.
- Collision report uses exactly the four-class taxonomy and classifies shared-infra terms `allowed-shared`.
- No file outside this packet folder is created or modified; `mcp_server` stays git-clean.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Three independent documents, no code:
- `collision-report.md` — workspace-level phrase→hub→class matrix over four hubs.
- `projection-coverage.md` — per-mode alias→projected-field coverage over the scorer projection surface.
- `ambiguity-fixture.md` — labeled dataset (25 cross-hub rows + gold-none slice), baselined 15/25 = 0.60.
Each asset is self-contained and ends with a coverage/provenance note.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES
- **Read (no write):** `sk-code`, `sk-design`, `deep-loop-workflows`, `deep-loop-runtime` vocab surfaces (graph-metadata.json, mode-registry.json, hub-router.json); the advisor projection logic (`mcp_server/lib/scorer/projection.ts`, `derived.ts`); the guard `parent-hub-vocab-sync.cjs`; sibling packets 007 (baseline) and 008 (abstain slice).
- **Written:** only files inside `009-parent-hub-vocab-compat/`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES
1. **Scaffold** — spec + plan + tasks + checklist + this packet's Level-2 docs.
2. **Assets** — collision report + projection-coverage (dispatched to read-only agents) + ambiguity fixture (authored from research families + 008 abstain slice).
3. **Integrate & verify** — reconcile agent assets, generate metadata, register under the 012 parent, validate `--strict`, commit via isolated scratch-index push.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY
No executable tests (docs/data packet). Verification is: `validate.sh --strict` Errors 0; manual anchor spot-check that cited `file:line` surfaces resolve; internal consistency between the three assets (same hub-ownership basis).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES
- Source-truth hub metadata + scorer projection source (read-only).
- The research synthesis (3×10 deep-research + 10-angle deep-review) as the finding basis.
- Downstream: the gated WU-3 vocab patch + atomic reindex consumes these assets.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN
Delete the packet folder; nothing outside it changed. No metadata/vocab/scorer state to revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 9. PHASE DEPENDENCIES
Scaffold → Assets → Integrate. The two agent-built assets run in parallel; the fixture is independent. Integration waits on all three.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 10. EFFORT
Low-to-moderate: analysis + authoring, no implementation. Bounded by cross-hub inventory accuracy, not code volume.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 11. ENHANCED ROLLBACK
Not applicable — no runtime, migration, or shared-state change. Folder deletion is a complete, side-effect-free rollback.
<!-- /ANCHOR:enhanced-rollback -->
