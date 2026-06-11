---
title: "Implementation Summary: Advisor Doc-Trigger Harvest"
description: "The skill advisor now harvests per-doc frontmatter from references/assets as flag-gated routing signal and points at the matched doc; pilot-verified, flag flip pending."
trigger_phrases:
  - "advisor doc harvest summary"
  - "matchedDocs shipped"
  - "skill_docs harvest results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-advisor-doc-trigger-harvest"
    last_updated_at: "2026-06-11T12:30:00Z"
    last_updated_by: "claude-fable"
    recent_action: "T018+T026 done; 009 campaign complete 355/355; T025 open"
    next_safe_action: "Live smoke T025 after all advisor sessions cycle"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/doc-frontmatter.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-145-advisor-doc-trigger-harvest"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | skilled-agent-orchestration/145-advisor-doc-trigger-harvest |
| **Completed** | 2026-06-11 (build + verification; rollout pending) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The detailed frontmatter that 84 skill reference/asset docs already carry — and that all ~355 will carry after the 009 authoring campaign — now has a real runtime consumer. Ask the advisor about "deep loop script interface contract" with the flag on and it ranks deep-loop-runtime first AND tells you which file to open: `references/script_interface_contract.md`. Before this packet, those phrases were dead metadata that nothing read.

### Doc harvest into the skill graph

Every `skill_graph_scan` now sweeps each skill's `references/` and `assets/` markdown (READMEs excluded) when `SPECKIT_ADVISOR_DOC_TRIGGERS=true`, parsing `title`, `description`, `trigger_phrases`, `importance_tier`, and `contextType` into a new `skill_docs` table in skill-graph.sqlite. The harvest runs for every skill on every scan — doc edits never touch `graph-metadata.json`, so node hashes can't gate doc work — and stays cheap through per-doc content hashes. Docs that disappear or lose their phrases are swept per skill, and deleting a skill cascades its rows. The table is purely additive (`CREATE TABLE IF NOT EXISTS` in both schema and migration), so existing databases upgrade silently on open.

### Dampened doc scoring with matched-doc pointers

Doc phrases score inside the existing `derived_generated` fusion lane rather than a new lane, so flag-on cannot disturb inter-lane calibration. Three ceilings keep doc volume from buying routing weight: only a skill's top-3 strongest doc matches count, each is multiplied by its tier weight (constitutional/critical 1.0 down to deprecated 0.2), and the summed contribution caps at 0.45 — below what one curated skill-level phrase match earns. Matches emit `doc:<path>` evidence ahead of other evidence so the fusion layer's 6-entry cap can't starve the pointers, and the recommend handler lifts them into an optional `matchedDocs` field (max 3) after a strict path allowlist rejects traversal and non-references/assets shapes.

### Freshness and Gate-2 parity

The daemon watcher registers every harvestable doc as a watch target when the flag is on, so editing a reference re-indexes its skill without waiting for a manual scan. The Python CLI fallback (`skill_advisor.py`) harvests the same phrases into its signal map under the same env flag, keeping Gate-2 fallback routing consistent with the daemon.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `lib/skill-graph/doc-frontmatter.ts` | Created | Flag gate, tier weights, list-aware parser, capped references/assets walker |
| `lib/skill-graph/skill-graph-db.ts` | Modified | `skill_docs` DDL + migration, `harvestSkillDocs()`, scan-result `docs` counters |
| `lib/scorer/types.ts` | Modified | `SkillDocTriggerProjection`, optional `SkillProjection.docTriggers` |
| `lib/scorer/projection.ts` | Modified | Flag-gated, missing-table-tolerant doc-trigger load into the sqlite projection |
| `lib/scorer/lanes/derived.ts` | Modified | Top-3 tier-weighted doc scoring, 0.45 cap, docs-first evidence |
| `schemas/advisor-tool-schemas.ts` | Modified | Optional `matchedDocs` on the strict recommendation schema |
| `handlers/advisor-recommend.ts` | Modified | Sanitized `matchedDocs` extraction, `doc_reference_signal` evidence type |
| `lib/daemon/watcher.ts` | Modified | `doc-frontmatter` watch targets when flag on |
| `scripts/skill_advisor.py` | Modified | Flag-gated doc-phrase harvest for CLI parity; sqlite graph loader now merges the source signal map (rollout fix — the merge was JSON-path-only, leaving doc parity dead on the live sqlite path) |
| `tests/skill-doc-harvest.vitest.ts` | Created | 11 cases; flag-off invariance is the hard contract |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | Rollout fix (scope amendment): `SPECKIT_ADVISOR_DOC_TRIGGERS` added to `CHILD_ENV_ALLOWLIST` — without it the daemon child never saw the flag the runtime configs set |
| `mcp_server/scripts/check-skill-doc-frontmatter.{sh,mjs}` | Created | Contract checker (shape/coverage modes, `--skill` filter) — the per-phase verification gate for the 009 authoring campaign |
| `.github/workflows/skill-doc-frontmatter.yml` | Created | Paths-filtered CI guard in `--shape` mode; flips to `--coverage` when the campaign closes |

(All under `.opencode/skills/system-skill-advisor/mcp_server/` except the launcher in `.opencode/bin/`.)
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Exploration first: the sqlite schema, fusion lanes, all four ingestion paths, and the response contract were mapped from source before the first edit, which is how the design landed on extending existing seams instead of building a parallel pipeline. Implementation went storage → projection → lane → response → watcher → Python parity, with a green `tsc` build after each wave. Verification was three-layered: the new 11-case vitest file (which caught a real quote-stripping bug in the parser), a full-suite run whose only failures were proven pre-existing by stashing this packet's changes and re-running, and an isolated pilot against the real 21-skill tree using a temp `MK_SKILL_ADVISOR_DB_DIR` so the live daemon's database was never touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Advisor is the sole consumer; memory never indexes skill docs | Operator directive (2026-06-11). It also lands on the cleaner architecture: the advisor already owns skill knowledge, and memory stays a pure continuity plane. Zero spec-kit files were touched — `memory_save` keeps rejecting skill-doc paths by existing design. |
| Ride the derived lane instead of adding a sixth fusion lane | One lane registry entry would have forced a weight redistribution across all lanes; riding `derived_generated` at its existing 0.12 weight means flag-on changes only what the lane sees, not how lanes balance. |
| Top-3 docs + tier weights + 0.45 cap | sk-code has 95 harvestable docs, mcp-click-up has 3. Without per-skill normalization, phrase volume becomes routing weight. The cap keeps doc-only confidence (~0.68 at normal tier) below the 0.8 pass threshold: doc signal assists and annotates, it cannot hard-route alone. |
| Harvest every skill on every scan, gated per doc by content hash | Doc edits don't change graph-metadata.json, so the node-level skip would silently miss them. Per-doc hashing makes the every-skill pass cost one stat+hash per unchanged doc. |
| Evidence-string transport (`doc:` prefix) for matched docs | Evidence already flows lane → fusion → handler with sanitization conventions; extending `LaneMatch` structurally would have widened the contract for one consumer. The handler-side allowlist closes the injection surface. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New vitest file (parser, walker, lifecycle, capping, invariance, sanitization) | PASS — 11/11 after fixing the quote-strip-before-trim bug the tests caught |
| Full advisor suite | 471 passed, 5 skipped; 2 files failing (`settings-driven-invocation-parity` 35/41, one daemon-lease respawn case) — reproduced identically with this packet's changes stashed, pre-existing |
| Build | PASS — `npm run build` (shared + tsc -p tsconfig.build.json) green |
| Pilot: harvest on the real tree | PASS — scannedDocs 355, indexedDocs 84, deep-loop-runtime's 4 references rows present with tiers |
| Pilot: doc-phrase routing | PASS — "deep loop script interface contract" → deep-loop-runtime #1 (0.2968 vs deep-review 0.2075) carrying `doc:references/script_interface_contract.md` |
| Pilot: flag-off invariance | PASS — projection reload without the flag: 0 skills with docTriggers; sqlite source confirmed |
| Python syntax | PASS — `ast.parse` clean |
| Rollout smoke leg 1: live trusted scan | RAN 2026-06-11 — exposed bug 1: no `docs` counters, `skill_docs` 0 rows; daemon flag-off because the launcher's `CHILD_ENV_ALLOWLIST` stripped the flag. Fixed (allowlist entry); `createChildEnv` unit-verified; launcher/bridge/doc-harvest vitest 28/28 |
| Rollout smoke leg 2: Python local parity | RAN 2026-06-11 — exposed bug 2: only the legacy JSON loader merged the source signal map, so doc parity never reached the live sqlite path. Fixed (merge in `_load_skill_graph_sqlite`); flag-on run ranks deep-loop-runtime 0.95 with the doc signal, flag-off byte-identical; pytest 4/4 |
| Rollout smoke leg 3: memory boundary | PASS — `memory_match_triggers("coverage graph script exit codes")` returns spec-doc memories only, zero skill docs |
| Live daemon smoke with flag on | BLOCKED (T025) — running launchers hold the pre-fix allowlist in memory; requires all advisor-attached sessions to end, then one fresh session: trusted scan (expect ~355/84) + `advisor_recommend` carrying `matchedDocs` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live daemon adoption is still pending.** The flag is `true` in all three runtime configs and the launcher now forwards it, but every running launcher predates the allowlist fix and keeps the old list in memory — a daemon they respawn still strips the flag. Adoption requires all advisor-attached sessions to end, then one fresh session (T025). Never SIGTERM-recycle the advisor daemon (its launcher exits on child SIGTERM).
2. **Doc-only matches don't clear the surfacing floor at normal tier.** A pure doc-phrase prompt yields ~0.68 confidence — visible in candidate lists and as matchedDocs annotation, but below the 0.8 pass threshold by design. Whether `important`-tier docs should clear it unaided is deferred until the 009 campaign supplies real tier distributions.
3. **`skill_docs` rows persist after flag-off.** The projection ignores them, and the next flag-on scan reconciles; full removal is `DROP TABLE skill_docs` or DB delete + rescan.
4. **Doc signal covers 84 of ~355 docs today.** The remaining docs lack `trigger_phrases` until 009 phases 002-022 author the contract skill by skill.
5. **Filesystem-fallback projections carry no doc triggers.** Only the sqlite projection loads `skill_docs`; the degraded filesystem path (first run / corrupt DB) behaves pre-feature.
<!-- /ANCHOR:limitations -->
