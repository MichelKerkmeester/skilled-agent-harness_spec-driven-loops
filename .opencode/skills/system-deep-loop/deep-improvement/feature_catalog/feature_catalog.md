---
title: "deep-improvement: Feature Catalog"
description: "Unified reference combining the evaluation loop, integration scanning, scoring, model-benchmark mode, skill-benchmark mode, and non-dev-ai-system mode surfaces that currently ship in deep-improvement."
version: 1.17.0.29
---

# deep-improvement: Feature Catalog

This document combines the current feature inventory for the `deep-improvement` system into a single reference. The root catalog acts as the system-level directory: it summarizes the evaluation loop, the integration scanner, the deterministic scoring stack, the model-benchmark mode, the skill-benchmark mode, and the non-dev-ai-system mode, then points to the per-feature files that carry the deeper implementation and validation anchors.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `deep-improvement` feature surface. The numbered sections below group the skill by runtime responsibility so readers can move from a top-level summary into per-feature reference files without losing the current code and operator-contract context behind each claim.

### Lane Legend

The skill runs four lanes through one agent. Each category and feature below is tagged with the lane it serves.

| Lane | Meaning | Entry Point |
|---|---|---|
| **Lane A** | Agent-improvement: evaluate and improve an agent markdown file via guarded promotion | `/deep:agent-improvement`, `loop-host --mode=agent-improvement` |
| **Lane B** | Model-benchmark: benchmark a model or prompt framework, no agent mutation | `/deep:model-benchmark`, `loop-host --mode=model-benchmark` |
| **Lane C** | Skill-benchmark: diagnose a skill's routing, discovery, efficiency, and usefulness, no skill mutation | `/deep:skill-benchmark`, `loop-host --mode=skill-benchmark` |
| **Lane D** | Non-dev-ai-system: benchmark an AI-system packaging and auto-refine technique docs behind guardrails; the guarded loop is packaging-owned | `/deep:ai-system-improvement`, `loop-host --mode=non-dev-ai-system-refine` |
| **Shared** | Surface used by all lanes (reducer, dashboard, profiling, command scaffolding) | reached from any lane |

| Category | Coverage | Lane | Primary Runtime Surface |
|---|---:|---|---|
| Evaluation loop | 7 features | Lane A | `.opencode/commands/deep/agent-improvement.md`, deep-improvement YAML workflows, `scripts/*.cjs` |
| Integration scanning | 3 features | Lane A | `scan-integration.cjs`, `/deep:agent-improvement`, `.opencode/agents/deep-improvement.md` |
| Scoring system | 4 features | Shared | `generate-profile.cjs`, `score-candidate.cjs`, `reduce-state.cjs` |
| Model-benchmark mode | 5 features | Lane B | `loop-host.cjs`, `dispatch-model.cjs`, `run-benchmark.cjs`, `scorer/score-model-variant.cjs` |
| Skill-benchmark mode | 6 features | Lane C | `loop-host.cjs --mode=skill-benchmark`, `scripts/skill-benchmark/*.cjs` |
| Non-dev-ai-system mode | 2 features | Lane D | `loop-host.cjs --mode=non-dev-ai-system-refine`, `<packaging-root>/benchmark/_loop/loop.py`, `scripts/non-dev-ai-system/init_packaging.py` |

---

## 2. EVALUATION LOOP

**Lane:** Lane A (agent-improvement)

These entries cover the session lifecycle from fresh runtime setup through proposal-only candidate generation, scoring dispatch, guarded promotion, rollback, and the stop logic that decides when the loop should stop asking for more iterations.

### Initialization

#### Description

Sets up a fresh packet-local deep-improvement session before any candidate work begins.

#### How It Works

The shipped workflow only supports fresh `new` sessions. Both YAML workflows create `{spec_folder}/improvement/`, scan the target integration surface, generate a dynamic profile when requested, copy the config, strategy, charter, and manifest templates, record baseline state, and emit a `session_start` journal row before iteration one.

#### Source Files

See [`01--evaluation-loop/initialization.md`](01--evaluation-loop/initialization.md) for full implementation and validation file listings.

---

### Candidate generation

#### Description

Writes one bounded packet-local candidate without mutating the canonical target.

#### How It Works

Candidate generation is delegated to the `deep-improvement` subagent. That agent must read the copied charter and manifest first, must write only under the packet-local runtime area, returns structured metadata, and stops before scoring, benchmarking, promotion, or mirror synchronization begins.

#### Source Files

See [`01--evaluation-loop/candidate-generation.md`](01--evaluation-loop/candidate-generation.md) for full implementation and validation file listings.

---

### Scoring dispatch

#### Description

Routes a generated candidate through scoring, evidence recording, and state reduction.

#### How It Works

The loop dispatches `score-candidate.cjs`, records mutation coverage, writes journal events, and refreshes the dashboard with `reduce-state.cjs`. Benchmark stability and trade-off checks are wired as concrete commands, while the benchmark runner itself still appears as an action placeholder in the YAML workflows, so fully automatic benchmark execution depends on operator wiring or wrapper logic outside the YAML text.

#### Source Files

See [`01--evaluation-loop/scoring-dispatch.md`](01--evaluation-loop/scoring-dispatch.md) for full implementation and validation file listings.

---

### Promotion gates

#### Description

Defines the narrow conditions under which a packet-local candidate can become promotion-eligible.

#### How It Works

The policy surface requires explicit approval, benchmark pass, repeatability pass, manifest compliance, and a meaningful improvement threshold. The promotion helper is stricter than the current scorer output: it still requires `candidate-better` plus `score.delta`, while `score-candidate.cjs` currently emits `candidate-acceptable` or `needs-improvement` and does not add a delta field.

#### Source Files

See [`01--evaluation-loop/promotion-gates.md`](01--evaluation-loop/promotion-gates.md) for full implementation and validation file listings.

---

### Rollback

#### Description

Restores the archived canonical target after a guarded promotion has already happened.

#### How It Works

Rollback is a separate helper, not an implicit part of promotion. The shipped rollback script validates the runtime config target and the single canonical target in the manifest, then copies the saved backup over the canonical file; journal emission, mirror review, and post-rollback re-scoring remain separate orchestration steps.

#### Source Files

See [`01--evaluation-loop/rollback.md`](01--evaluation-loop/rollback.md) for full implementation and validation file listings.

---

### Plateau detection

#### Description

Stops the loop when repeated runs no longer produce useful movement.

#### How It Works

Two stop models are live. `reduce-state.cjs` can stop when all tracked dimensions plateau with exact repeated scores across the configured plateau window, while `mutation-coverage.cjs`, `trade-off-detector.cjs`, and `benchmark-stability.cjs` separately gate convergence, trade-off analysis, and replay stability behind a minimum of three scored samples.

#### Source Files

See [`01--evaluation-loop/plateau-detection.md`](01--evaluation-loop/plateau-detection.md) for full implementation and validation file listings.

---

### Two-phase promotion and rollback

#### Description

Splits promotion into accept and ship phases and adds explicit rollback from the accepted-state backup.

#### How It Works

`promote-candidate.cjs --phase=accept` verifies gates, snapshots the canonical preimage and candidate, and leaves the canonical target unchanged. `--phase=ship` reloads the accepted-state file, verifies the target still matches the pre-acceptance hash, and writes the accepted snapshot. `rollback-candidate.cjs` restores the pre-acceptance backup, while ship failures under the default preservation policy emit `promotion_blocked_branch_preserved`.

#### Source Files

See [`01--evaluation-loop/two-phase-promotion-and-rollback.md`](01--evaluation-loop/two-phase-promotion-and-rollback.md) for full implementation and validation file listings.

---

## 3. INTEGRATION SCANNING

**Lane:** Lane A (agent-improvement)

These entries describe how deep-improvement discovers the full agent surface across the repo, evaluates runtime mirrors, and wires command-driven orchestration through the deep-improvement command and YAML workflows.

### Surface discovery

#### Description

Builds the inventory of files and references that define an agent beyond its canonical markdown file.

#### How It Works

`scan-integration.cjs` scans the canonical agent file, three runtime mirrors, improve command markdown, YAML workflow assets, skill references, global docs, and a skill-advisor path constant. That path now points at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`, so the consolidated skill-advisor surface is included in the integration map.

#### Source Files

See [`02--integration-scanning/surface-discovery.md`](02--integration-scanning/surface-discovery.md) for full implementation and validation file listings.

---

### Runtime mirrors

#### Description

Checks whether the runtime-specific mirrors still reflect the canonical agent body closely enough.

#### How It Works

Mirror parity is signal-based, not byte-for-byte. The scanner strips frontmatter, extracts up to three emphasized signal strings from the canonical body, and marks a mirror `aligned` when at least two signals appear in the mirror body. It checks `.claude/agents` and `.opencode/agents` against the canonical `.opencode/agents`.

#### Source Files

See [`02--integration-scanning/runtime-mirrors.md`](02--integration-scanning/runtime-mirrors.md) for full implementation and validation file listings.

---

### Command dispatch

#### Description

Owns the command-driven orchestration path that turns the deep-improvement skill into a runnable loop.

#### How It Works

The `/deep:agent-improvement` command collects setup inputs, selects `:auto` or `:confirm` execution, and points the operator at the matching YAML workflow. The actual loop dispatch lives in the YAML assets, which rescan integration, dispatch `@deep-improvement`, emit journal events, and call score and reducer helpers, while the command markdown explicitly says not to dispatch agents from the command file itself.

#### Source Files

See [`02--integration-scanning/command-dispatch.md`](02--integration-scanning/command-dispatch.md) for full implementation and validation file listings.

---

## 4. SCORING SYSTEM

**Lane:** Shared (Lane A scores candidates, Lane B can opt into the same 5-dim scorer)

These entries describe the dynamic scoring stack that derives evaluation structure from the target agent, applies the five-dimension rubric, records deterministic score outputs, and turns repeated runs into dimensional progress and stop-state summaries.

### Five-dimension rubric

#### Description

Defines the weighted evaluation model used to judge prompt-surface quality.

#### How It Works

Dynamic scoring uses five weighted dimensions: structural integrity, rule coherence, integration consistency, output quality, and system fitness. Each dimension has a concrete checker in `score-candidate.cjs`, with integration itself delegated to the integration scanner and output quality penalized when placeholder strings remain in the candidate.

#### Source Files

See [`03--scoring-system/five-dimension-rubric.md`](03--scoring-system/five-dimension-rubric.md) for full implementation and validation file listings.

---

### Dynamic profiling

#### Description

Generates a target-specific evaluation profile directly from the agent being scored.

#### How It Works

No static evaluation profiles ship in the current release. `generate-profile.cjs` parses frontmatter, sections, rules, output checklists, related-resource tables, and denied permissions to build a derived profile on the fly, while `target_manifest.jsonc` keeps `targets` empty and points runtime consumers at the dynamic-profile script instead of a fixed catalog.

#### Source Files

See [`03--scoring-system/dynamic-profiling.md`](03--scoring-system/dynamic-profiling.md) for full implementation and validation file listings.

---

### Deterministic scoring

#### Description

Produces the score and benchmark evidence that later gates consume.

#### How It Works

`score-candidate.cjs` always runs in `dynamic-5d` mode, regenerates the profile every run, allows optional weight overrides, and emits structured dimension details plus `candidate-acceptable` or `needs-improvement`. `run-benchmark.cjs` is also deterministic, but it still expects a profile JSON and fixture directory under `assets/agent_improvement/target-profiles`, so benchmark gating only becomes runnable when that profile-specific artifact set exists.

#### Source Files

See [`03--scoring-system/deterministic-scoring.md`](03--scoring-system/deterministic-scoring.md) for full implementation and validation file listings.

---

### Dimensional progress

#### Description

Reduces raw run records into trends, best-known state, and operator-facing stop guidance.

#### How It Works

`reduce-state.cjs` aggregates the JSONL ledger into `experiment-registry.json` and `agent-improvement-dashboard.md`, records latest and best values per dimension, adds sample-quality, journal, lineage, and mutation-coverage summaries, and computes stop status. It treats both `candidate-acceptable` and `candidate-better` as accepted candidates when building the registry.

#### Source Files

See [`03--scoring-system/dimensional-progress.md`](03--scoring-system/dimensional-progress.md) for full implementation and validation file listings.

---

## 5. MODEL-BENCHMARK MODE

**Lane:** Lane B (model-benchmark)

These entries describe the model-benchmark path that benchmarks a model or prompt framework instead of mutating an agent file. They cover the mode switch in the loop host, the model-agnostic dispatcher, the opt-in five-dimension scorer, and the record-level mode field plus the two hardening env gates.

### Mode switch

#### Description

Routes loop-host between the agent-improvement scorer and the model-benchmark materialize-then-run pipeline.

#### How It Works

`scripts/shared/loop-host.cjs` resolves `--mode` before any work begins. `--mode=agent-improvement`, or no flag, routes to `scripts/agent-improvement/score-candidate.cjs` unchanged; `--mode=model-benchmark` runs `scripts/shared/materialize-benchmark-fixtures.cjs` then `scripts/model-benchmark/run-benchmark.cjs`; and `--mode=skill-benchmark` runs `scripts/skill-benchmark/run-skill-benchmark.cjs` (Lane C). `VALID_MODES` is a closed three-value set, and an unknown mode warns to stderr and falls back to `agent-improvement`.

#### Source Files

See [`04--model-benchmark-mode/mode-switch.md`](04--model-benchmark-mode/mode-switch.md) for full implementation and validation file listings.

---

### Model dispatcher

#### Description

Model-agnostic dispatcher that routes prompts across executor CLIs only on the model-benchmark path.

#### How It Works

`scripts/model-benchmark/dispatch-model.cjs` routes through an executor map across cli-opencode, cli-claude-code, and cli-opencode, and is loaded only on the model-benchmark path, never in agent-improvement mode. It forwards `cwd` to every executor and applies rate-limit backoff using a non-busy `Atomics` sleep.

#### Source Files

See [`04--model-benchmark-mode/model-dispatcher.md`](04--model-benchmark-mode/model-dispatcher.md) for full implementation and validation file listings.

---

### Opt-in 5-dimension scorer

#### Description

Selects the pattern matcher by default or the opt-in five-dimension scorer for model-benchmark outputs.

#### How It Works

`run-benchmark.cjs --scorer pattern` is the default byte-identical heading and pattern matcher, while `--scorer 5dim` routes materialized outputs through `scripts/model-benchmark/scorer/score-model-variant.cjs`, the ported five-dimension scorer. `--grader noop` is the default deterministic grader with no model dispatch, with `--grader mock` and `--grader llm` selecting the stub or real grader, and the report carries `scoringMethod: pattern` or `scoringMethod: 5dim`.

#### Source Files

See [`04--model-benchmark-mode/opt-in-5dim-scorer.md`](04--model-benchmark-mode/opt-in-5dim-scorer.md) for full implementation and validation file listings.

---

### Mode records and hardening gates

#### Description

Stamps a mode field on every state record and exposes two env gates that harden the 5-dim scorer.

#### How It Works

Every state record carries `mode: agent-improvement` or `mode: model-benchmark`, and benchmark reports plus `benchmark_run` records carry `scoringMethod: pattern|5dim`. `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` refuses criteria-driven shell execution in the 5-dim scorer, and `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts raw grader output from the on-disk cache. Both default to the permissive value for backward-compat.

#### Source Files

See [`04--model-benchmark-mode/mode-records-and-gates.md`](04--model-benchmark-mode/mode-records-and-gates.md) for full implementation and validation file listings.

---

### Score-delta benchmark gates

#### Description

Turns benchmark reports into quality-delta evidence and blocks promotion on regressions or unreviewed hurt fixtures.

#### How It Works

`run-benchmark.cjs` compares each fixture score with its baseline and emits `outcomeScoreDelta`, `fixtureDeltas[]`, and `fixtureDeltaSummary` on both the report and `benchmark_run` ledger row. `reduce-state.cjs` summarizes helped, hurt, unchanged, and missing-baseline counts. `promote-candidate.cjs` rejects negative deltas, missing baselines without `--no-baseline-ok`, and hurt fixtures without `--allow-hurt-fixtures`.

#### Source Files

See [`04--model-benchmark-mode/score-delta-benchmark-gates.md`](04--model-benchmark-mode/score-delta-benchmark-gates.md) for full implementation and validation file listings.

---

## 6. SKILL-BENCHMARK MODE

**Lane:** Lane C (skill-benchmark)

These entries describe the skill-benchmark path that diagnoses how a *skill* is routed-to, discovered, used, and structured in practice — distinct from doc-shape validation and manual testing playbooks. It is diagnostic by default and emits a ranked Skill Benchmark Report. Mode A (router-replay) and D1-inter (advisor probe) are deterministic; D4 usefulness ablation and live trace capture are follow-on.

### Mode wiring and orchestration

#### Description

Routes loop-host to the skill-benchmark orchestrator with a single additive arm; the orchestrator runs the D5 gate, then per-scenario contamination-lint, router-replay, and scoring.

#### How It Works

`scripts/shared/loop-host.cjs` resolves `--mode=skill-benchmark` to `scripts/skill-benchmark/run-skill-benchmark.cjs` via an additive `VALID_MODES` entry, `LANE_SKILL_BENCHMARK` set, and `planInvocation` arm; the agent-improvement and model-benchmark plans stay byte-identical.

#### Source Files

See [`05--skill-benchmark/mode-wiring.md`](05--skill-benchmark/mode-wiring.md) for full implementation and validation file listings.

### Hint-free fixtures and contamination gate

#### Description

Per-skill public/private scenario fixtures keep the expected skill/intents/resources scorer-only; a contamination linter rejects public prompts that leak the answer before dispatch.

#### How It Works

`scripts/skill-benchmark/contamination-lint.cjs` builds banned vocabulary from the target skill's own identity (name, triggers, router keywords, resource path tokens) and treats any leak as a fixture failure, not a skill failure.

#### Source Files

See [`05--skill-benchmark/contamination-gate-and-fixtures.md`](05--skill-benchmark/contamination-gate-and-fixtures.md) for full implementation and validation file listings.

### Router-replay and advisor probe (Mode A)

#### Description

Replays the target skill's own router for in-skill routing and discovery, and probes the advisor out-of-band for inter-skill selection — both deterministic, no LLM.

#### How It Works

`scripts/skill-benchmark/router-replay.cjs` extracts `INTENT_SIGNALS`/`RESOURCE_MAP` from the target `SKILL.md` and reproduces the substring routing (D1-intra + D2 proxy); `scripts/skill-benchmark/advisor-probe.cjs` runs `skill_advisor.py` over the SQLite graph for the D1-inter signal.

#### Source Files

See [`05--skill-benchmark/router-replay-and-advisor-probe.md`](05--skill-benchmark/router-replay-and-advisor-probe.md) for full implementation and validation file listings.

### D5 structural connectivity hard gate

#### Description

A static scan runs before any dispatch and caps the verdict on structural failures.

#### How It Works

`scripts/skill-benchmark/d5-connectivity.cjs` flags dead routed paths, dead intent keys, path escapes, orphan references, and an unparseable router; any P0 sets `gateFailed` and caps the verdict to `BLOCKED-BY-STRUCTURE`.

#### Source Files

See [`05--skill-benchmark/d5-connectivity-gate.md`](05--skill-benchmark/d5-connectivity-gate.md) for full implementation and validation file listings.

### D1-D5 scoring and funnel

#### Description

Computes the five dimensions with a funnel whose largest single-stage drop is the headline bottleneck; the aggregate normalizes over the dimensions actually measured.

#### How It Works

`scripts/skill-benchmark/score-skill-benchmark.cjs` scores D1 inter+intra, D2 discovery, D3 efficiency, D5 connectivity, and reports D4 usefulness as `unscored` until live mode; the weights are hardcoded in the scorer, and `assets/skill_benchmark/default_profile.json` documents them but is a reference asset that is not consumed at runtime.

#### Source Files

See [`05--skill-benchmark/scoring-and-funnel.md`](05--skill-benchmark/scoring-and-funnel.md) for full implementation and validation file listings.

### Dual report and remediation taxonomy

#### Description

Emits a machine report plus a human report rendered from it (anti-drift), with ranked bottlenecks mapped to concrete remediations and hand-off lanes.

#### How It Works

`scripts/skill-benchmark/build-report.cjs` renders `skill-benchmark-report.md` FROM `skill-benchmark-report.json` (anti-drift). `assets/skill_benchmark/remediation_taxonomy.json` documents how each finding class maps to a target file, locus, one-line fix, and hand-off lane; it is a reference asset (exercised by its own test) and is not yet imported by the report code.

#### Source Files

See [`05--skill-benchmark/dual-report-and-remediation.md`](05--skill-benchmark/dual-report-and-remediation.md) for full implementation and validation file listings.

---

## 7. NON-DEV-AI-SYSTEM MODE

**Lane:** Lane D (non-dev-ai-system)

This entry describes the guarded packaging refine path: benchmark an AI-system packaging (one prompt system shipped as CLI runtime, claude.ai Project and native skill), re-grade outputs with an independent different-family grader, and auto-refine technique docs behind a frozen scoring surface with kill-switches. The loop logic is packaging-owned by design; the skill ships the contract, the onboarding kit, and the loop-host adapter.

### Guarded packaging refine loop

#### Description

Runs the packaging-owned 7-phase guarded loop (preflight gates, N-sample benchmark, gap analysis, worktree, held-out baseline, propose, guarded promote-N) with dry-run as the default and independent-grade optimization as the only target.

#### How It Works

`scripts/shared/loop-host.cjs` resolves `--mode=non-dev-ai-system-refine` to `scripts/non-dev-ai-system/run-non-dev-ai-system.cjs`, a thin adapter that spawns `<packaging-root>/benchmark/_loop/loop.py`. The frozen scoring surface (`benchmark/_gates/gates.py`), executable derivation (`benchmark/_gates/derive.py`), independent grader and red-team gauntlet live with the packaging. New packagings onboard via `scripts/non-dev-ai-system/init_packaging.py` rendering `assets/non_dev_ai_system/templates/` from one `packaging_config.json`, never by copy-editing a sibling; `derive_source_root` selects whether `src_relpath` values resolve under `knowledge base`, `skill/references`, or another packaging source root.

#### Source Files

See [`06--non-dev-ai-system/guarded-refine-loop.md`](06--non-dev-ai-system/guarded-refine-loop.md) for full implementation and validation file listings.

### Self-target packaging profile

#### Description

Defines a runtime/ Lane D self-target profile and command-level `--self-target` guard.

#### How It Works

`deep-loop-runtime.json` freezes scorer and harness surfaces, allows only selected technique-doc paths, and excludes runtime/ loop/scoring/merge/diagnostic session prefixes. The schema recognizes the self-target fields, `loop_contract.md` documents the allow-list invariant, and `/deep:ai-system-improvement --self-target <profile>` validates the profile before compiling to the existing `non-dev-ai-system-refine` adapter invocation.

#### Source Files

See [`06--non-dev-ai-system/self-target-packaging-profile.md`](06--non-dev-ai-system/self-target-packaging-profile.md) for full implementation and validation file listings.
