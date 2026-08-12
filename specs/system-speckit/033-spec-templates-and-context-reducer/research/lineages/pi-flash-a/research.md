# Deep Research: Spec-Kit Templates & Context Reducer — Lineage pi-flash-a

**Lineage:** pi-flash-a | **Executor:** cli-pi / deepseek-v4-flash | **Session:** fanout-pi-flash-a-1786517927558-l9mbmd
**Loop:** 3/3 iterations, `stopPolicy: max-iterations`, stopReason `max_iterations` (convergence treated as telemetry; angles broadened per iteration)
**Status:** COMPLETE | Report-only — no files outside the lineage dir were modified.

---

## 1. EXECUTIVE SUMMARY

The two source concepts (Reducer Engineering; the $1.2M Agent Engineering harness) were tested against the three scoped surfaces (templates, doc-logic, context/memory). The charter's first-pass hypothesis holds with evidence: **most harness patterns already ship, often more maturely** — the deterministic level-gate template renderer (Reducer Engineering's "code, not model" reducer applied to templates), Default-FAIL (Iron Law + check-evidence rule), fresh-context evaluation (deep-review), self-authored handoff (`handover.md` / `_memory.continuity`), complexity-matches-task (check-complexity rule), and the memory token-budget pass (enforced in memory-context.ts).

Four **genuine gaps** survived adversarial cross-check, ranked by leverage: (1) the AC-coverage plan-adherence rule exists but is **disabled by default**; (2) **research.md.tmpl is effectively ungated** (944 lines rendered at every level); (3) **no scope-adherence validator** exists (SCOPE LOCK is prose-only); (4) the search pipeline's dynamic token budget is **advisory-only** (enforcement split-brain). Six concept ideas are refuted or already-exists for this repo (see §11).

---

## 2. METHOD

- 3 iterations, one focus surface each: templates (I1), doc-logic (I2), context/memory + prior-art verification (I3).
- Evidence = direct command output (renderer CLI measurements) and file:line reads; no sibling-lineage findings were used as evidence.
- Every recommendation classified {already-exists / genuine-gap / not-applicable} with file:line citations (REQ-003), tagged to axis (context-reduction / plan-adherence / general-opt) and surface (templates / doc-logic / context-system) (REQ-004).

---

## 3. KEY QUESTIONS

| # | Question | Status |
|---|----------|--------|
| Q1 | Template weight after level-gated rendering; where does raw ~5.5k LOC survive? | Answered (I1) |
| Q2 | Which Reducer Engineering ideas already exist vs are genuine gaps on templates? | Answered (I1) |
| Q3 | Which harness patterns already exist in doc-logic vs genuine plan-adherence gaps? | Answered (I2) |
| Q4 | Does memory_context/memory_search have a token-budget/dedup/synthesis reducer pass? | Answered (I3) |
| Q5 | Which recommendations survive into a ranked shortlist; which are refuted? | Answered (I3, synthesis) |

---

## 4. FINDINGS (numbered, evidence-cited)

### Templates surface

**F1.1 — Level-gated rendering IS the deterministic reducer for templates. [already-exists | context-reduction | templates]**
Raw manifest: 5,541 LOC / 13 templates (measured). `inline-gate-renderer.ts:182` (`renderInlineGates`) strips `<!-- IF level:N -->` blocks model-free. Rendered sizes: spec.md.tmpl 874→143 (L1) / 197 (L2) / 245 (L3) / 281 (L3+); plan.md.tmpl 1079→170 (L1); tasks 431→106; implementation-summary 547→135. ~84% reduction on core docs at L1. The raw-LOC figure is a red herring for authoring cost.
[SOURCE: .opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:182]

**F1.2 — research.md.tmpl is effectively ungated: 944 lines at EVERY level. [genuine-gap | context-reduction | templates]**
Single gate at line 1 is an always-true passthrough (`level:1,2,3,3+,phase`); renders 944 lines at L1 and L3 (measured). Absent from `spec-kit-docs.json` `documents` map (no level contract, absenceBehavior, or creationTrigger). `template-guide.md:183`/`:406` still point authors at the raw 946-line file. Fix shape: gate sections per level like spec.md.tmpl, or split workflow-owned synthesis shape from author-facing research brief. Estimated saving ~700-800 lines per packet that includes research.md.
[SOURCE: .opencode/skills/system-spec-kit/templates/manifest/research.md.tmpl:1]

**F1.3 — Ungated utility templates are constant-weight at every level. [genuine-gap, low priority | context-reduction | templates]**
resource-map.md.tmpl 204→202, handover.md.tmpl 154→152, debug-delegation.md.tmpl 140→138, review.spec.md.tmpl 100→100 (zero gates). Lower blast radius: resource-map is optional (`absenceBehavior: warn`), handover is command-owned (`creationTrigger: memory-save`).
[SOURCE: .opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl:1]

**F1.4 — Fail-closed missing-template handling = "drop malformed, log the loss" guard. [already-exists | general-opt | templates]**
`template-utils.sh:52` "Missing required template documents fail closed"; `:108` render-status propagation.
[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/template-utils.sh:52]

**F1.5 — Cross-template front-matter duplication. [genuine-gap, minor | context-reduction | templates]**
13 templates × ~12-15 lines of near-identical front-matter + `SPECKIT_TEMPLATE_SOURCE` comments ≈ 170+ duplicated lines. Hoisting to a shared partial would save ~150 lines and end version-comment drift. Low value: rendered docs dominate authoring cost.

**F1.6 — Rendered-path discipline is documented; raw-read risk remains for ad-hoc authoring. [already-exists w/ residue | context-reduction | templates]**
`template-guide.md:36` mandates "Always scaffold through create.sh or render from templates/manifest/". Residual risk: raw `.tmpl` files remain exposed; a model ignoring the guide reads 5,541 lines instead of ~143-281.
[SOURCE: .opencode/skills/system-spec-kit/references/templates/template-guide.md:36]

### Doc-logic surface

**F2.1 — Default-FAIL is implemented as the Iron Law + evidence rule. [already-exists | plan-adherence | doc-logic]**
`AGENTS.md:11` "NO completion claims without running stack-appropriate verification". `check-evidence.sh:10` (EVIDENCE_CITED, warn) rejects evidence-shaped labels; `check-completion.sh` tracks P0/P1_MISSING_EVIDENCE counters.
[SOURCE: AGENTS.md:11, .opencode/skills/system-spec-kit/scripts/rules/check-evidence.sh:10]

**F2.2 — AC-coverage rule (the machine-checked plan-adherence gate) exists but is disabled by default and advisory-only. [genuine-gap, HIGHEST LEVERAGE | plan-adherence | doc-logic]**
`check-ac-coverage.sh` computes requirement→task/checklist coverage with configurable floor (default 0.9) and an infeasibility escape hatch. `validation-rules.md:75-79`: "registered at INFO severity and stays disabled unless `SPECKIT_AC_COVERAGE=true`... The `SPECKIT_AC_COVERAGE_ENFORCE` flag is documented as a future promotion switch." Repo-wide grep: no `.opencode/` or CI sets the env var — the rule is dormant. Fix shape: promote to default-on warn severity (keeping the manual-infeasible escape hatch) or set the env var in the completion gate.
[SOURCE: .opencode/skills/system-spec-kit/references/validation/validation-rules.md:75-79]

**F2.3 — No machine check that work matches plan scope; SCOPE LOCK is prose-only. [genuine-gap | plan-adherence | doc-logic]**
validate.sh runs 36 rules (`scripts/rules/`); zero compare implemented content against plan.md/tasks.md scope (grep for scope/plan in validate.sh + rules dir: no hits). Fix shape: `check-scope-adherence.sh` (warn) verifying changed-file lists per task row land within declared paths — analogous to check-files.sh/check-template-staleness.sh patterns.
[SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:742-839]

**F2.4 — Fresh-context evaluator already exists as deep-review. [already-exists | plan-adherence | doc-logic]**
LEAF read-only evaluator with fresh context returning pass/fail with reason — the harness pattern, implemented with severity ratios and convergence.
[SOURCE: .opencode/skills/system-deep-loop/deep-review/SKILL.md:298]

**F2.5 — Self-authored handoff + external memory already exist. [already-exists | general-opt | doc-logic]**
`handover.md.tmpl` command-owned (`creationTrigger: memory-save`, spec-kit-docs.json); `_memory.continuity` frontmatter (ADR-004 direct-edit path).
[SOURCE: .opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json]

**F2.6 — Complexity-matches-task already exists as a rule. [already-exists | general-opt | doc-logic]**
`check-complexity.sh:10-12` (COMPLEXITY_MATCH, warn) validates declared level vs actual content.
[SOURCE: .opencode/skills/system-spec-kit/scripts/rules/check-complexity.sh:10-12]

**F2.7 — Gate 3 classifier is a write-boundary classifier, not a token reducer. [already-exists w/ scope note | general-opt | doc-logic]**
`gate-3-classifier.ts:838` + `applyGate3Satisfaction` (line 652) resolve prebound folders/write boundaries for autonomous executors. Classifying it as "a reducer" would be a category error.
[SOURCE: .opencode/skills/system-spec-kit/shared/gate-3-classifier.ts:838]

### Context-system surface

**F3.1 — memory_context HAS an enforced per-layer token budget. [already-exists | context-reduction | context-system]**
`handlers/memory-context.ts:551` `enforceTokenBudget` (1 token ≈ 4 chars estimate, lowest-score-first truncation, enforcement metadata); `resolveEffectiveTokenBudget`; dedicated vitest suite. The charter hypothesis "memory_context may lack a token-budget pass" is REFUTED.
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-context.ts:551]

**F3.2 — Result dedup exists at multiple pipeline stages (id-based). [already-exists w/ nuance | context-reduction | context-system]**
`stage1-candidate-gen.ts:528`/`:1106`/`:1207`; `handlers/memory-search.ts:1271` session-scoped `filterSearchResults`; `chunk-reassembly.ts` parent collapse; `graph-search-fn.ts:130`. Nuance: no claim-level near-duplicate collapse (two same-claim memories with different ids both surface) — but findings-registry already groups by content in deep-loop.
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/pipeline/stage1-candidate-gen.ts:528]

**F3.3 — Dynamic token budget is advisory-only in the search pipeline; enforcement split-brain. [genuine-gap, minor | context-reduction | context-system]**
`dynamic-token-budget.ts:5-9`: "computes a token budget... but does NOT enforce that budget downstream". Only the context handler enforces its own budget. Fix shape: wire the tier budget into stage4-filter as a hard cap or consume BudgetResult in orchestrator.ts.
[SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/dynamic-token-budget.ts:5-9]

**F3.4 — Reducer Engineering's core is already shipped in deep-loop machinery. [already-exists | general-opt | context-system/prior-art]**
`contradiction-supersession/` (audited shadow ledger for contradictions + supersession, replay-verified); `reduce-state.cjs:2353/2379` (uniqueById / uniqueRuledOutByContent); `conditional-fanin/reduction.ts` (deterministic leaf-envelope reduction with digest-verified inputs). Porting `reduce_findings()` into speckit would duplicate shipped machinery — the charter's "do NOT reinvent" constraint is confirmed correct.
[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/README.md:1-16, .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2353]

**F3.5 — generate-context.js is the deterministic metadata reducer for memory saves. [already-exists | context-reduction | context-system]**
Model-free reducer between session state and the memory index (refreshes description.json/graph-metadata.json, hands off DB indexing) — matching the Reducer Engineering playbook ("deduping, dropping malformed entries... are code problems").
[SOURCE: .opencode/skills/system-spec-kit/SKILL.md §Memory Save Rule]

**F3.6 — Cross-lineage synthesis-input collapse is a genuine gap but out-of-charter. [genuine-gap, out-of-scope | context-reduction | context-system]**
Fan-out lineages each converge independently; no deterministic cross-lineage claim-collapse before the final orchestrated read. Building it inside speckit would reinvent conditional-fanin semantics — belongs in deep-loop runtime if anywhere.

---

## 5. RECOMMENDATIONS (ranked implementable shortlist) — REQ-005

| Rank | Recommendation | Axis | Surface | Classification | Blast radius | Evidence |
|------|---------------|------|---------|----------------|--------------|----------|
| 1 | **Promote AC_COVERAGE to default-on (warn severity or env-var-set in completion gate), keeping the manual-infeasible escape hatch** | plan-adherence | doc-logic | genuine-gap (machinery exists, dormant) | Small (rule + default flip + docs); medium if strictness regressions appear | validation-rules.md:75-79; check-ac-coverage.sh:13-16 |
| 2 | **Gate research.md.tmpl by level** (split per-level sections like spec.md.tmpl, or separate workflow-owned synthesis shape) | context-reduction | templates | genuine-gap | Medium (template restructure + renderer tests + template-guide updates) | research.md.tmpl:1; renders 944 lines at all levels |
| 3 | **Add check-scope-adherence.sh (warn)**: changed-file list per task row must land within plan.md/tasks.md declared paths | plan-adherence | doc-logic | genuine-gap | Small-medium (new rule following check-files.sh pattern; needs changed-file input contract) | validate.sh:742-839 (no scope rule) |
| 4 | **Wire dynamic tier token budget into stage4-filter as a hard cap** (or consume BudgetResult in orchestrator.ts) | context-reduction | context-system | genuine-gap (advisory-only today) | Small (pipeline change + tests); needs perf measurement first | dynamic-token-budget.ts:5-9 |
| 5 | **Slim ungated utility templates** (debug-delegation, review.spec, resource-map) or gate them | context-reduction | templates | genuine-gap, low priority | Small; cosmetic | debug-delegation.md.tmpl:1 |
| 6 | **Hoist shared front-matter into a partial** | context-reduction | templates | genuine-gap, minor | Small; drift cleanup | spec.md.tmpl:1-16 vs plan.md.tmpl:1-16 |

## 6. IMPLEMENTATION-READY DETAILS

- **#1**: flip `_ac_enabled` default in `scripts/rules/check-ac-coverage.sh` OR set `SPECKIT_AC_COVERAGE=true` in the completion gate (`scripts/spec/check-completion.sh` / validate.sh strict path); update `validation-rules.md:75-79`; keep `SPECKIT_AC_COVERAGE_FLOOR` (0.9) and the escape hatch.
- **#2**: restructure `templates/manifest/research.md.tmpl` with `<!-- IF level:1 -->` / `level:2` / `level:3` / `level:3+` blocks (pattern: spec.md.tmpl:1/146/345/592); add to `spec-kit-docs.json` documents map with explicit `absenceBehavior`; update `template-guide.md:183/406`.
- **#3**: new rule in `scripts/rules/check-scope-adherence.sh` sourced by validate.sh's rule loop; needs a declared-paths contract (e.g., plan.md task rows already carry `(file path)` per tasks.md.tmpl header convention).
- **#4**: `stage4-filter.ts` accepts a budget param from orchestrator.ts calling `dynamic-token-budget.ts`; keep advisory mode as fallback behind the existing feature flag.
- **#5/#6**: mechanical; gate markers or shared YAML partial; run `inline-gate-renderer` snapshot tests after.

## 7. RISKS & DEPENDENCIES OF RECOMMENDATIONS

- #1: existing packets may show lower AC coverage — the escape hatch exists but operators may need a grace window; strict-mode outcomes change.
- #2: research.md is workflow-owned in deep-research (its own 17-section synthesis, not spec-kit's template) — verify actual consumption before restructuring; the savings accrue to *authoring* agents, not deep-research.
- #3: needs a reliable changed-files source (git diff at completion time) — contract design required before implementation.
- #4: enforce budget only after measuring stage1 candidate volume; wrong cap could cut recall.
- #5/#6: cosmetic; low risk.

## 8. OPEN QUESTIONS

None blocking. Carried forward: F3.6 cross-lineage synthesis-input collapse (out-of-charter, deep-loop surface).

## 9. SOURCES CONSULTED

- `.opencode/skills/system-spec-kit/templates/manifest/*.tmpl` (13 files, measured via renderer CLI)
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts`
- `.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`, `scripts/spec/check-completion.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/` (check-evidence, check-ac-coverage, check-complexity, +33 more)
- `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-context.ts`, `handlers/memory-search.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/search/` (dynamic-token-budget, stage1-candidate-gen, stage4-filter, chunk-reassembly, graph-search-fn)
- `.opencode/skills/system-spec-kit/references/validation/validation-rules.md`, `references/templates/template-guide.md`
- `.opencode/skills/system-deep-loop/runtime/lib/contradiction-supersession/`, `runtime/lib/conditional-fanin/`
- `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`, `deep-review/SKILL.md`
- `AGENTS.md`, `.opencode/skills/system-spec-kit/SKILL.md`
- resource-map.md: not present at init (`resource_map_present: false`); no coverage-gate citation.

## 10. RESEARCH LIMITATIONS

- Single-lineage evidence (pi-flash-a); sibling lineages (composer/grok/glm/swe/pi-flash-b) run independently — cross-lineage convergence is the orchestrator's job.
- Render measurements are line counts, not token counts; token estimates would refine #2/#6 (renderer output is markdown, ≈1 token/4 chars).
- #2 blast radius assumes research.md is author-consumed; deep-research's own workflow-owned research.md may dominate actual usage.

---

## 11. ELIMINATED ALTERNATIVES / REFUTATION LIST — REQ-006

| Approach (source concept) | Reason eliminated | Evidence | Iteration(s) |
|---------------------------|-------------------|----------|--------------|
| Cut raw 5,541 template LOC as the goal (Reducer Eng: "measure raw input size") | Rendered weight is what agents read; gating already cuts core docs ~84% at L1 — raw LOC is a red herring | inline-gate-renderer.ts:182; measured renders | I1 |
| Port `reduce_findings()` into speckit templates/memory (Reducer Eng) | Deep-loop already ships it more maturely: contradiction-supersession ledger, conditional-fanin reduction, reduce-state.cjs content-dedup | conditional-fanin/reduction.ts:1; contradiction-supersession/README.md:1-16; reduce-state.cjs:2353 | I1, I3 |
| Add a fresh-context evaluator to speckit (1.2M harness) | deep-review already is the LEAF read-only fresh-context evaluator with severity convergence | deep-review/SKILL.md:298 | I2 |
| Re-architect Gate 3 as a token/context reducer (Reducer Eng) | Category error: Gate 3 is a write-boundary classifier with prebinding/write-boundary resolution; it is not in the context-read path | gate-3-classifier.ts:838 | I2 |
| Add a memory-side token-budget pass to memory_context (charter hypothesis) | Already enforced per-layer in the handler, with dedicated tests | memory-context.ts:551; memory-context-token-budget.vitest.ts | I3 |
| Claim-level near-dedup in memory_search (Reducer Eng "group by normalized claim") | Id-based dedup already exists at 4+ stages; content grouping already lives in the findings-registry; added value marginal | stage1-candidate-gen.ts:528; reduce-state.cjs:2379 | I3 |
| New handoff/progress-file mechanism (1.2M harness) | handover.md.tmpl (command-owned) + `_memory.continuity` + ADR-004 direct-edit path already ship it | spec-kit-docs.json (handover.md entry) | I2 |
| Kimi-style subagent split (plan/explore/coder) inside speckit | system-speckit is a doc/memory skill, not a coding harness; the deep-loop + orchestrate stack owns agent topology | SKILL.md §Smart Routing | synthesis |
| GraphRAG-style external knowledge graph (1.2M harness day 5) | Memory MCP already has vector index + FTS + graph-additive recall + community search; new graph infra would duplicate | mcp-server/lib/search/ (graph-search-fn.ts, community-search.ts) | synthesis |

---

## 12. OPEN QUESTIONS (final)

1. Does the deep-research workflow consume spec-kit's research.md.tmpl, or only its own 17-section synthesis? (Determines real savings of recommendation #2.)
2. Is the AC_COVERAGE escape hatch ("manual infeasibility") sufficient to prevent false failures when promoted to default-on? (Gate for recommendation #1.)

## 13. NEXT STEPS

- Feed the ranked shortlist (rows 1-4 at minimum) into `/speckit:plan` for the follow-up implementation packet.
- Run the sibling-lineage convergence at the orchestrator to check cross-lineage agreement on the top-4 recommendations.
- Verify recommendation #2's consumer before scoping.

## 14. CONVERGENCE REPORT

- Stop reason: `max_iterations` (3/3; REQ-001 forced-depth honored — convergence before max was telemetry only)
- Iterations completed: 3
- Questions answered ratio: 5/5
- Average newInfoRatio trend: 0.95 → 0.80 → 0.70 (monotone decline = surface saturation, consistent with the convergence signal semantics)
- Quality guards: source diversity (3 distinct surfaces, 20+ distinct files), focus alignment (one surface per iteration), no single-weak-source (all findings from direct file/command evidence)

## 15. PACKET STATE

- `deep-research-config.json` (status: complete), `deep-research-state.jsonl` (append-only log), `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`, `iterations/iteration-001..003.md`, `deltas/` — all under `research/lineages/pi-flash-a/`.
- No file outside the lineage dir was created, modified, or deleted (containment check passed).

## 16. CONTINUITY NOTES

- Session: fanout-pi-flash-a-1786517927558-l9mbmd; generation 1; lineageMode new.
- Continuity save: skipped by design (detached fan-out child; orchestrator owns parent-packet continuity).

## 17. APPENDIX — MEASUREMENT TABLE

| Template | Raw LOC | L1 | L2 | L3 | L3+ | phase | Gated? |
|----------|---------|----|----|----|-----|-------|--------|
| plan.md.tmpl | 1079 | 170 | — | — | — | — | yes (4 gates) |
| research.md.tmpl | 946 | 944 | 944 | 944 | 944 | 944 | NO (passthrough) |
| spec.md.tmpl | 874 | 143 | 197 | 245 | 281 | 0* | yes (4 gates) |
| checklist.md.tmpl | 593 | 0 | — | — | — | — | yes (L2+) |
| implementation-summary.md.tmpl | 547 | 135 | — | — | — | — | yes (4 gates) |
| tasks.md.tmpl | 431 | 106 | — | — | — | — | yes (4 gates) |
| decision-record.md.tmpl | 289 | 0 | — | — | — | — | yes (L3+) |
| resource-map.md.tmpl | 204 | 202 | — | — | — | — | no |
| handover.md.tmpl | 154 | 152 | — | — | — | — | no |
| debug-delegation.md.tmpl | 140 | 138 | — | — | — | — | no |
| phase-parent.spec.md.tmpl | 134 | 0* | — | — | — | — | yes (phase) |
| review.spec.md.tmpl | 100 | 100 | — | — | — | — | no (0 gates) |
| context-index.md.tmpl | 50 | 48 | — | — | — | — | partial |
| **Total** | **5541** | | | | | | |

\* phase-parent renders via its own template; spec.md.tmpl renders 0 at phase by contract. (— = not re-measured at that level; gating pattern confirmed from gate markers.)
