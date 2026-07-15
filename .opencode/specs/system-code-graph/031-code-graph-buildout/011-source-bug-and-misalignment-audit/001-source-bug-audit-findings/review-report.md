---
title: "Code Graph Source Audit: Bug & Misalignment Findings [system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/review-report]"
description: "Adversarially-verified bug + doc/code-misalignment audit of the system-code-graph mk-code-index MCP server: 37 confirmed findings (10 P1, 27 P2) across concurrency, diff math, recovery, parser lifecycle, readiness, SQLite persistence, and documentation."
trigger_phrases:
  - "code graph source audit"
  - "system-code-graph bugs"
  - "mk-code-index misalignments"
importance_tier: "important"
contextType: "implementation"
---

<!-- SPECKIT_DOC: review-report -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Code Graph Source Audit — Bug & Misalignment Findings

> Read-only audit of `.opencode/skills/system-code-graph/` (the `mk-code-index` MCP server, ~17.5k LOC TypeScript). No source files were modified. Remediation is tracked in `plan.md` / `tasks.md`; this report is the evidence record.

---

## 1. Summary

| Severity | Count |
|----------|-------|
| **P1** (functional bug / real contract break) | 10 |
| **P2** (latent bug, weak cleanup, doc/code drift) | 27 |
| **Total confirmed** | **37** |

Findings by area: doc-code-misalignment (9), indexer-parser-lifecycle (4), readiness-scan-freshness (4), recovery-apply-path (4), concurrency-ipc (4), cli-opencode (gpt-5.5-fast xhigh) (3), db-sql-persistence (3), direct verification (Claude) (3), diff-line-math (3)

**Headline P1 bug — CG-005:** web-tree-sitter `Tree` objects are never `.delete()`'d, leaking WASM linear memory on every parsed file across a full scan (thousands of files reuse one module-level parser). Other high-value P1s: **CG-003** no-transaction `removeFile` (partial graph state on crash), **CG-006** failed scans reporting `freshness: 'fresh'`, and **CG-009** destructive recovery ops bypassing the `confirm` gate.

---

## 2. Method & Provenance

This audit combined three independent passes, each producing exact-line evidence:

1. **Primary finder — `cli-opencode` → `openai/gpt-5.5-fast --variant xhigh`** (read-only dispatch, `sk-code` + `sk-code-review` loaded). Produced the 3 contract findings (status read-only, schema enforcement, trust-state enum).
2. **Direct verification (Claude / this session)** — confirmed every gpt-5.5 finding against source and added 3 DB-path findings from the `.opencode/.spec-kit` directory-origin investigation.
3. **Completeness-expansion workflow (43 agents)** — 7 finders over the clusters gpt-5.5 under-covered (concurrency/IPC, diff math, recovery/apply, parser lifecycle, readiness/scan, SQLite persistence, doc/code), each finding **adversarially verified** by an independent skeptic agent. 36 candidates → 32 confirmed, 4 refuted.

Every finding below was checked against the real file at the cited line. Severities reflect the adversarial verifier's corrected rating (several P1 candidates were correctly downgraded to P2 where production guards or dead-code paths limit real impact — see each Verification note).

---

## 3. P1 Findings (10)


#### CG-001 · P1 · MISALIGNMENT — code_graph_status writes the readiness marker on every call, violating the read-only / single-writer contract (ADR-003)

- **Location:** `.opencode/skills/system-code-graph/mcp_server/handlers/status.ts:198-203`
- **Source:** cli-opencode (gpt-5.5-fast xhigh)

**Evidence**

```
handlers/status.ts:198-203
  export async function handleCodeGraphStatus() {
    try { writeCodeGraphReadinessMarker(process.cwd()); }
    catch { /* Status must remain best-effort even if the marker cannot be refreshed. */ }
  // ... comment at 204-209 then claims "The snapshot helper is read-only, so calling it earlier never causes side effects."
VS ARCHITECTURE.md:167  ADR-003 | Single-writer invariant: only `code_graph_scan` writes; every other tool is read-only | Accepted
VS feature_catalog.md (code_graph_status): "Read-only health probe ... without mutating graph state."
```

**Why it's wrong:** Every code_graph_status call performs an atomic filesystem write (writeFileSync + renameSync) of `.code-graph-readiness.json`. ADR-003 and the feature catalog both classify status as read-only. The marker is a readiness cache, not graph data, so the violation is of the documented read-only wording rather than the SQLite single-writer invariant. It is compounded by the cwd-based marker path (see CG-004): a status call from a non-workspace-root cwd scatters marker files, and it is a write-on-every-read under WAL.

**Suggested fix:** Either gate the marker refresh to scan only (and have status read the existing marker), or amend ADR-003 / feature-catalog to explicitly carve out readiness-marker refresh as an allowed side effect of read tools.

**Verification:** CONFIRMED by direct read: status.ts:200 calls writeCodeGraphReadinessMarker unconditionally at handler entry; the self-contradicting "read-only" comment is two lines below. Related to workflow finding CG-? (ensure-ready setLastGitHead DB write) which breaks the same contract via a different mechanism.

---

#### CG-002 · P1 · MISALIGNMENT — Tool JSON input-schemas are never enforced before handler execution (parseArgs/validateToolArgs are no-ops)

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/shared/mcp-types.ts:9-14`
- **Source:** cli-opencode (gpt-5.5-fast xhigh)

**Evidence**

```
lib/shared/mcp-types.ts:9-14
  export function parseArgs<T>(args: Record<string, unknown>): T {
    if (args == null || typeof args !== 'object') { return {} as T; }
    return args as unknown as T;   // pure cast — no schema check
  }
tool-schemas.ts:200-209  validateToolArgs(): finds the tool, checks input is an object, returns rawInput unchanged.
index.ts:84-86  const args = (request.params.arguments ?? {}); return await codeGraphTools.dispatch(request.params.name, args);
VS feature_catalog/mcp-tool-surface/01-tool-registrations.md:26-28  "Schema validation rejects malformed tool calls before handler execution for registered names."
```

**Why it's wrong:** The MCP SDK validates the CallTool request envelope, not the per-tool inputSchema. parseArgs is a pure cast and validateToolArgs returns its input unchanged, so malformed enum/range/additionalProperties inputs reach handlers. Handlers do manual required-string checks for a few tools (query/classify/detect_changes) but no enum/range validation. For code_graph_query, readiness/inline-index work can run before an invalid `operation` is rejected, so a malformed call can consume work / trigger inline selective indexing.

**Suggested fix:** Validate request arguments against each tool's declared inputSchema (e.g. ajv) inside dispatch() before invoking the handler, OR soften the doc to state only required-field checks happen pre-handler.

**Verification:** CONFIRMED by direct read of mcp-types.ts:9-14, tool-schemas.ts:200-209, index.ts:84-86. The schema array in tool-schemas.ts is rich (enums, min/max, additionalProperties:false) but nothing enforces it at runtime.

---

#### CG-003 · P1 · BUG — removeFile() does a 2-statement delete (edges, then file→CASCADE nodes) with NO transaction → crash mid-call leaves orphaned/partial graph state

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:858-870`
- **Source:** workflow:db-sql-persistence

**Evidence**

```
removeFile body (no d.transaction wrapper):
  const nodeIds = d.prepare('SELECT symbol_id FROM code_nodes WHERE file_id = ?').all(file.id) ...
  if (nodeIds.length > 0) {
    ...
    d.prepare(`DELETE FROM code_edges WHERE source_id IN (${placeholders}) OR target_id IN (${placeholders})`).run(...ids, ...ids);
  }
  d.prepare('DELETE FROM code_files WHERE id = ?').run(file.id);

The parallel WRITE path explicitly mandates the opposite (ensure-ready.ts:560-564):
  "Wrap the four storage operations ... in a single per-file transaction so a crash mid-persistence rolls all four back atomically."
removeFile is reached in a loop from ensure-ready.ts:329-335 cleanupDeletedTrackedFiles → graphDb.removeFile(filePath) per deleted file.
```

**Why it's wrong:** better-sqlite3 does NOT auto-wrap multiple .run() calls in a transaction. If the process is killed (RSS watchdog / graceful-exit / OS) between the code_edges DELETE and the code_files DELETE, edges for the file are gone but the code_files row (and its CASCADE-linked code_nodes) remain, or — in the reverse interleaving across the loop — nodes/files are cascaded away while their edges still reference missing symbol_ids. This produces exactly the dangling-edge / orphan-node inconsistency the persist path was hardened against, and it accumulates across the per-file loop in cleanupDeletedTrackedFiles where each iteration is its own un-atomic unit.

**Suggested fix:** Wrap removeFile's edge-delete + file-delete in a single d.transaction(() => {...})() (same pattern already used by replaceNodes/replaceEdges/persistIndexedFileResult).

**Verification:** CONFIRMED. Quote matches exactly: code-graph-db.ts removeFile (858-870) does edge DELETE (line 867) then file DELETE (line 869) with NO d.transaction() wrapper. Both cited reference points are accurate: persist-path doc comment mandating per-file atomic transaction (ensure-ready.ts:560-564) and the per-file removeFile loop in cleanupDeletedTrackedFiles (329-335, call at 331), which is invoked bare at ensureCodeGraphReady line 611 with no outer transaction.

Mechanism verified: code_nodes.file_id REFERENCES code_files(id) ON DELETE CASCADE (line 124) with foreign_keys=ON (line 272), and journal_mode=WAL (line 271). better-sqlite3 does not auto-batch multiple .run() calls, so a process kill between line 867 and 869 leaves edges deleted but the code_files row + CASCADE-linked code_nodes intact -> orphaned, edge-less nodes. Crash threat is real: this server has launcher-lease / idle-timeout / process.exit machinery (index.ts, launcher-lease.vitest.ts, launcher-idle-timeout.vitest.ts). The asymmetry is genuine: sibling writers replaceNodes (line 692), replaceEdges (line 726), and persistIndexedFileResult (ensure-ready.ts:573-590) ALL wrap their multi-statement deletes in d.transaction(); removeFile is the lone un-atomic multi-statement mutator. Proposed fix matches the existing pattern and is correct.

One overstatement in the finding (does not change verdict/severity): the 'reverse interleaving' clause claiming nodes/files get cascaded away 'while their edges still reference missing symbol_ids' (dangling edges) cannot occur within a single removeFile call -- ordering is always edges-first then file. The only single-call partial state is 'edges gone, nodes orphaned.' The orphan-node outcome (the primary claim) is fully valid.

Severity P1 is correct: real data-integrity corruption reachable on the normal cleanup path, but requires a precise mid-call crash window and only corrupts a rebuildable derived index (not primary data loss) -> P1, not P0.

---

#### CG-004 · P1 · MISALIGNMENT — Feature catalog claims 11 MCP tools and says deep-loop tools dispatch through mk-spec-memory, contradicting its own arc-118 removal note and the real 8-tool surface

- **Location:** `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:24, 250`
- **Source:** workflow:doc-code-misalignment

**Evidence**

```
Line 24: "The 14 features map to **11 MCP tools** in the `mk-code-index` server ... Previously, the **coverage-graph deep-loop tools** (`deep_loop_graph_*`) were registered with the `mk-spec-memory` MCP server; they were removed in arc 118 (FULL_ISOLATE_NO_MCP) and now live as direct `.cjs` script entry points".
Line 250: "Deep-loop coverage graph tools dispatch through the `mk-spec-memory` server."
Actual: mcp_server/tool-schemas.ts CODE_GRAPH_TOOL_SCHEMAS + mcp_server/tools/code-graph-tools.ts TOOL_NAMES both register exactly 8 tools; README.md:3, SKILL.md:378, tool_surface.md:13, ownership_boundary.md:59, INSTALL_GUIDE.md:66 all say 8.
```

**Why it's wrong:** The catalog is the named current feature inventory yet states a tool count (11) that no longer exists and an MCP dispatch path (mk-spec-memory) the same document says was removed in arc 118. An operator/agent trusting line 250 would try to call deep_loop_graph_* over mk-spec-memory MCP and fail; the 11-vs-8 count misleads tool-surface routing and post-rename manifest checks.

**Suggested fix:** Change "11 MCP tools" to "8 MCP tools" at line 24 and delete/rewrite the line 250 sentence to state the deep_loop_graph_* tools are no longer MCP tools (arc-118 .cjs scripts), consistent with the arc-118 note above.

**Verification:** Both quotes match the file verbatim. Line 24 of feature_catalog/feature_catalog.md states "The 14 features map to **11 MCP tools** in the `mk-code-index` server"; line 250 states "Deep-loop coverage graph tools dispatch through the `mk-spec-memory` server." Both contradictions are real:

(1) 11-vs-8 count: The mk-code-index server registers exactly 8 tools. Verified in mcp_server/tools/code-graph-tools.ts TOOL_NAMES (8 entries: code_graph_scan, code_graph_query, code_graph_status, code_graph_context, code_graph_classify_query_intent, code_graph_verify, code_graph_apply, detect_changes) and mcp_server/tool-schemas.ts (8 `name:` schema entries, same 8). Corroborated by README.md:3 ("8 MCP tools"), SKILL.md:378, references/runtime/tool_surface.md:3,13 ("the 8 MCP tools exposed by mk-code-index"), references/runtime/ownership_boundary.md:59 ("8 tools through the mk_code_index server"), and INSTALL_GUIDE.md:112,134 ("Registers 8 tools"). So "11 MCP tools in the mk-code-index server" is factually wrong.

(2) Line 250 mk-spec-memory dispatch: Directly contradicted by the same document's arc-118 notes at line 24 ("they were removed in arc 118 ... and now live as direct .cjs script entry points") and line 178 ("The four mcp__mk_spec_memory__deep_loop_graph_* MCP tools were removed in arc 118 ... replaced by a direct .cjs script entry point"). The deep_loop_graph_* and mk-spec-memory strings do not appear anywhere in the code-graph MCP schemas/dispatcher. So line 250's present-tense "dispatch through mk-spec-memory" is stale and self-contradicting.

The "why" holds: this is the named current feature inventory, and line 250 would mislead an operator/agent into calling deep_loop_graph_* over mk-spec-memory MCP (which would fail), while the 11-vs-8 miscount harms tool-surface routing/manifest checks.

Note on line citations: the finding's evidence string lists "tool_surface.md:13, ownership_boundary.md:59, INSTALL_GUIDE.md:66" without full relative paths; actual locations are references/runtime/tool_surface.md:13, references/runtime/ownership_boundary.md:59, and INSTALL_GUIDE.md:112 (not :66). These minor path/line imprecisions in the corroboration list do not affect the core finding — the substance (8 vs 11, and the contradicted mk-spec-memory claim) is fully confirmed.

Severity P1 retained: documentation-only blast radius (no runtime behavior breaks) and partially self-mitigated by the adjacent arc-118 correction notes, but it is the authoritative catalog and the contradiction can cause failed tool calls and miscounts in manifest/routing checks. The proposed fix (change 11 to 8 at line 24; rewrite/delete line 250 to state deep_loop_graph_* are no longer MCP tools / arc-118 .cjs scripts) is correct.

---

#### CG-005 · P1 · BUG — web-tree-sitter Tree is never .delete()'d — WASM heap leak across every parse

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:799-825`
- **Source:** workflow:indexer-parser-lifecycle

**Evidence**

```
Line 799: `const tree = parserInstance.parse(content);`
Lines 802/807 use `tree.rootNode`, then the success path returns at 815-825 with NO `tree.delete()` and no try/finally cleanup. There is zero `.delete()` call anywhere in the module (grep confirms). package.json pins `web-tree-sitter ^0.24.7`, where each `parse()` allocates a `Tree` on the Emscripten WASM heap that the caller MUST free via `tree.delete()`.
```

**Why it's wrong:** In web-tree-sitter 0.24.x, parsed `Tree` objects own WASM linear memory that the GC cannot reclaim (the JS wrapper is tiny; the heap allocation persists until `delete()`). A full scan parses thousands of files reusing the single module-level `parserInstance`, so the WASM heap grows monotonically. This is the most plausible root cause of the very 'memory access out of bounds' (B2) faults the quarantine logic at lines 73-93/836 exists to defend against — i.e. the leak manufactures the crash it then quarantines.

**Suggested fix:** Wrap the body in try/finally and call `tree.delete()` in the finally (after `walkAST` and `tree.rootNode.hasError` have been read), e.g. `let tree; try { tree = parserInstance.parse(content); ... } finally { tree?.delete?.(); }`.

**Verification:** CONFIRMED. All quoted code matches exactly. tree-sitter-parser.ts:799 `const tree = parserInstance.parse(content);`; lines 802/807 read `tree.rootNode`/`(tree.rootNode as TSNode).hasError`; the success path returns at 815-825 with no `tree.delete()` and no try/finally cleanup. Grep confirms ZERO `.delete()`/free/dispose/FinalizationRegistry calls anywhere in the module. package.json pins `web-tree-sitter ^0.24.7` and the installed resolution at node_modules/web-tree-sitter is exactly 0.24.7.

The leak is real. Verified: (a) `parserInstance` is module-level (line 44) and reused via the `treeSitterParser` singleton (structural-indexer.ts:903); (b) a full scan routes every file through `parser.parse()` -> structural-indexer.ts:1248 -> tree-sitter-parser.ts:799; (c) the installed typings (tree-sitter-web.d.ts:152) declare `Tree.delete(): void`, and SyntaxNode holds a `tree: Tree` back-reference (line 57) — the standard Emscripten/WASM ownership model where the JS GC cannot reclaim the C-heap allocation, so `delete()` is the mandatory free; (d) `walkAST` (line 590/802) receives only `tree.rootNode`, never the Tree, so the Tree reference is dropped at end-of-method with no free. The WASM heap grows monotonically across a scan of thousands of files.

Two caveats that do not change the verdict: (1) The 'why' overstates the B2 causal claim — that this leak 'manufactures the memory-access-out-of-bounds faults it then quarantines.' Unbounded WASM growth CAN produce OOB faults, but the code alone does not prove this leak is THE root cause of the specific B2 faults the quarantine at 73-93/836 defends against; treat that as a plausible hypothesis, not established fact. (2) The package README is trimmed and does not itself document the delete() requirement, but the typings + upstream tree-sitter contract do — so the API claim holds.

Severity P1 is correct: hot-path monotonic WASM heap leak across full scans, real resource-exhaustion/crash risk, but not P0 (no data corruption/security impact and a quarantine degraded-mode backstop exists) and clearly above P2. The proposed try/finally + `tree?.delete?.()` fix is correct and preserves the ordering (delete after walkAST and hasError reads).

---

#### CG-006 · P1 · BUG — Failed / non-promoted scan reports freshness:'fresh' + 'persisted current graph state' because lastPersistedAt is MAX(indexed_at), not gated on scanPromotable

- **Location:** `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:580-600, 625, 749, 761-768`
- **Source:** workflow:readiness-scan-freshness

**Evidence**

```
Loop persists every parsed file regardless of promotion: `persistIndexedFileResult(result);` (scan.ts:594) runs even when `severeParseErrorScan===true`. Promotion is computed AFTER: `const scanPromotable = !severeParseErrorScan && structuralErrors.length === 0;` (scan.ts:625). The readiness block then derives freshness purely from persisted rows: `const lastPersistedAt = persistedStats.lastScanTimestamp;` (scan.ts:749) and `buildReadinessBlock({ freshness: lastPersistedAt ? 'fresh' : 'empty', ... reason: lastPersistedAt ? 'scan completed and persisted current graph state' : ... })` (scan.ts:762-767). `lastScanTimestamp` is `MAX(indexed_at) FROM code_files` (code-graph-db.ts:1126), and `upsertFile` writes `indexed_at = now` on every persisted file (code-graph-db.ts:592-603). So on a structural-error or parse-error-threshold scan (`failedScan` non-null, status still 'ok'), or even a scan that re-touched only one file while a prior scan left rows, freshness is reported 'fresh' with reason 'persisted current graph state' although HEAD/scope/detector-provenance promotion was skipped (scan.ts:649-658 are all gated on scanPromotable).
```

**Why it's wrong:** Consumers keying off readiness.trustState/freshness ('fresh' -> trustState 'live' via readiness-contract.ts:107) treat a failed scan's output as authoritative live data, masking the failedScan record and the un-advanced HEAD/scope. Stale-treated-as-fresh contract break on the failure path.

**Suggested fix:** Compute freshness from scanPromotable, not lastPersistedAt: `freshness: !scanPromotable ? 'stale' : (lastPersistedAt ? 'fresh' : 'empty')` and adjust the reason string when failedScan is non-null.

**Verification:** All quoted code matches real source exactly. scan.ts (paths confirmed at .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts): line 594 persistIndexedFileResult(result) runs inside the per-file loop (580-623) regardless of severeParseErrorScan; line 625 computes scanPromotable = !severeParseErrorScan && structuralErrors.length === 0 AFTER the loop; line 749 const lastPersistedAt = persistedStats.lastScanTimestamp; lines 762-767 buildReadinessBlock({ freshness: lastPersistedAt ? 'fresh' : 'empty', ... reason: lastPersistedAt ? 'scan completed and persisted current graph state' : 'scan completed but no graph data was persisted' }); lines 649-658 all promotion side-effects gated on scanPromotable. mcp_server/lib/code-graph-db.ts:1126 getStats().lastScanTimestamp = SELECT MAX(indexed_at) FROM code_files with NO WHERE clause, no scope filter, no promotion/failedScan awareness; upsertFile (582-603) writes indexed_at = now on both INSERT and UPDATE for every persisted file. mcp_server/lib/readiness-contract.ts:107-108 'fresh' -> trustState 'live'.

Reasoning holds under full context. The freshness signal is fully decoupled from promotion. (1) Structural-error path: the catch at scan.ts:601-606 pushes to structuralErrors and CONTINUES the loop, so non-erroring files persist (advancing MAX(indexed_at)) while scanPromotable becomes false -> failedScan non-null, status hardcoded 'ok' (line 774), freshness 'fresh'. (2) Parse-error-threshold path: existing test 'does not promote live metadata when parse error ratio exceeds threshold' (code-graph-scan.vitest.ts:1348-1407) supplies a clean file (/workspace/current.ts, parseHealth 'clean') that IS persisted while asserting setLastGitHead/setCodeGraphScope/recordCandidateManifest are NOT called and failedScan.reason === 'parse_error_threshold_exceeded'. That test deliberately does NOT assert on freshness/readiness/trustState, confirming no guard prevents the 'fresh'/'live' output on the failure path. (3) Even a scan that re-touches one file with prior rows present yields a truthy lastPersistedAt.

One minor inaccuracy in evidence wording, non-material: persistIndexedFileResult (ensure-ready.ts:566-591) early-returns for parseHealth === 'error' files (only recordParseDiagnostic), so error-health files do not advance indexed_at. But any successfully-parsed file in the same failed scan, or any pre-existing row, makes lastPersistedAt truthy, so the contract break stands.

No missing typed-union or caller-side guard found. Severity P1 is correct: genuine stale-treated-as-fresh / data-trust contract break that masks failedScan and un-advanced HEAD/scope for consumers keying off trustState 'live'; not a crash/security/data-loss issue, and triggers only on the non-default failure path (structural persistence errors or parse-error ratio above DEFAULT_FATAL_PARSE_ERROR_RATIO). Proposed fix (gate freshness on scanPromotable, e.g. freshness: !scanPromotable ? 'stale' : (lastPersistedAt ? 'fresh' : 'empty') and adjust reason when failedScan non-null) is sound and aligns with how lines 649-658 already gate promotion.

---

#### CG-007 · P1 · BUG — Read-only readiness snapshot path mutates DB via setLastGitHead inside detectState, violating the documented no-mutation contract used by code_graph_status

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:482-484, 773-780, 786-794, 808-809, 815-817`
- **Source:** workflow:readiness-scan-freshness

**Evidence**

```
detectState mutates the stored HEAD: `if (headChanged && headScope === 'out-of-scope' && currentHead) { setLastGitHead(currentHead); }` (ensure-ready.ts:482-484), and setLastGitHead is a DB write (`setMetadata('last_git_head', head)` code-graph-db.ts:374-376). Both read-only surfaces call detectState: getGraphReadinessSnapshot does `const state = detectState(rootDir);` (ensure-ready.ts:817) and its docstring promises 'WITHOUT mutating any state: ... no `setLastGitHead` updates' (ensure-ready.ts:786-794, 808-809); getGraphFreshness similarly calls detectState (ensure-ready.ts:775). getGraphReadinessSnapshot is invoked by the read-only code_graph_status handler (status.ts:210), startup-brief.ts:186, and readiness-marker.ts:226.
```

**Why it's wrong:** code_graph_status and the startup/readiness-marker diagnostics are contractually read-only (ADR-003 single-writer); a status call that observes an out-of-scope HEAD advance silently writes last_git_head, so two concurrent diagnostic readers race on a DB write and the documented no-mutation guarantee is false. Distinct from SCG-001 (different writer: last_git_head metadata vs. the readiness marker file).

**Suggested fix:** Move the setLastGitHead(currentHead) side-effect out of detectState into ensureCodeGraphReady only (the mutating caller), or pass a `mutate:false` flag from getGraphReadinessSnapshot/getGraphFreshness that suppresses the HEAD write.

**Verification:** All quoted code matches the real source exactly. ensure-ready.ts:482-484 contains `if (headChanged && headScope === 'out-of-scope' && currentHead) { setLastGitHead(currentHead); }` inside detectState (defined at line 380). setLastGitHead -> setMetadata('last_git_head', head) (code-graph-db.ts:374-376) is a genuine DB write: setMetadata (code-graph-db.ts:322-329) runs an INSERT...ON CONFLICT DO UPDATE against code_graph_metadata. Both read-only surfaces call detectState with NO mutate guard: getGraphReadinessSnapshot (line 817) and getGraphFreshness (line 775). The docstrings at 786-794 and 808-809 explicitly promise "WITHOUT mutating any state ... no setLastGitHead updates" / "intentionally does NOT touch the cache" — these promises are false because line 483 is reachable from both. The branch IS reachable: it fires when HEAD advanced out-of-scope while stale.length===0 (a commit not touching indexed files) — a normal scenario, no typed-union or earlier-return prevents it. Callers verified: code_graph_status handler (status.ts:210, which has its own inline comment at line 208-209 claiming "The snapshot helper is read-only ... never causes side effects" — directly falsified), startup-brief.ts:186, readiness-marker.ts:226. CORRECTION to the "why": the race-condition framing is overstated — the write is idempotent (always writes the same currentHead) and SQLite serializes writes, so concurrent readers cannot corrupt data; they'd redundantly UPSERT the same value. But the core claim stands: a documented/contractual read-only diagnostic path performs a persisted DB write, violating ADR-003 single-writer discipline and making both the function docstrings and status.ts's inline comment incorrect. Severity P1 is correct: real contract/correctness bug on read-only surfaces, but non-crashing and non-corrupting (idempotent), so not P0. The proposed fix (move setLastGitHead out of detectState into ensureCodeGraphReady only, or pass mutate:false) is sound.

---

#### CG-008 · P1 · MISALIGNMENT — Candidate-manifest drift can never detect on-disk-only new files: both baseline and comparison derive from graphDb.getTrackedFiles() (DB rows), contradicting the module's stated purpose

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:177-185, 293-311, 445, 679, 711`
- **Source:** workflow:readiness-scan-freshness

**Evidence**

```
Module rationale promises detecting on-disk additions: 'a brand-new `src/new.ts` is invisible until something else triggers a full scan ... if the on-disk indexable count or digest diverges, we flip to stale + full_scan' (ensure-ready.ts:177-185), and the drift docstring claims it 'flips to stale ... adds N untracked files at once' (ensure-ready.ts:300-302). But drift is computed from the DB set: `const manifestDrift = detectCandidateManifestDrift(trackedFiles);` where `trackedFiles = graphDb.getTrackedFiles()` (ensure-ready.ts:425,445), and the baseline is recorded from the same source: `recordCandidateManifest(graphDb.getTrackedFiles())` (ensure-ready.ts:679,711; scan.ts:668). detectCandidateManifestDrift only compares count/digest of these DB-derived lists (ensure-ready.ts:304-311). A brand-new untracked on-disk file is by definition absent from code_files, so it appears in neither the baseline nor the comparison set; count and digest stay identical and drift never fires.
```

**Why it's wrong:** The mechanism built specifically to flip newly-added (untracked) files to stale+full_scan is wired to a source (DB rows) that cannot observe them, so a new src/new.ts remains invisible to detectState exactly as before the manifest was added — stale-treated-as-fresh for additions, the bug the feature claims to fix.

**Suggested fix:** Feed detectCandidateManifestDrift the on-disk indexable candidate set (the find-candidates / collectSpecificFiles universe), not graphDb.getTrackedFiles(); record the manifest from that same on-disk set after a scan.

**Verification:** CONFIRMED. All cited code/docs exist verbatim. ensure-ready.ts:177-185 carries the rationale promising detection of a brand-new src/new.ts on disk; 293-302 repeats the "adds N untracked files at once flips to stale" claim AND line 298 explicitly states "no filesystem walk happens here"; 304-311 shows detectCandidateManifestDrift compares only count/digest; line 425 sets trackedFiles = graphDb.getTrackedFiles(); line 445 calls detectCandidateManifestDrift(trackedFiles); lines 679 and 711 both call recordCandidateManifest(graphDb.getTrackedFiles()). getTrackedFiles() is SELECT file_path FROM code_files (code-graph-db.ts:833-837) — pure DB rows.

Reasoning holds under full context. Both the recorded baseline and the read-time comparison derive from code_files rows. A brand-new untracked on-disk file is by definition absent from code_files, so it is in neither set; count and digest stay identical and drift never fires. I checked detectState() (lines 380-485) for any alternate filesystem-walk enumeration of the on-disk candidate universe — there is none. The only FS touch is partitionTrackedFiles() (existsSync), which detects DELETIONS of already-tracked files, not ADDITIONS. No guard, typed union, or caller elsewhere rescues this. The dedicated test suite (code-graph-candidate-manifest.vitest.ts) only asserts manifest round-trip and DB-set alignment (it records from SELECT file_path FROM code_files at lines 119-122 and expects fresh) — there is NO test creating an untracked on-disk file and asserting drift fires, corroborating that additions are never observed between scans.

Minor inaccuracy in the finding: the cited "scan.ts:668" is actually handlers/scan.ts:668 (path qualifier omitted), but the line and content (recordCandidateManifest(graphDb.getTrackedFiles())) are exact, and that comment even notes scans discover new files via find-candidates — confirming the FS walk happens during the scan, not at read-time detection.

Severity P1 is correct: the feature fails its stated purpose (between-scan detection of on-disk additions), leaving new files stale-treated-as-fresh until another trigger (git HEAD change, scope-fingerprint change, or explicit scan) forces a rescan. It is a missing-improvement / does-not-do-what-it-says gap rather than a crash/data-loss/security P0, and is partially masked by those other staleness triggers — so not P0. The proposed fix (feed the on-disk find-candidates universe to detectCandidateManifestDrift, and record the manifest from that same on-disk set) is the correct direction.

---

#### CG-009 · P1 · BUG — Destructive recover-sqlite-corruption / rollback-bad-apply bypass confirm gate when graph is fresh or soft-stale

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:400-455`
- **Source:** workflow:recovery-apply-path

**Evidence**

```
Line 415-429 is the ONLY confirm gate:
  if (classification.state === 'hard-stale' && args.confirm !== true) { ... return aborted ... }
It fires only for hard-stale. For an explicit destructive op on a fresh/soft-stale graph the flow falls through: line 400 noop branch is skipped because `args.operation !== undefined`; line 415 is skipped (not hard-stale); line 431 dryRun skipped; then line 455 `dispatchOperation` runs. dispatchOperation never re-checks confirm for these ops (lines 268-285):
    case 'recover-sqlite-corruption': return { recovery: await recoverSqliteCorruption({...}) };
    case 'rollback-bad-apply': return { recovery: await rollbackBadApply({...}) };
recoverSqliteCorruption() then runs `moveTriplet(dbDir, quarantineDir)` (recovery-procedures.ts:174) which MOVES the live code-graph.sqlite out of the DB dir. The orchestrator test at apply-orchestrator.vitest.ts:138-156 proves an explicit destructive op (`prune-excludes`) on a `fresh` graph reaches dispatch and commits with no confirm.
```

**Why it's wrong:** ARCHITECTURE.md:138 documents all five operations as 'Gated recovery operations' and playbook 023 (code-graph-apply-sub-operations.md:50-56, pass row 4) asserts recover-sqlite-corruption 'Refuses without confirm'. In reality a caller passing `operation:'recover-sqlite-corruption'` (or 'rollback-bad-apply') against a healthy/soft-stale graph performs an unconfirmed destructive move of the live DB triplet — data-loss without acknowledgement, contradicting the documented gate.

**Suggested fix:** In dispatchOperation, gate the inherently-destructive ops on `args.confirm === true` regardless of classification state (e.g. add `if ((operation==='recover-sqlite-corruption'||operation==='rollback-bad-apply') && args.confirm!==true) throw new Error('... requires confirm=true')`), or move the confirm check ahead of dispatch for all destructive operations rather than only hard-stale.

**Verification:** CONFIRMED. The control-flow gap is real and end-to-end reachable.

Code verification (all quotes match real source):
- apply-orchestrator.ts:400 noop branch guarded by `args.operation === undefined` (skipped when operation is set). MATCH.
- apply-orchestrator.ts:415 is the ONLY orchestrator-level confirm gate, and it fires only for `classification.state === 'hard-stale'`. MATCH.
- chooseOperation (line 230-235) returns the requested operation verbatim if provided — `recover-sqlite-corruption`/`rollback-bad-apply` pass straight through to dispatch.
- classifyApplyState (line 157-228) derives state purely from freshness/trust/staleness/schema/battery signals; it has ZERO awareness of the requested operation. So a fresh (freshness='fresh', canonicalReadiness='ready', trustState='live') or soft-stale graph classifies as non-hard-stale regardless of the destructive op requested. This is the linchpin that makes the bypass real.
- dispatchOperation cases at lines 268-285 for `recover-sqlite-corruption` and `rollback-bad-apply` do NOT re-check `args.confirm`, in clear contrast to `prune-excludes` (line 293: `confirm !== true` blocks medium-tier) and `repair-nodes` (line 337: throws if `confirm !== true`). This asymmetry is the core defect — two of the four mutating ops have inner confirm gates, the two most destructive ones do not.
- recovery-procedures.ts:174 `moveTriplet(dbDir, quarantineDir)` MOVES (renameSync, line 103) the live code-graph triplet out of the DB dir. MATCH.
- handlers/apply.ts:24 passes args straight to applyCodeGraph with no pre-gate. No upstream guard exists.

Doc/spec contradiction confirmed:
- ARCHITECTURE.md:138 lists all five as "Gated recovery operations". MATCH.
- Playbook 023 lines 50-56 + pass-criteria row 4: "recover-sqlite-corruption | Refuses without confirm". MATCH. Reality: it refuses ONLY when the graph is independently hard-stale; on a fresh/soft-stale graph it dispatches with no confirm.

Test corroboration: the orchestrator test proves prune-excludes on a `fresh` graph reaches dispatch and returns status 'committed' with no confirm (only the inner medium-tier gate blocks). The structurally identical recover-sqlite-corruption / rollback-bad-apply paths have NO such inner gate, so they would commit the destructive move unconfirmed.

Two corrections to the finding (do not change the verdict):
1. The cited test file path is wrong: it is `mcp_server/tests/code-graph-apply-orchestrator.vitest.ts` (the finding dropped the `code-graph-` prefix, writing `apply-orchestrator.vitest.ts`). The cited lines 138-156 and the `expect(committed.status).toBe('committed')` content match the real file exactly.
2. Not pure data-loss: recoverSqliteCorruption first runs `copyTriplet` to a recovery dir (line 172) BEFORE moveTriplet, so the DB is backed up to recovery-<ts>/ and quarantine-<ts>/ rather than destroyed. The live triplet is still moved out and a full rescan is triggered without acknowledgement, which is a destructive but recoverable side effect.

Severity corrected P0 -> P1. It is a genuine gate-bypass that violates documented behavior and performs an unacknowledged destructive move + rescan, but: (a) it requires an explicit caller to pass operation:'recover-sqlite-corruption'/'rollback-bad-apply' (not a default/passive path), (b) the data is preserved via the recovery/quarantine copies plus the orchestrator's known-good snapshot taken at line 446 before dispatch, and (c) the destructive ops still run the pre/post gold battery. Real, worth fixing, but the recoverability and explicit-opt-in requirement put it below true P0 catastrophic data-loss. The proposed fix (gate these two ops on confirm===true inside dispatchOperation regardless of classification, mirroring repair-nodes' inner gate) is correct.

---

#### CG-010 · P1 · BUG — Failed rollback is still reported as status 'rolled-back' / 'rollback executed', masking data loss

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:458-506`
- **Source:** workflow:recovery-apply-path

**Evidence**

```
Catch path (line 458):
    const recovery = await rollbackBadApply({...});
    appendAudit(logPath, 'rollback', { reason: ..., recovery }, now);
    recordApplyMetadata({ status: 'rolled-back', ... });
    return { status: 'rolled-back', ..., recovery, message: 'Apply operation failed; rollback executed.' };
The identical pattern at lines 484-505 (postflight-fail). Neither branch inspects `recovery.status`. rollbackBadApply (recovery-procedures.ts:289-306) can return `{ status: 'failed', restored: false }` after it has already executed `moveTriplet(dbDir, quarantineDir)` (line 263) — i.e. the live DB is in quarantine and was NOT restored (e.g. findLatestKnownGood returned null, recovery-procedures.ts:264-268).
```

**Why it's wrong:** When rollback itself fails, the live DB triplet has been moved to quarantine and not restored, yet the orchestrator persists `status:'rolled-back'` and returns the reassuring message 'rollback executed.' The operator believes the graph was safely restored when it is actually empty/missing — silent data loss with a success-shaped report. ARCHITECTURE.md:138 promises 'Rollback restores the last known-good baseline', which is not guaranteed here.

**Suggested fix:** After calling rollbackBadApply, check `recovery.status === 'failed'` (or `!recovery.restored`) and surface a distinct status (e.g. 'rollback-failed') with an explicit data-loss warning instead of unconditionally returning 'rolled-back'.

**Verification:** Quotes verified exact. apply-orchestrator.ts:458-478 (catch path) and 483-506 (postflight-fail path) both call rollbackBadApply, then unconditionally recordApplyMetadata({status:'rolled-back'}) and return status:'rolled-back' with messages "Apply operation failed; rollback executed." / "Post-flight gold battery failed; rollback executed." Neither branch inspects recovery.status or recovery.restored — confirmed via repo-wide rg: NO consumer anywhere reads recovery.status/.restored. recovery-procedures.ts:249-306 rollbackBadApply executes moveTriplet(dbDir, quarantineDir) at line 263 (live DB -> quarantine) BEFORE attempting restore. ARCHITECTURE.md:138 does promise "Rollback restores the last known-good baseline." So the core bug is REAL: a rollback that does not restore is still reported as a reassuring "rolled-back / rollback executed", masking an empty/missing live DB.

CORRECTION to the finding's mechanism (the cited example is wrong): the finding claims the findLatestKnownGood-returns-null case yields {status:'failed', restored:false}. It does NOT. Tracing lines 261-288, when findLatestKnownGood returns null no exception is thrown, so the function falls through to the success return at 280-288 with status:'ok', restored:false. The status:'failed' branch (298-305) fires ONLY on a thrown exception (e.g. restoreTriplet/moveTriplet/db throws). Consequence: the finding's PRIMARY suggested fix (check recovery.status === 'failed') would FAIL to catch its own headline scenario (no known-good baseline = silent loss with status:'ok'). The correct guard is the finding's secondary alternative: !recovery.restored (combined with restored being false/undefined), since restored is the only signal distinguishing a real restoration from a quarantine-but-no-restore. So: bug CONFIRMED and data-loss-masking is genuine, but the diagnosis of the failure path is partially incorrect and the recommended fix is insufficient as written.

Severity: P1 stands — silent data loss on a recovery path reported as success, with the type system (status:'ok'|'failed', restored?:boolean) plainly exposing the unchecked signal. Not P0 because it requires a secondary failure (rollback unable to restore) on an already-failing apply, not a routine path.

---

## 4. P2 Findings (27)

#### CG-011 · P2 · MISALIGNMENT — trustState reference documents verified/unverified/quarantined, but the field only emits live/stale/absent/unavailable

- **Location:** `.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md:66-72`
- **Source:** cli-opencode (gpt-5.5-fast xhigh)

**Evidence**

```
references/readiness/readiness_and_scope_fingerprint.md:66-72 documents Trust State values `verified` / `unverified` / `quarantined` and says "code_graph_status returns both readiness and trustState in one call."
VS lib/readiness-contract.ts:103-118 queryTrustStateFromFreshness(): fresh->live, stale->stale, empty->absent, error->unavailable (module comment 16-22 confirms the 4-value subset).
status.ts:337 emits trustState: readinessBlock.trustState (the freshness projection).
```

**Why it's wrong:** The doc's verification-trust vocabulary (verified/unverified/quarantined) actually corresponds to the SEPARATE goldVerificationTrust field (status.ts:353), not the freshness-derived trustState field. Operators/automation waiting for `quarantined`/`verified` on `trustState` will never see them — a field-naming conflation.

**Suggested fix:** Document the runtime trustState enum (live/stale/absent/unavailable) and describe the verification axis under its real field name (goldVerificationTrust), or rename one field for clarity.

**Verification:** CONFIRMED by direct read of readiness-contract.ts:103-118 + status.ts:337/353 + the reference doc.

---

#### CG-012 · P2 · MISALIGNMENT — index.ts doc claims MK_CODE_INDEX_ROOT_DIR controls readiness-marker path resolution, but it does not

- **Location:** `.opencode/skills/system-code-graph/mcp_server/index.ts:9-13, 122`
- **Source:** direct verification (Claude)

**Evidence**

```
index.ts:9-13 (module doc) "MK_CODE_INDEX_ROOT_DIR — Workspace root directory used for the readiness marker path resolution. When set, this value replaces process.cwd()."
index.ts:122  writeCodeGraphReadinessMarker(process.env.MK_CODE_INDEX_ROOT_DIR || process.cwd());
VS readiness-marker.ts:220-264: the function writes to the import-time constant CODE_GRAPH_READINESS_MARKER_PATH and uses its workspaceRoot argument only for the readiness snapshot + JSON body, never for the file path.
```

**Why it's wrong:** Setting MK_CODE_INDEX_ROOT_DIR does NOT relocate the marker file (the path is fixed at import from process.cwd()/SPECKIT_CODE_GRAPH_DB_DIR). The documented behavior is false.

**Suggested fix:** Either make writeCodeGraphReadinessMarker derive the marker path from its workspaceRoot argument, or correct the index.ts doc comment to state the marker path is fixed at import from process.cwd()/SPECKIT_CODE_GRAPH_DB_DIR.

**Verification:** CONFIRMED by direct read of index.ts:9-13/122 + readiness-marker.ts path constant (18-22) and function (220-264).

---

#### CG-013 · P2 · BUG — DB-dir resolution divergence: core/config.ts walks __dirname to .opencode; readiness-marker.ts uses process.cwd()

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/readiness-marker.ts:18-22`
- **Source:** direct verification (Claude)

**Evidence**

```
lib/readiness-marker.ts:18-22
  export const CODE_GRAPH_READINESS_MARKER_BASE_DIR = resolve(process.cwd(), process.env.SPECKIT_CODE_GRAPH_DB_DIR || '.opencode/.spec-kit/code-graph/database');
VS core/config.ts:19-46 resolveWorkspaceRoot() walks __dirname up to the `.opencode` segment (CWD-independent) and resolves DATABASE_DIR against it.
```

**Why it's wrong:** The two resolvers agree only when process.cwd() == the walked workspace root (true when launched with --dir <repo-root> or when SPECKIT_CODE_GRAPH_DB_DIR is set, which the launcher does in production). Launched from another CWD without the env var, the readiness marker (and status's marker write, CG-001) lands in a different `.opencode/.spec-kit` dir than the actual SQLite DB. database_path_policy.md requires one shared triplet.

**Suggested fix:** Resolve CODE_GRAPH_READINESS_MARKER_BASE_DIR from the same canonical resolver as core/config.ts (DATABASE_DIR) instead of process.cwd(), so marker and DB always co-locate.

**Verification:** CONFIRMED by direct read. Latent in production (launcher pins SPECKIT_CODE_GRAPH_DB_DIR), real when that env is unset and cwd != workspace root.

---

#### CG-014 · P2 · MISALIGNMENT — database_path_policy.md cites a non-existent resolver file mcp_server/lib/database-paths.ts

- **Location:** `.opencode/skills/system-code-graph/references/config/database_path_policy.md:§1 Key Sources`
- **Source:** direct verification (Claude)

**Evidence**

```
database_path_policy.md §1 Key Sources: "`mcp_server/lib/database-paths.ts` for runtime path resolution."
VS filesystem: that file does NOT exist; the real resolvers are core/config.ts (DATABASE_DIR) + lib/canonical-db-dir.ts (resolveCanonicalDbDir).
```

**Why it's wrong:** A reader/agent following the policy doc to the path resolver lands on a missing file, breaking traceability for the DB-path subsystem.

**Suggested fix:** Update Key Sources to cite mcp_server/core/config.ts and mcp_server/lib/canonical-db-dir.ts.

**Verification:** CONFIRMED: `ls` of lib/database-paths.ts → No such file; canonical-db-dir.ts + core/config.ts exist and contain the resolution logic.

---

#### CG-015 · P2 · BUG — shutdownCodeIndex has no re-entrancy guard; concurrent triggers double-invoke ipcBridge.close()

- **Location:** `.opencode/skills/system-code-graph/mcp_server/index.ts:95-117`
- **Source:** workflow:concurrency-ipc

**Evidence**

```
```
async function shutdownCodeIndex(reason: string): Promise<void> {
  ...
  if (ipcBridge) {
    await ipcBridge.close().catch(...);
    ipcBridge = null;
  }
  closeDbWithAssertion();
}
```
Four independent triggers call this: SIGINT (112-114), SIGTERM (115-117), owner-lease-mismatch timer (`void shutdownCodeIndex('owner lease moved...')`, line 51), and idle `onIdle` (line 136).
```

**Why it's wrong:** `ipcBridge` is only set to null AFTER the `await ipcBridge.close()` resolves. If a second trigger fires while the first is awaiting close() (e.g. the lease-mismatch shutdown is in flight when the launcher's reapOwnerBeforeRespawn sends SIGTERM — see mk-code-index-launcher.cjs:462), both pass the `if (ipcBridge)` check and call `ipcBridge.close()` on the same handle twice. The second call re-enters socket-server close() (net.Server.close() on an already-closing server, second fs.unlinkSync). It is mostly benign here (closeDbWithAssertion guards on `if (db)`, ENOENT is swallowed), but it is an unguarded double-shutdown that the code structure does not prevent.

**Suggested fix:** Add a module-level `let shuttingDown = false;` (or cache the in-flight promise) at the top of shutdownCodeIndex: `if (shuttingDown) return shutdownPromise; shuttingDown = true;` so all triggers await one shutdown.

**Verification:** Quote matches real code at .opencode/skills/system-code-graph/mcp_server/index.ts:95-117. shutdownCodeIndex is async and sets `ipcBridge = null` only AFTER `await ipcBridge.close()` (lines 102-108), so there is a genuine async window. Node is single-threaded, but the await yields the event loop, so a second distinct trigger CAN interleave and both pass the `if (ipcBridge)` check → double ipcBridge.close(). The four triggers exist as cited: SIGINT (112-114), SIGTERM (115-117), lease-mismatch `void shutdownCodeIndex(...)` (line 51), onIdle (line 136). Each individual trigger is self-guarded against re-firing its OWN source (process.once for signals; ownerLeaseMismatchShutdownStarted flag set BEFORE the lease call at line 50; idle monitor sets stopped=true before onIdle at launcher-idle-timeout.ts:106), so the race REQUIRES two DIFFERENT triggers — which is structurally possible (e.g. lease-mismatch shutdown in flight when SIGTERM arrives).

So the structural claim is real → CONFIRMED, not REFUTED. HOWEVER two caveats lower its weight:
1) The harm is nil and the finding admits it ("mostly benign"). I verified every downstream path is idempotent/guarded: socket-server.ts close() iterates an already-cleared activeSockets set; net.Server.close() second call passes ERR_SERVER_NOT_RUNNING to a callback that ignores its arg and just resolves(); fs.unlinkSync swallows ENOENT (socket-server.ts:268-273); closeDb guards on `if (db)` (code-graph-db.ts:303); and on the 2nd pass closeDbWithAssertion passes handle=null so assertDbHandleClosed returns immediately (close-db-assertion.ts:15) — no throw. Worst case is a duplicate log line. No corruption, crash, or leak.
2) The specific causal pointer is fabricated: `mk-code-index-launcher.cjs:462` does NOT exist in this repo. `reapOwnerBeforeRespawn` appears only in docs/changelog and one vitest, never in an actual launcher source. So that piece of "evidence" is unsupported, though the general two-trigger race stands without it.

Net: a real but fully-benign latent hardening item, not a behavioral bug. P2 is the correct ceiling (arguably borderline-below-actionable); does not rise to P1/P0. The proposed fix (module-level shuttingDown flag caching the in-flight promise) is reasonable defensive hardening.

---

#### CG-016 · P2 · BUG — Stale-lease reclaim path is non-exclusive: two racing acquirers can BOTH win the single-writer lease

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:242-291`
- **Source:** workflow:concurrency-ipc

**Evidence**

```
Lines 287-290 (reclaim path when an existing stale lease is present):
```
  writeOwnerLeaseAtomic(leasePath, lease);
  return existing
    ? { acquired: true, lease, leasePath, reclaimed: existing, classification: existingClassification }
    : { acquired: true, lease, leasePath };
```
writeOwnerLeaseAtomic (lines 98-113) is a write-tmp + renameSync(tempPath, leasePath) — last-writer-wins overwrite, NOT exclusive. Only the `!existing` branch (lines 268-271) uses the exclusive `writeOwnerLeaseExclusive` (flag 'wx', returns false on EEXIST). The reclaim branch has no exclusivity or compare-and-swap.
```

**Why it's wrong:** When a stale/dead/orphaned lease exists, classifyOwner returns a reclaimable class for ALL concurrent acquirers. Each independently sees the same stale `existing`, falls through to line 287, renames its own lease over leasePath, and returns acquired:true. Both processes believe they are the sole owner of the single-writer SQLite path — the exact single-writer invariant the lease exists to protect. The single-winner unit test (owner-lease.vitest.ts:77) only exercises the `!existing` exclusive-create branch, so this gap is untested.

**Suggested fix:** On the reclaim branch, replace the unconditional renameSync overwrite with a compare-and-swap: re-read the lease after acquiring an exclusive lock (or use rename-from-a-token + re-read-and-verify ownerPid), and return acquired:false if another process's lease is now present.

**Verification:** Quote is 100% accurate. owner-lease.ts:287-290 matches verbatim; writeOwnerLeaseAtomic (98-113) is write-tmp + renameSync = last-writer-wins, and only the !existing branch (268-271) uses the exclusive writeOwnerLeaseExclusive (open flag 'wx', returns false on EEXIST). The reclaim branch (lines 286-290) genuinely has NO exclusivity/CAS. The race mechanics are correct in isolation: concurrent acquirers that all observe the same stale `existing` lease each get a reclaimable classification (stale-pid/stale-heartbeat-reclaim/ppid-1-orphan), each fall through to line 287, each renameSync their own lease over leasePath, and each return acquired:true. The test-gap claim is also accurate: owner-lease.vitest.ts:77 ('allows exactly one fresh concurrent acquire to win') uses a fresh dbDir so both acquirers hit the !existing exclusive path; the single reclaim test (line 117) is single-acquirer only, so the reclaim race is untested.

WHY DOWNGRADED FROM P1 TO P2 (production impact is overstated, not the mechanics):
1. acquireOwnerLease in owner-lease.ts is effectively DEAD CODE in production. Repo-wide search shows NO caller except the vitest. The server entrypoint (mcp_server/index.ts:20) imports only refreshOwnerLease + closeDbWithAssertion, never acquireOwnerLease. lib/index.ts re-exports it via `export *` but nothing consumes it.
2. The REAL production single-writer enforcement lives in a separate standalone file, .opencode/bin/mk-code-index-launcher.cjs, which has its OWN parallel implementation acquireOwnerLeaseFile() (lines 344-373) carrying the identical non-exclusive reclaim shape (writeOwnerLeaseFile at line 370). So the defect class is real on the production path — BUT there it is guarded by defense-in-depth: after acquireOwnerLeaseFile() (line 810) the launcher acquires a separate mkdir-based bootstrapLock (acquireBootstrapLock, line 840) AND performs a launcher-lease read-after-write re-probe / CAS (writeLeaseFile then reprobe at lines 846-852: `if (!reprobe || reprobe.pid !== process.pid) process.exit(0)`). That outer CAS forces the losing racer to exit before launchServer(), so two SQLite single-writer servers do not actually both launch — the exact invariant the finding claims is broken is in practice protected by the launcher.

Net: the asymmetry (exclusive create vs. last-writer-wins reclaim) and the untested reclaim race are genuine latent correctness gaps in shared library code, and the fix (CAS/re-read-verify on the reclaim branch) is sound and would also harden the launcher's parallel copy. But the P1 framing ('two racing acquirers BOTH win the single-writer lease', breaking the SQLite invariant) does not hold in production because (a) this specific function is uncalled and (b) the production launcher has an outer lock + lease re-probe. P2 is the accurate severity: real defect, hardening-worthy, no demonstrated production data-corruption path.

---

#### CG-017 · P2 · BUG — refreshOwnerLease has a read-then-write TOCTOU that can clobber a lease just taken by a new owner

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:301-309`
- **Source:** workflow:concurrency-ipc

**Evidence**

```
```
  const holder = existsSync(leasePath) ? readOwnerLease(canonicalDbDir) : null;
  if (!holder || holder.ownerPid !== ownerPid) return false;

  writeOwnerLeaseAtomic(leasePath, {
    ...holder,
    ...patch,
    lastHeartbeatIso: now.toISOString(),
  });
```
```

**Why it's wrong:** Between the read (line 301, holder.ownerPid===ownerPid passes) and the renameSync overwrite inside writeOwnerLeaseAtomic, another process can reclaim the lease (because the reclaim path itself is non-exclusive — see prior finding) and write its own ownerPid. The heartbeat refresh then overwrites that fresh lease, resurrecting the old owner's record. The 'does not refresh after ownership transfers' test (owner-lease.vitest.ts:198) is sequential only and does not catch the interleaved case. The launcher heartbeat timer (mcp_server/index.ts:46-57) calls this every ~20s, so the window recurs continuously.

**Suggested fix:** Make the read+write atomic: hold an exclusive lock for the duration, or write to a temp file and renameSync only after re-verifying the on-disk ownerPid still equals `ownerPid` immediately before the rename.

**Verification:** Quote is exact. /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts lines 301-309 match the finding verbatim. All supporting references check out: (1) writeOwnerLeaseAtomic (line 98-113) uses renameSync (line 103) which overwrites the target unconditionally with no lock or CAS; (2) the reclaim path in acquireOwnerLease (line 287) also uses the same non-exclusive writeOwnerLeaseAtomic, so a reclaiming process does NOT use exclusive write (only the cold-acquire !existing path at line 269 uses writeOwnerLeaseExclusive); (3) the heartbeat timer at index.ts:44-57 calls refreshOwnerLease every TTL/3 (60_000/3 = ~20s); (4) the test at owner-lease.vitest.ts:198 ("does not refresh after ownership transfers") is sequential (writes firstOwner then nextOwner then refreshes) and does not exercise the interleaved read-then-reclaim-then-write case.

The TOCTOU is structurally real: refreshOwnerLease reads at line 301, checks holder.ownerPid===ownerPid at 302, then overwrites via renameSync at 304 with no re-verification and no exclusive lock. If a concurrent process reclaimed the lease between the read and the rename, the heartbeat would clobber the new owner's lease and resurrect the old owner's ownerPid (line 304 writes {...holder,...} where holder is the stale read). The reclaim leg is only reachable for live owners (ppid-1-orphan or stale-heartbeat-reclaim classifications), where the orphaned/lagging owner's heartbeat timer is still firing — for stale-pid the owner is dead so its timer cannot race. So the live race is genuine for the orphan/stale-heartbeat cases.

IMPORTANT severity scoping: the concurrent-reclaim writer (acquireOwnerLease, the only function that overwrites a still-claimed lease at line 287) is exported but NOT wired into any production path in the current build. index.ts imports/calls only refreshOwnerLease (line 20, 48); the IPC launcher files (lib/ipc/launcher-idle-timeout.ts, socket-server.ts) never reference the lease; a repo-wide search found acquireOwnerLease referenced only by owner-lease.ts itself, its vitest, and lib/README.md. Multiple refreshOwnerLease callers alone cannot trigger the race (a non-owner returns false at line 302 without writing). So this is a latent defect in the lease primitive that will activate once acquisition/reclaim is wired (the recent F3'/RC-3 single-winner-respawn commits are clearly heading there), not an actively-firing bug today. P2 is correct: latent correctness defect, narrow syscall-width window, owner-flapping fallout (resurrected pid -> next refresh returns false -> spurious self-shutdown) rather than data corruption or security impact. The proposed fix (re-verify on-disk ownerPid immediately before rename, or hold an exclusive lock across read+write) is appropriate.

---

#### CG-018 · P2 · BUG — serialize()/deserialize() silently drop all symbol-level tracking (round-trip data loss)

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/working-set-tracker.ts:71-87`
- **Source:** workflow:concurrency-ipc

**Evidence**

```
```
  serialize(): Record<string, FileAccess> {
    const obj: Record<string, FileAccess> = {};
    for (const [key, value] of this.files) {
      obj[key] = value;
    }
    return obj;
  }
  static deserialize(data: Record<string, FileAccess>): WorkingSetTracker {
    const tracker = new WorkingSetTracker();
    for (const [key, value] of Object.entries(data)) {
      tracker.files.set(key, value);
    }
    return tracker;
  }
```
```

**Why it's wrong:** The class maintains two maps — `files` (line 17) and `symbols` (line 113) — and getTopSymbols/symbolCount read from `symbols`. serialize() only writes `files` and deserialize() only restores `files`. After a serialize→persist→deserialize cycle (the documented 'hook state persistence' use, comment line 71), all symbol accesses are gone, so getTopSymbols() returns empty and compaction context loses symbol prioritization. The asymmetry is silent (no error). Currently no production caller round-trips it, so impact is latent, but the method contract is broken as written.

**Suggested fix:** Extend serialize() to emit both `{ files, symbols }` and deserialize() to restore both maps (bump the serialized shape to a versioned object rather than a bare Record<string, FileAccess>).

**Verification:** Quote matches lines 71-87 exactly, including the "for hook state persistence" comment at line 71. The two-map structure is real: `files` (line 17) and `symbols` (line 113). `getTopSymbols()` (line 136) and `symbolCount` (line 150) read ONLY from `this.symbols`. `serialize()` iterates only `this.files`; `deserialize()` restores only `tracker.files`. The asymmetry is silent — no error. After a serialize->deserialize cycle, the restored `symbols` map is empty, so `getTopSymbols()` returns [] and `symbolCount` is 0. The method contract is genuinely broken as written.

Two nuances that keep this at P2 (and the finding already concedes the first):
1) LATENT — no production round-trips it. `rg` across `.opencode/` finds zero production callers of `serialize()`/`deserialize()`. The only `n.deserialize(tracker.serialize())` round-trip is in the test `compact-merger.vitest.ts:35`, and that test only asserts `getTrackedFiles()` (file-level), so it never catches the symbol loss. No handler instantiates WorkingSetTracker -> trackSymbol -> persist -> restore -> getTopSymbols.
2) PARTIAL MITIGATION — `trackSymbol()` calls `trackFile(filePath, [fqName])` at line 132, so each symbol's fqName is also stored in the file entry's `symbolRefs[]`. Those file-level `symbolRefs` DO survive the round-trip (verified by the test's intent at line 33). So the documented "feed tracked files into compact merger" path retains a coarse file-level symbol proxy; only the dedicated per-symbol recency/frequency prioritization (getTopSymbols/symbolCount) is lost.

Net: real broken-contract defect, silent, but latent with partial mitigation. P2 (low) is the correct band — not P1, because there is no current production data-loss path and file-level prioritization still works. The proposed fix (versioned `{ files, symbols }` shape) is correct.

---

#### CG-019 · P2 · MISALIGNMENT — lib/README.md §7 Entrypoints documents a `CodeGraphDatabase` Class that does not exist — code-graph-db.ts exports only free functions

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/README.md:228`
- **Source:** workflow:db-sql-persistence

**Evidence**

```
README §7 ENTRYPOINTS table:
| `CodeGraphDatabase` | Class | Reads and writes SQLite graph state. |
Grep for `class CodeGraphDatabase` / `CodeGraphDatabase` across mcp_server (excluding dist/tests) returns nothing; `grep '^export class\|^class ' code-graph-db.ts` returns nothing. The module is entirely `export function initDb/getDb/upsertFile/replaceNodes/...`.
```

**Why it's wrong:** The README is the canonical reference for the cluster's primary file. Documenting a non-existent class as the storage entrypoint misleads consumers/agents into importing `CodeGraphDatabase` (which will fail), and obscures the actual functional API. The README also markets §6 'callers should not write database files directly' against a class that isn't there.

**Suggested fix:** Replace the `CodeGraphDatabase | Class` row with the real functional surface (e.g. `initDb()/getDb()/closeDb()`, `upsertFile()/replaceNodes()/replaceEdges()/removeFile()`, `getStats()/queryOutline()` etc.).

**Verification:** CONFIRMED. README line 228 verbatim: `| `CodeGraphDatabase` | Class | Reads and writes SQLite graph state. |` in the §7 ENTRYPOINTS table. code-graph-db.ts (the cluster's primary storage file, lines 1-1246) exports ZERO classes — verified `grep ^export class|^class` returns nothing (exit 1). It exports only free functions (initDb/getDb/closeDb/closeDbWithAssertion at 260/295/302/310, upsertFile@572, replaceNodes@684, replaceEdges@718, removeFile@858, queryOutline@873, getStats@1095, cleanupOrphans@1144, plus ~40 metadata/diagnostic helpers) and interfaces/types/consts (SCHEMA_VERSION@104, etc.). index.ts re-exports via `export * from './code-graph-db.js'`, so the public surface is purely functional and `CodeGraphDatabase` is not exported anywhere (only occurrence in non-dist source is the README itself). No `*Database` class exists anywhere in lib. The defect is real and the fix (replace the Class row with the real functional surface) is accurate.

Two corrections to the finding's "why": (1) The claim that §6 'markets callers should not write database files directly against a class that isn't there' is imprecise — README line 198 correctly attributes storage to the FILE `code-graph-db.ts`, not to a CodeGraphDatabase class, so that sentence is fine. The defect is isolated to the §7 entrypoint row. (2) Severity P2 is correct: doc-only accuracy defect in the canonical reference; no shipped runtime fails — breakage only if a consumer hand-imports the phantom symbol. Low blast radius, not P1.

---

#### CG-020 · P2 · BUG — replaceEdges() runs an UNCONDITIONAL full-table orphan-cleanup DELETE (NOT IN subquery anti-join) inside EVERY per-file transaction during a scan

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:726-758`
- **Source:** workflow:db-sql-persistence

**Evidence**

```
Inside the per-file transaction, after inserting this file's edges, an unguarded whole-table sweep always runs:
    d.prepare(`
      DELETE FROM code_edges WHERE
        source_id NOT IN (SELECT symbol_id FROM code_nodes) OR
        target_id NOT IN (SELECT symbol_id FROM code_nodes)
    `).run();
It is not guarded by sourceIds.length/edges.length and is called once per file from ensure-ready.ts:582 graphDb.replaceEdges(sourceIds, result.edges).
```

**Why it's wrong:** persistIndexedFileResult is invoked once per indexed file, and replaceEdges therefore executes this O(edges) NOT-IN anti-join across the ENTIRE code_edges table on every single file write, inside the write transaction (holding the writer lock). For a multi-thousand-file scan this is O(files × total_edges) of redundant full-table scanning while holding the lock, directly antagonizing the 5s busy_timeout (line 270) and the WAL concurrency goal. The cleanup only needs to run once at end-of-scan, not per file.

**Suggested fix:** Remove the per-file global orphan sweep from replaceEdges; run a single cleanupOrphans()-style sweep once after the scan completes (or gate it behind a final-file flag).

**Verification:** CONFIRMED. The quoted DELETE at code-graph-db.ts:753-757 matches the real source verbatim, and it sits inside replaceEdges()'s per-file transaction (tx at 726, runs at 759). Unlike the source-side DELETE (line 727-730, guarded by sourceIds.length>0) and the inserts (guarded by the retainedSourceIds set), this whole-table `source_id/target_id NOT IN (SELECT symbol_id FROM code_nodes)` anti-join is genuinely UNGUARDED — it runs unconditionally on every call.

Caller chain verified exactly as stated: ensure-ready.ts:582 calls graphDb.replaceEdges(sourceIds, result.edges) inside persistIndexedFileResult()'s per-file transaction (566-591), which the scan loop at ensure-ready.ts:536-544 invokes once per indexed file. So the full-table NOT IN scan executes once per file, inside the write transaction holding the writer lock. busy_timeout=5000 (line 270) and journal_mode=WAL (line 271) are confirmed at the cited locations, so the contention-vs-concurrency-goal reasoning holds.

Performance reasoning holds even accounting for indexes: idx_edges_source/idx_edges_target and idx_nodes_symbol_id exist (lines 176,180-181), but the DELETE must still scan every code_edges row to test the NOT IN predicate, so the cost is O(total_edges) per file → O(files × total_edges) per scan. Indexes accelerate the membership probe but not the mandatory outer full scan.

Redundancy/fix is sound: cleanupOrphans() at line 1144 already performs the byte-identical edge orphan sweep (1152-1156), confirming a single end-of-scan sweep is both viable and pre-existing. One nuance worth recording: the sweep is NOT purely cosmetic — the per-file insert guard (746-749) only suppresses edges with missing SOURCE nodes, so cross-file dangling TARGET edges still need a global sweep. But that sweep is idempotent and only depends on the FINAL node set, so per-file execution is redundant work, not a per-file correctness requirement. The end-of-scan fix preserves correctness.

Severity P2 is correct: real scan-scoped performance + writer-lock-contention inefficiency, but no correctness, data-loss, or security impact (final DB state is identical), and auto-index scans are timeout-guarded. Not P1 (behavior is correct, just wasteful); not lower than P2 given the O(files × total_edges) blowup on large repos while holding the writer lock.

---

#### CG-021 · P2 · BUG — overlapsPreImage compares pre-image hunk coords against post-image node ranges → false-positive symbol attribution in multi-hunk files

- **Location:** `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:337-340`
- **Source:** workflow:diff-line-math

**Evidence**

```
const overlapsPreImage = hunk.oldLines > 0 && rangesOverlap(
          node.startLine, nodeLines,
          hunk.oldStart, hunk.oldLines,
        );

        if (!overlapsPostImage && !overlapsPreImage) continue;
```

**Why it's wrong:** `node.startLine`/`nodeLines` come from queryOutline (code-graph-db.ts:873-880), which stores POST-image (current working-tree) line ranges. But `hunk.oldStart`/`hunk.oldLines` are PRE-image coordinates. These two coordinate spaces only coincide when no earlier hunk in the same file shifted lines. Once an earlier hunk adds/removes lines, the pre-image start of a later hunk can land inside an unrelated symbol's post-image range. Concrete case: an early hunk adds 30 lines; a later modification hunk is `@@ -15,3 +45,3 @@` (real change at post-image 45-47). A function fn-x at post-image lines 15-20 is untouched, yet overlapsPreImage = rangesOverlap(15,6, 15,3) → aEnd=20,bEnd=17 → 15<=17 && 15<=20 → true, so fn-x is reported as affected. detect_changes is a preflight whose contract is mapping a diff to the symbols it touches; emitting symbols that were not changed is a contract break (over-attribution), and the existing tests only exercise single-hunk diffs (test line 438 `@@ -7,2 +7,3 @@`, stress test uses one hunk per line with identical old/new starts) so this never fires in coverage.

**Suggested fix:** Drop the pre-image overlap check for ordinary modification hunks; attribute using post-image (newStart/newLines) only, and special-case pure-delete (newLines=0) by mapping the deletion point to the post-image gap (newStart) rather than comparing pre-image oldStart against post-image node ranges.

**Verification:** Quote matches verbatim at detect-changes.ts:337-340 (plus the gating `if (!overlapsPostImage && !overlapsPreImage) continue;` at line 342). The reasoning holds against full context:

- queryOutline (lib/code-graph-db.ts:873-880; finding cited 873-880, exact) reads `code_nodes` rows directly from the indexed working-tree scan → post-image coordinates. Confirmed.
- hunk.oldStart/oldLines are pre-image, newStart/newLines post-image (diff-parser.ts:32-39 doc comments). Confirmed.
- parseUnifiedDiff stores oldStart/newStart verbatim with NO rebasing (lib/diff-parser.ts:192-199), so in any real multi-hunk git diff a later hunk's pre-image oldStart is offset from its post-image newStart by the cumulative line delta of earlier hunks — exactly the coordinate-space mismatch claimed.
- rangesOverlap math verified independently. Worked example with untouched fn-x at post-image 15-20 and a real later hunk `@@ -15,3 +45,3 @@`: overlapsPostImage = rangesOverlap(15,6,45,3) = false (correct, real change is at post-image 45-47); overlapsPreImage = rangesOverlap(15,6,15,3) = (15<=17 && 15<=20) = true (spurious). Net: fn-x is wrongly attributed. Bug fires.
- Test-coverage gap is real: the only attribution test (detect-changes.test.ts:438) uses a single hunk with oldStart===newStart===7, so pre/post coordinates coincide and the false positive cannot surface. parseUnifiedDiff tests are parser-only; the multi-file test (line 541) uses separate files, not shifted multi-hunk attribution. Nothing stress-tests the pre-image branch for false positives.

The pre-image branch is intentional (comments at lines 322-324 and rangesOverlap doc at 290-293) to attribute pure-delete hunks (newLines=0), but it is applied unconditionally to every hunk with oldLines>0, including ordinary modifications — that is the defect.

Severity correction P1 → P2: the failure mode is conservative OVER-attribution (extra/noise symbols), not under-attribution. The handler's documented critical safety invariant (R-002-4 / RISK-03, header comment lines 7-12) is specifically about never returning a false-safe empty/no-impact result on a stale graph; over-attribution does not violate that invariant and does not cause silent missed impact. Real bug and a genuine contract degradation, but blast radius is preflight noise on multi-hunk-with-shift files, not missed signal — P2 is the right tier. The proposed fix (attribute on post-image only for modifications; special-case pure-delete via newStart point) is sound.

---

#### CG-022 · P2 · MISALIGNMENT — Comment claims pre-image range is checked only 'for pure-delete hunks (newLines=0)', but the code checks it for every hunk with oldLines>0

- **Location:** `.opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:322-324`
- **Source:** workflow:diff-line-math

**Evidence**

```
      // Use the post-image range for attribution because that's
      // what callers will read in the working tree. The pre-image
      // range is also covered for pure-delete hunks (newLines=0).
```

**Why it's wrong:** The guard at line 337 is `hunk.oldLines > 0`, NOT `hunk.newLines === 0`. Therefore the pre-image (oldStart/oldLines) overlap is evaluated for EVERY hunk that touches old lines — i.e. all modification hunks and pure-deletes alike — not only pure-delete hunks. The comment narrows the condition to pure-delete, which understates when the (coordinate-mismatched, see BUG above) pre-image path actually executes and hides the over-attribution surface from a reader auditing the math.

**Suggested fix:** Correct the comment to state the pre-image range is checked for any hunk with oldLines>0 (all modifications and pure-deletes), and note it is compared against post-image node ranges — or, if the BUG fix lands, remove the pre-image path entirely so comment and code agree.

**Verification:** Quote matches exactly. Lines 322-324 of detect-changes.ts contain the comment verbatim: "Use the post-image range for attribution because that's / what callers will read in the working tree. The pre-image / range is also covered for pure-delete hunks (newLines=0)." The code/comment misalignment is real: line 337 computes `const overlapsPreImage = hunk.oldLines > 0 && rangesOverlap(...)`. The pre-image overlap is gated on `oldLines > 0`, NOT `newLines === 0`. So it executes for EVERY hunk that touches old lines — all modification hunks (oldLines>0 AND newLines>0) plus pure-deletes — not only pure-delete hunks as the comment states. For a modification hunk both overlapsPostImage AND overlapsPreImage are evaluated (lines 333-340), so the comment's narrowing to "pure-delete hunks (newLines=0)" understates when the pre-image path actually runs. Corroborating evidence: the diff-parser.ts rangesOverlap docstring (lines 290-293) correctly describes the intended design — "both sides are checked against the same node range so an addition between two nodes can still be attributed to whichever node covers oldStart" — confirming the inline comment at 322-324 is the inaccurate one, not the code. The finding's secondary note (pre-image OLD diff coords compared against post-image/working-tree node ranges from queryOutline) is also factually true and references a separate BUG finding; it does not affect this MISALIGNMENT verdict. Severity P2 is correct: this is a documentation-only accuracy issue with no runtime behavior impact — it can mislead an auditor reading the attribution math but does not change correctness. Not P1 (no functional defect from the comment) and not N/A (the discrepancy is genuine).

---

#### CG-023 · P2 · MISALIGNMENT — rangesOverlap doc says 'half-open' but the formula and implementation are inclusive/closed, and the pure-add 'covers oldStart' claim never happens in the caller

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/diff-parser.ts:287-293`
- **Source:** workflow:diff-line-math

**Evidence**

```
 * Compute whether two 1-based half-open line ranges overlap.
 * `aStart`..`aStart+aLines-1` overlaps `bStart`..`bStart+bLines-1`.
 *
 * Pure-add hunks (oldLines=0) and pure-delete hunks (newLines=0)
 * are handled by the caller — both sides are checked against the
 * same node range so an addition between two nodes can still be
 * attributed to whichever node covers `oldStart`.
```

**Why it's wrong:** Two contradictions on the same comment block. (1) It calls the ranges 'half-open', but the very next line's formula `aStart..aStart+aLines-1` is closed/inclusive on both ends, and the implementation at lines 313-315 uses inclusive bounds (`aStart <= bEnd && bStart <= aEnd`). Half-open would be `aStart..aStart+aLines`. (2) It claims a pure-add 'can still be attributed to whichever node covers oldStart', but the caller (detect-changes.ts:337) gates the oldStart/oldLines (pre-image) check on `hunk.oldLines > 0`, which is FALSE for a pure-add (oldLines=0). So for pure-add the caller never checks oldStart at all — the documented behavior does not occur.

**Suggested fix:** Replace 'half-open' with 'inclusive (closed) 1-based ranges', and delete/rewrite the 'covers oldStart' sentence — pure-adds (oldLines=0) are attributed via the post-image range only, since the caller skips the pre-image check when oldLines is 0.

**Verification:** Quote matches exactly: diff-parser.ts:287-293 contains the cited doc comment verbatim, including "half-open" (287) and the pure-add "covers oldStart" claim (290-293). Both contradictions hold under full context.

(1) HALF-OPEN vs INCLUSIVE: Line 287 says "half-open" but line 288's own formula `aStart..aStart+aLines-1` is closed/inclusive, and the implementation at 313-315 (`aEnd=aStart+aLines-1`, `bEnd=bStart+bLines-1`, `return aStart<=bEnd && bStart<=aEnd`) is the classic closed-interval overlap test using `<=` on both ends. A true half-open `[start,end)` test would use exclusive upper bounds. The terminology is genuinely wrong. (Minor: the finding's parenthetical "half-open would be aStart..aStart+aLines" is loosely phrased — half-open means an exclusive upper bound — but the direction is correct and it does not affect the verdict.)

(2) PURE-ADD "covers oldStart" NEVER HAPPENS: detect-changes.ts is the ONLY non-test caller (confirmed via grep). Line 337 gates the pre-image/oldStart check on `hunk.oldLines > 0`, which is false for a pure-add (oldLines=0), so it short-circuits and oldStart is never checked. Line 333 checks only the post-image (newStart/newLines) for adds. The documented attribution-via-oldStart for pure-adds does not occur. No other caller or guard restores the documented behavior.

SEVERITY: P2 is correct. This is purely a doc/comment misalignment — the function and caller behave correctly (pure-adds are attributed via the post-image range as intended); only the comment is misleading. No runtime/correctness defect. The proposed fix (replace "half-open" with "inclusive (closed)" and rewrite the oldStart sentence) is accurate.

---

#### CG-024 · P2 · MISALIGNMENT — INSTALL_GUIDE intro enumerates 11 tool ids (3 duplicates) while the rest of the guide says 8

- **Location:** `.opencode/skills/system-code-graph/INSTALL_GUIDE.md:17`
- **Source:** workflow:doc-code-misalignment

**Evidence**

```
Line 17: "...exposing the public tool ids `code_graph_scan`, `code_graph_query`, `code_graph_classify_query_intent`, `code_graph_status`, `code_graph_context`, `code_graph_verify`, `code_graph_apply`, `detect_changes`, `code_graph_status`, `code_graph_scan`, and `code_graph_verify`." (code_graph_status/scan/verify duplicated). Same file line 66 and lines 112/134 correctly say "8 tools".
```

**Why it's wrong:** The opening sentence contradicts the rest of the guide (§0 "8 structural tools", §1 table "MCP tools | 8", §4 _NOTE_2_TOOLS "Registers 8 tools"), giving a reader an inconsistent tool inventory at first contact.

**Suggested fix:** Strip the trailing 3 duplicate ids in line 17 so the list shows the 8 distinct tool ids.

**Verification:** Quote matches line 17 verbatim. The intro sentence lists 11 tool ids with 3 duplicates (code_graph_status, code_graph_scan, code_graph_verify each appear twice). The 8 distinct ids — code_graph_scan, code_graph_query, code_graph_classify_query_intent, code_graph_status, code_graph_context, code_graph_verify, code_graph_apply, detect_changes — exactly match the canonical _NOTE_2_TOOLS list at lines 112/134. The rest of the guide consistently says "8 tools": §0 line 43 ("8 structural tools"), §1 table line 66 ("MCP tools | 8"), §4 lines 112/134 ("Registers 8 tools"), and verification table line 192 ("Active MCP tools | 8"). So the opening sentence genuinely contradicts the rest at first contact. No guard/typed-union prevents this; it's a plain doc duplication. Severity P2 is correct — purely cosmetic doc inconsistency, no functional/runtime impact. Fix is to strip the trailing 3 duplicate ids so the list shows 8 distinct ids. File: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/INSTALL_GUIDE.md line 17.

---

#### CG-025 · P2 · MISALIGNMENT — INSTALL_GUIDE reports skill version 1.0.3.1 while SKILL.md frontmatter is 1.0.3.2

- **Location:** `.opencode/skills/system-code-graph/INSTALL_GUIDE.md:59`
- **Source:** workflow:doc-code-misalignment

**Evidence**

```
INSTALL_GUIDE.md:59: "| Skill version | `1.0.3.1` |". SKILL.md:5: "version: 1.0.3.2".
```

**Why it's wrong:** The install guide's identity table is the field operators copy to confirm what they installed; it lags the authoritative SKILL.md version by one patch, so a version audit comparing the two surfaces flags a false mismatch (or trusts the stale value).

**Suggested fix:** Bump INSTALL_GUIDE.md:59 to `1.0.3.2` to match SKILL.md (and keep a single source going forward).

**Verification:** Both quotes match the real files verbatim. INSTALL_GUIDE.md:59 reads `| Skill version | `1.0.3.1` |` (inside the identity/field table starting at line 57). SKILL.md:5 reads `version: 1.0.3.2` in the YAML frontmatter. The reasoning holds under full context: git history shows INSTALL_GUIDE shipped 1.0.3.1 in commit 8142b8d022 (2026-05-16 13:03), then SKILL.md was bumped to 1.0.3.2 in a0fdb0f70c (2026-05-16 17:44, ~5h later) during a doc-polish commit. `git log -S "1.0.3.2" -- INSTALL_GUIDE.md` returns nothing, confirming the INSTALL_GUIDE never tracked the bump and has lagged by one patch since. SKILL.md frontmatter is the authoritative version surface, the INSTALL_GUIDE table is intended to mirror it, and no guard/context negates the drift — it is a plain doc-vs-doc version mismatch. Severity P2 is correct: cosmetic identity-table drift that produces a false version-audit mismatch but breaks nothing functional. Worth noting (broader, not part of this finding): the skill's version surfaces are inconsistent overall — package.json says 1.0.0 and the changelog dir contains a v1.1.0.0.md alongside v1.0.3.0.md — so a one-cell bump to 1.0.3.2 fixes this specific finding but a single-source-of-truth pass would be the durable fix.

---

#### CG-026 · P2 · MISALIGNMENT — README structure tree says manual_testing_playbook has "10 groups" but only 9 group directories exist

- **Location:** `.opencode/skills/system-code-graph/README.md:144`
- **Source:** workflow:doc-code-misalignment

**Evidence**

```
Line 144: "+-- manual_testing_playbook/         # Operator validation scenarios (22 scenarios, 10 groups)". `ls -d manual_testing_playbook/*/` returns 9 directories (01,02,03,04,05,06,08,09,10), and manual_testing_playbook.md:19 also says "across 9 groups".
```

**Why it's wrong:** The group numbering skips 07 (dirs go 06 then 08), which likely caused the off-by-one; the README claims 10 groups while the index doc and filesystem agree on 9.

**Suggested fix:** Change "10 groups" to "9 groups" at README.md:144 (the 22-scenario count is correct).

**Verification:** Verified against real source. README.md:144 quote matches exactly: "+-- manual_testing_playbook/         # Operator validation scenarios (22 scenarios, 10 groups)". The group-count claim of "10 groups" is wrong: `ls -d manual_testing_playbook/*/` returns 9 dirs (01,02,03,04,05,06,08,09,10 — 07 is skipped), AND the index doc's own group table (manual_testing_playbook.md lines 23-31) has exactly 9 rows. So both filesystem and the doc's structured table agree on 9 groups, not 10.

The "22 scenarios" count in the README IS correct: `find manual_testing_playbook -mindepth 2 -name '*.md'` returns 22 scenario files. The fix (change "10 groups" to "9 groups", keep 22) is correct.

Two refinements to the finding (do not change the verdict):
1. The finding cites "manual_testing_playbook.md:19 also says 'across 9 groups'". Line 19 actually reads "The playbook contains 16 scenarios across 9 groups." The "9 groups" portion is quoted accurately, but note the index doc's prose says 16 scenarios (itself stale vs the real 22 files) — the README's 22 is the accurate scenario count, the index doc prose is the one that's wrong on scenario count. This does not weaken the group-count misalignment.
2. The "why" (07 skip caused an off-by-one) is plausible but speculative ("likely"); it does not affect the validated core claim.

Severity P2 is correct — pure documentation/accuracy misalignment, no runtime impact.

---

#### CG-027 · P2 · MISALIGNMENT — Feature catalog detail files carry stale schema/handler line citations across scan, status, and detect_changes entries

- **Location:** `.opencode/skills/system-code-graph/feature_catalog/manual-scan-verify-status/03-code-graph-status.md:36-39`
- **Source:** workflow:doc-code-misalignment

**Evidence**

```
03-code-graph-status.md:39 cites "tool-schemas.ts:72-76" but codeGraphStatus is at lines 66-70; lines 36-38 cite handler ranges status.ts:158-180/181-212/214-260 but handleCodeGraphStatus begins at status.ts:198. Sibling files repeat the drift: 01-code-graph-scan.md:39 cites "tool-schemas.ts:19-48" (codeGraphScan is 13-42; handleCodeGraphScan is at scan.ts:311, not the cited 177-230); detect-changes/01-detect-changes-preflight.md:40 cites "tool-schemas.ts:169-180" (detectChanges is 172-183; 169-171 is the tail of codeGraphApply).
```

**Why it's wrong:** These detail files are the per-feature source-of-truth anchors; the line ranges are consistently off (schema cites ~6 lines high, status handler cited before the function even starts), so anyone Read-ing the cited ranges sees unrelated code, undermining the catalog's role as the implementation map.

**Suggested fix:** Re-derive line ranges from current tool-schemas.ts/handlers (codeGraphStatus 66-70, codeGraphScan 13-42, detectChanges 172-183; handler functions at status.ts:198, scan.ts:311) and update the citations.

**Verification:** All factual claims in the finding verified against real source.

PRIMARY FILE (manual-scan-verify-status/03-code-graph-status.md:36-39):
- Line 39 cites `tool-schemas.ts:72-76` for the status schema. ACTUAL: `codeGraphStatus: ToolDefinition` is at tool-schemas.ts:66-70 (single-line inputSchema, ends line 70). Lines 72-76 are a blank line plus the START of the unrelated `codeGraphContext` definition. Citation is ~6 lines high and points at the wrong tool. CONFIRMED.
- Lines 36-38 cite handler ranges status.ts:158-180 / 181-212 / 214-260. ACTUAL: `handleCodeGraphStatus` begins at status.ts:198 (verified via rg; file is 397 lines). 158-180 is entirely inside helper code (getVerificationTimestampMs tail, line 166 closes a helper); 214-260 is inside the function but the first cited range fully precedes the function start. CONFIRMED.

SIBLING FILES (drift repeats):
- 01-code-graph-scan.md:39 cites `tool-schemas.ts:19-48`; actual `codeGraphScan` is 13-42. Line 36 cites `scan.ts:177-230` for the handler; actual `handleCodeGraphScan` is at scan.ts:311 (177-183 is the `countPersistableNodes` helper). CONFIRMED.
- detect-changes/01-detect-changes-preflight.md:40 cites `tool-schemas.ts:169-180`; actual `detectChanges` is 172-183, and 169-171 is the tail (closing braces) of `codeGraphApply`. CONFIRMED.

REASONING: Valid. These detail files are per-feature source-of-truth anchors with explicit line citations; the ranges are consistently off (schema ~6 lines high, status/scan handlers cited before the function even begins), so a reader who Read-s the cited ranges lands on unrelated helper code or the wrong tool's schema. No guard/typed-union elsewhere mitigates this — it is a plain documentation-accuracy defect.

SEVERITY: P2 is correct. Pure documentation drift, no runtime/correctness/security impact; affects maintainability/navigability only. MISALIGNMENT type is accurate (docs out of sync with code). The fix's re-derived ranges (codeGraphStatus 66-70, codeGraphScan 13-42, detectChanges 172-183; handlers at status.ts:198, scan.ts:311) all match what I observed.

---

#### CG-028 · P2 · MISALIGNMENT — Scenario 016 says "Exactly 8 tools" then lists 11 names (3 duplicates), making its pass criteria self-contradictory

- **Location:** `.opencode/skills/system-code-graph/manual_testing_playbook/mcp-tool-surface/mcp-tool-manifest-post-rename.md:24, 41`
- **Source:** workflow:doc-code-misalignment

**Evidence**

```
Line 24: "Expected signals: Exactly 8 tools: code_graph_scan, code_graph_query, code_graph_classify_query_intent, code_graph_status, code_graph_context, code_graph_verify, code_graph_apply, detect_changes, code_graph_status, code_graph_scan, code_graph_verify." (code_graph_status, code_graph_scan, code_graph_verify each appear twice = 11 names). Line 41 repeats the same 11-name list. Line 26 pass/fail: "PASS if 8 tools with matching names".
```

**Why it's wrong:** This scenario's entire purpose is to verify the launcher advertises exactly 8 tools with correct names. An operator literally matching the tools/list response against the 11 listed names while the spec also demands "exactly 8" gets contradictory acceptance criteria — a faithful execution can never both match the 11-name list and confirm exactly 8.

**Suggested fix:** Delete the trailing duplicate tokens so the list is the 8 distinct tool IDs (code_graph_scan, code_graph_query, code_graph_classify_query_intent, code_graph_status, code_graph_context, code_graph_verify, code_graph_apply, detect_changes) at both lines 24 and 41.

**Verification:** Quotes match verbatim. File /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/manual_testing_playbook/mcp-tool-surface/mcp-tool-manifest-post-rename.md line 24 and line 41 both read "Exactly 8 tools:" then enumerate 11 tokens where code_graph_scan, code_graph_status, and code_graph_verify each appear twice (verified via tokenize+uniq: 11 total, 8 distinct). Line 26 pass/fail says "PASS if 8 tools with matching names." The contradiction is genuine: an operator matching tools/list against the 11 listed names cannot also confirm exactly 8. The authoritative manifest mcp_server/tool-schemas.ts defines exactly 8 distinct tools (code_graph_scan, code_graph_query, code_graph_status, code_graph_context, code_graph_classify_query_intent, code_graph_verify, code_graph_apply, detect_changes) — matching the intended 8, so the proposed fix (delete the 3 trailing duplicate tokens at both lines) is correct. Reasoning holds; no guard or context elsewhere resolves it. Severity downgraded P1->P2: this is a manual-test-playbook documentation defect with no runtime/code impact and the correct 8-tool intent is recoverable from the title/objective/description; low blast radius. Still a real, fixable contradiction.

---

#### CG-029 · P2 · MISALIGNMENT — Playbook overview claims 16 scenarios but the index lists (and the folder contains) 22 scenario files

- **Location:** `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md:19`
- **Source:** workflow:doc-code-misalignment

**Evidence**

```
Line 19: "The playbook contains 16 scenarios across 9 groups."
The index tables (sections 7-15) enumerate IDs 001,002,003,004,005,006,007,024,008,009,010,011,022,016,015,023,017,018,019,020,021,025 = 22 scenarios. `ls manual_testing_playbook/*/[0-9]*.md` returns 22 files.
```

**Why it's wrong:** The stated count (16) is the release-readiness inventory operators use to confirm full coverage; it is 6 short of the actual scenario set, so a reviewer reconciling "scenarios run" against the headline number will believe coverage is complete after 16 and miss 6 scenarios.

**Suggested fix:** Update line 19 to "contains 22 scenarios across 9 groups" (and keep group count at 9, which is correct).

**Verification:** Quote verified verbatim at line 19: "The playbook contains 16 scenarios across 9 groups." The discrepancy is real and confirmed two independent ways: (1) the index tables in sections 7-15 enumerate exactly 22 scenario IDs (001,002,003,004,005,006,007,024,008,009,010,011,022,016,015,023,017,018,019,020,021,025); (2) `ls */[0-9]*.md` returns exactly 22 files. The group count (9 groups, listed in the section 17 overview table at lines 23-31) is correct, isolating this to a stale scenario count. The proposed fix (16 -> 22, keep 9 groups) is correct.

Severity correction P1 -> P2: This is a doc-accuracy/count-drift defect in a manual testing playbook, not a runtime/correctness/security issue. The finding's "why" (an operator believes coverage is complete after 16 and misses 6 scenarios) overstates impact: section 5 release-readiness review and the operator's actual work surface are the enumerated index tables (sections 7-15), which list and link all 22 scenarios completely. An operator executing the playbook follows the complete tables and would encounter all 22; only the prose headline understates the count. Real but cosmetic — fix warranted, P2 fits better than P1.

---

#### CG-030 · P2 · MISALIGNMENT — Readiness reference cross-link says "which of the 11 tools are gated" but the linked surface and runtime register 8

- **Location:** `.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md:145`
- **Source:** workflow:doc-code-misalignment

**Evidence**

```
Line 145: "- [`../runtime/tool_surface.md`](../runtime/tool_surface.md) — which of the 11 tools are gated by readiness."
The linked tool_surface.md:13 states "The 8 MCP tools registered by `mk-code-index`".
```

**Why it's wrong:** The reference's own related-resources pointer claims 11 tools while the document it links to (and the schema array) define 8, so a reader chasing the readiness-gated set starts from a wrong count.

**Suggested fix:** Change "the 11 tools" to "the 8 tools" at line 145.

**Verification:** Verified against real source. (1) Line 145 of /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/references/readiness/readiness_and_scope_fingerprint.md reads verbatim: "- [`../runtime/tool_surface.md`](../runtime/tool_surface.md) — which of the 11 tools are gated by readiness." (2) The linked tool_surface.md:13 reads "The 8 MCP tools registered by `mk-code-index` ..." and its frontmatter (line 3) also says "8 MCP tools". (3) The authoritative schema array CODE_GRAPH_TOOL_SCHEMAS in mcp_server/tool-schemas.ts (lines 186-195) contains exactly 8 entries: codeGraphScan, codeGraphQuery, codeGraphStatus, codeGraphContext, codeGraphClassifyQueryIntent, codeGraphVerify, codeGraphApply, detectChanges. A repo-wide grep shows EVERY other count reference says 8 (tool_surface.md lines 3/13/95, ownership_boundary.md:59) — line 145 is the sole outlier saying "11". The misalignment is real and not masked by any guard or typed union; the schema array is the ground truth and confirms 8. Severity P2 is correct: this is a doc-accuracy/cross-link inconsistency that mildly misleads a reader chasing the readiness-gated set, with no runtime/functional impact. Suggested fix (change "11" to "8") is correct.

---

#### CG-031 · P2 · MISALIGNMENT — Ownership boundary lists "8 tools" then enumerates 11 names (3 duplicates)

- **Location:** `.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md:59`
- **Source:** workflow:doc-code-misalignment

**Evidence**

```
Line 59: "**MCP tool surface** - 8 tools through the `mk_code_index` server: `code_graph_scan`, `code_graph_query`, `code_graph_status`, `code_graph_context`, `code_graph_classify_query_intent`, `code_graph_verify`, `code_graph_apply`, `detect_changes`, `code_graph_status`, `code_graph_scan` and `code_graph_verify`."
```

**Why it's wrong:** The canonical boundary doc names the authoritative tool surface; the trailing duplicated tokens (code_graph_status, code_graph_scan, code_graph_verify) make the enumerated list disagree with its own "8 tools" header and with tool_surface.md.

**Suggested fix:** Remove the three duplicate tool names at the end so the list contains the 8 distinct IDs.

**Verification:** Verified against /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/references/runtime/ownership_boundary.md line 59. The quoted text matches verbatim: header says "8 tools" but the enumerated list contains 11 tokens — the 8 distinct IDs (code_graph_scan, code_graph_query, code_graph_status, code_graph_context, code_graph_classify_query_intent, code_graph_verify, code_graph_apply, detect_changes) followed by 3 trailing duplicates (code_graph_status, code_graph_scan, code_graph_verify). Cross-checked the canonical references/runtime/tool_surface.md, which lists exactly 8 distinct tools matching the first 8 names. So the list both contradicts its own "8 tools" header and disagrees with tool_surface.md, exactly as the finding states. This is a pure static prose string with no guard or context that mitigates it. P2 is correct: documentation consistency defect with no runtime/behavioral impact. The proposed fix (remove the three trailing duplicates) is accurate.

---

#### CG-032 · P2 · MISALIGNMENT — recordSuccess() is an exported no-op never called by the parse path — dead self-heal API

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:93-95`
- **Source:** workflow:indexer-parser-lifecycle

**Evidence**

```
`export function recordSuccess(_filePath: string, _database?: Database.Database): void { // Manual-review-only self-heal per research.md §11; successful parses do not unskip files. }` (93-95). The success path in tree-sitter-parser.ts (815-825) never calls it, and no caller exists.
```

**Why it's wrong:** The function is exported as if part of the skip-list contract, suggesting an unskip-on-success behavior that does not exist. A future maintainer wiring `recordSuccess()` into the success path would get a silent no-op and assume self-heal works. The intent (manual-review-only) lives only in a comment, not enforced by type or removal.

**Suggested fix:** Either delete the unused export, or document it at the call-less boundary (e.g. mark `@deprecated`/internal) so the no-op semantics are explicit and not mistaken for a working unskip hook.

**Verification:** Quote at lines 93-95 matches verbatim, including the comment "Manual-review-only self-heal per research.md §11; successful parses do not unskip files." The "never called by the parse path" claim is accurate: a repo-wide grep finds recordSuccess only in (a) its own definition and (b) the test file parser-skip-list.vitest.ts (lines 20, 70, 73). The import in tree-sitter-parser.ts (line 24) deliberately pulls only addToSkipList and lookupSkipList, NOT recordSuccess. The success return path (rememberParseResultCaptures at lines 815-825) never touches the skip list; only the catch block (line 834) calls addToSkipList. So the function is a genuinely call-less exported no-op.

Caveat — the finding's risk "why" is overstated. The intent is NOT documented "only in a comment": there is an explicit regression test (line 70) titled "keeps entries after recordSuccess because self-heal is manual-review-only" that asserts lookupSkipList still returns non-null after recordSuccess. That test locks the no-op contract, so a maintainer wiring it into the success path would hit a named, asserting test — partially mitigating the "silent no-op assumed to work" hazard the finding describes. This is intentional, tested, documented design (a manual-review-only contract stub), not stray dead code.

Net: facts confirmed, severity P2 correct (lowest tier; this is a clarity/maintainability nit, arguably borderline N/A given the comment + test already encode the semantics). The fix suggestion (mark @deprecated/internal or delete) is reasonable but the comment + test already make the no-op semantics fairly explicit. File: .opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts (93-95); corroborating: mcp_server/lib/tree-sitter-parser.ts (24, 815-825, 834), mcp_server/tests/parser-skip-list.vitest.ts (70-76).

---

#### CG-033 · P2 · BUG — B2 heap-corruption quarantine is gated behind the skip-list feature flag, so disabling skip-list disables the crash safeguard

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:786-796, 831-839`
- **Source:** workflow:indexer-parser-lifecycle

**Evidence**

```
Setting the quarantine (catch block): `if (SKIP_LIST_ENABLED) { if (errorClass === 'B1' || errorClass === 'B2') { ... if (errorClass === 'B2') { parserHealth = 'quarantined'; } } }` (831-839).
Honoring the quarantine: `if (SKIP_LIST_ENABLED) { ... if (parserHealth === 'quarantined') { return earlyReturnSentinel(...); } }` (786-795).
```

**Why it's wrong:** The class doc-comment (lines 73-86) frames B2 quarantine as a process-wide safeguard against 'compounding WASM-heap corruption' — a memory-safety mechanism, not a skip-list nicety. But both setting and honoring `parserHealth='quarantined'` are nested inside `if (SKIP_LIST_ENABLED)`. With `SPECKIT_PARSER_SKIP_LIST_ENABLED=false` (line 52), a 'memory access out of bounds' fault never quarantines and the parser keeps calling `parserInstance.parse()` on the corrupted heap for every remaining file — exactly the compounding corruption the comment says must be prevented.

**Suggested fix:** Move the B2 `parserHealth='quarantined'` set (836-838) and the quarantine early-return check (793-795) outside the `SKIP_LIST_ENABLED` guard so heap-corruption protection is unconditional; keep only the skip-list DB write/lookup behind the flag.

**Verification:** Verified against /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts. All quotes match exactly: (a) catch block 831-839 sets parserHealth='quarantined' for B2 ONLY inside `if (SKIP_LIST_ENABLED)`; (b) honor block 786-796 checks `if (parserHealth === 'quarantined')` at 793-794 ALSO only inside `if (SKIP_LIST_ENABLED)`; (c) line 52 `SKIP_LIST_ENABLED = process.env.SPECKIT_PARSER_SKIP_LIST_ENABLED !== 'false'`; (d) doc-comment 73-86 frames B2 quarantine as protection against "compounding WASM-heap corruption."

Reasoning holds under full context. I checked for mitigating guards elsewhere and found none: scan.ts (handlers/scan.ts:379) only CLEARS quarantine via resetParserHealth() on explicit full scans; status.ts (267,347) only READS getParserHealth() for reporting. There is no independent quarantine gate in the per-file parse loop or callers. So with SPECKIT_PARSER_SKIP_LIST_ENABLED=false: the B2 set never fires, the honor check never fires, the catch falls through to a normal error return (841-851), and the next file re-invokes parserInstance.parse() on the same (potentially corrupted) WASM instance — exactly the compounding behavior the doc-comment says must be prevented. Not a false positive.

Severity: P2 is correct. The unsafe path is opt-in (env var must be explicitly set to the string 'false'); the safeguard is fully functional in the default config. It is a genuine memory-safety coupling defect that silently disables the crash safeguard when an operator disables the unrelated skip-list feature. The proposed fix (move the B2 set at 836-838 and the honor check at 793-795 outside the SKIP_LIST_ENABLED guard, keeping only the skip-list DB write/lookup behind the flag) is sound and minimal. Not P1 because it requires a non-default config and the WASM trap is caught per-call rather than guaranteed to hard-crash the process.

---

#### CG-034 · P2 · MISALIGNMENT — parse_duration_ms metric labels 'recovered' (syntax-error partial parse) as outcome=success

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:812-813`
- **Source:** workflow:indexer-parser-lifecycle

**Evidence**

```
Line 808-810 sets `parseHealth` to `'recovered'` when `hasError` is true but some captures were salvaged. Line 813: `speckitMetrics.recordHistogram('spec_kit.graph.parse_duration_ms', ..., { language, outcome: parseHealth === 'error' ? 'error' : 'success' });` — so a `recovered` (the tree DID contain syntax errors, see parseErrors at 823) is reported as `outcome: 'success'`.
```

**Why it's wrong:** Operators tracking the `outcome` label to gauge parser health cannot see partial/degraded parses: files with real syntax errors that still yielded some symbols are bucketed identically to clean parses. This understates the parse-error signal that other surfaces (parse_diagnostics, parserHealth in code_graph_status) treat as meaningful.

**Suggested fix:** Emit a third label value, e.g. `outcome: parseHealth === 'error' ? 'error' : parseHealth === 'recovered' ? 'recovered' : 'success'`, or map `recovered` to a `partial` bucket.

**Verification:** Quote is verbatim accurate. tree-sitter-parser.ts:808-810 sets parseHealth='recovered' when hasError && captures.length>0; line 813 records spec_kit.graph.parse_duration_ms with outcome: parseHealth==='error' ? 'error' : 'success', collapsing 'recovered' into 'success'. Line 823 confirms recovered carries parseErrors ['Tree contains syntax errors (partial parse)'].

Reasoning holds under full context: parseHealth is a real 3-value typed union ('clean'|'recovered'|'error') in indexer-types.ts:76 — 'recovered' is a genuine distinct state, not dead. It is persisted as parse_health (code-graph-db.ts:116), aggregated distinctly via GROUP BY parse_health (code-graph-db.ts:1122-1123 getParseHealthSummary), and surfaced to operators in code_graph_status as parseHealth: stats.parseHealthSummary (status.ts:346) alongside parserHealth and parseDiagnostics (status.ts:347-348). So the asymmetry the finding describes is real: code_graph_status preserves 'recovered' as its own bucket, but the parse_duration_ms histogram outcome label buckets it as 'success'. No guard or typed union elsewhere mitigates this — it is a deliberate two-branch ternary. An operator monitoring only the histogram cannot distinguish degraded/partial parses from clean ones.

Severity P2 is correct: observability/metrics-fidelity gap only. The recovered signal remains fully available via code_graph_status and parse_diagnostics; only the duration histogram understates parse degradation. No correctness or data-loss impact. The proposed fix (emit a third 'recovered'/'partial' outcome value) is valid and consistent with the multi-value outcome label pattern used elsewhere.

---

#### CG-035 · P2 · BUG — scan.ts getCurrentGitHead uses execSync with no timeout (its ensure-ready twin uses execFileSync with timeout:5000), so a hung git can block the scan handler indefinitely

- **Location:** `.opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:209-221`
- **Source:** workflow:readiness-scan-freshness

**Evidence**

```
`return execSync('git rev-parse HEAD', { cwd: rootDir, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();` (scan.ts:211-215) — no `timeout` option. The equivalent helper in ensure-ready.ts:98-103 uses `execFileSync('git', ['rev-parse','HEAD'], { cwd: rootDir, encoding: 'utf-8', timeout: 5_000, stdio: [...] })`.
```

**Why it's wrong:** A stuck git (stale index.lock, slow network filesystem, credential prompt) blocks handleCodeGraphScan with no upper bound, since the catch only handles thrown errors, not a hang. The sibling read path is already protected; the scan path is the divergent unguarded one.

**Suggested fix:** Add `timeout: 5_000` (and prefer execFileSync with arg array) to scan.ts getCurrentGitHead to match ensure-ready's guarded version.

**Verification:** Confirmed. scan.ts:209-221 matches the finding's quote verbatim: `return execSync('git rev-parse HEAD', { cwd: rootDir, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();` with no `timeout` option (import is `execSync` from node:child_process at line 6). The protected twin exists and diverges as described, BUT the finding cited the wrong path: it claimed `mcp_server/handlers/ensure-ready.ts:98-103`; the real file is `mcp_server/lib/ensure-ready.ts:96-107`. The code at that real location matches: `execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf-8', timeout: 5_000, stdio: ['ignore','pipe','pipe'] })`. The reasoning holds: getCurrentGitHead is called synchronously at scan.ts:360 on the critical path of handleCodeGraphScan; Node execSync has no default timeout, so a hung git (stale index.lock, credential prompt, slow network FS) blocks the handler indefinitely. The catch only handles thrown errors, not a hang. Not a false positive — no upstream timeout/abort guard wraps the call. Severity P2 is correct: real robustness gap but needs an unusual trigger and sits on the indexing/maintenance path, not a hot security/data path. Fix as proposed (add timeout: 5_000, prefer execFileSync with arg array to match the lib/ensure-ready.ts twin). Minor cite errors (twin file directory; line span 96-107 vs the cited 98-103) do not undermine the finding.

---

#### CG-036 · P2 · MISALIGNMENT — Playbook 023 points at non-existent implementation files lib/apply-mode/{rescan,prune,repair,recovery,rollback}.ts

- **Location:** `.opencode/skills/system-code-graph/manual_testing_playbook/doctor-code-graph/code-graph-apply-sub-operations.md:81`
- **Source:** workflow:recovery-apply-path

**Evidence**

```
Notes section, line 81:
  Tests `mcp_server/handlers/apply.ts` -> `mcp_server/lib/apply-mode/{rescan,prune,repair,recovery,rollback}.ts`. Each operation runs the gold-query battery before AND after ...
There is no `mcp_server/lib/apply-mode/` directory (confirmed by listing). The real implementation is `lib/apply-orchestrator.ts` (dispatchOperation switch, lines 261-346) plus `lib/recovery-procedures.ts`.
```

**Why it's wrong:** An operator/agent following the playbook to inspect the implementation is sent to files that do not exist, defeating the source-mapping purpose of the scenario and breaking traceability for the apply/recovery cluster.

**Suggested fix:** Update the Notes source map to `mcp_server/lib/apply-orchestrator.ts` (operation dispatch) and `mcp_server/lib/recovery-procedures.ts` (CG-RP-001/002/003).

**Verification:** Fully confirmed against real source.

(1) Quote match: Line 81 reads exactly `Tests mcp_server/handlers/apply.ts → mcp_server/lib/apply-mode/{rescan,prune,repair,recovery,rollback}.ts. Each operation runs the gold-query battery before AND after...` — verbatim with the finding.

(2) Non-existence: `mcp_server/lib/apply-mode/` directory does not exist (ls exit 1, "No such file or directory"). A full repo grep for "apply-mode" shows the ONLY literal `lib/apply-mode/{...}.ts` path reference is playbook 023 line 81 itself; every other hit is conceptual prose ("apply-mode recovery", "apply-mode policy").

(3) Real implementation confirmed exactly as the fix states: `mcp_server/lib/apply-orchestrator.ts` holds the operation dispatch via `dispatchOperation()` switch (lines 261-346) covering all 5 operations (rescan, recover-sqlite-corruption, rollback-bad-apply, prune-excludes, repair-nodes); `mcp_server/lib/recovery-procedures.ts` implements CG-RP-001/002/003 (recoverSqliteCorruption, rollbackBadApply), imported by the orchestrator (lines 16-20). `handlers/apply.ts` exists and delegates to applyCodeGraph.

(4) Reasoning holds with no false-positive guard: an operator following the source-map lands on a non-existent directory + 5 non-existent files; nothing aliases or generates `apply-mode/`. Traceability is genuinely broken.

(5) Severity P2 is correct: it is a doc/traceability misalignment in a manual-testing playbook, not a runtime defect. The Steps section's actual MCP tool calls still work (they hit the live code_graph_apply tool); only the Notes source-map is wrong. No functional impact.

Minor refinement to the proposed fix: prune-excludes classification actually lives in `mcp_server/lib/exclude-rule-classifier.ts` (classifyExcludeRules), so a complete source-map would add that file. The fix's two named targets (apply-orchestrator.ts, recovery-procedures.ts) are the correct core mappings.

File: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/manual_testing_playbook/doctor-code-graph/code-graph-apply-sub-operations.md:81

---

#### CG-037 · P2 · MISALIGNMENT — dry-run for rollback-bad-apply returns no rollback target, contradicting playbook 023 step 5

- **Location:** `.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:431-444`
- **Source:** workflow:recovery-apply-path

**Evidence**

```
if (args.dryRun === true) {
    const postflight = await runBattery();
    ...
    return { status: 'dry-run', operation, classification, auditLogPath: logPath, preflight, postflight, message: 'Dry run completed; operation dispatch was skipped.' };
}
Dispatch is skipped entirely; the result has no `recovery` field and no baseline/rollback target. Playbook 023 step 5 (code-graph-apply-sub-operations.md:66-67) states: 'Expected: dry-run returns the rollback target (the prior baseline) without applying.'
```

**Why it's wrong:** The documented dry-run contract for rollback-bad-apply promises the prior baseline be reported; the code returns only battery results with dispatch skipped, so the rollback target is never computed or surfaced. Contract drift between playbook and implementation.

**Suggested fix:** Either compute and include the would-be rollback target (e.g. findLatestKnownGood) in the dry-run response for rollback-bad-apply, or correct playbook 023 step 5 to state dispatch is fully skipped and no target is returned.

**Verification:** Quote verified verbatim. Code at apply-orchestrator.ts:431-444 matches exactly; playbook quote matches code-graph-apply-sub-operations.md:66-67 ("Expected: dry-run returns the rollback target (the prior baseline) without applying") and pass-criteria row 77. Reasoning holds under full context: the `if (args.dryRun === true)` branch (line 431) runs BEFORE dispatchOperation (line 455) and is fully operation-agnostic — for operation:"rollback-bad-apply" with dryRun:true it returns only {status:'dry-run', operation, classification, auditLogPath, preflight, postflight, message}, with no `recovery`, no `knownGoodDir`, no baseline target. The rollback target (knownGoodDir) is computed exclusively inside rollbackBadApply() at recovery-procedures.ts:264, reached only via the live non-dry-run dispatch path (line 279). So the documented dry-run contract (surface the prior baseline) is never honored. No guard/typed-union elsewhere mitigates this — genuine doc-vs-implementation drift. The proposed fix is feasible: findLatestKnownGood() at recovery-procedures.ts:135-149 is a pure read-only directory scan and could be surfaced in dry-run without any mutation. Severity P2 is correct: this is drift in a MANUAL TESTING PLAYBOOK (not production runtime, not security/correctness) — it would only mislead a manual tester on step 5; no runtime failure or data risk, so not P1. Note: the playbook is already loosely written (step 1 shows status:"dry_run_complete" vs the actual 'dry-run' literal), reinforcing that it was authored against an idealized per-operation dry-run contract the generic short-circuit never implemented.

---

## 5. Refuted / Not Reported

The adversarial verification pass **refuted 4** candidate findings (quote did not match real code, or a guard/typed-union elsewhere prevented the issue). gpt-5.5 also explicitly dropped lower-confidence leads where the local contract was ambiguous. Refuted candidates are intentionally excluded to keep this report high-signal.

---

## 6. Coverage & Limitations

- **Covered:** all `mcp_server/**` TypeScript source (handlers, lib, lib/ipc, lib/shared, tools, core, index, tool-schemas) cross-checked against `feature_catalog/**`, `manual_testing_playbook/**`, `references/**`, `ARCHITECTURE.md`, `README.md`, `INSTALL_GUIDE.md`, `SKILL.md`, and the vitest/stress suites.
- **Out of scope:** `node_modules/`, `mcp_server/dist/` (build artefacts); the standalone launcher `.opencode/bin/mk-code-index-launcher.cjs` was inspected only where it bears on a finding's production impact (e.g. owner-lease).
- **Not done:** no fixes applied (read-only audit); no runtime scan/apply/verify executed; dynamic/load behavior not exercised beyond reading the existing stress tests.
- **Confidence:** every finding cites verifiable file:line evidence. Where production impact is bounded by a guard or dead-code path, the Verification note says so explicitly.

---

## 7. Remediation Outcome (2026-05-29)

Fixes were applied by `cli-opencode → openai/gpt-5.5-fast --variant high` in an isolated worktree (branch **`cg-remediation`**), then each test delta was re-examined as a possible regression.

- **31 of 38 findings fixed** (incl. CG-038, the symlink-rationale correction added during review). Typecheck PASS; full vitest failing-set is **identical to the pre-fix baseline** (24 failures that belong to unrelated in-tree *BUG-06* WIP, not this work) — i.e. **zero regressions**. See child `001-applied-source-and-doc-fixes`.
- **7 findings deferred** (CG-002, CG-006, CG-007, CG-008, CG-009, CG-010, CG-037) because they overlap the operator's active *BUG-04/BUG-06* WIP or need deeper design (e.g. CG-010 needs `recovery-procedures.ts` to distinguish a graceful no-op rollback from an errored one). See child `002-deferred-wip-overlapping-findings`.
- **Delivery:** branch `cg-remediation` (not merged) — `main` untouched; operator merges when the BUG-04/BUG-06 WIP settles.

> **CG-038** (added post-audit): `database_path_policy.md` §3 rationale wrongly cited cross-runtime sharing. All runtimes symlink `.opencode/skills` to one physical dir, so a skill-local DB would be equally shared. The real reason for the workspace-root DB location is separation of mutable runtime state from version-controlled skill code. Fixed in the docs batch.

### Update 2026-05-29 — landed on main

After your BUG-04/BUG-06 WIP reached a green state, the clean (non-WIP-overlapping) fixes were
applied to current `main` and committed (`4f1dc0ed`), alongside **fix #1** DB relocation
(`69e7bf12`, child `003-db-location-skill-local`). Full suite: **577 passed / 0 failed**.
Three fixes (CG-035 scan git-timeout, CG-003 removeFile transaction, CG-016/017 owner-lease CAS)
are applied + green in the working tree but left **uncommitted** because their files carry your
active WIP. Deferred (documented, child `002`): CG-002 & CG-020 (already done by your BUG-04/BUG-03),
CG-006/007/008 (freshness/manifest — overlap BUG-06), CG-009/010/037 (apply-orchestrator; CG-010
needs a recovery-procedures no-op-vs-error distinction), CG-013 cwd-divergence (fs-mock breakage).
