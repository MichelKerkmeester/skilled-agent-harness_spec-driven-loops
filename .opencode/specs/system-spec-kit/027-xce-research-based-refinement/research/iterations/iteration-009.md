# Iteration 009 — RQ9: Non-Adoption Boundary

**Started**: 2026-05-08T17:00:00Z
**Focus**: RQ9 — Explicit SKIP list (Will NOT adopt). Compile non-adoption boundary with rationale and file:line citations from external/README.md and our spec.md. Fulfill spec.md REQ-004: "Non-adoption list documented" with closed-source PRAT internals, SaaS pricing, centralized hosting, and any other items surfaced during prior iterations. This is the anti-bias guard: `verdict_diversity_floor: min_skip:1`.

---

## Actions

1. Read `external/README.md:1-283` — extract all SaaS-exclusive patterns: pricing table (lines 262-270), hosted endpoint URL (line 74), signup/API-key requirement (lines 51-62), PRAT algorithm name-only reference (line 29), Xanther CLI dependency (lines 55-61), architecture diagram showing server-client split (lines 229-238).
2. Read `spec.md:48,58-59,125-126` — scope constraints: PRAT closed-source, external/ zero source, no live SaaS calls, no reverse-engineering from non-public sources.
3. Read iteration-005.md (RQ5) — F-026 PRAT name decomposition, F-027 stage→local map, F-029 verdict "Full PRAT pipeline: DEFER — closed-source."
4. Read iteration-006.md (RQ6) — F-033 static unconditional "ALWAYS" steering from 6 files, F-034 gap "use" vs "Always use", F-037 verdict ADAPT not ADOPT due to architectural difference.
5. Read iteration-007.md (RQ7) — F-039 SWE-bench + mini-swe-agent closed-source methodology, F-042 verdict DEFER eval harness.
6. Read iteration-008.md (RQ8) — F-043 ~20% token reduction claim with no methodology, F-047 verdict ADAPT.
7. Read `external/README.md:31-48` — benchmark results: cascade hybrid (line 43) as closed-source variant.
8. Read `external/README.md:253-261` — supported-agents table: all require xanther.ai-hosted MCP server connection.
9. Read `external/README.md:229-244` — "How It Works" section: index → connect → query → context pipeline, all via SaaS endpoint.
10. Read `spec.md:57-61` — critical constraints: PRAT NOT visible, external/ zero source, no code modifications until research complete.

---

## Findings

### Will NOT Adopt — Explicit SKIP List

#### SKIP-1: Closed-source PRAT algorithm internals

**Rationale**: The PRAT (Persistent Recursive Abstract Tree) algorithm is mentioned by name only in external/README.md:29 ("Powered by the **PRAT** algorithm"). The algorithm implementation is closed-source SaaS code hosted on xanther.ai infrastructure. Our spec.md:58 explicitly states: "The PRAT algorithm is NOT visible. Research must reverse-engineer architectural intent from public docs + benchmark numbers + tool API shape, not from source." RQ5 (F-029) classified the full PRAT pipeline as DEFER, with individual stages ADAPT/ADOPT on OUR infrastructure.

**Cite**: external/README.md:29, spec.md:48,58, RQ5 F-029 (iteration-005.md:83-89)

---

#### SKIP-2: SaaS hosting model (xanther.ai MCP endpoint)

**Rationale**: XCE is a hosted SaaS MCP server at `https://mcp.xanther.ai/sse` (external/README.md:74,88,91), requiring a Bearer API-key `Authorization` header (README:76-78,91-93). Our system (`system-spec-kit/mcp_server/`) runs as a local Stdio MCP server with zero network dependencies for its core tool surface — everything is in-process SQLite via `code-graph-db.ts`. The SaaS hosting model is architecturally incompatible: we cannot adopt a model where context resolution requires a remote network call to an external service.

**Cite**: external/README.md:74,76-78,88-93, spec.md:125 ("Calling the live xanther.ai SaaS endpoint... Out of Scope")

---

#### SKIP-3: Centralized xanther.ai dependency / external service requirement

**Rationale**: XCE deployment requires (a) signing up at xanther.ai/signup (README:53), (b) generating an API key from app.xanther.ai (README:53), (c) running `npx xanther-cli init --api-key` (README:60) to index repos into XCE's remote knowledge graph, and (d) connecting every IDE to `mcp.xanther.ai` (README:74). This creates a hard external runtime dependency on xanther.ai servers. Our system has zero external service dependencies: the `code_graph` subsystem uses a local SQLite database (`code-graph-db.ts`), the `skill_advisor` runs in-process scoring against a local skill graph, and all tools are self-contained in the `spec-kit-memory` MCP server. Introducing a centralized external service dependency would degrade reliability, introduce latency, and violate our local-first architecture.

**Cite**: external/README.md:51-62,74-81, external/README.md:229-244 ("How It Works" — index → connect → query → context, all via SaaS), spec.md:125

---

#### SKIP-4: SaaS pricing model / tiered queries-per-month

**Rationale**: XCE uses a tiered monthly pricing model: Free (100 queries, 3 repos), Starter ($8/mo, 2K queries), Pro ($15/mo, 10K queries), Unlimited ($20/mo) (external/README.md:264-270). Our system is an open-source local tool with no query limits, no pricing tiers, and no usage tracking beyond optional analytics. Adopting XCE's pricing-coupled query model would require instrumenting query-per-repo counters, enforcing rate limits, and a billing infrastructure — all of which are conceptually alien to our local open-source architecture. The pricing model is inseparable from XCE's SaaS business (it gates `xanther-cli` API-key issuance and endpoint access), and we have no equivalent gating mechanism nor any desire to add one.

**Cite**: external/README.md:264-270, spec.md:48 ("hosted SaaS MCP server")

---

#### SKIP-5: Static unconditional "ALWAYS" steering (cannot adopt as-is)

**Rationale**: All 6 XCE steering files use hard-coded unconditional directives: "Always use xanther-xce MCP tools before reading files" (e.g., external/steering/CLAUDE.md:5, kiro.md:4, opencode-prompt.txt:1). XCE's steering fires on EVERY prompt — there is no confidence threshold, no dynamic skill selection, no "don't invoke" case. Our `skill_advisor` is dynamic: the brief only renders when confidence ≥ 0.8 (render.ts:124-133), and it selects from 16 skills dynamically. We CANNOT adopt unconditional ALWAYS steering without surgeon-level changes to the scorer (out of scope per spec.md:129). RQ6 classified this as ADAPT — we strengthen directive intensity to "MUST invoke X FIRST" but preserve the confidence gate.

**Cite**: external/steering/CLAUDE.md:5, kiro.md:4, opencode-prompt.txt:1, external/README.md:188, skill_advisor/lib/render.ts:124-133, RQ6 F-033/F-037 (iteration-006.md)

---

#### SKIP-6: Hard-coded single-tool first call (`xce_get_context`)

**Rationale**: Every XCE steering variant hard-codes `xce_get_context` as the mandatory first call for ALL tasks (e.g., README:113 "Call xce_get_context as your FIRST step when starting any task," README:130 "Call xce_get_context first on any task," and 4 other variant lines). There is no skill-routing, no intent classification, no adaptive selection — ONE tool for all tasks. Our `skill_advisor` dynamically routes to the highest-confidence skill from 16 candidates (scorer/ dir selects top-K per intent classification). Replacing dynamic routing with a hard-coded single tool would destroy the advisor's purpose and misroute tasks like "run deep research" (→ should invoke `deep-research`, not `code_graph_context`). This is an architectural difference we cannot bridge — our advisor selects adaptively, XCE's does not.

**Cite**: external/README.md:113,130,144,158,171,180 (6 IDE variants), RQ6 F-035 intent→first-action table (iteration-006.md:93-111), RQ6 F-037 (iteration-006.md:185-205)

---

#### SKIP-7: mini-swe-agent harness (closed-source agent scaffold)

**Rationale**: XCE's SWE-bench Verified evaluation uses "mini-swe-agent" (external/README.md:37) — a specific closed-source agent scaffold with proprietary prompt templates, tool-calling loop, and evaluation integration. Our RQ7 (iteration-007 F-039) identified this as non-replicable: we have no access to mini-swe-agent's source, prompt templates, or configuration. The agent scaffold itself is not documented in external/ beyond the one-line mention. Our proposed local harness (RQ7 F-041) uses a custom labeled-task set + subprocess OpenCode dispatch instead — no dependency on mini-swe-agent.

**Cite**: external/README.md:37, RQ7 F-039 (iteration-007.md:26-37), spec.md:125-126

---

#### SKIP-8: SWE-bench Verified Docker evaluation infrastructure

**Rationale**: XCE's benchmark runs on SWE-bench Verified (swebench.com), which requires: Docker execution environments per task, the `swe-bench-eval` Python evaluation pipeline, datasets with 2,294 PRs across 12 Python repos, and ~50GB+ of Docker images per full run (RQ7 F-039). Our spec.md:127 explicitly excludes SWE-bench evaluation: "SWE-bench evaluation against our stack... not in scope for replacement." Our proposed local eval (RQ7 F-041: 12-20 refactoring tasks on our own TS repo, no Docker) is a lighter proxy — the SWE-bench infrastructure itself is not adoptable due to scale, language mismatch (Python vs TypeScript), and scope exclusion.

**Cite**: external/README.md:37-45, spec.md:127, RQ7 F-039 (iteration-007.md:40-52), RQ7 F-042 (iteration-007.md:176-195)

---

#### SKIP-9: Cascade hybrid multi-pass strategy (closed-source variant)

**Rationale**: XCE's benchmark table shows a "Sonnet 4.0 + XCE (cascade hybrid)" row achieving 76.8% resolve rate (external/README.md:43), +3.4pp over standard XCE. The cascade hybrid is mentioned only as a benchmark row — ZERO documentation exists about its implementation: how passes are staged, how context is cascaded, or what the multi-pass agent loop looks like. RQ5 F-032 notes: "suggests XCE supports a multi-pass strategy where context is fetched in stages." Without documentation or source, we cannot determine whether "cascade hybrid" is an agent-loop pattern, a multi-query aggregation strategy, or a model-routing scheme. Speculating would violate the source-of-truth grounding requirement (REQ-006).

**Cite**: external/README.md:43, RQ5 F-032 (iteration-005.md:132-151), spec.md REQ-006

---

### Verdict Diversity Check

**Verdict**: PASS — 9 explicit SKIP items provided, exceeding the minimum 1. The spec.md risk table (line 232) mandates: "Researcher must produce at least one DEFER and one SKIP verdict." Prior iterations already produced 2 DEFER verdicts (RQ5 full PRAT pipeline, RQ7 eval harness). This iteration delivers 9 SKIP verdicts, fully satisfying the anti-bias guard.

---

### Estimated Adoption-Matrix Verdict Counts (All 9 RQs)

Counted across all prior iterations + this one, at the XCE feature level:

| Verdict | Count | Items |
|---------|-------|-------|
| **ADOPT** | 4 | HLD/LLD template generation (RQ1), code_graph_trace (RQ2), code_graph_impact_analysis deterministic baseline (RQ3), PRAT Abstract stage (RQ5) |
| **ADAPT** | 6 | Combiner fold-into code_graph_context (RQ4), PRAT Persistent stage (RQ5), PRAT Recursive stage (RQ5), PRAT Tree stage (RQ5), Steering pattern transfer — MUST invoke FIRST (RQ6), Token reduction measurement protocol (RQ8) |
| **DEFER** | 2 | Full PRAT pipeline — closed-source SaaS (RQ5), Benchmark eval harness to sub-packet 028 (RQ7) |
| **SKIP** | 9 | Closed-source PRAT internals, SaaS hosting model, centralized xanther.ai dependency, pricing model coupling, static unconditional ALWAYS steering, hard-coded single-tool first call, mini-swe-agent harness, SWE-bench Docker infrastructure, cascade hybrid strategy (RQ9) |
| **Total** | **21** | 9 RQs across 4 verdict categories |

**Diversity assessment**: 4/4 verdict buckets populated. ADOPT:ADAPT:DEFER:SKIP ratio ≈ 4:6:2:9 — healthy spread. The SKIP-heavy RQ9 is by design (non-adoption boundary). The ADAPT-heavy ratio (6) reflects the pattern-transfer nature of this research: we CAN adapt most XCE concepts to our local infrastructure but CANNOT adopt them whole.

---

## Q-Answered

- **RQ9 — Non-Adoption Boundary**: Fully answered. 9 explicit SKIP items documented with 1-sentence rationale and file:line cites from external/README.md, spec.md, or prior iteration findings. Covers all explicit categories in the prompt (closed-source PRAT internals SKIP-1, SaaS hosting SKIP-2, centralized dependency SKIP-3, pricing coupling SKIP-4) plus 5 items surfaced during prior iterations (static ALWAYS steering SKIP-5 from RQ6 F-033, hard-coded single-tool SKIP-6 from RQ6 F-035/F-037, mini-swe-agent SKIP-7 from RQ7 F-039, SWE-bench Docker SKIP-8 from RQ7 F-039, cascade hybrid SKIP-9 from RQ5 F-032). Verdict diversity floor satisfied (min_skip:1 → 9 delivered). Adoption matrix verdict counts tallied across all 9 RQs: 4 ADOPT, 6 ADAPT, 2 DEFER, 9 SKIP.

## Q-Remaining

- **ALL 9 RQs ANSWERED.** No remaining research questions.

## Next-Focus

**RQ-cross-cut SYNTHESIS (iteration 010)**: Consolidate all 9 RQs into a unified adoption matrix table, propose 1-4 sub-packets with scope summaries and dependency chains, write `resource-map.md` per spec.md REQ-009. This is the final iteration — convergence should be declared after synthesis.

---

## Tool Calls

| # | Tool | Purpose |
|---|------|---------|
| 1 | Read (spec.md) | RQ9 definition + scope constraints: PRAT closed-source (line 48), SaaS endpoint exclusion (line 125), no reverse-engineering (line 126) |
| 2 | Read (iteration-008.md) | Prior iter next-focus + findings (F-043 through F-047) |
| 3 | Read (iteration-005.md) | RQ5 PRAT DEFER verdict (F-029), cascade hybrid reference (F-032) |
| 4 | Read (iteration-006.md) | RQ6 static ALWAYS steering gap (F-033, F-034), ADAPT verdict (F-037) |
| 5 | Read (iteration-007.md) | RQ7 SWE-bench + mini-swe-agent closed-source (F-039), DEFER verdict (F-042) |
| 6 | Read (external/README.md:1-100) | PRAT name (line 29), SaaS endpoint URL (line 74), CLI init + API key (lines 51-62), cascade hybrid row (line 43), SWE-bench line (line 37) |
| 7 | Read (external/README.md:188-270) | Token reduction claim (line 188), supported agents table (lines 253-261), pricing table (lines 264-270) |
| 8 | Read (external/README.md:100-188) | Steering rules: 6 IDE variants with "ALWAYS use" and "FIRST step" patterns |
| 9 | Read (external/steering/ directory) | Confirm 6 steering files exist for SKIP-5 cite |
| 10 | Read (deep-research-state.jsonl) | Current state (line 12: iter 8 complete) |
| 11 | Read (deltas/iter-008.jsonl) | Delta format reference for JSONL output |
| 12 | Read (spec.md:230-237) | Risk table citing verdict diversity requirement: "Researcher must produce at least one DEFER and one SKIP verdict" |

**Tool calls**: 12 (at NFR-P02 cap of 12).
