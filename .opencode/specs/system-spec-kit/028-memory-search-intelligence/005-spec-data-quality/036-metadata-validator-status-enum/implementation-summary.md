---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will close derived.status to a shared z.enum, add a first-class GENERATED_METADATA_INTEGRITY rule wired into strict mode behind a grandfather report mode, and stop the parser preserving a legacy bad status. No code change has landed."
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
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/036-metadata-validator-status-enum"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the planned doc set for the enum, rule and re-derive"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/scripts/rules/"
      - ".opencode/skills/system-spec-kit/scripts/rules/validator-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-036-metadata-validator-status-enum"
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
| **Spec Folder** | 036-metadata-validator-status-enum |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Closed status enum at the schema boundary

The phase will add a shared `GRAPH_METADATA_STATUS_VALUES` const and switch `derived.status` in `graph-metadata-schema.ts` from any non-empty string to a `z.enum` over the closed set, and it will change `normalizeDerivedStatus` so its default branch returns an enum value or null rather than the raw normalized string. Today the normalizer returns the raw normalized string at `graph-metadata-parser.ts:179-180` and the Zod schema accepts any non-empty string, so an em-dash prose value becomes a valid status. After the change the schema rejects a value outside the closed set and the normalizer resolves any input to an enum member or null, so prose stops leaking through at the resolver. This implements rec #6 from the 031 research.

### First-class generated-metadata validator

The phase will add a `GENERATED_METADATA_INTEGRITY` rule bridge that validates `description.json` and `graph-metadata.json` through the shared Zod schemas plus the path-prefix and enum invariants, registered in the rule registry as an error under strict mode and behind a grandfather report mode for the first rollout window. Today the `GRAPH_METADATA_SHAPE` and `DESCRIPTION_SHAPE` checks are shallow shell guards run at warning level while the real schemas exist and are not used as a completion gate. After the change strict mode errors on a folder whose generated JSON carries a prose status or a prefixed path, turning the shallow warning into a real gate. This implements rec #9 from the 031 research.

### Stop preserving bad legacy statuses

The phase will change the parser so a missing `implementation-summary.md` preserves an existing status only when it is already an enum value, otherwise re-derives or falls back to `planned` plus a review flag. Today the parser preserves the existing status after a normalization that admits arbitrary strings, so a folder that once carried a prose status keeps carrying it across re-derives. After the change a non-enum legacy status is re-derived on the closed enum rather than preserved. This implements rec #7 from the 031 research.

### Grandfather report mode

Every behavioral fix will ship behind a default-off flag or a grandfather report mode. Existing files carry the prose statuses and prefixed paths the new contract rejects, so the integrity rule and the re-derive path report rather than block under the grandfather window and graduate to error only after a scoped migration, per the 031 research section 5 theme 7.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Planned modify | Add `GRAPH_METADATA_STATUS_VALUES` and switch `derived.status` to a `z.enum` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Planned modify | Return an enum value or null from the normalizer, re-derive a non-enum legacy status |
| `.opencode/skills/system-spec-kit/scripts/rules/` | Planned create | Add the `GENERATED_METADATA_INTEGRITY` rule bridge |
| `.opencode/skills/system-spec-kit/scripts/rules/validator-registry.json` | Planned modify | Register the rule as an error in strict mode behind the grandfather flag |
| `.opencode/skills/system-spec-kit/scripts/tests/` | Planned create | Add the vitest proving the enum close, the verdict and the re-derive behind the flag |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned sequence closes the enum at the schema boundary first, then adds the integrity rule that asserts against the closed enum and the path-prefix invariant, then changes the parser re-derive path, then registers the rule behind the grandfather flag. The verification that an em-dash prose status fails the schema and the normalizer returns null, the verification that a strict run over a prose-status folder errors from the integrity rule while the grandfather arm warns, and the verification that a non-enum legacy status re-derives or falls back to `planned` plus a review flag, all land with the change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Close `derived.status` with a `z.enum` over a shared const | The normalizer returned the raw string and the schema accepted any non-empty string, so prose leaked in, and a shared const keeps the schema, the normalizer, the rule and the parser in agreement |
| Reuse the real Zod schemas in the integrity rule | The shallow shell checks ran as warnings while the real schemas already existed, so the rule bridges to them rather than re-implementing a shape |
| Ship behind a default-off flag or grandfather report mode | Existing files carry the prose statuses and prefixed paths the new contract rejects, so the contract reports under a migration window and graduates to error only after a scoped migration |
| Re-derive a non-enum legacy status rather than preserve it | Preserving an arbitrary string carried prose forward across re-derives, so a non-enum status is re-derived or falls back to `planned` plus a review flag |
| Keep the identity resolver and the merge guard out of scope | Those are separate phases, so this phase asserts against the identity invariants without authoring the resolver |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet. The planned docs gate is `validate.sh --strict` over this folder and the planned code gate is the new `generated-metadata-integrity.vitest.ts`.

| Check | Result |
|-------|--------|
| An em-dash prose status fails schema validation and the normalizer returns null for it | PLANNED, not yet run |
| A strict run over a prose-status or prefixed-path folder errors from the integrity rule, a clean folder passes | PLANNED, not yet run |
| With the grandfather mode on a legacy folder warns and strict passes, with the flag off it errors | PLANNED, not yet run |
| A folder with no `implementation-summary.md` and a prose status re-derives or falls back to `planned` plus a review flag, an enum status is kept | PLANNED, not yet run |
| The schema, the normalizer, the rule and the parser re-derive all read one shared `GRAPH_METADATA_STATUS_VALUES` | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Migration precondition.** The integrity rule and the re-derive path stay gated behind the grandfather report mode until a scoped migration re-stamps the legacy files, so the error arm does not graduate in this phase.
3. **Identity-resolver dependency.** The path-prefix invariant the rule asserts is normalized by a shared identity resolver that is a separate phase, so a prefixed path reports under the grandfather window until that resolver lands.
4. **Open headline question.** Whether the `planned` fallback for a non-enum legacy status sets the review flag in the JSON or only in the validator report is unresolved until implementation.
<!-- /ANCHOR:limitations -->

---
