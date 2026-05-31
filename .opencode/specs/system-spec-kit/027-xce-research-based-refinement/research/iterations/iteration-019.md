# Iteration 010 - IRQ10 Phasing-Order Optimization

## Focus

IRQ10 cross-validated the pass-1 recommended phasing order, `004 -> 001 -> {002,003} parallel -> 005`, against all prior pt-02 findings. The decisive question was whether the nine IRQ findings expose hidden hard dependencies that should reorder the implementation phases, especially Phase 002's broken `CONTAINS` chain, Phase 003's optional `layer`/LLM enrichment path, Phase 004's first-action mandate blocker, and Phase 005's subprocess reliability scope.

## Actions Taken

- Read parent phase order and declarations: parent `spec.md` recommends `004 first`, then `001 -> 002 -> 003 in parallel`, then `005 last` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:45-56`).
- Read proposal dependency graph: original proposals say structural packets `028/029/030` are Phase 1, `031` is standalone but tested with those tools, and `032` depends on `031` plus `028/029/030` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/sub-packet-proposals.md:144-162`).
- Read ground-truth child dependency metadata: Phase 001 declares no deps, Phase 002 declares `001-code-graph-hld-lld`, Phase 003 declares none, Phase 004 declares none, and Phase 005 declares `001/002/003/004` (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-code-graph-hld-lld/description.json:19-21`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-code-graph-trace/description.json:19-21`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-code-graph-impact-analysis/description.json:20-22`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-skill-advisor-first-action-mandate/description.json:19-21`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-adoption-eval/description.json:20-22`).
- Synthesized Iterations 001-009: Phase 001 needs deterministic ordering and edge policies (`iteration-001.md:17-45`); Phase 002 cannot rely on `CONTAINS` for file/module rungs (`iteration-002.md:19-29`); Phase 003 needs graph-only formula amendments but keeps `layer` optional (`iteration-003.md:30-70`); Phase 004 needs threshold/hint/string-test guardrails (`iteration-004.md:19-53`); Phase 005 needs lifecycle/auth/result-schema hardening (`iteration-005.md:20-48`); Phase 006 pins 001 -> 002 and keeps Phase 003 layer optional with fallback (`iteration-006.md:19-59`); Phase 007 corrects TESTED_BY direction for Phase 003 (`iteration-007.md:31-53`); Phase 008 escalates Phase 002 module-rung resolution to P0 via `CodeNode.filePath` (`iteration-008.md:23-57`); Phase 009 makes Phase 003 LLM enrichment explicit opt-in with no default provider (`iteration-009.md:20-60`).
- Re-read relevant runtime contracts: every `CodeNode` already carries `filePath` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:52-67`), `CONTAINS` only emits class-to-method edges (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:1038-1049`), `TESTED_BY` emits from test node to production node (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2032-2049`), and `queryEdgesTo()` is the correct incoming-edge reader (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:972-987`).
- Re-read Phase 004 render path and test surface: renderer bypasses numeric uncertainty when `passes_threshold === true` (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124-133`), output still says `use ${topLabel}` today (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:149-158`), and scorer-specific tests live under `skill_advisor/tests/scorer/` while legacy renderer/producer tests already pin brief strings (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/scorer/README.md:1`, `iteration-004.md:49-53`).
- Re-read Phase 005 scope and risk: the phase is already upper-end Level 2 at `42/70`, depends on all four prior phases, and its acceptance criteria include 24+ subprocesses, timeouts, retries, JSONL persistence, and statistics (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-adoption-eval/spec.md:42-53`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-adoption-eval/spec.md:117-150`, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-adoption-eval/spec.md:195-203`).

## Findings

### f-iter010-001 - CONFIRMED - Phase 002's file/module blocker does not create a new dependency on Phase 001

Evidence: Iteration 002 proved `CONTAINS` is not a symbol-to-file/module chain and requires a fallback for the `file`/`module` rung (`iteration-002.md:19-24`). Iteration 008 then identified the correct P0 source: `CodeNode.filePath`, because every node carries `filePath` independently of any HLD output (`iteration-008.md:23-33`; `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:52-67`). Phase 001 is still required for `architectural_role` via `classifyFileRole()`, but not for `filePath`.

Verdict: CONFIRMED. Keep Phase 002 dependent on Phase 001, but do not explain that dependency as "filePath comes from HLD." Amend Phase 002 so file/module resolution is P0 and sourced from `CodeNode.filePath`; `architectural_role` remains the Phase 001 dependency.

### f-iter010-002 - CONFIRMED - Phase 003 does not need a hard Phase 001 dependency for the deterministic MVP

Evidence: Iteration 003 concluded `layer` should stay optional and not be hidden inside the base formula because Phase 003's core formula has no layer term (`iteration-003.md:66-70`). Iteration 006 confirmed the same: if Phase 003 ships before Phase 001, layer-based criticality must fall back to `{source:"unavailable", value:null}` and must not invent a second classifier (`iteration-006.md:43-48`). Phase 003 metadata currently declares no hard dependency (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-code-graph-impact-analysis/description.json:20-22`).

Verdict: CONFIRMED. Do not update Phase 003 `manual.depends_on` for the deterministic MVP. Add an explicit optional dependency note and fallback contract for `layer` in enrichment/reporting mode.

### f-iter010-003 - CONFIRMED - TESTED_BY correction is Phase 003-local and does not depend on Phase 001

Evidence: The TESTED_BY direction fix comes from structural-indexer/db semantics: `TESTED_BY` edges are emitted from test node to production node (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts:2040-2046`), and production symbols must be checked through incoming `queryEdgesTo()` (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:972-987`; `iteration-007.md:31-35`). Phase 001's `classifyFileRole()` is a role classifier, not part of TESTED_BY emission or querying (`iteration-006.md:25-29`).

Verdict: CONFIRMED. Fixing Phase 003's test-coverage signal requires re-reading `structural-indexer.ts` and `code-graph-db.ts`, not implementing Phase 001 first. The hidden dependency is on graph edge direction knowledge, not on HLD.

### f-iter010-004 - AMEND - Phase 004 can still ship first, but only with render-layer guardrails

Evidence: Phase 004 has no declared child dependency (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-skill-advisor-first-action-mandate/description.json:19-21`) and its scope is explicitly render-layer only, avoiding scorer changes (`iteration-004.md:5-14`). The blocker is that `passes_threshold === true` currently bypasses renderer-side confidence/uncertainty checks (`.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124-133`; `iteration-004.md:25-29`). Existing renderer/producer tests are already in scope to update because they pin the old `use ${label}` wording (`iteration-004.md:49-53`).

Verdict: AMEND, but do not reorder. Phase 004 should ship first if amended to either re-check uncertainty in `render.ts` before emitting mandate wording or add a producer/render fixture proving `passes_threshold` encodes the dual threshold. Because scorer internals are out of scope, the safer implementation path is render-layer re-check plus renderer/producer tests, not `lib/scorer/` surgery.

### f-iter010-005 - AMEND - Phase 005 should be bumped to Level 3 if lifecycle/auth-cache hardening remains in scope

Evidence: Phase 005 is already upper-end Level 2 at `42/70` and about 500 LOC (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-adoption-eval/spec.md:195-203`). Iteration 005 adds blocking requirements for process-tree cleanup, auth preflight caching, discriminated result schema, and mocked scale stress tests (`iteration-005.md:20-48`). Phase 005 also must consume all phases as independent variables/tools (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-adoption-eval/description.json:20-22`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-adoption-eval/spec.md:48-50`).

Verdict: AMEND. Phase 005 remains last, but its level estimate should move from L2 to L3 unless subprocess lifecycle/auth-cache work is split into a prerequisite hardening packet. Keeping it L2 undercounts both LOC and operational risk.

### f-iter010-006 - CONFIRMED - Iteration 009 Option D does not add a dependency from Phase 003 to Phase 005

Evidence: Iteration 009 selected Option D: no default LLM provider; deterministic output remains complete, while enrichment is explicit, auditable, and skippable (`iteration-009.md:20-24`, `iteration-009.md:62-71`). Phase 005 evaluates Phase 003's deterministic outputs and tunable risk weights after all tools exist (`.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-adoption-eval/spec.md:147-150`).

Verdict: CONFIRMED. Option D reduces coupling. Phase 003 can ship before Phase 005; Phase 005 later evaluates with-vs-without enrichment only if explicit provider configuration exists, otherwise it evaluates deterministic baseline behavior.

### f-iter010-007 - CONFIRMED - Optimal order is 004, 001, 002/003, 005

Evidence: The ground-truth declarations place 004 and 001 at no deps, 002 after 001, 003 with no hard deps, and 005 after 001-004 (`description.json` citations above). Prior findings add quality amendments but do not reverse those hard edges: Phase 004's blocker is test/guardrail scope, Phase 001 feeds Phase 002's role contract, Phase 003's layer and LLM paths are optional, and Phase 005 is evaluative and therefore last (`iteration-004.md:25-53`, `iteration-006.md:19-59`, `iteration-009.md:20-60`).

Verdict: CONFIRMED with one nuance. Phase 003 may start in parallel with Phase 002 after Phase 001 lands, or earlier if it explicitly omits layer/enrichment integration. The cleaner order for integration risk is still `004 -> 001 -> {002,003} -> 005`.

## Final Order Recommendation

1. **004-skill-advisor-first-action-mandate** — Ship first because it has no code_graph dependency and is the treatment condition for Phase 005. Amend scope to include renderer-side uncertainty guard or producer invariant fixture, fallback hint behavior, and rewritten renderer/producer tests. Do not require scorer implementation changes.
2. **001-code-graph-hld-lld** — Ship next because it establishes `classifyFileRole(filePath, db)` and the canonical `file_role`/`layer` contract consumed by later phases. Its deterministic ordering and dangling-edge policies should be fixed before consumers lock tests against its output.
3. **002-code-graph-trace** — Ship after 001 because `architectural_role` must equal Phase 001's role classifier. Its new P0 is deterministic `file`/`module` resolution from `CodeNode.filePath`; `code_packages` stays P1 unless the product requires true package hierarchy on day one.
4. **003-code-graph-impact-analysis** — Can run parallel with 002 after 001, but list it after 002 in the serial order because it benefits from the settled graph-contract vocabulary. No hard Phase 001 dependency for deterministic MVP; add fallback for optional `layer`, fix file-level aggregation, incoming TESTED_BY direction, normalization, and no-default LLM enrichment.
5. **005-code-graph-adoption-eval** — Last. It depends on 001-004 by declaration and by measurement design. Bump to L3 if lifecycle/auth-cache/result-schema/stress-test hardening remains in the packet.

## Q-Answered

- IRQ1 answered: Phase 001 remains early because its deterministic output contract must stabilize before Phase 002 consumes `classifyFileRole()` (`iteration-001.md:17-45`; `iteration-006.md:25-29`).
- IRQ2 answered: Phase 002's broken `CONTAINS` chain does not create a new dependency on 001 for `filePath`; `CodeNode.filePath` is already independent (`.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts:52-67`; `iteration-008.md:23-33`).
- IRQ3 answered: Phase 003's base formula does not require `layer`; `layer` is optional annotation/enrichment only (`iteration-003.md:66-70`; `iteration-006.md:43-48`).
- IRQ4 answered: Phase 004 can still ship first if guardrails stay render-layer-local; scorer surgery is not required (`iteration-004.md:25-53`; `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts:124-133`).
- IRQ5 answered: Phase 005's subprocess reliability findings warrant L3 unless split out (`iteration-005.md:20-48`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-code-graph-adoption-eval/spec.md:195-203`).
- IRQ6 answered: Phase 001 -> Phase 002 is the real hard cross-phase JSON contract; Phase 003 only consumes `layer` optionally (`iteration-006.md:19-59`).
- IRQ7 answered: TESTED_BY correction is Phase 003-local graph-edge work, not a Phase 001 classifier dependency (`iteration-007.md:31-53`).
- IRQ8 answered: `code_packages` stays P1, but file/module rung resolution from `CodeNode.filePath` is P0 inside Phase 002 (`iteration-008.md:23-57`).
- IRQ9 answered: Option D no-default enrichment reduces hidden coupling and does not block Phase 003 on Phase 005 (`iteration-009.md:20-71`).
- IRQ10 answered: ALL 10 IRQs ANSWERED. Recommended order remains `004 -> 001 -> {002,003} -> 005`, with Phase 005 level bumped and Phase 004 wording narrowed to guarded mandate.

## Q-Remaining

none

## Next Focus

SYNTHESIS
