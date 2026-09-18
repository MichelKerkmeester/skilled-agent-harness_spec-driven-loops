---
title: "Compiled-Serving Admission Research: Replacing the Retired Lane C Parity Bar"
description: "Deep research synthesis answering the five admission questions: what Lane C measured, whether a compiled-vs-gold checker can replace it, what admission additionally needs, the costs and risks of each path, and the recommended path with build steps."
trigger_phrases:
  - "compiled-serving admission"
  - "lane c parity replacement"
  - "compiled routing admission path"
  - "routing gold agreement checker"
importance_tier: "important"
contextType: "research"
---

# Compiled-Serving Admission Research — Synthesis (deepseek lineage)

## Executive Summary

**Recommendation: build a new checker of compiled decisions against the routing gold (Path B), run it
as a standing gate, and restate the admission bar it enforces.** The retired Lane C harness measured a
two-sided, frozen-oracle verdict — compiled vs the Mode A legacy replay, both scored against authored
gold, with digest pins and a blocking drift owner. Its retirement removed the only tool that could
admit a parent hub. The evidence in this synthesis shows that every input a new checker needs is still
live (typed gold, the qualified-id bridge, per-hub leaf manifests, the public front door), while a
verbatim restore (Path A) drags a 4,241-line deleted script tree through an unfinished source-root
migration and re-imports the exact maintenance posture the repository retired. Keeping admission
closed (Path C) avoids both, but leaves admission manual forever and the fleet's compiled decisions
unmeasured against legacy.

The recommended path's one true cost is semantic: it enforces "compiled satisfies the authored
routing contract" rather than "compiled equals legacy". That difference is stated explicitly
(§2.6, §5.4), and the operator is the one decision this research isolates.

Evidence basis: ten cited passes over the retired modules at `b45ea54cea3^`, the live runtime closure,
the playbook gold corpus, the guard/manifest machinery, CI workflows, and commit history. Every
numbered finding below appears with its sources in the lineage's `iterations/iteration-001..005.md`.

---

## Q1 — What Lane C parity measured, and what a restore would need

**Q1 answer:** Lane C parity (`compiled-routing-parity.cjs`, deleted in `b45ea54cea3`) measured, per
playbook scenario, whether the live compiled decision matched the Mode A legacy replay — with three
guards, a five-value status vocabulary, a blocking roll-up, and both sides judged by the same frozen
route-gold scorer. A restore needs the four retired modules plus their test, a driver (the deleted
`/deep:skill-benchmark` command surface), the scenario corpus, and the still-live shared dependencies;
the three frozen scorer files are SHA-256-pinned, so any edit to them forces re-pinning.

**1.1 The measurement.** The compiled side is produced through the public front door with the flag
forced on — `runJsonChild(PUBLIC_FRONT_DOOR, ['--hub', hubId, '--prompt', taskText], { SPECKIT_COMPILED_ROUTING: '1' })`
— so it measures the path the fleet would really serve. The legacy side is a deterministic Mode A
replay of the hub's fenced `INTENT_SIGNALS`/`RESOURCE_MAP` router.
[SOURCE: `compiled-routing-parity.cjs:211-217`; `router-replay.cjs:1-17` — both at `b45ea54cea3^`]

**1.2 The three guards.**
1. *Vacuous-parity guard*: a manifest whose `servingAuthority` is not `compiled` yields `vacuous`,
   never a false pass; a missing manifest is `n/a`, a stale manifest is `drift` with reason
   `re-mint-required`.
2. *Shape bridge*: every compiled target is resolved through the shared `qualifiedIdToLeaf` boundary
   against the destination hub's manifest mode index; an unresolved target fails closed as
   `resolver-missing`. Legacy's task-scoped resources are projected down to what compiled's declared
   leaves can support, so mode-wide declarations are not compared to task-scoped gold.
3. *Frozen-scorer pin*: `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`
   are re-hashed against pinned digests before any comparison; drift aborts before evidence is written.
[SOURCE: `compiled-routing-parity.cjs:93-110,301-350,392-400,517-535,600-637` at `b45ea54cea3^`]

**1.3 The verdict.** Both observations run through the frozen `evaluateRouteGold`; routing projections
are then compared field-by-field (`action`, `selectionKind`, ordered targets' `hubId`/`workflowMode`/
`packetKind`). Parity requires `firstDifference === null` and, for a served route only,
`compiledGoldPass === legacyGoldPass` — a shared gold failure on matching routing is parity, not drift.
Non-route decisions (`defer`/`clarify`/`reject`) compare no resources, because resource gold on those
paths is delivered by the retained legacy surface layer.
[SOURCE: `compiled-routing-parity.cjs:454-470,640-705`; `score-skill-benchmark.cjs:891-955` at `b45ea54cea3^`]

**1.4 The vocabulary and owner.** Statuses: `match` (only pass), `drift`, `vacuous`, `n/a`,
`resolver-missing`; roll-up: broken > drifted > serving, with `lane-c-compiled-parity` as the single
blocking drift-gate owner and outer verdict `BLOCKED-BY-COMPILED-DRIFT` over a non-blocked verdict.
[SOURCE: `compiled-routing-parity.cjs:112-132,741-792` at `b45ea54cea3^`]

**1.5 Restore inventory.** Four modules (845 + 1,889 + 741 + 766 = 4,241 lines), the deleted
`tests/compiled-routing-parity.vitest.ts`, the deleted orchestrator YAML/presentation/command entry,
the scenario docs/fixtures, and the live shared deps (`leaf-resource-contract.cjs`,
`@spec-kit/shared/frontmatter/parse-frontmatter.js`). The pins are literal SHA-256 constants; restoring
exact bytes keeps them valid, editing forces re-pinning.
[SOURCE: `git show b45ea54cea3 --name-status`; `git show b45ea54cea3^:.../deep-skill-benchmark-auto.yaml:1-22`; `compiled-routing-parity.cjs:93-110`]

**1.6 Scope limits.** Parity never measured hub selection (the compiled router only selects within an
already-identified hub), live Mode B dispatch, or freshness repair.
[SOURCE: `compiled-routing-architecture.md:46`; `deep-skill-benchmark-auto.yaml` trace_mode at `b45ea54cea3^`]

---

## Q2 — Can `compiledRoute()` + routing gold serve as the admission bar?

**Q2 answer:** Yes, conditionally — the bar is implementable with live seams and a bounded new checker,
but it measures compiled-vs-gold rather than compiled-vs-legacy, and it must define its own
defer/holdout/negative scoring.

**2.1 The corpus exists.** 74 playbook scenarios across the five admitted hubs carry
`expected_workflow_mode` + `expected_leaf_resources`: sk-code 1, system-deep-loop 21, mcp-tooling 16,
cli-external-orchestration 10, sk-doc 26 — split as 64 concrete modes, 2 `defer`, 8 `UNKNOWN`.
sk-code's single scenario is material: "zero drift" on that hub rests on one assertion.
[SOURCE: `grep -rh "^expected_workflow_mode:"` over `.skilled/skills/*/manual-testing-playbook/`; `.skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md:1-16`]

**2.2 The bridge is live and required.** `compiledRoute(hubId, taskText)` returns
`{hubId, action, selectionKind, targets, effectivePolicyHash, generation}` where `targets` are
qualified-id strings only — no leaves. Checking `expected_leaf_resources` requires
`qualifiedIdToLeaf(qualifiedId, { modeIndex })`
(`.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:435-467`) with a
`modeIndex` from each destination hub's live `leaf-manifest.json` + `mode-registry.json` (present;
e.g. mcp-tooling declares 9 modes with leaves). The resulting leaf assertion is must-include at mode
granularity, not legacy's task-scoped assembly.
[SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:94-106`; `leaf-resource-contract.cjs:415-467`]

**2.3 The action vocabulary must be defined by the checker.** Compiled emits
`route`/`clarify`/`defer`/`reject`; gold uses concrete modes/`defer`/`UNKNOWN`. The canary fixtures
histogram is 50/3/7/7. The checker must map every non-route action to the no-route outcome for
`defer`/`UNKNOWN` gold and fail it for concrete gold.
[SOURCE: canary fixtures under `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/*/fixtures/canary-cases.v1.json`; `compiled-routing-parity.cjs:418-452` at `b45ea54cea3^`]

**2.4 How `defer` should count.** Both admitted-corpus defer scenarios assert a negative: no route.
Scoring mirrors the retired `scoreHubRoute` — over-detection fails, a concrete-mode scenario with no
route is a `silent-default` failure. Excluding defer would erase the conservative half of the
contract; including only defer would admit a degenerate always-defer engine, which the 64 concrete
scenarios defeat.
[SOURCE: `.skilled/skills/mcp-tooling/manual-testing-playbook/hub-routing/ambiguous-defer.md:1-12,29-34`; `score-skill-benchmark.cjs:980-1040` at `b45ea54cea3^`]

**2.5 How holdout and negative should count.** Holdout: 19 scenarios (mcp-tooling 7,
cli-external-orchestration 2, sk-doc 10) with `blindToRouterKeywords`; the retired scorer excluded
holdout from the fitted aggregate and reported `generalizationGap = fitted − holdout` — admission
should require zero drift on all stages and report the gap. Negative: 2 suppression scenarios; pass =
no route, no forbidden mode. `UNKNOWN` maps to the empty expected-intent set, never to "no gold".
[SOURCE: `.skilled/skills/mcp-tooling/manual-testing-playbook/hub-routing/holdout-design-tokens.md:1-17`; `score-skill-benchmark.cjs:874-876,1623-1685`; `load-playbook-scenarios.cjs:556-616` at `b45ea54cea3^`]

**2.6 The semantic gap.** A gold-only checker has one observation. Lane C classified a shared
legacy/gold failure as parity; the new checker fails compiled. Conversely, stale gold fails a
legacy-equivalent engine that Lane C would have called `drift` on both sides. The bar must therefore
be restated, not silently changed.
[SOURCE: `compiled-routing-parity.cjs:675-705` at `b45ea54cea3^`; `compiled-routing-architecture.md:64-70`]

**2.7 Canary fixtures are not the oracle.** 67 per-hub canary cases validate the engine's own
contract (including defer reasons) but are compiled expectations, and `loadSnapshot()` — what the
engine loads — does not evaluate them.
[SOURCE: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:38-57,100-110`; `compiled-route.cjs:79`]

---

## Q3 — What else admission needs beyond the check

**Q3 answer:** Eight cohort copies/registries must change, the manifest must be minted, refreshed
against the hub's shadow-child snapshot and then flipped to `servingAuthority: "compiled"` — a flip
that currently has no owning tool — and freshness enforcement already exists at three moments the new
hub must slot into. The architecture reference is stale (seven hubs, legacy-layout paths) and must not
be used as the checklist.

**3.1 The eight surfaces.** (1) `HUB_CHILD` `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:30-36`;
(2) `DEFAULT_ON_HUBS` in the live resolver `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:34-40`;
(3) the authored resolver copy under `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/014-runtime-engine/lib/resolve.cjs`;
(4) the advisor flag source `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts:14-34`;
(5) the advisor compiled dist; (6) guard `HUBS` `.skilled/bin/compiled-route-guard.cjs:45-51`;
(7) sync `HUBS` `.skilled/bin/compiled-route-sync.cjs:54-60`;
(8) `serving-closure.manifest.json` `hubs[]`/`files[]`. The foundation test holds four copies in
lockstep and cross-checks `COMPILED_ROUTING_HUBS` against `HUB_CHILD` — but guard, sync and the
closure manifest have no lockstep test, and the cohort length itself is asserted with
`expect(cohort.length).toBe(5)` (`.skilled/bin/compiled-routing-foundation.vitest.ts:133`).
[SOURCE: as listed; `compiled-routing-foundation.vitest.ts:47-59,69-78,124-146`]

**3.2 Manifest mechanics.** `mintCanonicalManifest` writes an inert
`{generation: 1, servingAuthority: 'legacy', shadowOnly: true}` and refuses to overwrite;
`refreshCanonicalManifest` recompiles one generation ahead and preserves `servingAuthority`/`shadowOnly`;
freshness compares `selectedPolicy.{generation, effectivePolicyHash}` via `shadowChildPolicyFor` (the
hub's own snapshot — the generic compiler would produce a hash the resolver rejects). Cause codes:
`fresh`, `stale-manifest`, `missing-manifest`, `invalid-manifest`, `compile-error`, `unsafe-path`,
`invalid-input`. **No CLI flips authority to `compiled`** — the last step of admission is a manual,
reviewable edit today.
[SOURCE: `.skilled/bin/lib/compiled-route-manifest.cjs:611-648,700-745,496-512,515-568`]

**3.3 Three enforcement moments.** Pre-commit auto re-mint (measured trigger: a staged `SKILL.md`;
staged+unstaged refusal; authored-copy sync); the guard (`stale-manifest`, `authored-drift`, narrow
expiring exemptions); the request-time status probe (`compiled-serving`, `stale-manifest`,
`identity-mismatch`, `flag-off`, `legacy-authority`, `missing-manifest`, `engine-throw`).
[SOURCE: `.opencode/scripts/git-hooks/pre-commit:281-468` (mirror at `.skilled/scripts/git-hooks/pre-commit`); `git show a1faf0914a --format=%B`; `.skilled/bin/compiled-route-guard.cjs:98-118,150-166`; `.skilled/bin/compiled-route-status.cjs:9-30,217-267`]

**3.4 Closure promotion.** `compiled-route-sync.cjs` traces `require` reads across every hub and
copies exactly the touched files; `--verify` asserts no `specs/` reads. A new hub's shadow child must
join the traced path and the sync `HUBS` list or it is never promoted.
[SOURCE: `.skilled/bin/compiled-route-sync.cjs:5-40,54-60`; `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json:1-12`]

**3.5 Stale docs and topology history.** The cohort was 7, then 6 (sk-design dissolution, phase
`023-...`), then 5 (sk-prompt retirement, `8da89c0594e`, whose diff is the exact inverse checklist for
an admission change). The architecture reference still says seven hubs and names the legacy layout
(`006`/`011`/`010`); `compiled-route-layout.cjs` still resolves both layouts, so the stale paths
"work" while hiding the current ones.
[SOURCE: `git log --all --oneline -S "'sk-design'"`; `git show 8da89c0594e --stat`; `.skilled/bin/lib/compiled-route-layout.cjs:30-44`; `compiled-routing-architecture.md:34-46`]

---

## Q4 — What each path costs and risks, including keeping admission closed

**Q4 answer:** restore = 4,241 lines + test + driver, frozen pins, and a retired-lane maintenance
posture (high cost, strong verdict); new checker = low hundreds of lines, no frozen parts, restated
bar (low cost, equivalent coverage except legacy independence); keep closed = zero build, permanent
manual admission, and no standing compiled-vs-legacy measurement of the fleet.

**4.1 Path A (restore).** 845 + 1,889 + 741 + 766 lines plus the deleted test and a driver; verbatim
restore works today only because `.opencode` is still symlinked into `.skilled`, and editing any of
the frozen trio forces re-pinning. It buys the only two-observation, anti-tamper verdict the repo ever
had; it risks re-opening a deliberately retired lane (`BREAKING CHANGE: /deep:skill-benchmark is
removed on every runtime`) whose docs and command surfaces were deleted, and whose scope the spec
fences off. Modules-only restore is adjacent to that fence; full-lane restore is inside it.
[SOURCE: `git show b45ea54cea3^` line counts; `git show b45ea54cea3 --stat,%B`; `spec.md:82`]

**4.2 Path B (new checker).** Needs a frontmatter gold reader, the live bridge, scoring
(defer/UNKNOWN/negative/holdout) and a report — low hundreds of lines, no frozen digest, no deleted
module, and it can serve as a standing gate rather than an admission-only tool. CI already contains a
partial precedent: `routing-golden-prompts.vitest.ts` shells to `.skilled/bin/compiled-route.cjs` and
asserts compiled `workflowMode` — but only 2 of its 10 fixtures carry `expectedMode`, it asserts
containment rather than exact sets, and it skips non-cohort hubs. Risks: one observation (bar
restated), the checker owns the oracle, and corpus floors become contractual (sk-code's 1 scenario).
[SOURCE: `.skilled/skills/system-skill-advisor/runtime/tests/routing-golden-prompts.vitest.ts:29-43,76-136`; `gate2-golden-prompts.jsonl` (2/10 `expectedMode`); `.github/workflows/routing-registry-drift.yml:227-231`]

**4.3 Path C (keep closed).** Zero build and no change to the five serving hubs. But: admission stays
manual (the sk-prompt `playbook-verify` report — 5/5, 0 drift, done by hand — is the precedent and
leaves no tool); no standing gate compares compiled to legacy (freshness proves inputs → manifest,
never parity; canary cases are not executed by the engine, tests, or CI); and the cohort can shrink
7→6→5 by table edits with no low-friction path back in.
[SOURCE: `.skilled/skills/sk-prompt/benchmark/reports/compiled-routing/2026-07-21--playbook-verify--sonnet/report.json`; `.github/workflows/routing-registry-drift.yml:132-168,227-231`; `git show 8da89c0594e --stat`]

**4.4 Shared fixed cost.** Whichever check wins, the eight surfaces, the mint/refresh/flip ceremony
and the closure promotion are identical work; the paths differ only in the check itself.

---

## Q5 — Which path is recommended, and what a later phase would build

**Q5 answer:** Path B, with the bar restated and the checker run as a standing gate. Build steps are
below; the one operator decision is whether to accept the restated sentence or demand literal legacy
equality.

**5.1 Why B.** The typed-gold corpus, the bridge and the manifests are live; a new checker is small,
ownable, testable, and CI-wireable, while a restore drags a retired 4.2k-line surface through an
unfinished migration. B also recovers a standing measurement capability the fleet lost at retirement —
Path C keeps the door closed and the fleet unmeasured.

**5.2 What B gives up, bounded.** Legacy independence is given up by construction; the failure
taxonomy (`routing-mismatch`, `mode-missing`, `leaf-not-declared`, `unresolved-target`,
`gold-parse-failure`) keeps a shared legacy/gold divergence legible as a gold question. Oracle
ownership is bounded by fixture tests and one scoring module; corpus shrinkage is bounded by pinned
counts and an `insufficient-coverage` failure.

**5.3 Build steps for a later phase**
1. New `.skilled/bin/compiled-route-admission.cjs`: CLI (`--hub|--all`, `--warn-only`, `--json`,
   non-zero on drift/broken/insufficient coverage); corpus reader (typed gold + `stage`, loud parse
   failures); decision capture via the front door with `SPECKIT_COMPILED_ROUTING=1`; bridge via
   `qualifiedIdToLeaf` with a merged per-hub mode index; scoring per §2.3-2.5; fitted/holdout report.
2. Tests: fixture cases per status and sub-reason, live smoke on sk-doc, corpus-count pin.
3. Baseline run over the five hubs; triage failures into engine drift vs gold staleness; record the
   report as the replacement baseline.
4. CI wiring beside `compiled-route-guard.cjs` in the routing-drift workflow.
5. Admission ceremony when a candidate exists: shadow-child build; the eight surfaces + the
   `toBe(5)` tripwire + closure manifest; `mint` → `refresh` → explicit `servingAuthority: "compiled"`
   flip; `compiled-route-sync.cjs` promotion; guard/status read `compiled-serving`; checker passes
   with floors; commit by explicit pathspec.
6. Docs: correct `compiled-routing-architecture.md` (five hubs, `009`/`014`/`013` paths, restated
   bar) so the next admission does not follow the stale seven-hub recipe.

**5.4 The operator decision.** Accept "compiled satisfies the authored routing contract on the full
typed-gold corpus with coverage floors" as the admission sentence, or demand literal legacy equality
(which puts Path A back on the table, ideally as a minimal `router-replay.cjs` + comparison adapter,
decided with the B baseline in hand). The baseline report supplies the evidence; no further
investigation should be needed.

---

## Corrections and Refinements During the Run

- Iteration 3 initially listed five cohort surfaces; Iteration 4 refined the inventory to eight
  locations after the foundation test disclosed the authored-resolver, advisor-source and
  advisor-dist copies (§3.1).
- The spec's Problem Statement and the architecture reference both say "seven hubs already admitted";
  the live cohort is five (7→6→5, §3.5). This synthesis treats five as current reality and flags the
  documents as stale.

## Confidence and Unknowns

- **High confidence:** the retired harness contract, the live bridge/corpus/manifest machinery, the
  eight-surface touch list, the topology history, and the CI coverage gap — all cited to live files,
  git objects or deterministic counts.
- **Medium confidence:** the low-hundreds-of-lines estimate for the new checker (bounded by the
  retired components' sizes, not yet built) and the exact performance of a restored harness through
  the migration (verbatim restore would need an execution trial).
- **Unknown (deliberately preserved):** whether any specific new hub is planned; the operator's
  acceptance of the restated bar; whether gold has already drifted from legacy anywhere (the baseline
  run is the intended way to find out).

## Verification Notes

- 74 typed-gold scenarios and 19 holdout scenarios counted with `grep -r` over the live tree.
- Retired-module readings are at `b45ea54cea3^`; deletions confirmed with `git show b45ea54cea3 --name-status`.
- All artifact writes for this research live under
  `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/015-compiled-serving-admission-research/research/lineages/deepseek/`.
