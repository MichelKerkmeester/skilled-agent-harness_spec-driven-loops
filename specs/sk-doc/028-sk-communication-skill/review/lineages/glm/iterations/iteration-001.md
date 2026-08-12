# Iteration 1: D1 Correctness — entry-point and leaf-root claims

## Focus
Dimension: correctness. Independent verification of SKILL.md / README / package-map public-entry claims against `packages/cli-communication-projection/package.json` exports and `src/*/index.ts`. Check `leaf-manifest.config.json` leafRoots against on-disk trees and the generated `leaf-manifest.json` / `leaf-aliases.json`.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 9
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.55

## Findings

### P0, Blocker
(none)

### P1, Required
- **F001**: Skill advertises non-existent `./clients` package subpath export; bidirectional export-map drift. `.opencode/skills/sk-communication/SKILL.md:130`, SKILL §3 HOW IT WORKS lists public subpath exports as `@portable-cli/communication-projection`, plus `./providers`, `./privacy`, `./runtimes`, `./clients`, `./evaluation`, `./observability`, `./doctor`, `./release`. `packages/cli-communication-projection/package.json:16-56` exports only `.`, `./contracts`, `./versioning`, `./doctor`, `./release`, `./providers`, `./runtimes`, `./privacy`, `./evaluation`, `./observability` — there is NO `./clients` key. `src/clients/` exists on disk (`display.ts`, `index.ts`, `sidecar.ts`, `types.ts`) but is not exposed as a public subpath. The same false claim appears at `.opencode/skills/sk-communication/README.md:61`. Inversely, `./contracts` and `./versioning` ARE exported by the package but are NOT listed in SKILL.md:130 or README.md:61. An agent following the skill will attempt to import a documented surface that throws, and will miss two real surfaces. Dimension: correctness. Recommendation: align the advertised list with `package.json` exports — drop `./clients`, add `./contracts` and `./versioning`.

  **Claim adjudication packet:**
  ```json
  {
    "findingId": "F001",
    "claim": "SKILL.md and README advertise ./clients as a public subpath export, but package.json exports no such key; ./contracts and ./versioning are exported but unadvertised.",
    "evidenceRefs": [
      ".opencode/skills/sk-communication/SKILL.md:130",
      ".opencode/skills/sk-communication/README.md:61",
      "packages/cli-communication-projection/package.json:16-56"
    ],
    "counterevidenceSought": "Checked whether src/clients/ exists on disk (it does: display.ts, index.ts, sidecar.ts, types.ts) and whether any consumer imports @portable-cli/communication-projection/clients via rg — no consumer import found. Checked the package.json exports map twice for a ./clients key — absent. Checked dist/ for a clients entry point — not emitted.",
    "alternativeExplanation": "The package could be intentionally treating clients as internal-only while SKILL.md documents the on-disk subsystem rather than the public export. Rejected: SKILL.md:130 explicitly frames the list as 'subpath exports' consumed through the package, not as internal subsystem paths; the routing table at SKILL.md:49-56 separately names internal subsystem paths. The sentence conflates the two.",
    "finalSeverity": "P1",
    "confidence": 0.9,
    "downgradeTrigger": "If package.json adds a ./clients export (or SKILL.md/README rephrase the sentence to describe internal subsystem paths rather than public subpath exports), downgrade to P2 doc-clarity.",
    "transitions": [
      { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery: documented public export has no package.json entry; bidirectional drift" }
    ]
  }
  ```

### P2, Suggestion
- **F002**: `leafRoots` includes missing `assets/` directory. `.opencode/skills/sk-communication/leaf-manifest.config.json:6`, config declares `"leafRoots": ["references", "assets", "feature-catalog", "manual-testing-playbook"]`, but `.opencode/skills/sk-communication/assets/` does not exist (`ls` confirms absence). The generator silently skips missing roots, so emitted `leaf-manifest.json` contains zero `assets/` leaves (the 20 emitted leaves all live under `references/`, `feature-catalog/`, `manual-testing-playbook/`). Scaffold leftover that misstates package shape. Dimension: correctness. Recommendation: drop `assets` from `leafRoots` until an assets tree is authored, then regenerate the manifest and aliases.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | SKILL.md:130 vs package.json:16-56 | Public API claim mismatch (F001); bidirectional drift |
| checklist_evidence | pending | hard | — | Deferred to D3 |

## Assessment
- New findings ratio: 0.55
- Dimensions addressed: correctness
- Novelty justification: First pass; F001 is a concrete export-map contradiction with bidirectional drift (advertised-but-absent plus present-but-unadvertised); F002 is config/fs drift. Verified that claimed symbols `selectPrivacyRoute`, `executeProviderRoute`, `runCompatibilityDoctor`, `evaluateReleaseReadiness` resolve in `src/*/index.ts` (privacy/index.ts, providers/index.ts, doctor/index.ts, release/index.ts). `src/index.ts` barrel re-exports contracts/context/core/fidelity/observability/render/versioning only — not privacy/providers/runtimes/clients/doctor/release/evaluation, which is consistent with those being subpath-only exports.

## Ruled Out
- Fabricated missing core symbols for package-map table: all listed entry points resolve under `src/` (evidence: privacy/index.ts, providers/index.ts, doctor/index.ts, release/index.ts, fidelity/render/core/context/contracts/evaluation indexes present in `ls packages/cli-communication-projection/src/`).
- Missing leaf-manifest leaves: `leaf-manifest.json` carries 20 leaves, all resolving on disk; `leaf-aliases.json` carries 20 entries. Parity holds.

## Dead Ends
- None this iteration.

## Recommended Next Focus
D2 Security — audit privacy-before-ranking claims in SKILL rules vs package privacy/provider surfaces; check telemetry content-free claims; scan skill docs for credential/secret examples; verify OpenCode Go retention fact sourcing.

Review verdict: CONDITIONAL
