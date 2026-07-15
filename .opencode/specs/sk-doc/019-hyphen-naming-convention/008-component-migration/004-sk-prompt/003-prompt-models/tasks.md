---
title: "Tasks: prompt-models asset and reference names (017 phase 004.003)"
description: "Tasks for phase 003 of the sk-prompt kebab-case program: rename prompt-models assets and references, preserve JSON data contracts, and close active path consumers."
trigger_phrases:
  - "prompt-models asset and reference tasks"
  - "sk-prompt phase 003 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/004-sk-prompt/003-prompt-models"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/004-sk-prompt/003-prompt-models"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored prompt-models path-map and JSON-contract tasks"
    next_safe_action: "Run T001 against the pinned prompt-models tree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/prompt-models/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-models/README.md"
      - ".opencode/skills/sk-prompt/prompt-models/assets/"
      - ".opencode/skills/sk-prompt/prompt-models/references/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Benchmarks/** and changelog/** are outside this phase."
---
# Tasks: prompt-models asset and reference names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the phase 002 handoff, pinned BASE, and prompt-models ownership boundary.
- [ ] T002 [P] Capture the four asset/data source paths and four reference source paths with exact targets.
- [ ] T003 Record JSON key/model snapshots and benchmark, changelog, `_index.md`, Python, package, and tool-name exclusions.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename `assets/cli_prompt_quality_card.md`, `confidence_scoring_rubric.md`, `model_profiles.json`, and `per_model_budgets.json`.
- [ ] T005 Rename `references/context_budget.md`, `output_verification.md`, `pattern_index.md`, and `quota_fallback.md`.
- [ ] T006 Update active `SKILL.md`, `README.md`, model-profile, and reference path values.
- [ ] T007 Preserve all JSON keys, model IDs, identifiers, frontmatter fields, and generated benchmark files.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: All eight asset/reference names are kebab-case — Every source maps to one existing target and no source remains in scope.
- [ ] T009 Verify: Active consumers are closed — Skill, README, model profiles, and references resolve without stale source paths.
- [ ] T010 Verify: Data semantics are preserved — Target JSON parses and key/model snapshots match BASE.
- [ ] T011 Verify: Scope is clean — Benchmark output, changelog history, `_index.md`, Python/package names, and data keys were not renamed.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (path/reference and JSON contract checks as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
