export const meta = {
  name: 'audit-remediation-implement',
  description: 'Implement all P0/P1/P2 audit remediation fixes across 7 file-disjoint clusters + fill child spec docs',
  phases: [{ title: 'Implement', detail: '7 clusters: code (Opus) + docs (Sonnet), disjoint files, parallel' }],
}

const RESULT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['cluster', 'childFolder', 'findings', 'docsWritten', 'selfVerification', 'crossClusterNeeds', 'validateShResult', 'residualRisks'],
  properties: {
    cluster: { type: 'string' },
    childFolder: { type: 'string' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'severity', 'outcome', 'filesChanged', 'testsAddedOrChanged', 'verification', 'notes'],
        properties: {
          id: { type: 'string' },
          severity: { type: 'string' },
          outcome: { type: 'string', enum: ['FIXED', 'FIXED_TEST_ONLY', 'FIXED_DOC_ONLY', 'DEFERRED', 'NOT_NEEDED'] },
          filesChanged: { type: 'array', items: { type: 'string' } },
          testsAddedOrChanged: { type: 'array', items: { type: 'string' } },
          verification: { type: 'string' },
          notes: { type: 'string' },
        },
      },
    },
    docsWritten: { type: 'array', items: { type: 'string' } },
    selfVerification: { type: 'string', description: 'Commands run + results, or "deferred to central"' },
    crossClusterNeeds: { type: 'string' },
    validateShResult: { type: 'string' },
    residualRisks: { type: 'string' },
  },
}

const BASE = '.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation'
const BACKLOG = `${BASE}/scratch/verified-backlog.json`

const COMMON = `You are a senior implementation engineer remediating verified deep-review audit findings. Repo root is cwd.

AUTHORITATIVE SPEC: Read \`${BACKLOG}\` and find the object in result[] where cluster === "<YOUR_CLUSTER>". Each finding's currentLocation/evidence/fix/filesToEdit/verification/risk is your authoritative, already-verified implementation spec. The condensed brief below highlights critical decisions, recalibrations, and sequencing — but the JSON is the source of truth. Re-Read each target file before editing (line numbers may have drifted slightly).

RULES (HARD):
- SCOPE LOCK: change ONLY what each finding's fix requires. No refactoring, no "while we're here", no touching files outside your ownership list.
- COMMENT HYGIENE [HARD BLOCK]: never put spec-folder paths, packet/phase numbers, ADR/REQ/CHK/task/finding ids in CODE comments. Keep the durable WHY; drop perishable labels. (Markdown prose and JSON schema description strings are not code comments, but still avoid gratuitous packet ids.)
- READ FIRST: never edit a file you have not just Read.
- Preserve existing behavior except the defect. Fixes calibrated to the LOCAL single-user threat model — do NOT build new auth/infra; apply the minimal fail-closed change.

STEPS:
1. Read the backlog JSON; extract your cluster's findings.
2. Fill your child spec docs at \`${BASE}/<YOUR_CHILD_FOLDER>/\` — spec.md, plan.md, tasks.md, implementation-summary.md. REPLACE the [bracketed placeholders] with real content derived from your findings. PRESERVE every \`<!-- ANCHOR:* -->\` marker, the \`<!-- SPECKIT_TEMPLATE_SOURCE -->\` and \`<!-- SPECKIT_LEVEL -->\` headers, and the frontmatter \`_memory.continuity\` block structure (keep key_files, session_dedup, etc.). NOTE: frontmatter \`next_safe_action\` MUST stay compact and non-narrative (one short clause, no semicolons) or validate.sh fails. Map each finding to a REQ/task/verification row. spec.md Status -> "In Progress" while you work, "Complete" when done.
3. Implement each fix exactly per its verified spec, in the sequence noted.
4. Author/adjust the named tests.
5. VERIFICATION: see your cluster's verification policy in the brief (self-verify vs defer-to-central).
6. Fill implementation-summary.md with what changed + verification evidence; set spec.md Status -> Complete.
7. Run \`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ${BASE}/<YOUR_CHILD_FOLDER> --strict\` and fix any anchor/placeholder/frontmatter issues until it PASSES (Errors: 0).
8. Return the structured result. outcome=FIXED (code), FIXED_TEST_ONLY (test added, no source change), FIXED_DOC_ONLY (docs), DEFERRED (with reason), NOT_NEEDED (already fixed / misreported — explain).

Be precise and faithful to the verified specs. Do not over-reach.`

const CLUSTERS = {
  'A-deep-loop': {
    child: '001-deep-loop-fanout-reliability', model: undefined,
    brief: `OWN: .opencode/skills/deep-loop-runtime/** and the comment-only fixes in .opencode/skills/system-code-graph/mcp_server/**. Do NOT touch context-server.ts (cluster D owns it).
Findings A1-A7. CRITICAL sequencing: A1 -> A2 -> A4 -> A5 all edit the SAME worker/spawn/buildLineageCommand region of fanout-run.cjs (~lines 320-363); do them in that order. A3 (buildLoopPrompt) and A6 (SKILL.md) and A7 (comments) are independent.
- A1 (P0): in the fanout-run.cjs WORKER, after computing exitCode and timedOut and AFTER the salvage write, if (timedOut || exitCode !== 0) THROW an Error carrying {label,exitCode,timedOut,salvage} instead of returning the success object — so settleItem records it rejected and summary.failed/all_failed -> exit code. Do NOT modify buildPoolSummary/settleItem (shared with the council dispatcher, contract-tested by fanout-pool.vitest.ts).
- A2 (P1): replace the blocking spawnSync in the worker with an async child_process.spawn wrapped in a Promise resolving {status,signal,stdout,error}; preserve timeout (kill+SIGTERM so A1 timedOut still fires), env, maxBuffer 20MB, cwd, and stdin input. Import spawn. Leave the TSX bootstrap spawnSync (~52-66) untouched.
- A3 (P1): thread lineage.iterations into buildLoopPrompt as a max_iterations cap when set; keep timeout sizing as backstop.
- A4 (P1): cli-codex branch — omit the \`-c service_tier=...\` pair when serviceTier is falsy (do not emit 'default').
- A5 (P2): default review lineages to read-only ONLY IF review subprocesses do not need to write iteration artifacts into lineageDir — CHECK how review writes happen first; if they write iteration files, keep workspace-write and instead document the gap (do not break review writes). Minimal safe fix; if uncertain, scope-lock to a documented note rather than a behavior change.
- A6 (P2): SKILL.md:~249 correct the scripts/ file count + mention fan-out scripts.
- A7 (P2): strip phase/ADR/packet labels from code comments — code-graph-tools.ts (~14-16,33-35), core/config.ts (~19 'ADR-002/004/005'), fanout-pool.cjs (BOTH ~8 and ~232 'packet-122'). Keep durable WHY.
VERIFY (self-run, independent tree): from .opencode/skills/system-spec-kit/mcp_server run \`npx vitest run ../../deep-loop-runtime/tests/unit/fanout-run.vitest.ts ../../deep-loop-runtime/tests/unit/fanout-pool.vitest.ts ../../deep-loop-runtime/tests/unit/cli-matrix.vitest.ts\` and add the regression cases the findings specify (non-zero exit -> failure; parallel timing; service_tier omission). Typecheck code-graph: \`cd .opencode/skills/system-code-graph/mcp_server && npx tsc --noEmit\`. Report pass/fail honestly.`,
  },
  'B-retrieval-scope': {
    child: '002-retrieval-scope-hardening', model: undefined,
    brief: `OWN: mcp_server/handlers/memory-search.ts, handlers/causal-graph.ts, lib/storage/causal-edges.ts (read-only ref), handlers/memory-context.ts. Do NOT edit tool-schemas.ts / tool-input-schemas.ts (cluster D). The retrieval governance boundary is {tenantId,userId,agentId} ONLY — sessionId is NOT a row-access boundary.
Findings B1-B5. Sequence: do B2+B3 as ONE coordinated edit to handleMemoryCausalLink (~755-757); do B4 before B5.
- B1 (P1): community fallback in memory-search.ts (~1006-1033) — extend the member-row SELECT to also select tenant_id,user_id,agent_id; import filterRowsByScope from ../lib/governance/scope-governance.js; when (tenantId||userId||agentId) is set, filterRowsByScope(memberRows,{tenantId,userId,agentId}) BEFORE the calibratedScore map. Unscoped path unchanged.
- B2 (P1): causal-graph.ts handleMemoryDriftWhy + handleMemoryCausalLink — when explicit scope supplied, post-filter source/related memory_index rows via createScopeFilterPredicate({tenantId,userId,agentId}); deny (empty response / error) on mismatch. No scope -> unchanged.
- B3 (P1): in handleMemoryCausalLink, before insertEdge (~757), add an FK existence check (SELECT 1 FROM memory_index WHERE id=? OR CAST(id AS TEXT)=?) for BOTH source and target; return an error response if missing. Do NOT modify lib/storage/causal-edges.ts insertEdge or its deferral comment (20+ synthetic-ID tests depend on it).
- B4 (P1): memory_search — route caller sessionId through sessionManager.resolveTrustedSession (mirror handlers/memory-triggers.ts ~226-246); on trustedSession.error return createMCPErrorResponse; else use trustedSession.effectiveSessionId downstream. Omitted sessionId -> unchanged.
- B5 (P1): memory-context.ts (~1128) — when explicit governance scope is supplied WITHOUT a sessionId, derive the no-session anchor from the normalized scope (include it in the hash) instead of the bare PROCESS_MEMORY_SESSION_ID. Do NOT unconditionally replace PROCESS_MEMORY_SESSION_ID (that breaks intended single-user resume continuity).
CROSS-CLUSTER: tell cluster D it must add optional tenantId/userId/agentId to the memory_drift_why + memory_causal_link input schemas so B2 is reachable by real MCP traffic (your handler code is correct regardless).
VERIFY: author/extend tests (community-search.vitest.ts, handler-causal-graph.vitest.ts, gate-d-regression-session-dedup.vitest.ts, session-lifecycle.vitest.ts) but DO NOT run mcp_server tsc/vitest (peers editing concurrently) — set selfVerification="deferred to central". Do a careful read-back self-review for compile-safety.`,
  },
  'C-write-correctness': {
    child: '003-memory-write-correctness', model: undefined,
    brief: `OWN: mcp_server/handlers/mutation-hooks.ts, handlers/memory-crud-types.ts, tests/transaction-manager-recovery.vitest.ts. (Do NOT edit memory-save.ts — cluster D owns it.)
- C1 (P1): wire entity-density invalidation into the SHARED post-mutation hook so no path can forget it. In mutation-hooks.ts: import invalidateEntityDensityCache from ../lib/search/entity-density.js; add a guarded try/catch block in runPostMutationHooks calling it; record an OPTIONAL new field (e.g. entityDensityCacheCleared) in the returned MutationHookResult. Add that optional field to MutationHookResult in memory-crud-types.ts (keep it OPTIONAL so memory-save.ts/delete handlers still typecheck). This covers update + atomic-save. Leave existing lower-layer invalidations in place (idempotent). Add an update-path case to tests/integration/entity-density-commit-hooks.vitest.ts (rename/replace triggerPhrases -> getEntityDensityScore(oldToken)===0 without TTL wait).
- C2 (PARTIAL, TEST-ONLY): do NOT reorder DB-commit/file-promote (no real 2PC). The crash-window recovery is already implemented+wired (recoverAllPendingFiles + startupScan). Add a regression test to tests/transaction-manager-recovery.vitest.ts: write an orphan at \`\${getPendingPath(original)}.deadbeef\` (8-hex suffix) + committed-row, call recoverAllPendingFiles(dir,()=>true), assert it renames to the final path and content matches; assert findPendingFiles includes it and isPendingFile===true. Optional WHY-comment near atomic-index-memory.ts:362-378 (NO spec/packet ids) — only if you add it.
VERIFY: author tests but DO NOT run mcp_server tsc/vitest (peers editing concurrently) — selfVerification="deferred to central". Read-back self-review for the optional-field typecheck safety.`,
  },
  'D-contract-parity': {
    child: '004-mcp-contract-parity', model: undefined,
    brief: `OWN all MCP contract/schema/ingest/reconcile files: tool-schemas.ts, schemas/tool-input-schemas.ts, tools/types.ts, lib/embedders/embedding-reconcile.ts, handlers/memory-embedding-reconcile.ts, handlers/memory-index.ts, handlers/memory-ingest.ts, lib/ops/job-queue.ts, handlers/memory-save.ts, context-server.ts, INSTALL_GUIDE.md, + new tests/tool-contract-parity.vitest.ts.
RECALIBRATIONS (important): D2 schema/Zod/allow-list are ALREADY aligned — do NOT redo them; only the dead activeOnly param remains. D4's real fix is in tool-schemas.ts (NOT context-server.ts). Batch all tool-schemas.ts edits (D2/D4/D5).
- D1 (P1): embedding-reconcile.ts computeSuccessCoverage (~281-287) — change the COUNT predicate to match apply: \`... AND (NOT EXISTS (rowids r WHERE r.rowid=m.id) OR NOT EXISTS (\${dimTable} v WHERE v.id=m.id))\`; rename the unused _dimTable param to dimTable. Update tests/vector-coverage-hygiene.vitest.ts expected count (2->3) DELIBERATELY and add an apply-parity assertion.
- D2 (PARTIAL): only resolve the dead activeOnly — update its tool-schemas.ts description (~344) to say the active shard is always runtime-resolved and the flag is reserved/no-op; do NOT add runtime branching. Also remove the literal "[Phase 007]" token from the reconcile description string (~349) (cluster F's catalog-accuracy claim depends on it).
- D3 (P1, heaviest): thread governanceDecision.normalized (provenanceSource/provenanceActor/governedAt/retentionPolicy/deleteAfter + tenant/user/agent/session tuple) through BOTH bulk paths to the save layer, mirroring the working handleMemorySave path (memory-save.ts ~2972-2976/3056-3060). (1) extend BaseIndexMemoryFileOptions (~2745) with the governance fields; (2) memory-index.ts indexSingleFile -> indexMemoryFile (~721 call site) pass them through; (3) memory-ingest.ts + job-queue.ts: add governance columns to ingest_jobs (nullable, backward-compatible), the IngestJob interface, the createIngestJob INSERT, and rehydrate at the worker (~626). Additive only; keep validateGovernedIngest gate semantics.
- D4 (P2): tool-schemas.ts (~519/531) — add the governance properties (tenantId,userId,agentId,sessionId,provenanceSource,provenanceActor,governedAt,retentionPolicy,deleteAfter) to the PUBLIC inputSchema of memory_index_scan + memory_ingest_start, copying memory_save's def shape. Zod/allow-list already include them.
- D5 (P2): tool-schemas.ts (~457) — add the nested backfill object to the PUBLIC memory_causal_stats inputSchema mirroring the Zod shape (dryRun default true, limit, actor, similarity, contradicts, similarityThreshold); description must make the dry-run default + write-on-{dryRun:false} explicit.
- D6 (P2): context-server.ts (~953) — correct the stale-graph guidance string: a stale graph BLOCKS code_graph_query (code_graph_not_ready) and requires session_bootstrap refresh first; reconcile the routing-rule gate (~966-967) to emit the query rule only for 'fresh'. Do NOT change system-code-graph query.ts (its fail-closed block is correct). Optionally drop "Phase 027" from the bootstrap heading string (~950).
- D7 (P1): add tests/tool-contract-parity.vitest.ts scoped to memory_embedding_reconcile, memory_index_scan, memory_ingest_start, memory_causal_stats: assert Object.keys(public TOOL_DEFINITIONS[x].inputSchema.properties) deep-equals Object.keys((TOOL_SCHEMAS[x]).shape) (consume the exported TOOL_SCHEMAS + TOOL_DEFINITIONS; add a one-line \`export\` for ALLOWED_PARAMETERS only if you assert it). It should be RED before D4/D5 and GREEN after.
- CROSS-CLUSTER for B: ALSO add optional tenantId/userId/agentId to the memory_drift_why + memory_causal_link schemas (tool-schemas.ts public + tool-input-schemas.ts Zod + allow-list) so cluster B's causal post-filter is reachable.
VERIFY: author all fixes + the parity test but DO NOT run mcp_server tsc/vitest (peers editing concurrently) — selfVerification="deferred to central". Note the ingest_jobs schema migration as a residual risk to check centrally.`,
  },
  'E-metadata': {
    child: '005-metadata-status-derivation', model: undefined,
    brief: `OWN: mcp_server/lib/graph/graph-metadata-parser.ts (the root code fix) + the 026/027 metadata DATA files. MANY 027 metadata files are already in the uncommitted change set — run \`git diff --stat\` on each before editing and only change what is still stale.
- E7 (P1, ROOT, FIRST): graph-metadata-parser.ts — add extractMetadataTableStatus(content) matching the markdown row \`| **Status** | <value> |\` (regex ~ /^\\|\\s*\\**\\s*Status\\s*\\**\\s*\\|\\s*([^|]+?)\\s*\\|/im), normalize via normalizeDerivedStatus; in collectPacketDocs (~623) set spec.md doc.status = (frontmatter status) ?? (table status). Ensure Draft/Placeholder normalize to a NON-complete value so deriveStatus does not fall to the implementation-summary='complete' branch. PRESERVE the lean-phase-parent existingStatus preservation (graph-metadata-refresh.vitest.ts asserts it) and only override when the table status is an explicit known value. Add a fixture test to tests/graph-metadata-schema.vitest.ts: spec.md with NO yaml status + \`| **Status** | Draft |\` + an implementation-summary + no checklist -> derived.status==='draft' (not 'complete'); add a 'Placeholder' variant.
- DATA reconciliation (prefer regeneration via generators over hand-editing; targeted to cited packets):
  E1: 026 graph-metadata.json (~156-157) last_active_child_id -> .../006-operator-tooling, last_active_at -> 2026-06-03 timestamp; reconcile spec.md:139 prose.
  E2: 026 changelog track-000 root rollup Included-Phases + README.md:20 leaf count to match disk reality (find leaf changelog count); keep changelog voice rules.
  E3: reconcile the bidirectional completion contradiction in 000-release-and-program-cleanup/009-readme-and-references-accuracy AND 003-memory-and-causal-runtime/016-embedding-provider-local-first — decide per actual evidence (run validate.sh --strict on each; if genuinely complete, check remaining checklist items + set spec Status/graph derived.status/continuity to complete; else correct the impl-summary 'shipped/Completed' claim to in-progress). Make spec.md table Status, graph derived.status, checklist, impl-summary, and continuity AGREE.
  E4: 027 parent description.json + graph-metadata.json — de-list the placeholder '000-release-cleanup' from children[]/children_ids[] (minimal honest option; it is a hollow shell).
  E5: 027 child description.json title + trigger_phrases -> current folder numbers (002-memory-write-safety, 007-semantic-trigger-fallback, 008-learning-feedback-reducers; confirm 001-peck). Leave context-index.md history untouched (it is the intended home for old IDs).
  E6: 027 003-incremental-index-foundation + 006-write-path-reconciliation graph-metadata.json derived.status complete->draft (to match spec table). This becomes durable after E7 + regen.
  E8: 026 + 027 resource-map.md honesty (correct 'Missing on disk' count + 'OK' rows for renamed/absent paths; prefer regeneration).
  E9: 027 spec.md:88 soften the 'ONLY authored document' note to '...only REQUIRED authored document; optional cross-cutting docs (context-index.md, resource-map.md) may also live here'; add one sentence pinning which 026 surface 027 builds on; reconcile 026 spec.md:43 Status after E3.
DEFER to central: rebuilding mcp_server dist + running backfill-graph-metadata.ts (needs the rebuilt parser). List which packets need backfill regen in crossClusterNeeds. Make the E7 code fix + its test; do the targeted DATA edits; do NOT run the global backfill yourself.
VERIFY: you MAY run JSON.parse sanity + validate.sh --strict on the specific 026/027 packets you edit. Do NOT run mcp_server vitest (peers editing) — selfVerification note the parser test as "authored, deferred to central".`,
  },
  'F-catalog-playbook': {
    child: '006-catalog-playbook-accuracy', model: 'sonnet',
    brief: `OWN (docs only): .opencode/skills/system-spec-kit/feature_catalog/**, manual_testing_playbook/**, README.md, and mcp_server/tests/review-fixes.vitest.ts (only line ~117 tool-count expectation). Do NOT edit any other .ts source.
- F1 (P1): feature_catalog.md:3946,3950 — replace 'every source file'/'Every non-test .ts file' universal claims with the measured ~69% partial-coverage language already in leaf 214-feature-catalog-code-references.md:26.
- F2 (P1): canonical tool count is 37 (TOOL_DEFINITIONS.length). README.md occurrences of '36-tool' (~45,256,581,1003,1038) -> '37-tool'; review-fixes.vitest.ts:~117 toBe(36) -> toBe(37). (Verify the real count by parsing tool-schemas.ts first.)
- F3 (P1): manual_testing_playbook.md — release gate (~166) 380 -> the real count (verify via the playbook's own glob; verification found 384); update the '...count is 380' note (~173) + its date.
- F4 (P1): fix the 5 broken catalog links exactly: 02--mutation/019 -> 02--mutation/024-per-memory-history-log.md; 01--retrieval/006 -> 01--retrieval/004-hybrid-search-pipeline.md; 01--retrieval/007 -> 01--retrieval/005-4-stage-pipeline-architecture.md; 14--stress-testing/170 -> 14--stress-testing/162-category-overview.md; 04--maintenance/036 -> 04--maintenance/035-startup-runtime-compatibility-guards.md. Confirm each target exists with ls.
- F5 (P1): scenario 232 lines ~18,21 + manual_testing_playbook.md:~2692 — replace the garbled 'sort -u\` 2) ...' fragment with clean natural-language request + expected-signals text. Do NOT touch the Commands section (37-40).
- F6 (P1): feature_catalog/24--local-llm-query-intelligence/313-category-overview.md:~40-47 — fix stale paths: mcp_server/shared/embeddings/factory.ts -> shared/embeddings/factory.ts; memory-causal-*.ts / memory-drift-why.ts -> mcp_server/handlers/causal-graph.ts; 40*.md -> 361-375.
- F7 (P1): 214:30 + feature_catalog.md:3950 cleanup-complete claim — cluster D removes the [Phase 007]/Phase 027 string labels; after that the claim can be accurate. Coordinate: qualify the claim (or, if D's removal lands, keep it accurate). State the dependency.
- F8 (P1): scenario 234:38 — '../sk-code/scripts/verify_alignment_drift.py' -> '../sk-code/assets/scripts/verify_alignment_drift.py'.
- F9 (P2): 313:47 40*->361-375; manual_testing_playbook/24--local-llm-query-intelligence/README.md scenario numbers 401-415 -> 361-375 (Band A 401-410->361-370, Band B 411-415->371-375, cross-AI refs too).
- F10 (P2): scenario 032:37 -> session_bootstrap({}) ; catalog 253:28 -> memory_ingest_start({ paths: [...] }) (canonical from cluster D).
VERIFY (self-run): grep/ls each fixed reference resolves. Do NOT run mcp_server vitest (F2 test change verified centrally). Report grep/ls evidence per finding.`,
  },
  'G-governance': {
    child: '007-governance-alignment', model: 'sonnet',
    brief: `OWN: .opencode/skills/sk-doc/**, .opencode/skills/sk-code/** (incl. scripts/check-comment-hygiene.sh and assets/scripts/verify_alignment_drift.py), .opencode/skills/system-spec-kit/constitutional/**, AGENTS.md. Do NOT edit code-graph/deep-loop source (cluster A owns the actual code-comment fixes).
- G1 (P1): sk-doc/assets/frontmatter_templates.md:~685-687 — the Spec row currently says 'Suggest removal' of frontmatter; change to 'Validate required fields (title, description, trigger_phrases, importance_tier, _memory.continuity) / No frontmatter -> auto-generate from Spec Kit template'. Do NOT touch the Knowledge row.
- G2 (P1): align sk-doc command required-sections across the 3 docs to template_rules.json (the validator's ground truth = [purpose, instructions]). Update quick_reference.md:~125-129 and core_standards.md:~113-117; remove 'INPUTS, WORKFLOW, OUTPUTS' from the required list.
- G3 (P2): core_standards.md:~31-35 — add an exception clause: packet-local numbered docs (NNN-name.md) may use hyphens.
- G4 (P1): sk-code/scripts/check-comment-hygiene.sh VIOLATION_PATTERNS (~85-97) — broaden to catch the missed forbidden examples: REQ-\\d+\\b, CHK-\\d+\\b, T\\d{3,4}\\b (carefully, comment-context only to avoid false positives), 'checklist item \\d+', '[Pp]\\d-finding-\\d+', 'finding #\\d+', and top-level spec-folder paths. Test on a scratch .ts containing each forbidden example -> must exit 1; and a clean file -> exit 0.
- G5 (P1): the per-line 'hygiene-ok' escape is INTENTIONAL — fix the DOC: constitutional/comment-hygiene.md:~71 — document the per-line hygiene-ok escape (for documented false-positives) alongside the --no-verify protection. Do NOT remove the escape from the checker.
- G6 (P1): comment-hygiene.md:~66-71 — 'Two gates' -> 'Three gates' (add the CI gate .github/workflows/comment-hygiene.yml); document the SPECKIT_SKIP_COMMENT_HYGIENE=1 bypass accurately.
- G7 (P1): constitutional/gate-tool-routing.md:41 — change the Semantic/concept Fallback column from 'memory_search' to 'Grep / Glob' to match AGENTS.md:106 (memory does not index arbitrary code).
- G8 (P1): SKILL.md:~216, references/universal/code_quality_standards.md:~108, assets/opencode/checklists/universal_checklist.md:~254 — remove the 'bash ' prefix from the check-comment-hygiene.sh invocation (the file is python via shebang; bash fails). Rely on the shebang (\`.opencode/skills/sk-code/scripts/check-comment-hygiene.sh <file>\`).
- G9 (P2): sk-code/assets/scripts/verify_alignment_drift.py check_shell (~308-333) — early-return empty findings when the first line == '#!/usr/bin/env python3' (Python script with .sh extension; python shebang handled by check_python).
- G10 (P2): verify_alignment_drift.py classify_severity (~235-239) — promote the header/shebang rules (SH-SHEBANG, SH-STRICT-MODE, PY-SHEBANG, TS-MODULE-HEADER) to ERROR so P0 checklist gaps fail-closed; update test_verify_alignment_drift.py:~120 accordingly. Sequence G9 BEFORE G10 so the python-.sh files do not become false ERRORs.
VERIFY (self-run): run \`.opencode/skills/sk-code/scripts/check-comment-hygiene.sh <scratch.ts>\` for G4/G8; run \`python3 -m pytest .opencode/skills/sk-code/assets/scripts/test_verify_alignment_drift.py -v\` for G9/G10. Report results.`,
  },
}

phase('Implement')
const entries = Object.entries(CLUSTERS)
const results = await parallel(entries.map(([name, def]) => () =>
  agent(
    COMMON.replaceAll('<YOUR_CLUSTER>', name).replaceAll('<YOUR_CHILD_FOLDER>', def.child) +
    `\n\nYOUR CLUSTER: ${name}\nYOUR CHILD FOLDER: ${def.child}\n\nCLUSTER BRIEF:\n${def.brief}`,
    { label: `impl:${name}`, phase: 'Implement', schema: RESULT_SCHEMA, ...(def.model ? { model: def.model } : {}) }
  )
))

return results.filter(Boolean)
