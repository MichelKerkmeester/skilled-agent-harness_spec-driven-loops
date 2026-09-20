# Iteration 1: sk-code and OpenCode Alignment

## Focus

Lane 1 of the packet spec: `.opencode/skills/sk-code/` (SKILL.md, mode-registry.json, hub-router.json, leaf-manifest.json, sk-code-opencode surface packet, sk-code-quality/sk-code-review packets) against what the deep-loop runtime and the command YAMLs under `.opencode/commands/deep/` actually do, and against the OpenCode surfaces in `.opencode/agents/`, `.opencode/plugins/` and `opencode.json`.

Files reviewed:
- `.opencode/skills/sk-code/SKILL.md`
- `.opencode/skills/sk-code/mode-registry.json`
- `.opencode/skills/sk-code/hub-router.json`
- `.opencode/skills/sk-code/leaf-manifest.json`
- `.opencode/skills/sk-code/sk-code-opencode/SKILL.md`
- `.opencode/skills/sk-code/sk-code-quality/SKILL.md`, `.opencode/skills/sk-code/sk-code-review/SKILL.md` (version fields)
- `.opencode/skills/sk-code/graph-metadata.json` (existence), `.opencode/bin/compiled-route.cjs`
- `opencode.json`
- `.opencode/plugins/system-deep-loop-guard.js`, `.opencode/plugins/sk-code-post-edit-quality.js` (headers)
- `.opencode/commands/deep/assets/deep-review-presentation.txt:440-472`
- `.opencode/commands/deep/assets/compiled/deep-review.contract.md:34,117` (mode-registry path refs)
- `.opencode/skills/sk-code/feature-catalog/compiled-routing-and-legacy-fallback/feature-catalog.md` (existence)

## Scorecard

- Dimensions covered: maintainability, traceability
- Files reviewed: 14
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P2, Suggestion

- **F001**: Version drift between sk-code hub SKILL.md and its mode-registry/hub-router, `.opencode/skills/sk-code/SKILL.md:5` vs `.opencode/skills/sk-code/mode-registry.json:3` and `.opencode/skills/sk-code/hub-router.json:3`. SKILL.md declares `version: 4.2.2.0` while the registry and hub-router both declare `4.1.0.1`. The hub's own doctrine (§2) names `mode-registry.json` "the single source of truth"; a stale version field on the source of truth undermines drift detection. Dimension: maintainability.

- **F002**: sk-code-opencode surface packet references review handoff modes by bare names, `.opencode/skills/sk-code/sk-code-opencode/SKILL.md:24-25`. "hand off formal findings-first review to `code-review` and author-side quality gates to `code-quality`" — the canonical `workflowMode` keys are `sk-code-review` / `sk-code-quality`; `code-review`/`code-quality` exist only as hyphen-less aliases in mode-registry.json. Cosmetic routing-name drift, but the surface packet's own routing language should use canonical keys. Dimension: maintainability.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | SKILL.md:5, mode-registry.json:3 | Lane-1 normative claims (registry-driven routing, single hub identity) verified against shipped files; version drift found, no normative contradiction |
| skill_agent | partial | advisory | sk-code-opencode/SKILL.md:24-25 | SKILL.md routing claims match registry + compiled router; naming drift F002 |
| feature_catalog_code | partial | advisory | feature-catalog/compiled-routing-and-legacy-fallback/feature-catalog.md | compiled-routing claim spot-checked: `.opencode/bin/compiled-route.cjs` exists with `servingAuthority` sentinel; full catalog audit deferred to iteration 4 |
| agent_cross_runtime | notApplicable | advisory | - | Lane 3 (iteration 3) |
| checklist_evidence | notApplicable | hard | - | No checklist.md in target packet (Level-2 scaffold) |

## Assessment

- New findings ratio: 1.0 (2 P2 findings, severity weight 2; accumulated 2)
- Dimensions addressed: maintainability, traceability
- Novelty justification: first iteration on this surface; both findings are first-seen
- Verdict mapping: P2-only -> PASS

## Ruled Out

- Compiled-router absence: `.opencode/bin/compiled-route.cjs` exists and emits the `servingAuthority` sentinel on fallback (grep line 47). Ruled out as a missing-path claim.
- Hub identity proliferation: `find .opencode/skills/sk-code -name graph-metadata.json` returns exactly one file (hub root). The "exactly one advisor identity" claim holds.
- Command-YAML routing contradiction: deep-review-presentation.txt:460 references `skill:sk-code` only as an example invocation; compiled deep-review.contract.md references `.opencode/skills/system-deep-loop/mode-registry.json` (a different, correct registry for the deep-loop hub). No contradiction.

## Dead Ends

- Deep diff of full .claude vs .opencode sk-code bodies: deferred to iteration 3 (agent cross-runtime lane) to avoid re-reading 200-line files twice.

## Recommended Next Focus

Iteration 2: deep-loop command alignment — read `.opencode/commands/deep/assets/deep-review-auto.yaml` and `deep-research-auto.yaml` (plus confirm variants and compiled contracts) against the runtime scripts they invoke and the references they digest; verify fan-out executor config surface, convergence-mode flag, and prompt-pack paths.

Review verdict: PASS
