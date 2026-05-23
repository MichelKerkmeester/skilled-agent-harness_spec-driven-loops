---
title: "Implementation Summary: shared embedder logic with spec-memory"
description: "Shipped phase 003/006: shared embedder contract surface, llama-cpp purge parity, 'auto' sentinel default with content-type-aware cascade, bootstrap wiring."
trigger_phrases:
  - "shared embedder logic skill-advisor"
  - "skill-advisor spec-memory embedder parity"
  - "auto sentinel default"
  - "nomic-embed-text-v1.5 default"
  - "content-type aware cascade"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory"
    last_updated_at: "2026-05-21T17:37:00Z"
    last_updated_by: "main_agent"
    recent_action: "Shipped phase 003/006: shared embedder contract surface + 'auto' cascade + llama-cpp purge"
    next_safe_action: "Live daemon smoke (cold start, observe pointer flip, semantic-shadow probe)"
    blockers: []
    completion_pct: 95
---
# Implementation Summary: shared embedder logic with spec-memory

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

> **Status: SHIPPED (with remediation).** Code, tests, docs and strict validation complete after the deep-review remediation commit. Live daemon smoke remains as the final operator-side check.

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
| **Level** | 1 |
| **Status** | Shipped |
| **Created** | 2026-05-21 |
| **Shipped** | 2026-05-21 |
| **Branch** | `main` |
| **Parent Arc** | `003-skill-advisor-stack` |
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

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Legacy `skill_nodes.embedding` BLOB column stays.** Removal is 003 follow-up #3, deferred until production confirms no consumer still uses the legacy path.
2. **`contentType` parameter does not branch behaviour today.** Reserved for a future TS code consumer.
3. **Live daemon smoke not yet collected on this machine.** The end-to-end gate confirms typecheck + build + vitest + strict-validate; the operator-side smoke remains as the next step.
4. **Pre-existing vitest failures inherited.** None are caused by this work (confirmed by reproducing on HEAD~ without the remediation applied):
   - `tests/skill-graph-diagnostic-redaction.vitest.ts` references a missing plugin file path.
   - `tests/scorer/lane-weight-sweep.vitest.ts` references renamed spec folders.
   - `tests/manual-testing-playbook.vitest.ts` has corpus drift (`24-scenario` vs the live 45-scenario corpus).
   - `tests/compat/shim.vitest.ts` (4 of 8 cases) returns exit 2 for `--force-native` cases because the test's expected database state has drifted (the test corpus expects specific top-3 skills that the live `skill-graph.sqlite` no longer surfaces under the current scorer weights). All 4 cases that don't use `--force-native` continue to pass. Confirmed pre-existing at HEAD by stashing remediation and re-running. Belongs in a separate test-stabilisation packet.

<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Shared host: [`@spec-kit/shared/embeddings/`](../../../../../../../skills/system-spec-kit/shared/embeddings/)
- Shared cascade: [`auto-select.ts`](../../../../../../../skills/system-spec-kit/shared/embeddings/auto-select.ts)
- Bootstrap wiring: [`advisor-server.ts`](../../../../../../../skills/system-skill-advisor/mcp_server/advisor-server.ts) (`ensureActiveEmbedder` call between `initSkillGraphDb` and `startupSkillGraphScan`)
- Docs: [`system-skill-advisor/INSTALL_GUIDE.md` §12](../../../../../../../skills/system-skill-advisor/INSTALL_GUIDE.md)
- Predecessor (writer cross-wire): `../004-skill-graph-db-writer-cross-wire/`
- Sibling follow-ups: `003-skill-advisor-stack/FOLLOW-UPS.md` (this work closes #1 shared-factory, partially closes #2 production active pointer)
<!-- /ANCHOR:cross-refs -->
