# Iteration 3: Skilled Retrieval and Code Search Overlap

## Focus

Compare sweet-search’s code-search functions with Skilled’s trigger-index and ripgrep retrieval lanes, agent code-search decision tree, Code Mode/UTCP surface and doctor setup routes. The strategy’s prior blocked direction, replacing the trigger index and exact ripgrep lane, was not retried.

## Actions Taken

- Read the retrieval contract and the repository’s code-search decision tree.
- Compared Code Mode’s UTCP manual contract and doctor install routes with sweet-search’s registered MCP tools.
- Checked the supplied iteration-003 output paths against the current filesystem and read the state projection before writing.

## Findings

1. Skilled’s trigger index matches prompt text against author-declared `trigger_phrases`, while ripgrep scans literal text and leaves relevance judgment to the caller. Neither ranks by meaning. sweet-search adds hybrid semantic, lexical and structural code search with ranked code blocks, so it fills a code-discovery gap while exact identifier search and curated documentation lookup keep their existing roles. [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:36] [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:44] [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:49] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js:208]

2. The AGENTS.md decision tree sends exact symbols and known paths to literal search. For unfamiliar code, it asks agents to search likely vocabulary, map paths and read to confirm. sweet-search’s `search`, `trace` and `repo-map` can combine those code-navigation steps and add caller/callee impact context. The existing document retrieval path remains the relevant surface for spec and skill text. [SOURCE: AGENTS.md:223] [SOURCE: AGENTS.md:226] [SOURCE: AGENTS.md:228] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js:208] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js:236] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js:306]

3. Code Mode/UTCP is a possible delivery surface, not a second retrieval index. Its `manual_call_templates[]` entries describe configured MCP server commands, and its discovery methods expose only configured Code Mode manuals. Native MCP servers are registered separately. An optional sweet-search manual could reuse this surface, but project setup would still need the server configuration and runtime registration. [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:132] [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:142] [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:175]

4. The doctor routes separate Skilled setup from Code Mode MCP setup. `/doctor:install` is a read-only guide; `/doctor:mcp install` is scoped to Code Mode build output, `.utcp_config.json` and runtime MCP configs. This offers a possible documentation or optional manual-configuration touchpoint, but the inspected contract does not define a sweet-search-specific install, health or removal lifecycle. [SOURCE: .skilled/commands/doctor/_routes.yaml:603] [SOURCE: .skilled/commands/doctor/_routes.yaml:609] [SOURCE: .skilled/commands/doctor/_routes.yaml:695] [SOURCE: .skilled/commands/doctor/_routes.yaml:700] [SOURCE: .skilled/commands/doctor/assets/doctor-mcp-install.yaml:12] [SOURCE: .skilled/commands/doctor/assets/doctor-mcp-install.yaml:44]

## Questions Answered

- Q3: How does it overlap with or complement what Skilled already has: the committed trigger index, the ripgrep retrieval recipes, the AGENTS.md code-search decision tree, Code Mode/UTCP MCP registration, and the doctor install commands?

## Questions Remaining

- Q4: Which integration surfaces are candidates (nothing; a docs pointer; a Code Mode/UTCP manual entry; a new mcp-tooling mode; a doctor install/setup step; an sk-code or system-spec-kit retrieval hook), and what does each cost the user in this repo and in external repos that install Skilled?
- Q5: What is the smallest integration that delivers most of the value, which options are over-engineering, and what are the opt-in, failure and uninstall paths (licence, maintenance, staleness, platform gaps)?

## Ruled Out

No new integration surface was ruled out in this iteration. The strategy’s blocked replacement direction was left untouched.

## Dead Ends

None discovered during this iteration.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the dispatch described a malformed-delta redispatch, but filesystem inspection found both prescribed iteration-003 files absent. The state projection already contained an earlier iteration-3 record. This iteration reconstructs the missing artifacts and will verify the new gateway receipt and projection delta.
- Missing dependencies: none.
- Partial success: `progressiveSynthesis` is true in config, but the dispatch’s exact write allowlist excludes `research/research.md`; the required iteration and delta artifacts are in scope.

## SCOPE VIOLATIONS

- Updating `research/research.md` would be outside the supplied write allowlist. No such write was performed.

## Sources Consulted

- `AGENTS.md`
- `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`
- `.skilled/skills/mcp-code-mode/SKILL.md`
- `.utcp_config.json`
- `.skilled/commands/doctor/_routes.yaml`
- `.skilled/commands/doctor/assets/doctor-mcp-install.yaml`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-config.json`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-state.jsonl`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-strategy.md`

## Assessment

- New information ratio: 0.75 (two fully new findings and two partially new findings).
- Questions addressed: Q3.
- Questions answered: Q3.

## Reflection

- What worked and why: comparing the actual retrieval contract, MCP tool schemas and doctor route scope showed which parts are complementary and which setup work an adopter would still own.
- What did not work and why: the existing state row did not prove that the required narrative or delta files existed; checking the exact output paths exposed the mismatch.
- What I would do differently: future redispatch validation should check the expected artifact paths alongside the state projection before treating an iteration row as a complete run.

## Recommended Next Focus

Q4: Which integration surfaces are candidates (nothing; a docs pointer; a Code Mode/UTCP manual entry; a new mcp-tooling mode; a doctor install/setup step; an sk-code or system-spec-kit retrieval hook), and what does each cost the user in this repo and in external repos that install Skilled?

## Status

Complete. Q3 is answered with repository and source-code evidence. The state record and exact output artifacts will be verified after the gateway call.
