---
title: "Feature Specification: Benchmark Authoring Centralization in create-benchmark"
description: "Make sk-doc/create-benchmark the single home for benchmark-DOCUMENT templates and authoring standards across all repo benchmark families. Author skill-benchmark storage/README templates and model-benchmark fixture/profile templates plus the Lane A guide, add a complete family-disambiguation table (Lane A marked code-owned), and rewire deep-improvement consumer docs to point at create-benchmark for authoring while run/scoring logic stays in the deep-loop lanes. The Lane C report .md stays renderer-owned."
trigger_phrases:
  - "create-benchmark centralization"
  - "benchmark templates single home"
  - "skill-benchmark model-benchmark templates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-benchmark-authoring-and-validation-fixes/000-benchmark-authoring-centralization"
    last_updated_at: "2026-07-20T09:23:08Z"
    last_updated_by: "claude-code"
    recent_action: "All families authored + integrated; 10/10 packets PASS; rewire pointer-only"
    next_safe_action: "Terminal gates + push"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Benchmark Authoring Centralization in create-benchmark

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-12 |
| **Parent** | `sk-doc/018-benchmark-authoring-and-validation-fixes` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | None |
| **Successor** | `../001-organize-benchmark-resources-and-routing/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`create-benchmark` currently templates only 2 of the repo's benchmark families (MCP promotion, behavior). The others live scattered inside `system-deep-loop/deep-improvement/`: Lane A agent-improvement (5-dim JSON), Lane B model-benchmark (pattern / code-task / reviewer fixtures + profiles), and Lane C skill-benchmark (code-rendered report + hub `benchmark/<run-label>/` storage). Authoring standards and templates are duplicated into those lanes.

**Purpose:** apply the behavior-family precedent (normative contract stays in `system-deep-loop/shared/`; templates + guide live in create-benchmark) across the families so create-benchmark is the single home for benchmark-document creation, and the deep-loop modes become consumers that keep only run/scoring logic.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** new `create-benchmark/assets/` templates (skill-benchmark hub `benchmark/README` template; model-benchmark pattern-fixture, code-task-fixture, and profile templates) and `references/` guides (skill_benchmark storage guide, model_benchmark fixture guide); a complete family-disambiguation table in create-benchmark SKILL §1 (all families, Lane A marked code-owned) plus new authored-family sections mirroring the behavior §8 shape; the create-benchmark SKILL header normalization shared with 015; pointer-only edits to deep-improvement consumer docs (references/assets READMEs and operator guides); version bump + changelog.

**Out of scope:** any fill-in template for the Lane C `skill-benchmark-report.md` (it is a `build-report.cjs` anti-drift render — NEVER template it); scorers, runners, scoring contracts, `framework.md`, `reviewer_schema.md` internals (cross-linked, not moved); `deep-improvement` run/scoring LOGIC; ALL `system-deep-loop/deep-alignment/**` (live concurrent session); `system-deep-loop` hub SKILL.md; advisor registry/router/description.json vocabulary.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: Author skill-benchmark storage-convention standard + a hub `benchmark/README` template; explicitly state the report `.md` is renderer-owned and must never be hand-authored.
- R2: Author model-benchmark fixture templates (pattern fixture, t3 code-task fixture) + a profile template + a fixture-authoring guide; keep `reviewer_schema.md` and scorer/evaluator contracts lane-local, cross-linked.
- R3: Extend create-benchmark SKILL §1 into a complete family-disambiguation table covering all families with an owns-vs-routes column; Lane A marked code-owned with in-lane artifacts as a documented non-goal.
- R4: New authored-family sections mirror the behavior §8 shape (package shape, template map, authoring workflow, ALWAYS/NEVER, success criteria). create-benchmark SKILL reaches `package_skill.py --check` PASS (satisfies 015 R1/R2 for this file).
- R5: Rewire deep-improvement consumer docs to reference create-benchmark for authoring via pointers only; no logic moved out of the lanes.
- R6: All new authored docs carry the 5-field frontmatter + 4-part version and pass `validate_document.py`.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- New templates + guides exist under create-benchmark and pass `validate_document.py` (0 issues).
- create-benchmark SKILL §1 family table covers all families; `package_skill.py create-benchmark --check` PASS.
- deep-improvement consumer docs point at create-benchmark for authoring; zero run/scoring logic relocated.
- No edit under `deep-alignment/**`; no scorer/runner/framework/registry change.
- `validate.sh --strict` Errors:0 on this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Naive "move everything" would break Lane C anti-drift — mitigated by the renderer-owned boundary (R1) and the code-owned marks (R3).
- deep-improvement lanes carry live run/scoring logic — edits restricted to prose consumer docs; hard exclusion of scorers/runners/contracts.
- deep-alignment is a live concurrent session — zero edits under that subtree; Phase gate greps the diff.
- Depends on 015 header-split canon for create-benchmark; the create-benchmark rewrite here satisfies both.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Whether to CI-wire `package_skill.py` is a documented optional follow-up, not in scope.
<!-- /ANCHOR:questions -->
