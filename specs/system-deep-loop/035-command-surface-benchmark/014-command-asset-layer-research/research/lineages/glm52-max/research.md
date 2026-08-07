# Command Asset-Layer Research — glm52-max lineage synthesis

> **Packet:** `066-command-surface-benchmark/014-command-asset-layer-research`
> **Lineage:** `glm52-max` (cli-opencode / `zai-coding-plan/glm-5.2` / max) — detached fan-out.
> **Run:** deep-research, 5 forced iterations (`stopPolicy: max-iterations`; convergence telemetry-only).
> **Scope:** research + synthesis only. No shipped runtime touched. Every delta is a candidate proposal for a follow-on remediation packet.
> **This document** is the canonical lineage synthesis over `iterations/iteration-001..005.md`. The parent session cross-reconciles this lineage with the `gpt56-sol-xhigh-fast` sibling.

---

## 1. EXECUTIVE SYNTHESIS

The 012 run established the asset **structure** — the `OWNED ASSETS` + `PRESENTATION BOUNDARY` router sections, and the `_auto.yaml` / `_confirm.yaml` / `_presentation.txt` triad — as the system's single strongest layer (35/35). This drill confirms the diagnosis and sharpens it to one sentence:

> **The triad structure is right; the contract that describes it is missing.** Every one of the six asset-layer defects (AL1–AL6) is a symptom of describing a stable runtime shape in *duplicated prose* instead of *one typed source*, so the fix is uniformly "capture the existing shape as data, render the prose from it, and fail on drift" — never "redesign the assets", never "patch command-by-command."

Five iterations, one per research question, each broadening a distinct angle (forced non-convergence), converge on a single corrective pattern with three concrete keystones:

1. **A-K1 — Executable-edge cycle parsing.** The AL4 defect is no longer a hypothesis. It is *proven*: `validate-command-references.cjs:extractCommandTargets` (`:185-193`) runs a raw-text regex `COMMAND_TARGET` (`:55`) with **no comment stripping**, and the corpus contains comment lines that match it — `doctor/_routes.yaml:5` ("`Read by: .opencode/commands/doctor/speckit.md`"), `_routes.yaml:240`, and `create_readme_auto.yaml:37` / `create_readme_confirm.yaml:9,40` (comment → `.opencode/commands/create/readme.md`). The router↔YAML pair (`create/readme.md` ↔ `create_readme_auto.yaml:37`) fires a real false `CMD-S3-ROUTE-CYCLE` P0 today. Some of 066's P0 cycle findings are therefore false. Fix = tiered structural dispatch-field parsing + comment-stripped secondary signal.

2. **A-K2 — A typed command contract + workflow-YAML schema.** The canonical workflow-YAML schema is observable (`identity`, `operating_mode`, `user_inputs`/`input_contract`, `context_loading`, `workflow_enforcement`/`gate_logic`, `workflow` steps, `rules`) and obeys one invariant — `confirm == auto + checkpoints` — but it is **nowhere captured as a machine-checkable contract**. The contract fields (`owned_assets[]`, `mode_matrix`, `presentation.{owner,exceptions[]}`, `workflow_schema_ref`) make the three router sections *rendered projections* instead of hand-copied prose, which is the mechanism that ends drift.

3. **A-W1 — Mode completeness, two-sided and matrix-gated.** The adapter has `checkMirrorAndReachability` (reachability only) and `checkCapabilitiesAndSafety`, but **no `checkModeCompleteness`**: it flags a missing *file*, never a missing *declaration*. The corpus is only accidentally complete (28 `:auto` routers, 28 `_auto.yaml`). The check is gated on a `mode_matrix` whose `default_policy` enum legitimizes the three real, distinct defaults — create→confirm, design→conditional-auto, deep→ask — **without forcing one default**, and `declared_modes: []` cleanly exempts the non-triad topologies (doctor/update, memory/*).

The synthesis reframes the six AL defects from headlines to filed, file-cited evidence with a dependency-ordered backlog (§4) that maps 1:1 onto 012's K/W/G tiers.

---

## 2. PER-RQ ANSWERS (evidence + candidate deltas)

### RQ1 — Workflow-YAML schema + corpus divergence
The `_auto.yaml`/`_confirm.yaml` triad shares a fixed top-level node set across create/design/deep/speckit and obeys `confirm == auto + checkpoints` (auto: `operating_mode.workflow_execution: autonomous`, no `checkpoint:` blocks; confirm: `interactive` + `checkpoint_options` + per-step `checkpoint:`). This schema is **inducible from the corpus but absent from canon and validator**. Two newly-measured divergences live inside the "strongest" layer: the OWNED ASSETS table is split **20 (2-col `| Purpose | Asset |`) vs 15 (3-col `| Asset | Path | Purpose |`)** — and the create family (which the create-command canon *generates*) disagrees with the canon's own template; EXECUTION TARGETS is a table in deep but a numbered prose list in create. Placeholder grammar (`[TOKEN]` + `FROM <phase>`) is consistent but uncanonized, forcing sibling-copy.
- **D1.1** `command-workflow.schema.yaml` + `confirm==auto+checkpoints` invariant. **D1.2** canonize placeholder grammar. **D1.3** unify OWNED ASSETS schema. **D1.4** standardize EXECUTION TARGETS as `| Mode | Target |`. **D1.5** contract field set (spine). *(iteration-001.md F1.1–F1.5)*

### RQ2 — Presentation ownership + typed inline-exception
`_presentation.txt` ownership is uniform and clear across all 35 routers (the `.txt` is the single source of truth; the router owns routing only) — the gap (AL3) is representational: ownership is a prose sentence copied 35×, with **no typed carrier**. The legitimate inline exception is `memory/search`, which inlines a fixed machine-emit envelope (`MEMORY:SEARCH "<query>" … STATUS=OK RESULTS=<n>`) "as a hard render reminder" (`memory/search.md:139`) — sanctioned because it is a *deterministic render contract*, not human-audience display. Today it is captured only by that prose phrase, so the adapter's blunt substring leak-check (`sk-doc-command.cjs:456-494`) cannot distinguish it from a real leak. The audience/determinism discriminator (F2.5) classifies content: human-audience/templated → `.txt`; fixed machine envelope enforced at dispatch → typed `render-fidelity` exception. AL6's "wrong `.txt` ownership labels" is the visible symptom of **triple-path drift** (the path is hand-copied into OWNED ASSETS + EXECUTION TARGETS + PRESENTATION BOUNDARY).
- **D2.1** typed `presentation.owner`. **D2.2** `presentation.exceptions[]` with reason enum. **D2.3** intent-aware S5. **D2.4** collapse triple-path to one owner. **D2.5** canonize the boundary rule. *(iteration-002.md F2.1–F2.5)*

### RQ3 — Mode completeness + the mode matrix
The adapter checks **reachability, never completeness**: `inspectCommandSurface` (`validate-command-references.cjs:262-351`) records a `command-target` violation only when a referenced path does not resolve — never when an advertised mode lacks its asset or EXECUTION TARGETS row. There is no `checkModeCompleteness`. The gap is two-sided (declared-but-unwired AND wired-but-undeclared) and must be topology-aware: `doctor/update` (single YAML, "always interactive; deleted mode suffixes are invalid", `:29`) and `memory/*` (presentation-only) are legitimately not triads. The `mode_matrix` records `declared_modes`, a `default_policy` **enum** (confirm | conditional-auto | ask | confirm-only) that holds all three real policies without forcing one, `default_condition`, and `mode_assets`. `declared_modes: []` exempts non-triad topologies. The EXECUTION TARGETS table (D1.4) is the prerequisite parse target for the check.
- **D3.1** `checkModeCompleteness` (S6). **D3.2** two-sided, matrix-gated. **D3.3** `mode_matrix` field. **D3.4** D1.4→D3.1 dependency + invariant. **D3.5** `declared_modes:[]` exemption. *(iteration-003.md F3.1–F3.5)*

### RQ4 — Route-manifest YAMLs + executable-edge cycle parsing
`doctor/_routes.yaml` is a distinct **route-manifest** schema: `schema_version: 1` + `routes[]` (10 targets, each `target`/`yaml`/`setup_vars`/`allowed_flags`/`mutating`/`gate3_location`/`mcp_tools`/`script_invocations`/`trigger_phrases`) + `mcp_subroutes[]` + `standalone[]`, with 13 owned per-route `doctor_*.yaml`. It is loader-gated only by the router markdown — its own header (`_routes.yaml:6-14`) states it is "NOT currently harvested by either Skill Advisor implementation" (out of scope by file type AND root). The canon variant table misclassifies doctor as "Direct-dispatch-script … No workflow YAML" (`command_router_template.md:115`) — factually wrong. Name it **route-manifest argv-router** in both the canon and the adapter (which already returns `subaction router` for it).
**AL4 is proven (smoking gun):** `extractCommandTargets` applies `COMMAND_TARGET` raw-text with no comment stripping; `_routes.yaml:5,240` and `create_readme_auto.yaml:37` / `create_readme_confirm.yaml:9,40` are comments that match the regex; the `create/readme.md` ↔ `create_readme_auto.yaml:37` pair fires a false `CMD-S3-ROUTE-CYCLE` P0. Fix = tiered executable-edge parsing (structural dispatch fields → P0; comment-stripped raw-text secondary → P2 advisory), routed through every `extractCommandTargets` consumer (cycle detection, topology classification, reachability, presentation-ownership).
- **D4.1** name the topology. **D4.2** manifest as typed owned asset. **D4.3** executable-edge parsing. **D4.4** tiered detection. **D4.5** single hardened extractor for all consumers. *(iteration-004.md F4.1–F4.5)*

### RQ5 — Generation, ergonomics, fat-router decomposition, AL6
The three router sections are deterministic projections of contract fields and should be RENDERED, not hand-maintained: OWNED ASSETS ← `owned_assets[]`; EXECUTION TARGETS ← `mode_matrix`; PRESENTATION BOUNDARY ← `presentation.{owner,exceptions[]}`. A `CMD-S7-CONTRACT-PROJECTION-DRIFT` check fails when a rendered section disagrees with its source — this is the drift-ending mechanism. `deep/research.md` is a **fat router** (184 lines vs `create/command.md`'s 54 for the same topology): it inlines a `⛔ DIRECT INVOCATION REQUIRED` ASCII display box (`:64-72`) and an "AUTONOMOUS EXECUTION DIRECTIVE" (`:104-116`) — both human-audience display/protocol content that its OWN PRESENTATION BOUNDARY (`:168-176`) says belongs in the `.txt`/YAML. By the F2.5 discriminator these are leaks, not exceptions (contrast `memory/search`'s render contract). AL6 needs no per-command `.txt` relabeling — it folds into single-source `presentation.owner` + the S7 projection invariant.
- **D5.1** renderer + S7 projection invariant. **D5.2** deep/* fat-router slimming. **D5.3** AL6 folded into single-owner. *(iteration-005.md F5.1–F5.3)*

---

## 3. RECONCILED ASSET-LAYER BACKLOG (refines 012 K/W/G)

Dependency-ordered. Each item names targets + acceptance criterion + 012 tier ref. `A-` prefix = asset-layer item (this packet).

### Tier A-K — Keystone enablers (do first; parallelizable)
| ID | Delta | Targets | Acceptance criterion | 012 |
|----|-------|---------|----------------------|-----|
| **A-K1** | Executable-edge cycle parsing (tiered structural + comment-stripped) | `validate-command-references.cjs:55,185-193`; `sk-doc-command.cjs:410-419`; regression fixture | Comment-only refs → zero edges; real two-YAML cycle still P0 with executable-field path; the 3 comment-derived "P0 cycles" downgrade/vanish | K3 / AL4 |
| **A-K2** | Command contract (`owned_assets[]`, `mode_matrix`, `presentation.{owner,exceptions[]}`, `workflow_schema_ref`) + `command-workflow.schema.yaml` (`confirm==auto+checkpoints`) | `create-command/SKILL.md`, `command_router_template.md`, new schema under `create-command/assets/` | A `_confirm.yaml` dropping an `_auto.yaml` step fails schema; the three router sections render from the contract | K2 / AL2,AL3 |

### Tier A-W — Wholesale canon + checks
| ID | Delta | Targets | Acceptance criterion | 012 |
|----|-------|---------|----------------------|-----|
| **A-W1** | Mode-completeness check (two-sided, matrix-gated; S6) | `sk-doc-command.cjs`, fixtures | Declared mode missing asset OR row → `CMD-S6-MODE-INCOMPLETE` P1; orphan asset → P2; `declared_modes:[]` exempts doctor/memory | W6 / AL1 |
| **A-W2** | Route-manifest argv-router topology named in both vocabularies | `command_router_template.md` §3; `validate-command-references.cjs:203-227` | Doctor classifies canonically under both names; canon no longer claims doctor has "No workflow YAML" | W5 / AL5 |
| **A-W3** | Intent-aware presentation-ownership check (contract-driven) | `sk-doc-command.cjs:456-494`; `presentation.exceptions[]` | Sanctioned exception passes; undeclared inline display box fails; `memory/search` clean without allowlist | (AL3) |
| **A-W4** | Standardize OWNED ASSETS + EXECUTION TARGETS table schemas | `command_router_template.md` §2/§4; renderer | 20/15 split → one schema; EXECUTION TARGETS is a `| Mode | Target |` table everywhere | (AL2) |

### Tier A-G — Generation + ergonomics
| ID | Delta | Targets | Acceptance criterion | 012 |
|----|-------|---------|----------------------|-----|
| **A-G1** | Contract→router-section renderer + S7 projection invariant | `create-command/` renderer; `sk-doc-command.cjs` S7 | Rendered sections equal contract projection; hand-edit drift fails S7; new routers need zero copied boilerplate | G1 |
| **A-G2** | deep/* fat-router slimming (Phase-0 box + autonomous directive → asset/YAML) | `deep/research.md`, `deep_research_presentation.txt`, `deep_research_auto.yaml`; other deep/* | deep routers approach create-thinness; no human-audience display box inline without a declared exception | G1/G2 |
| **A-G3** | AL6 label-drift prevention (single typed `presentation.owner`) | folded into A-K2 / A-G1 | Three rows render from one owner; divergent paths fail S7 | G2 / AL6 |

**Dependency spine:** `A-K1` (cycle parser; independent — unblocks trusting 066 P0 cycle findings) ∥ `A-K2` → (`A-W1`, `A-W2`, `A-W3`, `A-W4`) → `A-G1` → (`A-G2`, `A-G3`).

**AL1–AL6 → backlog coverage:** AL1→A-W1 · AL2→A-K2/A-W4 · AL3→A-K2/A-W3 · AL4→A-K1 · AL5→A-W2 · AL6→A-G3. All six defects mapped to a delta with a target + acceptance criterion.

---

## 4. SEQUENCING RECOMMENDATION

1. **A-K1 first and independently.** The proven false-cycle mechanism (§1.1) means some 066 P0 cycle findings are not real — fix the parser before acting on those P0s. Small, isolated, low-risk; touches one extractor + its consumers.
2. **A-K2 next (the contract lands here).** Canonize before enforcing: the mode matrix (A-W1), the route-manifest name (A-W2), and the presentation fields (A-W3) all *describe* shapes that must exist as data before their checks can read them. Enforcing an undescribed rule is what produced today's drift.
3. **A-W tier after the contract exists.** Each A-W check reads a contract field; write the field in A-K2, then the check.
4. **A-G tier last.** Render-from-contract and fat-router slimming are the payoff, not the foundation — doing them before A-K2 would hand-render what the contract should emit.
5. **Respect the ownership boundary.** No parallel asset-lint engine; extend `validate-command-references.cjs` + `sk-doc-command.cjs` + the create-command canon. Keep prose-level detection in the lighter validator layer (per `066/spec.md`).

---

## 5. RUN PROVENANCE (forced non-convergence — verified)

- **Iterations:** 5/5 (`iterations/iteration-001..005.md`); one RQ per iteration, each broadening a distinct angle.
- **Stop reason:** `maxIterationsReached` — not convergence. `stopPolicy: max-iterations`; convergence telemetry-only by design.
- **Non-convergence proof:** newInfoRatio 1.0 → 0.78 → 0.8 → 0.82 → 0.6 (avg 0.80). No early stop; iteration 5 was explicitly the convergent-application pass, not a stop trigger.
- **Route proof:** `mode: research`, `loopType: research`, `executor: cli-opencode/zai-coding-plan/glm-5.2/max` on all 5 iteration records.
- **Artifact boundary:** all writes under `research/lineages/glm52-max/` only; no shipped runtime touched.

---

## 6. OPEN QUESTIONS (for the follow-on remediation packet / sibling reconciliation)

- Does the `gpt56-sol-xhigh-fast` sibling independently reach the same "AL4 proven, not hypothesized" conclusion, and does it surface additional comment→path matches? (strengthen or supplement F4.3)
- Is the `mode_matrix.default_policy` enum `{confirm, conditional-auto, ask, confirm-only}` exhaustive, or do speckit/* and the remaining deep/* introduce a fifth policy? (verify before codifying A-K2)
- Should the route-manifest topology (A-W2) carry its own blocking core beyond `OWNED ASSETS` + `PRESENTATION BOUNDARY` (e.g. a required `_routes.yaml` + route-validate gate)? — 012 Open Question, unresolved here.
- The A-W3 intent-aware leak check depends on display-vocabulary detection; does it need the G3 curated allowlist (012) before promotion to avoid noise?
- A-G2 deep/* slimming: are any of the inlined autonomous-directive fragments genuinely *render contracts* (sanctionable under `render-fidelity`) rather than display content? Per-file classification needed during remediation.

---

## 7. DESIGN PRINCIPLE (one sentence)

**The triad structure is right; the contract that describes it is missing — so capture the existing shape as typed data, render the prose from it, and fail on drift.** Every AL defect is an instance of this; the backlog (§3) is its asset-layer remediation plan.
