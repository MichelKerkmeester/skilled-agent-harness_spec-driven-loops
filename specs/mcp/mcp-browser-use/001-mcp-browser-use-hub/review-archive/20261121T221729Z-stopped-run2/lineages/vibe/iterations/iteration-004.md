# Review Iteration 004 — maintainability

## Dispatcher

- **Target spec folder:** `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub`
- **Artifact directory (lineage):** `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/vibe`
- **Mode:** review · **Dimension:** maintainability · **Iteration:** 4 of 5
- **Session:** `fanout-vibe-1795298930568-k8qdqy` · **Generation:** 1 · **Lineage mode:** new
- **Executor:** cli-mistral-vibe model=deepseek-flash (inline; no nested dispatch)
- **steer.md:** absent at iteration start (checked before init and before this iteration); no lead ruling to apply.
- **Operator review focus:** the 8 commits `main..HEAD` that build the browser-use parent hub. This iteration covers the documentation and metadata surfaces those commits authored — `ROUTER.md`, `hub-router.json`, `SKILL.md`, `README.md`, `description.json`, `graph-metadata.json`, and the changelog — which are the `002-hub-scaffold` and `005-routing-and-surfaces` deliverables. Pure `git mv` renames of moved spec packets remain out of scope.

## Files Reviewed

| File | Lines read | Why |
|------|-----------|-----|
| `.skilled/skills/mcp-browser-use/ROUTER.md` | 39-78, 88-97, headings | The hub's documented routing projection |
| `.skilled/skills/mcp-browser-use/hub-router.json` | 29-119 (parsed whole) | The authored routing source the compiler reads |
| `.skilled/skills/mcp-browser-use/SKILL.md` | 56-66, headings | Smart-routing block and section shape |
| `.skilled/skills/mcp-browser-use/graph-metadata.json` | parsed whole | `intent_signals` / `intent_signals_generated` contract |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs` | 88-112, 182, `resources` sweep | What the compiler actually consumes |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | 700-830 | The root-router contract that gates `ROUTER.md` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` | `validateRootRouter` sweep | Which `ROUTER.md` rules are enforced |
| `.skilled/skills/mcp-tooling/ROUTER.md` | headings | Sibling template comparison |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` | `MACHINE ROUTER` hits | Heading and length contract |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Two P1 findings remain active and carried forward unchanged:

- `R1-P1-001` — `router.cjs:107` `text.includes('forbidden')` rejects legitimate HTTP-403 debugging prompts.
- `R2-P1-001` — `mcp-bladebro/references/mcp-wiring.md:61` documents an unpinned `npx -y bladebro mcp`, contradicting R-SEC-3.

### P2 Findings

1. **`ROUTER.md` §3 `INTENT_SIGNALS` has already drifted from `hub-router.json`, while the compiler asserts no second keyword list can drift** -- `.skilled/skills/mcp-browser-use/ROUTER.md:50` -- `ROUTER.md:41` calls §3 "The single machine-readable projection of the intent model above. Keep the two in sync", and `registry-compiler.cjs:94` states "Both the metadata graph and the live scorer read this one projection, so no second keyword list can drift from the authored one." Both statements are false as shipped: `ROUTER.md:50-54` carries a second, hand-maintained keyword list, and it has diverged from the authored source. Computed diff against `hub-router.json:61` `vocabularyClasses`:
   - Chrome DevTools: `hub-router.json` feeds `mcp-chrome-devtools` from `chrome-devtools-aliases` (`hub-router.json:82`) plus `browser-debug` (`hub-router.json:106`), 31 keywords. `ROUTER.md` splits the same mode across `CHROME_DEVTOOLS` (27, `ROUTER.md:51`) and `LIGHTHOUSE_TRACE` (3, `ROUTER.md:52`), 30 keywords.
   - Present in `hub-router.json` only: `chrome live manual` (`hub-router.json:98`), `core web vitals` (`hub-router.json:119`).
   - Present in `ROUTER.md` only: `lighthouse audit` (`ROUTER.md:52`).
   - Shape, not just wording: `ROUTER.md` declares 4 intent keys against `hub-router.json`'s 3 `routerSignals` mode keys (`hub-router.json:29`), so the two documents cannot be diffed mechanically without a mapping.
   - Aside (15/15) and Bladebro (14/14) match exactly, so the drift is confined to the Chrome DevTools mode and is therefore easy to miss.
   Finding class: documentation-drift
   Scope proof: both files are inside `.skilled/skills/mcp-browser-use/`, authored by the `002-hub-scaffold` and `005-routing-and-surfaces` commits under review; the diff was computed by parsing `ROUTER.md`'s `INTENT_SIGNALS` block and `hub-router.json`'s `vocabularyClasses` in one script, not by eye.
   Affected surface hints: `.skilled/skills/mcp-browser-use/ROUTER.md`, `.skilled/skills/mcp-browser-use/hub-router.json`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`
   Case: a maintainer adds a Chrome DevTools phrase to `hub-router.json` `vocabularyClasses` — the authored source the compiler reads — and the compiled front door starts scoring it, while `ROUTER.md` §3, the document `ROUTER.md:41` presents as the projection to read, still lists the old set. A reader who follows the documented projection to predict routing gets a different answer than `compiled-route.cjs` returns, and nothing in CI compares the two.

2. **`hub-router.json` `routerSignals.*.resources` is authored but never read, so the hub ships two resource maps and only one is live** -- `.skilled/skills/mcp-browser-use/hub-router.json:36` -- Each `routerSignals` entry carries a `resources` array (`hub-router.json:36`, `:46`, `:56`) naming `mcp-*/SKILL.md`. `registry-compiler.cjs` reads only `signal.classes` (`registry-compiler.cjs:102`) and `signal.weight` (`registry-compiler.cjs:182`); a sweep for `resources` over that file prints no match, and `compiled-route.cjs --hub mcp-browser-use` returns `targets[].packetId` / `workflowMode` with no resource list. The live leaf map is instead `ROUTER.md:57` `RESOURCE_MAP`, which names reference files (`mcp-chrome-devtools/references/cdp-patterns.md`) and which the root-router contract resolves on disk through `resolveOnDisk` (`ci-skill-root-metadata.cjs:786-800`).
   Finding class: dead-configuration
   Scope proof: the `resources` arrays and the compiler are both inside the reviewed hub and its compiled snapshot; the absence of a reader was established by sweeping the compiler for the key and by executing the compiled route, not by inference.
   Affected surface hints: `.skilled/skills/mcp-browser-use/hub-router.json`, `.skilled/skills/mcp-browser-use/ROUTER.md`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs`
   Case: a maintainer adds a new leaf reference to `routerSignals.mcp-chrome-devtools.resources` expecting the route to load it. Nothing reads that array, so the leaf is never loaded, the route still succeeds, and the omission is silent — the failure surfaces only as a mode that behaves as if the reference did not exist.

## Traceability Checks

| Check | Surface | Result |
|-------|---------|--------|
| Version authority across the hub's five version-bearing files | `SKILL.md`, `description.json`, `mode-registry.json`, `hub-router.json`, newest `changelog/v1.1.0.0.md` | PASS — all five read `1.1.0.0` |
| `README.md` required sections 1-5 | `.skilled/skills/mcp-browser-use/README.md` | PASS — all five present |
| `description.json` keyword coherence with the three modes | `.skilled/skills/mcp-browser-use/description.json` | PASS — names all three mode ids |
| Root-router heading contract `RS-003` (machine router is the last H2) | `.skilled/skills/mcp-browser-use/ROUTER.md:97` | PASS — `## MACHINE ROUTER` is the final H2 |
| `ROUTER.md` §3 as the projection of `hub-router.json` | `ROUTER.md:50-54` vs `hub-router.json:61` | FAIL — finding 1 |
| `routerSignals.*.resources` consumed by the compiler | `hub-router.json:36` vs `registry-compiler.cjs` | FAIL — finding 2 |
| `graph-metadata.json` `intent_signals` two-key contract | `graph-metadata.json` | PASS — `intent_signals` is the generated union, `intent_signals_generated` its provenance list, per `generate-router-intent-signals.cjs:19-27` |

## Integration Evidence

- `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "debug the console errors on this page"` executed this iteration: `action: route`, `selectionKind: single`, `targets[0].workflowMode: mcp-chrome-devtools`, `effectivePolicyHash: 8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a`. The output carries no resource list, which is the execution evidence behind finding 2.
- `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skill mcp-browser-use` (run in iteration 3, re-cited): `OK   [H] mcp-browser-use`, `checked=1 passed=1 failed=0`, exit 0. This is why finding 1 is a documentation-drift finding rather than a gate failure — the checker validates that `RESOURCE_MAP` entries resolve on disk but never compares `INTENT_SIGNALS` against `hub-router.json`.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs` swept for `SMART ROUTING` / `non-blank` / `MIN_` / `MAX_`: no match, confirming the 8-12 non-blank-line guidance in `skill-md-template.md` is authoring guidance with no enforcing check.

## Edge Cases

- **`ROUTER.md`'s 4-key shape may be deliberate.** Splitting Lighthouse into its own intent key lets `RESOURCE_MAP` load a different leaf bundle for Lighthouse and performance-trace requests than for general DevTools work, which is a real routing distinction. The shape difference is therefore recorded as ambiguity, not as the finding; the finding rests on the three keyword differences, which no design intent explains. `downgradeTrigger`: if a maintainer documents that `ROUTER.md` §3 is an illustrative excerpt rather than a projection, finding 1 collapses to a wording fix on `ROUTER.md:41`.
- **The 8-12 non-blank-line SMART ROUTING guidance is unenforced and ambiguous.** `SKILL.md:56-64` renders as three dense paragraphs; counting "non-blank lines" over paragraph-form markdown prose is not well defined, and no checker enforces the range. Not reported as a finding — the ambiguity would decide the severity, not the scope.
- **`ROUTER.md`'s unnumbered `## MACHINE ROUTER` heading is not a defect.** `skill-md-template.md` states the section number is optional and the check ignores it, and `RS-003` only requires the section be the last H2. It is. Recorded here so a later iteration does not re-raise it.

## Confirmed-Clean Surfaces

- Version authority: `SKILL.md` 1.1.0.0, `description.json` 1.1.0.0, `mode-registry.json` 1.1.0.0, `hub-router.json` 1.1.0.0, newest changelog `v1.1.0.0.md` — no version skew across the five.
- `README.md` sections 1-5 present and in template order.
- `description.json` keywords name all three modes and no `mcp-tooling` browser mode.
- `ROUTER.md` heading order matches the sibling `mcp-tooling/ROUTER.md` for sections 1-4, and the machine router is the final H2 in both.
- Aside and Bladebro keyword sets match `hub-router.json` exactly (15/15 and 14/14).
- `graph-metadata.json` `intent_signals` / `intent_signals_generated` follow the documented generated-plus-provenance contract.

## Ruled Out

- **Unnumbered `## MACHINE ROUTER` heading as a contract violation.** `skill-md-template.md` explicitly permits `## MACHINE ROUTER` and `## 9. MACHINE ROUTER` alike, and `RS-003` is satisfied because the section is the last H2 (`ROUTER.md:97`). The sibling `mcp-tooling/ROUTER.md:141` numbers it `## 5.` only because that file has no related-resources section.
- **`graph-metadata.json` `intent_signals` as a third drifting keyword list.** It is the generated union of router-declared phrases plus hand-curated entries, with `intent_signals_generated` recording provenance and `intent_signals_keep` pinning survivors (`generate-router-intent-signals.cjs:19-27`). The checker passes, so the two keys are a designed contract, not drift.
- **`SKILL.md` SMART ROUTING block length as a finding.** The 8-12 non-blank-line range is unenforced authoring guidance and ill-defined for paragraph prose; see Edge Cases.
- **`mode-registry.json` as a second routing vocabulary.** `registry-compiler.cjs:92-93` documents that the live vocabulary lives in `hub-router.json`, and the compiler reads `mode-registry.json` only for the mode list. No drift surface there.

## Next Focus

- **Dimension:** cross-reference sweep (all four dimensions re-checked for cross-cutting consistency).
- **Focus area:** the two remaining traceability protocols — `agent_cross_runtime` and `feature_catalog_code` — plus the operator focus's two unexamined commit groups: nested sub-track support in `system-spec-kit` (`specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/007-nested-subtracks/`) and the advisor routing changes (`skill_advisor.py`, `explicit.ts`, `skill-graph.json`).
- **Reason:** maintainability is now complete; the sweep is the last configured dimension and the only place the two unexamined commit groups can be covered before the cap.
- **Rotation status:** maintainability moves to completed; cross-reference sweep is the final rotation.
- **Blocked/productive carry-forward:** productive — the parse-and-diff technique that produced finding 1 generalizes to the advisor's `skill-graph.json` against `hub-router.json`.
- **Required evidence:** a live `skill_advisor.py` invocation per mode, a `compiled-route.cjs` invocation per mode, and a diff of the advisor graph's browser-use entries against the hub's authored vocabulary.
- **Recovery note:** not applicable — iteration 3 was `complete`.

Review verdict: CONDITIONAL
