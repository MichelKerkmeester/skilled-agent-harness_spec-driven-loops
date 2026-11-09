# Iteration 4: Integration surface costs

## Focus

Compare the candidate integration surfaces and the setup each would require in this checkout and in projects that link or copy Skilled. The dispatch names Q4 and supplies iteration 4's output paths. The strategy still marks Q3 as Next Focus even though Q3 is checked and Q4 is unchecked. I follow the explicit dispatch focus and record the state mismatch below. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-strategy.md:50] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-strategy.md:51] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-strategy.md:142]

## Actions Taken

- Read the config, state projection, strategy and findings registry before selecting the focus.
- Inspected the actual UTCP, Code Mode, mcp-tooling, sk-code, system-spec-kit retrieval, doctor and external Skilled-install surfaces.
- Read Sweet Search's package metadata and its install, index freshness and uninstall instructions.
- Confirmed that iteration-004.md and iter-004.jsonl did not exist before writing.

## Findings

1. **Nothing is the zero-maintenance option; a passive pointer is the smallest discoverability change.** The existing code-search decision tree already sends exact symbols to literal search and unfamiliar code to vocabulary search, path mapping and a confirming read. A pointer there could make Sweet Search opt-in without changing search behavior. The external install guide links .skilled and runtime folders by default, but links .utcp_config.json only when requested. Copy installs require a later re-pin to receive upstream guidance. Users who follow a pointer still install Sweet Search and initialize each project themselves. [SOURCE: AGENTS.md:223] [SOURCE: AGENTS.md:226] [SOURCE: AGENTS.md:228] [SOURCE: INSTALL-SKILLED.md:16] [SOURCE: INSTALL-SKILLED.md:112] [SOURCE: INSTALL-SKILLED.md:132] [SOURCE: INSTALL-SKILLED.md:134]

2. **A Code Mode manual is possible, but Sweet Search's documented MCP setup does not create one.** Code Mode discovers manuals from .utcp_config.json and treats native MCP registration as a separate system. Sweet Search's init --mcp path documents a native .mcp.json entry instead. A Code Mode route therefore needs a separate UTCP manual and the host runtime registration. In an external project, the user must also include or create .utcp_config.json. [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:117] [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:124] [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:132] [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:175] [SOURCE: .utcp_config.json:14] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:186] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:191]

3. **A new mcp-tooling mode has a larger routing cost than this local search service appears to earn.** The hub currently owns eight modes through a two-stage router, mode registry and packet-local resource map. Adding a member requires aligned registry and router entries, a packet and regenerated leaf metadata, then routing replay. The shared Code Mode substrate is already outside the hub. A system-spec-kit hook is also a poor fit because its retrieval lanes target spec and skill documents, and exact identifiers already go to ripgrep. A passive code-search note is smaller than adding a new sk-code mode or routing a code index through document retrieval. [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:14] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:15] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:18] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:50] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:107] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:123] [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:128] [SOURCE: .skilled/skills/sk-code/SKILL.md:14] [SOURCE: .skilled/skills/sk-code/SKILL.md:39] [SOURCE: .skilled/skills/sk-code/SKILL.md:161] [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:44] [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:47] [SOURCE: .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:49]

4. **A doctor install step would extend a lifecycle that both tools already own separately.** /doctor:install is a read-only guide that prints commands for the operator. /doctor:mcp install is scoped to Code Mode's build, UTCP file and runtime configs. Sweet Search already provides init and per-repository or global uninstall commands. A doctor integration would need its own platform checks, project mutations, health reporting and cleanup behavior, while keeping those rules aligned with Sweet Search's own installer. [SOURCE: .skilled/commands/doctor/_routes.yaml:603] [SOURCE: .skilled/commands/doctor/_routes.yaml:609] [SOURCE: .skilled/commands/doctor/_routes.yaml:695] [SOURCE: .skilled/commands/doctor/_routes.yaml:700] [SOURCE: .skilled/commands/doctor/assets/doctor-mcp-install.yaml:12] [SOURCE: .skilled/commands/doctor/assets/doctor-mcp-install.yaml:44] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:125] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:139] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:140]

5. **The user cost applies whichever surface exposes Sweet Search.** Its quickstart requires a global npm install, a project init and an initial index. The package requires Node 22.2 or later. First-class native builds cover macOS and GNU/Linux, while native Windows uses WSL2; the README describes a slower WASM or JavaScript fallback on other supported platforms. CPU models occupy a few hundred MB, with larger optional GPU and CoreML downloads. The daemon usually makes saved edits searchable within seconds, but an index from an older Sweet Search version must be rebuilt. The project uninstall removes that repository's integration and index while keeping the shared model cache; --all also removes every initialized repository, the cache and the CLI. Each project is indexed separately. The inspected sources give incremental update limits but no full first-index duration or total index size. A measured run on this repository would resolve those unknowns. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:117] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:122] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:125] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:129] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:139] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:140] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:160] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:161] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:162] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:163] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:263] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:1287] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:1294] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:1302] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:1363] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/package.json:190] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/package.json:199] [INFERENCE: the inspected source documents incremental update work but not full initial-index duration or total index storage; a measured run of this repository would resolve both.]

6. **Iteration control state is inconsistent, but the dispatch pins this run to iteration 4.** The strategy marks Q3 answered and Q4 remaining while its generated Next Focus still names Q3. The state projection also has two completed rows numbered 3, followed by iteration_start 4. I use the dispatch-provided Q4 focus and iteration-004 path. I did not edit reducer-owned strategy or state files directly. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-strategy.md:50] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-strategy.md:51] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-strategy.md:142] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-state.jsonl:6] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-state.jsonl:7] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/deep-research-state.jsonl:8]

## Ruled Out

No source or route inspection failed. No integration was installed or prototyped because this iteration only compares costs.

## Dead Ends

None added. The surface review does not establish measured first-index time or total index storage.

## Edge Cases

- Ambiguous input: The dispatch names Q4 and iteration 4. The strategy Next Focus still names Q3, and the state projection has duplicate iteration 3 completion rows. The explicit dispatch and iteration_start 4 resolve the target path for this run.
- Contradictory evidence: None in the integration contracts reviewed.
- Missing dependencies: None for the read-only review.
- Partial success: None. Q4 is answered; Q5 remains open.

## Sources Consulted

- AGENTS.md
- INSTALL-SKILLED.md
- .utcp_config.json
- .skilled/skills/mcp-code-mode/SKILL.md
- .skilled/skills/mcp-tooling/SKILL.md and mode-registry.json
- .skilled/skills/sk-code/SKILL.md
- .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md
- .skilled/commands/doctor/_routes.yaml and assets/doctor-mcp-install.yaml
- Sweet Search README.md and package.json
- deep-research-strategy.md and deep-research-state.jsonl

## Assessment

- New information ratio: 0.75, with three new findings and three partially new findings.
- Questions addressed: Q4.
- Questions answered: Q4: Which integration surfaces are candidates (nothing; a docs pointer; a Code Mode/UTCP manual entry; a new mcp-tooling mode; a doctor install/setup step; an sk-code or system-spec-kit retrieval hook), and what does each cost the user in this repo and in external repos that install Skilled?
- Questions remaining: Q5, plus the dispatch's carried-forward Q2 and Q3 that this iteration did not re-investigate.

## Reflection

- What worked and why: Reading the current external install path alongside the actual MCP and doctor contracts exposed which setup changes reach an external project automatically and which need separate configuration.
- What did not work and why: The state projection does not provide a unique next iteration from row count because it has two completion rows numbered 3. The dispatcher-provided iteration_start and output path resolve this run, but the reducer should reconcile the duplicate later.
- What I would do differently: The next pass should decide whether a passive pointer is enough, then check licence, ongoing maintenance, opt-in and failure behavior before recommending a surface.

## Questions Answered

- Q4: Which integration surfaces are candidates (nothing; a docs pointer; a Code Mode/UTCP manual entry; a new mcp-tooling mode; a doctor install/setup step; an sk-code or system-spec-kit retrieval hook), and what does each cost the user in this repo and in external repos that install Skilled?

## Questions Remaining

- Q5: What is the smallest integration that delivers most of the value, which options are over-engineering, and what are the opt-in, failure and uninstall paths (licence, maintenance, staleness, platform gaps)?
- Q2 and Q3 are carried forward by the dispatch summary but remain checked in the current strategy. This iteration did not revisit them.

## Next Focus

Q5: Decide whether a passive guidance pointer provides enough value, compare the failure and maintenance cost of an optional UTCP manual with a routing hook, and complete the licence, platform, staleness and uninstall review. Keep the install and first-index costs tied to the external repository setup path.

## Sources and Reflection Details

- Prior research in iteration 1 established the Node/platform and index lifecycle constraints; this pass reconnected those constraints to each Skilled installation surface. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-001.md:20] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/001-sweet-search-research/research/iterations/iteration-001.md:22]

