---
title: "Decision Record: sk-doc hub root and shared backbone"
description: "Design decisions for applying the 017 kebab-case filesystem rule to the sk-doc shared backbone while preserving Python exemptions, mandated names, and root facade symlinks."
trigger_phrases:
  - "sk-doc shared naming decisions"
  - "hub facade symlink decision"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded hub shared decisions"
    next_safe_action: "Use decisions when executing the shared rename map"
    blockers: []
    key_files: [".opencode/skills/sk-doc/shared/", ".opencode/skills/sk-doc/scripts/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: sk-doc hub root and shared backbone

<!-- ANCHOR:context -->
## Context

The shared backbone is a live dependency of every sk-doc workflow packet, and the root `scripts/` directory exposes several shared or packet-owned targets through relative symlinks. The baseline contains eleven non-Python snake_case names in shared resources, alongside Python files, metadata, registry names, and keys that the 017 program explicitly exempts. The phase needs a path-level decision that keeps the shared contract stable while making the in-scope filesystem names canonical.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Rename only non-exempt filesystem names

The phase renames the five shared asset names, five shared reference names, and `skill_contract.cjs`. `SKILL.md`, registry/metadata files, Python `.py` names, Python package directories, and content keys remain exact. A semantic manifest, not a global underscore substitution, controls the change.

### DR-002 — Preserve the root scripts facade as a symlink interface

The existing root `scripts/` facade remains at the same public paths. If a target moves, the relative symlink target and executable/mode semantics are updated in place and checked against BASE. The phase never replaces a symlink with a copied implementation.

### DR-003 — Update path values, not identifiers or keys

Only links, imports, source paths, registry path values, and other filesystem references change. JSON/YAML/TOML keys, frontmatter field names, code identifiers, and prose examples that are not paths are outside the rename closure.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- Shared consumers receive stable kebab-case paths and the root facade remains a compatibility boundary.
- The rename manifest must retain explicit exempt rows so a later whole-surface gate cannot reinterpret them as missed work.
- Dynamic path construction and symlink behavior require evidence beyond a filename diff.
- A path-scoped revert can restore the original names and link targets without touching later create-* phases.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- 017 convention policy and scope: `../../../001-convention-policy-and-scope/decision-record.md`.
- Shared surface: `.opencode/skills/sk-doc/shared/`.
- Root facade: `.opencode/skills/sk-doc/scripts/`.
- Parent phase map: `../spec.md`.
<!-- /ANCHOR:references -->
