---
title: "Spec: 022/009 Cascade-Probe Thresholds Env-Driven"
description: "3 inline cascade-probe timing constants in auto-select.ts (DEFAULT_TIMEOUT_MS=2500, DEFAULT_LOCK_STALE_MS=30000, DEFAULT_SLEEP_MS=25) now accept env-var overrides via SPECKIT_CASCADE_PROBE_TIMEOUT_MS / _LOCK_STALE_MS / _SLEEP_MS. Closes 1 P1 multi-site finding."
trigger_phrases: ["022/009 cascade env vars"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/009-cascade-thresholds-env-driven"
    last_updated_at: "2026-05-23T17:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Shipped"
    next_safe_action: "Phase 005 cli-opencode dispatch"
    blockers: []
    key_files: [".opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002291"
      session_id: "016-002-022-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Council estimated 6 thresholds; actual was 3 (DEFAULT_TIMEOUT_MS, DEFAULT_LOCK_STALE_MS, DEFAULT_SLEEP_MS)"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 022/009 Cascade-Probe Thresholds Env-Driven

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Files changed | 1 (auto-select.ts) |
| Findings closed | 1 P1 multi-site |
| Wall-clock | ~5 min |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

3 cascade-probe timing constants were inline literals in auto-select.ts:96-98. Operators couldn't tune the cascade probe behavior (timeout / lock-staleness / sleep interval) without code edits.

Council estimated 6 thresholds based on the original plan; actual investigation found 3 (the plan referenced "wait_ms" / "retry_count" / "hf_timeout" that don't exist in current auto-select.ts).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `parsePositiveInt(value, fallback)` helper for safe env-var parsing.
- Replace 3 module-level `const DEFAULT_*_MS = NNNN` with `parsePositiveInt(process.env.SPECKIT_CASCADE_*, NNNN)`.
- New env vars: `SPECKIT_CASCADE_PROBE_TIMEOUT_MS`, `SPECKIT_CASCADE_LOCK_STALE_MS`, `SPECKIT_CASCADE_SLEEP_MS`.

### Out of Scope
- ENV_REFERENCE.md update — deferred to arc convergence (single batch).
- Existing `context.timeoutMs` / `options.lockStaleMs` / `options.sleepMs` consumer overrides remain unchanged.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Verification |
|---|---|---|
| R1 | 3 env vars referenced in auto-select.ts | `grep SPECKIT_CASCADE_` ≥ 3 hits |
| R2 | parsePositiveInt helper exists | grep |
| R3 | system-spec-kit typecheck:root exit 0 | npm run typecheck:root |
| R4 | Default values preserved (2500, 30000, 25) | inline literal still present as fallback arg |
| R5 | Strict-validate exit 0 | validate.sh --strict |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

R1–R5 pass. 1 P1 multi-site closed.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Main-agent direct. 1 Edit with helper + 3 env-var wiring.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|---|---|
| Bad env var value crashes module init | parsePositiveInt safely falls back when env is unset, non-numeric, or non-positive |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS
None.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Audit: f-iter009-001
- Successor work: arc convergence will add SPECKIT_CASCADE_* rows to ENV_REFERENCE.md alongside SPECKIT_ADVISOR_* from 004b.
<!-- /ANCHOR:cross-links -->

<!-- ANCHOR:nfr -->
## 10. NON-FUNCTIONAL REQUIREMENTS

Defaults preserved (behavior unchanged when env vars unset). Module-load cost: 3 env reads + 3 parseInts.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

- Env var with non-numeric / empty / negative value → falls back to default.
- options.timeoutMs / .lockStaleMs / .sleepMs caller overrides still take precedence (consumer-side override still works as expected).
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY

LEVEL 2 trivial env-var wiring. 1 Edit operation.
<!-- /ANCHOR:complexity -->
