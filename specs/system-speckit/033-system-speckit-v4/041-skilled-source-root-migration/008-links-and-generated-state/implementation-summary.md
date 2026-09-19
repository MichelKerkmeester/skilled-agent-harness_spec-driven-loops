---
title: "Implementation Summary: Phase 8: links-and-generated-state"
description: "Every tracked link outside the specs records now resolves into .skilled without a detour through .opencode, and every generator and derived artifact was rebuilt from .skilled constants and proven fresh by its own check, in ten local commits that nothing has pushed."
trigger_phrases:
  - "links and generated state implementation summary"
  - "skilled generator rebuild results"
  - "link census after the move"
  - "generated state verification evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/008-links-and-generated-state"
    last_updated_at: "2026-09-17T15:10:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Rebuilt links and generated state under .skilled"
    next_safe_action: "Validate the phase strictly, then start phase 009 per D1"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
      - "goal.md"
      - "scratch/review-ledger.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-008-implementation-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 003 records that council-graph.sqlite needs no migration"
      - "Phase 010 gives consumer roots a .skilled link before any home config names .skilled paths"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-links-and-generated-state |
| **Completed** | 2026-09-17, committed from `88425278a6` to `aaea487a2b` on `worktrees/055-skilled-source-root-migration`, not pushed |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

After phase 007 moved the tree, 171 links outside it and every generated runtime file still pointed at `.opencode`. They resolved only because `.opencode` links to `.skilled`. Now every tracked link outside the frozen records resolves into `.skilled` directly, every generator reads its sources from `.skilled`, and each derived artifact was rebuilt by its owner and proven fresh by that owner's own check.

### Links

The 27 hand-made links in the runtime directories point at their `.skilled` targets, each resolving to the same real file as before. The mirror generator relinked the 144 mirrors that targeted `.opencode`, and its check still counts 168 mirrors across 8 trees. Three links that already dangled were retired, because their targets had moved into the sk-design hub. `plugins/sk-vision.js` stays and resolves on this machine now that `vision-runtime` is built. The census went from 436 links with 8 dangling and 171 old-root targets to 433 links with only the 4 frozen records dangling and no old-root target.

### Generators and derived state

| Owner | What changed | Proof |
|-------|--------------|-------|
| `dist-freshness.cjs` | 12 package roots and rebuild commands under `.skilled` | Four package checks and `check-all` fresh |
| Hook registry and `sync-hook-registrations.cjs` | 81 script paths and 3 drift hints, four runtime configs regenerated | 4 files match the 29-hook registry, 15 Pi extensions resolve |
| `sync-runtime-mirrors.cjs` | Command source and hook-path pattern | 168 mirrors across 8 trees |
| Codex, Pi and Hermes generators | Source directories and header strings | 33 and 12 Codex, 33 and 12 Pi, 33 Hermes prompts and 68 Hermes skill copies |
| `sync-gate1-pointers.cjs` | Intro names both roots, generated-by line names `.skilled` | 2 pointer blocks |
| `compile-command-contracts.cjs` | Source, classifier and output paths | Contract drift OK for 3 commands |
| `compiled-route-sync.cjs` | Serving root under `.skilled`, specs root resolved directly | `move-simulation OK`, `runtimeRoot` under `.skilled` |
| `regenerate-skill-derived.cjs` and 13 skill graph metadata files | 238 derived paths rewritten by a JSON-aware script | Dry run changed 0, errored 0, 13 fresh |
| Trigger index and its three fixtures | Corpus and ripgrep roots under `.skilled` | A second run byte-identical, no `.opencode/` path entry |
| `.skilled/package-lock.json` | Package name | Only line 2 changed |

`validate-command-references.cjs` reads the Codex prompt headers, so it now accepts either root name when it checks them, preferring `.skilled`.

### Matrix

Six runtimes by six artifact kinds populate 18 cells, each with one owner.

| Runtime | Link | Prompt | Agent | Skill copy | Hook config | Pointer block |
|---------|------|--------|-------|------------|-------------|---------------|
| Claude | hand-made, mirrors | - | - | - | registrations | - |
| Codex | hand-made, mirrors | `codex/sync-prompts.cjs` | `codex/sync-agents.cjs` | - | registrations | `sync-gate1-pointers.cjs` |
| Cursor | hand-made, mirrors | - | - | - | registrations | `sync-gate1-pointers.cjs` |
| Devin | hand-made, mirrors | - | - | - | registrations | - |
| Hermes | hand-made | `hermes/sync-prompts-hermes.cjs` | - | `hermes/sync-skills-hermes.cjs` | - | - |
| Pi | hand-made | `pi/sync-prompts-pi.cjs` | `pi/sync-agents-pi.cjs` | - | - | - |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| 27 hand-made links in `.claude`, `.codex`, `.cursor`, `.devin`, `.hermes` and `.pi` | Retargeted | Resolve into `.skilled` directly |
| Three dangling links under `.skilled/changelog` and `.skilled/skills/sk-doc/scripts` | Deleted | Their targets moved into sk-design |
| 16 source files, 7 test files and the hook registry | Modified | Constants, headers and test literals under `.skilled` |
| 13 skill `graph-metadata.json` files | Modified | Derived paths under `.skilled` |
| 4 hook configs, 144 mirror links, 168 generated prompts, agents and skill copies, 2 pointer blocks, 3 compiled contracts, the serving-closure manifest, the trigger index, its 3 fixtures and the package lock | Regenerated | Output of the owners above |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase started by re-checking its plan against the moved tree. It ran the fifteen freshness checks and found two failures that reproduce identically in a clone of the pre-move commit. It took a link census and inventoried every consumer of the constants it meant to change. That inventory added the mirror generator's whole-config pattern and two phase 006 test rows that would otherwise have passed without testing anything, and a review added the command-reference validator.

### Delegation

Every constant edit was written first as an expected file with exact replacement counts. DeepSeek V4.1 Flash applied them as two JSON-aware rewrites and 22 literal OLD/NEW edit units on five workers across the Gateway, Cline and Devin lanes, then two follow-up units for the validator and a drift-test assertion. Each file had to match its expected bytes and pass the comment hygiene check. Five GPT-5.6 Luna reviews read the edits before any generator ran, and a sixth read the validator change. The write runs went to the Pi lanes in waves: builds and links, then hook registrations, then mirrors, then the Codex, Pi, Hermes, Gate 1, contract, routing and skill-metadata units together, then leaf manifests, the lock and the trigger index. The orchestrator re-ran every check and suite itself.

### Commits

| Commit | Scope | Paths |
|--------|-------|-------|
| `88425278a6` | Dist freshness roots | 1 |
| `fd8213edb9` | Hand-made links, retired links, hook registry and configs, mirrors, Codex copies, validator | 228 |
| `a19099ce92` | Pi generators and prompts | 35 |
| `c04e0f3bf2` | Hermes generators, test, prompts and skill copies | 93 |
| `dadc8a34a8` | Gate 1 pointer generator and blocks | 3 |
| `eef18a8e3f` | Contract compiler, tests and contracts | 6 |
| `6fabee1efe` | Routing sync, test and manifest | 3 |
| `6f530bfb81` | Skill metadata regenerator, test and 13 metadata files | 15 |
| `43e71d183d` | Package lock | 1 |
| `aaea487a2b` | Retrieval roots, tests, trigger index and fixtures | 9 |

The mirror parity gate refuses a commit that stages some generated mirrors while others stay unstaged, so the links, hooks, mirrors and Codex copies share one commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reviews ran on GPT-5.6 Luna, in parallel | The parent's D3, amended on 2026-09-17, names Luna and parallel lanes, and it outranks this phase's own D3 |
| The three hook drift hints moved with the 81 script paths | The mirror generator reads every script path in the raw config text, so leaving the hints on `.opencode` would have dropped three mirrors |
| The Gate 1 pointer names both roots | Consumer checkouts carry only `.opencode`, the second sentinel ADR-003 K2 keeps |
| Consumer-checkout findings stay with phase 010 | ADR-003 rewrites these references, and phase 010 gives each consumer root a `.skilled` link before any home config names `.skilled` paths. Nothing from this phase reaches a consumer |
| Code that cuts paths at `/.opencode/` goes to phase 009 | Those scripts are neither generators nor derived state, and phase 009 rewrites code references before anything is published |
| No bypass for the mirror parity gate | The gate protects mirror consistency, so the mirror units share a commit instead |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Link census | PASS. 433 links, 4 dangling (the frozen allowlist), 0 old-root targets, 4 absolute, and no untracked link |
| Hand-made links | PASS. 27 of 27 equal their map value and resolve to the same real file |
| Freshness sweep | 14 of 15 PASS. The routers generator's 3 path drifts predate the move and go to phase 009 |
| Idempotence | PASS. A second write run of every generator wrote nothing and left status and bytes unchanged |
| Dist builds | PASS. Four packages fresh, `check-all` fresh, `generate-context.js --help` exits 0 |
| Trigger index | PASS. Byte-identical second run, no `.opencode/` path entry, same 1,835 documents under the source roots |
| Spec-kit suites | 72 of 73. `hook-registration-sync` fails with `expected 81 to be 77`, identically on the pre-move commit |
| Deep-loop contract suites | PASS, 23 of 23 |
| Hermes and routing suites | PASS, 3 of 3 and 42 of 42 |
| sk-doc suites | PASS, leaf-manifest freshness, leaf-manifest scopes and the skill-derived regenerator |
| Mirror consistency checks | PASS. Command-tree parity, agent roster and command catalog |
| Reviews | Six Luna reviews, 10 findings dispositioned in `scratch/review-ledger.md` |
| `validate.sh --strict` on the main checkout's toolchain | PASS, `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Some code still cuts paths at `/.opencode/`.** `init-skill-graph.sh`, `permissions-gate.ts`, `sweep-memory-residue.mjs` and `alignment-validator.ts` misread `.skilled` real paths since the move. Phase 009 fixes them before phase 011 publishes.
2. **Consumer projects need a `.skilled` link first.** Hook commands, dist-freshness roots and retrieval roots now name `.skilled`, which a consumer project with only `.opencode` lacks until phase 010 adds the link.
3. **One test failure predates the move.** `hook-registration-sync.vitest.ts` expects 77 registrations and the registry renders 81, the same as in the pre-005 CI baseline.
4. **sk-vision needs a build on every checkout.** `plugins/sk-vision.js` dangles until `vision-runtime` is built, and that build writes an unignored `hooks/opencode/sk-vision.js`, left untracked here.
5. **Nothing is pushed.** The ten commits live in worktree 055 until phase 011 publishes.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-up: OpenCode alias retirement (2026-09-19)

Two aliases under `.opencode` were retired after this phase closed, because no consumer reached them any more once the hand-made links resolved into `.skilled` directly.

`bin` and `logs` were per-entry symlinks onto `../.skilled/bin` and `../.skilled/logs`. The `bin` alias had one consumer, the `code_mode` MCP server entry in `opencode.json`, which now names `.skilled/bin/mcp-code-mode-launcher.cjs`. The `logs` alias had none: the three OpenCode plugins that write a workspace log resolve their path through `findSourceRoot()` and fall back to `<repoRoot>/.opencode` only when no toolchain tree exists, and that fallback calls `mkdirSync` with `recursive`, so it recreates the directory instead of failing.

| File | Action | Purpose |
|------|--------|---------|
| `opencode.json` | Modified | `mcp.code_mode.command` names `.skilled/bin/mcp-code-mode-launcher.cjs` |
| `.opencode/bin`, `.opencode/logs` | Deleted | No consumer remained |
| `.opencode/SYNC.md` | Modified | The two inventory rows and the section 1 reference to the launcher path |
| `.opencode/README.md` | Modified | The `bin/` and `logs/` rows in the entry table |
| `bin/tests/opencode-compat-layout.test.cjs` | Modified | The launcher assertion matched `.opencode/bin/...` and now matches `.skilled/bin/...` |

`opencode-compat-layout.test.cjs` reads the section 2 inventory out of `SYNC.md` and asserts that every entry on disk is listed there, so the manifest rows and the symlinks had to change together. Removing either alone leaves the test red.

| Check | Result |
|-------|--------|
| `opencode-compat-layout.test.cjs` | PASS. 19 pass, 2 skipped as install-time, 0 fail, exit 0 |
| Launcher target resolves | PASS. `.skilled/bin/mcp-code-mode-launcher.cjs` exists |
| Originals retained | PASS. `.skilled/bin` and `.skilled/logs` are unchanged |
| `validate.sh --strict` on this folder | PASS, `RESULT: PASSED` |

Rollback for this follow-up: `git checkout -- .opencode/bin .opencode/logs opencode.json .opencode/SYNC.md .opencode/README.md .skilled/bin/tests/opencode-compat-layout.test.cjs`.

### The embedder question, resolved without a change

The same request asked whether anything still embeds, and whether `hf-model-server.cjs` could go. It stays, because it is the local-only tier of the skill-advisor embedding cascade rather than dead code.

One skill embeds at runtime: `system-skill-advisor`. Its `runtime/lib/skill-graph/skill-graph-db.ts` calls `createEmbeddingsProvider()` and writes vectors, and the persisted pointer in `runtime/database/skill-graph.sqlite` reads `active_embedder_provider=ollama`, `active_embedder_name=nomic-embed-text-v1.5`, `active_embedder_dim=768`, with 13 rows in `vec_768`. Its `semantic_shadow` lane is live at weight 0.05.

`shared/embeddings/factory.ts` resolves auto mode as ollama when the persisted provider is reachable and hf-local otherwise, so the model server is reachable whenever Ollama is not answering. Ollama is installed on this machine and serves the tier-one model, so hf-local is currently unreached, and retiring it would move that tier to the cloud providers instead.

Nothing else consumes an embedder. `system-spec-kit` does not embed at all, since its memory MCP surface was retired and its retrieval path is the lexical trigger index plus the ripgrep lane. `system-deep-loop` has no embedding or vector usage. The sk-design style library injects its own `embedder` callback for a git-ignored vector lane and never names the model server.
<!-- /ANCHOR:follow-up -->

---
