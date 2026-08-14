# Iteration 2: Agent Engineering harness vs doc-logic + memory system

## Focus

Map Agent Engineering harness patterns (Default-FAIL, fresh-context evaluator, self-authored handoff, complexity-matches-task) onto system-speckit documentation logic and `memory_context` / `memory_search`. Classify plan-adherence and memory optimizations. Convergence telemetry noted (prior iteration ratio 0.9); continue per `max-iterations` stopPolicy.

## Findings

1. **Default-FAIL ≈ shipped Iron Law + completion verification gates.** AGENTS.md Iron Law: "NO completion claims without running stack-appropriate verification"; Law 3 VERIFY; Completion Verification Rule requires `validate.sh --strict` + checklist before "done". [SOURCE: `AGENTS.md:11,23`] [SOURCE: `.opencode/skills/system-spec-kit/SKILL.md:462`]
   - **Classification:** `already-exists` / **axis:** plan-adherence / **surface:** doc-logic

2. **Fresh-context evaluator ≈ deep-review LEAF loop.** `deep-review` SKILL: "fresh context per iteration", LEAF-only agent, externalized state — same separation as Anthropic's evaluator-without-write-access pattern. [SOURCE: `.opencode/skills/system-deep-loop/deep-review/SKILL.md:3,288,298`]
   - **Classification:** `already-exists` / **axis:** plan-adherence / **surface:** doc-logic (deep-loop)

3. **Self-authored handoff ≈ handover.md + `_memory.continuity` ladder.** Feature catalog documents recovery chain prioritizing `handover.md` then continuity then spec docs; resume ladder reads `implementation-summary.md` continuity. [SOURCE: `.opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md:325`] [SOURCE: `AGENTS.md` Memory Save Rule / continuity frontmatter]
   - **Classification:** `already-exists` / **axis:** plan-adherence / **surface:** context-memory
   - **Refute:** Adding a separate `progress.md` harness file as first move — overlaps shipped continuity surfaces.

4. **Gate 3 classifier is a machine contract for plan-adherence on writes.** `classifyPrompt()` in `gate-3-classifier.ts` owns trigger vocabulary; read-only disqualifiers (`review`, `audit`, `inspect`, `analyze`) can suppress Gate 3 when alone. [SOURCE: `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:1-11,241-244`]
   - **Classification:** `already-exists` / **axis:** plan-adherence / **surface:** doc-logic

5. **Documentation Levels 1–3+ are enforced by `validate.sh detect_level`.** Level detection reads `<!-- SPECKIT_LEVEL: N -->` marker first, then infers from `decision-record.md` / `checklist.md` presence. Template render uses same level for IF gates. [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:403-457`] [SOURCE: `orchestrator.js:348-352`]
   - **Classification:** `already-exists` / **axis:** plan-adherence + context-reduction / **surface:** doc-logic + templates

6. **Complexity-matches-task is documented judgment, not automated routing.** Charter cites Agentless vs agent tradeoff in `spec.md` problem statement; no in-repo router picks "simple pipeline vs agent" per task size automatically. [SOURCE: `specs/system-speckit/033-spec-templates-and-context-reducer/spec.md:62-66`]
   - **Classification:** `genuine-gap` (low priority) / **axis:** general-opt / **surface:** doc-logic
   - **Implementable:** Optional skill-advisor or Gate 2 tiebreaker hint when task LOC/complexity is below Level 1 threshold — advisory only, not a new agent runtime.

7. **`memory_context` already enforces per-mode token budgets.** `enforceTokenBudget()` truncates lowest-priority embedded results when over budget; mode budgets include quick=800, focused=3500, deep=3000, resume=2000 tokens. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-context.ts:551-593,1107-1144,2014`]
   - **Classification:** `already-exists` / **axis:** context-reduction / **surface:** context-memory
   - **Refute:** Claim that memory_context lacks any deterministic token-budget pass.

8. **`memory_search` has session-scoped dedup, not claim-normalization dedup.** `applySessionDedup` filters prior-seen results and reports `tokensSaved` estimate (~200 tokens per filtered duplicate). This is session replay dedup, not Reducer Engineering's normalize(claim) grouping across parallel workers. [SOURCE: `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts:2115-2139`]
   - **Classification:** `already-exists` (session dedup) + `genuine-gap` (claim-level cross-hit dedup before unified context assembly) / **axis:** context-reduction / **surface:** context-memory
   - **Implementable (low priority):** Optional deterministic claim-fingerprint pass on `memory_context` fused results — only if measured duplicate-claim rate in production traces justifies it; do not duplicate deep-loop findings-registry.

9. **Dynamic token budget + pressure policy extend retrieval trimming.** `SPECKIT_DYNAMIC_TOKEN_BUDGET`, `SPECKIT_PRESSURE_POLICY`, and stage E tier budgets (simple 1500 / moderate 2500 / complex 4000) documented in feature catalog. [SOURCE: `.opencode/skills/system-spec-kit/feature-catalog/feature-catalog.md:77,201`] [SOURCE: `mcp-server/ENV-REFERENCE.md:281-282`]
   - **Classification:** `already-exists` / **axis:** context-reduction / **surface:** context-memory

10. **Goal plugin encodes Default-FAIL-style success criteria in runtime.** Goal hook injects "Success Criteria: materially complete" and "Required verification has run" into active goal prompts. [SOURCE: `.opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/goal-opencode-plugin.md:76`]
    - **Classification:** `already-exists` / **axis:** plan-adherence / **surface:** doc-logic (hooks)

## Ruled Out

- Building a new fresh-context evaluator service — deep-review already provides LEAF dimensional audit with externalized state.
- Replacing handover with Anthropic-style `progress.md` as canonical — would fork continuity ladder.

## Dead Ends

- Searching for missing `validate.sh` — it exists and orchestrates level-aware doc rules (`validate.sh:1-34` header, `detect_level` at 403).

## Sources Consulted

- `AGENTS.md` (Iron Law, Gate 3, continuity)
- `shared/gate-3-classifier.ts`
- `scripts/spec/validate.sh:403-457`
- `mcp-server/handlers/memory-context.ts:551+,1107+,2014`
- `mcp-server/handlers/memory-search.ts:2115+`
- `feature-catalog/feature-catalog.md`
- `deep-review/SKILL.md`
- `manual-testing-playbook/ux-hooks/goal-opencode-plugin.md`
- `spec.md` (charter)

## Assessment

- **newInfoRatio:** 0.75
- **Novelty justification:** Harness-to-shipped-mapping with handler-level token/dedup distinction is new; overlaps iteration 1 on "don't reinvent reducers" are intentional cross-checks.
- **Questions addressed:** Q3 (complete), Q4 (complete), Q5 (inputs for synthesis).

## Reflection

- What worked: File:line mapping from external blog concepts to constitutional + handler evidence.
- What failed: Treating memory as lacking token control entirely.
- Ruled out: progress.md fork, new evaluator service.

## Recommended Next Focus

Synthesis: ranked implementable shortlist + refutation list across axes (a)/(b)/(c).
