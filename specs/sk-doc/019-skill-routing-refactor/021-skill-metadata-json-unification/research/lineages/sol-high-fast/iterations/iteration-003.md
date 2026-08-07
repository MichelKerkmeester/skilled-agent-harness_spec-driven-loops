# Iteration 3: Leaf-Resource and Command Metadata Schemas and Consumers

## Focus
Complete the eight-file schema/consumer question by tracing `leaf-manifest.json`, `leaf-manifest.config.json`, `leaf-aliases.json`, and `command-metadata.json`: ownership, exact enforced shape, executable consumers, doctor/benchmark behavior, and tests. The explicit iteration prompt takes precedence over the reducer's broader exceptional-case next focus.

## Actions Taken
1. Verified the iteration narrative and delta targets did not already exist.
2. Searched executable JavaScript, TypeScript, Python, and shell sources for direct reads of the four filenames without repeating the blocked repository-wide prose/spec search.
3. Read the manifest generator, leaf contract, doctor guard chain, fleet freshness gate, benchmark replay/loaders, and representative tests.
4. Read every direct `command-metadata.json` reader and the complete singleton data file.
5. Used bounded Git history to identify the command metadata introduction commit after no generator was found.

## Findings
1. `leaf-manifest.json` is generated, not authored source. Contract version 1 defines a top-level `{resourceContractVersion, modes[]}` object; every mode is `{workflowMode, packet, leaves[]}`, leaves are deduplicated/sorted packet-relative paths under `references/`, `assets/`, `feature-catalog/`, or `manual-testing-playbook/`, modes sort by `workflowMode`, and canonical bytes recursively sort keys with two-space indentation and one trailing newline. The generator derives hub manifests from `mode-registry.json` plus optional aliases and standalone manifests from `leaf-manifest.config.json`, while `--write` is the sole writer and `--check` byte-compares regeneration. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:51-69] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:316-364] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:173-239]
2. Its executable consumer set has distinct enforcement roles: doctor validates source shape/version, regenerability, canonical-byte freshness, collision/target resolution, and bidirectional registry reachability; the fleet CI gate discovers every committed manifest and byte-checks all of them; benchmark router replay emits typed resource pairs and fail-closed unresolved strings, while the playbook loader derives typed gold from registered manifest leaves; compiled routing and topology/scenario validators also ingest the manifest. Tests cover all four doctor guards, alias dual-read, absent-manifest no-regression, selected-mode caps, and compiled-routing parity. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1071-1233] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-105] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:204-261] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:607-658] [SOURCE: .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:75] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs:213-215] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/validate-compiled-routing-scenarios.cjs:199-204] [SOURCE: .opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs:178-272] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-doc-leaf-routing-contract.vitest.ts:84-159]
3. `leaf-manifest.config.json` is a durable authored input for registry-less, single-mode skills. Its enforced shape requires non-empty string `workflowMode`; optional non-empty `packet` defaults to `.`; non-empty `leafRoots` defaults to `references`/`assets` and is restricted to the four legal roots; `excludeIndexFiles` defaults true; and `resourceContractVersion` defaults to contract version 1. The only direct production reader is `generate-leaf-manifest.cjs`; doctor and fleet CI consume it indirectly through regeneration. All four root instances use this schema, and the root-name test supplies a minimal accepted fixture. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127] [SOURCE: .opencode/skills/mcp-code-mode/leaf-manifest.config.json:1-8] [SOURCE: .opencode/skills/system-code-graph/leaf-manifest.config.json:1-8] [SOURCE: .opencode/skills/system-skill-advisor/leaf-manifest.config.json:1-8] [SOURCE: .opencode/skills/system-spec-kit/leaf-manifest.config.json:1-8] [SOURCE: .opencode/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs:124-126]
4. `leaf-aliases.json` is not redundant with registry/config data: its accepted root is either an array or `{aliases:[...]}`, and each record is the authored triple `{workflowMode, leafResourceId, diskPath}` with a contained hub-relative `diskPath`. For hubs, the generator injects alias leaf identities into the generated manifest; doctor uses aliases to prove missing manifest leaves resolve on disk; benchmark replay is the runtime-like consumer that maps shared/legacy resource strings to typed pairs. Standalone generation deliberately does not merge aliases, but replay still reads them, so standalone same-path rows act as explicit legacy-string compatibility mappings rather than corpus declarations. Registry/config can name modes, packets, and roots but cannot express that three-way mapping. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-68] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:130-168] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299] [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1180-1207] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:240-261] [SOURCE: .opencode/skills/sk-doc/leaf-aliases.json:1-31] [SOURCE: .opencode/skills/mcp-code-mode/leaf-aliases.json:1-36]
5. `command-metadata.json` remains an authored, `sk-design`-specific contract rather than a fleet schema. Its validator requires an array containing exactly the two `/interface:*` records, all 27 named top-level fields, registry-matching `ownerMode`/command bindings, typed nested argument/choreography/policy/output structures, unique commands/aliases, and graph consistency. Git history introduces the file in commit `2aa5fcff4a` as an `sk-design` metadata SSOT, with no generator. The prompt's “four consumers” is accurate only when the validator and its unit test are grouped as one surface: current source contains five direct reader files across four consumer surfaces. (a) the production design surface validator and its own unit test derive the enclosing `sk-design` root; (b) the interface contract test derives that same root; (c) the benchmark test hardcodes `SKDESIGN`; and (d) the command-binding test loops a fixed four-hub allowlist (`sk-code`, `sk-design`, `sk-doc`, `system-deep-loop`). None discovers all N skill roots dynamically. [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:8-40] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-179] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:306-415] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:20-59] [SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:5-49] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:343-361] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-65] [INFERENCE: bounded `git log --follow --diff-filter=A` and `git show` identify commit `2aa5fcff4a` as the file's introduction]

## Ruled Out
- Treating `leaf-manifest.json` as authored truth: all enforcement regenerates it from authored source and checks canonical bytes. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:74-91]
- Treating `leaf-aliases.json` as equivalent to registry aliases or standalone root config: neither alternative carries the `{workflowMode, leafResourceId, diskPath}` legacy-resolution mapping. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299]
- Treating `command-metadata.json` as a generic advisor fleet input: the only multi-hub reader is a test with a fixed four-hub list, while production validation is local to `sk-design`. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-65] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-179]

## Dead Ends
- No standalone JSON Schema or create-command generator owns `command-metadata.json`; its executable schema is embedded in the `sk-design` surface validator, and bounded Git history confirms a hand-authored introduction. [INFERENCE: exact executable filename search plus introduction commit `2aa5fcff4a`]
- Counting only four direct reader files is stale: there are five; four is defensible only as the number of consumer surfaces after grouping a validator with its unit test. [INFERENCE: exact executable search results reconciled with the five reader files cited in Finding 5]

## Edge Cases
- Ambiguous input: “all four consumers” could mean files or consumer surfaces; evidence shows five reader files and four logical surfaces, so both cardinalities are preserved.
- Contradictory evidence: the prompt's direct-reader cardinality conflicts with the current tree; the source-derived five-file count is authoritative, with the four-surface interpretation retained.
- Missing dependencies: code graph remained empty; exact executable searches, direct reads, and bounded Git history were used.
- Partial success: none; the contradiction was resolved by separating reader files from consumer surfaces.

## Sources Consulted
- `.opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:46-239`
- `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:51-440`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs:1063-1233`
- `.opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:1-105`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs:180-289`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:607-658`
- `.opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs:140-272`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-doc-leaf-routing-contract.vitest.ts:35-159`
- `.opencode/skills/sk-design/command-metadata.json:1-574`
- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:8-179,306-519`
- `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs:20-73`
- `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:5-49`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts:343-361`
- `.opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-65`
- Git introduction commit `2aa5fcff4a`

## Assessment
- New information ratio: 1.00
- Novelty calculation: 4 findings are fully new and the authored command-metadata ownership finding is partially new: `(4 + 0.5 × 1) / 5 = 0.90`; resolving the four-versus-five consumer contradiction and closing one key question adds the 0.10 simplicity bonus, capped at `1.00`.
- Questions addressed: schemas, ownership, executable consumers, doctor/benchmark behavior, and tests for the four remaining file types.
- Questions answered: the complete eight-file schema/consumer key question, combining this iteration with iteration 2.

## Reflection
- What worked and why: executable-extension searches avoided the blocked prose/spec noise, while owner-focused reads exposed direct versus indirect consumers and the file-versus-surface cardinality distinction.
- What did not work and why: the prompt's expected four-consumer count did not match direct reader files because it implicitly grouped the validator and its test; treating the number literally would omit evidence.
- What I would do differently: define consumer cardinality as direct reader files, logical surfaces, and production-versus-test roles before stating an expected count.

## Questions Answered
- What schema and complete consumer call-site set governs each of the eight root metadata file types, including advisor, benchmark, doctor, and tests? Answered by iteration 2 for the first four files and Findings 1-5 here for the remaining four.
- Are aliases durable authored input or redundant? They are an authored compatibility/input contract; their three-way mapping is not representable in registry/config data.
- Do command metadata consumers discover N roots? No: local and benchmark readers bind to `sk-design`; the sole multi-hub reader is a test over a fixed four-hub list.

## Questions Remaining
1. What consumer-derived skill class taxonomy maps all 12 roots and classifies every presence difference?
2. Which exceptional graph-only, alias, command, and sparse cases are required, optional, or defective?
3. Where should the canonical contract and fleet-wide presence-plus-freshness gate live?

## Recommended Next Focus
Classify the five graph-only skills, standalone alias-bearing skills, the `sk-design` command singleton, and sparse `sk-git` against observed behavior impact; derive the smallest skill-class taxonomy that explains all 12 roots without turning class-conditional files into universal requirements.

## Provenance
- Iteration/run: 3/3
- Mode: research
- Route proof: `Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true`
- Executor: `cli-opencode`
- Model: `openai/gpt-5.6-sol-fast`
- Reasoning effort: `high`
