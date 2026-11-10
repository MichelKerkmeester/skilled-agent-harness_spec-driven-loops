# Iteration 2: Angle 2 — SYSTEM-SPEC-KIT

## Focus
Inventory the shipped system-spec-kit runtime: runtime/cli surface, validation rule count, template set and levels, acceptance-criteria and goal addons, trigger index and manifest, shared package, and what the /speckit:* commands do today.

## INVENTORY

| Surface | Value | SOURCE |
|---|---|---|
| Runtime root | `.opencode/skills/system-spec-kit/runtime/cli/` (nested runtime; no root `scripts/`, no root `mcp-server/`) | ls of system-spec-kit root + runtime/cli |
| Spec lifecycle scripts | spec/validate.sh, spec/create.sh, spec/repair-derived.cjs, spec/recommend-level.sh, spec/archive.sh, spec/quality-audit.sh, spec/progressive-validate.sh, spec/upgrade-level.sh, spec/calculate-completeness.sh, spec/check-completion.sh, spec/check-template-staleness.sh, spec/scaffold-debug-delegation.sh | runtime/cli/spec/ ls |
| Validation rules | 39 `check-*` rule files under runtime/cli/rules/ (check-ac-closure.sh … check-toc-policy.sh) | runtime/cli/rules/ ls (count) |
| Continuity | runtime/cli/continuity/generate-context.ts (TypeScript, not .js), backfill-frontmatter.ts, backfill-research-metadata.ts, migrate-trigger-phrase-residual.ts, validate-memory-quality.ts | runtime/cli/continuity/ ls |
| Description generator | runtime/cli/spec-folder/generate-description.ts | find output |
| Retrieval lane | runtime/cli/retrieval/: generate-trigger-index.mjs, lookup-trigger-index.mjs, rg-wrapper.mjs, measure-cold-lookup.mjs, sweep-memory-residue.mjs, lib/ | retrieval/ ls |
| Trigger index | committed at runtime/data/trigger-index.json, generated from trigger_phrases frontmatter across specs/, .opencode/skills/, .opencode/install-guides/ | retrieval/README.md; runtime/data/ ls |
| Config manifests | runtime/cli/config/config.jsonc + filters.jsonc | config/ ls |
| Templates core | 4 templates, 1,275 lines total: spec.md.tmpl (427), plan.md.tmpl (411), tasks.md.tmpl (283), implementation-summary.md.tmpl (154) | wc -l |
| Templates addons | 10 addons: acceptance-criteria, before-after, debug-delegation, decision-record, goal, handover, research (946 lines), resource-map, roadmap, timeline | addons/ ls; wc -l |
| Research template gating | `<!-- IF level:2,3,3+,phase -->` at lines 150/327 — level-gated addenda confirmed | research.md.tmpl:150,327 |
| Shared package | runtime/cli/shared/ + top-level shared/: gate-3-classifier.ts, review-research-paths.cjs, trigger-extractor.ts, frontmatter/, algorithms/, workspace/ | shared/ ls |
| /speckit:* commands today | 6: complete (14+ steps, :auto/:confirm/:autopilot), implement (9 steps), plan (8 steps), resume (continuity recovery), save (canonical continuity save), search (trigger-index + ripgrep front door) | .opencode/commands/speckit/*.md frontmatter |

## DRIFT

| Draft line | Claim | Verdict | Actual state | Severity | Correction | SOURCE |
|---|---|---|---|---|---|---|
| "The commands you type every day — `memory_search`, `memory_save`, ... behave as before" | memory_search / memory_save are daily commands | FALSE | No memory commands exist; retrieval front door is /speckit:search (trigger-index lookup + ripgrep recipes); memory MCP decommissioned, residue sweeper kept (sweep-memory-residue.mjs) | P0 | Draft names a decommissioned surface; the command is /speckit:search | .opencode/commands/speckit/search.md; retrieval/README.md |
| "the retrieval behind memory_search and context recovery" | A memory engine (embeddings, BM25/FTS fallback, bi-temporal edges) exists | STALE | Retrieval is lexical: committed trigger-index.json + rg-wrapper.mjs ripgrep lane; no embedder, no FTS in the retrieval lane | P0 | Memory-engine paragraph describes the decommissioned subsystem | retrieval/README.md; runtime/data/trigger-index.json |
| "templates consolidated ... dropping the source from 2,931 to 1,314 lines" | Core template source is 1,314 lines | STALE | Core templates total 1,275 lines (spec 427, plan 411, tasks 283, impl-summary 154) | P2 | Count is 1,275, not 1,314 (further reductions since draft) | wc -l templates/core/*.tmpl |
| "a Level 1 spec gets a 175-line research doc instead of a 944-line one" | Level-gated research template | TRUE (gated) | research.md.tmpl is 946 lines with `<!-- IF level:... -->` gating; exact 175-line output not verifiable without running generate-context (out of scope) | P2 | Gating confirmed; rendered size unverified | research.md.tmpl:150,327 |
| "spec-kit runtime renamed and nested" (briefing) | runtime/cli/ replaces scripts/ and mcp-server | TRUE | No scripts/ or mcp-server/ at skill root; runtime/cli/{spec,continuity,spec-folder,retrieval,validation} present | — | Confirmed | system-spec-kit root ls |

## Sources Consulted
- .opencode/skills/system-spec-kit/runtime/cli/** (ls, find, wc), templates/core + addons, retrieval/README.md
- .opencode/commands/speckit/*.md frontmatter
- CHANGELOG-v4.0.0.0.md draft lines

## Assessment
- **newInfoRatio**: 1.0 — second angle, entirely new surface (rules count, template lines, retrieval lane).
- **Confidence**: Confirmed for all listed rows (files opened or listed). Rendered research-doc size unverified (would require running generate-context, forbidden).

## Reflection
- Worked: `find` + `wc -l` + targeted `ls` gives exact counts cheaply.
- Failed: nothing failed; the 175-line claim cannot be executed (write-out-of-lineage risk).
- Ruled out: reading the runtime TypeScript bodies — the surface inventory is registry/CLI-level, matching the angle scope.

## Recommended Next Focus
Angle 3: SYSTEM-DEEP-LOOP — modes, executor-config.ts allowlists (PI_SUPPORTED_MODELS, DEVIN_SUPPORTED_MODELS, CURSOR_SUPPORTED_MODELS), fan-out flags, convergence modes, ledger/reducer; check draft deep-loop claims.
