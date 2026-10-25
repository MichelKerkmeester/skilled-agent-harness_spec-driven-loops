---
title: "Implementation Plan: Phase 10: review-remediation"
description: "Edit the routing vocabulary and the rule docs by hand, regenerate the derived artifacts with their own generators once at the end, then re-run every check the review names."
trigger_phrases:
  - "review remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: review-remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, YAML, CommonJS |
| **Framework** | The compiled-routing engine and the spec-kit validator |
| **Storage** | None |
| **Testing** | `node --test`, `verify-router-sync.cjs`, `run-all-drift-guards.sh`, `validate.sh` |

### Overview
The routing fix edits the same keyword list in five places and regenerates the skill graph, the compiled-route manifest and the Hermes copy with their own tools. The record fixes re-run each acceptance row's own verification command before changing its status.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source edit, then generator, then guard.

### Key Components
- **Routing vocabulary**: `hub-router.json` scores the CI surface, and `ROUTER.md`, `graph-metadata.json` and `sk-code-ci/SKILL.md` restate it.
- **Derived artifacts**: `skill-graph.json`, the activation manifest and the Hermes copy, each written by its generator.

### Data Flow
A prompt is scored against `hub-router.json`, the activation manifest pins the policy hash, and the guard tests compare the restatements with the source.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The surface-hint suite carries the guard prompt that failed. The path keyword is checked by a compiled-route probe, recorded in `implementation-summary.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the components above.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the scoped change, then rerun `compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code`, `skill_graph_compiler.py --export-json` and `sync-skills-hermes.cjs` so the derived artifacts follow.
<!-- /ANCHOR:rollback -->

---

