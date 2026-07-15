---
title: "Feature Specification: Advisor Doc-Trigger Harvest"
description: "Skill advisor harvests per-doc frontmatter trigger phrases from skill references/assets into skill-graph.sqlite as flag-gated, dampened routing signal with doc-level matchedDocs pointers in advisor_recommend."
trigger_phrases:
  - "advisor doc trigger harvest"
  - "skill_docs table"
  - "matched docs in advisor recommend"
  - "SPECKIT_ADVISOR_DOC_TRIGGERS"
  - "doc frontmatter routing signal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-advisor-doc-trigger-harvest"
    last_updated_at: "2026-06-11T12:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "T018+T026 done; 009 campaign complete 355/355; T025 open"
    next_safe_action: "Live smoke T025 after all advisor sessions cycle"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/doc-frontmatter.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/skill-doc-harvest.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-141-advisor-doc-trigger-harvest"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Consumer is the skill advisor only; Spec Kit Memory never indexes skill docs (operator directive)."
      - "Doc signal rides the existing derived_generated lane; no sixth fusion lane in v1."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Advisor Doc-Trigger Harvest

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-11 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The frontmatter-benefit investigation (`027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation`) proved with code evidence that the detailed frontmatter block (`trigger_phrases`, `importance_tier`, `contextType`) carried by 103 of 369 skill reference/asset docs has **zero runtime consumers**: Spec Kit Memory's index gate (`memory-parser.ts` `isIndexablePath`) admits only spec documents and constitutional memories; the skill advisor compiles only each skill's root `graph-metadata.json` (`skill_graph_compiler.py`, `indexSkillMetadata`, with a 24-phrase schema cap in `skill-derived-v2.ts:43`); and the code graph excludes `.opencode/skills/**` by default (`index-scope.ts`).

The operator resolved the resulting contract decision as **Option B with a corrected consumer**: standardize the full block across all 21 skills (009 phases 002-022) AND make the **skill advisor** its sole runtime consumer. Two hard constraints came with that decision: Spec Kit Memory must NEVER index skill docs (permanent architectural boundary), and the advisor's existing routing behavior must be byte-identical while the feature flag is off. Without this packet, the 009 authoring campaign would standardize ~355 docs of dead metadata.

### Purpose
`advisor_recommend` answers two questions instead of one: *which skill* (existing curated signal, now reinforced by dampened doc-level phrase matches) and *which document inside it* (`matchedDocs` pointers, e.g. `deep-loop-runtime → references/script_interface_contract.md`), with the entire path — ingestion, projection, scoring, response — gated behind the default-off `SPECKIT_ADVISOR_DOC_TRIGGERS` flag.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Storage**: additive `skill_docs` table in skill-graph.sqlite (`UNIQUE(skill_id, doc_path)`, FK cascade from `skill_nodes`, `CREATE TABLE IF NOT EXISTS` in both `SCHEMA_SQL` and `ensureSchemaMigrations` so pre-existing DBs migrate on open without a version bump)
- **Harvest**: `harvestSkillDocs()` runs inside `indexSkillMetadata()` for EVERY skill on every scan when the flag is on — doc edits never touch `graph-metadata.json`, so node-level content hashes cannot gate doc work; per-doc content hashes keep unchanged docs cheap; stale rows (file deleted or `trigger_phrases` removed) are swept per skill
- **Parsing/discovery**: new leaf module `doc-frontmatter.ts` — list-aware YAML-ish parser (block lists AND inline `[a, b]` lists; the pre-existing `parseSkillFrontmatter` handles single-line values only), references/assets recursive walker with README exclusion, depth cap 6, 200 docs/skill, 12 phrases/doc, 300-char field clamp
- **Scoring**: doc matches ride the existing `derived_generated` fusion lane (weight 0.12) — top-3 strongest doc matches per skill, tier-weighted (constitutional/critical 1.0, important 0.85, normal 0.7, temporary 0.4, deprecated 0.2), summed contribution capped at 0.45, evidence emitted as `doc:<skill-relative-path>`
- **Response**: optional `matchedDocs` array (max 3) on `AdvisorRecommendationSchema` (`.strict()` schema extended), extracted from `doc:` evidence with a path allowlist (`^(references|assets)/[A-Za-z0-9_./-]+\.md$`, traversal rejected); new `doc_reference_signal` evidence-type mapping
- **Freshness**: daemon watcher (`watcher.ts discoverWatchTargets`) adds each harvestable doc as a `doc-frontmatter` watch target when the flag is on, so doc edits enqueue a per-skill reindex
- **Gate-2 parity**: `skill_advisor.py` harvests the same doc phrases into its lexical signal map under the same env flag, keeping CLI-fallback routing consistent with the daemon
- **Tests**: `skill-doc-harvest.vitest.ts` (11 cases) — flag-off invariance is the hard contract

### Out of Scope
- **Spec Kit Memory indexing of skill docs** — permanently rejected by operator directive; `isMemoryFile` / `isIndexablePath` untouched, and `memory_save` keeps rejecting skill-doc paths in both flag states
- **Frontmatter authoring across the 21 skills** — owned by 009 phases 002-022 (the campaign this feature unblocks)
- **sk-doc contract reconciliation** (frontmatter_templates.md "Knowledge files: never" rule, stale routing claims in catalog/README templates) — owned by 009/016-sk-doc
- **Fusion lane-weight retuning or a sixth lane** — doc signal deliberately rides `derived_generated` at its existing 0.12 weight so flag-on cannot disturb inter-lane calibration
- **Advisor embedding of doc content** — `refreshSkillEmbeddings` still embeds skill descriptions only; doc phrases are lexical signal in v1

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/skill-graph/doc-frontmatter.ts` | Create | Flag gate, tier-weight map, list-aware frontmatter parser, references/assets walker |
| `mcp_server/lib/skill-graph/skill-graph-db.ts` | Modify | `skill_docs` DDL (schema + migration), `harvestSkillDocs()`, `SkillDocHarvestResult` counters on `SkillGraphIndexResult` |
| `mcp_server/lib/scorer/types.ts` | Modify | `SkillDocTriggerProjection`; optional `docTriggers` on `SkillProjection` |
| `mcp_server/lib/scorer/projection.ts` | Modify | `loadDocTriggersBySkill()` — flag-gated, pre-migration-tolerant skill_docs load into the sqlite projection |
| `mcp_server/lib/scorer/lanes/derived.ts` | Modify | `scoreDocTriggers()` + capped doc contribution + `doc:` evidence ordering |
| `mcp_server/schemas/advisor-tool-schemas.ts` | Modify | `matchedDocs: z.array(z.string().min(1)).max(3).optional()` on the strict recommendation schema |
| `mcp_server/handlers/advisor-recommend.ts` | Modify | `matchedDocsFromContributions()` (exported, structurally typed), `SAFE_DOC_PATH` allowlist, `doc → doc_reference_signal` |
| `mcp_server/lib/daemon/watcher.ts` | Modify | `doc-frontmatter` watch-target reason + flag-gated target discovery |
| `mcp_server/scripts/skill_advisor.py` | Modify | `_doc_trigger_harvest_enabled()`, `_parse_doc_trigger_phrases()`, `_load_doc_trigger_phrases()` wired into `_load_source_graph_signal_map()`; sqlite graph loader merges the source signal map (rollout fix — parity was JSON-path-only) |
| `mcp_server/tests/skill-doc-harvest.vitest.ts` | Create | Parser, walker, flag-gated ingestion lifecycle, lane capping, curated-beats-doc-only, invariance, sanitization |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Scope amendment 2026-06-11 (T020 smoke finding): `SPECKIT_ADVISOR_DOC_TRIGGERS` added to `CHILD_ENV_ALLOWLIST` so the daemon child actually receives the flag the runtime configs set |
| `mcp_server/scripts/check-skill-doc-frontmatter.{sh,mjs}` | Create | Scope amendment 2026-06-11 (master-plan Workstream C): dependency-free contract checker, `--shape`/`--coverage` modes, `--skill` filter, FAIL/PASS lines, exit 0/1/2 |
| `.github/workflows/skill-doc-frontmatter.yml` | Create | Paths-filtered CI running the guard; ships in `--shape`, flips to `--coverage` when the 009 campaign closes |

(All paths under `.opencode/skills/system-skill-advisor/` except the launcher, which lives in `.opencode/bin/`.)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Flag off (default) = zero behavior change anywhere: no `skill_docs` writes, no `docs` counters in scan results, no `docTriggers` in projections, scoring identical | GIVEN a skill tree containing docs with detailed frontmatter WHEN `indexSkillMetadata` runs without the flag THEN `skill_docs` has 0 rows and `result.docs` is undefined; GIVEN identical projections with absent vs empty `docTriggers` WHEN scored THEN lane outputs are deep-equal |
| REQ-002 | `memory_save` / memory indexing boundary unchanged in both flag states | No edits to any `system-spec-kit/mcp_server` file in this packet (verified by git status scope) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Flag on: harvest indexes every reference/asset doc carrying `trigger_phrases`, skips unchanged via content hash, reindexes edits, deletes stale rows | GIVEN the real skill tree WHEN scanned THEN scannedDocs=355, indexedDocs=84; WHEN rescanned THEN skippedDocs=84/indexedDocs=0; WHEN a doc is edited/deleted THEN indexedDocs=1/deletedDocs=1 respectively (vitest lifecycle case mirrors this) |
| REQ-004 | Doc-specific prompts surface the owning skill with the matched doc attached | GIVEN flag on and graph scanned WHEN scoring "deep loop script interface contract" THEN deep-loop-runtime is the top candidate carrying `doc:references/script_interface_contract.md` |
| REQ-005 | Doc volume cannot dominate routing: top-3 docs/skill, tier-weighted, 0.45 contribution cap; curated skill triggers outrank doc-only matches at equal phrasing | Capping and curated-beats-doc-only vitest cases pass; a 10-doc skill's doc contribution stays ≤ 0.45 |
| REQ-006 | `matchedDocs` paths are sanitized before leaving the daemon | Traversal (`..`), non-references/assets prefixes, and non-markdown entries are dropped (sanitization vitest case) |
| REQ-007 | Gate-2 CLI fallback parity: `skill_advisor.py` consumes the same doc phrases under the same flag | Python harvest helpers present and wired; `ast.parse` syntax check passes |
| REQ-008 | Rollout completes: governance surfaces updated and `SPECKIT_ADVISOR_DOC_TRIGGERS=true` in the three runtime configs, live daemon adopted via fresh session | Live `advisor_recommend` via CLI front door returns `matchedDocs` for a doc phrase; feature_catalog + playbook + changelog rows exist |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A doc-specific phrase routes to the owning skill with the doc path attached. Pilot evidence (isolated temp DB, real skill tree): "deep loop script interface contract" → deep-loop-runtime ranked #1 (score 0.2968 vs deep-review 0.2075) with `doc:references/script_interface_contract.md`; re-verify on the live daemon after flag flip (REQ-008)
- **SC-002**: Flag-off invariance holds everywhere: pilot flag-off probe shows 0 skills with docTriggers; flag-off vitest cases pass; the 2 failing suite files (`settings-driven-invocation-parity`, one daemon-lease respawn case) reproduce identically with this packet's changes stashed — pre-existing, not introduced
- **SC-003**: The 009 authoring campaign has a live consumer to verify against (each skill phase ends with an `advisor_recommend` smoke test that its docs surface)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 009 phases 002-022 supply frontmatter at scale | Doc signal covers only 84 docs until authored | Phases are unblocked, contract-fixed, and mutually independent |
| Risk | Doc phrase collisions steer prompts toward doc-heavy skills | Med | Top-3/skill + 0.45 cap + tier dampening + derived-lane weight 0.12; pilot shows doc-only confidence ~0.68 (normal tier), below the 0.8 pass threshold — assists ranking, cannot hard-route alone |
| Risk | Live daemon keeps serving old dist until restarted | Low | Advisor launcher EXITS on child SIGTERM (verified 2026-06-05) — adopt via fresh session or `/mcp` reconnect after rebuild; never SIGTERM-recycle |
| Risk | Launcher strips non-allowlisted env from the daemon child, silently defeating config flag flips | Med (hit 2026-06-11) | `CHILD_ENV_ALLOWLIST` now carries the flag; running launchers keep the old list in memory, so live adoption additionally requires every advisor-attached session to end before one fresh session respawns the daemon |
| Risk | `skill_docs` rows persist after flag-off | Low | Projection ignores them when flag off; next flag-on scan reconciles; documented in rollback |
| Risk | Template files among sk-doc assets carry example frontmatter as body content | Low | Parser reads only the leading fence block; body examples are invisible to harvest |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Harvest cost is one readdir-walk + one SHA-256 per doc per scan (355 docs today); unchanged docs short-circuit on content hash before any write. Pilot scan completed without measurable regression over the pre-change scan
- **NFR-P02**: Projection overhead is a single `SELECT` over `skill_docs` per load, executed only when the flag is on; pre-migration read-only DBs degrade to empty doc triggers via try/catch (the recommend path never runs migrations)

### Security
- **NFR-S01**: `matchedDocs` entries must pass `SAFE_DOC_PATH` (`references|assets` prefix, markdown suffix, character allowlist, no `..`) before entering responses — prompt-injection and traversal surfaces stay closed
- **NFR-S02**: Harvest reads only under `<skill>/references` and `<skill>/assets` inside the workspace already guarded by the scan handler's escape check; field values are clamped to 300 chars and 12 phrases/doc to bound stored content

### Reliability
- **NFR-R01**: `skill_docs` rows FK-cascade with `skill_nodes` deletions; the per-skill `NOT IN` sweep keeps the table mirroring the harvestable disk surface exactly
- **NFR-R02**: The flag-off path performs no writes, no new queries, and no new watch targets — fail-safe default for every fork/clone of this repo
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: docs without a frontmatter fence, or with frontmatter but no `trigger_phrases`, return null from the parser and are skipped silently (they are contract-conformant-pending, not errors)
- Maximum length: 12 phrases/doc, 200 docs/skill, walk depth 6, 300-char scalar clamp — all enforced in `doc-frontmatter.ts`
- Invalid format: malformed frontmatter lines are individually ignored; unreadable files emit a `DOC-READ-FAILED` warning into the scan result and processing continues

### Error Scenarios
- Pre-migration read-only DB on the recommend path: `loadDocTriggersBySkill` catches the missing-table error and returns an empty map — recommendations degrade to pre-feature behavior, never throw
- Concurrent access: harvest runs in its own transaction after the node transaction; WAL journal + 5000ms busy_timeout cover concurrent daemon readers
- Quote/list parsing: inline lists, block lists, and quoted scalars all normalize through trim-then-strip (regression-tested after the pilot caught `"gamma delta` surviving an unordered strip)

### State Transitions
- Flag on → off: existing `skill_docs` rows persist but are never loaded; documented limitation with reconcile-on-next-flag-on-scan semantics
- Doc loses `trigger_phrases` in an edit: next scan's per-skill sweep deletes its row (covered by the lifecycle vitest case)
- Skill deleted from disk: node deletion cascades its doc rows via FK
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 10 files (2 new), ~450 LOC across schema, ingestion, scoring, response, watcher, Python parity |
| Risk | 14/25 | Routing behavior + sqlite schema on the advisor hot path, fully flag-gated default-off with invariance tests |
| Research | 12/20 | Consumer audit + scoring-seam analysis pre-done in 009/001; fusion floor behavior discovered during pilot |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The consumer-architecture question (memory vs advisor) was settled by operator directive on 2026-06-11: advisor only, memory never. The doc-only confidence calibration (whether `important`-tier docs should clear the surfacing floor unaided) is intentionally deferred to evidence from the 009 authoring campaign.
<!-- /ANCHOR:questions -->
