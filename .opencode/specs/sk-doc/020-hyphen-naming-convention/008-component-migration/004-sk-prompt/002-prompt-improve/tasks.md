---
title: "Tasks: prompt-improve asset and reference names (020 phase 004.002)"
description: "Tasks for phase 002 of the sk-prompt kebab-case program: rename prompt-improve assets and references, close active path consumers, and verify scope."
trigger_phrases:
  - "prompt-improve asset and reference tasks"
  - "sk-prompt phase 002 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/002-prompt-improve"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/002-prompt-improve"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored prompt-improve path-map and reference-closure tasks"
    next_safe_action: "Run T001 against the pinned prompt-improve tree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/prompt-improve/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-improve/README.md"
      - ".opencode/skills/sk-prompt/prompt-improve/assets/"
      - ".opencode/skills/sk-prompt/prompt-improve/references/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The playbook, benchmark, and changelog subtrees are owned by adjacent phases."
---
# Tasks: prompt-improve asset and reference names

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

- [ ] T001 Confirm the phase 001 handoff, pinned BASE, and prompt-improve ownership boundary.
- [ ] T002 [P] Capture the six source paths and exact kebab-case targets under `assets/` and `references/`.
- [ ] T003 Record playbook, benchmark, changelog, tool-mandated, generated, and data-key exclusions.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Rename `assets/format_guide_json.md`, `format_guide_markdown.md`, and `format_guide_yaml.md` to hyphenated names.
- [ ] T005 Rename `references/depth_framework.md`, `design_generation_patterns.md`, and `patterns_evaluation.md` to hyphenated names.
- [ ] T006 Update active `SKILL.md`, `README.md`, router resource-map, and packet-local path references.
- [ ] T007 Preserve framework identifiers, resource keys, JSON/YAML keys, and frontmatter fields while rewriting path values.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Verify: All six asset/reference names are kebab-case — Every source maps to one existing target and no source remains in scope.
- [ ] T009 Verify: Active consumers are closed — Resource maps, Markdown links, and path-valued references resolve with no stale active source name.
- [ ] T010 Verify: Semantics are preserved — Router keys, framework names, and data/frontmatter fields are unchanged.
- [ ] T011 Verify: Scope is clean — No playbook, benchmark, changelog, generated, tool-mandated, Python, or package-directory path moved.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (path/reference checks and central validation as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
