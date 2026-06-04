---
title: "Save-Handler README Doc-Sync (Default-On Async Enrichment)"
description: "Synced handlers/save/README.md to packet 017's shipped behavior: post-insert enrichment is now documented as default-on and async/deferred-by-default, with SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true as the forced-sync escape hatch. Reconsolidation stays opt-in. Docs-only, three surgical edits, no code touched."
trigger_phrases:
  - "save handler readme doc sync"
  - "post-insert enrichment default-on docs"
  - "async deferred enrichment readme"
  - "SPECKIT_POST_INSERT_ENRICHMENT_SYNC"
  - "022-readme-doc-sync"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/022-readme-doc-sync` (Level 1)

### Summary

`handlers/save/README.md` predated packet 017's shipped behavior. It still described post-insert enrichment as "optional" and as a step that ran inline during the save. In the live code, enrichment is default-on and runs async/deferred by default: the save returns immediately with `enrichmentStatus: deferred` (reason `async-background`), and a bounded background scheduler runs the steps after commit. A reader of the README would have formed the wrong mental model of when graph and entity data becomes available.

This packet synced the README to the live code: enrichment is default-on and async/deferred by default, with `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` as the forced-synchronous escape hatch. Before editing, the flag defaults were re-confirmed directly in code, not assumed. Docs-only, three surgical edits, no code touched. Committed as `01d666985c`.

### Added

None. Docs-only sync.

### Changed

- `handlers/save/README.md` section 7 ENTRYPOINTS: the `runPostInsertEnrichment()` row reworded to convey default-on plus async/deferred-by-default plus the SYNC override (no longer says "optional").
- `handlers/save/README.md` section 6 main-flow box: now reads that post-insert enrichment is scheduled async (deferred) by default. The ASCII box was re-padded to 45 codepoints to keep the new two-line content aligned to the existing border.
- `handlers/save/README.md` section 5 KEY FILES `post-insert.ts` row: appended the default-on plus async/deferred-via-background-scheduler clause with the SYNC override.

### Fixed

- The README's stale "optional" and inline framing of post-insert enrichment, which contradicted the default-on async/deferred behavior shipped in packet 017.

### Verification

| Check | Result |
|-------|--------|
| Flag defaults confirmed in live code | PASS (`isPostInsertEnrichmentEnabled()` reads `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` via `isFeatureEnabled`, default TRUE, and `isPostInsertEnrichmentAsync()` = `!isOptInEnabled('SPECKIT_POST_INSERT_ENRICHMENT_SYNC')`, default async) |
| Async wiring confirmed | PASS (`memory-save.ts` calls `scheduleBackgroundEnrichment` plus `buildDeferredEnrichmentResult('async-background')`, bounded via `MAX_BACKGROUND_ENRICHMENTS` plus queue, `setImmediate`) |
| Reconsolidation untouched | PASS (stays opt-in via `SPECKIT_RECONSOLIDATION_ENABLED`) |
| Scope lock | PASS (only `handlers/save/README.md` plus packet docs, with no code, no other READMEs, `enrichment-state.ts` untouched) |
| `validate.sh --strict` | PASS (Exit 0, Errors 0, Warnings 0, all 11 checks green) |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/README.md` | Sections 5, 6, and 7 reworded to default-on async/deferred enrichment with the SYNC override |

### Follow-Ups

- The unlisted `enrichment-state.ts` file is still not documented in this README. That gap is intentionally out of scope here and remains a candidate for a future doc-sync.
- No code or test changes. This packet only re-aligns documentation with already-shipped behavior (packet 017).
