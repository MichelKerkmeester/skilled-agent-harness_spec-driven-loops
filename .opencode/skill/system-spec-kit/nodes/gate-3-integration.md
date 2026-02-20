---
description: "How Gate 3 asks the user for spec folder routing before any file changes."
---
# Gate 3 Integration

> **See AGENTS.md Section 2** for the complete Gate 3 flow. This skill implements that gate.

When file modification detected, AI MUST ask:

```
**Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip | E) Phase folder
```

| Option          | Description                                                        | Best For                                    |
| --------------- | ------------------------------------------------------------------ | ------------------------------------------- |
| **A) Existing** | Continue in related spec folder                                    | Iterative work, related changes             |
| **B) New**      | Create `specs/###-name/`                                           | New features, unrelated work                |
| **C) Update**   | Add to existing documentation                                      | Extending existing docs                     |
| **D) Skip**     | No spec folder (creates tech debt)                                 | Trivial changes only                        |
| **E) Phase**    | Target a specific phase child (specs/NNN-name/001-phase/)          | Multi-session, complex phased work          |

**Enforcement:** Constitutional-tier memory surfaces automatically via `memory_match_triggers()`.

### Complexity Detection (Option B Flow)

When user selects **B) New**, AI estimates complexity and recommends a level:

1. Estimate LOC, files affected, risk factors
2. Recommend level (1, 2, 3, or 3+) with rationale
3. User accepts or overrides
4. Run `./scripts/spec/create.sh --level N`

### Phase Targeting (Option E Flow)

When user selects **E) Phase folder**, AI targets a specific phase child within an existing spec:

1. Identify parent spec folder (e.g., `specs/003-system-spec-kit/`)
2. List existing phase children (e.g., `001-initial/`, `002-refactor/`)
3. User selects target phase or creates new phase via `/spec_kit:phase`
4. All documentation scoped to the selected phase subfolder