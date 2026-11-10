# Iteration 9: Exact pointer location, wording and detection

## Focus

Q9: pin down the iteration-5 "one optional sk-code pointer" to a specific file and section, draft its exact wording, define how an agent detects an installed Sweet Search without adding a Skilled script, and state how the pointer relates to the AGENTS.md code-search decision tree. This iteration also weighs iteration 6's finding that no integration may be the strongest option. It builds on iterations 1–6 only; it does not reopen the surface inventory.

## Actions Taken

- Read the config, state projection, strategy, registry context and iterations 3, 5 and 6 before selecting Q9. The dispatch fixes iteration 9 and supplies both output paths; `iteration-009.md` and `iter-009.jsonl` were absent before writing.
- Read the sk-code hub contract, the shared workflow doctrine, the leaf manifest and the router map to identify which file is loaded when an agent is actually searching code, rather than which file merely receives routing.
- Read the upstream MCP tool registrations, the init config writer, the `.gitignore`/`.mcp.json` init side effects and the `status --json` contract to build a detection ladder that uses only existing surfaces.
- Compared the candidate homes against the hub's routing-only rule and against the AGENTS.md decision tree's precedence. No file was modified; all inspected paths were read-only.

## Findings

1. **The pointer belongs in `shared/references/workflow-implement.md` §2 "Research", step 5 — not in the sk-code hub `SKILL.md`.** The hub states it holds no per-mode logic and must never carry per-mode workflow logic, while the shared doctrine is the single source that each surface packet links and applies. Step 5 is the bounded read-only research sweep before editing, which is exactly the moment an agent searches unfamiliar code. The file is a declared leaf in all three surface packets, so one edit reaches the CI, frontend and Skilled surfaces through the existing symlinks. The hub `SKILL.md` is the file that receives every code query, but adding search behavior there would break its routing-only contract. [SOURCE: .skilled/skills/sk-code/SKILL.md:18] [SOURCE: .skilled/skills/sk-code/SKILL.md:72] [SOURCE: .skilled/skills/sk-code/SKILL.md:133] [SOURCE: .skilled/skills/sk-code/SKILL.md:157] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:50] [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:58] [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:13] [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:35] [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:146] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:121]

2. **The precise wording is one appended clause to the existing step 5, not a new section.** Proposed text: "5. For broad or risky work, run a bounded read-only research sweep before editing. When the runtime exposes a code-search tool and the project carries `.sweet-search/config.json`, use its ranked `search`, `trace` and `repo-map` for the concept-and-unfamiliar branch, keeping literal search for exact text and symbols and path match for known paths. If the tool is absent, uninitialized or reports a missing index, widen the pattern and read as before; it is never a prerequisite." This keeps the existing imperative, names the marker, names only the three tools that change behavior, restates the decision-tree precedence, and states the fallback and the non-dependency in the same step. It adds roughly 75 words to a doctrine file loaded for code work. [SOURCE: .skilled/skills/sk-code/shared/references/workflow-implement.md:58] [SOURCE: AGENTS.md:226] [SOURCE: AGENTS.md:227] [SOURCE: AGENTS.md:228]

3. **Detection needs no new Skilled script: a three-rung ladder over existing surfaces is enough.** First rung, zero cost: the runtime's MCP tool roster. A registered Sweet Search server exposes `search`, `trace`, `index`, `health`, `repo-map`, `read` and `read-semantic`; if those tools are present, the agent can call them directly. Second rung, one Glob/Read: `.sweet-search/config.json` proves this project was initialized; init writes that file, adds `.sweet-search/` to an existing `.gitignore` (so the marker is local-only and does not travel with the repo), and `init --mcp` optionally writes `mcpServers.sweet-search` into the project `.mcp.json`. Third rung, only when a call fails or looks stale: `sweet-search status --json`, an existing CLI command that exits `0` when search is ready and `1` when a setup step is missing, and whose `nextStep` names the fix. Absence at any rung means the existing widen-pattern-then-read route, never an install attempt. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js:208] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js:236] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js:282] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js:306] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js:352] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js:371] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/infrastructure/init-config.js:17] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/infrastructure/init-config.js:25] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/scripts/init.js:72] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/scripts/init.js:371] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/scripts/init.js:2285] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:291] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js:301] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/scripts/uninstall.js:616]

4. **The pointer must not edit AGENTS.md, and it slots into the decision tree's third branch only.** The tree is capability-framed ("Tool names differ per runtime. Use whatever the runtime exposes for the capability"), so a Sweet Search MCP tool is another runtime-exposed content-search capability rather than a new branch. Exact text and symbols stay on literal search; known paths stay on path match; ranked search, `trace` and `repo-map` belong to "concept, intent or unfamiliar code". An AGENTS.md pointer would also fail distribution: external installs always link `.skilled`, while the root `AGENTS.md` is not in that always-linked set, so an edit there would not reach external repos on a re-pin. Keeping the pointer in the shared doctrine therefore preserves both the tree's precedence and the external delivery path. [SOURCE: AGENTS.md:223] [SOURCE: AGENTS.md:225] [SOURCE: AGENTS.md:226] [SOURCE: AGENTS.md:227] [SOURCE: AGENTS.md:228] [SOURCE: INSTALL-SKILLED.md:132]

5. **A load caveat and a cost finding qualify the recommendation.** `workflow-implement.md` is a declared leaf in every surface packet, but it is not an entry in the router's `IMPLEMENTATION` resource map or in the shared-control list, so it is reached through the surface packet's workflow instruction rather than auto-loaded by the router. If Q10 wants a guaranteed load, the smallest follow-up is adding it to `RESOURCE_MAP` under `IMPLEMENTATION`, which is a router change with its own sync guards and should not be assumed in phase 2. The cost side also strengthens iteration 6: the clause is paid on every code task that loads the doctrine, whether or not Sweet Search is installed, so the pointer still needs a demonstrated discoverability gap to earn its place. [SOURCE: .skilled/skills/sk-code/ROUTER.md:267] [SOURCE: .skilled/skills/sk-code/ROUTER.md:432] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-006.md:15] [SOURCE: .skilled/repo-rules/prevent-overengineering.md:45]

## Ruled Out

- Placing the pointer in `sk-code/SKILL.md`: the hub is routing-only by its own contract, and search behavior is workflow logic, not routing.
- Editing `AGENTS.md`: the root file is not part of the always-linked `.skilled` set, so the pointer would not travel to external repos, and a vendor name would make a capability-framed tree tool-specific.
- Adding a detector script or doctor check: the MCP roster, the `.sweet-search/config.json` marker and `status --json` already answer the question with no new maintenance surface.
- Mirroring the pointer into `workflow-debug.md` as well: one doctrine file is enough to test the idea; a second edit doubles the cost before any evidence of need.

## Dead Ends

- None. The exact locations, tool names and status contract were all present in the checked-in sources.

## Edge Cases

- Ambiguous input: none. The dispatch fixes Q9 and iteration 9.
- Contradictory evidence: none. Iteration 5's citation of `SKILL.md:72` identified the distribution point (every code query reaches the hub) but not a lawful content home; the hub's own routing-only rule resolves that into the shared doctrine file. [SOURCE: .skilled/skills/sk-code/SKILL.md:18] [SOURCE: .skilled/skills/sk-code/SKILL.md:157]
- Missing dependencies: none. The vendored upstream source supplied the tool registrations, the init marker and the status contract.
- Partial success: no installation or live search was attempted. Q9 asked for placement, wording and detection, not a runtime trial.

## SCOPE VIOLATIONS

The config enables progressive synthesis, but this dispatch allowlists only the iteration narrative, the delta file and append-gateway writes. `research/research.md` was not created or changed.

## Questions Answered

- Q9: Where exactly would the pointer live and how would agents act on it: which sk-code file and section, the precise wording, how an agent detects that sweet-search is installed without a new script, and how it interacts with the AGENTS.md code-search decision tree?

## Questions Remaining

- Q7: Independent evidence: outside sweet-search's own eval data, what confirms or undercuts its claimed gains?
- Q8: External-repo UX walkthrough, including absent, half-installed, stale and unsupported-platform states.
- Q10: What phase 2 of this packet should contain: file list, acceptance checks and the measurement that would justify growing the integration later.

## Sources Consulted

- `.skilled/skills/sk-code/SKILL.md`
- `.skilled/skills/sk-code/ROUTER.md`
- `.skilled/skills/sk-code/leaf-manifest.json`
- `.skilled/skills/sk-code/shared/references/workflow-implement.md`
- `.skilled/skills/sk-code/shared/references/workflow-debug.md`
- `.skilled/skills/sk-code/sk-code-skilled/SKILL.md`
- `AGENTS.md`
- `INSTALL-SKILLED.md`
- `.skilled/repo-rules/prevent-overengineering.md`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/config-gen.js`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/infrastructure/init-config.js`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/search/setup-status.js`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/scripts/init.js`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/scripts/uninstall.js`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-003.md`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-005.md`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-006.md`

## Assessment

- New information ratio: 0.70. One of five findings is fully new (the detection ladder over the MCP roster, the init marker and `status --json`); four partially extend prior placement, tree and cost findings. The 0.10 simplicity bonus reflects resolving the location ambiguity into one file, one step and one clause.
- Questions addressed: Q9.
- Questions answered: Q9.

## Reflection

- What worked and why: reading the hub contract and the router map before choosing a file exposed that the file receiving every code query is not the file allowed to carry behavior. Separating "distribution point" from "lawful content home" produced a precise answer instead of restating iteration 5's hint.
- What did not work and why: the naive placement in `SKILL.md` would have violated the hub's routing-only rule; the earlier iteration had cited the hub's routing line without checking that constraint.
- What I would do differently: when a recommendation names a file, verify that file's own ownership contract before treating the citation as a placement decision.

## Next Focus

Q10: define phase 2's file list, acceptance checks and the measurement that would justify growing the integration, carrying forward the conditional verdict from iteration 6 and the load caveat from this iteration.
