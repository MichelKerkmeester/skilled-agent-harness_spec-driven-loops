# Command Asset-Layer Research — Cross-Model Synthesis

> **Packet:** `066-command-surface-benchmark/014-command-asset-layer-research`
> **Run:** deep-research fan-out, 2 lineages × 5 forced iterations (10 total), `stopPolicy: max-iterations` (convergence telemetry-only).
> **Lineages:** `gpt56-sol-xhigh-fast` (cli-codex / `gpt-5.6-sol` / **xhigh** / fast) · `glm52-max` (cli-opencode / `zai-coding-plan/glm-5.2` / max).
> **Scope:** research + synthesis only. No shipped runtime touched. Every delta is a candidate proposal.
> **This document** reconciles the two lineage syntheses (`lineages/*/research.md`) and deepens the six asset-layer defects (AL1–AL6) from the 012 run into contract-ready detail.

---

<!-- ANCHOR:findings -->

## 1. EXECUTIVE SYNTHESIS

Both models — one at `xhigh`, one at `max`, each forced through five non-converging iterations — sharpened the 012 asset-layer diagnosis to one sentence:

> **The triad structure is right; the contract that describes it is missing.** Every one of the six asset-layer defects is a symptom of describing a *stable runtime shape* in *duplicated prose* instead of *one typed source*. So the fix is uniformly "capture the existing shape as typed data, render the prose from it, and fail on drift" — never redesign the assets, never patch command-by-command.

The single most important result is concrete, not architectural: **the AL4 false-cycle defect is now proven, not hypothesized.** GLM located the smoking gun — `validate-command-references.cjs:extractCommandTargets` (`:185-193`) runs a raw-text regex (`:55`) with **no comment stripping**, and shipped comment lines match it: `doctor/_routes.yaml:5,240` and `create_readme_auto.yaml:37` / `create_readme_confirm.yaml:9,40`. The `create/readme.md ↔ create_readme_auto.yaml:37` pair **fires a false `CMD-S3-ROUTE-CYCLE` P0 today.** GPT independently reached the same conclusion and added that reciprocal-only detection also *misses* real cycles longer than two nodes. **Some of 066's P0 cycle findings are therefore false, and some real cycles could be missed.**

---

## 2. CROSS-MODEL AGREEMENT MATRIX (HIGH confidence — both, independently)

| # | Finding | GLM | GPT |
|---|---------|-----|-----|
| B1 | **AL4 proven: comments parsed as route edges → false P0 cycles.** Raw-text extraction with no comment stripping; concrete offending lines cited. | §1.1, kf1 (`create/readme.md ↔ create_readme_auto.yaml:37`) | rq4-f3, P0 delta, acceptance matrix ("comment-only route → zero edges") |
| B2 | **Cycle detection must use strongly-connected components, not reciprocal-only.** Reciprocal-only misses cycles >2 nodes. | tiered detection (D4.4) | rq4-f5 ("SCC not reciprocal-only") |
| B3 | **The workflow-YAML schema is real, stable (`confirm == auto + checkpoints`), but absent from canon AND validator.** The strongest layer has no machine contract. | kf2, D1.1 | rq1-f1/f2, §9 contract |
| B4 | **The command contract is a discriminated union of topologies** (mode-pair, subaction/route-manifest, direct-dispatch), not a universal triad. | D1.5, kf5 | rq1-f4 (discriminated union) |
| B5 | **doctor is a manifest-backed *subaction* router — a SUBTYPE, not a 5th top-level topology.** Canon misclassifies it as "direct-dispatch, no workflow YAML" (`command_router_template.md:112-116`), which is factually wrong (`doctor/update` owns a YAML). | kf5, D4.1 | rq4-f1, ruled-out "Fifth route-manifest topology"; add `routingSource: manifest\|inlineTable` under subaction |
| B6 | **Mode completeness ≠ reachability.** The adapter checks only that referenced files resolve; nothing checks a declared mode has its asset AND its EXECUTION TARGETS row (two-sided). Corpus is only *accidentally* complete (28 `:auto` routers, 28 `_auto.yaml`). | kf3, D3.1/D3.2 | rq3-f1/f4, §10 algorithm |
| B7 | **Mode-default policy is per-command/per-family typed, with no universal default.** create→confirm, design→conditional-auto, deep→ask, speckit aliases→auto. | D3.3 (enum `{confirm, conditional-auto, ask, confirm-only}`) | rq3-f2/f3 (family baseline + override) |
| B8 | **Presentation is asset-owned; `memory/search` is a bounded typed exception (render-fidelity), not router-owned presentation.** Needs typed `presentation.exceptions[]` with anchors so an intent-aware check sanctions it without an allowlist. | kf6, D2.1/D2.2 | rq2-f1/f3/f4, P1 memory/search anchors |
| B9 | **`.txt` mislabel (AL6) = generated-prose / triple-path drift.** Fix = one typed `presentation.owner` + a projection invariant, not per-command relabeling. | kf7, D2.4/D5.3 | rq2-f5, rq5-f4 |
| B10 | **Render the four generated sections from one record + a `--check` projection-drift gate.** Ends the drift mechanism. | D5.1 (S7 invariant) | rq5-f1/f2, P0 `render-command-sections.cjs --check` (byte-identical) |
| B11 | **Fat-router (deep/*) extraction is ownership-first, not LOC-based.** `deep/research.md` inlines a display box + autonomous directive its own PRESENTATION BOUNDARY says belong in the asset — a leak, LOC is only a triage signal. | kf8, D5.2 | rq5-f3, ruled-out "LOC-only fat-router failure" |

Both lineages **ruled out the same alternatives**: universal `_auto`/`_confirm` triad · literal YAML-key canonicalization · blanket inline-presentation ban · router-owned `memory/search` · one global default mode · one-mode-per-asset · reachability-as-completeness · a fifth top-level route-manifest topology · comment-strip-plus-regex · reciprocal-only cycle detection · hand-authored generated tables · LOC-only fat-router failure · compiled executor contract as router source.

---

## 3. MODEL-UNIQUE FINDINGS (single-lineage — worth a verify pass)

**GLM-only (concrete corpus evidence):**
- **OWNED ASSETS table format is split 20-vs-15** — 20 commands use 2-col `| Purpose | Asset |`, 15 use 3-col `| Asset | Path | Purpose |`, and **the create family disagrees with the create-command canon's own template** (`command_router_template.md:63-67` vs `create/command.md:20`). New defect → delta **A-W4**.
- EXECUTION TARGETS is a table in `deep/*` but a numbered prose list in `create/*` — standardize to `| Mode | Target |` (D1.4), which is the parse target the mode-completeness check reads.

**GPT-only (architecture depth):**
- Full **discriminated-union contract schema** (`command-contract.schema.json`) with typed producers/consumers for bindings/placeholders (rq1-f3).
- **Deterministic `render-command-sections.cjs --check`** requiring byte-identical re-renders (P0).
- A **14-row acceptance-test matrix** of invalid mutations → expected failures (mode asset/row completeness, paired deletion, alias cardinality, direct-topology exemption, bounded exception, media coherence, comment-only route, 3-node cycle, generated freshness, workflow/presentation leaks).
- **`routingSource: manifest | inlineTable`** as the clean taxonomy resolution (keep 4 top-level classes; doctor is a subaction subtype).
- Move the **deep compiler's shared fields behind the versioned record** (`compile-command-contracts.cjs`), keeping executor-only metadata local.

---

## 4. RECONCILED ASSET-LAYER BACKLOG (refines 012 K/W/G · maps to 013 phases)

`A-` = asset-layer item. Each maps to a 012 tier, an AL defect, and a 013 phase.

### Tier A-K — Keystone (do first; parallelizable)
| ID | Delta | Targets | Acceptance | 012 → 013 |
|----|-------|---------|-----------|-----------|
| **A-K1** | Executable-edge parsing (schema-aware typed edges) + SCC cycle detection | `validate-command-references.cjs:55,185-193`; `sk-doc-command.cjs:410-419`; mutation fixtures | Comment-only refs → zero edges; the `create/readme.md↔create_readme_auto.yaml:37` false P0 vanishes; a real ≥2-node typed cycle still fails with field locations | K3 / AL4 → **phase 002** |
| **A-K2** | Discriminated-union command contract (`owned_assets[]`, `mode_matrix`, `presentation.{owner,exceptions[]}`, `workflow_schema_ref`) + `command-workflow` schema (`confirm==auto+checkpoints`); one record per command | new schema + records under `create-command/assets/`; `create-command/SKILL.md`; `command_router_template.md` | Six-family fixtures validate; a `_confirm.yaml` dropping an `_auto.yaml` step fails; unbound placeholder / unknown topology / missing owner / media mismatch fail | K2 / AL2,AL3 → **phase 001** |

### Tier A-W — Wholesale canon + checks
| ID | Delta | Targets | Acceptance | 012 → 013 |
|----|-------|---------|-----------|-----------|
| **A-W1** | Mode-completeness check (two-sided, matrix-gated) | `sk-doc-command.cjs`; `validate_document.py`; fixtures | Declared mode missing asset OR row → fail; orphan asset → fail; `declared_modes:[]` exempts doctor/memory; valid aliases pass | W6 / AL1 → **phase 003** |
| **A-W2** | Name doctor's manifest subtype (`routingSource: manifest\|inlineTable` under subaction router); fix "no workflow YAML" misclassification | `command_router_template.md` §3; `000/topology-taxonomy.md`; `validate-command-references.cjs` | Census stays at 4 top-level classes; doctor resolves to a deterministic subtype; canon no longer claims doctor has no YAML | W5 / AL5 → **phase 004** |
| **A-W3** | Intent-aware presentation-ownership check (contract-driven) | `sk-doc-command.cjs:456-494`; `presentation.exceptions[]`; `memory/search` anchors | Sanctioned exception passes on exact declared surfaces; undeclared inline display box fails; `memory/search` clean without an allowlist | (AL3) → **phase 003** |
| **A-W4** | Standardize OWNED ASSETS (one schema) + EXECUTION TARGETS (`\| Mode \| Target \|`) | `command_router_template.md` §2/§4; renderer | 20/15 split collapses to one schema; targets are a table everywhere | (AL2) → **phase 001/005** |

### Tier A-G — Generation + ergonomics
| ID | Delta | Targets | Acceptance | 012 → 013 |
|----|-------|---------|-----------|-----------|
| **A-G1** | Contract→section renderer + `--check` projection invariant | new `render-command-sections.cjs`; `sk-doc-command.cjs` | Two renders byte-identical; one asset-path change updates ownership + target sections together; stale committed text fails `--check` | G1 → **phase 005** |
| **A-G2** | deep/* fat-router slimming (hard ownership leaks first, LOC only as a warning) | `deep/{research,review,…}.md` + owned assets | Routers keep gates/binding/mode-selection/summary; display + workflow leaks move to assets; behavior snapshots unchanged | G1/G2 → **phase 005** |
| **A-G3** | AL6 label-drift prevention (single typed `presentation.owner`) | folded into A-K2 / A-G1 | Three rows render from one owner; divergent paths fail `--check`; "presentation Markdown owns" phrases fall to zero | G2 / AL6 → **phase 005** |

**Dependency spine:** `A-K1` (independent — unblocks trusting 066's P0 cycle findings) ∥ `A-K2` → (`A-W1`, `A-W2`, `A-W3`, `A-W4`) → `A-G1` → (`A-G2`, `A-G3`).

**AL1–AL6 coverage:** AL1→A-W1 · AL2→A-K2/A-W4 · AL3→A-K2/A-W3 · AL4→A-K1 · AL5→A-W2 · AL6→A-G3. All six mapped to a delta with target + acceptance.

---

## 5. SEQUENCING & OWNERSHIP

1. **A-K1 first and independently** — the proven false-cycle mechanism means some 066 P0 cycle findings are not real; fix the parser (phase 002) before acting on those P0s. Add SCC detection so real long cycles are caught too.
2. **A-K2 next (the contract lands in phase 001).** Canonize before enforcing: the mode matrix, the doctor subtype, and the presentation fields all *describe* shapes that must exist as data before their checks can read them.
3. **A-W tier after the contract** — each check reads a contract field.
4. **A-G tier last** — render-from-contract and fat-router slimming are the payoff, not the foundation.
5. **Respect the 066 ownership boundary** — no parallel asset-lint engine; extend `validate-command-references.cjs` + `sk-doc-command.cjs` + the create-command canon. Keep prose-level detection in the lighter validator layer.

---

## 6. RUN PROVENANCE (forced non-convergence — verified)

- **Iterations:** both lineages 5/5 (`iterations/iteration-001..005.md`), one RQ per iteration, each broadening a distinct angle; 10 total.
- **Stop reason:** `maxIterationsReached` on both — not convergence.
- **Non-convergence proof:** GPT new-info ratios flat at **0.90 ×5** (composite STOP 0.35, well below the `>0.60` threshold — "not needed for the hard iteration cap"). GLM ratios 1.0 → 0.78 → 0.80 → 0.82 → 0.60 (avg 0.80, no early stop).
- **Route proof:** `mode: research`, `loopType: research`, correct executor on all iteration records.
- **Artifact boundary:** all writes under each lineage dir only; no shipped runtime touched.

---

## 7. OPEN QUESTIONS (for the remediation phases)

- Is the `mode_matrix.default_policy` enum `{confirm, conditional-auto, ask, confirm-only}` exhaustive, or do the remaining `speckit/*` and `deep/*` add a fifth policy? (verify before codifying A-K2 / phase 001)
- Should the doctor manifest subtype carry a blocking core beyond OWNED ASSETS + PRESENTATION BOUNDARY (e.g. a required `_routes.yaml` + route-validate gate)?
- Are any inlined `deep/*` autonomous-directive fragments genuine *render contracts* (sanctionable under `render-fidelity`) rather than display leaks? Per-file classification during A-G2.
- Ratify the contract/schema/renderer **filenames and layout** in phase 001 (both models specified roles + acceptance, not final filenames).
- Does the intent-aware leak check (A-W3) need a curated display-vocabulary allowlist before promotion to avoid noise?

---

## 8. DESIGN PRINCIPLE (one sentence)

**The triad structure is right; the contract that describes it is missing — so capture the existing shape as typed data, render the prose from it, and fail on drift.** Every AL defect is an instance; the backlog (§4) is its asset-layer remediation plan, feeding 013 phases 001–005.

<!-- /ANCHOR:findings -->
