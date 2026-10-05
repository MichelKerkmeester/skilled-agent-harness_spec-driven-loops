## Row 87 (ambiguous)
- Doc: `specs/sk-git/028-crawlable-commit-history/001-research/research/lineages/deepseek/research.md:21`
- Citation: `SKILL.md:400`
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
The enforced contract is `type(scope)[!]: imperative summary`: `SUBJECT_RE` at `.opencode/scripts/git-hooks/commit-msg:72` allows 13 types, a lowercase kebab scope, optional `!`, and any non-empty summary. The hook hard-blocks a numeric-only scope (79-81), a non-lowercase summary start (83-85), repeated spaces (87-89), trailing punctuation (91-94), vague summaries (96-100), subjects over 100 characters (110-113), a missing blank line before the body (52-61), a missing `BREAKING CHANGE:` footer after `!` (139-141), and a body-less commit when 4+ paths are staged (153-155). It only warns on proc…

Collision verdict for a numbered identifier: scope placement is dead on arrival (regex + explicit doc prohibition at SKILL.md:400-401); subject placement spends the 80/100-character budget and trips the process-language warning class; the body/trailer zone collides with nothing blocking, but a new key should be added to `TRAILER_RE` (117), the template (`assets/commit-message-template.md:67`), and SKILL.md §6 (463-495). The doc contract already pushes packet/phase/task metadata into the body or `Refs:` (SKILL.md:410-412), and the only current packet link is the optional, unvalidated `Refs: <is…

Full findings, the placement-cost table, and five ranked recommendations: `iterations/iteration-001.md`.
```

## Row 89 (ambiguous)
- Doc: `specs/system-speckit/033-system-speckit-v4/066-pre-v4-spec-upgrade/research/lineages/luna/iterations/iteration-005.md:60`
- Citation: `specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:75`
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/008-invalid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/spec.md` and 4650 more

```text
## Sources Consulted

- [SOURCE: specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/spec.md:75-84]
- [SOURCE: .skilled/skills/system-speckit/runtime/cli/continuity/bf-pipeline.sh:1-25]
- [SOURCE: .skilled/skills/system-speckit/runtime/cli/spec/fullrun.sh:1-23]
```

## Row 90 (ambiguous)
- Doc: `specs/sk-communication/001-sk-communication-creation/001-research-strategy/research/lineages/gpt-sol-fast/research.md:213`
- Citation: `iteration-002.md:35`
- Candidates: `.skilled/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-002.md`, `specs/agents/004-agents-md-bloat-audit/research/lineages/pi/iterations/iteration-002.md`, `specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek/iterations/iteration-002.md`, `specs/agents/009-turn-closeout-next-steps/006-synthesis-presentation/research/lineages/pi-deepseek/iterations/iteration-002.md`, `specs/agents/010-repo-rule-system-integration/research/lineages/deepseek/iterations/iteration-002.md`, `specs/agents/010-repo-rule-system-integration/research/lineages/deprecation-audit/iterations/iteration-002.md`, `specs/agents/010-repo-rule-system-integration/research/lineages/glm/iterations/iteration-002.md`, `specs/agents/010-repo-rule-system-integration/research/lineages/luna/iterations/iteration-002.md` and 1031 more

```text
| Reconstruct original from parsed text | Parsing/decoding can erase byte distinctions | `iteration-002.md:33` | 2 |
| LLM judge as fidelity proof | Probabilistic validation cannot authorize semantic safety | `iteration-002.md:34` | 2 |
| Suppress original before validation | Missing-final, timeout, or cancellation can swallow output | `iteration-002.md:35` | 1-2 |
| Provider/protocol name as privacy class | Compatibility does not establish deployment, retention, residency, or consent | `iteration-003.md:34` | 3 |
| Automatic local-to-hosted fallback | Crosses an egress boundary without explicit consent | `iteration-003.md:35` | 3 |
```

## Row 91 (ambiguous)
- Doc: `specs/system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/review/lineages/p018-opus-3/iterations/iteration-001.md:53`
- Citation: `spec.md:157`
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/008-invalid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/spec.md` and 4650 more

```text
- `processBatches` signature is `(items, processor, batchSize, delayMs, retryOptions)` (`batch-processor.ts:123-128`); the call site `memory-index.ts:1034` passes `scanBatchSize, undefined, { shouldAbort }`, so `delayMs` correctly falls back to `BATCH_DELAY_MS` via the JS default-param rule and the early-abort skips the inter-batch delay at `batch-processor.ts:172`. Correct.
- `shouldAbort` fires only when `ctx.isCancelled?.()` is true, so early-abort never triggers on a non-cancelled run. The break at `batch-processor.ts:150` returns partial in-order `results`, and the result-tally loop indexes `filesToIndex[i]` by position, so no index drift. On cancel, the partial result is superseded by `cancelledScanEnvelope(scanKey)` returned from the metadata-edge loop (`memory-index.ts:1178`), the post-loop check (`:1206`), or the causal-chain loop (`:1313`).
- Tail-loop yields land at iteration boundaries before the per-row `promoteMetadataEdges` transaction (`memory-index.ts:1176-1186`) and before the per-folder DB work (`:1311-1317`), preserving atomicity on the single shared better-sqlite3 connection — matching the spec's stated safety invariant (spec.md:157).
- `isCancelRequestedFast` is allocation/IO-free (`job-store.ts:335-338`, `Set.has`); the background dispatch routes `isCancelled` through it (`memory-index.ts:1444`); the durable `cancel_requested` column still backs status/recovery via `isCancelRequested` (`job-store.ts:329-333`). The bare `isCancelRequested` import was cor
```

## Row 93 (ambiguous)
- Doc: `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/003-shared-package-utilization/research/lineages/glm-5-3-flash-shared-package/iterations/iteration-006.md:16`
- Citation: `config.ts:10`
- Candidates: `.pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts`, `.skilled/skills/system-spec-kit/runtime/cli/core/config.ts`, `.skilled/skills/system-spec-kit/runtime/core/config.ts`, `.skilled/skills/system-spec-kit/shared/config.ts`

```text
| F6.4 | `shared/chunking.ts` (143) | Claimed: the section-aware semantic chunker. Actual: live via **one import** — the hf-local *provider* (`embeddings/providers/hf-local.ts:13` imports `semanticChunk` + `MAX_TEXT_LENGTH`); its other three exports (`RESERVED_OVERVIEW:23`, `RESERVED_OUTCOME:25`, `MIN_SECTION_LENGTH:27`) are consumed only by the production-dead monolith (`embeddings.ts:20`, F2.1) and a test that imports it by **relative source path** (`runtime/tests/chunking-semantic.vitest.ts:10` `'../../shared/chunking'` — a third convention, neither the specifier nor the vitest alias). The …
…_TTL_MS` (hf-local.ts:672), `SPECKIT_CASCADE_PROBE_TIMEOUT_MS` (auto-select.ts:117), `SPECKIT_ROLLOUT_PERCENT` (adaptive-fusion.ts:104), `MEMORY_DB_PATH` (paths.ts:164 + factory + hf-local.ts:346 — three readers, and the launcher *sets* it: launcher.cjs:286-303), `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` (config.ts:10, profile.ts:274, factory ×2), `VITEST`/`NODE_ENV`/`SPECKIT_TEST` (paths.ts:68-70), `SPECKIT_IPC_SOCKET_DIR` (socket-server.ts:217 + hf-local), `SPECKIT_MAX_SECONDARY_CLIENTS` (socket-server.ts:142). Reads by liveness tier: the adapter/ollama/auto-select/factory/paths/socket cluster = **…
| F6.6 | the 2-spelling bug-family (4 instances) | Claimed: n/a (a structural finding). Actual: the package resolves the *same* thing under two names in four places: (a) `SPEC_KIT_DB_DIR \|\| SPECKIT_DB_DIR` — config.ts:10, factory (fingerprint + candidates), profile.ts:274; (b) the Voyage base
```
