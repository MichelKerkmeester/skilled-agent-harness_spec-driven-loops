---
title: "Feature Specification: Phase 13 — Behavior Benchmark Templates & Creation Guide"
description: "Add first-class sk-doc authoring support for the behavior_benchmark family: three fillable templates (index, scenario contract, baseline), an end-to-end creation guide, and a create-benchmark SKILL/README extension, so a deep-loop mode's behavior_benchmark package can be authored the way MCP promotion benchmarks already are. Templates mirror the shipped deep-alignment package and sk-doc conventions; the shared framework stays the single measurement contract."
trigger_phrases:
  - "018 phase 013 behavior benchmark templates"
  - "sk-doc behavior benchmark authoring"
  - "create-benchmark behavior family"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/013-behavior-benchmark-templates"
    last_updated_at: "2026-07-12T08:54:18Z"
    last_updated_by: "claude-code"
    recent_action: "Authored 3 templates + guide + SKILL section 8 + README/changelog; all validate 0 issues"
    next_safe_action: "Commit 013 and push"
    blockers: []
    completion_pct: 100
    status: "Complete"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 13 — Behavior Benchmark Templates & Creation Guide

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-12 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 012-gate-verification-rollup |
| **Successor** | done |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The `behavior_benchmark` family had a normative contract (`system-deep-loop/shared/behavior-benchmark/framework.md`) and one shipped package (`deep-alignment/behavior_benchmark/`), but no reusable templates or creation guide — unlike the MCP promotion benchmark family, which `sk-doc/create-benchmark` already scaffolds. Authoring a new mode's behavior_benchmark package meant hand-copying the deep-alignment files and re-deriving conventions.

**Purpose:** give the behavior_benchmark family the same first-class sk-doc authoring support as MCP promotion — fillable templates, a creation guide, and a SKILL contract section — so a package can be authored consistently, and so template and file-naming conventions match closely to the shipped package and to other sk-doc templates.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope** (all under `.opencode/skills/sk-doc/create-benchmark/`):
- `assets/behavior_benchmark_index_template.md`, `assets/behavior_benchmark_scenario_template.md`, `assets/behavior_benchmark_baseline_template.md` — the three templates.
- `references/behavior_benchmark_guide.md` — the creation guide.
- `SKILL.md` §8 + §1 Benchmark Families router and triggers; description/keywords/Family Boundary.
- `README.md` + `references/README.md` — surface the new family and templates.
- `changelog/v1.1.0.0.md` — version bump entry.
- Bundled hygiene fix in touched files only: broken `assets/benchmark/…` → `assets/…` template paths.

**Out of scope:** the shared measurement framework itself (rubric, runner, budget formula — unchanged); authoring any concrete mode's package; mode-registry/hub-router advisor vocabulary (deferred — delicate ratchet-guarded area); `references/worked_example.md` and `changelog/v1.0.0.0.md` broken-link occurrences (flagged, not changed).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: Three templates mirror the shipped `deep-alignment/behavior_benchmark/` shapes (index sections, scenario JSON machine contract + prose, baseline table + provenance).
- R2: Templates carry sk-doc asset conventions: five-field frontmatter, `{{DOUBLE_BRACE}}` placeholders, HTML usage header with `cp` + validate + normative-contract pointer.
- R3: Naming matches the shipped package: `behavior_benchmark.md`, `scenarios/<PREFIX>-NNN-<slug>.md`, `baselines/claude-baseline.md`; ID-prefix rule documented.
- R4: The shared `framework.md` remains the single normative contract; templates and guide point to it and do not restate the rubric.
- R5: All authored markdown passes the shared sk-doc validator (0 issues).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Three templates + guide + SKILL §8 + README + references/README + changelog all present and validating (0 issues each).
- A future author can `cp` a template and produce a package file matching the deep-alignment shape.
- No change to the shared framework, runner, or any concrete package.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Depends on `system-deep-loop/shared/behavior-benchmark/framework.md` (read-only reference) staying the normative contract. Relative links from templates/guide/SKILL to it verified resolving.
- Advisor vocabulary NOT touched — deferred to avoid a routing-eval ratchet regression while that area is concurrently tuned.
- The shipped `deep-alignment/behavior_benchmark/` files are a concurrent session's work — used read-only as the fidelity reference, never modified.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Family-vs-family boundary (MCP promotion vs behavior) and the "scenario files have no frontmatter" convention resolved during authoring.
<!-- /ANCHOR:questions -->
