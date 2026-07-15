---
title: "Plan: 002 Deep-Review Remediation for 012 Causal Graph Channel Routing"
description: "Sequenced implementation plan across 4 tiers (T1 release blockers, T2 code, T2 docs, T3 metadata) — 25 task batches dispatched via cli-codex gpt-5.5 reasoning=high service_tier=fast."
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/002-causal-graph-channel-routing/002-fix-deep-review-findings-for-causal-graph-channel-routing"
    last_updated_at: "2026-05-11T11:30:00Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Plan locked; all 21 batches dispatched"
    next_safe_action: "Track batches via tasks.md"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 002 Deep-Review Remediation for 012 Causal Graph Channel Routing

<!-- SPECKIT_LEVEL: 3 -->

---

## 1. ARCHITECTURE OVERVIEW

The 4 tiers run sequentially. Tier 1 (release blockers) MUST land before any Tier 2 work; Tier 2 (code + docs) runs in two parallel sub-streams; Tier 3 (metadata) is independent and runs last to avoid metadata churn during code review.

```
T1 (release blockers, ~1 day, 3 batches)
  └→ T2a (code polish, ~½ day, 9 batches) ─┐
  └→ T2b (doc polish,  ~½ day, 7 batches) ─┴→ T3 (metadata, ~10 min, 1 batch)
                                                  └→ Quality Gate + Verify (T4, ~½ hour)
```

Total: 21 batches of work. Each batch is one cli-codex dispatch.

---

## 2. EXECUTOR SETUP

All implementation dispatched via:

```bash
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="high" \
  -c service_tier="fast" \
  -c approval_policy=never \
  --sandbox workspace-write \
  - < "<prompt-file>"
```

Per memory `feedback_codex_cli_fast_mode.md`, `service_tier="fast"` is required on every invocation. Per `feedback_codex_sandbox_blocks_network.md`, no batches in this packet make outbound network calls, so the default `workspace-write` sandbox is fine.

Per `feedback_cli_dispatch_unreliability.md`, dispatches run **sequentially**, one at a time, with diff verification between each. NO parallel cli-codex invocations.

---

## 3. TIER 1 — RELEASE BLOCKERS (3 batches)

### Batch T1.1 — Cache wiring in `memory-save.ts` (REQ-T1-001 / P1-C-001)

**Files:** `mcp_server/handlers/memory-save.ts`, `mcp_server/lib/search/entity-density.ts` (import only)

**Change:** after the successful single-row insert/update commit branch, call `invalidateEntityDensityCache()`. Place AFTER commit, BEFORE return. Add the import at the top of `memory-save.ts`.

**Acceptance:** `rg -n 'invalidateEntityDensityCache' mcp_server/handlers/memory-save.ts` returns ≥1 match.

### Batch T1.2 — Cache wiring in `memory-bulk-delete.ts` (REQ-T1-002 / P1-C-001)

**Files:** `mcp_server/handlers/memory-bulk-delete.ts`

**Change:** after the bulk delete loop's successful commit, call `invalidateEntityDensityCache()`. Even on partial failure, invalidate the cache (per Edge Case in spec.md §8).

**Acceptance:** `rg -n 'invalidateEntityDensityCache' mcp_server/handlers/memory-bulk-delete.ts` returns ≥1 match.

### Batch T1.3 — Integration test + resource-map P1 fixes

**Files:**
- New: `mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts`
- Modify: `001-deliver-causal-graph-channel-routing-mvp/resource-map.md`

**Change:**
- Write integration test: seed a high-degree row, call `getEntityDensityScore` (warms cache), bulk-delete the row, call again — score reflects deletion WITHOUT 60s TTL wait.
- Fix `resource-map.md:55` playbook 210 → 272 (P1-002).
- Verify `resource-map.md:73`: run `ls -la 001-deliver-causal-graph-channel-routing-mvp/changelog/`; if missing, create the changelog file from `001-deliver-causal-graph-channel-routing-mvp/changelog.md`; either way, mark row status `OK` (P1-003).
- Add missing `routing-telemetry-stress.vitest.ts` row (P2-015).
- Add `scratch/live-smoke-results.md` + `scratch/stress-test-results.md` rows (P2-TR-002).
- Fix Skills 8/9 and total 18/19 count mismatch (P2-TR-005).

**Acceptance:** `vitest run mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts` passes; `rg -n '210-graph-channel-utilization' 001-deliver-causal-graph-channel-routing-mvp/resource-map.md` returns 0 matches; row counts verified.

---

## 4. TIER 2a — CODE POLISH (9 batches)

### Batch T2a.1 — `entity-density.ts` reliability cluster (P2-008, P2-C-001, ADV-003, S7-001, F10-004, P2-021, P2-010, P2-011)

**File:** `mcp_server/lib/search/entity-density.ts`

**Changes:**
- Preserve cached state on transient build failures (do NOT clear `cache` to null in the catch path; only update `lastFetchedAt` to retry later) (P2-008, P2-C-001, ADV-003).
- Add JSDoc to `parseTriggerPhrases` documenting the asymmetric fallback (P2-021).
- Add runtime shape validation on `HighDegreeRow[]` cast OR a documented `// SAFETY: ...` comment (F10-004).
- Add an explicit upper-bound size invariant in the JSDoc / module header for the cache Map (S7-001).
- Add a JSDoc note on `invalidateEntityDensityCache` clarifying it's safe to call from any context; also tighten the export visibility OR document the rationale (P2-011).
- Add a JSDoc note explaining single-threaded JS invariant for concurrency (P2-010 — close-by-doc).

### Batch T2a.2 — `entity-density.vitest.ts` new test (P2-C-002)

**File:** `mcp_server/tests/entity-density.vitest.ts`

**Change:** add a test that:
1. Warms the cache with a successful build.
2. Causes the next refresh to fail (e.g., temporarily nulling the DB or making the SELECT throw).
3. Asserts the cached state is PRESERVED (not discarded) and `lastFetchedAt` is updated so we retry on the next TTL boundary.

### Batch T2a.3 — `query-router.ts` intent dedup (P1-001 / downgraded)

**File:** `mcp_server/lib/search/query-router.ts`

**Change:** in `routeQuery`, compute `classifyIntent(query)` once and pass the result into `shouldPreserveBm25` and `shouldPreserveGraph` as an optional pre-computed parameter. Both functions accept `precomputedIntent?: IntentLabel` and skip re-classification when provided. Keep backward-compat: when not provided, fall back to internal classification.

**Acceptance:** `rg -n 'classifyIntent' mcp_server/lib/search/query-router.ts` returns ≤2 matches (the one in routeQuery + the one internal fallback per helper).

### Batch T2a.4 — `query-router.ts` JSDoc + module header + flag self-gate (P2-003, P2-017, P2-018, P2-019, P2-020)

**File:** `mcp_server/lib/search/query-router.ts`

**Change:**
- Refresh module header comment to mention the bm25 + graph preservation overrides.
- Add JSDoc to `shouldPreserveBm25`, `isGraphChannelPreservationEnabled`, and `shouldPreserveGraph`.
- Decision for P2-003: add a `if (!isGraphChannelPreservationEnabled()) return false;` early-return inside `shouldPreserveGraph` AND keep the call in `routeQuery` for short-circuit. Tests stay green.

### Batch T2a.5 — `query-router.ts` env-flag tightening (ADV-001)

**File:** `mcp_server/lib/search/query-router.ts`

**Change:** in `isGraphChannelPreservationEnabled`, treat `"0"`, `"no"`, `"off"`, `""` (case-insensitive, post-trim) as DISABLED, not enabled. Accept `"1"`, `"true"`, `"yes"`, `"on"` as ENABLED. Unset → ENABLED (default-on). Add tests.

### Batch T2a.6 — `query-router.ts` routingReasons + safeGetDb (P2-009, P2-012, P2-013)

**File:** `mcp_server/lib/search/query-router.ts`

**Change:**
- Fix `routingReasons` label for intent-triggered BM25 preservation: change from `authority-artifact` to a correct label such as `bm25-preserved-by-intent` (P2-009). Update tests.
- Bound `routingReasons` string length when written to disk (clamp each reason to ≤120 chars; the array max already bounded) (P2-012).
- `safeGetDb`: keep the null-return behavior but add a one-time `console.warn` on first failure with the error message; track via a module-private boolean so it never fires twice in one process (P2-013).

### Batch T2a.7 — `routing-telemetry.ts` ChannelName + ring buffer + Set dedup (P2-001, P2-002, F10-005)

**File:** `mcp_server/lib/search/routing-telemetry.ts`

**Change:**
- ChannelName: re-export from `query-router.ts` (preferred) OR add a `// SOURCE OF TRUTH: ../search/query-router.ts:35` comment if dedup risks a circular import (P2-001).
- Rename the JSDoc / module header to "rolling 200-decision window" (NOT "ring buffer") since the impl uses Array.shift (P2-002). Alternative: refactor to a true ring buffer with write-index modulo; decide via complexity-of-change.
- Remove `[...new Set(channels)]` if upstream `enforceMinimumChannels` already dedups; else add a `SAFETY:` comment explaining why the dedup is defensive (F10-005).

### Batch T2a.8 — `memory-crud-health.ts` try/catch (P2-004)

**File:** `mcp_server/handlers/memory-crud-health.ts`

**Change:** wrap `getRoutingTelemetrySnapshot()` call at line 626 in try/catch with the zero-value fallback from spec.md §8 Edge Case. Push a hint message `'Routing telemetry unavailable'` to the response on catch.

### Batch T2a.9 — Test helpers + dedup + withFeatureFlag (P2-022, P2-023, ADV-002)

**Files:**
- New: `mcp_server/tests/__helpers__/test-env.ts`
- Modify: `mcp_server/tests/query-router.vitest.ts`, `mcp_server/tests/routing-telemetry-stress.vitest.ts`

**Change:**
- Create shared `setEnv` / `restoreEnv` helpers in `__helpers__/test-env.ts`.
- Update both test files to import from the shared helper. Delete inline duplicates.
- Decide on `withFeatureFlag`: either use it at the 3 expected sites in `query-router.vitest.ts` OR remove the dead helper. Default: USE it (replaces ad-hoc `setEnv`/`restoreEnv` patterns).
- Dedup the env-flag constant in `query-router.vitest.ts:33,415` (P2-022).

---

## 5. TIER 2b — DOC POLISH (7 batches)

### Batch T2b.1 — `001-deliver-causal-graph-channel-routing-mvp/spec.md` Status (F10-001)

Change Status `Draft` → `Shipped (012/001 closed 2026-05-08; remediation in 012/002)`.

### Batch T2b.2 — `001-deliver-causal-graph-channel-routing-mvp/plan.md` DoD (F10-002)

Tick all DoD checkboxes that are actually done; add a note that the 002 packet is the next-step.

### Batch T2b.3 — `001-deliver-causal-graph-channel-routing-mvp/handover.md` completion (F10-003)

Update `completion_pct: 95` → `100`. Update the most-recent-action line to reference the 2026-05-11 deep-review verdict.

### Batch T2b.4 — `001-deliver-causal-graph-channel-routing-mvp/implementation-summary.md` test counts + Q2 (P2-TR-001, P2-TR-006)

- Fix the internal test-count inconsistency: pick one canonical number (the suite that runs in CI today; cite by `vitest run` output) and update the 3 mention sites (lines 87, 124, and any third drift point).
- Expand Q2 answer (rate band) to a single full paragraph that ties the live smoke result to the SC-001 threshold and the deferred recall/precision pipeline.

### Batch T2b.5 — `001-deliver-causal-graph-channel-routing-mvp/checklist.md` CHK-052 (P2-TR-007)

Append `routing-telemetry-stress.vitest.ts` to the CHK-052 evidence enumeration. Verify no other CHK row has the same omission.

### Batch T2b.6 — `001-deliver-causal-graph-channel-routing-mvp/scratch/live-smoke-results.md` line ref (P2-TR-003)

Fix the stale `shouldPreserveGraph` line reference `167-189` → `183-205`.

### Batch T2b.7 — Feature catalog + playbook (P2-016, P2-TR-004, P2-14)

- `feature_catalog/12-graph-channel-preservation.md`: refresh the 4 stale line-number rows (off by ≥20 lines); add `routing-telemetry-stress.vitest.ts` to the validation table.
- `playbooks/272-routing-telemetry-and-graph-channel-invocation.md`: rate `0.6` → `0.4`; add a classifier-mix note explaining why `understand` intent yields 2/5 not 3/5 graph hits.

---

## 6. TIER 3 — METADATA (1 batch)

### Batch T3.1 — `001-deliver-causal-graph-channel-routing-mvp/graph-metadata.json` key_files dedup (F10-006)

Normalize all `derived.key_files` entries to the same path prefix (e.g., always `.opencode/skills/...` with no leading `specs/`). Drop any duplicates. Final list should be ≤19 unique entries.

---

## 7. TIER 4 — QUALITY GATE + VERIFICATION

### Batch T4.1 — Build + test baseline

```bash
npm run build  # tsc --build, exit 0 required
npm run vitest # full suite; baseline count vs post-002 must regress 0 tests
```

### Batch T4.2 — Strict validate

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-fix-deep-review-findings-for-causal-graph-channel-routing \
  --strict
```

Exit 0 required.

### Batch T4.3 — Synthesis pass

Fill `implementation-summary.md` for 002:
- Per-finding closing status (CLOSED with file:line, or ACCEPTED with rationale).
- Verification table (build, vitest, validate.sh, new integration test results, new env-flag tests).
- Known Limitations section that explicitly lists any P2 accepted-as-is.

### Batch T4.4 — Optional re-review

If time permits: dispatch a single `@review` agent pass over the diff to confirm verdict moves from CONDITIONAL to PASS.

---

## 8. ROLLBACK PLAN

Each batch is a single commit. If any batch breaks the suite:
1. `git revert <commit>` for the failed batch.
2. Diagnose root cause.
3. Re-issue the batch with a tighter prompt.

No batch in this plan crosses Tier 1 ↔ Tier 2 boundaries, so partial completion (e.g., Tier 1 ships, Tier 2 deferred) is a valid stopping point.

---

## 9. EXECUTION CADENCE

- One cli-codex dispatch per batch, sequential, foreground.
- After each batch: read diff, run `npm run build`, then continue.
- Total wall-clock target: ~4–6 hours including verification.
- No /memory:save between batches — single `/memory:save` after T4 closes.

---

<!-- ANCHOR:summary -->
## SUMMARY

T4 finalizes the packet after all 21 Tier 1-3 batches landed. The closure path is docs-only: frontmatter, anchors, checklist tags, final synthesis, validation, and targeted tests.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

- `tsc --noEmit` exits 0.
- Targeted vitest run passes 91 tests across 4 files.
- `validate.sh --strict` exits 0 for this packet.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## ARCHITECTURE

The remediation architecture is batch-based: release blockers first, code/test polish second, doc polish third, metadata cleanup fourth, final synthesis last.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

- Tier 1: cache wiring plus resource-map P1 fixes.
- Tier 2a: source and test polish.
- Tier 2b: docs and traceability polish.
- Tier 3: metadata dedup.
- Tier 4: validation and synthesis.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## TESTING STRATEGY

Use the targeted vitest command for the changed search-routing surface and the integration commit-hook test. Use TypeScript no-emit for compile verification.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

The final packet depends on the completed T1-T3 edits recorded in `implementation-summary.md`. No additional source edits are required in T4.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Rollback is file-scoped: revert this packet's T4 documentation edits if template validation regresses.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

T4 depends on every T1-T3 batch already being landed and verified. It does not reopen 001 source changes.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## EFFORT

T4 is a short docs and validation batch. The implementation work is already complete.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

If strict validation fails, patch only the named packet-doc rule failure and rerun validation.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## DEPENDENCY GRAPH

T1 -> T2a/T2b -> T3 -> T4 final synthesis.
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## CRITICAL PATH

The critical path is strict validation, then targeted vitest verification, then checklist closure evidence.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## MILESTONES

- T1-T3 landed.
- T4 docs patched.
- Strict validation passed.
- Targeted vitest passed.
<!-- /ANCHOR:milestones -->
