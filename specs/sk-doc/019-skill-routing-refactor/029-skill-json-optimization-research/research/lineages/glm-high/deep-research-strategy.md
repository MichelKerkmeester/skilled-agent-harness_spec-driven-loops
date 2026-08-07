# Deep Research Strategy - glm-high lineage

## 2. TOPIC
Skill & advisor JSON optimization across `.opencode/skills/`: are the per-skill root metadata JSONs and the skill-advisor's own routing data as optimized, automated, effective, tested, and integrated as they can be — and where are the highest-leverage gaps? Findings only; no implementation.

## 3. KEY QUESTIONS (remaining)
- [ ] Q1 INVENTORY: Which JSON types exist, which are authored vs generated, and what is the presence/automation coverage per H/S class?
- [ ] Q2 OPTIMIZATION: Which fields are redundant, unused, drift-prone, or have no consumer; what can consolidate?
- [ ] Q3 AUTOMATION: What still needs hand-authoring that a scaffolder/generator could emit; where is scaffolder coverage thin?
- [ ] Q4 EFFECTIVENESS: Does the JSON data actually drive advisor routing well; intent-signal coverage; load-bearing fields; routing quality?
- [ ] Q5 TESTING/INTEGRATION: Per-JSON test and CI gate coverage; end-to-end scaffold→gate→advisor-ingest→routing; failure modes?

## 4. NON-GOALS
- Do NOT implement fixes (findings only).
- Do NOT redesign the advisor scoring algorithm.
- Do NOT change the H/S class contract fundamentally.

## 5. STOP CONDITIONS
- max-iterations=5 reached (stopPolicy=max-iterations; convergence is telemetry only — broaden angles, do not synthesize early).

## 6. ANSWERED QUESTIONS
- [x] Q1 INVENTORY: 11 roots (7H/4S); 8 JSON types; presence matrix matches contract; pipeline mapped; advisor has compiler+scorer dual ingestion; derived.causal_summary/supported_surfaces/peer_resource_categories validated but no routing consumer found.
- [x] Q2 OPTIMIZATION: dead fields = supported_surfaces/peer_resource_categories/manual.*; validated-only = causal_summary; highest-leverage = no skill-root derived regenerator (drift); domains∩intent_signals double-counting; hub-router IS consumed by compiled-route-manifest.
- [x] Q3 AUTOMATION: skill-root derived regenerator feasible (most fields corpus-derivable) but absent; leaf-manifest.config ~90% boilerplate; command-metadata not auto-suggested; HIGH-LEVERAGE graph-metadata validation split (fleet gate does identity-only, advisor compiler not wired into CI); rich derived has no template.
- [x] Q4 EFFECTIVENESS: extreme fleet signal variance (intSig 3-64); advisor own skill thinnest (4); lexical+derived lanes consume JSON; dead fields routing-neutral; domains∩intent_signals double-count; file paths scored as keywords; HIGH-LEVERAGE command-metadata.json gated but NOT ingested by advisor (hardcoded COMMAND_BRIDGES).
- [x] Q5 TESTING/INTEGRATION: one CI workflow (routing-registry-drift) gates skill JSON; advisor compiler NOT in CI; test coverage uneven (leaf-aliases 1, command-metadata 2); routing-accuracy corpus offline not CI-gated; three chain breaks (derived schema not in CI, command-metadata not ingested, no derived freshness gate); malformed derived silent until offline rebuild.

## 7. WHAT WORKED
- Contract-first H/S verification via single enumeration (iter 1)
- Reading compiler AND scorer to separate 'validated' from 'consumed' (iter 1)

## 8. WHAT FAILED
- generate-description.js is spec-folder, not skill-root — schema confusion risk (iter 1)

## 9. EXHAUSTED APPROACHES
[populated when an approach is tried from multiple angles without success]

## 10. RULED OUT DIRECTIONS
- hub-router.json as dead field: refuted — compiled-route-manifest.cjs:405-420 consumes it (iter 2)
- dead fields harm routing: refuted — routing-neutral, never enter any projection (iter 4)

## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Saturated: none yet
- Remaining frontier: none recorded

## 11. NEXT FOCUS
SYNTHESIS — rank all findings into a single opportunity map by leverage across five dimensions; mark cross-dimension clusters (derived-regenerator gap = optimization+automation+testing; command-metadata-not-ingested = effectiveness+integration).

## 12. KNOWN CONTEXT
- 11 skill roots under `.opencode/skills/`: 7 H-class hubs (cli-external-orchestration, mcp-tooling, sk-code, sk-design, sk-doc, sk-prompt, system-deep-loop) and 4 S-class standalones (mcp-code-mode, sk-git, system-skill-advisor, system-spec-kit).
- Contract: `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md` (8 metadata files; H/S class via mode-registry.json+hub-router.json declaration).
- Pipeline scripts: `sk-doc/create-skill/scripts/{init_skill.py,generate-leaf-manifest.cjs,ci-skill-root-metadata.cjs,ci-leaf-manifest-freshness.cjs}`; `system-spec-kit/scripts/dist/{spec-folder/generate-description.js,graph/backfill-graph-metadata.js}`; `.opencode/bin/{compiled-route-manifest.cjs,lib/compiled-route-manifest.cjs}`.
- `description.json` is H-only and "no production consumer reads a skill-root description.json" (contract §3) — advisor ingests graph-metadata.json.

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 (forced; convergence telemetry only)
- Per-iteration budget: 12 tool calls, 60 min
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis
- Started: 2026-07-29T08:10:00Z
