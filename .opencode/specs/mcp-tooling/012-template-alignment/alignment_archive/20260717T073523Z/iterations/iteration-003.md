# Alignment Iteration 003

## Dispatcher

- Alignment iteration: 3 of 8
- Mode: `alignment`
- Target agent: `deep-alignment`
- Agent definition loaded: `true`
- Resolved route: `Resolved route: mode=alignment target_agent=deep-alignment`
- State source: externalized files
- Budget profile: `scan` (completed within the hard call ceiling)

## Lane

- Lane ID: `sk-doc::docs::.opencode/skills/mcp-tooling/mcp-refero/assets/, .opencode/skills/mcp-tooling/mcp-refero/references/, .opencode/skills/mcp-tooling/mcp-refero/scripts/README.md`
- Authority: `sk-doc`
- Adapter: `sk-doc`
- Artifact class: `docs`
- Scope: `.opencode/skills/mcp-tooling/mcp-refero/assets/`, `.opencode/skills/mcp-tooling/mcp-refero/references/`, `.opencode/skills/mcp-tooling/mcp-refero/scripts/README.md`

## Artifacts Checked

1. `.opencode/skills/mcp-tooling/mcp-refero/assets/utcp-refero-manual.md`
2. `.opencode/skills/mcp-tooling/mcp-refero/references/mcp-wiring.md`
3. `.opencode/skills/mcp-tooling/mcp-refero/references/tool-surface.md`
4. `.opencode/skills/mcp-tooling/mcp-refero/references/troubleshooting.md`
5. `.opencode/skills/mcp-tooling/mcp-refero/scripts/README.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Asset filename violates the sk-doc snake_case convention** -- `.opencode/skills/mcp-tooling/mcp-refero/assets/utcp-refero-manual.md:1` -- The basename uses hyphens, while sk-doc requires lowercase snake_case for Markdown filenames and exempts only `README.md`, `SKILL.md`, and packet-local numbered docs. [SOURCE: .opencode/skills/mcp-tooling/mcp-refero/assets/utcp-refero-manual.md:1] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:37]
   - Finding class: class-of-bug
   - Scope proof: The path is an audited artifact in this lane; its basename is neither an allowed exact-name exception nor a packet-local numbered document. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:39] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:48]
   - Affected surface hints: `mcp-refero asset filename`, `relative references to the asset`, `documentation link consumers`

2. **Wiring reference filename violates the sk-doc snake_case convention** -- `.opencode/skills/mcp-tooling/mcp-refero/references/mcp-wiring.md:1` -- The basename uses a hyphen instead of the required underscore and is not one of the authority's named exceptions. [SOURCE: .opencode/skills/mcp-tooling/mcp-refero/references/mcp-wiring.md:1] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:37]
   - Finding class: class-of-bug
   - Scope proof: The path is an audited reference artifact in this lane, and the authority explicitly maps hyphens to underscores. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:43] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:48]
   - Affected surface hints: `mcp-refero wiring reference filename`, `relative references to the wiring document`, `documentation link consumers`

3. **Tool-surface reference filename violates the sk-doc snake_case convention** -- `.opencode/skills/mcp-tooling/mcp-refero/references/tool-surface.md:1` -- The basename uses a hyphen instead of the required underscore and is not one of the authority's named exceptions. [SOURCE: .opencode/skills/mcp-tooling/mcp-refero/references/tool-surface.md:1] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:37]
   - Finding class: class-of-bug
   - Scope proof: The path is an audited reference artifact in this lane, and the authority explicitly maps hyphens to underscores. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:43] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:48]
   - Affected surface hints: `mcp-refero tool-surface filename`, `relative references to the tool-surface document`, `documentation link consumers`

## Verify-First Evidence

- The dispatched adapter was invoked directly for every artifact with `node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs check <artifact>`; all five deterministic checks returned `[]`.
- The filename findings do not claim live runtime drift. They were re-probed against the authority's current source: lowercase snake_case is still the explicit rule, hyphens are explicitly transformed to underscores, and the exception list does not include these three paths. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:37] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:41] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:48]
- `quick_validate.py` was also invoked against each individual artifact, but its CLI expects a skill root and returned `SKILL.md not found`; that result was treated as non-evidence, not as either confirmation or suppression.
- The repository's live Markdown-link guard was run. It reported unrelated pre-existing failures, but none used an audited Refero artifact as the source. Exact probes confirmed the three code-form paths in `scripts/README.md:93-95` resolve.

## Known-Deviation Suppressions Applied

None. The `kebab-case legacy filename references` deviation was checked for all three filename candidates. It documents accepted legacy reference text and has no deterministic match type; it does not exempt an audited artifact's own non-snake_case basename. No sibling finding was suppressed. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_known_deviations.md:62]

## Edge Cases

- The dispatch describes the session as a lineage restart, while the authoritative externalized config and state record `lineageMode: "new"`, generation 1. The canonical iteration record preserves the externalized value `new` and records this wording mismatch here.
- The repo-wide Markdown-link guard currently reports 104 broken links outside this lane. Those failures are not findings against the five audited artifacts. One out-of-scope referrer points to a misspelled underscore form of `tool-surface.md`; because the referrer is outside this lane, it was ruled out rather than filed here.
- The deterministic sk-doc adapter does not currently enforce filename casing; the P2 findings therefore use the reasoning-agent layer and the authority's current source file rather than being reshaped as deterministic validator output.

## Confirmed-Clean Artifacts

- `.opencode/skills/mcp-tooling/mcp-refero/references/troubleshooting.md`
- `.opencode/skills/mcp-tooling/mcp-refero/scripts/README.md`

Both passed the deterministic adapter. Manual checks found no active P0/P1/P2 creation-standard drift in either artifact.

## Ruled Out

- Broken Related paths in `.opencode/skills/mcp-tooling/mcp-refero/scripts/README.md:93-95`: ruled out by direct existence checks; all three targets resolve from the README's directory.
- Broken Markdown links elsewhere in the repository: ruled out as finding targets because their source artifacts are outside this lane.
- Compact pointer-card suppression: not applicable; no `dqi-below-threshold` finding was emitted.
- TOC suppression: not applicable; no `missing_toc` finding was emitted.

## Next Focus

`partition-corpus.cjs` resolved this Refero lane and the five-artifact slice listed above, with `remainingAfterThisSlice: 0`. This is an informational echo of the partitioner result; no hand-authored next lane is selected here.
