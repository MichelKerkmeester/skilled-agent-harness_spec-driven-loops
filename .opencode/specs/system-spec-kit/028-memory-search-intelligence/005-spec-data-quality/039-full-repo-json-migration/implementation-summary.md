---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. The Stage 3 full-repo generated-JSON migration is scaffolded and HARD-GATED on phases 033 through 036, the J1 to J4 generators, being done and tested. It will regenerate every description.json and graph-metadata.json across the whole repo including z_archive and z_future onto the new format through the scoped per-folder generator, gated on a byte-stable second run, a zero-violation phase 036 validator pass and a validate-clean tree, landed as scoped commits batched by track."
trigger_phrases:
  - "full repo json migration"
  - "stage 3 generated json migration"
  - "scoped per folder generator loop"
  - "byte stable second run gate"
  - "regenerate description and graph metadata repo wide"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/039-full-repo-json-migration"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the Stage 3 migration phase at PLANNED"
    next_safe_action: "Confirm J1 to J4 done and tested, then build the enumerator and scoped loop"
    blockers:
      - "HARD-GATED on phases 033 through 036 being done and tested"
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts"
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-039-full-repo-json-migration"
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
| **Spec Folder** | 039-full-repo-json-migration |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. Nothing is built yet. This phase is scaffolded and HARD-GATED on phases 033 through 036, the J1 to J4 generators, being done and tested. The sections below describe the intended Stage 3 migration so the work is ready to start the moment the gate clears.

### Intended scope

The migration will regenerate every `description.json` and every `graph-metadata.json` across the whole repo, including the `z_archive` and `z_future` trees, onto the new format the hardened generators produce, enum-clean `derived.status`, paths prefixed with `.opencode/specs/`, preserved `parent_id` and `children_ids`, and idempotent content-hashed writes. It will be driven by the scoped per-folder generator, the phase 034 backfill `--spec-folder` path, looped over every folder, never the legacy over-reaching tree-walk.

### Intended gate

The migration will be gated on three proofs, a byte-stable second run that yields no diff, zero enum, `parent_id` and path violations under the phase 036 generated-metadata validator, and a clean `validate.sh` tree. The result will land as scoped commits batched by track, with the archive trees as their own batch.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/graph/migrate-generated-json.ts` | Create | The Stage 3 migration driver, enumerate every folder including archives and regenerate each through the scoped per-folder generator with the J1 to J4 flags ON |
| `.opencode/specs/**/description.json` | Modify | Regenerate onto the new format repo-wide including the archive trees |
| `.opencode/specs/**/graph-metadata.json` | Modify | Regenerate onto the new format repo-wide including the archive trees |
| `.opencode/skills/system-spec-kit/scripts/tests/migrate-generated-json.vitest.ts` | Create | Prove full coverage, the scoped-path-only call pattern, a no-diff second run and a zero-violation validator pass |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The intended delivery order is to confirm the J1 to J4 gate clears, build the enumerator over the whole tree including the archives, build the scoped regeneration loop, wire the phase 036 validator as the zero-violation gate, then prove idempotency by a no-diff second run and land scoped commits batched by track.

### Deviations from the plan

- None yet, the phase is at PLANNED.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Drive every regeneration through the scoped `--spec-folder` path only | Reusing the legacy whole-tree walk would re-introduce the unscoped cross-session churn phase 034 removed |
| Cover the `z_archive` and `z_future` trees | Leaving the archives on the legacy format means the validator can never go strict repo-wide |
| Gate on a byte-stable second run | A no-diff re-run is the proof that the phase 035 content-hashed writes settle across the whole repo |
| Land scoped commits batched by track | A repo-wide blob is unreviewable, batching by track keeps each change reviewable and the archives isolated |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet run, the phase is at PLANNED. The intended verification is below.

| Check | Result |
|-------|--------|
| `npx vitest run scripts/tests/migrate-generated-json.vitest.ts` | Pending |
| Migration run plus phase 036 validator over the regenerated tree | Pending, expect zero violations |
| Second migration run, `git diff` | Pending, expect empty |
| `bash scripts/spec/validate.sh <039> --strict` | Exit 0 on the scaffold, see DOCS gate |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Blocked until J1 to J4 land.** The migration cannot run until phases 033 through 036 are done and tested, so the phase is inert at PLANNED.
2. **Regenerates derived JSON only.** The migration rewrites the generated `description.json` and `graph-metadata.json`, it never touches authored doc content.
3. **Graduation is a separate phase.** Flipping the default-OFF flags to default-ON is the Stage 4 follow-on, phase 040, gated on this migration landing first.
<!-- /ANCHOR:limitations -->

---
</content>
