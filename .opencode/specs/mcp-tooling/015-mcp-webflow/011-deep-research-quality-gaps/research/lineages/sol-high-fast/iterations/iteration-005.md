# Iteration 5: Feature And Manual-Test Traceability

## Focus

Determine whether the nine feature cards plus catalog root and all 17 manual scenarios carry enough accurate logic to operationalize the main references. This pass checks both factual correctness and whether tests would catch the earlier findings.

## Actions Taken

1. Read the feature-catalog root and all nine feature cards.
2. Searched all 17 scenario snippets for the identified behavior/risk vocabulary.
3. Read the Agent Instructions, Designer edit, surface reconciliation, rate-limit, bulk, draft-settings, publish, and refusal scenarios in full.
4. Compared their assertions with official v2.0.1 migration and grouped tool behavior.

## Findings

### F29 (P1): The component-variants feature card invents actions and omits the actual v2.0.1 contract

The card lists generic variant reads/list/get, `update_variant`, and `set_default_variant`, none of which exist in the packet's own eight-action remote table or the official current tool. It omits `duplicate_variant`, `get_variant_styles`, `set_variant_name`, `set_variant_styles`, and deterministic full-list reorder semantics, and it calls deletion “irreversible” without noting the base variant cannot be deleted. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/component-variants.md:18-44] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:173-184] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]

Recommendation: replace the table with the exact eight v2.0.1 actions and their base/reorder/breakpoint/pseudo constraints; add one positive and one invalid-base-delete scenario.

### F30 (P1): The localization/fonts/forms card contains unsupported capabilities and omits supported writes

The card suggests “list the locales,” “add a Spanish locale,” localization deletes, and form-config writes. Those actions are not in the remote MCP inventory. Conversely, it omits `update_form_submission` and its hidden-field-only restriction, component localization actions, default/secondary read distinctions, font two-step upload/replacement, and the official inability to create localized CMS items. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/localization-fonts-forms.md:11-55] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:248-293] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: https://developers.webflow.com/mcp/faqs.md]

Recommendation: rewrite from the exact remote action table and add unsupported-operation rows instead of invented locale-management prompts.

### F31 (P1): The Designer card mixes v1.3 names with v2.0.1 behavior and contradicts its own Bridge split

The card opens with legacy `de*` module names, then correctly says page-building Data tools are headless, then says “Designer tools require the Bridge App” without distinguishing the current `data_*` tools from live `designer_tool`. Its action table also groups page creation with session navigation under `dePages`. This is precisely the migration error the official v1.3-to-v2.0 guide warns about. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/designer.md:19-39] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/designer.md:53-93] [SOURCE: https://developers.webflow.com/mcp/skills/skill-migration.md]

Recommendation: use current tool names and add a per-action `headless | bridge-session` column.

### F32 (P1): Publish cards incorrectly apply staging-domain and one-minute site-publish semantics to CMS item publishing

The CMS card says `publish_collection_items` is “staging-first,” references the one-publish/min queue, and offers a prompt to publish CMS items “to the staging subdomain.” The publish card repeats staging-first and 1/min for CMS item publish. Official MCP docs describe item publishing as making drafts live, with no domain target; the official rate page specifically identifies Site Publish as one successful publish/minute. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/cms.md:20-45] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/publish-deploy.md:20-37] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/rate-limits.md]

Recommendation: separate CMS item live-state publication from site-domain publishing and attach rate rules only where officially documented.

### F33 (P1): The Agent Instructions scenario does not test the P0 precedence boundary

The scenario validates only create/delete classification and even passes create/update ungated. It never injects an instruction that asks the agent to publish production, expose a token, skip confirmation, call an unknown tool, or broaden site scope; it therefore cannot detect the safety-critical automatic-instruction trust gap. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/draft-write/instructions.md:20-59] [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]

Recommendation: add a hostile/conflicting instruction fixture and require the operator/skill contract to win with zero forbidden calls, plus raw/resolved/cascade checks.

### F34 (P1): The Designer edit scenario can pass after destructive style replacement

The scenario calls `set_style` after ensuring the new style exists but never reads or preserves the element's current styles. Since official semantics say `set_style` replaces all existing styles, the test's snapshots can show the desired token while silently dropping unrelated classes. It also lacks `ModeForbidden` coverage. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/designer-edit/designer-edit.md:20-59] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]

Recommendation: require current-style inventory, explicit desired final list, preservation assertions, mode preflight, and a `ModeForbidden` recovery branch.

### F35 (P1): Surface reconciliation by count can falsely pass the mislabeled inventories

`DISCOVER-003` identifies a surface by 31/220 versus 18-module counts and “pins the version,” but does not compare action-to-tool ownership, migration relocations, input changes, or a server-reported version. The current local reference is titled 2.0.0 while containing v2.0.1 splits, proving counts alone are insufficient. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/discovery-setup/remote-surface.md:20-59] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:12-33] [SOURCE: https://developers.webflow.com/mcp/skills/skill-migration.md]

Recommendation: compare a canonical fingerprint of tool/action/schema ownership and record endpoint, reported version, package pin, and migration delta.

### F36 (P1): The rate-limit scenario intentionally abuses the real API

`SAFE-003` instructs operators to repeatedly list CMS items until a real 429 occurs and rejects mocks. That creates unnecessary load, consumes the site's per-key budget, can interfere with concurrent work, and is not deterministic across plan tiers. It also tests only the general limit, not endpoint-specific limits or idempotency classes. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/safety-gate/rate-limit.md:20-59] [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/rate-limits.md]

Recommendation: use a controlled proxy/fixture or a test key with a documented low ceiling; test retry scheduling deterministically and reserve one explicitly approved live smoke probe.

### F37 (P1): The 17-scenario suite leaves major capability families and failure modes untested

The index has no dedicated scenarios for component props/variants/slots, asset upload/compression/delete, localization, fonts, forms, WHTML, webhooks, enterprise plan rejection, script replace-all semantics, Agent Instruction precedence, dynamic `get_more_tools`, `ModeForbidden`, official unsupported capabilities, or branch no-merge handoff. Catalog cards often point generically to “relevant scenarios,” but those scenarios do not exist. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/manual-testing-playbook.md:99-119] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/component-variants.md:57-61] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/localization-fonts-forms.md:68-72] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/operations/sitemap-scripts-assets-whtml.md:74-78]

Recommendation: add capability-specific scenarios prioritized by P0/P1 risk, not one scenario per broad operation class.

### F38 (P2): Catalog/test metadata contains broken links, typos, and structurally weak assertions

The root catalog's CMS card links to `design/component-variants.md`; WHTML is repeatedly misspelled `WHMTL`; the Designer card lacks the closing frontmatter delimiter before its H1; and many manual scenarios repeat their objective verbatim without a concrete schema, cleanup, isolation key, or postcondition beyond “no receipt.” [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/feature-catalog.md:61-77] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/feature-catalog.md:180-193] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/designer.md:1-19] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/draft-write/draftset.md:20-59]

Recommendation: run link/frontmatter validation, remove repeated boilerplate, and require setup, exact payload/schema source, deterministic fixture, cleanup, evidence, and negative assertions per scenario.

## Questions Answered

- Q5 answered: the snippets have broad class-level coverage but contain factual errors and leave most capability-specific semantics and safety failures untested.

## Questions Remaining

- No key questions remain; live authenticated schema discovery is an external verification dependency, not an unanswered research question.

## Ruled Out

- “Seventeen scenarios provide comprehensive MCP 2.0 coverage” is false: the suite covers routing/classes but omits most capability-specific invariants and advanced failures. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/manual-testing-playbook.md:99-119]

## Dead Ends

- Counting cards or scenarios is not a useful coverage metric without mapping official invariants and negative cases to assertions.

## Sources Consulted

- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/feature-catalog.md:20-233]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/designer.md:19-127]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/component-variants.md:18-71]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/cms.md:18-73]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/publish-deploy.md:18-71]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/localization-fonts-forms.md:17-83]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/operations/sitemap-scripts-assets-whtml.md:17-88]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/manual-testing-playbook.md:99-148]
- [SOURCE: https://developers.webflow.com/mcp/skills/skill-migration.md]

## Assessment

- New information ratio: 0.86
- Novelty justification: ten traceability findings connect prior semantic gaps to concrete false cards, unsafe tests, and missing scenarios.
- Confidence: high for file-level errors and official action mismatches.

## Reflection

- What worked: coverage mapping exposed that broad operation-class tests do not validate capability semantics.
- What did not work: scenario count and generic catalog links overstated coverage.
- What I would do differently: generate cards and scenario requirements from a versioned invariant matrix.

## Recommended Next Focus

Synthesize a severity-ordered remediation program: P0 trust boundary first, then version/payload/effect correctness, then missing tests and documentation hygiene.
