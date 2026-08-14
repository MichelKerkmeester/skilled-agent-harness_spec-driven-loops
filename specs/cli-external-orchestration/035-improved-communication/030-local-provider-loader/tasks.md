---
title: "Tasks: Phase 030 Local Provider Loader"
description: "Planned task breakdown for the shared local-provider loader, the two entry-point wirings, the focused tests, and the package-gate and packet closeout."
trigger_phrases:
  - "local-provider-loader"
  - "tasks"
  - "localProvider loader tasks"
  - "local LLM easy config build"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/030-local-provider-loader"
    last_updated_at: "2026-08-14T18:42:57.776Z"
    last_updated_by: "opencode"
    recent_action: "Completed and verified all local-provider loader tasks."
    next_safe_action: "Consume the loader from operator rollout documentation when the opt-in story is written."
    blockers: []
    key_files:
      - "tasks.md"
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-030-local-provider-loader-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every task has a stated acceptance criterion and observed evidence."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 030 Local Provider Loader

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after dependencies |
| `[B]` | Blocked with a named condition |

**Task format**: `T### [P?] Description (primary surface)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Read the Phase 029 research end to end and freeze the `localProvider` schema and per-kind endpoint defaults (evidence: `029-local-llm-easy-config/research/research.md:36-48`; `src/config/local-provider.ts:80`)
- [x] T002 Inventory the shipped presets, privacy router, transports, reject-only judge, and both entry points (evidence: `src/config/local-provider.ts:126`; `.opencode/plugins/mk-communication-projection.js:225`; `bin/cli-output-wrapper.mjs:111`)
- [x] T003 [P] Freeze the fail-closed rules: absent, malformed, unknown-kind, missing-model, and invalid-endpoint inputs return null (evidence: `test/config/local-provider.test.ts:156`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T004 Author the shared loader module with parse/build/load and re-export it from the package barrel (evidence: `src/config/local-provider.ts:80`; `src/config/index.ts:6`)
- [x] T005 Wire the OpenCode plugin input builder to the loader with the exact-original fallback preserved (evidence: `.opencode/plugins/mk-communication-projection.js:225`)
- [x] T006 Wire the CLI-output wrapper bin to the loader with the byte-exact passthrough preserved (evidence: `bin/cli-output-wrapper.mjs:111`)
- [x] T007 Extend the committed enablement example to document the optional `localProvider` block (evidence: `spec.md:174`; `enablement.local.json.example`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T008 Author the loader unit tests for the valid/malformed/absent matrix (evidence: `test/config/local-provider.test.ts:45`)
- [x] T009 Author the plugin/runtime projection test and the wrapper test (evidence: `test/runtime/local-provider-runtime.test.ts:118`; `test/wrapper/local-provider-wrapper.test.ts:64`)
- [x] T010 Add plugin test-suite cases for the injected-loader and null-loader paths (evidence: `.opencode/plugins/tests/mk-communication-projection.test.cjs:341`)
- [x] T011 Run `npm run check` from the final state until fully green (typecheck + build + all tests + import smoke) [evidence: `Test Files  76 passed (76)`, `Tests  406 passed (406)`; implementation-summary.md:104]
- [x] T012 Author the complete Level-3 packet, including `implementation-summary.md` (evidence: `implementation-summary.md:64`)
- [x] T013 Backfill metadata and run final strict validation (evidence: `validate.sh ... --strict` reports `Errors: 0  Warnings: 0`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements and checklist blockers have observed evidence.
- [x] The loader returns the full wiring for a valid config and null for any absent or malformed input.
- [x] Both entry points call the loader and project when it returns a config, exact-original otherwise.
- [x] `npm run check` ends fully green and Phase 030 strict validation reports zero errors and warnings.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision**: `decision-record.md`
- **Parent packet**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
