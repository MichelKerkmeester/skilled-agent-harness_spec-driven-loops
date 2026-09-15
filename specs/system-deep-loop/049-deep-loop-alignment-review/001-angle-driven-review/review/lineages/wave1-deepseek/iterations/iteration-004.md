---
title: "Iteration 4: Angle 4 — Feature catalogs against the runtime"
trigger_phrases: []
---
# Iteration 4: Angle 4 — Feature catalogs against the runtime

## Focus

Angle 4, across the hub catalog, the runtime catalog, and each mode catalog:

1. Every entry names a live file or function.
2. No entry names a removed one (worktrees, retired executor kinds).
3. The runtime's own write containment has an entry.

Dimension: traceability (primary), maintainability (secondary).
Method: extracted every path-shaped reference from every catalog document in the hub, resolved each against four candidate roots plus a repo-wide basename index, then verified each surviving miss by hand to separate a genuine dead reference from a placeholder or a cross-tree path that resolves elsewhere. A first pass with a wrong base path produced 129 false misses and is recorded under Notes.

## Files Reviewed

- `.opencode/skills/system-deep-loop/feature-catalog/` — index + 3 entry docs
- `.opencode/skills/system-deep-loop/runtime/feature-catalog/` — index + 54 entry docs
- `.opencode/skills/system-deep-loop/{deep-research,deep-review,deep-ai-council,deep-improvement}/feature-catalog/**` — 112 entry docs
- 170 catalog documents in total; 386 path references resolved, then 445 under the corrected resolver
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11-12`
- `.opencode/bin/lib/compiled-routing/` layout and `013-live-activation/activation/system-deep-loop/manifest.json`
- `.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/{convergence-and-recovery,synthesis-save-and-guardrails}/`

## Scorecard

- Dimensions covered: traceability, maintainability
- Files reviewed: 170 catalog documents; 445 path references resolved
- New findings: P0=0 P1=2 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

- None.

### P1, Required

- **F014**: The `compiled-routing-and-legacy-fallback` catalog entry points at a superseded generation of the compiled-routing runtime layout in four places, naming directories that no longer exist. `feature-catalog.md:71` and the entry doc's source table cite `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs`; the live path is `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`. The same entry cites `.opencode/bin/lib/compiled-routing/010-live-activation/activation/system-deep-loop/manifest.json`; the live path is `013-live-activation/…`. `011-runtime-engine` and `010-live-activation` do not exist under the layout root, which holds `003-contract-schemas`, `004-compiler-n1-shadow`, `005-decision-evaluator`, `008-calibration`, `009-parent-hub-rollout`, `013-live-activation`, and `014-runtime-engine`. The entry's prose is authored around the stale paths ("it resolves `.opencode/…/011-runtime-engine/lib/resolve.cjs` and calls `resolveRoute(hubId, taskText)`"), so this is not a stray cell — the description of the resolution order is written against the wrong generation. The catalog's own stated purpose is to be the current-state inventory of the hub surface, and its `description` field says it covers "the default-on compiled-routing fast path that resolves ahead of it". The runtime layout itself documents that generations must not be mixed: `compiled-route-layout.cjs` selects one coherent layout "or fails closed, so every runtime consumer binds the same generation." The live generation is `014-runtime-engine`, and `.opencode/bin/compiled-route.cjs` executes correctly today (`node .opencode/bin/compiled-route.cjs --hub system-deep-loop --prompt "run a deep review loop on the parser"` returned a `route` decision with `effectivePolicyHash` and `generation: 4`), so the defect is in the inventory's accuracy against the tree, not in the runtime. [SOURCE: .opencode/skills/system-deep-loop/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md:28] [SOURCE: .opencode/skills/system-deep-loop/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md:52-53] [SOURCE: .opencode/skills/system-deep-loop/feature-catalog/feature-catalog.md:71] [SOURCE: .opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs] [SOURCE: .opencode/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json]
- **F015**: Eight catalog entries cite files that do not exist at the cited path, and seven of the eight also cite an out-of-tree document or a dead end in a way that reads as live. Four distinct classes, each verified individually rather than counted together: (a) two feature catalogs cite a script spec path under a track that has been archived — `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability/003-guard-and-enforcement/001-deep-route-guard-plugin/implementation-summary.md` at `mk-deep-loop-guard.md:77` and the sibling `…/003-loop-guard-implementation/implementation-summary.md` on the same line, both of which live under `specs/system-deep-loop/z_archive/025-deep-loop-gpt-reliability/003-guard-and-enforcement` — the track was renamed to `025-` and moved to `z_archive/`; (b) a coverage-graph catalog cites an MCP handler at `.opencode/skills/system-spec-kit/runtime/handlers/coverage-graph/convergence.ts` where the `handlers/coverage-graph/` directory does not exist at all, and no file of that basename exists anywhere in the repo; (c) two pairs of playbook references cite filename-numbered paths (`029_insight_status_prevents_false_stuck.md`, `027_resource_map_emission.md`) while the playbooks were renamed to kebab-case without the numeric prefix — the files are `insight-status-prevents-false-stuck.md` and `resource-map-emission.md`; (d) two catalogs cite `.opencode/skills/system-spec-kit/runtime/scripts/tests/resource-map-extractor.vitest.ts` while the test lives at `.opencode/skills/system-spec-kit/runtime/tests/resource-map-extractor.vitest.ts` — a stale `scripts/` segment. A ninth reference, `validation/system-deep-loop-guard.md` at `mk-deep-loop-guard.md:86`, is labeled "Feature file path" and names a file that does not exist in that directory, which holds `llm-judge-hardening.md`, `mk-deep-loop-guard.md`, and `post-dispatch-validate.md`. The catalog's contract is that entries name live files, and every one of these is a dead pointer for a reader following it. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/validation/mk-deep-loop-guard.md:77] [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/validation/mk-deep-loop-guard.md:86] [SOURCE: .opencode/skills/system-deep-loop/deep-research/feature-catalog/convergence/graph-convergence.md:43] [SOURCE: .opencode/skills/system-deep-loop/deep-research/feature-catalog/convergence/stuck-detection.md:48] [SOURCE: .opencode/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/resource-map-emission.md:49-50] [SOURCE: .opencode/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/resource-map-emission.md:49] [SOURCE: specs/system-deep-loop/z_archive/025-deep-loop-gpt-reliability/003-guard-and-enforcement]

### P2, Suggestion

- **F016**: The runtime catalog's headline entry count is off by one against its own table, its link list, and the tree. `runtime/feature-catalog/feature-catalog.md:19` states "The 55 entries below cover runtime libraries and direct `.cjs` scripts…". The per-category coverage table on `:23-37` sums to 54 (executor 4, prompt-rendering 1, validation 3, state-safety 13, scoring 2, coverage-graph 6, script-entry-points 5, council 5, fanout 8, lifecycle 2, observability 3, testing 2), the index carries exactly 54 `###` entry headings, the index links 54 entry docs, and 54 entry docs exist on disk. All four counts agree with each other at 54 and disagree only with the prose. No links are missing and no documents are unlinked, so the index is structurally sound and the sentence is the sole defect. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:19] [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:23-37]
- **F017**: The runtime catalog indexes four features whose stated surfaces are `council`, `coverage-graph`, `fanout`, and `lifecycle` libraries that the catalog's own primary-surface column attributes to `lib/council/*.cjs` and `lib/deep-loop/*.cjs`, while the executor-kind vocabulary the catalogs describe is out of step with the runtime's own list. `executor-config.ts:11` exports `EXECUTOR_KINDS = ['native', 'cli-codex', 'cli-claude-code', 'cli-opencode', 'cli-cursor', 'cli-devin', 'cli-pi', 'cli-hermes']` — eight kinds, seven of them `cli-*`. Across the hub and runtime catalogs the only `cli-*` kinds named anywhere are `cli-claude-code`, `cli-opencode`, and a `cli-surface` token that is not an executor kind at all. Six of the seven CLI executor kinds the runtime supports are absent from the catalog vocabulary, including the newest (`cli-hermes`) and the two the deep-loop fan-out paths use most (`cli-codex`, `cli-pi`). Advisory: the catalogs index features rather than executors, so no catalog entry is wrong, but an inventory of the runtime surface that never names most of the executor kinds its own executor feature supports is thinner than its stated coverage claims. [SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:23-37] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11-12]

## Claim Adjudication

```json
{"findingId":"F014","claim":"The compiled-routing catalog entry and the hub index cite two superseded compiled-routing layout directories that do not exist, in four reference sites written into the entry's prose.","evidenceRefs":[".opencode/skills/system-deep-loop/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md:28",".opencode/skills/system-deep-loop/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md:52-53",".opencode/skills/system-deep-loop/feature-catalog/feature-catalog.md:71"],"counterevidenceSought":"Listed the live compiled-routing layout root to establish which generation directories exist, confirmed resolve.cjs and the activation manifest both resolve under the current 013/014 pair, executed the front door to prove the runtime path works, and read compiled-route-layout.cjs to establish that the layout itself treats generation mixing as a fail-closed condition.","alternativeExplanation":"The entry could be describing a historical generation on purpose as provenance rather than as a live pointer. Rejected because the entry is written in the present tense about resolution order ('it resolves … and calls resolveRoute'), the hub index repeats the stale path as the current feature's location, and the catalog's own description claims coverage of the live default-on fast path.","finalSeverity":"P1","confidence":0.87,"downgradeTrigger":"Downgrade to P2 if the catalog is explicitly reframed as historical and a current-generation entry is added alongside it.","transitions":[{"iteration":4,"from":null,"to":"P1","reason":"Initial discovery; four reference sites across two documents written against a superseded layout generation"}]}
```

```json
{"findingId":"F015","claim":"Eight catalog entries cite files that do not exist at the cited path across four distinct classes, plus one self-referential feature-file path that names no file in its own directory.","evidenceRefs":[".opencode/skills/system-deep-loop/runtime/feature-catalog/validation/mk-deep-loop-guard.md:77",".opencode/skills/system-deep-loop/runtime/feature-catalog/validation/mk-deep-loop-guard.md:86",".opencode/skills/system-deep-loop/deep-research/feature-catalog/convergence/graph-convergence.md:43",".opencode/skills/system-deep-loop/deep-research/feature-catalog/convergence/stuck-detection.md:48",".opencode/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/resource-map-emission.md:49-50"],"counterevidenceSought":"Resolved all 445 references against four candidate roots plus a repo-wide basename index rather than reporting raw misses, then hand-verified each survivor: found each playbook and test under its renamed location, confirmed the archived track's new name and z_archive home, and confirmed the coverage-graph handler basename exists nowhere in the repo. An earlier pass with a wrong base path returned 129 misses that were almost entirely resolution artifacts.","alternativeExplanation":"Some of these may be intentional historical citations, as with the mk-deep-loop-guard spec evidence trail, which reads as a development record rather than a live pointer. That reading is partly accepted for the two spec paths and is stated in the finding; it does not extend to the renames, the absent handler directory, or the self-referential feature-file path, which carry no historical framing.","finalSeverity":"P1","confidence":0.84,"downgradeTrigger":"Downgrade to P2 if the two archived-spec citations are confirmed as intentional provenance and only the rename and dead-directory classes remain.","transitions":[{"iteration":4,"from":null,"to":"P1","reason":"Initial discovery; four independently verified stale-reference classes across 170 catalog documents"}]}
```

```json
{"findingId":"F016","claim":"The runtime catalog prose claims 55 entries while its category table, heading count, link count and on-disk document count all give 54.","evidenceRefs":[".opencode/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:19",".opencode/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:23-37"],"counterevidenceSought":"Counted four independent ways — sum of the per-category coverage column, count of level-3 entry headings, count of markdown links resolving to entry docs, and count of entry documents on disk excluding the index — rather than trusting any one of them.","alternativeExplanation":"The 55 could count a feature listed in the prose beyond the numbered table, such as one of the shared backend contracts named in the consolidation paragraph. Rejected because that paragraph explicitly says those sit 'beyond the numbered entries above', so they are not entries.","finalSeverity":"P2","confidence":0.93,"downgradeTrigger":"Resolve when the sentence states 54 or a 55th entry is added and the table, links and disk all agree.","transitions":[{"iteration":4,"from":null,"to":"P2","reason":"Initial discovery; single-sentence defect with no structural consequence"}]}
```

```json
{"findingId":"F017","claim":"The runtime supports eight executor kinds including seven cli-* kinds, while the hub and runtime catalogs name only cli-claude-code, cli-opencode and the non-kind token cli-surface.","evidenceRefs":[".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11-12",".opencode/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:23-37"],"counterevidenceSought":"Read the runtime's exported EXECUTOR_KINDS constant rather than inferring the roster, then extracted every cli-* token across all catalog documents to compare sets rather than sampling.","alternativeExplanation":"The catalogs index features, not executors, so a feature inventory need not enumerate every kind; the executor-config entry legitimately describes the schema without listing all values. Accepted as the reason this is advisory, which is why it is filed as P2 coverage thinness rather than a wrong entry.","finalSeverity":"P2","confidence":0.7,"downgradeTrigger":"Resolve when the executor-config catalog entry enumerates the supported kinds, or when the coverage table stops claiming executor coverage that omits most kinds.","transitions":[{"iteration":4,"from":null,"to":"P2","reason":"Initial discovery; coverage thinness rather than a false entry"}]}
```

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review/spec.md:89` | Angle 4 was covered on all three properties. Property 1 fails (F015, and F014's stale generation paths). Property 2 passes cleanly — see Ruled Out. Property 3 is satisfied: the hub catalog carries a first-class `## 3. FAN-OUT WRITE CONTAINMENT` section at `feature-catalog.md:43-57` with its own entry doc. Partial because property 1 fails. |
| `feature_catalog_code` | partial | advisory | same | This is the overlay protocol angle 4 exists to exercise. It is partial rather than fail because the overwhelming majority of references resolve: 445 resolved, 9 dead. |
| checklist_evidence | notApplicable | hard | — | The phase spec carries no per-iteration checklist rows; its REQ rows are assessed at synthesis. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: traceability, maintainability
- Novelty justification: four independent classes — a superseded runtime-layout generation cited as current (F014), four distinct stale-reference classes across the catalog tree (F015), an internal count mismatch (F016), and a coverage gap against the runtime's own executor roster (F017). Each rests on a different artifact pair and a different verification method.

## Notes — A Resolution Error Withdrawn

- **My first catalog pass reported 129 missing references and was almost entirely wrong.** I resolved every extracted path against a fixed catalog-root base and against the repo root, but catalog entry docs use `../feature-catalog/…` links that resolve relative to the *document's own directory*, and they cite bare basenames (`convergence.cjs`, `atomic-state.ts`) that live elsewhere in the hub. Re-resolving against four candidate roots plus a repo-wide basename index reduced 129 to 32, and hand-verification reduced those to the 9 genuine misses behind F015. The 129 figure and any finding built on it are withdrawn. This is the second iteration in a row where a path-resolution assumption produced a false-miss population; the same trap applies to angle 5's README and playbook claims.

## Ruled Out

- **Retired feature classes named in catalogs (angle 4's property 2)**: ruled out clean on both named examples. Zero `worktree` mentions across the hub catalog, the runtime catalog, and every mode catalog. Zero retired executor kinds named in any runtime catalog entry. Property 2 passes.
- **The runtime's write containment having no catalog entry (angle 4's property 3)**: ruled out. The hub catalog carries `## 3. FAN-OUT WRITE CONTAINMENT` with a description, a current-reality paragraph, and a source-files pointer, plus a dedicated entry doc. The runtime catalog does not carry a standalone containment entry, but it is not required to: the hub catalog is where the property belongs and where it is present.
- **Runtime catalog index integrity**: ruled out. 54 index links resolve, 54 entry docs are linked, zero orphans in either direction, zero missing targets. F016 is a prose count only.
- **`prompt-rendering` being a placeholder entry**: ruled out. The single `prompt-pack.md` entry resolves to a live `lib/deep-loop/prompt-pack.ts`, and the "placeholder" hits in that document are the feature's own subject matter (placeholder *variables* in templates), not a stub marker.
- **`cli-surface` as a retired executor kind**: ruled out as a finding. The token appears in catalog prose but is not an executor kind in `EXECUTOR_KINDS`; it reads as a descriptive phrase rather than a claim about the roster, so it is folded into F017's coverage observation instead of filed separately.

## Dead Ends

- **Counting catalog references without resolving them**: produces a five-to-one false-positive ratio. Recorded under Notes.
- **Filing F015 as nine separate findings**: eight of the nine share one contract — a catalog entry must name a live file — so they are filed once with their classes enumerated, and the classes are kept distinct inside the finding so a remediation plan can split them.

## Recommended Next Focus

Angle 5 — playbooks and READMEs against the runtime: every playbook command and flag must exist, and every README claim about scripts, contracts, hooks or counts must match the code, including the compiled-contracts README. This is the second documentation-versus-code angle, and F014 establishes that the compiled-routing generation numbers are a live drift surface, so the compiled-contracts README is a high-value first target. Carry forward the resolution discipline from this iteration's Notes.

Review verdict: CONDITIONAL
