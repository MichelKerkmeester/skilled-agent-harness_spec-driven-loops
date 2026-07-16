# L6 Batch Still-Real Verification — save/continuity truth (17 findings)

> Verifier: fresh Fable 5 pass, 2026-06-12. Every citation below was re-read from current working-tree code; banked line numbers from the original triage were NOT trusted.

## Summary

| ID | P | Verdict | Fix class | One-line risk |
|---|---|---|---|---|
| tri-015 | P1 | STILL-REAL (narrowed) | code-small | MCP-routed canonical saves leave description.json/graph-metadata.json stale; refresh is only an advisory follow-up |
| tri-020 | P1 | STILL-REAL | code-careful (or doc-only) | Direct `session_resume` callers land on the phase parent, not the active child; schema comment overstates |
| tri-021 | P1 | STILL-REAL | doc-only (template) or code-small (parser) | Template-authored handovers win the ladder with empty next-step/blocker fields |
| tri-046 | P1 | STILL-REAL | doc-only (workflow asset) | Deep-loop "automatic" memory save fails with EXPLICIT_DATA_FILE_LOAD_FAILED unless the agent improvises the payload |
| tri-047 | P1 | STILL-REAL | doc-only | Operators following deep-review protocol hit the hard "direct spec folder mode" rejection and verify retired memory/*.md |
| tri-069 | P2 | STILL-REAL | doc-only | README declares a working bridge "non-functional", inviting wrong manual workarounds |
| tri-071 | P3 | STILL-REAL | doc-only | Six README claims of fixed handover-first order contradict freshest-wins code + tests |
| tri-120 | P2 | STILL-REAL | doc-only | session_resume remains a session-accepting surface outside resolveTrustedSession, undocumented in the trust contract |
| tri-128 | P2 | STILL-REAL | doc-only | Contract tells writers to put continuity in every doc; runtime reads/maintains only the implementation-summary host |
| tri-130 | P2 | STILL-REAL | code-small (test-only) | Promoter durability at scale (dup edges, manual-edge preservation, tombstones) unverified beyond 7 small unit cases |
| tri-132 | P2 | STILL-REAL | code-small (test-only) | Recall-affecting scope-then-limit fix has no stress coverage near SQLite param limits / large BM25 candidate sets |
| tri-139 | P2 | STILL-REAL | code-small | Advertised 800 vs enforced 1000 memory_health budget confuses overflow diagnosis |
| tri-140 | P2 | STILL-REAL | code-careful | First-call priming payload is injected into low-budget envelopes with no truncation path (warning hint only) |
| tri-163 | P3 | STILL-REAL | code-careful (feature gap) | key_files and COVERED_BY remain disjoint vocabularies; no coverage crosswalk exists |
| tri-183 | P2 | STILL-REAL | doc-only | Setup guide's `skill_graph_scan({})` examples fail closed (exit 64) on the daemon-backed CLI without `--trusted` |
| tri-189 | P2 | STILL-REAL | code-careful (or doc-only) | Canonical review-report.md is invisible to retrieval: not in allowlist, `/review/` segment excluded |
| tri-191 | P2 | STILL-REAL | code-small | Backfill writes iteration metadata that discovery and graph-metadata classification both ignore |

**Tally: 17/17 STILL-REAL** (tri-015 narrowed by shipped doc reconciliation; no item MOVED, OVERTAKEN, or REFUTED).

## Interlocks

- **Resume-truth cluster — tri-020 + tri-021 + tri-071 + tri-128.** All four touch `lib/resume/resume-ladder.ts` and the same resume documentation surfaces. If tri-020 is fixed in code (phase-parent redirect inside `buildResumeLadder()`), the freshness-policy prose rewritten for tri-071 changes again; sequence docs after the code decision, and fix the tri-021 template/parser in the same batch since both alter what the ladder extracts.
- **Save-contract cluster — tri-015 + tri-046 + tri-047.** One generate-context/memory_save contract statement (metadata refresh owner, structured-JSON-only input, no memory/*.md) resolves the doc half of all three; patch the three deep-loop YAMLs and the deep-review protocol together to avoid re-drifting.
- **Envelope/budget cluster — tri-139 + tri-140.** Both live in `context-server.ts` post-dispatch envelope decoration. Establish the single budget source of truth (tri-139) before changing the priming policy (tri-140), or budget measurements will be redone twice.
- **Index-policy cluster — tri-189 + tri-191.** Both are `spec-doc-paths.ts` allowlist/exclusion policy decisions. Decide review-report indexing and iteration-metadata retirement as one policy change so the exclusion lists are edited once, coherently.

---

## Per-item notes

### tri-015 (P1) — memory_save and CLI do not refresh packet metadata — STILL-REAL (narrowed)

Code behavior unchanged. `handlers/memory-save.ts:3124-3143` only checks that `description.json`/`graph-metadata.json` *exist* (errors when both missing); the save indexes only the requested file via `indexMemoryFile(validatedPath, ...)` at `handlers/memory-save.ts:3539`. The CLI front door forwards the same validated tool over IPC (`spec-memory-cli.ts:946` `client.request('tools/call', ...)`), inheriting the gap. Metadata refresh exists only as an *advisory follow-up action* the planner emits (`handlers/memory-save.ts:1861-1863`, `tool: 'refreshGraphMetadata'`) — it is never performed inline.

**Partial overtaking (doc lane):** `.opencode/commands/memory/save.md:63-65` now labels `generate-context.js` as "Metadata refresh and index handoff" and `memory_save` as "Single-file indexing fallback", and step 6 (`save.md:38`) assigns the metadata/description/graph-metadata refresh to the script. That is the fix_sketch's "narrow the documentation" alternative, largely shipped. Residual gap: `tool-schemas.ts:383` still describes memory_save routed saves writing continuity into canonical docs with no mention that packet metadata is NOT refreshed, so a content-routed MCP save still silently leaves `description.json.lastUpdated`/derived graph fields stale.

- Risk: post-save freshness drift — resume/search ranking reads stale derived metadata after MCP-routed canonical writes.
- Fix class: code-small (perform the already-modeled refreshGraphMetadata follow-up inline for spec docs), or finish the doc narrowing in `tool-schemas.ts`.

### tri-020 (P1) — Phase-parent redirect absent from session_resume ladder — STILL-REAL

`handlers/session-resume.ts:649` calls `buildResumeLadder({...})` with the provided folder. A repo-wide grep for `last_active_child_id` in `mcp_server/**/*.ts` matches only `lib/graph/graph-metadata-schema.ts`, `lib/graph/graph-metadata-parser.ts`, and a stress test — nothing under `lib/resume/` or `handlers/session-resume.ts`. The schema comment at `lib/graph/graph-metadata-schema.ts:53-55` still claims "The resume ladder reads these to redirect into the live child phase" — false for the ladder. The redirect IS implemented, but only at the command-workflow layer (`.opencode/commands/speckit/assets/speckit_resume_auto.yaml:59-63`, `phase_folder_detection` block), so direct MCP `session_resume` callers resume the parent.

- Risk: direct tool callers (hooks, bridges, other runtimes) rebuild context from the lean phase-parent trio instead of the active child's continuity ladder.
- Fix class: code-careful (implement detection + fresh-pointer redirect in `buildResumeLadder()`), or doc-only (correct the schema comment and scope the redirect claim to `/speckit:resume`). Interlock: resume-truth cluster.

### tri-021 (P1) — Handover template does not match handover parser fields — STILL-REAL

Parser extracts exactly four bold labels: `lib/resume/resume-ladder.ts:471-474` (`Recent action`, `Next safe action`/`Next action`, `Blockers`, `Key files`). The official template has none of them as labeled values: `templates/manifest/handover.md.tmpl:56` uses heading `### 2.2 Blockers Encountered` and `:72` uses `### 3.1 Recommended Starting Point`. A template-authored handover can win freshness selection while yielding no structured nextSafeAction/blockers/keyFiles.

- Risk: ladder reports a "handover" recovery source whose structured fields are empty, degrading one-next-step resume quality.
- Fix class: doc-only (add the parser-recognized `**Recent action:**`-style labels to the template) or code-small (teach `extractLabeledValue` the template headings). Interlock: resume-truth cluster.

### tri-046 (P1) — Deep-loop save phases reference an unwritten temp JSON file — STILL-REAL

All three deep-loop assets still invoke generate-context with a session-scoped temp file no prior step composes: `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml:980`, `deep_start-review-loop_auto.yaml:1315`, `deep_start-context-loop_auto.yaml:695` (`node .../generate-context.js /tmp/save-context-data-<session-id>.json {spec_folder}`). The research-loop `phase_save` contains only `step_generate_context` → `step_index_memory` → `step_verify_save`; no payload-composition step exists (grep for `save-context-data` finds only the command lines). The loader hard-fails on a missing file: `scripts/loaders/data-loader.ts:126` throws `EXPLICIT_DATA_FILE_LOAD_FAILED: Data file not found`.

- Risk: the advertised automatic memory save only works if the executing agent improvises the JSON out-of-band; otherwise the save phase errors and continuity is silently lost.
- Fix class: doc-only (add an explicit compose-payload step to the three YAMLs, or switch the command to `--stdin`/`--json`). Interlock: save-contract cluster.

### tri-047 (P1) — Deep-review protocol documents a rejected CLI mode — STILL-REAL

`.opencode/skills/deep-review/references/protocol/loop_protocol.md:541` still instructs `generate-context.js {spec_folder}` and `:546` says "Verify: Confirm `memory/*.md` file was created with proper anchors." Current parser rejects exactly that invocation: `scripts/memory/generate-context.ts:711` — "Direct spec folder mode is no longer supported. Use structured JSON via --json, --stdin, or a JSON temp file." `memory/*.md` paths are retired (excluded at `lib/config/spec-doc-paths.ts:30`).

- Risk: operators following the protocol get a hard error, then "verify" against retired paths that must not exist.
- Fix class: doc-only. Interlock: save-contract cluster (fix alongside tri-046 so both surfaces state the same contract).

### tri-069 (P2) — Code-graph plugin bridge README still claims the bridge is broken — STILL-REAL

`system-code-graph/mcp_server/plugin_bridges/README.md:28-36` still presents the pre-repair "broken imports" table and concludes at `:36` "Until then, the bridge is non-functional." Current bridge contradicts this: `plugin_bridges/mk-code-graph-bridge.mjs:14` resolves the CLI shim `../../../../bin/code-index.cjs`, `:134-154` implements `warmProbe()` with socket-absent/too-long handling, and `:310-314` warm-probes before routing — the session-resume-import architecture the README describes no longer exists in the code path.

- Risk: maintainers trust the README, bypass a working bridge, and hand-roll the "route through system-spec-kit handlers directly" workaround it recommends.
- Fix class: doc-only (rewrite around the warm-only CLI/IPC route).

### tri-071 (P3) — Docs claim fixed handover-first ordering; code picks the fresher signal — STILL-REAL

`system-spec-kit/README.md:97` still says "rebuilds continuation context in a fixed order: `handover.md` first, then `_memory.continuity`…" (repeated at `:454`, `:612`, `:635`, `:962`, `:1011`). Code compares timestamps and takes the fresher: `lib/resume/resume-ladder.ts:871` — `const primary = continuitySignal.updatedAtMs > handoverSignal.updatedAtMs ? continuitySignal : handoverSignal;` with the hint "selected … as the fresher resume source."

- Risk: operators debugging resume behavior expect handover to win and misread a correct freshest-wins outcome as a bug.
- Fix class: doc-only (six README touchpoints). Interlock: resume-truth cluster.

### tri-120 (P2) — session_resume uses a separate auth model from resolveTrustedSession — STILL-REAL

`schemas/tool-input-schemas.ts:602-606` still exposes public `session_resume.sessionId` ("targeted recovery (advanced)"). `handlers/session-resume.ts:528-545` does pure transport binding — mismatch with `callerCtx.sessionId` is rejected/warned (`:537-538`), but a null callerContext proceeds, as the test asserts (`tests/session-resume-auth.vitest.ts:203` "proceeds when callerContext.sessionId is null"). `resolveTrustedSession` exists only in `lib/session/session-manager.ts:413` and is not imported by session-resume. No references doc describes session_resume as transport-bound (grep over `references/` finds no such trust-contract statement).

- Risk: an undocumented second session-accepting surface outside the trust gate; acceptable for stdio but invisible to anyone auditing the trust contract.
- Fix class: doc-only (state the transport-bound model in the trust contract / tool description); code-careful if routing through resolveTrustedSession is preferred.

### tri-128 (P2) — Validation contract overstates where _memory.continuity lives — STILL-REAL

`references/validation/template_compliance_contract.md:263` still says "Put a `_memory.continuity` frontmatter block in **every** doc (plan/tasks/checklist included) or `FRONTMATTER_VALID` warns." Runtime disagrees on both ends: save routes the metadata host to `implementation-summary.md` with `spec.md` fallback only (`handlers/memory-save.ts:1304-1311`, `resolveMetadataHostDocPath`), and resume reads continuity exclusively from `implementation-summary.md` (`lib/resume/resume-ladder.ts:830-846`; when the file is missing the hint is "continuity tier unavailable").

- Risk: writers add continuity blocks to plan/tasks/checklist that nothing maintains or reads — guaranteed-stale frontmatter that contradicts the freshness story.
- Fix class: doc-only (narrow the contract to the implemented host behavior). Interlock: resume-truth cluster.

### tri-130 (P2) — Metadata-edge promoter has unit coverage but no stress coverage — STILL-REAL

`tests/frontmatter-promoter.vitest.ts` exists with 7 `it()` cases (small in-memory fixtures). The stress tree (`mcp_server/stress_test/{durability,matrix,memory,search-quality,session,substrate}/`) contains no promoter suite: grep for `promoter|metadata-edge|frontmatter-promoter` across `stress_test/` returns nothing (nearest neighbor `enrichment-marker-backfill-stress.vitest.ts` covers enrichment markers, not edge promotion).

- Risk: duplicate generated edges, manual-edge overwrites, or unbounded tombstone growth under large packet trees would ship undetected.
- Fix class: code-small (test-only durability suite; no production change).

### tri-132 (P2) — Hybrid search scope-then-limit lacks scale stress coverage — STILL-REAL

`stress_test/search-quality/` has no scoped-search suite — grep for `specFolder|scoped|scope-then` across that directory returns nothing. The shipped fix's own evidence confirms the gap: `027.../021-hybrid-search-scope-then-limit/implementation-summary.md:82` — "delivered as a narrow TypeScript change plus focused in-memory regression tests" (in `tests/hybrid-search.vitest.ts`, per `:70`), with mocked metadata (`:95`). No suite exercises thousands of BM25 candidates, many tier/folder filters, or chunked metadata resolution near SQLite parameter limits.

- Risk: a recall-affecting code path is protected only by three small fixtures; parameter-limit chunking regressions at scale would be invisible.
- Fix class: code-small (test-only stress suite under `stress_test/search-quality/`).

### tri-139 (P2) — memory_health advertised budget disagrees with runtime budget — STILL-REAL

`tool-schemas.ts:405-406` still advertises memory_health "Token Budget: 800" (the whole L3 block is commented "Token Budget: 800" at `:391`). Enforcement metadata says 1000: `lib/architecture/layer-definitions.ts:63` (`tokenBudget: 1000`) with memory_health in the L3 tool list at `:66`; the runtime stamps and enforces this via `getTokenBudget(name)` at `context-server.ts:1269-1270`.

- Risk: callers plan around 800, the envelope reports 1000, and overflow hints reference neither expectation — wasted diagnosis time.
- Fix class: code-small (generate schema description budgets from layer-definitions). Interlock: envelope/budget cluster.

### tri-140 (P2) — First-call session priming can dominate memory_health envelopes — STILL-REAL

`context-server.ts:821-857` (`injectSessionPrimeHints`) still stores the FULL `sessionPrimeContext` — enriched constitutional memories plus `primePackage` — into `meta.sessionPriming` (`:856`). It is injected post-dispatch at `:1261`, *before* the budget check at `:1269-1273`. For tools without a truncatable `data.results` array (memory_health's shape), the over-budget path at `:1312-1317` only appends a warning hint — nothing trims the priming payload. The hook side still builds priming under a separate 4000-token budget (`hooks/memory-surface.ts:98-99`, `buildPrimePackage` at `:486`).

- Risk: a quick first-call health probe returns several thousand tokens of priming metadata, dwarfing the 1000-token health payload and breaking the budget contract by design.
- Fix class: code-careful (attach counts + pointer for low-budget tools, or include priming in the envelope budget enforcement). Interlock: envelope/budget cluster — fix after tri-139's source-of-truth decision.

### tri-163 (P3) — No surfaced key_files → COVERED_BY join — STILL-REAL

The two vocabularies remain disjoint in runtime code. `key_files` consumers (spec-kit domain): `mcp_server/scripts/repair-graph-metadata.mjs` and `handlers/memory-save.ts` (derive/write side); the other hits are skill-advisor's unrelated skill-graph. `COVERED_BY` consumers: only `deep-loop-runtime/lib/coverage-graph/coverage-graph-{query,signals,db}.ts` and its unit test. No file references both; no crosswalk maps `graph-metadata.json derived.key_files` into deep-context FILE/SLICE coverage nodes or surfaces a joined view in context reports or session bootstrap.

- Risk: planning can't answer "is this packet's key file already covered by a context sweep" — a coverage-reuse gap, not a correctness defect.
- Fix class: code-careful (new read-only crosswalk feature; legitimately deferrable as P3).

### tri-183 (P2) — Setup guide still tells users to call skill_graph_scan without trusted context — STILL-REAL

`.opencode/install_guides/SET-UP - Skill Advisor.md:102-103` still says "call `skill_graph_scan({})`" (repeated at `:149` "you MUST call `skill_graph_scan({})` yourself" and in troubleshooting rows `:206`, `:210-211`); grep finds zero mentions of `--trusted` or `MK_SKILL_ADVISOR_CLI_TRUSTED` anywhere in the guide. Enforcement is fail-closed: `system-skill-advisor/mcp_server/skill-advisor-cli.ts:659-664` — `skill_graph_scan` is in the `requiresTrusted` set and throws `skill_graph_scan requires --trusted or MK_SKILL_ADVISOR_CLI_TRUSTED=1` (exit 64, refused client-side before IPC).

- Risk: operators on the daemon-backed CLI follow the guide verbatim and hit exit 64 with no guide-side explanation.
- Fix class: doc-only (add the `--trusted` form and note the MCP-vs-CLI trust difference).

### tri-189 (P2) — Review reports are not first-class retrieval documents — STILL-REAL

`lib/config/spec-doc-paths.ts:7-18`: `SPEC_DOCUMENT_FILENAMES` omits `review-report.md`; `:29-36`: `SPEC_DOCUMENT_ONLY_EXCLUDED_SEGMENTS` includes `'/review/'` (`:33`), so even an allowlisted name under `review/` would be excluded. Meanwhile deep-review still treats it as the canonical handoff: `skills/deep-review/README.md:61` ("a review report at `{spec_folder}/review/review-report.md` with a verdict, the active findings registry, remediation workstreams") and `:89` ("The workflow owns the canonical `review-report.md`").

- Risk: retrieval sees only whatever bounded continuity was routed into canonical docs; the full findings registry/planning packet is invisible to memory search.
- Fix class: code-careful (new canonical doc type + exclusion carve-out) or doc-only (mandate a bounded findings summary copied into an indexable canonical doc). Interlock: index-policy cluster.

### tri-191 (P2) — Research-iteration metadata backfill creates files discovery ignores — STILL-REAL

`scripts/memory/backfill-research-metadata.ts:5-6` states its purpose ("Missing-only backfill for research/*/iterations folders so description.json + graph-metadata.json exist for iteration packs") and writes both filenames (`:24-25`, builders at `:76-91`). Discovery policy still ignores those locations: `lib/config/spec-doc-paths.ts:25` (`'/research/iterations/'` in WORKING_ARTIFACT_SEGMENTS), `:34` and `:42` (excluded for spec-document and graph-metadata classification), `:48-52` (`SPEC_DISCOVERY_ONLY_EXCLUDE_DIRS` includes `'iterations'`), and `isGraphMetadataPath` (`:152-165`) accepts only `graph-metadata.json` whose parent matches the spec-leaf pattern (`:55`) — `iterations` does not.

- Risk: the backfill produces dead metadata — wasted writes that imply retrieval coverage that does not exist.
- Fix class: code-small (retire the backfill, or add a deliberate iteration-pack indexing consumer). Interlock: index-policy cluster.
