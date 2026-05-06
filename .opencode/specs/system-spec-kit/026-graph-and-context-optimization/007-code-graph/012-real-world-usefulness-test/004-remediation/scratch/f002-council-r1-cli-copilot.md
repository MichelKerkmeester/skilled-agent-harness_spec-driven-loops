      && args.forceZeroNodeReset !== true;

  File: code_graph/handlers/scan.ts
  Line: 348
  Before:
    if (zeroNodePromotionBlocked) {
      recordParseDiagnosticsForResults(results);
      const reason = 'zero_node_scan_rejected';
  After:
    Add a new `if (scopeChangePromotionBlocked)` block before the existing zero-node block. It should return `status: "blocked"`, use reason `scope_change_scan_rejected`, record `failedScan` with the active `scopeFingerprint` / `scopeLabel` like `scan.ts:351-362`, preserve `totalNodes: priorStats.totalNodes` like `scan.ts:384`, and avoid `removeFile`, `persistIndexedFileResult`, `setLastGitHead`, `setCodeGraphScope`, and `recordCandidateManifest`.

  File: code_graph/lib/index-scope-policy.ts
  Line: 101
  Before:
    `buildFingerprint()` already includes skills/agents/commands/specs/plugins scope.
  After:
    No new helper is required for F-002. Reuse `scopePolicy.fingerprint`. Risk: `includeGlobs` / `excludeGlobs` are applied later in `scan.ts:318-319` and are not represented in this fingerprint; that is a separate hardening item if arbitrary glob narrowing must also require explicit force.

  File: code_graph/lib/code-graph-db.ts
  Lines: 151-155, 299-321
  Before:
    Scope metadata is stored in `code_graph_metadata`; `getStoredCodeGraphScope()` and `setCodeGraphScope()` already exist.
  After:
    No new column or table. Backward compatibility: if `storedScope.fingerprint` is `null`, do not block; let the next successful scan establish metadata via `scan.ts:496`. Keep `forceZeroNodeReset` for same-scope zero-node resets, and add `forceScopeChange` for explicit scope replacement.

  File: mcp_server/tool-schemas.ts
  Line: 586
  Before:
    forceZeroNodeReset: { type: 'boolean', default: false, description: 'Allow an explicit destructive reset when a full scan produces zero indexed nodes over a populated graph' },
  After:
    Add `forceScopeChange: { type: 'boolean', default: false, description: 'Allow replacing a populated code graph with a full scan from a different scope fingerprint' }`.

  File: mcp_server/schemas/tool-input-schemas.ts
  Lines: 500, 751
  Before:
    forceZeroNodeReset: z.boolean().optional(),
    code_graph_scan: [..., 'forceZeroNodeReset']
  After:
    Add `forceScopeChange: z.boolean().optional()` and include `'forceScopeChange'` in the `code_graph_scan` allowed-key list.

NEW VITEST CASES:

  1. it('blocks scope-mismatched full scan even when the candidate scan has nodes') — Add near `code_graph/tests/code-graph-scan.vitest.ts:1034`, beside the existing zero-node guard tests. Mock prior stats to 56,000 nodes, stored scope fingerprint to `skills=all`, current scan args to default scope, and `indexFiles` to return 5 clean nodes. Expect `status: "blocked"`, `reason: "scope_change_scan_rejected"`, prior `totalNodes` preserved, `recordFailedScan` called, and no `removeFile`, `persistIndexedFileResult`, `setCodeGraphScope`, or `recordCandidateManifest`.

  2. it('allows forceScopeChange to replace a populated graph with a different nonzero scope') — Add immediately after case 1. Same setup, but pass `forceScopeChange:true`. Expect `status: "ok"`, normal full-scan reconciliation to run, and `setCodeGraphScope` called with the default fingerprint.

  3. it('allows a dramatic nonzero shrink when the stored scan scope is unchanged') — Add near the guard tests after case 2. Mock prior stats to 56,000 nodes, stored scope fingerprint equal to the current default fingerprint from `beforeEach` (`code-graph-scan.vitest.ts:215-218`), and `indexFiles` to return 5 clean nodes. Expect promotion succeeds. This proves the plan intentionally rejects Option A’s ratio-only behavior.

  4. it('continues to block same-scope zero-node full scans unless forceZeroNodeReset is true') — Keep the existing zero-node test at `code-graph-scan.vitest.ts:1034-1077` and bypass test at `1079-1095`; adjust only if the new scope guard changes setup requirements.

  5. Tool schema test — Update `mcp_server/tests/tool-input-schema.vitest.ts:535-550` to include `forceScopeChange:true` in the accepted scan controls case.

LIVE MCP VERIFICATION SEQUENCE:

  Step 1: `code_graph_scan({ "incremental": false, "includeSkills": true })`
  Expected: `status:"ok"`, `data.totalNodes` high enough to represent the full skill-inclusive graph, and stored/active scope showing `includeSkills:true`.

  Step 2: `code_graph_status({})`
  Expected: `data.totalNodes` still equals the high populated graph; `data.storedScope.fingerprint` contains `skills=all` (`status.ts:288-310` exposes these fields).

  Step 3: `code_graph_scan({ "incremental": false })`
  Expected: `status:"blocked"`, `reason:"scope_change_scan_rejected"`, `data.totalNodes` still equal to the high prior graph, warning text instructs `forceScopeChange:true`, and no wipe occurs.

  Step 4: `code_graph_status({})`
  Expected: `data.totalNodes` is still the high prior count and `data.storedScope.fingerprint` still contains `skills=all`.

  Step 5: `code_graph_scan({ "incremental": false, "forceScopeChange": true })`
  Expected: `status:"ok"`, default-scope scan promotes intentionally, `data.totalNodes` is the small end-user count, and stored scope now contains `skills=none`.

  Step 6: Restore broad graph if desired: `code_graph_scan({ "incremental": false, "includeSkills": true, "forceScopeChange": true })`
  Expected: `status:"ok"` and high skill-inclusive node count restored.

CONFIDENCE: HIGH
RISKS: Existing scope fingerprints do not include `includeGlobs` / `excludeGlobs` mutations from `scan.ts:318-319`, so this plan fixes the reported includeSkills/default mismatch but not every possible narrowed-scan wipe. Legacy DBs without `scope_fingerprint` will not be blocked on their first post-upgrade full scan; this is intentional for backward compatibility.
ESTIMATED EFFORT: 2-3 hours


Changes   +0 -0
Requests  7.5 Premium (3m 42s)
Tokens    ↑ 664.7k • ↓ 10.0k • 576.0k (cached) • 4.9k (reasoning)
