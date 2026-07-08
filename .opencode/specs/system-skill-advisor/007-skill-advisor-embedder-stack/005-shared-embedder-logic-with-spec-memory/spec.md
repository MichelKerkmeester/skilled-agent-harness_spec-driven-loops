---
title: "Spec: shared embedder logic with spec-memory [template:level_2/spec.md]"
description: "Refactor packet that made skill-advisor consume the same shared embedder factory and default embedder infrastructure as mk-spec-memory/spec-memory, plus a 2026-07-08 Round 2 hardening pass (provider persistence, cross-server DB-path leakage fix, onnx shutdown-crash mitigation)."
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
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/007-skill-advisor-embedder-stack/005-shared-embedder-logic-with-spec-memory"
    last_updated_at: "2026-07-08T06:58:48Z"
    last_updated_by: "claude"
    recent_action: "Retro-documented Round 2 hardening; bumped Level 1 to 2"
    next_safe_action: "Operator: run the true production swap-runbook + cold-daemon live-smoke"
    blockers: []
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Spec: shared embedder logic with spec-memory

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Shipped |
| **Created** | 2026-05-21 |
| **Shipped** | 2026-05-21 (original) + 2026-07-08 (Round 2 hardening) |
| **Branch** | `main` (original) / `system-speckit/028-memory-search-intelligence` (Round 2) |
| **Parent Arc** | `007-skill-advisor-embedder-stack` |
| **Predecessor** | `007-skill-advisor-embedder-stack/001-pluggable-architecture/` through `004-skill-graph-db-writer-cross-wire/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Skill-advisor and mk-spec-memory currently have separate embedder registries with competing defaults and parallel factory implementations. The operator decision is to remove that drift by making skill-advisor consume the same shared embedder contract surface as mk-spec-memory. The alignment target is mk-spec-memory's current state (`'auto'` sentinel that triggers a content-type-aware cascade landing on `nomic-embed-text-v1.5` in local-only environments). The original scaffold mentioned `sbert/nomic-ai/CodeRankEmbed` — that target is overridden because (a) CodeRankEmbed is code-tuned and skill-advisor indexes prose skill metadata, (b) mk-spec-memory is the "most recently updated" canonical source and its cascade lands on text-tuned `nomic-embed-text-v1.5`.

### Purpose

Promote the canonical adapter contract surface (interface, types, registry, Ollama adapter) from mk-spec-memory's `mcp_server/lib/embedders/` to the already-existing shared host at `.opencode/skills/system-spec-kit/shared/embeddings/`. Both skills become thin consumers via re-export shims. Add a `contentType: 'text' | 'code'` parameter to the shared auto-select cascade so the CocoIndex (code) vs mk-spec-memory/skill-advisor (text) split stays explicit and future-proof.

### Round 2 — Post-Ship Hardening (2026-07-08)

The original 5-step plan shipped 2026-05-21 (commit `5d1ed78ae`) and a same-day deep-review remediation commit (`12a322aa45`) closed the review's 3 P1s, but this packet's docs were never updated afterward — `spec.md` still said "Planned", `tasks.md` had every Phase 2/3 row unchecked, and `implementation-summary.md` was the only doc telling the truth. Separately, T017 (live daemon smoke) was never executed. A follow-up session on 2026-07-08 picked that up and, while doing so, found and fixed two real defects plus hardened one edge the May remediation had only partially closed:

1. **Provider persistence** (extends P1-3's May fix): the May remediation derived `provider` from the manifest at *read* time but never persisted it, so every read repeated the derivation and `setActiveEmbedder()` stayed 3-arg only. Round 2 adds a real `active_embedder_provider` column, a 4-arg `setActiveEmbedder(db, name, dim, provider)`, and a one-time backfill inside `ensureActiveEmbedder()` for pointers written before the column existed.
2. **Cross-server database leakage (new defect, found via live-smoke investigation)**: `mk-skill-advisor-launcher.cjs` spawned the advisor child with no `MEMORY_DB_PATH`, so `shared/embeddings/factory.ts`'s `resolveConfiguredDatabaseCandidates()` fell back to walking up from its own on-disk realpath — which resolves *through* the `@spec-kit/shared` symlink this packet's own Step 1 created, landing on mk-spec-memory's database instead of skill-advisor's own `skill-graph.sqlite`. This is a genuine regression surfaced by this packet's shim architecture, not a pre-existing bug.
3. **hf-model-server.cjs onnx shutdown-crash mitigation (adjacent infra, Tier-2 `hf-local` of the cascade)**: `process.exit()` in the shutdown path and the top-level `main().catch()` forced Node's exit sequence while onnxruntime-node's native module held global static state, which could abort the process (`SIGABRT`) mid-teardown. Replaced with `process.exitCode` + a natural event-loop drain and an unref'd `SIGKILL` failsafe. **This is an empirically-verified mitigation for the one specific trigger this repo controls (10/10 reproduced `SIGABRT` before, 25/25 clean exits after, live A/B in this environment), not a categorical guarantee that onnxruntime-node's native static destructors can never abort under any exit path** — a C++ `abort()` inside a static destructor cannot be caught from JS. See Round 2 Requirements/Success Criteria below for the honest scope of what this closes.

### Content-Type Constraint

CocoIndex uses code embedders (Python, separate registry at `cocoindex_code/embedders/registered_embedders.py`). mk-spec-memory and skill-advisor use text embedders (TypeScript, shared registry). The TS shared cascade is text-only by design. CocoIndex stays in Python and is out of scope. The content-type difference must stay possible after this work — the shared cascade gains a `contentType` parameter defaulting to `'text'` so existing callers stay working.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Promote canonical contract surface (`adapter.ts`, `types.ts`, `registry.ts`, `adapters/ollama.ts`) from mk-spec-memory to `.opencode/skills/system-spec-kit/shared/embeddings/`.
- Convert both skills' local `mcp_server/lib/embedders/{adapter,types,registry,adapters/ollama}.ts` to thin re-export shims so existing relative-path imports keep working.
- Delete skill-advisor's `adapters/llama-cpp-baseline.ts` (parity with mk-spec-memory's phase 007 purge).
- Flip skill-advisor's `DEFAULT_ACTIVE_EMBEDDER` from `embeddinggemma-300m` to `'auto'` sentinel.
- Add `ensureActiveEmbedder()` helper to skill-advisor mirroring mk-spec-memory's pattern; call into the existing shared `auto-select.ts` cascade (file-based lock prevents concurrent runs).
- Add optional `contentType: 'text' | 'code'` parameter to shared `auto-select.ts` (default `'text'`). Both TS consumers pass `'text'` explicitly.
- Wire skill-advisor daemon bootstrap to call `ensureActiveEmbedder()` before first read/write, then trigger one-shot `refreshSkillEmbeddings()` if the pointer just flipped.
- Update skill-advisor's `INSTALL_GUIDE.md` section 12 (all six subsections) and `README.md` pluggable-layer subsection to reflect the shared registry and `'auto'` default.
- Add regression coverage: cascade idempotency, pointer persistence across daemon restarts, content-type parameter wiring.

### Out of Scope

- CocoIndex changes; operator states CocoIndex is already on the same code-tuned model and stays in Python.
- Removing the legacy `skill_nodes.embedding` BLOB column (that is 003 follow-up #3, depends on production confirmation that no installation still uses the legacy path).
- A new MCP embedder management API for skill-advisor.
- Unrelated reindex or ranking changes outside embedder selection.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/adapter.ts` | Create | Canonical EmbedderAdapter interface (copy from mk-spec-memory) |
| `.opencode/skills/system-spec-kit/shared/embeddings/types.ts` | Create | BackendKind + EmbedderManifest types (copy from mk-spec-memory) |
| `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts` | Create | MANIFESTS array + factory functions (copy from mk-spec-memory) |
| `.opencode/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts` | Create | OllamaAdapter (copy from mk-spec-memory) |
| `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts` | Modify | Add optional `contentType: 'text' \| 'code'` parameter (default `'text'`) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapter.ts` | Convert to shim | `export * from '@spec-kit/shared/embeddings/adapter.js'` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/types.ts` | Convert to shim | Re-export shim |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` | Convert to shim | Re-export shim |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts` | Convert to shim | Re-export shim |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapter.ts` | Convert to shim | Re-export shim |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts` | Convert to shim | Re-export shim |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts` | Convert to shim | Re-export shim |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts` | Convert to shim | Re-export shim |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts` | Delete | Phase 007 purge parity with mk-spec-memory |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` | Modify | Flip `DEFAULT_ACTIVE_EMBEDDER` to `'auto'`. Add `ensureActiveEmbedder()` helper that calls shared cascade |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Modify | Bootstrap: call `ensureActiveEmbedder()` then `refreshSkillEmbeddings()` if pointer just flipped |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Modify | Section 12 all subsections updated for shared registry + `'auto'` default |
| `.opencode/skills/system-skill-advisor/README.md` | Modify | Pluggable-layer subsection updated |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/shared-factory-parity.vitest.ts` | Create | Regression proving identical embeddings via shared registry |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/ensure-active-embedder.vitest.ts` | Create | Cascade idempotency + pointer persistence + content-type parameter |

### Round 2 Files Changed (2026-07-08)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` | Modify | `ActiveEmbedder.provider` field; `ACTIVE_EMBEDDER_PROVIDER_KEY` + allow-set; 4-arg `setActiveEmbedder`; `ensureActiveEmbedder()` backfills provider on a valid pointer with no provider row |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/schema.vitest.ts` | Modify | +2 tests: provider round-trip, provider omitted when unset |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/ensure-active-embedder.vitest.ts` | Modify | 5 existing assertions extended with `provider: 'ollama'`; +1 new backfill test; header comment updated |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | `MEMORY_DB_PATH` added to `CHILD_ENV_ALLOWLIST`; `createChildEnv()` defaults it to `advisorDbPath()` unless the parent already sets it; `advisorDbPath` exported for testability |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts` | Modify | 3 existing exact-equality assertions updated for the new key; +2 new tests (default targets `skill-graph.sqlite` not `context-index.sqlite`; explicit override never clobbered) |
| `.opencode/bin/hf-model-server.cjs` | Modify | `getOptimalDevice()` drops the darwin `'mps'` branch (dead code — transformers.js never emits it); `shutdown()` and `main().catch()` replace `process.exit()` with `process.exitCode` + an unref'd 1500ms `SIGKILL` failsafe |
| `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite` | Data repair (gitignored) | Live `vec_metadata` backfilled with `active_embedder_provider='ollama'` (was missing the row entirely) |
| `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite.pre-fix-a-b-backup` | New (rollback artifact) | Pre-repair snapshot of `skill-graph.sqlite`. **Not actually gitignored** despite the original intent — `.gitignore`'s `*.sqlite`/`*.sqlite-*`/`*.sqlite.bak*` patterns do not match this `.pre-fix-a-b-backup` suffix; it shows as untracked in `git status`. See Round 2 Open Questions. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared contract surface exists at `shared/embeddings/` | `adapter.ts`, `types.ts`, `registry.ts`, `adapters/ollama.ts` exist under `.opencode/skills/system-spec-kit/shared/embeddings/` and both skills' local files are thin re-export shims |
| REQ-002 | Skill-advisor `DEFAULT_ACTIVE_EMBEDDER` flips to `'auto'` sentinel | `schema.ts` exports `{ name: 'auto', dim: 0 }` and `ensureActiveEmbedder()` helper invokes shared cascade |
| REQ-003 | Parallel embedder layer collapsed | skill-advisor's `lib/embedders/{adapter,types,registry,adapters/ollama}.ts` are thin re-export shims (≤5 lines each) |
| REQ-004 | llama-cpp purge parity with mk-spec-memory phase 007 | `git grep -l 'llama-cpp\|LlamaCppProvider\|embeddinggemma'` returns empty across `.opencode/skills/system-skill-advisor/` |
| REQ-005 | Content-type guard in shared cascade | `auto-select.ts` accepts optional `contentType: 'text' \| 'code'` parameter (default `'text'`). Both TS consumers pass `'text'` explicitly |
| REQ-006 | Parity regression test ships | `shared-factory-parity.vitest.ts` proves identical embeddings for same input across both skill surfaces |
| REQ-007 | Existing scorer behaviour stays green | All existing skill-advisor embedder and scorer vitest suites still pass |
| REQ-008 | `ensureActiveEmbedder` covered by tests | `ensure-active-embedder.vitest.ts` covers pointer-set, pointer-unset and content-type parameter paths |

### Round 2 - Post-Ship Hardening (2026-07-08)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | `ActiveEmbedder.provider` persists round-trip through `setActiveEmbedder`/`getActiveEmbedder` | 4-arg `setActiveEmbedder(db, name, dim, provider)` writes `active_embedder_provider`; `getActiveEmbedder()` returns it only when it is one of `voyage\|openai\|ollama\|hf-local`; a valid pointer with no provider row is backfilled via `backendToProvider(getManifest(name).backend)` on the next `ensureActiveEmbedder()` call without invoking the cascade |
| REQ-010 | Skill-advisor child process never resolves its database through the `@spec-kit/shared` symlink into mk-spec-memory's DB | `mk-skill-advisor-launcher.cjs`'s `createChildEnv()` defaults `MEMORY_DB_PATH` to `advisorDbPath()` (ends in `skill-graph.sqlite`, not `context-index.sqlite`) whenever the parent env does not already set it; an explicit parent-provided value is never overwritten |
| REQ-011 | `hf-model-server.cjs` shutdown paths avoid forcing `process.exit()` while onnxruntime-node native state is loaded | `shutdown(signal)` and the top-level `main().catch()` set `process.exitCode` and let the event loop drain naturally, with an unref'd 1500ms `SIGKILL` failsafe timer as backstop; live A/B reproduction shows the prior code SIGABRTs (10/10) and the fixed code exits cleanly (25/25) under an identical spawn -> health-check -> embed -> shutdown drill |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Skill-advisor and mk-spec-memory share one canonical contract surface (adapter, types, registry, Ollama adapter) under `shared/embeddings/`. Both skills' local files are thin re-export shims.
- **SC-002**: Skill-advisor resolves `'auto'` sentinel by default. The shared cascade picks `nomic-embed-text-v1.5` in local-only environments (or Voyage/OpenAI/Ollama-hosted alternatives when those keys/services are present).
- **SC-003**: Regression test catches future drift between the two TS skills.
- **SC-004**: CocoIndex (Python, code-tuned cascade) remains untouched. The content-type split stays explicit via the `contentType` parameter on shared `auto-select.ts`.
- **SC-005**: `git grep -l 'llama-cpp\|LlamaCppProvider\|embeddinggemma'` across `.opencode/skills/system-skill-advisor/` returns empty (phase 007 purge parity).

### Acceptance Scenarios

- **Given** the same input text and the shared default embedder, **When** mk-spec-memory and skill-advisor request embeddings, **Then** the produced vectors are identical under the shared adapter contract.
- **Given** skill-advisor starts with no active embedder pointer, **When** `ensureActiveEmbedder()` runs, **Then** the shared cascade fires and persists the winner (typically `nomic-embed-text-v1.5` in local-only environments) to `vec_metadata`.
- **Given** an existing skill-advisor installation with a manually-set pointer, **When** the daemon restarts, **Then** the manual pointer is preserved (cascade only fires when the pointer is `'auto'`).
- **Given** a future hypothetical code consumer in TypeScript, **When** it calls the shared cascade with `contentType: 'code'`, **Then** the cascade routes to code-tuned models (today: undefined behaviour since no TS code consumer exists; documented as forward-looking parameter).

### Round 2 Success Criteria (2026-07-08)

- **SC-006**: `getActiveEmbedder()` round-trips a `provider` through `setActiveEmbedder(db, name, dim, provider)`; a valid pre-existing pointer with no provider row is backfilled from the manifest on the next `ensureActiveEmbedder()` call without re-running the cascade. Evidence: 3 new/updated vitest cases (`schema.vitest.ts` +2, `ensure-active-embedder.vitest.ts` +1 backfill case + 5 assertions extended), 23/23 embedder-suite tests green (verified independently in this doc pass).
- **SC-007**: `createChildEnv()` defaults `MEMORY_DB_PATH` to the advisor's own `skill-graph.sqlite` and never overwrites an explicit parent-provided value. Evidence: 2 new + 3 updated `launcher-bootstrap.vitest.ts` cases; all 5 launcher vitest suites (`launcher-bootstrap`, `launcher-idle-timeout`, `launcher-lease`, `launcher-reap-pid-reuse`, `skill-advisor-launcher-orphan-reaping`) pass 43/43 (verified independently in this doc pass — note this differs from the implementing session's own "66/66" figure; the discrepancy was not chased down further and 43/43 is what this doc pass directly reproduced).
- **SC-008** (mitigation, not a categorical fix — see Round 2 Requirements): the one specific onnxruntime-node abort trigger the audit identified (forced `process.exit()` while native global state is loaded) no longer reproduces. Evidence: live A/B by the implementing session — 10/10 `SIGABRT` before the fix, 25/25 clean exits after, plus a forced-`EADDRINUSE` startup-failure path and a `SIGINT` path both exiting cleanly. The live A/B was not independently re-run in this documentation pass; the existing `hf-model-server.vitest.ts` suite (18/18, unmodified — it lives under `system-spec-kit/mcp_server/tests/embedders/`, since `hf-model-server.cjs` is a shared binary both skills' cascades can use, not a skill-advisor-local file) was re-confirmed green here.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Shared module import paths may cross package boundaries awkwardly | Build or runtime resolution failures | Keep shared module under an existing workspace-resolved package path and test dist freshness |
| Risk | Vector dimensions/defaults differ from existing skill-advisor DB | Requires reindex or migration | Document reindex precondition and keep data migration out of this scaffold unless implementation needs it |
| Dependency | mk-spec-memory/spec-memory embedder registry | Refactor depends on current registry structure | Read current registry before implementation and keep compatibility wrappers if needed |
| Risk (Round 2) | `skill-graph.sqlite.pre-fix-a-b-backup` is not actually matched by `.gitignore` | Untracked rollback artifact could get accidentally `git add -A`'d into a commit | Add an explicit `.gitignore` entry or delete the backup once the fix is confirmed stable in production (open question below) |
| Risk (Round 2) | onnx shutdown-crash fix is a mitigation for one known trigger, not a categorical guarantee | A different forced-exit path or a genuinely corrupt native-module state could still abort | Documented explicitly in REQ-011/SC-008; do not cite this as "onnxruntime-node can never crash on exit" |
| Risk (Round 2) | Full test suite on this branch carries 17 pre-existing/concurrent-drift failures (routing/scorer-corpus parity + `advisor-graph-health`), unrelated to this packet | Could mask a real regression in a noisy `npm run test` run | 2 representative failures (`advisor-graph-health`, `ambiguity-slice`) were stash-isolated in this doc pass and reproduce identically without this packet's 6 changed files; the remaining 15 were not individually isolated |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS (Round 2, 2026-07-08)

### Reliability
- **NFR-R01**: The skill-advisor daemon's child process must never resolve a foreign skill's database via symlink traversal through `@spec-kit/shared` — it must always know its own database path explicitly.
- **NFR-R02**: `hf-model-server.cjs` shutdown (`SIGTERM`, `SIGINT`, uncaught startup failure) must not `SIGABRT` while onnxruntime-node native state is loaded, and must still guarantee process termination (the unref'd `SIGKILL` failsafe) if the event loop fails to drain naturally.

### Data Integrity
- **NFR-D01**: `ActiveEmbedder.provider`, when present, must always be one of the four known `AutoSelectedEmbedderProvider` values (`voyage`, `openai`, `ollama`, `hf-local`); an unrecognized stored value is treated as absent rather than trusted.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES (Round 2, 2026-07-08)

### Data Boundaries
- **Pointer valid, no provider row** (pre-existing install from before the provider column existed, or a bare 3-arg `setActiveEmbedder` call): `ensureActiveEmbedder()` backfills and persists the provider from the manifest without invoking the cascade.
- **Provider row present but not a known value** (corrupted/foreign write): `getActiveEmbedder()` omits `provider` from the returned object rather than trusting the raw string.
- **Parent process already sets `MEMORY_DB_PATH`** (e.g. under an operator override or a test harness): `createChildEnv()` must not overwrite it.

### Error Scenarios
- **`hf-model-server.cjs` crashes during startup, after the native module has already partially initialized global state**: the top-level `main().catch()` path carries the same `process.exitCode` + failsafe-timer treatment as graceful shutdown, since the same native-teardown risk applies.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **Reindex `skill-graph.sqlite` in this packet?** Resolved: yes. After `ensureActiveEmbedder()` flips the pointer to nomic-text, the daemon bootstrap triggers a one-shot `refreshSkillEmbeddings()`. Operator action is not required because the existing dispatcher (phase 004 of 003 stack) already routes writes via `hasActiveEmbedderPointer()`. INSERT OR REPLACE keeps the reindex idempotent.
- **Should the shared cascade probe Voyage with `voyage-3` (general) instead of `voyage-code-3` for text consumers?** Deferred. Today's cascade probes `voyage-code-3` regardless of consumer (mk-spec-memory's current behaviour). The acknowledged compromise: code-tuned Voyage is acceptable for prose memory at current scale. A future contentType-aware refactor of the Voyage probe can split this.
- **(Round 2) Should `skill-graph.sqlite.pre-fix-a-b-backup` be gitignored or deleted?** Open. It is currently an untracked artifact (confirmed via `git check-ignore`, which found no match) sitting in the database directory. Recommend the operator either add an explicit `.gitignore` line for `*.pre-fix-a-b-backup` or delete it once the FIX-A/FIX-B live-DB repair is confirmed stable.
- **(Round 2) Was the original T017 live-daemon-smoke task actually executed?** Resolved: no, not as literally scoped. The originally-planned scenario ("cold daemon restart with no `vec_metadata` rows, observe the cascade pick a winner") was never run. What Round 2 actually did was a manual `sqlite3` INSERT of the `active_embedder_provider` row (derived from `getManifest().backend` and independently cross-checked against a live `/api/tags` probe against Ollama), not an observed cold-start cascade run. A true cold-start-observed cascade run against a clean DB remains unverified. See `tasks.md` T017 for the reconciled status.
<!-- /ANCHOR:questions -->
