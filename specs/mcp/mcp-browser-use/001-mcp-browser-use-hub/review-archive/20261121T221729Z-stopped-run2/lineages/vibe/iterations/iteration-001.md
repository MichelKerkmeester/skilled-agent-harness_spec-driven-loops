# Review Iteration 001

## Dispatcher

- Mode: `review`
- Target agent: `deep-review`
- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Run: `fanout-vibe-1795298930568-k8qdqy`, generation 1, lineage mode `new`
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: `correctness`
- Operator review focus: the 8 commits `main..HEAD` that build the browser-use
  parent hub. This iteration addressed the focus by reviewing the hub's
  load-bearing new code — the compiled router, the registry compiler and the
  policy card — plus the recorded run evidence the verification commit shipped,
  which is exactly the "hub scaffold / advisor routing / end-to-end verification"
  slice of the focus. Pure renames of moved spec packets were not reviewed.

## Files Reviewed

- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/policy-card.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs`
- `.skilled/skills/mcp-browser-use/hub-router.json`
- `.skilled/skills/mcp-browser-use/mode-registry.json`
- `.skilled/skills/mcp-browser-use/leaf-manifest.json`
- `.skilled/skills/mcp-browser-use/leaf-scopes.json`
- `.skilled/skills/mcp-browser-use/SKILL.md`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`
- `.skilled/bin/compiled-route-guard.cjs`
- `.skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md`
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/README.md`

## Findings - New

### P0 Findings

None. No exploitable security issue, auth bypass or destructive data loss was
found in the reviewed surface.

### P1 Findings

1. **The negative detector rejects any prompt containing the word "forbidden", including legitimate HTTP-status debugging** -- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:107` -- `evaluateRoute` rejects on `constraints.has('forbidden') || text.includes('forbidden')`. The second clause is a raw substring test on the whole normalized prompt, so a browser request that merely mentions the HTTP 403 status word is refused instead of routed. Executed against the compiled snapshot, `"debug the 403 forbidden response on this page"`, `"why is my api returning forbidden on this page"` and `"chrome devtools: inspect the forbidden error"` all return `action: "reject", reason: "forbidden"` rather than routing to `mcp-chrome-devtools`. The canary corpus does not catch this: its only reject case (`forbidden-reject`, `fixtures/canary-cases.v1.json:182`) supplies `constraints: ["forbidden"]`, so it exercises the constraint branch and never the substring branch.
   Finding class: correctness
   Scope proof: the file is in the pre-bound review scope (`review-scope-files.txt`) and is new code added by commit `e60f28021d1`/`6efbff5d094` on this branch.
   Affected surface hints: `.skilled/bin/compiled-route.cjs` (CLI front door), `.skilled/skills/mcp-browser-use/SKILL.md:62` (the directive that calls it), `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json`
   Case: a user asks the hub to debug a page that returned HTTP 403, writing the word "forbidden" in the prompt; the hub rejects the request instead of routing it to Chrome DevTools.

   ```json
   {
     "type": "correctness",
     "claim": "router.cjs rejects any prompt whose text contains the substring 'forbidden', so a legitimate browser-debugging request that names the HTTP 403 status word is refused instead of routed.",
     "evidenceRefs": [
       ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:107",
       ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:182"
     ],
     "counterevidenceSought": "Checked whether the advisor strips or rewrites the prompt before stage two, and whether the canary corpus covers the substring branch. The advisor passes the raw prompt to the hub router, and the only reject canary supplies an explicit constraint, so neither path narrows the reach.",
     "alternativeExplanation": "The substring clause may be a deliberate belt-and-braces guard for prompts that literally say 'forbidden operation'. That intent does not explain matching the word inside an HTTP-status phrase, and the constraint branch already covers an explicit forbidden constraint.",
     "finalSeverity": "P1",
     "confidence": "high",
     "downgradeTrigger": "Downgrade to P2 if the advisor is shown to pre-filter or normalize prompts so that the HTTP-status word never reaches the hub router."
   }
   ```

2. **Both recorded benchmark runs cite a policy hash that the shipped tree no longer produces** -- `.skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md:33` -- the report states that every scenario call printed `effectivePolicyHash` `dd69936393b40a51080dac4772d42a8e317e8fe099514d4db846716027000698` at generation 1, and repeats that hash in all seven recorded transcripts (lines 41-65). The compiled-routing replay report records the same hash (`benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/README.md:24` and six `policyHash` fields in its `skill-benchmark-report.json`). Recompiling the hub's three authored inputs now yields `8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a`, which is also the hash the activation manifest selects (`013-live-activation/activation/mcp-browser-use/manifest.json:1`). The recorded runs therefore cannot be reproduced from the tree that ships them, and the goal's completion criterion for a recorded run per mode rests on evidence that no longer replays.
   Finding class: traceability
   Scope proof: both report files are in the pre-bound review scope and were added by the verification commit `c7f38f295d2` on this branch.
   Affected surface hints: `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/skill-benchmark-report.json`, `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json`
   Case: an operator re-runs the recorded playbook command from the report and gets a different `effectivePolicyHash` than the transcript shows, so the recorded run cannot be confirmed as the run that shipped.

   ```json
   {
     "type": "traceability",
     "claim": "The two recorded benchmark reports cite effectivePolicyHash dd69936..., while the current compiled policy and the activation manifest both carry 8793753..., so the recorded runs do not reproduce from the shipped tree.",
     "evidenceRefs": [
       ".skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md:33",
       ".skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/README.md:24",
       ".skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1"
     ],
     "counterevidenceSought": "Recompiled the hub's three authored inputs through registry-compiler.cjs and compared the result with the manifest; both agree on 8793753..., so the divergence is in the reports, not in a stale manifest. Also checked whether the reports name a different generation or activation root that would explain the older hash; they do not.",
     "alternativeExplanation": "The reports may have been recorded before a final edit to hub-router.json or SKILL.md landed in the same commit, which would make the hash difference an ordering artifact rather than a wrong claim. That still leaves the shipped evidence unreproducible.",
     "finalSeverity": "P1",
     "confidence": "high",
     "downgradeTrigger": "Downgrade to P2 if the reports are re-recorded against the shipped hash, or if a note is added stating the hash predates the final input edit and naming the superseding run."
   }
   ```

### P2 Findings

3. **`ambiguityDelta: 1` cannot express a near-tie because every mode weight is 4** -- `.skilled/skills/mcp-browser-use/hub-router.json:5` -- `selectNearTiedModes` keeps a mode when `top - entry.score <= ambiguityDelta` (`router.cjs:96`), and every score is `matchedKeywords * weight` with `weight: 4` for all three modes (`hub-router.json:31,44,57`). Scores are therefore multiples of 4, so a delta of 1 admits only exact ties and behaves identically to a delta of 0. The configured knob reads as "allow a one-point near-tie" but has no effect at any value below 4.
   Finding class: maintainability
   Scope proof: `hub-router.json` is in the pre-bound review scope and is new in this branch.
   Affected surface hints: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:96`
   Case: an operator raises `ambiguityDelta` from 1 to 3 expecting near-tied modes to bundle; nothing changes, because no score difference below 4 exists.

4. **The destination graph declares only two selection kinds while the compiler can emit a third** -- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:250` -- `destinationGraphBody.selectionKinds` is hard-coded to `['single', 'orderedBundle']`, but `bundleKindForModes` (line 128) returns `'surfaceBundle'` whenever a tie has exactly one actor beside one or more evidence targets. Every current mode is an `actor`, so the branch is unreachable today; the comment at line 122 says the kind is derived from roles "so the rule stays correct if a mode's role ever changes", yet the declared `selectionKinds` would then disagree with the emitted rule.
   Finding class: maintainability
   Scope proof: the compiler is in the pre-bound review scope and is new in this branch.
   Affected surface hints: `.skilled/bin/lib/compiled-routing/005-decision-evaluator/lib/decision-contract.cjs:343`
   Case: a future mode is added with `packetKind` mapping to the `evidence` role; a tie then compiles a `surfaceBundle` composition rule that the graph's `selectionKinds` does not declare.

5. **`selectNearTiedModes` reads `scores[0]` as the top score without asserting the input is sorted** -- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:96` -- the helper takes `top = scores[0].score` and filters on it. It is correct only because `evaluateRoute` sorts `scores` descending at line 112 before calling it. A second caller, or a reordering of the two statements, silently changes which modes bundle.
   Finding class: maintainability
   Scope proof: the router is in the pre-bound review scope and is new in this branch.
   Affected surface hints: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:112`
   Case: a future caller passes unsorted scores; the filter compares every entry against an arbitrary element and returns the wrong tie set.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The hub's three authored inputs compile to `8793753...`, matching the activation manifest, so the code matches the declared policy. The recorded benchmark evidence does not match (finding 2), so the protocol stays `partial`. |
| `checklist_evidence` | partial | `goal.md` completion criterion 6 requires a recorded run per mode. The reports exist for all three modes, but their recorded hash is stale (finding 2), so the evidence is present but not reproducible. |

## Integration Evidence

- `.skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "debug this page with chrome devtools"` exits 0 and prints `selectionKind: "single"` targeting `mcp-chrome-devtools` with `effectivePolicyHash 8793753...`, so the CLI front door named by `SKILL.md:62` resolves through the compiled engine.
- `node .skilled/bin/compiled-route-guard.cjs --json` reports `{"hubId":"mcp-browser-use","ok":true,"reason":"fresh"}` with `failures: 0`, so the activation manifest is fresh against the current inputs.
- `resolve.cjs` lists `mcp-browser-use` in `DEFAULT_ON_HUBS` (line 47), so the hub serves compiled routing with the flag unset.

## Edge Cases

- **Ambiguity: which hash is authoritative.** The manifest and a fresh compile agree, so the manifest is treated as authoritative and the reports as stale. Recorded as finding 2 rather than as a manifest defect.
- **Inherited pattern.** The `text.includes('forbidden')` clause also appears in `003-mcp-tooling/lib/router.cjs:145`, `007-sk-doc/lib/router.cjs:226` and four `canary-router.cjs` files. The browser hub's copy is new code on this branch, so it is reported here; the sibling copies are outside this review target and are named only as context.
- **Scope sampling.** The pre-bound scope lists 277 paths. This iteration reviewed the routing core and the recorded evidence by risk, not exhaustively; the remaining surfaces are carried to later iterations.

## Confirmed-Clean Surfaces

- `assertTieBreakCoversModes` (`registry-compiler.cjs:167`) compares the sorted declared modes against the sorted tie-break list, so a missing or extra mode fails compilation rather than mis-sorting at runtime.
- `tieBreakSubsets` (`registry-compiler.cjs:139`) enumerates every subset of two or more modes, and the compiled `bundleRules` cover all four combinations, so `exactBundle` cannot return null for a reachable tie.
- `leaf-manifest.json` lists three modes and every named leaf exists on disk, including all four `mcp-bladebro/references/*.md` files.
- `leaf-scopes.json` narrows only `mcp-chrome-devtools`, and its three scopes match that mode's five manifest leaves; the other two modes are unscoped and receive their full leaf sets.

## Ruled Out

- **Duplicate destination tuples.** `destinationKey` canonicalizes the full `{backendKind, packetId, packetKind, skillId, workflowMode}` tuple and the compiler rejects duplicates, so two modes cannot collide on one authority ref.
- **Bundle lookup returning null.** Every reachable tie set has a compiled composition rule, so the `bundle ? bundle.kind : 'orderedBundle'` fallback at `router.cjs:120` is dead code rather than a live defect.
- **Stale activation manifest.** The guard reports `fresh` for `mcp-browser-use`, so the manifest is not the source of the hash divergence in finding 2.
- **Discovery-only vocabulary leaking into mode scores.** `hub-identity` and `generic-browser-automation` are referenced by no `routerSignals` entry, and the executed `"browser automation for this site"` case defers with `reason: "no-match"` as designed.

## Next Focus

- Dimension: security
- Focus area: the Bladebro mode's install and attach surfaces (`.skilled/skills/mcp-browser-use/mcp-bladebro/references/install-and-verify.md`, `cli-reference.md`, `mcp-wiring.md`), the `toolSurface` allow/forbid declarations in `mode-registry.json`, and the `authorityRef`/`authorityGraph` construction in `registry-compiler.cjs`
- Reason: correctness is complete; security is the next canonical dimension and the Bladebro mode is the only new mode with an install step and a caller-owned browser attachment
- Rotation status: first pass on security
- Blocked/productive carry-forward: the routing core was productive for correctness; do not re-derive the `forbidden` substring finding
- Required evidence: file:line for every trust boundary and every declared tool-surface permission

Review verdict: CONDITIONAL
