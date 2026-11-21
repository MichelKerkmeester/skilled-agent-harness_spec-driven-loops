---
title: "Implementation Summary"
description: "The advisor scores four lanes, advisor_status reports four lane keys and refuses the semantic-health flag, an advisor database from before the change is discarded and rebuilt at the next start, and nothing in the advisor imports the embeddings package. Every routing ratchet and score baseline is unchanged."
trigger_phrases:
  - "lane core implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/004-lane-core"
    last_updated_at: "2026-11-21T02:22:23Z"
    last_updated_by: "generate-context"
    recent_action: "Implemented and verified phase 004"
    next_safe_action: "Run /speckit:implement on 005-shared-embeddings-package"
    packet_purpose: "Purpose: The advisor has no semantic lane left: four lane keys in every contract, no vector object in any database it opens, and no import from the embeddings package, with routing results unchanged."
    blockers: []
    key_files:
      - "004-lane-core/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:5a773740f939fa36fbd992b9db241d5c5a888489e808a29ee85c5106db3a29d4"
      session_id: "scaffold-004-lane-core"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/worktrees/public/497-ollama-lane-removal"
      savedAt: "2026-11-21T02:22:23Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-lane-core |
| **Completed** | 2026-11-21 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The semantic lane no longer exists in the advisor. It scores four lanes, `advisor_status` reports four lane keys and refuses `includeSemanticHealth` (the CLI exits 64), `lib/embedders/` and the lane file are gone, and the residue check's live count fell from 265 to 172.

### Phase 4: lane-core

The registry row, the lane, its vector tables and their indexes, the status fields and the dead `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC` switch are deleted at every site. Live and shadow weights each still sum to 0.95. `SCHEMA_VERSION` is 2: at start, a database that holds an older version is deleted with its `-wal`, `-shm` and `-journal` files and no copy, and the scan that already runs before the daemon serves rebuilds it. A lock, I/O or permission error never counts as an old version.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/embedders/` (9 files), `lib/scorer/lanes/semantic-shadow.ts`, the `lib/shared/embeddings` symlink | Deleted | The lane and its embedder adapters |
| `runtime/lib/scorer/` registry, weights, fusion, projection, types, graph-causal | Modified | Four lanes; weights unchanged |
| `runtime/lib/skill-graph/skill-graph-db.ts` | Modified | Vector DDL gone; schema version 2 with the outdated-database discard |
| `runtime/handlers/advisor-status.ts`, schemas, tool, CLI manifest | Modified | Four lane keys; removed flags refused |
| `runtime/handlers/advisor-recommend.ts`, `advisor-validate.ts`, metrics, prompt policy | Modified | Lane references removed |
| Routing-accuracy scripts, Python bench and regression scripts, the launcher, the classifier replay helper | Modified | Dead switch removed |
| 14 test paths | Deleted | Embedder, lane and coverage tests |
| 21 tests, 4 stress files, `test_skill_advisor.py` | Modified | Four-lane contract, discard cases |
| 7 READMEs, 6 catalog leaves, 2 regenerated sk-doc baselines | Modified | Lane prose removed |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` | Modified | Two rows for matches that are not the lane |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An Opus worker made the edits in `tasks.md` order on top of `4c86b7c3c10`. The first review returned REQUESTED_CHANGES with one P1 it reproduced: the discard read any probe error as version 0, so a current database whose write lock outlasted both waits was deleted. The worker narrowed the discard to a version it actually read, created `schema_version` before `skill_nodes`, and added held-lock, hot-journal, pre-version and empty-file tests, then a creation-order check and an empty-version-table keep case. The second review returned APPROVED at 95/100. The conductor reran every gate after a clean build.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Discard old databases rather than migrate them | The graph is derived and the startup scan rebuilds it; decision D7 |
| Discard only on a version actually read | A lock or I/O error must never delete a live database |
| The read-write open also discards a version below 2 it reads | A leftover rollback journal makes every read-only probe fail, so without this an old file would be stamped version 2 and keep its vector tables |
| Weights stay at 0.95 | Frozen decision; the removed lane had no live weight in the sum |
| Allowlist the behaviour harness's `OLLAMA_` prefix and two routing prompts | The prefix serves Codex's local model provider and the prompts only name a research topic; neither is the advisor lane |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` (advisor `runtime/`) | exit 0, rerun by the conductor |
| `npm run clean && npm run build` | exit 0, rerun by the conductor |
| `npm test` | exit 0: 178 files, 2456 passed, 4 skipped (2460); the lane removal took 11 files and 67 cases off the 189 and 2521 at the start, and the two discard review rounds added six cases |
| `npm run test:stress -- --config vitest.stress.config.ts` | 21 files, 65 passed |
| Parity ratchets | 7, 9 and 6 passed, rerun by the conductor |
| Golden prompts and command-routing slice | 51 passed |
| Routing corpus gate | exit 0, output byte-identical to the start |
| Nine score baseline files | no diff |
| Weight sums | live 0.42 + 0.28 + 0.13 + 0.12 = 0.95; shadow 0.40 + 0.25 + 0.20 + 0.10 = 0.95 |
| Discard on a copy of the real version 1 database | discarded and recreated at version 2 with no vector objects; the live database hash unchanged |
| Held-lock repro on the rebuilt dist | database kept with its marker row |
| `derive-command-bridges.cjs --check`, leaf manifest, catalog validator, link check, sk-doc script tests | fresh, OK, PASS, 0 broken, passed |
| `sweep-lane-residue.mjs repo` | exit 1: 201 files, 29 allowlisted, 172 live (was 265) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two processes upgrading the same version 1 file at once could delete each other's new file.** The discard deletes by path. The launcher lease makes the daemon the only writer per database folder, so this needs the cold init script and a daemon start within microseconds on the one-time upgrade; the data rebuilds on the next start. An inode check before deleting would close it.
2. **A daemon started from an older build keeps its version 1 file until it restarts.** The discard runs at start.
3. **Eleven advisor files still show in the residue check.** Each belongs to a later phase: packages and launcher tests to 005, the five-lane names to 006, `skill-graph.json` to 007, and the frozen baselines and two refusal tests to 008's allowlist.
<!-- /ANCHOR:limitations -->
