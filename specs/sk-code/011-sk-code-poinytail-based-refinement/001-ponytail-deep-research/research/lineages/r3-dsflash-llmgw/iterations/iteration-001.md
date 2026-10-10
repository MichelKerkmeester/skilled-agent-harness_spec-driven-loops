# Iteration 1: Shared-layer inventory and reachability

## Focus

Part 1, first slice: enumerate every file under `.skilled/skills/sk-code/shared/`, map how the four hub loaders (`SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`) actually reach each one, and record what is unreachable, duplicated across packets, or declared in one allowlist and not another. This is the frontier the lead named first: "the full inventory of shared/ against what the hub SKILL.md, ROUTER.md, hub-router.json and mode-registry.json actually load (unreachable files, files loaded by nothing, files loaded twice)".

## Actions Taken

1. Listed the shared tree with line counts and enumerated references to each shared basename from outside `shared/` (excluding `benchmark/reports/` history).
2. Read the four hub loaders plus `shared/README.md`; extracted the three loading declarations: `SKILL.md` §2 `route()`, `ROUTER.md` §11 `DEFAULT_RESOURCE` / `RESOURCE_MAP` / `SHARED_CONTROL_RESOURCES`, `hub-router.json` `routerPolicy.defaultResource` and the `verify_router_sync.cjs` allowlists.
3. Checked the surface symlinks (`find -type l`) and the leaf manifest for how the workflow trio is projected.
4. Byte-compared the same-named pattern assets in `shared/assets/patterns/` and `sk-code-webflow/assets/patterns/`; walked the diffs in full.
5. Re-read the guard's orphan walk (leg 1b) and its two allowlists to distinguish reported reachability from declared reachability. The nine docs leg 1b flags are known IN-FLIGHT scope and were not evaluated further.

## Findings

1. **The shared layer duplicates two of the Webflow packet's pattern assets, and the copies have diverged; both copies are reachable from the routed map.** `shared/assets/patterns/` ships `validation-patterns.js` and `wait-patterns.js` [SOURCE: .skilled/skills/sk-code/shared/README.md:74] [SOURCE: .skilled/skills/sk-code/shared/README.md:75], and `sk-code-webflow/assets/patterns/` ships the same two names plus two more [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/patterns/README.md:73] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/patterns/README.md:74] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/patterns/README.md:31]. A single `IMPLEMENTATION` route can load both READMEs, because both are `RESOURCE_MAP` children of the same intent key [SOURCE: .skilled/skills/sk-code/ROUTER.md:382] [SOURCE: .skilled/skills/sk-code/ROUTER.md:384]. The `wait-patterns.js` copies are not identical: the Webflow copy carries a six-line cross-stack Motion reference that the shared copy lacks, and the shared copies carry an ASCII banner plus a top-of-file `'use strict';` that the Webflow copies dropped [SOURCE: .skilled/skills/sk-code/sk-code-webflow/assets/patterns/wait-patterns.js:546] [SOURCE: .skilled/skills/sk-code/shared/assets/patterns/wait-patterns.js:1]. Nothing in either README names the other copy, so a reader routing through the shared README gets the older file set with no warning. Reproducing case: `diff shared/assets/patterns/wait-patterns.js sk-code-webflow/assets/patterns/wait-patterns.js` prints the added Motion comment block, and `rg -n "Cross-stack Motion reference" shared/assets/patterns/wait-patterns.js` exits 1 while the same search in the Webflow copy prints line 546. NEW, P1 (duplication with drift on a routed surface; the fix direction is one authored copy plus a pointer, or explicit divergence).
2. **`shared/README.md` names the wrong packet vocabulary and omits the third surface.** Its overview says the shared references are common to "every sk-code surface packet (`code-webflow`, `code-opencode`) and workflow mode (`code-quality`, `code-review`)" [SOURCE: .skilled/skills/sk-code/shared/README.md:17]. The live packet names are `sk-code-webflow`, `sk-code-opencode`, `sk-code-quality`, `sk-code-review`, and `sk-code-obsidian` now consumes the shared workflow trio as symlinks [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:62] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/references/workflow-implement.md]. The same sentence is the only consumer list this index carries, so the surface that was added last is invisible in it. Reproducing case: `rg -n "code-webflow|code-opencode|sk-code-obsidian" shared/README.md` returns line 17 for the stale names and no hit for `sk-code-obsidian` except inside longer path strings. NEW, P2 (stale documentation; cheap fix, but it is the shared layer's front door).
3. **Three overlapping exemption lists disagree about which shared paths are hub-level controls.** `ROUTER.md` declares eight `SHARED_CONTROL_RESOURCES` that "resolve on disk and are referenced by RESOURCE_MAP but are exempt from typed-leaf projection", and the comment reads as the complete exemption set [SOURCE: .skilled/skills/sk-code/ROUTER.md:583] [SOURCE: .skilled/skills/sk-code/ROUTER.md:587]. The router-sync guard keeps a separate, nine-entry `PARENT_TIER_ALLOWLIST` that adds `sk-code-review/assets/code-quality-checklist.md` and otherwise repeats the eight [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs:25], and a third `NON_ROUTED_ALLOWLIST` that additionally exempts `references/stack-detection.md` and `references/phase-detection.md` from the orphan walk [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs:22]. Both of those files are loaded on every route as part of `DEFAULT_RESOURCE` [SOURCE: .skilled/skills/sk-code/ROUTER.md:321] [SOURCE: .skilled/skills/sk-code/ROUTER.md:322], are absent from `leaf-manifest.json` (confirmed: `rg -n "stack-detection|phase-detection" leaf-manifest.json` exits 1), and yet are not declared controls anywhere in `ROUTER.md`. So "declared shared control" and "actually exempt from leaf projection" are two sets that partially overlap, and the hub's own claim that "the eight declared SHARED_CONTROL_RESOURCES are contained hub-level inputs" [SOURCE: .skilled/skills/sk-code/SKILL.md:63] is narrower than the load contract it summarizes. NEW, P2 (contract clarity; a validator that treats the declaration as exhaustive would reject a correct file).
4. **The declared loading skeleton is otherwise coherent: the workflow trio is symlinked, not forked, and the hub version is parity-consistent.** All nine workflow-doctrine copies under the three surfaces are symlinks resolving to `../../shared/references/workflow-*.md` [SOURCE: .skilled/skills/sk-code/sk-code-webflow/references/workflow-implement.md], [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/references/workflow-verify.md], and the hub's stated version authority holds across the hub root: `SKILL.md` 2.2.4.0, `mode-registry.json` 2.2.4.0, `description.json` 2.2.4.0 and `hub-router.json` 2.2.4.0 [SOURCE: .skilled/skills/sk-code/SKILL.md:5] [SOURCE: .skilled/skills/sk-code/mode-registry.json:3] [SOURCE: .skilled/skills/sk-code/description.json:4] [SOURCE: .skilled/skills/sk-code/hub-router.json:3]. This confirms rather than challenges the hub's "one shared source" claim [SOURCE: .skilled/skills/sk-code/SKILL.md:174]; it is recorded so later iterations do not re-open it. ALREADY-ADOPTED, P2, no action.

## Questions Answered

- None fully. Key question 1 is partially answered: the loader map is now explicit, but the "loaded twice" leg was only spot-checked (see Finding 3 and the ruled-out note).

## Questions Remaining

- Which shared files are genuinely dead (only self-referenced) versus merely absent from the machine map?
- Do the always-loaded `DEFAULT_RESOURCE` and the `RESOURCE_MAP` universal tier agree on what "the universal tier" contains?

## Ruled Out

- **"Re-verify which of the nine orphan docs leg 1b flags are real."** Steer ruling 2 marks that routing work IN-FLIGHT (phase 009, child 001); the guard failure is already recorded in phase 007/005 and was not re-run.
- **"Declare the shared `assets/patterns` copies a leaf-projection bug."** `PARENT_TIER_ALLOWLIST` already exempts `shared/assets/patterns/README.md`, and the JS files are not markdown leaves; the actual defect is duplication, filed as Finding 1, not projection.
- **"Report the `hub-router.json` `defaultResource` as a second load of `shared/README.md`."** Its own contract calls it fallback-only and distinct from the stage-two preamble [SOURCE: .skilled/skills/sk-code/hub-router.json:16]; no double-load exists on a scored route.

## Dead Ends

- A full per-file "loaded twice" matrix across every intent pair was too broad for one iteration; only the universal tier and the pattern assets were traced. Left for the shared-consistency iteration.

## Edge Cases

- Ambiguous input: whether `DEFAULT_RESOURCE` counts as "RESOURCE_MAP" for the `SHARED_CONTROL_RESOURCES` comment. Chosen interpretation: it does not literally, which is why Finding 3 is filed as contract clarity rather than a broken check.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none; all five actions completed.

## Sources Consulted

- `.skilled/skills/sk-code/SKILL.md`
- `.skilled/skills/sk-code/ROUTER.md`
- `.skilled/skills/sk-code/hub-router.json`
- `.skilled/skills/sk-code/mode-registry.json`
- `.skilled/skills/sk-code/shared/README.md`
- `.skilled/skills/sk-code/shared/assets/patterns/README.md`
- `.skilled/skills/sk-code/sk-code-webflow/assets/patterns/README.md`
- `.skilled/skills/sk-code/sk-code-webflow/assets/patterns/wait-patterns.js`
- `.skilled/skills/sk-code/shared/assets/patterns/wait-patterns.js`
- `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs`
- `.skilled/skills/sk-code/leaf-manifest.json`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.88 (three fully new findings, one ALREADY-ADOPTED verification finding).
- Questions addressed: key question 1 (partial).
- Questions answered: none.

## Reflection

- What worked and why: checking declaration against projection against reachability as three separate layers. The divergence only appeared because the guard's two allowlists were read beside `ROUTER.md`'s single declaration; reading either alone would have shown nothing.
- What did not work and why: the first basename-reference count over-reported consumers because `benchmark/reports/` history and the guard script itself matched; filtering those out was required before any "loaded by nothing" claim could be trusted.
- What I would do differently: capture file hashes before any byte comparison so a concurrent edit between the two reads is detectable, rather than inferring stability from identical mtimes.

## Recommended Next Focus

The shared consistency layer inside `shared/references/`: read `universal/code-quality-standards.md`, `universal/code-style-guide.md`, `phase-detection.md` and `stack-detection.md` against each other and against their callers, and test the "universal tier" load claim from Finding 3 against what `RESOURCE_MAP` actually emits.
