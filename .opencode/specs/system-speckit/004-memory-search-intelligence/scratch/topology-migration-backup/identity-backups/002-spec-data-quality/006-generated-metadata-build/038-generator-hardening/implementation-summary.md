---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status COMPLETE. Persisted a graph-metadata source_fingerprint over a volatile-ignoring source-doc projection, unified the phase-child contract behind one shared listPhaseChildren helper, and moved access and freshness telemetry into an index-layer store, all behind the default-off SPECKIT_GENERATOR_HARDENING flag and the existing grandfather report mode. 15/15 vitest passing, validate strict exit 0, typecheck clean."
trigger_phrases:
  - "graph metadata source fingerprint"
  - "phase child contract unify"
  - "access telemetry split"
  - "freshness telemetry split"
  - "generator hardening"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/038-generator-hardening"
    last_updated_at: "2026-07-06T18:49:44.931Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built and verified fingerprint, child unify, telemetry split behind the flag"
    next_safe_action: "Scoped migration to backfill source_fingerprint then graduate the flag"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/access-telemetry.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/generator-hardening.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 038-generator-hardening |
| **Completed** | 2026-06-22, status COMPLETE |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status COMPLETE. All three recommendations shipped behind the default-off `SPECKIT_GENERATOR_HARDENING` flag, with the strict read reporting under the existing `SPECKIT_GENERATED_METADATA_GRANDFATHER` mode. Flag-off behavior is byte-identical to the prior generator.

### Graph-metadata source fingerprint (rec 13)

Added a persisted optional `source_fingerprint` to `graph-metadata.json`, a `sha256:` digest over a volatile-ignoring projection of the canonical source docs: every ISO-8601 datetime is normalized to one token before hashing, so the continuity timestamps the docs carry never move the fingerprint. The generator computes it from the docs it already collected (no extra tree walk) and writes it only when the flag is on, so a flag-off derive omits the field and stays byte-identical. A no-op re-derive yields the same fingerprint (the idempotency compare still skips the write); a source-doc body change yields a different one. The strict read re-derives over the current docs and compares, so a stale `causal_summary`/`description` carried forward without a re-derive surfaces as a fingerprint mismatch. This is hardening, not a fix: graph metadata is already idempotent.

### Unified phase-child contract (rec 13)

Added one shared `listPhaseChildren` helper in `is-phase-parent.ts` returning each direct spec-leaf-segment child plus a `qualifies` flag (carries spec.md or description.json). Behind the flag both `isPhaseParent` (reads `qualifies`) and `resolveChildrenIds` (maps every entry) resolve through it, so the parent classification and the derived `children_ids` can no longer disagree and a parent-counted child is never absent from `children_ids`. Flag-off keeps the legacy split detection byte-identical.

### Access and freshness telemetry split (rec 14)

Added an index-layer `access-telemetry.ts` store, a single best-effort JSON file next to the runtime database holding `last_accessed_at` and the phase-parent `last_active_child_id`/`last_active_at` pointers. A read event records to the store and never touches the generated JSON, so a read no longer dirties an unchanged file. The resume ladder, behind the flag, resolves the last active child from the store first and falls back to the generated JSON pointer so an un-migrated parent still redirects. The store fails closed: an unwritable store leaves the generated file byte-identical rather than dirtying it.

### Rollout gate

`SPECKIT_GENERATOR_HARDENING` is default-off and env-only (never consults the rollout policy). The strict `source_fingerprint` read is registered in the existing first-class `GENERATED_METADATA_INTEGRITY` validator: a missing or mismatched fingerprint resolves to a non-blocking `info` under the default-on grandfather mode and to a hard `error` once grandfather is opted out after a scoped migration. The fingerprint check is itself gated to run only when the flag is on or the field is already present, so a default-world (flag off, no field) validation is unchanged for every other folder.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modified | Added the default-off `SPECKIT_GENERATOR_HARDENING` flag and `isGeneratorHardeningEnabled()` accessor |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Modified | Added `computeSourceFingerprintFromDocs`/`...ForFolder`, the flagged fingerprint write, and the flagged `listPhaseChildren` routing in `resolveChildrenIds` (now exported) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Modified | Added the optional `source_fingerprint` field tolerant of absence |
| `.opencode/skills/system-spec-kit/mcp_server/lib/spec/is-phase-parent.ts` | Modified | Added the shared `listPhaseChildren` helper and routed `isPhaseParent` through it behind the flag |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/access-telemetry.ts` | Created | Index-layer access/freshness store with fail-closed read/write |
| `.opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts` | Modified | Resolve the freshness pointer from the store first behind the flag, JSON fallback |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts` | Modified | Strict `source_fingerprint` re-derive-and-compare read under the grandfather mode |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Documented the new flag plus the sibling-phase flags (drift guard) |
| `.opencode/skills/system-spec-kit/mcp_server/tests/generator-hardening.vitest.ts` | Created | 15-case vitest covering all four P0 and two P1 requirements |

DEVIATIONS from the spec's stated Files to Change:
- The telemetry split did not touch `folder-discovery.ts`: it never emitted `last_accessed_at`. The residual generated-JSON pointer was the parser carry-forward, so the split landed in the new `access-telemetry.ts` plus `resume-ladder.ts`. The parser still carries the JSON pointer for readback; relocating the `generate-context.ts` freshness write is the documented graduation step.
- The strict read was registered inside the existing `lib/validation/generated-metadata-integrity.ts` first-class validator (which `validate.sh` runs and which already owns the grandfather mode), not a new `scripts/rules/` bash check.
- The vitest sits at `mcp_server/tests/` (the path the vitest config include glob covers), not `mcp_server/scripts/tests/` which the config does not include.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered as additive hardening over the already-idempotent generator. The flag and accessor landed first, then the schema field, the fingerprint compute and write, the shared `listPhaseChildren` helper and its two consumers, the index-layer store, the resume store-first read, and the strict validator read. Each behavior is gated so flag-off is byte-identical. The proofs are in `generator-hardening.vitest.ts` (15 cases) and a green `validate.sh --strict` over the phase folder. A concurrent sibling phase (drift gate) edited the same `capability-flags.ts`, `graph-metadata-parser.ts`, and `graph-metadata-schema.ts` during this work; the additive edits coexist (distinct flags and fields) and the Edit tool's stale-write guard prevented clobbering.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat the `source_fingerprint` as hardening not a fix | Graph metadata is already idempotent through `graphMetadataEqualIgnoringVolatile` and the no-op skip, so the fingerprint proves the derived fields are fresh rather than fixing determinism |
| Derive the fingerprint over the volatile-ignoring projection | A fingerprint over the raw payload would change on every timestamp, so it must reuse the idempotency projection or it re-introduces the churn the compare already prevents |
| Unify the child contract behind one `listPhaseChildren` helper | Two separate child-detection paths can disagree, so one shared source keeps the parent classification and `children_ids` aligned |
| Move access and freshness telemetry to the DB or index layer | Storing it in generated JSON dirties the file on reads and resumes, which is the dominant churn symptom, so the generated files should change only on a source or structural change |
| Ship every behavioral change behind a default-off flag and a grandfather report mode | Existing files carry the prose statuses and prefixed paths the new contract rejects, so a strict-by-default rollout would mass-fail un-migrated files |
| Sequence the phase after the 031 P0 fixes | The fingerprint and the child contract assume the identity resolver and the merge-path lineage guard, so this P2 refinement is deferred to a backlog after the root-cause fixes land |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All checks ran. Test gate: `npx vitest run tests/generator-hardening.vitest.ts` from `mcp_server` (15/15 passing). Docs gate: `validate.sh --strict` over the phase folder (exit 0, 0 errors 0 warnings). Typecheck: `tsc --noEmit` 0 errors. Regression: env-reference-drift guard, identity-resolver-merge-safety, generated-metadata-integrity, graph-metadata-integration/schema, phase-parent-health, resume-ladder, folder-discovery, p0-c-laundering (176 tests) all passing.

| Check | Result |
|-------|--------|
| A re-derive on unchanged source docs yields an identical fingerprint and does not dirty the file | PASS (vitest) |
| A source-doc change yields a different fingerprint | PASS (vitest) |
| `isPhaseParent` and `resolveChildrenIds` both resolve through `listPhaseChildren` and agree on a fixture tree | PASS (vitest) |
| A read leaves the generated JSON byte-identical while the access record updates in the index-layer store | PASS (vitest) |
| A resume resolves the last active child from the index-layer store, with JSON fallback | PASS (vitest) |
| A strict run over an un-migrated file reports under the grandfather mode rather than exiting non-zero | PASS (vitest: `info` under grandfather, `error` when off) |
| Flag-off derive omits the field and stays byte-identical | PASS (vitest) |
| Schema parses a payload with and without `source_fingerprint` | PASS (vitest) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Freshness write relocation deferred.** The index-layer store, the read-event recorder, and the resume store-first read shipped, but the canonical freshness *write* in `generate-context.ts` still stamps the JSON pointer. Relocating that write (a scripts-side change that triggers a dist rebuild) is the documented graduation step; the store readback and JSON fallback bridge the transition with no loss of the resume signal.
2. **Default-off until migration.** The flag stays default-off and the strict read stays in grandfather report mode until a scoped migration backfills `source_fingerprint` onto existing files and restamps the legacy shapes. Graduating the flag and opting out of grandfather is the follow-up.
3. **Pre-existing failing test out of scope.** `scripts/tests/phase-parent-pointer.vitest.ts` has one failing case (`leaves non-phase-parent saves ... untouched`) caused by `generate-context.ts:561` reading a missing graph-metadata.json. It reproduces on the committed baseline of `is-phase-parent.ts` (verified by reverting), is unrelated to this phase, and `generate-context.ts` is not in scope.
4. **Unified child pattern is broader under the flag.** With the flag on, `isPhaseParent` adopts the `isSpecLeafSegment` pattern (the one the children list already uses) rather than the stricter legacy `PHASE_CHILD_REGEX`, so an underscore/uppercase leaf child with a spec doc now qualifies. This is intentional unification and is gated behind the default-off flag.
<!-- /ANCHOR:limitations -->

---
