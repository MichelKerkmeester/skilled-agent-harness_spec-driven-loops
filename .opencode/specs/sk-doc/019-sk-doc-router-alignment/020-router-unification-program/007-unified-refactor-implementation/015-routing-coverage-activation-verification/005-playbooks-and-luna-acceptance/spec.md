---
title: "Feature Specification: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance"
description: "Build the 7-hub compiled-routing scenario matrix (one per eligible hub, selected by distinct route shape) with a full evidence contract (compiledRoute, serving-status, flag, fallback-cause, manifest-digest, model, reasoning-effort), strict non-frozen scenario/topology validators, and a non-frozen cutover playbook executor; then a separate two-plane LUNA-HIGH live acceptance stage (openai/gpt-5.6-luna, variant high) that classifies transport timeout as SKIP, never FAIL, and reserves at least one gold-bearing held-out paraphrase per hub. Depends on the still-Planned 002-runtime-promotion-and-status-foundation and 004-benchmark-compiled-lane-c; this packet is Planned, not yet implemented. The frozen load-playbook-scenarios.cjs loader and the other two frozen scorer files stay byte-identical throughout; every new validator and the executor are non-frozen; every gate names a rollback."
trigger_phrases:
  - "compiled routing playbook scenario matrix"
  - "luna high live acceptance gold holdout"
  - "vacuous evidence contract compiled route"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance

## EXECUTIVE SUMMARY

This phase-local child ships the playbook and live-model side of the compiled-router activation program: the minimal 7-hub compiled-routing scenario matrix, its full evidence contract, strict non-frozen validators, a non-frozen cutover executor, and a separate two-plane LUNA-HIGH live acceptance stage. It is Planned — grounded in the 25-iteration deep-research pass (`../001-research/synthesis-v1.md` §2.3 CF-PB-1..5, `CF-BM-7` LUNA, reconciled in `../001-research/review-v1.md`) — but no code has been written yet.

Today the scenario schema admits gold-less scenarios and the evidence contract can pass without proving compiled routing even ran (CF-PB-1, CF-PB-3); there is no minimal matrix testing serving authority itself (CF-PB-2); live Lane C never runs the playbook command/evidence sequence end to end (CF-PB-5); and prior LUNA-High routing evidence has no gold-bearing holdouts, so it proves fitted-prompt behavior, not generalization (CF-BM-7). This spec closes those gaps while consuming — never re-deriving — `002`'s status probe and `004`'s compiled-parity evidence shape.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Implemented and verified (2026-07-21). Consumes `002` (status probe), `003` (flag mechanics), `004` (compiled-parity harness), and `007` (durable archiver) — all present on disk despite their stale "Planned" summaries |
| **Created** | 2026-07-20 |
| **Branch** | `sk-doc/0089-default-routing-cutover` |
| **Migration stage** | P2 — coverage/verification harness (playbooks + LUNA acceptance); feeds the P3 coverage-closure join gate that `011-activation-cutover-p4` reads |
| **Blast radius** | Scenario/evidence/validator/executor authoring plus a live model-acceptance stage — additive and diagnostic; no runtime routing decision changes; the frozen playbook loader is a read-only input, never edited |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The frozen scenario loader accepts id-only scenarios; today's `sk-doc` scenarios already load with null pass-criteria and noncritical status, and the standard authoring template omits typed manifest gold (CF-PB-1). There is no minimal complete matrix testing compiled **serving authority** itself — legacy/holdout/disambiguation scenarios are behavior-identical once a hub serves compiled, so duplicating full routing semantics per hub is wasted coverage that still misses the one thing that matters (CF-PB-2). The evidence contract can pass today without proving compiled routing ran at all: it records the advisor's ranking but not `compiledRoute`, serving authority, the flag, a fallback cause, or the manifest identity (CF-PB-3). Root playbooks are stale against the current routing sources of record — `sk-doc`'s root still validates the retired flat RESOURCE_MAP, `mcp-tooling`'s Figma+Refero bundle is prose-supplemental only, and `sk-prompt` advertises an `orderedBundle` claim with no bundle rules behind it (CF-PB-4). Live Lane C never actually runs the playbook command/evidence contract; the topology validator doesn't recurse into per-feature files; and the verdict enum is inconsistent (PASS/FAIL/SKIP vs. the template's PARTIAL/READY) (CF-PB-5). Separately, prior LUNA-High routing evidence has no gold-bearing holdouts — it is fitted-prompt evidence, not a generalization proof — and prior runs exhausted the transport's 150-second ceiling with no honest SKIP classification for a timeout (CF-BM-7).

### Purpose

Ship the minimal 7-hub compiled-routing scenario matrix with a complete evidence contract and strict non-frozen validators (content + topology), a non-frozen cutover executor that actually runs the command/evidence sequence, and a separate two-plane LUNA-HIGH live acceptance stage that is honest about transport failure and proves generalization via a gold-bearing holdout per hub — all consuming `002`'s status probe and `004`'s compiled-parity evidence, never re-deriving flag/fallback mechanics locally.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 7-hub compiled-routing scenario matrix, one scenario file per eligible hub (`sk-code`, `mcp-tooling`, `system-deep-loop`, `cli-external-orchestration`, `sk-prompt`, `sk-design`, `sk-doc`), each selected by a distinct route shape — `sk-code` `surfaceBundle`; three hubs on generic ordered bundles; `sk-prompt` default; `sk-design` and `sk-doc` bundle rules [CF-PB-2]
- Full evidence contract fields on every scenario: `compiledRoute`, serving-status, flag, fallback-cause, manifest-digest, model, reasoning-effort [CF-PB-3]
- Non-frozen scenario content validator requiring `id`, `expected_intent`, `expected_resources`, `expected_workflow_mode`, typed `expected_leaf_resources`, `stage`, and a parseable exact prompt on every compiled-routing scenario [CF-PB-1]
- Non-frozen topology validator that recurses into per-feature files (today's `validate-playbook-topology.cjs` does not) and a single unified verdict enum across the surface, reconciling PASS/FAIL/SKIP against the template's PARTIAL/READY [CF-PB-5]
- Non-frozen cutover playbook executor that runs each scenario's command sequence and gates on the captured evidence-contract signals [CF-PB-5]
- Two-plane LUNA-HIGH live acceptance stage: an orchestrator-owned scenario map with `providerModel=openai/gpt-5.6-luna`, `variant=high`; stdout/stderr captured separately; a transport timeout classifies as `SKIP`, never `PASS` or `FAIL` [CF-BM-7]
- At least one gold-bearing held-out paraphrase per hub, with its correct route withheld from the prompt — a real generalization probe, not a fitted one [CF-BM-7]
- Centralize flag/fallback/status mechanics consumption under `system-skill-advisor`; move secondary-authority checks (legacy/holdout/disambiguation) to an Optional Supplemental section instead of duplicating the primary matrix [CF-PB-2]
- Root playbook realignment: `sk-doc`'s root playbook re-anchored to `mode-registry.json`/`hub-router.json` (not the retired flat RESOURCE_MAP) before its compiled-routing scenario is added; `mcp-tooling`'s Figma+Refero bundle promoted from prose-supplemental to a primary evidence row; `sk-prompt`'s `orderedBundle` claim proven deterministic or removed [CF-PB-4]

### Out of Scope

- The `002` status-probe foundation and the `004` compiled-parity harness themselves - [why] this packet CONSUMES both (the manifest read pattern, the compiled-parity evidence shape); it does not build them.
- Feature catalogs (`006`), durable archiving (`007`), sk-code alignment (`008`), sk-doc template alignment (`009`), rollback/audit tooling (`010`), and the P4 cutover controller (`011`) - [why] siblings, not this child.
- Any edit to the frozen `load-playbook-scenarios.cjs` loader or the other two frozen scorer files - [why] frozen, SHA-256-pinned; new validation and execution logic lives in non-frozen siblings.
- Full-corpus LUNA verification across every playbook prompt - [why] explicitly bounded to a per-hub sample plus the mandated gold-bearing holdout, labeled honestly, mirroring `010`'s T9 boundary (2 prompts/hub, not exhaustive).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/<hub>/manual-testing-playbook/compiled-routing/` (7 hubs) | Create | One compiled-routing scenario file per eligible hub, keyed to that hub's distinct route shape |
| `.opencode/skills/sk-doc/create-skill/scripts/validate-playbook-topology.cjs` | Modify | Recurse into per-feature files; unify the verdict enum |
| `.opencode/skills/sk-doc/create-skill/scripts/validate-compiled-routing-scenarios.cjs` | Create | Non-frozen scenario content validator (CF-PB-1 field contract) |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/cutover-playbook-executor.cjs` | Create | Non-frozen cutover executor: runs each scenario's command sequence, gates on evidence-contract signals |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/luna-acceptance.cjs` | Create | Two-plane LUNA-HIGH live acceptance stage (orchestrator-owned scenario map, SKIP-on-timeout, gold holdouts) |
| `.opencode/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md` | Modify | Re-anchor root playbook to `mode-registry.json`/`hub-router.json` before the compiled-routing scenario is added |
| `.opencode/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md` | Modify | Promote the Figma+Refero bundle from prose-supplemental to a primary evidence row |
| `.opencode/skills/sk-prompt/manual-testing-playbook/manual-testing-playbook.md` | Modify | Prove the `orderedBundle` dual-intent claim deterministic, or remove it |
| `005-playbooks-and-luna-acceptance/{spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md}` | Create | Level-2 spec docs (this packet) |

> All writes stay inside this phase folder plus the explicitly named hub playbook and shared-script paths above. The frozen `load-playbook-scenarios.cjs` loader, the other two frozen scorer files, and all seven `010-live-activation/activation/<hub>/manifest.json` files are read-only inputs.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | 7-hub compiled-routing scenario matrix, one scenario file per eligible hub, each selected by a distinct route shape. | All 7 hubs (`sk-code`, `mcp-tooling`, `system-deep-loop`, `cli-external-orchestration`, `sk-prompt`, `sk-design`, `sk-doc`) have exactly one compiled-routing scenario file; no two hubs share an identical route-shape rationale. |
| REQ-002 | Full evidence contract on every scenario: `compiledRoute`, serving-status, flag, fallback-cause, manifest-digest, model, reasoning-effort. | A scan of all 7 scenario files shows every field present and non-null on every scenario; a scenario missing any field fails the content validator. |
| REQ-003 | Non-frozen scenario content validator requiring `id`, `expected_intent`, `expected_resources`, `expected_workflow_mode`, typed `expected_leaf_resources`, `stage`, and a parseable exact prompt. | The validator rejects an id-only scenario (the current frozen-loader-permitted minimum) and rejects a scenario with null pass-criteria; it never edits the frozen `load-playbook-scenarios.cjs`. |
| REQ-004 | Non-frozen topology validator recurses into per-feature files and enforces a single unified verdict enum. | Run against a hub with nested per-feature files, the validator inspects every leaf, not just the root; PASS/FAIL/SKIP is the one enum used everywhere the template previously allowed PARTIAL/READY. |
| REQ-005 | Non-frozen cutover playbook executor runs each scenario's command sequence and gates on the captured evidence-contract signals. | A dry run against one hub's scenario produces a captured evidence record (REQ-002's fields) and a PASS/FAIL/SKIP gate outcome derived from it, not from a manually-asserted verdict. |
| REQ-006 | Two-plane LUNA-HIGH live acceptance stage: orchestrator-owned scenario map, `providerModel=openai/gpt-5.6-luna`, `variant=high`, stdout/stderr captured separately, transport timeout classified `SKIP`. | A seeded transport-timeout fixture produces `SKIP`, never `PASS` or `FAIL`; stdout and stderr are two distinct captured fields per run, mirroring `010`'s T9 evidence shape. |
| REQ-007 | At least one gold-bearing held-out paraphrase per hub, with its correct route withheld from the prompt. | All 7 hubs have >= 1 holdout scenario whose expected route is present in the scenario's gold record but absent from the prompt text sent to the model. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Test serving authority, not duplicate routing semantics; centralize flag/fallback/status mechanics consumption under `system-skill-advisor`. | The primary 7-scenario matrix varies default-on/explicit-`=0`/drift/resolver-failure per hub; legacy/holdout/disambiguation checks move to an Optional Supplemental section rather than a second full matrix. |
| REQ-009 | Root playbook realignment: `sk-doc` root re-anchored to `mode-registry.json`/`hub-router.json`; `mcp-tooling` Figma+Refero promoted to a primary row; `sk-prompt`'s `orderedBundle` claim proven or removed. | `sk-doc`'s root playbook no longer references the retired flat RESOURCE_MAP; `mcp-tooling`'s primary evidence table includes a Figma+Refero row; `sk-prompt`'s playbook either demonstrates a deterministic dual-intent route or drops the `orderedBundle` claim. |
| REQ-010 | Every cutover scenario is critical + PASS before that hub's cutover proceeds — this child's output is a feed for `011`'s P3 coverage-closure join gate. | The cutover executor's report marks every compiled-routing scenario `critical: true`; a non-PASS critical scenario blocks the join-gate signal this child emits, it does not silently downgrade. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 eligible hubs have exactly one compiled-routing scenario file, each keyed to a distinct route shape.
- **SC-002**: Every scenario carries the full evidence contract (7 fields); the content validator rejects any scenario missing one.
- **SC-003**: The topology validator recurses into per-feature files and enforces one unified verdict enum, without editing the frozen loader.
- **SC-004**: The cutover executor produces a gated PASS/FAIL/SKIP outcome from captured evidence, not a manual assertion, for at least one hub in a dry run.
- **SC-005**: The LUNA-HIGH acceptance stage classifies a seeded transport timeout as `SKIP`; at least one gold-bearing holdout exists per hub with its route withheld from the prompt.
- **SC-006**: Root playbook realignment lands for `sk-doc`, `mcp-tooling`, and `sk-prompt` as specified in REQ-009.
- **SC-007**: This child's join-gate feed (REQ-010) reports non-PASS critical scenarios honestly, never silently downgraded.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `002-runtime-promotion-and-status-foundation` (Planned/Not-started) | No wired status probe to consume for serving-authority evidence | Evidence contract reads the hub activation manifest directly (same pattern as `004`'s vacuous-parity guard) as a stopgap, independent of 002's `advisor_status` wiring landing first |
| Dependency | `004-benchmark-compiled-lane-c` (Planned/Not-started) | No compiled-parity report shape to cite in the evidence contract's `compiledRoute`/manifest-digest fields | This child's evidence-contract schema is authored to match `004`'s planned `row.compiledParity` shape; both must reconcile field names before either is implemented |
| Dependency | Frozen `load-playbook-scenarios.cjs` loader (and the other two frozen scorer files) | Any accidental edit invalidates the safety pin for the whole program | All new validation/execution logic lives in non-frozen siblings; the loader is read-only input |
| Risk | Gold-less scenario admission (CF-PB-1) | A scenario with no real pass-criteria would silently "pass" forever | Non-frozen content validator hard-rejects id-only or null-criteria scenarios before they reach the loader |
| Risk | LUNA transport instability (CF-BM-7) | A 150s-ceiling timeout misclassified as FAIL would produce false negatives on a working route | Timeout classified `SKIP`, distinct from both `PASS` and `FAIL`; stdout/stderr captured separately for post-hoc diagnosis |
| Risk | Fitted-prompt overfit (CF-BM-7) | Prior LUNA evidence proved memorization, not generalization | >= 1 gold-bearing held-out paraphrase per hub with the correct route withheld from the prompt |
| Risk | Evidence contract that passes without proving compiled ran (CF-PB-3) | A "green" playbook run could still be scoring legacy routing | All 7 evidence fields required and validated before a scenario counts as evidence for the P3 join gate |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: The 7-hub scenario matrix and its content/topology validators are deterministic given fixed scenario files and manifest state — no scenario's pass/fail depends on model output.
- **NFR-D02**: The cutover executor's gate outcome is a pure function of the captured evidence-contract signals, never a manually-asserted verdict.

### Honesty (model-facing)
- **NFR-H01**: A transport timeout is always `SKIP`, never silently coerced to `PASS` or `FAIL` — this is the one place in this program where a live, nondeterministic external call is in the loop, and its failure modes must stay distinguishable.
- **NFR-H02**: Every gold-bearing holdout's correct route is verifiable from the scenario's own gold record — the holdout is a generalization probe, not an unfalsifiable claim.

### Authority
- **NFR-A01**: The frozen `load-playbook-scenarios.cjs` loader and the other two frozen scorer files remain untouched; every new content/topology/execution rule lives in a non-frozen sibling.
- **NFR-A02**: This child consumes `002`'s manifest/status-probe pattern and `004`'s compiled-parity evidence shape rather than re-deriving flag/fallback/status mechanics locally (centralized under `system-skill-advisor`).

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Scenario admission boundary
- An id-only scenario (today's frozen-loader-permitted minimum): the non-frozen content validator rejects it before it reaches the loader.
- A scenario with a typed `expected_leaf_resources` entry that doesn't resolve in the hub's `leaf-manifest.json`: content validator failure, not a silent skip.

### LUNA transport boundary
- Transport timeout at or near the 150s ceiling: classified `SKIP`; stdout/stderr captured up to the timeout for diagnosis.
- A model response that names a route not present in any scenario's gold set: scored as a routing miss, not discarded as unparseable.

### Holdout boundary
- A holdout paraphrase that accidentally leaks the expected route in its own prompt text: content validator flags it (the route string must not appear verbatim in the prompt).

### Topology boundary
- A hub with nested per-feature files the current validator does not recurse into: the new topology validator must visit every leaf; a leaf-only defect must not pass because the root looked clean.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | 7 scenario files + 2 new non-frozen validators/executor + a live-model acceptance stage + 3 root-playbook realignments; broader surface than `004` but each piece is additive |
| Risk | 13/25 | No frozen-file edits and no runtime routing change, but the LUNA live stage introduces a nondeterministic external dependency that must fail closed (SKIP) rather than silently pass |
| Research | 8/20 | Mechanism specified across CF-PB-1..5 and CF-BM-7; residual work is per-hub scenario authoring plus the live-stage harness, both well-precedented by `010`'s T9 real-model verification |
| **Total** | **34/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the evidence-contract schema's field naming reconcile 1:1 with `004`'s planned `row.compiledParity` shape, or does this child define its own schema and a small adapter? Both children are Planned; the exact field names should be settled before either implements (see `004/spec.md` REQ-002/REQ-009).
- Where do the 7 new hub-local scenario files live precisely — a new `compiled-routing/` subdirectory under each hub's existing `manual-testing-playbook/` (this spec's working assumption), or a centralized location under `system-skill-advisor` matching CF-PB-2's "centralize flag/fallback/status mechanics" guidance? The centralization concern is about shared *mechanics*, not necessarily scenario-file location — needs a decision at build time.
- What is the exact bound on the LUNA-HIGH sample (prompts per hub, runs per prompt)? `010`'s T9 precedent used 2 prompts/hub — this child should state its own bound explicitly rather than inheriting T9's by default, since the holdout requirement (REQ-007) adds at least one scenario T9 did not have.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Build approach**: See `plan.md`
- **Task breakdown**: See `tasks.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Upstream research**: `../001-research/{review-v1.md, synthesis-v1.md}` §2.3 (CF-PB-1..5), §2.2 (CF-BM-7)
- **Sibling dependency**: `../004-benchmark-compiled-lane-c/` (compiled-parity evidence shape)
