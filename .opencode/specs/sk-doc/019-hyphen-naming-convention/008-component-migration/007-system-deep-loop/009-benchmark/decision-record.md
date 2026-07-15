---
title: "Decision Record: system-deep-loop benchmark names (017 phase 007/009)"
description: "L2 design decisions for the root benchmark naming phase, including storage-label scope, report/schema protections, generated output handling, and fixture/profile ownership."
trigger_phrases:
  - "system-deep-loop benchmark decisions"
  - "benchmark storage naming decision record"
  - "root benchmark ownership decision"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/009-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/009-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark decisions"
    next_safe_action: "Verify benchmark ownership map"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: System-deep-loop benchmark names

<!-- ANCHOR:context -->
## Context

The root benchmark surface has three underscore-bearing storage-label directories plus baseline and already-kebab report filenames. Deep-improvement owns separate benchmark fixtures and profiles, while the root runner and generated reports consume both kinds of data. The phase needs a storage-only boundary to avoid changing report contracts or duplicating component work.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Rename storage labels only within the root benchmark boundary
The map covers root benchmark storage directories and their path-valued references. Report filenames, report payload keys, schemas, and tool-mandated names retain their exact contracts.

### DR-002 — Preserve generated output and reproducibility contracts
Generated reports and data remain classified as outputs, not renamed by label substitution. The runner, README, baseline, and storage paths are verified together so the same benchmark inputs produce structurally equivalent results after the rename.

### DR-003 — Keep fixture/profile ownership with deep-improvement
Fixtures and profiles under deep-improvement remain outside this phase. Cross-boundary references are checked and recorded, but the root benchmark phase does not edit the component-owned assets.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The phase stays small and reversible: storage labels move with their consumers while report identity remains stable.
- Reproducibility checks must include generated outputs and ownership evidence, not only path existence.
- A cross-phase boundary is explicit, so a stale fixture/profile path is reported to the owning deep-improvement phase rather than repaired here.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Governing convention decisions: ../../../001-convention-policy-and-scope/decision-record.md.
- Phase specification and storage ownership map: spec.md.
<!-- /ANCHOR:references -->
