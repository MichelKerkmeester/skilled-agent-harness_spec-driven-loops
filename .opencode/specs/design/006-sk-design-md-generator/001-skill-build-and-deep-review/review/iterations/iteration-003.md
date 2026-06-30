# Iteration 3: security — network/fs/cli robustness

Reviewed: .opencode/skills/sk-design-md-generator/tool/scripts/crawl.ts, .opencode/skills/sk-design-md-generator/tool/scripts/extract.ts, .opencode/skills/sk-design-md-generator/tool/scripts/cli.ts, .opencode/skills/sk-design-md-generator/tool/scripts/proof.ts

Findings: 5 (P0=0 P1=4 P2=1)


## F003-01 [P1] SSL certificate validation disabled site-wide
- File: .opencode/skills/sk-design-md-generator/tool/scripts/crawl.ts:633
- Evidence: `ignoreHTTPSErrors: true` passed to `browser.newContext()` on line 633 bypasses all TLS certificate validation. Every page crawled via `processPage` (Phase 1 and Phase 2 discovery) is fetched over a connection that accepts any cert, enabling MITM interception of page content, injected stylesheets, and executed JavaScript from `page.evaluate` calls.
- Fix: Remove `ignoreHTTPSErrors: true`. If certain sites legitimately need it, gate it behind an explicit `--insecure` CLI flag with a warning so the user opts in knowingly.

```json
{
"claim": "SSL certificate validation disabled site-wide",
"evidenceRefs": [
".opencode/skills/sk-design-md-generator/tool/scripts/crawl.ts:633"
],
"counterevidenceSought": "reviewed surrounding code",
"alternativeExplanation": "none found",
"finalSeverity": "P1",
"confidence": 0.7,
"downgradeTrigger": "if evidence ref is stale"
}
```


## F003-02 [P1] Unvalidated parseInt on --concurrency/--max-pages allows negative/NaN values
- File: .opencode/skills/sk-design-md-generator/tool/scripts/extract.ts:82
- Evidence: `parseInt(args[++i], 10)` at lines 82 and 84 accepts any string. Passing `--concurrency -5` yields `Semaphore(-5)`, whose `active < limit` guard (`0 < -5`) never fires — no pages are crawled. Passing a non-numeric string yields `NaN`, breaking comparisons silently. No floor/range validation exists.
- Fix: Validate with `Math.max(1, parseInt(...))` or reject values < 1 with an error message before constructing the options object.

```json
{
"claim": "Unvalidated parseInt on --concurrency/--max-pages allows negative/NaN values",
"evidenceRefs": [
".opencode/skills/sk-design-md-generator/tool/scripts/extract.ts:82"
],
"counterevidenceSought": "reviewed surrounding code",
"alternativeExplanation": "none found",
"finalSeverity": "P1",
"confidence": 0.7,
"downgradeTrigger": "if evidence ref is stale"
}
```


## F003-03 [P1] Unguarded JSON.parse on --merge-with file crashes on malformed input
- File: .opencode/skills/sk-design-md-generator/tool/scripts/extract.ts:497
- Evidence: `JSON.parse(fs.readFileSync(options.mergeWith, 'utf-8'))` on line 497 has no try/catch. If the merge file exists but contains invalid JSON, an uncaught `SyntaxError` terminates the process after all crawling and extraction work is already done, losing results. The `fs.existsSync` guard on line 495 does not validate content integrity.
- Fix: Wrap in try/catch; on parse failure, log a warning and continue without merging instead of crashing.

```json
{
"claim": "Unguarded JSON.parse on --merge-with file crashes on malformed input",
"evidenceRefs": [
".opencode/skills/sk-design-md-generator/tool/scripts/extract.ts:497"
],
"counterevidenceSought": "reviewed surrounding code",
"alternativeExplanation": "none found",
"finalSeverity": "P1",
"confidence": 0.7,
"downgradeTrigger": "if evidence ref is stale"
}
```


## F003-04 [P1] Unguarded JSON.parse + readFileSync crashes on missing/corrupt tokens file
- File: .opencode/skills/sk-design-md-generator/tool/scripts/proof.ts:307
- Evidence: `JSON.parse(fs.readFileSync(tokensPath, 'utf-8'))` on line 307 has no try/catch and no `fs.existsSync` pre-check. If `tokensPath` is missing or contains malformed JSON, an uncaught `ENOENT` or `SyntaxError` terminates the process. The `runProof` function is called from the CLI entry point without any error guard around the file read.
- Fix: Wrap in try/catch; on failure, print a clear error message and exit gracefully rather than dumping a stack trace.

```json
{
"claim": "Unguarded JSON.parse + readFileSync crashes on missing/corrupt tokens file",
"evidenceRefs": [
".opencode/skills/sk-design-md-generator/tool/scripts/proof.ts:307"
],
"counterevidenceSought": "reviewed surrounding code",
"alternativeExplanation": "none found",
"finalSeverity": "P1",
"confidence": 0.7,
"downgradeTrigger": "if evidence ref is stale"
}
```


## F003-05 [P2] --output flag reads undefined when no value follows, default overrides it silently
- File: .opencode/skills/sk-design-md-generator/tool/scripts/extract.ts:80
- Evidence: `output = args[++i]` accesses beyond the array when `--output` is the last argument, yielding `undefined`. The default-path fallback at line 142 (`if (!output)`) masks this, so the bug is non-fatal — but if `--output` is followed by another flag (e.g. `--output --verbose`), `output` silently becomes `'--verbose'`, creating a surprise directory.
- Fix: Check that `i + 1 < args.length` and that `args[i+1]` does not start with `--` before consuming the value; print an error and exit if the value is missing.
