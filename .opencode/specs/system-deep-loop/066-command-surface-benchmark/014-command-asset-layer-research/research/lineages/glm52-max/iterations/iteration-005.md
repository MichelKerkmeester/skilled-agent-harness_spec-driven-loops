# Iteration 5: RQ5 — Generation, ergonomics, fat-router decomposition, and the cross-RQ backlog

## Focus
Close the loop: how the OWNED ASSETS table, PRESENTATION BOUNDARY, and mode table are RENDERED from the contract (ending the 20/15 + table/list drift); how overgrown display/workflow blocks move out of fat routers (`deep/*`) into asset files; how mislabeled `.txt` ownership entries are corrected and prevented (AL6). Then consolidate RQ1–RQ5 into a prioritized, dependency-ordered candidate-delta backlog that refines the 012 K/W/G remediation phases for the asset layer.

## Findings

### F5.1 — Render the three router sections FROM the contract (the drift-ending mechanism)
RQ1–RQ4 established the contract fields: `owned_assets[]` (D1.5), `mode_matrix` (D3.3), `presentation.{owner, exceptions[]}` (D2.1/D2.2), `workflow_schema_ref` (D1.1). The router's three hand-authored sections are each a *deterministic projection* of these fields, so they should be GENERATED, not hand-maintained:
- **OWNED ASSETS** ← `owned_assets[]` (kind + path + purpose), rendered in ONE schema (closes the 20-vs-15 split of F1.3).
- **EXECUTION TARGETS** ← `mode_matrix` (declared_modes + mode_assets + default_policy), rendered as a `| Mode | Target |` table (closes the table-vs-list split of F1.4 and unblocks the D3.1 completeness check).
- **PRESENTATION BOUNDARY** ← `presentation.owner` + `presentation.exceptions[]`, rendered with the sanctioned exceptions named (closes the triple-path drift of F2.4 / AL6).

This is the mechanism that makes prose and wiring unable to drift (RQ1's core ask): the prose is no longer authored, it is emitted, and a check asserts the rendered section equals the contract projection. The renderer lives in the create-command generator (`create-command/`); the invariant check lives in the adapter/validator.

[SOURCE: .opencode/skills/sk-doc/create-command/assets/command_router_template.md:61-104 (sections to render)]
[SOURCE: 012/research/research.md:140-142 (G1: render tables from contract)]

**Candidate delta D5.1 (renderer + projection invariant):** Add a contract→router-section renderer to the create-command generator and a `CMD-S7-CONTRACT-PROJECTION-DRIFT` check (P1) that fails when a rendered section disagrees with its contract source. Target: `create-command/` renderer + `sk-doc-command.cjs` (new S7). Acceptance: changing `owned_assets[]` in the contract regenerates the OWNED ASSETS table; a hand-edit to the table that diverges from `owned_assets[]` fails S7; new workflow routers need zero copied family boilerplate.

### F5.2 — Decompose the `deep/research.md` fat router: the `⛔` box and AUTONOMOUS DIRECTIVE are display content leaking inline
`deep/research.md` is 184 lines for the same workflow-YAML-backed topology that `create/command.md` covers in 54. The overgrowth is display/workflow content inlined in violation of the router's OWN PRESENTATION BOUNDARY (`deep/research.md:168-176`, which lists "consolidated setup prompt text" and "dashboard/checkpoint layout" as `.txt`-only):
- **Lines 40-80 — "PHASE 0: DISPATCH-CONTEXT CHECK"**: a full gate with an ASCII display box (`⛔ DIRECT INVOCATION REQUIRED`, `:64-72`). This is a *failure-display template* — pure presentation content. It belongs in `deep_research_presentation.txt`, with the router reduced to "Run Phase 0 dispatch-context check (presentation contract) → bind `general_agent_verified`."
- **Lines 85-116 — "MANDATORY INPUT GATE" + "AUTONOMOUS EXECUTION DIRECTIVE (:auto)"**: large inline protocol blocks. The autonomous directive is an execution-protocol description that the `_auto.yaml` already owns (`deep_research_auto.yaml` carries the loop setup/dispatch contract). Inlining it in the router duplicates the YAML's ownership and is the deep-family analogue of the create-family `$ARGUMENTS` echo drift (012): sibling-copied prose that rots.

Contrast with the sanctioned `memory/search` exception (F2.2): that inlines a *machine-emit envelope* (render contract, audience=deterministic). The deep `⛔` box is *human-audience display* → by the F2.5 audience/determinism discriminator it is a LEAK, not an exception. So the decomposition is: move the Phase-0 box + autonomous directive to the presentation asset / auto-YAML; if any fragment is a genuine render contract, declare it under `presentation.exceptions[]` (F2.2) — but the box is not.

[SOURCE: .opencode/commands/deep/research.md:40-80,85-116,168-176]
[SOURCE: .opencode/commands/create/command.md (54-line thin exemplar)]
[SOURCE: iteration-002.md F2.5 (audience/determinism discriminator)]

**Candidate delta D5.2 (deep fat-router slimming):** Move `deep/research.md` Phase-0 display block (incl. the `⛔` box) into `deep_research_presentation.txt`; move the autonomous-execution directive into `deep_research_auto.yaml` (its rightful owner); reduce the router to setup-binding + asset-loading like `create/command.md`. Apply the same to the other deep/* fat routers (review/ai-council/alignment/etc.) via the renderer (D5.1) once the contract is in place. Acceptance: `deep/research.md` shrinks toward the create-thin shape; the Phase-0 box renders from the presentation asset; no deep router inlines a human-audience display box without a declared exception; S5 (intent-aware, F2.3) flags the pre-fix state and passes the post-fix state.

### F5.3 — AL6 correction + prevention: the `.txt` ownership label is the canary, not the disease
012 AL6 ("some `.txt` ownership labels wrong") is the visible symptom of the triple-path drift (F2.4): the presentation path is hand-copied into OWNED ASSETS, EXECUTION TARGETS step 1, and PRESENTATION BOUNDARY, and when one copy lags the "ownership label" is wrong. The `doctor` family also names its `.txt` per-route (`doctor_mcp_presentation.txt`, `doctor_speckit_presentation.txt`, `doctor_update_presentation.txt`) rather than per the `<ns>_<action>` triad convention, so a naming-convention check has no single rule. Correction = regenerate the three rows from one `presentation.owner` (D2.1/D5.1). Prevention = the S7 projection invariant (D5.1) makes a divergent label a hard fail. No per-command `.txt` relabeling is needed first — the contract path is authoritative; the rendered rows follow. (If a path is genuinely wrong — points to a non-existent file — the existing reachability check S2 already catches it; AL6 is about *label* drift between three correct-enough copies, which only the single-source fix resolves.)

[SOURCE: .opencode/commands/doctor/mcp.md:22, doctor/speckit.md:23, doctor/update.md:22]
[SOURCE: .opencode/commands/create/command.md:22,33,44 (three copies)]
[SOURCE: 012/research/research.md:134,140-142 (AL6, G1/G2)]

**Candidate delta D5.3:** Fold AL6 remediation into D2.1 + D5.1 (single typed `presentation.owner` + projection invariant). Add a contract validation that `presentation.owner` resolves and has asset kind `presentation`. Acceptance: changing the `.txt` path in the contract updates all three rendered rows; a router with three divergent paths fails S7; no manual `.txt` relabeling required for the label-drift class.

### F5.4 — Cross-RQ prioritized asset-layer backlog (refines 012 K/W/G)
Consolidating D1.1–D5.3 into a dependency-ordered backlog. IDs map onto 012 tiers (K=keystone, W=wholesale, G=generation) so this packet refines, not replaces, the 012 remediation plan.

**Tier K — Keystone enablers (do first; unblock the rest):**
| ID | Delta | Targets | Acceptance criterion | 012 ref |
|----|-------|---------|----------------------|---------|
| **A-K1** | Executable-edge cycle parsing (tiered structural + comment-stripped) | `validate-command-references.cjs:extractCommandTargets`, `sk-doc-command.cjs:checkRouteGraph`, regression fixture | Comment-only refs yield zero route edges; real two-YAML cycle still fails P0 with executable-field path; the 3 current comment-derived "P0 cycles" downgrade/vanish | K3 / AL4 (F4.3/F4.4) |
| **A-K2** | Command contract fields (`owned_assets[]`, `mode_matrix`, `presentation.{owner,exceptions[]}`, `workflow_schema_ref`) + workflow-YAML schema (`command-workflow.schema.yaml`, `confirm==auto+checkpoints`) | `create-command/SKILL.md`, `command_router_template.md`, new schema under `create-command/assets/` | A `_confirm.yaml` dropping an `_auto.yaml` step fails schema; a contract field set renders all three router sections | K2 (F1.1/F1.5) |

**Tier W — Wholesale canon + checks:**
| ID | Delta | Targets | Acceptance criterion | 012 ref |
|----|-------|---------|----------------------|---------|
| **A-W1** | Mode-completeness check (two-sided, matrix-gated) | `sk-doc-command.cjs` (new S6), fixtures | Declared mode missing asset OR row → `CMD-S6-MODE-INCOMPLETE` P1; orphan asset → P2; `declared_modes:[]` exempts doctor/memory | W6 / AL1 (F3.1/F3.2) |
| **A-W2** | Route-manifest argv-router topology named in both vocabularies | `command_router_template.md` §3, `validate-command-references.cjs:203-227` | Doctor classifies canonically under both canon + adapter names; canon no longer claims doctor has "No workflow YAML" | W5 / AL5 (F4.1) |
| **A-W3** | Intent-aware presentation-ownership check (contract-driven `owner`+`exceptions[]`) | `sk-doc-command.cjs:456-494`, contract `presentation.exceptions[]` | Sanctioned exception passes; undeclared inline display box fails; `memory/search` clean without allowlist | (AL3, F2.3) |
| **A-W4** | Standardize OWNED ASSETS + EXECUTION TARGETS table schemas | `command_router_template.md` §2/§4, renderer | 20/15 split collapses to one schema; EXECUTION TARGETS is a `| Mode | Target |` table everywhere | (AL2, F1.3/F1.4) |

**Tier G — Generation + ergonomics:**
| ID | Delta | Targets | Acceptance criterion | 012 ref |
|----|-------|---------|----------------------|---------|
| **A-G1** | Contract→router-section renderer + projection invariant (S7) | `create-command/` renderer, `sk-doc-command.cjs` S7 | Rendered sections equal contract projection; hand-edit drift fails; new routers need zero copied boilerplate | G1 (F5.1) |
| **A-G2** | deep/* fat-router slimming (move Phase-0 box + autonomous directive to asset/YAML) | `deep/research.md`, `deep_research_presentation.txt`, `deep_research_auto.yaml`; other deep/* | deep routers approach create-thinness; no human-audience display box inline without declared exception | G1/G2 (F5.2) |
| **A-G3** | AL6 label-drift prevention via single typed `presentation.owner` | folded into A-K2/A-G1 | Three rows render from one owner; divergent paths fail S7 | G2 / AL6 (F5.3) |

**Dependency spine:** A-K1 (cycle parser) is independent and unblocks trusting the 066 P0 cycle findings. A-K2 (contract+schema) → (A-W1, A-W2, A-W3, A-W4) → A-G1 → (A-G2, A-G3). A-K1 and the A-K2 chain run in parallel.

[SOURCE: 012/research/research.md:56-83 (K/W/G tiers + dependency spine)]
[SOURCE: iterations 1-4 findings D1.1-D4.5]

### F5.5 — Asset-layer design principle (synthesis-ready)
Across RQ1–RQ5 one principle recurs: **the triad structure is right; the contract that describes it is missing.** Every defect AL1–AL6 is a symptom of describing a stable runtime structure (the triad, the route manifest, the presentation owner, the mode policy) in *duplicated prose* instead of *one typed source*. So the remediation is uniformly "capture the existing shape as data, render the prose from it, and fail on drift" — never "redesign the assets" and never "patch command-by-command." This is the asset-layer instantiation of 012's whole-packet thesis (schema/contract first → checks → generation → local cleanup last), narrowed to the files this packet owns.

[SOURCE: 012/research/research.md:117-143 (build-on-triad thesis)]
[SOURCE: iterations 1-5]

## Sources Consulted
- Fat router: `deep/research.md` (full) vs `create/command.md` (thin exemplar).
- Canon + 012 tiers: `command_router_template.md`; `012/research/research.md:56-83,117-143`.
- All prior iteration findings D1.1–D4.5.

## Assessment
- **newInfoRatio: 0.6** — RQ5's mechanism (render-from-contract) and the fat-router decomposition are the convergent application of RQ1–RQ4; the new content is the concrete deep/* inline-block inventory (F5.2), the AL6-as-canary reframing (F5.3), and the consolidated asset-layer backlog (F5.4) that refines 012's K/W/G into asset-specific A-K/A-W/A-G items with a dependency spine.
- **Novelty justification:** Ties all six AL defects to a single root (described-in-prose-not-data) and a single remediation pattern (capture→render→fail-on-drift), producing a backlog that maps 1:1 onto 012's tiers so the remediation phases can be authored from verified, file-cited detail rather than headlines.
- **Confidence:** high on F5.1/F5.3/F5.4/F5.5 (synthesis grounded in 4 prior iterations + 012); high on F5.2 (inline blocks directly observed; classification via the F2.5 discriminator).
- **RQ5 answer complete:** render-from-contract mechanism defined; fat-router decomposition scoped with exemplar lines; AL6 prevention folded into the contract; backlog delivered.

## Reflection
- **What worked:** Measuring `deep/research.md` (184 lines) against `create/command.md` (54 lines) for the same topology — the fat-router defect became a line-count delta plus a precise block inventory, not a vibe.
- **What failed / ruled out:** Initially listed AL6 as a separate `.txt`-relabeling task — rejected once F2.4 showed the label drift is a symptom of triple-path duplication; folded it into the single-owner fix so the remediation doesn't patch symptoms.
- **Ruled out:** "Slim deep/* routers by hand one-by-one before the contract" — the 012 A7 anti-pattern; do it via the renderer (A-G1/A-G2) after the contract lands.
- **Status:** all five RQs answered with evidence-backed candidate deltas. Forced non-convergence held (5/5; convergence was telemetry-only). Proceeding to phase_synthesis.
