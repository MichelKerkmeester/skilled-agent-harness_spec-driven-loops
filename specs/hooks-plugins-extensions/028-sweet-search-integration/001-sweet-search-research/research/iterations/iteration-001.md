# Iteration 1: sweet-search surface and requirements

## Focus

Answer Q1: What does sweet-search actually do, how does its CLI and MCP surface work, and what runtime, hardware, model-download, disk and indexing requirements can be verified from the supplied source snapshot?

## Actions Taken

1. Read the project README and package metadata for the advertised tools, platforms, install sequence and model footprint.
2. Checked the CLI help, MCP registrations and native resolver against those descriptions.
3. Read the indexer and incremental-indexing documentation to distinguish a full initial build from later updates.
4. Traced the graph-summary provider selection and prompt construction because they qualify the README's local-only claim.

## Findings

1. sweet-search is a local code-navigation package with six `ss-*` commands: hybrid search, exact grep, semantically ranked pattern search, semantic spans within one file, symbol tracing and exact file reads. Its `sweet-search` CLI also handles setup, indexing, daemon control, status, updates and uninstall. The optional stdio MCP server registers eight tools: `search`, `trace`, `index`, `health`, `repo-map`, `vocab-prewarm`, `read` and `read-semantic`. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/package.json:36] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:666] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js:208] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js:505]

2. The index combines AST-aware chunks and code-graph context with six retrieval structures: word search, sparse n-grams, binary HNSW, dense vectors, late-interaction vectors and a code graph. The default index path rebuilds the graph and updates vectors for changed files. A watcher then applies edits incrementally and publishes index changes atomically. The README says saved edits are usually searchable within seconds, with a documented budget of at most 50 files and 10 CPU seconds per update. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:1203] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:1281] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:1294] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/indexing/index-codebase-v21.js:4] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/indexing/index-codebase-v21.js:204]

3. Node 22.2.0 or later is the package's declared minimum. The prebuilt native packages cover macOS x64/arm64 and GNU Linux x64/arm64. Native Windows is unsupported, with WSL2 documented as the route. The README describes a slower WASM/JavaScript fallback on other supported platforms. Consumers do not need to compile Rust themselves for the listed native targets because npm installs the platform-specific optional packages. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/package.json:190] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/package.json:199] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/infrastructure/native-resolver.js:33] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:263] [INFERENCE: package.json declares platform-specific optional binaries and the README says npm installs precompiled binaries; the source-build scripts are not part of the consumer quickstart.]

4. A GPU is optional. The README identifies an ONNX INT8 CPU path. Setup downloads about 523 MB of models once per machine, needs network access to Hugging Face and needs a writable model cache. `--skip-models` postpones the download until indexing, while search still requires the models. The README estimates a few hundred MB for CPU models, about 1.2 GB extra for GPU and about 3.2 GB for an optional M3+ CoreML cascade. The init help instead estimates about 1.8 GB for that cascade. The source snapshot does not give a total index-size estimate or a full initial-index duration. Incremental-update figures do not establish either value. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/cli.js:135] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/cli.js:143] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/scripts/init.js:1722] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:160] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:162] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:163] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:1294] [INFERENCE: the inspected CLI and README publish incremental timings but no full initial-build duration or total index footprint; measuring the target repository on its supported hardware would resolve both.]

5. The README says code never leaves the machine, but that statement is not unconditional in the implementation. During graph-summary generation, the provider selector prefers Groq or Cerebras when their API keys are configured, and the summary prompt can include up to 2,000 characters of source code. Without those remote keys, the provider chain falls back to local Ollama, local Transformers.js or static summaries. Therefore a deployment with Groq or Cerebras credentials can send code snippets to the corresponding service during indexing. [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md:51] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/indexing/index-codebase-v21.js:185] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/infrastructure/llm-provider.js:472] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/infrastructure/llm-provider.js:528] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/infrastructure/llm-provider.js:686] [SOURCE: specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/graph/hcgs-generator.js:147]

## Questions Answered

- Q1: What does sweet-search actually do (tools, index, runtime, MCP/CLI surface), and what are its hard requirements (Node >=22, macOS/Linux only, native build, GPU, model downloads, disk, index time)?

## Questions Remaining

- Q2: How credible are its usefulness claims (5-33% cheaper runs, up to 34% less model time)? What do its eval code and data show, and where would the gain be largest or zero for Skilled-style work (large markdown/skill trees, spec folders, TypeScript runtime)?
- Q3: How does it overlap with or complement what Skilled already has: the committed trigger index, the ripgrep retrieval recipes, the code-search decision tree in AGENTS.md, Code Mode/UTCP MCP registration, and the doctor install commands?
- Q4: Which integration surfaces are candidates (nothing; a docs pointer; a Code Mode/UTCP manual entry; a new mcp-tooling mode; a doctor install/setup step; an sk-code or system-spec-kit retrieval hook), and what does each cost the user in this repo and in external repos that install Skilled?
- Q5: What is the smallest integration that delivers most of the value, which options are over-engineering, and what are the opt-in, failure and uninstall paths (licence, maintenance, staleness, platform gaps)?

## Ruled Out

No research route was exhausted or retried in this iteration.

## Dead Ends

No approach was definitively eliminated. The initial full-index duration and total on-disk index size remain unquantified in the inspected sources.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the README's blanket local-only statement conflicts with the implementation's optional remote summary providers. The code shows this is conditional on configured Groq or Cerebras keys, but the README does not state that condition. The README and init help also disagree on the size of the optional CoreML cascade, about 3.2 GB versus about 1.8 GB. The exact current profile size remains unresolved.
- Missing dependencies: none.
- Partial success: none for the requested iteration artifacts.

## SCOPE VIOLATIONS

- `scope_violation`: `progressiveSynthesis` is enabled in the config, but the dispatch allowlist excludes `research/research.md`. No write was attempted there. The workflow-owned synthesis remains for its reducer or orchestrator.

## Sources Consulted

- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/README.md`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/package.json`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/cli.js`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/mcp/server-main.js`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/infrastructure/native-resolver.js`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/indexing/index-codebase-v21.js`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/scripts/init.js`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/infrastructure/llm-provider.js`
- `specs/hooks-plugins-extensions/028-sweet-search-integration/context/sweet-search-main/core/graph/hcgs-generator.js`

## Assessment

- New information ratio: 1.0.
- Questions addressed: Q1.
- Questions answered: Q1, with the full-index duration and total index-size estimates explicitly unknown.

## Reflection

- What worked and why: comparing package metadata and executable code with the README exposed both the platform boundary and the optional remote summary path.
- What did not work and why: the inspected project files do not quantify a full initial index run or its total disk use. Those values depend on repository size and host hardware, and need a measured run on the target repo.
- What I would do differently: use the next iteration to inspect evaluation code and datasets directly instead of relying on the headline percentages.

## Recommended Next Focus

Q2: How credible are its usefulness claims (5-33% cheaper runs, up to 34% less model time)? What do its eval code and data show, and where would the gain be largest or zero for Skilled-style work (large markdown/skill trees, spec folders, TypeScript runtime)?
