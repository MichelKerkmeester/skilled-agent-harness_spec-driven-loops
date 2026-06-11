---
title: "Provenance Injection: Automated Writers Are Tagged at the Source"
description: "Automated reducer and feedback writers now inject source-kind provenance, so the write-ingress guard's memory_update coverage can rely on accurate source kinds and the publication gate stops excluding machine-authored rows for missing provenance; the same-path reindex-retire and feedback auto-promotion ingress paths remain follow-ons."
trigger_phrases:
  - "022 provenance injection changelog"
  - "automated writers source kind tagged"
  - "write ingress guard provenance"
  - "027 022 shipped"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/022-provenance-injection` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`

### Summary

The write-ingress guard could enforce the constitutional rule that an automated writer never overwrites a manual or constitutional field only if it knew which writes were automated, and the reducer and feedback writers were not tagging themselves. This phase added a source-kind deriver and schema-guarded persisters in a new `write-provenance.ts`, and threaded provenance context through the automated write paths so machine-authored rows carry their source kind. The guard's existing memory_update coverage now operates on accurate source kinds, and the publication gate no longer excludes machine-authored rows for missing provenance; enforcement on the same-path reindex-retire and feedback auto-promotion ingress paths remains a follow-on that this tagging unblocks. The deriver defaults to `human` — the safe default, since a missing tag must never be treated as automated and allowed to overwrite a human edit. Two pre-existing guard-coverage gaps were documented as follow-ons that this tagging unblocks.

### Added

- `lib/storage/write-provenance.ts` — a `SourceKind` deriver and schema-guarded provenance persisters, defaulting to `human`
- `tests/write-provenance.vitest.ts`, `tests/pe-gating-provenance.vitest.ts`, `tests/pe-orchestration-provenance.vitest.ts` — provenance derivation, gating, and orchestration coverage

### Changed

- Threaded provenance context through the automated write paths: `context-server.ts`, `handlers/chunking-orchestrator.ts`, `handlers/memory-crud-update.ts`, `handlers/memory-index.ts`, `handlers/memory-ingest.ts`, `handlers/memory-save.ts`, `handlers/memory-search.ts`, `handlers/pe-gating.ts`, `handlers/save/create-record.ts`, `handlers/save/pe-orchestration.ts`, `handlers/save/reconsolidation-bridge.ts`, `lib/search/auto-promotion.ts`, `lib/storage/reconsolidation.ts`
- The publication gate stops excluding machine-authored rows solely for missing provenance, now that automated writers tag themselves

### Fixed

- Deep-review remediation gated governance on `requiresGovernedIngest()` over the original args and threaded provenance to the persist site rather than into the governed-ingest validation input, correcting a governed-ingest regression the first cut introduced.

### Verification

| Check | Result |
|-------|--------|
| Deep review | resolved after the governed-ingest remediation |
| Provenance suites | PASS: derivation, pe-gating, and pe-orchestration provenance tests |
| Guard and gate regression | PASS: constitutional guard, ingest, search, and promotion suites green |
| Default safety | PASS: an untagged write derives `human`, never automated |

### Files Changed

| File | Action |
|------|--------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/write-provenance.ts` | Created |
| `.opencode/skills/system-spec-kit/mcp_server/tests/write-provenance.vitest.ts` | Created |
| `.opencode/skills/system-spec-kit/mcp_server/tests/pe-gating-provenance.vitest.ts` | Created |
| `.opencode/skills/system-spec-kit/mcp_server/tests/pe-orchestration-provenance.vitest.ts` | Created |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/` (10 handler files: 7 under `handlers/` + 3 under `handlers/save/`) | Modified |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/auto-promotion.ts`, `lib/storage/reconsolidation.ts`, `context-server.ts` | Modified |

### Follow-Ups

- Two pre-existing guard-coverage gaps are unblocked by this tagging and tracked as follow-ons: same-path reindex-retire, and feedback auto-promotion lacking a source_kind ingress check.
