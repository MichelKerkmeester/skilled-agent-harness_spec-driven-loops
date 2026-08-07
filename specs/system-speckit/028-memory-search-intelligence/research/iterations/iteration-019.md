# Iteration 19: Generated Metadata And Advisor/Search-Index Documentation

## Focus

This iteration audited generated metadata and skill-advisor/search-index documentation for packet-028 alignment: `description.json`/`graph-metadata.json` generation references, trigger/frontmatter requirements, and whether skill docs accurately describe what memory/search/advisor indexes do or do not index.

Ambiguity note: the reducer-owned strategy `Next Focus` remains the stale initial inventory. I selected the latest packet-local synthesis recommendation from iteration 18 because it directly broadens from feature-catalog validation into adjacent metadata/search-index surfaces.

## Findings

1. `ENV_REFERENCE.md` is current for the save-planner metadata contract: it says all `/memory:save` planner modes refresh packet metadata and that `plan-only` no longer leaves `description.json.lastUpdated` or `graph-metadata.json` untouched. This aligns with packet 028's metadata-hardening theme. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:240]
2. `template_mapping.md` is only partially current for the same area: it correctly says phase parents require the lean trio `spec.md`, `description.json`, and `graph-metadata.json`, but its generation note still frames `generate-context.js` as primarily updating `_memory.continuity` in `implementation-summary.md`, under-describing the now-important packet metadata refresh contract. [SOURCE: .opencode/skills/system-spec-kit/assets/template_mapping.md:66] [SOURCE: .opencode/skills/system-spec-kit/assets/template_mapping.md:69] [SOURCE: .opencode/skills/system-spec-kit/assets/template_mapping.md:271] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:240]
3. The system-spec-kit graph README is current for `graph-metadata.json` runtime parsing: it names `graph-metadata-parser.ts` and `graph-metadata-schema.ts`, says key files are sanitized before the 20-slot cap, entities are deduplicated with canonical packet-doc paths preferred, and trigger phrases are deduplicated/capped at 12. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/README.md:56] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/README.md:74] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/README.md:80]
4. Skill-advisor public docs are mostly current for doc-trigger harvest: README, architecture, and ENV reference all say `SPECKIT_ADVISOR_DOC_TRIGGERS=true` harvests reference/asset doc frontmatter into `skill_docs`, excludes README docs, scores doc phrases as a capped assistive lane, and surfaces sanitized `matchedDocs` paths. [SOURCE: .opencode/skills/system-skill-advisor/README.md:134] [SOURCE: .opencode/skills/system-skill-advisor/ARCHITECTURE.md:135] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:626]
5. A remaining advisor documentation gap is the unsanitized `skill_docs` upsert path: the current README/architecture emphasize sanitized `matchedDocs`, while the packet-028 remediation changelog says `skill_docs` still writes and reads `title`, `description`, and `trigger_phrases` raw, and the inspected DB upsert writes those fields directly. This is not the same as public matchedDocs sanitization, but it is a security/contract caveat that should be visible near the doc-trigger harvest docs. [SOURCE: .opencode/skills/system-skill-advisor/README.md:134] [SOURCE: .opencode/skills/system-skill-advisor/ARCHITECTURE.md:135] [SOURCE: .opencode/skills/system-skill-advisor/changelog/v0.10.0.md:13] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:767]

## Ruled Out

- Treating generated-metadata documentation as wholly stale was ruled out: ENV reference and graph README are current for the inspected save/graph-metadata contracts. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:240] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/graph/README.md:74]
- Treating doc-trigger harvest documentation as absent was ruled out: system-skill-advisor README, ARCHITECTURE, and ENV reference all document the feature and its flag gate. [SOURCE: .opencode/skills/system-skill-advisor/README.md:134] [SOURCE: .opencode/skills/system-skill-advisor/ARCHITECTURE.md:135]

## Dead Ends

- No inspected current high-level advisor README section names the `skill_docs` raw-field caveat; the caveat exists in the changelog and code evidence rather than in the main operator-facing doc-trigger section.

## Edge Cases

- Ambiguous input: selected the latest synthesis focus instead of stale strategy `Next Focus`.
- Contradictory evidence: template mapping under-describes generated metadata refresh, while ENV reference documents the current all-modes refresh behavior.
- Missing dependencies: Code graph remains stale/untrusted, so direct Read/Grep evidence was used. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/research/deep-research-strategy.md:122]
- Partial success: This pass audited docs/code anchors, not live advisor database contents.

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:240`
- `.opencode/skills/system-spec-kit/assets/template_mapping.md:66`
- `.opencode/skills/system-spec-kit/assets/template_mapping.md:69`
- `.opencode/skills/system-spec-kit/assets/template_mapping.md:271`
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/README.md:56`
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/README.md:74`
- `.opencode/skills/system-spec-kit/mcp_server/lib/graph/README.md:80`
- `.opencode/skills/system-skill-advisor/README.md:134`
- `.opencode/skills/system-skill-advisor/ARCHITECTURE.md:135`
- `.opencode/skills/system-skill-advisor/changelog/v0.10.0.md:13`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:767`
- `.opencode/specs/system-speckit/028-memory-search-intelligence/research/deep-research-strategy.md:122`

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Which skill references/assets describe outdated, missing, or over-compressed behavior?
  - Where do docs claim coverage that code or implementation evidence does not fully support?
  - Which gaps affect memory retrieval, generated metadata, or skill advisor behavior?
- Questions answered:
  - Save-planner and graph-metadata runtime docs are mostly current.
  - Template mapping under-describes generated metadata refresh.
  - Advisor doc-trigger docs are mostly current but omit a main-doc caveat for raw `skill_docs` fields.

## Reflection

- What worked and why: Comparing ENV reference, graph README, advisor README/architecture, changelog, and DB upsert code separated current surfaces from one operator-facing caveat gap.
- What did not work and why: The pass did not validate live SQLite state because the run is research-only and code graph/MCP trust is stale.
- What I would do differently: Next pass should inspect code README/feature-catalog coverage for the `skill_docs` raw-field caveat and doc-trigger frontmatter validation tests.

## Recommended Next Focus

Audit system-skill-advisor feature catalogs, manual playbooks, and tests for doc-trigger harvest and `skill_docs` sanitizer-boundary coverage, especially whether the raw-field caveat is represented outside the changelog.
