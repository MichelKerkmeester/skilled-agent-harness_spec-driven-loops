# Iteration 1: D1 Correctness — entry-point and leaf-root claims

## Focus
Dimension: correctness. Verify SKILL.md / README / package-map public-entry claims against `packages/cli-communication-projection/package.json` exports and `src/*/index.ts`. Check `leaf-manifest.config.json` leafRoots against on-disk trees.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 8
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.55

## Findings

### P0, Blocker
(none)

### P1, Required
- **F001**: Skill advertises non-existent `./clients` package subpath export, `.opencode/skills/sk-communication/SKILL.md:130`, SKILL HOW IT WORKS lists public subpath exports including `./clients`, but `packages/cli-communication-projection/package.json:16-56` exports only `.`, `./contracts`, `./versioning`, `./doctor`, `./release`, `./providers`, `./runtimes`, `./privacy`, `./evaluation`, `./observability`. No `./clients` key exists; `rg` finds no consumer import of that subpath. Same false claim at `.opencode/skills/sk-communication/README.md:61`. Agents following the skill will fail to import a documented surface. Dimension: correctness. Recommendation: remove `./clients` from the advertised export list (or add a real package export if clients become public) and mention the real `./contracts` / `./versioning` subpaths.

### P2, Suggestion
- **F002**: `leafRoots` includes missing `assets/` directory, `.opencode/skills/sk-communication/leaf-manifest.config.json:6`, Config declares `"assets"` among leafRoots, but `.opencode/skills/sk-communication/assets` does not exist. `generate-leaf-manifest.cjs` silently skips empty/missing roots (`collectStandaloneLeaves` walk), so emitted `leaf-manifest.json` has zero `assets/` leaves. Scaffold leftover that misstates package shape. Dimension: correctness. Recommendation: drop `assets` from `leafRoots` until an assets tree is authored, then regenerate the manifest.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | SKILL.md:130 vs package.json:16-56 | Public API claim mismatch (F001) |
| checklist_evidence | pending | hard | — | Deferred to D3 |

## Assessment
- New findings ratio: 0.55
- Dimensions addressed: correctness
- Novelty justification: First pass; F001 is a concrete export-map contradiction; F002 is config/fs drift. Claimed symbols `selectPrivacyRoute`, `executeProviderRoute`, `runCompatibilityDoctor`, `evaluateReleaseReadiness`, and package-map fidelity/core entry points resolve in `src/*/index.ts`.

## Ruled Out
- Fabricated missing core symbols for package-map table: all listed entry points resolve under `src/` (evidence: privacy/index.ts:5, providers/index.ts:8, doctor/index.ts:13, release/index.ts:12-13, fidelity/render/core/context/contracts/evaluation indexes).

## Dead Ends
- None this iteration.

## Recommended Next Focus
D2 Security — audit privacy-before-ranking claims in SKILL rules vs package privacy/provider surfaces; check telemetry content-free claims; scan skill docs for credential/secret examples.

Review verdict: CONDITIONAL
