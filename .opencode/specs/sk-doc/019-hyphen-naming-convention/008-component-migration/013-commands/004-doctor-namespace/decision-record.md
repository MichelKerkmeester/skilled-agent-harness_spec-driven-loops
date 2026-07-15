---
title: "Decision Record: doctor route and exemption boundary (017 phase 008/013/004)"
description: "Design decisions for preserving the doctor route manifest and Python helper while renaming maintained doctor asset filenames and path-valued route entries."
trigger_phrases:
  - "doctor route manifest decision"
  - "doctor Python exemption"
  - "doctor asset boundary"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands/004-doctor-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands/004-doctor-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded doctor boundary decisions"
    next_safe_action: "Execute the doctor asset and route closure"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/scripts/audit_descriptions.py"
      - ".opencode/commands/doctor/assets/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Doctor route and exemption boundary

<!-- ANCHOR:context -->
## Context

The doctor namespace has maintained asset filenames with underscores, but `_routes.yaml` is the route manifest consumed by the command router and `audit_descriptions.py` is a Python script. The route file also mixes path-valued asset targets with route metadata and keys, so a broad replacement could change the command contract while trying to enforce kebab-case.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Preserve exact and Python names

Keep `.opencode/commands/doctor/_routes.yaml` at its exact name and leave `scripts/audit_descriptions.py` unchanged. Treat the route manifest name as a tool-facing contract and the Python filename as an explicit 017 exemption.

### DR-002 — Rewrite route paths, not route identity

Rename only the 16 maintained asset files. Update route entries and other consumers only when a value is a filesystem path; retain route IDs, YAML keys, command IDs, and workflow semantics exactly.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- Doctor assets reach kebab-case without breaking the router's exact manifest contract or Python import/tool expectations.
- Verification must parse route entries and compare route outcomes, not rely on a filename scan alone.
- Any ambiguous route occurrence blocks the phase until its path-versus-key classification is evidenced.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- `../../../001-convention-policy-and-scope/decision-record.md` defines the Python and tool-mandated exemptions.
- `.opencode/commands/doctor/_routes.yaml` is the route manifest whose path values follow the asset map.
- `.opencode/commands/doctor/scripts/audit_descriptions.py` is the Python filename exemption.
<!-- /ANCHOR:references -->
