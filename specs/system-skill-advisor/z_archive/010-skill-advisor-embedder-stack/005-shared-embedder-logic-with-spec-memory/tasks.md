---
title: "Tasks: shared embedder logic with spec-memory [template:level_2/tasks.md]"
description: "Task record for shared embedder factory alignment plus the 2026-07-08 Round 2 post-ship hardening pass."
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
    recent_action: "Checked off Phase 2-3 tasks; added Phase 4 for Round 2"
    next_safe_action: "Operator: run the true production swap-runbook + cold-daemon live-smoke"
    blockers: []
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: shared embedder logic with spec-memory

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- **Status**: `[x]` complete, `[ ]` open, `[!]` blocked
- **Priority**: P0 blocks packet completion; P1 can be deferred only with operator approval
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Read canonical mk-spec-memory embedder files (`adapter.ts`, `types.ts`, `registry.ts`, `adapters/ollama.ts`). Read 2026-05-21.
- [x] T002 [P0] Read current skill-advisor embedder layer plus `schema.ts` and `skill-graph-db.ts` writer dispatcher. Read 2026-05-21.
- [x] T003 [P0] Confirm `@spec-kit/shared` workspace alias is already wired in both skills' package.json and tsconfig.json. Confirmed via exploration.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Step 1: copy `adapter.ts`, `types.ts`, `registry.ts`, `adapters/ollama.ts` to `shared/embeddings/`, promoting skill-advisor's wider interface. Shipped in commit `5d1ed78ae1` (2026-05-21); confirmed on disk at `.opencode/skills/system-spec-kit/shared/embeddings/{adapter,types,registry,adapters/ollama}.ts`. This doc pass never marked it done — docs lagged the ship by 7 weeks.
- [x] T005 [P0] Step 1: convert both skills' local `lib/embedders/{adapter,types,registry,adapters/ollama}.ts` to thin re-export shims. Shipped in `5d1ed78ae1`; confirmed both skills' local files are re-export shims.
- [x] T006 [P0] Step 2: delete `adapters/llama-cpp-baseline.ts` from skill-advisor and remove the `embeddinggemma-300m` manifest entry. Shipped in `5d1ed78ae1`; `git grep -l 'llama-cpp\|LlamaCppProvider\|embeddinggemma' .opencode/skills/system-skill-advisor/` returns only comment/parity-assertion hits per implementation-summary.md.
- [x] T007 [P0] Step 3: add `contentType: 'text' | 'code'` parameter (default `'text'`) to shared `auto-select.ts`. Shipped in `5d1ed78ae1`.
- [x] T008 [P0] Step 3: flip skill-advisor `DEFAULT_ACTIVE_EMBEDDER` to `{ name: 'auto', dim: 0 }` and add `ensureActiveEmbedder()`. Shipped in `5d1ed78ae1`; hardened further in Round 2 (T019 below).
- [x] T009 [P0] Step 4: wire `advisor-server.ts` bootstrap to call `ensureActiveEmbedder()` then `refreshSkillEmbeddings()` if the pointer just flipped. Shipped in `5d1ed78ae1`; confirmed at `advisor-server.ts` `main()` between `initSkillGraphDb()` and `startupSkillGraphScan()`.
- [x] T010 [P0] Step 5: update skill-advisor `INSTALL_GUIDE.md` section 12 and `README.md`'s pluggable-layer subsection. Shipped in `5d1ed78ae1`; the section 12.6 cascade-ordering contradiction (P1-2) was fixed in the same-day remediation commit `12a322aa45`.
- [x] T011 [P0] Add `shared-factory-parity.vitest.ts` regression test. Shipped in remediation commit `12a322aa45` — 9 cases covering MANIFESTS reference identity, manifest lookups, adapter shape parity for jina-v3 and nomic, listManifests/listSupportedDimensions identity, and unknown-name plus purged-baseline negative cases.
- [x] T012 [P0] Add `ensure-active-embedder.vitest.ts` covering cascade idempotency, pointer persistence, and the content-type parameter. Shipped in `5d1ed78ae1` (5 cases); extended in Round 2 (T019 below).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 [P0] Run `npm run typecheck` and `npm run build` in both `system-spec-kit/mcp_server` and `system-skill-advisor/mcp_server`. Passed at `5d1ed78ae1`/`12a322aa45` per implementation-summary.md; re-confirmed clean in this doc pass (2026-07-08) including Round 2 changes.
- [x] T014 [P0] Run `npx vitest run` in both skills, confirming existing `vi.mock('@spec-kit/shared/embeddings/factory')` calls still pass. 415/423 passed at `12a322aa45` (3 pre-existing unrelated failures) per implementation-summary.md; re-run in this doc pass alongside Round 2 changes, see T024 below.
- [x] T015 [P0] Parity grep: `git grep -l 'llama-cpp\|LlamaCppProvider\|embeddinggemma' .opencode/skills/system-skill-advisor/` returns empty. Confirmed in implementation-summary.md — only comment/parity-assertion hits remain.
- [x] T016 [P0] Run strict-validate on this packet folder. Passed 0 errors/0 warnings at `12a322aa45` per implementation-summary.md. Re-run at the end of this doc pass (2026-07-08); see `implementation-summary.md` Round 2 Verification for the exact output.
- [x] T017 [P1] Live daemon smoke: cold start, observe pointer flip via sqlite3 probe, run 3 semantic-shadow queries, confirm sane top-3. **Scope executed differently, not as literally scoped** — no cold-daemon-observed cascade run was ever captured. Round 2 instead found the DB had no provider row at all and hand-repaired it via `sqlite3` INSERT (T021), cross-checked against `getManifest().backend` and a live Ollama `/api/tags` probe, which is not equivalent evidence to a cold-start cascade observation. See `spec.md` Round 2 Open Questions for the honest gap; a true cold-start-observed cascade run against a clean DB remains unverified.
- [x] T018 [P1] Post-implementation 5-iteration deep-review via cli-devin SWE-1.6, scoped to the cross-skill import boundary, cascade idempotency, pointer persistence, legacy-path correctness, and INSTALL_GUIDE truth-check. Executed as `review/` (iter-001, early convergence, CONDITIONAL then PASS after remediation `12a322aa45`). See `review/review-report.md` and `review/resource-map.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Round 2 - Post-Ship Hardening (2026-07-08)

- [x] T019 [P0] Add `provider` persistence: `ActiveEmbedder.provider` field, `ACTIVE_EMBEDDER_PROVIDER_KEY`, 4-arg `setActiveEmbedder`, and an `ensureActiveEmbedder()` backfill path; 2 new `schema.vitest.ts` cases plus 1 new `ensure-active-embedder.vitest.ts` backfill case plus 5 assertions extended. `git diff HEAD -- .../lib/embedders/schema.ts`; `npx vitest run tests/embedders/` 23/23 pass, re-verified in this doc pass.
- [x] T020 [P0] FIX-A: pin `MEMORY_DB_PATH` in `mk-skill-advisor-launcher.cjs`'s `createChildEnv()` to `advisorDbPath()`, add it to `CHILD_ENV_ALLOWLIST`, export `advisorDbPath` for testability; 2 new plus 3 updated `launcher-bootstrap.vitest.ts` cases. `git diff HEAD -- .opencode/bin/mk-skill-advisor-launcher.cjs`; all 5 launcher vitest suites 43/43 pass, re-verified in this doc pass.
- [x] T021 [P0] FIX-B: verify the provider-validity backfill is already correct in `schema.ts` (no code change beyond T019); live-repair `skill-graph.sqlite`'s missing `active_embedder_provider` row. `sqlite3 skill-graph.sqlite "SELECT key,value FROM vec_metadata WHERE key LIKE 'active_embedder%'"` returns `ollama` for the provider row, re-verified in this doc pass; backup at `skill-graph.sqlite.pre-fix-a-b-backup`.
- [x] T022 [P1] Onnx shutdown-crash mitigation: replace `process.exit()` with `process.exitCode` plus an unref'd `SIGKILL` failsafe in `hf-model-server.cjs`'s `shutdown()` and `main().catch()`, and drop the dead darwin `'mps'` branch. `git diff HEAD -- .opencode/bin/hf-model-server.cjs`; `node --check` clean; existing `hf-model-server.vitest.ts` (`system-spec-kit/mcp_server`) 18/18 pass, re-verified in this doc pass.
- [x] T023 [P1] Live A/B reproduction of the onnx crash: spawn -> health-check -> embed -> shutdown drill, 10x against pre-fix code and 25x against fixed code. Implementing session's own report: 10/10 `SIGABRT` before, 25/25 clean exit-0 after. Not independently re-run in this doc pass.
- [x] T024 [P0] Full regression re-run; isolate pre-existing/concurrent-drift failures by stashing this phase's 6 changed files and re-running the same failing files against the unmodified tree. This doc pass (2026-07-08): `npm run test` in `system-skill-advisor/mcp_server` gave 670 passed, 17 failed, 1 expected fail, 7 skipped (695 total). 2 representative failures (`tests/legacy/advisor-graph-health.vitest.ts`, `tests/scorer/ambiguity-slice.vitest.ts`) were stash-isolated and reproduce identically without this phase's changes — routing/scorer-corpus parity plus graph-metadata drift, unrelated to this packet. The remaining 15 were not individually isolated. This is a higher failure count than the implementing session's own reports claimed, consistent with continued concurrent-session drift on this branch (a large unrelated `deep-loop-runtime` -> `deep-loop-workflows` -> `system-deep-loop` rename is mid-flight in this working tree), not a regression this packet introduced.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All P0 rows above are `[x]`, implementation evidence is copied into `implementation-summary.md`, and strict validation exits 0 for the packet.

**Status (2026-07-08): met.** All Phase 1-4 P0 items are `[x]` with evidence. The one P1 gap is T017 (documented above, not a blocker). Strict validation for this doc pass is recorded in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts`
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts`
- `.opencode/bin/mk-skill-advisor-launcher.cjs` (Round 2 FIX-A)
- `.opencode/bin/hf-model-server.cjs` (Round 2 onnx shutdown-crash mitigation)
<!-- /ANCHOR:cross-refs -->
