---
title: "Implementation Plan: Styles Tree Restructure Research — data/code separation + runtime alignment"
description: "Reconstructed Level 2 implementation plan for the styles-restructure research child. It restates the spec.md research question and scope; the original plan was never written."
trigger_phrases:
  - "styles restructure research plan"
  - "styles data code separation plan"
importance_tier: "important"
contextType: "research"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Styles Tree Restructure Research (gap A1 + A5)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Not recorded — research-only child; no code written |
| **Framework** | Forced 5-iteration SOL deep-research synthesis (read-only) |
| **Storage** | `research/research.md` — the synthesis |
| **Testing** | Not recorded |

### Overview
Answer how the `styles/` tree should separate the 1,290 downloaded style data folders from the backend code and align to the `deep-loop/runtime` architecture: deliver a concrete target folder layout, a migration path from the current flat mixed structure, and the `git-mv` rename plan, grounded in the actual current tree and the runtime reference. Research and recommend only — no file moves or renames are executed in this child.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Gaps A1/A5 confirmed against the repo state in `../gap-analysis.md`
- [ ] Research question and scope fixed in `spec.md`

### Definition of Done
- [ ] `research/research.md` delivered with the target layout, migration path and rename plan
- [ ] No file moves or renames executed (research-only scope)
- [ ] Folder validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only deep-research synthesis. Recommendations are grounded in the actual current `styles/` tree and the `deep-loop/runtime` reference; nothing is executed.

### Key Components
- `spec.md` — the child charter (research question, scope, successor)
- `research/` — the deep-research artifact tree
- `research/research.md` — the forced 5-iteration SOL synthesis (the deliverable)

### Data Flow
The forced 5-iteration SOL loop reads the current tree and the runtime reference, then synthesizes the findings into `research/research.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns task state.

### Phase 1: Setup
- [ ] Scaffold the child packet and its `research/` state tree

### Phase 2: Research
- [ ] Run the forced 5-iteration SOL deep-research on the restructure question

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
| `../gap-analysis.md` (gaps A1/A5 evidence) | Internal | Not recorded | No evidence-confirmed gap to research |
| `deep-loop/runtime` architecture reference | Internal | Not recorded | No proven separation pattern to align to |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — research-only child; nothing to roll back beyond discarding the synthesis draft.
<!-- /ANCHOR:rollback -->
