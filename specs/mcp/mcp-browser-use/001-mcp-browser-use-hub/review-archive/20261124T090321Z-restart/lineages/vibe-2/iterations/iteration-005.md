# Review Iteration 005

## Dispatcher

- Run: `fanout-vibe-2-1795504079797-ay97sx`, generation 1, lineageMode `new`
- Artifact directory: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/vibe-2`
- Focus: cross-reference pass (all four configured dimensions were completed by iteration 4)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made
- How this iteration addressed the focus: the operator focus names the phase 014 fixes, and phase 014's commit `ec3ed74ad01` edited two compiled-routing activation manifests beside the hub sources. This iteration therefore cross-referenced the compiled-routing artifacts against the hub registries and against the `mcp-tooling` parent hub, which is the surface where a phase 014 fix could silently disagree with the tree.
- Sources read: `steer.md` does not exist in the lineage directory (checked before this iteration).

## Files Reviewed

- `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/003-mcp-tooling/harness/build-artifacts.cjs`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json`
- `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-tooling/manifest.json`
- `.skilled/skills/mcp-browser-use/mode-registry.json`
- `.skilled/skills/mcp-browser-use/hub-router.json`
- `.skilled/skills/mcp-browser-use/graph-metadata.json`
- `.skilled/skills/mcp-tooling/hub-router.json`
- `.skilled/skills/mcp-tooling/mode-registry.json`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence | Note |
|---|---|---|---|
| `spec_code` | pass | `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:14-16` | The compiler reads `mcp-browser-use/mode-registry.json`, `hub-router.json` and `SKILL.md` as its only three sources, so the compiled policy is derived from the hub the spec describes rather than from a parallel copy. |
| `checklist_evidence` | pass | `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1` | The recorded `effectivePolicyHash` `be9b1fe7…` equals the hash recomputed from the current hub sources, so phase 014's manifest edit is backed by the tree. |
| `skill_agent` | pass | `.skilled/skills/mcp-tooling/hub-router.json` | The `mcp-tooling` hub router carries no `browser`, `chrome`, `aside` or `bladebro` pointer, so decision D3 holds at the router level and not only in the registry. |

## Integration Evidence

- Compiled-routing hub compiler: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs` — compiled in memory from the three current hub sources; the destination graph carries exactly three destinations, each with `id.skillId = "mcp-browser-use"` and `id.workflowMode` in `{mcp-chrome-devtools, mcp-aside-devtools, mcp-bladebro}`.
- Compiled-routing router: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs` — all 15 declared canary cases evaluated in memory agree with their declared action and mode set, including the two `defer` cases and the `orderedBundle` case.
- Activation manifest: `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json` — `servingAuthority: compiled`, `shadowOnly: false`, `generation: 1`, hash matches.
- Parent hub: `.skilled/skills/mcp-tooling/mode-registry.json` — six modes, none of them a browser mode; `.skilled/skills/mcp-tooling/hub-router.json` — no browser vocabulary.
- Serving closure: `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` — `fileCount: 69` equals the 69-entry `files` array, every listed file exists, and the only two unlisted files on disk are the `manifest-race-305` and `manifest-test-305` test fixtures.

## Edge Cases

- **Probe construction error, not a product defect.** Recomputing the `mcp-tooling` hash from its five sources threw `SOURCE_IDENTITY_MISMATCH` at `registry-compiler.cjs:232`, because the probe did not reproduce the harness's full `compileRegistry` call shape. The hash change is instead explained by the tree: phase 014 edited `.skilled/skills/mcp-code-mode/SKILL.md`, which is one of `mcp-tooling`'s five compiled sources, so the manifest edit is legitimate. Recorded as an unverified-by-recomputation item rather than as a finding.
- **Write-surface slip, corrected.** One probe was first written to `/tmp/probe2.cjs`, outside the lineage write surface. It was deleted in the same command that noticed it, and every later probe lives inside the lineage directory. No repository file was touched.
- **`validate.sh --strict --recursive` remains blocked** for this lineage because it writes repo-wide; the criterion is left to the cross-lineage merge, as recorded in iterations 1 to 4.
- **`resource-map.md` is absent**, so the coverage gate is skipped rather than passed.

## Confirmed-Clean Surfaces

- The compiled destination graph encodes exactly the hub's three modes, so the compiled artifact and `mode-registry.json` agree on mode count and mode ids.
- The hub's `effectivePolicyHash` recomputes to the recorded value, so the compiled policy is not stale against the hub sources.
- `.opencode/skills` is a symlink to `../.skilled/skills`, so the harness's `.opencode/skills/<hub>` source root resolves to the canonical hub rather than to a stale copy.
- All 15 canary cases agree with the compiled router, including `hub-identity-defer` and `generic-browser-automation-defer`.
- `graph-metadata.json` mentions each of the three mode ids eight times and points its `depends_on` and `enhances` edges at external skills (`mcp-code-mode`, `sk-code`), not at hub members.
- The `mcp-tooling` hub router carries no browser pointer and its registry carries six non-browser modes.

## Ruled Out

- **The compiled policy is stale against the hub sources.** Ruled out: the recomputed hash equals the recorded hash.
- **The harness compiles from a stale `.opencode` mirror.** Ruled out: `.opencode/skills` is a symlink to `../.skilled/skills`.
- **The compiled destination graph carries a mode the hub registry does not.** Ruled out: three destinations, three registry modes, identical ids.
- **The canary fixture's declared gold disagrees with the compiled router.** Ruled out: 15 of 15 cases agree.
- **Phase 014 hand-edited the `mcp-tooling` activation hash with no source change behind it.** Ruled out: phase 014 edited `.skilled/skills/mcp-code-mode/SKILL.md`, one of that hub's five compiled sources.
- **The serving-closure manifest is incomplete.** Ruled out: `fileCount` matches the array, every listed file exists, and the two unlisted files are test fixtures.

## Next Focus

- Dimension: cross-reference (continued)
- Focus area: the three mode packets' own cross-references — the Aside and Chrome DevTools playbooks against their recorded `results.csv` rows, and the Bladebro install guide against `install.sh`
- Reason: the compiled-routing surface is now clean, and the remaining unexamined cross-reference is packet-internal evidence against recorded runs
- Rotation status: all four configured dimensions complete; cross-reference pass one of two done
- Blocked/productive carry-forward: `validate.sh --strict --recursive` stays blocked for this lineage
- Required evidence: file:line citations from the pre-bound scope list

Review verdict: CONDITIONAL
