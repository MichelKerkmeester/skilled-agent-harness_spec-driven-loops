# Iteration 7 — Advisor Staleness + advisor_rebuild E040

## METADATA
- Iteration: 7 / 10
- Date: 2026-05-06
- Executor: cli-codex (gpt-5.5, high, fast)
- Focus dimension: 6 — Advisor staleness + advisor_rebuild E040

## INVESTIGATION
Read the deep-research charter, prior iterations 001-006, the native-rerun synthesis, and the native-rerun trial log. Prior iterations established that code graph is the unstable surface, while native advisor probes were useful on the sampled prompts.

This pass traced the requested advisor paths:

- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/status.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts`
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts`

Adjacent code was read where needed to answer the focus question: `skill_advisor/lib/freshness/trust-state.ts`, `skill_advisor/lib/freshness/generation.ts`, `context-server.ts`, `handlers/skill-graph/scan.ts`, daemon watcher/lifecycle files, advisor schemas, and rebuild/status tests.

Answer to the focus question: `trustState.state = "absent"` with `reason = "context-server-startup-scan"` resolves to `live` only when a later path both creates the SQLite skill graph artifact and publishes a generation whose source signature matches the new artifact state. Verified triggers are explicit `advisor_rebuild`, explicit `skill_graph_scan`, context-server startup scan, and context-server skill graph watcher events. `advisor_status` is diagnostic-only. No watchdog or automatic `advisor_status` repair path was found.

## FINDINGS
- P1 `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:63` — `advisor_rebuild` skips when `before.freshness === "live"` and ignores `before.trustState.state`, so a mixed status like `freshness: "live"` plus `trustState.state: "absent"` can refuse the normal repair path even though the operator-visible trust state is absent; recommended remediation: rebuild unless both `freshness === "live"` and `trustState.state === "live"`, or derive rebuild reason from the worse of the two axes.
- P1 `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1487` — the context-server startup skill graph scan publishes `state: "live"` immediately after `indexSkillMetadata()` and `computeAdvisorSourceSignature()` without checking that the SQLite artifact exists and that `advisor_status` would report a live trust state; recommended remediation: assert post-index artifact/trust-state invariants before publishing live, otherwise publish `absent`/`unavailable` or surface a startup warning that directs operators to `advisor_rebuild({"force":true})`.
- P2 `.opencode/skills/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts:16` — rebuild tests model `trustState.state` as identical to `freshness`, and status tests cover absent only when generation state is also absent; this misses the verified mixed-axis regression shape; recommended remediation: add tests for `freshness:"live", trustState.state:"absent", reason:"context-server-startup-scan"` and assert non-forced rebuild repairs or at least does not skip.

## EVIDENCE
Native-rerun advisor baseline:

```text
../002-native-deferred-trial-rerun/synthesis-report-native-rerun.md:25-33 says native advisor routing was useful, with three live probes routing correctly.
../002-native-deferred-trial-rerun/trials/trial-log.jsonl:8-10 records advisor_recommend probes for frontend motion, save context, and create spec folder as completed/useful.
```

Advisor status builds two separate axes:

```text
advisor-status.ts:102 reads skill graph generation metadata.
advisor-status.ts:103-105 checks sources, SQLite artifact existence, and metadata files.
advisor-status.ts:130-138 creates trustState from hasSources, hasArtifact, sourceChanged, daemon availability, generation, and generation.reason.
advisor-status.ts:145-147 outputs freshness from generation state unless a live generation is stale by source evidence.
trust-state.ts:113-120 returns state="absent" when sources or artifact are missing, preserving input.reason when supplied.
```

Startup scan can create the mixed state:

```text
context-server.ts:1470-1485 runs indexSkillMetadata() for startup-scan/watch triggers.
context-server.ts:1486 computes the advisor source signature after indexing.
context-server.ts:1487-1493 publishes skill graph generation with reason `context-server-${trigger}` and state "live".
context-server.ts:1519-1521 maps startupSkillGraphScan() to runSkillGraphIndex("startup-scan").
context-server.ts:2128-2132 schedules startupSkillGraphScan() in the background after server connect.
freshness.ts:191-194 includes missing/present SQLite and JSON artifacts in the source signature, so a live generation can be self-consistent even when the SQLite artifact is missing.
```

Repair triggers and non-triggers:

```text
advisor-status.ts:89-93 documents status as diagnostic-only and points repair callers to advisor_rebuild.
advisor-rebuild.ts:46-51 documents advisor_rebuild as the explicit repair tool.
advisor-rebuild.ts:78-86 indexes .opencode/skill and publishes reason "advisor_rebuild", state "live".
handlers/skill-graph/scan.ts:49-57 indexes skills and publishes reason "skill_graph_scan", state "live".
context-server.ts:1534-1551 starts watcher events for add/change/unlink only when startSkillGraphWatcher() is called.
context-server.ts:2097-2103 starts the skill graph watcher only inside the file-watcher-enabled startup block.
skill-advisor-hook.md:174-179 tells operators to run advisor_rebuild for stale/absent/unavailable states.
```

Rebuild skip bug:

```text
advisor-rebuild.ts:60 reads status.
advisor-rebuild.ts:61 derives reason only from before.freshness and force.
advisor-rebuild.ts:63-75 skips rebuild when before.freshness is live and force is not true.
advisor-tool-schemas.ts:203-219 allows freshness and trustState.state as independent fields; the schema does not require equality.
```

Test coverage gap:

```text
advisor-rebuild.vitest.ts:12-33 creates test status where trustState.state equals freshness.
advisor-rebuild.vitest.ts:81-99 asserts live freshness skips rebuild.
advisor-status.vitest.ts:102-109 covers absent freshness only when the generation fixture is absent.
advisor-status.vitest.ts:54-74 covers signed live generations even when source mtimes exceed SQLite writes, but not live generation plus missing SQLite artifact.
```

Git history check:

```text
git log -30 --grep=E040 matched e5b8b812f0 "critical MCP server import naming mismatches"; scoped -S'E040' under skill_advisor/advisor-rebuild paths returned no hits.
git log -30 --grep='advisor_rebuild|advisor-rebuild' matched several advisor-related cleanup/reindex commits.
git log -30 -S'advisor_rebuild' scoped to advisor-rebuild handler/tests matched 78291c8099 and f1167567aa.
No verified commit in the last 30 links E040 directly to advisor_rebuild behavior. The E040 evidence found in-tree maps to memory search errors, not advisor rebuild.
```

## NEW INSIGHTS
- The problematic state is not simply `freshness: "absent"`. It can be `freshness: "live"` with `trustState.state: "absent"` because status freshness follows generation metadata while trust state also checks physical artifact presence.
- `context-server-startup-scan` is a generation publication reason, not a repair loop. Seeing it on an absent trust state means a startup scan published generation metadata, but the status trust postconditions are not satisfied.
- `advisor_rebuild({})` may be insufficient for this mixed state because the skip gate keys only on freshness. `advisor_rebuild({"force":true})` is the verified operator escape hatch under current code.
- No watchdog was found. The only automatic runtime path is the optional skill graph watcher, and it is gated by the file-watcher startup path.
- E040 appears unrelated to `advisor_rebuild` in the current evidence. The verified E040 references are memory/search error-code surfaces.

## OPEN QUESTIONS
- Should `advisor_status.freshness` be downgraded to `absent` whenever `trustState.state` is absent, or should callers always reason over both axes?
- Should `advisor_rebuild` return a diagnostic warning when freshness and trust state diverge, even if forced rebuild succeeds?
- Should context-server startup scan call `readAdvisorStatus()` after publication and downgrade the generation when the trust state is not live?
- Should skill graph watcher startup be decoupled from `isFileWatcherEnabled()` so advisor repair events are available even when markdown memory watching is disabled?
