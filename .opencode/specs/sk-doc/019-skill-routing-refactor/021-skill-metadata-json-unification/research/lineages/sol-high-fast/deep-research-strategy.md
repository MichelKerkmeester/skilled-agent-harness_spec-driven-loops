# Deep Research Strategy: Root-Level Skill Metadata JSON Contract

## 2. TOPIC
Establish the consumer-derived contract for root-level metadata JSON files across all 12 `.opencode/skills/` roots, without inspecting nested packet/mode metadata as fleet members and without conflating skill metadata with spec-folder continuity metadata.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What is the complete 12-skill by eight-file root-level census, and who produces each file type?
- [x] What schema and complete consumer call-site set governs each file type, including advisor, benchmark, doctor, and tests?
- [ ] What consumer-derived skill class taxonomy maps all 12 skills and makes each presence difference either required, optional by class, or defective?
- [ ] How should the five graph-only skills, `leaf-aliases.json`, `command-metadata.json`, and sparse `sk-git` be classified after behavior-impact checks?
- [ ] Where should the canonical contract live in `sk-doc/create-skill`, what can be generated/backfilled, and what fleet-wide presence-plus-freshness gate should enforce it?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- Do not implement or backfill metadata.
- Do not treat nested mode/packet JSON as fleet root metadata.
- Do not conflate `.opencode/skills/**/{description,graph-metadata}.json` with `.opencode/specs/**` continuity schemas.
- Do not modify researched source files.

## 5. STOP CONDITIONS
- Stop at 10 iterations.
- Stop earlier only after at least three evidence iterations, all five key questions are evidence-backed, the census covers all 12 skills and eight file types, disputed cases are resolved, and citations cover producers, consumers, schemas, and tests.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What is the complete 12-skill by eight-file root-level census, and who produces each file type?
- What schema and complete consumer call-site set governs each file type, including advisor, benchmark, doctor, and tests?

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- exact direct-child globbing produced a scope-safe census without admitting nested packet metadata; focused source reads then separated scaffold outputs, generated artifacts, and authored inputs. (iteration 1)
- owner-scoped searches followed by implementation reads separated real file reads from thousands of continuity/docs mentions and exposed the direct-versus-indirect advisor boundary. (iteration 2)
- executable-extension searches avoided the blocked prose/spec noise, while owner-focused reads exposed direct versus indirect consumers and the file-versus-surface cardinality distinction. (iteration 3)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- broad `command-metadata.json` search output was too large because repository-wide references include large records; narrowed producer searches were clean but yielded only negative evidence. (iteration 1)
- broad exact-filename searches overflowed because identical names occur throughout spec packets and archived evidence. (iteration 2)
- the prompt's expected four-consumer count did not match direct reader files because it implicitly grouped the validator and its test; treating the number literally would omit evidence. (iteration 3)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A broad `command-metadata.json` search produced oversized output; narrowing to the create-command and command trees found no producer. Future work should search its consumers and Git history rather than repeat the broad search. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A broad `command-metadata.json` search produced oversized output; narrowing to the create-command and command trees found no producer. Future work should search its consumers and Git history rather than repeat the broad search.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A broad `command-metadata.json` search produced oversized output; narrowing to the create-command and command trees found no producer. Future work should search its consumers and Git history rather than repeat the broad search.

### Counting `package.json`, `package-lock.json`, or `tsconfig.json`: they are root JSON files but not among the eight named metadata types. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Counting `package.json`, `package-lock.json`, or `tsconfig.json`: they are root JSON files but not among the eight named metadata types.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting `package.json`, `package-lock.json`, or `tsconfig.json`: they are root JSON files but not among the eight named metadata types.

### Counting nested mode/packet JSON: excluded by the focus contract and direct-child glob. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Counting nested mode/packet JSON: excluded by the focus contract and direct-child glob.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting nested mode/packet JSON: excluded by the focus contract and direct-child glob.

### Counting only four direct reader files is stale: there are five; four is defensible only as the number of consumer surfaces after grouping a validator with its unit test. [INFERENCE: exact executable search results reconciled with the five reader files cited in Finding 5] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Counting only four direct reader files is stale: there are five; four is defensible only as the number of consumer surfaces after grouping a validator with its unit test. [INFERENCE: exact executable search results reconciled with the five reader files cited in Finding 5]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting only four direct reader files is stale: there are five; four is defensible only as the number of consumer surfaces after grouping a validator with its unit test. [INFERENCE: exact executable search results reconciled with the five reader files cited in Finding 5]

### No standalone JSON Schema or create-command generator owns `command-metadata.json`; its executable schema is embedded in the `sk-design` surface validator, and bounded Git history confirms a hand-authored introduction. [INFERENCE: exact executable filename search plus introduction commit `2aa5fcff4a`] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No standalone JSON Schema or create-command generator owns `command-metadata.json`; its executable schema is embedded in the `sk-design` surface validator, and bounded Git history confirms a hand-authored introduction. [INFERENCE: exact executable filename search plus introduction commit `2aa5fcff4a`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No standalone JSON Schema or create-command generator owns `command-metadata.json`; its executable schema is embedded in the `sk-design` surface validator, and bounded Git history confirms a hand-authored introduction. [INFERENCE: exact executable filename search plus introduction commit `2aa5fcff4a`]

### Repository-wide filename searches exceeded output limits because spec continuity metadata and historical documentation dominate results. Narrowing to executable ownership surfaces recovered precise call sites; repeating the broad search is not useful. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Repository-wide filename searches exceeded output limits because spec continuity metadata and historical documentation dominate results. Narrowing to executable ownership surfaces recovered precise call sites; repeating the broad search is not useful.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Repository-wide filename searches exceeded output limits because spec continuity metadata and historical documentation dominate results. Narrowing to executable ownership surfaces recovered precise call sites; repeating the broad search is not useful.

### The similarly named root-name consumer-matrix test concerns catalog/playbook directory names, not this eight-file metadata census. [SOURCE: .opencode/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs:80-138] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The similarly named root-name consumer-matrix test concerns catalog/playbook directory names, not this eight-file metadata census. [SOURCE: .opencode/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs:80-138]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The similarly named root-name consumer-matrix test concerns catalog/playbook directory names, not this eight-file metadata census. [SOURCE: .opencode/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs:80-138]

### Treating `command-metadata.json` as a generic advisor fleet input: the only multi-hub reader is a test with a fixed four-hub list, while production validation is local to `sk-design`. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-65] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-179] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating `command-metadata.json` as a generic advisor fleet input: the only multi-hub reader is a test with a fixed four-hub list, while production validation is local to `sk-design`. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-65] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-179]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `command-metadata.json` as a generic advisor fleet input: the only multi-hub reader is a test with a fixed four-hub list, while production validation is local to `sk-design`. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-65] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-179]

### Treating `leaf-aliases.json` as equivalent to registry aliases or standalone root config: neither alternative carries the `{workflowMode, leafResourceId, diskPath}` legacy-resolution mapping. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating `leaf-aliases.json` as equivalent to registry aliases or standalone root config: neither alternative carries the `{workflowMode, leafResourceId, diskPath}` legacy-resolution mapping. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `leaf-aliases.json` as equivalent to registry aliases or standalone root config: neither alternative carries the `{workflowMode, leafResourceId, diskPath}` legacy-resolution mapping. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299]

### Treating `leaf-manifest.config.json` or `leaf-aliases.json` as generated because the manifest generator reads them: the implementation identifies them as authored inputs and only writes `leaf-manifest.json`. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-68] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:215-218] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `leaf-manifest.config.json` or `leaf-aliases.json` as generated because the manifest generator reads them: the implementation identifies them as authored inputs and only writes `leaf-manifest.json`. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-68] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:215-218]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `leaf-manifest.config.json` or `leaf-aliases.json` as generated because the manifest generator reads them: the implementation identifies them as authored inputs and only writes `leaf-manifest.json`. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-68] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:215-218]

### Treating `leaf-manifest.json` as authored truth: all enforcement regenerates it from authored source and checks canonical bytes. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:74-91] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating `leaf-manifest.json` as authored truth: all enforcement regenerates it from authored source and checks canonical bytes. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:74-91]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `leaf-manifest.json` as authored truth: all enforcement regenerates it from authored source and checks canonical bytes. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:74-91]

### Treating every filename mention in specs, docs, fixtures, or generated records as a production call site; only executable reads and runtime/compiler inputs were classified as consumers. [INFERENCE: comparison of exact filename search results with the executable reads cited above] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating every filename mention in specs, docs, fixtures, or generated records as a production call site; only executable reads and runtime/compiler inputs were classified as consumers. [INFERENCE: comparison of exact filename search results with the executable reads cited above]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every filename mention in specs, docs, fixtures, or generated records as a production call site; only executable reads and runtime/compiler inputs were classified as consumers. [INFERENCE: comparison of exact filename search results with the executable reads cited above]

### Treating the advisor as a runtime consumer of every hub JSON file; it directly ingests graph metadata, reads selected mode registries for projection/delegation, and has no located runtime read of skill description or generic hub-router files. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:952-970] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:160-180] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the advisor as a runtime consumer of every hub JSON file; it directly ingests graph metadata, reads selected mode registries for projection/delegation, and has no located runtime read of skill description or generic hub-router files. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:952-970] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:160-180]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the advisor as a runtime consumer of every hub JSON file; it directly ingests graph metadata, reads selected mode registries for projection/delegation, and has no located runtime read of skill description or generic hub-router files. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:952-970] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:160-180]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- A broad `command-metadata.json` search produced oversized output; narrowing to the create-command and command trees found no producer. Future work should search its consumers and Git history rather than repeat the broad search. (iteration 1)
- Counting `package.json`, `package-lock.json`, or `tsconfig.json`: they are root JSON files but not among the eight named metadata types. (iteration 1)
- Counting nested mode/packet JSON: excluded by the focus contract and direct-child glob. (iteration 1)
- The similarly named root-name consumer-matrix test concerns catalog/playbook directory names, not this eight-file metadata census. [SOURCE: .opencode/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs:80-138] (iteration 1)
- Treating `leaf-manifest.config.json` or `leaf-aliases.json` as generated because the manifest generator reads them: the implementation identifies them as authored inputs and only writes `leaf-manifest.json`. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-68] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:215-218] (iteration 1)
- Repository-wide filename searches exceeded output limits because spec continuity metadata and historical documentation dominate results. Narrowing to executable ownership surfaces recovered precise call sites; repeating the broad search is not useful. (iteration 2)
- Treating every filename mention in specs, docs, fixtures, or generated records as a production call site; only executable reads and runtime/compiler inputs were classified as consumers. [INFERENCE: comparison of exact filename search results with the executable reads cited above] (iteration 2)
- Treating the advisor as a runtime consumer of every hub JSON file; it directly ingests graph metadata, reads selected mode registries for projection/delegation, and has no located runtime read of skill description or generic hub-router files. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:952-970] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:160-180] (iteration 2)
- Counting only four direct reader files is stale: there are five; four is defensible only as the number of consumer surfaces after grouping a validator with its unit test. [INFERENCE: exact executable search results reconciled with the five reader files cited in Finding 5] (iteration 3)
- No standalone JSON Schema or create-command generator owns `command-metadata.json`; its executable schema is embedded in the `sk-design` surface validator, and bounded Git history confirms a hand-authored introduction. [INFERENCE: exact executable filename search plus introduction commit `2aa5fcff4a`] (iteration 3)
- Treating `command-metadata.json` as a generic advisor fleet input: the only multi-hub reader is a test with a fixed four-hub list, while production validation is local to `sk-design`. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-65] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-179] (iteration 3)
- Treating `leaf-aliases.json` as equivalent to registry aliases or standalone root config: neither alternative carries the `{workflowMode, leafResourceId, diskPath}` legacy-resolution mapping. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299] (iteration 3)
- Treating `leaf-manifest.json` as authored truth: all enforcement regenerates it from authored source and checks canonical bytes. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:74-91] (iteration 3)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- What complete consumer and schema set governs each type? (iteration 1)
- What behavior impact determines whether graph-only, alias, command, and sparse cases are required, optional, or defective? (iteration 1)
- What class taxonomy explains every presence difference? (iteration 1)
- Which consumer or history evidence conclusively owns `command-metadata.json`? (iteration 1)
- Where should the canonical contract and fleet enforcement live? (iteration 1)
- What schemas and complete consumer sets govern `leaf-manifest.json`, `leaf-manifest.config.json`, `leaf-aliases.json`, and `command-metadata.json`? (iteration 2)
- Where should the canonical contract and fleet-wide freshness gate live? (iteration 2)
- What consumer-derived class taxonomy explains all 12 roots? (iteration 2)
- Which exceptional presence cases are required, optional, or defective? (iteration 2)
- What consumer-derived skill class taxonomy maps all 12 roots and classifies every presence difference? (iteration 3)
- Where should the canonical contract and fleet-wide presence-plus-freshness gate live? (iteration 3)
- Which exceptional graph-only, alias, command, and sparse cases are required, optional, or defective? (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Which exceptional graph-only, alias, command, and sparse cases are required, optional, or defective?

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- The requested fleet contains 12 skill roots and eight named root-level JSON types.
- `resource-map.md` was absent at initialization; coverage will be derived directly from repository evidence.
- The code graph is unavailable/empty for this run, so exact Glob, Grep, and Read evidence is authoritative.

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Executor: `cli-opencode`, model `openai/gpt-5.6-sol-fast`, variant `high`
- Allowed writes: this detached lineage directory only
- Progressive synthesis: false; workflow synthesis owns `research.md`
