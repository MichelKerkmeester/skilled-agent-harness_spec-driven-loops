---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will wire both shape rules to the real zod schemas, flip their severity to error, and delete the dead legacy_grandfathered bypass. No code change has landed."
trigger_phrases:
  - "schema warn to error"
  - "description shape"
  - "graph metadata shape"
  - "legacy grandfathered"
  - "zod schema validation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/004-a4-schema-warn-to-error"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase impl doc for A4 schema warn-to-error scaffold"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-description-shape.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-shape.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-a4-schema-warn-to-error |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Schema-backed shape validation

The phase will replace the hand-rolled inline JSON checks in the two structural shape rules with the real exported zod schemas that already ship beside them. The description rule will route `description.json` through `folderDescriptionSchema` and `formatDescriptionSchemaIssues`, and the graph rule will route `graph-metadata.json` through `graphMetadataSchema` while keeping its phase-parent `last_active_child_id` pointer check. This closes the drift between the validator and the canonical writer, since both will read the same schema contract.

### Error-severity gate with the bypass removed

The phase will flip the registry severity for `DESCRIPTION_SHAPE` and `GRAPH_METADATA_SHAPE` from `warn` to `error`, so a malformed metadata JSON fails strict validation instead of passing with a warning. It will also delete the dead `legacy_grandfathered` strict-mode bypass from `validate.sh`, which the live census counts at zero grandfathered packets, so the strict RESULT stops consulting a dormant escape hatch. The error flip lands only after a dry-run census re-measures the live corpus to zero failing files.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/rules/check-description-shape.sh` | Planned modify | Swap the inline check for a `folderDescriptionSchema` call routed through `formatDescriptionSchemaIssues`, surface every issue as error |
| `.opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-shape.sh` | Planned modify | Swap the inline check for a `graphMetadataSchema` call, keep the pointer check, promote warnings to error |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Planned modify | Set `severity` to `error` for `GRAPH_METADATA_SHAPE` and `DESCRIPTION_SHAPE` |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Planned modify | Delete `detect_legacy_grandfathered`, its call site, and the `LEGACY_GRANDFATHERED` read in the strict RESULT branch |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned rollout follows the four-beat migration discipline. WARN already landed, so the next beats are BACKFILL of the files the new schemas surface, RE-MEASURE of the dry-run census to zero, then the ERROR flip. The regression proof that a corrupted scratch packet exits 2 under `--strict` lands with the flip.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse the exported zod schemas verbatim | The schemas are the canonical writer contract, so reusing them removes validator-writer drift without adding new schema logic |
| Hold the error flip until the census reads zero | An early flip would fail-block legacy files, so the four-beat discipline gates the flip behind a zero failing count |
| Delete the bypass rather than keep it dormant | The live census counts zero grandfathered packets, so the bypass only weakens the strict gate with no benefit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet.

| Check | Result |
|-------|--------|
| `validate.sh --strict` on a valid corpus exits 0 | PLANNED, not yet run |
| Malformed metadata JSON reports an error not a warning | PLANNED, not yet run |
| Corrupted scratch packet exits 2 under `--strict` | PLANNED, not yet run |
| grep of `validate.sh` returns zero `legacy_grandfathered` matches | PLANNED, not yet run |
| Dry-run census re-measures the live corpus to zero failing files | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Backfill precondition.** The parent census counted 11 invalid live-root graph files. The error flip cannot land until those are backfilled and the count reads zero.
3. **Open schema-entry question.** Whether the rule scripts call the zod schema through a thin compiled Node entry or a `tsx` shim is unresolved, pending alignment with the existing `tsx_bin` resolution in `validate.sh`.
<!-- /ANCHOR:limitations -->

---
