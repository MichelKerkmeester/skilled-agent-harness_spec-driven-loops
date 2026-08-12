# Deep Research Synthesis: Spec-Kit Templates & Context Reducer

**Packet:** `specs/system-speckit/033-spec-templates-and-context-reducer`
**Question:** Do the two `context/*.md` concepts (Reducer Engineering; the $1.2M Agent Engineering harness) yield concrete in-repo improvements to system-speckit's templates, documentation logic, and context/memory system — for (a) context/token reduction, (b) AI plan adherence, (c) general optimization?
**Mode:** Report-only. No product code was implemented. All lineage writes were containment-confined; the repo has zero net damage.

## Provenance — 10 iterations, 4 lineages, 3 model families, forced depth

| Lineage | Executor / model | Iters | Stop reason |
|---|---|---|---|
| grok | cli-cursor / cursor-grok-4.5-high | 3/3 | max_iterations |
| composer | cli-cursor / composer-2.5 | 2/2 | max_iterations |
| pi-flash-a | cli-pi / deepseek-v4-flash (opencode-go) | 3/3 | max_iterations |
| pi-flash-b | cli-pi / deepseek-v4-flash (opencode-go) | 2/2 | max_iterations |

`--stop-policy max-iterations` throughout: convergence was telemetry only, never an early stop (REQ-001 honored). The two original cli-devin lineages (GLM 5.2, SWE 1.7) were replaced after a structural failure — see §6.

---

## 1. EXECUTIVE VERDICT

**The two source essays largely describe machinery this repo already ships, often more maturely.** All four lineages independently reached this verdict. The high-value output is therefore a *small* set of genuine gaps that survived adversarial, multi-model prior-art filtering — plus a refutation list that prevents cargo-cult reinvention.

This also **corrects the session's own first-pass inline analysis** on two points: raw template LOC (~5,541) is a red herring (level-gating already collapses core docs ~80–85%), and `memory_context` already enforces a token budget. Both corrections are unanimous across lineages and independently verified below.

---

## 2. CROSS-LINEAGE CONVERGENCE

Agreement across independent model families is the strongest signal here. ✓ = lineage surfaced it.

| # | Genuine gap | grok | composer | pi-a | pi-b | Verified here |
|---|---|---|---|---|---|---|
| G1 | `research.md.tmpl` is ungated — 944 lines rendered at **every** level | ✓ | ✓ | ✓ | ✓ (via dup) | **Yes** — 1 always-true gate `IF level:1,2,3,3+,phase` |
| G2 | `AC_COVERAGE` plan-adherence rule exists but **disabled by default** | (partial) | — | ✓ (top) | — | **Yes** — validation-rules.md:75/79 "Default: Disabled" |
| G3 | No machine **scope-adherence** check (SCOPE LOCK is prose-only; validate.sh has no In-Scope/plan-path rule) | ✓ | — | ✓ | — | Cited (validate.sh rule set) |
| G4 | `memory_search` lacks `enforceTokenBudget` (while `memory_context` has it) | ✓ | ✓ (cond.) | ✓ (adjacent) | — | **Yes** — search.ts: 0 hits vs context.ts: 3 |
| G5 | No machine guard against reading raw `.tmpl` instead of the rendered view | ✓ | ✓ | ✓ | — | Cited (SKILL.md mandate is prose-only) |
| G6 | Cross-level template **source duplication** (~40% of manifest; impl-summary 95–99% dup) | — | — | — | ✓ (deep) | Cited; see §5 nuance |

**Unanimous already-exists (do NOT reinvent):** deterministic reducer (`reduce-state.cjs` + findings-registry + `contradiction-supersession`), template level-gate renderer (`renderInlineGates`), Default-FAIL (Iron Law + `validate.sh --strict`), fresh-context evaluator (deep-review LEAF), self-authored handoff (`handover.md` + `_memory.continuity`), complexity-matches-task (Levels 1–3+), `memory_context` token budget, id/session/MMR dedup.

---

## 3. RANKED IMPLEMENTABLE SHORTLIST (REQ-005)

Confidence tiers: **[verified]** = independently re-checked this session; **[multi]** = ≥2 model families; **[single]** = one lineage, well-cited (treat as hypothesis to confirm in planning).

| Rank | Recommendation | Axis | Surface | Class | Blast | Confidence |
|---|---|---|---|---|---|---|
| 1 | **Gate `research.md.tmpl` by level** (split per-level sections like `spec.md.tmpl`; add to `spec-kit-docs.json`; fix `template-guide.md` pointers). ~700–800 lines saved per packet that scaffolds research. | context-reduction | templates | genuine-gap | Med | **[verified] + unanimous** |
| 2 | **Promote `AC_COVERAGE` to default-on** (warn severity, or set `SPECKIT_AC_COVERAGE=true` in the completion gate), keeping the manual-infeasible escape hatch. The single machine-checked plan-adherence gate is currently dormant. | plan-adherence | doc-logic | genuine-gap (dormant) | Small–Med | **[verified] [single, high-leverage]** |
| 3 | **Add `check-scope-adherence.sh` (warn)** — changed-file paths per task row must fall within `plan.md`/`spec.md` declared scope; follows the `check-files.sh` pattern. Makes SCOPE LOCK machine-enforced. | plan-adherence | doc-logic | genuine-gap | Small–Med | **[multi]** |
| 4 | **Apply `enforceTokenBudget` at the end of `handleMemorySearch`** (reuse the `memory_context` helper / `getTokenBudget('memory_search')`); and/or wire the advisory `dynamic-token-budget` into `stage4-filter` as a hard cap after measuring recall impact. | context-reduction | context-system | genuine-gap | Small | **[verified] [multi]** |
| 5 | **Raw-`.tmpl` read guard / rendered-view helper** — document `inline-gate-renderer --level N --stdout` as the agent read path; optional authoring-checklist item. Prevents re-introducing the token wall by accident. | context-reduction + plan-adherence | templates + doc-logic | genuine-gap | Low | **[multi]** |
| 6 | **Collapse cross-level template source duplication** — one ungated shared core + per-level gated addenda for the 4 multi-level templates; renderer needs no change. Cuts template *source/maintenance* size ~40% and removes variant-drift. | general-opt (maintainability) | templates | genuine-gap | Med | **[single, deep]** |

**Go/no-go lean for `/speckit:plan`:** ranks **1, 2, 4** are the strongest first packet (low–medium blast, verified, high clarity). Rank 3 needs a changed-files contract design. Ranks 5–6 are lower-priority polish.

---

## 4. REFUTATION LIST (REQ-006) — cargo-cult guards

| Source idea | Verdict | Why (evidence) |
|---|---|---|
| Port the `reduce_findings()` function into speckit | already-exists / do-not-reinvent | `reduce-state.cjs`, findings-registry, `contradiction-supersession`, `conditional-fanin/reduction.ts` |
| Treat "cut raw 5,541 template LOC" as the goal | not-applicable | `renderInlineGates` already collapses core docs ~80–85% at L1; raw LOC ≠ agent-read cost |
| Add a token-budget pass to `memory_context` | already-exists | `enforceTokenBudget` (memory-context.ts) with per-mode caps + tests |
| Build a new Default-FAIL / fresh-evaluator / progress-handoff framework | already-exists | Iron Law + `validate.sh --strict`; deep-review LEAF; `handover.md` + continuity |
| Re-architect Gate 3 as a token/context reducer | category error | `gate-3-classifier.ts` is a write-boundary classifier, not in the read path |
| Claim-normalize dedup in `memory_search` | marginal / conditional | id+session+MMR dedup already exists; content grouping lives in findings-registry; only worth it if traces show >10% redundant claim text |
| GraphRAG / Kimi plan-explore-coder split inside speckit | not-applicable | memory MCP already has vector+FTS+graph recall; agent topology is owned by deep-loop/orchestrate |

---

## 5. NUANCES & HONEST DISAGREEMENTS

- **Template weight numbers differ by measurement scope, not contradiction.** grok: L1 *core* set ≈558 lines; composer: *fleet* L1 ≈2,162 lines / ~14.6k tokens; pi-flash-a: per-template renders (spec 874→143 L1, etc.). Complementary views of the same gating behavior.
- **Rank 6 (source duplication) is a maintainability win, not an agent-read-token win.** The renderer emits exactly one variant per level, so the ~40% duplication is template *source* weight (maintenance + drift risk), not what a scaffolding agent reads. The implementation packet must not overstate token savings for this item.
- **Rank 2 (AC_COVERAGE) is single-lineage but high-leverage and verified.** Promoting it changes strict-mode outcomes for existing packets — needs a grace window / adoption evidence per its own documented promotion path.
- **research.md open question:** does the deep-research workflow consume spec-kit's `research.md.tmpl`, or only its own synthesis shape? This gates the real savings of rank 1 and should be confirmed before scoping.

---

## 6. PROCESS FINDING (meta, relevant to the system under study)

**cli-devin is structurally unfit as a deep-research fan-out executor.** Its headless `-p` mode is single-turn (per its own README), but a lineage needs sustained multi-turn execution (write init state → N iterations → synthesis). Run 1: GLM used its one turn to edit *other* spec folders (`hooks/002`), tripping write-containment and terminally failing. Run 2 (hardened prompt): it stayed in-scope but exited producing nothing. cli-cursor and cli-pi both sustain multi-turn headless execution and completed cleanly. **The write-containment net worked perfectly throughout — every out-of-scope write was auto-reverted, 0 failures, 0 net repo damage.** deepseek-v4-flash via cli-pi/opencode-go was the successful substitute.

---

## 7. NEXT STEPS

1. `/speckit:plan` a follow-up implementation packet scoped to shortlist ranks **1, 2, 4** (verified, low–medium blast).
2. Confirm rank 1's consumer (deep-research vs authoring) before restructuring `research.md.tmpl`.
3. Keep the refutation list (§4) as hard blockers against any PR that reinvents shipped machinery.

_This packet does not implement. Per-lineage source reports: `research/lineages/{grok,composer,pi-flash-a,pi-flash-b}/research.md`._
