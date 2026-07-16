# L9 Docs Batch — Adversarial Re-Verification Verdict

Fresh Fable 5 verifier, 2026-06-12. Scope: every doc-only DONE finding from the two fenced seats (`/tmp/seat-l9ab-docs.log`, `/tmp/seat-l9cd-docs.log`), checked against the four L9 reports (`verify/l9-still-real-partA..D.md`) and current code. 25 DONE items verified; 2 BLOCKED carry-overs confirmed untouched; 4 do-not-touch items confirmed untouched.

## Verdicts

- tri-017: CLOSED
- tri-053: CLOSED
- tri-056: CLOSED
- tri-059: CLOSED (landed in commit 64c4e7b25b, not uncommitted)
- tri-063: INCOMPLETE (count not recounted after the batch's own edit)
- tri-064: INCOMPLETE (scoped-partial by design; ~39 vars still undocumented)
- tri-068: CLOSED (landed in commit 64c4e7b25b, not uncommitted)
- tri-079: CLOSED
- tri-081: CLOSED
- tri-084: INCOMPLETE (new claim contradicted by code and by sibling tri-178 fix)
- tri-087: CLOSED
- tri-100: CLOSED
- tri-102: CLOSED
- tri-106: CLOSED (landed in commit 64c4e7b25b, not uncommitted)
- tri-118: CLOSED
- tri-126: CLOSED (live-verified)
- tri-127: CLOSED
- tri-134: CLOSED
- tri-155: CLOSED
- tri-160: CLOSED
- tri-162: CLOSED
- tri-176: CLOSED
- tri-177: CLOSED
- tri-178: CLOSED
- tri-190: CLOSED

**Tally: 22 CLOSED / 3 INCOMPLETE / 0 REGRESSION.**

## Per-Item Evidence

### tri-017 — CLOSED
`references/cli/memory_handback.md:46` now scopes `E_SESSION_SCOPE` to exactly `memory_context`, `memory_search`, `memory_match_triggers` and warns against assuming the guard elsewhere. Code: `resolveTrustedSession` call sites are exactly `handlers/memory-context.ts:1146`, `handlers/memory-search.ts:831`, `handlers/memory-triggers.ts:348` (definition `lib/session/session-manager.ts:413`). No new overclaim.

### tri-053 — CLOSED
`lib/telemetry/README.md` (frontmatter, :58 module row, :84 export row, :93 flag row) now describes consumption logging as active and flag-gated. Code: `consumption-logger.ts:95-97` delegates to `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')` ("graduated, default ON"); `ENV_REFERENCE.md:365` lists default `true`. Doc and code agree.

### tri-056 — CLOSED
Lifecycle Restore bullet (`database/checkpoints/README.md:92`) now says live files are renamed to sibling `.bak` files during the swap and explicitly attributes `restore-backups/` to the raw restore migration script. Code: `lib/storage/checkpoints.ts:2642-2643` (`${liveMainPath}.bak` / `${liveShardPath}.bak`); `scripts/migrations/restore-checkpoint.ts:103` defaults its backup dir to `checkpoints/restore-backups`. No new false claims.

### tri-059 — CLOSED (committed, not uncommitted)
`mcp_server/README.md:174` now says `SCHEMA_VERSION` (currently `37`) with generic migration coverage. Code: `lib/search/vector-index-schema.ts:626` `SCHEMA_VERSION = 37`. Provenance note: this fix is not in the working tree diff — it landed inside commit `64c4e7b25b` ("fix(029/L6+L7)…", 15:52 today), consistent with the shared-git-index sweep pattern. Content matches the prescription exactly.

### tri-063 — INCOMPLETE
`ENV_REFERENCE.md:127` count corrected 179 → 237. Failure mode hit: the 237 figure is the Part-A verifier's PRE-edit recount, and the same batch then added one new unique table row (`SPECKIT_BOOT_FTS_AUTOHEAL`, tri-064) without recounting — under the source method the table now totals 238. Independent recounts bracket the truth without ever yielding 237 on the current doc: strict first-cell line-start parse = 234 (233 at HEAD, +1 from the new row), first-cell tokens incl. multi-var cells = 236, first-cell ∪ flags-summary third-cell rows = 243. Residue: regenerate the count (or recount post-edit to 238 / state the method). Dramatically better than 179, but the corrected number is provably not a post-edit recount.

### tri-064 — INCOMPLETE (scoped-partial by design)
New `SPECKIT_BOOT_FTS_AUTOHEAL` row (`ENV_REFERENCE.md:184`) is accurate against `context-server.ts:381-410`: default-on (`!== '0'`), rebuild + re-verify on unclean-shutdown FTS failure, `0` = detect-only that logs without rebuilding. Minor nit: the row types it `boolean`, but only the literal `0` disables (`false` does not); the description's explicit "set `0`" instruction is correct. The finding's full scope (~40 undocumented runtime vars) remains open — the seat log itself declares "remaining env-var backfill remains a follow-up". Carry-over recorded below.

### tri-068 — CLOSED (committed, not uncommitted)
`mcp_server/README.md:39` and `:239` now state MCP client configs point at `.opencode/bin/mk-spec-memory-launcher.cjs`, with `dist/context-server.js` as the launcher-spawned backend. Code/config: `opencode.json` `mk-spec-memory.command` = `node .opencode/bin/mk-spec-memory-launcher.cjs`; consistent with `INSTALL_GUIDE.md:327`. Same provenance as tri-059 (in commit `64c4e7b25b`).

### tri-079 — CLOSED
`system-code-graph/SKILL.md` Fallback Contract bullet now reads: warm daemon → use the daemon-backed CLI recovery path; neither MCP nor warm CLI → report and stop. This reconciles with the dual-stack paragraph (~:286) which still prescribes the CLI when MCP transport is missing/failed while the daemon is warm. Contradiction inside the file resolved; no behavior overclaimed.

### tri-081 — CLOSED
`system-code-graph/README.md:96` now limits the skip-list to "parser crash cohorts classified as B1/B2" and adds "syntax-error partial parses surface parse diagnostics without adding a skip-list row"; the troubleshooting row (:154) was also fixed. Code: `tree-sitter-parser.ts:837-847` — `parserHealth='quarantined'` for B2, `addToSkipList` only for B1/B2 under `SKIP_LIST_ENABLED` (default on, `:52`).

### tri-084 — INCOMPLETE
The core fix is correct: `feature_catalog/lifecycle-routing/schema-migration.md:21` no longer claims the migration runs at daemon bring-up, and `lib/lifecycle/schema-migration.ts` is indeed only test-imported. But the replacement sentence introduces a NEW claim the code does not satisfy: "it does not run this migration module **or rebuild the SQLite graph automatically**. Database writes happen through trusted maintenance paths such as `advisor_rebuild` and `skill_graph_scan`". The daemon watcher's default reindex is `indexSkillMetadata(skillsRoot)` (`lib/daemon/watcher.ts:425`), which performs INSERT/UPDATE writes into the skill graph SQLite (`lib/skill-graph/skill-graph-db.ts:823+`, e.g. `skill_nodes` upsert at :893) and then publishes a live generation (`watcher-orchestrator.ts:101-124`). This also directly contradicts the sibling tri-178 fix shipped in the SAME batch ("the daemon schedules an incremental reindex, publishes a fresh generation after the rebuild"). Remedy: one clause — keep the migration-module correction, drop/replace the "or rebuild the SQLite graph automatically" claim and widen the writer list to include the watcher reindex (and corrupt-DB lazy recovery).

### tri-087 — CLOSED
All three docs now say 50: `manual_testing_playbook/python-compat/regression-suite.md:55` ("Fewer than 50 cases"), `system-skill-advisor/references/hooks/skill_advisor_hook.md:227` and `system-spec-kit/references/hooks/skill_advisor_hook.md:242` ("50/50"). Fixture recounted: `skill_advisor_regression_cases.jsonl` = exactly 50 lines. (The runner still doesn't gate on total_cases — that is code-queue tri-179, correctly untouched.)

### tri-100 — CLOSED
`lib/utils/README.md:106-107` now splits the row: `scratch/`, `temp/`, `research/iterations/`, `review/iterations/` = "spec-doc scope-excluded … absent from spec-doc retrieval rather than merely downweighted"; `prototype/`, `*-test*/` retain the pre-existing decay-only (0.2) row. Code: `lib/config/spec-doc-paths.ts:22-27` `WORKING_ARTIFACT_SEGMENTS` lists exactly those four segments; `SPEC_DISCOVERY_ONLY_EXCLUDE_DIRS` includes `iterations`; `memory-parser.ts` rejects working-artifact paths from spec-doc classification. The replacement SSOT paragraph ("binary scope exclusion wins over scoring decay") states the code's actual precedence. Retained prototype/test decay claim is pre-existing content outside this finding's scope.

### tri-102 — CLOSED
021 `implementation-summary.md:118` Known Limitation §3 now states the raw `LIKE` prefix exists in FTS5 AND vector AND hybrid/keyword lanes without `ESCAPE`. Code re-verified: `vector-index-queries.ts:90,570,862` and `hybrid-search.ts:698,2149` still push raw `${specFolder}/%`; zero `ESCAPE` hits in both files. The doc now matches the (still-unfixed, code-queue tri-006) reality without overclaiming a fix.

### tri-106 — CLOSED (committed, not uncommitted)
`database/vectors/README.md:111` now: `vec_<dim>` = "Plain table … dim-tagged BLOB payload … the sqlite-vec virtual table surface is `vec_memories`"; `:91` naming-table row also corrected to "plain table name". Code: `vector-index-store.ts:807-814` `CREATE TABLE IF NOT EXISTS … (id INTEGER PRIMARY KEY, vec BLOB NOT NULL)`, with `vec_memories` created behind `sqlite_vec_available_flag` just below. Same provenance as tri-059/068 (commit `64c4e7b25b`).

### tri-118 — CLOSED
`handlers/README.md:115` now lists `graphChannelInvocationRate`, per-channel invocation rates, `totalRecorded`, `windowSize` and explicitly says no per-channel count fields. Code: `memory-crud-health.ts:1250-1255` returns exactly those four keys in `routing`.

### tri-126 — CLOSED (live-verified)
Both INSTALL_GUIDEs gained CLI front-door verification (spec-memory: `list-tools` + `memory_health --warm-only`; code-graph: `list-tools` + `code_graph_status --warm-only`, plus a baseline-table row). Spot-run results against the live tree:
- `spec-memory.cjs list-tools --format text` → 37 tool names; `code-index.cjs list-tools --format text` → exactly the 8 documented code-graph tool ids.
- `memory_health --warm-only --format json --timeout-ms 3000` → live healthy JSON payload from the warm daemon; `code_graph_status --warm-only …` (underscore form as documented — accepted) → live JSON status payload. Documented output shapes match reality, including the exit-75 cold-spawn-refusal description (not triggered; daemons warm).
- Caveat (environment, not doc error): on today's tree with uncommitted source changes the shim dist-freshness guard fires first ("dist entrypoint is stale", the exit-69 path), so the runs above required the documented dev escape (`SPECKIT_*_CLI_DEV_ALLOW_STALE=1`). The guides' context is immediately post-`npm run build`, where dist is fresh, so the instructions are correct in their setting; neither guide claims the commands bypass the freshness guard.

### tri-127 — CLOSED
`plugin_bridges/README.md` tree (:28-31) and key-file table (:42-44) now list exactly the real contents: `mk-spec-memory-bridge.mjs`, `spec-kit-opencode-message-schema.mjs`, `README.md`; the removed `spec-kit-skill-advisor-bridge.mjs` is gone. Verified `ls plugin_bridges/` matches 1:1, and the bridge does shell the CLI front door (`mk-spec-memory-bridge.mjs:14` resolves `.opencode/bin/spec-memory.cjs`).

### tri-134 — CLOSED
004 `spec.md:134` REQ-011 acceptance now reads "semantic trigger shadow stats report `no_query_embedding`". Code: `lib/triggers/semantic-trigger-matcher.ts:54` types the status union including `no_query_embedding`; `:467` returns it. The phantom `semantic_trigger_skipped_uncached` event name is gone (the report's `lib/cognitive/` path was stale; the module lives in `lib/triggers/` with identical anchors).

### tri-155 — CLOSED
Both spec lines reworded as prescribed: 016 `spec.md:72` ("registry-backed, with an explicit parity guard for code-index that requires manual acceptance when the shared tool schema changes") and `:93` Out-of-Scope; child `002-cli-help-aliases-errors/spec.md:84` likewise. Code: `code-index-cli-manifest.ts:10-19` hardcodes the 8-name `EXPECTED_TOOL_NAMES` and `assertCodeIndexCliManifest()` (:23-37) throws on any count/name mismatch — the new wording matches the guard's actual manual-acceptance semantics. No "auto-propagate" claim remains in either spec.

### tri-160 — CLOSED
`system-code-graph/README.md` (new paragraph after :95) and `SKILL.md` glossary (new "Doc lane coverage" entry) now state the doc lane is file-row inventory only: content hashes + clean parse health, zero symbol nodes, zero edges. Code: `structural-indexer.ts:1235-1247` returns `nodes: [], edges: [], parseHealth: 'clean'` for `language === 'doc'`; `indexer-types.ts:169-174` includes `**/*.md`…`**/*.toml` in default globs. Doc claims match code exactly.

### tri-162 — CLOSED
028 `research/deep-research-strategy.md:51` now reads "code-graph key_files vs deep-loop coverage-graph `COVERED_BY` links". Matches reality: `causal-edges.ts:21-28` still allows only the six causal relation types, and COVERED_BY is deep-loop coverage-graph vocabulary.

### tri-176 — CLOSED
`manual_testing_playbook/scorer-fusion/projection.md:57` now points unbounded-projection triage at "traversal bounds in `mcp_server/lib/scorer/lanes/graph-causal.ts`" and notes `projection.ts` only clamps stored edge weights. Code: `lanes/graph-causal.ts` exists with `maxDepth` option (:9), default 2 (:27), depth gate (:61).

### tri-177 — CLOSED
`system-skill-advisor/README.md:98` and FAQ (:190), plus `references/scoring/lane_weight_tuning.md:86`, now all state `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` is stripped by the launcher because it is not in `CHILD_ENV_ALLOWLIST`, making source-edit the normal daemon tuning path. Code: zero matches for the var in `mk-skill-advisor-launcher.cjs` (allowlist at :85, strict filter at :233); `lib/scorer/lane-registry.ts:68` does read it in a direct child. The two-path conflict is resolved with the pass-through requirement named.

### tri-178 — CLOSED
`README.md:108` now matches code: the daemon "schedules an incremental reindex, publishes a fresh generation after the rebuild, and invalidates the recommendation cache", with `advisor_rebuild`/`skill_graph_scan` kept as the explicit trusted paths. `ARCHITECTURE.md:119` watcher path corrected to `mcp_server/lib/daemon/watcher.ts` (file exists). Code: `watcher-orchestrator.ts:101-124` reindex + `publishSkillGraphGeneration(state: 'live')`; default reindex = `indexSkillMetadata` (`watcher.ts:425`). README now sits on the code's side of the contradiction.

### tri-190 — CLOSED
Both YAMLs now run `command: "git add {state_paths.packet_dir}"` (research :967, review :1302). Grepped both `state_paths` definitions: `packet_dir: "{artifact_dir}"` is a defined key in BOTH (research :98, review :89); neither block defines an `artifact_dir` key. Zero `{state_paths.artifact_dir}` references remain in either file. One-token fix applied exactly as prescribed.

## Carry-Overs (code queue)

- **tri-125 — BLOCKED, untouched (confirmed).** `scripts/tests/test-validation-extended.sh:5-6` still says "all 13 validation rules, 52 test fixtures"; file clean in git. Actual per seat re-verify: 38 registry rules, 66 numbered fixtures (last `067-checklist-uppercase-x`). Needs the `.sh` header edit (or generated counts) — non-md edit forbidden for the doc seats.
- **tri-158 — BLOCKED, untouched (confirmed).** `026-…/002-code-graph-resilience-research/assets/code-graph-gold-queries.json` clean in git; 11 stale line anchors remain. Needs the `.json` fixture refresh (+ optional anchor-drift static test) — JSON edit forbidden for the doc seats.
- **tri-064 residue.** ~39 runtime `SPECKIT_*` vars still undocumented in ENV_REFERENCE (seat-declared follow-up). Optional nit: BOOT_FTS_AUTOHEAL row says `boolean` but only literal `0` disables.
- **tri-063 residue.** Count line needs a post-edit recount (238 under the Part-A method after the tri-064 row) or a generated/approximate phrasing.
- **tri-084 residue.** One-clause doc correction: remove "or rebuild the SQLite graph automatically" and include the watcher reindex in the writer list, aligning schema-migration.md with the tri-178-fixed README.

## Do-Not-Touch Confirmations

- **tri-114 (OVERTAKEN):** `database/README.md` + `database/backups/README.md` clean in working tree — the previously-shipped root-level `.corrupt-*`/`.pre-repair-*` doc state preserved; seats did not touch.
- **tri-116 (OVERTAKEN):** `tests/index-dedup-projection-evicted.vitest.ts` clean; untouched.
- **tri-159 (REFUTED):** `code-graph-indexer.vitest.ts` + `code-graph-scan.vitest.ts` clean; untouched.
- **tri-192 (superseded cross-lane):** `commands/memory/search.md` clean in working tree (L8 lane's committed state untouched by these seats); behavioral remediation remains with the L8/R8 follow-ons.

## Provenance Note

Three fixes (tri-059, tri-068, tri-106) are not in the uncommitted diff: they sit inside commit `64c4e7b25b` (fix(029/L6+L7), 15:52 today) — consistent with this repo's known shared-git-index commit sweep. Content verified identical to the prescriptions; no action needed beyond awareness that "uncommitted batch" undercounts by these three files.
