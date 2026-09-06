---
title: "Implementation Summary: Shared package dead half removal"
description: "The shared package lost the half nothing imported, the two packages that derived a sentinel path now share one telemetry directory export, the Voyage spelling and the stale exports are fixed, a parity test guards the model-server constants, and the README describes the package that exists."
trigger_phrases:
  - "shared removal summary"
  - "what shipped shared package"
  - "embeddings monolith gone"
  - "telemetry directory export shipped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/035-spec-kit-simplification-research/009-shared-package-dead-half-removal"
    last_updated_at: "2026-09-07T00:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "None; continue with the remaining research lanes"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/README.md"
      - ".opencode/skills/system-spec-kit/shared/config.ts"
      - ".opencode/skills/system-spec-kit/shared/package.json"
    session_dedup:
      fingerprint: "sha256:9f920304f0d2fb8a107ce698617f86357d11b423e0ed9ebc40f87d7ed0d88e3c"
      session_id: "2026-09-06-simplification-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Shared package dead half removal

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-shared-package-dead-half-removal |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The shared package now holds only modules something imports. You can open its README and find the package a consumer reaches: parsing and save gates, the Gate 3 classifier, compaction, the path helpers, the RRF primitives and the skill advisor's provider stack. The in-process embeddings library and the memory pipeline's ranking, contract and chunking modules are gone, and with them the barrel that hid their lack of importers.

### What left

`embeddings.ts` with its circuit breaker, the root `index.ts`, `paths.ts` and its database derivations, `algorithms/adaptive-fusion.ts`, `algorithms/mmr-reranker.ts`, the algorithms barrel, `ranking/`, `contracts/`, `lib/structure-aware-chunker.ts`, `parsing/quality-extractors.ts`, and the CLI's `lib/embeddings.ts` shim. Nine runtime tests whose only subject was one of those files went with them, as did the two CLI regression cases that read the monolith's model name. `shared/dist` fell from 69 files to 44 and no longer carries compiled tests.

### What changed shape

`shared/config.ts` exports the telemetry directory instead of a `.db-updated` sentinel path that only ever supplied its directory; the Gate 3 classifier and the telemetry store read the directory directly, and the runtime's own copy of the derivation is gone. The embedding profile reads `VOYAGE_BASE_URL` like the provider and the probes. `HfLocalDtype` lives in the embedding types and the provider re-exports it. The registry's error class is internal, since only its export was unused. The profile's shard-path method, which nothing called, is gone.

### What now guards a convention

`embeddings/model-server-constants.test.ts` reads the socket directory and the owner-lease file name from the shared client and from the two bin scripts that bind and write them, and fails if they differ. Two "must stay byte-identical" comments became one assertion.

### What the documents say now

The shared README is rewritten around the live modules: a consumer table, a configuration table that lists every variable the package reads by the module that reads it, examples with real signatures, and a paragraph naming what left. The algorithms README describes the one module that remains. The core, lib and parsing READMEs, the env template, the env reference, the environment-variables reference and the architecture document no longer name removed members.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `shared/{embeddings,index,paths}.ts`, `shared/algorithms/{adaptive-fusion,mmr-reranker,index}.ts`, `shared/ranking/`, `shared/contracts/`, `shared/lib/`, `shared/parsing/quality-extractors{,.test}.ts`, `runtime/cli/lib/embeddings.ts` | Deleted | The dead half and its shim |
| Eight `runtime/tests/*.vitest.ts` files | Deleted | Tests whose only subject was removed |
| `shared/config.ts`, `shared/gate-3-classifier.ts`, `runtime/lib/graph/access-telemetry.ts`, `shared/config.test.ts` | Modified | Telemetry directory export and its readers |
| `runtime/core/config.ts` | Modified | Database block removed |
| `shared/embeddings/{registry,profile,types}.ts`, `providers/hf-local.ts`, `shared/types.ts`, `registry.test.ts` | Modified | Internal class, shard method gone, Voyage spelling, dtype home |
| `shared/package.json`, `shared/tsconfig.json`, `system-spec-kit/package-lock.json` | Modified | Exports, dependency, scripts, test exclusion |
| `shared/embeddings/model-server-constants.test.ts` | Created | Cross-package parity |
| `runtime/cli/lib/semantic-summarizer.ts`, `runtime/cli/core/workflow.ts`, `runtime/cli/tests/memory-pipeline-regressions.vitest.ts`, `runtime/cli/evals/import-policy-allowlist.json` | Modified | Barrel and shim consumers |
| `shared/README.md`, `shared/algorithms/README.md`, `shared/parsing/README.md`, `runtime/core/README.md`, `runtime/cli/lib/README.md`, `ARCHITECTURE.md`, `references/config/environment-variables.md`, `runtime/ENV-REFERENCE.md`, `.env.example` | Modified | Documents that named removed members |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The lane's ledger was censused against the real tree with a Python file walk before anything moved, which corrected three rows and dropped one. The edits ran as one literal-replacement script that aborts on any site it cannot find exactly once; removals went through `git rm`; the lockfile was regenerated at the skill root with `--package-lock-only`. The three packages were rebuilt in dependency order. The first shared build failed on the error class the registry throws internally, and the residue sweep found the command contracts citing the predicate module; both came back before any commit. The commit was assembled in a private index so the other session's working-tree edits stayed theirs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `predicates/boolean-expr.ts` | Three speckit contracts and one deep contract cite it as the grammar of their `when:` predicates; a citation is a consumer |
| Make the registry's error class internal rather than delete it | The registry throws it on an empty manifest list; only the export was dead |
| Export a directory, not a sentinel | Both readers only ever took `path.dirname()` of the sentinel; nothing wrote the file |
| Keep both database-directory spellings | Operator configs carry both; collapsing them is a migration, not a cleanup |
| Record the advisor's isolation doctrine instead of changing it | The advisor duplicates one module and imports the embedding stack directly; its maintainers own that boundary |
| Treat four lane claims as environment facts | The stale dist, the unprovisioned root, the broken resolution and the missing directory all held only in worktree 046 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --build` in `shared` after `rm -rf dist` | PASS, 44 dist files, no compiled tests |
| `npm test` in `shared` | PASS, including the new parity test |
| `npm run build` in `runtime` | PASS |
| `npm run rebuild` and `npm run check` in `runtime/cli` | PASS, zero violations, dist alignment clean |
| `dist-freshness.cjs check-all` | PASS, all watched outputs fresh |
| Six runtime suites touching the classifier, the store and discovery, plus the drift guard | PASS, 33 and 5 tests |
| Full CLI vitest project | 135 files and 1,344 tests pass; the one failure is `recursive-child-manifest.vitest.ts`, which reads another session's packet and failed before this program |
| sk-doc validator on the five touched READMEs | exit 0 each |
| Residue sweep for every removed name | only the two READMEs that record the removal |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The package-lock diff is larger than the one dependency it drops** Regenerating the lock at the skill root also refreshed resolution metadata; the lock installs the same tree.
2. **The skill advisor's half-isolation stands** It duplicates the unicode module for isolation while importing the embedding stack directly; recorded for its maintainers.
<!-- /ANCHOR:limitations -->

---
