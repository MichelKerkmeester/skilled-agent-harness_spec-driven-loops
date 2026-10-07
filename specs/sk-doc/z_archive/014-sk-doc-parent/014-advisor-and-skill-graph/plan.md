---
title: "Implementation Plan: Phase 014 — Advisor + skill-graph rewrite and re-fingerprint"
description: "Reconstructed Level 1 implementation plan for the advisor and skill-graph rewrite phase. It restates the spec.md problem, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "sk-doc advisor and skill graph plan"
  - "advisor graph re-fingerprint plan"
  - "skill graph one identity plan"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Phase 014 — Advisor + skill-graph rewrite and re-fingerprint

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Skill metadata surfaces for the sk-doc hub: graph-metadata.json, skill_advisor.py and skill-graph.json |
| **Framework** | sk-doc monolith to parent-hub conversion (phase 014) |
| **Storage** | Not recorded |
| **Testing** | Strict `validate.sh` for this folder plus the advisor and skill-graph identity checks named in spec.md |

### Overview
Execute impact-map surfaces #5/#6. Rewrite graph-metadata.json derived.trigger_phrases/intent_signals/key_files/entities/source_docs to span all workflow surfaces and repoint off monolith paths; confirm description.json shape; extend skill_advisor.py PHRASE_INTENT_BOOSTERS/SINGLE_WORD_INTENT for the missing verbs (benchmark/command/feature-catalog/changelog/skill); regenerate skill-graph.json via skill_graph_compiler.py and confirm skill_count keeps exactly one sk-doc entry (no phantom family); run advisor rebuild/scan so freshness re-fingerprints; verify no child packet or shared/ carries graph-metadata.json/description.json.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 deep-research rulings available
- [ ] Predecessor `013-command-rebinding/` complete

### Definition of Done
- [ ] Rewritten graph-metadata.json covers all surfaces with new paths
- [ ] skill_advisor.py booster extensions for the missing verbs
- [ ] Regenerated skill-graph.json keeps exactly one sk-doc identity
- [ ] Advisor rebuild/scan re-fingerprints freshness
- [ ] No child packet or shared/ carries graph-metadata.json/description.json
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Not recorded — the scaffold did not record an implementation pattern.

### Key Components
- graph-metadata.json (derived trigger phrases, intent signals, key files, entities, source docs)
- skill_advisor.py PHRASE_INTENT_BOOSTERS/SINGLE_WORD_INTENT
- skill-graph.json regenerated via skill_graph_compiler.py
- Advisor rebuild/scan freshness re-fingerprint

### Data Flow
Not recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns task state. Phase breakdown beyond the spec-level deliverables was not recorded.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The phase's success criteria are a passing `validate.sh` for this folder and zero external-coupling breakage introduced by the phase (facades resolve). Exact commands and their output are Not recorded.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 deep-research rulings | Internal | Not recorded | This phase's scope may shift |
| Depends-on phases 003, 005, 006, 007, 008, 009, 010, 011, 012 | Internal | Not recorded | The surfaces this phase rewrites would not be settled |
| Predecessor `013-command-rebinding/` | Internal | Not recorded | The conversion chain would be out of order |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was scaffolded.
<!-- /ANCHOR:rollback -->
