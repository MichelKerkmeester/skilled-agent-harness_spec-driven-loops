---
title: "Implementation Plan: Kebab Naming Conformance + Manifest Consolidation"
description: "Reconstructed Level 2 implementation plan for the naming-and-manifests research child. It restates the spec.md research question and scope; the original plan was never written."
trigger_phrases:
  - "styles naming conformance research plan"
  - "styles manifest consolidation plan"
importance_tier: "important"
contextType: "research"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Kebab Naming Conformance + Manifest Consolidation (gap A2 + A3)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Not recorded — research-only child; no renames executed |
| **Framework** | Forced 5-iteration SOL deep-research synthesis (read-only) |
| **Storage** | `research/research.md` — the synthesis |
| **Testing** | Not recorded |

### Overview
Answer what the exact kebab rename map is for the styles backend — with a safe import/reference-update plan so nothing breaks — and how the two overlapping manifests (crawl `_manifest.json` + DB `_retrieval-manifest.json`) should be consolidated into a single source of truth, grounded in the naming canon and the two manifest schemas. Research and recommend only — no renames are executed in this child.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Gaps A2/A3 confirmed against the repo state in `../gap-analysis.md`
- [ ] Naming canon and the two manifest schemas available to ground the research

### Definition of Done
- [ ] `research/research.md` delivered with the kebab rename map and the manifest consolidation recommendation
- [ ] No renames executed (research-only scope)
- [ ] Folder validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only deep-research synthesis. The rename map and manifest recommendation are grounded in the naming canon and the two manifest schemas; nothing is executed.

### Key Components
- `spec.md` — the child charter (research question, scope, successor)
- `research/` — the deep-research artifact tree
- `research/research.md` — the forced 5-iteration SOL synthesis (the deliverable)

### Data Flow
The forced 5-iteration SOL loop reads the naming canon, the styles backend and the two manifests, then synthesizes the rename map and consolidation recommendation into `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns task state.

### Phase 1: Setup
- [ ] Scaffold the child packet and its `research/` state tree

### Phase 2: Research
- [ ] Run the forced 5-iteration SOL deep-research on the naming and manifests question

### Phase 3: Synthesis + Verification
- [ ] Write the synthesis to `research/research.md`
- [ ] Validate the folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Not recorded — research-only child; verification beyond folder validation was not captured.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../gap-analysis.md` (gaps A2/A3 evidence) | Internal | Not recorded | No evidence-confirmed gap to research |
| Naming canon (`filesystem-naming-convention.md`) | Internal | Not recorded | No convention to conform the rename map to |
| The two overlapping manifests (`_manifest.json`, `_retrieval-manifest.json`) | Internal | Not recorded | No sources of truth to reconcile |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — research-only child; nothing to roll back beyond discarding the synthesis draft.
<!-- /ANCHOR:rollback -->
