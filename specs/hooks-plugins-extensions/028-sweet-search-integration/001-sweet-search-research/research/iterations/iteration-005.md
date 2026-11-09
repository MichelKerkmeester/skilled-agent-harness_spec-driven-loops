# Iteration 5: Smallest useful adoption path

## Focus

Decide which integration delivers useful discoverability with the least setup and maintenance cost. Iteration 4 compared the candidate surfaces; this pass applies the repo's restraint rule and closes Q5. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-004.md:16] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-004.md:20]

## Actions Taken

- Read the config, state log, strategy, registry and iterations 1–4 before selecting Q5. The projection already contains duplicate completed iteration-3 rows; the dispatch's iteration-5 sentinel and supplied paths identify this run. Both output paths were absent before writing.
- Checked the shared code-skill routing and external install path, then inspected the upstream package, licence, contributor terms, index-health and uninstall code.
- Opened the upstream repository and release pages. A search snippet returned an older Node 18 requirement, while the opened README and the supplied package source say Node 22 or newer. The npm page returned 403 and the commit-history page did not expose a timestamp, so the current release cadence remains unknown.

## Findings

1. **Recommend one optional pointer in the shared sk-code guidance, linking to Sweet Search's current setup guide.** The sk-code advisor receives every code query, and external installs always link `.skilled`; a copy install receives upstream `.skilled` changes on re-pin. A root `AGENTS.md` pointer would not travel with a re-pin. Keep the pointer conditional on the user having installed Sweet Search, with the existing Grep/`rg` route as fallback. This gives external adopters discoverability without making Sweet Search a dependency or changing runtime configuration. The trade-off is that each adopter still chooses, installs and initializes Sweet Search. [SOURCE: .skilled/skills/sk-code/SKILL.md:72] [SOURCE: INSTALL-SKILLED.md:114] [SOURCE: INSTALL-SKILLED.md:132] [SOURCE: INSTALL-SKILLED.md:134] [SOURCE: INSTALL-SKILLED.md:280] [SOURCE: AGENTS.md:223] [SOURCE: AGENTS.md:228] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:45] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:55] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-004.md:16]

2. **A new MCP mode, Code Mode manual, doctor installer or system-spec-kit hook costs more than the demonstrated need.** Sweet Search already has an optional native MCP registration. A Code Mode manual would add a second registration surface; a doctor flow would duplicate upstream install, health and removal behavior; a new mode would add hub routing and packet upkeep; a retrieval hook would mix code search into document retrieval. No cited failure shows that the single shared-skill pointer is insufficient. Under the restraint rule, the more expensive options have no present requirement to climb to them. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-004.md:18] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-004.md:20] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-004.md:22] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:290] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:60] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:64] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:66]

3. **The opt-in path is simple but has real per-repo cost and a clear recovery path.** The upstream quickstart is global npm install, project init, then a first index; models use hundreds of MB on CPU, with larger optional GPU/CoreML downloads. The package snapshot requires Node `>=22.2.0`; first-class native support is macOS and Linux, Windows runs through WSL2, and other platforms use slower WASM/JavaScript fallbacks. The background updater handles working-tree edits, but it does not build the first index. If an index format is outdated, status reports that a full rebuild is needed. When Sweet Search is absent or fails, agents can continue using the existing literal search path. Per-repo uninstall removes its integration and index while keeping shared models; `uninstall --all` removes every initialized repo, models and the CLI. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:119] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:122] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:125] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:129] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:139] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:140] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:160] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:163] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:263] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/package.json:199] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:1302] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:205] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:207] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/scripts/uninstall.js:4] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/scripts/uninstall.js:7] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/scripts/uninstall.js:10] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-004.md:24]

4. **A passive pointer keeps licensing and upkeep outside Skilled's runtime.** The package declares Apache-2.0 and ships a generated third-party license notice. The CLA applies when contributing upstream; it lets project owners license contributions under other terms, while already released Apache-2.0 versions remain under that license. Skilled's pointer would neither bundle code nor submit contributions. The fetched GitHub Releases page has no release entries, and this pass could not verify the latest npm version or commit date, so upstream maintenance cadence is UNKNOWN. Link to the canonical README instead of mirroring flags or pinning a version. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/package.json:12] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/package.json:100] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/THIRD_PARTY_LICENSES:1] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/CONTRIBUTING.md:8] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/CONTRIBUTING.md:16] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/CONTRIBUTING.md:19] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/CLA.md:10] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/CLA.md:14] [SOURCE: https://github.com/mrsladoje/sweet-search] [SOURCE: https://github.com/mrsladoje/sweet-search/releases]

## Ruled Out

- New mcp-tooling mode: it adds routing and packet maintenance for an optional external search tool.
- Doctor-owned install/setup: it duplicates Sweet Search's own project initialization and uninstall lifecycle.
- Code Mode/UTCP mirror: it adds a second registration path beside Sweet Search's native `init --mcp`.
- system-spec-kit retrieval hook: code navigation belongs on the code-search surface, not document retrieval.

## Dead Ends

- The web search snippet was stale for the Node requirement; the current opened README and local package metadata agree on Node 22+.
- The npm package page returned 403 and the GitHub commits page did not expose a latest commit date. Upstream maintenance cadence stays UNKNOWN; the canonical README and release page were still available.

## Edge Cases

- Ambiguous input: none. The dispatch fixes Q5 and iteration 5.
- Contradictory evidence: an older search snippet says Node 18+, but the current opened official README says Node 22+ and the supplied package requires Node `>=22.2.0`. The current README and package metadata resolve the stale snippet. [SOURCE: https://github.com/mrsladoje/sweet-search] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/package.json:199]
- Missing dependencies: npm's package page was not available through the browser fetch (403); this did not block the in-scope recommendation.
- Partial success: no installation, index run or performance measurement was attempted; Q5 asked for integration scope and lifecycle, not a benchmark.

## SCOPE VIOLATIONS

The config enables progressive synthesis, but the dispatch write allowlist excludes `research/research.md`. No synthesis file was changed.

## Questions Answered

- Q5: What is the smallest integration that delivers most of the value, which options are over-engineering, and what are the opt-in, failure and uninstall paths (licence, maintenance, staleness, platform gaps)?

## Questions Remaining

- No unchecked strategy question remains after Q5. Q2 and Q3 are marked answered in the strategy; the dispatch carried them forward as context, and this iteration did not reopen them.
- Upstream maintenance cadence and the latest published npm version remain UNKNOWN. The exact registry version and latest commit timestamp would resolve those points if they become decision-critical.

## Assessment

- New information ratio: 0.73. One of four findings adds new licensing and release-page evidence; three partially extend prior integration and lifecycle findings. The 0.10 simplicity bonus reflects resolving Q5 with a smaller, clearer integration model.
- Questions addressed: Q5.
- Questions answered: Q5.

## Reflection

- What worked and why: comparing the shared-skill distribution path with Sweet Search's own init and uninstall lifecycle showed how to deliver discoverability without adding another installer or registration contract.
- What did not work and why: the npm page denied the fetch and the commit history did not expose a timestamp, so maintenance cadence could not be verified.
- What I would do differently: if maintenance cadence becomes a blocker, query the npm registry through another accessible source and inspect dated upstream commits before deciding whether to pin a version.

## Next Focus

Synthesize the research and recommend the optional shared sk-code pointer. Do not reopen the surface inventory unless evidence shows that adopters need Skilled to own installation or that Sweet Search's own setup path fails for a required runtime.

## Sources Consulted

- .skilled/skills/sk-code/SKILL.md
- .skilled/repo-rules/prevent-overengineering.md
- INSTALL-SKILLED.md
- AGENTS.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/package.json
- specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/CONTRIBUTING.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/CLA.md
- specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/THIRD_PARTY_LICENSES
- specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js
- specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/scripts/uninstall.js
- https://github.com/mrsladoje/sweet-search
- https://github.com/mrsladoje/sweet-search/releases

**Status: complete.** Q5 is answered with a narrow, repository-grounded recommendation; latest upstream maintenance cadence remains UNKNOWN.
