---
title: "Arc 022 Follow-Ons: MCP Recovery, Validator 6-Bug Fix, RERANKER Canonical Fill"
description: "Four post-arc operational debts cleared in one bundle: mk_skill_advisor MCP -32000 recovery via stale WAL and dist JSON copy. validate-doc-model-refs.js 6-bug fix restoring correct exit codes and false-positive elimination. opencode reactive-EOF mitigation shipped then reverted same-day. RERANKER_CANONICAL voyage/cohere vendor defaults filled."
trigger_phrases:
  - "022/011 arc followons"
  - "mk_skill_advisor MCP recovery"
  - "validate-doc-model-refs.js fix"
  - "reactive-EOF idle kill mitigation"
  - "RERANKER_CANONICAL voyage cohere"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/011-arc-022-followons`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

After all 12 phases of the 022 hardcoded-default remediation arc converged, three independent operational debts plus one canonical-fill item surfaced. The `mk_skill_advisor` MCP server had accumulated a 4.1 MB stale SQLite WAL, an orphan IPC socket plus a missing `data/prompt-policy.default.json` in the compiled `dist/` tree (tsc does not copy non-TS assets), causing persistent `-32000` reconnect failures. The `validate-doc-model-refs.js` validator shipped in phase 010 had six bugs that combined to swallow all canonical lookups via uncaught TypeErrors, causing incorrect exit codes plus false positives on valid model names. The `RERANKER_CANONICAL` registry entries for voyage and cohere held empty placeholders from phase 005.

All four items shipped in one bundle via mixed executors. Step 3 (opencode reactive-EOF mitigation) was reverted same-day per operator directive: the operator accepted the upstream Bun.js behavior and preferred manual session restarts over a persistent wrapper. Steps 1, 2 plus 4a remain active. Four follow-on items were deferred and captured in the spec.

### Added

- `data/prompt-policy.default.json` manually copied into `dist/system-skill-advisor/mcp_server/data/` to restore MCP launcher connectivity after `npm run build` omits non-TS assets
- `RERANKER_CANONICAL` entries for `voyage` (`'rerank-2.5'`) and `cohere` (`'rerank-v3.5'`) with bench-validation TODO comment in `registry.ts`

### Changed

- `validate-doc-model-refs.js`: added `/g` flag to two `matchAll` regexes (lines 41-42 and 55-56), added `'sbert/'` to `MODEL_ORG_PREFIXES`, allowed `/` in `orgNamePattern` suffix, corrected path resolution from three hops to two hops. Wrapper-prefix normalization added so `sbert/X` canonical names also match the unwrapped form `X`.
- `cli-opencode/SKILL.md` rule 5 broadened `</dev/null` requirement from background loops to any non-interactive invocation, with a note to not auto-kill external operator-owned opencode sessions (post-reversion state)

### Fixed

- MCP `-32000` reconnect failure caused by stale 4.1 MB SQLite WAL, a leaked IPC socket plus missing `prompt-policy.default.json` in compiled dist. Recovery: killed stale processes, cleared stale state, rebuilt. Manually copied the JSON asset.
- Validator `matchAll` calls without the `/g` flag threw `TypeError` silently swallowed by outer `try/catch`, producing empty canonical sets and invalid exit codes. Both sites now use `/gs` flags.
- Validator false positives on `Qwen/Qwen3-Reranker-0.6B` and `sbert/nomic-ai/CodeRankEmbed` caused by missing org-prefix and suffix-slash patterns. Both patterns added.
- Validator path resolution used three hops (`../../../system-spec-kit/...`) instead of two from the `scripts/` directory, preventing registry and CocoIndex config from loading at all.

### Verification

| Check | Result |
|---|---|
| MCP launcher probe with `SPECKIT_IPC_SOCKET_DIR=/tmp/mk-skill-advisor` | PASS. Log shows `LEASE_HELD_BY` line. |
| Validator exits 1 on remaining-drift docs | PASS. No longer exits 0 swallowing all results. |
| Validator no longer flags `Qwen3-Reranker-0.6B` or `sbert/-wrapped` canonical names | PASS. |
| `registry.ts`: `voyage='rerank-2.5'` plus `cohere='rerank-v3.5'` with TODO comment | PASS. |
| `system-spec-kit typecheck:root` | PASS. Exit 0. |
| Strict-validate phase 011 | PASS. |

### Files Changed

| File | What changed |
|---|---|
| `.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js` | Six bug fixes: `/g` flag on two `matchAll` regexes, `sbert/` org-prefix addition, `/` in suffix pattern, path-resolution hop count, wrapper-prefix normalization. |
| `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts` | `RERANKER_CANONICAL` voyage and cohere defaults filled with vendor-documented names plus bench-validation TODO. |
| `.opencode/skills/cli-opencode/SKILL.md` | Rule 5 broadened to any non-interactive invocation. Post-reversion note added to exclude operator-owned sessions from auto-kill. |
| `.opencode/skills/system-skill-advisor/mcp_server/data/prompt-policy.default.json` | Runtime copy into `dist/` tree restored MCP connectivity (tsc build omits non-TS assets). |

### Follow-Ups

- Add a `postbuild` step to `package.json` that copies `data/*.json` into `dist/system-skill-advisor/mcp_server/data/` so manual re-copy after `npm run build` is no longer required.
- Add a canonical source for llama-cpp `HF_EMBEDDINGS_MODEL` defaults (`onnx-community/embeddinggemma-300m-ONNX` and related) so the validator's remaining six legitimate drift hits can be resolved or suppressed via a documented marker.
- Wire `validate-doc-model-refs.js` as an advisory pre-commit hook once the llama-cpp canonical source is added and those drift hits are no longer open.
- Bench-validate voyage `rerank-2.5` and cohere `rerank-v3.5` on the project fixture to confirm the vendor-documented defaults match actual performance before promoting them to bench-locked status.
- Wire `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` env-var override into `lane-registry.ts` with a bench-diff to confirm zero behavior change when the env var is unset (deferred from this packet).
