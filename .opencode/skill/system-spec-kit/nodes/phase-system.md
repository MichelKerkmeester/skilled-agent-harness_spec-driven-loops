---
description: "Phase decomposition for complex multi-session specifications, splitting large work into parallel child spec folders."
tags: [phase, decomposition, workflow, multi-session]
---
# Phase System

Phase decomposition breaks complex specifications into parallel child spec folders, each with independent documentation, tracking, and validation.

**Key Concept:** Phases are a behavioral overlay on existing levels, NOT a new level tier. Any level can use phases, but Level 3/3+ most commonly does.

### When to Use

- Complexity score >= 25 AND documentation level >= 3
- Estimated files > 15 or LOC > 800
- Multiple independent work streams within one feature
- Multi-session implementation requiring parallel tracking

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

### Phase Lifecycle

1. **Create** - Parent spec with Phase Documentation Map + child folders
2. **Plan** - Each child gets independent plan.md and tasks.md
3. **Implement** - Each phase implemented independently
4. **Validate** - Recursive validation: `validate.sh --recursive`

### Phase Scoring

| Dimension | Points |
|-----------|--------|
| Architectural complexity | 10 |
| Files > 15 | 10 |
| LOC > 800 | 10 |
| Risk >= 2 | 10 |
| Extreme scale | 10 |

Score 25-34 suggests 2 phases, 35-44 suggests 3, 45+ suggests 4.

**Full documentation:** See [phase_definitions.md](../references/structure/phase_definitions.md), [sub_folder_versioning.md](../references/structure/sub_folder_versioning.md), and [level_specifications.md](../references/templates/level_specifications.md)
