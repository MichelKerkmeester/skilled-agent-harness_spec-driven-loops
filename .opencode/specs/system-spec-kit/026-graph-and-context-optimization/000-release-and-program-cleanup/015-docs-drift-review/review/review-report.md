# Documentation-Drift Review Report

> Read-only deep review of user-facing docs vs this session's shipped changes (packets 013 / 014 / 015 / 016 + v3.5.0.0 release), all on `origin/main` HEAD `75cfec1700`. Findings only — no reviewed doc was edited.

---

## 1. VERDICT

**CONDITIONAL PASS** — the documentation is broadly accurate, but a focused set of real drift items must be corrected before the docs match shipped code. The dominant theme is the **single-manifest embedder registry** (advisor/shared) and a few **tool-count** inconsistencies. No finding blocks a shipped runtime path; the P0-class item is a doc-internal contradiction a reader would act on.

| Severity | Count | Meaning |
|----------|-------|---------|
| **P0** | 1 | Actively misleading: a reader would trust a stated count/list that the doc itself contradicts elsewhere or that no longer exists |
| **P1** | 8 | Wrong fact a reader would rely on |
| **P2** | 12 | Minor / cosmetic / enumeration-gap / low-confidence staleness |
| **Total** | 21 | (consolidated; multi-line repeats of one claim counted once) |

**Method note:** 10 partitioned `gpt-5.5-fast high` review passes (one bounded doc area each) produced ~70 raw candidate findings. Every candidate was adversarially verified by the orchestrator against the real code on `origin/main`. **~45 raw candidates were REJECTED as false positives** — almost entirely one error class: the passes over-applied the *advisor-scoped* embedder/reranker removal (change #2) to **mk-spec-memory**, which retains its 4-provider embedder cascade and its algorithmic MMR. See §5.

---

## 2. SCOPE-CRITICAL GROUND TRUTH (resolves most false positives)

Verified against `origin/main` code:

- **mk-spec-memory KEEPS its 4-provider embedder cascade.** `@spec-kit/shared/embeddings/registry.ts` defines `CLOUD_CANONICAL = {voyage:'voyage-code-3', openai:'text-embedding-3-small'}`, `CanonicalProvider = 'voyage'|'openai'|'hf-local'|'ollama'`, and `factory.ts` still reads `OPENAI_API_KEY`/`VOYAGE_API_KEY`/`EMBEDDINGS_PROVIDER`. Only the swappable-model **`MANIFESTS` array** is now single-entry (`nomic-embed-text-v1.5`).
- **mk-spec-memory KEEPS algorithmic MMR.** `SPECKIT_MMR` (default `true`) in `lib/search/search-flags.ts`; `INTENT_LAMBDA_MAP` used in `hybrid-search.ts` + `pipeline/stage3-rerank.ts`. The session diff touched **zero** search files.
- **What WAS removed:** the **LLM/cross-encoder reranker** (`lib/search/cross-encoder.ts` deleted; confidence-scoring reranker weight `0.20` removed) and the **advisor's** multi-candidate embedder/reranker manifests. `registry.ts:172`: "Reranking is fully removed (local cross-encoder + cloud voyage/cohere paths deleted)."
- **Tool counts:** `mk-spec-memory` = **37** (37 unique `name:` in `tool-schemas.ts`; verified at session start and now). `mk_skill_advisor` = **9** (8 public: 4 `advisor_*` + 4 `skill_graph_*`; plus 1 gated internal `skill_graph_propagate_enhances`). `mk_code_index` = 8.
- **016 owner-lease:** `.opencode/skills/system-spec-kit/mcp_server/database/.spec-memory-owner.json`; the default bridge path emits a retryable JSON-RPC error (`mk-spec-memory: lease held by pid <N> but session bridge unavailable (<reason>); reconnect`). Plaintext `LEASE_HELD_BY` survives **only** in the opt-in `SPECKIT_LAUNCHER_BRIDGE_DISABLED=1` legacy-rollback path.
- **Attribution caveat:** the single-manifest state landed `2026-05-29` (shared) / `2026-05-27` (advisor shim), **predating** this session's commit baseline. The task explicitly lists it under "014 pre-existing remediation," so embedder-MANIFESTS doc drift is in scope; it is flagged below but is pre-existing, not session-introduced.

---

## 3. FINDINGS (grouped by doc area)

### 3.1 Root `README.md`

| # | File:Section | Stale claim | Conflicts | Correction | Sev |
|---|---|---|---|---|---|
| F1 | `README.md` Layered MCP Surface table (line ~401, L6 row + Total) | L6 Analysis = **6** tools; **Total = 36** | #1 | Total is **37**; L6 should be **7** — the table omits `memory_causal_unlink` (exposed 2026-06-03). README lines ~862 and ~1210 already say "37", so the table contradicts the rest of the doc. | **P0** |
| F2 | `README.md` "Set Up Embedding Provider" (lines ~158-159) | "jina-embeddings-v3 is the second-priority fallback; pull via `ollama pull hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M`" | #2 | `MANIFESTS` has only `nomic-embed-text-v1.5`; there is no jina fallback entry. Drop the jina second-priority-fallback guidance. | P2 |
| F3 | `README.md` "Embedding Providers" (line ~549) | "The cascade falls back to `jina-embeddings-v3` (1024d Q4_K_M) when nomic isn't pulled." | #2 | Same: no jina manifest. The Ollama probe cannot fall back to jina. Remove the jina fallback clause. | P2 |
| F4 | `README.md` Memory Engine Configuration (lines ~1312, ~1318, ~1321, ~1347) | Repeated "previously `ollama-jina-v3`" / "falls back to **jina-embeddings-v3** if nomic isn't pulled" / "jina-v3 fallback would produce …" | #2 | Historical "previously jina" notes are tolerable, but the *active* "falls back to jina-embeddings-v3" claim (line ~1321) is stale — drop it. The provider OPTIONS (Voyage/OpenAI/HF-local) themselves are accurate. | P2 |

Confirmed accurate in root README (NOT drift): the Voyage/OpenAI/HF-local provider entries (providers exist in `factory.ts`); the MMR / `SPECKIT_MMR` / `SPECKIT_RERANK_LAYER` descriptions (algorithmic MMR + retrieval-rescue both present); lines ~862 and ~1210 "37 tools".

### 3.2 `system-spec-kit` skill `README.md` + `SKILL.md`

| # | File:Section | Stale claim | Conflicts | Correction | Sev |
|---|---|---|---|---|---|
| F5 | `system-spec-kit/SKILL.md` "Security" (line ~423) | "`VOYAGE_API_KEY` and `COHERE_API_KEY` are read from the process environment only…" | #2 | Cohere is gone (`registry.ts:172` deletes the cohere reranker path; `COHERE_API_KEY` has no live consumer). Drop `COHERE_API_KEY`; keep `VOYAGE_API_KEY` (the Voyage embedder provider still exists). | P2 |
| F6 | `system-spec-kit/SKILL.md` "Code Graph and Search Routing" (line ~432) | "Use **Code Graph for semantic discovery, Code Graph for structural relationships**…" (says "Code Graph" twice) | #5 | Per the gate-tool-routing semantic fallback, semantic/token discovery is **Grep/Glob**: "Use Grep/Glob for semantic/token discovery, Code Graph for structural relationships." Matches the project `CLAUDE.md` SEARCH ROUTING. | P2 |

Confirmed accurate (NOT drift): the README "local-first cascade (Ollama → hf-local → OpenAI → Voyage)" provider tiers; README line ~278 "MMR diversity reranking (algorithmic, no model)" (exactly matches shipped behavior).

### 3.3 `system-skill-advisor` `README.md` + `SKILL.md`

| # | File:Section | Stale claim | Conflicts | Correction | Sev |
|---|---|---|---|---|---|
| F7 | `system-skill-advisor/README.md` "Pluggable embedder layer" (line ~200) | "a frozen `MANIFESTS` registry of **seven** text-tuned candidates (`nomic-embed-text-v1.5`, `mxbai-embed-large-v1`, `bge-small-en-v1.5`, `bge-large-en-v1.5`, `jina-embeddings-v3`, `bge-m3`, `snowflake-arctic-embed-l-v2.0`)" | #2 | The shared `MANIFESTS` array has exactly **one** entry (`nomic-embed-text-v1.5`). Replace the seven-candidate list with the single-manifest description. The advisor `registry.ts` is a re-export shim of `@spec-kit/shared/embeddings/registry.js`. | **P1** |
| F8 | `system-skill-advisor/README.md` FAQ (line ~280) | "The advisor depends on `system-spec-kit` only for the heavyweight embeddings stack … Non-embeddings code is fully isolated as of v0.2.0." | #3 | The advisor also re-exports the canonical IPC bridge `@spec-kit/shared/ipc/socket-server.js` (verified in `advisor mcp_server/lib/ipc/socket-server.ts`). The "only embeddings" isolation claim is now inaccurate. | P2 |

Confirmed accurate (NOT drift): `SKILL.md` "registers **8 public tools plus 1 internal trusted-caller tool** (9 total)" — exactly correct (4 `advisor_*` + 4 `skill_graph_*` public + gated `skill_graph_propagate_enhances`). The `'auto'` cascade-sentinel description one line below F7 is also correct.

### 3.4 MCP server READMEs + `ENV_REFERENCE.md`

| # | File:Section | Stale claim | Conflicts | Correction | Sev |
|---|---|---|---|---|---|
| F9 | `system-spec-kit/mcp_server/README.md` "Embedding Provider Cascade" (line ~44) | Ollama "selects the first pulled model in ADR-013 priority order (`nomic-embed-text-v1.5`, `jina-embeddings-v3`, `bge-m3`, `mxbai-embed-large-v1`)" | #2 | The Ollama menu / `MANIFESTS` is nomic-only. The jina/bge-m3/mxbai priority list is stale; the cascade tiers themselves (Ollama→hf-local→OpenAI→Voyage) are accurate. | P2 |

Confirmed accurate (NOT drift) — explicitly verified and REJECTED as false positives:
- `mcp_server/README.md` lines 47-49 (OpenAI/Voyage tiers, `EMBEDDINGS_PROVIDER=ollama|hf-local|openai|voyage`) — providers exist.
- `ENV_REFERENCE.md` line ~408 (4-tier cascade with dims) — accurate for mk-spec-memory.
- `ENV_REFERENCE.md` line ~150 (`SPECKIT_LAUNCHER_BRIDGE_DISABLED` → "secondary launchers print `LEASE_HELD_BY`") — correctly scoped to the opt-in legacy-rollback path, which genuinely still emits it.
- `system-skill-advisor/mcp_server/README.md`, `system-code-graph/mcp_server/README.md`, `mcp-code-mode/mcp_server/README.md` — all NO-DRIFT.

### 3.5 `feature_catalog/**`

| # | File:Section | Stale claim | Conflicts | Correction | Sev |
|---|---|---|---|---|---|
| F10 | `feature_catalog/19--feature-flag-reference/5-embedding-and-api.md` (lines ~30-32) | `EMBEDDINGS_PROVIDER` valid-values + `OPENAI_API_KEY`/`VOYAGE_API_KEY` rows are framed as the active embedder surface contradicting the README's single-manifest emphasis | #2 | These rows describe live mk-spec-memory providers (accurate). BUT line ~32 says Voyage uses **`voyage-4`** embeddings — `CLOUD_CANONICAL.voyage = 'voyage-code-3'`. Correct the Voyage model name `voyage-4` → `voyage-code-3`. (The rows otherwise stay.) | P2 |
| F11 | `feature_catalog/16--tooling-and-scripts/embedder-list-registry-inventory.md` (line ~28) | "The registry defines every shipped embedder (local Ollama models, **hosted models such as Voyage** and nomic, and any provider sidecars)" | #2 | `embedder_list` calls `listManifests()` = the single nomic manifest. Reword to "defines the single shipped manifest `nomic-embed-text-v1.5`"; do not imply Voyage is a registry manifest entry. | P1 |
| F12 | `feature_catalog/14--pipeline-architecture/embeddings-and-retry-api.md` (line ~25) | "local `ollama` with `unsloth/bge-base-en-v1.5-GGUF`, and finally `hf-local` with `onnx-community/bge-base-en-v1.5-ONNX` q8" | #2 | `DEFAULT_PROVIDER_MODELS` resolves ollama + hf-local to **nomic** (`nomic-embed-text:v1.5` / `nomic-ai/nomic-embed-text-v1.5`). The bge-base default names are stale; Voyage/OpenAI provider mentions are fine. | P2 |
| F13 | `feature_catalog/feature_catalog.md` "Result confidence scoring" | "**four** factors: margin (0.35), channel agreement (0.30), **reranker support (0.20)**, and anchor density (0.15)" + the "combines … reranker support …" sentence | #2 | `confidence-scoring.ts:35-36`: "former reranker weight (0.20) was removed with the LLM reranker." Current scorer = **three** factors. Drop reranker support; re-normalize description to 3 factors. | **P1** |
| F14 | `feature_catalog/19--feature-flag-reference/memory-roadmap-capability-flags.md` (line ~49) | "Feature file path: `19--feature-flag-reference/11-memory-roadmap-flags.md`" | #6 | The flag-reference docs were renumbered. Correct self-path → `19--feature-flag-reference/memory-roadmap-capability-flags.md`. | P1 |
| F15 | `feature_catalog/feature_catalog.md:348` + `feature_catalog/02--mutation/memory-indexing-memorysave.md:80` | "trigger matcher cache, tool cache and constitutional cache are all invalidated on write" / "All caches (trigger matcher, tool, constitutional)" | #5 | The shared post-mutation hook (`mutation-hooks.ts`) also invalidates the **entity-density** cache (`invalidateEntityDensityCache`). Add it to the enumeration. | P2 |
| F16 | `feature_catalog/feature_catalog.md` "10+ signal types … reranker support" (explainability) | lists "reranker support" as a detected signal | #2 | `result-explainability.ts` keeps "reranker" only in an example summary string; the reranker scoring weight is gone (see F13). Drop "reranker support" from the signal list for consistency. | P2 |
| F17 | `feature_catalog/feature_catalog.md:3269` "All **43** live MCP tool definitions (L1-L7) have Zod schemas" | tool-definition count | #1 | LOW-confidence: mk-spec-memory canonical = 37. The line is hedged "expanded by session/code-graph additions"; if `tool-input-schemas.ts` is mk-spec-memory-only the "43" overstates. Confirm intended scope, then align to 37 (or state the cross-server total explicitly). | P2 |

### 3.6 `manual_testing_playbook/**`

| # | File:Section | Stale claim | Conflicts | Correction | Sev |
|---|---|---|---|---|---|
| F18 | `manual_testing_playbook/19--feature-flag-reference/memory-roadmap-capability-flags.md` (lines ~80, ~87, ~103) | "Feature catalog: `19--feature-flag-reference/11-memory-roadmap-flags.md`" (x2) and "Feature file path: `19--feature-flag-reference/125-memory-roadmap-flags.md`" | #6 | Renumbered. Catalog source → `memory-roadmap-capability-flags.md`; this file's own self-path → `memory-roadmap-capability-flags.md`. | P1 |
| F19 | `manual_testing_playbook/manual_testing_playbook.md` scenario 135 (lines ~2673, ~2676) | Instructs testers to `grep -r "// Feature catalog: <feature>" mcp_server/` and expect ≥2 hits | #5 | `constitutional/comment-hygiene.md` forbids catalog/spec/packet pointers in code comments. This scenario validates the existence of comments the comment-hygiene checker would strip. Rework to verify feature-source traceability without requiring `// Feature catalog:` code comments. | P1 |
| F20 | `manual_testing_playbook/19--feature-flag-reference/5-embedding-and-api.md` (lines ~22, ~42) + `manual_testing_playbook.md` (lines ~705, ~707) | embedder validation prompts reference "BGE local fallback model IDs" | #2 | The cascade providers exist but the BGE default model names are stale (defaults are nomic). Update the validation query strings to reference `nomic-embed-text-v1.5`. LOW-confidence (these are search-validation prompt strings, not behavior claims). | P2 |
| F21 | `manual_testing_playbook/manual_testing_playbook.md:2326` (Spec 007 evidence) | "MCP SDK stdio smoke PASS with **28** tools listed" | #1 | LOW-confidence / UNCERTAIN: this is a *recorded historical* Spec-007 verification snapshot, not necessarily a live baseline. Canonical now 37. Confirm whether 28 was the historical count; if it is used as a live validation target, update to 37. | P2 |

---

## 4. NO-DRIFT CONFIRMED (checked and accurate)

- **`system-code-graph` `README.md` + `SKILL.md`** — accurate; the byte-identical socket-server copy + drift test is internal and not (mis)described.
- **All `cli-*` skill docs** (`cli-claude-code`, `cli-codex`, `cli-devin`, `cli-gemini`, `cli-opencode` README+SKILL) — no embedder/tool-count/launcher drift. (Exception: `cli-opencode/README.md:38` "40+ tools" — see F22 below.)
- **`.opencode/skills/README.md`** index — see F22/F23 (minor tool-count consistency).
- **All deep-loop skill docs** (`deep-ai-council`, `deep-improvement`, `deep-loop-runtime`, `deep-research`, `deep-review` README+SKILL) — NO-DRIFT.
- **`mcp-chrome-devtools`, `mcp-click-up`, `mcp-code-mode`** README/SKILL — NO-DRIFT relative to the 7 change-areas (pass-06's Code-Mode-config findings were out-of-scope; see §5).
- **`sk-code-review`, `sk-doc`, `sk-prompt`, `sk-prompt-small-model`** README+SKILL — NO-DRIFT.
- **`feature_catalog` governance** (`17--governance/249-253`) and **mutation** (`02--mutation/017-026`) — NO-DRIFT (gate-enforcement rule pack correctly describes "three overlays / Gate 1-3"; comment-hygiene checker correctly referenced).
- **`manual_testing_playbook`** embedder scenarios (270/271/272), daemon-probe (267), orphan (273), setup (261), governance (274-278) — NO-DRIFT.
- **mk-spec-memory MCP README + ENV_REFERENCE** embedder cascade + `LEASE_HELD_BY` rollback row — verified ACCURATE (see §3.4).

### Two additional minor consistency items (skills index / cli-opencode)

| # | File:Section | Stale claim | Conflicts | Correction | Sev |
|---|---|---|---|---|---|
| F22 | `cli-opencode/README.md:38` | "Spec Kit Memory's **40+** tools … all callable" | #1 | Ground truth 37. Correct → "37 tools". | **P1** |
| F23 | `.opencode/skills/README.md:28` + `:46` | "four `advisor_*` tools and **four** `skill_graph_*` tools"; "Native advisor tools \| **8**" | #1 | These count the public surface (8). Canonical total is 9 (the root README + advisor SKILL.md say 9 = 4 + 5 incl. internal `skill_graph_propagate_enhances`). Either say "five `skill_graph_*`" / "9" or label the count "public surface" for consistency. | P2 |

(F22/F23 surfaced in the cli/skills passes; folded here for completeness — net P0=1, P1=8, P2=12.)

---

## 5. FALSE-POSITIVE CLASS (rejected — recorded so a remediator does NOT "fix" accurate docs)

The review passes produced ~45 candidate findings that were **rejected after code verification**. Do not act on these:

1. **"mk-spec-memory reranking/MMR removed"** (~18 candidates across root README, `system-spec-kit` README/SKILL, `feature_catalog` 004-hybrid-search / 106-embedding-cache / 273-1 / 277-5). REJECTED: `SPECKIT_MMR`, `INTENT_LAMBDA_MAP`, `stage3-rerank.ts`, and `retrieval-rescue.ts` (`SPECKIT_RERANK_LAYER`) are all present and untouched this session. Only the **LLM cross-encoder reranker weight** was removed (captured precisely in F13/F16).
2. **"Remove Voyage/OpenAI/HF-local embedder providers"** (~12 candidates). REJECTED: `CLOUD_CANONICAL` + `CanonicalProvider` + `factory.ts` retain all four providers; only the swappable-model `MANIFESTS` array is single-entry.
3. **advisor "9 tools" is wrong** (1 candidate). REJECTED: `SKILL.md` "8 public + 1 internal (9 total)" is correct.
4. **`ENV_REFERENCE.md:150` `LEASE_HELD_BY` is stale** (1 candidate). REJECTED: correctly scoped to the opt-in rollback path.
5. **`dead-code-removal.md` lists `cross-encoder.ts`** (2 candidates). REJECTED: it is a removal record; `cross-encoder.ts` is confirmed deleted, so listing it as removed is correct.
6. **`feature_catalog.md` "Six guard/edge-cases → Seven (E7)"** (1 candidate). REJECTED: the E1-E6 series is a 010-graph-signal batch; the 013/005 status-derivation "E7" is a separate packet, not a 7th entry here.
7. **`mcp-click-up` / `mcp-code-mode` Code-Mode-config findings** (5 candidates, pass-06). REJECTED: out of scope — unrelated to the 7 session change-areas.

---

## 6. COVERAGE & GAPS

**Coverage:** all 10 partitioned passes completed (exit 0); no pass timed out. Doc areas covered:

| Pass | Area | Result |
|------|------|--------|
| 01 | Root `README.md` | findings (F1-F4) |
| 02 | `system-spec-kit` README+SKILL | findings (F5-F6) |
| 03 | `system-skill-advisor` README+SKILL | findings (F7-F8) |
| 04 | `system-code-graph` README+SKILL | NO-DRIFT |
| 05 | `.opencode/skills/README.md` + all `cli-*` | findings (F22-F23) |
| 06 | deep-* / mcp-* / sk-* skills | NO-DRIFT (in-scope) |
| 07 | MCP server READMEs + `ENV_REFERENCE.md` | findings (F9) |
| 08 | `feature_catalog` embedder + flag-ref files | findings (F10, F14, partial) |
| 09 | `feature_catalog.md` master + governance + mutation | findings (F11-F17) |
| 10 | `manual_testing_playbook` targeted | findings (F18-F21) |

**Explicit gaps (not exhaustively read):**
- `feature_catalog/**` (319 files) and `manual_testing_playbook/**` (412 files) were **topically pre-filtered** to the files that mention the 7 change-areas (embedders, reranking, launcher/lease, MCP-tool-count, flag-renumbering, governance gates), then those files were read in full. Files with **no** topical match to the 7 changes were not individually opened — drift from these specific changes cannot live there, but a blind file-by-file pass was out of budget. This is the only coverage gap.
- Skill `references/**` / `assets/**` subtrees were **out of scope** by the request (skill `README.md`/`SKILL.md` only). The prior packet `009-readme-and-references-accuracy` (2026-06-03, 142 fixes) already swept those, but predates this session.
- `sk-code` and `sk-git` were excluded by the request.

**Confidence:** P0/P1 findings are each tied to a quoted stale string AND a verified code fact. The four `*-LOW/UNCERTAIN*` P2 items (F17, F21, and the historical-evidence "28 tools") are explicitly flagged for human confirmation rather than asserted as drift.

---

## 7. TOP DOC FILES NEEDING UPDATES (priority order)

1. **`README.md`** (root) — F1 (P0: tool table 36→37, L6 6→7) + jina fallback cleanup (F2-F4).
2. **`feature_catalog/feature_catalog.md`** — F13 (P1: confidence scoring 4→3 factors), F11/F16/F15/F17.
3. **`feature_catalog/19--feature-flag-reference/5-embedding-and-api.md`** — F10 (Voyage `voyage-4`→`voyage-code-3`).
4. **`feature_catalog/.../283-` + `manual_testing_playbook/.../311-` roadmap-flag files** — F14/F18 (P1: renumbered cross-refs `11-`/`125-` → `283-`/`311-`).
5. **`system-skill-advisor/README.md`** — F7 (P1: seven-candidate MANIFESTS → single nomic).
6. **`cli-opencode/README.md`** — F22 (P1: "40+" → 37).
7. **`manual_testing_playbook/manual_testing_playbook.md`** — F19 (P1: scenario 135 contradicts comment-hygiene).
8. **`system-spec-kit/SKILL.md`** — F5/F6 (Cohere key; duplicate "Code Graph" semantic-routing).
