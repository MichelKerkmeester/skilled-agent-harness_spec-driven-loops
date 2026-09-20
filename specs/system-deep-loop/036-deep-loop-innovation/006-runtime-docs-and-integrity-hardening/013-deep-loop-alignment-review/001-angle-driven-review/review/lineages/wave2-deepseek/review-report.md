---
title: "Deep Review Report — Angle-Driven Alignment Review, wave2-deepseek"
trigger_phrases: []
---

# Deep Review Report — Angle-Driven Alignment Review, wave two, lane wave2-deepseek

## Executive Summary

**Verdict: FAIL**
**Release readiness:** `release-blocking`
**hasAdvisories:** `true`
**Active findings:** P0=1, P1=11, P2=12 (24 open, 0 resolved, 0 withdrawn)

Five iterations, one wave-two angle each, over the deep-loop hub, its two neighbour hubs and the deep-command asset tree. Every iteration landed confirmed defects; none came back clean. The blocker is unchanged from wave one and now re-verified at its live lines: `cli-external-orchestration`'s `ROUTER.md` omits `cli-hermes` from all three of its prose roster statements while the same file's machine block names the mode, the registry registers it, and the compiled router resolves it (F028, escalated to P0 in iteration 4 against wave one's unmet downgrade trigger).

The highest-leverage finding is not the blocker. It is F024: the fleet's leaf-manifest generator still drops symlinked files (`walkLeafFiles` accepts only `entry.isFile()`), so twelve `sk-code` workflow-doctrine files that four surface `SKILL.md` files declare loadable never become typed leaves, and both freshness gates regenerate through the same walker — the gate built to catch manifest drift structurally cannot see it. One walker defect, twelve unreachable files, two blind gates.

Wave two's largest new class is post-deprecation residue. Spec 047 removed the entire skill-benchmark lane and asserted that no dangling link remains; the census run this wave found the removed lane still cited across all three hubs — an enforcement guarantee naming a deleted test, four runnable commands that now silently fall back to another lane, five `SKILL.md` files claiming a removed consumer, two scenario docs invoking a deleted script, and command links pointing at a deleted command file (F039). The stale compiled-routing generation references wave one found in one catalog are also fleet-wide: nine citations across three hubs name layout generations that no longer exist (F033).

The count-and-reference defect class wave one named is intact and wider than its first slice. A runtime catalog claims 55 entries where headings, links, disk and the category table all give 54 (F035); a compiled-contracts README claims four flattened contracts where three exist and repeats the error twice in a sibling README (F036); the deep-review playbook still asserts no automated test suite exists while eighteen deep-review test files do (F037); the council playbook's test cross-reference names five files that only exist under their renamed `multi-` prefix (F040). Every wave-one stale-reference finding (F014-F020) re-reproduced at its live line, and two were widened (F014 from one hub to three, F015's classes re-located: F034).

Three correction loops ran against this lane's own work: the path sweep's raw extraction produced 2,675 candidates that hand triage reduced to the real reference classes (a first pass miscategorized one deep-research feature doc before the precise per-heading check showed 25/25 links resolve, and a suspected storage-guide breakage proved live); the coverage-graph test claim was narrowed from "does not exist" to "absent at the cited path" after stale copies were found elsewhere; and the runtime catalog count was confirmed with four independent counts before filing. No reviewed source was changed. All writes are review artifacts in this lineage directory.

## Planning Trigger

`/speckit:plan` is required. The FAIL verdict carries an active P0 and four partial traceability protocols; remediation must be planned as coordinated changes across the two hubs' routing artifacts, the leaf generator, the catalogs, the playbooks and the deprecation surface. F024's generator fix and F039's deprecation completion have fleet-wide reach and must land before the affected documents are declared closed; wave one's remediation plan (same packet) already covers the shared generator and roster defects this wave re-verified, so the plan should reconcile the two finding sets rather than plan them twice.

Planning Packet

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": true,
  "activeFindings": [
    {"id":"F028","severity":"P0","findingClass":"incomplete-roster-statement","title":"cli-external-orchestration ROUTER.md omits cli-hermes from all three prose roster statements while its machine block and the compiled router carry the mode"},
    {"id":"F021","severity":"P1","findingClass":"release-identity-drift","title":"system-deep-loop description.json advertises the previous release against SKILL.md and both sibling hubs"},
    {"id":"F022","severity":"P1","findingClass":"version-family-drift","title":"Registry/router version fields match neither their hub release nor each other in 2 of 3 hubs, and sk-code's paired value lags its release"},
    {"id":"F024","severity":"P1","findingClass":"generator-symlink-skip","title":"Leaf-manifest walker skips symlinks and both freshness gates regenerate with the same walker, leaving twelve sk-code doctrine leaves invisible behind green gates"},
    {"id":"F025","severity":"P1","findingClass":"doctrine-reachability-via-prose","title":"Three shared workflow doctrine files project as no typed resource and are reachable only through prose sentences"},
    {"id":"F026","severity":"P1","findingClass":"contradictory-policy-declaration","title":"Fleet documents two mutually exclusive always-loaded-preamble policies and the compiled runtime enforces neither"},
    {"id":"F033","severity":"P1","findingClass":"stale-runtime-generation-reference","title":"All three hubs' compiled-routing catalog entries cite a superseded runtime-layout generation in nine places"},
    {"id":"F034","severity":"P1","findingClass":"stale-catalog-reference","title":"Nine catalog references across four verified classes still cite files absent at the cited path"},
    {"id":"F036","severity":"P1","findingClass":"count-drift","title":"Compiled-contracts README says four flattened contracts where three exist and the legacy README repeats the four-claim twice"},
    {"id":"F037","severity":"P1","findingClass":"false-absence-claim","title":"Deep-review playbook still asserts no automated test suite exists while eighteen deep-review test files do"},
    {"id":"F039","severity":"P1","findingClass":"post-deprecation-residue","title":"Current-state docs across all three hubs still advertise skill-benchmark artifacts removed by the deprecation packet"},
    {"id":"F040","severity":"P1","findingClass":"playbook-test-crossref-drift","title":"Deep-ai-council playbook section 16 names five test files that exist only under their renamed multi- prefix"},
    {"id":"F023","severity":"P2","findingClass":"documented-ambiguity","title":"hub-router schema doc defines version as either router schema or artifact version in one sentence, and nothing validates it"},
    {"id":"F027","severity":"P2","findingClass":"contract-unmet-non-distinct-sets","title":"Improvement lanes receive byte-identical 61-leaf sets against the generator's N-to-1 distinctness contract and no consumer needs the distinction"},
    {"id":"F029","severity":"P2","findingClass":"count-drift","title":"Hub SKILL.md files carry hand-written mode counts their own registries contradict"},
    {"id":"F030","severity":"P2","findingClass":"incomplete-roster-statement","title":"Deep-loop protocol and packet prose under-describes the executor set, and the council packet's prose contradicts its own resolver"},
    {"id":"F031","severity":"P2","findingClass":"capability-claim-drift","title":"Deep-loop catalogs describe the executor dispatcher as three kinds (twice with a duplicated kind name) against a driver that implements eight"},
    {"id":"F032","severity":"P2","findingClass":"incomplete-roster-statement","title":"cli-* packet sibling lists froze at each packet's authoring date, leaving the newest siblings out of six files"},
    {"id":"F035","severity":"P2","findingClass":"count-drift","title":"Runtime catalog still advertises fifty-five entries where headings, links and disk all give fifty-four"},
    {"id":"F038","severity":"P2","findingClass":"validation-scope-mismatch","title":"Legacy README presents a repository-wide checker as a local acceptance test and the checker currently fails"},
    {"id":"F041","severity":"P2","findingClass":"stale-command-reference","title":"Deep-research catalog and playbook cite a command path that no longer exists and a section anchor the successor lacks"},
    {"id":"F042","severity":"P2","findingClass":"relative-path-depth-drift","title":"Two sk-code packet READMEs reference the parent hub and shared doctrine one directory level too high"},
    {"id":"F043","severity":"P2","findingClass":"extension-drift","title":"Deep-ai-council catalog cites rollback.js where the library is rollback.cjs"},
    {"id":"F044","severity":"P2","findingClass":"missing-fixture-root","title":"Three agent-discipline stress scenarios and their setup script depend on a fixture root that does not exist"}
  ],
  "remediationWorkstreams": [
    "WS1 cli-external-orchestration roster and executor-description completion (P0 first): F028, F029, F030, F031, F032",
    "WS2 leaf-manifest generator and sk-code doctrine reachability: F024, F025",
    "WS3 version authority and identity-pair rules: F021, F022, F023",
    "WS4 preamble and leaf-set policy semantics: F026, F027",
    "WS5 catalog, README and cross-reference integrity: F033, F034, F035, F036, F041, F042, F043",
    "WS6 deprecation completion, playbook cross-references and validation scopes: F037, F038, F039, F040, F044"
  ],
  "specSeed": [
    "Define the reference contract for catalogs, READMEs and playbooks: every cited path is a live file, a declared generated output, or explicitly marked historical; no document counts a population it does not derive.",
    "Define a deprecation-completion gate: a removal packet may not close until every live citation of every deleted path is repointed or removed, and a silent-fallback mode enumeration is itself a finding.",
    "Define which compiled-routing layout generation the doc family must name and stamp those references from one source rather than restating numeric prefixes.",
    "Require playbook test cross-references to be verified by an existence check or execution at review time, with a named command per row.",
    "Require fixture-dependent scenarios and setup scripts to declare their fixture root as a live path and fail loudly when it is absent.",
    "When a wave-two finding replicates a wave-one class in a new hub or file, file it against the class with the full census rather than per-site."
  ],
  "planSeed": [
    "Add cli-hermes to ROUTER.md's three rosters and its leaf bullet; correct SKILL.md:74; fix the F029/F030/F031 counts and kind names from their subject sources; update each cli-* packet sibling list.",
    "Fix walkLeafFiles' symlink handling, regenerate every affected manifest, and prove the twelve sk-code leaves appear while the freshness gates still pass; then decide the doctrine's delivery mechanism for F025.",
    "Adjudicate the version field's meaning once (release stamp versus schema generation), then synchronize or rename it; add a SKILL.md-versus-newest-changelog comparison.",
    "Keep one operative preamble policy per hub and delete the conflicting statement; amend the N-to-1 generator contract or implement the alias mechanism for the deep-improvement lanes.",
    "Repoint the nine 013/014 generation citations; repoint the nine stale references and the deep-research command path; correct the 55→54 and four→three counts; fix the six relative-depth references and the .js→.cjs extension.",
    "Run a completion pass over spec 047's removal list: repoint or delete every live citation, decide whether sk-code's RESOURCE_MAP needs a replacement enforcement guard, fix the five council test paths, scope the legacy README's checker, and restore or repoint the stress-fixture corpus."
  ]
}
```

## Active Finding Registry

### P0 — Blocker

#### F028 — cli-external-orchestration/ROUTER.md omits cli-hermes from all three prose roster statements while its own machine block and the compiled router carry the mode

- Dimension: traceability
- Location: `.opencode/skills/cli-external-orchestration/ROUTER.md:24`
- Evidence: `ROUTER.md` states a six-mode roster in all three prose statements (`:24-25` hub-selects list, `:46-64` per-mode leaf bullets with no `cli-hermes` bullet, `:145-146` defer instruction) while the same file's machine block names HERMES in INTENT_SIGNALS (`:96`) and RESOURCE_MAP (`:124-126`), `mode-registry.json` registers `cli-hermes` (`:212-236`), and the compiled route front door executed this review resolves hermes prompts to `workflowMode: cli-hermes`.
- Impact: An agent following the hub's front-door doc sees six modes, has no leaf mapping for `cli-hermes`, and is told to confirm one of six executors; the document disagrees with itself at the layer that governs manual routing. Wave one filed the same three statements at P0 and left one downgrade path (ROUTER.md shown superseded and marked non-authoritative) unmet.
- Recommendation: Name `cli-hermes` in all three statements and add its leaf bullet, or replace the hand-written rosters with a pointer to `mode-registry.json`. No fix was made during this review.
- Disposition: active
- findingClass: `incomplete-roster-statement`
- scopeProof: ROUTER.md read end to end (three roster sites confirmed, no seventh bullet); HERMES entries verified in the same file; registry entry confirmed; compiled route front door executed with hermes prompts.
- affectedSurfaceHints: ROUTER.md overview roster, per-mode leaf bullets, defer instruction; `SKILL.md:74`.

### P1 — Required

#### F021 — system-deep-loop description.json advertises the previous release against SKILL.md and both sibling hubs

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/description.json:4`
- Evidence: `description.json:4` = 2.2.3.0 (`changelog/v2.2.3.0.md`) while `SKILL.md:3` = 3.0.0.0 (`changelog/v3.0.0.0.md`). Both sibling hubs keep `description.json` equal to `SKILL.md` and to their newest changelog; 17 of 17 mode-packet SKILL.md files equal their newest changelog entry, establishing the release rule this hub identity pair breaks.
- Impact: The advisor-facing identity file a reader meets first states a version one release behind the skill it describes, in the one hub of three that fails to keep the pair.
- Recommendation: Set `description.json` to 3.0.0.0 (or regenerate it from the release) and add a gate comparing SKILL.md against the newest changelog. No fix was made during this review.
- Disposition: active
- findingClass: `release-identity-drift`
- scopeProof: Every version field read at its line; every changelog entry listed under three hub roots and seventeen mode roots; no generator or gate stamps or compares `description.json`.
- affectedSurfaceHints: hub advisor identity, release hygiene.

#### F022 — Registry/router version fields match neither their hub release nor each other in 2 of 3 hubs, and sk-code's paired value lags its release

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/mode-registry.json:3`
- Evidence: system-deep-loop registry 2.0.0.1 vs router 2.0.1.1 vs release 3.0.0.0; cli-external-orchestration registry 1.2.0.2 vs router 1.2.1.2 vs release 1.5.0.0; sk-code registry = router = 4.1.0.1 while its changelog has shipped 4.2.0.0, 4.2.1.0 and 4.2.2.0; ROUTER.md drifts in all three hubs. The authoring doc calls the registry field a four-part version for hubs that ship releases; no observed value equals its release, and no compiler, gate or runtime module reads any artifact version field.
- Impact: A reader cannot tell whether the registry/router version names the hub release, a schema generation, or nothing at all, and no release bumps them.
- Recommendation: Decide the field's meaning once — synchronize it to the release or rename it (`registrySchemaVersion`/`routerSchemaVersion`) with a documented value and a validator. No fix was made during this review.
- Disposition: active
- findingClass: `version-family-drift`
- scopeProof: Each hub value verified at its exact line; wave one's pairing check re-run hub by hub; both authoring docs read; every compiler/gate/runtime module searched for a version consumer.
- affectedSurfaceHints: registry/router metadata, release discipline, authoring docs.

#### F024 — Leaf-manifest walker skips symlinks and both freshness gates regenerate with the same walker, leaving twelve sk-code doctrine leaves invisible behind green gates

- Dimension: traceability
- Location: `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:84`
- Evidence: `walkLeafFiles` accepts only `entry.isFile()` (`:83-84`), and Node reports a symlink as a non-file, so the twelve doctrine symlinks under the four `sk-code` surface packets never project; `collectModeEntries` walks `references`/`assets` only (`:179-180`). Observed: `generate-leaf-manifest.cjs --check .opencode/skills/sk-code` exits 0 with a digest while all twelve files are absent from the manifest; both fleet gates regenerate through `buildManifestBytes` and byte-compare (`ci-skill-root-metadata.cjs:191-229`, `ci-leaf-manifest-freshness.cjs:1-30`).
- Impact: A one-line walker defect makes twelve declared-loadable files invisible to every typed consumer, and the gate that exists to catch manifest drift structurally cannot see it. Fleet census: all twelve misses are symlinks and all twelve are in `sk-code`.
- Recommendation: Follow symlinks in `walkLeafFiles` (resolve and include when the target is a file), regenerate all manifests, then prove the twelve leaves appear and the gates still pass. No fix was made during this review.
- Disposition: active
- findingClass: `generator-symlink-skip`
- scopeProof: Disk-minus-manifest computed as a set difference for all three hubs and eighteen modes (exactly 12 misses); the check command executed with exit status and digest read; both gates read to confirm they share the builder.
- affectedSurfaceHints: leaf-manifest generator, fleet freshness gates, sk-code surface doctrine.

#### F025 — Three shared workflow doctrine files project as no typed resource and are reachable only through prose sentences

- Dimension: traceability
- Location: `.opencode/skills/sk-code/SKILL.md:39`
- Evidence: The shared sources under `shared/references/` are in no mode packet; the twelve surface symlinks are invisible to the walker (F024); `ROUTER.md`'s eight `SHARED_CONTROL_RESOURCES` (`:626-637`) contain no `workflow-*` path. What remains is prose: `SKILL.md:39` and `:192`, `shared/README.md:43-45`, four surface SKILL.md sites, and hand-off sentences in `sk-code-quality` and `sk-code-review`.
- Impact: A leaf-driven or compiled consumer selecting the surface's bundled doctrine cannot resolve it, and the SKILL.md load-path sentence has no typed backing from any artifact. Humans reach the files; typed consumers do not.
- Recommendation: Either fix F024's walker so the surfaces carry typed doctrine leaves, or move the doctrine into the declared shared-control set and align `SKILL.md:39` with that mechanism. No fix was made during this review.
- Disposition: active
- findingClass: `doctrine-reachability-via-prose`
- scopeProof: Every hub RESOURCE_MAP and both shared-control lists searched for a `workflow-*` path; every citation of the three filenames enumerated across the six sk-code packets; shared sources confirmed regular files whose surface copies are the symlinks.
- affectedSurfaceHints: sk-code shared doctrine, SKILL.md load-path claim, shared-control declaration.

#### F026 — Fleet documents two mutually exclusive always-loaded-preamble policies and the compiled runtime enforces neither

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/hub-router.json:13`
- Evidence: system-deep-loop `hub-router.json:13` and cli-external-orchestration `hub-router.json:21-24` declare `defaultResource` arrays while their ROUTER.md blocks say no always-loaded preamble with `DEFAULT_RESOURCE = []`; sk-code pairs `hub-router:14` `[shared/README.md]` against `ROUTER.md:319-325`'s three-file preamble and `sk-code-opencode/SKILL.md:60-66`'s five-file one. `compiler.cjs:184-185` admits only a scalar; the bound runtime compiler never reads the field, 004 nulls it, 007 truncates to `[0]`. Live snapshot loads for all three hubs show policy keys with no `defaultResource`, executed decisions carry no preamble.
- Impact: A reader cannot tell which preamble policy runs because no code path runs either; the two authored statements contradict at the layer that would have to resolve them.
- Recommendation: Keep one statement per hub in a form a consumer can read, delete the other, and remove or redefine the hub-router array. No fix was made during this review.
- Disposition: active
- findingClass: `contradictory-policy-declaration`
- scopeProof: All three policy blocks and machine blocks read at their lines; the field traced through five compilers and the runtime layout selector; the route front door executed for three hubs; the exact policy snapshots the engine evaluates loaded.
- affectedSurfaceHints: `hub-router routerPolicy`, ROUTER.md machine block, compiled policy snapshot.

#### F033 — All three hubs' compiled-routing catalog entries cite a superseded runtime-layout generation in nine places

- Dimension: traceability
- Location: `.opencode/skills/sk-code/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md:28`
- Evidence: Each hub's entry names `.opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs` at `:28` and `:52` and `.opencode/bin/lib/compiled-routing/010-live-activation/activation/<hub>/manifest.json` at `:28` and `:53`; the layout root holds only `003`, `004`, `005`, `008`, `009`, `013-live-activation` and `014-runtime-engine`, and the live front-door dependency is `014-runtime-engine/lib/resolve.cjs` (confirmed on disk). Wave one filed this for one hub and four citations; the census gives three hubs and nine.
- Impact: Every reader of any hub's compiled-routing inventory gets a resolution-order description written against paths no consumer uses; three hubs now disagree with the runtime they document.
- Recommendation: Repoint the nine citations to `013-live-activation` and `014-runtime-engine` in all three entries. No fix was made during this review.
- Disposition: active
- findingClass: `stale-runtime-generation-reference`
- scopeProof: All three catalog entries read at their lines; the layout root listed; the live paths resolved; a repo-wide search confirmed no current-state hub index carries the stale string (wave one's fourth site no longer reproduces).
- affectedSurfaceHints: three hub compiled-routing catalog entries.

#### F034 — Nine catalog references across four verified classes still cite files absent at the cited path

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/runtime/feature-catalog/validation/mk-deep-loop-guard.md:77`
- Evidence: Class A — archived spec path `mk-deep-loop-guard.md:77` (`.opencode/specs/deep-loops` absent; live copies under `specs/system-deep-loop/z_archive/025-…`); Class B — `graph-convergence.md:43` cites a coverage-graph handler where `runtime/handlers` has no `coverage-graph` child; Class C — numbered playbook filenames `stuck-detection.md:48` and `resource-map-emission.md:50` against the live kebab-case files; Class D — the `runtime/scripts/tests/` segment at two `resource-map-emission.md:49` sites (the test lives under `runtime/tests/`); a ninth site at `mk-deep-loop-guard.md:86`. Wave one's F015 re-verified at its live lines.
- Impact: A reader following any of the nine pointers finds nothing; the catalogs' contract is that entries name live files.
- Recommendation: Repoint the nine references to their live paths or mark them historical. No fix was made during this review.
- Disposition: active
- findingClass: `stale-catalog-reference`
- scopeProof: Each site re-located at its line and each live target resolved; the archived-spec relocation verified against the live `z_archive` tree.
- affectedSurfaceHints: runtime catalog validation entries; deep-research and deep-review catalogs; playbook citations.

#### F036 — Compiled-contracts README says four flattened contracts where three exist and the legacy README repeats the four-claim twice

- Dimension: traceability
- Location: `.opencode/commands/deep/assets/compiled/README.md:19`
- Evidence: `:19` says the directory "stores the four flattened command contracts"; it stores three (deep-ai-council, deep-research, deep-review). The same document at `:23` says the inventory "is intentionally limited to the three commands registered with the contract compiler and renderer", and its own tree block lists three contracts. `legacy/README.md:13` and `:87` repeat the four-claim while `:19` of that file says three fallback command bodies.
- Impact: The wrong number is the first sentence of the document this angle names as its highest-value target, and the pair refutes itself in three places.
- Recommendation: Correct the three sentences to three. No fix was made during this review.
- Disposition: active
- findingClass: `count-drift`
- scopeProof: Both directories listed; the compiler's registry read directly; each count sentence compared against the tree block in its own document.
- affectedSurfaceHints: compiled contract index, legacy body index.

#### F037 — Deep-review playbook still asserts no automated test suite exists while eighteen deep-review test files do

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:610`
- Evidence: `:610` reads "No dedicated automated test suite currently exists for `deep-review`." and the section names documentation paths only. Eighteen test files carry the packet's name or its reducer contract — eleven under `system-deep-loop/runtime/tests/`, one under `system-spec-kit/runtime/tests/deep-loop/`, six under `system-spec-kit/runtime/cli/tests/` — plus the packet's own `reduce-state-summary-fallback.test.cjs`, re-run during this review and passing. The sibling playbooks show the intended form (deep-research §15, deep-ai-council §16).
- Impact: A false absence terminates the search; the section attaches no cross-reference.
- Recommendation: Replace the assertion with a test cross-reference in the sibling form. No fix was made during this review.
- Disposition: active
- findingClass: `false-absence-claim`
- scopeProof: The eighteen-file population re-located by name and path; the packet's own test executed; both sibling playbooks read.
- affectedSurfaceHints: deep-review playbook §13.

#### F039 — Current-state docs across all three hubs still advertise skill-benchmark artifacts removed by the deprecation packet

- Dimension: traceability
- Location: `.opencode/skills/sk-code/ROUTER.md:311`
- Evidence: Spec 047 removed the Lane C skill-benchmark lane (196 files deleted, 57 edited) and its implementation summary asserts no dangling link remains, but the removal surface is still cited: the sk-code router's drift guard at `deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts` (`:311`) and its run command; the same guard called "the equality authority" in `alignment-verification-automation.md:112`; "consumed by the skill-benchmark router-replay" in five packet SKILL.md files; `loop-host.cjs --mode=skill-benchmark` in four benchmark READMEs against `VALID_MODES = {agent-improvement, model-benchmark}` (unknown modes warn and silently fall back); `run-skill-benchmark.cjs` in two scenario docs (file absent); `/deep:skill-benchmark` links in two benchmark READMEs (command file deleted); and the deleted `scoring-contract.md` in two more sites. The similarly named `sk-doc/sk-create-benchmark` storage guides do resolve and are excluded.
- Impact: An enforcement guarantee names a deleted test, four runnable commands no longer run the lane they name, and five SKILL.md files claim a removed consumer; the deprecation packet's own completion claim is false for its own removal surface.
- Recommendation: Run a completion pass over the 047 removal list: repoint or remove every citation, and decide whether the sk-code RESOURCE_MAP block needs a replacement enforcement guard. No fix was made during this review.
- Disposition: active
- findingClass: `post-deprecation-residue`
- scopeProof: Spec 047's spec and implementation summary read as the delete contract; every deleted path searched; `loop-host.cjs`'s `VALID_MODES` read to prove the fallback behavior; the surviving storage tree located before excluding those links.
- affectedSurfaceHints: sk-code ROUTER.md, five sk-code packet SKILL.md files, four benchmark READMEs, two playbook scenario docs, deep-improvement references.

#### F040 — Deep-ai-council playbook section 16 names five test files that exist only under their renamed multi- prefix

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/deep-ai-council/manual-testing-playbook/manual-testing-playbook.md:403`
- Evidence: Rows at `:403`, `:405`, `:406`, `:407` and `:408` cite `ai-council-{runtime-parity,permission-scope,audit-trail,rollback}.vitest.ts` and `cli/tests/ai-council-persist-artifacts.vitest.ts`; the live files all carry the `multi-` prefix and no unprefixed file exists under `system-spec-kit`. The three remaining rows resolve. The rename matches the packet's own rename scenario.
- Impact: An operator running the cross-reference as written gets vitest's no-files-found error.
- Recommendation: Update the five paths to their `multi-` prefixed names. No fix was made during this review.
- Disposition: active
- findingClass: `playbook-test-crossref-drift`
- scopeProof: All eight rows read; every named file checked against the live tree; the three resolving rows confirmed to prove the table's intent.
- affectedSurfaceHints: deep-ai-council playbook section 16.

### P2 — Suggestions

#### F023 — hub-router schema doc defines version as either router schema or artifact version in one sentence, and nothing validates it

- Dimension: maintainability
- Location: `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:53`
- Evidence: `:53` reads "Router schema or artifact version for the hub"; the observed fleet splits along that ambiguity (F021, F022). `ci-skill-root-metadata.cjs` reports the seven authored files and never regenerates them; its byte-compare covers only the manifest, and the required-file contract lists presence, not version values. No compiler, gate or runtime module reads any artifact version field.
- Impact: The ambiguity is the root mechanism that keeps F021 and F022 unresolvable by reading; each authoring pass inherits it.
- Recommendation: Split the doc's cell into the two possible meanings and name which one the file carries. No fix was made during this review.
- Disposition: active
- findingClass: `documented-ambiguity`
- scopeProof: The schema cell read directly; the fleet gate's manifest-only comparison and its required-file contract read; the compilers grepped for version consumers.
- affectedSurfaceHints: hub-router authoring doc, fleet metadata gate.

#### F027 — Improvement lanes receive byte-identical 61-leaf sets against the generator's N-to-1 distinctness contract and no consumer needs the distinction

- Dimension: maintainability
- Location: `.opencode/skills/system-deep-loop/leaf-manifest.json:96`
- Evidence: `agent-improvement` and `model-benchmark` arrays compare equal (61 leaves each) while both declare packet `deep-improvement` with distinct `loopHostMode` and aliases; `generate-leaf-manifest.cjs:155-158` promises N-to-1 alias fan-out keeps distinct independently addressable sets; no `leaf-aliases.json` exists; the compiled pipeline validates per-mode RESOURCE_MAP membership only, so identical supersets pass. The lanes' actual leaf sets diverge sharply (15 vs 39 exclusive paths).
- Impact: The generator's stated guarantee is unmet and manifest semantics are blurred for any future leaf-driven consumer; no live route breaks today.
- Recommendation: Implement the alias mechanism for the deep-improvement lanes or amend the generator contract to state that co-located modes share a set by design. No fix was made during this review.
- Disposition: active
- findingClass: `contract-unmet-non-distinct-sets`
- scopeProof: Byte equality re-verified programmatically; registry entries and generator contract read; alias file checked; membership-only validation read before bounding the impact.
- affectedSurfaceHints: improvement-lane manifests, generator contract, leaf-aliases mechanism.

#### F029 — Hub SKILL.md files carry hand-written mode counts their own registries contradict

- Dimension: maintainability
- Location: `.opencode/skills/cli-external-orchestration/SKILL.md:74`
- Evidence: cli-external-orchestration `SKILL.md:74` says the surface router defines the leaf-intent model "for all six modes" against `:54` "All seven modes are primary" and seven registered; system-deep-loop `SKILL.md:80` says "the 3 improvement modes share the deep-improvement packet" against two registered (agent-improvement, model-benchmark), and `:131` says "six registered modes" against five registered and `description.json:3` five modes.
- Impact: Three count statements across two hub front doors misstate the mode set their own registries define; nothing reads prose counts, so the drift persists.
- Recommendation: State counts from `mode-registry.json` or drop the numeral and reference the registry. No fix was made during this review.
- Disposition: active
- findingClass: `count-drift`
- scopeProof: All three registries parsed to count modes (5/6/7); each numeric statement read at its line; the sibling description.json statement checked for the correct count.
- affectedSurfaceHints: hub SKILL.md mode counts.

#### F030 — Deep-loop protocol and packet prose under-describes the executor set, and the council packet's prose contradicts its own resolver

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:281`
- Evidence: `loop-protocol.md:281` closes the executor-resolution section with the "seven-kind" authority `executor-config.ts` after naming cli-codex, cli-cursor, cli-devin and cli-pi and omitting cli-hermes; `deep-research/SKILL.md:267` repeats the seven-kind framing; `deep-ai-council/SKILL.md:22` states the resolver accepts native/cli-opencode/cli-cursor/cli-devin/cli-pi/opencode while `orchestrate-session.cjs` accepts cli-hermes and the same SKILL.md lists hermes rounds at `:26` and `:357`; both council YAMLs repeat the short list.
- Impact: A reader of any of these sentences under-provisions a supported capability; the council sentence reads the opposite of what the code does.
- Recommendation: Name cli-hermes in each enumeration (or reference `EXECUTOR_KINDS`), and correct the seven-kind count to the authority's eight. No fix was made during this review.
- Disposition: active
- findingClass: `incomplete-roster-statement`
- scopeProof: Both loop protocols, the research SKILL section, the council SKILL sections and both council YAMLs read at their lines; the council accept list traced to the resolver code.
- affectedSurfaceHints: review loop-protocol executor section, research SKILL sentence, council SKILL resolver sentence, council YAML seat parameter.

#### F031 — Deep-loop catalogs describe the executor dispatcher as three kinds (twice with a duplicated kind name) against a driver that implements eight

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:42`
- Evidence: `fanout-run.md:42` says "Supports all 3 CLI kinds: cli-opencode, cli-claude-code, cli-opencode" against `fanout-run.cjs:2717-2722`'s eight adapters; `deep-improvement` `model-dispatcher.md:27` says "across cli-opencode, cli-claude-code, and cli-opencode" against `dispatch-model.cjs`'s six KNOWN_EXECUTORS; `deep-review/feature-catalog/feature-catalog.md:150` and `executor-selection-contract.md:3,:29-35` describe `parseExecutorConfig` as one of three dispatch branches; `model-benchmark/README.md:75` says routes to cli-opencode or cli-claude-code.
- Impact: Four catalog sites understate what the dispatcher supports by 3-6 kinds, and the duplicated `cli-opencode` in two of them marks a botched rename that makes the wrong claim harder to notice.
- Recommendation: Correct the counts and kind names from the source files and sweep the same documents for further duplicated-name substitutions. No fix was made during this review.
- Disposition: active
- findingClass: `capability-claim-drift`
- scopeProof: Each claim read at its line; `fanout-run.cjs`'s adapter map (8) and `dispatch-model.cjs`'s KNOWN_EXECUTORS (6) read directly as the subject sources.
- affectedSurfaceHints: review feature-catalog executor claims, runtime fanout catalog, model-benchmark dispatcher docs.

#### F032 — cli-* packet sibling lists froze at each packet's authoring date, leaving the newest siblings out of six files

- Dimension: maintainability
- Location: `.opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md:381`
- Evidence: `cli-claude-code/SKILL.md:381` lists cli-opencode twice and neither cli-pi nor cli-hermes; cli-codex `:383` names two siblings, cli-cursor three, cli-devin four, cli-pi five, while cli-hermes names all six; `cli-devin/references/integration-patterns.md:30` still says Devin is the "5th executor kind" and `cli-pi/references/pi-tools.md:17` enumerates five siblings without cli-hermes. The four older packet READMEs do carry a cli-hermes row.
- Impact: Each older packet's prose roster omits at least the newest two siblings; the duplicate in cli-claude-code displaces cli-codex, so the intended list cannot be recovered from the file.
- Recommendation: Update each sibling list (or replace it with a pointer to `mode-registry.json`) and fix the duplicated-name slots. No fix was made during this review.
- Disposition: active
- findingClass: `incomplete-roster-statement`
- scopeProof: All seven cli-* SKILL.md Related-skills closures plus both named reference files read; packet README rows checked to confirm the SKILL.md lists were the stale surface.
- affectedSurfaceHints: cli-* packet Related-skills lists, cli-devin integration note, cli-pi tools note.

#### F035 — Runtime catalog still advertises fifty-five entries where headings, links and disk all give fifty-four

- Dimension: maintainability
- Location: `.opencode/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:19`
- Evidence: `:19` claims "The 55 entries below"; this review counted 54 `###` headings, 54 index links and 54 entry documents on disk, and wave one's category table sums to 54.
- Impact: A headline count a reader cannot check is wrong by one; every countable surface agrees with each other.
- Recommendation: Change the sentence to 54 or derive it. No fix was made during this review.
- Disposition: active
- findingClass: `count-drift`
- scopeProof: Three independent counts plus the category table; the consolidation paragraph confirmed outside the numbered entries.
- affectedSurfaceHints: runtime catalog index headline.

#### F038 — Legacy README presents a repository-wide checker as a local acceptance test and the checker currently fails

- Dimension: traceability
- Location: `.opencode/commands/deep/assets/legacy/README.md:108`
- Evidence: `:102-108` instructs running `validate-command-references.cjs` with "expected result: the checker reports that command references resolve cleanly"; executed this review it prints `FAIL 10 unresolved command reference(s)` and exits 1, all ten inside `.opencode/commands/design/**` (absent `sk-design` asset paths). The checker scans repository-wide targets by default, and its own self-test writes only under an `os.tmpdir()` root, so the failure is a real unresolved-reference population rather than a dirty run.
- Impact: The validation block claims a guaranteed pass that does not hold, and its scope is wider than the document citing it.
- Recommendation: Scope the command to the legacy assets or state the known-failing surface. No fix was made during this review.
- Disposition: active
- findingClass: `validation-scope-mismatch`
- scopeProof: The command executed with exit status and full failure list read; every failure confirmed outside the document's subject tree; the checker's write surface read before executing it.
- affectedSurfaceHints: legacy body index validation block.

#### F041 — Deep-research catalog and playbook cite a command path that no longer exists and a section anchor the successor lacks

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/deep-research/feature-catalog/research-output/progressive-synthesis.md:43`
- Evidence: `progressive-synthesis.md:43` and `jsonl-reconstruction-from-iteration-files.md:49,:75` cite `.opencode/commands/speckit/deep-research.md` (absent); the speckit README's own tree places the command at `deep/research.md`, whose live file carries six sections and no `## 10. ERROR HANDLING` anchor that `:75` names.
- Impact: A reader following the citation finds no file, and repointing alone still leaves the section anchor unsatisfied.
- Recommendation: Repoint to `.opencode/commands/deep/research.md` and fix or drop the section anchor. No fix was made during this review.
- Disposition: active
- findingClass: `stale-command-reference`
- scopeProof: Both command directories listed; the successor command read and its section headings enumerated; the anchor text located only in presentation assets and the playbook, not the command.
- affectedSurfaceHints: deep-research catalog, deep-research playbook pause-resume scenario.

#### F042 — Two sk-code packet READMEs reference the parent hub and shared doctrine one directory level too high

- Dimension: maintainability
- Location: `.opencode/skills/sk-code/sk-code-obsidian/README.md:161`
- Evidence: `sk-code-obsidian:96,118,161` and `sk-code-mobile-cli:88,108,147` use `../../ROUTER.md`, `../../mode-registry.json`, `../../hub-router.json` and `../../shared/`; from a packet-root README those resolve to `.opencode/skills/`, which holds no router, registry or shared directory. Sibling packets at the same depth use the correct one-level form (`sk-code-quality/README.md:131`, `sk-code/shared/README.md:32`).
- Impact: Six references in two packets promise navigation targets that do not exist, while four sibling packets show the correct form.
- Recommendation: Drop one `../` in all six references. No fix was made during this review.
- Disposition: active
- findingClass: `relative-path-depth-drift`
- scopeProof: The six citation lines read; both resolutions tested against the live tree; sibling READMEs read as the control.
- affectedSurfaceHints: sk-code-obsidian README, sk-code-mobile-cli README.

#### F043 — Deep-ai-council catalog cites rollback.js where the library is rollback.cjs

- Dimension: maintainability
- Location: `.opencode/skills/system-deep-loop/deep-ai-council/feature-catalog/convergence-and-rollback/rollback-failed-round-preserves-forensic-trail.md:31`
- Evidence: `:31` and `:43` cite `scripts/lib/rollback.js` (the keyword block at `:6` repeats the name); the directory holds `README.md`, `audit-trail.cjs`, `findings-registry.cjs`, `persist-artifacts.cjs` and `rollback.cjs`, and no `.js` file.
- Impact: The scenario's source pointer leads to nothing; the sibling libraries are all `.cjs`, so the extension is a single-file slip.
- Recommendation: Correct the two citations to `rollback.cjs`. No fix was made during this review.
- Disposition: active
- findingClass: `extension-drift`
- scopeProof: The citations read at their lines; the library directory listed and the `.js` absence confirmed.
- affectedSurfaceHints: council rollback catalog entry.

#### F044 — Three agent-discipline stress scenarios and their setup script depend on a fixture root that does not exist

- Dimension: maintainability
- Location: `.opencode/skills/system-deep-loop/deep-improvement/manual-testing-playbook/agent-discipline-stress-tests/setup-cp-sandbox.sh:7`
- Evidence: `active-critic-overfit.md:109`, `proposal-only-boundary.md:114` and `skill-load-not-protocol.md:111` list `deep-improvement/test-fixtures/060-stress-test/` as their fixture source; `setup-cp-sandbox.sh:7` hardcodes it as `FIXTURE_ROOT` and guards it with `require_path` at `:90-91`, which exits 1 with "required path not found". No `test-fixtures/` directory exists under `deep-improvement`, and spec 047's spec and implementation summary never mention the corpus.
- Impact: The sandbox setup fails closed and the three scenarios cannot be run as written; the removal path is unattributed.
- Recommendation: Restore the fixture corpus or repoint the scenarios and script. No fix was made during this review.
- Disposition: active
- findingClass: `missing-fixture-root`
- scopeProof: The fixture path searched repo-wide (absent); the setup script's guard read and its fail-closed behavior confirmed; the deprecation packet read to test the attribution question.
- affectedSurfaceHints: three stress-scenario docs, setup-cp-sandbox.sh.

## Remediation Workstreams

1. **WS1 — cli-external-orchestration roster and executor-description completion (P0 first):** F028, F029, F030, F031, F032. Restore `cli-hermes` across ROUTER.md's three statements and its leaf bullet, correct the hub-SKILL counts, and make every executor-kind and sibling enumeration derive from its authority. This workstream closes the only blocker.
2. **WS2 — Leaf-manifest generator and doctrine reachability:** F024, F025. Fix the symlink skip in `walkLeafFiles`, regenerate every affected manifest, and prove the twelve leaves appear while the gates still pass; then decide whether the four surfaces route the doctrine or cite it.
3. **WS3 — Version authority and identity-pair rules:** F021, F022, F023. Decide the version field's meaning once, then synchronize or rename it and add the SKILL.md-versus-changelog comparison.
4. **WS4 — Preamble and leaf-set policy semantics:** F026, F027. Keep one operative statement per hub and delete the other; amend or implement the N-to-1 distinctness contract.
5. **WS5 — Catalog, README and cross-reference integrity:** F033, F034, F035, F036, F041, F042, F043. Repoint the stale generation and reference citations, correct the counts, and fix the relative-depth and extension slips.
6. **WS6 — Deprecation completion, playbook cross-references and validation scopes:** F037, F038, F039, F040, F044. Run the 047 completion pass, fix both playbook cross-references, scope the legacy README's check, and restore or repoint the stress fixtures.

## Spec Seed

- Define the reference contract for catalogs, READMEs and playbooks: every cited path is a live file, a declared generated output, or explicitly marked historical; no document counts a population it does not derive.
- Define a deprecation-completion gate: a removal packet may not close until every live citation of every deleted path is repointed or removed, and a silent-fallback mode enumeration is itself a finding.
- Define which compiled-routing layout generation the doc family must name and stamp those references from one source rather than restating numeric prefixes.
- Require playbook test cross-references to be verified by an existence check or execution at review time, with a named command per row.
- Require fixture-dependent scenarios and setup scripts to declare their fixture root as a live path and fail loudly when it is absent.

## Plan Seed

1. Add `cli-hermes` to ROUTER.md's rosters and leaf bullet; correct `SKILL.md:74`; fix the F029/F030/F031 counts and kind names from their subject sources; update each cli-* packet sibling list.
2. Fix `walkLeafFiles`' symlink handling, regenerate every affected manifest, and prove the twelve `sk-code` leaves appear while the freshness gates still pass; then decide the doctrine's delivery mechanism.
3. Adjudicate the version field's meaning once, then synchronize or rename it; pair the decision with F023's doc split.
4. Keep one operative preamble policy per hub and delete the conflicting statement; amend or implement the deep-improvement lanes' alias mechanism.
5. Repoint the nine 013/014 generation citations and the nine stale references; correct the 55→54 and four→three counts; fix the deep-research command path, the six relative-depth references and the `.js`→`.cjs` slip.
6. Run a completion pass over spec 047's removal list; decide whether sk-code's RESOURCE_MAP needs a replacement enforcement guard; fix the five council test paths; scope the legacy README's checker; restore or repoint the stress-fixture corpus.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | partial | Phase spec lines 83 and 98-102 (the five wave-two angles) against 24 findings | The spec names no resolution authority for the artifacts' own rosters and rules; every angle executed fully, and the artifacts still cannot satisfy their stated claims as written (F021-F028). |
| `checklist_evidence` | notApplicable | The phase spec carries no per-iteration checklist rows | REQ rows are assessed at synthesis, not per iteration. |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `feature_catalog_code` | partial | ~1,100 documents path-scanned; the real reference classes hand-verified | Nine stale generation citations across three hubs (F033), nine stale references in four classes (F034), one count shortfall (F035), one renamed extension (F043), one stale command path (F041); index integrity itself is sound. |
| `playbook_capability` | partial | All playbook commands and flags resolve; both test cross-references read | The deep-review playbook's test cross-reference is a false absence claim (F037); the council's names five renamed files (F040); the legacy README's validation block fails as written (F038). |

## Deferred Items

- **Security dimension is unreached by design, not omission.** No angle in this lane touches an auth, secret, permission or injection surface.
- **Wave-two angles 16-20 belong to `wave2-glm`.** This lane's five angles are complete; its hand-off surface is the strategy's swept list.
- **The `if_cli_hermes` branch-key question stays deferred.** No in-repo consumer of `branch_on` / `if_cli_*` exists (iteration 4), so the matcher lives outside the repository; the question is carried in the ledger with its resolution path rather than filed as a finding.
- **F044's removal attribution is unresolved.** The stress fixture corpus is absent but spec 047's spec and summary never mention it; restoring or repointing is the fix, attributing the removal is bookkeeping a later pass may resolve.
- **F034's Class B handler path should be re-checked if a coverage-graph handler lands.** The cited `runtime/handlers/coverage-graph/` child does not exist today; stale copies of the test names exist elsewhere in the repository, so the accurate claim is absence-at-the-cited-path.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: hub-root version fields across three hubs and seventeen mode packets (angle 11); leaf-manifest generation and the twelve invisible symlink leaves (angle 12); the compiled runtime's preamble enforcement and the improvement-lane leaf-set identity (angle 13); every executor/mode roster statement across three hubs, four artifact classes, six command YAMLs and two compiled contracts (angle 14); every catalog, README and playbook reference, count and cited path under the three hubs, ~1,100 documents scanned (angle 15)
- Pivot lineage: none
- Remaining frontier: synthesis complete; remediation routes through `/speckit:plan`

## Search Ledger

Thirty-five ledger entries (SL-041 through SL-075) are recorded across the five iteration delta files under `deltas/`. Twenty-three are dispositions of `finding`; twelve are `ruled_out`, covering catalog index integrity in four catalogs, the surviving `sk-create-benchmark` storage guides, the forward-referenced fixture in the blocked-stop scenario, the preview-server scenario marker, template-placeholder noise, mode-packet version drift, preamble runtime reachability, a second invisible-leaf class, routing-capability breakage, identical-set consumer breakage, and the remaining classes recorded per iteration.

## Audit Appendix

- **Iterations run:** 5 of 5, one per wave-two angle, in the phase spec's order.
- **Stop reason:** `maxIterationsReached`. Convergence telemetry was recorded but never gated this lane (`stopPolicy: max-iterations`, `convergenceMode: off`).
- **New findings ratio:** 1.00 in every iteration; rolling average 1.00; MAD noise floor 0.00 across five samples.
- **Findings:** 24 active (P0 1, P1 11, P2 12), 0 resolved, 0 withdrawn; six P1 and six P2 were added by angle 15.
- **Re-verification record:** every wave-one reference finding this lane targeted re-reproduced at its live line (F014→F033, F015→F034, F016→F035, F018→F036, F019→F037, F020→F038); two were widened (F014 from one hub to three; F015's classes re-located with a ninth site).
- **Claim adjudication:** passed in all five runs.
- **Resolution-accuracy record:** angle 15's raw extraction produced 2,675 unresolved candidates that hand triage reduced to the real reference classes; a first pass miscategorized one deep-research feature doc (precise per-heading check: 25/25 links resolve), a suspected storage-guide breakage proved live, and the coverage-graph test claim was narrowed to absence-at-the-cited-path after stale copies were found elsewhere. Each was corrected before filing; the pattern is recorded in strategy §7B.
- **Verifier record:** `verify-iteration.cjs` returned `OK iteration 5 complete: narrative + route-proof + delta`; its output was read, not its exit status alone.
- **Files changed by this review:** none outside this lineage directory.

---

Generated: 2026-09-15T15:50:00Z | Session: fanout-wave2-deepseek-1789475514883-p58bmd | Executor: cli-pi / deepseek-v4.1-flash / max | Lineage: new, generation 1
