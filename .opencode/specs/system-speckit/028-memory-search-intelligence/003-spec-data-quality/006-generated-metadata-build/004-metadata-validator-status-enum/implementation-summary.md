---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status COMPLETE. Closed derived.status to a shared z.enum, added the first-class GENERATED_METADATA_INTEGRITY validator wired into the validation orchestrator and validate.sh strict behind a grandfather report mode, and stopped the parser preserving a legacy bad status. The 9-case vitest passes and validate.sh --strict on this folder exits 0."
trigger_phrases:
  - "generated metadata validator"
  - "derived status enum boundary"
  - "graph metadata integrity rule"
  - "stop preserving bad statuses"
  - "status enum schema close"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/004-metadata-validator-status-enum"
    last_updated_at: "2026-07-06T18:49:37.297Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped enum, validator and re-derive, all checks green"
    next_safe_action: "Plan the scoped migration to graduate the grandfather flag"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-036-metadata-validator-status-enum"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether the planned fallback sets the review flag in the JSON or only in the report, it sets status_review_required in the graph-metadata JSON"
      - "Whether a prefixed specFolder errors or warns in the grandfather window, it reports non-blocking and errors only when the grandfather flag is off"
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
| **Spec Folder** | 036-metadata-validator-status-enum |
| **Completed** | 2026-06-22, status COMPLETE |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status COMPLETE. The three convergent fixes from the 031 research landed and every check is green.

### Closed status enum at the schema boundary

`graph-metadata-schema.ts` gained a shared `GRAPH_METADATA_STATUS_VALUES` const declaring the closed set `planned`, `draft`, `placeholder`, `in_progress`, `blocked`, `deferred`, `complete`, `unknown`, and `derived.status` switched from `z.string().min(1)` to `z.enum(GRAPH_METADATA_STATUS_VALUES)`. `normalizeDerivedStatus` in `graph-metadata-parser.ts` now reads that shared set and returns an enum value or null from its default branch rather than the raw normalized string, so an em-dash prose value resolves to null instead of leaking through. A tolerant `graphMetadataLoadSchema` keeps the on-disk load path from crashing on a legacy non-enum status, so the value is read and then dropped on the next re-derive rather than blocking the load. This implements rec #6.

### First-class generated-metadata validator

`mcp_server/lib/validation/generated-metadata-integrity.ts` holds the shared `checkGeneratedMetadataIntegrity` that validates `description.json` and `graph-metadata.json` through the strict `graphMetadataSchema` and `perFolderDescriptionSchema` plus a canonical path-prefix invariant and the status enum, and `resolveGeneratedMetadataIntegrity` maps the violations to a status given the rollout mode. The check is wired into the validation orchestrator default path and into `validate.sh` strict via a CLI bridge at `scripts/validation/generated-metadata-integrity.ts`, registered in `scripts/lib/validator-registry.json` as an error in strict mode. This turns the shallow warning-level shell shape check into a real gate and implements rec #9.

### Stop preserving bad legacy statuses

`deriveStatus` now returns a status plus a review flag. A missing `implementation-summary.md` preserves an existing status only when `normalizeDerivedStatus` resolves it to an enum value, otherwise it falls back to `planned` and sets `status_review_required` on the graph metadata, mirroring the existing `parent_id_review_required` field. A non-enum legacy status is no longer carried forward across re-derives. This implements rec #7.

### Grandfather report mode

`SPECKIT_GENERATED_METADATA_GRANDFATHER` gates the rule. Report mode is ON by default, so violations resolve to a non-blocking `info` and strict validation does not fail on a legacy folder during the rollout. An explicit `false`, `0` or `off` graduates the rule to a hard `error`. The non-blocking tier is `info` rather than `warn` because the validation orchestrator and the shell both fail strict on `warn`, so `info` is the only tier that both reports the violation and keeps strict green during the migration window.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Modify | Add `GRAPH_METADATA_STATUS_VALUES`, switch `derived.status` to `z.enum`, add `status_review_required` and `graphMetadataLoadSchema` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modify | Return an enum value or null from the normalizer, re-derive a non-enum legacy status, tolerant load salvage |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts` | Create | The shared integrity check and severity resolver |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Modify | Run the integrity rule on the default validation path |
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modify | Add the grandfather report mode flag |
| `.opencode/skills/system-spec-kit/mcp_server/api/index.ts` | Modify | Export the new schema, check and flag symbols |
| `.opencode/skills/system-spec-kit/scripts/validation/generated-metadata-integrity.ts` | Create | The strict-mode CLI bridge for `validate.sh` |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modify | Register `GENERATED_METADATA_INTEGRITY` as an error strict-only rule |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Modify | Invoke the integrity rule in the strict validators |
| `.opencode/skills/system-spec-kit/mcp_server/tests/generated-metadata-integrity.vitest.ts` | Create | The 9-case vitest |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The enum closed at the schema boundary first, then the normalizer and the parser re-derive read the shared set, then the integrity check bridged the strict schemas and the path-prefix invariant, then the rule wired into the orchestrator default path and the `validate.sh` strict validators behind the grandfather flag. The rule placement deviates from the scaffold, which assumed a shell rule under `scripts/rules/` and a registry at `scripts/rules/validator-registry.json`. The real registry lives at `scripts/lib/validator-registry.json` and the established strict-validator pattern is a TS check under `validation/` invoked by `run_strict_validators`, so the rule follows `continuity-freshness` and `evidence-marker-lint` rather than the shell-rule loop. Both `mcp_server` and `scripts` dist were rebuilt because the orchestrator runs from compiled JS.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Admit single-token lifecycle states in the enum | The goal is to reject prose, not curated states, so `draft`, `placeholder`, `blocked` and `deferred` stay admitted and only multi-word narrative resolves to null |
| Add a tolerant `graphMetadataLoadSchema` for the load path | The strict enum would crash `loadGraphMetadata` on every legacy prose file, so the load reads the raw status and a later re-derive drops it rather than blocking the load |
| Set `status_review_required` in the JSON | A dropped legacy status stays surfaced in the file, mirroring `parent_id_review_required`, rather than living only in a transient report |
| Resolve grandfather violations to `info` not `warn` | Both validation engines fail strict on `warn`, so `info` is the only tier that keeps strict green during the migration window while still recording the violation |
| Follow the strict-validator TS pattern, not a shell rule | The real schemas are TS, so the rule bridges to them through the same pathway as `continuity-freshness` and `evidence-marker-lint` |
| Keep the identity resolver and the merge guard out of scope | Those are separate phases, so this phase asserts against the identity invariants without authoring the resolver |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All checks ran and passed. The code gate is the new vitest and the docs gate is `validate.sh --strict` over this folder.

| Check | Result |
|-------|--------|
| An em-dash prose status fails schema validation and the normalizer returns null for it | PASS, `generated-metadata-integrity.vitest.ts` enum-closure cases |
| A strict run over a prose-status and prefixed-path folder errors from the integrity rule, a clean folder passes | PASS, CLI bridge on a bad fixture reports 3 violations and exits per mode, clean fixture passes |
| With the grandfather mode on a legacy folder reports non-blocking and strict passes, with the flag off it errors | PASS, both arms asserted in the vitest and confirmed via the CLI exit codes |
| A folder with no `implementation-summary.md` and a prose status re-derives to `planned` plus a review flag, an enum status is kept | PASS, the legacy preservation cases in the vitest |
| The schema, the normalizer, the rule and the parser re-derive all read one shared `GRAPH_METADATA_STATUS_VALUES` | PASS, single declaration imported across the four call sites |
| Existing graph-metadata and validation suites no regression | PASS, 98 of 98 across the schema, integration, validation-metadata, laundering, identity-resolver, flags, refresh and lineage suites |
| `validate.sh --strict` on this folder | PASS, exit 0 with `GENERATED_METADATA_INTEGRITY` reporting the clean verdict |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Grandfather window open.** The rule reports non-blocking by default. It graduates to a hard error only after a scoped migration re-stamps the legacy files, which is a separate phase.
2. **Identity-resolver dependency.** The path-prefix invariant the rule asserts is normalized by a shared identity resolver that is a separate phase, so a prefixed path reports under the grandfather window until that resolver lands.
3. **Pre-existing unrelated failure.** `workflow-canonical-save-metadata.vitest.ts` "advances last_save_at (plan-only path)" fails on the baseline as well as after this change, because the idempotency skip suppresses a no-op second write. It is independent of this phase.
4. **Orchestrator rebuild required.** The default validation path runs from compiled JS, so a source change to the schema, parser or orchestrator needs a `mcp_server` dist rebuild to take effect in `validate.sh`.
<!-- /ANCHOR:limitations -->

---
