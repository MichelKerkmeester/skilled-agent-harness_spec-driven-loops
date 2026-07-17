# Deep-Alignment Iteration 004

## Dispatcher

- Alignment Iteration: 4 of 8
- Mode: `alignment`
- Target agent: `deep-alignment`
- Agent definition loaded: `true`
- Resolved route: `Resolved route: mode=alignment target_agent=deep-alignment`
- Session: `2026-07-17T07:37:16.970Z`
- Generation: `1`
- Lineage mode: `new`
- Budget profile: `scan` (9-11 calls)

## Lane

- Lane ID: `sk-doc::docs::.opencode/skills/mcp-tooling/mcp-mobbin/assets/, .opencode/skills/mcp-tooling/mcp-mobbin/references/, .opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md`
- Authority: `sk-doc`
- Adapter: `sk-doc`
- Artifact class: `docs`
- Scope: paths under `.opencode/skills/mcp-tooling/mcp-mobbin/assets/`, `.opencode/skills/mcp-tooling/mcp-mobbin/references/`, and `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md`

## Artifacts Checked

1. `.opencode/skills/mcp-tooling/mcp-mobbin/assets/utcp-mobbin-manual.md`
2. `.opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md`
3. `.opencode/skills/mcp-tooling/mcp-mobbin/references/tool-surface.md`
4. `.opencode/skills/mcp-tooling/mcp-mobbin/references/troubleshooting.md`
5. `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Asset manual filename uses kebab-case** -- `.opencode/skills/mcp-tooling/mcp-mobbin/assets/utcp-mobbin-manual.md:1` -- The live basename `utcp-mobbin-manual.md` violates the authority's lowercase snake_case rule and matches none of the three named exceptions. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:39] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:48] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/assets/utcp-mobbin-manual.md:1]
   - Finding class: `instance-only`; lane tags: `authority=sk-doc`, `artifactClass=docs`, `type=reality-drift`, `subcheck=filename-conformance`, `layer=reasoning-agent`.
   - Scope proof: the live path is one of the five partition-assigned artifacts and lies under the lane's declared `assets/` path.
   - Affected surface hints: `mcp-mobbin asset filename`, `in-repo links to the asset`.
   - Claim: the current audited artifact basename is non-conformant.
   - Reprobe evidence: the file exists; its basename contains hyphens; `core_standards.md:39-51` requires snake_case and does not except it; the live adapter returned `[]` for sibling deterministic checks.
   - matchesLiveReality: `true`.

2. **MCP wiring reference filename uses kebab-case** -- `.opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md:1` -- The live basename `mcp-wiring.md` violates the authority's lowercase snake_case rule and matches none of the three named exceptions. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:39] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:48] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md:1]
   - Finding class: `instance-only`; lane tags: `authority=sk-doc`, `artifactClass=docs`, `type=reality-drift`, `subcheck=filename-conformance`, `layer=reasoning-agent`.
   - Scope proof: the live path is one of the five partition-assigned artifacts and lies under the lane's declared `references/` path.
   - Affected surface hints: `mcp-mobbin reference filename`, `in-repo links to the reference`.
   - Claim: the current audited artifact basename is non-conformant.
   - Reprobe evidence: the file exists; its basename contains a hyphen; `core_standards.md:39-51` requires snake_case and does not except it; the live adapter returned `[]` for sibling deterministic checks.
   - matchesLiveReality: `true`.

3. **Tool-surface reference filename uses kebab-case** -- `.opencode/skills/mcp-tooling/mcp-mobbin/references/tool-surface.md:1` -- The live basename `tool-surface.md` violates the authority's lowercase snake_case rule and matches none of the three named exceptions. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:39] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:48] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/tool-surface.md:1]
   - Finding class: `instance-only`; lane tags: `authority=sk-doc`, `artifactClass=docs`, `type=reality-drift`, `subcheck=filename-conformance`, `layer=reasoning-agent`.
   - Scope proof: the live path is one of the five partition-assigned artifacts and lies under the lane's declared `references/` path.
   - Affected surface hints: `mcp-mobbin reference filename`, `in-repo links to the reference`.
   - Claim: the current audited artifact basename is non-conformant.
   - Reprobe evidence: the file exists; its basename contains a hyphen; `core_standards.md:39-51` requires snake_case and does not except it; the live adapter returned `[]` for sibling deterministic checks.
   - matchesLiveReality: `true`.

## Verify-First Evidence

- `partition-corpus.cjs` assigned exactly the five artifacts above and reported `remainingAfterThisSlice: 0` for this lane.
- The live `sk-doc.cjs check` adapter returned `[]` for every artifact, exercising the authority's real `validate_document.py` and `extract_structure.py` paths. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs:60]
- Direct live-path basename probes confirmed all three candidate files exist, contain hyphens, and are not `README.md`, `SKILL.md`, or packet-local numbered documents. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:39] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:48]
- The severity doctrine classifies filename polish as P2 rather than a merge-blocking P0/P1. [SOURCE: .opencode/skills/sk-code/code-review/references/review_core.md:32]

## Known-Deviation Suppressions Applied

- Applied `kebab-case-legacy-references` only to candidate observations about existing in-content links to kebab-case filenames. This did not suppress the three sibling findings about the current audited basenames themselves. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_known_deviations.md:71]
- The adapter emitted no deterministic findings. The compact-pointer-card DQI deviation produced no separately reportable finding, and no broad artifact exemption was applied.

## Edge Cases

- The rendered dispatch labels the lineage as `restart`, while the externalized config and prior canonical state records identify this session as `lineageMode: new`, with generation `1` and no parent session. Because the route declares `state_source=externalized_files`, the canonical record retains `new`; this discrepancy does not affect lane scope or finding classification. [SOURCE: .opencode/specs/mcp-tooling/012-template-alignment/alignment/deep-alignment-config.json:4]
- `core_standards.md:175` names a `quick_validate.py --validate-only` interface, but the live CLI rejects that flag and accepts a skill-directory positional argument instead. The iteration therefore relied on the authority source plus direct path/basename re-probes and the adapter's wrapped validators; this authority-tooling mismatch is outside the audited artifact lane and was not filed against the Mobbin documents. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:175]
- The audited mcp-mobbin files already had user worktree modifications before the iteration write. SHA-256 snapshots were captured before output creation so the final verification can prove this iteration did not alter them; no remediation was attempted.

## Confirmed-Clean Artifacts

- `.opencode/skills/mcp-tooling/mcp-mobbin/references/troubleshooting.md` -- live adapter findings `[]`; conformant lowercase snake_case basename.
- `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md` -- live adapter findings `[]`; basename is covered by the explicit `README.md` exception.

## Ruled Out

- No P0/P1 structural or template-conformance drift: the authority adapter emitted no finding for any of the five artifacts.
- No additional active DQI finding: the adapter's full check returned an empty finding array for every artifact after candidate-specific known-deviation suppression.
- No filename finding for `troubleshooting.md` or `README.md`: the former conforms and the latter is explicitly excepted.
- No general content-correctness, Mobbin-behavior, or link-integrity review was expanded into this sk-doc creation-standard lane.
- No broad artifact exemption was applied; known-deviation review remained candidate-specific.

## Next Focus

`partition-corpus.cjs` returned this lane with the five artifacts listed above, `remainingAfterThisSlice: 0`, and did not report the corpus as done before this iteration record was written.
