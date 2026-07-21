# sk-design Manual-Testing-Playbook Routing Verification — playbook-verify-sonnet-20260721-133447

> Rendered from `report.json` (do not hand-edit).

## 1. RUN META

- **Hub**: `sk-design`
- **Executor**: Claude Sonnet 5 (Claude Code agent), headless read-only sweep
- **Captured**: 2026-07-21T13:34:47Z (archive folder timestamp; sweep executed continuously through this UTC window)
- **Repo mutations**: none — git status before and after this sweep shows only the same 4 pre-existing, out-of-scope dirty files it started with (`.opencode/bin/compiled-routing-foundation.vitest.ts`, `.opencode/bin/tests/compiled-route-manifest.test.cjs`, `mcp-tooling/008-mcp-aside/001-research/research/research.md`, `system-deep-loop/032-deep-alignment-mode/013-review-remediation/decision-record.md`) plus two sibling agents' own `playbook-verify-*` archive folders for other hubs; this archive folder is the only addition this sweep made
- **`DEFAULT_ON_HUBS`**: 7 hubs — sk-code, system-deep-loop, mcp-tooling, cli-external-orchestration, sk-prompt, sk-design, sk-doc (unchanged; verified live via `require('resolve.cjs').DEFAULT_ON_HUBS`)
- **sk-design serving state** (verified live, flag unset): `flagPermitsCompiled: true`, `servingAuthority: "compiled"` — confirms genuine default-on behavior with no env override

### Method

Enumerated every file under `.opencode/skills/sk-design/manual-testing-playbook/`: the root `manual-testing-playbook.md` (v1.3.0.0, directory/contract, declares 42 scenarios across 9 categories) plus 42 per-feature files matching that declared count, **plus** `compiled-routing/bundle-rules-compiled-routing.md` (`SDG-CR-001`) — present under the playbook tree but not listed in the root doc's v1.3.0.0 "Canonical package artifacts" (its frontmatter is dated 2026-07-21, after the root doc's last version bump). Included because it is a real, fully-specified scenario file and the task directive covers everything under `manual-testing-playbook/`. **Total: 43 scenario files.**

38 of the 43 declare `expected_workflow_mode` frontmatter (or an unambiguous single-scenario prompt/mode contract) and route through the `sk-design` hub's mode registry — these were tested by running **every individual prompt/probe/variant each file literally quotes** (not just one representative prompt per scenario ID) through:

- **COMPILED** (default-on, no flag override): `env -u SPECKIT_COMPILED_ROUTING node .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs --hub sk-design --prompt "<prompt>"`
- **LEGACY**: `node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs --skill .opencode/skills/sk-design --task "<same>"`

Both tools were invoked in-process (a single Node driver requiring `resolveRoute()`/`routeSkillResources()` directly, rather than 53 separate subprocess spawns) and then spot-verified against the literal CLI commands above for every mismatching/interesting case, to rule out driver-script artifacts. This produced **53 individual prompt-level comparisons across the 38 routing scenario IDs** (several scenario files specify multi-row probe/variant tables — AI-001 has 6 probes, TV-001 and TV-002 have 4 variants each, SR-002 has 3 probes, PB-005 and FR-002 each have 2 named variants — and every one was run, not just the first).

The remaining 5 scenarios (`styles-library-utilization/SLU-001..005`) carry **no** `expected_workflow_mode` frontmatter and do not route through the hub at all — they test the styles-library retrieval/hydration/corpus-context/STUDY-generator engine directly via their own dedicated `node`/`vitest` "Exact Command Sequence." These were run using that documented sequence, verbatim, since the compiled/legacy hub router is not part of their contract.

### Frozen scorer SHA-256 (start == end)

| File | SHA-256 | Unchanged |
| --- | --- | --- |
| `router-replay.cjs` | `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47` | YES |
| `score-skill-benchmark.cjs` | `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c` | YES |
| `load-playbook-scenarios.cjs` | `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029` | YES |

Identical to the hashes cited in the sibling `cli-external-orchestration/benchmark/compiled-routing/playbook-verify-sonnet-20260721-152551/report.md` run and in packet `013-compiled-coverage-buildout`'s `handover.md`, confirming these cross-hub shared scripts are genuinely untouched. Re-hashed at report-write time (below, §7) to confirm start==end for this sweep specifically.

---

## 2. SUMMARY

- **Total scenarios examined**: 43 (38 routing scenarios + 5 styles-library-utilization engine scenarios) — every file under `manual-testing-playbook/`
- **Total individual prompts/probes run**: 53 (routing scenarios) + 5 (SLU exact command sequences) = 58 executions
- **PASS**: 42 scenarios (37 routing + 5 SLU)
- **FAIL**: 1 scenario (`AI-001` — 5/6 probes clean, 1/6 shows real compiled-vs-legacy drift; see §4)
- **SKIP**: 0 (everything was runnable headlessly; the only two "can't literally quote a prompt" gaps — FR-001's 4 undocumented sibling variants — are noted as not-attempted, not scenario-level SKIPs, since FR-001's own one fully-specified variant did run)
- **Compiled-vs-legacy drift**: **1/53** individual routing prompts (`AI-001` probe P5 only). All other 52 routing prompts, and all 5 SLU engine tests, show exact agreement with their respective contract.

### Lane C cross-check

- **Archived sources**:
  - `.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout/checklist.md` — CHK-022: *"Route-gold parity run shows `compiled-serving` for sk-design with TV-003 resolved — Verified, 38/0 (0 drift rules out the TV-003 over-detection pattern re-surfacing)"*
  - `.opencode/skills/sk-doc/benchmark/compiled-routing/r3-benchmark-sweep-20260721-131432/hub-reports/sk-design.{json,md}` — `compiledRouting: {subVerdict:"compiled-serving", scored:38, match:38, drift:0}`, all 38 rows `status:"match"`, `firstDifference:null`
- **Archived figure**: **38/0** — 100% compiled==legacy parity across the 38 canonical playbook scenario IDs
- **Reconciliation**: **CORROBORATED, with one precise addendum.**
  - 4 of the official 38 rows (`AI-001`, `TV-001`, `TV-002`, `SR-002`) are **vacuous** `defer`/`defer` matches — confirmed directly from `sk-design.json`: `routeTelemetry.workflowMode:null`, `deferReason:"no-mode-scored"`, both `legacyProjection` and `compiledProjection` = `{action:"defer",targets:[]}` for all 4. Root cause: these 4 files specify their scenario content as a multi-row probe/variant **table**, not a single top-level `**Exact prompt**:` fenced block, so `load-playbook-scenarios.cjs` extracted `prompt:null` for each and the harness graded a trivial empty-prompt agreement rather than testing any of the 17 real probe/variant texts those 4 files actually document.
  - This sweep ran all 17 of those real sub-prompts individually (6 for AI-001, 4 each for TV-001/TV-002, 3 for SR-002), plus every other scenario's real prompt — a strict superset of the official harness's coverage for those 4 IDs — and found **16/17 clean parity plus exactly 1 genuine drift** (`AI-001` probe P5), root-caused below (§4) to a compiled-engine bundling heuristic (`clearlySeparateAxes()`) that `router-replay.cjs` does not implement.
  - Net: **52/53** individually-tested prompts show exact compiled==legacy parity, including **0 drift on every one of the 34 genuinely-tested (non-vacuous) official rows** — this independently corroborates the archived 38/0 figure on its own real coverage, and extends it with one newly-surfaced, narrow, reproducible, non-blocking finding that the official sweep's fixture-generator gap (table-shaped scenario files → `prompt:null`) structurally could not have caught.
- **Verdict**: **CORROBORATED** (compiled routing is safe to serve by default for sk-design), **with 1 new narrow finding** documented below that the archived 38/0 run never exercised.

---

## 3. FULL SCENARIO TABLE (53 routing prompts across 38 scenario IDs)

| Prompt ID | Category | Expected mode(s) | Compiled | Legacy | Compiled==Legacy |
| --- | --- | --- | --- | --- | --- |
| MDR-001 | mode-routing | interface | interface (route) | interface | yes |
| MDR-002 | mode-routing | foundations | foundations (route) | foundations | yes |
| MDR-003 | mode-routing | motion | motion (route) | motion | yes |
| MDR-004 | mode-routing | audit | audit (route) | audit | yes |
| MDR-005 | mode-routing | md-generator | md-generator (route) | md-generator | yes |
| MDR-006 | mode-routing | motion | interface (route) | interface | yes* |
| MDR-007 | mode-routing | design-mcp-open-design | design-mcp-open-design (route) | design-mcp-open-design | yes |
| AI-001 P1 | advisor-integration | interface | interface (route) | interface | yes |
| AI-001 P2 | advisor-integration | foundations | foundations (route) | foundations | yes |
| AI-001 P3 | advisor-integration | motion | motion (route) | motion | yes |
| AI-001 P4 | advisor-integration | audit | audit (route) | audit | yes |
| AI-001 P5 | advisor-integration | md-generator | foundations+md-generator (route) | md-generator | **NO — drift** |
| AI-001 P6 | advisor-integration | design-mcp-open-design | design-mcp-open-design (route) | design-mcp-open-design | yes |
| AI-002 | advisor-integration | none (elsewhere) | defer | defer | yes |
| AI-003 | advisor-integration | none (elsewhere) | defer | defer | yes |
| AI-004 | advisor-integration | none (elsewhere) | audit (route) | audit | yes* |
| TV-001 V1 | transform-verb-framing | interface | interface (route) | interface | yes |
| TV-001 V2 | transform-verb-framing | interface | interface+foundations (route) | interface+foundations | yes* |
| TV-001 V3 | transform-verb-framing | interface | interface+foundations (route) | interface+foundations | yes* |
| TV-001 V4 | transform-verb-framing | interface | interface (route) | interface | yes |
| TV-002 V1 | transform-verb-framing | audit | audit (route) | audit | yes |
| TV-002 V2 | transform-verb-framing | audit | audit (route) | audit | yes |
| TV-002 V3 | transform-verb-framing | audit | audit (route) | audit | yes |
| TV-002 V4 | transform-verb-framing | audit | audit (route) | audit | yes |
| TV-003 | transform-verb-framing | interface | interface (route) | interface | yes |
| TV-004 | transform-verb-framing | interface (documented default) | defer | defer | yes* |
| TV-005 | transform-verb-framing | interface | interface (route) | interface | yes |
| MG-001 | md-generator-pipeline | md-generator | md-generator (route) | md-generator | yes |
| MG-002 | md-generator-pipeline | md-generator | md-generator (route) | md-generator | yes |
| MG-003 | md-generator-pipeline | md-generator | md-generator (route) | md-generator | yes |
| MG-004 | md-generator-pipeline | md-generator | md-generator (route) | md-generator | yes |
| SR-001 | shared-reference-base | interface | interface (route) | interface | yes |
| SR-002 P1 | shared-reference-base | foundations | foundations (route) | foundations | yes |
| SR-002 P2 | shared-reference-base | motion | motion (route) | motion | yes |
| SR-002 P3 | shared-reference-base | audit | defer | defer | yes* |
| SR-003 | shared-reference-base | none (defer) | defer | defer | yes |
| SR-004 | shared-reference-base | audit | audit (route) | audit | yes |
| PB-001 | parity-behavior | interface | interface (route) | interface | yes |
| PB-002 | parity-behavior | foundations | foundations (route) | foundations | yes |
| PB-003 | parity-behavior | md-generator | md-generator (route) | md-generator | yes |
| PB-004 | parity-behavior | motion | motion (route) | motion | yes |
| PB-005 primary | parity-behavior | audit | audit (route) | audit | yes |
| PB-005 negative-control | parity-behavior | audit | interface (route) | interface | yes* |
| PB-006 | parity-behavior | audit (+ cross-mode notes) | interface+foundations (route) | interface+foundations | yes* |
| PB-007 | parity-behavior | interface | interface (route) | interface | yes |
| FR-001 foundations-primary | fallback-and-resilience | foundations | foundations (route) | foundations | yes |
| FR-002 motion-primary | fallback-and-resilience | motion | motion (route) | motion | yes |
| FR-002 md-generator-variant | fallback-and-resilience | md-generator | md-generator (route) | md-generator | yes |
| HM-001 | hub-manager-intake | n/a (behavioral intake) | foundations (route) | foundations | yes |
| HM-002 | hub-manager-intake | interface+foundations (documented bundle) | interface (route) | interface | yes* |
| HM-003 | hub-manager-intake | n/a (behavioral proof-gate) | defer | defer | yes |
| HM-004 | hub-manager-intake | interface+design-mcp-open-design (documented bundle) | design-mcp-open-design (route) | design-mcp-open-design | yes* |
| SDG-CR-001 | compiled-routing | md-generator | md-generator (route) | md-generator | yes |

`*` = compiled==legacy parity holds (no cutover regression), but the observed mode diverges from this scenario's own documented narrative expectation for a specific, root-caused, **pre-existing-in-both-engines** reason — see §4/§5. Every `*` row is graded PASS at the scenario level because the property this task verifies (does the compiled cutover change behavior vs. legacy) holds; the divergence from the narrative is identical under legacy and is not something the cutover introduced.

---

## 4. THE ONE DRIFT FINDING — `AI-001` probe P5

**Verdict: FAIL** (the only FAIL in this sweep).

**Prompt**: `Extract design tokens from https://example.com and generate DESIGN.md.`

| Engine | Action | Selection kind | Targets / intents |
| --- | --- | --- | --- |
| Compiled | `route` | `orderedBundle` | `[foundations, md-generator]` |
| Legacy (top-level `intents`) | — | — | `[md-generator]` only |
| Legacy (internal `surfaceIntents`, used only for resource assembly) | — | — | `[FOUNDATIONS, MD_GENERATOR]` — near-tied, so legacy's `resources` list *also* quietly includes foundations' resource paths even though its headline `intents` field does not name foundations as a routed target |

**Root cause** (confirmed by reading `.opencode/bin/lib/compiled-routing/006-parent-hub-rollout/006-sk-design/lib/router.cjs`):

```js
// lines 187-189
function clearlySeparateAxes(text, modes) {
  return modes.length === 2 && /\b(?:and|plus|then)\b/.test(text);
}

// lines 234-241 (evaluateCanary)
const contending = contendingModes(scores, snapshot.routingModel.ambiguityDelta);
const bundle = exactBundle(snapshot.routingModel, contending);
if (bundle) {
  decision = route(snapshot, 'orderedBundle', bundle.targetWorkflowModes);
} else if (clearlySeparateAxes(text, modes)) {
  decision = route(snapshot, 'orderedBundle', modes.sort(...));
} else if (scores.length === 1 || scores[0].score - scores[1].score > ambiguityDelta) {
  decision = route(snapshot, 'single', [scores[0].mode]);
} ...
```

The compiled engine scores `md-generator:12` and `foundations:4` (same scores legacy computes — confirmed identical). `foundations` is not within the ambiguity delta of the top score (12-4=8 > 1), so the ordinary top-1 gate alone would keep this single-mode, matching legacy. But the compiled engine has an additional, intentional heuristic: when exactly 2 modes score above zero and the raw prompt text contains the literal word "and" / "plus" / "then", it treats that as an explicit textual signal of two genuinely separate design axes and force-bundles both — bypassing the ambiguity-delta gate entirely. `router-replay.cjs` (legacy) has no equivalent heuristic; its `selectIntents()` only ever applies the flat ambiguity-delta filter.

This prompt contains "...example.com and generate DESIGN.md." — triggering `clearlySeparateAxes`. `MDR-005`'s canonical prompt ("Extract the design system from https://example.com into a DESIGN.md style reference.") has no bare "and"/"plus"/"then" and no independent foundations-scoring word, so it is unaffected — this is specific to `AI-001`'s P5 wording, which happens to combine "design tokens" (a `foundations-tokens` keyword) with a 2-clause "and" sentence.

**Why the archived 38/0 Lane C run never caught this**: its `AI-001` row is a vacuous `defer`/`defer` match (see §2) because `AI-001.md` specifies its 6 probes as a table, not a single quoted `Exact prompt` block, so the fixture-generator never extracted probe P5's text at all.

**Severity assessment**: narrow and non-regressive-in-spirit — the compiled engine's behavior here is arguably more complete (it explicitly names foundations as a co-target rather than legacy's silent, unflagged resource-list leak of the same mode), but it is still a genuine, reproducible behavior change from what `router-replay.cjs` computes today, and the task's own criterion (b) "compiled == legacy" is not met for this one prompt. Flagged, not fixed (read-only, no manifest/router edits permitted in this task's scope).

---

## 5. OTHER NOTABLE PARITY-CLEAN / NARRATIVE-DIVERGENT FINDINGS (all `*`-flagged rows above)

All of the following show exact compiled==legacy agreement (0 cutover risk) but diverge from the scenario file's own prose expectation. Each is root-caused to a pre-existing, shared characteristic of the keyword-substring router (present in both engines identically, so not attributable to the compiled cutover):

1. **`MDR-006` / `PB-005` negative-control — mode-hint prefix not parsed.** Neither headless tool implements literal `<mode>: ` prefix-override parsing (that rule lives in `SKILL.md` prose, for a live model to apply). `MDR-006`'s prompt ("motion: make the menu transition feel bolder...") has zero other motion-vocabulary substring anywhere in it (checked the full `motion-aliases`/`motion-temporal` keyword lists directly against the text) — it resolves to `interface` (via "bolder") on both engines identically. Same mechanism for `PB-005`'s negative-control variant (resolves `interface` instead of `audit`). Confirmed the official Lane C `MDR-006` row also shows `interface`/`route`/`status:match` — this is pre-existing, documented-elsewhere behavior, not something this sweep introduced or missed.

2. **`TV-004` — stale playbook doc claim.** `TV-004`'s (and `MDR-001`'s) "why" section asserts `hub-router.json sets routerPolicy.defaultMode to interface`. Direct inspection: `hub-router.json` has `"defaultMode": null`. Both engines correctly reflect the real (null) config identically (`defer`, 0 intents) — the fallback-to-interface behavior the doc describes does not exist in the current config. This is a playbook-documentation staleness finding, not a routing defect.

3. **`TV-001` V2/V3 — incidental foundations co-hit.** `hub-router.json`'s `foundations-layout` vocabulary class lists the bare words `"layout"` and `"hierarchy"` as standalone keywords (not compound phrases). V2 ("...keeping the same layout.") and V3 ("...visual hierarchy...") each contain one of those bare words, so both engines identically add `foundations` alongside `interface`. Confirmed via direct `hub-router.json` vocabulary dump.

4. **`SR-002` P3 — prompt wording doesn't hit the vocabulary.** "Audit this page for design slop and give severity-ranked findings." contains neither `"anti-slop-detection"`/`"anti-slop detection"` (the real keyword; the prompt says "design slop") nor `"p0-p1-design-findings"` (the prompt says "severity-ranked findings"), and bare `"audit"` is never itself a standalone keyword in this vocabulary. Both engines correctly score zero and defer, identically.

5. **`AI-004` — negation-blind substring match.** The prompt explicitly says "...not a visual or UI design review." — but the substring scorer has no negation handling and fires on the literal `"design review"` keyword regardless of the preceding "not a". Both engines identically resolve `audit`. This is the one case in this batch that looks most like a real quality gap, but it lives in the shared keyword-scoring layer used identically pre- and post-cutover — it is not a compiled-routing regression, and the scenario's actual documented safeguard (the cross-skill advisor choosing `sk-code` over `sk-design`) is a different, outer layer this hub-scoped tool cannot exercise either way.

6. **`PB-006` — self-referential keyword collision.** The prompt lists "audit, foundations, motion, interface" as plain words while asking the AI to name the owning reviewer. Only bare `"foundations"` (itself a registered `foundations-aliases` keyword) and `"polish"` (`interface-taste`) score — bare `"audit"` and `"motion"` are never standalone keywords in this vocabulary — so both engines resolve the `ui-build-bundle` rule (`interface`+`foundations`) rather than `audit`. The scenario's real "audit is the owning reviewer" claim is an AI-judgment/prose result this keyword router was never going to compute either way.

7. **`HM-002` / `HM-004` — documented bundles with no machine-readable bundle rule.** `hub-router.json`'s only declared `bundleRules` entry is `ui-build-bundle: whenAll:[interface, foundations]`. `HM-002`'s prompt doesn't independently score foundations (no foundations-vocabulary substring in "operations dashboard"/"implementation handoff"), so it resolves `interface` only. `HM-004` is explicitly self-documented in its own file as testing a pairing (`design-mcp-open-design` + a design-judgment mode) that has no declared bundle rule at all — confirmed directly against `hub-router.json`. Both are hub-manager prose-level behaviors, not machine-encoded routing, and both engines agree identically.

None of items 1-7 represent a compiled-routing cutover regression — every one reproduces bit-for-bit under legacy. They are documented here for playbook-fidelity transparency, going beyond what this task strictly required, since the sweep already had the evidence in hand.

---

## 6. STYLES-LIBRARY-UTILIZATION SCENARIOS (SLU-001..005) — not routing scenarios

None of these 5 carry `expected_workflow_mode` frontmatter; they test the styles-library engine directly and were run via their own documented "Exact Command Sequence," not the compiled/legacy hub router.

| ID | Verdict | Observed | Command class |
| --- | --- | --- | --- |
| SLU-001 | **PASS** | `ok:true`, `eligibility:{eligibleCount:1290,rejectedCount:0}`, 2 cards, each with `generationHash`+`contentHash` | `style-library.mjs query` |
| SLU-002 | **PASS** | `{"ok":false,"error":"generation-mismatch"}` — exact documented refusal, no hydrated content leaked | `runHydrate()` mismatch probe |
| SLU-003 | **PASS** | `{"hydratedStyleCount":0,"valid":true,"errors":[]}` | `validateCorpusContextPlan()` on `POSITIVE_FIXTURE` |
| SLU-004 | **PASS** | `{"valid":false,"errors":["plan.corpusVerdict:unexpected"]}` | Same validator, mutated plan |
| SLU-005 | **PASS** | `2 passed \| 13 skipped (15)` — both named regression tests pass | `vitest run tests/study-exemplars.test.ts -t "..."` |

All 5 exit 0 and match their documented Pass/Fail Criteria exactly.

---

## 7. GUARDRAIL VERIFICATION

- **Frozen scorer SHA-256, start == end**: re-hashed at report-write time — `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs` all unchanged (see §1 table; identical digests before and after this sweep, confirmed by a second `shasum -a 256` pass after writing this archive).
- **`DEFAULT_ON_HUBS`**: still exactly 7 hubs (`sk-code`, `system-deep-loop`, `mcp-tooling`, `cli-external-orchestration`, `sk-prompt`, `sk-design`, `sk-doc`) — verified live via `require('resolve.cjs').DEFAULT_ON_HUBS`, not by re-reading source (avoids stale-read risk).
- **No routing/manifest/`SKILL.md` edits**: none made. No `mode-registry.json`, `hub-router.json`, `SKILL.md`, or activation-manifest file was written.
- **2 strays untouched**: `mcp-tooling/008-mcp-aside` and `system-deep-loop/032-deep-alignment-mode` — neither was read for mutation nor written; the one pre-existing dirty file under the former (`001-research/research/research.md`) predates this sweep entirely (present in the session's initial git-status snapshot, untouched by any command this sweep ran).
- **No commit**: no `git add`/`git commit` run. This archive folder (`report.json` + `report.md`) is the only filesystem change this sweep made, under the designated read-only-except-archive path.

---

## 8. SOURCE FILES

- Playbook root: `.opencode/skills/sk-design/manual-testing-playbook/manual-testing-playbook.md`
- Scenario files: all 42 files under `mode-routing/`, `advisor-integration/`, `transform-verb-framing/`, `md-generator-pipeline/`, `shared-reference-base/`, `parity-behavior/`, `fallback-and-resilience/`, `hub-manager-intake/`, `styles-library-utilization/`, plus `compiled-routing/bundle-rules-compiled-routing.md` (`SDG-CR-001`)
- Compiled engine: `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` (+ `.../006-parent-hub-rollout/006-sk-design/lib/router.cjs`, `registry-compiler.cjs` for root-cause tracing)
- Legacy replay: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs`
- Hub router policy: `.opencode/skills/sk-design/hub-router.json`, `.opencode/skills/sk-design/mode-registry.json`
- Lane C cross-check source: `.opencode/skills/sk-doc/benchmark/compiled-routing/r3-benchmark-sweep-20260721-131432/hub-reports/sk-design.{json,md}`
- Packet source for the 38/0 citation: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/013-compiled-coverage-buildout/checklist.md`, `handover.md`
- Styles-library engine: `.opencode/skills/sk-design/styles/_engine/style-library.mjs`, `.opencode/skills/sk-design/shared/corpus-context/{validate-context-plan.mjs,__tests__/fixtures.mjs}`, `.opencode/skills/sk-design/design-md-generator/backend/tests/study-exemplars.test.ts`
- Sibling precedent (same method, other hubs): `.opencode/skills/cli-external-orchestration/benchmark/compiled-routing/playbook-verify-sonnet-20260721-152551/report.md`, `.opencode/skills/sk-doc/benchmark/compiled-routing/playbook-verify-sonnet-20260721-132527/`, `.opencode/skills/system-deep-loop/benchmark/compiled-routing/playbook-verify-sonnet-20260721-132746/`
