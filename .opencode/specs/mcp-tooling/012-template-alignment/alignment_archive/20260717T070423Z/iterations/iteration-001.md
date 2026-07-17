# Deep-Alignment Iteration 001

## Dispatcher

- Mode: `alignment`
- Target agent: `deep-alignment`
- Agent definition loaded: `.opencode/agents/deep-alignment.md`
- Resolved route: `Resolved route: mode=alignment target_agent=deep-alignment`
- Budget profile: `verify` (target 11-13 calls)
- Session: `2026-07-17T06:31:50.774Z` (generation 1, lineage `new`)

## Lane

- Lane ID: `sk-doc::docs::.opencode/skills/mcp-tooling/mcp-aside-devtools/assets/, .opencode/skills/mcp-tooling/mcp-aside-devtools/references/, .opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/README.md`
- Authority: `sk-doc`
- Adapter: `sk-doc`
- Artifact class: `docs`
- Scope: `paths` over `.opencode/skills/mcp-tooling/mcp-aside-devtools/assets/`, `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/`, and `.opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/README.md`

## Artifacts Checked

1. `.opencode/skills/mcp-tooling/mcp-aside-devtools/assets/utcp-aside-manual.md`
2. `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-cli-reference.md`
3. `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-online-research-2026-07-17.md`
4. `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md`
5. `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/session-management.md`

## Findings - New

### P0 Findings

1. **Asset omits the required overview section** -- `.opencode/skills/mcp-tooling/mcp-aside-devtools/assets/utcp-aside-manual.md:22` -- The first H2 is `THE REGISTERED MANUAL`, so no section matches the authority's required `overview` section for asset documents. The direct validator reports `missing_required_section` with blocking severity and exit 1. [SOURCE: .opencode/skills/mcp-tooling/mcp-aside-devtools/assets/utcp-aside-manual.md:22] [SOURCE: .opencode/skills/sk-doc/shared/assets/template_rules.json:317] [SOURCE: .opencode/skills/sk-doc/shared/scripts/validate_document.py:548]
   - Finding class: `missing_required_section` / `template-conformance` / `deterministic`
   - Scope proof: authority `sk-doc`, artifactClass `docs`, within the dispatched `assets/` path scope.
   - Affected surface hints: asset structure; consumers relying on sk-doc validation of bundled manuals.
   - Claim: The asset lacks the required overview section.
   - Reprobe evidence: Direct `validate_document.py --json --type asset` run returned `valid:false`, `missing_required_section: overview`, exit 1; current heading reread begins its H2 structure at line 22 without an overview.
   - matchesLiveReality: `false` (the artifact does not match the live authority rule).

2. **Research reference omits the required overview section** -- `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-online-research-2026-07-17.md:23` -- The first H2 is `SOURCES FETCHED`, so no section matches the authority's required `overview` section for reference documents. The direct validator reports `missing_required_section` with blocking severity and exit 1. [SOURCE: .opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-online-research-2026-07-17.md:23] [SOURCE: .opencode/skills/sk-doc/shared/assets/template_rules.json:267] [SOURCE: .opencode/skills/sk-doc/shared/scripts/validate_document.py:548]
   - Finding class: `missing_required_section` / `template-conformance` / `deterministic`
   - Scope proof: authority `sk-doc`, artifactClass `docs`, within the dispatched `references/` path scope.
   - Affected surface hints: research-reference structure; sk-doc validation gate.
   - Claim: The reference lacks the required overview section.
   - Reprobe evidence: Direct `validate_document.py --json --type reference` run returned `valid:false`, `missing_required_section: overview`, exit 1; current heading reread begins its H2 structure at line 23 without an overview.
   - matchesLiveReality: `false` (the artifact does not match the live authority rule).

3. **MCP wiring reference omits the required overview section** -- `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md:21` -- The first H2 is `TRANSPORT`, so no section matches the authority's required `overview` section for reference documents. The direct validator reports `missing_required_section` with blocking severity and exit 1. [SOURCE: .opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md:21] [SOURCE: .opencode/skills/sk-doc/shared/assets/template_rules.json:267] [SOURCE: .opencode/skills/sk-doc/shared/scripts/validate_document.py:548]
   - Finding class: `missing_required_section` / `template-conformance` / `deterministic`
   - Scope proof: authority `sk-doc`, artifactClass `docs`, within the dispatched `references/` path scope.
   - Affected surface hints: MCP wiring reference structure; sk-doc validation gate.
   - Claim: The reference lacks the required overview section.
   - Reprobe evidence: Direct `validate_document.py --json --type reference` run returned `valid:false`, `missing_required_section: overview`, exit 1; current heading reread begins its H2 structure at line 21 without an overview.
   - matchesLiveReality: `false` (the artifact does not match the live authority rule).

4. **Session-management reference omits the required overview section** -- `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/session-management.md:21` -- The first H2 is `THREE-LAYER SESSION MODEL`, so no section matches the authority's required `overview` section for reference documents. The direct validator reports `missing_required_section` with blocking severity and exit 1. [SOURCE: .opencode/skills/mcp-tooling/mcp-aside-devtools/references/session-management.md:21] [SOURCE: .opencode/skills/sk-doc/shared/assets/template_rules.json:267] [SOURCE: .opencode/skills/sk-doc/shared/scripts/validate_document.py:548]
   - Finding class: `missing_required_section` / `template-conformance` / `deterministic`
   - Scope proof: authority `sk-doc`, artifactClass `docs`, within the dispatched `references/` path scope.
   - Affected surface hints: session-management reference structure; sk-doc validation gate.
   - Claim: The reference lacks the required overview section.
   - Reprobe evidence: Direct `validate_document.py --json --type reference` run returned `valid:false`, `missing_required_section: overview`, exit 1; current heading reread begins its H2 structure at line 21 without an overview.
   - matchesLiveReality: `false` (the artifact does not match the live authority rule).

### P1 Findings

None.

### P2 Findings

None.

## Verify-First Evidence

- `sk-doc.cjs standard-source` resolved the live authority to `validate_document.py`, `extract_structure.py`, `template_rules.json`-backed core standards, create-skill asset/reference templates, and the parsed sk-doc known-deviation list.
- The adapter check was run independently for all five artifacts.
- Each of the four P0 candidates was re-probed directly through `.opencode/skills/sk-doc/shared/scripts/validate_document.py` with its classified type. All four produced `valid:false`, one blocking `missing_required_section: overview`, and process exit 1.
- The live rule source requires `overview` for reference documents at `.opencode/skills/sk-doc/shared/assets/template_rules.json:264-267` and for asset documents at `.opencode/skills/sk-doc/shared/assets/template_rules.json:315-318`. The validator constructs a blocking finding when a required section is absent at `.opencode/skills/sk-doc/shared/scripts/validate_document.py:548-553`.
- Current headings were reread after the direct probes; the cited first-H2 lines confirm the absence without relying on pattern matching alone.

## Known-Deviation Suppressions Applied

None. Every candidate was checked against `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_known_deviations.md`. The only potentially adjacent active deviation, `compact-pointer-card-dqi`, suppresses only `dqi-below-threshold` for structurally valid readme/asset documents with validator exit 0; it explicitly never suppresses `missing_required_section` and therefore does not match these exit-1 blockers. [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_known_deviations.md:53] [SOURCE: .opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk_doc_known_deviations.md:63]

## Edge Cases

- No hard-block input, packet-boundary, dependency, or adapter errors occurred.
- The authority adapter's P0 mapping is stricter than the shared review doctrine's generic wording, but it is the lane authority's operative creation-standard gate and was confirmed by the live validator; severity remains P0 under the adapter contract.
- Audited artifacts remained read-only. No remediation was attempted.

## Confirmed-Clean Artifacts

- `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-cli-reference.md` returned no adapter findings. Its current first H2 is `## 1. OVERVIEW` at line 21. [SOURCE: .opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-cli-reference.md:21]

## Ruled Out

- No P1 warnings were emitted by the live validator for the five checked artifacts.
- No unsuppressed P2 DQI findings were emitted by the adapter.
- No reality-drift claim was filed from prose pattern matching; no independently verified contradicted live-behavior claim was present in this template-conformance slice.
- Filename-style observations were ruled out because the known-deviation list marks legacy kebab-case references as accepted precedent and the adapter does not emit a filename-casing finding.

## Next Focus

The partitioner resolved this iteration to the five artifacts listed above and reported `remainingAfterThisSlice: 2` in the same lane. In corpus order, the remaining deterministic slice is `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/troubleshooting.md` and `.opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/README.md`; this is an informational echo of partition state, not a convergence decision.
