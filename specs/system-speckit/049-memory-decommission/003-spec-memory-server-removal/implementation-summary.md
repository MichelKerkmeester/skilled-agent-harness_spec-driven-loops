---
title: "Implementation Summary: spec memory server removal"
description: "The memory engine is gone from a 1,482-file package that now holds 333 import-closed files, no runtime declares the server, all five runtimes boot with no memory process, and the skill advisor still resolves its embedder over the shared socket."
trigger_phrases:
  - "spec memory server removal"
  - "mcp server deletion"
  - "daemon removal"
  - "preserve set"
  - "implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-memory-decommission/003-spec-memory-server-removal"
    last_updated_at: "2026-09-03T21:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed all fourteen acceptance rows after the six pruning waves"
    next_safe_action: "Take the three open decisions to the operator, then start phase 004"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/api/index.ts"
      - ".opencode/skills/system-spec-kit/scripts/core/workflow.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts"
      - ".opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md"
      - ".opencode/scripts/orphan-mcp-sweeper.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-003-spec-memory-server-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Does the skill-advisor launcher become the default spawner of the shared HF model server?"
      - "Do the eight now-unimported package dependencies come out, accepting a lockfile regeneration?"
      - "Does lib/description/repair.ts fold into repair-derived.cjs or get dropped?"
    answered_questions:
      - "The package survives as the spec-kit engine; only the memory engine inside it was deleted"
      - "The advisor resolves its embedder with no memory process, over the shared model-server socket"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-spec-memory-server-removal |
| **Completed** | 2026-09-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The memory engine is gone and the package it lived in is still the spec-kit engine. Under option A
the operator kept validation, the graph and description metadata, the level contracts, the continuity
writer's imports and the runtime hook adapters, and everything unreachable from those entry points
was deleted: the transport, the tools, the daemon, the launchers, the plugin, the hook concern, the
registrations in all five runtimes and the documentation that described them as available. No runtime
declares the server, every cold boot leaves no memory process behind, and the skill advisor still
returns a scored recommendation over the shared socket.

### The package after the prune

Tracked files went from 1,482 at the phase-002 commit `cc6a50271e` to 333, lines from 453,964 to
about 68,270, and the tree from 20.3 MB to 2.8 MB. What is left is import-closed rather than merely
smaller: 99 modules are reachable from the surviving entry points and exactly two orphans are
intentional, `lib/test-helpers/env-snapshot.ts` for the dist-freshness test and
`mcp-server/scripts/tests/resource-map-extractor.vitest.ts`. The surviving top level is `api` (the
`index.ts` barrel and `graph-refresh.ts`), `handlers` (`memory-index-discovery.ts` and
`save/spec-folder-mutex.ts`), `core/config.ts`, `configs`, `hooks` (the adapters the five runtime
hook configs name), `lib` across 18 directories, `scripts` (finalize-dist, the two runners and
tests), one save-flood case under `stress-test/substrate`, `tests` and `data/README.md`.

### Outside the package

Both bins went, `system-spec-memory-launcher.cjs` and `spec-memory.cjs`, along with the OpenCode
plugin and its test and the `.opencode/hooks/spec-memory/` folder. The `/memory:learn` and
`/memory:manage` commands were removed from all four runtime command roots with their assets, and
`doctor-causal-graph.yaml`, both install guides, the memory-only tests and CLIs, `scripts/setup/install.sh`
and the graph-repair script with its sqlite lineage branch followed — `repair-derived.cjs` already
covers the file repair. The documentation shrank with the subsystem: 265 feature-catalog and playbook
pages, catalog 350 to 48 and playbook 426 to 86, then the repair-runner page and its scenario.

### The seams

Five files with a surviving owner were edited at source rather than swept. `scripts/core/workflow.ts`
lost its provider retry-manager dynamic import and the step that processed the embedding retry queue,
because nothing produces a retry any more. `deploy-mcp.sh`, `orphan-mcp-sweeper.sh` and
`session-cleanup.sh` lost their memory context-server branches while the advisor socket survives the
pass. `shared/embeddings/adapter.ts`, `providers/hf-local.ts` and `shared/ipc/socket-server.ts` now
carry only shared model-server paths, defaulting to the socket directory `/tmp/system-hf-embed`.
`deep-research-auto.yaml` and the deep-loop runtime lost their MCP persistence while the locks,
projections and reducers work untouched. The producers — `install-all.sh`, `create-skill-auto.yaml`
and the resolver template — were updated before the artifacts they generate were deleted.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp-server/**` | Deleted | 1,149 engine-only modules, tools, transport, migrations, evals and their tests |
| `.opencode/skills/system-spec-kit/mcp-server/api/index.ts` | Modified | Barrel pruned to the symbols the survivors import |
| `.opencode/bin/system-spec-memory-launcher.cjs`, `.opencode/bin/spec-memory.cjs` | Deleted | The launcher and the CLI shim |
| `.opencode/plugins/system-spec-memory.js` and its test, `.opencode/hooks/spec-memory/` | Deleted | Plugin bridge and the memory hook concern |
| `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.pi/mcp.json`, `opencode.json` | Modified | No `system-spec-memory` declaration or grant in any runtime |
| `.opencode/commands/memory/**` and the three runtime mirrors | Deleted | `/memory:learn` and `/memory:manage` with their assets |
| `.opencode/skills/system-spec-kit/scripts/core/workflow.ts` | Modified | Retry-manager import and the retry-queue step removed at source |
| `scripts/deploy-mcp.sh`, `.opencode/scripts/orphan-mcp-sweeper.sh`, `.opencode/scripts/session-cleanup.sh` | Modified | Memory branches out, advisor socket preserved |
| `shared/embeddings/adapter.ts`, `providers/hf-local.ts`, `shared/ipc/socket-server.ts` | Modified | Shared model-server paths only |
| `.opencode/commands/deep/assets/deep-research-auto.yaml`, `system-deep-loop/runtime/**` | Modified | MCP persistence gone, loop state machine intact |
| `.env.example` | Modified | 190 engine-only rows and the memory-titled sections removed, 409 to 220 names |
| `.opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md` | Modified | 351 to 146 variables, 856 to 480 lines, every row with a verified reader |
| `.opencode/skills/system-spec-kit/feature-catalog/**`, `manual-testing-playbook/**` | Deleted | 265 pages, catalog 350 to 48, playbook 426 to 86 |
| `.opencode/install-guides/**`, `mcp-server/INSTALL-GUIDE.md`, `scripts/setup/install.sh` | Deleted | Install paths for a server that no longer exists |
| `.opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs` and its test | Modified | `mcp-server` exclusion removed so the sweep now covers the package, 29 pass |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Six pruning waves by the code agent, then four agents on the surfaces around it: C2 took the
registrations, launchers and hooks, C3 the CLIs and scripts, C4 the deep-loop runner and the shared
comments, C5 the test reconciliation. Five documentation agents ran behind them, D1 to D5, covering
the root and skill docs, the catalog and playbook prune, the reaper docs, `ENV-REFERENCE.md` and the
package structural docs. One agent was killed by a network outage mid-suite and resumed from its
transcript rather than restarted. The orchestrator verified every result on disk and made the small
seam edits itself. Nothing is committed: the before state is the phase-002 commit `cc6a50271e` and
the phase sits in the worktree on `branches/017-memory-decommission`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Option A: delete the engine, keep the package as the spec-kit engine | Validation, the graph and description metadata, the level contracts, the continuity writer's imports and the hook adapters all live inside the tree, so deleting it whole would break what the parent says must survive |
| Import closure, not file count, is the deletion gate | A tree that merely got smaller can still carry dead modules; 99 reachable modules and two named orphans is a property that can be rechecked |
| The residue sweep's `mcp-server` exclusion was removed in this phase | The exclusion existed because the engine was still there; leaving it would have let the surviving package hide residue behind the thing that was supposed to prove its absence |
| Mixed rows got source-level edits, never token deletions | A search that comes back clean after a line drop proves nothing about whether the surviving owner still works |
| The eight now-unimported dependencies stay for now | Removing them regenerates the lockfile, and `node_modules` is shared with the main checkout, so the cost lands outside this phase's blast radius |
| The 41 failing test files were reconciled against the phase-002 commit rather than fixed | 38 fail identically at `cc6a50271e` in a fresh worktree with the same dependency layout, so treating them as this phase's regressions would have been fixing someone else's bug under scope lock |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Five runtime config roots read for a `system-spec-memory` declaration or grant | grep count 0 in each |
| Cold boot per runtime from the worktree, non-interactive one-word prompt | claude, codex and pi exit 0; cursor exit 0 with the trust flag; opencode booted and created its session but exited 124 on a provider stream error from the flash model, not an MCP error |
| The four negatives per runtime after each boot | Zero memory processes, zero memory mentions or timeout notices in stderr, no launcher lock directory created; the `/tmp/system-spec-memory` subdirectories predate the boots and belong to the main checkout's daemon on another branch |
| Every hook path named by the five hook configs | Present on disk |
| Live skill advisor on the pruned code | `advisor_recommend` returns scored recommendations, exit 0; `advisor_status` freshness live; no memory process |
| Shared `hf-embed` socket ownership | Live two-launcher test, 3 passed 2 skipped, plus `hf-local`'s default socket directory `/tmp/system-hf-embed` |
| `validate.sh --strict` on `specs/system-deep-loop/040-cli-lineage-nesting-and-containment-guard` | Errors 0, Warnings 0, `RESULT: PASSED`, exit 0 |
| `repair-derived.cjs` and the continuity writer | inspected=1 repairable=0 failed=0; `generate-context.js` exit 0 with the graph-metadata refresh logged |
| Package census after the prune | 1,482 to 333 tracked files, 453,964 to about 68,270 lines, 20.3 MB to 2.8 MB; import-closed at 99 modules with 2 intentional orphans |
| Residue sweep from the worktree root, final state, now covering `mcp-server` | live 0, livePaths 0 across 3,171 paths and 30,705 records, 43 reasoned allowlist entries; sweep test 29 pass |
| Trigger index regenerated twice | Byte-identical, `sha256:8595d686bd7b6763…` for `data/trigger-index.json`, no deleted path in the manifest; a sample prompt returns 20 candidates with no daemon; retrieval suites 71 tests pass |
| Environment surface | `.env.example` 409 to 220 names, every remaining `SPECKIT` row with a live reader or shared owner; `ENV-REFERENCE.md` 351 to 146 variables and 856 to 480 lines; env-reference-drift test 5 pass, exit 0 |
| Deep-loop runtime suite, final state | 153 files, 2,534 tests, exit 0 |
| Builds | Package build, workspace build from a wiped dist and typecheck each exit 0; `finalize-dist` previously passed on stale dist residue and now checks real artifacts |
| Spec-kit kept suites (`mcp-server/tests` plus `scripts/tests`), final state | 41 failing files, 71 failing tests, 2,646 passed. 38 of the 41 fail identically at `cc6a50271e` in a fresh worktree with the same dependency layout (58 of 67 rerun there failed); the other 3 were fixed after the run — dist rebuilt, the deleted CLI's test removed, a registry pointer given its line range — and pass now. Zero regressions attributable to this phase |
| Nine early regression candidates | All closed: three tests of deleted migrations and the plugin bridge deleted with their subjects, one flag-docs test deleted with its documents, four launcher, IPC, sweeper and handback tests reconciled to the surviving contract with no subject fix needed, one live-spawn test was a load flake |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The shared HF model server has no default spawner.** The deleted memory launcher was its default owner, and the skill-advisor launcher only spawns it under `SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=1`. The advisor works without it, so this is a decision about defaults rather than a break.
2. **Eight package dependencies have no importer left:** `@modelcontextprotocol/sdk`, `sqlite-vec` and its darwin optional, `@huggingface/transformers`, `chokidar`, `web-tree-sitter`, `tree-sitter-wasms`, `zod-to-json-schema` and `ignore`. They were left in place because removing them regenerates a lockfile shared with the main checkout.
3. **`lib/description/repair.ts` is now test-only.** It should either fold into `repair-derived.cjs` or go; nothing in production reaches it.
4. **The model-server supervisor's maintenance-marker read path is unreachable.** Only the deleted engine ever wrote that marker, so the read survives with no writer.
5. **About twenty live script-runner variables are still undocumented in `ENV-REFERENCE.md`.** They sit outside the drift gate, so the gate passes while the gap remains.
6. **Pre-existing failures left alone under scope lock:** sk-doc's frozen durable-directory manifest test, which fails identically at `cc6a50271e` and is stale; the memory-roadmap-flags database-directory cases, which throw `ProductionDatabaseResolutionError` from `shared/paths.ts` in this layout; the `repair-derived` fixture cases already on the HEAD failure list; and `deep-model-benchmark-confirm.yaml`, which does not parse at HEAD either.
7. **Frontmatter version fields were not bumped** on the documents this phase edited, matching the phase-002 convention.
<!-- /ANCHOR:limitations -->
