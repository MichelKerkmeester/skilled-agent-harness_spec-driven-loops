# Alignment Iteration 001

## Dispatcher

- Mode: `alignment`
- Target agent: `deep-alignment`
- Agent definition loaded: `true`
- Resolved route: `Resolved route: mode=alignment target_agent=deep-alignment`
- Budget profile: `scan` (hard ceiling observed)
- Session: `2026-07-17T07:37:16.970Z`; generation `1`; canonical externalized lineage mode `new`

## Lane

- Lane ID: `sk-doc::docs::.opencode/skills/mcp-tooling/mcp-aside-devtools/assets/, .opencode/skills/mcp-tooling/mcp-aside-devtools/references/, .opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/README.md`
- Authority: `sk-doc`
- Artifact class: `docs`
- Adapter: `sk-doc`
- Scope: `paths` over `.opencode/skills/mcp-tooling/mcp-aside-devtools/assets/`, `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/`, and `.opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/README.md`

## Artifacts Checked

1. `.opencode/skills/mcp-tooling/mcp-aside-devtools/assets/utcp-aside-manual.md`
2. `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-cli-reference.md`
3. `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-online-research-2026-07-17.md`
4. `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md`
5. `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/session-management.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Asset filename uses kebab-case instead of required snake_case** -- `.opencode/skills/mcp-tooling/mcp-aside-devtools/assets/utcp-aside-manual.md:1` -- The live `sk-doc` rule requires lowercase snake_case for every Markdown filename except `README.md`, `SKILL.md`, and packet-local numbered docs; this file matches no exception. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:39] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:48] [SOURCE: .opencode/skills/mcp-tooling/mcp-aside-devtools/assets/utcp-aside-manual.md:1]
   - Finding class: `class-of-bug`
   - Scope proof: direct path re-probe confirmed this is one of five same-class filename sites in the dispatched `sk-doc/docs/paths` slice.
   - Affected surface hints: `asset filename`, `in-repo links`, `progressive-disclosure routes`

2. **CLI reference filename uses kebab-case instead of required snake_case** -- `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-cli-reference.md:1` -- The live `sk-doc` filename rule and exception list do not permit this unnumbered reference filename. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:39] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:48] [SOURCE: .opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-cli-reference.md:1]
   - Finding class: `class-of-bug`
   - Scope proof: direct path re-probe confirmed the filename in the dispatched `sk-doc/docs/paths` slice.
   - Affected surface hints: `reference filename`, `in-repo links`, `routing metadata`

3. **Dated research filename uses kebab-case outside the numbered-doc exception** -- `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-online-research-2026-07-17.md:1` -- A date suffix does not make this a packet-local `NNN-name.md`; the live standard still requires snake_case. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:39] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:51] [SOURCE: .opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-online-research-2026-07-17.md:1]
   - Finding class: `class-of-bug`
   - Scope proof: direct path re-probe confirmed the filename in the dispatched `sk-doc/docs/paths` slice.
   - Affected surface hints: `research filename`, `dated links`, `routing metadata`

4. **MCP wiring reference filename uses kebab-case instead of required snake_case** -- `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md:1` -- The file is neither a named exception nor a numbered packet document. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:39] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:48] [SOURCE: .opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md:1]
   - Finding class: `class-of-bug`
   - Scope proof: direct path re-probe confirmed the filename in the dispatched `sk-doc/docs/paths` slice.
   - Affected surface hints: `reference filename`, `cross-reference links`, `routing metadata`

5. **Session-management reference filename uses kebab-case instead of required snake_case** -- `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/session-management.md:1` -- The file is outside all three explicit filename exceptions. [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:39] [SOURCE: .opencode/skills/sk-doc/shared/references/core_standards.md:48] [SOURCE: .opencode/skills/mcp-tooling/mcp-aside-devtools/references/session-management.md:1]
   - Finding class: `class-of-bug`
   - Scope proof: direct path re-probe confirmed the filename in the dispatched `sk-doc/docs/paths` slice.
   - Affected surface hints: `reference filename`, `cross-reference links`, `routing metadata`

## Verify-First Evidence

- Direct adapter re-probe: `sk-doc.cjs check <artifact>` returned `[]` for every artifact, confirming no deterministic `validate_document.py` or `extract_structure.py` finding.
- Direct standard-source re-probe: `.opencode/skills/sk-doc/shared/references/core_standards.md:39-51` requires lowercase snake_case and limits exceptions to `README.md`, `SKILL.md`, and packet-local numbered documents.
- Direct filesystem re-probe: all five dispatched paths exist under the resolved lane and retain hyphenated basenames.
- `quick_validate.py` was also invoked against the containing skill and returned valid, but its live implementation validates `SKILL.md` frontmatter/structure only; it does not scan bundled Markdown filenames. That absence does not counter the explicit standard-source rule.
- These are P2 documentation-conformance findings, not P0/P1 live-behavior claims; the source-file re-probe plus path existence is the applicable verify-first evidence.

## Known-Deviation Suppressions Applied

None. The `kebab-case-legacy-references` deviation was reviewed but not applied: its prose covers in-repo references that still point to older renamed filenames, while these findings concern the audited artifacts' own current filenames. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_known_deviations.md:71] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_known_deviations.md:73] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_known_deviations.md:81]

## Edge Cases

- The dispatch describes the session as a lineage restart, while the canonical externalized config and state use `lineageMode: "new"`, `generation: 1`, and `parentSessionId: null`. Per `state_source=externalized_files`, this record uses `new`; scope and iteration identity are unaffected.
- The standard's quick-reference text attributes filename handling to `quick_validate.py`, but the live CLI validates the skill's `SKILL.md` only. This validator coverage gap was ruled out as an out-of-lane authority-tool issue and was not filed against the audited artifacts.

## Confirmed-Clean Artifacts

No artifact is fully clean because each carries the P2 filename-conformance finding above. All five are confirmed clean under the adapter's deterministic template-conformance and DQI subchecks.

## Ruled Out

- No missing required sections, frontmatter errors, heading-structure errors, or DQI-threshold findings were emitted by the live adapter.
- No TOC finding was filed; the repository-wide TOC ban is already represented in the authority's known-deviation list and the live documents do not conflict with it.
- No general factual-correctness or source-freshness review was performed; those dimensions are outside this alignment lane.
- The failed `--validate-only` invocation was not treated as evidence because the live CLI does not support that flag; the correct directory invocation was run afterward.

## Next Focus

`partition-corpus.cjs` returned this same `sk-doc` / `docs` / asIDE paths lane with the five artifacts listed above and `remainingAfterThisSlice: 2`. It did not identify the next two paths in this call; the next orchestrated iteration must echo a fresh partition result rather than hand-selecting them.
