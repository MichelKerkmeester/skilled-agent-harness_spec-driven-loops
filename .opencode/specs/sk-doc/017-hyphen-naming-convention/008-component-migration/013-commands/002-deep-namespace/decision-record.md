---
title: "Decision Record: deep command generated-output boundary (017 phase 008/013/002)"
description: "Design decisions for separating maintained deep command assets and legacy bodies from generated compiled contract output during the kebab-case filesystem-name migration."
trigger_phrases:
  - "deep generated contract decision"
  - "deep command asset boundary"
  - "compiled contract filename exemption"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/002-deep-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/002-deep-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded deep output boundary decisions"
    next_safe_action: "Execute the maintained deep source closure"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/compiled/README.md"
      - ".opencode/commands/deep/assets/compiled/"
      - ".opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Deep command generated-output boundary

<!-- ANCHOR:context -->
## Context

The deep command surface contains maintained YAML and presentation assets, maintained legacy fallback bodies, and compiled contract files. The compiled README identifies those contracts as generated artifacts and the contract headers record source paths and digests. A mechanical underscore replacement would either rename exempt generated output or leave its source references stale.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Rename maintained sources; preserve generated contract filenames

The 24 workflow/presentation assets and four legacy bodies are maintained filesystem names and receive semantic kebab-case targets. The four `assets/compiled/deep_*.contract.md` files remain exact generated-output exemptions; their generated sections are refreshed only through the supported compiler path.

### DR-002 — Treat generated source paths as derived evidence

The compiler remains the authority for source-digest paths and compiled content. The phase updates maintained path inputs first, then regenerates or validates the contracts and records the new source paths, digests, and manifest result. It does not hand-edit generated sections or change command IDs, contract schema keys, or workflow semantics.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- Maintained deep names reach the kebab-case target without violating the generated-output exemption.
- The phase has a second verification step: filesystem/reference evidence plus compiler freshness evidence.
- A compiler failure blocks the phase rather than being hidden by a manual contract edit.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- `../../../001-convention-policy-and-scope/decision-record.md` defines the generated-output exemption and semantic mapping rule.
- `.opencode/commands/deep/assets/compiled/README.md` defines the generated contract authority boundary.
- `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` owns contract regeneration.
<!-- /ANCHOR:references -->
