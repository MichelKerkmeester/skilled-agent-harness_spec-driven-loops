---
title: "Decision Record: system-deep-loop deep-ai-council names (017 phase 007/005)"
description: "L2 design decisions for the deep-ai-council naming phase, including paired catalog/playbook mapping, artifact-state separation, and council parity evidence."
trigger_phrases:
  - "system-deep-loop council decisions"
  - "deep-ai-council naming decision record"
  - "council catalog playbook parity"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/005-deep-ai-council"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/005-deep-ai-council"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored council decisions"
    next_safe_action: "Verify council map parity"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: System-deep-loop deep-ai-council names

<!-- ANCHOR:context -->
## Context

The deep-ai-council component contains 12 underscore-bearing directory families and 89 underscore-bearing files, including paired feature-catalog and manual-playbook resources plus artifact, graph, replay, and state paths. A mechanical rename can make the paired resources disagree or alter serialized council contracts.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Maintain one source-to-target map for paired catalog and playbook trees
The feature-catalog and manual-testing-playbook trees are mapped as one paired set. Each pair receives matching filesystem treatment, while scenario IDs, feature identifiers, and other embedded values remain unchanged unless they are paths.

### DR-002 — Classify council artifacts and state separately from filesystem candidates
Artifact payloads, graph/state files, replay data, schema keys, package manifests, Python .py files/package directories, and tool-mandated names are protected or classified independently. A path label may change; a serialized identity does not change merely because it contains an underscore.

### DR-003 — Require council behavior and persistence parity
Routing, seat/deliberation, persistence, convergence/rollback, and failure handling are verified after the map is applied. Paired resource reachability and artifact/state round trips are blocking evidence.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The paired resource map prevents one council capability from silently losing its catalog or manual verification path.
- Artifact/state handling requires more than a filename scan because path values and serialized identities have different contracts.
- The phase can identify a path-only rename without rewriting council content, preserving the component’s behavioral meaning.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Governing convention decisions: ../../../001-convention-policy-and-scope/decision-record.md.
- Phase specification and paired inventory: spec.md.
<!-- /ANCHOR:references -->
