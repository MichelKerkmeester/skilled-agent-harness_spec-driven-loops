---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will add a generated-metadata drift gate and one shared synopsis extractor used by both the description and causal_summary fields, with a persisted source_doc_hashes freshness key, all behind a default-OFF flag and a grandfather report mode. No code change has landed."
trigger_phrases:
  - "generated metadata drift gate"
  - "shared synopsis extractor"
  - "derive packet synopsis"
  - "check generated metadata drift"
  - "source doc hashes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/037-drift-gate-synopsis-extractor"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded planned impl doc for drift gate and shared extractor"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
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
| **Spec Folder** | 037-drift-gate-synopsis-extractor |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Shared synopsis extractor

The phase will introduce one shared `derivePacketSynopsis(specFolder, options)` helper with explicit precedence and field-specific length limits, used for both the `description` field and the `causal_summary` field. Today the two fields are produced by two different extractors, so they apply different precedence and trimming over the same source doc and legitimately diverge even when nothing is stale. Routing both fields through one helper makes them derive from the same precedence over the same source doc, with each field honoring its own length limit, so the short `description` and the longer `causal_summary` describe the same thing. This implements proposal 11 from the 031 generated-JSON quality research.

### Generated-metadata drift gate

The phase will add a `checkGeneratedMetadataDrift(specFolder)` function that re-derives one folder, compares the stored `description` and `causal_summary` against a fresh derivation ignoring volatile timestamps, and returns a drift report. Today there is no persisted proof that a stored synopsis still matches the current docs, and `memory_save` emits only an advisory. The gate is paired with persisting `source_doc_hashes` so a re-derive has a cheap freshness key to compare against, and it is wired as a report-only read into strict validation and dry-run backfill, never as a write side effect. This implements proposal 10 from the same research.

### Guarded rollout

The phase will ship both behaviors behind a default-OFF flag and a grandfather report mode. Many existing folders carry drifted or divergently-extracted synopsis text, so a hard gate flipped on at once would mass-fail them. With the flag OFF the gate reports drift under a grandfather mode without changing the verdict, and only with the flag ON does the gate alter the verdict. The gate reports drift and never writes, so it cannot churn the generated files the 031 research exists to stop churning, and a scoped migration to clean the existing folders is a follow-on decision.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts` | Planned modify | Route the `description` field through the shared `derivePacketSynopsis` helper |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Planned modify | Route the `causal_summary` field through the shared helper, add `checkGeneratedMetadataDrift`, persist `source_doc_hashes` |
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | Planned modify | Wire the drift gate as a report-only read, default-OFF with a grandfather report mode |
| `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` | Planned modify | Surface the drift report in dry-run backfill without mutating the folder |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` | Planned modify | Add the `source_doc_hashes` field to the schema |
| `.opencode/skills/system-spec-kit/scripts/tests/generated-metadata-drift.vitest.ts` | Planned create | Cover drift detection, no-drift, shared-extractor precedence, and grandfather report mode |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned sequence captures the two divergent extractor precedences first, authors the one shared `derivePacketSynopsis` helper, routes both fields through it behind the flag, adds `checkGeneratedMetadataDrift` and the `source_doc_hashes` schema field, then wires the gate as a report-only read into strict validation and dry-run backfill. The drift-detection proof, the no-write proof, the shared-extractor precedence proof, and the grandfather report-mode proof land with the vitest.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship behind a default-OFF flag and a grandfather report mode | Many existing folders carry drifted or divergently-extracted synopsis text, so a hard gate flipped on at once would mass-fail them |
| The gate reports drift and never writes | A re-derive that wrote would churn the generated files the 031 research exists to stop churning |
| One shared `derivePacketSynopsis` for both fields | The two fields use two extractors today, so they diverge from the same source doc, and one helper with field-specific limits makes them agree |
| Persist `source_doc_hashes` as the freshness key | A re-derive needs a cheap first check, so a doc edit changes the hash and the gate skips re-deriving folders whose hashes are unchanged |
| Wire the gate into strict validation and dry-run backfill only | Those are the read surfaces that should surface staleness, and neither should mutate the folder it reads |
| Defer the scoped migration and the hard flip | Cleaning the existing folders and flipping the flag ON is a follow-on decision once the report mode confirms the drift population |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet. The planned gate command is `node generated-metadata-drift.vitest.ts` through the vitest runner and the planned docs gate is `validate.sh --strict`.

| Check | Result |
|-------|--------|
| With the flag OFF a strict run on a drifted folder emits a grandfather report and leaves the verdict unchanged | PLANNED, not yet run |
| `checkGeneratedMetadataDrift` returns drift for a changed folder and no drift for an in-sync folder, writing nothing | PLANNED, not yet run |
| Both fields derive from the one shared extractor with the same precedence and each honors its own length limit | PLANNED, not yet run |
| A doc edit changes the persisted `source_doc_hashes` and the dry-run backfill surfaces the drift without mutating the folder | PLANNED, not yet run |
| The gate fails at import with a clear contract error when the flag is ON but the shared extractor is unavailable | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **Migration deferred.** The existing folders that carry drifted or divergently-extracted synopsis text are not cleaned by this phase, the grandfather report mode reports them until a scoped migration runs.
3. **Hard flip deferred.** Flipping the drift gate to a strict-mode failure stays a follow-on decision until the report mode confirms the drift population is clean.
4. **Hash scope open.** Whether `source_doc_hashes` persists inside `graph-metadata.json` or in a sidecar is unresolved, given the 031 mandate to keep generated JSON from churning on non-source changes.
<!-- /ANCHOR:limitations -->

---
