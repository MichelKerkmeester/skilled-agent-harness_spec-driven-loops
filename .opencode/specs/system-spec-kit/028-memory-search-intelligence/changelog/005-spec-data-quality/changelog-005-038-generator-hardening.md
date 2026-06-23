---
title: "Changelog: Generator Hardening [005-spec-data-quality/038-generator-hardening]"
description: "Chronological changelog for the generator hardening phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-22

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/038-generator-hardening` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Shipped three additive hardening behaviors over the already-idempotent graph-metadata generator. A persisted `source_fingerprint` proves the derived fields are fresh, one shared `listPhaseChildren` enumeration keeps the parent classification and the derived `children_ids` from disagreeing, and access and freshness telemetry moved to an index-layer store so a read no longer dirties an unchanged file. All three shipped behind the default-OFF `SPECKIT_GENERATOR_HARDENING` flag with the strict read under the existing grandfather report mode, so flag-off behavior is byte-identical.

### Added

- A persisted optional `source_fingerprint` on `graph-metadata.json`, a sha256 digest over a volatile-ignoring projection of the canonical source docs where every ISO-8601 datetime is normalized to one token, so continuity timestamps never move the fingerprint. The generator computes it from the docs it already collected with no extra tree walk and writes it only when the flag is on.
- A shared `listPhaseChildren` helper in `is-phase-parent.ts` returning each direct spec-leaf-segment child plus a `qualifies` flag.
- An index-layer `access-telemetry.ts` store, one best-effort JSON file next to the runtime database holding `last_accessed_at` and the phase-parent `last_active_child_id`/`last_active_at` pointers, fail-closed on an unwritable store.
- The default-OFF `SPECKIT_GENERATOR_HARDENING` flag and its `isGeneratorHardeningEnabled()` accessor.
- A 15-case vitest at `mcp_server/tests/generator-hardening.vitest.ts` covering all four P0 and two P1 requirements.

### Changed

- Behind the flag both `isPhaseParent` (reads `qualifies`) and `resolveChildrenIds` (maps every entry) resolve through the shared `listPhaseChildren`, so a parent-counted child is never absent from `children_ids`. Flag-off keeps the legacy split detection byte-identical.
- The resume ladder, behind the flag, resolves the last active child from the index-layer store first and falls back to the generated JSON pointer so an un-migrated parent still redirects.
- The strict `source_fingerprint` re-derive-and-compare read was registered in the existing first-class `GENERATED_METADATA_INTEGRITY` validator under the grandfather mode, resolving a missing or mismatched fingerprint to non-blocking `info` by default and to a hard `error` only once grandfather is opted out.
- The optional `source_fingerprint` schema field is tolerant of absence, so a default-world validation is unchanged for every other folder.

### Fixed

- No fixes recorded. This is hardening, not a fix. The generator was already idempotent through the volatile-ignoring compare and the no-op skip.

### Verification

- Idempotent re-derive - PASS, vitest unchanged source docs yield an identical fingerprint and do not dirty the file.
- Source change - PASS, vitest a source-doc body change yields a different fingerprint.
- Child contract - PASS, vitest `isPhaseParent` and `resolveChildrenIds` both resolve through `listPhaseChildren` and agree on a fixture tree.
- Read no longer dirties - PASS, vitest a read leaves the generated JSON byte-identical while the index-layer store updates.
- Resume - PASS, vitest resolves the last active child from the store with JSON fallback.
- Grandfather behavior - PASS, vitest strict over an un-migrated file reports `info` under grandfather and `error` when off.
- Flag-off byte-identical - PASS, vitest derive omits the field and stays byte-identical.
- Schema tolerance - PASS, vitest parses a payload with and without `source_fingerprint`.
- Docs gate - PASS, `validate.sh --strict` over the phase folder exit 0, 0 errors 0 warnings.
- Typecheck - PASS, `tsc --noEmit` 0 errors.
- Regression - PASS, env-reference-drift, identity-resolver-merge-safety, generated-metadata-integrity, graph-metadata-integration/schema, phase-parent-health, resume-ladder, folder-discovery, p0-c-laundering, 176 tests.
- Full phase vitest - PASS, 15 of 15.

### Files Changed

- `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts`: added the default-OFF `SPECKIT_GENERATOR_HARDENING` flag and its accessor.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`: added the fingerprint compute helpers, the flagged fingerprint write, and the flagged `listPhaseChildren` routing in the now-exported `resolveChildrenIds`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`: added the optional `source_fingerprint` field tolerant of absence.
- `.opencode/skills/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts`: added the shared `listPhaseChildren` helper and routed `isPhaseParent` through it behind the flag.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/access-telemetry.ts`: created the index-layer access and freshness store with fail-closed read and write.
- `.opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts`: resolved the freshness pointer from the store first behind the flag with JSON fallback.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts`: added the strict `source_fingerprint` re-derive-and-compare read under the grandfather mode.
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`: documented the new flag plus the sibling-phase flags.
- `.opencode/skills/system-spec-kit/mcp_server/tests/generator-hardening.vitest.ts`: created the 15-case vitest.

### Follow-Ups

- The phase shipped default-OFF, with the canonical freshness write in `generate-context.ts` left in place and a scoped migration named as the graduation step. `SPECKIT_GENERATOR_HARDENING` later GRADUATED to default-ON after the phase 039 migration was re-run with the flag set, which backfilled `source_fingerprint` tree-wide and cleared the missing-fingerprint mass-fail the benchmark measured.
