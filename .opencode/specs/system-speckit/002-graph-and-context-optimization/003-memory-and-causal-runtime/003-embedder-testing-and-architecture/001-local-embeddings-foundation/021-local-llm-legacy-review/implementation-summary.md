---
title: "Implementation Summary: Local-LLM legacy and outdated-docs/config-drift review (post-014)"
description: "10-iter /deep:start-review-loop:auto run via cli-codex gpt-5.5 reasoning=high service_tier=fast surfaced 2 P0 + 83 P1 + 31 P2 findings (deduped). Verdict FAIL; hasAdvisories=true. The P0s are real bugs in shared/embeddings/factory.ts that contradict 014's documented ship state ('llama-cpp explicit opt-in'). Remediation packet 016 recommended."
trigger_phrases:
  - "015 implementation summary"
  - "local-llm legacy review summary"
  - "post-014 review verdict"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/021-local-llm-legacy-review"
    last_updated_at: "2026-05-13T14:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "10-iter deep-review complete; review-report.md + resource-map.md written; ≥3 P1 findings hand-validated against source"
    next_safe_action: "Scaffold 022-local-llm-legacy-remediation packet (cli-codex gpt-5.5 high fast batched dispatch, 013/003 precedent)"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/021-local-llm-legacy-review/review/review-report.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/021-local-llm-legacy-review/review/resource-map.md"
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
      - ".opencode/install_guides/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-deep-review-complete-2026-05-13"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Is the factory.ts llama-cpp auto-select P0 a documentation bug (014 narrative wrong) or a code bug (014 incompletely shipped)?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary: Local-LLM legacy and outdated-docs/config-drift review (post-014)

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. WHAT CHANGED

A new Level-2 review packet (`021-local-llm-legacy-review/`) was scaffolded under `002-graph-and-context-optimization/` and a **10-iteration `/deep:start-review-loop:auto` run** was executed against the full repo via cli-codex (gpt-5.5, reasoning=high, service_tier=fast, 900s/iter timeout). The run reduced from the originally planned 20 iters to 10 per user request mid-run (iters 1-2 preserved across the restart via a skip-existing guard). Output: `review/review-report.md` (188 lines, full 10-section structure) + `review/resource-map.md` + per-iter findings at `review/iterations/iteration-00{1..10}.md` + state log `review/deep-review-state.jsonl`. Zero git commits, zero mutations outside the packet — HEAD is still `5e7095d3336510b5756ba5cac383a8e08d1d79db` (recovery anchor).

---

## 2. VERDICT

**FAIL; hasAdvisories=true** — `P0=2 P1=83 P2=31` after dedup.

| Severity | Count | Dimension Mix |
|----------|-------|---------------|
| P0 | 2 | correctness (both in `factory.ts`) |
| P1 | 83 | correctness 30, traceability 53 |
| P2 | 31 | maintainability 29, correctness 2 |

The two P0s are **real code bugs**, not just doc residue:

1. **`shared/embeddings/factory.ts:819-823`** — `getLlamaCppAvailability()` returns `available=true` whenever the GGUF runtime is installed, and the factory then unconditionally returns `{ name: 'llama-cpp', reason: 'Default local provider (llama-cpp GGUF q8)' }` in the auto path. This **contradicts** 014's documented ship state in packet `017-llama-cpp-default-flip` ("hf-local restored as automatic default; llama-cpp explicit opt-in").
2. **`shared/embeddings/factory.ts:822`** — same auto-select; finding 2 anchors the literal `name: 'llama-cpp',` line.

This is a **doc/code divergence**: the 014 implementation-summaries claim llama-cpp is opt-in, but the runtime auto-selects it when installed.

---

## 3. HIGH-IMPACT P1 GROUPS

| Group | Files | Driver |
|-------|-------|--------|
| Runtime config notes (committed) | `.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json`, `.mcp.json`, `opencode.json` | All carry `Default 'auto' resolves to llama-cpp` — CONSISTENT with the P0 (they describe actual code behavior), but contrary to 014's documented intent |
| Stale embedding docs | `ENV_REFERENCE.md`, `references/memory/embedding_resilience.md`, `mcp-coco-index/{INSTALL_GUIDE,SKILL.md,README.md,references/settings_reference.md,assets/config_templates.md}`, `system-spec-kit/{README.md,shared/README.md,mcp_server/README.md}`, root `README.md`, `install_guides/README.md` | Still recommend Voyage primary, MiniLM default, `nomic-ai/nomic-embed-text-v1.5` default, `text-embedding-3-small` default, `voyage-3.5` default |
| Generic `context-index.sqlite` paths | `lib/eval/memory-state-baseline.ts`, `scripts/evals/{map-ground-truth-ids,run-ablation,run-bm25-baseline}.ts`, `scripts/memory/cleanup-index-scope-violations.ts`, `shared/embeddings/profile.ts`, `scripts/migrations/{create,restore}-checkpoint.ts`, `scripts/setup/install.sh` | Hardcoded legacy filename; should be profile-derived |
| Legacy `DEFAULT_MODEL_NAME` constants | `shared/embeddings.ts:868` (`nomic-ai/nomic-embed-text-v1.5`) | Pre-014 facade fallback |
| Installer success messages | `scripts/install-llama-cpp.sh:83`, `factory.ts:145` LLAMA_CPP_INSTALL_HINT | Both call llama-cpp the "faster default" |

---

## 4. P2 ADVISORIES (maintainability)

- 13 test fixtures and behavioral assertions still expect `nomic-ai/nomic-embed-text-v1.5`, `all-MiniLM-L6-v2`, or 384-dim vectors
- 6 feature-catalog / manual-testing-playbook entries reference MiniLM/Voyage defaults and `context-index.sqlite`
- 3 ONNX-runtime cleanup advisories: `onnxruntime-node`, `onnxruntime-common` package metadata and `check-native-modules.sh` probe remain after the 014/014 ONNX rejection

---

## 5. HAND-VALIDATION (≥3 P1 sample)

Spot-checked via direct `sed -n` reads — all evidence is real, no hallucinations:

- `ENV_REFERENCE.md:445` — exact match `"prefers Voyage \`voyage-4\` (1024 dims) ... then OpenAI \`text-embedding-3-small\` (1536 dims) ... otherwise falls back to local Hugging Face"` ✓
- `mcp-coco-index/INSTALL_GUIDE.md:101` — exact match `| **Embedding** | Configurable (default: all-MiniLM-L6-v2 local, recommended: Voyage Code 3) |` ✓
- `install_guides/README.md:671` — exact match `export VOYAGE_EMBEDDINGS_MODEL=voyage-3.5  # Default`; lines 675, 678 also confirm `text-embedding-3-small  # Default` and `nomic-ai/nomic-embed-text-v1.5  # Default` are equally stale ✓
- `factory.ts:819-825` (the P0) — exact match `const llamaCppAvailability = getLlamaCppAvailability(); if (llamaCppAvailability.available) { return { name: 'llama-cpp', reason: 'Default local provider (llama-cpp GGUF q8)', }; }` ✓

---

## 6. RM-8 SCOPE DISCIPLINE

| Check | Status |
|-------|--------|
| HEAD unchanged vs recovery anchor `5e7095d33` | ✓ |
| 015 packet content untracked (no auto-commit) | ✓ |
| No `rm`/`sed -i`/`mv`/`git rm` invoked by codex agents | ✓ |
| All iteration writes confined to `015-*/review/iterations/iteration-NNN.md` | ✓ |
| Files modified outside packet | All pre-existing parallel-track work from session start (per memory rule "worktree cleanliness is never a blocker") |

---

## 7. RUN METRICS

| Metric | Value |
|--------|-------|
| Iterations | 10 (reduced from 20 mid-run) |
| Walltime per iter (range) | 144s–283s, median ~165s |
| Total iter walltime | ~30 min |
| Synthesis walltime | ~5 min (well under 1800s ceiling) |
| Executor | cli-codex 0.130.0, gpt-5.5, reasoning=high, service_tier=fast |
| Codex sandbox | `workspace-write` (RM-8 Layer 1 prompt constraints) |
| Codex network access | Not needed (read-only review) |
| Pre-dedup raw findings | P0=2 P1=83 P2=31 / 116 across 10 iters |
| Post-dedup findings | P0=2 P1=83 P2=31 / 116 (no dedup needed — minimal overlap because of prior-findings injection in prompts) |

---

## 8. NEXT STEP RECOMMENDATION

**Scaffold `022-local-llm-legacy-remediation/`** (Level 2, sibling of 015 under 026 parent).

Batchable remediation groups per `review-report.md` §10:

1. **P0 fix:** `factory.ts` auto-path — remove `llama-cpp` from no-key auto resolution; require explicit `EMBEDDINGS_PROVIDER=llama-cpp`. Validate against 014/017's documented ship state.
2. **Runtime config notes** — align `.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json`, `.mcp.json`, `opencode.json` notes with the post-fix factory behavior.
3. **Database path handling** — replace hardcoded `context-index.sqlite` and `context-index__voyage__voyage-4__1024.sqlite` with active-profile resolution across eval/checkpoint/cleanup/setup scripts.
4. **CocoIndex docs** — README/INSTALL_GUIDE/settings_reference/SKILL.md/assets/config_templates: MiniLM/Voyage → `google/embeddinggemma-300m` bf16 768d.
5. **Memory MCP docs/fixtures** — ENV_REFERENCE/install_guides/feature_catalog/manual_testing_playbook: Voyage/Nomic/OpenAI/384d/generic-sqlite/ONNX residue.
6. **Generated assets** — regenerate feature catalogs and playbooks after source docs corrected.

Recommended dispatch pattern (013/003 precedent): cli-codex gpt-5.5 high fast in batches of ~7 findings per dispatch, ~28 min walltime per batch, zero out-of-scope writes. Re-review with `/deep:start-review-loop:auto` confirmatory pass after remediation to confirm FAIL → PASS transition.

---

## 9. OPEN QUESTIONS FOR USER

1. **P0 framing:** is the factory.ts auto-llama-cpp behavior the "actual ship state" (in which case the 014 implementation-summaries are wrong and need a correction), or is it incomplete code that 014 forgot to land (in which case the factory.ts is wrong)? The committed runtime configs (`.codex/config.toml` etc.) all say `auto resolves to llama-cpp`, suggesting the code is the truth-of-the-moment but the 014 narrative changed intent late without backing it up in factory.ts. Remediation 016 needs to pick which truth wins.
2. **Voyage cloud-fallback:** the factory still falls back to Voyage when `VOYAGE_API_KEY` is set. Is that intentional (cloud provider opt-in via env) or also residue?
