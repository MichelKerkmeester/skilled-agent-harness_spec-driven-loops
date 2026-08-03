# Iteration 3: Content And Operational Semantics

## Focus

Determine whether the packet contains enough behavior, limits, and failure semantics for non-Designer content and operational tools. Action presence alone is not counted as sufficient coverage.

## Actions Taken

1. Read the official grouped Data-tool reference for CMS, pages, assets, forms, localization, scripts, sites, enterprise, and sitemap behavior.
2. Read the official MCP overview limitations.
3. Read the official Data API rate-limit contract.
4. Compared those facts with the local action inventory, tool-surface summary, wiring reference, and safety matrix.

## Findings

### F13 (P1): Asset lifecycle logic is materially incomplete

Official docs define asset creation as step one of a two-step upload using a presigned target; compression is asynchronous, replaces files in place, supports only specific image inputs/formats, and is capped at 10 calls/min/site; asset-folder names must be sibling-unique and folders cannot be deleted; asset deletion is a soft delete that is not restorable through the API. The packet mostly lists action names and presents upload/compression as a simple call sequence, omitting these operational and rollback facts. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:67-96] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:133-137]

Recommendation: document the upload transaction, async polling, replacement/format semantics, 10/min limit, folder constraints, and “not API-restorable” deletion rollback.

### F14 (P1): Script operations need separate register/apply/replace/delete semantics and consistent gating

Official docs say registration and application are separate; `set_page_scripts`/`set_site_scripts` replace all applied scripts; `clear_*` removes applications but leaves the registry; freeform setters replace an entire head/footer block; deleting a registered script and all versions is irreversible; inline source is capped at 2000 characters. The local packet compresses this into generic DW/DS lists, and its safety references conflict: the skill classifies scripts as DW while wiring says script registration is deploy-gated. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/tool-surface.md:43-44] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:156-163] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:174-179]

Recommendation: define separate effects (`register`, `apply-additive`, `replace-all`, `clear-applications`, `delete-registry`, `replace-freeform-block`) and gate by effect rather than the word “script.”

### F15 (P1): Localization constraints are missing from the action reference and safety doctrine

Official docs say localization reads may target primary or secondary locales, but all localization writes are secondary-locale-only; the MCP overview also states that new localized CMS items cannot be created. The local action table lists localization actions without these preconditions, and the skill's critical semantics omit localization entirely. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:280-293] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:165-177]

Recommendation: add locale preflight, primary-versus-secondary read/write matrix, and explicit unsupported localized-item creation behavior.

### F16 (P1): Form mutation scope is too broad in local documentation

Official docs restrict `update_form_submission` to user-hidden field values. The local action inventory says only `form_submission_data`, which can imply arbitrary submission edits. Deleting submissions is also a destructive data operation deserving explicit before/after and retention/privacy guidance, but no forms-specific scenario exists in the current playbook inventory. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:264-276] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/manual-testing-playbook.md:99-119]

Recommendation: document hidden-field-only writes, permission/privacy boundaries, and add read/update/delete form scenarios.

### F17 (P1): Branch documentation implies a merge capability the MCP surface does not expose

The official MCP page tool exposes create, list, inspect, and delete branch actions; it does not expose merge. The local Designer reference states that switching to a branch isolates edits “until the branch merges,” without saying merge is out-of-band/manual or unsupported through MCP. That is an important workflow boundary, not a minor omission. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:296-313] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:133-137]

Recommendation: state explicitly that MCP can prepare and inspect branch work but cannot merge it; identify the required operator/Designer handoff.

### F18 (P2): Endpoint-specific limits and payload cardinalities are missing

Official action descriptions include limits that the “complete” action index omits: bulk page updates 1-100, schema writes 1-25, CMS unpublish up to 100, custom-font batch delete up to 100, compression 10 calls/min/site, asset-folder listing default page size 25, registered scripts max 800, and inline scripts max 2000 characters. Missing limits encourage avoidable validation failures and oversized retries. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:67-85] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:248-340]

Recommendation: add a generated limits column and boundary-value examples/tests.

### F19 (P2): Rate-limit guidance misses per-key accounting, cache behavior, polling mitigation, and endpoint overrides

The local packet correctly records 60/120/custom rpm, `Retry-After`, SDK backoff, and one publish/minute. Official rate docs add that limits are per API key, cached content-delivery requests are effectively unlimited while origin misses count, headers are returned on every response, and webhooks should replace aggressive polling; endpoint-specific limits such as asset compression apply separately. [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/rate-limits.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:152-159] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/troubleshooting.md:52-57]

Recommendation: expand retry doctrine into a rate-budget model with per-key state, endpoint overrides, jittered scheduling, polling-to-webhook guidance, and idempotency-aware retries.

### Confirmed Non-Gap: Remote CMS draft and explicit publish semantics are correct

Official docs say create/update item actions produce drafts and publishing/unpublishing is separate. The governing skill accurately distinguishes the remote behavior from the local OSS client's live/queued choice and prohibits assuming cross-surface draft safety. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:165-177]

## Questions Answered

- Q3 answered: coverage breadth is high, but asset, script, localization, forms, branch, limit, and rate semantics are too concise for reliable execution.

## Questions Remaining

- Q4: AI, Agent Instructions, WHTML, utility tools, official limitations, and migration/reconciliation.
- Q5: feature cards and scenarios.

## Ruled Out

- “All CMS item writes are immediately live” is false for the remote 2.0 surface; create/update actions produce drafts. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]

## Dead Ends

- MCP branch merge cannot be tested or documented as a tool action because no merge action appears in the official MCP surface. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]

## Sources Consulted

- [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]
- [SOURCE: https://developers.webflow.com/mcp]
- [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/rate-limits.md]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:67-340]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:152-185]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/tool-surface.md:35-92]

## Assessment

- New information ratio: 0.82
- Novelty justification: seven new operational gaps and one confirmed CMS rule extend the audit beyond Designer semantics.
- Confidence: high for official behavior; medium for local-OSS equivalence until version-pinned live discovery.

## Reflection

- What worked: action descriptions exposed lifecycle and cardinality facts absent from required-parameter tables.
- What did not work: guessed individual REST branch/publish URLs returned 404; grouped MCP docs remained authoritative.
- Adjustment: inspect official migration, utility, architecture, overview limitations, and local feature/test snippets next.

## Recommended Next Focus

AI tools, Agent Instructions/resources, WHTML, utility discovery, official limitations, and local-OSS versus remote migration/reconciliation.
