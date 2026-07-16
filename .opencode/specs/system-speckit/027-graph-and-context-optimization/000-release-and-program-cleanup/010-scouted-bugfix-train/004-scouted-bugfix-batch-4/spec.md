---
title: "Feature Specification: Scouted Bugfix Batch 4"
description: "Batch 4 of the scouted bugfix train: 11 candidates excluded as policy/migration/unconfirmed; 9 confirmed, implemented, and tested. Fixes span warm-tier savings metric lock, anchor-miss returnedTokens/savingsPercent recompute, formatAgeString NaN guard, shadow promotion zero-delta false-positive, dead ternary in adapter-common, check-graph-metadata-shape last-active basename fallback, cli-gemini auth preflight filesystem probe, cli-codex auth preflight subcommand correction, and token-budget constitutional count/summary reconciliation."
trigger_phrases:
  - "scouted bugfix batch 4"
  - "warm-tier savings metric locked"
  - "anchor-miss returnedTokens zero"
  - "formatAgeString NaN months"
  - "shadow promotion zero-delta"
  - "adapter-common dead ternary"
  - "check-graph-metadata last-active"
  - "cli-gemini auth preflight"
  - "cli-codex auth preflight"
  - "token-budget constitutional count"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/004-scouted-bugfix-batch-4"
    last_updated_at: "2026-06-03T09:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "9 fixes shipped with regression tests; 11 candidates excluded as policy/migration/unconfirmed"
    next_safe_action: "validate --strict and reconcile completion metadata"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/token-metrics.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/utils/format-helpers.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-shape.sh"
      - ".opencode/skills/cli-gemini/SKILL.md"
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-4-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User directive: fix 9 confirmed batch-4 scouted targets; 11 candidates excluded as policy/migration/unconfirmed; each fix ships with a regression test."
---
# Feature Specification: Scouted Bugfix Batch 4

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-03 |
| **Branch** | `137-scouted-bugfix-batch-4` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fourth scout surfaced a new candidate pool and applied the pipeline (scout → gpt-5.5-fast confirm → implement-and-test). Eleven candidates were excluded as out-of-scope (policy changes, migration work, or unconfirmed by deep-dive). The 9 confirmed defects span a structurally-locked warm-tier savings metric, incorrect zero values in the all-anchors-missing branch, a NaN-returning age formatter, a false-positive shadow promotion gate for zero-delta signals, a dead error-classification ternary, a spurious last-active-child check-graph-metadata warning, two broken CLI auth pre-flight checks (gemini and codex), and a token-budget envelope that left `constitutionalCount` and `summary` desynced from survivors after truncation.

### Purpose
Run a verify-first batch fix over the batch-4 candidates: confirm/refute each headline against real code before editing, then fix only the confirmed targets with parallel implement-and-test agents, proving each fix with a regression test before claiming completion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **CONFIRM** each candidate by gpt-5.5-fast deep-dive against real code before editing.
- **EXCLUDE** 11 candidates (policy/migration/unconfirmed): left untouched, out-of-scope.
- **FIX** the 9 confirmed defects across their source + test files.
- **VERIFY** every fix: added regression test per fix; `npm run build` for affected TS servers; `node --check` for affected shell scripts (N/A here); validate.sh --strict 0.

### Out of Scope
- Batches 1, 2, 3 targets (fixed in prior packets).
- The 11 excluded candidates: policy changes, migration work, or unconfirmed by deep-dive — none were edited.
- Daemon recycle / deploy orchestration: handled separately by the orchestrator after commit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/formatters/token-metrics.ts` | Modify | Capture `fullContentTokens` before 150-char truncation; use as WARM baseline (3x kept only as fallback) |
| `mcp_server/handlers/memory-triggers.ts` | Modify | Pass `fullContentTokens` into the formatter |
| `mcp_server/tests/modularization.vitest.ts` | Modify | Regression test for warm-tier savings metric fix |
| `mcp_server/formatters/search-results.ts` | Modify | All-anchors-missing branch: recompute `returnedTokens` + `savingsPercent` from `estimateTokens(content)` |
| `mcp_server/tests/anchor-prefix-matching.vitest.ts` | Modify | Regression test for anchor-miss returnedTokens fix |
| `mcp_server/lib/utils/format-helpers.ts` | Modify | Add `Number.isNaN(timestamp)` guard in `formatAgeString`; return "never" sentinel |
| `mcp_server/tests/search-results-format.vitest.ts` | Modify | Regression test for formatAgeString NaN guard |
| `mcp_server/lib/feedback/shadow-scoring.ts` | Modify | Add `MIN_NDCG_IMPROVEMENT` epsilon; return empty Map when `maxAbsoluteSignalTotal===0` |
| `mcp_server/lib/feedback/shadow-evaluation-runtime.ts` | Modify | Consume the empty-Map guard from shadow-scoring |
| `mcp_server/tests/shadow-scoring-holdout.vitest.ts` | Modify | Regression test for shadow promotion zero-delta guard |
| `mcp_server/matrix_runners/adapter-common.ts` | Modify | Dead ternary "BLOCKED : BLOCKED" → "BLOCKED : FAIL" for non-blocked spawn errors |
| `mcp_server/tests/matrix-adapter-common.vitest.ts` | Modify | Regression test for adapter-common dead-branch fix |
| `scripts/rules/check-graph-metadata-shape.sh` | Modify | Add basename fallback existence test for `derived.last_active_child_id` full packet_id |
| `scripts/tests/check-graph-metadata-shape-last-active-child.sh` | Add | Regression test for check-graph-metadata last-active guard |
| `.opencode/skills/cli-gemini/SKILL.md` | Modify | Auth pre-flight: filesystem probe of `~/.gemini/oauth_creds.json` replacing non-existent `gemini config list` |
| `.opencode/skills/cli-codex/SKILL.md` | Modify | Auth pre-flight: replace `codex auth status` (exit 2) with `codex login status` |
| `mcp_server/context-server.ts` | Modify | After truncation pop loop: recompute `constitutionalCount` from survivors; rebuild `envelope.summary` |
| `mcp_server/tests/token-budget-constitutional-sync.vitest.ts` | Add | Regression test for token-budget count/summary reconciliation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each candidate confirmed/refuted before any edit | gpt-5.5-fast deep-dive per candidate; 9 CONFIRMED, 11 excluded; no edit on an unconfirmed candidate |
| REQ-002 | Excluded candidates are NOT acted on | 11 policy/migration/unconfirmed candidates get no edit |
| REQ-003 | Every fix proven with an added regression test | Each of the 9 fixes has an added or updated regression test that passes |
| REQ-004 | Build passes after all edits | system-spec-kit mcp_server `npm run build` exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Warm-tier metric uses pre-truncation token count | `fullContentTokens` captured before 150-char truncation; 3x kept as fallback; regression test passes |
| REQ-006 | Anchor-miss branch returns accurate metrics | `returnedTokens` and `savingsPercent` recomputed from `estimateTokens(content)`; regression test passes |
| REQ-007 | formatAgeString never returns NaN | `Number.isNaN(timestamp)` guard added; "never" sentinel returned; regression test passes |
| REQ-008 | Shadow gate rejects zero-delta uniform cycles | `MIN_NDCG_IMPROVEMENT` epsilon gate; empty Map returned when `maxAbsoluteSignalTotal===0`; regression test passes |
| REQ-009 | Adapter dead ternary uses correct error class | Non-blocked spawn errors classify as FAIL; regression test passes |
| REQ-010 | check-graph-metadata-shape no spurious WARNING | basename fallback existence test added; regression test passes |
| REQ-011 | CLI auth pre-flights use working commands | cli-gemini uses filesystem probe; cli-codex uses `codex login status`; both ship corrected SKILL.md |
| REQ-012 | Token-budget envelope counts agree with survivors | `constitutionalCount` recomputed and `envelope.summary` rebuilt after pop loop; regression test passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 confirmed candidates fixed; 11 excluded candidates untouched; each fix proven by its added regression test.
- **SC-002**: Comment-hygiene clean (no spec-path / packet-id artifacts in edited source).
- **SC-003**: system-spec-kit `npm run build` exit 0; `validate.sh --strict` Errors 0 for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Acting on a wrong headline | Fixing a non-existent defect | Verify-first deep-dive classified each candidate; only confirmed targets edited |
| Risk | Shadow gate epsilon too large | Suppresses genuine signal improvements | `MIN_NDCG_IMPROVEMENT` set to a small epsilon; real improvements still promote |
| Risk | basename fallback introduces false negatives | Legit child packets missed by the shape check | Fallback uses filesystem existence test, not string heuristics; false-negative rate negligible |
| Dependency | cli-gemini/cli-codex SKILL.md changes | Next CLI dispatch reads the corrected pre-flight | No daemon recycle needed; SKILL.md loaded at dispatch time |
| Dependency | mcp_server build chain | token-metrics + context-server changes compile together | Covered by `npm run build` exit-0 gate |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. L2: NON-FUNCTIONAL REQUIREMENTS

### Correctness
- **NFR-C01**: `token-metrics.ts` must capture `fullContentTokens` BEFORE any 150-char truncation occurs so WARM-tier savings are computed against the actual pre-truncation token count, not a structurally smaller post-truncation baseline.
- **NFR-C02**: `search-results.ts` all-anchors-missing branch must never hard-code `returnedTokens:0` / `savingsPercent:100`; values must be derived from `estimateTokens(content)` mirroring the partial-match branch.
- **NFR-C03**: `shadow-scoring.ts` must return an empty Map (not a uniform-0.5 map) when `maxAbsoluteSignalTotal===0`, preventing zero-delta cycles from being miscounted as improvements.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. L2: EDGE CASES

- `formatAgeString` called with an invalid ISO string → `Number.isNaN(timestamp)` guard fires → returns "never" sentinel (not "NaN months ago").
- `search-results.ts` all-anchors-missing branch on empty content → `estimateTokens("")` returns 0 → `savingsPercent` is 0 (not 100), `returnedTokens` is 0 (correct, not misleading).
- `shadow-scoring.ts` with all zero-signal inputs → `maxAbsoluteSignalTotal===0` → empty Map returned; shadow-evaluation-runtime skips promotion; no uniform-0.5 false-positive.
- `adapter-common.ts` spawn error with code EPIPE or ECONNRESET (non-blocked) → new "BLOCKED : FAIL" branch correctly classifies as FAIL; BLOCKED label reserved for actual blocked outcomes.
- `check-graph-metadata-shape.sh` with `derived.last_active_child_id` set to a full packet_id → basename fallback runs existence test; no spurious WARNING emitted when the child exists.
- `cli-gemini` auth pre-flight when `~/.gemini/oauth_creds.json` is absent → probe returns false → pre-flight correctly reports not authenticated (no exit-2 crash from non-existent subcommand).
- `cli-codex` auth pre-flight → `codex login status` runs without error; old `codex auth status` emitted an unrecognized-subcommand exit-2.
- `context-server.ts` token-budget pop loop removes constitutional entries → `constitutionalCount` recomputed from survivors → `envelope.summary` rebuilt; count and summary now agree with `data.results.length`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 9 fixes across ~18 files (sources + regression tests) in 7 subsystems |
| Risk | 12/25 | Correctness-class fixes; no concurrency changes; shadow gate epsilon is a new constant |
| Research | 12/20 | 9 parallel gpt-5.5-fast confirm deep-dives; 11 exclusions documented |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The 9 confirmed fixes and 11 excluded candidates are fully documented. Scope is frozen.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
