---
title: "Feature Specification: command-surface benchmark — a two-axis deep-alignment benchmark measuring command-family effectiveness and adherence"
description: "Phase parent for a new benchmark hosted in the deep-alignment mode that measures the OpenCode command surface on two non-averaged axes: a deterministic full-corpus peer adapter (sk-doc-command) auditing structural command integrity across the full command corpus (36 baseline, 37 after the launcher ships), and a sampled behavioral DAB suite (DAB-012–027 on the shared behavior-benchmark framework v2) that actually invokes commands and scores adherence. A bounded model matrix (Claude baseline + gpt-5.6-sol + gpt-5.6-luna-fast) measures executor variance only, not the benchmark itself. Evaluator-first: create-benchmark authors inputs and reports; scoring stays lane-local."
status: planned
trigger_phrases:
  - "command surface benchmark"
  - "command effectiveness adherence benchmark"
  - "deep-alignment command benchmark"
  - "sk-doc-command peer adapter"
  - "command behavior DAB suite"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark"
    last_updated_at: "2026-07-14T20:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded phase parent plus nine-child decomposition from a three-model design congregation"
    next_safe_action: "Author child 000 command-benchmark-contract, then fan out children 001 through 008"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc.cjs"
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md"
      - ".opencode/commands/scripts/validate-command-references.cjs"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
    completion_pct: 3
    open_questions:
      - "Exact GPT-5.6 registry slugs and effort names must be revalidated when the matrix phase runs"
      - "Whether provider event streams need per-provider normalization before direct-dispatch evidence is trustworthy"
    answered_questions:
      - "Two non-averaged axes: a deterministic sk-doc peer adapter plus a sampled DAB behavioral suite; the model matrix measures executor variance only (three-model design congregation, 2026-07-14)"
      - "Host inside deep-alignment as a peer adapter and an extension of the existing DAB behavior_benchmark package — no new authority or artifact class, and no new behavior package or DAB prefix; conformance inputs ship as one deterministic conformance_benchmark package authored through create-benchmark (2026-07-14)"
      - "New packet under system-deep-loop as 066, distinct from the 033 behavior-benchmark framework and the 059/015 model-matrix hardening it reuses (operator, 2026-07-14)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: command-surface benchmark — a two-axis deep-alignment benchmark measuring command-family effectiveness and adherence

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Track** | system-deep-loop |
| **Host mode** | deep-alignment |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The OpenCode command surface — the families under `.opencode/commands/**` and their Codex `.codex/prompts/*`
mirrors — has no benchmark that measures whether a command is **effective** (reaches its declared result)
and **adherent** (follows its command contract while doing so). Static document conformance already exists:
the `sk-doc` adapter audits command docs against create-command canon, which is exactly what packet 138 used.
What is missing is a benchmark that (1) checks structural command integrity across the whole corpus deeper
than the generic doc validators — mirror identity, target reachability, route-graph integrity, capability and
safety consistency, presentation ownership — and (2) actually invokes commands and scores their runtime
behavior against contract.

This packet designs and builds that benchmark **inside the deep-alignment mode**, reusing the mode's discovery,
partitioning, convergence, reducer, and severity machinery rather than standing up a parallel engine. The
design is the reconciled output of a three-model congregation (GLM-5.2, GPT-5.6-Luna, GPT-5.6-Sol) whose
load-bearing claims were verified against the repository.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- A deterministic peer adapter `sk-doc-command.cjs` selected via the existing lane-config `adapter`
  discriminator, auditing all commands on dimensions S1–S5 with P0/P1/P2 severities.
- A behavioral suite `DAB-012`–`DAB-027` extending the existing `deep-alignment/behavior_benchmark/`
  package on shared behavior-benchmark framework schema **v2** (D1–D5 rubric, terminal buckets).
- A bounded model-matrix harness (Claude baseline + `gpt-5.6-sol` + `gpt-5.6-luna-fast`, plus leaf
  sentinels) that measures executor variance only.
- An independent reference oracle and held-out fixtures so the deterministic adapter is not self-validating.
- A two-axis scorecard that never averages the deterministic P-level axis with the behavioral D-level axis.
- A new `create-benchmark` `conformance_benchmark` family that templates the conformance-package inputs
  (index, contract, lane-config, fixture-manifest) plus an authoring-command branch and a family-parity test,
  so this and future deep-alignment conformance benchmarks are authored canonically.
- A `/deep:command-benchmark` launcher that composes both axes behind one workflow-YAML router, generates the
  Codex mirror, and reuses the alignment engine and the matrix scheduler rather than duplicating either.

**Out of scope:**
- Re-running or replacing generic `validate_document.py --type command` (a separate `sk-doc` responsibility).
- A universal driver × leaf cross-product matrix.
- Remediating any command the benchmark measures as failing (that is downstream `/speckit:plan` work).
- Changing command behavior; the benchmark is observation-only.

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** A deterministic peer adapter implements the three-method deep-alignment contract
  (`discover` / `standardSource` / `check`) over the canonical command corpus, reusing
  `validate-command-references.cjs` and `sync-prompts.cjs`; it must not duplicate or reclassify generic
  command-document validation.
- **REQ-002 (P0):** The peer adapter and the generic `sk-doc` adapter must never run over the same scope in
  one alignment run (the `adapter` discriminator is not part of lane identity).
- **REQ-003 (P0):** The behavioral suite extends the existing DAB package (no new package or prefix) and
  reuses the single shared behavior-benchmark framework; new evidence and result semantics ship as framework
  schema v2 with backward-compatible v1 parsing, leaving DAB-001–011 scores unchanged.
- **REQ-004 (P1):** Fixtures are produced by an independent reference oracle with a public calibration set and
  a held-out set; the production adapter must not import or invoke the oracle, and the clean control yields
  exactly zero findings.
- **REQ-005 (P1):** The model matrix is a bounded harness that owns no scoring; alignment fan-out wiring is
  built or verified within this packet because it is not shipped today (`ACTIVE_FANOUT_LOOP_TYPES` = research,
  review only).
- **REQ-006 (P1):** The scorecard keeps two non-averaged axes — deterministic P0/P1/P2 verdict and behavioral
  D1–D5 terminal buckets — and distinguishes instrument validity from command conformance (a valid benchmark
  may publish a real FAIL subject result).
- **REQ-007 (P1):** Conformance-benchmark authoring is canonical: a `create-benchmark` `conformance_benchmark`
  family templates the package inputs, and a `/deep:command-benchmark` launcher composes both axes behind one
  workflow-YAML router reusing the shipped engines, without either owning adapter, scoring, or scheduling logic.

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All eleven children pass `validate.sh --recursive --strict` at Errors:0.
- The `conformance_benchmark` family authors conformance packages canonically, and `/deep:command-benchmark`
  composes and reports both axes without averaging, with its Codex mirror generated (not hand-authored).
- The peer adapter runs the full discovered command corpus to convergence with raw-delta and reduced-report
  agreement, and exactly matches every public and held-out fixture's expected defect set.
- DAB-012–027 are authored with pinned Claude baselines and produce quotable results; DAB-001–011 regression
  scores are unchanged.
- The bounded matrix records every required cell as a result or a predeclared skip.
- A two-axis scorecard plus remediation backlog is published and all packet status metadata reconciles.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Peer-lane collision** — mitigated by running only `sk-doc-command` over the command scope and keeping
  generic validation as a separate gate.
- **Presentation false positives** — natural-router prose is not regex-scored; static checks flag only
  explicit duplicated display blocks or exact asset leakage.
- **Runner evidence gap** — current D3 cannot prove direct MCP/script/plugin routing; the behavior-evaluator
  phase is a hard evaluator-first dependency before any command scenarios ship.
- **Matrix infrastructure and cost** — alignment fan-out is not shipped; the packet builds a thin scheduler and
  bounds the cell count.
- **Oracle circularity and topology drift** — mitigated by an independent oracle, held-out compound fixtures,
  canonical-inventory equality, and fail-closed discovery for unclassified command topologies.
- **Dependencies:** deep-alignment mode (adapters, scoping, convergence), the shared behavior-benchmark
  framework, `create-benchmark` authoring canon, and the 033 / 059-015 precedents.

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Exact GPT-5.6 registry slugs, availability, and effort names must be revalidated when the matrix phase runs.
- Whether Claude and OpenCode event streams need provider-specific normalization before direct-dispatch
  evidence is trustworthy.
- Whether legacy monolithic commands require explicit topology exceptions surfaced early by held-out fixtures.

<!-- /ANCHOR:questions -->

## PHASE DOCUMENTATION MAP

| Child | Purpose |
|-------|---------|
| `000-command-benchmark-contract` | Freeze the command census (36 baseline, 37 after the launcher ships), topology taxonomy, two-axis verdict semantics, baseline counts, conformance-package shape, evidence-path layout, ownership boundaries, and phase handoff gates. |
| `001-create-benchmark-conformance-family` | Add the canonical `create-benchmark` `conformance_benchmark` family — four templates, an authoring guide, routing projections, a `/create:benchmark` authoring branch, and a family-parity test — so conformance benchmarks are authored canonically. |
| `002-deterministic-fixtures-oracle` | Build and verify the independent public and held-out fixture corpus plus the reference oracle, instantiating the fixture manifest from the new family template, before any adapter code. |
| `003-command-contract-adapter` | Implement `sk-doc-command.cjs`, extend the reusable reference checks, and prove exact fixture outcomes without duplicating generic doc validation. |
| `004-command-lane-integration` | Register and configure the peer adapter, run all canonical commands, prove convergence, and hard-gate raw-delta / reducer agreement. |
| `005-command-behavior-evaluator` | Add shared framework schema v2 direct-dispatch, outcome-probe, setup-misbind, and boundary evidence while preserving DAB-001–011 scoring. |
| `006-command-topology-pilot` | Author four pilot scenarios, one per command topology, and capture Claude plus one GPT driver to calibrate the evaluator. |
| `007-command-scenario-rollout` | Expand to DAB-012–027, reconcile index and baseline rows, and capture a complete pinned Claude baseline. |
| `008-bounded-command-matrix` | Run both GPT drivers across all scenarios plus eligible leaf sentinels, with explicit skips and contested-cell reruns. |
| `009-command-benchmark-command` | Ship the `/deep:command-benchmark` launcher composing the conformance and behavioral axes behind one workflow-YAML router, generate the Codex mirror, and pass hermetic smoke verification. |
| `010-scorecard-and-closeout` | Run the final 37-command census, publish the two-axis scorecard and remediation backlog, add closeout gates for the new family and launcher, reconcile packet status metadata, and run recursive strict validation. |
