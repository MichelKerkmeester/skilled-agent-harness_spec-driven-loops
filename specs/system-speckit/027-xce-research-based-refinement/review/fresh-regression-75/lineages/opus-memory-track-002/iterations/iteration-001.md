# Seat opus-memory-track-002 — iteration 1 (global #30)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-memory-track-002
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

I've traced the full semantic-trigger path. Let me verify my key finding against the established scope-filtering pattern in the lexical path one more time — confirming the asymmetry.

The lexical path (handler line 424) fetches `limit * 2` candidates, then scope-filters (lines 429–461). The semantic-union path (lines 525–529) fetches only `limit` candidates via `matchSemanticTriggers(..., { max: limit })`, *then* scope-filters. I've confirmed this is a real, code-evidenced asymmetry.

## Analysis

**Scope reviewed:** `lib/triggers/semantic-trigger-matcher.ts` (the matcher + flag gate `isSemanticTriggerShadowEnabled`) and its sole consumer `handlers/memory-triggers.ts` (shadow/union integration), cross-checked against the manual-testing-playbook contract and the hybrid handler test.

**Default-off gating — correct.** `SPECKIT_SEMANTIC_TRIGGERS` is read via `isTruthyOptIn` (matcher:98–105). Both the shadow branch (handler:561) and union branch (handler:472) are guarded by `semanticTriggersEnabled`. With the flag unset, neither semantic stage executes; `getSemanticTriggerMode()` reading the MODE var unconditionally is harmless. Matches the documented "absent when master flag unset."

**Shadow is non-result-affecting — correct.** `computeSemanticTriggerShadow` (handler:563) only populates `semanticTriggerShadow` stats and never mutates `results`. Confirms the playbook's "shadow-only, returned results unchanged" claim.

**Union gating — correct.** Union supplements only when `!strongLexicalMatch` and `isLexicalStageWeak` (handler:474–496), and the weak-check runs against the *scope-filtered* lexical results. Strong exact lexical matches short-circuit (verified by the handler test). Matches the contract.

**Fallback-on-miss correctness — sound.** `no_query_embedding` / `no_trigger_embeddings` / `failed` statuses all leave lexical `results` untouched; `cosineSimilarity` fail-safes to 0 on dimension mismatch (matcher:174–177); `bufferToFloat32` errors are caught by the try/catch wrappers (handler:544, 571) → `failed` status, never a crash. The shadow path additionally captures pre-gate `thresholdBands` separately from post-gate `semanticCount`, so the ambiguity gate does not corrupt the promotion telemetry.

**The margin "ambiguity gate"** (matcher:435–437) returning `[]` when top-2 scores are within `margin` is an intentional high-precision design choice for union injection (config-driven, test-covered) — not a defect.

### Finding (P2)

The semantic-union path applies `{ max: limit }` *inside* `matchSemanticTriggers` (handler:527) **before** `filterSemanticMatchesByScope` (handler:525). For a scoped query (`specFolder`/`tenantId`/`userId`/`agentId` set), the candidate pool is truncated to the top `limit` *globally-ranked* matches first, then scope-filtered — so in-scope matches ranked just below higher-scored out-of-scope ones are silently starved out. The established codebase pattern (the C2 lexical scope fix at handler:424) deliberately over-fetches `limit * 2` *before* scope-filtering to preserve scoped recall; the new union path contradicts that pattern. This fails *closed* (no cross-scope leak — out-of-scope rows are correctly dropped), so it is a recall-degradation, not a security defect, and only in non-default union mode. Fix: pass a larger `max` (e.g. `limit * 4` or unbounded) to `matchSemanticTriggers` and let `filterSemanticMatchesByScope` reduce to the final set, mirroring the lexical over-fetch.

Core behavior (default-off, shadow inertness, union gating, fallback safety) is correct; the one issue is a minor recall refinement in a non-default mode.

```json
{"seat":"opus-memory-track-002","model":"claude-opus-4-8","angle":"Semantic triggers: hybrid lexical+semantic matching and fallback-on-miss correctness; default-off gating (SPECKIT_SEMANTIC_TRIGGERS).","verdict":"PASS","summary":"Default-off gating, shadow inertness, union weak-lexical gating, and fallback-on-miss are all correct. One P2: union scope-filters after the max-limit slice, starving scoped recall vs the lexical over-fetch pattern.","files_reviewed":[".opencode/skills/system-spec-kit/mcp_server/lib/triggers/semantic-trigger-matcher.ts",".opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts",".opencode/skills/system-spec-kit/manual_testing_playbook/feature-flag-reference/semantic-trigger-shadow-and-union.md",".opencode/skills/system-spec-kit/mcp_server/tests/hybrid-trigger-handler.vitest.ts"],"findings":[{"severity":"P2","dimension":"correctness","title":"Union semantic matches scope-filtered after max-limit slice, starving scoped recall","file":".opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts:525","evidence":"filterSemanticMatchesByScope(semanticDatabase, matchSemanticTriggers(queryEmbedding, semanticCache, { max: limit }), args) — matchSemanticTriggers slices to top `limit` globally-ranked matches (matcher.ts:439) BEFORE scope filtering. The lexical path (handler:424) instead over-fetches `limit * 2` candidates then scope-filters (handler:429-461).","why":"For a scoped query, the semantic candidate pool is capped at `limit` global matches before scoping, so in-scope matches ranked just below higher-scored out-of-scope matches are dropped. This degrades scoped/multi-tenant recall and is inconsistent with the C2 lexical over-fetch pattern. It fails closed (no cross-scope leak), so impact is recall reduction only, and only in non-default union mode.","recommendation":"Pass a larger or unbounded max to matchSemanticTriggers (e.g. limit*4) and let filterSemanticMatchesByScope reduce to the final scoped set, then slice to limit — mirroring the lexical limit*2 over-fetch."}]}
```
