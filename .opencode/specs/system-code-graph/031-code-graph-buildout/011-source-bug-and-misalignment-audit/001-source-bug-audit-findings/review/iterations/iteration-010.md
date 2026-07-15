## Coverage Notes

Registry state: `deep-review-findings-registry.json` is empty, and only `iteration-001.md` through `iteration-007.md` exist in `review/iterations/`; this pass used those seven iteration files as the prior-finding baseline.

Prior uncited high-risk changed files spot-reviewed here: `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts`, `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts`, `.opencode/skills/system-code-graph/mcp_server/lib/phase-runner.ts`, `.opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts`, `.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts`, and the uncommitted `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts` / `lib/index-scope-policy.ts` changes.

Session-changed files still not substantively reviewed after this pass are mostly docs/tests/config surfaces: `.opencode/skills/system-code-graph/README.md`, `SKILL.md`, `feature_catalog/manual-scan-verify-status/03-code-graph-status.md`, `feature_catalog/feature_catalog.md`, the changed `manual_testing_playbook/**` files, `mcp_server/index.ts`, `mcp_server/lib/README.md`, `mcp_server/lib/ipc/socket-server.ts`, the changed stress/test files, `mcp_server/tests/lib/README.md`, `references/readiness/readiness_and_scope_fingerprint.md`, `references/runtime/launcher_lease.md`, `references/runtime/ownership_boundary.md`, and `opencode.json`.

### DR-010-01 [P1] [maintainability] Auto-index timeout signal still cannot stop the monolithic parse phase

file: `.opencode/skills/system-code-graph/mcp_server/lib/phase-runner.ts:275`, `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2137`, `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:540`

evidence:

```ts
540:     const results = await Promise.race([
541:       // BUG-06: pass the deadline signal so indexFiles' phase runner can stop
542:       // between phases on timeout instead of running to completion in the
543:       // background and discarding the result.
544:       indexFiles(config, { ...indexOptions, signal: controller.signal }),
```

```ts
275:   for (const phaseName of order) {
276:     // BUG-06: cooperative cancellation. When the caller's deadline aborts (e.g.
277:     // ensure-ready's indexWithTimeout), stop before the next phase instead of
278:     // running the whole pipeline to completion in the background and discarding
279:     // the result. Checked at phase boundaries to keep it cheap and safe.
280:     if (signal?.aborted) {
```

```ts
294:     try {
295:       const value = await phase.run(deps);
296:       outputs[outputKey(phase)] = value;
```

```ts
2137:       for (const file of candidateFiles) {
2138:         const language = detectLanguage(file);
2139:         if (!language || !config.languages.includes(language)) continue;
...
2150:           const content = readFileSync(file, 'utf-8');
2151:           const result = await parseFile(file, content, language, config.edgeWeights);
```

why: The remediation threads an `AbortSignal` into `runPhases()`, but the runner only checks it before each phase and then awaits the whole `phase.run(deps)`. The expensive `parse-candidates` phase loops over every candidate without checking `options.signal`, so a timeout that fires mid-phase still leaves the indexer promise parsing in the background until the phase returns. That preserves the bug the comment claims to fix for the dominant long-running phase.

fix: Make cancellation cooperative inside `parse-candidates`: check `options.signal?.aborted` before each file read and after each `parseFile()` await, throw a typed abort error, and add a regression test with multiple candidates proving no later candidates are parsed after the timeout aborts.

confidence: 0.90

### DR-010-02 [P2] [maintainability] Widened read-block contract still labels non-full-scan blocks as `full_scan_required`

file: `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts:208`, `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts:889`

evidence:

```ts
208:       const isCrash = readiness.freshness === 'error';
209:       const message = isCrash
210:         ? `code_graph_not_ready: ${readiness.reason}`
211:         : `code_graph_full_scan_required: ${readiness.reason}`;
212:       const requiredAction = isCrash ? 'rg' : 'code_graph_scan';
213:       const blockReason = isCrash ? 'readiness_check_crashed' : 'full_scan_required';
```

```ts
886:   // Any non-fresh graph that reached the block path needs a scan before reads
887:   // can be trusted (full_scan, empty, or a stale graph a selective reindex
888:   // could not heal).
889:   if (readiness.freshness !== 'fresh') {
890:     return {
891:       nextTool: 'code_graph_scan',
892:       reason: readiness.action === 'selective_reindex' ? 'selective_reindex' : 'full_scan_required',
```

```ts
912:     status: 'blocked',
913:     message: `code_graph_full_scan_required: ${readiness.reason}`,
914:     data: buildGraphQueryPayload({
...
920:       requiredAction: 'code_graph_scan',
921:       blockReason: 'full_scan_required',
```

why: BUG-01 widened the read handlers to block on any non-fresh graph and failed verification gates, not only full-scan-required states. The blocked payloads still hard-code `message` / `blockReason` to `full_scan_required`; `query.ts` can even include `fallbackDecision.reason: 'selective_reindex'` in the same payload while `blockReason` says `full_scan_required`. Consumers are explicitly told `data.blockReason` is a compatibility routing field, so this creates a cross-handler response contract drift rather than just cosmetic wording.

fix: Derive `message` and `blockReason` from the same readiness classification used by `fallbackDecision`: distinguish `readiness_check_crashed`, `verification_failed`, `selective_reindex`, deleted-files-only stale, empty graph, and full-scan-required cases consistently in both `context.ts` and `query.ts`.

confidence: 0.88

newFindings: 2, dimension: maintainability
