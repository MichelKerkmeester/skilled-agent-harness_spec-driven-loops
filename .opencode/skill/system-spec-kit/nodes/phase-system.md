---
description: "Phase decomposition for complex multi-session specifications, splitting large work into parallel child spec folders."
tags: [phase, decomposition, workflow, multi-session]
---
<!-- ANCHOR:overview -->
# Phase System

Phase decomposition breaks complex specifications into parallel child spec folders, each with independent documentation, tracking, and validation.

**Key Concept:** Phases are a behavioral overlay on existing levels, NOT a new level tier. Any level can use phases, but Level 3/3+ most commonly does.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:when-to-use -->
### When to Use

- Phase complexity score >= 25 AND documentation level >= 3
- Estimated files > 15 or LOC > 800
- Multiple independent work streams within one feature
- Multi-session implementation requiring parallel tracking
<!-- /ANCHOR:when-to-use -->

<!-- ANCHOR:folder-structure -->
### Phase Folder Structure

```
specs/###-parent-feature/
├── spec.md                    # Phase Documentation Map
├── 001-foundation/            # Phase 1 (independent spec folder)
│   ├── spec.md                # Back-references parent
│   └── plan.md
├── 002-api-layer/             # Phase 2
└── 003-frontend/              # Phase 3
```
<!-- /ANCHOR:folder-structure -->

<!-- ANCHOR:lifecycle -->
### Phase Lifecycle

1. **Create** - Parent spec with Phase Documentation Map + child folders
2. **Plan** - Each child gets independent plan.md and tasks.md
3. **Implement** - Each phase implemented independently
4. **Validate** - Recursive validation: `validate.sh --recursive`
<!-- /ANCHOR:lifecycle -->

<!-- ANCHOR:scoring -->
### Phase Scoring

> **Note:** This is the 50-point phase complexity score used by `recommend-level.sh --recommend-phases`. It is separate from the 100-point level recommendation score. Both the phase score threshold (>= 25) and level threshold (>= 3) must be met.

| Dimension | Points |
|-----------|--------|
| Architectural complexity | 10 |
| Files > 15 | 10 |
| LOC > 800 | 10 |
| Risk >= 2 | 10 |
| Extreme scale | 10 |

Score 25-34 suggests 2 phases, 35-44 suggests 3, 45+ suggests 4.
<!-- /ANCHOR:scoring -->

<!-- ANCHOR:related -->
## Cross References

- [phase_definitions.md](../references/structure/phase_definitions.md) - Full phase taxonomy, detection scoring, folder structure, lifecycle, and validation rules
- [sub_folder_versioning.md](../references/structure/sub_folder_versioning.md) - Sequential versioning (distinct from parallel phase decomposition)
- [level_specifications.md](../references/templates/level_specifications.md) - Level 1-3+ requirements and phase-aware specifications (Section 10)
<!-- /ANCHOR:related -->
