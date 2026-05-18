---
title: "Iter 1 — Regression Risk (commit ba6816a49 re-review)"
iter_number: 1
dimension: regression-risk
executor: cli-devin
model: swe-1.6
recipe: agent-config-deep-review-iter.json
review_target_commit: ba6816a490b1a20d4f74135179c10096c5348921
write_mode: loop_manager_persisted_from_stdout
write_mode_reason: "agent-config Write scope allows <packet-root>/review/iterations/* but this re-review writes to review-002-remediation/iterations/*; loop manager harvests iter content from devin stdout"
---

# Iter 1 — Regression Risk

## 1. SCOPED ANGLE

Hunt for regressions introduced by commit ba6816a49 across the 7 hypotheses defined in the iter-1 prompt: schema.ts tx wrap / P0-C cap removal score side-effects / docType refactor scoring shift / llama-cpp gate removal silent paths / tableNameForDim dedupe orphans / parseBoundedEnv clamping behavior change / Python validator over-rejection.

## 2. REFERENCES READ

Devin worked in non-interactive mode without explicit `<ref_file>` tags. Files inspected per the agent's reasoning (loop-manager re-checked):
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:85-135` (setActiveEmbedder full body; **tx wrap confirmed at line 104** — `db.transaction(() => { ... })` wraps INSERT-OR-IGNORE + UPDATE pair)
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:170-200` (documentHintScore two-form docType check)
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:355-410` (cap removal + telemetry)
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` (llama-cpp gate removal)
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` (tableNameForDim deletion + vecTableNameForDim import)
- `.opencode/skills/system-spec-kit/mcp_server/lib/util/env.ts` (parseBoundedEnv helper)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:51-80, 105-160` (Python validators)

## 3. FINDINGS

### P0 FINDINGS

**None.**

### P1 FINDINGS

#### P1-01: Python device validator rejects legitimate device-specific variants

**File:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:60-68`

**Evidence:** `_resolve_device` now validates `env_override` against `_VALID_DEVICES = {"cuda", "mps", "cpu"}`. Previously, it returned the env value as-is. Legitimate variants like `cuda:0`, `mps:0`, `xpu`, `hip`, `rocm` will be rejected with a warning and fall through to auto-detection.

**Repro:**
1. Set `COCOINDEX_CODE_DEVICE=cuda:0` (typical multi-GPU selection).
2. Import `cocoindex_code.config` and call `_resolve_device("cuda:0")`.
3. Observe warning log + auto-detection probe instead of explicit `cuda:0`.

**Recommendation:** Expand the allowlist to include common device-specific variants (regex `^(cuda|mps)(:\d+)?$|^cpu$|^xpu$|^hip$`) OR strip device index before validation OR document that device-specific selection is unsupported.

**Effort:** XS (one regex)

---

#### P1-02: Python embedding-model validator blocks unregistered models without escape hatch

**File:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:146-152`

**Evidence:** `_is_registered_embedder` rejects any `COCOINDEX_CODE_EMBEDDING_MODEL` value not in MANIFESTS, silently falling back to `_DEFAULT_MODEL`. Operators using custom-trained or newly-published models cannot opt in without modifying source.

**Repro:** Set `COCOINDEX_CODE_EMBEDDING_MODEL=sbert/some-newly-released-model-2026` → silent fallback to default + warning log.

**Recommendation:** Add a `COCOINDEX_CODE_ALLOW_UNREGISTERED_MODELS=true` escape hatch, or document that only MANIFESTS models are supported and list how to extend the registry.

**Effort:** S (env-var check + docs)

### P2 FINDINGS

#### P2-01: parseBoundedEnv silently clamps without operator-visible signal

**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/util/env.ts:5-18`

**Evidence:** `Math.min(max, Math.max(min, parsed))` clamps without logging. A deployment that set `EMBEDDER_READY_TIMEOUT_MS=30000` now silently gets 10000.

**Recommendation:** Emit a `logger.warn({event:'env_value_clamped', name, requested, clamped, min, max})` when the clamped value differs from the parsed value.

**Effort:** XS

---

#### P2-02: documentHintScore two-form check is strictly more permissive (intentional, no regression)

**File:** `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank/retrieval-rescue.ts:179-193`

**Evidence:** New check matches either raw lowercase `docType` OR `normalizeText(searchableDocType)`, so the only behavior change is MORE matches than before. P0-B fix relies on this. Not a regression.

**Verdict:** No action.

## 4. POSITIVE OBSERVATIONS

1. **Transaction atomicity verified**: `setActiveEmbedder` at schema.ts:104 wraps INSERT-OR-IGNORE + UPDATE in `db.transaction(() => { ... })`. The "tx wrap" claim in the commit message is HONORED (not silently dropped despite the diff hunk showing only binding changes; the `const writePointer = db.transaction(() => {` line precedes the diff hunk and was unchanged).
2. **Outer normalization clamp** (per Devin's claim): stage2-fusion clamps post-rescue scores to [0,1], so cap raise to 1.0 in retrieval-rescue.ts is safe. (Loop-manager flags this as a CLAIM-TO-VERIFY in iter 5.)
3. **retrievalRescueScore field usage is local** to retrieval-rescue.ts sort tiebreak per Devin; iter 5 will cross-check this against stage2-fusion + sortDeterministicRows.
4. **llama-cpp gate removal**: per Devin, callers handle `undefined` returns gracefully. Iter 5 will verify there are no callers that depended on the throw.
5. **vecTableNameForDim export**: per Devin, no other files had local copies; iter 5 will grep verify.

## 5. JSONL DELTA ROW

```json
{"ts":"2026-05-17T22:42:00Z","event":"iter_complete","iter":1,"dimension":"regression-risk","p0_count":0,"p1_count":2,"p2_count":2,"refs_read_count":7,"new_p0_titles":[],"new_p1_titles":["Python device validator rejects legitimate variants","Python embedding-model validator no escape hatch"],"verdict_so_far":"advisories","note":"agent ran in non-interactive mode; loop-manager persisted from stdout"}
```
