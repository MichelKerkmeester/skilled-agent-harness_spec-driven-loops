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
of truth. It is run by [`/deep:agent-improvement`](../../../../../commands/deep/agent-improvement.md)
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
| Which config fields an author fills in a copy | The canonical `improvement-config.json` template and its field reference |

The right-hand column is normative and code-backed. Author *to* it; do not re-document
it here.

---

## 2. WHAT YOU AUTHOR: THE LANE A SETUP DOCS

All Lane A data lives under the deep-improvement mode-packet in
[`assets/agent-improvement/`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/README.md)
(scaffolds and config) and
[`references/agent-improvement/`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/target-onboarding.md)
(the format and setup references). A run copies the scaffolds into its packet-local
`improvement/` runtime area and edits the copies; the source templates are edited by
maintainers, not by a run.

| Input | Where it lives (link) | What the author does |
| --- | --- | --- |
| Charter scaffold | [`improvement-charter.md`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/improvement-charter.md) | Adopt verbatim as the fixed policy layer — mission, dynamic-target rule, proposal-only policy, keep/discard rule, and the audit obligations. It is **immutable** for the run; the mutator must never rewrite it. |
| Strategy scaffold | [`improvement-strategy.md`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/improvement-strategy.md) | Fill the operator-owned fields (Target, Goal, Constraints, Current Hypothesis, Candidate Focus, Benchmark Focus, Integration Focus) before the run; leave the `MACHINE-OWNED` block for the reducer. |
| Run config (copy) | [`improvement-config.json`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/improvement-config.json) | Fill only `target`, `specFolder`, and `lineage.sessionId` in a packet-local copy; leave scoring, stop-rule, dispatch-cap, and file-protection sections at their template values. See §3. |
| Target manifest | [`target-manifest.jsonc`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/target-manifest.jsonc) | Optionally add a classification entry or extend the `fixed`/`forbidden` protections; the `targets` array is intentionally empty under dynamic-only profiling. |
| Candidate file | (per format) [`candidate-proposal-format.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/candidate-proposal-format.md) | Write each candidate as a complete agent `.md` under `{spec_folder}/improvement/candidates/` that differs from the target only in the one mutation being tested. |

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
[`candidate-proposal-format.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/candidate-proposal-format.md);
this is the shape at a glance.

### 2.2 Onboarding a new target

Before a target can be evaluated it must be classifiable and benchmarkable. The
preconditions (structured output contract, deterministic or policy-stable benchmarking,
a clear class, no mirror-sync dependency) and the three classes — `canonical`,
`derived`, `candidate-only` — are documented in
[`target-onboarding.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/target-onboarding.md).
Author against it; do not invent new target classes here.

### 2.3 The profiling / integration-scanning setup

Two lane references describe the surfaces a target profile is built from and how the
integration dimension is measured. The full inventory of scanned surfaces (canonical,
runtime mirrors, commands, YAML workflows, skills, global docs, skill advisor) and the
mirror-sync signal-matching rule live in
[`integration-scanning.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/integration-scanning.md).
The append-only profile-selection rationale log (`profile-selection.log`, written under
the packet-local `improvement/` state directory) is documented in
[`profiling-audit-log.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/profiling-audit-log.md).
Profiles are generated dynamically per target; no static profiles ship.

---

## 3. WHAT STAYS LANE-LOCAL / CODE-OWNED

These are normative and code-backed. Name them for wayfinding, link them, and **never
restate** them here; where this guide and one of them diverge, the contract prevails.

| Lane authority (link) | What it owns — do not restate |
| --- | --- |
| [`score-dimensions.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/score-dimensions.md) | The five dimensions (structural integrity, rule coherence, integration consistency, output quality, system fitness), their weights, and the weighted-score threshold. |
| [`evaluator-contract.md`](../../../../system-deep-loop/deep-improvement/references/model-benchmark/evaluator-contract.md) | Scorer and benchmark-runner input/output contract, the rubric, and the reject-vs-`infra_failure` distinction. |
| [`promotion-gate-contract.md`](../../../../system-deep-loop/deep-improvement/references/shared/promotion-gate-contract.md) | The five promotion gates, per-dimension minimums, the accept/ship phases, and rollback. |
| [`improvement-charter.md`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/improvement-charter.md) | The journal-emission protocol, the stop-reason enum, and the legal-stop gate bundles (contract / behavior / integration / evidence / improvement). |

### The code-coupled run config

`improvement-config.json` is **code-coupled**: the lane's scripts read it at runtime —
for example `scripts/shared/check-dispatch-cap.cjs` enforces the `dispatchCaps` ceilings
from it before every candidate dispatch, score, and benchmark run, and the manifest
names `generate-profile.cjs` and `scan-integration.cjs` as its consumers. An author
fills a *copy* (only `target`, `specFolder`, `lineage.sessionId` — see §2), but the
canonical template and its field-by-field meaning stay in the lane. Do not restate the
config schema here; the field reference is
[`improvement-config-reference.md`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/improvement-config-reference.md).
Never hand-move the config template out of the lane into this packet.

---

## 4. AUTHORING WORKFLOW

Complete these steps in order. This workflow produces inputs; it never runs the loop.

1. **Confirm the target and classify it.** Pick the bounded agent `.md` and classify it
   (`canonical` / `derived` / `candidate-only`) per
   [`target-onboarding.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/target-onboarding.md);
   confirm the preconditions hold before going further.
2. **Copy and fill the scaffolds.** Adopt
   [`improvement-charter.md`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/improvement-charter.md)
   verbatim, then fill the operator-owned fields of
   [`improvement-strategy.md`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/improvement-strategy.md).
3. **Fill the run-config copy.** Set `target`, `specFolder`, and `lineage.sessionId` in a
   packet-local copy of
   [`improvement-config.json`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/improvement-config.json);
   leave everything else at template values (see
   [`improvement-config-reference.md`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/improvement-config-reference.md)).
4. **Set up profiling and integration surfaces.** Confirm the target's scanned surfaces
   against
   [`integration-scanning.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/integration-scanning.md)
   so the integration dimension has real signal to measure.
5. **Author the first candidate.** Write it to the format in
   [`candidate-proposal-format.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/candidate-proposal-format.md):
   one bounded mutation, correct `mutation_type` / `target_dimension`, packet-local under
   `candidates/`.
6. **Hand off to the lane to run.** The lane scores, benchmarks, and gates the candidate
   ([`loop-protocol.md`](../../../../system-deep-loop/deep-improvement/references/shared/loop-protocol.md)); authoring stops before scoring, promotion, or mirror sync.

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
- **NEVER** hand-move the code-coupled `improvement-config.json` template (or its field
  reference) out of the lane into this packet.
- **NEVER** treat runtime-mirror sync as benchmark evidence; mirror drift is downstream
  packaging work per [`mirror-drift-policy.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/mirror-drift-policy.md).

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
| [`score-dimensions.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/score-dimensions.md) | The five-dimension rubric, weights, and weighted-score threshold |
| [`evaluator-contract.md`](../../../../system-deep-loop/deep-improvement/references/model-benchmark/evaluator-contract.md) | Scorer/benchmark input-output contract and reject-vs-infra-failure |
| [`promotion-gate-contract.md`](../../../../system-deep-loop/deep-improvement/references/shared/promotion-gate-contract.md) | The five promotion gates, per-dimension minimums, accept/ship, rollback |
| [`promotion-rules.md`](../../../../system-deep-loop/deep-improvement/references/shared/promotion-rules.md) | Promotion policy and stop-condition reference |
| [`stress-test-protocol.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/stress-test-protocol.md) | The same-task A/B stress-test required before promotion claims |
| [`loop-protocol.md`](../../../../system-deep-loop/deep-improvement/references/shared/loop-protocol.md) | The full INIT/PROPOSE/SCORE/PROMOTE lifecycle the lane runs |

### Lane-local authoring inputs (fill these)

| File | What the author fills |
| --- | --- |
| [`improvement-charter.md`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/improvement-charter.md) | Fixed policy scaffold — adopted verbatim, immutable for the run |
| [`improvement-strategy.md`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/improvement-strategy.md) | Operator-owned goal/hypothesis/focus fields |
| [`improvement-config.json`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/improvement-config.json) | `target`, `specFolder`, `lineage.sessionId` in a packet-local copy |
| [`improvement-config-reference.md`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/improvement-config-reference.md) | (Read-only) field-by-field config meaning |
| [`target-manifest.jsonc`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/target-manifest.jsonc) | Optional classification entry and `fixed`/`forbidden` protections |
| [`candidate-proposal-format.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/candidate-proposal-format.md) | The candidate file shape each proposal follows |
| [`target-onboarding.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/target-onboarding.md) | Target preconditions and canonical/derived/candidate-only class |
| [`integration-scanning.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/integration-scanning.md) | The scanned integration surfaces a profile is built from |
| [`profiling-audit-log.md`](../../../../system-deep-loop/deep-improvement/references/agent-improvement/profiling-audit-log.md) | The profile-selection rationale log shape and retention |
| [`agent-improvement/README.md`](../../../../system-deep-loop/deep-improvement/assets/agent-improvement/README.md) | Directory map of Lane A data, config, and templates |

### Owning skill and sibling family

- [`deep-improvement SKILL.md`](../../../../system-deep-loop/deep-improvement/SKILL.md) — the mode that owns and runs Lane A (§3).
- [`model-benchmark-fixture-guide.md`](../model-benchmark/model-benchmark-fixture-guide.md) — the sibling authoring guide for the model-benchmark (Lane B) inputs.
- [`behavior-benchmark-guide.md`](../behavior-benchmark/behavior-benchmark-guide.md) — the sibling authoring guide for the behavior-benchmark family.
- [`skill-benchmark-storage-guide.md`](../skill-benchmark/skill-benchmark-storage-guide.md) — the sibling storage guide for the skill-benchmark (Lane C) family.
- [`../../SKILL.md`](../../SKILL.md) — the `create-benchmark` packet contract for the benchmark families this packet authors.

---

*End of agent-improvement authoring guide — the five-dimension rubric, evaluator
contract, promotion gates, and code-coupled run config stay lane-local in
deep-improvement (§3 and §7).*
