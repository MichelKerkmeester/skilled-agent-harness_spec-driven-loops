---
title: "Feature Specification: sk-code Router — Typed-Gold Instrumentation + Live Measurement"
description: "Wave 2 pilot. Bring sk-code's surface router to the typed-pair measurement standard without touching its (already-correct) map: refresh the stale committed baseline, author independently-derived typed gold on the routing scenarios, packet-qualify RESOURCE_MAP paths for typed-pair attribution, re-baseline, and run a live-mode sample to surface the meaningful routing-quality number. Establishes the proven recipe fanned out to the four remaining Wave 2 skills."
trigger_phrases:
  - "sk-code router typed gold"
  - "sk-code stale baseline refresh"
  - "wave 2 pilot sk-code"
  - "sk-code live mode routing sample"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/031-sk-doc-router-alignment/015-sk-code-router-alignment"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded 015 with the corrected Wave 2 scope (no map bugs; measurement-only)"
    next_safe_action: "Refresh the stale sk-code baseline, then author typed gold on routing scenarios"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-sk-code-router-alignment-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Wave 2 path ratified 2026-07-16: high-value path — refresh baseline + typed gold on routing scenarios + packet-qualify + live-mode sample; NOT exhaustive deterministic typed-gold on every scenario"
      - "Recon's sk-code bug claims (11 broken paths, 6 syntax defects, BLOCKED-BY-STRUCTURE) REFUTED: drift-guard 7/7, regex parser ignores commas, fresh run PASS 83 d5=100 — committed baseline was stale (pre-code-webflow reorg)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-code Router — Typed-Gold Instrumentation + Live Measurement

---

## EXECUTIVE SUMMARY

Wave 1 established the typed-pair measurement machinery in the shared skill-benchmark harness and proved, on sk-doc, that the deterministic router-replay is a **coherence gate** — production routing is an LLM reading the surface router, and it generalizes given a correct map. Wave 2 propagates the measurement standard to the five remaining skills; this packet is the **pilot** on sk-code.

A recon pass flagged sk-code as having broken RESOURCE_MAP paths, Python syntax defects, and a BLOCKED-BY-STRUCTURE benchmark verdict. All three were verified against the actual tooling and **refuted**: the surface-router drift-guard passes 7/7, the replay's `parseResourceMap` extracts quoted strings by regex (so missing commas are invisible, not bugs), and a fresh router-mode run returns **PASS, aggregate=83, d5=100, 0 unreachable** — the committed baseline was **stale**, generated before the `code-webflow/`/`code-opencode/` surface-packet reorg.

sk-code's map therefore needs **no correctness edits**. The real gap is measurement: the committed baseline is stale and misleading, and zero playbook scenarios carry typed gold, so the typed-pair and mode-routing dimensions are unscored and no live-mode routing-quality number exists.

**Key Decisions**: Do not edit the map for "correctness" (it is correct — a scope-lock hold). Refresh the stale baseline, author typed gold **only** on genuine routing scenarios (not deterministic command/exit-code scenarios), derive that gold **independently from each scenario's stated intent** (never by replaying router output, which would make gold ≡ output and measure nothing), packet-qualify the shared-tier paths so they attribute to a mode on the typed-pair surface, and run a live-mode sample for the meaningful number.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-16 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/031-sk-doc-router-alignment` |
| **Parent Spec** | ../spec.md |
| **Evidence Source** | This session's verification: drift-guard 7/7, `parseResourceMap` regex read, fresh router run PASS 83 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

sk-code's routing cannot be measured on the typed-pair surface, and its committed benchmark baseline actively misleads:

1. **Stale baseline.** `benchmark/baseline/skill-benchmark-report.json` reports `verdict: BLOCKED-BY-STRUCTURE`, `aggregateScore: null`, and a D5 unreachable list whose every locus is a pre-reorg path form (`references/webflow/...`, `assets/opencode/...`, flat `references/*_detection.md`). A fresh run of the same harness returns PASS 83 with D5=100 and zero unreachable. The committed artifact says sk-code is structurally broken; it is not.
2. **No typed gold.** Zero of the ~30 loaded playbook scenarios carry `expected_leaf_resources` or `expected_workflow_mode`. The scorer computes a flat-string `resourceRecall` but leaves `intentRecall` null, mode-routing unscored ("fixture carries no expected.mode"), and never computes `typedPairRecall`. Routing accuracy is not measured on the canonical `(workflowMode, leafResourceId)` surface.
3. **Shared-tier paths are not mode-attributed.** The ~7 always-loaded/universal RESOURCE_MAP entries use the flat `references/...` form. They resolve on disk via the `shared/` alias (hence the passing drift-guard), but on the typed-pair surface they carry no mode identity, so they cannot form a canonical typed pair.

### Purpose

Make sk-code's routing measurable on the typed-pair surface and via live-mode, refresh the misleading baseline, and prove the Wave 2 recipe end-to-end so it can be fanned out to sk-design, system-code-graph, system-deep-loop, and sk-prompt.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Baseline refresh.** Re-run the router-mode skill-benchmark for sk-code and replace the stale committed `benchmark/baseline/skill-benchmark-report.{json,md}` with the accurate fresh run.
- **Typed gold on routing scenarios.** Add `expected_workflow_mode` + `expected_leaf_resources` (list of `{workflow_mode, leaf_resource_id}`) frontmatter to the playbook scenarios that are genuine routing decisions. Gold is derived from each scenario's stated intent, not from router output.
- **Routing-vs-command partition.** Identify and exclude deterministic command/exit-code scenarios (e.g. validator-run scenarios that self-declare "not a routing decision") from typed-gold authoring; they keep their existing behavior contract.
- **Packet-qualify shared-tier paths.** Convert the flat `references/...` (universal/detection/checklist) RESOURCE_MAP entries and DEFAULT_RESOURCE preamble to their canonical `shared/references/...` form so they carry a resolvable shared-leaf identity on the typed-pair surface, only if the typed-pair contract requires it (verified during the pilot, not assumed).
- **Live-mode sample.** Run a representative sample of routing scenarios through the live-mode executor to obtain the meaningful routing-quality number (the metric Wave 1 endorsed), recorded alongside the deterministic figure.

### Out of Scope

- **Any "correctness" edit to the RESOURCE_MAP or INTENT_SIGNALS.** The map is verified correct; editing it to chase a recon-hypothesized bug is a scope-lock violation.
- **Adding/removing intents or leaves, or re-authoring the surface router structure.** Only path-form canonicalization needed for typed-pair attribution is in scope.
- **The other four Wave 2 skills.** They are fanned out in sibling children 016–019 using the recipe proven here.
- **Fabricating routing gold for deterministic command scenarios.**

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/manual_testing_playbook/**` (routing scenarios) | Modify | Add `expected_workflow_mode` + `expected_leaf_resources` typed-gold frontmatter |
| `.opencode/skills/sk-code/shared/references/smart_routing.md` | Modify | Path-form canonicalization of shared-tier entries for typed-pair attribution (only if required) |
| `.opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.json` | Modify | Replace stale report with the accurate fresh run |
| `.opencode/skills/sk-code/benchmark/baseline/skill-benchmark-report.md` | Modify | Replace stale report with the accurate fresh run |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Refresh the stale sk-code baseline with an accurate run | The committed `benchmark/baseline/skill-benchmark-report.json` shows a non-null verdict/aggregate matching a fresh router-mode run (PASS, D5=100, 0 unreachable); the pre-reorg unreachable loci are gone |
| REQ-002 | Author independently-derived typed gold on the routing scenarios | Every genuine routing scenario carries `expected_workflow_mode` + `expected_leaf_resources`; the gold reflects the scenario's stated intent and is not a transcription of current router output; command/exit-code scenarios are excluded and documented |
| REQ-003 | The typed-pair + mode-routing dimensions become scored | After authoring, a router-mode run reports a non-null `typedPairRecall` and mode-routing score for the annotated scenarios (no longer "fixture carries no expected.mode") |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Obtain a live-mode routing-quality number on a sample | A live-mode run over a representative routing sample completes and its routing-quality figure is recorded next to the deterministic figure, with the transport/model noted |
| REQ-005 | Prove the recipe is fan-out-ready | The pilot's steps, guardrails (independent gold, routing-vs-command partition), and any machinery gaps are captured so children 016–019 can execute without re-discovery |

### P2 - Nice to Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Packet-qualify shared-tier paths for clean typed-pair attribution | The flat `references/...` shared-tier entries carry a resolvable shared-leaf identity on the typed-pair surface; the drift-guard still passes 7/7 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The committed sk-code baseline is accurate (non-null PASS verdict, D5=100), not the stale BLOCKED-BY-STRUCTURE artifact.
- **SC-002**: The genuine routing scenarios carry independently-derived typed gold; command scenarios are correctly excluded.
- **SC-003**: A router-mode run scores `typedPairRecall` and mode-routing for the annotated scenarios.
- **SC-004**: A live-mode sample yields a recorded routing-quality number.
- **SC-005**: The proven recipe (steps + guardrails + machinery gaps) is documented for fan-out to 016–019.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Typed gold is authored by transcribing router output, making gold ≡ output (measures nothing) | Medium | High | Derive gold from the scenario's stated intent before consulting the router; spot-check that some gold disagrees with current output |
| A command/exit-code scenario is mis-annotated with routing gold | Medium | Medium | Partition explicitly; scenarios that self-declare "not a routing decision" are excluded and listed |
| Path-form canonicalization breaks the drift-guard or D5 | Low | Medium | Re-run the drift-guard (must stay 7/7) and a router-mode run (D5 must stay 100) after any smart_routing.md edit |
| Concurrent-session churn on the shared harness | Medium | Low | Pathspec-limited commits; re-verify a clean baseline before each step |

### Dependencies

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Wave 1 typed-pair machinery (loader/scorer/dispatch) | Internal | Shipped on origin/v4 | The measurement path this packet exercises |
| Live-mode executor (cli-opencode transport) | Internal | Present | REQ-004 live sample |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-M01 (Measurability):** every reported routing number is attributable to a surface (flat `resourceRecall` vs typed `typedPairRecall`) and to a stage (`routing` vs `negative`); the typed number only reports when the oracle rates the gold `valid`.
- **NFR-R01 (Determinism):** the derivation is a pure function of the scenario's body gold and the leaf-manifest; the same inputs yield the same typed pairs run to run, introducing no variance into the offline path.
- **NFR-C01 (Dormancy):** the loader change is byte-identical for any skill without a `leaf-manifest.json`, so propagation is opt-in per skill and never silently perturbs another skill's scoring.

## 8. EDGE CASES

- **Command / exit-code scenarios:** carry no `**Expected references loaded**` packet-qualified gold, so the derivation yields no pairs and they are excluded from the typed surface (correct — they are not routing decisions).
- **Negative / unknown-fallback scenarios:** their body gold is preamble-only (flat `references/...`), which does not resolve to a manifest leaf, so they produce no typed gold and stay negative-activation tests.
- **Cross-mode body gold:** a scenario whose gold spans two surfaces is narrowed to the dominant (most-contributing) mode so the typed pair set declares one mode and stays inside the selected-map cap.
- **Always-loaded preamble:** the router emits an untyped preamble that does not resolve to manifest pairs; the typed scorer flags it as a `routing_contract_error` (the documented CONDITIONAL driver), which is a measurement artifact, not a routing regression.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | One shared loader function + a generated manifest + a guard test + a baseline refresh; no router or map edit |
| Risk | 8/25 | Shared benchmark harness is touched, but the change is additive and manifest-gated (dormant elsewhere); a bug affects only sk-code's typed scoring |
| Research | 8/20 | The machinery gaps (loader shapes, oracle leaf-manifest gate) had to be discovered empirically before the mechanism was chosen |
| Coordination | 6/15 | Single implementer; concurrently-active shared harness (pathspec-limited commits) |
| **Total** | **32/100** | **Level 2** |

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether the typed-pair contract needs shared-tier paths in `shared/references/...` form or tolerates the bare `references/...` form is verified during the pilot (REQ-006), not assumed.
- The live-mode sample size and model/effort for REQ-004 is chosen during execution to balance signal against cost.
- Which changes to the sk-code routing template, intent logic, and JSON artifacts can lift leaf-file recall while preserving the verified 18/18 surface routing result?

### Research Context

Deep research is active on the typed-pair contract, benchmark scoring, shared preamble qualification, and leaf-recall optimization. `research/research.md` remains the canonical findings source.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- Surface routing and leaf routing are separate: the verified 18/18 surface result does not establish strong leaf-file recall.
- The untyped universal preamble is an identity-contract defect, not the cause of missed expected leaves. A prefix-only rewrite is insufficient, and an ordinary `shared` mode would change governed hub topology.
- Prefer truthful single-owner aliases where possible; genuinely mode-neutral preamble files need an explicit validated non-routable shared owner before typed-contract errors can be cleared without claiming a routing gain.
- Repair measurement first: capture a same-revision baseline, declare minimum versus exhaustive gold, add sealed holdouts, and record ordered successful live reads plus route-decision provenance.
- The leading router candidate is a two-tier `RESOURCE_MAP` with small required sets and predicate-gated supplements; test specificity-aware signal weighting only after that split.
- Accept candidates only when fitted, holdout, negative, D3, typed-contract, topology, live-read, and exact 18/18 surface gates all pass. See `research/research.md` for canonical evidence and recommendations.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: `../spec.md` (031 router-alignment program)
- **Preceding phase (map order)**: `../014-benchmark-harness-typed-wiring/spec.md`
- **Sibling fan-out targets**: `../016`…`../019` (sk-design, system-code-graph, system-deep-loop, sk-prompt)
