# Task Tracking: Skill Graphs Integration

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->

<!-- ANCHOR:task-tracking -->

## Phase 1: Tooling & Setup
- [x] TASK-101: Write `check-links.sh` bash script to regex match `\[\[(.*?)\]\]` recursively across all skill folders.
  - Inputs: root path (`.opencode/skill`), markdown corpus, wikilink regex contract.
  - Outputs: executable scanner with deterministic per-file diagnostics and non-zero exit on unresolved links.
  - Completion Criteria: accepts root argument, recursively scans `*.md`, resolves links, and reports aggregate pass/fail status.
  - Verification: `bash .opencode/skill/system-spec-kit/scripts/check-links.sh .opencode/skill` returns summary counts and clear unresolved-link lines when failures exist.
  - Dependency Chain: none; foundation task for TASK-501 and CHK-011/CHK-020.
- [x] TASK-102: Ensure script handles `.md` extension resolution and relative pathing automatically.
  - Inputs: mixed link forms (`[[node]]`, `[[path/to/node]]`, relative `../` hops) and existing skill directory layout.
  - Outputs: resolver that normalizes path traversal and extension behavior without false negatives.
  - Completion Criteria: canonicalization resolves equivalent links to the same filesystem target and distinguishes true missing targets.
  - Verification: run link checks against known mixed-link samples and confirm unresolved output only appears for intentionally missing files.
  - Dependency Chain: depends on TASK-101 parser recursion; enables reliable global integrity gates.
- [x] TASK-103: Define `Skill Graph-Lite Query Script` (SGQS) syntax subset (`MATCH`, `REL`, `WHERE`, `RETURN`) for skill graph traversal.
  - Inputs: query use-cases from traversal tasks, existing memory data model constraints, contract boundaries of memory tools.
  - Outputs: SGQS grammar doc including tokens, clause ordering, operator semantics, and parser error taxonomy.
  - Completion Criteria: each valid example has a canonical AST target and each invalid example maps to explicit parser error behavior.
  - Verification: parser fixture design review shows one-to-one mapping between grammar clauses and AST nodes intended for TASK-401.
  - Dependency Chain: prerequisite for TASK-401/TASK-402 and CHK-015/CHK-022.
- [x] TASK-104: Define graph metadata mapping model so SGQS runs on top of existing Spec Kit Memory entities.
  - Inputs: node frontmatter schema, wikilink edges, existing memory entity/document abstractions.
  - Outputs: mapping contract from markdown artifacts to in-process node-edge records compatible with current memory access paths.
  - Completion Criteria: pilot walkthrough proves mapping can run without schema expansion or API contract changes.
  - Verification: trace one concrete markdown input set through mapping and confirm output fields satisfy SGQS fixture requirements.
  - Dependency Chain: depends on TASK-103; blocks TASK-204 and TASK-401.
- [x] TASK-105: Create and maintain 9-skill node coverage matrix with explicit completion status per skill.
  - Inputs: full skill inventory (9 total), completion definition (`SKILL.md` + `index.md` + `nodes/`), task state from TASK-310..TASK-318.
  - Outputs: auditable matrix with owner, blockers, and completion status aligned to task/checklist IDs.
  - Completion Criteria: matrix values stay synchronized with `tasks.md` and checklist verification totals.
  - Verification: documentation cross-read confirms matrix references and state parity; mismatches trigger immediate correction.
  - Dependency Chain: depends on completion criteria definition; supports CHK-017 and all rollout reporting.

## Phase 2: Pilot Migration (`system-spec-kit`)
- [x] TASK-201: Create supplemental MOCs/nodes for `system-spec-kit`.
  - Inputs: monolithic `system-spec-kit/SKILL.md`, target domains (routing, memory, validation, workflows).
  - Outputs: `index.md` and domain nodes with stable semantic boundaries.
  - Completion Criteria: every core domain is reachable from index navigation with no orphan node files.
  - Verification: manual traversal from entrypoint confirms complete first-hop/second-hop domain discovery.
  - Dependency Chain: leverages Phase 1 link tooling for integrity checks; prerequisite for TASK-202/TASK-203.
- [x] TASK-202: Write YAML frontmatter for each newly created file.
  - Inputs: pilot node set from TASK-201 and standardized frontmatter fields (`title`, `intent`, `owner`, `updated`).
  - Outputs: machine-readable metadata blocks across all pilot nodes.
  - Completion Criteria: each pilot node begins with valid YAML frontmatter and required keys are present.
  - Verification: `rg -n "^---$|^title:|^intent:|^owner:|^updated:" .opencode/skill/system-spec-kit --glob "**/nodes/*.md"` plus spot-check of delimiter balance.
  - Dependency Chain: depends on TASK-201 decomposition; enables metadata mapping in TASK-204.
- [x] TASK-203: Add Skill Graph Status header to `SKILL.md` pointing to supplemental `index.md`.
  - Inputs: pilot `index.md`, legacy invocation expectations, compatibility constraints.
  - Outputs: concise routing entrypoint preserving existing discovery semantics.
  - Completion Criteria: legacy readers reach equivalent conceptual content via `index.md` with no broken navigation.
  - Verification: open `SKILL.md`, follow links into index/nodes, and validate no dead-end first-hop paths.
  - Dependency Chain: depends on TASK-201/TASK-202; pilot completion gate before broad rollout.
- [x] TASK-204: Integrate pilot skill graph metadata into `system-spec-kit` memory indexing flow.
  - Inputs: TASK-104 mapping contract, pilot node metadata, existing indexing pipeline behavior.
  - Outputs: indexing extension that ingests graph metadata without changing current retrieval interfaces.
  - Completion Criteria: node-edge metadata is queryable in pilot runs and baseline memory behavior remains unchanged.
  - Verification: run pilot indexing scenario and compare pre/post outputs for `memory_context`, `memory_search`, `memory_save` baseline flows.
  - Dependency Chain: depends on TASK-104; feeds SGQS execution work in Phase 4.

## Phase 3: Broad Migration (All Other Skills)
- [x] TASK-301: Convert `workflows-documentation` to a Skill Graph.
  - Inputs: monolithic documentation workflow guidance, pilot migration pattern from Phase 2.
  - Outputs: graph index + nodes + stable wikilink traversal paths for documentation flow.
  - Completion Criteria: prompts that require docs workflow routing complete without monolithic-only fallback.
  - Verification: manual traversal across authoring and validation pathways confirms path completeness.
  - Dependency Chain: depends on pilot-proven decomposition and link-check workflow.
- [x] TASK-307: Add `workflows-documentation/references/skill_graph_standards.md`.
  - Inputs: frontmatter schema, node naming norms, link authoring expectations from pilot outcomes.
  - Outputs: single standards reference consumed by graph authors.
  - Completion Criteria: migrated nodes can be validated against one canonical standards document.
  - Verification: inspect references from graph docs to standards file and confirm no conflicting local conventions remain.
  - Dependency Chain: derives from TASK-201/TASK-202 conventions; required by TASK-308/TASK-309.
- [x] TASK-308: Add `workflows-documentation/assets/opencode/skill_graph_node_template.md`.
  - Inputs: standards rules from TASK-307 and expected node anatomy from completed migrations.
  - Outputs: reusable template enabling consistent node creation.
  - Completion Criteria: template-generated node includes required sections/frontmatter and passes structural review.
  - Verification: author a sample node from the template and validate frontmatter + section presence without ad-hoc fixes.
  - Dependency Chain: depends on TASK-307; supports remaining six skill migrations.
- [x] TASK-309: Update `workflows-documentation/SKILL.md` with Skill Graph system guidance and links.
  - Inputs: standards and template asset paths, compatibility entrypoint requirements.
  - Outputs: updated `SKILL.md` routing guidance for graph-first authoring.
  - Completion Criteria: standards and template assets are discoverable in one hop from entrypoint content.
  - Verification: open `workflows-documentation/SKILL.md` and follow links to both artifacts directly.
  - Dependency Chain: depends on TASK-307/TASK-308; closes CHK-014 evidence path.

### Per-Skill Node Completion (9 Total Skills)
- [x] TASK-310: Complete node graph coverage for `system-spec-kit`.
  - Inputs: pilot graph artifacts, frontmatter schema, traversal criteria.
  - Outputs: complete `system-spec-kit` graph with routing and metadata integrity.
  - Completion Criteria: matrix row remains complete only when index, node coverage, and links all pass.
  - Verification: run global link check plus targeted traversal from entrypoint through core domains.
  - Dependency Chain: depends on Phase 2; baseline reference for other skills.
- [x] TASK-311: Complete node graph coverage for `workflows-documentation`.
  - Inputs: migration artifacts from TASK-301 and standards/template assets.
  - Outputs: complete graph conforming to published authoring standards.
  - Completion Criteria: matrix row complete with no missing required node categories.
  - Verification: standards conformance review + link integrity pass + one-hop artifact discoverability.
  - Dependency Chain: depends on TASK-301/TASK-307/TASK-308/TASK-309.
- [x] TASK-312: Complete node graph coverage for `mcp-code-mode`.
  - Inputs: `mcp-code-mode` operational domains (tool discovery, chaining, integration), node template conventions.
  - Outputs: complete graph with explicit index paths for each operational domain.
  - Completion Criteria: users can traverse from entrypoint to each domain without hidden monolithic dependencies.
  - Verification: run manual traversal scenarios and confirm matrix complete state is evidence-backed.
  - Dependency Chain: depends on template conventions and global link-check readiness.
- [x] TASK-313: Complete node graph coverage for `workflows-git`.
  - Inputs: existing `workflows-git/SKILL.md`, node template, standards doc, matrix status row.
  - Outputs: `index.md`, node set (`setup`, `commit/PR`, `safeguards`, `finish`), compatibility entrypoint routing.
  - Completion Criteria: all required domains represented and linked from index; no orphan nodes.
  - Verification: `bash .opencode/skill/system-spec-kit/scripts/check-links.sh .opencode/skill` + manual traversal over four domain paths.
  - Dependency Chain: depends on TASK-105 governance and Phase 1 tooling; unblocks CHK-012 progress.
- [x] TASK-314: Complete node graph coverage for `workflows-chrome-devtools`.
  - Inputs: CLI-vs-MCP routing logic, fallback pathways, template conventions.
  - Outputs: graph nodes for route selection, debug flow, and fallback decision paths.
  - Completion Criteria: route-selection prompts resolve through node links to the correct operational branch.
  - Verification: execute representative traversal prompts and confirm deterministic hop sequence to recommended path.
  - Dependency Chain: depends on standards/template assets and pilot migration patterns.
- [x] TASK-315: Complete node graph coverage for `mcp-figma`.
  - Inputs: mcp-figma capability areas (file retrieval, export, style extraction, collaboration).
  - Outputs: capability-specific node graph with explicit index partitions.
  - Completion Criteria: each capability area has at least one canonical node path from entrypoint.
  - Verification: link-check pass and walkthrough across all capability partitions.
  - Dependency Chain: depends on frontmatter schema consistency and link-check tooling.
- [x] TASK-316: Complete node graph coverage for `workflows-code--full-stack`.
  - Inputs: full-stack workflow phases, stack-detection logic, standards/template constraints.
  - Outputs: phased node graph with explicit transitions (`implementation` -> `testing` -> `verification`) and detection guidance.
  - Completion Criteria: traversal covers all phases and stack-detection branch paths with no dead ends.
  - Verification: manual hop test from entrypoint to each phase node and back to index contexts.
  - Dependency Chain: depends on TASK-105 matrix tracking and template conformance.
- [x] TASK-317: Complete node graph coverage for `workflows-code--opencode`.
  - Inputs: language standards sections and quality checklist branches from current skill content.
  - Outputs: node graph that maps language branches to canonical index routes.
  - Completion Criteria: every language branch is reachable and mapped without ambiguous routing.
  - Verification: global link-check plus language-branch walkthrough evidence.
  - Dependency Chain: depends on TASK-307 standards and SGQS grammar assumptions from TASK-103.
- [x] TASK-318: Complete node graph coverage for `workflows-code--web-dev`.
  - Inputs: web-dev implementation/debug/verification orchestration flow and integration touchpoints.
  - Outputs: specialization node graph with explicit multi-hop routing among core subdomains.
  - Completion Criteria: all required web-dev subdomains are linked and navigable from index.
  - Verification: run multi-hop traversal script/prompt and confirm deterministic path order.
  - Dependency Chain: depends on shared node template usage and broad migration sequencing.

## Phase 4: SGQS Graph-Lite Layer
- [x] TASK-401: Implement SGQS parser/executor (Neo4j-style query subset) inside `system-spec-kit` memory architecture.
  - Inputs: TASK-103 grammar specification and TASK-104 mapping model.
  - Outputs: parser + AST + executor operating in-process on mapped metadata records.
  - Completion Criteria: supported clauses execute deterministically and malformed queries return explicit, testable errors.
  - Verification: golden fixtures for traversal/filter/error paths; stable output ordering for repeat runs.
  - Dependency Chain: depends on TASK-103/TASK-104; blocks TASK-402/TASK-503 and CHK-015/CHK-022.
- [x] TASK-402: Add SGQS compatibility tests proving no breaking changes for `memory_context`, `memory_search`, and `memory_save`.
  - Inputs: baseline memory tool fixtures and SGQS-enabled scenarios.
  - Outputs: unified regression suite that runs baseline + SGQS cases in one verification pass.
  - Completion Criteria: baseline outputs remain contract-compatible and SGQS scenarios pass.
  - Verification: pre/post comparison report for `memory_context`, `memory_search`, `memory_save` outputs.
  - Dependency Chain: depends on TASK-401 and existing test harness coverage.
- [x] TASK-403: Add enforcement check confirming no external Neo4j dependency is introduced.
  - Inputs: dependency manifests, lockfiles, source tree scan rules, CI/local command hooks.
  - Outputs: automated guard that fails on `neo4j` packages, imports, client wiring, or protocol references.
  - Completion Criteria: check runs in local/CI and produces auditable pass/fail artifacts.
  - Verification: `rg -n "neo4j" package*.json pnpm-lock.yaml yarn.lock .opencode/skill` returns no runtime dependency additions.
  - Dependency Chain: depends on manifest availability and CI hook integration.

## Phase 5: Verification
- [x] TASK-501: Run `check-links.sh` globally and fix any broken paths.
  - Inputs: full migrated graph set across all nine skills and final link-check tool output.
  - Outputs: final link-integrity report + remediation list (if fixes required before final pass).
  - Completion Criteria: global run returns success with zero unresolved links.
  - Verification: `bash .opencode/skill/system-spec-kit/scripts/check-links.sh .opencode/skill` and archive output to verification artifacts.
  - Dependency Chain: depends on completion of all migration tasks that can alter links.
- [x] TASK-502: Run a dry-run prompt with an agent to verify progressive disclosure pathing across multiple skills.
  - Inputs: prompt pack covering at least three cross-skill navigation scenarios.
  - Outputs: traversal transcripts that capture entrypoint -> index -> node hop sequences.
  - Completion Criteria: each scenario resolves the intended target guidance without dead-end or wrong-branch hops.
  - Verification: transcript review confirms hop order and expected terminal nodes for every scenario.
  - Dependency Chain: depends on TASK-501 plus broad migration completion.
- [x] TASK-503: Execute SGQS query scenarios against real skill graph metadata and verify expected traversal output.
  - Inputs: SGQS scenario pack (simple traversal, filtered traversal, missing-node/error behavior) and mapped metadata.
  - Outputs: expected-vs-actual report with deterministic result snapshots.
  - Completion Criteria: scenario outputs match expected data model and compatibility assertions.
  - Verification: execute SGQS fixtures and attach comparison artifacts to checklist evidence references.
  - Dependency Chain: depends on TASK-401/TASK-402/TASK-403 completion.

<!-- /ANCHOR:task-tracking -->
