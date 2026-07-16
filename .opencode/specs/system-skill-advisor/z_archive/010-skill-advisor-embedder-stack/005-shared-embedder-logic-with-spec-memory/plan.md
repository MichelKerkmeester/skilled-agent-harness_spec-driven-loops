---
title: "Plan: shared embedder logic with spec-memory [template:level_2/plan.md]"
description: "Plan to remove skill-advisor/spec-memory embedder factory drift, plus the 2026-07-08 Round 2 post-ship hardening pass."
trigger_phrases:
  - "shared embedder logic skill-advisor"
  - "skill-advisor spec-memory embedder parity"
  - "active embedder provider persistence"
  - "MEMORY_DB_PATH cross-server leakage"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/010-skill-advisor-embedder-stack/005-shared-embedder-logic-with-spec-memory"
    last_updated_at: "2026-07-08T06:58:48Z"
    last_updated_by: "claude"
    recent_action: "Retro-documented Round 2 (2026-07-08) hardening phase; bumped Level 1 -> 2"
    next_safe_action: "Operator: run the true production swap-runbook + cold-daemon live-smoke"
    blockers: []
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: shared embedder logic with spec-memory

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Extract one shared embedder factory contract and make skill-advisor use it, with a parity regression as the guardrail.

| Phase | Focus | Output |
|-------|-------|--------|
| A | Confirm predecessor evidence and target files | Implementation starts from the cited source lines and current code |
| B | Implement scoped changes | Source and tests updated only for this packet's requirements |
| C | Run focused verification | Unit/integration/perf evidence captured in the packet |
| D | Closeout | Strict-validate packet and update implementation summary |
| E (Round 2, 2026-07-08) | Post-ship hardening: provider persistence, cross-server DB-path leakage fix, onnx shutdown-crash mitigation | 3 fixes shipped, live DB repaired, full regression re-run |

**Note:** the original Quality Gates row below cites a stale pre-re-nest path (`system-spec-kit/026-.../003-skill-advisor-stack/006-...`) left over from before this packet moved to `system-skill-advisor/007-.../005-...`. The correct current command is the one this doc pass actually ran — see the end of §2.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- All P0 requirements in `spec.md` have direct test or command evidence.
- The focused test command for this packet exits 0.
- No production data, runtime DB, or operator-local config is changed without an explicit operator step.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-skill-advisor/010-skill-advisor-embedder-stack/005-shared-embedder-logic-with-spec-memory --strict` exits 0 (current path, post re-nest; the path this doc pass actually validated against).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The shared contract surface (`adapter.ts`, `types.ts`, `registry.ts`, `adapters/ollama.ts`) lives at `.opencode/skills/system-spec-kit/shared/embeddings/`. mk-spec-memory's versions are the canonical source per the operator directive ("mk-spec-memory is most recently updated"). Both skills' local `mcp_server/lib/embedders/` files become thin re-export shims so existing relative-path imports inside each skill continue to resolve. Skill-advisor's `schema.ts` stays local because it integrates with `skill-graph.sqlite` (distinct from mk-spec-memory's database).

The shared `auto-select.ts` cascade already exists with file-based locking. This work adds a `contentType: 'text' \| 'code'` parameter defaulting to `'text'`. CocoIndex stays in Python with its own code-tuned registry — the parameter preserves the text/code split conceptually even though there is no TS code consumer today.

The parity test exercises both public skill surfaces (mk-spec-memory's embedder and skill-advisor's embedder via the same shared registry). It asserts identical Float32Array values for the same input, proving the registry behaves the same across consumers.

### Round 2 Architecture Notes (2026-07-08)

- **Provider persistence** stays inside `schema.ts`'s existing `vec_metadata` key-value table (adds one more row, `active_embedder_provider`) rather than a new column/table — consistent with how `active_embedder_name`/`active_embedder_dim` already work.
- **The DB-path leakage was a direct side effect of this packet's own Step 1.** Promoting the shared contract surface to `.opencode/skills/system-spec-kit/shared/embeddings/` and re-exporting it through `node_modules/@spec-kit/shared` (a symlink into `system-spec-kit/shared`) meant any code inside `factory.ts` that resolves paths relative to its own `import.meta.url` now realpath-resolves through that symlink into mk-spec-memory's package root when Node's default (non-`--preserve-symlinks`) ESM loader runs. The launcher fix does not touch `factory.ts` itself (that file's `resolveConfiguredDatabaseCandidates()`/`resolveSpecKitPackageRoot()` are not exported, and touching shared code was out of scope for a launcher-boundary fix) — it closes the leak at the boundary that actually controls it: the child process's own environment.
- **The onnx fix is scoped to `hf-model-server.cjs` only** (a shared binary at `.opencode/bin/`, used by both skills' cascades at the `hf-local` tier). It does not touch onnxruntime-node itself or `@huggingface/transformers`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A - Discovery

1. Re-read predecessor packet and source files named in `spec.md`.
2. Confirm current line numbers before editing.
3. Identify the smallest test surface that proves the change.

### Phase B - Implementation

1. **Step 1**: Copy `adapter.ts`, `types.ts`, `registry.ts`, `adapters/ollama.ts` from `system-spec-kit/mcp_server/lib/embedders/` to `system-spec-kit/shared/embeddings/`. Promote skill-advisor's wider `EmbedderAdapter` interface (with optional `options?: EmbedderOptions`) since it is backward-compatible with mk-spec-memory's narrower interface. Convert both skills' local files to thin re-export shims.
2. **Step 2**: Delete `system-skill-advisor/mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts`. Remove `embeddinggemma-300m` manifest entry from skill-advisor's local overrides (it should disappear entirely since Step 3 flips the default to `'auto'`).
3. **Step 3**: Add `contentType: 'text' \| 'code'` parameter to shared `auto-select.ts` (default `'text'`, no behaviour change for mk-spec-memory). Flip skill-advisor's `DEFAULT_ACTIVE_EMBEDDER` from `embeddinggemma-300m` to `{ name: 'auto', dim: 0 }`. Add `ensureActiveEmbedder(db, { contentType: 'text' })` helper that calls the shared cascade and persists the winner via existing `setActiveEmbedder()`.
4. **Step 4**: Wire skill-advisor daemon bootstrap (`advisor-server.ts`) to call `ensureActiveEmbedder()` before first read/write. Trigger one-shot `refreshSkillEmbeddings()` after pointer flip (already routes via dispatcher from phase 004).
5. **Step 5**: Update skill-advisor `INSTALL_GUIDE.md` section 12 (all subsections) and `README.md` pluggable-layer subsection to reflect the shared registry and `'auto'` sentinel default. Final parity grep across skill-advisor tree for `embeddinggemma` and `llama-cpp`.
6. Add cross-skill embedding parity regression and `ensureActiveEmbedder` cascade tests.

### Phase C - Verification

1. Run spec-memory embedder registry tests.
2. Run skill-advisor embedder/scorer tests.
3. Run the new parity regression.

### Phase D - Closeout

1. Update `implementation-summary.md` from PRE-IMPLEMENTATION to the actual result.
2. Run strict validation on this packet.
3. Preserve any operator-side blockers in the summary.

### Phase E - Round 2: Post-Ship Hardening (2026-07-08)

1. **Provider persistence**: add `ACTIVE_EMBEDDER_PROVIDER_KEY`/allow-set to `schema.ts`; widen `setActiveEmbedder` to 4 args (all existing 3-arg call sites stay valid, `provider` optional); `getActiveEmbedder()` returns `provider` only when it is a known value; `ensureActiveEmbedder()` backfills provider on a valid pointer with no provider row, without invoking the cascade. 2 new + 1 new + 5 updated tests.
2. **FIX-A — cross-server DB leakage**: add `MEMORY_DB_PATH` to `mk-skill-advisor-launcher.cjs`'s `CHILD_ENV_ALLOWLIST`; `createChildEnv()` defaults it to `advisorDbPath()` when the parent doesn't already set it; export `advisorDbPath` for testability. 2 new + 3 updated `launcher-bootstrap.vitest.ts` tests.
3. **FIX-B — verify provider-validity backfill** (no code change): re-read `schema.ts` fresh and confirm the `ensureActiveEmbedder()` backfill from step 1 above already implements what a prior audit specified. Live-repair `skill-graph.sqlite`'s `vec_metadata` (was missing the `active_embedder_provider` row entirely): back up to `skill-graph.sqlite.pre-fix-a-b-backup`, insert `active_embedder_provider='ollama'`, cross-check against `getManifest('nomic-embed-text-v1.5').backend` and an independent live probe of `http://127.0.0.1:11434/api/tags`.
4. **Onnx shutdown-crash mitigation**: replace `process.exit()` with `process.exitCode` + an unref'd 1500ms `SIGKILL` failsafe in `hf-model-server.cjs`'s `shutdown()` and top-level `main().catch()`; drop the dead darwin `'mps'` branch from `getOptimalDevice()`. Verify via live A/B (stash/pop the fix, run an identical spawn -> health-check -> embed -> shutdown drill 10x against the old code, 25x against the fixed code).
5. Re-run the full regression suite; isolate any pre-existing/concurrent-drift failures by stashing this phase's changes and re-running the same failing files against the unmodified tree.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `npm test` or targeted vitest for system-spec-kit embedder registry.
- Targeted vitest for system-skill-advisor embedders and scorer smoke.
- New parity test that compares vectors for identical input.
- Round 2: `npx vitest run tests/embedders/` (23/23) + `tests/launcher-bootstrap.vitest.ts` and its 4 sibling launcher suites (43/43, verified in this doc pass) + `system-spec-kit/mcp_server`'s `tests/embedders/hf-model-server.vitest.ts` (18/18, unmodified, re-confirmed) + full `npm run test` in `system-skill-advisor/mcp_server` with pre-existing/concurrent-drift failures isolated via `git stash`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Current spec-memory embedder registry/factory modules.
- Skill-advisor embedders and skill-graph DB code.
- Shared package path resolution between the two skills.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

1. Restore skill-advisor default registry to its prior implementation.
2. Remove the shared-factory parity test if shared extraction is reverted.
3. Leave documented decision notes in this packet summary.

### Round 2 Rollback (2026-07-08)

1. Code: `git checkout` the 6 changed files (`schema.ts`, `schema.vitest.ts`, `ensure-active-embedder.vitest.ts`, `mk-skill-advisor-launcher.cjs`, `launcher-bootstrap.vitest.ts`, `hf-model-server.cjs`).
2. Live DB: `cp skill-graph.sqlite.pre-fix-a-b-backup skill-graph.sqlite` (safe with no daemon running; stop the daemon first if one is live).
<!-- /ANCHOR:rollback -->
