# Iteration 002 — Correctness

**Verdict:** CONDITIONAL | **Findings:** P0=0 P1=1 P2=2 | **newFindingsRatio:** 1.0 | **adversarial P0 replays:** 0

## Findings

### [P1] CORR-01 — stale-verification-gate-after-self-heal  (confidence 0.82)
- **[SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:632, 704, 718-730]** · finding_class: `algorithmic`
- **Evidence:**
```
const verificationGate = getVerificationGate(graphDb.getLastGoldVerification());  // line 632 — captured ONCE before scan
...
      await indexWithTimeout(config, AUTO_INDEX_TIMEOUT_MS);  // line 704 — does NOT call setLastGoldVerification
      graphDb.setCodeGraphScope(config.scopePolicy);
...
      const refreshedState = detectState(rootDir);
      return {
        freshness: refreshedState.freshness,  // re-detected → may be 'fresh'
        ...
        verificationGate,  // line 729 — STALE pre-scan value reused
```
- **Why:** `verificationGate` is computed exactly once (line 632) from `getLastGoldVerification()` BEFORE the inline scan. The inline full-scan path (`indexWithTimeout`, line 704) re-parses the codebase but NEVER calls `setLastGoldVerification` — only handlers/scan.ts:772 and handlers/verify.ts:241 do. So if a PRIOR run recorded a failed gold verification, `verificationGate === 'fail'` is captured pre-scan and re-returned at line 729 even after the self-heal re-established a fresh graph. `shouldBlockReadPath` (query.ts:875, context.ts:73, detect-changes.ts:104) then keeps reads BLOCKED via `verificationGate === 'fail'` despite `freshness:'fresh'` and `inlineIndexPerformed:true`. The self-heal cannot clear the gate because the inline path has no gold-verification step. This is false-SAFE in direction (blocks rather than answers wrong) so it is not a P0, but it is a correctness-of-self-heal defect: a successful inline reindex reports `selfHealResult:'ok'` yet reads stay permanently blocked until an explicit code_graph_scan/verify runs, contradicting the auto-establish 'it just works' contract.
- **Fix:** Re-read gold verification AFTER the inline scan completes (recompute `verificationGate` from a fresh `getLastGoldVerification()` in the post-scan return at lines 718-730 and 750-765), or explicitly set verificationGate to 'absent' when inlineIndexPerformed is true and no verification was run inline.

### [P2] CORR-02 — selfHeal-metadata-inconsistency-firstTimeAutoEstablish  (confidence 0.74)
- **[SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:668-676, 726-728]** · finding_class: `instance-only`
- **Evidence:**
```
const firstTimeAutoEstablish = state.freshness === 'empty'
    && allowGuardedInlineFullScan
    && isDefaultEndUserScope(resolveIndexScopePolicy());
...
        ...(state.action === 'full_scan' && allowGuardedInlineFullScan
          ? { ...guardedFullScan, selfHealAttempted: true, selfHealResult: 'ok' as const }
          : {}),
```
- **Why:** After a firstTimeAutoEstablish full scan, the post-scan return (line 726-728) labels the result `selfHealAttempted:true, selfHealResult:'ok'` whenever `state.action==='full_scan' && allowGuardedInlineFullScan`. But firstTimeAutoEstablish is establishing a graph for the FIRST time on an empty DB — semantically an initial index, not a 'self-heal' of a degraded graph. The metadata conflates first-time establishment with healing. More materially, `selfHealResult:'ok'` is reported unconditionally based on `state.action`, NOT on the actual `refreshedState.freshness`. If the inline scan produced 0 nodes (default end-user scope finds no end-user code in a .opencode-only working tree), `refreshedState.freshness` is 'empty' again, yet the return still claims `selfHealResult:'ok'` — an inaccurate success signal. The selective_reindex branch (line 751-753) correctly derives selfHealResult from refreshedState; the full_scan branch does not.
- **Fix:** In the full_scan post-scan return derive selfHealResult from refreshedState (e.g. `refreshedState.freshness === 'fresh' ? 'ok' : 'failed'`) as the selective branch already does at lines 751-753, instead of hardcoding 'ok'.

### [P2] CORR-03 — cross-consumer-block-message-divergence  (confidence 0.7)
- **[SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:912-913, 920-921]** · finding_class: `cross-consumer`
- **Evidence:**
```
status: 'blocked',
    message: `code_graph_full_scan_required: ${readiness.reason}`,
...
      requiredAction: 'code_graph_scan',
      blockReason: 'full_scan_required',
```
- **Why:** `shouldBlockReadPath` now blocks on ANY non-fresh state including `freshness:'stale', action:'none'` (deleted-files-only) and a FAILED selective_reindex (`action:'selective_reindex'`). But `buildBlockedReadPayload` hardcodes `message: 'code_graph_full_scan_required'`, `blockReason:'full_scan_required'`, and `requiredAction:'code_graph_scan'` regardless of the actual readiness.action. When the real action is `selective_reindex`, `buildFallbackDecision` (query.ts:892) correctly emits `reason:'selective_reindex'` in the nested `fallbackDecision`, yet the top-level `message`/`blockReason` still say `full_scan_required`. detect-changes.ts:256-259 by contrast builds a freshness-accurate blocked message (`fresh-with-failed-verification` vs freshness). Operators routing on the top-level `blockReason` get a misleading full-scan signal for what is actually a selective-reindex or verification-gate block. Not a correctness failure of the gate itself (it blocks correctly) — only the emitted recovery label is imprecise.
- **Fix:** Derive `message`/`blockReason`/`requiredAction` from `readiness.action` and `readiness.verificationGate` (mirror detect-changes.ts:256-259), so a selective_reindex or verification-gate block does not mislabel itself as full_scan_required.

## Coverage
Covered: (1) shouldBlockReadPath false-safe contract in query.ts:865-876 and context.ts:58-74 — verified BOTH gate on `freshness !== 'fresh' || verificationGate === 'fail'`, identical to detect-changes.ts:104 readinessRequiresBlock, so the three read handlers share one refusal contract (correct, no false-OK on stale/deleted-only/failed-selective-reindex states). (2) firstTimeAutoEstablish gate (ensure-ready.ts:668-677) — verified it requires empty graph + allowGuardedInlineFullScan + isDefaultEndUserScope; verified isDefaultEndUserScope (index-scope-policy.ts:56-63) requires all .opencode surfaces excluded, so a maintainer's large scope keeps the explicit gate. Verified storedPolicy is null on first establish (getStoredCodeGraphScope returns null fingerprint → parseIndexScopePolicyFromFingerprint returns null → getDefaultConfig falls back to resolveIndexScopePolicy = default scope), consistent with the guard. (3) Post-scan re-detection (detectState at line 718) correctly re-blocks if the scan yields 0 nodes (false-safe). (4) shouldAutoRescan delegation (auto-rescan-policy.ts:106-128) — scope_mismatch and parse_error_backlog block correctly; firstTimeAutoEstablish bypasses it with an explicit {allowed} which is sound since an empty graph has nothing to overwrite. (5) limit clamp (query.ts:1230) `Math.max(1, Math.min(Number(args.limit)||50, 1000))` and maxDepth clamp (1233) are correct and NaN-safe. COULD NOT fully verify at runtime: whether any inline-scan code path indirectly refreshes gold verification (grep shows only scan.ts:772 + verify.ts:241 call setLastGoldVerification, and indexWithTimeout/structural-indexer do not) — CORR-01 rests on that grep, confidence 0.82. Did not execute tests or inspect readiness-contract.ts buildReadinessBlock body beyond confirming it maps freshness→canonicalReadiness/trustState (verificationGate is consumed by the handler-level shouldBlockReadPath, not inside buildReadinessBlock).

Review verdict: CONDITIONAL
