# Skill Docs Alignment Audit Summary

## Audit Date
2026-05-17

## Scope
Sweep of skill documentation across `.opencode/skills/*/SKILL.md` and `*/README.md` files (allowlisted) for stale embedder references after 2026-05-17 default flips:
- **mk-spec-memory** MCP: embedder default → jina-embeddings-v3 (1024d, Q4_K_M via Ollama HTTP)
- **CocoIndex** MCP: embedder default → jina-embeddings-v2-base-code (768d, code-tuned via sentence-transformers)

## Findings Summary

### By Severity

| Severity | Count | Action |
|----------|-------|--------|
| **P0** (Misleading defaults breaking setup) | 1 | Fix immediately |
| **P1** (Stale architecture / outdated claims) | 7 | Update before release |
| **P2** (Minor naming inconsistencies) | 5 | Update in next pass |
| **SKIP** (Intentional historical reference) | 1 | No action needed |

**Total actionable findings: 13** | Non-actionable: 1

---

## High-Severity Findings (P0-P1)

### P0: Misleading CocoIndex Default (line-breaking impact)

**File**: `.opencode/skills/mcp-coco-index/SKILL.md:268`

**Current**: "CocoIndex Code defaults to local EmbeddingGemma"

**Issue**: Operationally critical. This claim is in the agent SKILL.md, which drives setup routing. New users following old guidance will not get jina-embeddings-v2-base-code.

**Fix**: Replace with "CocoIndex Code defaults to local jina-embeddings-v2-base-code (768d code-tuned)"

---

### P1 Findings: Architecture Claims (7 occurrences)

1. **Memory MCP table (system-spec-kit/README.md:295)**: Claims "EmbeddingGemma 768d default" — should be "jina-embeddings-v3 1024d default"

2. **CocoIndex README (README.md:80)**: Claims "EmbeddingGemma default: Unified 768d local model shared with Memory MCP" — FALSE on two counts:
   - Default is jina-v2-base-code (code-tuned 768d), not gemma
   - NOT unified: mk-spec-memory uses jina-v3 (1024d), CocoIndex uses jina-v2-base-code (768d)

3. **CocoIndex SKILL.md (line 272)**: Table claims `google/embeddinggemma-300m` is "Default code-search model" — should note it is "Pre-018 baseline kept for comparisons"

4. **mk-spec-memory cascade order (mcp_server/README.md:58)**: Stale provider cascade. Missing jina-v3 primary tier. Current order: Voyage > OpenAI > llama-cpp(gemma) > hf-local. Correct order: Voyage > OpenAI > llama-cpp(jina-v3 PRIMARY) > llama-cpp(gemma FALLBACK) > hf-local

5. **mk-spec-memory profile naming (mcp_server/README.md:60)**: References `llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8` as if it is the only profile. Now must distinguish jina-v3 profiles when that model is active.

6. **Provider table (shared/embeddings/providers/README.md:59)**: Claims llama-cpp.ts defaults to "unsloth/embeddinggemma-300m-GGUF" — should list jina-embeddings-v3 as primary with gemma as fallback

7. **Cascade tier clarity (shared/README.md:569-570)**: Labels gemma as "Default llama-cpp" and "Fallback HF Local" without clarifying it is now a fallback tier in the larger cascade behind jina-v3

---

## Medium-Severity Findings (P2)

5 occurrences of outdated example defaults in environment variable documentation. While gemma persists as fallback cascade tiers, these tables suggest gemma is still the "live default" which is misleading:

- system-spec-kit/README.md:636 – LLAMA_CPP_EMBEDDINGS_MODEL table example
- system-spec-kit/README.md:638 – HF_EMBEDDINGS_MODEL table example  
- system-spec-kit/shared/README.md:339 – LLAMA_CPP_EMBEDDINGS_MODEL table
- system-spec-kit/shared/README.md:341 – HF_EMBEDDINGS_MODEL table
- system-spec-kit/shared/README.md:570 – Gemma ONNX link label

**Recommendation**: Clarify these are "fallback cascade" defaults not active defaults. Restructure tables to show cascade order: primary (jina-v3) → fallback (gemma) → final (hf-local).

---

## Intentional Historical References (SKIP)

**File**: mcp-coco-index/README.md:194

**Text**: "`google/embeddinggemma-300m` ... Pre-018 baseline. General-text. Kept for benchmark comparisons"

**Action**: NO CHANGE. This is intentional — documents historical baseline for benchmarking comparisons per ADR-012 ratification. Not a stale claim; it is a *labeled* historical reference.

---

## Fix Priority by File

| File | P0 | P1 | P2 | Effort |
|------|-----|-----|-----|--------|
| mcp-coco-index/SKILL.md | 1 | 1 | 0 | Critical path |
| mcp-coco-index/README.md | 0 | 1 | 0 | 30 min |
| system-spec-kit/README.md | 0 | 1 | 2 | 45 min |
| system-spec-kit/mcp_server/README.md | 0 | 2 | 0 | 1 hour |
| system-spec-kit/shared/README.md | 0 | 1 | 3 | 1 hour |
| system-spec-kit/shared/embeddings/providers/README.md | 0 | 1 | 1 | 30 min |

**Total effort**: ~4 hours

---

## Verification Checklist

- [x] Grepped for `embeddinggemma-300m` across allowlist — all occurrences captured
- [x] Grepped for `google/embeddinggemma` across allowlist — all occurrences captured
- [x] Grepped for `EmbeddingGemma.*default` across allowlist — cross-checked against architectural claims
- [x] Checked for "unified embedder family" claims — confirmed CocoIndex and mk-spec-memory now use separate variants
- [x] Verified ADR-012 as ratification source — confirmed 016/004-spec-memory-embedder-bake-off section

## Recommendations

1. **Immediate (P0)**: Fix CocoIndex SKILL.md line 268 — this is agent-facing setup routing
2. **Before release (P1)**: Update all 7 architecture claims to reflect jina-v3 + jina-v2-base-code split and correct cascade order
3. **Next pass (P2)**: Restructure environment variable tables to clarify cascade tiers (primary → fallback → final)
4. **Ongoing**: Add `STALE_EMBEDDER_DEFAULT` lint rule to prevent similar rot on future flips

