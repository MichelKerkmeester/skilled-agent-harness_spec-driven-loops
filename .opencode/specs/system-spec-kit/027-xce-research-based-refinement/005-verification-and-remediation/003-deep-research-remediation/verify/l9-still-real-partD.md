# L9 Still-Real Verification — P2/P3 Sweep, Part D (14 findings)

Fresh-verifier batch run, 2026-06-12. Each finding re-checked against current code/docs on branch `028-mcp-to-cli-tool-transition`, including overtake checks against today's shipped lanes (single-writer DB lock, secret scrubber, hash-only fingerprints, --command dispatch, apply-pipeline gates, launcher lifecycle docs, detect_changes adoption, advisor doc batch, command-dashboard adherence L8).

## Summary Table

| ID | Severity | Verdict | Fix Class | One-line basis |
|----|----------|---------|-----------|----------------|
| tri-155 | P2 | STILL-REAL | doc-only | Manifest still hardcodes EXPECTED_TOOL_NAMES and throws (code-index-cli-manifest.ts:10-37, invoked code-index-cli.ts:279); spec.md:72 and :93 still claim "new tools auto-propagate" |
| tri-158 | P2 | STILL-REAL | doc-only | Re-ran static anchor check: 11 of 28 anchors now stale (was 9), missingPaths/missingSymbols both empty |
| tri-159 | P2 | REFUTED | n/a | Companion literal assertions already existed pre-finding: code-graph-indexer.vitest.ts:362-364, code-graph-scan.vitest.ts:427-491 (since 6647661f32, 2026-05-07) |
| tri-160 | P2 | STILL-REAL | doc-only | Doc lane still returns zero nodes/edges (structural-indexer.ts:1235-1247); no doc names the lane as file-row-only coverage |
| tri-161 | P2 | STILL-REAL | code-small | activeScope (status.ts:350-364) still omits includeGlobs/excludeGlobs; buildLabel (index-scope-policy.ts:175-187) never mentions glob narrowing |
| tri-162 | P2 | STILL-REAL | doc-only | strategy.md:51 still says "spec-memory COVERED_BY edges"; causal-edges.ts:21-28 still allows only the six relation types |
| tri-169 | P2 | STILL-REAL | code-small | All three routers still score `if keyword in text` (sk-git SKILL.md:121, sk-code-review SKILL.md:183, shared_smart_router.md:63) |
| tri-176 | P2 | STILL-REAL | doc-only | projection.md:57 still says "Inspect projection caps in projection.ts"; projection.ts only clamps edge weight (~:306); traversal caps live in lanes/graph-causal.ts:27,61 |
| tri-177 | P2 | STILL-REAL | doc-only | README.md:98 env override vs README.md:190 + lane_weight_tuning.md:86 source-edit; launcher allowlist (mk-skill-advisor-launcher.cjs:85-122) still strips the env var |
| tri-178 | P2 | STILL-REAL | doc-only | README.md:108 "does not rebuild on its own" vs ARCHITECTURE.md:113,129 watcher rebuilds; code sides with ARCHITECTURE (watcher-orchestrator.ts:99-122 reindexes + publishes live) |
| tri-179 | P2 | STILL-REAL | code-small | Fixture still exactly 50 cases; gates (skill_advisor_regression.py:284-290) still ignore total_cases |
| tri-182 | P2 | STILL-REAL | code-small | Timeout marker branch still guarded by `!cliFallbackAttempted` (user-prompt-submit.ts:360); default CLI-fallback path still bypasses it |
| tri-190 | P2 | STILL-REAL | doc-only | Both YAMLs still run `git add {state_paths.artifact_dir}` (research:967, review:1302) while state_paths defines only packet_dir (research:98, review:89) |
| tri-192 | P2 | STILL-REAL | code-small | L8 shipped the exact fix sketch (inline MUST template, search.md:56-71) and then re-proved the failure: 3/3 bare gpt-5.5-medium probes still rendered prose (ef4afeae83) |

**Tally: 13 STILL-REAL, 1 REFUTED, 0 MOVED, 0 OVERTAKEN.**

---

## Per-Item Notes

### tri-155 — STILL-REAL (doc-only)
`/.opencode/skills/system-code-graph/mcp_server/code-index-cli-manifest.ts:10-19` still hardcodes the 8-name `EXPECTED_TOOL_NAMES` list; `assertCodeIndexCliManifest()` (:23-37) throws on any count/name mismatch and is invoked at `code-index-cli.ts:279`, so a new tool added to `CODE_GRAPH_TOOL_SCHEMAS` hard-fails the CLI until the list is manually updated. `016-cli-tooling-ux/spec.md:72` still says "new tools auto-propagate, and code-index has a drift-guard manifest" and :93 (out-of-scope) repeats "new tools auto-propagate" unqualified. The drift-guard phrase predates the finding (scaffold commit 0251162adc, 2026-06-10) — no overtake. Minimal fix: reword the two spec lines to "registry-backed with an explicit parity guard requiring manual acceptance".

### tri-158 — STILL-REAL (doc-only fixture refresh)
Re-ran the static anchor check against `.../002-code-graph-resilience-research/assets/code-graph-gold-queries.json` (28 queries): `missingPaths: []`, `missingSymbols: []`, `staleLinesCount: 11` — worse than the finding's 9, and including the exact cited example (GQ-MCP-001 → query.ts:1198 = `// exactly. We over-collect...`, none of handleCodeGraphQuery/QueryArgs/SUPPORTED_RELATIONSHIP_OPERATIONS). Newly stale since filing: GQ-MCP-002/003/005/006, GQ-TYPE-002/004, GQ-REG-003/004/006/007. The 06-07 repair packet (014-gold-query-battery-repair) fixed paths/symbols only — line anchors keep drifting. Optional companion code-small: a static test failing when an anchored line contains none of the expected symbols.

### tri-159 — REFUTED
The protection the fix sketch requests ("a regression query or companion static assertion that explicitly checks the plural root literals") already exists and predates the finding: `code-graph-indexer.vitest.ts:362-364` asserts the literal strings `'**/.opencode/skills/**'`, `'**/.opencode/agents/**'`, `'**/.opencode/commands/**'` against runtime `config.excludeGlobs`, and `code-graph-scan.vitest.ts:427,455,483,490-491` does the same per-folder. These assertions landed with the pluralization commit itself (6647661f32, 2026-05-07). A plural→singular regression in `index-scope-policy.ts:14-20` would fail these unit tests even though the gold battery itself stays literal-blind. The narrow claim about the battery is true but the risk is already guarded.

### tri-160 — STILL-REAL (doc-only)
`indexer-types.ts:169-174` still includes `**/*.md` through `**/*.toml` in default include globs with `'doc'` in the language list; `structural-indexer.ts:1235-1247` still returns a doc ParseResult with `nodes: []`, `edges: []`, `parseHealth: 'clean'`; `code-graph-indexer.vitest.ts:659-668` pins `node_count: 0, edge_count: 0` for all 24 doc rows. No README/SKILL.md text names the doc lane as empty file-level indexing (grep for doc-lane honesty language returned nothing relevant). File counts still read as structural coverage.

### tri-161 — STILL-REAL (code-small)
`handlers/status.ts:350-364` still emits `activeScope` with only fingerprint/label/include flags — no `includeGlobs`/`excludeGlobs` fields (the policy object carries both, index-scope-policy.ts:38-39). `buildLabel()` (index-scope-policy.ts:175-187) builds the label exclusively from the five folder opt-ins; a TS-narrowed graph (`includeGlobs=[*.ts]`) surfaces only inside the fingerprint string. (Side observation: the activeScope literal contains duplicate `includeAgents`/`includeCommands`/etc. keys — the earlier `includedAgents: 'all'|'none'` style rows plus later boolean rows.)

### tri-162 — STILL-REAL (doc-only)
`028-tri-system-deep-research/research/deep-research-strategy.md:51` still reads "code-graph key_files vs spec-memory COVERED_BY edges". `system-spec-kit/mcp_server/lib/storage/causal-edges.ts:21-28` still allows only caused/enabled/supersedes/contradicts/derived_from/supports; zero `COVERED_BY` hits anywhere under the spec-memory lib. COVERED_BY remains deep-loop coverage-graph vocabulary only.

### tri-169 — STILL-REAL (code-small, multi-file template change)
All three routers still use unbounded substring scoring: `sk-git/SKILL.md:61-66` (FINISH keywords include bare `"pr"`, COMMIT includes `"message"`) scored at :119-123 via `if keyword in text`; `sk-code-review/SKILL.md:127-134` scored at :181-184; `shared_smart_router.md:58-64` (`if keyword in text`) plus the ON_DEMAND `any(keyword in text ...)` at :117-120. The greedy matches reproduce (`'pr' in 'improve prompt'` → True). No boundary-aware matcher shipped in any of today's lanes.

### tri-176 — STILL-REAL (doc-only)
`manual_testing_playbook/08--scorer-fusion/projection.md:57` still instructs "Inspect projection caps in `projection.ts`". `scorer/projection.ts` contains only the edge-weight clamp `Math.max(0, Math.min(1, row.weight))` (~:306); traversal bounding lives in `scorer/lanes/graph-causal.ts` (`maxDepth` option :9, default 2 at :27, depth gate :61). The advisor doc batch did not touch this playbook section.

### tri-177 — STILL-REAL (doc-only)
Two-path conflict intact: `README.md:98` advertises `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` override; `README.md:190` (FAQ) and `references/scoring/lane_weight_tuning.md:86` instruct editing `lane-registry.ts:7-19`/`:32-38`. The env var IS read by `scorer/lane-registry.ts`, but `mk-skill-advisor-launcher.cjs:85-122` `CHILD_ENV_ALLOWLIST` does not include it and `createChildEnv()` (:231-235) filters strictly by that allowlist — so the env path remains dead in normal daemon use. Neither doc names the pass-through/restart requirement.

### tri-178 — STILL-REAL (doc-only)
`README.md:108`: daemon "holds a single-writer lease and does not rebuild on its own. The trusted mutation paths that update the SQLite database are advisor_rebuild and skill_graph_scan". `ARCHITECTURE.md:113` and :129: watcher "triggers incremental rebuilds on file change". Code sides with ARCHITECTURE: `lib/daemon/watcher-orchestrator.ts:99-122` calls `options.reindexSkill(...)` on changed-hash detection and then `publishSkillGraphGeneration({ ..., reason: 'skill-graph-daemon-reindex', state: 'live' })`. Bonus staleness: ARCHITECTURE.md cites `mcp_server/daemon/watcher.ts`; the actual module is `mcp_server/lib/daemon/watcher.ts`. README is the wrong side; writer-set guidance still contradictory.

### tri-179 — STILL-REAL (code-small)
`scripts/fixtures/skill_advisor_regression_cases.jsonl` is still exactly 50 lines. Gates at `skill_advisor_regression.py:284-290` remain `top1_accuracy`, `command_bridge_fp_rate`, `p0_pass_rate`, `all_cases_passed` with `overall_pass = all(gates.values())`; `total_cases` (:210) is reported, never gated, and no `--min-total-cases` style flag exists (grep: zero hits). A shrunken fixture still exits 0.

### tri-182 — STILL-REAL (code-small)
`hooks/codex/user-prompt-submit.ts`: `cliFallbackAttempted` is set at ~:336-337 (`buildCliBrief !== null && shouldTrySkillAdvisorCliFallback(result)`), and the timeout-marker branch at :360 is still `if (!cliFallbackAttempted && result.status === 'fail_open' && result.diagnostics?.errorCode === 'TIMEOUT')`. On the default path a native fail-open timeout triggers CLI fallback first, so even when the fallback also fails, `timeoutFallbackOutput()` is unreachable. No lane today touched this hook.

### tri-190 — STILL-REAL (doc-only YAML fix)
`deep_start-research-loop_auto.yaml:967` and `deep_start-review-loop_auto.yaml:1302` both still run `command: "git add {state_paths.artifact_dir}"`. Each `state_paths` block defines `packet_dir: "{artifact_dir}"` (research :98, review :89) but no `artifact_dir` key — the `{artifact_dir}` tokens inside values resolve a top-level variable, not a state_paths member. One-token fix to `{state_paths.packet_dir}` in both files (research :967, review :1302; the later targeted `git add` lists at research :1072 / review :1414 use valid keys).

### tri-192 — STILL-REAL (code-small; doc-only remedy proven insufficient)
The L8 lane shipped exactly this finding's fix sketch: `commands/memory/search.md:56` now opens "MUST emit exactly this shape for retrieval results:" with the compressed MEMORY:SEARCH header / score+#id rows / STATUS footer template (:56-71) and slot rules, with the full contract pointer at :109 (asset renamed `.md`→`.txt` in 9a256b6e35; shipped in c3911dfe2f + 93bd498744). But L8's own re-test (commit ef4afeae83, 2026-06-12) records that three bare /memory:search probes on gpt-5.5 medium ALL still rendered prose despite the inlined template. The behavioral finding therefore survives its own doc-only remedy; the recorded durable lever is the open R8 (mechanical CI golden-fixture render lint) + R7 (workflow assets) follow-ons. Not OVERTAKEN — re-verified failing today.
