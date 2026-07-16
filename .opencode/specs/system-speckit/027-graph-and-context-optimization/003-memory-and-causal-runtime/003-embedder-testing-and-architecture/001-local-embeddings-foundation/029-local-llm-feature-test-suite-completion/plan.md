---
title: "Plan: local-LLM feature test suite completion [template:level_1/plan.md]"
description: "Plan to implement the missing local-LLM test groups and performance benchmarks from predecessor 028."
trigger_phrases:
  - "local-llm feature test suite completion"
  - "028 missing feature groups"
importance_tier: "important"
contextType: "testing"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/029-local-llm-feature-test-suite-completion"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Authored implementation plan stub"
    next_safe_action: "Implement missing vitest groups and perf benches"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: local-LLM feature test suite completion

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Implement the exact suite shape promised in phase 028, with deterministic mocks where runtime availability would otherwise make tests machine-dependent.

| Phase | Focus | Output |
|-------|-------|--------|
| A | Confirm predecessor evidence and target files | Implementation starts from the cited source lines and current code |
| B | Implement scoped changes | Source and tests updated only for this packet's requirements |
| C | Run focused verification | Unit/integration/perf evidence captured in the packet |
| D | Closeout | Strict-validate packet and update implementation summary |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- All P0 requirements in `spec.md` have direct test or command evidence.
- The focused test command for this packet exits 0.
- No production data, runtime DB, or operator-local config is changed without an explicit operator step.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/029-local-llm-feature-test-suite-completion --strict` exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The suite should live under `mcp_server/tests/local-llm-features/`, split by functional group. Logic tests should mock provider probes and filesystem state; real local-provider tests should use isolated temp dirs and explicit skips for platform-specific runtime dependencies. Benchmarks write JSON into `baselines/` for future comparison.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A - Discovery

1. Re-read predecessor packet and source files named in `spec.md`.
2. Confirm current line numbers before editing.
3. Identify the smallest test surface that proves the change.

### Phase B - Implementation

1. Create one vitest file per missing functional group.
2. Create four benchmark files under `performance/` with deterministic fixture generation.
3. Add suite README with command lines and skip policy.

### Phase C - Verification

1. Run the local-LLM vitest command.
2. Run or dry-run benchmark output path creation.
3. Run strict validation for this packet.

### Phase D - Closeout

1. Update `implementation-summary.md` from PRE-IMPLEMENTATION to the actual result.
2. Run strict validation on this packet.
3. Preserve any operator-side blockers in the summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `npx vitest run tests/local-llm-features` for functional coverage.
- `npx vitest run tests/local-llm-features/performance --run` or repo-equivalent benchmark command for perf artifacts.
- Filesystem cleanup assertion after auto-migration tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Predecessor phase 028 spec rows are the source of truth for group enumeration.
- System-spec-kit mcp_server vitest config and local embedding modules.
- Local model/provider availability for any non-mocked smoke tests.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

1. Remove the new local-llm feature suite files.
2. Delete generated benchmark baselines if they are not useful.
3. Restore this packet to Planned with blocker notes.
<!-- /ANCHOR:rollback -->
