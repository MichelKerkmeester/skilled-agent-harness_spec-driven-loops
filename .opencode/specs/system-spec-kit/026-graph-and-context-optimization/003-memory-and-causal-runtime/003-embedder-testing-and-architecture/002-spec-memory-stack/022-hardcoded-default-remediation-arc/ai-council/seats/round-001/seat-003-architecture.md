---
round: 1
seat: seat-003
executor: simulated-cli-claude-code-vantage
lens: holistic (architecture)
status: returned
timestamp: 2026-05-23T17:11:00.000Z
simulated: true
---

# Seat 003 — ARCHITECTURE (Holistic Lens, simulated cli-claude-code vantage)

## Mandate

System-wide impact analysis. Dependency graph between phases. ADR audit-trail preservation. Identify cross-cutting concerns that single-phase seats miss.

## Proposed Plan

### Q1: Phase ordering

**Dependency-driven order: 003 → 002b → 006 → 008 → 005 → 004 → 007 → 009 → 010 + convergence.**

Rationale based on actual phase-to-phase dependencies (not just executor type):

**Independent phases first (no shared API surface):**
- 003 (codex agents mirror): Independent. Touches `.codex/agents/*.toml` only. Investigation gate determines real scope.
- 002b (reranker docs): Independent. Touches CocoIndex docs only. Closes 022/002 scope split honestly.
- 006 (cocoindex P1 Python): Independent. Touches `mcp-coco-index/mcp_server/cocoindex_code/*.py` only. No TS interaction.
- 008 (rerank-sidecar): Independent. Touches `system-rerank-sidecar/*.sh|cjs|py`. Touches shell config consumed by node/python.

**API-creating phases next:**
- 005 (spec-memory P1 registry consolidation): **Creates `RERANKER_CANONICAL` + `getRerankerFallback` in registry.ts.** This is a new API surface that future phases could consume, but in this arc no one does. So 005 is a leaf in the dependency graph.
- 004 (skill-advisor threshold consolidation): **Wires production code to import from `SKILL_ADVISOR_COMPAT_CONTRACT`.** Self-contained. Touches `system-skill-advisor/` only. No spec-memory or code-graph entanglement.

**Config-extraction phases after:**
- 007 (code-graph config extraction): Creates `system-code-graph/mcp_server/lib/config-defaults.ts`. Self-contained.
- 009 (cascade thresholds env-driven): Touches `auto-select.ts:99-130`. **Depends on 005 — both touch auto-select.ts.** 005 must ship before 009 to avoid merge conflict.

**Governance last:**
- 010 (ADRs + validator): Authors 4 ADRs referencing every prior phase + ships `validate-doc-model-refs.js`. **Must be last** because ADR-B amendment references the verification clause that exists ONLY after the other phases ship.

**Sequence implication:** Order by independence first → API-creation → config extraction → governance.

### Q2: cli-opencode + deepseek-v4-pro risk mitigation

Preflight gates (per dispatch, ordered by what catches the most failure modes per minute spent):
1. **Read `.opencode/skills/cli-opencode/SKILL.md` §3 NEVER + §4 ALWAYS** (1 min) — the contract changes between versions; assume nothing stale.
2. **`opencode providers list`** (10 sec) — credit + reachability.
3. **`git status --porcelain && git rev-parse HEAD`** (5 sec) — baseline.
4. **Read the target file(s) at line-range cited in plan** (1-2 min) — verify the dispatched-output will land on real code lines (memory `feedback_cli_devin_bundle_verification.md`: SWE-1.6 hallucinates plausible function names; deepseek-v4-pro has similar failure modes under variant=high).
5. **Sequential_thinking ≥ 5 thoughts compose prompt** (3-5 min) — composes the CRAFT framework prompt with grounded file references.
6. **CLEAR ≥ 40/50 score check** (1 min) — per sk-prompt small-model dispatch rule.

Total preflight: ~10-15 min per dispatch. Reasonable for 1-3 hr dispatches. Skip for cli-devin SWE-1.6 RCAF dispatches (those are mechanical edits with their own SKILL.md contract).

Abort/rollback mid-dispatch:
- Two abort signals: (a) **`opencode providers list` returns 401 in any subsequent call** (credits exhausted mid-session), (b) **`/tmp/<phase>-out.log` mentions "Insufficient balance" OR "Rate limit" OR "context length"**. Anything else: wait.
- Mid-dispatch baseline-restore protocol per memory `feedback_rm8_mitigation_works_under_deepseek.md`: SIGKILL → git restore to baseline commit → retry with cli-devin fallback.

Phase 004 wave granularity:
**Hybrid: wave 1 + wave 2 in one dispatch; wave 3 + wave 4 in separate dispatches.**
- Waves 1+2 are tightly coupled: wave 1 imports from `SKILL_ADVISOR_COMPAT_CONTRACT`, wave 2 expands `RoutingCalibration` interface. The wave 2 interface change may cascade back to wave 1 imports. Bundling them in one dispatch lets deepseek-v4-pro handle the coupling within a single reasoning trace.
- Wave 3 (env-var overrides) and wave 4 (prompt-policy externalization) are loosely coupled. Wave 4 in particular is a JSON file format invention that benefits from a fresh reasoning trace.

This gives 3 dispatches instead of 1 or 4. Best balance.

### Q3: Phase 010 ADR-B handling

**Option (a) PLUS metadata clarity:** In-place edit, but with an explicit "Amendment" subsection and date stamp.

Rationale:
- The original ADR-013/014 in `004-spec-memory-embedder-bake-off/decision-record.md` will gain a new "## Amendments" section at the bottom referencing ADR-B (the verification clause).
- Git blame preserves audit trail (per VELOCITY). Adding an in-doc amendment header preserves *reader-facing* audit trail (per RISK-AVERSE, but cheaper than option c).
- This is a hybrid of (a) and (c): in-place edit (a) for accessibility + amendment header (c-flavored) for audit trail.

Operator approval still required (the plan says so explicitly). The shape of the edit:

```markdown
## Amendments

### Amendment 1 — 2026-05-23 (ADR-B per packet 022/010)

**Verification clause:** No inline model-name default string in TS/Python files under `.opencode/skills/`
shall contradict registry MANIFESTS canonical entries. An invariant test asserts profile.ts and all
provider files derive model names from registry. Future model-change audits MUST grep for BOTH
`DEFAULT = '...'` AND `\|\| '...'` patterns.

Reference: `022-hardcoded-default-remediation-arc/010-adr-writing-and-doc-validator/decision-record.md#adr-b`
```

That's a 10-line append. Audit-trail preserved + reader-facing visibility + no new ADR document.

### Q4: Convergence gate strength

Original 6 invariants + **2 high-value additions** (skip the low-value 3rd):

- (a) **memory_index_scan + code_graph_scan refresh** — YES, needed. Memory entries for the arc should be discoverable post-convergence. Plan already includes this in workflow lines 491-498 but isn't framed as a *gate*; make it a gate.
- (b) **Reranker memory entry update** — YES via `/memory:save`. The stale entry (`project_2026_05_19_cocoindex_arc_shipped.md` says jina-reranker-v3) was flagged in 022/002 limitations. Closing it at convergence is cleanest.
- (c) **validate-doc-model-refs.js dry-run** — Already happens implicitly (phase 010 implementation-summary will document the validator run). Don't double-count.

So: 6 + 2 = 8 convergence gates. Light enough to fit in 30-45 min.

### Q5: Failure-mode plan

Granularity: **dispatch > phase > arc.**

Define "dispatch boundary" as the unit between two cli-X calls. Within a phase, a dispatch might consist of multiple file edits + one test author. If dispatch fails:
- File-level rollback: `git restore <paths>` from dispatched-output log. Spot-fix in main agent if simple.
- Dispatch-level rollback: `git restore` on ALL files claimed by dispatch + delete `/tmp/<phase>-*` + redispatch with tighter prompt.

Phase-level rollback: only if dispatch-level fails twice. `git restore` on phase's `Commit Handoff` paths + `git rm -rf <phase-folder>` for created spec docs + reset parent metadata children_ids.

Arc-level rollback: never needed in practice; flag it as escalation-only.

State-of-truth chain:
- **Primary:** `git diff --stat HEAD~1..HEAD` (or `HEAD~N..HEAD` covering the phase)
- **Secondary:** `git log --oneline` and `git log -p <file>` for the changed files
- **Tertiary:** spec.md status fields (narrative, can drift)
- **Quaternary:** dispatched-output log (suspect; treats as hint not truth)

Partial-revert detection (mandatory checklist per dispatch):
1. `git diff --stat` shows ≥ expected file count + line-change order-of-magnitude
2. `npm run typecheck:root` exit 0 (no orphan imports = full landing)
3. New vitest passes (behavior preserved)
4. `grep` for the banned pattern returns 0 hits in changed files (ban-list survived)
5. Spot-Read on 1 representative changed file (human readability)

Five-point checklist sounds like a lot but each item is 30 sec. Total ~2.5 min per dispatch. Cheap insurance.

### Q6: Phase 004 wave-1-vs-wave-2

**Default: hybrid 2-dispatch (waves 1+2, then waves 3+4) per Q2 above.** Wave 1 alone CAN ship as 004a if dispatch 1 fails at wave 2. Mid-dispatch scope-split is the escape hatch.

Wave-by-wave is bi-directional:
- **Single-dispatch attempt fails at wave 2** → ship wave 1 output as 004a → re-scope waves 2-4 as 004b.
- **Single-dispatch attempt succeeds through wave 4** → 004 closes as planned.

This matches the velocity-pragmatic default (one dispatch) with risk-averse fallback (scope split).

## Reasoning

The arc's actual dependency graph is dominated by independence — most phases don't touch each other's APIs. The one exception is 005 → 009 (both modify `auto-select.ts`). That single edge dictates 005-before-009.

The 4 ADRs in phase 010 reference every other phase, so 010 must be last. Beyond those two constraints, phase order is largely a velocity/risk tradeoff, not an architectural one.

ADR-B is the cross-cutting concern that this seat surfaces best. The other seats argue for or against in-place vs separate-doc. The right answer is *hybrid*: in-place with an amendment header gives both audit trail and reader accessibility at near-zero extra cost.

Convergence gates should be the minimum that makes drift structurally impossible. 6 original invariants cover the technical surface. 2 additions (memory refresh + reranker entry update) close the discoverability + memory-staleness gaps. The third (validator dry-run) is redundant with phase 010's own deliverable.

## Risks & Trade-offs

- Dependency-driven order (5 before 9) deviates from numeric order. Operator may prefer 1-2-3-4-5-6-7-8-9-10 for cognitive simplicity. Trade-off accepted because the dependency is real (both phases touch auto-select.ts).
- Hybrid ADR-B (option a + amendment header) requires more text than pure option (a). Trade-off accepted for audit-trail preservation.
- 8 convergence gates instead of 6 add ~10 min to convergence wall-clock. Trade-off accepted for closure on the 2 high-value gaps.
- Hybrid 2-dispatch for phase 004 is neither cheapest (1) nor safest (4 separate). Trade-off accepted because waves 1+2 are tightly coupled (one dispatch) and waves 3+4 are loosely coupled (separate dispatches).

## Assumptions and Evidence Gaps

- Assume 005 and 009 both touch auto-select.ts in the same line range (99-130). Verified in plan §004/006 + §009 specs.
- Assume operator approves the hybrid ADR-B shape (option a + amendment header). If they prefer pure option (a), drop the amendment header for 5-line savings. If they prefer (c), 10-line cost remains the same; choose between accessibility (a-hybrid) vs separation (c) per operator taste.
- Assume convergence wall-clock budget is 30-45 min. Plan says 30 min. With 8 gates instead of 6 we land at 40-45 min. Within budget.

## Alternative Challenged

VELOCITY argues "minimum 6 convergence gates, don't add." I challenge: memory_index_scan refresh is in the plan's convergence workflow text but isn't called out as a *gate*. Adding it formally makes the failure-to-refresh detectable. The reranker memory entry update is operator-side ops per VELOCITY — true, but the operator asked the council to recommend whether to include it. Recommending "yes, gate it" is the council's job here.

## Confidence

**80/100** — High on Q1 (dependency-driven order is correct), Q3 (hybrid a+header is best), Q4 (6+2 additions), Q5 (5-point partial-revert detection is right). Medium-high on Q2 (10-15 min preflight is on the higher side; could trim). Medium on Q6 (hybrid 2-dispatch is good but may be over-engineered; pure atomic with split fallback per VELOCITY may be simpler).
