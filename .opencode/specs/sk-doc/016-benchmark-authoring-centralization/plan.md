---
title: "Implementation Plan: Benchmark Authoring Centralization"
description: "Author skill-benchmark + model-benchmark templates and guides into create-benchmark, extend its SKILL with a full family-disambiguation table and new-family sections (and normalize its Smart Routing header), and rewire deep-improvement consumer docs to pointers."
trigger_phrases:
  - "016 plan benchmark authoring centralization"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-benchmark-authoring-centralization"
    last_updated_at: "2026-07-12T11:38:53Z"
    last_updated_by: "claude-code"
    recent_action: "Templates + guides authored; create-benchmark integrated"
    next_safe_action: "Terminal gates + rewire verification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Benchmark Authoring Centralization

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
sk-doc documentation authoring. New templates + guides added to the create-benchmark packet; deep-improvement consumer docs re-pointed. No scorer/runner/contract code changes.
### Overview
Apply the behavior-family precedent (contract stays normative in the lane; templates + guide live in create-benchmark) to the skill-benchmark and model-benchmark families, give create-benchmark a complete family-disambiguation router, and make the deep-loop modes pure consumers of the templates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
Benchmark-family inventory confirmed; the renderer-owned (Lane C report) and lane-local (reviewer_schema / scoring contracts) boundaries identified.
### Definition of Done
New templates/guides validate 0 issues; create-benchmark `--check` PASS (10/10 overall with 015); family table covers all families; consumer rewire is pointer-only with zero deep-alignment edits; `validate.sh --strict` Errors:0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
One packet, multiple benchmark families. Authored families (MCP promotion, behavior, skill-benchmark, model-benchmark) own their templates + standards here; code-owned families (Lane A agent-improvement, Lane D non-dev-ai-system) are named for router disambiguation but keep artifacts in-lane. The measurement contracts (framework.md, scoring_contract.md, reviewer_schema.md) stay in the deep-loop lanes; create-benchmark links them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Author templates + guides (parallel, disjoint new files): skill-benchmark storage guide + hub README template; model-benchmark fixture (code-task + pattern) + profile templates + fixture guide.
2. Integrate create-benchmark SKILL: split the merged header (015 R1/R2 for this file), expand the family table to all families, add new-family sections mirroring the behavior section, bump version + changelog, update README + references/README.
3. Rewire deep-improvement consumer docs to pointer-only references.
4. Terminal gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
`validate_document.py` on every new/edited doc (0 issues); `package_skill.py create-benchmark --check` (PASS); a diff-scan confirming zero edited paths under `system-deep-loop/deep-alignment/` and no scorer/runner/contract edits; `validate.sh --strict` on the packet.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- Recovered create-benchmark behavior family (v1.1.0.0) as the shape precedent.
- deep-improvement lane sources (fixtures, profiles, references) — read-only for shape learning.
- `system-deep-loop/shared/behavior-benchmark/framework.md`, `deep-improvement/.../scoring_contract.md`, `reviewer_schema.md` — linked, never moved.
- Sibling 015 (owns the header-split canon; create-benchmark's normalization lands here).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Additive template/guide files + create-benchmark SKILL/README edits + pointer-only consumer edits. Rollback = revert the commit; no runtime/data/state to unwind.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `./spec.md`, `./tasks.md`, `./checklist.md`, `./decision-record.md`, `./implementation-summary.md`
- Sibling: `../015-sk-doc-router-alignment/009-packet-smart-routing-conformance/`
- `.opencode/skills/sk-doc/create-benchmark/` (deliverable location)
