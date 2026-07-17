---
title: "Checklist: 040 V-rule cross-spec overreach fix"
description: "Acceptance checklist for the 040 V8 overreach fix, with canonical Level-2 sections."
trigger_phrases:
  - "040 checklist"
  - "V8 overreach checklist"
importance_tier: "critical"
contextType: "spec"
status: "partial"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/041-v-rule-cross-spec-overreach"
    last_updated_at: "2026-05-14T15:37:00Z"
    last_updated_by: "main-agent"
    recent_action: "Recorded verification evidence; build remains blocked by EPERM writes"
    next_safe_action: "Fix dist write permissions and rerun build"
    completion_pct: 90
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: 040 V-rule cross-spec overreach fix

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| [P0] | Hard blocker | Cannot claim code behavior without completion |
| [P1] | Required | Must complete or document blocker |
| [P2] | Optional | Can defer with documented reason |

Evidence column conventions: command exit code, test count, stdout summary, or file path.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Gate 3 answer captured as 040 phase folder
  - Evidence: User pre-bound `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/041-v-rule-cross-spec-overreach/`.
- [x] CHK-002 [P0] Source read before edit
  - Evidence: `validate-memory-quality.ts` V8 helpers and rule body inspected.
- [x] CHK-003 [P0] Existing V8 test read before adding new coverage
  - Evidence: `validate-memory-quality-v8-regex-narrow.vitest.ts` inspected.
- [x] CHK-004 [P1] 037 Level-2 doc shape mirrored
  - Evidence: 040 docs include canonical Level-2 anchors.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Source patch limited to `validate-memory-quality.ts`
  - Evidence: no other source file edited.
- [x] CHK-011 [P0] Metric-unit filtering uses an explicit denylist
  - Evidence: `NUMERIC_PREFIX_NON_SPEC_SUFFIXES` constant.
- [x] CHK-012 [P0] ADR filtering uses local candidate context
  - Evidence: candidate lookback checks immediate `ADR-` prefix.
- [x] CHK-013 [P1] Current-spec fallback scans nested path segments
  - Evidence: `extractSpecFolderFromFilePath()` helper.
- [x] CHK-014 [P1] High-cross-reference doc relaxation is basename-limited
  - Evidence: `HIGH_CROSS_REFERENCE_DOC_BASENAMES` constant.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] New V8 overreach Vitest exists
  - Evidence: `scripts/tests/validate-memory-quality-v8-overreach.vitest.ts`.
- [x] CHK-021 [P0] T040-01 metric labels PASS
  - Evidence: new Vitest PASS 5/5.
- [x] CHK-022 [P0] T040-02 ADR contexts PASS
  - Evidence: new Vitest PASS 5/5.
- [x] CHK-023 [P0] T040-03 nested current_spec PASS
  - Evidence: new Vitest PASS 5/5; audit included `current_spec:037-llama-cpp-embedding-worker-deep-dive`.
- [x] CHK-024 [P0] T040-04 decision-record scatter threshold PASS
  - Evidence: new Vitest PASS 5/5.
- [x] CHK-025 [P0] T040-05 generic scatter preservation PASS
  - Evidence: new Vitest PASS 5/5.
- [x] CHK-026 [P1] Existing V8 regex-narrow regression PASS
  - Evidence: regex-narrow Vitest PASS 3/3.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] `npm run build` exits 0
  - Evidence: FAIL exit 2; `tsc --build` hit EPERM writing existing files under `mcp_server/dist/system-spec-kit/mcp_server/...`.
- [x] CHK-031 [P0] Live 037 ADR-003 validation exits 0
  - Evidence: `QUALITY_GATE_PASS`.
- [x] CHK-032 [P0] V8 no longer reports metric labels as `body-scattered`
  - Evidence: T040-01 PASS; live output `matchesFound: []`.
- [x] CHK-033 [P0] V8 reports `current_spec:037-...` for nested file fallback
  - Evidence: T040-03 PASS and live audit `current_spec:037-llama-cpp-embedding-worker-deep-dive`.
- [x] CHK-034 [P1] Generic scattered-foreign detection remains strict
  - Evidence: T040-04 notes.md and T040-05 plan.md fail V8 as expected.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-050 [P0] No network access used
  - Evidence: local-only commands planned and executed.
- [x] CHK-051 [P0] No MCP tools called
  - Evidence: direct shell and file edits only.
- [x] CHK-052 [P1] V8 hard-block remains enabled
  - Evidence: rule metadata unchanged; generic contamination tests still expect failure.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P0] description.json present
  - Evidence: file created.
- [x] CHK-061 [P0] graph-metadata.json present
  - Evidence: file created with dependency on 037.
- [x] CHK-062 [P0] spec.md documents four overreach modes
  - Evidence: Problem & Purpose section.
- [x] CHK-063 [P1] plan.md documents verification commands
  - Evidence: Testing Strategy section.
- [x] CHK-064 [P1] implementation-summary.md filled with final verification evidence
  - Evidence: verification table updated with PASS/FAIL output.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P0] 040 docs live in the pre-bound phase folder
  - Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/041-v-rule-cross-spec-overreach/`.
- [x] CHK-071 [P0] `description.json` uses specId `040`
  - Evidence: JSON `specId`.
- [x] CHK-072 [P0] `graph-metadata.json` packet_id uses full nested path
  - Evidence: JSON `packet_id`.
- [x] CHK-073 [P1] Test file lives under `scripts/tests`
  - Evidence: `validate-memory-quality-v8-overreach.vitest.ts`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-080 [P0] Strict packet validation exits 0
  - Evidence: `validate.sh ... --strict` PASS, errors 0 warnings 0.
- [x] CHK-081 [P0] Final trace values recorded in implementation summary
  - Evidence: `implementation-summary.md > Binding Trace`.
- [x] CHK-082 [P1] Checklist updated with PASS/FAIL evidence
  - Evidence: checked items in this file; CHK-030 remains unchecked with blocker evidence.
<!-- /ANCHOR:summary -->
