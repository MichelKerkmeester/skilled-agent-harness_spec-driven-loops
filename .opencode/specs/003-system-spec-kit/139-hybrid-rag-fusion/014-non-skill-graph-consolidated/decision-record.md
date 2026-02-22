# Decision Record: 014 - Non-Skill-Graph Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Single Active Non-Skill-Graph Child Folder

- **Status**: Accepted
- **Date**: 2026-02-21

### Context

Root coordination documents already reference one merged Workstream A folder, while filesystem state still had multiple active non-skill-graph children.

### Decision

Adopt `014-non-skill-graph-consolidated` as the single active non-skill-graph child folder and archive the prior source folders.

### Consequences

- Active docs are deduplicated to one canonical set.
- Historical evidence remains available in archive paths.
- Root references can resolve consistently to one active folder.
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: Archive Full Source Folders

- **Status**: Accepted
- **Date**: 2026-02-21

### Context

Direct deletion of legacy child folders would remove historical evidence.

### Decision

Move full source folders into `z_archive/non-skill-graph-legacy/` rather than deleting content.

### Consequences

- Complete historical traceability retained.
- Active surface remains clean and deduplicated.
<!-- /ANCHOR:adr-002 -->
