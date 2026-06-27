---
title: "Changelog: Metadata Validator Status Enum [005-spec-data-quality/006-generated-metadata-build/036-metadata-validator-status-enum]"
description: "Chronological changelog for the metadata validator status enum phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/006-generated-metadata-build/036-metadata-validator-status-enum` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality`

### Summary

Closed `derived.status` to a shared `z.enum`, added the first-class `GENERATED_METADATA_INTEGRITY` validator wired into the validation orchestrator and `validate.sh` strict, and stopped the parser preserving a legacy bad status across re-derives. The rule is gated by `SPECKIT_GENERATED_METADATA_GRANDFATHER`, report-only and non-blocking by default during migration. The 9-case vitest passes and `validate.sh --strict` on this folder exits 0. The grandfather flag was later flipped OFF to a hard strict error, so the rule now graduates enforcing.

### Added

- A shared `GRAPH_METADATA_STATUS_VALUES` const in `graph-metadata-schema.ts` declaring the closed set `planned`, `draft`, `placeholder`, `in_progress`, `blocked`, `deferred`, `complete`, `unknown`, with `derived.status` switched from `z.string().min(1)` to `z.enum`.
- A tolerant `graphMetadataLoadSchema` that keeps the on-disk load path from crashing on a legacy non-enum status, so the value is read and then dropped on the next re-derive.
- `mcp_server/lib/validation/generated-metadata-integrity.ts` holding `checkGeneratedMetadataIntegrity` and `resolveGeneratedMetadataIntegrity`, validating `description.json` and `graph-metadata.json` through the strict schemas plus the canonical path-prefix invariant and the status enum.
- The strict-mode CLI bridge at `scripts/validation/generated-metadata-integrity.ts` for `validate.sh`, registered in `scripts/lib/validator-registry.json` as an error strict-only rule.
- The `SPECKIT_GENERATED_METADATA_GRANDFATHER` report-mode flag and the `status_review_required` field mirroring `parent_id_review_required`.
- `tests/generated-metadata-integrity.vitest.ts`, 9 cases.

### Changed

- `normalizeDerivedStatus` in `graph-metadata-parser.ts` reads the shared set and returns an enum value or null from its default branch, so an em-dash prose value resolves to null instead of leaking through.
- `deriveStatus` returns a status plus a review flag. A missing `implementation-summary.md` preserves an existing status only when it resolves to an enum value, otherwise it falls back to `planned` and sets `status_review_required`. A non-enum legacy status is no longer carried forward.
- The integrity check is wired into the validation orchestrator default path and into `validate.sh` strict via the CLI bridge, turning the shallow warning-level shell shape check into a real gate.
- `SPECKIT_GENERATED_METADATA_GRANDFATHER` resolves violations to a non-blocking `info` while report mode is ON, since both validation engines fail strict on `warn`. An explicit `false`, `0` or `off` graduates the rule to a hard `error`.
- Both `mcp_server` and `scripts` dist rebuilt because the orchestrator runs from compiled JS.

### Fixed

- A non-enum legacy status is no longer preserved across re-derives, closing the path where an em-dash prose status leaked through the normalizer default branch.

### Verification

- An em-dash prose status fails schema validation and the normalizer returns null for it - PASS, `generated-metadata-integrity.vitest.ts` enum-closure cases.
- A strict run over a prose-status and prefixed-path folder errors from the integrity rule and a clean folder passes - PASS, CLI bridge reports 3 violations on the bad fixture, clean fixture passes.
- With grandfather mode on a legacy folder reports non-blocking and strict passes, with the flag off it errors - PASS, both arms asserted in the vitest and confirmed via CLI exit codes.
- A folder with no `implementation-summary.md` and a prose status re-derives to `planned` plus a review flag, an enum status is kept - PASS, vitest legacy-preservation cases.
- Existing graph-metadata and validation suites no regression - PASS, 98 of 98.
- `validate.sh --strict` on this folder - PASS, exit 0 with `GENERATED_METADATA_INTEGRITY` reporting the clean verdict.

### Files Changed

- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`: added `GRAPH_METADATA_STATUS_VALUES`, switched `derived.status` to `z.enum`, added `status_review_required` and `graphMetadataLoadSchema`.
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`: enum-or-null normalizer, re-derive of a non-enum legacy status, tolerant load salvage.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts`: the shared integrity check and severity resolver.
- `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts`: run the integrity rule on the default validation path.
- `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts`: added the grandfather report-mode flag.
- `.opencode/skills/system-spec-kit/mcp_server/api/index.ts`: exported the new schema, check and flag symbols.
- `.opencode/skills/system-spec-kit/scripts/validation/generated-metadata-integrity.ts`: the strict-mode CLI bridge for `validate.sh`.
- `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json`: registered `GENERATED_METADATA_INTEGRITY` as an error strict-only rule.
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`: invoke the integrity rule in the strict validators.
- `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts`: the 9-case vitest.

### Follow-Ups

- `SPECKIT_GENERATED_METADATA_GRANDFATHER` was later flipped OFF to a hard strict error, so the rule now graduates enforcing rather than report-only.
- The scoped migration that restamps the legacy files preceded that graduation.
- The path-prefix invariant the rule asserts depends on the shared identity resolver from a sibling phase, so a prefixed path reported under the grandfather window until that resolver landed.
