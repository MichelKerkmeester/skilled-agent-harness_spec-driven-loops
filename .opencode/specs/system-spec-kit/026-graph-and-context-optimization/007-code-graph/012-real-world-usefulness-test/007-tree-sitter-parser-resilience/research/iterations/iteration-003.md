---
title: "Deep Research Iteration 3 — Parser-instance reuse hypothesis discrimination"
description: "Direct test of B2 (memory access out of bounds) shared-state hypothesis via lifecycle audit + isolation probes + upstream version sweep."
trigger_phrases:
  - "iteration 3 parser resilience"
  - "parser-instance reuse hypothesis"
  - "B2 isolation test"
importance_tier: "important"
contextType: "research"
---

# Iteration 3 — Parser-instance reuse hypothesis discrimination

**Date:** 2026-05-06
**Executor:** cli-codex / gpt-5.5 / high / fast (dispatched)
**Focus:** discriminate the B2 (`memory access out of bounds`) shared-parser-state sub-hypothesis seeded by iter 2; reclaim the deferred upstream-version sweep; sketch a deterministic B2 reproducer.

---

## Findings (P0/P1/P2)

### P0 — Parser-instance is a TRUE module-level singleton, reused across all files and grammars

`tree-sitter-parser.ts:42`:
```ts
let parserInstance: any = null;
```
Single allocation in `ensureInit()` at `tree-sitter-parser.ts:78-94`:
```ts
async function ensureInit(): Promise<void> {
  if (parserInstance) return;        // line 79 — short-circuit on second call
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const mod = await import('web-tree-sitter');
      ParserClass = mod.default ?? mod;
      await ParserClass.init();
      parserInstance = new ParserClass(); // line 87 — single allocation, never replaced
    } catch (err) {
      initPromise = null;
      parserInstance = null;          // line 91 — only re-allocates on init throw
      throw err;
    }
  })();
  return initPromise;
}
```
Per-file path at `tree-sitter-parser.ts:713-714`:
```ts
parserInstance.setLanguage(lang);     // grammar swap on the SAME instance
const tree = parserInstance.parse(content);
```
**No `parser.delete()` between files. No reset call. No new instance per file.** The same WebAssembly linear memory (heap, scanner state, lexer tape) is recycled across every parse in a scan, regardless of grammar transitions. — `[SOURCE: .opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:42, :78-94, :676, :713-714]`

### P0 — Caller loop is strictly sequential against the shared singleton

`structural-indexer.ts:2123-2152` (`parse-candidates` phase):
```ts
async run(deps) {
  const { candidateFiles, ... } = deps['find-candidates'];
  const results: ParseResult[] = [];
  ...
  for (const file of candidateFiles) {            // line 2131
    const language = detectLanguage(file);
    if (!language || !config.languages.includes(language)) continue;
    if (skipFreshFiles && !isFileStale(file)) { preParseSkippedCount++; continue; }
    try {
      const content = readFileSync(file, 'utf-8');
      const result = await parseFile(file, content, language, config.edgeWeights);  // line 2145
      results.push(result);
    } catch { /* skip unreadable */ }
  }
  return { candidateFiles, results, ... };
}
```
`parseFile()` at `structural-indexer.ts:1244-1245` calls `getParser()` (which awaits `ensureInit()`), then `parser.parse(...)`. The for-of + `await` is a **strictly sequential** drain over `candidateFiles`, no `Promise.all`, no concurrency. Every file in a single `code_graph_scan` traverses the SAME `parserInstance`. — `[SOURCE: .opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1219-1257, :2123-2152]`

### P1 — Isolation probes REJECT the simplest "bash-B1 throw poisons next parse" theory

Test harness: `scratch/fixtures/iter-003-isolation-test.mjs` (5 probes, each a fresh `node` process loading `web-tree-sitter@0.24.7` directly from `mcp_server/node_modules` and grammars from `tree-sitter-wasms@0.1.13`). Output captured at `scratch/fixtures/iter-003-isolation-output.txt`. Results:

| Probe | Sequence | Outcome | Evidence |
|---|---|---|---|
| P1 | parse `vitest.phase-k.config.ts` ALONE (typescript) | **OK** (rootKind=program, hasError=false) | does NOT reproduce B2 in isolation |
| P2 | parse `runners/common.ts` ALONE (typescript) | **OK** | does NOT reproduce B2 in isolation |
| P3 | parse `mcp-doctor-lib.sh` ALONE (bash) | **THROW** "resolved is not a function" | confirms B1 (iter-2 finding holds) |
| P4 | parse clean `structural-indexer.ts` THEN `vitest.phase-k.config.ts` (both ts, shared parser) | **OK** | rejects "ts-after-ts state corruption" |
| P5 | parse `mcp-doctor-lib.sh` (bash → throw) THEN `vitest.phase-k.config.ts` (ts) on the SAME parserInstance | **OK** | rejects "bash-B1 throw poisons next ts parse" |

**Verdict on the leading B2 sub-hypothesis:** the *simplest* parser-instance reuse story — "bash B1 throw leaves the WASM heap corrupt; next file OOBs regardless of content" — is **REJECTED** by P5. A 2-file sequence is not sufficient to reproduce B2. Production B2 must therefore depend on (a) a longer cumulative parse history (heap fragmentation across hundreds of files), (b) a specific grammar-switch pattern not covered by P4/P5, or (c) a different mechanism entirely (e.g., GC pressure during long async drains, OS-level signal interaction, or a content-syntactic trigger that only manifests after N prior parses). — `[SOURCE: scratch/fixtures/iter-003-isolation-output.txt, scratch/fixtures/iter-003-isolation-test.mjs]`

### P1 — `vitest.phase-k.config.ts` is not a standalone B2 trigger; production crashes are sequence-dependent

The 20-line / 634-byte `vitest.phase-k.config.ts` was the iter-2 counterexample that killed the size-driven B2 sub-hypothesis. Iter-3 P1 proves it ALSO fails to crash standalone. Combined with P4/P5 also passing, this means: **no single file in our sampled cohort crashes deterministically in a fresh process**. Production B2 reproduction requires replaying the SAME ordered sequence of files from `parse_diagnostics` against a single shared `parserInstance`. This is a stronger constraint than iter-2 surfaced — it disqualifies any "find the toxic file" approach. — `[SOURCE: scratch/fixtures/iter-003-isolation-output.txt, .opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite parse_diagnostics]`

### P1 — Upstream `web-tree-sitter` is on `0.26.8` while we vendor `0.24.7`; tree-sitter-wasms is current

NPM registry snapshot (2026-05-06):
- `web-tree-sitter`: latest = **0.26.8** (most recent line: `0.26.0 → 0.26.3 → 0.26.4 → 0.26.5 → 0.26.6 → 0.26.7 → 0.26.8`). Vendored `0.24.7` was published 2025-01-12; we are **two minor versions and 8 patches behind** on a runtime that explicitly handles WASM linear-memory and dynamic-linker behavior.
- `tree-sitter-wasms`: latest = **0.1.13**, published 2025-10-07. **Matches vendored.** No upstream pre-built grammar bump available.

This means a remediation path of "bump web-tree-sitter only" exists without changing grammar artifacts. The vendored 0.24.7 line `tree-sitter.js:1163-1180` (proxy stub) and `:1429` (`allowUndefined: true` flag) are the specific surfaces a 0.26.x bump might have addressed. Worth probing during Phase 2 implementation. — `[SOURCE: https://registry.npmjs.org/web-tree-sitter (queried 2026-05-06), https://registry.npmjs.org/tree-sitter-wasms (queried 2026-05-06)]`

### P2 — Tree-sitter upstream issue tracker has no exact-phrase match for our crash

Targeted searches:
- `gh search issues 'memory access out of bounds wasm' --owner tree-sitter --include-prs --limit 6` → 0 results
- `gh search issues 'web-tree-sitter parserInstance reuse'` → 0 results
- Recent OOB-adjacent PR: `tree-sitter/tree-sitter#5573` "Fix `--debug pretty` parse OOB" — color-array index OOB in CLI debug pretty-printer; **NOT our crash signal** (we don't run the CLI, and ours is WASM linear-memory, not color-array index). Adjacent context only.

No upstream issue is a direct hit. This pushes the bug to either (a) our specific 0.24.7 ↔ 0.1.13 build pair, (b) a known-fixed-but-unfiled issue addressed silently in 0.25.x or 0.26.x release notes, or (c) a usage-pattern bug on our side (parser-instance reuse semantics) that upstream considers WAI but is undocumented. — `[SOURCE: gh search results, https://github.com/tree-sitter/tree-sitter/pull/5573]`

---

## Parser-instance Lifecycle Evidence

| Concern | File:line | Evidence |
|---|---|---|
| Singleton declaration | `tree-sitter-parser.ts:42` | `let parserInstance: any = null;` |
| Single allocation site | `tree-sitter-parser.ts:87` | `parserInstance = new ParserClass();` (only assignment outside the `null` reset on init throw at `:91`) |
| Re-entry guard | `tree-sitter-parser.ts:79` | `if (parserInstance) return;` — second `ensureInit()` call short-circuits |
| Pre-parse readiness check | `tree-sitter-parser.ts:676-691` | Returns `parseHealth: 'error'` if `!parserInstance`, else proceeds |
| Grammar switch | `tree-sitter-parser.ts:713` | `parserInstance.setLanguage(lang);` — mutates the singleton's language pointer |
| Parse call | `tree-sitter-parser.ts:714` | `const tree = parserInstance.parse(content);` |
| No reset/delete | (anywhere) | `grep` for `parserInstance.delete\\|parserInstance.reset\\|parserInstance = new` returns only the init site |
| Caller loop | `structural-indexer.ts:2131-2147` | `for (const file of candidateFiles) ... await parseFile(file, ...)` — strict serial drain |
| `getParser()` | `structural-indexer.ts:1244` (callsite); `tree-sitter-parser.ts:887` (definition) | Returns a `ParserAdapter` wrapping the same singleton — does NOT vend per-call instances |

**Lifecycle invariant:** within a single `code_graph_scan` run, `parserInstance` is allocated once during the first call to `parseFile`, then reused for **every** subsequent file in the scan. WebAssembly linear memory persists across calls; only the language pointer rotates via `setLanguage()`. Tree-sitter's documented contract for `setLanguage()` is to wipe parser state, but it does NOT free WASM heap allocations — those persist for the parser's lifetime.

---

## Order-dependence Test Results

**Harness:** `scratch/fixtures/iter-003-isolation-test.mjs` (Node ESM, ~95 LOC, runs as standalone Node process). Each probe is invoked as `node iter-003-isolation-test.mjs --probe=N` so each gets a fresh `parserInstance`.

**Output excerpt:** `scratch/fixtures/iter-003-isolation-output.txt`
```
===== PROBE 1 =====
[P1.alone-vitest] file=029-stress-test-v1-0-4/measurements/vitest.phase-k.config.ts bytes=634
[P1.alone-vitest] OK rootKind=program hasError=false
exit=0
===== PROBE 3 =====
[P3.alone-bash] file=doctor/scripts/mcp-doctor-lib.sh bytes=7354
[P3.alone-bash] THROW message=resolved is not a function
exit=1
===== PROBE 5 =====
[P5a.bash-throw] file=doctor/scripts/mcp-doctor-lib.sh bytes=7354
[P5a.bash-throw] THROW message=resolved is not a function
[P5b.then-vitest] file=029-stress-test-v1-0-4/measurements/vitest.phase-k.config.ts bytes=634
[P5b.then-vitest] OK rootKind=program hasError=false
exit=0
```

**Interpretation:**
- **P3 reproduces B1** identically to production (confirms iter-2's bash-WASM symbol-export gap holds end-to-end through fresh-process isolation).
- **P1, P2, P4 all pass** — none of the sampled OOB victims crashes alone or after a single clean predecessor.
- **P5 (the central hypothesis test) PASSES** — even after a bash B1 throw, the next typescript parse succeeds. The simplest "shared-state poisoning by bash throw" model is rejected.

**What this means for B2 root-cause search:** the production OOBs are not 1- or 2-step deterministic. They emerge after some longer prior history (likely cumulative WASM-heap fragmentation across hundreds of `setLanguage()` + `parse()` cycles, or a content trigger that only manifests after the heap has been "dirtied" by N prior parses). The implementation phase will need either:
- a soft skip-list (current plan, sound regardless of root cause), OR
- a per-file `parser.delete()` + `new ParserClass()` (1 mil-ish ms overhead per file × ~9k files = ~9s scan-time tax, possibly worth it), OR
- a cohort-level reproducer harness that replays the exact `parse_diagnostics`-recorded sequence of failed files in order to deterministically trigger B2 in isolation (left for iter 4 if B2 still blocks).

---

## Upstream State

| Package | Vendored | Latest (npm, 2026-05-06) | Gap |
|---|---|---|---|
| `web-tree-sitter` | 0.24.7 (2025-01-12) | **0.26.8** | 2 minor versions, 8+ patch versions, ~16 months stale |
| `tree-sitter-wasms` | 0.1.13 (2025-10-07) | 0.1.13 | current |

Recent web-tree-sitter line: `0.25.6 → 0.25.7 → 0.25.8 → 0.25.9 → 0.26.0 → 0.25.10 → 0.26.3 → 0.26.4 → 0.26.5 → 0.26.6 → 0.26.7 → 0.26.8`.
Note the 0.25.10 published AFTER 0.26.0 — backport pattern, suggests fix-trains on the older line. Worth a release-notes scrub during Phase 2.

GitHub issue search (no exact match):
- `tree-sitter/tree-sitter` issues containing "memory access out of bounds" + "wasm": **0 hits**
- "web-tree-sitter parserInstance reuse": **0 hits**
- Adjacent: `tree-sitter/tree-sitter#5573` (closed 2026-05-05) — fixes color-array OOB in `--debug pretty`. NOT our crash; CLI-only debug helper. Confirms upstream is actively fixing OOBs but in a different surface.

**Recommendation for Phase 2:** budget one packet for "web-tree-sitter 0.24.7 → 0.26.x bump + replay the iter-3 cohort against the bumped runtime". If 0.26.x kills both B1 and B2, the skip-list becomes a defense-in-depth layer rather than the primary remediation.

---

## Verdict

- **Parser-instance reuse hypothesis (literal singleton, no per-file reset):** **CONFIRMED as the runtime architecture** (P0). `parserInstance` IS reused across all files and all grammar switches.
- **B2 = "bash-B1 throw corrupts shared state, next parse OOBs":** **REJECTED** (P5 isolation test passes).
- **B2 = "size-driven WASM linear-memory exhaustion":** previously ruled out (iter 2). Confirmed here: vitest.phase-k.config.ts (634 bytes) does not crash alone or in 2-file sequences.
- **B2 root cause (open):** requires either cumulative-history reproduction (replay the production sequence) OR a different mechanism (GC, signal handler, OS interaction, undocumented WASM scanner state). **Not solvable inside iter 3.**
- **Hypothesis ranking entering iter 4:** B1 (CONFIRMED, ready for remediation) > B2-cumulative-history > B2-build-defect (now stale, given current wasms = 0.1.13) > C-content-syntax (still untouched) > A (RULED OUT).

**Plan-input note** (carry to Phase 2, not a finding): the skip-list design must NOT assume single-file determinism. Eviction by file-path is sound; self-heal by N-consecutive-successes after a runtime/version bump remains correct. But any unit test that tries to prove "file X always crashes" will be brittle — drive the test instead by "running scan over the recorded production sequence still produces ≥ N crashes" (regression baseline, not pinpoint).

---

## Answered Questions (this iter)

- **Q2-extended:** Parser-instance lifecycle is now fully mapped. Singleton, no reset, sequential caller. The runtime architecture matches the iter-2 hypothesis sketch exactly.
- **Q5-extended:** B1 reproduces deterministically in fresh-process isolation (P3) — externally validates iter-2 evidence and primes the upstream bug-report path if 0.26.x doesn't fix it.
- **Q1-extended:** Vendored vs upstream gap quantified. `web-tree-sitter` 2 minors / 8 patches behind. `tree-sitter-wasms` current.
- **Q3 (new partial):** Content-syntactic triggers cannot be the SOLE B2 mechanism — at least three different OOB victims (vitest config, runners/common.ts, structural-indexer.ts) all parse cleanly in isolation, so any content-trigger must require a primed/dirtied parser state to manifest. Reframes Q3 as "content + state interaction" rather than "content alone".

## Ruled Out

- "Bash-B1 throw directly poisons next parse" — rejected by P5.
- "Single toxic file in cohort triggers B2 deterministically" — rejected by P1, P2 (both OK alone). Deterministic isolation reproducer is not 1-file.
- "tree-sitter-wasms 0.1.13 is stale" — rejected by registry check (it's the latest published).

## Dead Ends (candidate for §9 EXHAUSTED APPROACHES)

- **2-file isolation testing for B2.** Probes 4 and 5 both passed; we know the production B2 sequence is not a 2-file pattern. Don't keep retrying 2-file shapes — go straight to N-file replay or skip the empirical reproducer entirely and ship the skip-list defense.

## Edge Cases

- **Ambiguous input:** "parser-instance reuse" had two interpretations — (a) singleton-literal (yes per P0), (b) state-poisoning across grammars (no per P5). Both reported separately to avoid conflation.
- **Contradictory evidence:** none. P5 cleanly disconfirms the 2-file model without contradicting P0's lifecycle finding.
- **Missing dependencies:** `wabt`/`wasm-objdump` still unavailable; not needed this iter.
- **Partial success:** isolation harness initially failed with module-resolver path bug (CJS resolver from outside `node_modules` host); fixed by climbing-search for repo root and routing through `createRequire(MCP/package.json)`. Documented in script for reproducibility.

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:42, :78-94, :676, :713-714, :760-781`
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1219-1257, :2123-2152`
- `.opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite` — `parse_diagnostics` cohort (51 OOB rows; 5 sampled)
- `scratch/fixtures/iter-003-isolation-test.mjs` (created this iter)
- `scratch/fixtures/iter-003-isolation-output.txt` (created this iter)
- `https://registry.npmjs.org/web-tree-sitter` (latest 0.26.8 vs vendored 0.24.7)
- `https://registry.npmjs.org/tree-sitter-wasms` (latest 0.1.13 = vendored)
- `https://github.com/tree-sitter/tree-sitter/pull/5573` (adjacent OOB fix; not our cohort)

## Reflection

- **What worked:** writing the 5-probe isolation harness as a single mjs file with `--probe=N` selector kept fresh-process isolation cheap (5 invocations, ~1s each) and gave a clean truth table. Bisecting "shared parserInstance" as a literal architecture question (P0 evidence from grep + line-by-line read) before testing the *behavioral* claim (P5) prevented confusing "the architecture exists" with "the architecture causes the bug".
- **What did not work:** initial harness path-resolver counted `..` segments wrong (off-by-one, then off-by-many after the path-strip artifact); cost 2 retries. Replaced with a "climb until package.json found" loop — robust against future moves of the script. Lesson: prefer marker-search to relative-path counting when the script lives outside `node_modules`.
- **What I would do differently:** for iter 4's cohort replay (if needed), build the harness *inside* `mcp_server/` (under a scratch dir there) so resolver-path issues vanish. Keep the test-fixture directory under the research packet for evidence retention, but symlink or relocate the executable.

## Recommended Next Focus (iter 4 priorities)

1. **Cohort replay harness (highest priority).** Build `scratch/fixtures/iter-004-cohort-replay.mjs` that reads the exact ordered file list from `parse_diagnostics` (or the `code_graph_scan` traversal order, which is what production used) and parses each through ONE shared `parserInstance` until the first OOB throw. Goal: produce a deterministic, in-process B2 reproducer with a minimum prefix length. If the prefix is < 10 files, hypothesis (a) "cumulative heap dirty" wins. If it's > 100 files, hypothesis (c) "GC/signal/OS interaction" gains weight. If we can't reproduce at all in a single process, the bug requires the MCP-server async runtime context.
2. **Quick web-tree-sitter 0.26.8 swap probe.** Inside the same harness, swap `0.24.7` for a temp-installed `0.26.8` and replay the same sequence. If 0.26.8 silently fixes both B1 and B2, that's a one-line dependency bump and the skip-list demotes to defense-in-depth.
3. **Hypothesis C surface scan (deferred from iters 1-3).** Apply a tree-sitter-typescript syntax pass to the 51 OOB victims, looking for: deep generics, mapped/conditional types, template-literal nesting, decorator stacks. Even though iter 3 P1/P2/P4 disprove "content-alone-triggers-B2", a content-AND-state interaction may still bias which prefix lengths trigger first.
4. **Skip-list parameter calibration finalization.** Wire findings into the Phase 2 plan-input. Cap at N=2048 entries; LRU eviction keyed by `(file_path, content_hash)` to avoid re-parsing healed files on content-bump; self-heal at 5 consecutive scan-survivals after a `web-tree-sitter` version bump.
5. **(Touch only if 1-3 land cleanly)** start drafting the Phase 2 implementation packet skeleton: schema v5 migration, parser wrapper changes, status/scan response surface fields. Keep this iter-5+ work — don't crowd iter 4.

**Updated hypothesis ranking entering iter 4:** B1 (CONFIRMED, fresh-process reproducible — implementation-ready) > B2-cumulative-history > B2-content+state-interaction > B2-runtime-context (MCP async layer) > B2-build-defect (probability dropped further this iter) > C-content-syntax-alone (rejected) > A (RULED OUT).
