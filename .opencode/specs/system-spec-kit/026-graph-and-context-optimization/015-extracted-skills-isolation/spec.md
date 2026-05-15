---
title: "Extracted Skills Isolation — code-graph + skill-advisor decoupling from system-spec-kit"
description: "Deep research on how to make system-code-graph and system-skill-advisor 100% isolated from system-spec-kit: zero TS imports, zero playbook references, zero tests, zero feature-catalog entries inside system-spec-kit referring to the extracted skills. Surface concrete decoupling strategies, migration costs, risk profile, and a recommended execution plan."
trigger_phrases:
  - "extracted skills isolation"
  - "system-spec-kit code-graph decoupling"
  - "system-spec-kit skill-advisor decoupling"
  - "spec-kit zero-coupling research"
  - "code-graph skill-advisor isolation deep-research"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/015-extracted-skills-isolation"
    last_updated_at: "2026-05-15T09:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffolded research packet; dispatched 10-iter deep-research via cli-opencode + deepseek-v4-pro variant=max"
    next_safe_action: "Wait for deep-research convergence; synthesize recommended decoupling strategy"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md (to be authored by deep-research loop)"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000150026"
      session_id: "015-extracted-skills-isolation"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Which decoupling strategy (shared types package / MCP runtime calls / accept coupling) wins on cost-benefit?"
      - "Are there sub-surfaces (e.g., types only, or only the hooks/) where a different strategy applies?"
      - "What's the migration sequencing that minimizes risk of breaking the build mid-flight?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Extracted Skills Isolation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (architectural debt; blocks "clean skill boundary" claim) |
| **Status** | research-in-progress |
| **Created** | 2026-05-15 |
| **Branch** | main |
| **Parent** | `026-graph-and-context-optimization/` (architectural cleanup phase) |
| **Phase** | 015 (research-only at this phase; implementation packets follow) |
| **Depends On** | `007-code-graph/014-system-code-graph-extraction` (the extraction itself, now dissolved), `008-skill-advisor/013-skill-advisor-semantic-lane` (similar) |
| **Evidence Dir** | `research/` (deep-research output) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Code-graph was extracted to `.opencode/skills/system-code-graph/` (commit chain 50cfabb6e…) and skill-advisor to `.opencode/skills/system-skill-advisor/` (commit chain c90f1f7b6…). The extractions completed at the directory + MCP-server level, but **compile-time and documentation coupling persists inside `.opencode/skills/system-spec-kit/`**:

**Compile-time coupling (TypeScript imports)**: 11 non-test source files in `system-spec-kit/mcp_server/` import directly from `system-code-graph/mcp_server/lib/**`:
  - `context-server.ts` → `code-graph-db`, `runtime-detection`
  - `handlers/{memory-search, memory-context, session-resume}.ts` → `classifyQueryIntent`, `buildContext`, `mergeCompactBrief`, `buildStartupBrief`
  - `hooks/{memory-surface, claude/compact-inject, codex/lib/freshness-smoke-check}.ts` → `compact-merger`, `startup-brief`, `code-graph-db`
  - `lib/context/opencode-transport.ts` → `CodeGraphOpsContract`
  - `lib/search/graph-readiness-mapper.ts` → `getGraphFreshness`, types
  - `lib/session/{session-snapshot, context-metrics}.ts` → `mergeCompactBrief`, `getGraphStats`

  These imports force `system-spec-kit/mcp_server/tsconfig.json` to declare `"../../system-code-graph/mcp_server/**/*.ts"` in `include`, which:
  - Regenerates orphan `dist/system-code-graph/` build output inside spec-kit (1.6 MB cleaned 2026-05-15, will re-leak if tsc runs)
  - Makes `tsc --noEmit` in spec-kit transitively responsible for type-checking system-code-graph
  - Prevents spec-kit from being versioned, published, or scope-validated independently

  A parallel coupling exists for system-skill-advisor (`"../../system-skill-advisor/mcp_server/**/*.ts"` include + 2.2 MB orphan dist + similar source-file imports — exact mirror of code-graph).

**Documentation coupling**:
  - `feature_catalog/22--context-preservation-and-code-graph/` — 19 entries in spec-kit's feature catalog name code-graph as a co-owner; some entries describe features that now live elsewhere
  - `manual_testing_playbook/22--*/` — playbook entries that exercise code-graph or skill-advisor surfaces from spec-kit's perspective
  - `references/`, `constitutional/`, `SKILL.md`, `README.md`, `ARCHITECTURE.md` — cross-references that mention the extracted skills
  - `tests/` — 17 cross-system integration tests in spec-kit that test spec-kit's behavior at the code-graph / skill-advisor boundary

### Purpose

Research and recommend a **concrete, executable decoupling strategy** that achieves:
  1. **Zero TS imports** from `system-spec-kit/mcp_server/**/*.ts` to `../../system-code-graph/**` or `../../system-skill-advisor/**`
  2. **Zero playbook references** in `system-spec-kit/manual_testing_playbook/**` to extracted-skill internals (cross-references to the SIBLING skill's playbook are acceptable)
  3. **Zero tests** in `system-spec-kit/mcp_server/tests/**` that exercise extracted-skill code directly (cross-system integration tests that mock the boundary OR test through the MCP runtime are acceptable)
  4. **Zero feature_catalog entries** in `system-spec-kit/feature_catalog/**` that own features residing in the extracted skills (cross-references are acceptable; OWNERSHIP must move)

The deliverable is a research report with: surface-by-surface decoupling plan, cost estimates, risk profile per option, and a recommended execution sequence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (research surface)

- **Code coupling**: every `system-spec-kit/mcp_server/**/*.ts` file that imports from `../../system-code-graph/` or `../../system-skill-advisor/`; the exact symbols imported; the call sites; the alternative call shapes possible
- **tsconfig + build coupling**: the cross-skill `include` patterns; how to remove without breaking `tsc --noEmit` and `npm run build`
- **Documentation coupling**: feature_catalog/22--*, manual_testing_playbook entries referencing extracted skills, references/, constitutional/, top-level SKILL/README/ARCHITECTURE
- **Test coupling**: tests in spec-kit that import from system-code-graph / system-skill-advisor; tests that exercise extracted handlers indirectly via spec-kit handlers
- **Runtime coupling**: how spec-kit's MCP server discovers/calls code-graph features at RUNTIME (currently via TS imports; alternative: MCP-to-MCP calls, RPC-style)

### Decoupling strategies to evaluate

Evaluate each on: implementation cost, runtime cost (latency), risk profile, test-burden change, ergonomic impact on internal callers:

  - **(A) Shared types package** — move shared TS types (`CodeGraphOpsContract`, `GraphReadinessSnapshot`, `CodeNode`/`CodeEdge`, `ReadyAction`/`GraphFreshness`, `MergeInput`) to a third package (e.g., `.opencode/skills/_shared-types/` or `mcp-spec-kit-contracts`). Both skills depend on the shared package; no peer-skill imports.
  - **(B) MCP runtime calls** — replace TS imports with `mcp__mk_code_index__*` / `mcp__system_skill_advisor__*` tool calls at runtime. Decouples completely; pays a serialization + RPC cost per call.
  - **(C) Hybrid (recommended starting hypothesis)** — types via (A), behaviors via (B). Limits the breakage surface to the type contracts.
  - **(D) Accept coupling** — document that spec-kit's source code uses code-graph/skill-advisor as compile-time peer modules; remove the "isolated skill" claim and update SKILL.md/ARCHITECTURE.md accordingly.
  - **(E) Reverse-extract** — move the spec-kit code that depends on code-graph/skill-advisor INTO those skills (e.g., move `mergeCompactBrief`-consuming handler back into code-graph). Reverses the extraction for the strongly coupled paths.

### Out of Scope (for this packet)

- Actual implementation of the decoupling — that's a follow-on packet driven by this research
- Refactoring of cli-* skills, sk-* skills, or other unrelated subsystems
- Performance optimization beyond evaluating the latency cost of strategy (B)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Research deliverables (deep-research loop MUST produce)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Map every TS import from spec-kit to extracted skills | research.md contains a complete table of file → imported symbols, with file:line citations |
| REQ-002 | Categorize each import by minimum decoupling strategy | Each entry tagged A/B/C/D/E with rationale |
| REQ-003 | Enumerate all docs/playbook/feature_catalog cross-references | research.md lists each reference, distinguishes OWNERSHIP residue from legitimate cross-refs |
| REQ-004 | Per-strategy cost estimate | Each strategy (A-E) gets: estimated hours, risk level (low/med/high), runtime cost change |
| REQ-005 | Recommended execution sequence | A migration plan that minimizes broken-build windows and sequences (A) before (B) where applicable |
| REQ-006 | Risk + rollback strategy | What can go wrong, how to detect, how to recover (per strategy) |

### P1 — Quality bars

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Falsifiable claims | Every recommendation cites file:line evidence |
| REQ-008 | Adversarial pass | Each strategy is challenged with at least one counter-argument; report addresses it |
| REQ-009 | Convergence | Rolling-average new-finding rate falls below 0.10 (deep-research default), OR all 10 iterations complete |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists with sections for: current-state map, strategy evaluation, recommendation, execution sequence, risk register
- **SC-002**: At least 10 iterations completed OR convergence reached with documented stop reason
- **SC-003**: Recommended strategy is concrete enough that a follow-on packet can be scaffolded with explicit task list
- **SC-004**: Deep-review packet (post-research) finds < 3 P1 findings on the research artifact
- **SC-005**: Operator can answer "which decoupling strategy did we pick and why?" in one paragraph after reading the research
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deep-research model hallucinates symbol names not in actual repo | Wasted research effort | Pre-bind file:line evidence requirements; agent must cite real code |
| Risk | 10 iterations don't converge | Inconclusive recommendation | Synthesize partial findings; operator decides on remaining ambiguity |
| Risk | Recommended strategy is "accept coupling" | Defeats the user's "100% isolated" goal | Surface explicitly; let operator decide between architectural purity vs implementation cost |
| Dependency | deepseek-v4-pro API availability | Dispatch failure | Retry; fall back to `--variant high` if `--variant max` is rejected |
| Dependency | mk_code_index + system_skill_advisor MCP servers operational | Can validate strategy (B) call shapes | Already confirmed working in this session |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Will the deep-research loop actually converge with concrete code-level evidence, or will it stay at the strategy-comparison level?
- Should the research also cover the system-spec-kit's role as a "umbrella skill" — i.e., does isolation imply renaming/restructuring spec-kit itself?
- For each strategy, what's the breaking impact on other consumers of system-spec-kit's MCP tools (memory_search, memory_context, session_resume)?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:complexity -->
## 8. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Cross-skill architecture; 11 source files + many docs |
| Risk | 14/25 | Research-only; no code changes in this packet |
| Research | 20/20 | Heavy research load; 10 iterations at max thinking |
| **Total** | **52/70** | **Level 2** (research packet); implementation packet that follows will be L3+ |
<!-- /ANCHOR:complexity -->
