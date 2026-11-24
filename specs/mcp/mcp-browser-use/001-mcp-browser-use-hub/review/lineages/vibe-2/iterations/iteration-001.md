# Review Iteration 001

## Dispatcher

- Mode: review
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: correctness
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change
- Lineage: sessionId `fanout-vibe-2-1795511024070-2cuwlj`, generation 1, lineageMode new
- Iteration: 1 of 7

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mode-registry.json:1` -- three-mode registry, version 1.1.3.0
- `.skilled/skills/mcp-browser-use/hub-router.json:1` -- router signals, vocabulary classes, outcomes
- `.skilled/skills/mcp-browser-use/leaf-manifest.json:1` -- per-mode leaf lists
- `.skilled/skills/mcp-browser-use/SKILL.md:1` -- hub contract and capability matrix
- `.skilled/skills/mcp-browser-use/ROUTER.md:53` -- machine-readable intent projection
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:88` -- live scorer and near-tie selection
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:1` -- vocabulary compilation and bundle rules
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:1` -- 17 canary cases
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:334` -- id-noun rule (advisor 2.0.3.0)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:93` -- lexical evidence tokens
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:14` -- pinned installer digest
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:36` -- `..` rejection
- `.skilled/skills/mcp-tooling/mode-registry.json:1` -- six-mode sibling registry
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/implementation-summary.md:1` -- phase 015 claims

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Mixed id and alias forms drop a named mode from the bundle** -- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:88` -- `scoreModes` counts distinct fold-deduped keywords, and the full id `mcp-chrome-devtools` folds to `mcp chrome devtools`, a different string from `chrome devtools`. A mode named by its full id therefore scores two hits (8) while a mode named by its short alias scores one (4). `selectNearTiedModes` keeps only modes within `ambiguityDelta: 1` of the top, so the 4-point gap drops the second mode and the decision becomes `single`. Verified against the live CLI: `use chrome devtools and bladebro` returns `orderedBundle` with both modes, while `use mcp-chrome-devtools and bladebro` returns `single` with `mcp-chrome-devtools` only. The same asymmetry holds for `mcp-bladebro` and `mcp-aside-devtools` against any short-named sibling.
   Finding class: correctness
   Scope proof: both prompts are inside the declared review target's routing contract; the scorer, the vocabulary and the outcome promise are all in `.skilled/skills/mcp-browser-use/hub-router.json` and the compiled router under `.skilled/bin/lib/compiled-routing/`.
   Affected surface hints: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs`, `.skilled/skills/mcp-browser-use/hub-router.json`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json`
   Case: a prompt that names one browser mode by its full `mcp-*` id and another by its short alias, such as `use mcp-chrome-devtools and bladebro`, routes to one mode instead of the ordered bundle the hub promises.

   ```json
   {"type":"claim","claim":"A prompt naming two browser modes, one by full id and one by short alias, returns a single-mode route instead of an orderedBundle.","evidenceRefs":["router.cjs:88","router.cjs:119","hub-router.json:routerPolicy.outcomes.orderedBundle","compiled-route.cjs --hub mcp-browser-use --prompt 'use mcp-chrome-devtools and bladebro' -> selectionKind single"],"counterevidenceSought":"Checked whether ambiguityDelta could absorb the gap (it is 1 and scores are multiples of 4, so it cannot), whether the fold-dedup in scoreModes collapses the two id forms (it does not: spaced() folds hyphens but not the mcp prefix), and whether the canary fixture covers the mixed form (it does not: the two bundle cases are all-full-id and all-short-form).","alternativeExplanation":"The router may intend the full id to be a stronger signal than a short alias, making a single route deliberate. Rejected: hub-router.json routerPolicy.outcomes.orderedBundle states that multiple explicitly named browser tools route in tie-break order, and the phase 015 fix added mcp-bladebro to bladebro's aliases precisely so full-id naming scores alike.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if hub-router.json's orderedBundle outcome is amended to say a full-id mention outweighs a short alias, making the single route the documented behaviour."}
   ```

### P2 Findings

2. **`selectionKinds` cannot express the bundle kind the compiler can emit** -- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:1` -- `bundleKindForModes` returns `surfaceBundle` when exactly one actor sits beside evidence targets, and its comment says the rule "stays correct if a mode's role ever changes". But `destinationGraph.selectionKinds` is hardcoded to `['single', 'orderedBundle']`, so a `surfaceBundle` decision would name a selection kind the graph does not declare. Unreachable today because `ROLE_BY_PACKET_KIND` maps only `workflow` to `actor` and any other `packetKind` fails with `PACKET_KIND_UNSUPPORTED`, so the comment overstates the rule's durability.
   Finding class: maintainability
   Scope proof: the compiler and its selection-kind list are both inside the declared review target's compiled-routing surface.
   Affected surface hints: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs`
   Case: a future mode declared with a packet kind that maps to the `evidence` role would compile a `surfaceBundle` composition rule while `selectionKinds` still omits it, so the decision contract would reject the bundle the compiler just built.

3. **`ROUTER.md` calls itself the single machine-readable projection while a second one is live** -- `.skilled/skills/mcp-browser-use/ROUTER.md:53` -- the section says "The single machine-readable projection of the intent model above. Keep the two in sync". It declares four intent signals (`CHROME_DEVTOOLS`, `LIGHTHOUSE_TRACE`, `ASIDE_DEVTOOLS`, `BLADEBRO`) while `hub-router.json` declares three `routerSignals` and folds the seven Lighthouse and performance-trace phrases into `chrome-devtools-aliases` and `browser-debug`. The keyword union matches, so no routing behaviour diverges, but the two structures are not the same projection and the doc's "single" claim is false.
   Finding class: traceability
   Scope proof: both files are hub-owned and inside the declared review target.
   Affected surface hints: `.skilled/skills/mcp-browser-use/ROUTER.md`, `.skilled/skills/mcp-browser-use/hub-router.json`
   Case: a maintainer edits the `LIGHTHOUSE_TRACE` bucket in `ROUTER.md` believing it is the live vocabulary, and the change has no effect because the compiled router reads only `hub-router.json`.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Phase 015's four claimed fixes are present at source: `mcp-bladebro` in `hub-router.json` bladebro-aliases, the id-noun rule at `fusion.ts:334`, the `..` rejection at `repl-evidence-capture.sh:36`, and the pinned digest at `install.sh:14`. The bundle claim holds only for the all-full-id and all-short-form cases; the mixed form fails (finding 1). |
| `checklist_evidence` | partial | `015-fix-follow-up-review-findings/implementation-summary.md` records the canary harness at exit 0 and the 52-row replay at 51 PASS. The canary fixture holds 17 cases and none exercises the mixed id/alias form, so the recorded evidence does not cover the failing path. |
| `skill_agent` | pass | `parent-skill-check.cjs .skilled/skills/mcp-browser-use` exits 0 and prints `INFO: Parent skill: .skilled/skills/mcp-browser-use`, then PASS on 3b (three modes), 3d-name (folder equals packetSkillName) and 3d-alias (20 unique aliases). |
| `agent_cross_runtime` | notApplicable | The hub is a skill package with no agent definition of its own; no runtime mirror carries hub logic. |
| `feature_catalog_code` | notApplicable | No feature catalog entry names this hub's modes. |
| `playbook_capability` | deferred | The three mode playbooks and their recorded runs are the phase 006 and 008 goal criteria; they are scheduled for the traceability iteration rather than claimed here. |

## Integration Evidence

- `.skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "<task>"` is the live front door the hub SKILL.md names. Four prompts were run through it: `use chrome devtools and bladebro` returned `orderedBundle` with two targets; `use mcp-chrome-devtools and bladebro` returned `single` with one target; `use mcp-chrome-devtools, mcp-aside-devtools and mcp-bladebro` returned `route`; `compare chrome devtools and bladebro on this page` returned `route`.
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` is the parent-skill checker the completion criteria name. It exits 0 on the hub path and names the hub as its subject.
- `.skilled/skills/mcp-tooling/mode-registry.json` still lists exactly six modes, so decision D3 holds.

## Edge Cases

- The review scope list holds 522 files, far more than one iteration can read. This iteration read the hub's authored routing surface and the phase 015 fix sites, and records the rest as deferred rather than clean.
- `containsSignal` matches substrings rather than whole words. Every keyword in the three vocabularies was checked for a common-word substring collision and none was found, so the substring match is recorded as a design choice rather than a finding.
- The `.opencode/skills/mcp-browser-use` mirror is byte-identical to `.skilled/skills/mcp-browser-use` for all seven authored files, so the harness that compiles from the mirror reads the same registry as the canonical tree.
- The advisor id-noun rule reads `lexicalEvidence` from the skill's own lexical lane, so "another word with that skill" is accurate rather than "any other prompt word". The `tokenHits` slice to five entries cannot hide the noun, because the noun is excluded from the check rather than required in the list.

## Confirmed-Clean Surfaces

- `mode-registry.json` declares exactly three modes, each with `packetKind: workflow`, `backendKind: cli-plus-mcp`, `grandfatheredFolderMismatch: false` and `routingClass: metadata`.
- `hub-router.json` `routerPolicy.tieBreak` lists all three modes, and `assertTieBreakCoversModes` fails compilation when it does not.
- `bundleRules` enumerates every subset of two or more tie-break modes, so a near-tied score set always finds a composition rule.
- The phase 015 Aside installer downloads to a temporary file, compares `shasum -a 256` against `INSTALLER_SHA256`, and exits 1 on a mismatch before running anything.
- The phase 015 capture example rejects any `..` substring in the session dir before the `./tmp` prefix check, so a traversal cannot pass the prefix test.
- `rg` for `mcp-tooling/mcp-chrome-devtools` and `mcp-tooling/mcp-aside-devtools` under `.skilled`, excluding changelog and benchmark/reports, prints no match.

## Ruled Out

- **Substring false positives in the routing vocabulary.** Every keyword in `chrome-devtools-aliases`, `browser-debug`, `aside-devtools-aliases`, `aside-repl-evidence`, `bladebro-aliases` and `bladebro-workflow` was checked for a common-word substring collision. None exists, so `containsSignal`'s substring match is not a defect on this vocabulary.
- **Stale runtime mirror feeding the harness.** `build-artifacts.cjs` compiles from `.opencode/skills/mcp-browser-use`. All seven authored files are byte-identical between the mirror and the canonical tree, so the harness is not compiling a stale registry.
- **Advisor id-noun rule still lifting on a bare noun.** `promptNamesIdNoun` requires a lexical token other than the noun, and `lexicalEvidence` is harvested from the skill's own candidate haystack, so `loop`, `mode` and `tooling` alone no longer name their skills.
- **`ambiguityDelta` absorbing the mixed-form gap.** Scores are multiples of the weight 4 and the delta is 1, so no non-zero score gap can ever be a near-tie. The delta cannot mask or create the finding.

## Next Focus

- Dimension: security
- Focus area: the Aside installer's download-and-verify path, the capture example's path confinement, and the hub's tool-surface declarations
- Reason: correctness surfaced a routing defect; security is the next canonical dimension and the phase 015 installer and capture changes are the newest trust-boundary code in the target
- Rotation status: correctness reviewed, security next
- Blocked/productive carry-forward: the routing vocabulary scan was productive and is reusable for the security pass on input handling
- Required evidence: file:line citations from `.skilled/skills/mcp-browser-use/mcp-aside-devtools/` and the hub `mode-registry.json` tool surfaces

Review verdict: CONDITIONAL
