# Iteration 20: Advisor Doc-Trigger Sanitizer Coverage

## Focus

This iteration audited system-skill-advisor feature catalogs, manual playbooks, and tests for doc-trigger harvest and `skill_docs` sanitizer-boundary coverage, especially whether the raw-field caveat identified in iteration 19 is represented outside the changelog.

Ambiguity note: the reducer-owned strategy `Next Focus` remains the stale initial inventory. I selected the latest packet-local synthesis recommendation from iteration 19 because it directly follows the open advisor `skill_docs` raw-field caveat.

## Findings

1. The doc-frontmatter feature catalog is current and unusually precise for the public doc-trigger behavior: it names the flag gate, reference/assets-only harvest, `skill_docs` table, per-doc hash skip, watcher registration, capped top-3/tier-weighted scoring, sanitized `matchedDocs`, and flag-off byte-identical behavior; it also points to the dedicated automated test file and manual scenario. [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/auto-indexing/doc-frontmatter-harvest.md:22] [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/auto-indexing/doc-frontmatter-harvest.md:43] [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/auto-indexing/doc-frontmatter-harvest.md:44]
2. The sanitizer feature catalog is less precise for `skill_docs`: it broadly says sanitizer coverage includes SQLite daemon writes and that unsanitized labels never leak, but its source/test anchors cover skill-label/metadata/response boundaries rather than doc-frontmatter `title`, `description`, and `trigger_phrases`; the inspected DB upsert writes those raw fields directly. [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/auto-indexing/sanitizer.md:22] [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/auto-indexing/sanitizer.md:29] [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/auto-indexing/sanitizer.md:37] [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/auto-indexing/sanitizer.md:45] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:767]
3. The dedicated manual scenario validates the operator-visible doc-trigger boundary, not raw-field sanitization: it requires scanning with `SPECKIT_ADVISOR_DOC_TRIGGERS=true`, directly checking `skill_docs` row counts, verifying `matchedDocs` plus `doc_reference_signal`, proving doc-only matches stay below hard-route threshold, ensuring memory search returns zero skill-doc results, and checking flag-off invariance. [SOURCE: .opencode/skills/system-skill-advisor/manual_testing_playbook/auto-indexing/doc-frontmatter-harvest.md:36] [SOURCE: .opencode/skills/system-skill-advisor/manual_testing_playbook/auto-indexing/doc-frontmatter-harvest.md:42] [SOURCE: .opencode/skills/system-skill-advisor/manual_testing_playbook/auto-indexing/doc-frontmatter-harvest.md:54] [SOURCE: .opencode/skills/system-skill-advisor/manual_testing_playbook/auto-indexing/doc-frontmatter-harvest.md:57] [SOURCE: .opencode/skills/system-skill-advisor/manual_testing_playbook/auto-indexing/doc-frontmatter-harvest.md:58]
4. The dedicated automated test suite strongly covers doc-trigger lifecycle and public path sanitization: it parses frontmatter, excludes non-harvestable files, proves flag-off no-op behavior, harvests/skips/reindexes/deletes `skill_docs` rows, caps doc scoring contribution/evidence, and sanitizes matched-doc paths against traversal and overlong lists. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/skill-doc-harvest.vitest.ts:75] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/skill-doc-harvest.vitest.ts:137] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/skill-doc-harvest.vitest.ts:155] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/skill-doc-harvest.vitest.ts:197] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/skill-doc-harvest.vitest.ts:246]
5. Adjacent sanitizer tests cover graph metadata and affordance-derived routing attribution, but they do not close the doc-frontmatter raw-field gap: `skill-graph-db.vitest.ts` sanitizes graph-metadata domains, intent signals, source docs, key files, and derived triggers before projection scoring, while `affordance-normalizer.test.ts` prevents raw affordance descriptions/phrases from becoming routing evidence; neither injects malicious doc-frontmatter `title`, `description`, or `trigger_phrases` into `skill_docs` and asserts sanitized storage/readback. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-db.vitest.ts:103] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-db.vitest.ts:148] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/affordance-normalizer.test.ts:60] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/affordance-normalizer.test.ts:98] [INFERENCE: compared these test scopes with the raw `skill_docs` upsert at .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:767]

## Ruled Out

- Treating doc-trigger harvest as undocumented was ruled out: the feature catalog, manual scenario, and dedicated vitest file all describe or test the lifecycle. [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/auto-indexing/doc-frontmatter-harvest.md:22] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/skill-doc-harvest.vitest.ts:155]
- Treating all sanitizer coverage as absent was ruled out: graph metadata and affordance boundaries have explicit sanitization tests. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-db.vitest.ts:103] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/affordance-normalizer.test.ts:79]

## Dead Ends

- No inspected feature catalog, manual scenario, or test outside the changelog specifically documents or asserts sanitizer behavior for raw `skill_docs.title`, `skill_docs.description`, or `skill_docs.trigger_phrases` storage. The reducer should preserve this as a narrow coverage gap rather than a blanket advisor-doc-trigger gap.

## Edge Cases

- Ambiguous input: selected the packet-local synthesis focus rather than the stale strategy `Next Focus`.
- Contradictory evidence: the sanitizer catalog's broad “SQLite persistence writes” wording suggests a comprehensive boundary, while the doc-frontmatter implementation upsert writes raw frontmatter fields and inspected tests do not assert sanitized storage/readback for those fields. [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/auto-indexing/sanitizer.md:22] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:767]
- Missing dependencies: Code graph remains stale/untrusted, so this pass used direct file evidence. [SOURCE: .opencode/specs/system-speckit/029-memory-search-intelligence/research/deep-research-strategy.md:122]
- Partial success: This pass did not run the vitest suites; it audited checked-in test coverage and documentation surfaces.

## Sources Consulted

- `.opencode/skills/system-skill-advisor/feature_catalog/auto-indexing/doc-frontmatter-harvest.md:22`
- `.opencode/skills/system-skill-advisor/feature_catalog/auto-indexing/doc-frontmatter-harvest.md:43`
- `.opencode/skills/system-skill-advisor/feature_catalog/auto-indexing/sanitizer.md:22`
- `.opencode/skills/system-skill-advisor/feature_catalog/auto-indexing/sanitizer.md:45`
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/auto-indexing/doc-frontmatter-harvest.md:36`
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/auto-indexing/doc-frontmatter-harvest.md:54`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-doc-harvest.vitest.ts:155`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-doc-harvest.vitest.ts:246`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:767`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-graph-db.vitest.ts:103`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/affordance-normalizer.test.ts:98`
- `.opencode/specs/system-speckit/029-memory-search-intelligence/research/deep-research-strategy.md:122`

## Assessment

- New information ratio: 1.0
- Questions addressed:
  - Which feature catalogs and manual testing playbooks describe outdated, missing, or over-compressed behavior?
  - Where do docs claim coverage that tests or code do not fully support?
  - Which gaps affect skill advisor behavior and MCP/tool contracts?
- Questions answered:
  - System-skill-advisor doc-trigger harvest is well represented in feature catalog, manual scenario, and dedicated tests.
  - Public `matchedDocs` path sanitization and flag-off invariance are covered.
  - The raw `skill_docs` frontmatter-field caveat remains underrepresented outside the changelog/code path.

## Reflection

- What worked and why: Comparing the feature catalog, playbook scenario, dedicated vitest suite, adjacent sanitizer tests, and DB upsert separated mature public doc-trigger coverage from the narrower raw-storage caveat.
- What did not work and why: Broad sanitizer wording was initially tempting as proof of full coverage, but source/test anchors showed it mainly covers skill labels, metadata, response envelopes, diagnostics, and affordance attribution.
- What I would do differently: Next pass should inspect README/SKILL/manual index surfaces for whether this narrow caveat should be elevated as operator-facing release guidance or kept as a test-coverage gap.

## Recommended Next Focus

Audit system-skill-advisor README/SKILL/manual index and release guidance for whether doc-trigger raw-field caveats and sanitizer-boundary limits are visible at the operator decision points, not only in changelog/code evidence.
