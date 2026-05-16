---
title: "Implementation Summary: 040 V-rule cross-spec overreach fix"
description: "Verification evidence and final state for the V8 overreach fix."
trigger_phrases:
  - "040 implementation summary"
  - "V8 overreach implementation summary"
importance_tier: "critical"
contextType: "spec"
status: "partial"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/041-v-rule-cross-spec-overreach"
    last_updated_at: "2026-05-14T15:37:00Z"
    last_updated_by: "main-agent"
    recent_action: "V8 source patch and tests pass; build is blocked by EPERM writes in mcp_server/dist"
    next_safe_action: "Fix mcp_server/dist write permissions and rerun npm run build"
    blockers:
      - "`npm run build` exit 2 because TypeScript cannot write existing files under `mcp_server/dist` (EPERM)"
    completion_pct: 90
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/041-v-rule-cross-spec-overreach` |
| **Started** | 2026-05-14 |
| **Completed** | Partial - build blocked by local EPERM writes |
| **Level** | 2 |
| **Predecessor** | 037-llama-cpp-embedding-worker-deep-dive |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

V8 cross-spec contamination detection was narrowed in `.opencode/skills/system-spec-kit/scripts/lib/validate-memory-quality.ts`.

The patch adds an explicit denylist for metric suffixes (`dimension`, `line`, `token`, and related units), rejects candidate packet IDs when they appear in immediate `ADR-` context, derives the current spec folder from the last numbered segment in a nested `/specs/` file path, and raises only the scattered-reference threshold for `decision-record.md`, `handover.md`, and `implementation-summary.md`.

The dominance rule is unchanged. A repeated foreign packet can still fail V8 in ADR-like docs; the relaxation only covers scattered one-off references that those document types legitimately contain.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Single autonomous Codex dispatch on `main`, with no branch and no commit. No MCP tools and no spawned agents were used. Edits were limited to the requested validator source, one new Vitest file, and this 040 packet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Denylist metric suffixes instead of making the regex opaque | Keeps false-positive vocabulary explicit and easy to extend |
| Use match indexes for ADR filtering | Candidate context is needed; `String.match()` cannot tell whether `002-slug` came from `ADR-002-slug` |
| Fix file-path fallback instead of only changing `extractCurrentSpecId()` | `extractCurrentSpecId()` already used the last candidate, but fallback truncated nested paths before it could see 037 |
| Raise only scattered-reference threshold for ADR-like docs | Preserves hard blocking for repeated foreign dominance |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|-------|--------|----------|
| `npm run build` from scripts package | FAIL | Exit 2. `tsc --build` could not write existing files under `.opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/mcp_server/...` due `EPERM: operation not permitted`. No TypeScript diagnostic was reached before the write failures. |
| New V8 overreach Vitest | PASS | `env -u EMBEDDINGS_PROVIDER npx vitest run ../scripts/tests/validate-memory-quality-v8-overreach.vitest.ts`: 1 file passed, 5 tests passed. |
| Existing V8 regex-narrow Vitest | PASS | `env -u EMBEDDINGS_PROVIDER npx vitest run ../scripts/tests/validate-memory-quality-v8-regex-narrow.vitest.ts`: 1 file passed, 3 tests passed. |
| Live validate 037 ADR-003 | PASS | `node .opencode/skills/system-spec-kit/scripts/dist/memory/validate-memory-quality.js .../037-llama-cpp-embedding-worker-deep-dive/decision-record.md`: `QUALITY_GATE_PASS`, `matchesFound: []`, `current_spec:037-llama-cpp-embedding-worker-deep-dive`. |
| Strict validate 040 packet | PASS | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../041-v-rule-cross-spec-overreach --strict`: `RESULT: PASSED`, errors 0, warnings 0. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The metric denylist is intentionally explicit, not exhaustive. New unit-like false positives should add entries with tests.
- ADR filtering handles immediate `ADR-` context. It does not infer all possible prose references to decision numbers.
- Full build verification is partial because local filesystem permissions block writes to existing `mcp_server/dist` files. The validator source tests and live dist validator path both pass.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:binding-trace -->
## Binding Trace

| Field | Value |
|-------|-------|
| AGENT_RECEIVED | yes |
| SPAWN_AGENT_USED | no |
| GATE_3_ANSWER | E-Phase-040 |
| PACKET_PATH | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-migration/041-v-rule-cross-spec-overreach` |
| SOURCE_FILE | `.opencode/skills/system-spec-kit/scripts/lib/validate-memory-quality.ts` |
| TEST_FILE | `.opencode/skills/system-spec-kit/scripts/tests/validate-memory-quality-v8-overreach.vitest.ts` |
| VITEST_RESULT | PASS: new overreach Vitest 5/5; existing regex-narrow Vitest 3/3 |
| LIVE_SAVE_CHECK | PASS: `QUALITY_GATE_PASS`; audit `matchesFound: []`, `current_spec:037-llama-cpp-embedding-worker-deep-dive` |
| STRICT_VALIDATE_040 | PASS: strict validation errors 0 warnings 0 |
| PHASE_5_STATUS | PARTIAL |
<!-- /ANCHOR:binding-trace -->
