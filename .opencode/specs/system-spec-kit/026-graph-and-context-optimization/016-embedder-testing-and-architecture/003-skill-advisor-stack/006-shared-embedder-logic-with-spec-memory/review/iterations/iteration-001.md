# Deep Review Iteration 001

> Phase 003/006 (shared embedder factory + skill-advisor 'auto' default). Commit 5d1ed78ae. Iteration 001 of 5.

## Sequential reasoning

1. **PACKET BOUNDARY.** Resolved review packet at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory/`. Configured executor is cli-devin SWE-1.6 with `auto` permission; per cli-devin SKILL.md ALWAYS rule #13 the review-iter `--agent-config` recipe at `.opencode/skills/cli-devin/assets/review-iter.json` is the canonical dispatch path. Layer-2 sequential-thinking mandate satisfied via this 5-thought plain-text reasoning block (allowed alternative per dispatch prompt).
2. **CODE STATE.** Commit `5d1ed78ae` on `main`. The shared canonical surface shipped at `.opencode/skills/system-spec-kit/shared/embeddings/{adapter,types,registry,adapters/ollama}.ts`; `auto-select.ts` gained a `contentType?: 'text'|'code'` parameter (default `'text'`); skill-advisor `schema.ts` flipped `DEFAULT_ACTIVE_EMBEDDER` to `{ name: 'auto', dim: 0 }` and gained `ensureActiveEmbedder()` + `pointerNeedsResolution()`. `advisor-server.ts main()` calls `ensureActiveEmbedder(getSkillGraphDb(), { contentType: 'text' })` between `initSkillGraphDb()` and `startupSkillGraphScan()` (lines 264-274). Eight re-export shims (4 per skill, ≤15 lines each) replaced the per-skill duplicates; `llama-cpp-baseline.ts` deleted; 415/423 vitests pass (3 unrelated pre-existing failures); `validate.sh --strict` clean.
3. **SPEC-VS-DELIVERY DELTA.** `spec.md §3 "Files to Change"` (lines 107-108) lists two new test files: `shared-factory-parity.vitest.ts` and `ensure-active-embedder.vitest.ts`. `tasks.md` T011 ("Add `shared-factory-parity.vitest.ts` regression test", P0) is unchecked. `plan.md` line 80 explicitly requires "cross-skill embedding parity regression". REQ-006 acceptance: "Parity regression test ships`. Filesystem search (`find .opencode/skills/ -name '*factory-parity*' -o -name '*shared-factory*'`) returns zero matches. The implementation-summary "Tests" section silently omits T011/REQ-006 and lists only the other three vitest files. **REQ-006 binary fail** — a P0 acceptance criterion was dropped without rationale or follow-up entry. The implementation-summary's "completion_pct: 95" continuity claim is inconsistent with this miss.
4. **DOC DRIFT.** `INSTALL_GUIDE.md §12.1` cascade table (lines 332-336) correctly lists Ollama → hf-local → OpenAI → Voyage, matching `auto-select.ts` sequence (lines 481-486) and the ADR-014 comment ("local-first cascade ... Supersedes ADR-013's cloud-first ordering"). However, `INSTALL_GUIDE.md §12.6` cross-reference line 414 calls the same cascade a "Voyage → OpenAI → Ollama → hf-local probe chain" — the pre-ADR-014 cloud-first order. A reader following the cross-ref will see two contradictory orderings inside the same document for the same code path. README.md line 224 is correct ("Ollama → hf-local → OpenAI → Voyage").
5. **EDGE & MAINTAINABILITY.**
   - Lock-path collision: skill-advisor uses sha1+12-char digest in `os.tmpdir()`, spec-memory uses sha256+16-char digest in `path.dirname(dbName)` — different file names AND different directories, no collision.
   - Orphan migration: `pointerNeedsResolution()` returns true when `getManifest(name) === undefined`, so a legacy `embeddinggemma-300m` pointer correctly re-fires the cascade. Vitest case 3 covers it.
   - `contentType`: NO branching anywhere in `auto-select.ts`. Pure documentation today, matches D-005. Vitest case 4 only asserts plumbing, not behaviour.
   - Idempotency: vitest case 5 ("persists the winner so a second call is a no-op") confirms concrete-pointer skip.
   - Double-persist: `ensureActiveEmbedder` writes the winner twice — once via `metadataStore.persistActiveEmbedder` callback (schema.ts line 220) which the shared cascade invokes (auto-select.ts line 521), and again explicitly at schema.ts line 239 (`setActiveEmbedder(db, result.name, result.dim)`). Idempotent via `ON CONFLICT(key) DO UPDATE`, but the explicit comment at lines 235-238 ("makes the wiring obvious and keeps test mocks simple") acknowledges the redundancy is intentional design-for-clarity.
   - Helper-API divergence: skill-advisor's `setActiveEmbedder(db, name, dim)` is 3-arg; spec-memory's is 4-arg (`db, name, dim, provider`). Two skills converged on contracts but diverged on the helper signature. Skill-advisor's metadata-store callback wraps the gap by hardcoding `provider: 'ollama'` (schema.ts line 217), which is inaccurate when the cascade picks the hf-local / OpenAI / Voyage tier.

## Dimension coverage

| Dimension | Iteration coverage | Files reviewed |
|---|---|---|
| Correctness | Cross-skill import boundary, cascade idempotency, active-pointer persistence, legacy-path writer dispatcher, double-write semantics, lock-path collision risk | `shared/embeddings/{adapter,types,registry,auto-select}.ts`, `shared/embeddings/adapters/ollama.ts`, `system-skill-advisor/mcp_server/lib/embedders/{adapter,types,registry,index,schema}.ts`, `system-skill-advisor/mcp_server/lib/embedders/adapters/ollama.ts`, `system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts` (lines 780-1003), `system-skill-advisor/mcp_server/advisor-server.ts` (lines 230-307), `system-spec-kit/mcp_server/lib/embedders/{adapter,types,registry,schema}.ts`, `system-spec-kit/mcp_server/lib/embedders/adapters/ollama.ts` |
| Security | Lock-path predictability + tmpdir use, sentence-transformers Python subprocess invocation under cascade tier 2, INSTALL_GUIDE swap-runbook safety claim | `shared/embeddings/auto-select.ts` (acquireLock + defaultPythonImportProbe), `system-skill-advisor/INSTALL_GUIDE.md §12.4` |
| Traceability | INSTALL_GUIDE §12 truth-check against shared registry constants, cascade ordering parity between §12.1 table + §12.6 cross-ref + README.md, FOLLOW-UPS lineage, REQ-001..REQ-008 vs implementation | `system-skill-advisor/INSTALL_GUIDE.md` (§12.1–12.6), `system-skill-advisor/README.md` (pluggable layer subsection), `003-skill-advisor-stack/FOLLOW-UPS.md`, packet `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md` |
| Maintainability | Shim minimality + consistency, comment load-bearingness, `contentType` flow vs documentation-only status, helper-API divergence between two skills, dead-code & orphan-import smell, dist-freshness | `system-skill-advisor/mcp_server/lib/embedders/index.ts`, both skills' shim quartet, `shared/embeddings/dist/` freshness, schema.ts `__embedderSchemaTestables` export surface |

## Findings

### P0 (Blockers)

None.

### P1 (Required)

#### P1-1: REQ-006 (parity regression test) shipped marked complete without delivery
- **File:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory/spec.md:107`, `tasks.md:59`, `plan.md:80`
- **Evidence:**
  - `spec.md` §3 Files to Change line 107: `| `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/shared-factory-parity.vitest.ts` | Create | Regression proving identical embeddings via shared registry |`
  - `spec.md` §4 line 125: `| REQ-006 | Parity regression test ships | `shared-factory-parity.vitest.ts` proves identical embeddings for same input across both skill surfaces |`
  - `tasks.md` line 59: `| T011 | P0 | Add `shared-factory-parity.vitest.ts` regression test. | `[ ]` | Planned |`
  - `plan.md` line 80: `6. Add cross-skill embedding parity regression and `ensureActiveEmbedder` cascade tests.`
  - `find .opencode/skills/ -name '*factory-parity*' -o -name '*shared-factory*'` returns zero matches; `ls .opencode/skills/system-skill-advisor/mcp_server/tests/embedders/` shows only `ensure-active-embedder.vitest.ts`, `registry.vitest.ts`, `schema.vitest.ts`.
  - `implementation-summary.md` "Tests" section lists only the three present files; T011 / REQ-006 is silently omitted from the summary AND from `FOLLOW-UPS.md`. `_memory.continuity.completion_pct: 95` flags the packet as essentially done.
- **Impact:** A P0 acceptance criterion (REQ-006: "parity regression test ships") was not delivered, and the gap is not acknowledged in the implementation-summary or recorded as a follow-up. The whole purpose of phase 003/006 per FOLLOW-UPS §1 was to "eliminate the same-input-different-embedding drift" between the two skills — the parity test is the only guardrail that catches future regression of that drift, so the architectural promise lacks its enforcement layer. The packet currently presents as Shipped, but T011 is unchecked in `tasks.md` and the corresponding test does not exist.
- **Suggested remediation:** Either (a) write `mcp_server/tests/embedders/shared-factory-parity.vitest.ts` that constructs an `OllamaAdapter` via both skill surfaces (skill-advisor shim path vs spec-memory shim path) and asserts the same input produces byte-identical `Float32Array` output — guarded behind a "skip if ollama unreachable" gate so CI stays green offline; or (b) explicitly downgrade the requirement by editing `spec.md` to mark REQ-006 deferred, check T011 with a "deferred — see FOLLOW-UPS" note, and add a FOLLOW-UPS entry naming the gap. Option (a) is the spec-faithful path.

#### P1-2: INSTALL_GUIDE §12.6 cross-reference contradicts §12.1 cascade ordering
- **File:** `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md:414`
- **Evidence:**
  - §12.6 line 414: `Shared cascade: ... file-locked Voyage → OpenAI → Ollama → hf-local probe chain.`
  - §12.1 lines 331-336 cascade tier table lists tiers in order: Ollama (tier 1), hf-local (tier 2), OpenAI (tier 3), Voyage (tier 4).
  - `auto-select.ts:478-486` confirms ADR-014 local-first sequence: `['ollama', probeOllama], ['hf-local', probeHfLocal], ['openai', probeOpenAi], ['voyage', probeVoyage]` with comment "Supersedes ADR-013's cloud-first ordering".
  - `README.md:224` is correct ("Ollama → hf-local → OpenAI → Voyage").
- **Impact:** Same document, same code path, two contradictory orderings. A reader cross-checking §12.1 against the §12.6 cross-reference will think one is stale. The §12.6 ordering matches the pre-ADR-014 cloud-first behaviour that is no longer the code's behaviour. New operators using §12.6 as the quick-reference will reason about the wrong precedence (expecting Voyage to take priority over local Ollama when a `VOYAGE_API_KEY` is set, which is the opposite of what happens).
- **Suggested remediation:** Edit `INSTALL_GUIDE.md:414` to read "Ollama → hf-local → OpenAI → Voyage probe chain". Optionally add a brief note "(ADR-014 local-first)" to match the inline auto-select.ts comment.

#### P1-3: Hardcoded `provider: 'ollama'` in skill-advisor's metadata-store callback misrepresents non-Ollama winners
- **File:** `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:217`
- **Evidence:**
  - schema.ts lines 210-222 (the `metadataStore.readActiveEmbedder` callback used by `ensureActiveEmbedder`):
    ```typescript
    const metadataStore: AutoSelectMetadataStore = {
      readActiveEmbedder() {
        const pointer = getActiveEmbedder(db);
        if (pointerNeedsResolution(pointer)) {
          return null;
        }
        // Provider is recoverable from the manifest at need; persist only name + dim.
        return { name: pointer.name, dim: pointer.dim, provider: 'ollama' };
      },
      persistActiveEmbedder(embedder) {
        setActiveEmbedder(db, embedder.name, embedder.dim);
      },
    };
    ```
  - `AutoSelectedEmbedder.provider` typed in `auto-select.ts:17-23` accepts `'voyage' | 'openai' | 'ollama' | 'hf-local'`. The cascade may legitimately pick `hf-local` (Python sentence-transformers, tier 2) or one of the cloud tiers when no Ollama model is pulled.
  - skill-advisor's `setActiveEmbedder` is 3-arg (`db, name, dim`); spec-memory's is 4-arg (`db, name, dim, provider`) and `vec_metadata` carries an `active_embedder_provider` row in spec-memory but not in skill-advisor.
- **Impact:** Today the consequence is muted because (a) `autoSelectActiveEmbedder` checks `metadataStore.readActiveEmbedder()` only when the pointer was already persisted and short-circuits before re-probing (auto-select.ts:508-518), and (b) the `provider` field on the early-return path is unused after that point — it just flows back to `result.probes[0].tier` in the response. But the lie is observable: if a future caller introspects the metadata-store contract, it sees `provider: 'ollama'` for a hf-local-selected winner. More structurally, skill-advisor and spec-memory ship asymmetric `setActiveEmbedder` signatures and asymmetric `vec_metadata` schemas — exactly the parallel-implementation drift this packet was supposed to remove. A future operator running the shared cascade against skill-advisor's DB and then trying to read provenance gets `'ollama'` even after a Voyage/OpenAI/hf-local pick.
- **Suggested remediation:** Either (a) widen `skill-advisor.setActiveEmbedder` to the 4-arg signature and persist `active_embedder_provider` in `vec_metadata` (full parity with spec-memory), then derive the value from `pointer + getManifest()` if not stored; or (b) accept that skill-advisor does not need provider provenance and replace the `'ollama'` literal with a per-call derivation from `getManifest(pointer.name)?.backend` so the metadata-store return value is at least manifest-faithful. Option (a) is the parity-faithful path and aligns with the packet's "shared embedder logic" mission.

### P2 (Suggestions)

#### P2-1: Double-persistence in `ensureActiveEmbedder` is intentional but obscures the flow
- **File:** `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:227-239`
- **Evidence:** The shared cascade `autoSelectActiveEmbedder` calls `metadataStore.persistActiveEmbedder` at `auto-select.ts:521`, which invokes the skill-advisor callback (schema.ts:219-221) and writes via `setActiveEmbedder`. Immediately after the cascade returns, schema.ts:239 calls `setActiveEmbedder(db, result.name, result.dim)` again. The inline comment lines 235-238 explains: "The real cascade also persists via `metadataStore.persistActiveEmbedder`, but doing it here makes the wiring obvious and keeps test mocks simple (they don't need to know about the metadataStore round-trip)."
- **Impact:** Idempotent (both writes pass through `ON CONFLICT(key) DO UPDATE`) and the wall-clock overhead is sub-millisecond. The downside is purely cognitive — two persist paths for the same value make the data flow harder to reason about, and the test-mock convenience cited in the comment leaks design choices into production code.
- **Suggested remediation:** Either (a) drop the second `setActiveEmbedder` call (line 239) and trust the metadata-store callback; tests can still inject `autoSelect` to bypass the cascade entirely; or (b) keep the redundancy but expand the comment to name the test-suite that relies on it so a future cleanup pass knows what would break.

#### P2-2: `contentType` parameter is forward-looking documentation with no behaviour today
- **File:** `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:56-72`
- **Evidence:** `AutoSelectOptions.contentType` is plumbed through the type surface and the `EnsureActiveEmbedderOptions` field, but `selectWithoutPersistence` never reads it (search for `options.contentType` or `contentType` references inside the function body returns only the JSDoc explanation). D-005 in `implementation-summary.md` openly acknowledges this. The vitest case 4 only asserts that the value passes through the mock, not that it changes behaviour.
- **Impact:** Compatible with intent. The risk is silent decay: a future caller could pass `contentType: 'code'` expecting different behaviour and get the same text-tuned cascade. Today only `system-skill-advisor/mcp_server/advisor-server.ts:265` and the test mock use the parameter; both pass `'text'`.
- **Suggested remediation:** Add a runtime assertion or a single-line console warning when `contentType === 'code'` is passed today (since no TS code consumer exists), keyed by an env-flag to avoid noise in tests. Cheap to add and shouts at any future caller who expects code-tuned behaviour.

#### P2-3: `index.ts` barrel comment narrates removed-now exports but does not mention `ensureActiveEmbedder`
- **File:** `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/index.ts:1-12`
- **Evidence:** The barrel preamble (lines 7-11) calls out the removed `LlamaCppBaselineAdapter` and the removed `DEFAULT_EMBEDDER_NAME` / `BASELINE_EMBEDDER_NAME` constants but does not mention the newly-exported `ensureActiveEmbedder` or the new `'auto'` sentinel default — both of which are the headline addition of this packet.
- **Impact:** Future readers grep the barrel comment for the canonical "what changed" summary and find only the removals. Minor maintainability drag.
- **Suggested remediation:** Append one sentence to the preamble: "Adds `ensureActiveEmbedder()` cascade helper and flips `DEFAULT_ACTIVE_EMBEDDER` to the `'auto'` sentinel; the cascade picks the actual model at runtime via `@spec-kit/shared/embeddings/auto-select.ts`."

#### P2-4: `__embedderSchemaTestables` export surface leaks `pointerNeedsResolution` for tests but nothing imports it
- **File:** `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:244-247`
- **Evidence:** `__embedderSchemaTestables` exports `setActiveEmbedderTransactional` (used in `schema.vitest.ts:69`) and `pointerNeedsResolution` (no callers in `tests/`). `grep -rn "__embedderSchemaTestables" tests/` shows only the schema.vitest.ts import. The `pointerNeedsResolution` export through the testables namespace is dead.
- **Impact:** Purely a cleanliness signal. No runtime cost; static analysis tools may flag the unused export.
- **Suggested remediation:** Drop `pointerNeedsResolution` from the `__embedderSchemaTestables` export until a test actually exercises it directly. Alternatively, add a test that asserts `pointerNeedsResolution({ name: 'embeddinggemma-300m', dim: 768 }) === true` to lock-in the orphan-migration contract at unit granularity (today the contract is only exercised end-to-end via `ensure-active-embedder.vitest.ts` case 3).

#### P2-5: README pluggable-layer subsection cites shared `setActiveEmbedder(db, name, dim)` signature but cross-skill helper-API parity is incomplete
- **File:** `.opencode/skills/system-skill-advisor/README.md:222-228`
- **Evidence:** README line 222 describes the shared layer as "a `setActiveEmbedder(db, name, dim)` helper" — which is skill-advisor's 3-arg form. The companion spec-memory helper is 4-arg with `provider`. The README is correct for skill-advisor only.
- **Impact:** A reader using the README as the canonical reference assumes a unified helper; reading mk-spec-memory's INSTALL_GUIDE later surfaces the 4-arg signature divergence. Minor expectation-drift for cross-skill integration work.
- **Suggested remediation:** Either widen skill-advisor's signature (see P1-3) or annotate README line 222 with "(skill-advisor surface; mk-spec-memory adds an optional `provider` field — see [embedder-pluggability.md](../system-spec-kit/references/embedder-pluggability.md))".

## Convergence signals

- **New-findings ratio this iter:** 8/8 (0 P0, 3 P1, 5 P2 — all new this iteration, since this is the first review pass)
- **Dimensions clean:** Security had no new findings. Correctness, Traceability, Maintainability each surfaced gaps.
- **Recommendation for iter-002:**
  - Focus area 1 (Traceability deep-dive): grep all docs touched by this packet (README, INSTALL_GUIDE, embedder-pluggability.md if it exists, FOLLOW-UPS.md, parent skill-advisor-stack docs) for stale references to `embeddinggemma`, `llama-cpp`, `DEFAULT_EMBEDDER_NAME`, `BASELINE_EMBEDDER_NAME`, and Voyage-first cascade ordering — confirm §12.6 is the only contradiction.
  - Focus area 2 (Maintainability): inspect `embedder-pluggability.md` (referenced 3 times in INSTALL_GUIDE §12) for parity with the actual seven-manifest shared registry; the FOLLOW-UPS #4 already flags doc-parity as an open item that may now be partially closed by phase 003/006.
  - Focus area 3 (Cross-skill correctness): consult `system-spec-kit/mcp_server/lib/embedders/schema.ts` against the shared cascade and confirm the helper-API divergence (P1-3) is not also a runtime bug — i.e. spec-memory consumers don't silently break when the shared `MANIFESTS` array changes.
  - Convergence prognosis: likely 2-3 more iterations before stabilising; the REQ-006 gap (P1-1) is the dominant signal.

## Verdict (provisional)

**CONDITIONAL**

Rationale: There are no blockers (P0 = 0): the code shipped is functionally correct, the cascade resolves cleanly, the bootstrap wiring is sound, the orphan-migration safety net works, the writer dispatcher routes through the adapter path, the shims are minimal, llama-cpp is fully purged, and the live tests pass. However, three P1 issues block an unconditional pass: (1) REQ-006 — the parity regression test — was not delivered despite being listed in `spec.md`, `tasks.md` T011 (unchecked), `plan.md` step 6, and the implementation-summary claiming "completion_pct: 95"; (2) `INSTALL_GUIDE §12.6` carries a self-contradicting cascade ordering that confuses operators reading the cross-reference; (3) skill-advisor's metadata-store callback hardcodes `provider: 'ollama'`, partially undermining the "shared embedder logic" parity narrative when non-Ollama tiers win. Recommend a single follow-up commit that ships the parity test, edits the §12.6 cross-ref, and either widens `setActiveEmbedder` to 4-arg or fixes the hardcoded-provider lie before declaring this packet shipped.
