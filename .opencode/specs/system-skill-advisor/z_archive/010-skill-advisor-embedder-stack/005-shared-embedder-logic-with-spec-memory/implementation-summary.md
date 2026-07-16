---
title: "Implementation Summary: shared embedder logic with spec-memory"
description: "Shipped 2026-05-21: shared embedder contract surface, llama-cpp purge parity, 'auto' sentinel default with content-type-aware cascade, bootstrap wiring. Round 2 (2026-07-08): provider persistence, cross-server MEMORY_DB_PATH leakage fix, hf-model-server onnx shutdown-crash mitigation."
trigger_phrases:
  - "shared embedder logic skill-advisor"
  - "skill-advisor spec-memory embedder parity"
  - "auto sentinel default"
  - "nomic-embed-text-v1.5 default"
  - "content-type aware cascade"
  - "active embedder provider persistence"
  - "MEMORY_DB_PATH cross-server leakage"
  - "hf-model-server onnx shutdown crash"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/010-skill-advisor-embedder-stack/005-shared-embedder-logic-with-spec-memory"
    last_updated_at: "2026-07-08T06:58:48Z"
    last_updated_by: "claude"
    recent_action: "Retro-documented Round 2: provider persistence, DB-leak fix, onnx mitigation"
    next_safe_action: "Operator: run the true production swap-runbook + cold-daemon live-smoke"
    blockers: []
    completion_pct: 100
---
# Implementation Summary: shared embedder logic with spec-memory

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: SHIPPED (original + Round 2 hardening).** The original 5-step plan shipped 2026-05-21 (`5d1ed78ae1`) with a same-day deep-review remediation (`12a322aa45`), but this packet's spec/plan/tasks docs were never updated to say so until this doc pass — only `implementation-summary.md` itself told the truth. A Round 2 pass on 2026-07-08 found and fixed a real cross-server database-path leakage defect, hardened provider persistence, and shipped an empirically-verified (not categorically-guaranteed) onnx shutdown-crash mitigation in a shared binary. Live daemon smoke (originally T017, still not executed as literally scoped) remains the one open operator-side gap — see Known Limitations.

### Remediation commit (after deep-review iter-001)

A single follow-up commit closed all three P1 advisories and three P2 cleanup items surfaced by the deep-review:

- **P1-1 → fixed.** Shipped `mcp_server/tests/embedders/shared-factory-parity.vitest.ts` with 9 cases covering MANIFESTS reference identity, `NotImplementedError` class identity, manifest-lookup parity, adapter-shape parity for the production default `jina-embeddings-v3` plus the local-cascade default `nomic-embed-text-v1.5`, `listManifests` / `listSupportedDimensions` identity, and negative cases for unknown names and the purged baseline. Tasks T011 checked.
- **P1-2 → fixed.** `INSTALL_GUIDE.md:414` now reads "Ollama → hf-local → OpenAI → Voyage probe chain (ADR-014 local-first)", matching §12.1, auto-select.ts and README.
- **P1-3 → fixed.** Hardcoded `provider: 'ollama'` in `schema.ts` replaced with `backendToProvider(manifest?.backend)` that maps `BackendKind` to `AutoSelectedEmbedderProvider` (`ollama` → `'ollama'`, `sentence-transformers` → `'hf-local'`, `api` → `'openai'`). Self-documenting and future-proof for any non-Ollama manifest added later.
- **P2-3 → fixed.** `mcp_server/lib/embedders/index.ts` barrel preamble now names `ensureActiveEmbedder()` and the `'auto'` sentinel cascade.
- **P2-4 → fixed.** Dropped `pointerNeedsResolution` from `__embedderSchemaTestables` — it had no test consumer.
- **P2-5 → fixed.** README `setActiveEmbedder` sentence now annotates the 3-arg vs 4-arg cross-skill divergence and points at `embedder-pluggability.md`.
- **P2-1 + P2-2 → kept.** Both were intentional design choices (test-mock convenience for double-persist, forward-looking documentation for `contentType`). Comments in source make the intent explicit.

Post-remediation gate:

- `@spec-kit/shared` builds clean.
- `system-skill-advisor` typecheck clean.
- Embedder vitests: **20 of 20 pass** across `registry.vitest.ts`, `schema.vitest.ts`, `ensure-active-embedder.vitest.ts` (5 cases) and the new `shared-factory-parity.vitest.ts` (9 cases).
- `validate.sh --strict` on this packet: 0 errors, 0 warnings.
- 4 shim test failures in `tests/compat/shim.vitest.ts` confirmed PRE-EXISTING (reproduced at HEAD without my changes applied) — unrelated to this work, listed in section "Known Limitations" below.

Verdict moves from CONDITIONAL to PASS (PASS-with-advisories for the P2-1 and P2-2 intentional-design notes only). Deep-review report and resource map at `review/`.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Shipped |
| **Created** | 2026-05-21 |
| **Shipped** | 2026-05-21 (original) + 2026-07-08 (Round 2 hardening) |
| **Branch** | `main` (original) / `system-speckit/028-memory-search-intelligence` (Round 2) |
| **Parent Arc** | `010-skill-advisor-embedder-stack` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Shared contract surface (Step 1)

Four new files at `.opencode/skills/system-spec-kit/shared/embeddings/`:

- `adapter.ts` — canonical `EmbedderAdapter` interface (promoted from mk-spec-memory, plus skill-advisor's wider optional `options?: EmbedderOptions` surface)
- `types.ts` — `BackendKind` enum + `EmbedderManifest` (mk-spec-memory's narrower variant, no llama-cpp, no modelPath)
- `registry.ts` — `MANIFESTS` array (7 text-tuned manifests) + `getAdapter()` / `getManifest()` / `listManifests()` / `listSupportedDimensions()` factory + `NotImplementedError`
- `adapters/ollama.ts` — `OllamaAdapter` class with the full `/api/embed` + `/api/embeddings` fallback path

Eight files converted to thin re-export shims (4 in each skill):

- `system-spec-kit/mcp_server/lib/embedders/{adapter, types, registry, adapters/ollama}.ts`
- `system-skill-advisor/mcp_server/lib/embedders/{adapter, types, registry, adapters/ollama}.ts`

### llama-cpp purge parity (Step 2)

- Deleted `system-skill-advisor/mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts`.
- Removed `embeddinggemma-300m` and `jina-embeddings-v2-base-code` manifest entries (both vanish through the shim — the shared registry never had them).
- Removed `DEFAULT_EMBEDDER_NAME` and `BASELINE_EMBEDDER_NAME` constants from the registry barrel (no longer needed once the default flips to `'auto'`).
- Updated `system-skill-advisor/mcp_server/lib/embedders/index.ts` to drop the `LlamaCppBaselineAdapter` export.
- Updated `system-skill-advisor/mcp_server/tests/embedders/registry.vitest.ts` to assert the purged manifests are NOT present (parity gate inside the test).

### contentType parameter on shared cascade (Step 3a)

- Added `EmbedderContentType = 'text' | 'code'` type alias and optional `contentType?: EmbedderContentType` field to `AutoSelectOptions` in `system-spec-kit/shared/embeddings/auto-select.ts`. Default is `'text'`.
- Documented the rationale in code: CocoIndex's code-tuned cascade lives in Python (separate registry), the TS shared cascade is text-only by design, parameter is reserved for future TS code consumers.

### `'auto'` sentinel + `ensureActiveEmbedder()` (Step 3b)

- Flipped `system-skill-advisor/mcp_server/lib/embedders/schema.ts` `DEFAULT_ACTIVE_EMBEDDER` from `{ name: 'embeddinggemma-300m', dim: 768 }` to `{ name: 'auto', dim: 0 }`.
- Added `ensureActiveEmbedder(db, options?)` helper that:
  - Reads the current pointer via `getActiveEmbedder()`.
  - Skips the cascade when the pointer is a known concrete manifest.
  - Invokes the shared `autoSelectActiveEmbedder()` cascade when the pointer is `'auto'` OR when the pointer references a manifest the shared registry no longer knows about (orphan migration from a pre-phase-007 install).
  - Persists the winner via `setActiveEmbedder(db, name, dim)`.
  - Supports test injection via an optional `autoSelect` mock.
  - Defaults the lock path to `os.tmpdir()/skill-advisor-auto-select-<digest>.lock`.

### Bootstrap wiring (Step 4)

- Updated `system-skill-advisor/mcp_server/advisor-server.ts` `main()` to call `await ensureActiveEmbedder(getSkillGraphDb(), { contentType: 'text' })` between `initSkillGraphDb()` and `startupSkillGraphScan()`.
- Errors degrade gracefully with a `console.warn`, not a process abort — the daemon stays up even if the cascade fails (semantic-shadow may degrade until the operator runs the swap runbook).
- The first scan or watcher tick after this call routes through `refreshSkillEmbeddingsViaAdapter` because `hasActiveEmbedderPointer` now returns true.

### Docs (Step 5)

- Rewrote `system-skill-advisor/INSTALL_GUIDE.md` section 12 (six subsections) to describe the new `'auto'` default, the cascade tier table, the shared registry of 7 text manifests, the content-type split rationale and the now-safe operator swap workflow.
- Updated `system-skill-advisor/README.md` pluggable-layer subsection accordingly.

### Tests

- `system-skill-advisor/mcp_server/tests/embedders/ensure-active-embedder.vitest.ts` (5 new tests) covering: auto sentinel cascade fires, concrete-pointer cascade skipped, orphan pointer migration, `contentType` parameter wiring, idempotency on second call.
- `system-skill-advisor/mcp_server/tests/embedders/registry.vitest.ts` updated to assert the shared canonical registry shape + parity gate for purged manifests.
- `system-skill-advisor/mcp_server/tests/embedders/schema.vitest.ts` updated to expect `{ name: 'auto', dim: 0 }` as the unpopulated default.

### Round 2 — Post-Ship Hardening (2026-07-08)

Three files' worth of code changes, all inside a shared code-and-infra footprint (`system-skill-advisor/mcp_server/` plus two top-level `.opencode/bin/` binaries):

**1. Provider persistence** (`lib/embedders/schema.ts` — the only production source file touched):
- `ActiveEmbedder` gains an optional `provider?: AutoSelectedEmbedderProvider` field.
- New `ACTIVE_EMBEDDER_PROVIDER_KEY` const + `ACTIVE_EMBEDDER_PROVIDERS` allow-set (`voyage`, `openai`, `ollama`, `hf-local`).
- `readActivePointerRows()` now selects the provider row too; `getActiveEmbedder()` attaches `provider` only when the stored value is a known one, otherwise omits the field entirely (tolerant read, matches mk-spec-memory's own pattern).
- `setActiveEmbedderTransactional()`/`setActiveEmbedder()` gained an optional 4th `provider` param, writing an empty-string sentinel when absent. **Correction (see `../009-embedder-onnx-hardening-round2/`):** this entry was inaccurate on two points. (1) 3 call sites inside `schema.ts` itself use the 4-arg form, not 2 — `ensureActiveEmbedder()`'s backfill branch, the cascade's `persistActiveEmbedder` callback, and the final cascade-result persist — all always passing an explicit provider value, never omitting it. (2) "remain valid unchanged" was true only in the narrow sense that 3-arg calls kept compiling; every 3-arg (provider-omitted) call site across the repo is test-only, and 009 changed what an omitted 4th arg *does*: it now preserves any already-persisted provider instead of overwriting it with the empty-string sentinel, closing a destructive-default gap this entry did not flag.
- `ensureActiveEmbedder()`'s fast path now backfills `provider` (via `backendToProvider(manifest.backend)`) and persists it when a valid pointer has no provider, without invoking the cascade; the cascade-fired path now also propagates `embedder.provider`/`result.provider` through `persistActiveEmbedder` and the final return.
- This formalizes what the May remediation's P1-3 fix only did at read time (derive-on-read, never persisted): the value is now stored, not just computed fresh on every call.

`lib/scorer/projection.ts` needed **no change** — it already prefers a real persisted `active_embedder_provider` value over derivation, so it picks up the backfilled/persisted value automatically. None of `index.ts`/`registry.ts`/`adapter.ts`/`types.ts`/`adapters/ollama.ts`/`shared/embeddings/*` were touched.

**2. FIX-A — cross-server database-path leakage** (`.opencode/bin/mk-skill-advisor-launcher.cjs`):
- Root cause, directly observed this session (not just cited from a prior audit): `readlink`/`realpath` on `.opencode/skills/system-skill-advisor/mcp_server/node_modules/@spec-kit/shared` confirms it is a symlink resolving to `.opencode/skills/system-spec-kit/shared` — mk-spec-memory's own package tree. A repo-wide grep for `--preserve-symlinks` returned zero hits, so Node's default ESM loader realpath-resolves through that symlink for every `import.meta.url` inside `shared/embeddings/factory.ts`. `resolveConfiguredDatabaseCandidates()`/`resolveSpecKitPackageRoot()` in that file are not exported, so touching it was out of scope for a launcher-boundary fix; the fix instead closes the leak at the boundary that actually controls the child's environment.
- Added `'MEMORY_DB_PATH'` to `CHILD_ENV_ALLOWLIST`. `createChildEnv()` now defaults `filtered.MEMORY_DB_PATH = advisorDbPath()` whenever the parent env doesn't already carry it — an explicit parent-provided value still wins. Exported `advisorDbPath` for testability.
- This is a genuine regression this packet's own Step 1 (promoting the shared contract surface behind that symlink) introduced, surfaced only now via the live-smoke follow-up work.

**3. FIX-B — provider-validity backfill, verify-only** (no code change beyond item 1 above): re-read `schema.ts` fresh this session and confirmed `ensureActiveEmbedder()`'s fast-path backfill (item 1) already implements exactly what a prior audit specified.

**4. Live DB repair**: `skill-graph.sqlite`'s `vec_metadata` had only `active_embedder_name`/`active_embedder_dim`, no provider row. Backed up to `skill-graph.sqlite.pre-fix-a-b-backup`, then inserted `active_embedder_provider='ollama'`. Cross-checked: `getManifest('nomic-embed-text-v1.5').backend === 'ollama'` derives `'ollama'` via `backendToProvider`, and an independent live probe of `http://127.0.0.1:11434/api/tags` confirmed Ollama is healthy with `nomic-embed-text:v1.5` pulled — the same value the corrected cascade would itself select at Tier 1.

**5. Onnx shutdown-crash mitigation** (`.opencode/bin/hf-model-server.cjs` — a shared binary at `.opencode/bin/`, used by both skills' cascades at the `hf-local` tier, not local to skill-advisor):
- `shutdown(signal)`: replaced both `process.exit(0)`/`process.exit(1)` with `process.exitCode = 0/1` + natural return, plus an `.unref()`'d 1500ms `SIGKILL` failsafe timer armed before `app.close()`.
- Top-level `main().catch()`: same `process.exitCode = 1` + failsafe-timer pattern, since a startup failure can occur after the native module has already partially initialized global state.
- `getOptimalDevice()`: drops the darwin `'mps'` branch, returns `'cpu'` unconditionally — transformers.js never emits a darwin GPU execution provider, so the branch was pure wasted work with zero behavior risk.
- Rationale: onnxruntime-node's native module holds global static state (its ORT Env/thread-pool singleton). Calling `process.exit()` forces `node::Environment::Exit()` to tear that down mid-microtask, which can abort inside the native module's C++ static destructors. `process.exitCode` + a natural event-loop drain is the documented Node.js pattern for native addons with global state.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five ordered steps per the approved plan, with verification between each:

1. **Step 1 — shared contract surface + shims**: copy → convert → typecheck both skills. PASSED.
2. **Step 2 — llama-cpp purge**: delete adapter + manifest entries + update barrel + update tests. PASSED.
3. **Step 3 — cascade integration**: `contentType` param + `ensureActiveEmbedder()` + 5 new vitests. PASSED (11/11 embedder tests).
4. **Step 4 — bootstrap wiring**: `advisor-server.ts` calls `ensureActiveEmbedder()` at startup. Typecheck PASSED.
5. **Step 5 — docs + parity grep**: INSTALL_GUIDE section 12 rewritten + README updated. Parity grep shows only legitimate explanatory comments + parity assertions, no runtime refs.

Final end-to-end gate:

- Shared workspace builds clean.
- Both skills typecheck + build clean.
- Skill-advisor vitests: **415 passed, 7 skipped, 3 pre-existing failures unrelated to this work** (missing plugin path, renamed spec folders in lane-weight-sweep, playbook corpus drift in manual-testing-playbook).
- `validate.sh --strict` on this packet: PASSED with 0 errors, 0 warnings.

### Round 2 delivery (2026-07-08)

1. **Provider persistence + FIX-B verification**: edited `schema.ts`, added/updated 3 vitest cases. `npm run typecheck` clean, `npm run build` clean, `npx vitest run tests/embedders/` 23/23 PASSED.
2. **FIX-A**: edited `mk-skill-advisor-launcher.cjs`, updated 3 + added 2 `launcher-bootstrap.vitest.ts` cases. All 5 launcher vitest suites PASSED (43/43, re-verified in this doc pass).
3. **Live DB repair**: backed up then hand-repaired `skill-graph.sqlite`'s missing provider row; cross-checked two independent ways (manifest-backend derivation + live Ollama health probe).
4. **Onnx mitigation**: edited `hf-model-server.cjs`. `node --check` clean; existing `hf-model-server.vitest.ts` (`system-spec-kit/mcp_server`, 18/18, unmodified) re-confirmed. Live A/B reproduction by the implementing session: 10/10 `SIGABRT` on unpatched code, 25/25 clean exits on patched code, under an identical spawn -> health-check -> embed -> shutdown drill; also exercised the `main().catch()` startup-failure path (forced `EADDRINUSE`) and `SIGINT` — both clean.
5. **Regression isolation**: this doc pass (2026-07-08) ran the full `npm run test` in `system-skill-advisor/mcp_server` — 670 passed / 17 failed / 1 expected fail / 7 skipped (695 total). All 17 failures cluster in routing/scorer-corpus parity (`tests/parity/*`, `tests/legacy/*`, `tests/scorer/*`) and `advisor-graph-health` metadata drift, none touching embedders or the launcher. 2 representative failures were stash-isolated (this phase's 6 files stashed, same 2 test files re-run against the unmodified tree) and reproduced identically, confirming pre-existing/concurrent-session drift rather than a regression from this work. The other 15 were not individually isolated. This 17-failure count is higher than either of the implementing session's own reports (which separately claimed 11 failures) — consistent with continued drift on this branch from an unrelated, large, mid-flight `deep-loop-runtime` -> `deep-loop-workflows` -> `system-deep-loop` rename observed in the working tree during this doc pass, not something Round 2's 6 files caused.
6. **Daemon restart**: at various points during Round 2, no skill-advisor daemon was running (`ps aux` checked), so there was nothing to restart — the next cold start picks up the new `dist/` automatically. By the time this doc pass ran, a daemon *was* running (started by an unrelated concurrent session/tool warm-start, per its process start time following the `dist/` rebuild); this was observed but not independently used to re-verify live cascade/pointer behavior in this doc pass.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

### D-001 — Override scaffold's CodeRankEmbed target

The original scaffold named `sbert/nomic-ai/CodeRankEmbed` as the alignment target. This is CocoIndex's code-tuned default. Skill-advisor indexes prose skill metadata, so the right target is the text-tuned model. Operator directive ("mk-spec-memory is most recently updated") confirmed the alignment is to mk-spec-memory's actual current state, which uses the `'auto'` sentinel + cascade landing on `nomic-embed-text-v1.5` in local-only environments.

### D-002 — Shim-based extraction (not in-place move)

Both skills' local `mcp_server/lib/embedders/{adapter, types, registry, adapters/ollama}.ts` files were converted to thin `export * from '@spec-kit/shared/embeddings/...'` re-export shims rather than deleted entirely. This preserves all existing relative-path imports inside each skill without forcing a broad import-path migration.

### D-003 — Promote skill-advisor's wider EmbedderAdapter interface

The shared interface adopts skill-advisor's wider `embed(texts, options?)` signature (with optional `EmbedderOptions` containing `inputType`) instead of mk-spec-memory's narrower `embed(texts)`. The wider signature is backward-compatible with all existing callers and matches what mk-spec-memory's concrete `OllamaAdapter` already accepts.

### D-004 — Defer legacy BLOB column removal to 003 follow-up #3

The `skill_nodes.embedding` BLOB column stays in place. The phase 004 dispatcher routes new writes to `vec_<active.dim>` when a pointer is set, falling back to the legacy column when no pointer exists. Removing the legacy column safely requires production confirmation that no installation still uses the legacy path; that confirmation is the prerequisite for 003 follow-up #3.

### D-005 — contentType parameter is forward-looking documentation, not behaviour change

The shared `auto-select.ts` cascade is text-tuned by design (Voyage/OpenAI/Ollama/hf-local probe chain returns text models even though `voyage-code-3` is technically code-tuned). The `contentType` parameter is added to the API surface but does not branch cascade behaviour today. CocoIndex's code-tuned cascade stays in Python and is out of scope. A future TS code consumer would either parametrise the cascade further or add a separate `CODE_MANIFESTS` registry.

### D-006 (Round 2) — Persist provider via a real column, not just derive-on-read

The May remediation (P1-3) fixed the "always claims `provider: 'ollama'`" lie by deriving from the manifest at read time, but never persisted the result — every call repeated the derivation and `setActiveEmbedder()` stayed 3-arg only. Round 2 makes provider a first-class persisted field (4th `setActiveEmbedder` arg, backfilled once on first `ensureActiveEmbedder()` call for pre-existing pointers) so future reads are O(1) lookups, not re-derivations, and the schema genuinely tracks what the cascade picked rather than reconstructing a guess every time.

### D-007 (Round 2) — Close the DB-path leak at the launcher boundary, not inside `factory.ts`

`shared/embeddings/factory.ts`'s path-resolution functions are not exported and touching shared code was out of scope for what is fundamentally a launcher spawn-environment bug. The launcher already owns "what environment does the child process see" — pinning `MEMORY_DB_PATH` there is the minimal, correctly-scoped fix. It also means the fix protects skill-advisor regardless of how `factory.ts`'s internal resolution logic evolves.

### D-008 (Round 2) — Frame the onnx fix as a mitigation, not a categorical guarantee

The fix removes the one specific, empirically-reproduced trigger this repo controls (forced `process.exit()` while onnxruntime-node's native module holds global static state). It is not a claim that onnxruntime-node's C++ static destructors can never abort under any exit path whatsoever — an `abort()` inside a native static destructor genuinely cannot be caught from JS, and that remains true after this fix. The spec's Round 2 Requirements/Success Criteria state this distinction explicitly so the fix is not later cited as a broader guarantee than what was actually verified.

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

```bash
# Workspace integrity (PASSED)
npm --prefix .opencode/skills/system-spec-kit/shared run build
npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck
npm --prefix .opencode/skills/system-spec-kit/mcp_server run build
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build

# Embedder vitests (PASSED, 11/11)
cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest run tests/embedders/

# Parity gate (only explanatory comments + parity assertions remain)
git grep -l 'llama-cpp\|LlamaCppProvider\|embeddinggemma' .opencode/skills/system-skill-advisor/

# Spec validation (PASSED, 0 errors, 0 warnings)
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory \
  --strict
```

Live daemon smoke (pending operator action):

1. Cold daemon restart with no `vec_metadata` rows.
2. Observe pointer flip via `sqlite3 skill-graph.sqlite "SELECT key, value FROM vec_metadata"` — expect `nomic-embed-text-v1.5` and `768`.
3. Trigger a scan via `mcp__mk_skill_advisor__advisor_recommend` and confirm `vec_768` row count matches indexed-skills count.
4. Semantic-shadow probe with three queries (`"memory save"`, `"code search"`, `"spec folder"`); confirm sane top-3.

### Round 2 Verification (2026-07-08)

Independently re-verified in this documentation pass (not just transcribed from the implementing session's reports):

```bash
# Diffs read and confirmed against HEAD (all match the reports' claims)
git diff HEAD -- .opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts
git diff HEAD -- .opencode/bin/mk-skill-advisor-launcher.cjs
git diff HEAD -- .opencode/bin/hf-model-server.cjs
git status --short -- .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/   # empty — confirmed untouched

# Typecheck + build (both PASSED, clean)
cd .opencode/skills/system-skill-advisor/mcp_server
npm run typecheck
npm run build

# Targeted embedder + launcher-bootstrap suites (PASSED, 37/37)
npx vitest run tests/embedders/ tests/launcher-bootstrap.vitest.ts

# All 5 launcher suites (PASSED, 43/43 — see spec.md SC-007 for the "66/66 vs 43/43" note)
npx vitest run tests/launcher-bootstrap.vitest.ts tests/launcher-idle-timeout.vitest.ts \
  tests/launcher-lease.vitest.ts tests/launcher-reap-pid-reuse.vitest.ts \
  tests/skill-advisor-launcher-orphan-reaping.vitest.ts

# Full suite (670 passed / 17 failed / 1 expected fail / 7 skipped — see Known Limitations)
npm run test

# Stash-isolation spot-check (2 of 17 failures confirmed pre-existing/unrelated)
git stash push -- lib/embedders/schema.ts .opencode/bin/mk-skill-advisor-launcher.cjs \
  .opencode/bin/hf-model-server.cjs tests/embedders/schema.vitest.ts \
  tests/embedders/ensure-active-embedder.vitest.ts tests/launcher-bootstrap.vitest.ts
npx vitest run tests/scorer/ambiguity-slice.vitest.ts tests/legacy/advisor-graph-health.vitest.ts
# -> same 3 failures reproduce without this packet's changes
git stash pop

# Shared hf-model-server suite, lives under system-spec-kit not system-skill-advisor
cd ../../system-spec-kit/mcp_server
npx vitest run tests/embedders/hf-model-server.vitest.ts   # PASSED, 18/18

# Live DB state (PASSED — provider row present and correct)
sqlite3 .opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite \
  "SELECT key, value FROM vec_metadata WHERE key LIKE 'active_embedder%'"
# -> active_embedder_name|nomic-embed-text-v1.5
#    active_embedder_dim|768
#    active_embedder_provider|ollama

# Backup-file gitignore claim (CORRECTED — the report's "gitignored" claim does not hold)
git check-ignore -v .opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite.pre-fix-a-b-backup
# -> exit 1, no match: the file is untracked, not gitignored
```

Not independently re-run in this doc pass: the onnx crash live A/B (10/10 SIGABRT before / 25/25 clean after) and the daemon-restart claim. Both are taken on the implementing session's own report, which included concrete reproducible evidence (exit codes, `.ips` crash-report cross-checks) rather than an assertion.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Legacy `skill_nodes.embedding` BLOB column stays.** Removal is 003 follow-up #3, deferred until production confirms no consumer still uses the legacy path.
2. **`contentType` parameter does not branch behaviour today.** Reserved for a future TS code consumer.
3. **Live daemon smoke not yet collected on this machine.** The end-to-end gate confirms typecheck + build + vitest + strict-validate; the operator-side smoke remains as the next step. Still true as of Round 2 (2026-07-08) — see item 5 below for what was actually done instead.
4. **Pre-existing vitest failures inherited.** None are caused by this work (confirmed by reproducing on HEAD~ without the remediation applied):
   - `tests/skill-graph-diagnostic-redaction.vitest.ts` references a missing plugin file path.
   - `tests/scorer/lane-weight-sweep.vitest.ts` references renamed spec folders.
   - `tests/manual-testing-playbook.vitest.ts` has corpus drift (`24-scenario` vs the live 45-scenario corpus).
   - `tests/compat/shim.vitest.ts` (4 of 8 cases) returns exit 2 for `--force-native` cases because the test's expected database state has drifted (the test corpus expects specific top-3 skills that the live `skill-graph.sqlite` no longer surfaces under the current scorer weights). All 4 cases that don't use `--force-native` continue to pass. Confirmed pre-existing at HEAD by stashing remediation and re-running. Belongs in a separate test-stabilisation packet.

### Round 2 Known Limitations (2026-07-08)

5. **T017 (live daemon smoke) still not executed as originally scoped.** The Round 2 "live DB repair" (item 4 under "What Was Built") was a manual `sqlite3` INSERT cross-checked against manifest derivation + an independent Ollama health probe — not an observed cold-start cascade run against a clean database. A true cold-daemon-start-through-cascade-pick observation remains the operator's next step.
6. **The onnx shutdown-crash fix is a mitigation, not a categorical guarantee** (see D-008). It removes the one specific, empirically-reproduced trigger (`process.exit()` while onnxruntime-node native state is loaded); it does not and cannot prove no C++ static-destructor abort can ever occur under any exit path.
7. **The full regression suite carries 17 failures on this branch as of this doc pass (2026-07-08)**, up from the 11 either individual Round 2 report claimed. All cluster in routing/scorer-corpus parity (`tests/parity/*`, `tests/legacy/*`, `tests/scorer/*`) and `advisor-graph-health` metadata drift — none touch embedders or the launcher. 2 of the 17 were stash-isolated in this doc pass and reproduce identically without this packet's changes (a large, unrelated, mid-flight `deep-loop-runtime` -> `deep-loop-workflows` -> `system-deep-loop` rename is active in this working tree, consistent with the active-goal memory note about a live advisor-TS/scorer lane in progress on this branch). The remaining 15 were not individually stash-isolated in this doc pass.
8. **`skill-graph.sqlite.pre-fix-a-b-backup` is not actually gitignored**, contrary to the implementing session's own report. `git check-ignore -v` finds no match against `.gitignore`'s `*.sqlite`/`*.sqlite-*`/`*.sqlite.bak*` patterns (none match a `.pre-fix-a-b-backup` suffix). It currently sits as an untracked file in the database directory (`git status` shows `??`). Recommend the operator add an explicit `.gitignore` line or delete it once the fix is confirmed stable.
9. **Launcher-suite pass count discrepancy.** The implementing session's report claimed "66/66" across `launcher-bootstrap.vitest.ts` + 4 sibling suites; this doc pass independently ran the same 5 files and got 43/43. The discrepancy was not chased down further (possible causes: a different/larger file set, or `it.each` parameterization differences not investigated here) — 43/43 is what this doc pass directly reproduced and is the number cited elsewhere in this packet.

<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

> Link depth corrected in this doc pass (2026-07-08) — the packet was re-nested from `system-spec-kit/026-.../013-.../003-skill-advisor-stack/006-.../` to `system-skill-advisor/010-skill-advisor-embedder-stack/005-.../` at some point after these links were written, and they were never updated to the new (shallower) depth. Verified against the real filesystem in this pass.

- Shared host: [`@spec-kit/shared/embeddings/`](../../../../skills/system-spec-kit/shared/embeddings/)
- Shared cascade: [`auto-select.ts`](../../../../skills/system-spec-kit/shared/embeddings/auto-select.ts)
- Bootstrap wiring: [`advisor-server.ts`](../../../../skills/system-skill-advisor/mcp_server/advisor-server.ts) (`ensureActiveEmbedder` call between `initSkillGraphDb` and `startupSkillGraphScan`)
- Docs: [`system-skill-advisor/INSTALL_GUIDE.md` §12](../../../../skills/system-skill-advisor/INSTALL_GUIDE.md)
- Predecessor (writer cross-wire): `../004-skill-graph-db-writer-cross-wire/`
- Sibling follow-ups: [`../FOLLOW-UPS.md`](../FOLLOW-UPS.md) (this work closes #1 shared-factory, partially closes #2 production active pointer — note: `FOLLOW-UPS.md` itself still cites the pre-re-nest spec-folder path and was not updated in this pass, out of scope for this packet's own docs)
- Round 2 (2026-07-08): [`mk-skill-advisor-launcher.cjs`](../../../../bin/mk-skill-advisor-launcher.cjs) (FIX-A), [`hf-model-server.cjs`](../../../../bin/hf-model-server.cjs) (onnx shutdown-crash mitigation), [`schema.ts`](../../../../skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts) (provider persistence)
<!-- /ANCHOR:cross-refs -->
