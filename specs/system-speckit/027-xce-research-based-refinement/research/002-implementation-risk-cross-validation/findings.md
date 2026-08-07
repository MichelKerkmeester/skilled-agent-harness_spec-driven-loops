# 027 XCE Research — Merged Findings (pt-01 + pt-02)

## From Research Part 01
---
title: "XCE Research — Adoption Matrix"
packet: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement"
iterations_source: "001–009"
totalFeatures: 21
verdictDistribution: {ADOPT:4, ADAPT:9, DEFER:2, SKIP:6}
created: "2026-05-08T18:00:00Z"
---

# XCE Adoption Matrix — Findings

## Verdict Legend

| Verdict | Meaning |
|---------|---------|
| **ADOPT** | Implement locally — no XCE equivalent needed, build on our infrastructure |
| **ADAPT** | Modify XCE concept to fit our architecture — partial adoption with local adaptation |
| **DEFER** | Valid concept but blocked by dependency, scope, or uncertainty — track for later |
| **SKIP** | Will NOT adopt — architecturally incompatible, closed-source, or out of scope |

---

## Adoption Matrix — All 21 Features Cross-Mapped

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-01/findings.md.

| # | XCE Feature | Source (external/) | Verdict | Rationale | Blast Radius (files + LOC) | Suggested Sub-Packet |
|---|-------------|--------------------|....................................|---------|-----------|----------------------|
| 11 | Steering pattern — "Always use X FIRST" | README:103-188, steering/* | **ADAPT** | XCE uses static unconditional "Always use xanther-xce" in 6 project-level rules files (CLAUDE.md:5, kiro.md:4, etc.). Our advisor is dynamic (confidence ≥ 0.8 threshold at render.ts:124-133). Cannot ADOPT unconditional static pattern. CAN strengthen directive: "use" → "MUST invoke X FIRST — <action hint>" at render.ts:149-152,155-158 (iteration-006 F-036). ~30 LOC. | 1 file edit (render.ts), ~30 LOC | `031-skill-advisor-first-action-mandate` |
| 12 | Steering — hard-coded target tool | README:113,130,144,158,171,180 | **SKIP** | All 6 XCE steering files hard-code `xce_get_context` as the mandatory first call for ALL tasks. Our advisor dynamically selects from 16 skills. Replacing dynamic routing with a hard-coded single tool would destroy the advisor's purpose. | N/A (architectural incompatibility) | None |
| 13 | Steering — "Prefer X over file reading" | README:119,136,150,163,173,185 | **ADAPT** | XCE steering commands "Prefer XCE context over grep, find, or reading files." Our proposed FIRST_ACTION_HINT (F-036) encodes per-skill replacement directives: "semantic search BEFORE grep/file-reading" (mcp-coco-index), "validate gates BEFORE reading/editing files" (system-spec-kit). Adapted from static text to dynamic per-skill framing. | Same as #11, already included in ~30 LOC | `031-skill-advisor-first-action-mandate` |
| 16 | MCP config shape for 5 IDEs | README:66-97, configs/*.json | **ADOPT** (already exists) | XCE provides URL-based SSE MCP configs for 5 IDEs. Our MCP configs already exist for the same IDEs via system-spec-kit. No adoption needed. | 0 LOC | None |
| 17 | SaaS pricing model | README:264-270 | **SKIP** | Tiered monthly pricing: Free (100 queries) → $20/mo (unlimited). Our system is open-source, unlimited queries. Pricing-coupled query model is architecturally incompatible — would require billing infrastructure alien to our local-first architecture. | N/A | None |
| 18 | xanther-cli deployment dependency | README:55-61 | **SKIP** | XCE requires `npx xanther-cli init --api-key` to index repos into XCE's remote graph store. Our code_graph indexing is local: `code_graph_scan` MCP tool runs tree-sitter + structural-indexer in-process with no external CLI. | N/A | None |
| 19 | Centralized SaaS endpoint (mcp.xanther.ai) | README:74,88-93 | **SKIP** | XCE is a hosted MCP server at mcp.xanther.ai/sse with Bearer API-key auth. All context resolution requires a remote network call. Our system is local Stdio MCP with in-process SQLite — zero network dependencies. SaaS endpoint creates latency, reliability risk, and external dependency we don't have. | N/A | None |
| 20 | mini-swe-agent scaffold | README:37 | **SKIP** | Named only — zero documentation about agent scaffold implementation, prompt templates, or tool-calling loop. Closed-source agent that drives SWE-bench runs. Not adoptable without source access. | N/A | None |
| 21 | Cascade hybrid multi-pass strategy | README:43 | **SKIP** | Mentioned only as a benchmark row ("Sonnet 4.0 + XCE (cascade hybrid): 76.8%"). Zero documentation about implementation. Could be agent-loop pattern, multi-query aggregation, or model-routing — unknown. Speculation would violate REQ-006 source-of-truth grounding. | N/A | None |

## Will NOT Adopt — Explicit SKIP List (9 items)

Per spec.md REQ-004, the following XCE patterns are explicitly SKIPPED with rationale:

### SKIP-1: Closed-source PRAT algorithm internals
PRAT is mentioned by name only (external/README.md:29). Algorithm implementation is closed-source SaaS code. Spec.md:58 states: "The PRAT algorithm is NOT visible." **We adopt the architectural concept of each stage where it maps to our existing infrastructure; we skip the closed-source implementation.**

### SKIP-2: SaaS hosting model (mcp.xanther.ai endpoint)
XCE is hosted at `https://mcp.xanther.ai/sse` (external/README.md:74). Our system runs as local Stdio MCP with in-process SQLite. **Network dependency for context resolution is architecturally incompatible with our local-first design.**

### SKIP-3: Centralized xanther.ai dependency
XCE requires signup (README:53), API key (README:53), xanther-cli init (README:60), and MCP endpoint connection (README:74). **Our system has zero external service dependencies — introducing one would degrade reliability.**

### SKIP-4: SaaS pricing model / tiered queries-per-month
XCE uses tiered pricing (README:264-270): Free (100 queries), Starter ($8/mo), Pro ($15/mo), Unlimited ($20/mo). **We are an open-source local tool with no query limits — adding pricing gates is conceptually alien.**

### SKIP-5: Static unconditional "ALWAYS" steering
All 6 XCE steering files use hard-coded unconditional "Always use" directives (steering/CLAUDE.md:5, kiro.md:4, opencode-prompt.txt:1). Our advisor fires dynamically (confidence ≥ 0.8 threshold at render.ts:124-133). **We CANNOT adopt unconditional steering without surgeon-level scorer changes (out of scope). ADAPT instead: strengthen directive intensity when brief does fire.**

### SKIP-6: Hard-coded single-tool first call (`xce_get_context`)
Every XCE steering variant hard-codes `xce_get_context` for ALL tasks (README:113,130,144,158,171,180). Our advisor dynamically selects from 16 skills. **Replacing dynamic routing with a hard-coded single tool would destroy the advisor's purpose.**

### SKIP-7: mini-swe-agent harness (closed-source agent scaffold)
Named only at external/README.md:37. Zero documentation about agent scaffold, prompt templates, or configuration. **Not adoptable without source access.**

### SKIP-8: SWE-bench Verified Docker evaluation infrastructure
Requires Docker execution environments, swe-bench-eval Python pipeline, 2,294 PRs across 12 Python repos, ~50GB+ Docker images. Spec.md:127 excludes SWE-bench evaluation. **Language mismatch (Python vs TypeScript) + infrastructure scale make adoption impractical.**

### SKIP-9: Cascade hybrid multi-pass strategy (closed-source variant)
Mentioned only as benchmark row (README:43). Zero implementation documentation — could be agent-loop pattern, multi-query aggregation, or model-routing. **Speculating would violate REQ-006 source-of-truth grounding. SKIP without prejudice — revisit if XCE documents it.**

---

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-01/findings.md.

## From Research Part 02
# 027 pt-02 Implementation-Risk Matrix

## Matrix

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/findings.md.

| Phase | IRQ1 | IRQ2 | IRQ3 | IRQ4 | IRQ5 | IRQ6 | IRQ7 | IRQ8 | IRQ9 | IRQ10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 004-skill-advisor-first-action-mandate | N/A | N/A | N/A | BLOCKING | N/A | N/A | N/A | N/A | N/A | CONFIRMED |

## BLOCKING Findings

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/findings.md.

### B-iter004-002

- Phase affected: 004-skill-advisor-first-action-mandate
- Description: `passes_threshold: true` can bypass numeric uncertainty checks in the renderer and producer. Stronger mandate wording would overstate high-uncertainty recommendations.
- Spec.md REQ impacted: Phase 004 REQ-001/REQ-002 (`../../004-skill-advisor-first-action-mandate/spec.md:117-125`).
- Recommended remediation: Re-check uncertainty in render or add producer invariant tests proving `passes_threshold` always encodes the dual threshold.


### B-iter004-004

- Phase affected: 004-skill-advisor-first-action-mandate
- Description: Static first-action hint coverage is inventory-fragile and the spec count is already ambiguous. Unknown safe labels must not render `undefined`.
- Spec.md REQ impacted: Phase 004 REQ-003 (`../../004-skill-advisor-first-action-mandate/spec.md:126-131`).
- Recommended remediation: Use a safe fallback hint and add an unknown-label fixture.


### B-iter004-006

- Phase affected: 004-skill-advisor-first-action-mandate
- Description: Legacy renderer and producer tests pin exact old strings. Implementation will fail unless fixtures are updated intentionally.
- Spec.md REQ impacted: Phase 004 REQ-006 (`../../004-skill-advisor-first-action-mandate/spec.md:142-143`).
- Recommended remediation: Rewrite exact string fixtures and add directive-shape assertions while preserving poisoning/cache/cap coverage.



## CONFIRMED Findings Subset

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/findings.md.

### C-iter004-001

- Phase affected: 004-skill-advisor-first-action-mandate
- Description: The confidence boundary is inclusive at exactly 0.80 in both renderer and producer paths.
- Spec.md REQ impacted: Phase 004 threshold semantics (`../../004-skill-advisor-first-action-mandate/spec.md:117-125`).
- Recommended remediation: Add regression tests for 0.79, 0.80, and 0.81.



## NO-CHANGE-NEEDED Findings Subset

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-02/findings.md.

### N-iter004-007

- Phase affected: 004-skill-advisor-first-action-mandate
- Description: Prompt-cache hit rate should not change from brief wording because the cache key does not include rendered text.
- Spec.md REQ impacted: Phase 004 non-functional cache behavior (`../../004-skill-advisor-first-action-mandate/spec.md:155-162`).
- Recommended remediation: Update only cached brief expectations that assert old rendered strings.



