---
title: "XCE Research-Based Refinement: Extract architectural-context patterns to upgrade code_graph and skill_advisor"
description: "Deep-research investigation of the public Xanther Context Engine (XCE) MCP surface (external/) to identify adoption candidates for our local code_graph and skill_advisor subsystems. XCE exposes 5 tool primitives (xce_get_context, xce_architecture_context, xce_search, xce_trace, xce_impact_analysis), HLD/LLD layered abstractions, and a 'context-first' steering pattern that they claim yields +7.4pp on SWE-bench Verified and ~20% token reduction. The PRAT (Persistent Recursive Abstract Tree) algorithm itself is closed-source — research extracts API/UX/architecture-paradigm patterns, not source. Output: an adoption matrix with concrete file:line citations, a sub-packet proposal list (e.g. code_graph_trace, code_graph_impact_analysis, HLD/LLD generation pipeline, advisor first-action mandate render), and a non-adoption list with rationale."
trigger_phrases:
  - "027 xce research-based refinement"
  - "xanther context engine adoption"
  - "PRAT algorithm reverse engineering"
  - "code_graph architecture context gap"
  - "code_graph trace tool"
  - "code_graph impact analysis"
  - "advisor first-action mandate"
  - "HLD LLD generation pipeline"
  - "cocoindex complete fork"
  - "mcp-coco-index full upstream fork"
  - "cocoindex-code v0.2.33 adoption"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "pt-04 audit + spec-refresh: 005 cancelled to 103/003, 012 split from 009"
    next_safe_action: "Implement 012-feedback-p0-correctness P0 fixes first"
    blockers: []
    key_files:
      - "spec.md"
      - "research/027-xce-research-pt-04/research.md"
      - "research/027-xce-research-pt-04/prompt.md"
      - "001-cocoindex-complete-fork/spec.md"
      - "012-feedback-p0-correctness/spec.md"
      - "../../skilled-agent-orchestration/103-spec-kit-auto-mode-noninteractive-contract/003-skill-advisor-render-103-alignment/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-11-027-pt-04-refresh"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase 001 baseline → keep v0.2.33 snapshot (no upstream refresh)"
      - "Phase 005 fate → cancel + fold into 103/003 follow-on"
      - "Phase 009 P0 split → ship as new 012 mini-packet before code_graph phases"
      - "Phase 006 purpose → XCE-style productivity measurement (file-reads-avoided + token reduction)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: XCE Research-Based Refinement (Phase Parent)

<!-- SPECKIT_LEVEL: 2 -->

> **Phase Parent**: This packet has graduated from a research-only packet to a phase parent with 11 implementation phase children plus 1 split-out P0 correctness mini-packet (012). pt-04 alignment audit (2026-05-11, cli-codex gpt-5.5 xhigh fast) reviewed the packet against 26+ commits shipped between 2026-05-08 and 2026-05-11; verdict: direction correct, 7 children need spec-refresh, 1 cancelled and folded into 103 follow-on, 3 deferred. See `research/027-xce-research-pt-04/research.md` for full audit; see [pt-04 verdict mix](#pt-04-verdict-mix) below for one-liner status.

## PHASES

| Phase | Title | pt-04 Verdict | Level | LOC | Depends on |
|-------|-------|---------|------:|----:|-----------|
| **[001-cocoindex-complete-fork](./001-cocoindex-complete-fork/spec.md)** | Complete in-repo `cocoindex-code` MCP wrapper fork | REVISE_SCOPE — v0.2.33 baseline kept, sync follow-on noted | 3 | ~1,000-1,500 | none |
| **[002-code-graph-hld-lld](./002-code-graph-hld-lld/spec.md)** | Deterministic HLD/LLD Narrative Generation | KEEP_AS_IS | 2 | ~320-370 | none |
| **[003-code-graph-trace](./003-code-graph-trace/spec.md)** | Symbol→Class→Module→Role Trace Tool | REVISE_SCOPE — dep label fix only | 2 | ~390-460 | 002 |
| **[004-code-graph-impact-analysis](./004-code-graph-impact-analysis/spec.md)** | Risk-Scored Impact Analysis | REVISE_SCOPE — extend existing `impact` mode, not new concept | 2 | ~430-570 | optional 002/003 for enrichment only |
| **[005-skill-advisor-first-action-mandate](./005-skill-advisor-first-action-mandate/spec.md)** | Render-layer "MUST invoke FIRST" mandate | **CANCELLED** — folded into [103/003 follow-on](../../skilled-agent-orchestration/103-spec-kit-auto-mode-noninteractive-contract/003-skill-advisor-render-103-alignment/spec.md) | 1 | ~80-120 (now in 103/003) | n/a |
| **[006-code-graph-adoption-eval](./006-code-graph-adoption-eval/spec.md)** | XCE-Style Productivity Measurement Harness (file-reads-avoided + token reduction) | REVISE_SCOPE — productivity measurement on top of existing eval/stress surfaces | 3 | ~680-800 | 002-004 |
| **[007-coco-intent-steering](./007-coco-intent-steering/spec.md)** | CocoIndex intent steering + bounded query expansion | DEFER — blocked on 001 | 3 | ~250-350 | 001; soft 006 |
| **[008-memory-semantic-triggers](./008-memory-semantic-triggers/spec.md)** | Memory semantic trigger matching | REVISE_SCOPE — path repair to `tools/memory-tools.ts` | 3 | ~280-430 | 006 (shadow eval evidence) |
| **[009-feedback-reducers](./009-feedback-reducers/spec.md)** | Learning Feedback Reducers (P0 fixes split into 012) | REVISE_SCOPE — scope to learning reducers only after 012 lands | 3 | ~350-570 (was 400-650; -50-80 to 012) | 012 hard; 006 soft |
| **[010-retrieval-rerank-clients](./010-retrieval-rerank-clients/spec.md)** | Shared rerank/embedding cache client interfaces | DEFER — blocked on 001 | 3 | ~250-420 | 001 for Coco adapter |
| **[011-coco-memory-context-extras](./011-coco-memory-context-extras/spec.md)** | Coco exemplars + memory curated context extras | DEFER — blocked on 001 + 006 evidence | 3 | ~500-800 | 001 for Coco examples; 006/008/009/010 soft |
| **[012-feedback-p0-correctness](./012-feedback-p0-correctness/spec.md)** | Feedback P0 Correctness (split from 009 Sub-Phase 1) | NEW — split-out 2026-05-11 per pt-04 | 2 | ~50-80 prod + ~60-100 tests | none |

### pt-04 verdict mix

| Verdict | Count | Phases |
|---|---|---|
| KEEP_AS_IS | 1 | 002 |
| REVISE_SCOPE | 6 | 001, 003, 004, 006, 008, 009 |
| CANCELLED (folded into 103/003) | 1 | 005 |
| DEFER | 3 | 007, 010, 011 |
| NEW (split from 009) | 1 | 012 |

**Total**: ~4,580-6,440 LOC across 11 active phase children (005 cancelled, 012 added). Revised execution order: **012 P0 correctness ships first** → 001 (v0.2.33 baseline) → 002 → 003 → 004 → 006 (XCE-style productivity measurement) → 008 → 009 (learning reducers only) → 007/010/011 deferred. 005's renderer change is now owned by [skilled-agent-orchestration/103/003](../../skilled-agent-orchestration/103-spec-kit-auto-mode-noninteractive-contract/003-skill-advisor-render-103-alignment/spec.md).

**Cross-cuts**: see `research/research.md` for the original synthesis, `research/findings.md` for the 21-feature adoption matrix, `research/sub-packet-proposals.md` for the original per-phase scope rationale, `research/resource-map.md` for the pass-1 path ledger, `research/027-xce-research-based-refinement-pt-02/research.md` for implementation-risk amendments, and `research/027-xce-research-pt-04/research.md` for the 2026-05-11 alignment audit.

---

## EXECUTIVE SUMMARY (research phase — 2026-05-08, complete)

The `external/` folder of this packet contains the public Xanther Context Engine (XCE) integration repository — README, MIT license, MCP configs for 5 IDEs, and 3 steering files (`CLAUDE.md`, `kiro.md`, `opencode-prompt.txt`). XCE is a hosted SaaS MCP server that delivers architectural context (HLD, LLD, component descriptions, call graphs, impact analysis) via 5 tool primitives, claiming +7.4pp on SWE-bench Verified for Sonnet 4.0 and ~20% token reduction when steering rules are active. The underlying PRAT (Persistent Recursive Abstract Tree) algorithm is closed-source.

This packet scopes a deep-research run that compared XCE's public surface against our local `code_graph` (`mcp_server/code_graph/`) and `skill_advisor` (`mcp_server/skill_advisor/`) subsystems, identified concrete adoption candidates, and proposed sub-packets for features that warranted implementation. The research produced file:line-cited findings, an adoption matrix (4 ADOPT, 9 ADAPT, 2 DEFER, 6 SKIP feature rows), and a non-adoption list with 9 expanded rationale items. Phases 002-006 implement the actionable pt-01/pt-02 verdicts. Phase 001 adds the complete `cocoindex-code` fork baseline needed before the pt-03 CocoIndex phases 007, 010, and 011 modify the MCP wrapper.

**Key Decisions in this Spec**:
- Research-only packet at Level 2. Implementation follows in child or sibling packets keyed off the synthesis output.
- Executor: cli-opencode + deepseek-v4-pro (per user direction), with documented MCP-tool-name fallback chain (opencode-go/glm-5.1 → opencode/copilot) per memory `reference_opencode_provider_mcp_tool_compat`.
- Convergence target: 10 iterations with 0.10 novelty threshold; 3-iteration stuck-budget; 180-minute wall-clock cap.
- Output deliverables: `research/research.md` (synthesis), `research/findings.md` (adoption matrix), `research/sub-packet-proposals.md` (next-step packets), `research/resource-map.md` (path ledger).

**Critical Constraints**:
- The PRAT algorithm is NOT visible. Research must reverse-engineer architectural intent from public docs + benchmark numbers + tool API shape, not from source.
- The external/ folder has zero source code. Research lives in: this folder's README + steering, our local code_graph and skill_advisor source, and our existing spec-kit memory.
- No code modifications until research synthesis is complete and the user approves a sub-packet.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Spec-Scaffolded (research-not-started) |
| **Created** | 2026-05-08 |
| **Branch** | `main` |
| **Executor** | cli-opencode + deepseek-v4-pro (primary) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Our local `code_graph` MCP subsystem returns raw structural data (symbols + edges + readiness metadata) but **does not produce layered architectural narratives** the way XCE does. XCE's public surface advertises four context modalities we lack a clean equivalent for:

1. **Architecture context** (HLD/LLD/component description per file or symbol). Our `code_graph_context` returns symbol records and edge IDs; it does not produce a layered "this file's role in the system" narrative. **Gap.**
2. **Symbol-to-architecture trace** (function → class → module → architectural role). Our edge graph stores parent/child relations but no `code_graph_trace` tool exists to walk the abstraction ladder and emit a layered story payload. **Gap.**
3. **Impact analysis with risk** (changed-file set → downstream affected modules + risk assessment). Our `detect_changes` + `cross-file-edge-resolver.ts` enumerate edges but do not synthesize a "what breaks" risk-scored payload. **Gap.**
4. **Omnibus first-call combiner** (single tool call that fetches search + arch + trace at task entry). Our `code_graph_context` is per-target. There is no `code_graph_context_omni` for "starting a task" entry. **Gap-ish.**

In parallel, our `skill_advisor` brief renderer (`mcp_server/skill_advisor/lib/render.ts`) currently surfaces "Confidence > 0.8 → MUST invoke" as a soft directive. XCE's static steering files use stronger "ALWAYS call X FIRST. PREFER X over file reading." framing and claim a measurable token reduction. Whether that framing transfers to dynamic advisor briefs is an open question.

### Purpose

Run a deep-research loop that:

1. **Inventories** XCE's public tool surface, layered abstraction model, steering pattern, and benchmark methodology from the `external/` materials.
2. **Compares** that surface side-by-side against our `code_graph_*` and `skill_advisor` capabilities (file:line evidence required for every claim).
3. **Reverse-engineers** the most likely PRAT-style pipeline (persistent + recursive + abstract + tree) using only public clues and our local capabilities, then evaluates how cheaply it could be approximated on top of our existing structural-indexer + tree-sitter parser + (optional) generation step.
4. **Produces an adoption matrix**: each XCE feature classified as ADOPT / ADAPT / DEFER / SKIP with rationale, blast radius, and suggested sub-packet ownership.
5. **Proposes 1–4 sub-packets** for the items classified ADOPT/ADAPT (e.g., `code_graph_trace`, `code_graph_impact_analysis`, HLD/LLD summary generator + persistence, advisor first-action mandate).
6. **Documents non-adoptions explicitly** (closed-source PRAT internals, SaaS pricing model, centralized hosting) with rationale.

Success = a research synthesis that the user can read in under 30 minutes and turn into a Level 2/3 implementation packet without further investigation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Read and inventory ALL files in `external/` (README, LICENSE, steering/, configs/, assets/).
- Read and inventory `mcp_server/code_graph/` (`lib/`, `handlers/`, `tools/`, schema) — every public tool surface and every helper that could feed an HLD/LLD synthesizer.
- Read and inventory `mcp_server/skill_advisor/` (`lib/render.ts`, `lib/scorer/`, `lib/generation.ts`, brief rendering, hook integration) — render-layer changes only, no scorer surgery.
- Cross-reference our existing spec-kit memory for prior decisions on context payloads, budget allocation, and readiness contracts.
- Produce a 9-RQ-keyed iteration plan, run the deep-research loop to convergence, synthesize `research.md`, author `findings.md` (adoption matrix), and author `sub-packet-proposals.md`.
- Emit `resource-map.md` per spec-kit Rule 17.

### Out of Scope

- Modifying any source file in `mcp_server/` or anywhere else. Research-only packet.
- Creating implementation sub-packets in this run (proposals only — user authors them downstream).
- Calling the live xanther.ai SaaS endpoint. Research is offline against the public docs in `external/` plus our local code.
- Reverse-engineering proprietary PRAT internals from network traffic, decompilation, or any non-public source. Public docs only.
- SWE-bench evaluation against our stack. Benchmark methodology is documented as a follow-on RQ proposal, not run.
- Replacing CocoIndex semantic search with anything. Our `mcp-coco-index` skill is the local equivalent of XCE's `xce_search` and is not in scope for replacement.
- Changes to `skill_advisor/lib/scorer/` (scoring math). Render-layer (`lib/render.ts`) framing changes only, and only as proposals.

### Files Read (research input — read-only)

| Path | Purpose |
|------|---------|
| `external/README.md` (283 lines) | XCE public surface description, tool catalog, benchmark numbers, steering examples |
| `external/LICENSE` (MIT) | License compatibility check for any pattern adoption |
| `external/steering/{CLAUDE,kiro}.md`, `external/steering/opencode-prompt.txt` | Steering rule examples by IDE |
| `external/configs/*.json` (5 files) | MCP server config shape per IDE |
| `external/assets/*.png` | Benchmark chart, hero, integration matrix (visual-only; metadata extraction) |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/README.md` | Local code_graph subsystem overview |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/*.ts` | Indexer, context, query-intent classifier, edge-resolver, working-set tracker |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/*.ts` | MCP handler surface |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts` | MCP tool registrations |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/README.md` | Local skill_advisor subsystem overview |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts` | Brief renderer (target of first-action mandate proposal) |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/` | Scorer surface (reference; not modified) |

### Files Created (research output)

| Path | Purpose |
|------|---------|
| `research/research.md` | Synthesis of all iterations (progressive during run, finalized at convergence) |
| `research/findings.md` | Adoption matrix: each XCE feature → ADOPT / ADAPT / DEFER / SKIP + rationale + blast radius |
| `research/sub-packet-proposals.md` | 1–4 proposed Level 2/3 packets for ADOPT/ADAPT items |
| `research/resource-map.md` | Path ledger per spec-kit Rule 17 |
| `research/iterations/iteration-NNN.md` | Per-iteration delta + tool-call log (auto-emitted by deep-research workflow) |
| `research/deep-research-state.jsonl` | State machine (auto-emitted) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 9 research questions (RQ1–RQ9 below) addressed with file:line citations | `research.md` contains a section per RQ; each section cites at least 2 distinct file:line references (one from `external/`, one from local `mcp_server/`). |
| REQ-002 | Adoption matrix produced | `research/findings.md` lists every XCE feature surfaced in `external/README.md` with verdict ADOPT / ADAPT / DEFER / SKIP, rationale (≥2 sentences), blast radius (file count + LOC estimate), and suggested sub-packet name (or "none"). |
| REQ-003 | Sub-packet proposals authored | `research/sub-packet-proposals.md` describes 1–4 candidate sub-packets, each with: scope summary, level estimate, dependencies, risk register, and a 2-bullet "out of scope" guard. |
| REQ-004 | Non-adoption list documented | `research/findings.md` contains an explicit "Will NOT adopt" section listing closed-source PRAT internals, SaaS pricing, centralized hosting, and any other items the research surfaces. Each line has a 1-sentence rationale. |
| REQ-005 | Convergence achieved within iteration budget | Run terminates with `stopReason ∈ {converged, all_answered, exhausted_approaches}`. Hitting `max_iterations` without convergence requires an explicit blocker entry in `research.md` Open Questions. |
| REQ-006 | Source-of-truth grounding maintained | Every claim about XCE behavior in `research.md` cites a line from `external/`. Every claim about our local capabilities cites a line from `mcp_server/`. No claim cites only memory or only training-data prior. |

### P1 — Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | PRAT pipeline reverse-engineering documented | `research.md` has a "PRAT reconstruction" section that decomposes the name (Persistent / Recursive / Abstract / Tree), proposes the most likely pipeline, and maps each stage to a concrete local file:line that could host the equivalent (e.g., `lib/structural-indexer.ts` for parsing, a new `lib/node-summary-generator.ts` for generation). |
| REQ-008 | Steering pattern transfer plan documented | `research.md` has a "Steering pattern transfer" section comparing XCE's static "ALWAYS call X FIRST" framing to our dynamic advisor brief, with a concrete render-layer change proposal (file:line in `skill_advisor/lib/render.ts`) and a measurement protocol for token reduction. |
| REQ-009 | Resource map emitted | `research/resource-map.md` exists with sections: Inputs (read-only paths), Outputs (created paths), External references (URLs, must be from `external/README.md` only). |

### P2 — Nice to have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Benchmark methodology proposal | `sub-packet-proposals.md` includes a candidate "evaluation harness" sub-packet describing how we'd measure file-reads-avoided / context-accuracy on a held-out task set, even if scope-deferred. |
| REQ-011 | Alternatives considered | `research.md` documents at least 2 alternative architectures considered for HLD/LLD generation (e.g., template-only vs LLM-generated vs hybrid) with selection rationale. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:research-questions -->
## 5. RESEARCH QUESTIONS (RQ1–RQ9)

These nine questions form the iteration backbone. Each iteration must touch at least one RQ. Convergence is reached when each RQ has at least 3 supporting findings AND novelty drops below 0.10.

- **RQ1 — Architectural Context Gap**: Our `code_graph_context` returns raw symbols + edges. XCE returns layered HLD/LLD/component descriptions. What is the minimum viable HLD/LLD schema we could emit from our existing graph + an optional generation step? Can we mock a deterministic narrative-template version before adding LLM calls?
- **RQ2 — Trace Tool Design**: What inputs/outputs would `code_graph_trace` need to walk symbol → file → package → repo level? Does the existing edge table store enough hierarchy or is a schema delta required?
- **RQ3 — Impact Analysis Schema**: Given changed file paths, our `cross-file-edge-resolver` walks edges. XCE adds risk assessment. What risk signals can we compute deterministically (fan-in count, hub centrality, test-coverage gap, edge-drift score)? Is LLM scoring needed or is graph-derived risk sufficient?
- **RQ4 — Get-Context Combiner**: Should we ship a `code_graph_context_omni` that combines query + arch + trace + impact for a "starting a task" entry? What's the payload-size budget vs our existing `budget-allocator.ts`?
- **RQ5 — PRAT Reverse-Engineering**: Given only the public name + benchmark numbers, what is the most likely PRAT pipeline? Can we replicate it with our tree-sitter + an optional generation step? What does "persistence" mean — content-hash keyed cache or version-tagged snapshots?
- **RQ6 — Steering Pattern Transfer**: How do we adapt XCE's static "ALWAYS call X FIRST" pattern to our dynamic skill_advisor brief? What intent → first-action map is correct for our 13 skills? Where in `lib/render.ts` does the change land?
- **RQ7 — Benchmark Methodology Transfer**: Is there a local benchmark we could run (refactor-task held-out set, file-reads-avoided metric, answer-accuracy)? What's the lightest viable eval harness?
- **RQ8 — Token Reduction Validation**: XCE claims ~20% token reduction with steering. Is this measurable for us via our existing `prompt-cache.ts` + `budget-allocator.ts`? What's the baseline-vs-after protocol?
- **RQ9 — Non-Adoption Boundary**: What XCE patterns must we explicitly NOT adopt (closed-source PRAT internals, SaaS pricing, centralized hosting, external dependency on xanther.ai)? Each item with rationale.
<!-- /ANCHOR:research-questions -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: User can read `research/research.md` + `research/findings.md` + `research/sub-packet-proposals.md` in under 30 minutes and decide which sub-packets to greenlight.
- **SC-002**: Every adoption verdict (ADOPT / ADAPT / DEFER / SKIP) cites at least one file:line from `external/` AND one file:line from `mcp_server/`.
- **SC-003**: Sub-packet proposals are concrete enough to scaffold via `/spec_kit:plan` without re-investigation. Each proposal has a level estimate, file count, LOC estimate, and risk register.
- **SC-004**: Run terminates within 180 wall-clock minutes and within 10 iterations OR documents a blocker explaining why convergence wasn't reached.
- **SC-005**: All claims about XCE are traceable to `external/`. No hallucinated tool names, parameters, or behaviors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | XCE public docs are thin. Reverse-engineering PRAT from name + benchmark numbers may produce speculative proposals. | Medium. Could lead to ungrounded sub-packet recommendations. | Mark every PRAT inference with confidence level. RQ5 must distinguish "documented in `external/`" from "inferred." |
| Risk | DeepSeek-backed opencode models may reject MCP tool names containing `:`. Per memory `reference_opencode_provider_mcp_tool_compat`. | Medium. Tool calls fail mid-iteration. | Documented fallback chain in `deep-research-config.json`: cli-opencode/deepseek-v4-pro → cli-opencode/opencode-go/glm-5.1 → cli-opencode/copilot. Falls back if first MCP tool call returns colon-name error. |
| Risk | Researcher may scope-creep into modifying code during research. | High. Violates "research-only" gate. | `out of scope` includes explicit "no source modifications." Tasks.md has a hard gate before any code change. |
| Risk | Adoption matrix may bias toward ADOPT (recency / shiny-feature bias). | Medium. Produces noisy sub-packet pipeline. | REQ-002 forces 4-bucket classification (ADOPT / ADAPT / DEFER / SKIP). REQ-009 forces explicit non-adoption list. Researcher must produce at least one DEFER and one SKIP verdict. |
| Risk | Convergence detection misfires (early stop or no stop). | Medium. Run produces shallow findings or burns full 180min. | Convergence guard: minimum 5 iterations before convergence, novelty floor 0.15, delta-meaning check on. Stuck threshold 3. |
| Dependency | `deep-research` skill + `/deep:start-research-loop` workflow command | Internal | Already shipped. No version pin. |
| Dependency | cli-opencode skill + opencode CLI binary | Internal | Already shipped. Memory note covers provider fallback. |
| Dependency | `external/` folder pre-populated with XCE public materials | External (one-time download) | Already present (commit ac9a... per gitkeep timestamp). No fetch needed at runtime. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Total wall-clock under 180 minutes for the deep-research run.
- **NFR-P02**: Per-iteration tool-call cap of 14 (matches sibling 011).
- **NFR-P03**: Per-iteration time cap of 12 minutes.

### Reliability
- **NFR-R01**: Run state externalized to `research/deep-research-state.jsonl` so a crash/preempt allows resume via `/spec_kit:resume`.
- **NFR-R02**: Each iteration emits a delta record. `findings.md` and `research.md` are progressive (refreshed each iteration).

### Auditability
- **NFR-A01**: Every iteration logged to `research/iterations/iteration-NNN.md` with tool-call list and delta summary.
- **NFR-A02**: Adoption matrix entries cite file:line. No bare "I think" statements.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `external/` folder is empty or partially missing. Halt iteration 0; surface as blocker.
- An RQ has no available evidence (e.g., RQ7 benchmark methodology is too speculative). Mark as DEFER in findings, do not invent.
- Two RQs converge on conflicting recommendations (e.g., RQ1 says ADOPT HLD/LLD but RQ8 says token-reduction unmeasurable). Surface as Open Question for user resolution.

### Error Scenarios
- DeepSeek MCP tool name rejection. Auto-fallback to opencode-go/glm-5.1 per memory note. Log fallback in `iteration-NNN.md`.
- Opencode provider non-response. Fall back to copilot per memory `feedback_opencode_provider_fallback`.
- Convergence reached with < 5 iterations. Reject; force minimum 5 iterations per quality guard.
- Convergence not reached at iteration 10. Document blocker in `research.md` Open Questions, mark REQ-005 as not-met, surface to user.

### State Transitions
- `initialized` → `running` on dispatch.
- `running` → `iterating` after iteration 1 emits.
- `iterating` → `converged` when novelty < threshold AND ≥5 iterations done AND each RQ has ≥3 findings.
- `iterating` → `stuck` after 3 consecutive sub-novelty iterations without convergence; halt with `stuck` stop reason.
- `iterating` → `exhausted` at iteration 10 hard cap.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Research-only. No source modifications. 9 RQs, 4 output docs. |
| Risk | 8/25 | Speculative-finding risk (RQ5 PRAT). Provider-fallback risk (DeepSeek MCP names). Mitigated. |
| Research | 14/20 | This packet IS research. Iteration count, convergence guards, RQ count drive complexity. |
| **Total** | **32/70** | **Level 2** (research-staging packet) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the run start with a deterministic-template prototype of HLD/LLD output before considering LLM generation? (Default: yes — RQ1 requires the template-first option be evaluated.)
- Should `code_graph_context_omni` ship as a new tool or be folded into the existing `code_graph_context` payload? (Defer to RQ4 finding.)
- If the adoption matrix produces zero ADOPT verdicts, does the user want sub-packet proposals anyway (e.g., for ADAPT items)? (Default: yes — sub-packet proposals must cover all non-SKIP verdicts.)
- Is benchmark methodology in scope for a follow-on packet, or out of scope entirely? (Default: P2 — RQ7 produces a proposal but no harness is built in this packet.)
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-001
REQ-002
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
REQ-009
REQ-010
REQ-011
**Given** external/ folder is fully populated with XCE materials
**Given** deep-research workflow dispatches cli-opencode + deepseek-v4-pro
**Given** an iteration emits a delta record citing file:line evidence
**Given** convergence threshold 0.10 is reached after 5+ iterations
**Given** an RQ has no available evidence after 3 iterations
**Given** DeepSeek MCP tool name rejection triggers fallback chain
**Given** adoption matrix entry classifies an XCE feature as ADOPT
**Given** sub-packet proposal is authored with level + LOC estimate
**Given** non-adoption list contains closed-PRAT + SaaS-hosting items
**Given** resource-map.md is emitted with Inputs/Outputs/External sections
**Given** run completes within 180 wall-clock minutes
-->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 13 | 013-cocoindex-memory-port-research/ | [Phase 13 scope] | Pending |

| 18 | 001-rename-mcp-namespace-mk-spec-memory/ | [Phase 18 scope] | Pending |
| 19 | 003-memoization-dependency-dag-foundation/ | [Phase 19 scope] | Pending |
| 20 | 004-causal-graph-lifecycle-tombstones/ | [Phase 20 scope] | Pending |
| 21 | 005-frontmatter-causal-edge-promoter/ | [Phase 21 scope] | Pending |
| 22 | 006-statediff-reconciliation-layer/ | [Phase 22 scope] | Pending |
### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 012-feedback-p0-correctness | 013-cocoindex-memory-port-research | [Criteria TBD] | [Verification TBD] |
| 017-cocoindex-memory-port-research | 001-rename-mcp-namespace-mk-spec-memory | [Criteria TBD] | [Verification TBD] |
| 001-rename-mcp-namespace-mk-spec-memory | 003-memoization-dependency-dag-foundation | [Criteria TBD] | [Verification TBD] |
| 003-memoization-dependency-dag-foundation | 004-causal-graph-lifecycle-tombstones | [Criteria TBD] | [Verification TBD] |
| 004-causal-graph-lifecycle-tombstones | 005-frontmatter-causal-edge-promoter | [Criteria TBD] | [Verification TBD] |
| 005-frontmatter-causal-edge-promoter | 006-statediff-reconciliation-layer | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->
