# Iteration 5 - sk-code Ingestion and Embedding Abstraction

## Focus
Audited whether `mcp-coco-index` ingests `.opencode/skills/sk-code/` resources, whether semantic queries surface those resources with usable rank, and how embedding-provider/settings behavior affects interpretation of those results.

## Actions Taken
- Action 1: Read strategy Sections 3, 6-12 plus iteration 4 and prior finding summaries to avoid repeating the CLI/MCP parity and hidden-directory hypotheses.
- Action 2: Read project and default CocoIndex settings, the indexer matcher path, `.gitignore`, and embedding-provider daemon restart paths.
- Action 3: Ran scoped `ccc search` queries for sk-code OpenCode phrases and compared them with an unscoped query for the same phrase.
- Action 4: Read the sk-code OpenCode resources surfaced by search, including universal spec-folder invariants, OpenCode surface detection, and manual testing playbook evidence requirements.

## Findings

### mcp-coco-index

### F-005-001 - sk-code ingestion works locally, but depends on repo-specific settings [P1]
The local project settings intentionally allow most `.opencode` resources to be indexed: `.cocoindex_code/settings.yml:1`-`.cocoindex_code/settings.yml:20` excludes `.opencode/specs/**`, runtime spec mirrors, and `.opencode/changelog/**`, but does not exclude `.opencode/skills/**`. The indexer uses those settings directly through `PatternFilePathMatcher` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:280`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:284`, so the repo-local settings explain why scoped searches return sk-code files.

That is not the default behavior. `DEFAULT_EXCLUDED_PATTERNS` still contains `"**/.*"` at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:50`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py:59`, which excludes hidden directories such as `.opencode` for new/default projects unless a project settings file overrides it. The docs do not explain this important difference: `settings_reference.md` lists default excludes at `.opencode/skills/mcp-coco-index/references/settings_reference.md:111`-`.opencode/skills/mcp-coco-index/references/settings_reference.md:118` without showing the broad `"**/.*"` hidden-directory rule or the local `.opencode` allowlist pattern.

Concrete target: document a project settings recipe for OpenCode repositories that indexes `.opencode/skills/**` and excludes only heavy/generated subtrees such as `.opencode/specs/**`, changelog, databases, virtualenvs, and dist outputs. Better, add a checked template in `mcp-coco-index/assets/` for OpenCode skill ecosystems.

### F-005-002 - unscoped queries are polluted by mirror/spec material despite scoped sk-code rank being usable [P1]
Scoped search is strong enough for sk-code resource retrieval. The query `ccc search "OpenCode spec folder path invariants" --path '.opencode/skills/sk-code/**' --limit 5` returned `.opencode/skills/sk-code/references/opencode/shared/universal_patterns.md:418`-`.opencode/skills/sk-code/references/opencode/shared/universal_patterns.md:440` as result 1 and `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:80`-`.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:98` as result 2. The query `ccc search "skills agents commands authoring checklist OpenCode" --path '.opencode/skills/sk-code/**' --limit 8` returned the OpenCode surface detection scenario at `.opencode/skills/sk-code/manual_testing_playbook/01--surface-detection/002-opencode-detection.md:40`-`.opencode/skills/sk-code/manual_testing_playbook/01--surface-detection/002-opencode-detection.md:48` as result 1 and the skill structure guide at `.opencode/skills/sk-code/references/opencode/shared/code_organization.md:392`-`.opencode/skills/sk-code/references/opencode/shared/code_organization.md:419` as result 2.

The same spec-folder phrase without `--path` returned no `.opencode/skills/sk-code/` files in the top 10 during this iteration. It instead surfaced `.gemini/skills/system-spec-kit/...`, `barter/coder/.gemini/...`, and old `specs/.../research/...` records. That is surprising because `.gitignore` explicitly ignores `/barter` at `.gitignore:90`-`.gitignore:94`, but the unscoped result still included `barter/coder/.gemini/skills/system-spec-kit/...`. The gitignore wrapper normalizes anchored patterns at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:116`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:132` and checks directory paths with a trailing slash at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:171`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:186`; anchored directory ignores such as `/barter` appear not to suppress that subtree.

Concrete target: add a regression fixture for root-anchored directory ignores (`/barter`, `/external`, `/tmp`) and add a search recipe that defaults OpenCode standards queries to `--path '.opencode/skills/sk-code/**'` or MCP `paths: [".opencode/skills/sk-code/**"]`.

### F-005-003 - provider-change safety is documented but not enforced by the daemon restart path [P2]
The skill warns that changing embedding models requires `ccc reset && ccc index` because dimensions differ at `.opencode/skills/mcp-coco-index/SKILL.md:224`-`.opencode/skills/mcp-coco-index/SKILL.md:233`, and `settings_reference.md` repeats the warning at `.opencode/skills/mcp-coco-index/references/settings_reference.md:57`-`.opencode/skills/mcp-coco-index/references/settings_reference.md:65`. The runtime only restarts the daemon when `global_settings.yml` mtime changes: `_needs_restart()` compares the stored mtime and returns true at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:389`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:402`. `ensure_daemon()` then stops and starts the daemon at `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:405`-`.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:427`.

That restart is necessary but not sufficient for a provider/model change. It does not reset `.cocoindex_code/cocoindex.db` or `.cocoindex_code/target_sqlite.db`, and the search/index path can continue against an existing index until the user manually performs the reset. The docs also split provider coverage: `SKILL.md` says "supports two embedding models" at `.opencode/skills/mcp-coco-index/SKILL.md:224`, while `settings_reference.md` lists Voyage, sentence-transformers, OpenAI, Gemini, Cohere, Ollama, and Nomic at `.opencode/skills/mcp-coco-index/references/settings_reference.md:124`-`.opencode/skills/mcp-coco-index/references/settings_reference.md:132`.

Concrete target: store an embedding fingerprint in project index metadata and hard-block search/index with a clear reset instruction when provider/model/dimension changes. Short of that, adjust the auto-restart docs so agents do not interpret restart-on-settings-change as index compatibility handling.

### sk-code

### F-005-004 - CocoIndex is surfacing manual testing playbook paths as sk-code standards evidence [P2]
The scoped query for "skills agents commands authoring checklist OpenCode" surfaced `.opencode/skills/sk-code/manual_testing_playbook/01--surface-detection/002-opencode-detection.md:40`-`.opencode/skills/sk-code/manual_testing_playbook/01--surface-detection/002-opencode-detection.md:48` as the top result. That file is a scenario contract, not a canonical reference, and it expects exact loaded references/assets plus agent dispatch behavior. The playbook itself requires evidence such as advisor output, detected surface, loaded resources, and transcripts at `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:95`-`.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:104`.

This is useful evidence, but it can be over-read as implementation guidance. The canonical OpenCode structure guidance lives in `.opencode/skills/sk-code/references/opencode/shared/code_organization.md:392`-`.opencode/skills/sk-code/references/opencode/shared/code_organization.md:419`, while mutation safety guidance lives in `.opencode/skills/sk-code/references/opencode/shared/universal_patterns.md:418`-`.opencode/skills/sk-code/references/opencode/shared/universal_patterns.md:426` and `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:80`-`.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md:98`.

Concrete target: decide whether `manual_testing_playbook/**` should be indexed by default. If yes, add a query-routing note that playbook hits are validation scenarios and should be corroborated with `references/opencode/**` and `assets/opencode/**`. If not, add it to the OpenCode project exclusion recipe.

## Questions Answered
- Q4: Answered with caveats. `mcp-coco-index` is ingesting `.opencode/skills/sk-code/` in this repo and scoped queries surface useful OpenCode resources at top rank. The caveat is that ingestion depends on local `.cocoindex_code/settings.yml`; default settings still exclude hidden directories.
- Q5: Partially answered. Search surfaced OpenCode standards, checklists, and manual testing playbook paths. The next iteration should inspect staleness and coverage gaps directly rather than relying on query rank.
- Q7: Partially answered. sk-code already has OpenCode spec-folder mutation invariants, and CocoIndex can retrieve them when path-scoped.

## Questions Remaining
- Q4: Still open for MCP `search` parity on the same sk-code queries and for a regression test around root-anchored directory ignores.
- Q5: Still open for detailed sk-code OpenCode reference/assets staleness and coverage gaps.
- Q6: Still open for `STACK_FOLDERS` and resource_map drift.
- Q7: Still open for live `/spec_kit:complete` or spec-folder write routing behavior across sk-code and system-spec-kit.

## Next Focus (for iteration 6)
Audit `sk-code` OpenCode references for staleness and coverage gaps. Start with the on-disk inventory under `references/opencode/`, compare it to `SKILL.md` language sub-detection claims and the manual testing playbook, then check whether skills/agents/commands authoring guidance is canonical or scattered across scenario files.
