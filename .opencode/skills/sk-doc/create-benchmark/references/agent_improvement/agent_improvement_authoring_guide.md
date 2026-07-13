---
title: Agent-Improvement Authoring Guide
description: End-to-end guide for authoring the doc-only inputs a Lane A (agent-improvement) run consumes - the improvement charter and strategy scaffolds, the target-onboarding classification, the candidate proposal format, and the profiling/integration-scanning setup; where each lives in deep-improvement and what stays lane-local and code-owned.
trigger_phrases:
  - "agent improvement authoring guide"
  - "how to author lane A inputs"
  - "improvement charter and strategy scaffold"
  - "candidate proposal doc authoring"
  - "agent-improvement setup docs"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Agent-Improvement Authoring Guide

Authoring depth for the Lane A (agent-improvement) inputs. This guide covers what you
WRITE before a run: the setup scaffolds an author fills, the candidate format a
proposal follows, and the profiling/integration-scanning setup a target needs. It does
NOT restate how those inputs are scored or promoted — the five-dimension rubric, the
evaluator contract, the promotion-gate contract, and the code-coupled run config are
the deep-improvement lane's, and they stay lane-local. Cross-links throughout point at
those normative contracts; where this guide and a contract diverge, the contract
prevails.

---

## 1. OVERVIEW: WHAT LANE A AUTHORING COVERS

Lane A improves a **bounded agent `.md` file** without immediately mutating the source
of truth. It is run by [`/deep:agent-improvement`](../../../../system-deep-loop/deep-improvement/SKILL.md)
and is evaluator-first: it generates packet-local candidates, scores them with dynamic
5-dimension scoring, and promotes only behind guarded gates plus explicit operator
approval. The loop, its lifecycle, and its scoring are code and contracts that ship
with the lane. What an *author* provides is a small set of **doc-only setup inputs**
plus a filled copy of the code-coupled run config.

Everything here is authoring input; nothing an author fills executes on its own. The
lane's scripts (`generate-profile.cjs`, `scan-integration.cjs`, `score-candidate.cjs`,
`run-benchmark.cjs`, `promote-candidate.cjs`) read the inputs, score candidates, and
write evidence into the packet-local `improvement/` runtime area.

### Lane boundary — what stays lane-local

| This guide covers (authoring inputs) | Stays lane-local in deep-improvement (cross-link) |
| --- | --- |
| Charter + strategy scaffolds, and which fields an author fills | The five-dimension rubric, weights, and weighted-score threshold |
| Target-onboarding preconditions and the canonical/derived/candidate-only classes | The evaluator input/output contract and reject-vs-infra-failure rule |
| The candidate file shape: frontmatter fields and the mutation-type vocabulary | The promotion-gate contract, per-dimension gates, and legal-stop bundles |
| Which config fields an author fills in a copy | The canonical `improvement_config.json` template and its field reference |

The right-hand column is normative and code-backed. Author *to* it; do not re-document
it here.

---

## 2. WHAT YOU AUTHOR: THE LANE A SETUP DOCS

All Lane A data lives under the deep-improvement mode-packet in
[`assets/agent_improvement/`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/README.md)
(scaffolds and config) and
[`references/agent_improvement/`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/target_onboarding.md)
(the format and setup references). A run copies the scaffolds into its packet-local
`improvement/` runtime area and edits the copies; the source templates are edited by
maintainers, not by a run.

| Input | Where it lives (link) | What the author does |
| --- | --- | --- |
| Charter scaffold | [`improvement_charter.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_charter.md) | Adopt verbatim as the fixed policy layer — mission, dynamic-target rule, proposal-only policy, keep/discard rule, and the audit obligations. It is **immutable** for the run; the mutator must never rewrite it. |
| Strategy scaffold | [`improvement_strategy.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_strategy.md) | Fill the operator-owned fields (Target, Goal, Constraints, Current Hypothesis, Candidate Focus, Benchmark Focus, Integration Focus) before the run; leave the `MACHINE-OWNED` block for the reducer. |
| Run config (copy) | [`improvement_config.json`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json) | Fill only `target`, `specFolder`, and `lineage.sessionId` in a packet-local copy; leave scoring, stop-rule, dispatch-cap, and file-protection sections at their template values. See §3. |
| Target manifest | [`target_manifest.jsonc`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/target_manifest.jsonc) | Optionally add a classification entry or extend the `fixed`/`forbidden` protections; the `targets` array is intentionally empty under dynamic-only profiling. |
| Candidate file | (per format) [`candidate_proposal_format.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/candidate_proposal_format.md) | Write each candidate as a complete agent `.md` under `{spec_folder}/improvement/candidates/` that differs from the target only in the one mutation being tested. |

### 2.1 The candidate file, at a glance

A candidate is a full agent file plus proposal frontmatter. The required proposal
fields are `candidate_id`, `session_id`, `iteration`, `mutation_type`,
`target_dimension`, `parent_candidate`, and `created_at`; the standard agent fields
(`name`, `description`, `triggers`, `version`) are inherited from the target. The
`mutation_type` is drawn from a fixed vocabulary — `rule-addition`,
`rule-modification`, `workflow-addition`, `workflow-modification`, `description-update`,
`verification-addition`, `integration-fix` — each mapped to the dimension it targets.
The full field rules, mutation-signature dedup, and lineage-graph shape are the
authority in
[`candidate_proposal_format.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/candidate_proposal_format.md);
this is the shape at a glance.

### 2.2 Onboarding a new target

Before a target can be evaluated it must be classifiable and benchmarkable. The
preconditions (structured output contract, deterministic or policy-stable benchmarking,
a clear class, no mirror-sync dependency) and the three classes — `canonical`,
`derived`, `candidate-only` — are documented in
[`target_onboarding.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/target_onboarding.md).
Author against it; do not invent new target classes here.

### 2.3 The profiling / integration-scanning setup

Two lane references describe the surfaces a target profile is built from and how the
integration dimension is measured. The full inventory of scanned surfaces (canonical,
runtime mirrors, commands, YAML workflows, skills, global docs, skill advisor) and the
mirror-sync signal-matching rule live in
[`integration_scanning.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/integration_scanning.md).
The append-only profile-selection rationale log (`profile-selection.log`, written under
the packet-local `improvement/` state directory) is documented in
[`profiling_audit_log.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/profiling_audit_log.md).
Profiles are generated dynamically per target; no static profiles ship.

---

## 3. WHAT STAYS LANE-LOCAL / CODE-OWNED

These are normative and code-backed. Name them for wayfinding, link them, and **never
restate** them here; where this guide and one of them diverge, the contract prevails.

| Lane authority (link) | What it owns — do not restate |
| --- | --- |
| [`score_dimensions.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/score_dimensions.md) | The five dimensions (structural integrity, rule coherence, integration consistency, output quality, system fitness), their weights, and the weighted-score threshold. |
| [`evaluator_contract.md`](../../../../system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md) | Scorer and benchmark-runner input/output contract, the rubric, and the reject-vs-`infra_failure` distinction. |
| [`promotion_gate_contract.md`](../../../../system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md) | The five promotion gates, per-dimension minimums, the accept/ship phases, and rollback. |
| [`improvement_charter.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_charter.md) | The journal-emission protocol, the stop-reason enum, and the legal-stop gate bundles (contract / behavior / integration / evidence / improvement). |

### The code-coupled run config

`improvement_config.json` is **code-coupled**: the lane's scripts read it at runtime —
for example `scripts/shared/check-dispatch-cap.cjs` enforces the `dispatchCaps` ceilings
from it before every candidate dispatch, score, and benchmark run, and the manifest
names `generate-profile.cjs` and `scan-integration.cjs` as its consumers. An author
fills a *copy* (only `target`, `specFolder`, `lineage.sessionId` — see §2), but the
canonical template and its field-by-field meaning stay in the lane. Do not restate the
config schema here; the field reference is
[`improvement_config_reference.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config_reference.md).
Never hand-move the config template out of the lane into this packet.

---

## 4. AUTHORING WORKFLOW

Complete these steps in order. This workflow produces inputs; it never runs the loop.

1. **Confirm the target and classify it.** Pick the bounded agent `.md` and classify it
   (`canonical` / `derived` / `candidate-only`) per
   [`target_onboarding.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/target_onboarding.md);
   confirm the preconditions hold before going further.
2. **Copy and fill the scaffolds.** Adopt
   [`improvement_charter.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_charter.md)
   verbatim, then fill the operator-owned fields of
   [`improvement_strategy.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_strategy.md).
3. **Fill the run-config copy.** Set `target`, `specFolder`, and `lineage.sessionId` in a
   packet-local copy of
   [`improvement_config.json`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json);
   leave everything else at template values (see
   [`improvement_config_reference.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config_reference.md)).
4. **Set up profiling and integration surfaces.** Confirm the target's scanned surfaces
   against
   [`integration_scanning.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/integration_scanning.md)
   so the integration dimension has real signal to measure.
5. **Author the first candidate.** Write it to the format in
   [`candidate_proposal_format.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/candidate_proposal_format.md):
   one bounded mutation, correct `mutation_type` / `target_dimension`, packet-local under
   `candidates/`.
6. **Hand off to the lane to run.** The lane scores, benchmarks, and gates the candidate
   ([`loop_protocol.md`](../../../../system-deep-loop/deep-improvement/references/shared/loop_protocol.md)); authoring stops before scoring, promotion, or mirror sync.

---

## 5. ALWAYS / NEVER

### ALWAYS
- **ALWAYS** generate candidates evaluator-first: propose one bounded mutation, then let
  the lane score it — never edit the canonical target during proposal-only mode.
- **ALWAYS** write candidates and filled scaffolds under the packet-local
  `{spec_folder}/improvement/` area, leaving the lane's source templates untouched.
- **ALWAYS** fill only the operator-owned fields; leave `MACHINE-OWNED` strategy blocks
  and the scoring/stop-rule config sections for the reducer and the lane.

### NEVER
- **NEVER** restate the five-dimension rubric, the promotion gates, or the legal-stop
  gate bundles in this guide — name and link them; the contract prevails.
- **NEVER** hand-move the code-coupled `improvement_config.json` template (or its field
  reference) out of the lane into this packet.
- **NEVER** treat runtime-mirror sync as benchmark evidence; mirror drift is downstream
  packaging work per [`mirror_drift_policy.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/mirror_drift_policy.md).

---

## 6. SUCCESS CRITERIA

- The charter is adopted verbatim and the strategy's operator-owned fields are filled
  before the run; the `MACHINE-OWNED` block is untouched.
- The run-config copy carries a real `target`, `specFolder`, and `lineage.sessionId`,
  and no other section was hand-edited away from the template.
- Each candidate is a complete agent file with valid proposal frontmatter, a single
  bounded mutation, and a `mutation_type` from the documented vocabulary.
- No rubric, gate, or config schema is restated in this guide — every normative detail
  is cross-linked to its lane authority.

---

## 7. RELATED / CROSS-LINKS

### Lane-local normative contracts (author to these; do not restate)

| File | What it owns |
| --- | --- |
| [`score_dimensions.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/score_dimensions.md) | The five-dimension rubric, weights, and weighted-score threshold |
| [`evaluator_contract.md`](../../../../system-deep-loop/deep-improvement/references/model_benchmark/evaluator_contract.md) | Scorer/benchmark input-output contract and reject-vs-infra-failure |
| [`promotion_gate_contract.md`](../../../../system-deep-loop/deep-improvement/references/shared/promotion_gate_contract.md) | The five promotion gates, per-dimension minimums, accept/ship, rollback |
| [`promotion_rules.md`](../../../../system-deep-loop/deep-improvement/references/shared/promotion_rules.md) | Promotion policy and stop-condition reference |
| [`stress_test_protocol.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/stress_test_protocol.md) | The same-task A/B stress-test required before promotion claims |
| [`loop_protocol.md`](../../../../system-deep-loop/deep-improvement/references/shared/loop_protocol.md) | The full INIT/PROPOSE/SCORE/PROMOTE lifecycle the lane runs |

### Lane-local authoring inputs (fill these)

| File | What the author fills |
| --- | --- |
| [`improvement_charter.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_charter.md) | Fixed policy scaffold — adopted verbatim, immutable for the run |
| [`improvement_strategy.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_strategy.md) | Operator-owned goal/hypothesis/focus fields |
| [`improvement_config.json`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json) | `target`, `specFolder`, `lineage.sessionId` in a packet-local copy |
| [`improvement_config_reference.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config_reference.md) | (Read-only) field-by-field config meaning |
| [`target_manifest.jsonc`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/target_manifest.jsonc) | Optional classification entry and `fixed`/`forbidden` protections |
| [`candidate_proposal_format.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/candidate_proposal_format.md) | The candidate file shape each proposal follows |
| [`target_onboarding.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/target_onboarding.md) | Target preconditions and canonical/derived/candidate-only class |
| [`integration_scanning.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/integration_scanning.md) | The scanned integration surfaces a profile is built from |
| [`profiling_audit_log.md`](../../../../system-deep-loop/deep-improvement/references/agent_improvement/profiling_audit_log.md) | The profile-selection rationale log shape and retention |
| [`agent_improvement/README.md`](../../../../system-deep-loop/deep-improvement/assets/agent_improvement/README.md) | Directory map of Lane A data, config, and templates |

### Owning skill and sibling family

- [`deep-improvement SKILL.md`](../../../../system-deep-loop/deep-improvement/SKILL.md) — the mode that owns and runs Lane A (§3).
- [`model_benchmark_fixture_guide.md`](../model_benchmark/model_benchmark_fixture_guide.md) — the sibling authoring guide for the model-benchmark (Lane B) inputs.
- [`behavior_benchmark_guide.md`](../behavior_benchmark/behavior_benchmark_guide.md) — the sibling authoring guide for the behavior-benchmark family.
- [`skill_benchmark_storage_guide.md`](../skill_benchmark/skill_benchmark_storage_guide.md) — the sibling storage guide for the skill-benchmark (Lane C) family.
- [`../../SKILL.md`](../../SKILL.md) — the `create-benchmark` packet contract for the benchmark families this packet authors.

---

*End of agent-improvement authoring guide — the five-dimension rubric, evaluator
contract, promotion gates, and code-coupled run config stay lane-local in
deep-improvement (§3 and §7).*
