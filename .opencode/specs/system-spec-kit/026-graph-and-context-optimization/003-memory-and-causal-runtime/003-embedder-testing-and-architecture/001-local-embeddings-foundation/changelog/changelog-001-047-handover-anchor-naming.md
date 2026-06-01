---
title: "Handover Anchor Naming Alignment"
description: "Corrected the handover_state router to target the canonical session-notes anchor. Supporting tests and docs were aligned. The false template-contract blocker produced by V-rule early returns was removed."
trigger_phrases:
  - "handover anchor naming alignment"
  - "session-notes router fix"
  - "session-log anchor mismatch"
  - "handover_state routing correction"
  - "V-rule template-contract blocker"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/047-handover-anchor-naming`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

The `handover_state` router targeted `session-log`, an anchor that does not exist in the handover template or any live handover document. Every routed save to a handover file hit a missing-anchor planner blocker before the save logic could even evaluate the content. A second blocker appeared after the anchor was corrected: the structural validator rejected `append-section` into `session-notes` when existing notes contained tables. A V-rule early return also fabricated an empty `template-contract` blocker that hid the real diagnostic.

All three issues were fixed together. The router now targets `session-notes`, the canonical anchor used by the handover template and existing handover docs. The validator accepts `append-section` into the free-form `session-notes` section regardless of whether existing notes contain tables. The V-rule early return now classifies itself as a quality state rather than a template-contract failure.

### Added

- Session-notes merge-legality regression covering handover notes that contain tables
- `(NEW)` annotation path covering `append-section` into `session-notes` with mixed prose and table content

### Changed

- `DEFAULT_HANDOVER_ANCHOR` in `content-router.ts` changed from `session-log` to `session-notes`
- `spec-doc-structure.ts` validator now treats `session-notes` as a free-form section shape regardless of table presence
- Accepted `routeAs` override conflicts downgraded from hard blockers to auditable warnings
- `memory-save.ts` V-rule early returns reclassified as quality state, no longer produce empty `template-contract` blockers
- `save_workflow.md` updated to document `handover.md::session-notes` as the canonical save target

### Fixed

- `handover_state` planner raised a missing-anchor blocker on every save because the router targeted the nonexistent `session-log` anchor. Now targets `session-notes`.
- `append-section` into `session-notes` was rejected when existing handover notes mixed prose and tables. Validator now accepts the free-form shape.
- V-rule early returns fabricated empty `template-contract` blockers that obscured the real quality diagnostic. The planner response now reflects quality state only.

### Verification

| Check | Result |
|-------|--------|
| Divergence grep for `session-log` in active router surfaces | PASS. No active `session-log` hits remain in router, tests or reference docs. |
| `npx vitest run tests/content-router.vitest.ts tests/intent-routing.vitest.ts tests/spec-doc-structure.vitest.ts` | PASS. 3 files, 50 tests. |
| `npm run typecheck` | PASS. |
| `npm run build` | PASS. Rebuilt runtime `dist/`. |
| Dry-run diagnostic on 014 handover | PARTIAL. Exit 0 and anchor validation lists `session-notes`. `would_pass:false` remains due to the V8 cross-spec-content advisory on the large existing handover, which is a separate issue. |
| Live `routeAs` diagnostic on 014 handover | PASS. Exit 0, `status:"planned"`, `blockers:[]`, `targetAnchorId:"session-notes"`, `mergeMode:"append-section"`. |
| `npx vitest run tests/handler-memory-save.vitest.ts` | FAIL on unrelated fault-injection fixture. Failure is `Invalid embedding dimension: expected 768, got 1024` and is not caused by the handover router change. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/routing/content-router.ts` | Modified | `DEFAULT_HANDOVER_ANCHOR` corrected to `session-notes`. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/content-router.vitest.ts` | Modified | Locks `handover_state` target anchor assertion to `session-notes`. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts` | Modified | Updates recent-anchor fixture to `session-notes`. |
| `.opencode/skills/system-spec-kit/references/memory/save_workflow.md` | Modified | Documents `handover.md::session-notes` as canonical save target. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts` | Modified | Allows `append-section` into `session-notes` with tables. Downgrades accepted override conflicts to warnings. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/spec-doc-structure.vitest.ts` | Modified | Adds regressions for session-notes append legality and accepted route override warnings. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modified | V-rule early returns no longer produce a false `template-contract` blocker. |

### Follow-Ups

- Resolve the 014 handover V8 quality advisory. The dry-run `would_pass:false` persists because the existing 014 handover document is cross-spec-heavy. The live planner route is blocker-free and targets `session-notes`. The V8 advisory is a separate cross-spec-content concern.
- Fix the unrelated fault-injection dimension mismatch in the handler-memory-save test suite. The failure stems from `EMBEDDING_DIM` fixture drift and is not connected to the handover router change.
