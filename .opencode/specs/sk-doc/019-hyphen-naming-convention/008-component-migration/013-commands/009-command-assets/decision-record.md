---
title: "Decision Record: command asset residual boundary (017 phase 008/013/009)"
description: "Design decisions for residual ownership, cross-namespace pointer closure, and preservation of generated, tool, and fixture boundaries."
trigger_phrases:
  - "command asset residual decision"
  - "command asset ownership boundary"
  - "cross-namespace pointer decision"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands/009-command-assets"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands/009-command-assets"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded asset residual boundary"
    next_safe_action: "Compare residual rows with sibling maps"
    blockers: []
    key_files:
      - ".opencode/commands/"
      - "008-component-migration/013-commands/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Command asset residual boundary

<!-- ANCHOR:context -->
## Context

The commands surface has direct namespace asset phases, a loose-command phase, and special files whose names or contents are generated, tool-owned, Python-exempt, or intentionally invalid. A final asset pass is necessary for residual references, but it must not create a second owner for files already mapped elsewhere.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — 009 owns residual files only

The sibling maps for phases 001–008 are authoritative for their physical files. Phase 009 may own a file only when it is absent from those maps and the residual inventory records the assignment. Cross-namespace pointer edits may be recorded here but remain attributed to the physical owner’s final target.

### DR-002 — Classify boundaries before rewriting strings

Generated contracts, tool manifests, Python files/package directories, negative fixtures, command IDs, semantic keys, and frozen/history evidence are classified before any text replacement. Their exact names or values remain unchanged unless their owning contract explicitly authorizes a derived refresh.

### DR-003 — Final targets are the only accepted reference destination

Every approved pointer update uses a sibling-pinned or 009-pinned final kebab-case target. Intermediate names, guessed paths, and broad underscore-to-hyphen substitutions are not valid closure evidence.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The phase may legitimately be a no-op for physical renames while still closing residual references.
- The rollup receives an ownership-complete map instead of conflicting rename claims.
- Boundary-specific tests and generated/tool evidence are required alongside ordinary path scans.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- `../../../001-convention-policy-and-scope/decision-record.md` defines canonical names and exemptions.
- Sibling phase maps under `013-commands/001-*` through `008-*` define direct ownership.
- `.opencode/commands/deep/assets/compiled/README.md` and `.opencode/commands/scripts/README.md` document generated and fixture boundaries.
- `010-commands-gate/checklist.md` consumes the final ownership and closure evidence.
<!-- /ANCHOR:references -->
