# Iteration 005 — Q5 Final Comprehensive Doc Sweep + Command-Mirror Closure

## Focus

Q5 — FINAL COMPREHENSIVE DOC SWEEP. Two parts:
(a) Close the command-mirror pattern: check sibling memory commands across all 4 runtimes for the same staleness found in the `search` commands.
(b) Sweep all live docs for remaining cross-encoder/cocoindex/getRerankerStatus/rerank-2.5/CodeRankEmbed claims not already catalogued in iters 1-4. Classify each as REPAIRABLE-STALE or INTENTIONAL-HISTORICAL.

## Actions Taken

1. **Command-mirror blast radius**: Checked `.codex/commands/memory/` and `.claude/commands/memory/` for any command files → **neither runtime has memory commands**. Read all 8 sibling command files across `.gemini/` (manage.toml, save.toml, learn.toml) and `.opencode/` (manage.md, save.md, learn.md) in full → **ALL CLEAN**. No cross-encoder/cocoindex/getRerankerStatus/rerank-2.5 references in any sibling command. The blast radius is limited to the `search` commands only (already catalogued as P1: `.gemini/commands/memory/search.toml` found iter-2, `.opencode/commands/memory/search.md` found iter-3).

2. **Grep'd all `.opencode/skills/` SKILL.md files** for cross-encoder/cocoindex → **ALL CLEAN** (zero hits in core skill knowledge files). System-spec-kit SKILL.md correctly documents the removal at lines 420-422 (verified in iter-3).

3. **Grep'd `ccc`/`coco-daemon` in all `.opencode/skills/*.md`** → 5 hits in cli-* SKILL.md single-dispatch discipline blocks, all with `pkill -9 -f "ccc search"`. Read each in full context.

4. **Swept `.opencode/skills/*/references/` and `feature_catalog/`** for remaining hits → 3 files with cross-encoder/cocoindex references. Read each and classified.

5. **Checked constitutional rules** → ALL CLEAN.

6. **Checked root *.md** (README.md) → ALL CLEAN.

## Findings

### Finding 26: P3 — All 5 cli-* SKILL.md files reference `pkill -9 -f "ccc search"` (stale CocoIndex CLI cleanup)

- **Severity:** P3 (harmless stale reference — killing nonexistent process)
- **Files:**
  - `.opencode/skills/cli-codex/SKILL.md:357`
  - `.opencode/skills/cli-claude-code/SKILL.md:350`
  - `.opencode/skills/cli-devin/SKILL.md:372`
  - `.opencode/skills/cli-opencode/SKILL.md:296`
  - `.opencode/skills/cli-gemini/SKILL.md:309`
- **Evidence:** Each file's "Single-dispatch discipline" section includes `pkill -9 -f "ccc search"` in the orphan-child cleanup command list. The `ccc` CLI was part of the removed CocoIndex/CodeRankEmbed infrastructure. No `ccc` binary exists in the current system. The pkill on a nonexistent process is harmless at runtime but the instruction is stale.
- **Classification:** **REPAIRABLE-STALE** — The `pkill -9 -f "ccc search"` / `gtimeout` / `positional_scoring_fallback:app` cleanup triple was inherited from the pre-014 era when CocoIndex (`ccc`) and positional-scoring-fallback were separate processes that could leak across dispatches. The `ccc` portion is stale. The `positional_scoring_fallback:app` portion may still be relevant (the positional fallback path still exists in stage3-rerank.ts). The remediation should remove `pkill -9 -f "ccc search"` but retain `gtimeout` and the `positional_scoring_fallback:app` pkill unless separately verified stale.
- **Impact:** Low — harmless at runtime (pkill on missing process is no-op). Cosmetic maintenance gap: these are operator-facing instructions, not model instructions, so they don't affect AI behavior.

### Command-Mirror Blast Radius Summary

| Runtime | `memory/search` | `memory/manage` | `memory/save` | `memory/learn` | `memory/context` |
|---------|:---:|:---:|:---:|:---:|:---:|
| `.codex/` | N/A (no file) | N/A | N/A | N/A | N/A |
| `.claude/` | N/A (no file) | N/A | N/A | N/A | N/A |
| `.gemini/` | **P1 STALE** | CLEAN | CLEAN | CLEAN | N/A |
| `.opencode/` | **P1 STALE** | CLEAN | CLEAN | CLEAN | N/A |

**Conclusion:** The command-prompt staleness is contained to the 2 `search` commands (`.gemini/` and `.opencode/`), already catalogued as P1 findings. No sibling command carries stale claims. `.codex/` and `.claude/` runtimes have no memory commands at all. There is no `memory/context` command in any runtime.

### Sweep-For-Completeness: Ruled Out (INTENTIONAL-HISTORICAL)

All remaining cross-encoder/cocoindex hits in live docs fall into the INTENTIONAL-HISTORICAL category:

| File | Lines | Why Historical |
|------|-------|----------------|
| `.opencode/skills/system-spec-kit/references/memory/embedder_pluggability.md` | 143, 176 | Documents Path A (cross-encoder) rejection and CocoIndex removal — both accurate historical description of the deprecation decision |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | 172 | Documents Stage 3 cross-encoder removal in the 014 deprecation — accurate historical record of what was removed |
| `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/04-dead-code-removal.md` | 24, 43, 95 | Documents variables/files that were removed in dead-code sweep — accurate record of what was deleted |
| `sk-doc/references/benchmark_creation.md` | 364 | Historical reranker swap discovery in a bake-off story — already catalogued in iter-3 as HISTORICAL |
| All changelogs (`v1.2.0.0`–`v3.4.1.0`) | various | Historical release notes — INTENTIONAL-HISTORICAL |
| All benchmark reports (`benchmark-2026-05-*`) | various | Historical benchmarks of the removed feature — INTENTIONAL-HISTORICAL |
| Constitutional rules (`constitutional/*.md`) | N/A | ALL CLEAN |
| `.opencode/skills/*/SKILL.md` (non-cli) | N/A | ALL CLEAN |

### COMPLETENESS CHECK

The full catalogue across all 5 iterations:

| Severity | Count | Items |
|----------|-------|-------|
| P1 | 4 | tool-schemas.ts rerank desc (iter-1), gemini search.toml (iter-2), opencode search.md (iter-3), sidecar-hardening.vitest.ts:545 (iter-1, confirmed iter-4) |
| P2 | ~8 | stage3-rerank.ts RerankProvider (iter-1), .vscode/mcp.json (iter-2), .devin/config.json (iter-2), system-code-graph SKILL.md:52 (iter-3), shared/types.ts scoringMethod (iter-3), shared/embeddings.ts:43 (iter-3), sk-doc validate-doc-model-refs.js (iter-3), sk-code code_organization.md:492 (iter-3) |
| P3 | 1 | 5x cli-* SKILL.md `ccc search` pkill (iter-5, new) |
| INFO/KEPT | ~6 | registry.ts mapping, always-null trace, hybrid-search test env, eval queries, stress corpus, doctor log |
| NO-REGRESSION | 4 | pipeline/rerank/rescue/confidence (iter-4), /doctor/speckit/council (iter-4), confidence math (iter-4) |
| REAL-GAP | 1 | Semantic code search via CocoIndex (iter-3, accepted) |
| COVERED | 1 | MMR + rescue replaces cross-encoder default path (iter-3) |

## Questions Answered

- **Q5 — ANSWERED.** Command mirror blast radius: ONLY the 2 search commands (`.gemini/commands/memory/search.toml` and `.opencode/commands/memory/search.md`) are stale. All sibling memory commands (manage, save, learn) across both runtimes are clean. `.codex/` and `.claude/` have no memory commands. One new finding discovered: 5 cli-* SKILL.md files contain stale `pkill -9 -f "ccc search"` references (P3, harmless). All other live-doc cross-encoder/cocoindex references in skills/ are INTENTIONAL-HISTORICAL (embedder docs, feature catalog, changelogs, benchmarks). The complete catalogue for the remediation packet is now finalized.

## Questions Remaining

None. All 5 questions (Q1–Q5) have been answered. The sweep is complete.

## Next Focus

Convergence reached. The deep-research loop has answered all 5 questions. The remediation packet now has a complete catalogue of ~14 items (4 P1, ~8 P2, 1 P3) plus ~12 RULED-OUT/INTENTIONAL items identified across all 5 iterations.
