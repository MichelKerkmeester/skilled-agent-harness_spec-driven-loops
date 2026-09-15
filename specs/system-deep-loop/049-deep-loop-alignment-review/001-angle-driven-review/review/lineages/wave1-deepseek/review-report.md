---
title: "Deep Review Report — Angle-Driven Alignment Review, wave1-deepseek"
trigger_phrases: []
---
# Deep Review Report — Angle-Driven Alignment Review, wave one, lane wave1-deepseek

## Executive Summary

**Verdict: FAIL**
**Release readiness:** `release-blocking`
**hasAdvisories:** `true`
**Active findings:** P0=1, P1=12, P2=7 (20 open, 0 resolved, 1 drafted finding withdrawn after verification)

Five iterations, one wave-one angle each, over the deep-loop hub, its three neighbour hubs and the deep-command asset tree. Every iteration landed confirmed defects; none came back clean. One blocker stands: `cli-external-orchestration`'s `ROUTER.md` omits its own seventh registered mode, `cli-hermes`, from all three roster statements while the same file's machine block registers it — the phase spec predicted this defect and the review confirms it at line.

The single highest-leverage finding is not the blocker. It is F011: the fleet's leaf-manifest generator skips symlinks, so twelve `sk-code` workflow-doctrine files that four surface `SKILL.md` files declare loadable never become typed leaves and are unreachable from the router. The CI drift gate cannot catch it because it regenerates with the same walker and byte-compares, so a manifest missing symlinks still reports fresh. One generator defect, twelve unreachable files, one blind gate.

Also worth separating from the noise: five of the twenty findings are one defect class — a hand-maintained count, inventory or absence claim that the tree already answers (F002, F016, F018, F019, plus F004's leaf-set count). The pattern runs in both directions: a runtime catalog claims 55 entries where 54 exist, a compiled-contracts README claims four contracts where three exist and then states three twenty-one lines later, a `SKILL.md` claims three improvement lanes against a two-lane registry, and a playbook asserts no test suite exists while eighteen test files do. Every one of these is a number or an absence a script could derive and a reader cannot check.

Two iteration-1 findings were re-scoped downward in iteration 2 rather than defended (F003 withdrawn to fleet-wide convention drift, F004 narrowed off a first-slice premise), and one draft in iteration 5 was withdrawn outright after its own verification showed the claim was true. No reviewed source was changed. All writes are review artifacts in this lineage directory.

## Planning Trigger

`/speckit:plan` is required. The FAIL verdict carries an active P0 and three failed or partial traceability protocols; remediation must be planned as coordinated changes across the two hubs' routing artifacts, the leaf generator, the catalogs and the playbooks rather than as isolated prose edits. The generator fix in particular has fleet-wide reach and must land before the twelve untyped `sk-code` leaves are declared closed.

Planning Packet

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": true,
  "activeFindings": [
    {"id":"F007","severity":"P0","findingClass":"roster-omission","title":"cli-external-orchestration ROUTER.md omits the seventh registered mode cli-hermes in all three roster statements"},
    {"id":"F011","severity":"P1","findingClass":"generator-symlink-skip","title":"Leaf-manifest generator skips symlinks, leaving 12 sk-code workflow doctrine files untyped and unreachable"},
    {"id":"F002","severity":"P1","findingClass":"internal-count-contradiction","title":"SKILL.md states two improvement-lane counts and a six-mode roster no artifact supports"},
    {"id":"F001","severity":"P1","findingClass":"version-drift-no-authority","title":"Seven hub routing artifacts carry six disagreeing version values, two with no version key"},
    {"id":"F003","severity":"P1","findingClass":"field-semantics-collision","title":"hub-router.json and ROUTER.md state opposite always-loaded-preamble policies, fleet-wide"},
    {"id":"F004","severity":"P1","findingClass":"n-to-one-leaf-non-distinctness","title":"Both improvement lanes receive byte-identical 61-leaf sets from a shared packet"},
    {"id":"F008","severity":"P1","findingClass":"internal-count-contradiction","title":"cli-external-orchestration SKILL.md:74 says all six modes against seven in the same file"},
    {"id":"F009","severity":"P1","findingClass":"version-pair-split","title":"cli-external-orchestration splits the mode-registry/hub-router version pair that sk-code keeps in parity"},
    {"id":"F012","severity":"P1","findingClass":"doctrine-reachability-via-prose","title":"Implement-debug-verify doctrine reachable only by prose citation in four surfaces"},
    {"id":"F014","severity":"P1","findingClass":"stale-runtime-generation-reference","title":"Compiled-routing catalog cites a superseded runtime layout generation in four places"},
    {"id":"F015","severity":"P1","findingClass":"stale-catalog-reference","title":"Eight catalog entries cite files absent at the cited path across four verified stale-reference classes"},
    {"id":"F018","severity":"P1","findingClass":"internal-count-contradiction","title":"Compiled-contracts README headline count is wrong and the same error appears twice more in the legacy README"},
    {"id":"F019","severity":"P1","findingClass":"false-claim-of-absence","title":"Deep-review playbook asserts no automated test suite exists while 18 deep-review test files do"},
    {"id":"F005","severity":"P2","findingClass":"retired-vocabulary-residue","title":"Retired families still present in hub keyword block and graph-metadata discovery terms"},
    {"id":"F006","severity":"P2","findingClass":"registry-alias-not-scored","title":"Two model-benchmark registry aliases are absent from the hub scoring vocabulary"},
    {"id":"F010","severity":"P2","findingClass":"lane-unique-reference-undocumented","title":"cli-hermes leaf set carries a lane-unique reference no ROUTER.md sentence describes"},
    {"id":"F013","severity":"P2","findingClass":"unexplained-version-skew","title":"Two sk-code surfaces sit at 0.1.* against 1.0.0.2 or above with no changelog explanation"},
    {"id":"F016","severity":"P2","findingClass":"internal-count-mismatch","title":"Runtime catalog prose claims 55 entries while four independent counts all give 54"},
    {"id":"F017","severity":"P2","findingClass":"coverage-thinness","title":"Catalogs name three of the runtime seven cli executor kinds, omitting cli-hermes, cli-codex and cli-pi"},
    {"id":"F020","severity":"P2","findingClass":"validation-scope-mismatch","title":"Legacy README presents a repository-wide command-reference checker as a local acceptance test"}
  ],
  "remediationWorkstreams": [
    "WS1 cli-external-orchestration roster completion (P0 first): F007, F008, F010",
    "WS2 leaf-manifest generator symlink handling and sk-code doctrine reachability: F011, F012",
    "WS3 system-deep-loop hub count, roster and version authority: F001, F002, F003, F004, F005, F006",
    "WS4 catalog and README reference integrity: F014, F015, F016, F017, F018, F019, F020",
    "WS5 version-pair and skew adjudication: F009, F013"
  ],
  "specSeed": [
    "Define one authoritative mode roster per hub and require every prose, machine-block and leaf statement to derive from it, not restate it.",
    "Define the leaf generator's symlink semantics: either resolve symlinked references as typed leaves, or declare symlinks explicitly out of contract in the generator's own documentation and in every SKILL.md that cites them.",
    "Define which version field, if any, is the hub's authoritative identity, and state whether cross-artifact parity is required or forbidden.",
    "Define a catalog entry's reference contract so a cited path is either a live file, a declared generated output, or explicitly marked historical.",
    "Define the validator-scope rule for README validation blocks: a cited check must be scoped to the document's subject or the document must state its known-failing surface.",
    "Require that any document asserting an absence (no tests, no files, no consumers) carries the search that established it."
  ],
  "planSeed": [
    "Add cli-hermes to ROUTER.md's mode list, INTENT MODEL bullet set and no-match fallback list; verify against the registry's seven modes.",
    "Correct SKILL.md:74 to seven modes and re-run the count-phrase sweep across the hub.",
    "Fix generate-leaf-manifest.cjs's walkLeafFiles to handle symlinked files, regenerate every affected manifest, and confirm the freshness gate now reports the 12 sk-code leaves.",
    "Decide and document whether the four surface copies of the doctrine remain symlinks or become routed references, then update the four SKILL.md citations accordingly.",
    "Resolve the improvement-lane count contradiction in SKILL.md and README.md against the two-lane registry and loop-host.cjs VALID_MODES.",
    "Adjudicate hub-router.json routerPolicy.defaultResource and ROUTER.md DEFAULT_RESOURCE as one concept or two, fleet-wide, before editing either.",
    "Repoint the nine stale catalog references and the four superseded compiled-routing generation references.",
    "Correct the three count claims (F016, F018) and replace the deep-review playbook's false absence claim with a test cross-reference in the sibling form.",
    "Scope or annotate the legacy README's repository-wide validation command."
  ]
}
```

## Active Finding Registry

### P0 — Blocker

#### F007 — cli-external-orchestration ROUTER.md omits the seventh registered mode cli-hermes in all three roster statements

- Dimension: traceability
- Location: `.opencode/skills/cli-external-orchestration/ROUTER.md:24-25`
- Evidence: `ROUTER.md:24-25` introduces the hub-router mode list as six, omitting `cli-hermes`. `ROUTER.md:38-46` carries exactly six per-mode INTENT MODEL bullets and zero occurrences of the word hermes in lines 1-70. `ROUTER.md:143-144`'s no-match fallback enumerates the same six. Against that: `mode-registry.json` registers seven modes, `hub-router.json` carries seven routerSignals and `cli-hermes` in its tieBreak, `leaf-manifest.json` carries a nine-leaf `cli-hermes` entry, `SKILL.md:31` has the mode-table row, and the *same* `ROUTER.md`'s machine block registers a HERMES key with two paths.
- Impact: The hub's stage-two surface router cannot introduce its own seventh mode to a reader. The mode is registered, routable and has leaves; it is invisible in the document whose job is to introduce modes. The phase spec predicted exactly this defect.
- Recommendation: Add `cli-hermes` to all three roster statements and verify against the registry.
- Disposition: active
- findingClass: `roster-omission`
- scopeProof: All seven routing artifacts read; every roster statement in the hub counted by key extraction; the six-versus-seven contradiction verified in five places.
- affectedSurfaceHints: `ROUTER.md` mode list, INTENT MODEL bullets, no-match fallback, `SKILL.md:74`.

### P1 — Required

#### F001 — Seven hub routing artifacts carry six disagreeing version values, two with no version key

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/SKILL.md:3`
- Evidence: SKILL.md 3.0.0.0, mode-registry.json 2.0.0.1, hub-router.json 2.0.1.1, ROUTER.md 1.0.1.0, description.json 2.2.3.0 and README.md 2.2.3.0, with leaf-manifest.json and graph-metadata.json carrying no version key. Both sibling hubs keep SKILL.md equal to description.json; this hub is the outlier on that pair. No version-parity check exists in `parent-skill-check.cjs`.
- Impact: Six values across seven artifacts with no stated authority and no gate. The sibling control is what makes this hub-local rather than house style.
- Recommendation: Declare the authoritative version field and state whether parity is required.
- Disposition: active
- findingClass: `version-drift-no-authority`
- scopeProof: Sibling hubs read as controls; the version-parity gate checked by grep and confirmed absent.
- affectedSurfaceHints: all seven hub routing artifacts, `parent-skill-check.cjs`.

#### F002 — SKILL.md states two improvement-lane counts and a six-mode roster no artifact supports

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/SKILL.md:161`
- Evidence: `SKILL.md:27` says "improvement (2 lanes)" and `:58` "the two improvement lanes", but `:161` says "improvement (3 lanes)" and `:131` claims "the six registered" modes. `README.md:62` also says "the three improvement lanes". `mode-registry.json` registers five modes, `leaf-manifest.json` agrees, and `loop-host.cjs` sets VALID_MODES to exactly two.
- Impact: A three-lane roster is asserted in three places across two documents and exists in no registry, no manifest and no runtime module.
- Recommendation: Resolve all four statements against the two-lane registry.
- Disposition: active
- findingClass: `internal-count-contradiction`
- scopeProof: Registry, manifest and runtime module all read; the contradiction counted across every hub document that states a lane count.
- affectedSurfaceHints: `SKILL.md:27/58/131/161`, `README.md:62`.

#### F003 — hub-router.json and ROUTER.md state opposite always-loaded-preamble policies, fleet-wide

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/hub-router.json:13`
- Evidence: `routerPolicy.defaultResource` is `['ROUTER.md','mode-registry.json']` while `ROUTER.md`'s machine block declares `DEFAULT_RESOURCE = []`. Iteration 2 established the divergence is fleet-wide — no hub's two declarations agree — and that the array shape is outside the authored contract (`compiler.cjs:184-186` asserts a scalar string).
- Impact: Bounded. Only the `004-cli-external-orchestration` compiler branch reads the field at all, so no live route fails today; the finding is a two-concept name collision across five surfaces.
- Recommendation: Adjudicate as one concept or two, fleet-wide, before editing either.
- Disposition: active
- findingClass: `field-semantics-collision`
- scopeProof: All four registry-compiler branches grepped for the field; the authored validator read for its type assertion.
- affectedSurfaceHints: `routerPolicy.defaultResource`, `DEFAULT_RESOURCE`, all three hubs.

#### F004 — Both improvement lanes receive byte-identical 61-leaf sets from a shared packet

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/leaf-manifest.json:96`
- Evidence: `agent-improvement` and `model-benchmark` both map to packet `deep-improvement` and carry byte-identical 61-leaf arrays, while the two lanes' actual leaf sets diverge sharply (15 agent-improvement-only, 39 model-benchmark-only paths). Across the three in-scope hubs this is the only N-to-1 packet sharing.
- Impact: The manifest cannot discriminate the two lanes' leaf sets. The typed `(workflowMode, leafResourceId)` pair still distinguishes them, which is what bounds this at P1 after iteration 2 narrowed it off the withdrawn 2-vs-61 arm.
- Recommendation: Either give the lanes distinct manifests or state in the generator's contract that N-to-1 sharing produces identical sets by design.
- Disposition: active
- findingClass: `n-to-one-leaf-non-distinctness`
- scopeProof: Generator walk read; per-mode set difference computed programmatically; fleet census of N-to-1 groups taken.
- affectedSurfaceHints: `leaf-manifest.json`, `generate-leaf-manifest.cjs`.

#### F008 — cli-external-orchestration SKILL.md:74 says all six modes against seven in the same file

- Dimension: traceability
- Location: `.opencode/skills/cli-external-orchestration/SKILL.md:74`
- Evidence: `:74` says ROUTER.md defines the per-mode leaf-intent model for "all six modes" while `:3`, `:15`, `:54` and `:190` of the same file say seven, `README.md` says seven five times, and `description.json:3` enumerates all seven by name.
- Impact: A self-contradiction inside one document, in the same hub as F007.
- Recommendation: Correct `:74` to seven modes.
- Disposition: active
- findingClass: `internal-count-contradiction`
- scopeProof: Programmatic mode-count phrase extraction across the hub's three prose surfaces.
- affectedSurfaceHints: `SKILL.md:74`.

#### F009 — cli-external-orchestration splits the mode-registry/hub-router version pair that sk-code keeps in parity

- Dimension: traceability
- Location: `.opencode/skills/cli-external-orchestration/mode-registry.json:3`
- Evidence: `mode-registry.json` 1.2.0.2 against `hub-router.json` 1.2.1.2, where `sk-code` keeps that pair identical at 4.1.0.1. Together with F001 this completes the fleet matrix: `system-deep-loop` splits both pairs, `cli-external-orchestration` splits one, `sk-code` splits neither.
- Impact: A 2-of-3 pattern, and correspondingly weaker evidence of defect than F001 — recorded at P1 because the registry and its router are the pair most likely to be edited together.
- Recommendation: Bring the pair into parity or declare the two artifacts independently versioned.
- Disposition: active
- findingClass: `version-pair-split`
- scopeProof: Full version matrix across three hubs, five artifacts each.
- affectedSurfaceHints: `mode-registry.json`, `hub-router.json`.

#### F011 — Leaf-manifest generator skips symlinks, leaving 12 sk-code workflow doctrine files untyped and unreachable

- Dimension: traceability
- Location: `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:73-89`
- Evidence: `walkLeafFiles` does `if (!entry.isFile()) continue;`, and Node's `fs.Dirent.isFile()` returns false for a symlink, so symlinked files are silently dropped. `sk-code`'s four surface packets each hold `references/workflow-{debug,implement,verify}.md` as symlinks to `../../shared/references/`, and the hub `SKILL.md:39` and `sk-code-obsidian/SKILL.md:62` state those files are loadable in each surface. None appear as typed leaves. Fleet symlink census: `system-deep-loop` 122 files/0 symlinks, `sk-code` 286 files/12 symlinks, `cli-external-orchestration` 66 files/0 symlinks — all twelve unreachable files are symlinks and all twelve are in `sk-code`.
- Impact: Twelve declared-loadable files are unreachable from the router. The CI freshness gate (`ci-leaf-manifest-freshness.cjs`) regenerates with the same walker and byte-compares, so the manifest reports fresh while being semantically incomplete — the defect is invisible to the gate built to catch it.
- Recommendation: Handle symlinked files in `walkLeafFiles`, regenerate, and confirm the leaves appear.
- Disposition: active
- findingClass: `generator-symlink-skip`
- scopeProof: Root cause traced to the `isFile()` guard; fleet census taken to establish scope; the gate read to establish why it cannot catch this.
- affectedSurfaceHints: `generate-leaf-manifest.cjs:73-89`, all ten `sk-code` leaf manifests, `ci-leaf-manifest-freshness.cjs`.

#### F012 — Implement-debug-verify doctrine reachable only by prose citation in four surfaces

- Dimension: traceability
- Location: `.opencode/skills/sk-code/SKILL.md:39`
- Evidence: The doctrine's shared origin (`shared/references/workflow-*.md`) is a deliberately non-leaf control root — `SKILL.md:62` calls it "a control resource that resolves on disk but never projects as a leaf" — and its four surface copies are the symlinks F011 drops. The eight declared `SHARED_CONTROL_RESOURCES` in `ROUTER.md:629-637` all resolve but contain no `workflow-*.md`.
- Impact: The doctrine is citable but not routable, and the carve-out that makes the shared root legitimate does not cover it.
- Recommendation: Decide whether the surfaces route the doctrine or cite it, then make the manifest agree.
- Disposition: active
- findingClass: `doctrine-reachability-via-prose`
- scopeProof: `SHARED_CONTROL_RESOURCES` enumerated and all eight resolved; the control-resource carve-out read in the hub SKILL.md.
- affectedSurfaceHints: `SKILL.md:39/62`, `ROUTER.md:629-637`, four surface packets.

#### F014 — Compiled-routing catalog cites a superseded runtime layout generation in four places

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md:28`
- Evidence: The entry and the hub index cite `011-runtime-engine/lib/resolve.cjs` and `010-live-activation/activation/system-deep-loop/manifest.json`. The live layout root holds 003, 004, 005, 008, 009, 013, 014 — the live pair is `014-runtime-engine` and `013-live-activation`. The entry prose is written around the stale paths in the present tense.
- Impact: A current-state inventory describes the wrong generation. The front door executes correctly today, which is what keeps this at P1 rather than escalating it.
- Recommendation: Update the four sites to 013 and 014.
- Disposition: active
- findingClass: `stale-runtime-generation-reference`
- scopeProof: Layout root listed, both current paths resolved, the front door executed to prove runtime correctness, and the generation-mixing contract read.
- affectedSurfaceHints: compiled-routing catalog entry, hub `feature-catalog.md:71`.

#### F015 — Eight catalog entries cite files absent at the cited path across four verified stale-reference classes

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/runtime/feature-catalog/validation/mk-deep-loop-guard.md:77`
- Evidence: Four classes, each hand-verified: (a) two archived-track spec paths (`.opencode/specs/deep-loops/031-…` renamed to 025- and moved under `specs/system-deep-loop/z_archive/`); (b) a coverage-graph handler at `system-spec-kit/runtime/handlers/coverage-graph/convergence.ts` where the directory does not exist and no such basename exists repo-wide; (c) two playbook paths using the retired numeric-prefix filenames (`029_insight_status_prevents_false_stuck.md`, `027_resource_map_emission.md`) against the live kebab-case files; (d) two citations of `runtime/scripts/tests/resource-map-extractor.vitest.ts` against the live `runtime/tests/` location.
- Impact: Nine dead pointers across a catalog whose contract is that entries name live files.
- Recommendation: Repoint, or mark the two archived spec paths as historical provenance.
- Disposition: active
- findingClass: `stale-catalog-reference`
- scopeProof: 445 references resolved against four candidate roots plus a repo-wide basename index, then each surviving miss hand-verified.
- affectedSurfaceHints: runtime catalog validation entries, deep-research and deep-review catalogs, playbook citations.

#### F018 — Compiled-contracts README headline count is wrong and the same error appears twice more in the legacy README

- Dimension: traceability
- Confidence: high
- Location: `.opencode/commands/deep/assets/compiled/README.md:19`
- Evidence: `:19` says the directory "stores the four flattened command contracts"; it stores three. `:23` of the same document says the inventory "is intentionally limited to the three commands registered with the contract compiler and renderer", and its own tree block at `:29-36` lists three contracts. `Object.keys(require('compile-command-contracts.cjs').COMMANDS)` returns exactly three. `legacy/README.md:13` and `:87` repeat the error, while `:19` of that file says three bodies and its tree lists three.
- Impact: The wrong number is the first sentence of the document this review angle names as its highest-value target, and the document refutes itself nine lines later.
- Recommendation: Change "four" to "three" at all three sites.
- Disposition: active
- findingClass: `internal-count-mismatch`
- scopeProof: Both directories listed, the compiler's registry read directly rather than inferred, and each count sentence compared against the tree block in its own document.
- affectedSurfaceHints: compiled contract index, legacy body index.

#### F019 — Deep-review playbook asserts no automated test suite exists while 18 deep-review test files do

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:610`
- Evidence: `:610` reads "No dedicated automated test suite currently exists for `deep-review`." and the section then names documentation paths only. Eighteen test files carry the packet's name or its reducer contract: eleven under `system-deep-loop/runtime/tests/`, one under `system-spec-kit/runtime/tests/deep-loop/`, six under `system-spec-kit/runtime/cli/tests/`. The packet also ships `deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs`, executed during this iteration → `[deep-review] reduce-state summary fallback regression passed`, exit 0.
- Impact: A false negative terminates the search. The two sibling playbooks that carry the section show the intended form — `deep-research` §15 names two test files, `deep-ai-council` §16 maps nine to scenario IDs.
- Recommendation: Replace the assertion with a test cross-reference in the sibling form.
- Disposition: active
- findingClass: `false-claim-of-absence`
- scopeProof: Every test file matching the packet name enumerated, the packet's own test executed, and both sibling playbooks read to establish the intended convention.
- affectedSurfaceHints: deep-review playbook §13.

### P2 — Suggestions

#### F005 — Retired families still present in hub keyword block and graph-metadata discovery terms

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/graph-metadata.json:124`
- Evidence: `graph-metadata.json` retains `standard-authority` in `derived.key_topics:124` and `skill benchmark` in `derived.trigger_phrases:113`, neither naming a live mode. `SKILL.md`'s Keywords comment carries five such terms (`conformance`, `standard-authority`, `conformance-review`, `read-only-default`, `reuse-catalog`), and `command-metadata.json` contains none of the first three.
- Impact: Advisory discovery text, not a control path.
- Recommendation: Prune retired vocabulary from the keyword block and graph metadata.
- Disposition: active
- findingClass: `retired-vocabulary-residue`
- scopeProof: Cross-checked every keyword against the five-mode registry and the command metadata roster.
- affectedSurfaceHints: `graph-metadata.json`, `SKILL.md` keywords.

#### F006 — Two model-benchmark registry aliases are absent from the hub scoring vocabulary

- Dimension: traceability
- Location: `.opencode/skills/system-deep-loop/mode-registry.json:147`
- Evidence: `'prompt framework benchmark'` and `'benchmark-harness'` are registered aliases but absent from `hub-router.json`'s `model-benchmark-aliases` class (`['/deep:model-benchmark','model benchmark','benchmark a model']`), so prompts using those registered aliases score no mode. This is the only registry-only alias gap in the hub; `cli-external-orchestration` has none.
- Impact: A real recall gap with the lowest consequence of any registry finding.
- Recommendation: Add both aliases to the scoring class.
- Disposition: active
- findingClass: `registry-alias-not-scored`
- scopeProof: Programmatic registry-minus-vocabulary set difference, which is what surfaced it.
- affectedSurfaceHints: `mode-registry.json` aliases, `hub-router.json` vocabulary.

#### F010 — cli-hermes leaf set carries a lane-unique reference no ROUTER.md sentence describes

- Dimension: traceability
- Location: `.opencode/skills/cli-external-orchestration/leaf-manifest.json:1`
- Evidence: `cli-hermes`'s entry carries `references/mcp-policy.md`, a reference no other CLI mode's leaf set contains and no ROUTER.md sentence accounts for, where `ROUTER.md:40-44` and `:139-143` describe every other mode's first slice and its on-demand catalog.
- Impact: Advisory. The map is a declared first slice, which bounds the finding.
- Recommendation: Either describe the lane's extra reference or move it out of the first slice.
- Disposition: active
- findingClass: `lane-unique-reference-undocumented`
- scopeProof: Leaf sets compared mode-by-mode; the first-slice declaration read before filing.
- affectedSurfaceHints: `cli-hermes` leaf set, `ROUTER.md` first-slice prose.

#### F013 — Two sk-code surfaces sit at 0.1.* against 1.0.0.2 or above with no changelog explanation

- Dimension: maintainability
- Location: `.opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md:3`
- Evidence: `sk-code-mobile-cli` 0.1.11.0 and `sk-code-obsidian` 0.1.0.0 against four siblings at 1.0.0.2 or above. The gap does not track packet size — the two smallest packets sit at the higher versions.
- Impact: Advisory; confidence 0.55. Version skew without a documented reason.
- Recommendation: Add a changelog note or bring the two surfaces forward.
- Disposition: active
- findingClass: `unexplained-version-skew`
- scopeProof: All six surface versions read; leaf counts compared to test the size hypothesis.
- affectedSurfaceHints: two surface `SKILL.md` versions.

#### F016 — Runtime catalog prose claims 55 entries while four independent counts all give 54

- Dimension: maintainability
- Location: `.opencode/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:19`
- Evidence: Prose says 55. The per-category coverage table sums to 54, the index carries 54 level-3 headings, 54 index links resolve, and 54 entry docs exist on disk.
- Impact: A reader checking completeness finds a one-entry shortfall that does not exist. The index itself is structurally sound.
- Recommendation: Correct the sentence to 54.
- Disposition: active
- findingClass: `internal-count-mismatch`
- scopeProof: Four independent counts rather than one; the consolidation paragraph confirmed outside the numbered entries.
- affectedSurfaceHints: runtime catalog index headline.

#### F017 — Catalogs name three of the runtime seven cli executor kinds

- Dimension: maintainability
- Location: `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11`
- Evidence: `EXECUTOR_KINDS` exports `native` plus seven `cli-*` kinds. Across all catalog documents the only `cli-*` tokens present are `cli-claude-code`, `cli-opencode`, and `cli-surface` — which is not an executor kind. Six of seven CLI kinds are unnamed, including the newest and the two the fan-out paths use most.
- Impact: Coverage thinness rather than a false entry, since catalogs index features rather than executors.
- Recommendation: Enumerate supported kinds in the executor-config entry, or narrow the coverage claim.
- Disposition: active
- findingClass: `coverage-thinness`
- scopeProof: The runtime's exported constant read rather than inferred, then set-differenced against every catalog `cli-*` token.
- affectedSurfaceHints: executor-config catalog entry, runtime coverage table.

#### F020 — Legacy README presents a repository-wide command-reference checker as a local acceptance test

- Dimension: traceability
- Location: `.opencode/commands/deep/assets/legacy/README.md:108`
- Evidence: `:108` instructs running `validate-command-references.cjs` with the expected result at `:111` that "the checker reports that command references resolve cleanly". Executed: exit 1, `FAIL  10 unresolved command reference(s)`, all ten under `.opencode/commands/design/assets/` against `.opencode/skills/sk-design/` paths.
- Impact: Bounded. None of the ten belongs to a deep-loop tree and the README's own subject resolves cleanly inside that run; the defect is an unconditional expected result for a repository-wide check.
- Recommendation: Scope the check to the deep-command trees, or state the known-failing surface.
- Disposition: active
- findingClass: `validation-scope-mismatch`
- scopeProof: The command executed with its exit status and full failure list read, and every failure confirmed outside the document's subject tree before filing.
- affectedSurfaceHints: legacy body index validation block.

## Remediation Workstreams

1. **WS1 — cli-external-orchestration roster completion (P0 first):** F007, F008, F010. Restore `cli-hermes` to all three ROUTER.md roster statements, correct `SKILL.md:74`, and account for the lane's extra first-slice reference. This workstream closes the only blocker.
2. **WS2 — Leaf-manifest generator and doctrine reachability:** F011, F012. Fix the symlink skip in `walkLeafFiles`, regenerate every affected manifest, then decide whether the four surfaces route the doctrine or cite it. The generator fix must land and the freshness gate must be shown to now report the twelve leaves before F012 is adjudicated.
3. **WS3 — system-deep-loop hub count, roster and version authority:** F001, F002, F003, F004, F005, F006. Establish one authoritative roster and one authoritative version, then make every statement derive from them. F003's fleet-wide scope means this workstream's first step is a decision, not an edit.
4. **WS4 — Catalog and README reference integrity:** F014, F015, F016, F017, F018, F019, F020. Repoint the stale references, correct the three count claims, replace the false absence claim, and scope the validation block.
5. **WS5 — Version-pair and skew adjudication:** F009, F013. Lower priority than WS3's authority decision, which may resolve both.

## Spec Seed

- Define one authoritative mode roster per hub, and require every prose, machine-block and leaf statement to derive from it rather than restate it.
- Define the leaf generator's symlink semantics: resolve symlinked references as typed leaves, or declare them explicitly out of contract in the generator's own documentation and in every SKILL.md that cites them.
- Define which version field, if any, is a hub's authoritative identity, and state whether cross-artifact parity is required or forbidden.
- Define a catalog entry's reference contract so a cited path is a live file, a declared generated output, or explicitly marked historical.
- Define the validator-scope rule for README validation blocks: a cited check must be scoped to the document's subject, or the document must state its known-failing surface.
- Require that any document asserting an absence (no tests, no files, no consumers) carries the search that established it.

## Plan Seed

1. Add `cli-hermes` to ROUTER.md's mode list, INTENT MODEL bullets and no-match fallback; verify against the registry's seven modes.
2. Correct `SKILL.md:74` to seven modes and re-run the count-phrase sweep across the hub.
3. Fix `walkLeafFiles`' symlink handling, regenerate every affected manifest, and confirm the freshness gate reports the twelve `sk-code` leaves.
4. Decide and document whether the four doctrine copies stay symlinks or become routed references, then update the four SKILL.md citations.
5. Resolve the improvement-lane count contradiction against the two-lane registry and `loop-host.cjs` VALID_MODES.
6. Adjudicate `routerPolicy.defaultResource` and `DEFAULT_RESOURCE` as one concept or two, fleet-wide, before editing either.
7. Repoint the nine stale catalog references and the four superseded compiled-routing generation references.
8. Correct the three count claims (F016, F018) and replace the deep-review playbook's false absence claim with a test cross-reference.
9. Scope or annotate the legacy README's repository-wide validation command.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `spec_code` | partial | Phase spec lines 86-90 (the five wave-one angles) against 20 findings | Four of five required parity properties disagree for `system-deep-loop` (F001-F004); the spec names no resolution authority. |
| `checklist_evidence` | notApplicable | The phase spec carries no per-iteration checklist rows | REQ rows are assessed at synthesis, not per iteration. |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|---|---|---|---|
| `feature_catalog_code` | partial | 445 catalog references resolved across six catalog trees | Four stale-reference classes and one count mismatch confirmed (F014-F017). |
| `playbook_capability` | partial | 289 playbook documents; 10 `(script, flag)` pairs; 55 scenario docs | Every command and flag resolves; the deep-review playbook's test cross-reference is a false absence claim (F019). |

## Deferred Items

- **Security dimension is unreached by design, not omission.** No wave-one angle touches an auth, secret, permission or injection surface.
- **Wave-two angles 17-20 remain reserved.** This lane's three hand-off notes (strategy §11A) name the gate-coverage question for angle 15, the retired-generation residue question for angle 13, and the derive-versus-restate restraint question for angle 12.
- **F013 was filed at confidence 0.55.** It should be re-examined if any changelog for the two `0.1.*` surfaces surfaces.
- **DRAFT-005-A was withdrawn after verification.** The cli README's conformance-table claim is true (validator exits 0); the adjacent gate-coverage observation was carried to angle 15 rather than filed here.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: hub routing artifacts (angle 1), sibling-hub routing artifacts (angle 2), hub and mode resource reachability (angle 3), catalog-to-runtime references (angle 4), playbook and README claims against the runtime (angle 5)
- Pivot lineage: none
- Remaining frontier: synthesis only

## Search Ledger

Forty ledger entries (SL-001 through SL-040) are recorded across the five iteration delta files under `deltas/`. Thirty-two are dispositions of `finding`; eight are `ruled_out`, covering the SKILL.md tool-surface union, all 14 RESOURCE_MAP paths, hub-identity defer behavior, the complete `sk-code` parity baseline, the symlink census outside `sk-code`, catalog retired-feature residue, catalog index integrity, the deep-review playbook's own scenario counts, deep-command contract freshness, and playbook command/flag existence.

## Audit Appendix

- **Iterations run:** 5 of 5, one per wave-one angle, in the phase spec's order.
- **Stop reason:** `maxIterationsReached`. Convergence telemetry was recorded but never gated this lane (`stopPolicy: max-iterations`, `convergenceMode: off`).
- **New findings ratio:** 1.00 in every iteration; rolling average 1.00; MAD noise floor 0.00.
- **Findings:** 20 active (P0 1, P1 12, P2 7), 0 resolved, 1 drafted and withdrawn before filing.
- **Re-scoped findings:** 2 (F003 to fleet-wide convention drift, F004 narrowed off a withdrawn count-equality arm).
- **Claim adjudication:** passed in all five runs.
- **Resolution-accuracy record:** three iterations produced a false-positive population from a text-extraction shortcut (129 catalog false misses in iteration 4, 65 hub-relative "foreign leaves" in iteration 2, 34 phantom missing flags in iteration 5). Each was caught by hand-verification before filing; the pattern is recorded in strategy §7B as a standing caution.
- **Contract freshness:** `checkCommand()` returns zero failures for all three registered deep commands; the renderer's throw-on-stale path is live.
- **Files changed by this review:** none outside this lineage directory.

---
Generated: 2026-09-15T10:48:00Z | Session: fanout-wave1-deepseek-1789465945073-px9i6h | Executor: cli-pi / deepseek-v4.1-flash / max | Lineage: new, generation 1
