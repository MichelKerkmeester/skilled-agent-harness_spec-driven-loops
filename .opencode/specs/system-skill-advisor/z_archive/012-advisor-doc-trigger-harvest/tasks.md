---
title: "Tasks: Advisor Doc-Trigger Harvest"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "advisor doc harvest tasks"
  - "skill_docs task list"
importance_tier: "normal"
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
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/skill-doc-harvest.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-141-advisor-doc-trigger-harvest"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Advisor Doc-Trigger Harvest

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold packet at Level 2 under the track (`create.sh --level 2 --track skilled-agent-orchestration --number 145`; first run landed at specs root without `--track`, deleted and re-created correctly)
- [x] T002 Map advisor internals before editing: sqlite DDL (`skill-graph-db.ts:158-208`), 5-lane fusion + `derived_generated` weight 0.12 (`lane-registry.ts:12`), ingestion paths (scan handler, watcher, Python CLI), `.strict()` response schema (`advisor-tool-schemas.ts:181`)
- [x] T003 Fix the flag contract: `SPECKIT_ADVISOR_DOC_TRIGGERS`, opt-in `?.trim().toLowerCase() === 'true'`, default-off, gates ingestion + projection + watcher + Python parity
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create leaf module: flag gate, tier-weight map, list-aware frontmatter parser (block + inline forms), references/assets walker with README exclusion and caps (`lib/skill-graph/doc-frontmatter.ts`)
- [x] T005 Add `skill_docs` DDL to SCHEMA_SQL and ensureSchemaMigrations; UNIQUE(skill_id, doc_path), FK cascade, idx on skill_id (`lib/skill-graph/skill-graph-db.ts`)
- [x] T006 Implement `harvestSkillDocs()` post-node-transaction: every-skill pass, per-doc content-hash skip, upsert-on-conflict, per-skill stale sweep, `DOC-READ-FAILED` warnings; surface `SkillDocHarvestResult` counters on `SkillGraphIndexResult.docs` (`lib/skill-graph/skill-graph-db.ts`)
- [x] T007 [P] Extend scorer types: `SkillDocTriggerProjection`, optional `SkillProjection.docTriggers` (`lib/scorer/types.ts`)
- [x] T008 [P] Load doc triggers into the sqlite projection: flag-gated single SELECT, `phraseVariants`+`unique` normalization, missing-table tolerant (`lib/scorer/projection.ts`)
- [x] T009 Score docs in the derived lane: per-doc best-phrase × tierWeight, top-3, sum × 0.5 capped 0.45, `doc:` evidence emitted first (`lib/scorer/lanes/derived.ts`)
- [x] T010 [P] Add optional `matchedDocs` (max 3) to the strict recommendation schema (`schemas/advisor-tool-schemas.ts`)
- [x] T011 Extract + sanitize matchedDocs in the handler: exported `matchedDocsFromContributions`, `SAFE_DOC_PATH` allowlist, no-traversal, `doc → doc_reference_signal` evidence type (`handlers/advisor-recommend.ts`)
- [x] T012 [P] Watcher: `doc-frontmatter` watch-target reason + flag-gated discovery of harvestable docs (`lib/daemon/watcher.ts`)
- [x] T013 [P] Python Gate-2 parity: `_doc_trigger_harvest_enabled`, `_parse_doc_trigger_phrases`, `_load_doc_trigger_phrases` wired into `_load_source_graph_signal_map` (`scripts/skill_advisor.py`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Author 11 vitest cases: parser forms + null paths, tier mapping, walker exclusions, flag-off ingestion invariance, flag-on lifecycle (new/unchanged/edited/deleted), lane capping, curated-beats-doc-only, absent-vs-empty docTriggers equality, path sanitization (`tests/skill-doc-harvest.vitest.ts`) — caught and fixed the quote-strip-before-trim parser bug
- [x] T015 Full advisor suite run: 471 passed; the 2 failing files (`settings-driven-invocation-parity` 35/41, one daemon-lease respawn case) reproduce with this packet's changes stashed — pre-existing, not introduced; stash round-trip conflict on a runtime state file resolved, index clean
- [x] T016 Build green: `npm run build` (shared build + tsc -p tsconfig.build.json) after every edit wave
- [x] T017 Isolated pilot against the real skill tree (temp `MK_SKILL_ADVISOR_DB_DIR`): scan 355/84 docs; deep-loop-runtime's 4 references row-verified; "deep loop script interface contract" → deep-loop-runtime top candidate (0.2968) with `doc:references/script_interface_contract.md`; flag-off probe: 0 skills with docTriggers (`/tmp/pilot-doc-harvest2.mjs`, `/tmp/pilot3.mjs`)
- [x] T021 T020 smoke leg 1 exposed rollout bug 1: trusted `skill_graph_scan` via CLI (gen 5987→5988) returned no `docs` counters; live `skill_docs` = 0 rows; daemon ran flag-off because `createChildEnv` strips non-allowlisted env (`.opencode/bin/mk-skill-advisor-launcher.cjs`)
- [x] T022 Fix bug 1: `SPECKIT_ADVISOR_DOC_TRIGGERS` added to `CHILD_ENV_ALLOWLIST`; exported `createChildEnv` unit-verified (flag forwarded, unknown keys still stripped); launcher-bootstrap + plugin-bridge + skill-doc-harvest vitest 28/28
- [x] T023 T020 smoke leg 2 exposed rollout bug 2: Python doc parity was dead code on the live path — only `_load_skill_graph_json()` merged `_load_source_graph_signal_map()`; the sqlite loader (always wins here) never did. Fix: merge source signal map in `_load_skill_graph_sqlite()`; flag-on local run ranks deep-loop-runtime 0.95 with `!coverage graph script exit codes(signal)`, flag-off output byte-identical; pytest 4/4, py_compile clean
- [x] T024 Negative boundary check: `memory_match_triggers("coverage graph script exit codes")` via spec-memory CLI returns only spec-doc memories (generic word hits), zero skill-doc results
- [B] T025 T020 final leg — live daemon `matchedDocs` smoke: blocked until every advisor-attached session ends (running launchers hold the pre-fix allowlist in memory, so any respawn they perform still strips the flag), then one fresh session runs `skill_graph_scan` (expect ~355/84 docs counters) + `advisor_recommend "coverage graph script exit codes"` (expect deep-loop-runtime with `matchedDocs: ["references/script_interface_contract.md"]`)
- [x] T026 Workstream C built (scope amendment): `check-skill-doc-frontmatter.sh` + dependency-free `.mjs` parser (shape/coverage modes, `--skill` filter, README exemption, fsrs enum vocabulary) + paths-filtered CI `skill-doc-frontmatter.yml` in `--shape`; first full-tree run reproduced the corpus exactly (355 docs / 84 detailed blocks) and exposed all 84 as out-of-contract — the 009 campaign normalized them per skill
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All build/verify tasks marked `[x]` (T001-T017)
- [ ] Rollout tasks complete: T018 governance surfaces DONE 2026-06-11 (advisor README §4 + ARCHITECTURE §4 subsections; feature_catalog 38th entry `02--auto-indexing/doc-frontmatter-harvest.md` + index; playbook scenario AI-006 + root rows + inventory vitest bumped 45→46 and green; changelog `v0.8.0.md` at the skill-local path; `SPECKIT_ADVISOR_DOC_TRIGGERS` row in ENV_REFERENCE.md SKILL ADVISOR table); T019 flag `=true` in the three runtime configs (done); T020 live smoke — partially done (T021-T024); final live leg tracked as T025
- [ ] No `[B]` blocked tasks remaining (T025 blocked on session-cycle daemon adoption)
- [x] Manual verification passed for the build scope (pilot evidence in implementation-summary.md)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification evidence**: See `checklist.md` and `implementation-summary.md`
- **Contract origin**: `027-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation/research.md`
<!-- /ANCHOR:cross-refs -->
