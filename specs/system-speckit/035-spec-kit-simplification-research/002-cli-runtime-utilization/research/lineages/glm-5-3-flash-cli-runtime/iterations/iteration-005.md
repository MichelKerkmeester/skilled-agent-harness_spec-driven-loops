---
title: "Iteration 5: retrieval/ + graph/ — the 001 Lane, Its Freshness, and Its Maintenance Twins"
trigger_phrases: []
---
# Iteration 5: retrieval/ + graph/ — the 001 Lane, Its Freshness, and Its Maintenance Twins

## Focus

The 001-ripgrep-search-system packet's replacement machinery: which of the 7 retrieval root scripts the mandated Gate 1 flow actually executes, what keeps the COMMITTED trigger-index.json honest, and whether graph/ is maintenance-archaeology or a wired lane. Also the first deliberate boundary-crossing test of the package's dependency-direction story.

## Actions Taken

1. Listed retrieval/ (7 root scripts + lib/ 7 + fixtures/ 10 + README) and read retrieval/README.md's declared lanes; read both mandated scripts' import lists (lookup:25-37, generate:34-44).
2. Grepped the 5 caller surfaces + all 12 workflows for the 4 non-mandated retrieval scripts; grepped the AI contract (references/retrieval/retrieval-conventions.md) for rg-wrapper vs raw-rg.
3. Fresness audit of the lookup: grepped for stale/fresh/generatedAt/age guards.
4. Listed graph/ (README + 2 TS); traced backfill-graph-metadata and migrate-generated-json through the 5 surfaces; read spec/repair-derived.cjs's delegation (:40, :319) and its relationship to graph-metadata.
5. Boundary check: cli/retrieval's cross-package import (../../hooks/lib/workspace/repo-root.mjs) against the governed allowlist (evals/import-policy-allowlist.json); counted repo-root implementations.

## Findings

1. The trigger-index freshness gap — `SKILL.md:432` ("The artifact at runtime/data/trigger-index.json is COMMITTED, so a fresh clone answers Gate 1 before anything is built") + root-doc §2 (the lookup fires on EVERY new user message) + `retrieval/lookup-trigger-index.mjs` (its only validation is shape: `assertTriggerIndexShape` from ./lib/artifact.mjs at :25; grep for stale/fresh/generatedAt/age: only the two stderr error paths at :303,311) + `.github/workflows` (rg for trigger-index|retrieval: EMPTY — of the 12 workflows, NONE regenerates or canaries the index). Observed: a mandate-grade, road-signed, COMMITTED retrieval artifact whose correctness decays silently; the only freshness mechanism is AI discipline (SKILL.md:432,438: "Regenerate... after trigger_phrases changed"). A stale index answers exit 0 with confidence. Severity P1. Recommendation: fix — a freshness field the lookup reports, or a CI canary; the removal/merge-compliant minimum is documenting the staleness risk where the lookup is mandated.

2. Four of seven retrieval root scripts have NO wired caller — `retrieval/rg-wrapper.mjs`, `retrieval/retrofit-convention.mjs`, `retrieval/sweep-memory-residue.mjs`, `retrieval/measure-cold-lookup.mjs` (rg over .github + commands + bin + hooks + plugins: NONE-FOUND ×4; none in either registry — iteration 1's 0-retrieval-hits). Declared purposes (retrieval/README.md:9-13): the ripgrep "front door" (recipes), the grep-convention retrofit pipeline (enumerate/dry-run/process/rescan), the retired-memory-MCP residue sweep (exit-code question), cold-lookup latency measurement (measure-cold-lookup.mjs:3-4: "Spawns one fresh Node process per sample and times it end to end"). Observed consumption: AI-runs-when-remembered (rg-wrapper: 2 mentions in retrieval-conventions.md) or 001-acceptance archaeology — retrofit+sweep+measure+10 frozen-baseline fixtures are the migration's build-verify-measure residue, kept inside the production tree. Severity P1 (the README's lane list reads as machinery; 4/7 of it is ceremony-adjacent). Recommendation: remove the migration trio (retrofit, sweep, measure + their fixtures) once 001's evidence is archived; keep rg-wrapper only because the conventions doc still points at it.

3. The dependency-direction story vs. a live cross-package import — `retrieval/generate-trigger-index.mjs:44` imports `findRepoRoot` from `../../hooks/lib/workspace/repo-root.mjs`, i.e. cli→runtime/hooks/lib, while `../ARCHITECTURE.md:100` gates exactly such reaches ("Imports that reach past runtime/api/ into lib/, core/ or handlers/ are rejected by the import-policy checks in runtime/cli/evals/ unless they carry a governed allowlist entry") — and `evals/import-policy-allowlist.json` contains NO hooks/workspace/repo-root entry (grep: EMPTY). Two readings, neither confirmed: the policy's governed-zone list (lib, core, handlers) quietly omits hooks/, or the .mjs lane escapes the TS-scoped check. Whether the check would flag this import: caller-not-checked (the check itself is iteration 8's subject). Compounding: THREE repo-root implementations now coexist — cli/common.sh `get_repo_root()` (registry, "essential: true", used by create.sh, upgrade-level.sh, scaffold-debug-delegation.sh, ops/heal-session-ambiguity.sh), runtime/hooks/lib/workspace/repo-root.mjs (the node one, used by retrieval), and whatever shared/paths contributes (iteration 6). Severity P2. Recommendation: fix — name hooks/ among the governed zones or import via api, and converge repo-root onto one seam.

4. `graph/` is more wired than its own documentation, except its twin — `spec/repair-derived.cjs:40,319` spawns `cli/graph/backfill-graph-metadata.ts` (node --import TSX_LOADER) inside the CI-wired repair lane (.github/workflows/strict-pass-freshness-report.yml → repair-derived → BACKFILL), and the doctor surface wires it twice (.opencode/commands/doctor/assets/doctor-update.yaml; .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh) — yet cli/README.md:§7 presents backfill purely as a Manual report-then-apply flow. Conversely `graph/migrate-generated-json.ts`: wired callers NONE-FOUND in the five surfaces (manual + docs only) — a second, parallel entry to the same prune machinery whose migration purpose is, like the retrieval trio, 001-era. The split of repair responsibility (repair-derived = the what-to-fix referee with its derived-versus-authored contract, spec/README-repair-derived.md; backfill = the doer) is genuine delegation, not duplication. Severity P2. Recommendation: document the delegation in cli/README.md:§7; migrate-generated-json.ts is a removal candidate once its migration is confirmed consumed.

## Positive Controls (verified, not findings)

- retrieval/lib/ is the designed seam: "shared, filesystem-free primitives every script here imports" (retrieval/README.md:8) — both mandated scripts import 3-4 lib modules each (lookup:25,31-37; generate:40-43); the lib/pattern holds.
- The barrel's second lane: extractors/index.ts:14 re-exports lib/session-activity-signal.js, whose REAL importers bypass the barrel (spec-folder/folder-detector.ts, production) — the re-export line is decorative, not load-bearing.
- The two mandated retrieval scripts are the package's leanest admitted surfaces: lookup's import list is 5 lines by its own comment (:9: "deliberately short") — no continuity/core coupling at all. The retrieval lane keeps its independence promises.

## Questions Answered

- (Q1 progress) retrieval/ and graph/ purposes vs callers: done. retrieval = 2 wired mandates + 4 unwired ceremony-adjacent scripts + a freshness hole; graph = 1 triple-wired maintainer + 1 manual twin.

## Questions Remaining

- Q1 residuals: spec-folder/, utils/, types/, setup/, ops/, observability/, kpi/, metrics/, optimizer/, resource-map/, sweep/, codex/, pi/, runtime-mirrors/; Q3 (parity: root check scripts + package.json); Q4 (zero-caller rollup); Q5 (codex/pi/mirrors/evals); Q6 (framing + ../lib/shared duplication — the repo-root triple is the first Exhibits).

## What Worked / What Failed

- Worked: grepping the GOVERNED ARTIFACT (import-policy-allowlist.json) instead of trusting ARCHITECTURE.md:100's prose — the hooks-zone omission surfaced immediately.
- Worked: reading what the lookup itself validates (shape, not freshness) — one grep converted a suspicion into a P1.
- Failed: none; no approach exhausted.

## Ruled Out

- "graph/ is unwired documentation-only" — repair-derived.cjs:319 + the doctor pair are production callers; the temptation inverted.
- "repair-derived and backfill duplicate the repair responsibility" — one spawns the other under a written derived-versus-authored contract (spec/README-repair-derived.md).

## Sources

[SOURCE: .opencode/skills/system-spec-kit/SKILL.md:432,438] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:9,25,303-311] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:34-44] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md:8-13] [SOURCE: .opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md (rg-wrapper ×2)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/evals/import-policy-allowlist.json (grep: no hooks/repo-root)] [SOURCE: .opencode/skills/system-spec-kit/ARCHITECTURE.md:100] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:40,85,319] [SOURCE: .opencode/commands/doctor/assets/doctor-update.yaml; .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/measure-cold-lookup.mjs→retrieval/measure-cold-lookup.mjs:3-4] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/extractors/index.ts:14] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/spec-folder/folder-detector.ts]

## Next Iteration

Iteration 6: the support shell — spec-folder/ (7, 3249L), utils/ (20, 5275L), types/ (4, 765L), config/ (2, 25L), and the leftover root entries (doctor.sh, check-api-boundary.sh, migrate-deep-research-paths.ts, seed-council-value-fixture.cjs, the .scan* family): who imports what, which support modules are stranded, and where the third scorer/template/paste helper hides.
